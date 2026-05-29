// data.jsx — Magnet Kitchens demo data + app config defaults.
// DEMO_MAGNET: full example report used when startScreen === 'report'.
// TWEAKS: default tweaks-panel config (was previously inlined in index.html).

export const TWEAKS = {
  navLayout: 'sidebar',
  showBrowserChrome: false,
  startScreen: 'input',
};

export const DEMO_MAGNET = {
  brand: {
    name: "Magnet Kitchens",
    url: "magnet.co.uk",
    industry: "Home improvement · Fitted kitchens",
    competitors: ["Wren Kitchens", "Howdens", "IKEA", "B&Q", "Wickes"],
    budget: 150000, // £/month
    tagline: "Made in Britain since 1918"
  },

  // ===== PHASE 1: DIAGNOSIS =====
  diagnosis: {
    summary: [
      "Strong heritage brand (since 1918), 200+ UK showrooms, vertically integrated manufacturing in Darlington.",
      "Trails Wren Kitchens on digital share-of-voice by a wide margin — Wren owns the search funnel from inspiration to consult booking.",
      "Mid-premium positioning is defensible but currently under-monetised against Howdens (trade) and Wren (digital DTC)."
    ],
    audit: [
      {
        title: "Brand positioning",
        meta: "Mid-premium · Heritage-led",
        body: "Magnet positions on 'British craftsmanship since 1918' with a strong showroom-led sales motion. The website leads with 'made in Britain' and a £1,000 trade-in offer. Tone is warm-traditional, not aspirational; aimed at families investing in a 10-year purchase. The positioning is clear but feels increasingly conservative against Wren's design-forward digital experience.",
        bullets: [
          "Hero proposition: design service + finance + installation, one provider.",
          "Three sub-brands: Magnet, Magnet Trade, Magnet Bedrooms — fragmented.",
          "Pricing tier sits between Howdens (trade) and Tom Howley (premium).",
          "No clear 'why Magnet vs Wren' line on key landing pages."
        ]
      },
      {
        title: "Website performance",
        meta: "PageSpeed 41 mobile · Core Web Vitals: poor",
        body: "Magnet.co.uk loads slower than every direct competitor on mobile (LCP 4.2s vs Wren's 2.1s). The brochure-request flow is the primary conversion path but is buried two clicks deep from the homepage. Showroom booking surfaces well in local SERPs but the booking widget itself bounces 38% before completion.",
        bullets: [
          "LCP 4.2s mobile (target: <2.5s).",
          "Brochure download form: 6 required fields — likely high abandon.",
          "Inventory pages lack price ranges, hurting commercial-intent SEO.",
          "Mobile menu hides the showroom finder behind two taps."
        ]
      },
      {
        title: "Content inventory",
        meta: "Quality: mixed · Refresh cadence: monthly",
        body: "183 indexable pages. The kitchen inspiration gallery is genuinely strong asset (1.2M monthly Pinterest impressions). The blog publishes once a month and is heavily product-focused; almost no top-of-funnel 'how to plan a kitchen' content where Wren dominates.",
        bullets: [
          "Inspiration gallery is the single best-performing content asset.",
          "Blog: 14 posts in 2025, all bottom-funnel ('Why choose Magnet…').",
          "No buyer-journey content (planning, budgeting, choosing materials).",
          "Zero video content beyond product range overviews."
        ]
      },
      {
        title: "Marketing channels in use",
        meta: "Mix: paid-heavy · Channel debt: high",
        body: "Heavy reliance on Google brand + TV. Paid search budget concentrated on competitor names. Limited organic social momentum on Instagram (47k followers vs Wren's 312k). No active TikTok presence despite the category surging there (#KitchenTok = 4.1B views).",
        bullets: [
          "Paid Search (Google) — primary channel.",
          "TV — large brand spend, lightly measured.",
          "Email — transactional only; no lifecycle programme.",
          "Organic Social — Instagram + Pinterest; no TikTok or YouTube long-form."
        ]
      },
      {
        title: "Tech stack detection",
        meta: "Stack age: ~5 years · Modernisation needed",
        body: "Detected: Google Tag Manager, GA4 (partial migration), Salesforce Marketing Cloud, Bazaarvoice reviews, Trustpilot, Yotpo. Likely on Adobe Commerce / Magento 2. No CDP detected. Server-side tagging absent — tracking will degrade further as third-party cookies fully deprecate.",
        bullets: [
          "Analytics: GA4 (incomplete migration from UA).",
          "ESP: Salesforce Marketing Cloud (under-utilised).",
          "Reviews: Trustpilot 4.2★ (12k reviews) — solid.",
          "CDP: none detected — first-party data is siloed."
        ]
      }
    ],

    market: {
      tam: "£4.6bn",
      growth: "1.8% CAGR",
      maturity: "Mature",
      stats: [
        { label: "UK Fitted Kitchens", value: "£4.6bn", caption: "Annual market size, 2026 est." },
        { label: "Volume CAGR", value: "+1.8%", caption: "5y forward, GfK · slowing post-2022 peak" },
        { label: "Avg. project value", value: "£8,400", caption: "Mid-market kitchen incl. install" },
        { label: "Decision cycle", value: "9–14 wks", caption: "First search → install booking" }
      ],
      trends: [
        { eyebrow: "Demand", title: "Renovation over relocation", body: "Stamp duty + mortgage costs keep homeowners renovating instead of moving. Mid-ticket renovation (£8–15k kitchens) is the sweet spot." },
        { eyebrow: "Aesthetic", title: "'Quiet luxury' kitchens", body: "Hand-painted shaker doors, brass hardware, deep greens and warm whites dominate Pinterest and IG saves. Gloss and high-contrast finishes declining." },
        { eyebrow: "Behaviour", title: "Showroom-then-online", body: "73% of buyers visit a showroom but make the final decision at home after a follow-up consultation. Hybrid sales motion is now table stakes." },
        { eyebrow: "Risk", title: "Trade-customer leak", body: "Howdens is winning the trade side hard; that pulls homeowners by extension via builder recommendation." }
      ],
      regulatory: "VAT rate stable. Building Safety Act 2022 adds compliance overhead for installers (negligible direct marketing impact). Consumer Duty rules under FCA tighten finance-promotion language for finance partners (Klarna, Novuna)."
    },

    competitors: [
      { name: "Wren Kitchens", x: 0.78, y: 0.62, traffic: "5.2M /mo", da: 62, ig: "312k", positioning: "Design-led, digital-first DTC", price: "Mid-premium", note: "Owns search + IG. Direct-to-consumer, no showroom dependency." },
      { name: "Howdens", x: 0.35, y: 0.48, traffic: "2.1M /mo", da: 58, ig: "98k", positioning: "Trade-only, builder channel", price: "Mid-market", note: "Wins via builders. Limited direct marketing." },
      { name: "IKEA", x: 0.18, y: 0.85, traffic: "12.4M /mo", da: 91, ig: "1.2M (UK)", positioning: "Flat-pack, mass-market design", price: "Value", note: "Different category. Aspirational ceiling on price." },
      { name: "Wickes", x: 0.32, y: 0.42, traffic: "1.8M /mo", da: 55, ig: "62k", positioning: "DIY-plus-fitted hybrid", price: "Value+", note: "Strong local SEO. Punches above weight." },
      { name: "B&Q", x: 0.22, y: 0.55, traffic: "3.4M /mo", da: 73, ig: "180k", positioning: "Big-box DIY", price: "Value", note: "Mass reach, not aspirational." },
      { name: "Tom Howley", x: 0.92, y: 0.35, traffic: "180k /mo", da: 42, ig: "84k", positioning: "Bespoke premium", price: "Premium+", note: "Niche aspirational. Magnet is rarely compared head-to-head." },
      { name: "Magnet", x: 0.62, y: 0.46, isSelf: true, traffic: "640k /mo", da: 51, ig: "47k", positioning: "Mid-premium heritage", price: "Mid-premium", note: "You are here. Brand strength under-leveraged on digital." }
    ],

    swot: {
      strengths: [
        "Heritage brand — 108 years of category authority",
        "Vertical integration — own factory in Darlington",
        "200+ UK showrooms — physical footprint moat",
        "In-house design service + installation"
      ],
      weaknesses: [
        "Trailing Wren on digital UX & search visibility",
        "Slow site (mobile LCP 4.2s)",
        "Inspiration content under-distributed on TikTok/YouTube",
        "Email programme is transactional only"
      ],
      opportunities: [
        "Quiet-luxury aesthetic trend favours heritage brands",
        "Local SEO white space — competitors weak per-showroom",
        "Trade channel rebuild against Howdens",
        "Pinterest gallery is undermonetised — direct it to bookings"
      ],
      threats: [
        "Wren's content + ad spend trajectory accelerating",
        "Macro slowdown in big-ticket home spend (BoE rate path)",
        "Builders' loyalty to Howdens hard to dislodge",
        "Cookie deprecation hurts attribution & retargeting reach"
      ]
    }
  },

  // ===== PHASE 2: STRATEGY =====
  strategy: {
    northStar: { metric: "Showroom-booked consultations / month", current: 4200, target: 5800, deltaCap: "+38% by Q4" },

    goals: [
      { eyebrow: "PRIMARY", title: "Lift qualified consultations 38%", body: "From 4,200 to 5,800/month by Q4. Consultations are the single best leading indicator of revenue; current conversion from consult-to-order is 27%.", tags: ["Revenue", "Lead-gen"] },
      { eyebrow: "BRAND", title: "Close brand-consideration gap vs Wren", body: "Aided consideration 41% vs Wren 58% (YouGov, Q2). Move to 52% in 12 months via targeted Pinterest + YouTube + influencer.", tags: ["Awareness"] },
      { eyebrow: "EFFICIENCY", title: "Reduce blended CAC by 15%", body: "Blended CAC £148; target £126 via channel rebalancing, lifecycle nurture, and CRO. Primarily by replacing low-quality paid traffic with organic + email-driven leads.", tags: ["Efficiency"] },
      { eyebrow: "RETENTION", title: "Capture 'second project' demand", body: "30% of buyers renovate another room within 24 months. Today Magnet captures ~8%. Cross-sell into Bedrooms via owned channels.", tags: ["Retention", "CLV"] }
    ],

    positioning: {
      statement: "For homeowners renovating a kitchen they'll keep for a decade, Magnet is the British-made design partner that brings showroom expertise into your home — because a kitchen isn't a purchase, it's a 10-year decision.",
      pillars: [
        { title: "Made in Britain", body: "Own factory, own delivery, own installers. The whole chain.", icon: "factory" },
        { title: "Showroom-grade design", body: "A designer in every showroom, a 3D plan in every quote.", icon: "ruler" },
        { title: "Built to last", body: "10-year cabinet guarantee. Not flat-pack. Not throwaway.", icon: "shield-check" },
        { title: "Quiet expertise", body: "108 years of doing this. We don't need to shout about it.", icon: "history" }
      ],
      voice: "Confident. Specific. Quietly proud. Avoid superlatives — let materials and process do the work."
    },

    audience: {
      icp: "UK homeowners, 38–62, household income £60k+, owner-occupied 3-bed+, considering a £8–20k kitchen project in the next 6 months. Primarily 'second renovation' — they've done one before and want it done properly this time.",
      segments: [
        { name: "Renovating Family", pct: 48 },
        { name: "Forever Home", pct: 27 },
        { name: "Pre-sale Refresh", pct: 16 },
        { name: "First-home Buyer", pct: 9 }
      ]
    },

    channels: [
      { name: "Local SEO", effort: 3, impact: 9, stage: "TOFU + BOFU", note: "Per-showroom landing pages; biggest leverage." },
      { name: "Paid Search", effort: 5, impact: 7, stage: "BOFU", note: "Pull spend off competitor terms; defend brand." },
      { name: "Pinterest", effort: 4, impact: 8, stage: "TOFU", note: "Already strong organically — fund creative + pin-to-quiz." },
      { name: "Meta (IG + FB)", effort: 5, impact: 6, stage: "MOFU", note: "Retargeting + lookalikes for consult booking." },
      { name: "TikTok", effort: 7, impact: 7, stage: "TOFU", note: "Designer-led content; #KitchenTok is huge." },
      { name: "YouTube long-form", effort: 8, impact: 7, stage: "TOFU + MOFU", note: "Buyer's guide series; SEO + retargeting fuel." },
      { name: "Email lifecycle", effort: 4, impact: 8, stage: "MOFU", note: "Build today. Replace transactional with nurture." },
      { name: "Influencer / PR", effort: 6, impact: 5, stage: "TOFU", note: "Interior designers + 'reno' creators on IG/YT." }
    ],

    timeline: [
      {
        stream: "Foundations", sub: "Quick wins & plumbing",
        d30: { kind: "ghost", label: "Audit + GA4 fix" },
        d60: { kind: "blue", label: "Server-side tags live" },
        d90: { kind: "blue", label: "CDP + lifecycle ESP rebuild" }
      },
      {
        stream: "Demand capture", sub: "Bottom of funnel",
        d30: { kind: "blue", label: "Showroom pages launched (40 cities)" },
        d60: { kind: "navy", label: "Brand-term defence reweighted" },
        d90: { kind: "navy", label: "Quote-builder conversion test" }
      },
      {
        stream: "Demand creation", sub: "Top of funnel",
        d30: { kind: "ghost", label: "Pinterest creative refresh" },
        d60: { kind: "navy", label: "TikTok pilot — 3 designers" },
        d90: { kind: "orange", label: "Buyer's Guide video series" }
      },
      {
        stream: "Lifecycle & CRM", sub: "Nurture + retention",
        d30: { kind: "ghost", label: "Welcome flow live" },
        d60: { kind: "navy", label: "Quote-recovery sequence" },
        d90: { kind: "orange", label: "'Next room' cross-sell to Bedrooms" }
      }
    ]
  },

  // ===== PHASE 3: TACTICS =====
  tactics: {
    contentClusters: [
      { hub: "How to plan your kitchen", spokes: ["Kitchen planning checklist", "How much does a new kitchen cost in 2026?", "Measuring your kitchen: a step-by-step", "Choosing a layout: L, U, galley or island", "When to renovate vs replace doors"], volume: "47k /mo", difficulty: 38 },
      { hub: "Kitchen styles & inspiration", spokes: ["Shaker kitchens explained", "Quiet luxury kitchens: 2026 trend report", "Small kitchen ideas", "Open-plan kitchen design", "Dark kitchens that aren't depressing"], volume: "82k /mo", difficulty: 44 },
      { hub: "Materials & finishes", spokes: ["Solid wood vs MDF doors", "Quartz vs granite worktops", "Best handle finishes for shaker", "Kitchen flooring options ranked", "Splashback materials: pros and cons"], volume: "31k /mo", difficulty: 41 },
      { hub: "Budget & finance", spokes: ["Kitchen finance: 0% APR explained", "True cost of a fitted kitchen", "Where to save vs splurge", "Hidden costs to budget for", "Is a £10k kitchen realistic in 2026?"], volume: "24k /mo", difficulty: 35 }
    ],

    paid: [
      { platform: "Google Search", structure: "Brand defence + non-brand commercial-intent", budgetPct: 22, sample: '"Kitchen showroom in [city] — book your free design consultation. Made in Britain since 1918."', target: "8–14% CTR on brand; 3–5% CTR non-brand" },
      { platform: "Pinterest", structure: "Idea Pins → Pin-to-quiz → email capture", budgetPct: 14, sample: "Visual carousel: '5 shaker kitchen ideas worth saving' → quiz: 'What's your kitchen personality?'", target: "Pin save rate >3.5%" },
      { platform: "Meta (IG + FB)", structure: "Lookalike of past consultation bookers + retargeting", budgetPct: 18, sample: "Reel: 60s 'designer walks you through a Magnet kitchen' — book a consult CTA.", target: "Cost per consult <£32" },
      { platform: "YouTube", structure: "In-stream + Shorts; buyer's-guide pre-roll", budgetPct: 9, sample: '15s: "Most kitchens fail at the planning stage. Here\'s our planning checklist — free."', target: "VTR >35% in-stream" },
      { platform: "TikTok", structure: "Designer-led organic + Spark Ads on top performers", budgetPct: 6, sample: '"POV: you\'re measuring your kitchen wrong" — designer corrects common mistakes.', target: "Pilot only. Validate before scale." }
    ],

    organic: [
      { platform: "Pinterest", cadence: "20 pins/wk", format: "Carousel + Idea Pins", note: "Already 1.2M monthly impressions. Add pin-to-quote CTA on top-saved pins." },
      { platform: "Instagram", cadence: "5 posts + 3 Reels/wk", format: "Reels-led, designer storytelling", note: "Lean into 'meet the designer' faces. Static product shots underperform 4×." },
      { platform: "TikTok", cadence: "3 posts/wk (pilot)", format: "Designer-led, lo-fi", note: "Three designers; 90-day pilot, $0 paid until creative validated." },
      { platform: "YouTube", cadence: "1 long-form/2wk + 2 Shorts/wk", format: "Buyer's guide series", note: "Long tail SEO compounding asset; supports retargeting pixel." }
    ],

    email: [
      { name: "Brochure-request welcome", trigger: "Form submission", emails: 4, window: "0–14 days", goal: "Book a consult", note: "Currently transactional one-and-done. Add 3-email nurture: 'choosing a designer', 'showroom expectations', '£1k trade-in reminder'." },
      { name: "Showroom no-show recovery", trigger: "Booked but didn't attend", emails: 2, window: "1–4 days post", goal: "Rebook", note: "Doesn't exist today. Worth £180k/y at current no-show rate." },
      { name: "Quote-stage nurture", trigger: "Designer-quoted, no purchase 14d", emails: 5, window: "14–60 days", goal: "Return to designer", note: "Highest revenue lever. Long decision cycle; needs help, not pressure." },
      { name: "Post-install ambassador", trigger: "Install completed +30d", emails: 3, window: "30–90 days", goal: "Review + referral", note: "Trustpilot has 12k reviews — could double that. Drives social proof." }
    ],

    seo: {
      onPage: ["Add price ranges to range pages (won't show on Howley/Wren — fast win)", "Add FAQ schema to every range page", "Compress hero imagery (LCP from 4.2 → <2.5s target)"],
      technical: ["Server-side GTM", "Lazy-load below-fold images", "Implement local-business schema per showroom"],
      offPage: ["Digital PR: 'state of British kitchens' annual report", "Designer-creator partnerships with backlink mention"]
    },

    cro: [
      { hypothesis: "Inline price ranges on range pages will lift consult-bookings", ice: 8, area: "BOFU" },
      { hypothesis: "Replace 6-field brochure form with email-only progressive", ice: 9, area: "TOFU" },
      { hypothesis: "Add 'showroom in your area' module to homepage hero", ice: 7, area: "Discovery" },
      { hypothesis: "Test 0% finance vs £1k trade-in as primary offer", ice: 8, area: "Offer" },
      { hypothesis: "Consult booking widget: 2-step instead of 1 long form", ice: 6, area: "BOFU" }
    ],

    partnerships: [
      { name: "Interior designer guest range", body: "Co-design a capsule range with a recognisable British designer (e.g. Sophie Robinson, Matthew Williamson). 12-month exclusive; PR-led launch." },
      { name: "Homes & Gardens 'Kitchen of the Year' sponsorship", body: "Sponsorship of the awards plus content series. Strong overlap with quiet-luxury audience." },
      { name: "Houzz Pro integration", body: "Partner with Houzz to surface Magnet ranges to verified UK homeowners. Builds top-funnel reach." }
    ],

    stack: [
      { tool: "GA4 + Looker", purpose: "Analytics + reporting", status: "Optimise" },
      { tool: "Server-side GTM", purpose: "Tracking durability", status: "Build" },
      { tool: "Customer.io / Klaviyo", purpose: "Lifecycle ESP", status: "Replace SFMC for B2C" },
      { tool: "Segment / RudderStack", purpose: "CDP", status: "Build (Q2)" },
      { tool: "Northbeam / Triple Whale", purpose: "Multi-touch attribution", status: "Pilot" },
      { tool: "VWO / Optimizely", purpose: "CRO testing", status: "Renew" }
    ]
  },

  // ===== PHASE 4: MEASUREMENT =====
  measurement: {
    kpis: [
      { label: "Showroom consults / mo", value: "5,800", delta: "+38%", target: "Q4 target", up: true },
      { label: "Blended CAC", value: "£126", delta: "−15%", target: "From £148", up: false, good: true },
      { label: "Brand consideration", value: "52%", delta: "+11 pts", target: "vs Wren 58%", up: true },
      { label: "Email-attributed revenue", value: "£4.8M", delta: "new", target: "From £0.6M today", up: true },
      { label: "Site speed (LCP, mobile)", value: "2.3s", delta: "−45%", target: "From 4.2s", up: false, good: true },
      { label: "Organic share of voice", value: "18%", delta: "+7 pts", target: "vs category", up: true },
      { label: "Quote→order conversion", value: "32%", delta: "+5 pts", target: "From 27%", up: true },
      { label: "Trustpilot reviews", value: "24k", delta: "+12k", target: "Volume drives CTR", up: true }
    ],
    funnel: [
      { stage: "Reach", count: "8.2M", caption: "Monthly people exposed", channel: "TOFU — Pinterest, YT, IG", color: "blue" },
      { stage: "Engaged", count: "740k", caption: "Pin saves, watches, deep scrolls", channel: "Mid-funnel signal", color: "blue" },
      { stage: "Sessions", count: "640k", caption: "On magnet.co.uk", channel: "All channels", color: "blue" },
      { stage: "Brochure / Email", count: "94k", caption: "Lead identifier captured", channel: "MOFU — Email + Pinterest quiz", color: "blue" },
      { stage: "Showroom consults", count: "5,800", caption: "Booked + attended", channel: "BOFU — Local SEO + Paid", color: "orange" },
      { stage: "Quoted", count: "4,930", caption: "Designer quote issued", channel: "Sales hand-off", color: "orange" },
      { stage: "Orders", count: "1,580", caption: "Installations sold", channel: "Revenue", color: "orange" }
    ],
    attribution: "Multi-touch (data-driven) as primary; first-touch + last-non-direct as secondary perspectives. Direct UTM convention: utm_source / utm_medium / utm_campaign / utm_content (creative-level) / utm_term (audience-level).",
    reporting: [
      { cadence: "Daily", who: "Channel leads", focus: "Pacing & anomalies — spend, leads, blended CAC." },
      { cadence: "Weekly", who: "Marketing leadership", focus: "Channel performance vs target, test status, top creative." },
      { cadence: "Monthly", who: "Exec", focus: "North-star metric, CAC, brand consideration, Trustpilot trajectory." },
      { cadence: "Quarterly", who: "Board", focus: "Strategic milestones, budget reforecast, risk register." }
    ],
    risks: [
      { signal: "Brand search trend −2 wks consecutive", action: "Trigger brand campaign top-up (£15k reserve)" },
      { signal: "Consult cost >£40 for 7 days", action: "Pause TikTok pilot; reallocate to Pinterest" },
      { signal: "Quote→order conversion drops 3pts", action: "Review designer training; sales-side, not marketing" },
      { signal: "Trustpilot rating below 4.0", action: "Escalate to CX; suspend reviews-led creative" }
    ]
  }
};

export default DEMO_MAGNET;
