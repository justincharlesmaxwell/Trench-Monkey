// Dependency-free test for transformToMagnet.
// Run: node app/transform.test.js
//
// transform.jsx is browser code that assigns window.transformToMagnet inside an
// IIFE. We load it in a vm sandbox that provides a fake `window`, then exercise
// the mapping with both a full Claude response and an empty one (fallbacks).

const fs = require('fs');
const vm = require('vm');
const path = require('path');
const assert = require('assert');

const src = fs.readFileSync(path.join(__dirname, 'transform.jsx'), 'utf8');
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: 'transform.jsx' });
const transform = sandbox.window.transformToMagnet;
assert.strictEqual(typeof transform, 'function', 'transformToMagnet should be exported on window');

let passed = 0;
function check(label, fn) {
  fn();
  passed++;
  console.log('  ok -', label);
}

// ── Full response: AI fields should flow straight through ──────────────────────
const d = {
  company_summary: 'One. Two. Three. Four. Five.',
  market_research: {
    market_size: 'Big market. Growing fast.',
    key_trends: ['t1.', 't2.', 't3.', 't4.', 't5.'],
    consumer_shifts: ['s1.', 's2.', 's3.', 's4.'],
    opportunity: 'Opp one. Opp two.'
  },
  market_metrics: { market_size_value: '£4.8B', annual_growth: '+6.2%', avg_order_value: '£8,500', decision_cycle: '8-14 weeks' },
  audience_segments: [
    { name: 'Seg A', size_pct: 40, description: 'a1. a2. a3.' },
    { name: 'Seg B', size_pct: 30, description: 'b.' },
    { name: 'Seg C', size_pct: 20, description: 'c.' },
    { name: 'Seg D', size_pct: 10, description: 'd.' }
  ],
  personas: [{ initials: 'AB', name: 'Alpha', role: 'Primary · 40%', is_primary: true, age: '30-40', income: '£50k', stage: 'Researching', quote: 'Q', jtbd: 'J', pains: 'P', channels: ['x', 'y'] }],
  positioning: {
    our_recommended_position: 'Own the middle. Defensible.',
    competitor_analysis: [{ name: 'Comp1', position: 'p', strength: 's', weakness: 'w', price_tier: 'Premium+', digital_strength: 8, est_monthly_traffic: '120k', domain_authority: 60, social_following: '85k IG' }]
  },
  north_star: { metric: 'Leads / month', current: 100, target: 300, rationale: 'Because it matters.' },
  goals: [{ type: 'PRIMARY', title: 'g1', body: 'b', tags: ['Revenue'] }],
  funnel_strategy: { tofu: 'T', mofu: 'M', bofu: 'B' },
  creative_territory: { campaign_thought: 'Big idea', brand_voice: ['Bold', 'Clear'], key_messages: [{ segment: 'Seg A', message: 'm. n.' }] },
  search_trends: { top_queries: [{ query: 'q1', direction: 'rising', insight: 'i' }], seasonal_peaks: ['peak one.'], emerging_topics: ['e1', 'e2'], strategic_implication: 'si' },
  budget_split: [
    { channel: 'Paid Search', pct: 60, amount: 60000, sub: 'Brand + commercial', stage: ['BOFU'], rationale: 'r1. r2.' },
    { channel: 'SEO', pct: 40, amount: 40000, sub: 'Organic', stage: ['TOFU'], rationale: 'r.' }
  ],
  roadmap: [{ stream: 'Foundations', sub: 'Data', d30: 'a', d60: 'b', d90: 'c' }],
  content_clusters: [{ hub: 'Hub1', spokes: ['s1', 's2'], search_volume: '12k/mo', difficulty: 38 }],
  organic_social: [{ platform: 'IG', cadence: '4/wk', format: 'f', note: 'n' }],
  email_flows: [{ name: 'Welcome', trigger: 'signup', emails: 4, window: '0-14d', goal: 'g', note: 'n' }],
  seo: { on_page: ['o1'], technical: ['t1'], off_page: ['f1'] },
  cro_hypotheses: [{ hypothesis: 'h', ice: 9, area: 'TOFU' }],
  partnerships: [{ name: 'P1', body: 'b' }],
  tools: [{ tool: 'GA4', purpose: 'analytics', status: 'Implement' }],
  kpis: [
    { label: 'CAC', baseline: '100', target: '80', delta: '-20%', direction: 'down-good' },
    { label: 'Leads', baseline: '40', target: '120', delta: '+200%', direction: 'up' }
  ],
  funnel: [
    { stage: 'Reach', monthly_estimate: '180k', caption: 'c', channel: 'ch', tone: 'blue' },
    { stage: 'Customers', monthly_estimate: '500', caption: 'c', channel: 'rev', tone: 'orange' }
  ],
  attribution_model: 'MTA',
  reporting_cadence: [{ cadence: 'Daily', who: 'w', focus: 'f' }],
  early_warnings: [{ signal: 'sig', action: 'act' }]
};
const inputs = { url: 'https://www.acme.co.uk/', industry: 'SaaS', competitors: 'Comp1, Comp2', budget: '100000', currencySymbol: '£' };

console.log('Full response:');
const m = transform(d, inputs);

check('brand name derived from URL', () => assert.strictEqual(m.brand.name, 'Acme'));
check('summary split into 3', () => assert.strictEqual(m.diagnosis.summary.length, 3));
check('audit has 5 cards', () => assert.strictEqual(m.diagnosis.audit.length, 5));
check('market stat uses AI headline', () => assert.strictEqual(m.diagnosis.market.stats[0].value, '£4.8B'));
check('market growth no longer a dash', () => assert.strictEqual(m.diagnosis.market.stats[1].value, '+6.2%'));
check('competitor dot maps tier/strength/traffic', () => {
  const c0 = m.diagnosis.competitors[0];
  assert.strictEqual(c0.x, 0.8);     // digital_strength 8 / 10
  assert.strictEqual(c0.y, 0.84);    // Premium+
  assert.strictEqual(c0.traffic, '120k');
  assert.strictEqual(c0.da, 60);
  assert.strictEqual(c0.ig, '85k IG');
});
check('last competitor dot is self', () => assert.strictEqual(m.diagnosis.competitors[m.diagnosis.competitors.length - 1].isSelf, true));
check('north star numbers + delta', () => {
  assert.strictEqual(m.strategy.northStar.target, 300);
  assert.strictEqual(m.strategy.northStar.current, 100);
  assert.ok(/\+200%/.test(m.strategy.northStar.deltaCap), 'deltaCap should compute +200%');
  assert.strictEqual(m.strategy.northStar.rationale, 'Because it matters.');
});
check('persona mapped with stats', () => {
  assert.strictEqual(m.strategy.personas[0].name, 'Alpha');
  assert.strictEqual(m.strategy.personas[0].stats.length, 3);
  assert.strictEqual(m.strategy.personas[0].isPrimary, true);
});
check('funnel strategy passthrough', () => assert.strictEqual(m.strategy.funnelStrategy.tofu, 'T'));
check('roadmap mapped', () => assert.strictEqual(m.strategy.timeline[0].d30.label, 'a'));
check('allocations from budget split with colour + stage', () => {
  assert.strictEqual(m.tactics.allocations.length, 2);
  assert.deepStrictEqual(m.tactics.allocations[0].stage, ['BOFU']);
  assert.strictEqual(m.tactics.allocations[0].pct, 60);
  assert.ok(/^#/.test(m.tactics.allocations[0].color), 'colour should be a hex');
});
check('content cluster volume passthrough', () => assert.strictEqual(m.tactics.contentClusters[0].volume, '12k/mo'));
check('email flow passthrough', () => assert.strictEqual(m.tactics.email[0].name, 'Welcome'));
check('seo passthrough', () => assert.strictEqual(m.tactics.seo.onPage[0], 'o1'));
check('kpi down-good flagged good', () => {
  assert.strictEqual(m.measurement.kpis[0].value, '80');
  assert.strictEqual(m.measurement.kpis[0].good, true);
  assert.strictEqual(m.measurement.kpis[1].good, undefined);
  assert.strictEqual(m.measurement.kpis[1].up, true);
});
check('funnel counts + tone passthrough', () => {
  assert.strictEqual(m.measurement.funnel[0].count, '180k');
  assert.strictEqual(m.measurement.funnel[0].color, 'blue');
  assert.strictEqual(m.measurement.funnel[1].color, 'orange');
});
check('attribution passthrough', () => assert.strictEqual(m.measurement.attribution, 'MTA'));

// ── Empty response: fallbacks must still produce a complete, render-safe report ─
console.log('Empty response (fallbacks):');
const e = transform({}, { url: 'shop.example.com', industry: 'Retail', competitors: '', budget: '80000', currencySymbol: '$' });

check('no throw + summary present', () => assert.strictEqual(e.diagnosis.summary.length, 3));
check('audit still 5 cards', () => assert.strictEqual(e.diagnosis.audit.length, 5));
check('default allocations provided', () => assert.ok(e.tactics.allocations.length >= 5));
check('kpis fallback provided', () => assert.ok(e.measurement.kpis.length >= 6));
check('funnel fallback counts are numeric, never a dash', () => {
  e.measurement.funnel.forEach(r => {
    assert.notStrictEqual(r.count, '—', 'fallback funnel should never render a dash');
    const n = parseFloat(String(r.count).replace(/[^0-9.]/g, ''));
    assert.ok(!isNaN(n), 'fallback funnel count should be parseable: ' + r.count);
  });
});
check('north star has a metric', () => assert.ok(e.strategy.northStar.metric.length > 0));

console.log('\nAll ' + passed + ' checks passed.');
