// Report.jsx — Sidebar-nav report shell. Sections are anchor-linked.
import React, { useState as useRS, useEffect as useRE, useRef as useRR } from 'react';
import { Icon, useLucide } from './visuals';
import { DiagnosisPhase, StrategyPhase, TacticsPhase, MeasurementPhase } from './phases';

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

function Sidebar({ activePhase, setActivePhase, activeSub, scrollToSub, layout, brand, onExport, onShare }) {
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
                      aria-current={activeSub === s.id ? "true" : undefined}
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
        <button className="tm-btn tm-btn--secondary tm-btn--sm" style={{ justifyContent: "center" }} onClick={onExport}>
          <Icon name="download" size={14} /> Export PDF
        </button>
        <button className="tm-btn tm-btn--ghost tm-btn--sm" style={{ justifyContent: "center" }} onClick={onShare}>
          <Icon name="share-2" size={14} /> Copy summary
        </button>
      </div>
    </aside>
  );
}

function TopBar({ brand, onNew, genSeconds }) {
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
        {genSeconds != null && (
          <span style={{ color: "var(--tm-text-muted)" }}>· generated in {genSeconds.toFixed(1)}s</span>
        )}
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

// Plain-text / Markdown digest of a report, for the "Copy summary" button.
function magnetToMarkdown(d) {
  const b = d.brand || {};
  const L = [];
  const push = (...lines) => L.push(...lines);
  push('# ' + (b.name || 'Marketing plan') + ' — Market Intelligence');
  if (b.tagline) push('> ' + b.tagline);
  if (b.url) push('Site: ' + b.url);
  push('', '## Executive summary');
  (d.diagnosis?.summary || []).filter(Boolean).forEach(s => push('- ' + s));
  const ns = d.strategy?.northStar || {};
  push('', '## North-star metric',
       '- ' + (ns.metric || '') + (ns.target != null ? ' → target ' + ns.target : ''));
  if (ns.rationale) push('  ' + ns.rationale);
  if (d.strategy?.positioning?.statement) push('', '## Positioning', '"' + d.strategy.positioning.statement + '"');
  push('', '## Audience');
  (d.strategy?.audience?.segments || []).forEach(s => push('- ' + s.name + ' (' + s.pct + '%)'));
  push('', '## Budget split');
  (d.tactics?.allocations || []).forEach(a => push('- ' + a.name + ': ' + a.pct + '%' + (a.sub ? ' — ' + a.sub : '')));
  push('', '## KPIs');
  (d.measurement?.kpis || []).forEach(k => push('- ' + k.label + ': ' + k.value + (k.delta ? ' (' + k.delta + ')' : '')));
  push('', '_Generated by Trench Monkey._');
  return L.join('\n');
}

async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) { /* fall through to legacy path */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (_) { return false; }
}

function Report({ data, layout = "sidebar", onNewPlan, genSeconds }) {
  const [activePhase, setActivePhase] = useRS("diagnosis");
  const [activeSub, setActiveSub] = useRS("d-summary");
  const [printing, setPrinting] = useRS(false);
  const [toast, setToast] = useRS("");
  const mainRef = useRR(null);

  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  // Export to PDF: render every phase, then hand off to the browser print dialog
  // ("Save as PDF"). A print stylesheet hides the chrome and expands the report.
  const handleExport = () => setPrinting(true);
  useRE(() => {
    if (!printing) return;
    const done = () => setPrinting(false);
    window.addEventListener("afterprint", done);
    const t = setTimeout(() => { try { window.print(); } catch (_) {} }, 250);
    return () => { clearTimeout(t); window.removeEventListener("afterprint", done); };
  }, [printing]);

  const handleShare = async () => {
    const ok = await copyText(magnetToMarkdown(data));
    flashToast(ok ? "Report summary copied to clipboard" : "Couldn't copy — check browser permissions");
  };

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

  const showAll = layout === "scroll" || printing;

  return (
    <React.Fragment>
      <TopBar brand={data.brand} onNew={onNewPlan} genSeconds={genSeconds} />
      {layout === "tabs" && <TabsBar activePhase={activePhase} setActivePhase={setActivePhase} />}
      <div className={"report" + (printing ? " report--printing" : "")} data-screen-label={`03 Report — ${activePhase}`}>
        {layout !== "tabs" && (
          <Sidebar
            activePhase={activePhase}
            setActivePhase={setActivePhase}
            activeSub={activeSub}
            scrollToSub={scrollToSub}
            layout={layout}
            brand={data.brand}
            onExport={handleExport}
            onShare={handleShare}
          />
        )}
        <div className="report__main" ref={mainRef}>
          <div className="report__inner">
            {showAll ? (
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
      {toast && <div className="tm-toast" role="status">{toast}</div>}
    </React.Fragment>
  );
}

export { Report, PHASES };
