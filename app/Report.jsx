// Report.jsx — Sidebar-nav report shell. Sections are anchor-linked.
const { useState: useRS, useEffect: useRE, useRef: useRR } = React;

const PHASES = [
  {
    id: "diagnosis", num: "01", label: "Diagnosis", icon: "stethoscope",
    sub: [
      { id: "d-summary",     label: "Executive summary" },
      { id: "d-audit",       label: "Company audit" },
      { id: "d-market",      label: "Market context" },
      { id: "d-competitors", label: "Competitive landscape" },
      { id: "d-swot",        label: "SWOT synthesis" }
    ]
  },
  {
    id: "strategy", num: "02", label: "Strategy", icon: "compass",
    sub: [
      { id: "s-northstar",   label: "North-star metric" },
      { id: "s-goals",       label: "Goals & objectives" },
      { id: "s-positioning", label: "Positioning" },
      { id: "s-audience",    label: "Audience" },
      { id: "s-channels",    label: "Channels" },
      { id: "s-roadmap",     label: "30/60/90 roadmap" }
    ]
  },
  {
    id: "tactics", num: "03", label: "Tactics", icon: "wrench",
    sub: [
      { id: "t-budget",       label: "Budget allocation" },
      { id: "t-content",      label: "Content" },
      { id: "t-paid",         label: "Paid media" },
      { id: "t-organic",      label: "Organic social" },
      { id: "t-email",        label: "Email & lifecycle" },
      { id: "t-seo",          label: "SEO" },
      { id: "t-cro",          label: "CRO" },
      { id: "t-partnerships", label: "Partnerships" },
      { id: "t-stack",        label: "Tools & stack" }
    ]
  },
  {
    id: "measurement", num: "04", label: "Measurement", icon: "line-chart",
    sub: [
      { id: "m-kpis",      label: "KPI framework" },
      { id: "m-funnel",    label: "Funnel & attribution" },
      { id: "m-reporting", label: "Reporting cadence" },
      { id: "m-testing",   label: "Testing framework" },
      { id: "m-risks",     label: "Early warnings" }
    ]
  }
];

function Sidebar({ activePhase, setActivePhase, activeSub, scrollToSub, layout, brand }) {
  const isScroll = layout === "scroll";
  const initial = (brand.name || "").split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <aside className="report__sidebar">
      <div className="sidebar__head">
        <div className="sidebar__company">
          <div className="sidebar__company-fav">{initial || "MK"}</div>
          <div style={{ minWidth: 0 }}>
            <div className="sidebar__company-name">{brand.name}</div>
            <div className="sidebar__company-url">{brand.url}</div>
          </div>
        </div>
      </div>
      <nav className="sidebar__nav">
        {PHASES.map(p => {
          const isActive = activePhase === p.id;
          const isOpen = isActive || isScroll;
          return (
            <div className="sidebar__phase" key={p.id}>
              <button
                className={"sidebar__phase-btn" + (isActive ? " sidebar__phase-btn--active" : "") + (isOpen ? " sidebar__phase-btn--open" : "")}
                onClick={() => setActivePhase(p.id)}
              >
                <span className="sidebar__phase-num">{p.num}</span>
                <span className="sidebar__phase-label">{p.label}</span>
                <span className="sidebar__phase-caret"><Icon name="chevron-right" size={14} /></span>
              </button>
              {isOpen && (
                <div className="sidebar__subnav">
                  {p.sub.map(s => (
                    <button
                      key={s.id}
                      className={"sidebar__sub" + (activeSub === s.id ? " sidebar__sub--active" : "")}
                      onClick={() => { setActivePhase(p.id); setTimeout(() => scrollToSub(s.id), isActive ? 0 : 120); }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="sidebar__foot">
        <button className="tm-btn tm-btn--secondary tm-btn--sm" style={{ justifyContent: "center" }}>
          <Icon name="download" size={14} /> Export PDF
        </button>
        <button className="tm-btn tm-btn--ghost tm-btn--sm" style={{ justifyContent: "center" }}>
          <Icon name="share-2" size={14} /> Share with team
        </button>
      </div>
    </aside>
  );
}

function TopBar({ brand, onNew }) {
  useLucide();
  return (
    <header className="app-header">
      <a className="tm-lockup" href="#">
        <span className="tm-lockup__logo"><img src="app/assets/monkey-logo.png" alt="Trench Monkey" /></span>
        <span className="tm-lockup__word">
          <span className="blue">Trench</span> <span className="orange">Monkey</span>
        </span>
      </a>
      <div className="app-header__breadcrumb">
        <Icon name="folder-open" size={14} />
        <span>Plans</span>
        <Icon name="chevron-right" size={12} />
        <strong>{brand.name}</strong>
        <span style={{ color: "var(--tm-text-muted)" }}>· generated in 4.7s</span>
      </div>
      <div className="app-header__spacer" />
      <div className="app-header__actions">
        <button className="tm-iconbtn" title="History"><Icon name="history" size={18} /></button>
        <button className="tm-iconbtn" title="Settings"><Icon name="settings" size={18} /></button>
        <button className="tm-btn tm-btn--secondary tm-btn--sm" onClick={onNew} style={{ marginLeft: 4 }}>
          <Icon name="plus" size={14} /> New plan
        </button>
      </div>
    </header>
  );
}

function TabsBar({ activePhase, setActivePhase }) {
  useLucide();
  return (
    <div className="tabs-bar">
      {PHASES.map((p, i) => (
        <button
          key={p.id}
          className={"tabs-bar__tab" + (activePhase === p.id ? " tabs-bar__tab--active" : "")}
          onClick={() => setActivePhase(p.id)}
        >
          <span className="tabs-bar__num">{p.num}</span>
          {p.label}
        </button>
      ))}
    </div>
  );
}

function Report({ data, layout = "sidebar", onNewPlan }) {
  const [activePhase, setActivePhase] = useRS("diagnosis");
  const [activeSub, setActiveSub] = useRS("d-summary");
  const mainRef = useRR(null);

  const scrollToSub = (id) => {
    const el = document.getElementById(id);
    if (!el || !mainRef.current) return;
    const offset = el.getBoundingClientRect().top - mainRef.current.getBoundingClientRect().top + mainRef.current.scrollTop - 24;
    mainRef.current.scrollTo({ top: offset, behavior: "smooth" });
  };

  // Scroll-spy in scroll mode
  useRE(() => {
    if (layout !== "scroll") return;
    const main = mainRef.current;
    if (!main) return;
    const all = [];
    PHASES.forEach(p => p.sub.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) all.push({ phaseId: p.id, subId: s.id, el });
    }));
    const onScroll = () => {
      const tops = all.map(a => ({ ...a, top: a.el.getBoundingClientRect().top - main.getBoundingClientRect().top }));
      // find last with top <= 100
      const cur = [...tops].reverse().find(t => t.top <= 80) || tops[0];
      if (cur) {
        setActivePhase(cur.phaseId);
        setActiveSub(cur.subId);
      }
    };
    main.addEventListener("scroll", onScroll);
    onScroll();
    return () => main.removeEventListener("scroll", onScroll);
  }, [layout]);

  // Reset scroll when phase changes (sidebar mode only)
  useRE(() => {
    if (layout === "scroll") return;
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "instant" in document.documentElement ? "instant" : "auto" });
    const firstSub = PHASES.find(p => p.id === activePhase).sub[0].id;
    setActiveSub(firstSub);
  }, [activePhase, layout]);

  // Render the right phase(s)
  const Phase = ({ id }) => {
    if (id === "diagnosis") return <DiagnosisPhase />;
    if (id === "strategy") return <StrategyPhase />;
    if (id === "tactics") return <TacticsPhase />;
    if (id === "measurement") return <MeasurementPhase />;
    return null;
  };

  return (
    <React.Fragment>
      <TopBar brand={data.brand} onNew={onNewPlan} />
      {layout === "tabs" && <TabsBar activePhase={activePhase} setActivePhase={setActivePhase} />}
      <div className={"report"} data-screen-label={`03 Report — ${activePhase}`}>
        {layout !== "tabs" && (
          <Sidebar
            activePhase={activePhase}
            setActivePhase={setActivePhase}
            activeSub={activeSub}
            scrollToSub={scrollToSub}
            layout={layout}
            brand={data.brand}
          />
        )}
        <div className="report__main" ref={mainRef}>
          <div className="report__inner">
            {layout === "scroll" ? (
              <React.Fragment>
                <Phase id="diagnosis" />
                <Phase id="strategy" />
                <Phase id="tactics" />
                <Phase id="measurement" />
              </React.Fragment>
            ) : (
              <Phase id={activePhase} />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

window.Report = Report;
window.PHASES = PHASES;
