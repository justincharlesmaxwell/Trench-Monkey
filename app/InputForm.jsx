// InputForm.jsx — Full Trench Monkey homepage + prospect input form.
const { useState: useIS, useEffect: useIE } = React;

const OUTPUT_CARDS = [
  { icon: "bar-chart-2",  title: "Market Research",        body: "Market size, growth rate, key trends, and consumer shifts — all benchmarked to your industry." },
  { icon: "users",        title: "Audience Segments",      body: "Four profiled audience groups with size estimates, motivations, and the best way to reach each one." },
  { icon: "crosshair",   title: "Competitor Positioning",  body: "Head-to-head breakdown of your named rivals — their strengths, gaps, and where you can own the market." },
  { icon: "wand-2",       title: "Creative Territory",      body: "The single big campaign idea, brand voice, and tailored key messages for each audience segment." },
  { icon: "trending-up",  title: "Search Trend Analysis",   body: "Top search queries, rising topics, seasonal peaks, and what it means for your content and paid strategy." },
  { icon: "pie-chart",    title: "Budget Split",            body: "Channel-by-channel media allocation built around your exact budget — social, search, OOH, and beyond." },
];

function InputForm({ onSubmit }) {
  const [url,         setUrl]         = useIS("");
  const [industry,    setIndustry]    = useIS("");
  const [competitors, setCompetitors] = useIS([]);
  const [draft,       setDraft]       = useIS("");
  const [budget,      setBudget]      = useIS("");
  const [formError,   setFormError]   = useIS("");

  useIE(() => { if (window.lucide) window.lucide.createIcons(); });

  const removeChip = (i) => setCompetitors(c => c.filter((_, idx) => idx !== i));
  const addChip = () => {
    const v = draft.trim();
    if (!v) return;
    setCompetitors(c => c.includes(v) ? c : [...c, v]);
    setDraft("");
  };
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addChip(); }
    else if (e.key === "Backspace" && !draft && competitors.length) removeChip(competitors.length - 1);
  };

  const submit = (e) => {
    e.preventDefault();
    setFormError("");
    if (!url.trim())      { setFormError("Please enter a company URL.");      return; }
    if (!industry.trim()) { setFormError("Please enter the industry.");       return; }
    if (!budget.trim())   { setFormError("Please enter a marketing budget.");  return; }
    const budgetNum = parseFloat(String(budget).replace(/[^0-9.]/g, ""));
    if (isNaN(budgetNum) || budgetNum <= 0) { setFormError("Please enter a valid budget number."); return; }
    onSubmit({ url: url.trim(), industry: industry.trim(), competitors, budget: budgetNum, currencySymbol: "£" });
  };

  /* ── inline style helpers ── */
  const sectionGap = { marginBottom: 48 };
  const blueRule   = { width: 40, height: 3, background: "var(--tm-blue)",   borderRadius: 2, marginBottom: 20 };
  const orangeRule = { width: 40, height: 3, background: "var(--tm-orange)", borderRadius: 2, marginBottom: 20 };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#f5f6f9" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 24px 100px" }}>

        {/* ── Brand lockup ──────────────────────────────────────────── */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "24px 48px", padding: "8px 0 40px" }}>
          <img src="New%20Logo.png" alt="Trench Monkey" style={{ width: 280, height: "auto", objectFit: "contain", flexShrink: 0 }} />
          <h1 style={{ fontFamily: "var(--tm-font-display)", fontWeight: 700, fontSize: "clamp(56px,9vw,112px)", letterSpacing: "-0.02em", lineHeight: 0.95, textTransform: "uppercase", textAlign: "center", margin: 0 }}>
            <span style={{ color: "var(--tm-blue)" }}>Trench</span><br />
            <span style={{ color: "var(--tm-orange)" }}>Monkey</span>
          </h1>
        </div>

        {/* ── Hero copy ─────────────────────────────────────────────── */}
        <div style={sectionGap}>
          <div style={blueRule} />
          <h2 style={{ fontFamily: "var(--tm-font-ui)", fontWeight: 700, fontSize: "clamp(26px,3.5vw,36px)", lineHeight: 1.2, color: "var(--tm-ink)", marginBottom: 12, marginTop: 0 }}>
            World Class AI Market Intelligence
          </h2>
          <p style={{ fontFamily: "var(--tm-font-display)", fontWeight: 700, color: "var(--tm-green)", fontSize: "clamp(16px,2vw,22px)", lineHeight: 1.3, marginBottom: 20, marginTop: 0 }}>
            Putting a butchers knife through entry level roles since 26
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--tm-text)", marginBottom: 12, marginTop: 0 }}>
            Enter your prospect's details and Trench Monkey will research the market, segment the audience, position against competitors, build a seasonal calendar, and split the budget — all in under 40 seconds.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--tm-text)", margin: 0 }}>
            Every pitch is powered by live market intelligence, grounded in real competitor data, and tailored to the exact budget and industry you provide. No templates. No guesswork. Just a pitch ready to present. An app so powerful, it will make your dick shrink.
          </p>
        </div>

        {/* ── 6 output cards ────────────────────────────────────────── */}
        <div style={{ ...sectionGap, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 24 }}>
          {OUTPUT_CARDS.map((c, i) => (
            <div key={i} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              <i data-lucide={c.icon} style={{ color: "var(--tm-navy)", width: 28, height: 28 }}></i>
              <h4 style={{ fontFamily: "var(--tm-font-display)", fontWeight: 600, fontSize: 20, letterSpacing: "-0.01em", lineHeight: 1.1, color: "var(--tm-ink)", margin: 0 }}>{c.title}</h4>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--tm-text)", margin: 0 }}>{c.body}</p>
            </div>
          ))}
        </div>

        {/* ── Problem / Solution ────────────────────────────────────── */}
        <div style={{ ...sectionGap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 32px" }}>
          <h2 style={{ fontFamily: "var(--tm-font-display)", fontWeight: 700, fontSize: "clamp(26px,3.5vw,36px)", color: "var(--tm-blue)", lineHeight: 1.2, margin: 0 }}>
            The Problem
          </h2>
          <h2 style={{ fontFamily: "var(--tm-font-display)", fontWeight: 700, fontSize: "clamp(26px,3.5vw,36px)", color: "var(--tm-orange)", lineHeight: 1.2, margin: 0 }}>
            The Solution
          </h2>
          <div style={{ fontSize: 17, lineHeight: 1.65, color: "var(--tm-text)" }}>
            <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
              <li style={{ marginBottom: 8 }}>Feeling depressed because your job is meaningless?</li>
              <li style={{ marginBottom: 8 }}>Tired of jumping through tick box hoops?</li>
              <li style={{ marginBottom: 8 }}>Under pitch deadlines so tight, your nuts feel like exploding?</li>
            </ul>
            <p style={{ margin: 0 }}>Yep, you aren't alone — the industry is broken, and so are you!</p>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--tm-text)", margin: 0 }}>
            World class AI automation, taking you away from your meaningless tick box of a marketing role, and closer towards the things that really matter in your life. Start pushing back at the industry before it pushes you straight off a bridge.
          </p>
          <div style={{ borderRadius: 12, overflow: "hidden", background: "#dde0ea" }}>
            <video src="New%20Video%201.mp4" controls playsInline style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
          <div style={{ borderRadius: 12, overflow: "hidden", background: "#dde0ea" }}>
            <video src="new%20video%202.mp4" controls playsInline style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        </div>

        {/* ── Let's Get Digging ─────────────────────────────────────── */}
        <div style={{ ...sectionGap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <div style={blueRule} />
            <h2 style={{ fontFamily: "var(--tm-font-ui)", fontWeight: 700, fontSize: "clamp(26px,3.5vw,36px)", color: "var(--tm-ink)", lineHeight: 1.2, marginBottom: 16, marginTop: 0 }}>
              Let's Get Digging!
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--tm-text)", maxWidth: 420, margin: 0 }}>
              Enter company artifacts below to curate a high-performance marketing narrative. Our scholarly engine analyzes competitor benchmarks in real-time.
            </p>
          </div>
          <div style={{ borderRadius: 12, overflow: "hidden", background: "#f5f6f9" }}>
            <img src="Cigar%20image.png" alt="" style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
          </div>
        </div>

        {/* ── So You Can Get Golfing ────────────────────────────────── */}
        <div style={{ ...sectionGap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div style={{ borderRadius: 12, overflow: "hidden", background: "#f5f6f9" }}>
            <img src="last%20image.png" alt="" style={{ width: "100%", height: "auto", display: "block", objectFit: "cover", mixBlendMode: "multiply" }} />
          </div>
          <div>
            <div style={orangeRule} />
            <h2 style={{ fontFamily: "var(--tm-font-ui)", fontWeight: 700, fontSize: "clamp(26px,3.5vw,36px)", color: "var(--tm-orange)", lineHeight: 1.2, marginBottom: 16, marginTop: 0 }}>
              So You Can Get Golfing
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--tm-text)", maxWidth: 420, margin: 0 }}>
              World class AI automation doing the heavy lifting — so you can spend less time in the office and more time on the fairway where life really matters.
            </p>
          </div>
        </div>

        {/* ── Form ──────────────────────────────────────────────────── */}
        <div className="input-card" style={{ maxWidth: "none" }}>
          <div className="input-card__rule" />
          <div className="input-card__eyebrow">New analysis</div>
          <h1 className="input-card__title">Tell Trench Monkey about your prospect.</h1>
          <p className="input-card__sub">
            Four fields. Forty seconds. The monkey researches the market, segments the audience,
            positions against competitors, splits the budget, and hands you a four-phase plan ready to present.
          </p>

          <form className="input-card__form" onSubmit={submit}>
            <div className="tm-field">
              <label className="tm-field__lbl" style={{ fontFamily: "var(--tm-font-display)", fontWeight: 600, fontSize: 20, color: "var(--tm-blue)" }}>
                Company URL
              </label>
              <div className="tm-field__prefix">
                <span className="tm-field__prefix-sym">↗</span>
                <input className="tm-field__input" placeholder="e.g. magnet.co.uk" value={url} onChange={e => setUrl(e.target.value)} />
              </div>
              <span className="tm-field__hint">We'll research their positioning, market, and competitors.</span>
            </div>

            <div className="tm-field">
              <label className="tm-field__lbl" style={{ fontFamily: "var(--tm-font-display)", fontWeight: 600, fontSize: 20, color: "var(--tm-orange)" }}>
                Industry
              </label>
              <input className="tm-field__input" placeholder="e.g. Home improvement · Fitted kitchens" value={industry} onChange={e => setIndustry(e.target.value)} />
              <span className="tm-field__hint">Anchors the market size, trends, and benchmarks.</span>
            </div>

            <div className="tm-field tm-field--full">
              <label className="tm-field__lbl" style={{ fontFamily: "var(--tm-font-display)", fontWeight: 600, fontSize: 20, color: "var(--tm-navy)" }}>
                Competitors <span style={{ color: "var(--tm-text-muted)", fontWeight: 400, fontSize: 16 }}>· comma or Enter to add</span>
              </label>
              <div className="tm-chiprow">
                {competitors.map((c, i) => (
                  <span key={i} className="tm-chip">
                    {c}
                    <button type="button" className="tm-chip__x" onClick={() => removeChip(i)} aria-label={"Remove " + c}>
                      <i data-lucide="x" style={{ width: 12, height: 12 }}></i>
                    </button>
                  </span>
                ))}
                <input
                  className="tm-chiprow__input"
                  placeholder={competitors.length ? "Add another…" : "e.g. Competitor X, Competitor Y"}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={onKey}
                  onBlur={addChip}
                />
              </div>
              <span className="tm-field__hint">We'll benchmark positioning, messaging, and digital presence against these.</span>
            </div>

            <div className="tm-field">
              <label className="tm-field__lbl" style={{ fontFamily: "var(--tm-font-display)", fontWeight: 600, fontSize: 20, color: "var(--tm-green)" }}>
                Annual Marketing Budget
              </label>
              <div className="tm-field__prefix">
                <span className="tm-field__prefix-sym">£</span>
                <input className="tm-field__input" placeholder="250,000" value={budget} onChange={e => setBudget(e.target.value)} />
              </div>
              <span className="tm-field__hint">We split this across channels in your output.</span>
            </div>

            {formError && (
              <div style={{ background: "#fff0f0", border: "1px solid #fbb", borderRadius: 8, padding: "10px 14px", color: "#b00", fontSize: 13 }}>
                {formError}
              </div>
            )}

            <div className="input-card__actions">
              <span className="input-card__hint">
                <i data-lucide="shield" style={{ width: 14, height: 14 }}></i>
                Your inputs are never sent to our servers — local processing only.
              </span>
              <button type="submit" className="tm-btn tm-btn--primary tm-btn--lg">
                <span>Generate snake oil</span>
                <i data-lucide="arrow-right" className="tm-btn__ic"></i>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

window.InputForm = InputForm;
