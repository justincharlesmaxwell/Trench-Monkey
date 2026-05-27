// PitchComposer.jsx — INFERRED form for entering prospect details.
// Not visible in screenshots; reconstructed from the hero copy promising
// "enter your prospect's details" → market intelligence output.

const { useState: useComposerState, useEffect: useComposerEffect } = React;

function PitchComposer({ onGenerate }) {
  const [name, setName] = useComposerState("");
  const [industry, setIndustry] = useComposerState("Wellness & lifestyle");
  const [budget, setBudget] = useComposerState("");
  const [audience, setAudience] = useComposerState("");
  const [loading, setLoading] = useComposerState(false);

  useComposerEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onGenerate && onGenerate({ name, industry, budget, audience }); }, 1400);
  };

  return (
    <section className="tm-composer">
      <div className="tm-composer__head">
        <div className="tm-eyebrow">NEW PITCH</div>
        <h2 className="tm-composer__title">Tell Trench Monkey about your prospect</h2>
        <p className="tm-composer__sub">
          Four fields. 40 seconds. The monkey handles the digging.
        </p>
      </div>
      <form className="tm-composer__form" onSubmit={submit}>
        <div className="tm-field">
          <label className="tm-field__lbl">Prospect name</label>
          <input
            className="tm-field__input"
            placeholder="e.g. Lumen Yoga Studios"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="tm-field">
          <label className="tm-field__lbl">Industry</label>
          <select className="tm-field__input" value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option>Wellness &amp; lifestyle</option>
            <option>SaaS &amp; technology</option>
            <option>Retail &amp; eCommerce</option>
            <option>Financial services</option>
            <option>Hospitality</option>
            <option>Healthcare</option>
          </select>
        </div>
        <div className="tm-field">
          <label className="tm-field__lbl">Budget (USD)</label>
          <input
            className="tm-field__input"
            placeholder="$25,000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <span className="tm-field__help">We split this across channels in your output.</span>
        </div>
        <div className="tm-field tm-field--full">
          <label className="tm-field__lbl">Audience notes <span className="tm-field__optional">(optional)</span></label>
          <textarea
            className="tm-field__input tm-field__input--ta"
            rows="3"
            placeholder="Anything you already know about who they sell to."
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          ></textarea>
        </div>
        <div className="tm-composer__actions">
          <button type="button" className="tm-btn tm-btn--ghost tm-btn--md">
            <i data-lucide="rotate-ccw" className="tm-btn__ic"></i><span>Reset</span>
          </button>
          <button type="submit" className="tm-btn tm-btn--primary tm-btn--md" disabled={loading}>
            <i data-lucide={loading ? "loader-2" : "sparkles"} className={"tm-btn__ic " + (loading ? "tm-spin" : "")}></i>
            <span>{loading ? "Researching market…" : "Generate pitch"}</span>
          </button>
        </div>
      </form>
    </section>
  );
}

window.PitchComposer = PitchComposer;
