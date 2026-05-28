// app.jsx — Root component. Routes input → loading → report. Calls Claude API.

const { useState: useAS, useEffect: useAE, useRef: useAR } = React;

const STORAGE_KEY = 'tm_api_key';
function getApiKey()    { return localStorage.getItem(STORAGE_KEY) || ''; }
function saveApiKey(k)  { localStorage.setItem(STORAGE_KEY, k); }

// ─── API key modal ────────────────────────────────────────────────────────────
function ApiKeyModal({ onSave, onCancel }) {
  const [val, setVal] = useAS(getApiKey());
  const [err, setErr] = useAS('');
  useLucide();

  const save = () => {
    const k = val.trim();
    if (!k) { setErr('Please enter your API key.'); return; }
    if (!k.startsWith('sk-ant-')) { setErr('Key should start with "sk-ant-"'); return; }
    onSave(k);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(15,21,35,0.55)', backdropFilter:'blur(4px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'white', borderRadius:18, padding:'32px 32px 28px', maxWidth:460, width:'100%', boxShadow:'0 32px 64px rgba(15,21,35,0.18)' }}>
        <div className="card__eyebrow" style={{ marginBottom:14 }}>
          <Icon name="key" size={14} /> API KEY REQUIRED
        </div>
        <h2 style={{ fontSize:22, fontWeight:700, color:'var(--tm-ink)', marginBottom:8, lineHeight:1.2 }}>
          Enter your Anthropic API key
        </h2>
        <p style={{ fontSize:13, color:'var(--tm-text-muted)', marginBottom:20, lineHeight:1.55 }}>
          Your key is stored in your browser only — never sent to our servers.<br />
          Get a key at{' '}
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener"
             style={{ color:'var(--tm-blue)', textDecoration:'underline' }}>
            console.anthropic.com
          </a>.
        </p>
        <input
          style={{ width:'100%', padding:'12px 14px', border:'1.5px solid var(--tm-hairline)', borderRadius:8, fontSize:13, fontFamily:'monospace', outline:'none', boxSizing:'border-box', transition:'border-color 0.15s' }}
          type="password"
          placeholder="sk-ant-..."
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          onFocus={e => e.target.style.borderColor = 'var(--tm-blue)'}
          onBlur={e => e.target.style.borderColor = 'var(--tm-hairline)'}
          autoFocus
        />
        {err && <p style={{ color:'#c25700', fontSize:13, marginTop:8 }}>{err}</p>}
        <div style={{ display:'flex', gap:10, marginTop:22, justifyContent:'flex-end' }}>
          {onCancel && (
            <button className="tm-btn tm-btn--secondary tm-btn--sm" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button className="tm-btn tm-btn--primary tm-btn--sm" onClick={save}>
            Save &amp; continue
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Claude API call ──────────────────────────────────────────────────────────
async function callClaude(payload, apiKey) {
  const url        = payload.url || '';
  const industry   = payload.industry || '';
  const budget     = parseFloat(String(payload.budget || 0).replace(/[^0-9.]/g, '')) || 0;
  const sym        = payload.currencySymbol || '£';
  const competitors = Array.isArray(payload.competitors)
    ? payload.competitors.join(', ')
    : String(payload.competitors || '');

  const prompt = `You are a senior strategist at an advertising and marketing agency preparing a new business pitch. Generate a rich, detailed, comprehensive marketing intelligence report for this prospect.

PROSPECT
Company URL: ${url}
Industry: ${industry}
Competitors: ${competitors}
Annual marketing budget: ${sym}${budget.toLocaleString()}

Return ONLY a valid JSON object (no markdown, no backticks, no preamble) matching this exact schema:

{
  "company_summary": "4-5 sentence summary covering who this company is, their likely positioning, target customer, key differentiator, and market context",
  "market_research": {
    "market_size": "3-4 sentences on market size, value, growth rate, and key dynamics",
    "key_trends": ["detailed trend 1 with context", "detailed trend 2", "detailed trend 3", "detailed trend 4", "detailed trend 5"],
    "consumer_shifts": ["shift 1 with why it matters", "shift 2", "shift 3", "shift 4"],
    "opportunity": "3-4 sentences on the single biggest opportunity for this brand, why it exists now, and what it takes to capture it"
  },
  "audience_segments": [
    {"name": "segment name", "size_pct": 30, "description": "4-5 sentences: who they are, motivations, pain points, media habits, best way to reach them"},
    {"name": "...", "size_pct": 25, "description": "..."},
    {"name": "...", "size_pct": 25, "description": "..."},
    {"name": "...", "size_pct": 20, "description": "..."}
  ],
  "positioning": {
    "our_recommended_position": "3-4 sentences on recommended positioning, why it's ownable, and how it creates defensible differentiation",
    "competitor_analysis": [
      {"name": "competitor name exactly as provided", "position": "2-3 sentences on their positioning and messaging", "strength": "2-3 sentences on their main strengths", "weakness": "2-3 sentences on their weaknesses and how to exploit them"}
    ]
  },
  "creative_territory": {
    "campaign_thought": "the single big idea in one punchy memorable sentence — the platform this brand should own",
    "brand_voice": ["tone word 1", "tone word 2", "tone word 3", "tone word 4"],
    "key_messages": [
      {"segment": "segment name matching audience_segments", "message": "2-3 sentences: core message, emotional hook, proof point"}
    ]
  },
  "search_trends": {
    "top_queries": [
      {"query": "search term", "direction": "rising", "insight": "2-3 sentences on consumer intent and strategic implication"}
    ],
    "seasonal_peaks": ["description of when search peaks and why", "second peak description"],
    "emerging_topics": ["topic 1", "topic 2", "topic 3", "topic 4", "topic 5"],
    "strategic_implication": "3-4 sentences on how to use these search trends in paid search, content, and campaign timing"
  },
  "trigger_calendar": [
    {"name": "trigger name", "months": [1,2], "month_labels": "Jan-Feb", "rationale": "2-3 sentences on why this moment matters", "priority": "high"}
  ],
  "budget_split": [
    {"channel": "Paid social", "pct": 30, "amount": ${Math.round(budget * 0.3)}, "rationale": "2-3 sentences on why this allocation and what success looks like"}
  ]
}

REQUIREMENTS
- audience_segments: exactly 4 segments, size_pct must sum to 100
- positioning.competitor_analysis: one entry per competitor listed above, in same order
- creative_territory.key_messages: exactly 4 entries, one per audience segment, in same order
- search_trends.top_queries: 6-8 entries. direction must be exactly "rising", "stable", or "declining"
- search_trends.seasonal_peaks: 3-4 entries
- trigger_calendar: 6-8 entries. priority must be "high", "medium", or "low"
- budget_split: 5-7 channels, pct must sum to 100, amounts must sum to ${sym}${budget.toLocaleString()}
- Be deeply specific — reference the named competitors throughout. No generic phrases.
- Return raw JSON only. No \`\`\`json fences.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-7',
      max_tokens: 16000,
      stream: true,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    let detail = text;
    try { const j = JSON.parse(text); detail = j.error?.message || text; } catch (_) {}
    if (response.status === 401) throw new Error('Invalid API key — open the tweaks panel and set a valid sk-ant-... key.');
    if (response.status === 403) throw new Error('API key rejected. Make sure it has credit and is not restricted.');
    if (response.status === 429) throw new Error('Rate limited. Wait a moment and try again.');
    throw new Error('API ' + response.status + ' — ' + detail.slice(0, 200));
  }

  const reader  = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';
  let buffer      = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const ev = JSON.parse(data);
        if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
          accumulated += ev.delta.text;
        }
      } catch (_) {}
    }
  }

  const clean = accumulated
    .replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error('Raw response:', accumulated);
    throw new Error("Could not parse the response JSON. Try generating again.");
  }
}

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak]     = useTweaks(window.TWEAKS);
  const [screen, setScreen]    = useAS(tweaks.startScreen || "input");
  const [submitted, setSubmitted] = useAS(null);
  const [apiError, setApiError]   = useAS('');
  const [showKeyModal, setShowKeyModal] = useAS(!getApiKey());
  const pendingPayload = useAR(null);

  useAE(() => { if (window.lucide) window.lucide.createIcons(); });

  const startGeneration = async (payload, key) => {
    setApiError('');
    setSubmitted(payload);
    setScreen("loading");

    const MIN_MS   = 5400; // let the loading animation finish (~5s total)
    const startedAt = Date.now();

    try {
      const raw    = await callClaude(payload, key);
      const magnet = window.transformToMagnet(raw, { ...payload, currencySymbol: '£' });
      window.MAGNET = magnet;

      // Respect the loading animation's minimum duration
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_MS) {
        await new Promise(r => setTimeout(r, MIN_MS - elapsed));
      }
      setScreen("report");
    } catch (err) {
      setApiError(err.message);
      setSubmitted(null);
      setScreen("input");
    }
  };

  const handleSubmit = (payload) => {
    const key = getApiKey();
    if (!key) {
      pendingPayload.current = payload;
      setShowKeyModal(true);
      return;
    }
    startGeneration(payload, key);
  };

  const handleKeySave = (key) => {
    saveApiKey(key);
    setShowKeyModal(false);
    if (pendingPayload.current) {
      const p = pendingPayload.current;
      pendingPayload.current = null;
      startGeneration(p, key);
    }
  };

  const reset = () => {
    setSubmitted(null);
    setScreen("input");
    setApiError('');
  };

  const layout    = tweaks.navLayout || "sidebar";
  const brandHost = (submitted?.url || '').replace(/^https?:\/\//i, '').replace(/\/$/, '') || 'trenchmonkey.ai';

  const inner = (
    <div className={"app-shell app-shell--" + layout}>
      {screen === "input" && (
        <React.Fragment>
          <InputForm onSubmit={handleSubmit} />
          {apiError && (
            <div style={{ maxWidth:560, margin:'0 auto 24px', padding:'12px 16px',
                          background:'#fff4e0', borderRadius:10, color:'#7a4800', fontSize:13,
                          border:'1px solid #ffe0a0' }}>
              <strong>Error:</strong> {apiError}
            </div>
          )}
        </React.Fragment>
      )}
      {screen === "loading" && (
        <LoadingScreen
          brand={brandHost}
          onComplete={() => {}}
        />
      )}
      {screen === "report" && window.MAGNET && (
        <Report data={window.MAGNET} layout={layout} onNewPlan={reset} />
      )}
    </div>
  );

  return (
    <React.Fragment>
      {tweaks.showBrowserChrome ? (
        <div className="stage">
          <ChromeWindow
            tabs={[
              { title: "Trench Monkey · Plans" },
              { title: window.MAGNET ? window.MAGNET.brand.name : "Market Intelligence" },
              { title: "Analytics" }
            ]}
            activeIndex={0}
            url={"app.trenchmonkey.ai/plans/" + brandHost}
            width={1440}
            height={900}
          >
            {inner}
          </ChromeWindow>
        </div>
      ) : (
        <div className="stage stage--fullbleed">
          {inner}
        </div>
      )}

      <TweaksPanel>
        <TweakSection label="Layout">
          <TweakRadio
            label="Navigation"
            value={tweaks.navLayout}
            onChange={v => setTweak("navLayout", v)}
            options={[
              { value: "sidebar", label: "Sidebar" },
              { value: "tabs",    label: "Tabs"    },
              { value: "scroll",  label: "Scroll"  }
            ]}
          />
          <TweakToggle
            label="Browser chrome"
            value={tweaks.showBrowserChrome}
            onChange={v => setTweak("showBrowserChrome", v)}
          />
        </TweakSection>
        <TweakSection label="API">
          <TweakButton label="🔑 Set API key" onClick={() => setShowKeyModal(true)} secondary />
        </TweakSection>
        <TweakSection label="Demo">
          <TweakSelect
            label="Jump to screen"
            value={screen}
            onChange={v => {
              if (v === "report" && !window.MAGNET) return;
              setScreen(v);
              if (v !== "input" && !submitted) setSubmitted({ url: "demo.example.com" });
            }}
            options={[
              { value: "input",   label: "1. Input form"    },
              { value: "loading", label: "2. Loading screen" },
              { value: "report",  label: "3. Full report"    }
            ]}
          />
          <TweakButton label="↺ Reset" onClick={reset} secondary />
        </TweakSection>
      </TweaksPanel>

      {showKeyModal && (
        <ApiKeyModal
          onSave={handleKeySave}
          onCancel={pendingPayload.current ? () => { pendingPayload.current = null; setShowKeyModal(false); } : null}
        />
      )}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
