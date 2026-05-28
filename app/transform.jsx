// transform.jsx — Maps Claude API JSON output → window.MAGNET shape

(function () {

  function domainToName(url) {
    let s = (url || '').replace(/^https?:\/\//i, '').replace(/\/$/, '').replace(/^www\./i, '');
    const host = s.split('/')[0];
    // Drop TLD parts; keep meaningful word segments
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

  function buildAudit(d, brandName, inputs) {
    const comp = d.positioning?.competitor_analysis || [];
    const split = d.budget_split || [];
    const queries = d.search_trends?.top_queries || [];
    const sym = inputs.currencySymbol || '£';
    const budget = parseFloat(String(inputs.budget || 0).replace(/[^0-9.]/g, '')) || 0;
    const pos = d.positioning?.our_recommended_position || '';
    const ms = d.market_research?.market_size || '';
    const opp = d.market_research?.opportunity || '';
    const trends = d.market_research?.key_trends || [];
    const shifts = d.market_research?.consumer_shifts || [];

    return [
      {
        title: "Brand & positioning",
        meta: "Recommended territory · " + ((d.creative_territory?.brand_voice || []).slice(0, 2).join(', ') || 'Differentiated'),
        body: pos || `${brandName} has a clear opportunity to establish a distinct and defensible position in the ${inputs.industry} market.`,
        bullets: trends.slice(0, 4).map(t => t.split('.')[0].trim() + '.')
      },
      {
        title: "Market opportunity",
        meta: inputs.industry,
        body: ms + (opp ? ' ' + opp : ''),
        bullets: shifts.slice(0, 4).map(s => s.split('.')[0].trim() + '.')
      },
      {
        title: "Competitive landscape",
        meta: comp.length + ' competitor' + (comp.length !== 1 ? 's' : '') + ' analysed',
        body: comp.length
          ? `${brandName} competes with ${comp.slice(0, 3).map(c => c.name).join(', ')}${comp.length > 3 ? ' and others' : ''}. Key gaps and opportunities are identifiable across positioning, messaging, and digital presence.`
          : `${brandName} operates in a competitive ${inputs.industry} environment with room to differentiate through positioning and digital investment.`,
        bullets: comp.slice(0, 5).map(c => `${c.name}: ${(c.weakness || c.position || '').split('.')[0].trim()}.`)
      },
      {
        title: "Search & content landscape",
        meta: queries.length + ' key search themes identified',
        body: d.search_trends?.strategic_implication || `Search behaviour in the ${inputs.industry} space reveals clear intent clusters that can be captured through targeted content and paid media.`,
        bullets: (d.search_trends?.emerging_topics || []).slice(0, 5).map(t => 'Rising topic: ' + t)
      },
      {
        title: "Budget & channel mix",
        meta: sym + Number(budget).toLocaleString() + ' across ' + split.length + ' channels',
        body: split.length
          ? `Recommended allocation across ${split.map(b => b.channel).join(', ')} based on ${inputs.industry} benchmarks and intent signals.`
          : `A balanced media mix across paid, owned, and earned channels is recommended to maximise reach and drive qualified leads.`,
        bullets: split.slice(0, 5).map(b => `${b.channel}: ${b.pct}% — ${(b.rationale || '').split('.')[0].trim()}.`)
      }
    ];
  }

  function buildMarketStats(d) {
    return [
      { label: "Market size",      value: "See below",  caption: d.market_research?.market_size?.split('.')[0] || "Annual market value" },
      { label: "Annual growth",    value: "—",          caption: "Year-on-year trend (see market context)" },
      { label: "Avg. order value", value: "—",          caption: "Per customer transaction (varies by segment)" },
      { label: "Decision cycle",   value: "—",          caption: (d.search_trends?.seasonal_peaks || [])[0]?.split('.')[0] || "Consideration to purchase" }
    ];
  }

  function buildMarketTrends(d) {
    const trends = d.market_research?.key_trends || [];
    const shifts = d.market_research?.consumer_shifts || [];
    const eyebrows = ["Demand", "Behaviour", "Consumer shift", "Risk"];
    const all = [...trends.slice(0, 2), ...shifts.slice(0, 2)];
    return all.slice(0, 4).map((t, i) => ({
      eyebrow: eyebrows[i] || "Trend",
      title: t.split(':')[0].split('—')[0].replace(/^\d+\.\s*/, '').trim().substring(0, 60),
      body: t
    }));
  }

  function buildCompetitorDots(compAnals, brandName) {
    const positions = [
      { x: 0.78, y: 0.62 }, { x: 0.35, y: 0.48 }, { x: 0.18, y: 0.82 },
      { x: 0.88, y: 0.33 }, { x: 0.28, y: 0.68 }, { x: 0.55, y: 0.75 }
    ];
    const dots = compAnals.slice(0, 6).map((c, i) => ({
      name: c.name,
      x: positions[i]?.x ?? 0.3 + (i * 0.12),
      y: positions[i]?.y ?? 0.3 + (i * 0.1),
      traffic: '—', da: 48 + (i * 3), ig: '—',
      positioning: (c.position || '').substring(0, 80),
      price: guessPriceTier(c.name, c.position || ''),
      note: (c.strength || c.position || '').split('.')[0].trim() + '.'
    }));
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
    const comp = d.positioning?.competitor_analysis || [];
    const trends = d.market_research?.key_trends || [];
    const opp = d.market_research?.opportunity || '';
    const emerging = d.search_trends?.emerging_topics || [];
    const voice = d.creative_territory?.brand_voice || [];

    return {
      strengths: [
        pos.split('.')[0].trim() + '.',
        voice.length ? 'Clear brand voice: ' + voice.slice(0, 3).join(', ') + '.' : 'Differentiated product or service offering.',
        'Opportunity to own underserved positioning in the market.',
        opp.split('.')[0].trim() + '.'
      ].filter(Boolean).slice(0, 4),
      weaknesses: [
        comp.length ? 'Competitive pressure from ' + comp.slice(0, 2).map(c => c.name).join(' and ') + '.' : 'Competitive market requires sustained investment.',
        'Digital presence and search visibility need investment to compete.',
        'Email and lifecycle marketing not yet fully utilised.',
        'Content production at scale requires team and process investment.'
      ],
      opportunities: [
        opp.split('.')[0].trim() + '.',
        trends.length ? trends[0].split('.')[0].trim() + '.' : 'Growing search volume in category presents organic opportunity.',
        emerging.length ? 'Emerging topics: ' + emerging.slice(0, 2).join(' and ') + ' represent rising search opportunities.' : 'Content-led SEO can deliver compounding returns.',
        'Lifecycle email from zero is a high-ROI quick win.'
      ].filter(Boolean).slice(0, 4),
      threats: [
        comp.length ? comp[0].name + ': ' + (comp[0].strength || 'well-established competitor').split('.')[0].trim() + '.' : 'Established competitors with larger budgets.',
        comp.length > 1 ? comp[1].name + ': ' + (comp[1].strength || 'growing market presence').split('.')[0].trim() + '.' : 'New entrants with digital-native advantages.',
        'Macro headwinds may affect consumer confidence and spending.',
        'Third-party cookie deprecation will impact retargeting and attribution.'
      ].slice(0, 4)
    };
  }

  function buildStrategy(d, brand, budget, sym) {
    const segs = d.audience_segments || [];
    const split = d.budget_split || [];
    const comp = d.positioning?.competitor_analysis || [];

    const channels = split.slice(0, 7).map((b, i) => ({
      name: b.channel,
      effort: 3 + (i % 4),
      impact: Math.min(9, 4 + Math.round(b.pct / 10)),
      stage: guessStage(b.channel),
      note: (b.rationale || '').split('.')[0].trim() + '.'
    }));

    return {
      northStar: {
        metric: guessNorthStar(brand.industry),
        current: null,
        target: null,
        deltaCap: 'Set baseline in month 1; target +30% by month 6'
      },
      goals: [
        {
          eyebrow: 'PRIMARY',
          title: 'Establish market position and generate qualified leads',
          body: (d.market_research?.opportunity || 'Build a steady pipeline of qualified leads from owned and paid channels.').split('.').slice(0, 2).join('.') + '.',
          tags: ['Revenue', 'Lead-gen']
        },
        {
          eyebrow: 'BRAND',
          title: 'Build brand awareness and consideration',
          body: 'Grow recognition among target audiences through content, social media, and strategic media placements. Close the consideration gap vs. key competitors.',
          tags: ['Awareness']
        },
        {
          eyebrow: 'EFFICIENCY',
          title: 'Drive down cost-per-acquisition to target',
          body: 'Optimise channel mix to reduce blended CAC over the first 90 days through data-driven reallocation and CRO. Every channel earns its budget.',
          tags: ['Efficiency']
        },
        {
          eyebrow: 'RETENTION',
          title: 'Build lifecycle programme to increase CLV',
          body: 'Implement post-purchase email flows and retention sequences. Increase customer lifetime value and generate referrals from satisfied customers.',
          tags: ['Retention', 'CLV']
        }
      ],
      positioning: {
        statement: d.positioning?.our_recommended_position || '',
        pillars: buildPillars(d),
        voice: (d.creative_territory?.brand_voice || ['Confident', 'Clear', 'Credible', 'Human']).join('. ') + '.'
      },
      audience: {
        icp: segs.length
          ? segs[0].description || ('Primary: ' + segs[0].name + '. ' + (d.market_research?.opportunity || '').split('.')[0] + '.')
          : 'Target customer in ' + brand.industry + ' seeking quality and value.',
        segments: segs.map(s => ({ name: s.name, pct: s.size_pct }))
      },
      channels: channels.length ? channels : defaultChannels(),
      timeline: buildTimeline()
    };
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
    const voice = d.creative_territory?.brand_voice || ['Quality', 'Trust', 'Expertise', 'Innovation'];
    const msgs = d.creative_territory?.key_messages || [];
    const icons = ['star', 'shield', 'zap', 'users'];
    return voice.slice(0, 4).map((v, i) => ({
      title: String(v).charAt(0).toUpperCase() + String(v).slice(1),
      body: msgs[i] ? (msgs[i].message || '').split('.')[0].trim() + '.' : v + ' is core to everything we do.',
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

  function buildTimeline() {
    return [
      {
        stream: 'Foundations', sub: 'Tracking & data',
        d30: { kind: 'blue',  label: 'Audit + tag plan' },
        d60: { kind: 'blue',  label: 'Server-side tracking live' },
        d90: { kind: 'blue',  label: 'Attribution model set' }
      },
      {
        stream: 'Demand capture', sub: 'Bottom of funnel',
        d30: { kind: 'blue',  label: 'Paid search live' },
        d60: { kind: 'navy',  label: 'CRO test 1 launched' },
        d90: { kind: 'navy',  label: 'Conversion rate optimised' }
      },
      {
        stream: 'Demand creation', sub: 'Top of funnel',
        d30: { kind: 'ghost', label: 'Content strategy signed off' },
        d60: { kind: 'navy',  label: 'First content cluster live' },
        d90: { kind: 'orange', label: 'Social pilot — first 90 days' }
      },
      {
        stream: 'Lifecycle & CRM', sub: 'Nurture + retention',
        d30: { kind: 'ghost', label: 'Welcome flow built' },
        d60: { kind: 'navy',  label: 'Lead nurture sequence live' },
        d90: { kind: 'orange', label: 'Retention programme launched' }
      }
    ];
  }

  function buildTactics(d, brand, budget, sym) {
    const queries = d.search_trends?.top_queries || [];
    const emerging = d.search_trends?.emerging_topics || [];
    const split = d.budget_split || [];
    const comp = d.positioning?.competitor_analysis || [];

    // Content clusters
    const contentClusters = [];
    if (queries.length >= 2) {
      contentClusters.push({
        hub: ('How to ' + (queries[0]?.query || 'choose ' + brand.industry).replace(/^how to /i, '')),
        spokes: queries.slice(1, 5).map(q => q.query).filter(Boolean),
        volume: '—', difficulty: 40
      });
    }
    if (emerging.length >= 2) {
      contentClusters.push({
        hub: emerging[0] || (brand.industry + ' trends 2026'),
        spokes: emerging.slice(1, 5),
        volume: '—', difficulty: 35
      });
    }
    contentClusters.push({
      hub: brand.name + ' vs competitors: which is right for you?',
      spokes: comp.slice(0, 4).map(c => brand.name + ' vs ' + c.name),
      volume: '—', difficulty: 32
    });
    contentClusters.push({
      hub: 'Budget & value: getting the most from your ' + brand.industry + ' investment',
      spokes: ['True cost breakdown', 'Where to save vs splurge', 'ROI calculator', "What's included vs. charged extra"],
      volume: '—', difficulty: 38
    });

    // Paid
    const paid = split.slice(0, 5).map(b => ({
      platform: b.channel,
      structure: (b.rationale || '').split('.')[0].trim() || b.pct + '% of budget',
      budgetPct: b.pct,
      sample: 'Target high-intent audiences with compelling creative — ' + sym + Number(b.amount).toLocaleString() + ' allocated.',
      target: b.pct + '% of budget (' + sym + Number(b.amount).toLocaleString() + ')'
    }));

    // Organic
    const hasPinterest = split.some(b => /pinterest/i.test(b.channel));
    const hasYouTube   = split.some(b => /youtube|video/i.test(b.channel));
    const hasLinkedIn  = split.some(b => /linkedin/i.test(b.channel));
    const organic = [
      { platform: 'Instagram / Meta',  cadence: '4 posts + 2 Reels / wk',   format: 'Mix of product, lifestyle, UGC', note: 'Reels outperform static 4×.' },
      { platform: 'TikTok',            cadence: '3 posts / wk (pilot)',      format: 'Short educational + lo-fi BTS', note: 'Validate creative before scaling.' }
    ];
    if (hasPinterest) organic.push({ platform: 'Pinterest', cadence: '15 pins / wk', format: 'Carousel + Idea Pins', note: 'High-intent discovery channel.' });
    if (hasYouTube)   organic.push({ platform: 'YouTube',  cadence: '1 long-form / 2wk + 2 Shorts / wk', format: 'Educational / buyer guide series', note: 'SEO + retargeting pixel.' });
    if (hasLinkedIn)  organic.push({ platform: 'LinkedIn', cadence: '3 posts / wk', format: 'Thought leadership + case studies', note: 'B2B audience reach.' });

    // Email
    const email = [
      { name: 'Welcome & onboarding',   trigger: 'Lead capture / sign-up',        emails: 4, window: '0–14 days', goal: 'First conversion', note: 'Introduce brand, set expectations, drive to first action.' },
      { name: 'Lead nurture',           trigger: 'Not converted after 7 days',     emails: 3, window: '7–30 days', goal: 'Return to site', note: 'Educational content to move from consideration to intent.' },
      { name: 'Post-purchase follow-up', trigger: 'Purchase completed',            emails: 3, window: '7–30 days post', goal: 'Review + referral', note: 'Drive reviews and word-of-mouth from happy customers.' },
      { name: 'Win-back',               trigger: 'Inactive 90+ days',             emails: 2, window: '90–120 days', goal: 'Re-engage', note: 'Low cost, high ROI reactivation of dormant leads.' }
    ];

    // SEO
    const seo = {
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
    const cro = [
      { hypothesis: 'Simplifying the enquiry form to 3 fields will lift conversion rate', ice: 9, area: 'TOFU' },
      { hypothesis: 'Adding social proof (reviews, testimonials) above the fold will improve trust and conversion', ice: 8, area: 'All' },
      { hypothesis: 'Personalised CTAs per audience segment will outperform generic CTAs', ice: 7, area: 'MOFU' },
      { hypothesis: "A/B test CTA copy: 'Get started' vs 'Book a free consultation'", ice: 7, area: 'BOFU' },
      { hypothesis: 'Exit-intent overlay with lead magnet will capture emails before bounce', ice: 6, area: 'TOFU' }
    ];

    // Partnerships
    const partnerships = comp.slice(0, 2).map(c => ({
      name: 'Positioning against ' + c.name,
      body: (c.weakness || '').split('.')[0].trim() + '. This creates an opening for ' + brand.name + ' to own the positioning they leave vacant.'
    }));
    partnerships.push({
      name: 'Creator & content partnerships',
      body: 'Partner with relevant industry voices and content creators to build credibility and reach new audiences who already trust those voices.'
    });

    // Stack
    const stack = [
      { tool: 'GA4 + Looker Studio',     purpose: 'Analytics + reporting',     status: 'Implement' },
      { tool: 'Server-side GTM',          purpose: 'Tracking durability',        status: 'Build Q1' },
      { tool: 'Klaviyo / Customer.io',    purpose: 'Email lifecycle',            status: 'Evaluate' },
      { tool: 'Segment / RudderStack',    purpose: 'CDP',                        status: 'Q2 priority' },
      { tool: 'VWO / Optimizely',         purpose: 'CRO testing',               status: 'Pilot' },
      { tool: 'Northbeam / Triple Whale', purpose: 'Multi-touch attribution',    status: 'Evaluate' }
    ];

    return { contentClusters: contentClusters.slice(0, 4), paid, organic, email, seo, cro, partnerships, stack };
  }

  function buildMeasurement(d, brand, budget, sym) {
    const rough = Math.round(budget / 8 * 1000);
    const reachLabel = rough >= 1000000 ? (rough / 1000000).toFixed(1) + 'M' : rough >= 1000 ? (rough / 1000).toFixed(0) + 'k' : String(rough);

    const kpis = [
      { label: 'Qualified leads / month',    value: '—', delta: 'Target +30%',    target: 'Set baseline in month 1',          up: true },
      { label: 'Blended CAC',                value: '—', delta: 'Target −15%',    target: 'vs month-1 baseline',              up: false, good: true },
      { label: 'Email-attributed revenue',   value: sym + '0', delta: 'new',      target: 'Build to ' + sym + Math.round(budget * 0.03).toLocaleString() + '/mo', up: true },
      { label: 'Organic traffic / month',    value: '—', delta: 'Target +25%',    target: 'vs today',                         up: true },
      { label: 'Paid ROAS',                  value: '—', delta: 'Target 4:1+',    target: 'Per channel',                      up: true },
      { label: 'Social engagement rate',     value: '—', delta: 'Target 3%+',     target: 'Avg. across channels',             up: true },
      { label: 'Site conversion rate',       value: '—', delta: 'Target +0.5 pts', target: 'From CRO programme',              up: true },
      { label: 'Email open rate',            value: '—', delta: 'Target 35%+',    target: 'Industry benchmark',               up: true }
    ];

    const funnel = [
      { stage: 'Reach',      count: reachLabel, caption: 'Monthly people exposed',        channel: 'TOFU — Social, SEO, PR',      color: 'blue' },
      { stage: 'Engaged',    count: '—',        caption: 'Video watches, saves, scrolls', channel: 'Mid-funnel signals',           color: 'blue' },
      { stage: 'Sessions',   count: '—',        caption: 'On-site visits (all channels)', channel: 'All channels',                 color: 'blue' },
      { stage: 'Leads',      count: '—',        caption: 'Identified contacts captured',  channel: 'MOFU — Email + paid',         color: 'blue' },
      { stage: 'Qualified',  count: '—',        caption: 'MQL → SQL handoff',             channel: 'BOFU',                        color: 'orange' },
      { stage: 'Proposals',  count: '—',        caption: 'Quotes / proposals issued',     channel: 'Sales hand-off',              color: 'orange' },
      { stage: 'Customers',  count: '—',        caption: 'Deals closed / orders placed',  channel: 'Revenue',                     color: 'orange' }
    ];

    return {
      kpis,
      funnel,
      attribution: 'Multi-touch (data-driven) as primary; first-touch + last-non-direct as secondary perspectives. UTM convention from day 1: utm_source / utm_medium / utm_campaign / utm_content.',
      reporting: [
        { cadence: 'Daily',     who: 'Channel leads',      focus: 'Pacing, spend rate, anomalies.' },
        { cadence: 'Weekly',    who: 'Marketing team',     focus: 'Channel performance vs target, test status, creative performance.' },
        { cadence: 'Monthly',   who: 'Leadership',         focus: 'North-star metric, CAC, brand trend, pipeline.' },
        { cadence: 'Quarterly', who: 'Board / client',     focus: 'Strategic milestones, budget reforecast, risk register.' }
      ],
      risks: [
        { signal: 'Paid CAC rises >20% vs baseline for 2 weeks',        action: 'Pause weakest ad set; reallocate to top performer' },
        { signal: 'Organic traffic drops >15% month-on-month',          action: 'Audit for crawl issues, algorithm update, or content gaps' },
        { signal: 'Email open rate falls below 20%',                    action: 'Audit list hygiene; test subject lines; check deliverability' },
        { signal: 'Site conversion rate drops >0.3 pts month-on-month', action: 'Review CRO test results; check for speed regression' }
      ]
    };
  }

  window.transformToMagnet = function (d, inputs) {
    const competitors = Array.isArray(inputs.competitors)
      ? inputs.competitors
      : String(inputs.competitors || '').split(',').map(s => s.trim()).filter(Boolean);

    const budget = parseFloat(String(inputs.budget || 0).replace(/[^0-9.]/g, '')) || 0;
    const sym    = inputs.currencySymbol || '£';
    const name   = domainToName(inputs.url || '');

    const brand = {
      name,
      url:         (inputs.url || '').replace(/^https?:\/\//i, '').replace(/\/$/, ''),
      industry:    inputs.industry || '',
      competitors,
      budget,
      tagline:     d.creative_territory?.campaign_thought || ''
    };

    const augInputs = { ...inputs, currencySymbol: sym, budget };

    return {
      brand,
      diagnosis: {
        summary:     splitInto3(d.company_summary || ''),
        audit:       buildAudit(d, name, augInputs),
        market: {
          stats:       buildMarketStats(d),
          trends:      buildMarketTrends(d),
          regulatory:  (d.market_research?.opportunity || '')
        },
        competitors: buildCompetitorDots(d.positioning?.competitor_analysis || [], name),
        swot:        buildSwot(d, name, competitors)
      },
      strategy:    buildStrategy(d, brand, budget, sym),
      tactics:     buildTactics(d, brand, budget, sym),
      measurement: buildMeasurement(d, brand, budget, sym)
    };
  };

})();
