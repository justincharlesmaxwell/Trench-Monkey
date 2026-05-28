// InputForm.jsx — Studio marketing homepage + functional prospect brief form.
const { useState: useIS, useEffect: useIE, useRef: useIR } = React;

const ST_PALETTE = { blue: "#17a8f1", orange: "#ff9614", navy: "#094cb2", green: "#1e9e5b" };

const SAMPLE_BUDGET = [
  { name: "Paid social",   pct: 28, key: "blue"   },
  { name: "Paid search",   pct: 22, key: "orange" },
  { name: "SEO & content", pct: 18, key: "green"  },
  { name: "Email & CRM",   pct: 12, key: "blue"   },
  { name: "Partnerships",  pct: 10, key: "orange" },
  { name: "Brand",         pct: 10, key: "navy"   },
];

const SAMPLE_AUDIENCE = [
  { name: "Renovators, 35–54",        pct: 42 },
  { name: "First-time buyers, 28–40", pct: 28 },
  { name: "Trade professionals",      pct: 18 },
  { name: "Interior designers",       pct: 12 },
];

function HeroDonut() {
  const r = 14, C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 40 40" className="st-donut__svg">
      <circle cx="20" cy="20" r={r} fill="none" stroke="#eef0f5" strokeWidth="6" />
      {SAMPLE_BUDGET.map((d, i) => {
        const len = (d.pct / 100) * C;
        const seg = (
          <circle key={i} cx="20" cy="20" r={r} fill="none"
            stroke={ST_PALETTE[d.key]} strokeWidth="6"
            strokeDasharray={`${len} ${C}`} strokeDashoffset={-offset}
            transform="rotate(-90 20 20)" strokeLinecap="butt" />
        );
        offset += len;
        return seg;
      })}
      <text x="20" y="21" textAnchor="middle" fontSize="6" fontWeight="700" fill="#0c1426" fontFamily="Fredoka">£150K</text>
      <text x="20" y="27" textAnchor="middle" fontSize="3" fill="#7e8499" fontFamily="Plus Jakarta Sans" letterSpacing="0.1em">PER MO</text>
    </svg>
  );
}

function InputForm({ onSubmit }) {
  const [url,         setUrl]         = useIS("");
  const [industry,    setIndustry]    = useIS("");
  const [competitors, setCompetitors] = useIS([]);
  const [draft,       setDraft]       = useIS("");
  const [budget,      setBudget]      = useIS("");
  const [formError,   setFormError]   = useIS("");
  const formRef = useIR(null);

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
    if (!url.trim())      { setFormError("Please enter a company URL.");          return; }
    if (!industry.trim()) { setFormError("Please enter the industry.");           return; }
    if (!budget.trim())   { setFormError("Please enter a marketing budget.");     return; }
    const budgetNum = parseFloat(String(budget).replace(/[^0-9.]/g, ""));
    if (isNaN(budgetNum) || budgetNum <= 0) { setFormError("Please enter a valid budget number."); return; }
    onSubmit({ url: url.trim(), industry: industry.trim(), competitors, budget: budgetNum, currencySymbol: "£" });
  };

  const scrollToForm = () => {
    if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="dir-studio" style={{ flex: 1, overflowY: "auto" }}>

      {/* ── NAV ───────────────────────────────────────────────── */}
      <header className="st-nav">
        <div className="st-nav__brand">
          <div className="st-nav__brand-logo">
            <img src="app/assets/monkey-logo.png" alt="Trench Monkey" />
          </div>
          <div className="st-nav__brand-word">
            <span className="b">Trench</span>{" "}<span className="o">Monkey</span>
          </div>
        </div>
        <nav className="st-nav__center">
          <a className="active" href="#">Product</a>
          <a href="#">How it works</a>
          <a href="#">Pricing</a>
          <a href="#">Customers</a>
        </nav>
        <div className="st-nav__right">
          <button className="st-btn st-btn--primary" onClick={scrollToForm}>
            Start a brief
            <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
          </button>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="st-hero">
        <div>
          <div className="st-hero__eyebrow">
            <span className="tag">NEW</span>
            <span>Live competitor benchmarks · v3.2</span>
          </div>
          <h1 className="st-hero__h">
            World-class<br />
            market intelligence,<br />
            in <span className="o">forty seconds</span>.
          </h1>
          <p className="st-hero__sub">
            Give Trench Monkey four inputs — URL, industry, competitors, budget — and receive a four-phase marketing plan: diagnosis, strategy, tactics, and measurement. Grounded in live data, cited inline, ready to present.
          </p>
          <div className="st-hero__actions">
            <button className="st-btn st-btn--orange st-btn--lg" onClick={scrollToForm}>
              Start a brief — free
              <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
            </button>
            <button className="st-btn st-btn--ghost st-btn--lg" onClick={scrollToForm}>
              Watch a sample
            </button>
          </div>
          <div className="st-hero__trust">
            <div className="avatars">
              <span /><span /><span /><span />
            </div>
            <span><strong>2,400+</strong> growth teams shipping with Trench Monkey</span>
            <span className="dot" />
            <span><strong>4.9★</strong> on G2</span>
          </div>
        </div>

        {/* Product preview */}
        <div className="st-preview">
          <div className="st-preview__chrome">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <span className="url">trenchmonkey.app/plans/magnet-kitchens</span>
          </div>
          <div className="st-preview__body">
            <aside className="st-preview__rail">
              <div className="st-preview__brand">
                <div className="st-preview__brand-logo">M</div>
                <div>
                  <div className="st-preview__brand-name">Magnet</div>
                  <div className="st-preview__brand-url">magnet.co.uk</div>
                </div>
              </div>
              {[
                { num: "01", label: "Diagnosis" },
                { num: "02", label: "Strategy" },
                { num: "03", label: "Tactics", active: true },
                { num: "04", label: "Measurement" },
              ].map((p) => (
                <div key={p.num} className={"st-preview__phase" + (p.active ? " st-preview__phase--active" : "")}>
                  <span className="num">{p.num}</span>
                  <span>{p.label}</span>
                  {p.active && <span className="dot" />}
                </div>
              ))}
            </aside>
            <div className="st-preview__main">
              <div className="st-preview__crumb">
                <span>Tactics</span><span>›</span>
                <strong>Budget allocation</strong>
              </div>
              <h3 className="st-preview__title">
                Channel split, optimised for category demand and competitor share-of-voice.
              </h3>
              <div className="st-preview__grid">
                <div className="st-pmod">
                  <div className="st-pmod__h">
                    <span>Budget split</span>
                    <span className="v">£150K / mo</span>
                  </div>
                  <div className="st-donut">
                    <HeroDonut />
                    <div className="st-donut__legend">
                      {SAMPLE_BUDGET.map((d, i) => (
                        <div key={i} className="row">
                          <span className="sw" style={{ background: ST_PALETTE[d.key] }} />
                          <span className="lbl">{d.name}</span>
                          <span className="pct">{d.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="st-pmod">
                  <div className="st-pmod__h">
                    <span>Audience</span>
                    <span className="v">4 segments</span>
                  </div>
                  <div className="st-bars">
                    {SAMPLE_AUDIENCE.map((a, i) => (
                      <div className="st-bar" key={i}>
                        <div className="st-bar__top">
                          <span className="l">{a.name}</span>
                          <span className="v">{a.pct}%</span>
                        </div>
                        <div className="st-bar__track">
                          <div className="st-bar__fill" style={{ width: `${a.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="st-preview__foot">
                <div className="badge">
                  <div className="v">27.3<span style={{ fontSize: 10, color: "var(--st-muted)" }}>s</span></div>
                  <div className="l">Run time</div>
                </div>
                <div className="badge">
                  <div className="v">18</div>
                  <div className="l">Data feeds</div>
                </div>
                <div className="badge">
                  <div className="v" style={{ color: "var(--st-blue)" }}>100%</div>
                  <div className="l">Cited inline</div>
                </div>
              </div>
            </div>
          </div>
          <div className="st-preview__pop">
            <span className="ic">↑</span>
            Share of voice <span className="pct">+11.4%</span>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────── */}
      <section className="st-stats">
        <div className="st-stat">
          <div className="v"><span className="b">27.3s</span></div>
          <div className="l">Median time to plan</div>
        </div>
        <div className="st-stat">
          <div className="v"><span className="o">82,401</span></div>
          <div className="l">Plans shipped</div>
        </div>
        <div className="st-stat">
          <div className="v"><span className="g">18</span></div>
          <div className="l">Live data feeds</div>
        </div>
        <div className="st-stat">
          <div className="v"><span className="n">99.97%</span></div>
          <div className="l">Uptime</div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="st-features">
        <div className="st-features__head">
          <div>
            <div className="st-features__eb">The platform</div>
            <h2 className="st-features__title">
              Three commitments behind every <span className="o">plan</span>.
            </h2>
          </div>
          <p className="st-features__sub">
            Trench Monkey isn't a template gallery — it's a research engine that writes the plan, with the receipts on hand.
          </p>
        </div>
        <div className="st-features__grid">
          <article className="st-feat">
            <div className="st-feat__icon">
              <i data-lucide="bar-chart-3" style={{ width: 22, height: 22 }}></i>
            </div>
            <h3 className="st-feat__title">Grounded in live market data.</h3>
            <p className="st-feat__body">
              Every recommendation is built from current competitor benchmarks, share-of-voice movement and category search demand — cited inline, refreshed every morning at 04:00 GMT.
            </p>
            <div className="st-feat__foot">
              <span>FEEDS · <span className="k">18 live</span></span>
              <span>CITED · <span className="k">100%</span></span>
            </div>
          </article>
          <article className="st-feat">
            <div className="st-feat__icon">
              <i data-lucide="zap" style={{ width: 22, height: 22 }}></i>
            </div>
            <h3 className="st-feat__title">A presentable plan in under thirty seconds.</h3>
            <p className="st-feat__body">
              Submit a brief; the plan is back before your kettle clicks. Market context, audience segments, competitor positioning, channel split and a 30/60/90 roadmap — start to finish, no waiting.
            </p>
            <div className="st-feat__foot">
              <span>MEDIAN · <span className="k">27.3s</span></span>
              <span>P95 · <span className="k">41.0s</span></span>
            </div>
          </article>
          <article className="st-feat">
            <div className="st-feat__icon">
              <i data-lucide="shield" style={{ width: 22, height: 22 }}></i>
            </div>
            <h3 className="st-feat__title">Your inputs stay on your machine.</h3>
            <p className="st-feat__body">
              Briefs are processed locally. We don't store your prospect data, we don't train on it, we don't share it. Close the tab and the workspace is gone.
            </p>
            <div className="st-feat__foot">
              <span>LOCAL · <span className="k">ONLY</span></span>
              <span>SOC 2 · <span className="k">PENDING</span></span>
            </div>
          </article>
        </div>
      </section>

      {/* ── SAMPLE PLAN PREVIEW ───────────────────────────────── */}
      <section className="st-plan">
        <div className="st-plan__head">
          <h2 className="st-plan__h">
            What you walk into the boardroom with — a{" "}
            <span className="b">four-phase plan</span>, ready to{" "}
            <span className="o">present</span>.
          </h2>
          <div className="st-plan__tabs">
            <button className="st-plan__tab"><span className="n">01</span>Diagnosis</button>
            <button className="st-plan__tab"><span className="n">02</span>Strategy</button>
            <button className="st-plan__tab st-plan__tab--active"><span className="n">03</span>Tactics</button>
            <button className="st-plan__tab"><span className="n">04</span>Measurement</button>
          </div>
        </div>
        <div className="st-plan__card">
          <div className="st-plan-mod">
            <div className="st-plan-mod__h">
              <span className="l">Channel split</span>
              <span className="r">£150K · monthly</span>
            </div>
            <div className="st-split-bar">
              {SAMPLE_BUDGET.map((d, i) => (
                <div key={i} style={{ flex: d.pct, background: ST_PALETTE[d.key] }} />
              ))}
            </div>
            <div className="st-split-list">
              {SAMPLE_BUDGET.map((d, i) => (
                <div className="row" key={i}>
                  <span className="sw" style={{ background: ST_PALETTE[d.key] }} />
                  <span className="name">{d.name}</span>
                  <span className="pct">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="st-plan-mod">
            <div className="st-plan-mod__h">
              <span className="l">Audience segments</span>
              <span className="r">4 priority</span>
            </div>
            <div className="st-aud">
              {SAMPLE_AUDIENCE.map((a, i) => (
                <div className="st-aud__row" key={i}>
                  <div className="st-aud__top">
                    <span className="st-aud__name">{a.name}</span>
                    <span className="st-aud__pct">{a.pct}%</span>
                  </div>
                  <div className="st-aud__bar">
                    <div className="st-aud__fill" style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="st-plan-mod">
            <div className="st-plan-mod__h">
              <span className="l">30 / 60 / 90 roadmap</span>
              <span className="r">3 horizons</span>
            </div>
            <div className="st-roadmap">
              <div className="st-roadmap__row">
                <div className="st-roadmap__pill">30 days</div>
                <div className="st-roadmap__txt">
                  Land <strong>showroom-finder SEO</strong>, ship two consideration-phase landing pages, brief paid social agency on Q3 angle.
                </div>
              </div>
              <div className="st-roadmap__row">
                <div className="st-roadmap__pill">60 days</div>
                <div className="st-roadmap__txt">
                  Launch <strong>first-time-buyer creative suite</strong>, recover abandoned-quote audience, baseline category brand-track.
                </div>
              </div>
              <div className="st-roadmap__row">
                <div className="st-roadmap__pill">90 days</div>
                <div className="st-roadmap__txt">
                  Open <strong>trade-pro partner programme</strong>, retest pricing page, measurement readout to board.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ───────────────────────────────────────── */}
      <section className="st-testi">
        <div>
          <p className="st-testi__quote">
            <span className="mark">"</span>The last six pitch decks we won were Trench Monkey first drafts. The hard part used to be the research; now the hard part is just deciding which prospect to brief next.<span className="mark">"</span>
          </p>
          <div className="st-testi__attr">
            <div className="st-testi__avatar" />
            <div>
              <div className="st-testi__name">Anya Mensah</div>
              <div className="st-testi__role">VP Growth · Northwind</div>
            </div>
          </div>
        </div>
        <div className="st-testi__metrics">
          <div className="st-metric">
            <div className="st-metric__v"><span className="o">14×</span></div>
            <div className="st-metric__l">faster from brief to presentable plan.</div>
          </div>
          <div className="st-metric">
            <div className="st-metric__v"><span className="b">+38%</span></div>
            <div className="st-metric__l">pitch-to-close on inbound briefs.</div>
          </div>
          <div className="st-metric">
            <div className="st-metric__v">27.3s</div>
            <div className="st-metric__l">median time from submit to plan.</div>
          </div>
          <div className="st-metric">
            <div className="st-metric__v"><span className="o">£0</span></div>
            <div className="st-metric__l">spend on stock-template subscriptions, retired.</div>
          </div>
        </div>
      </section>

      {/* ── FORM ──────────────────────────────────────────────── */}
      <section className="st-form-section" ref={formRef}>
        <div className="st-form-section__inner">
          <div className="st-form-section__head">
            <div className="st-features__eb">Start a brief</div>
            <h2 className="st-form-section__title">
              Brief the <span className="o">monkey</span>.
            </h2>
            <p style={{ marginTop: 12, fontSize: 15, color: "var(--st-text)", lineHeight: 1.55 }}>
              Four fields. Forty seconds. A four-phase plan ready to present.
            </p>
          </div>

          <div className="st-form-card">
            <form onSubmit={submit}>
              <div className="st-form-grid">
                <div className="st-field">
                  <label className="st-field__lbl">
                    Company URL <span className="opt">required</span>
                  </label>
                  <div className="st-input">
                    <span className="sym">↗</span>
                    <input
                      type="text"
                      placeholder="e.g. magnet.co.uk"
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                    />
                  </div>
                  <div className="st-field__hint">We'll research their positioning, market, and competitors.</div>
                </div>

                <div className="st-field">
                  <label className="st-field__lbl">
                    Industry <span className="opt">required</span>
                  </label>
                  <div className="st-input">
                    <input
                      type="text"
                      placeholder="e.g. Home improvement · Fitted kitchens"
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                    />
                  </div>
                  <div className="st-field__hint">Anchors market size, trends, and category benchmarks.</div>
                </div>

                <div className="st-field st-field--full">
                  <label className="st-field__lbl">
                    Competitors{" "}
                    <span className="opt">{competitors.length} added · comma or Enter to add</span>
                  </label>
                  <div className="st-chiprow">
                    {competitors.map((c, i) => (
                      <span key={i} className="st-chip">
                        {c}
                        <button type="button" className="st-chip__x" onClick={() => removeChip(i)} aria-label={"Remove " + c}>×</button>
                      </span>
                    ))}
                    <input
                      className="st-chiprow__input"
                      placeholder={competitors.length ? "Add another…" : "e.g. Competitor X, Competitor Y"}
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      onKeyDown={onKey}
                      onBlur={addChip}
                    />
                  </div>
                  <div className="st-field__hint">We'll benchmark positioning, messaging, and digital presence against these.</div>
                </div>

                <div className="st-field">
                  <label className="st-field__lbl">
                    Marketing budget <span className="opt">required</span>
                  </label>
                  <div className="st-input">
                    <span className="sym">£</span>
                    <input
                      type="text"
                      placeholder="150,000"
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                    />
                  </div>
                  <div className="st-field__hint">Split across channels in Phase 03 — Tactics.</div>
                </div>
              </div>

              {formError && <div className="st-form-error">{formError}</div>}

              <div className="st-form-card__foot">
                <span className="st-form-card__note">
                  <span className="lock">
                    <i data-lucide="lock" style={{ width: 11, height: 11 }}></i>
                  </span>
                  Inputs processed locally — never sent to our servers.
                </span>
                <button type="submit" className="st-submit">
                  Generate plan
                  <span className="arr">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="st-footer">
        <span>© 2026 Trench Monkey Ltd · London</span>
        <span>
          <a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Security</a> · <a href="#">Status</a>
        </span>
      </footer>

    </div>
  );
}

window.InputForm = InputForm;
