// scenes-5-tabs.jsx — 25–30s: Cycle through Diagnosis → Strategy →
// Measurement to show the depth of each phase.

// ============================================================
// Phase content panels (compact versions for the cycle)
// ============================================================

function DiagnosisPanel({ entryT }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 22,
      opacity: entryT, transform: `translateY(${(1 - entryT) * 14}px)`
    }}>
      {/* Big number + sub stats */}
      <PlanMod title="Market context" meta="UK · 2026">
        <div style={{
          fontFamily: TM.display, fontWeight: 600, fontSize: 92,
          color: TM.blue, letterSpacing: "-0.035em", lineHeight: 1
        }}>
          £4.8B<span style={{ fontSize: 32, color: TM.muted, fontWeight: 500, marginLeft: 6 }}>/ yr</span>
        </div>
        <div style={{ fontSize: 13, color: TM.muted, letterSpacing: "0.04em", marginTop: -4 }}>
          Fitted-kitchens category, total UK
        </div>
        {/* Sparkline */}
        <div style={{ display: "flex", alignItems: "end", gap: 6, height: 60, marginTop: 12 }}>
          {[42, 48, 51, 47, 58, 64, 71].map((h, i) => (
            <div key={i} style={{
              flex: 1, height: `${h}%`, background: TM.blue,
              borderRadius: "3px 3px 0 0", opacity: 0.5 + (i / 6) * 0.5
            }} />
          ))}
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
          paddingTop: 14, borderTop: `1px solid ${TM.divider2}`
        }}>
          <div>
            <div style={{ fontFamily: TM.display, fontSize: 28, fontWeight: 600, color: TM.green, letterSpacing: "-0.02em" }}>+3.4%</div>
            <div style={{ fontSize: 12, color: TM.muted, marginTop: 4 }}>CAGR · 3-yr</div>
          </div>
          <div>
            <div style={{ fontFamily: TM.display, fontSize: 28, fontWeight: 600, color: TM.orange, letterSpacing: "-0.02em" }}>22%</div>
            <div style={{ fontSize: 12, color: TM.muted, marginTop: 4 }}>Online share</div>
          </div>
        </div>
      </PlanMod>

      {/* SWOT 2x2 */}
      <PlanMod title="SWOT synthesis" meta="4 quadrants">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, height: "100%" }}>
          {[
            { lbl: "Strengths",     soft: TM.greenSoft,  color: TM.greenDeep, txt: "220-showroom UK network · designer-led service · brand recall 71%." },
            { lbl: "Weaknesses",    soft: TM.orangeSoft, color: TM.orangeDeep, txt: "Quote-to-order gap · younger-buyer perception lag." },
            { lbl: "Opportunities", soft: TM.blueSoft,   color: TM.navy,       txt: "First-time buyers under-served · trade-pro channel un-built." },
            { lbl: "Threats",       soft: TM.navySoft,   color: TM.navy,       txt: "Wickes & B&Q price pressure · IKEA digital convenience." }
          ].map((q, i) => (
            <div key={i} style={{
              background: q.soft, padding: 14, borderRadius: 10,
              display: "flex", flexDirection: "column", gap: 6
            }}>
              <span style={{
                fontFamily: TM.ui, fontSize: 11, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: q.color
              }}>{q.lbl}</span>
              <span style={{ fontSize: 13, color: TM.ink, lineHeight: 1.4 }}>{q.txt}</span>
            </div>
          ))}
        </div>
      </PlanMod>
    </div>
  );
}

function StrategyPanel({ entryT }) {
  const goals = [
    { v: "+25%",  color: TM.blue,    l: "MQL volume by Q4", meta: "north-star" },
    { v: "4.2×",  color: TM.orange,  l: "Blended ROAS",     meta: "efficiency" },
    { v: "11.4%", color: TM.greenDeep, l: "Share of voice", meta: "up from 8.7%" },
    { v: "62",    color: TM.navy,    l: "Showroom NPS",     meta: "category-leading" }
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 22,
      opacity: entryT, transform: `translateY(${(1 - entryT) * 14}px)`
    }}>
      <PlanMod title="Positioning" meta="Statement &amp; frame">
        <div style={{
          background: TM.ink, color: "#fff",
          padding: 22, borderRadius: 14,
          fontFamily: TM.display, fontWeight: 500, fontSize: 19,
          lineHeight: 1.45, letterSpacing: "-0.005em"
        }}>
          For <span style={{ color: TM.blue }}>renovators</span> navigating a saturated kitchen market, <span style={{ color: TM.orange }}>Magnet</span> is the showroom-led specialist that turns a confusing decision into a <span style={{ color: TM.green }}>designed-in-30-days</span> certainty.
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 22px",
            marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.18)",
            fontFamily: TM.ui, fontWeight: 400, fontSize: 13, letterSpacing: 0
          }}>
            {[
              { l: "Target",  v: "Renovators, 35–54" },
              { l: "Frame",   v: "Designer-led specialist" },
              { l: "Benefit", v: "Confidence to commit" },
              { l: "RTB",     v: "220 showrooms · 30-day install" }
            ].map((r) => (
              <div key={r.l}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{r.l}</div>
                <div style={{ fontSize: 14, color: "#fff", fontWeight: 600, marginTop: 3 }}>{r.v}</div>
              </div>
            ))}
          </div>
        </div>
      </PlanMod>

      <PlanMod title="Goals · twelve-month" meta="North-star + 3">
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {goals.map((g, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "120px 1fr", gap: 18, alignItems: "center",
              padding: "14px 0", borderBottom: i < goals.length - 1 ? `1px dashed ${TM.divider2}` : "none"
            }}>
              <div style={{
                fontFamily: TM.display, fontWeight: 600, fontSize: 38,
                color: g.color, letterSpacing: "-0.03em", lineHeight: 1
              }}>{g.v}</div>
              <div>
                <div style={{ fontSize: 15, color: TM.ink, lineHeight: 1.3, fontWeight: 500 }}>{g.l}</div>
                <div style={{ fontSize: 12, color: TM.muted, fontFamily: TM.mono, marginTop: 2 }}>· {g.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </PlanMod>
    </div>
  );
}

function MeasurementPanel({ entryT }) {
  const kpis = [
    { name: "Brand search volume",  target: "+20% YoY", stat: "+24%", color: TM.green },
    { name: "Lead-to-quote rate",   target: "Target 38%", stat: "41%", color: TM.green },
    { name: "Quote-to-order rate",  target: "Target 24%", stat: "22%", color: TM.orange },
    { name: "Blended ROAS",         target: "Target 4.2×", stat: "3.9×", color: TM.orange },
    { name: "Showroom NPS",         target: "Target 62",   stat: "59",  color: TM.muted }
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 22,
      opacity: entryT, transform: `translateY(${(1 - entryT) * 14}px)`
    }}>
      <PlanMod title="KPI framework" meta="5 leading · monthly">
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr auto auto", gap: 18, alignItems: "center",
              padding: "12px 0", fontSize: 14,
              borderBottom: i < kpis.length - 1 ? `1px dashed ${TM.divider2}` : "none"
            }}>
              <span style={{ color: TM.ink, fontWeight: 500 }}>{k.name}</span>
              <span style={{ color: TM.muted, fontFamily: TM.mono, fontSize: 12 }}>{k.target}</span>
              <span style={{ fontFamily: TM.display, fontWeight: 600, fontSize: 22, color: k.color, letterSpacing: "-0.02em" }}>{k.stat}</span>
            </div>
          ))}
        </div>
      </PlanMod>

      <PlanMod title="Funnel · attribution" meta="Last 30 days">
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "stretch" }}>
          {[
            { l: "Impressions",       v: "18.4M",  bg: TM.blue,   w: "100%" },
            { l: "Engaged sessions",  v: "1.18M",  bg: TM.navy,   w: "92%"  },
            { l: "Leads",             v: "84.0K",  bg: TM.green,  w: "72%"  },
            { l: "Orders",            v: "12.4K",  bg: TM.orange, w: "50%"  }
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div style={{
                background: s.bg, color: "#fff",
                padding: "12px 18px", borderRadius: 6,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                width: s.w, alignSelf: "center",
                fontSize: 14
              }}>
                <span>{s.l}</span>
                <span style={{ fontFamily: TM.display, fontWeight: 600, fontSize: 18 }}>{s.v}</span>
              </div>
              {i < 3 && (
                <div style={{
                  fontFamily: TM.mono, fontSize: 11, color: TM.muted,
                  textAlign: "center", letterSpacing: "0.06em"
                }}>
                  {["6.4% engaged", "7.1% lead", "14.8% order"][i]}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </PlanMod>
    </div>
  );
}

// ============================================================
// Scene 5: tab cycling
// ============================================================
function SceneTabs({ start, end }) {
  // 3 phases, ~1.6s each
  const phaseTiming = [
    { id: "diagnosis",   at: 0.0, panel: DiagnosisPanel  },
    { id: "strategy",    at: 1.6, panel: StrategyPanel   },
    { id: "measurement", at: 3.2, panel: MeasurementPanel }
  ];

  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        // Which phase is active right now?
        let activeIdx = 0;
        for (let i = phaseTiming.length - 1; i >= 0; i--) {
          if (localTime >= phaseTiming[i].at) { activeIdx = i; break; }
        }
        const active = phaseTiming[activeIdx];
        const phaseStart = active.at;
        const phaseLocalT = localTime - phaseStart;
        // Entry animation for the panel (snap in over 0.35s)
        const entryT = Easing.easeOutCubic(clamp(phaseLocalT / 0.4, 0, 1));

        const Panel = active.panel;

        return (
          <div style={{
            position: "absolute", inset: 0,
            background: `
              radial-gradient(ellipse 50% 40% at 100% 0%, rgba(255,150,20,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 0% 100%, rgba(23,168,241,0.10) 0%, transparent 60%),
              ${TM.canvas}
            `,
            padding: "60px 80px",
            display: "flex", flexDirection: "column", gap: 32, overflow: "hidden"
          }}>
            {/* Headline persists */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                fontFamily: TM.ui, fontWeight: 700, fontSize: 14,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: TM.navy
              }}>
                <div style={{ width: 32, height: 2, background: TM.navy }} />
                Every phase, ready
              </div>
              <h2 style={{
                fontFamily: TM.display, fontWeight: 600, fontSize: 76,
                margin: "16px 0 0", color: TM.ink, letterSpacing: "-0.03em", lineHeight: 1
              }}>
                Diagnosis, strategy, <span style={{ color: TM.orange }}>tactics</span>, measurement.
              </h2>
            </div>

            {/* Tabs row with click pulse on the active one */}
            <div style={{ position: "relative" }}>
              <PhaseTabs active={active.id} fontSize={20} scale={1.15} />
              {/* Tab click ripple */}
              {phaseLocalT < 0.5 && (
                <div style={{
                  position: "absolute",
                  left: 5 + ["diagnosis", "strategy", "tactics", "measurement"].indexOf(active.id) * 168 + 50,
                  top: 5,
                  width: 24, height: 24,
                  borderRadius: "50%",
                  background: TM.blue,
                  opacity: clamp(1 - phaseLocalT / 0.5, 0, 0.4),
                  transform: `translate(-50%, -50%) scale(${1 + phaseLocalT * 4})`,
                  pointerEvents: "none"
                }} />
              )}
            </div>

            {/* Phase content */}
            <div style={{ flex: 1 }}>
              <Panel entryT={entryT} />
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

window.SceneTabs = SceneTabs;
