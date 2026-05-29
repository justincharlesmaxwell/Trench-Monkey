// phases.jsx — The four phase views (Diagnosis, Strategy, Tactics, Measurement).
import React, { useState as useP, useContext } from 'react';
import { MagnetContext } from './context';
import {
  Icon, ExpCard, Tag, Stat,
  QuadMap, SWOT, PersonaCard,
  BudgetDonut, BudgetAllocator,
  Funnel, Roadmap, ChannelMatrix,
  useLucide,
} from './visuals';

function PhaseHead({ eyebrow, title, sub }) {
  return (
    <header className="phase-head" data-screen-label={title}>
      <div className="phase-head__rule" />
      <div className="phase-head__eyebrow">{eyebrow}</div>
      <h1 className="phase-head__title">{title}</h1>
      {sub && <p className="phase-head__sub">{sub}</p>}
    </header>
  );
}

function SectionHead({ title, id }) {
  return (
    <div className="section__head" id={id}>
      <h2 className="section__title">{title}</h2>
    </div>
  );
}

// =================================================================
// PHASE 1 — DIAGNOSIS
// =================================================================
function DiagnosisPhase() {
  const { diagnosis: D, brand: B } = useContext(MagnetContext);
  useLucide();

  return (
    <React.Fragment>
      <PhaseHead
        eyebrow="Phase 1 of 4 · Diagnosis"
        title={"Where " + (B?.name || "the brand") + " stands today"}
        sub="A 360° look at the brand, the market, the competition, and the audience — the baseline every strategy decision in Phase 2 builds on."
      />

      {/* ===== Executive summary ===== */}
      <section className="section" id="d-summary">
        <SectionHead title="Executive summary" />
        <div className="card card--white">
          <div className="card__eyebrow"><Icon name="sparkles" size={14} /> THE MONKEY'S TAKE</div>
          <div className="col-gap-12" style={{ marginTop: 8 }}>
            {D.summary.map((s, i) => (
              <div key={i} className="row-gap-12" style={{ alignItems: "flex-start" }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: i === 0 ? "var(--tm-green)" : i === 1 ? "var(--tm-warning)" : "var(--tm-blue)",
                  color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0
                }}>{i + 1}</span>
                <div style={{ fontSize: 14, color: "var(--tm-ink)", lineHeight: 1.55 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Company audit ===== */}
      <section className="section" id="d-audit">
        <SectionHead title="Company audit" />
        <p className="section__sub">Five-part teardown of what's working and what's costing leads.</p>
        <div className="col-gap-12">
          {D.audit.map((a, i) => (
            <ExpCard key={i} icon={["building-2", "gauge", "file-text", "broadcast", "cpu"][i]}
              title={a.title} meta={a.meta} defaultOpen={i === 0}>
              <p>{a.body}</p>
              <ul>{a.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
            </ExpCard>
          ))}
        </div>
      </section>

      {/* ===== Market context ===== */}
      <section className="section" id="d-market">
        <SectionHead title="Market context" />
        <div className="grid-4" style={{ marginBottom: 20 }}>
          {D.market.stats.map((s, i) => (
            <Stat key={i} label={s.label} value={s.value} caption={s.caption} variant="card" />
          ))}
        </div>
        <div className="grid-2" style={{ gap: 16 }}>
          {D.market.trends.map((t, i) => (
            <div key={i} className="card">
              <div className="card__eyebrow">{t.eyebrow}</div>
              <h3 className="card__title">{t.title}</h3>
              <p className="card__desc">{t.body}</p>
            </div>
          ))}
        </div>
        <div className="card card--white" style={{ marginTop: 16 }}>
          <div className="card__eyebrow"><Icon name="scale" size={14} /> REGULATORY & SEASONAL</div>
          <p className="card__desc" style={{ marginTop: 8 }}>{D.market.regulatory}</p>
        </div>
      </section>

      {/* ===== Competitor landscape ===== */}
      <section className="section" id="d-competitors">
        <SectionHead title="Competitive landscape" />
        <p className="section__sub">{"Hover any dot to see positioning notes. Orange dot is " + (B?.name || "you") + "."}</p>
        <div className="grid-2" style={{ gap: 24, gridTemplateColumns: "1.1fr 0.9fr" }}>
          <QuadMap competitors={D.competitors} />
          <div className="col-gap-12">
            {D.competitors.filter(c => !c.isSelf).map((c, i) => (
              <div key={i} className="card" style={{ padding: "14px 18px" }}>
                <div className="row-between" style={{ marginBottom: 4 }}>
                  <strong style={{ color: "var(--tm-ink)", fontSize: 14 }}>{c.name}</strong>
                  <Tag tone="ghost">{c.price}</Tag>
                </div>
                <div className="row-gap-12" style={{ fontSize: 12, color: "var(--tm-text-muted)", marginBottom: 4 }}>
                  <span><Icon name="globe" size={12} /> {c.traffic}</span>
                  <span><Icon name="award" size={12} /> DA {c.da}</span>
                  <span><Icon name="instagram" size={12} /> {c.ig}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--tm-text)", margin: 0 }}>{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SWOT ===== */}
      <section className="section" id="d-swot">
        <SectionHead title="SWOT synthesis" />
        <SWOT data={D.swot} />
      </section>
    </React.Fragment>
  );
}

// =================================================================
// PHASE 2 — STRATEGY
// =================================================================
function StrategyPhase() {
  const { strategy: S } = useContext(MagnetContext);
  const personas = S.personas || [];
  useLucide();

  return (
    <React.Fragment>
      <PhaseHead
        eyebrow="Phase 2 of 4 · Strategy"
        title="The what, the why, the who"
        sub="Diagnosis translated into direction. Goals, positioning, audience priorities, channel mix, and a 30/60/90 roadmap."
      />

      {/* ===== North star ===== */}
      <section className="section" id="s-northstar">
        <SectionHead title="North-star metric" />
        <div className="card card--white" style={{ display: "flex", alignItems: "center", gap: 32, padding: "28px 32px" }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--tm-eyebrow)", marginBottom: 6 }}>
              {S.northStar.metric}
            </div>
            <div style={{ fontFamily: "var(--tm-font-ui)", fontSize: 56, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--tm-orange)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {S.northStar.target != null ? S.northStar.target.toLocaleString() : "TBC"}
            </div>
            <div style={{ fontSize: 13, color: "var(--tm-text-muted)", marginTop: 6 }}>
              From {S.northStar.current != null ? S.northStar.current.toLocaleString() : "—"} today · {S.northStar.deltaCap}
            </div>
          </div>
          <div style={{ flex: 1, fontSize: 14, color: "var(--tm-text)", lineHeight: 1.6, borderLeft: "1px solid var(--tm-hairline)", paddingLeft: 32 }}>
            {S.northStar.rationale}
          </div>
        </div>
      </section>

      {/* ===== Goals ===== */}
      <section className="section" id="s-goals">
        <SectionHead title="Goals & objectives" />
        <div className="grid-2">
          {S.goals.map((g, i) => (
            <div key={i} className="card card--white">
              <div className="row-between" style={{ marginBottom: 8 }}>
                <div className="card__eyebrow">{g.eyebrow}</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {g.tags.map((t, j) => <Tag key={j} tone="navy">{t}</Tag>)}
                </div>
              </div>
              <h3 className="card__title">{g.title}</h3>
              <p className="card__desc">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Positioning ===== */}
      <section className="section" id="s-positioning">
        <SectionHead title="Positioning & messaging" />
        <div className="card card--white" style={{ marginBottom: 16, background: "var(--tm-ink)", color: "white" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--tm-blue)", marginBottom: 10 }}>
            POSITIONING STATEMENT
          </div>
          <p style={{ fontSize: 19, lineHeight: 1.45, fontWeight: 500, color: "white", margin: 0, letterSpacing: "-0.005em" }}>
            "{S.positioning.statement}"
          </p>
        </div>
        <div className="grid-4">
          {S.positioning.pillars.map((p, i) => (
            <div key={i} className="card">
              <span style={{
                width: 36, height: 36, borderRadius: 8,
                background: "white", color: "var(--tm-navy)",
                display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12
              }}>
                <Icon name={p.icon} size={20} />
              </span>
              <h3 className="card__title">{p.title}</h3>
              <p className="card__desc">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 16, padding: "14px 18px" }}>
          <div className="card__eyebrow"><Icon name="mic" size={14} /> VOICE</div>
          <p className="card__desc" style={{ margin: 0 }}>{S.positioning.voice}</p>
        </div>
      </section>

      {/* ===== Audience strategy / Personas ===== */}
      <section className="section" id="s-audience">
        <SectionHead title="Audience strategy" />
        <p className="section__sub">{S.audience.icp}</p>
        <div className="grid-3" style={{ gap: 16 }}>
          {personas.map((p, i) => <PersonaCard key={i} persona={p} primary={p.isPrimary} />)}
        </div>
      </section>

      {/* ===== Channel matrix ===== */}
      <section className="section" id="s-channels">
        <SectionHead title="Channel strategy" />
        <p className="section__sub">Plotted on effort vs impact. Color codes funnel stage — blue is top, navy mid, orange bottom.</p>
        <div className="grid-2" style={{ gap: 24, gridTemplateColumns: "1.2fr 1fr" }}>
          <ChannelMatrix channels={S.channels} />
          <div className="col-gap-12">
            <div className="card" style={{ padding: "14px 18px" }}>
              <div className="card__eyebrow" style={{ color: "var(--tm-blue)" }}><Icon name="sun" size={14} /> TOP OF FUNNEL</div>
              <p className="card__desc" style={{ margin: "4px 0 0" }}>{S.funnelStrategy.tofu}</p>
            </div>
            <div className="card" style={{ padding: "14px 18px" }}>
              <div className="card__eyebrow" style={{ color: "var(--tm-navy)" }}><Icon name="layout" size={14} /> MIDDLE OF FUNNEL</div>
              <p className="card__desc" style={{ margin: "4px 0 0" }}>{S.funnelStrategy.mofu}</p>
            </div>
            <div className="card" style={{ padding: "14px 18px" }}>
              <div className="card__eyebrow" style={{ color: "var(--tm-orange)" }}><Icon name="target" size={14} /> BOTTOM OF FUNNEL</div>
              <p className="card__desc" style={{ margin: "4px 0 0" }}>{S.funnelStrategy.bofu}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Roadmap ===== */}
      <section className="section" id="s-roadmap">
        <SectionHead title="30 / 60 / 90 roadmap" />
        <Roadmap streams={S.timeline} />
      </section>
    </React.Fragment>
  );
}

// =================================================================
// PHASE 3 — TACTICS
// =================================================================
function TacticsPhase() {
  const { tactics: T, brand } = useContext(MagnetContext);
  const total = brand.budget;
  useLucide();

  const initialAllocs = T.allocations || [];

  const [filter, setFilter] = useP(null);
  const filters = [
    { key: null,        label: "All channels"  },
    { key: "BOFU",      label: "Bottom-funnel" },
    { key: "MOFU",      label: "Middle-funnel" },
    { key: "TOFU",      label: "Top-funnel"    },
    { key: "Retention", label: "Retention"     }
  ];

  return (
    <React.Fragment>
      <PhaseHead
        eyebrow="Phase 3 of 4 · Tactics"
        title="The executional playbook"
        sub="Specific channel-by-channel actions for the next 90 days. Budget allocation is draggable — reorder priority, lock what's set."
      />

      {/* ===== Budget allocation ===== */}
      <section className="section" id="t-budget">
        <SectionHead title="Budget allocation" />
        <p className="section__sub">£{(total / 1000).toFixed(0)}k/month total. Drag rows to re-rank priority. Lock allocations you're committed to.</p>
        <div className="filter-row">
          <span className="filter-row__lbl">Filter by goal</span>
          {filters.map(f => (
            <button
              key={f.key || "all"}
              className={"filter-chip" + (filter === f.key ? " filter-chip--active" : "")}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="budget">
          <div className="donut-wrap">
            <BudgetDonut allocations={initialAllocs} total={total} size={220} stroke={32} />
            <div className="donut-wrap__total">£{(total / 1000).toFixed(0)}k</div>
            <div className="donut-wrap__total-label">Per month</div>
            <div className="donut-wrap__hint">
              <Icon name="info" size={13} /> Hover legend rows to highlight slices
            </div>
          </div>
          <BudgetAllocator initial={initialAllocs} total={total} filter={filter} />
        </div>
      </section>

      {/* ===== Content marketing ===== */}
      <section className="section" id="t-content">
        <SectionHead title="Content marketing" />
        <p className="section__sub">Four topic clusters. Each hub anchors 5 spokes. Built for compounding organic.</p>
        <div className="grid-2" style={{ gap: 16 }}>
          {T.contentClusters.map((c, i) => (
            <ExpCard
              key={i}
              icon={["clipboard-list", "palette", "package", "calculator"][i]}
              title={c.hub}
              meta={`${c.volume} · KD ${c.difficulty}`}
            >
              <p><strong>Spoke topics ({c.spokes.length})</strong></p>
              <ul>{c.spokes.map((s, j) => <li key={j}>{s}</li>)}</ul>
              <p style={{ marginTop: 12 }}>
                <Tag tone="navy" icon="search">{c.volume} monthly search volume</Tag>{" "}
                <Tag tone="ghost">Difficulty {c.difficulty}/100</Tag>
              </p>
            </ExpCard>
          ))}
        </div>
      </section>

      {/* ===== Paid media ===== */}
      <section className="section" id="t-paid">
        <SectionHead title="Paid media" />
        <div className="col-gap-12">
          {T.paid.map((p, i) => (
            <div key={i} className="card card--white" style={{ display: "grid", gridTemplateColumns: "180px 1fr 200px", gap: 24, alignItems: "center" }}>
              <div>
                <div className="card__eyebrow" style={{ color: "var(--tm-navy)" }}>{p.platform}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--tm-ink)", letterSpacing: "-0.02em", marginTop: 4 }}>{p.budgetPct}%</div>
                <div style={{ fontSize: 12, color: "var(--tm-text-muted)" }}>of monthly spend</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tm-ink)", marginBottom: 6 }}>{p.structure}</div>
                <div style={{ fontSize: 13, fontStyle: "italic", color: "var(--tm-text)", borderLeft: "2px solid var(--tm-blue)", paddingLeft: 12, lineHeight: 1.5 }}>{p.sample}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--tm-text-muted)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--tm-eyebrow)", marginBottom: 4 }}>Target</div>
                {p.target}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Organic social ===== */}
      <section className="section" id="t-organic">
        <SectionHead title="Organic social" />
        <div className="grid-4">
          {T.organic.map((o, i) => (
            <div key={i} className="card">
              <div className="card__eyebrow" style={{ color: "var(--tm-navy)" }}>
                <Icon name={["images","instagram","video","youtube"][i]} size={14} /> {o.platform}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--tm-ink)", margin: "6px 0 2px", letterSpacing: "-0.01em" }}>{o.cadence}</div>
              <div style={{ fontSize: 12, color: "var(--tm-text-muted)", marginBottom: 10 }}>{o.format}</div>
              <p className="card__desc">{o.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Email & Lifecycle ===== */}
      <section className="section" id="t-email">
        <SectionHead title="Email & lifecycle" />
        <div className="col-gap-12">
          {T.email.map((e, i) => (
            <ExpCard
              key={i}
              icon={["mail-plus", "calendar-x", "file-edit", "heart-handshake"][i]}
              title={e.name}
              meta={`${e.emails} emails · ${e.window}`}
            >
              <p><strong>Trigger:</strong> {e.trigger}</p>
              <p><strong>Goal:</strong> {e.goal}</p>
              <p>{e.note}</p>
            </ExpCard>
          ))}
        </div>
      </section>

      {/* ===== SEO ===== */}
      <section className="section" id="t-seo">
        <SectionHead title="SEO & technical" />
        <div className="grid-3" style={{ gap: 16 }}>
          {[
            { title: "On-page",  icon: "type",   items: T.seo.onPage   },
            { title: "Technical",icon: "cpu",    items: T.seo.technical },
            { title: "Off-page", icon: "link-2", items: T.seo.offPage  }
          ].map((g, i) => (
            <div key={i} className="card">
              <div className="card__eyebrow" style={{ color: "var(--tm-navy)" }}><Icon name={g.icon} size={14} /> {g.title.toUpperCase()}</div>
              <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 13, color: "var(--tm-text)", lineHeight: 1.55 }}>
                {g.items.map((it, j) => <li key={j} style={{ marginBottom: 6 }}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CRO ===== */}
      <section className="section" id="t-cro">
        <SectionHead title="Conversion rate optimization" />
        <p className="section__sub">Hypothesis backlog scored by ICE (Impact × Confidence × Ease).</p>
        <div className="col-gap-12">
          {T.cro.sort((a, b) => b.ice - a.ice).map((c, i) => (
            <div key={i} className="card" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "center", padding: "14px 18px" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: c.ice >= 8 ? "var(--tm-orange)" : c.ice >= 7 ? "var(--tm-blue)" : "var(--tm-card-hover)",
                color: c.ice >= 7 ? "white" : "var(--tm-ink)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums"
              }}>{c.ice}</div>
              <div style={{ fontSize: 14, color: "var(--tm-ink)", fontWeight: 500 }}>{c.hypothesis}</div>
              <Tag tone="ghost">{c.area}</Tag>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Partnerships ===== */}
      <section className="section" id="t-partnerships">
        <SectionHead title="Partnerships & PR" />
        <div className="grid-3" style={{ gap: 16 }}>
          {T.partnerships.map((p, i) => (
            <div key={i} className="card">
              <div className="card__eyebrow" style={{ color: "var(--tm-navy)" }}>
                <Icon name={["users", "trophy", "puzzle"][i]} size={14} /> OPPORTUNITY
              </div>
              <h3 className="card__title">{p.name}</h3>
              <p className="card__desc">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Stack ===== */}
      <section className="section" id="t-stack">
        <SectionHead title="Tools & automation" />
        <div className="grid-3" style={{ gap: 12 }}>
          {T.stack.map((s, i) => (
            <div key={i} className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: "white", color: "var(--tm-navy)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="puzzle" size={16} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--tm-ink)" }}>{s.tool}</div>
                <div style={{ fontSize: 12, color: "var(--tm-text-muted)" }}>{s.purpose}</div>
              </div>
              <Tag tone={s.status === "Build" ? "orange" : s.status === "Replace SFMC for B2C" ? "warn" : "green"}>{s.status}</Tag>
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
}

// =================================================================
// PHASE 4 — MEASUREMENT
// =================================================================
function MeasurementPhase() {
  const { measurement: M } = useContext(MagnetContext);
  useLucide();

  return (
    <React.Fragment>
      <PhaseHead
        eyebrow="Phase 4 of 4 · Measurement"
        title="Proving what worked"
        sub="The metrics, the cadence, the early-warning signals. Measurement closes the loop and feeds the next planning cycle."
      />

      {/* ===== KPI tiles ===== */}
      <section className="section" id="m-kpis">
        <SectionHead title="KPI framework" />
        <p className="section__sub">12-month targets. Up-and-to-the-right is good — except cost metrics, where down is the win.</p>
        <div className="kpi-grid">
          {M.kpis.map((k, i) => (
            <Stat
              key={i}
              label={k.label}
              value={k.value}
              caption={k.target}
              delta={k.delta}
              deltaTone={k.good === undefined ? (k.up ? "up" : "down") : (k.good ? "up" : "down")}
              variant="card"
            />
          ))}
        </div>
      </section>

      {/* ===== Funnel ===== */}
      <section className="section" id="m-funnel">
        <SectionHead title="Funnel & attribution" />
        <p className="section__sub">Where each stage's volume comes from — and which channel owns it.</p>
        <Funnel rows={M.funnel} />
        <div className="card card--white" style={{ marginTop: 16 }}>
          <div className="card__eyebrow"><Icon name="git-fork" size={14} /> ATTRIBUTION MODEL</div>
          <p className="card__desc" style={{ marginTop: 8 }}>{M.attribution}</p>
        </div>
      </section>

      {/* ===== Reporting cadence ===== */}
      <section className="section" id="m-reporting">
        <SectionHead title="Reporting cadence" />
        <div className="grid-4">
          {M.reporting.map((r, i) => (
            <div key={i} className="card">
              <div className="card__eyebrow" style={{ color: ["var(--tm-blue)", "var(--tm-navy)", "var(--tm-orange)", "var(--tm-ink)"][i] }}>
                <Icon name={["sun", "calendar", "bar-chart-3", "presentation"][i]} size={14} /> {r.cadence.toUpperCase()}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--tm-ink)", margin: "6px 0 4px" }}>{r.who}</div>
              <p className="card__desc">{r.focus}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Testing framework ===== */}
      <section className="section" id="m-testing">
        <SectionHead title="Testing & experimentation" />
        <div className="grid-2" style={{ gap: 16 }}>
          <div className="card card--white">
            <div className="card__eyebrow"><Icon name="flask-conical" size={14} /> HYPOTHESIS TEMPLATE</div>
            <div style={{ fontFamily: "var(--tm-font-mono)", fontSize: 12.5, background: "var(--tm-card)", padding: 14, borderRadius: "var(--tm-radius-md)", color: "var(--tm-ink)", lineHeight: 1.6, marginTop: 10 }}>
              <strong>Because</strong> we observed <span className="muted">[insight]</span>,<br />
              <strong>we believe</strong> changing <span className="muted">[variable]</span><br />
              <strong>will result in</strong> <span className="muted">[metric]</span> moving by <span className="muted">[magnitude]</span>.<br />
              <strong>We'll know we're right when</strong> <span className="muted">[signal]</span>.
            </div>
          </div>
          <div className="card card--white">
            <div className="card__eyebrow"><Icon name="ruler" size={14} /> ICE PRIORITISATION</div>
            <p className="card__desc" style={{ margin: "10px 0 12px" }}>Score every hypothesis 1–10 on three axes:</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--tm-text)", lineHeight: 1.6 }}>
              <li><strong style={{ color: "var(--tm-ink)" }}>Impact</strong> — revenue magnitude if it works.</li>
              <li><strong style={{ color: "var(--tm-ink)" }}>Confidence</strong> — strength of supporting evidence.</li>
              <li><strong style={{ color: "var(--tm-ink)" }}>Ease</strong> — effort + dependencies to run.</li>
            </ul>
            <p className="card__desc" style={{ marginTop: 12 }}>Top 3 scored tests run each sprint. Minimum sample: 5,000 sessions per variant or 95% confidence — whichever comes first.</p>
          </div>
        </div>
      </section>

      {/* ===== Risks / Early warnings ===== */}
      <section className="section" id="m-risks">
        <SectionHead title="Early warning signals" />
        <p className="section__sub">When these signals fire, the playbook responds without waiting for a quarterly review.</p>
        <div className="col-gap-12">
          {M.risks.map((r, i) => (
            <div key={i} className="card card--white" style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr", gap: 18, alignItems: "center", padding: "14px 18px" }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(216,69,58,0.10)", color: "var(--tm-danger)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="alert-triangle" size={14} />
              </span>
              <div>
                <div className="card__eyebrow" style={{ color: "var(--tm-danger)" }}>SIGNAL</div>
                <div style={{ fontSize: 14, color: "var(--tm-ink)", fontWeight: 600, marginTop: 2 }}>{r.signal}</div>
              </div>
              <div>
                <div className="card__eyebrow" style={{ color: "var(--tm-green)" }}>ACTION</div>
                <div style={{ fontSize: 14, color: "var(--tm-text)", marginTop: 2 }}>{r.action}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
}

export { DiagnosisPhase, StrategyPhase, TacticsPhase, MeasurementPhase };
