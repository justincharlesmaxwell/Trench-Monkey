// transform.jsx — Maps Claude API JSON output → window.MAGNET shape
// Every section prefers AI-generated fields and falls back to a heuristic
// derived from the core data when a field is missing, so a partial response
// still renders a complete report.

(function () {

  // ── small helpers ──────────────────────────────────────────────────────────
  const arr = (x) => (Array.isArray(x) ? x : []);
  const str = (x) => (x == null ? '' : String(x));
  const firstSentence = (s) => str(s).split('.')[0].trim() + (str(s) ? '.' : '');

  function num(x) {
    if (typeof x === 'number') return x;
    const n = parseFloat(str(x).replace(/[^0-9.\-]/g, ''));
    return isNaN(n) ? null : n;
  }

  function fmtNum(n) {
    if (n == null || isNaN(n)) return '—';
    return n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(0) + 'k' : String(Math.round(n));
  }

  function initialsOf(name) {
    return str(name).split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '··';
  }

  function domainToName(url) {
    let s = (url || '').replace(/^https?:\/\//i, '').replace(/\/$/, '').replace(/^www\./i, '');
    const host = s.split('/')[0];
    const segments = host.split('.');
    const base = segments.find(p => p.length > 3 && !/^(com|net|org|co|uk|us|au|io|app)$/.test(p)) || segments[0] || host;
    return base.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function splitInto3(text) {
    if (!text) return ['No summary available.', '', ''];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    if (sentences.length <= 2) return [sentences[0]?.trim() || text, sentences[1]?.trim() || '', ''].filter((s, i) => i === 0 || s);
    const third = Math.ceil(sentences.length / 3);
    return [
      sentences.slice(0, third).join(' ').trim(),
      sentences.slice(third, third * 2).join(' ').trim(),
      sentences.slice(third * 2).join(' ').trim()
    ];
  }

  // ── DIAGNOSIS ────────────────────────────────────────────────────────────────
  function buildAudit(d, brandName, inputs) {
    const comp = arr(d.positioning?.competitor_analysis);
    const split = arr(d.budget_split);
    const queries = arr(d.search_trends?.top_queries);
    const sym = inputs.currencySymbol || '£';
    const budget = num(inputs.budget) || 0;
    const pos = d.positioning?.our_recommended_position || '';
    const ms = d.market_research?.market_size || '';
    const opp = d.market_research?.opportunity || '';
    const trends = arr(d.market_research?.key_trends);
    const shifts = arr(d.market_research?.consumer_shifts);

    return [
      {
        title: "Brand & positioning",
        meta: "Recommended territory · " + (arr(d.creative_territory?.brand_voice).slice(0, 2).join(', ') || 'Differentiated'),
        body: pos || `${brandName} has a clear opportunity to establish a distinct and defensible position in the ${inputs.industry} market.`,
        bullets: trends.slice(0, 4).map(t => firstSentence(t))
      },
      {
        title: "Market opportunity",
        meta: inputs.industry,
        body: ms + (opp ? ' ' + opp : ''),
        bullets: shifts.slice(0, 4).map(s => firstSentence(s))
      },
      {
        title: "Competitive landscape",
        meta: comp.length + ' competitor' + (comp.length !== 1 ? 's' : '') + ' analysed',
        body: comp.length
          ? `${brandName} competes with ${comp.slice(0, 3).map(c => c.name).join(', ')}${comp.length > 3 ? ' and others' : ''}. Key gaps and opportunities are identifiable across positioning, messaging, and digital presence.`
          : `${brandName} operates in a competitive ${inputs.industry} environment with room to differentiate through positioning and digital investment.`,
        bullets: comp.slice(0, 5).map(c => `${c.name}: ${firstSentence(c.weakness || c.position || '')}`)
      },
      {
        title: "Search & content landscape",
        meta: queries.length + ' key search themes identified',
        body: d.search_trends?.strategic_implication || `Search behaviour in the ${inputs.industry} space reveals clear intent clusters that can be captured through targeted content and paid media.`,
        bullets: arr(d.search_trends?.emerging_topics).slice(0, 5).map(t => 'Rising topic: ' + t)
      },
      {
        title: "Budget & channel mix",
        meta: sym + Number(budget).toLocaleString() + ' across ' + split.length + ' channels',
        body: split.length
          ? `Recommended allocation across ${split.map(b => b.channel).join(', ')} based on ${inputs.industry} benchmarks and intent signals.`
          : `A balanced media mix across paid, owned, and earned channels is recommended to maximise reach and drive qualified leads.`,
        bullets: split.slice(0, 5).map(b => `${b.channel}: ${b.pct}% — ${firstSentence(b.rationale || '')}`)
      }
    ];
  }

  function buildMarketStats(d) {
    const m = d.market_metrics || {};
    const ms = d.market_research?.market_size || '';
    const peaks = arr(d.search_trends?.seasonal_peaks);
    return [
      { label: "Market size",      value: m.market_size_value || (firstSentence(ms) || "See below"), caption: "Annual category value" },
      { label: "Annual growth",    value: m.annual_growth     || "—", caption: "Year-on-year trend" },
      { label: "Avg. order value", value: m.avg_order_value   || "—", caption: "Per customer transaction" },
      { label: "Decision cycle",   value: m.decision_cycle    || "—", caption: firstSentence(peaks[0]) || "Consideration to purchase" }
    ];
  }

  function buildMarketTrends(d) {
    const trends = arr(d.market_research?.key_trends);
    const shifts = arr(d.market_research?.consumer_shifts);
    const eyebrows = ["Demand", "Behaviour", "Consumer shift", "Risk"];
    const all = [...trends.slice(0, 2), ...shifts.slice(0, 2)];
    return all.slice(0, 4).map((t, i) => ({
      eyebrow: eyebrows[i] || "Trend",
      title: t.split(':')[0].split('—')[0].replace(/^\d+\.\s*/, '').trim().substring(0, 60),
      body: t
    }));
  }

  function priceTierToY(tier) {
    const t = str(tier).toLowerCase();
    if (/premium|luxury|bespoke|high.?end/.test(t)) return 0.84;
    if (/value|budget|low.?cost|affordable/.test(t)) return 0.20;
    if (/trade|wholesale|b2b/.test(t)) return 0.38;
    return 0.52;
  }

  function buildCompetitorDots(compAnals, brandName) {
    const fallbackPos = [
      { x: 0.78, y: 0.62 }, { x: 0.35, y: 0.48 }, { x: 0.18, y: 0.82 },
      { x: 0.88, y: 0.33 }, { x: 0.28, y: 0.68 }, { x: 0.55, y: 0.75 }
    ];
    const dots = compAnals.slice(0, 6).map((c, i) => {
      const ds = num(c.digital_strength);
      return {
        name: c.name,
        x: ds != null ? Math.min(0.95, Math.max(0.08, ds / 10)) : (fallbackPos[i]?.x ?? 0.3 + (i * 0.12)),
        y: c.price_tier ? priceTierToY(c.price_tier) : (fallbackPos[i]?.y ?? 0.3 + (i * 0.1)),
        traffic: c.est_monthly_traffic || '—',
        da: num(c.domain_authority) != null ? num(c.domain_authority) : 48 + (i * 3),
        ig: c.social_following || '—',
        positioning: str(c.position).substring(0, 80),
        price: c.price_tier || guessPriceTier(c.name, c.position || ''),
        note: firstSentence(c.strength || c.position || '')
      };
    });
    dots.push({
      name: brandName, x: 0.62, y: 0.46, isSelf: true,
      traffic: '—', da: 50, ig: '—',
      positioning: 'Your current position',
      price: 'Mid-market',
      note: 'You are here. Differentiate through positioning and digital investment.'
    });
    return dots;
  }

  function guessPriceTier(name, pos) {
    const s = (name + ' ' + pos).toLowerCase();
    if (/premium|luxury|bespoke|high.end/.test(s)) return 'Premium+';
    if (/value|budget|low.cost|affordable/.test(s)) return 'Value';
    if (/trade|wholesale|b2b/.test(s)) return 'Trade';
    return 'Mid-market';
  }

  function buildSwot(d, brandName, competitors) {
    const pos = d.positioning?.our_recommended_position || '';
    const comp = arr(d.positioning?.competitor_analysis);
    const trends = arr(d.market_research?.key_trends);
    const opp = d.market_research?.opportunity || '';
    const emerging = arr(d.search_trends?.emerging_topics);
    const voice = arr(d.creative_territory?.brand_voice);

    return {
      strengths: [
        firstSentence(pos),
        voice.length ? 'Clear brand voice: ' + voice.slice(0, 3).join(', ') + '.' : 'Differentiated product or service offering.',
        'Opportunity to own underserved positioning in the market.',
        firstSentence(opp)
      ].filter(Boolean).slice(0, 4),
      weaknesses: [
        comp.length ? 'Competitive pressure from ' + comp.slice(0, 2).map(c => c.name).join(' and ') + '.' : 'Competitive market requires sustained investment.',
        'Digital presence and search visibility need investment to compete.',
        'Email and lifecycle marketing not yet fully utilised.',
        'Content production at scale requires team and process investment.'
      ],
      opportunities: [
        firstSentence(opp),
        trends.length ? firstSentence(trends[0]) : 'Growing search volume in category presents organic opportunity.',
        emerging.length ? 'Emerging topics: ' + emerging.slice(0, 2).join(' and ') + ' represent rising search opportunities.' : 'Content-led SEO can deliver compounding returns.',
        'Lifecycle email from zero is a high-ROI quick win.'
      ].filter(Boolean).slice(0, 4),
      threats: [
        comp.length ? comp[0].name + ': ' + firstSentence(comp[0].strength || 'well-established competitor') : 'Established competitors with larger budgets.',
        comp.length > 1 ? comp[1].name + ': ' + firstSentence(comp[1].strength || 'growing market presence') : 'New entrants with digital-native advantages.',
        'Macro headwinds may affect consumer confidence and spending.',
        'Third-party cookie deprecation will impact retargeting and attribution.'
      ].slice(0, 4)
    };
  }

  // ── STRATEGY ──────────────────────────────────────────────────────────────────
  function mapPersonas(d, segs) {
    const ps = arr(d.personas);
    if (ps.length) {
      return ps.slice(0, 3).map((p, i) => ({
        initials: p.initials || initialsOf(p.name),
        name: p.name || ('Persona ' + (i + 1)),
        role: p.role || (['Primary', 'Secondary', 'Tertiary'][i] + ' segment'),
        isPrimary: p.is_primary != null ? !!p.is_primary : i === 0,
        stats: [
          p.age    ? { label: 'Age',    value: p.age }    : null,
          p.income ? { label: 'Income', value: p.income } : null,
          p.stage  ? { label: 'Stage',  value: p.stage }  : null
        ].filter(Boolean),
        quote: p.quote || '',
        jtbd: p.jtbd || '',
        pains: p.pains || '',
        channels: arr(p.channels)
      }));
    }
    // Fallback: derive lightweight personas from the audience segments
    const ranks = ['Primary', 'Secondary', 'Tertiary'];
    return segs.slice(0, 3).map((s, i) => {
      const sentences = str(s.description).match(/[^.!?]+[.!?]+/g) || [str(s.description)];
      return {
        initials: initialsOf(s.name),
        name: s.name || ('Segment ' + (i + 1)),
        role: ranks[i] + ' · ' + (s.size_pct || 0) + '% of audience',
        isPrimary: i === 0,
        stats: [{ label: 'Share', value: (s.size_pct || 0) + '%' }],
        quote: '',
        jtbd: sentences.slice(0, 2).join(' ').trim(),
        pains: sentences.slice(2, 4).join(' ').trim(),
        channels: []
      };
    });
  }

  function buildStrategy(d, brand, budget, sym) {
    const segs = arr(d.audience_segments);
    const split = arr(d.budget_split);

    const channels = split.slice(0, 7).map((b, i) => ({
      name: b.channel,
      effort: 3 + (i % 4),
      impact: Math.min(9, 4 + Math.round((b.pct || 0) / 10)),
      stage: (Array.isArray(b.stage) && b.stage.length) ? b.stage.join(' + ') : guessStage(b.channel),
      note: firstSentence(b.rationale || '')
    }));

    // North star
    const ns = d.north_star || {};
    const current = num(ns.current);
    const target = num(ns.target);
    const deltaCap = (current != null && target != null && current > 0)
      ? `+${Math.round(((target - current) / current) * 100)}% target by month 6`
      : 'Set baseline in month 1; target by month 6';

    return {
      northStar: {
        metric: ns.metric || guessNorthStar(brand.industry),
        current: current,
        target: target,
        deltaCap,
        rationale: ns.rationale || 'This metric sits closest to revenue and is the strongest predictor of sustainable growth. Every other metric in this plan ladders up to it — when it climbs, the strategy is working.'
      },
      goals: mapGoals(d),
      funnelStrategy: {
        tofu: d.funnel_strategy?.tofu || 'Top-of-funnel channels build awareness with target audiences through content and social.',
        mofu: d.funnel_strategy?.mofu || 'Mid-funnel nurtures consideration through retargeting, email, and buyer-guide content.',
        bofu: d.funnel_strategy?.bofu || 'Bottom-funnel captures high-intent demand via search and on-site CRO — the biggest near-term lever.'
      },
      positioning: {
        statement: d.positioning?.our_recommended_position || '',
        pillars: buildPillars(d),
        voice: (arr(d.creative_territory?.brand_voice).length ? d.creative_territory.brand_voice : ['Confident', 'Clear', 'Credible', 'Human']).join('. ') + '.'
      },
      audience: {
        icp: segs.length
          ? (segs[0].description || ('Primary: ' + segs[0].name + '. ' + firstSentence(d.market_research?.opportunity || '')))
          : 'Target customer in ' + brand.industry + ' seeking quality and value.',
        segments: segs.map(s => ({ name: s.name, pct: s.size_pct }))
      },
      personas: mapPersonas(d, segs),
      channels: channels.length ? channels : defaultChannels(),
      timeline: mapRoadmap(d)
    };
  }

  function mapGoals(d) {
    const gs = arr(d.goals);
    if (gs.length) {
      return gs.slice(0, 4).map(g => ({
        eyebrow: g.type || 'GOAL',
        title: g.title || '',
        body: g.body || '',
        tags: arr(g.tags)
      }));
    }
    return [
      { eyebrow: 'PRIMARY', title: 'Establish market position and generate qualified leads', body: firstSentence(d.market_research?.opportunity || 'Build a steady pipeline of qualified leads from owned and paid channels.'), tags: ['Revenue', 'Lead-gen'] },
      { eyebrow: 'BRAND', title: 'Build brand awareness and consideration', body: 'Grow recognition among target audiences through content, social media, and strategic media placements.', tags: ['Awareness'] },
      { eyebrow: 'EFFICIENCY', title: 'Drive down cost-per-acquisition to target', body: 'Optimise channel mix to reduce blended CAC over the first 90 days through data-driven reallocation and CRO.', tags: ['Efficiency'] },
      { eyebrow: 'RETENTION', title: 'Build lifecycle programme to increase CLV', body: 'Implement post-purchase email flows and retention sequences to increase customer lifetime value and referrals.', tags: ['Retention', 'CLV'] }
    ];
  }

  function guessNorthStar(industry) {
    const i = (industry || '').toLowerCase();
    if (/saas|software|tech|app/.test(i)) return 'Monthly qualified trial starts';
    if (/ecommerce|retail|shop|fashion/.test(i)) return 'Revenue from digital channels';
    if (/kitchen|home|interior|furniture|reno/.test(i)) return 'Showroom consultations / month';
    if (/finance|fintech|insurance|wealth/.test(i)) return 'Qualified leads / month';
    if (/health|wellness|fitness|clinic/.test(i)) return 'New patient / member acquisitions';
    if (/food|restaurant|hospitality/.test(i)) return 'Table bookings / online orders per month';
    return 'Qualified leads per month';
  }

  function guessStage(channel) {
    const c = (channel || '').toLowerCase();
    if (/seo|organic|content|blog/.test(c)) return 'TOFU';
    if (/paid search|google|ppc|search/.test(c)) return 'BOFU';
    if (/email|lifecycle|crm|nurture/.test(c)) return 'MOFU';
    if (/youtube|video|long.form/.test(c)) return 'TOFU + MOFU';
    if (/social|instagram|tiktok|facebook|meta|twitter|linkedin/.test(c)) return 'TOFU + MOFU';
    if (/display|programmatic|ooh/.test(c)) return 'TOFU';
    if (/affiliate|partner/.test(c)) return 'BOFU';
    return 'MOFU';
  }

  function buildPillars(d) {
    const voice = arr(d.creative_territory?.brand_voice).length ? d.creative_territory.brand_voice : ['Quality', 'Trust', 'Expertise', 'Innovation'];
    const msgs = arr(d.creative_territory?.key_messages);
    const icons = ['star', 'shield', 'zap', 'users'];
    return voice.slice(0, 4).map((v, i) => ({
      title: String(v).charAt(0).toUpperCase() + String(v).slice(1),
      body: msgs[i] ? firstSentence(msgs[i].message || '') : v + ' is core to everything we do.',
      icon: icons[i]
    }));
  }

  function defaultChannels() {
    return [
      { name: 'SEO & Content', effort: 4, impact: 8, stage: 'TOFU', note: 'Long-term compounding organic asset.' },
      { name: 'Paid Search',   effort: 5, impact: 7, stage: 'BOFU', note: 'Capture high-intent demand at the bottom of funnel.' },
      { name: 'Paid Social',   effort: 5, impact: 6, stage: 'TOFU + MOFU', note: 'Awareness + retargeting to warm audiences.' },
      { name: 'Email lifecycle', effort: 3, impact: 8, stage: 'MOFU', note: 'Highest ROI owned channel; build from day one.' },
      { name: 'Organic Social', effort: 4, impact: 5, stage: 'TOFU', note: 'Community building and brand personality.' }
    ];
  }

  const ROADMAP_KINDS = ['blue', 'navy', 'orange'];
  function mapRoadmap(d) {
    const rm = arr(d.roadmap);
    if (rm.length) {
      return rm.slice(0, 4).map(s => ({
        stream: s.stream || '',
        sub: s.sub || '',
        d30: { kind: 'blue',   label: s.d30 || '' },
        d60: { kind: 'navy',   label: s.d60 || '' },
        d90: { kind: 'orange', label: s.d90 || '' }
      }));
    }
    return buildTimeline();
  }

  function buildTimeline() {
    return [
      { stream: 'Foundations', sub: 'Tracking & data', d30: { kind: 'blue', label: 'Audit + tag plan' }, d60: { kind: 'blue', label: 'Server-side tracking live' }, d90: { kind: 'blue', label: 'Attribution model set' } },
      { stream: 'Demand capture', sub: 'Bottom of funnel', d30: { kind: 'blue', label: 'Paid search live' }, d60: { kind: 'navy', label: 'CRO test 1 launched' }, d90: { kind: 'navy', label: 'Conversion rate optimised' } },
      { stream: 'Demand creation', sub: 'Top of funnel', d30: { kind: 'ghost', label: 'Content strategy signed off' }, d60: { kind: 'navy', label: 'First content cluster live' }, d90: { kind: 'orange', label: 'Social pilot — first 90 days' } },
      { stream: 'Lifecycle & CRM', sub: 'Nurture + retention', d30: { kind: 'ghost', label: 'Welcome flow built' }, d60: { kind: 'navy', label: 'Lead nurture sequence live' }, d90: { kind: 'orange', label: 'Retention programme launched' } }
    ];
  }

  // ── TACTICS ──────────────────────────────────────────────────────────────────
  const ALLOC_PALETTE = ['#17a8f1', '#094cb2', '#ff9614', '#ec4d8e', '#cc3333', '#1e9e5b', '#9b6dff', '#0f1523', '#d8dce5'];

  function buildAllocations(split) {
    if (!split.length) {
      return [
        { id: 'a0', name: 'Paid Search',  sub: 'High-intent demand',   pct: 24, color: ALLOC_PALETTE[0], stage: ['BOFU'] },
        { id: 'a1', name: 'SEO & Content', sub: 'Compounding organic',  pct: 18, color: ALLOC_PALETTE[1], stage: ['TOFU'] },
        { id: 'a2', name: 'Paid Social',   sub: 'Reach + retargeting',  pct: 20, color: ALLOC_PALETTE[2], stage: ['TOFU', 'MOFU'] },
        { id: 'a3', name: 'Email & CRM',   sub: 'Lifecycle',            pct: 12, color: ALLOC_PALETTE[3], stage: ['MOFU', 'Retention'] },
        { id: 'a4', name: 'Brand',         sub: 'Always-on awareness',  pct: 14, color: ALLOC_PALETTE[4], stage: ['TOFU'] },
        { id: 'a5', name: 'Test reserve',  sub: 'Experimentation',      pct: 12, color: ALLOC_PALETTE[5], stage: ['Reserve'] }
      ];
    }
    return split.slice(0, 9).map((b, i) => ({
      id: 'a' + i,
      name: b.channel || ('Channel ' + (i + 1)),
      sub: b.sub || '',
      pct: num(b.pct) || 0,
      color: ALLOC_PALETTE[i % ALLOC_PALETTE.length],
      stage: (Array.isArray(b.stage) && b.stage.length) ? b.stage : [guessStage(b.channel)]
    }));
  }

  function buildTactics(d, brand, budget, sym) {
    const queries = arr(d.search_trends?.top_queries);
    const emerging = arr(d.search_trends?.emerging_topics);
    const split = arr(d.budget_split);
    const comp = arr(d.positioning?.competitor_analysis);

    // Content clusters
    let contentClusters = arr(d.content_clusters).slice(0, 4).map(c => ({
      hub: c.hub || '',
      spokes: arr(c.spokes),
      volume: c.search_volume || '—',
      difficulty: num(c.difficulty) != null ? num(c.difficulty) : 40
    }));
    if (!contentClusters.length) {
      contentClusters = [];
      if (queries.length >= 2) {
        contentClusters.push({ hub: 'How to ' + (queries[0]?.query || 'choose ' + brand.industry).replace(/^how to /i, ''), spokes: queries.slice(1, 5).map(q => q.query).filter(Boolean), volume: '—', difficulty: 40 });
      }
      if (emerging.length >= 2) {
        contentClusters.push({ hub: emerging[0] || (brand.industry + ' trends 2026'), spokes: emerging.slice(1, 5), volume: '—', difficulty: 35 });
      }
      contentClusters.push({ hub: brand.name + ' vs competitors: which is right for you?', spokes: comp.slice(0, 4).map(c => brand.name + ' vs ' + c.name), volume: '—', difficulty: 32 });
      contentClusters.push({ hub: 'Budget & value: getting the most from your ' + brand.industry + ' investment', spokes: ['True cost breakdown', 'Where to save vs splurge', 'ROI calculator', "What's included vs. charged extra"], volume: '—', difficulty: 38 });
      contentClusters = contentClusters.slice(0, 4);
    }

    // Paid (built from the real budget split)
    const paid = split.slice(0, 5).map(b => ({
      platform: b.channel,
      structure: firstSentence(b.rationale || '') || (b.pct + '% of budget'),
      budgetPct: b.pct,
      sample: b.sub ? (b.sub + ' — ' + sym + Number(b.amount || 0).toLocaleString() + ' allocated.') : ('Target high-intent audiences with compelling creative — ' + sym + Number(b.amount || 0).toLocaleString() + ' allocated.'),
      target: b.pct + '% of budget (' + sym + Number(b.amount || 0).toLocaleString() + ')'
    }));

    // Organic
    let organic = arr(d.organic_social).slice(0, 4).map(o => ({
      platform: o.platform || '',
      cadence: o.cadence || '',
      format: o.format || '',
      note: o.note || ''
    }));
    if (!organic.length) {
      organic = [
        { platform: 'Instagram / Meta', cadence: '4 posts + 2 Reels / wk', format: 'Mix of product, lifestyle, UGC', note: 'Reels outperform static 4×.' },
        { platform: 'TikTok', cadence: '3 posts / wk (pilot)', format: 'Short educational + lo-fi BTS', note: 'Validate creative before scaling.' }
      ];
    }

    // Email
    let email = arr(d.email_flows).slice(0, 4).map(e => ({
      name: e.name || '',
      trigger: e.trigger || '',
      emails: num(e.emails) || e.emails || '—',
      window: e.window || '',
      goal: e.goal || '',
      note: e.note || ''
    }));
    if (!email.length) {
      email = [
        { name: 'Welcome & onboarding', trigger: 'Lead capture / sign-up', emails: 4, window: '0–14 days', goal: 'First conversion', note: 'Introduce brand, set expectations, drive to first action.' },
        { name: 'Lead nurture', trigger: 'Not converted after 7 days', emails: 3, window: '7–30 days', goal: 'Return to site', note: 'Educational content to move from consideration to intent.' },
        { name: 'Post-purchase follow-up', trigger: 'Purchase completed', emails: 3, window: '7–30 days post', goal: 'Review + referral', note: 'Drive reviews and word-of-mouth from happy customers.' },
        { name: 'Win-back', trigger: 'Inactive 90+ days', emails: 2, window: '90–120 days', goal: 'Re-engage', note: 'Low cost, high ROI reactivation of dormant leads.' }
      ];
    }

    // SEO
    const seo = (d.seo && (arr(d.seo.on_page).length || arr(d.seo.technical).length || arr(d.seo.off_page).length))
      ? { onPage: arr(d.seo.on_page), technical: arr(d.seo.technical), offPage: arr(d.seo.off_page) }
      : {
          onPage: [
            'Target key search terms: ' + queries.slice(0, 3).map(q => '"' + q.query + '"').join(', '),
            'Add FAQ schema to key landing pages',
            'Ensure mobile Core Web Vitals pass (target LCP < 2.5s)'
          ],
          technical: [
            'Implement server-side tagging for tracking resilience',
            'Fix crawl errors and improve internal link structure',
            'Implement local-business or product schema where applicable'
          ],
          offPage: [
            'Create a "' + brand.industry + ' report" or data asset to earn backlinks via digital PR',
            'Build creator partnerships with editorial backlink mentions in content'
          ]
        };

    // CRO
    let cro = arr(d.cro_hypotheses).slice(0, 6).map(c => ({
      hypothesis: c.hypothesis || '',
      ice: num(c.ice) != null ? num(c.ice) : 6,
      area: c.area || 'All'
    }));
    if (!cro.length) {
      cro = [
        { hypothesis: 'Simplifying the enquiry form to 3 fields will lift conversion rate', ice: 9, area: 'TOFU' },
        { hypothesis: 'Adding social proof (reviews, testimonials) above the fold will improve trust and conversion', ice: 8, area: 'All' },
        { hypothesis: 'Personalised CTAs per audience segment will outperform generic CTAs', ice: 7, area: 'MOFU' },
        { hypothesis: "A/B test CTA copy: 'Get started' vs 'Book a free consultation'", ice: 7, area: 'BOFU' },
        { hypothesis: 'Exit-intent overlay with lead magnet will capture emails before bounce', ice: 6, area: 'TOFU' }
      ];
    }

    // Partnerships
    let partnerships = arr(d.partnerships).slice(0, 3).map(p => ({ name: p.name || '', body: p.body || '' }));
    if (!partnerships.length) {
      partnerships = comp.slice(0, 2).map(c => ({
        name: 'Positioning against ' + c.name,
        body: firstSentence(c.weakness || '') + ' This creates an opening for ' + brand.name + ' to own the positioning they leave vacant.'
      }));
      partnerships.push({ name: 'Creator & content partnerships', body: 'Partner with relevant industry voices and content creators to build credibility and reach new audiences who already trust those voices.' });
    }

    // Stack
    let stack = arr(d.tools).slice(0, 6).map(t => ({ tool: t.tool || '', purpose: t.purpose || '', status: t.status || '' }));
    if (!stack.length) {
      stack = [
        { tool: 'GA4 + Looker Studio', purpose: 'Analytics + reporting', status: 'Implement' },
        { tool: 'Server-side GTM', purpose: 'Tracking durability', status: 'Build Q1' },
        { tool: 'Klaviyo / Customer.io', purpose: 'Email lifecycle', status: 'Evaluate' },
        { tool: 'Segment / RudderStack', purpose: 'CDP', status: 'Q2 priority' },
        { tool: 'VWO / Optimizely', purpose: 'CRO testing', status: 'Pilot' },
        { tool: 'Northbeam / Triple Whale', purpose: 'Multi-touch attribution', status: 'Evaluate' }
      ];
    }

    return {
      contentClusters,
      paid,
      organic,
      email,
      seo,
      cro,
      partnerships,
      stack,
      allocations: buildAllocations(split)
    };
  }

  // ── MEASUREMENT ──────────────────────────────────────────────────────────────
  function mapKpis(d, sym, budget) {
    const ks = arr(d.kpis);
    if (ks.length) {
      return ks.slice(0, 8).map(k => {
        const dir = str(k.direction).toLowerCase();
        return {
          label: k.label || '',
          value: k.target != null ? String(k.target) : '—',
          delta: k.delta || '',
          target: (k.baseline != null && str(k.baseline) && str(k.baseline).toLowerCase() !== 'new') ? ('from ' + k.baseline + ' baseline') : 'new — set baseline in month 1',
          up: dir !== 'down',
          good: dir === 'down-good' ? true : (dir === 'down' ? false : undefined)
        };
      });
    }
    return [
      { label: 'Qualified leads / month', value: '—', delta: 'Target +30%', target: 'Set baseline in month 1', up: true },
      { label: 'Blended CAC', value: '—', delta: 'Target −15%', target: 'vs month-1 baseline', up: false, good: true },
      { label: 'Email-attributed revenue', value: sym + '0', delta: 'new', target: 'Build to ' + sym + Math.round(budget * 0.03).toLocaleString() + '/mo', up: true },
      { label: 'Organic traffic / month', value: '—', delta: 'Target +25%', target: 'vs today', up: true },
      { label: 'Paid ROAS', value: '—', delta: 'Target 4:1+', target: 'Per channel', up: true },
      { label: 'Site conversion rate', value: '—', delta: 'Target +0.5 pts', target: 'From CRO programme', up: true }
    ];
  }

  function mapFunnel(d, budget) {
    const fs = arr(d.funnel);
    if (fs.length) {
      return fs.slice(0, 7).map(r => ({
        stage: r.stage || '',
        count: r.monthly_estimate != null && str(r.monthly_estimate) ? str(r.monthly_estimate) : '—',
        caption: r.caption || '',
        channel: r.channel || '',
        color: r.tone === 'orange' ? 'orange' : 'blue'
      }));
    }
    // Numeric fallback so the funnel-width math always resolves
    const reach = Math.round(budget / 8 * 1000) || 100000;
    const seq = [1, 0.18, 0.09, 0.025, 0.008, 0.004, 0.0025];
    const labels = [
      ['Reach', 'Monthly people exposed', 'TOFU — Social, SEO, PR', 'blue'],
      ['Engaged', 'Video watches, saves, scrolls', 'Mid-funnel signals', 'blue'],
      ['Sessions', 'On-site visits (all channels)', 'All channels', 'blue'],
      ['Leads', 'Identified contacts captured', 'MOFU — Email + paid', 'blue'],
      ['Qualified', 'MQL → SQL handoff', 'BOFU', 'orange'],
      ['Proposals', 'Quotes / proposals issued', 'Sales hand-off', 'orange'],
      ['Customers', 'Deals closed / orders placed', 'Revenue', 'orange']
    ];
    return labels.map((l, i) => ({ stage: l[0], count: fmtNum(Math.round(reach * seq[i])), caption: l[1], channel: l[2], color: l[3] }));
  }

  function buildMeasurement(d, brand, budget, sym) {
    const reporting = arr(d.reporting_cadence).length
      ? d.reporting_cadence.slice(0, 4).map(r => ({ cadence: r.cadence || '', who: r.who || '', focus: r.focus || '' }))
      : [
          { cadence: 'Daily', who: 'Channel leads', focus: 'Pacing, spend rate, anomalies.' },
          { cadence: 'Weekly', who: 'Marketing team', focus: 'Channel performance vs target, test status, creative performance.' },
          { cadence: 'Monthly', who: 'Leadership', focus: 'North-star metric, CAC, brand trend, pipeline.' },
          { cadence: 'Quarterly', who: 'Board / client', focus: 'Strategic milestones, budget reforecast, risk register.' }
        ];

    const risks = arr(d.early_warnings).length
      ? d.early_warnings.slice(0, 4).map(r => ({ signal: r.signal || '', action: r.action || '' }))
      : [
          { signal: 'Paid CAC rises >20% vs baseline for 2 weeks', action: 'Pause weakest ad set; reallocate to top performer' },
          { signal: 'Organic traffic drops >15% month-on-month', action: 'Audit for crawl issues, algorithm update, or content gaps' },
          { signal: 'Email open rate falls below 20%', action: 'Audit list hygiene; test subject lines; check deliverability' },
          { signal: 'Site conversion rate drops >0.3 pts month-on-month', action: 'Review CRO test results; check for speed regression' }
        ];

    return {
      kpis: mapKpis(d, sym, budget),
      funnel: mapFunnel(d, budget),
      attribution: d.attribution_model || 'Multi-touch (data-driven) as primary; first-touch + last-non-direct as secondary perspectives. UTM convention from day 1: utm_source / utm_medium / utm_campaign / utm_content.',
      reporting,
      risks
    };
  }

  // ── ROOT ─────────────────────────────────────────────────────────────────────
  window.transformToMagnet = function (d, inputs) {
    d = d || {};
    const competitors = Array.isArray(inputs.competitors)
      ? inputs.competitors
      : String(inputs.competitors || '').split(',').map(s => s.trim()).filter(Boolean);

    const budget = num(inputs.budget) || 0;
    const sym = inputs.currencySymbol || '£';
    const name = domainToName(inputs.url || '');

    const brand = {
      name,
      url: (inputs.url || '').replace(/^https?:\/\//i, '').replace(/\/$/, ''),
      industry: inputs.industry || '',
      competitors,
      budget,
      tagline: d.creative_territory?.campaign_thought || ''
    };

    const augInputs = { ...inputs, currencySymbol: sym, budget };

    return {
      brand,
      diagnosis: {
        summary: splitInto3(d.company_summary || ''),
        audit: buildAudit(d, name, augInputs),
        market: {
          stats: buildMarketStats(d),
          trends: buildMarketTrends(d),
          regulatory: (d.market_research?.opportunity || '')
        },
        competitors: buildCompetitorDots(arr(d.positioning?.competitor_analysis), name),
        swot: buildSwot(d, name, competitors)
      },
      strategy: buildStrategy(d, brand, budget, sym),
      tactics: buildTactics(d, brand, budget, sym),
      measurement: buildMeasurement(d, brand, budget, sym)
    };
  };

})();
