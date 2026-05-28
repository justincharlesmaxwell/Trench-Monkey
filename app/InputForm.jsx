// InputForm.jsx — The 4-input entry screen.
const { useState: useIS, useEffect: useIE } = React;

function InputForm({ onSubmit }) {
  const [url, setUrl] = useIS("magnet.co.uk");
  const [industry, setIndustry] = useIS("Home improvement · Fitted kitchens");
  const [competitors, setCompetitors] = useIS(["Wren Kitchens", "Howdens", "IKEA", "B&Q", "Wickes"]);
  const [draft, setDraft] = useIS("");
  const [budget, setBudget] = useIS("150,000");
  const [budgetCadence, setBudgetCadence] = useIS("monthly");

  useIE(() => { if (window.lucide) window.lucide.createIcons(); });

  const removeChip = (i) => setCompetitors(c => c.filter((_, idx) => idx !== i));
  const addChip = () => {
    const v = draft.trim();
    if (!v) return;
    setCompetitors(c => c.includes(v) ? c : [...c, v]);
    setDraft("");
  };
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip();
    } else if (e.key === "Backspace" && !draft && competitors.length) {
      removeChip(competitors.length - 1);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ url, industry, competitors, budget, budgetCadence });
  };

  return (
    <main className="input-screen" data-screen-label="01 Input">
      <form className="input-card" onSubmit={submit}>
        <div className="input-card__rule" />
        <div className="input-card__eyebrow">New analysis</div>
        <h1 className="input-card__title">Tell Trench Monkey about your prospect.</h1>
        <p className="input-card__sub">
          Four fields. Forty seconds. The monkey researches the market, segments the audience,
          positions against competitors, splits the budget, and hands you a four-phase plan ready to present.
        </p>

        <div className="input-card__form">
          <div className="tm-field">
            <label className="tm-field__lbl">Company URL</label>
            <div className="tm-field__prefix">
              <span className="tm-field__prefix-sym">↗</span>
              <input
                className="tm-field__input"
                placeholder="magnet.co.uk"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <span className="tm-field__hint">We'll scrape positioning, tech stack, and content inventory.</span>
          </div>

          <div className="tm-field">
            <label className="tm-field__lbl">Industry</label>
            <select className="tm-field__input" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option>Home improvement · Fitted kitchens</option>
              <option>SaaS &amp; technology</option>
              <option>Retail &amp; eCommerce</option>
              <option>Financial services</option>
              <option>Hospitality</option>
              <option>Healthcare</option>
              <option>Wellness &amp; lifestyle</option>
              <option>Professional services</option>
            </select>
            <span className="tm-field__hint">Anchors the market size, trends, and benchmarks.</span>
          </div>

          <div className="tm-field tm-field--full">
            <label className="tm-field__lbl">Competitors <span style={{ color: "var(--tm-text-muted)", fontWeight: 400 }}>· comma or Enter to add</span></label>
            <div className="tm-chiprow">
              {competitors.map((c, i) => (
                <span key={i} className="tm-chip">
                  {c}
                  <button type="button" className="tm-chip__x" onClick={() => removeChip(i)} aria-label={`Remove ${c}`}>
                    <i data-lucide="x" style={{ width: 12, height: 12 }}></i>
                  </button>
                </span>
              ))}
              <input
                className="tm-chiprow__input"
                placeholder={competitors.length ? "Add another…" : "e.g. Wren Kitchens"}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                onBlur={addChip}
              />
            </div>
            <span className="tm-field__hint">We'll benchmark traffic, share-of-voice, messaging, and content cadence against these.</span>
          </div>

          <div className="tm-field">
            <label className="tm-field__lbl">Marketing budget</label>
            <div className="tm-field__prefix">
              <span className="tm-field__prefix-sym">£</span>
              <input
                className="tm-field__input"
                placeholder="150,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <span className="tm-field__hint">We split this across channels in your output.</span>
          </div>

          <div className="tm-field">
            <label className="tm-field__lbl">Cadence</label>
            <select className="tm-field__input" value={budgetCadence} onChange={(e) => setBudgetCadence(e.target.value)}>
              <option value="monthly">Per month</option>
              <option value="quarterly">Per quarter</option>
              <option value="annual">Per year</option>
            </select>
            <span className="tm-field__hint">Time-box for the allocation in Phase 3.</span>
          </div>

          <div className="input-card__actions">
            <span className="input-card__hint">
              <i data-lucide="shield" style={{ width: 14, height: 14 }}></i>
              Your inputs are never sent to our servers — local processing only.
            </span>
            <button type="submit" className="tm-btn tm-btn--primary tm-btn--lg">
              <span>Generate plan</span>
              <i data-lucide="arrow-right" className="tm-btn__ic"></i>
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

window.InputForm = InputForm;
