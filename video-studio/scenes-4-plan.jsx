// scenes-4-plan.jsx — 16–25s: Plan delivered. Tactics tab active.
// Donut sweeps, audience bars fill, roadmap pills land.

// ============================================================
// Channel split module (animated donut + legend)
// ============================================================
function ChannelSplitMod({ donutProgress, legendProgress }) {
  const visiblePct = donutProgress * 100;
  // cumulative
  let cum = 0;
  const rows = window.SAMPLE.budgetSplit.map((d) => {
    const start = cum;
    cum += d.pct;
    return { ...d, visible: Math.max(0, Math.min(cum, visiblePct) - start) };
  });
  return (
    <PlanMod title="Channel split" meta="£150K · monthly">
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 18, alignItems: "center" }}>
        <Donut
          data={window.SAMPLE.budgetSplit}
          palette={window.PALETTE}
          size={200}
          progress={donutProgress}
          center="£150K"
          subCenter="PER MONTH"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {rows.map((d, i) => {
            const rowT = clamp(legendProgress - i * 0.06, 0, 1);
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "12px 1fr auto", gap: 10,
                alignItems: "center", fontSize: 13,
                opacity: rowT, transform: `translateX(${(1 - rowT) * 8}px)`
              }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: window.PALETTE[d.key] }} />
                <span style={{ color: TM.text, fontFamily: TM.ui }}>{d.name}</span>
                <span style={{ color: TM.ink, fontWeight: 700, fontFamily: TM.mono }}>{d.pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </PlanMod>
  );
}

// ============================================================
// Audience module
// ============================================================
function AudienceMod({ progress }) {
  return (
    <PlanMod title="Audience segments" meta="4 priority">
      <AudienceBars data={window.SAMPLE.audience} progress={progress} fontSize={14} />
    </PlanMod>
  );
}

// ============================================================
// 30/60/90 roadmap module
// ============================================================
function RoadmapMod({ progress }) {
  const items = [
    { pill: "30 days", color: TM.blue,   soft: TM.blueSoft,   txt: <span><strong>Showroom-finder SEO</strong>, two consideration-phase landing pages, brief paid social on Q3.</span> },
    { pill: "60 days", color: TM.orange, soft: TM.orangeSoft, txt: <span><strong>First-time-buyer creative suite</strong>, recover abandoned-quote audience, baseline brand-track.</span> },
    { pill: "90 days", color: TM.green,  soft: TM.greenSoft,  txt: <span><strong>Trade-pro partner programme</strong>, retest pricing page, measurement readout to board.</span> }
  ];
  return (
    <PlanMod title="30 / 60 / 90 roadmap" meta="3 horizons">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((it, i) => {
          const t = clamp((progress - i * 0.22) / 0.35, 0, 1);
          const ease = Easing.easeOutCubic(t);
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "72px 1fr", gap: 14, alignItems: "start",
              opacity: ease, transform: `translateY(${(1 - ease) * 12}px)`
            }}>
              <div style={{
                background: it.soft, color: it.color,
                fontFamily: TM.mono, fontSize: 13, fontWeight: 700,
                padding: "6px 10px", borderRadius: 8, textAlign: "center"
              }}>{it.pill}</div>
              <div style={{ fontSize: 14, color: TM.text, lineHeight: 1.5, fontFamily: TM.ui }}>
                {it.txt}
              </div>
            </div>
          );
        })}
      </div>
    </PlanMod>
  );
}

// ============================================================
// Scene 4: PLAN DELIVERED
// ============================================================
function ScenePlan({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        return (
          <div style={{
            position: "absolute", inset: 0,
            background: `
              radial-gradient(ellipse 50% 40% at 100% 0%, rgba(255,150,20,0.10) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 0% 100%, rgba(23,168,241,0.10) 0%, transparent 60%),
              ${TM.canvas}
            `,
            overflow: "hidden",
            padding: "60px 80px",
            display: "flex", flexDirection: "column", gap: 32
          }}>
            {/* Eyebrow + headline */}
            <Sprite start={start} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
                return (
                  <div style={{ opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 12,
                      fontFamily: TM.ui, fontWeight: 700, fontSize: 14,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: TM.green
                    }}>
                      <div style={{ width: 32, height: 2, background: TM.green }} />
                      Plan delivered · 27.3 seconds
                    </div>
                    <h2 style={{
                      fontFamily: TM.display, fontWeight: 600, fontSize: 76,
                      margin: "16px 0 0", color: TM.ink, letterSpacing: "-0.03em",
                      lineHeight: 1
                    }}>
                      A four-phase plan, ready to <span style={{ color: TM.orange }}>present</span>.
                    </h2>
                  </div>
                );
              }}
            </Sprite>

            {/* Tab row */}
            <Sprite start={start + 0.6} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
                return (
                  <div style={{ opacity: t, transform: `translateY(${(1 - t) * 8}px)` }}>
                    <PhaseTabs active="tactics" fontSize={20} scale={1.15} />
                  </div>
                );
              }}
            </Sprite>

            {/* Plan card with 3 modules */}
            <Sprite start={start + 1.2} end={end}>
              {({ localTime: lt }) => {
                // Module entry stagger
                const baseT = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));

                // Donut starts sweeping at lt ~0.6, fills over 1.4s
                const donutT = Easing.easeOutCubic(clamp((lt - 0.6) / 1.6, 0, 1));
                // Legend starts after donut hits ~50%
                const legendT = clamp((lt - 1.3) / 1.0, 0, 1);
                // Audience bars fill 1.2 → 3.0
                const audienceT = Easing.easeOutCubic(clamp((lt - 1.2) / 1.6, 0, 1));
                // Roadmap pills land 2.0 → 4.0
                const roadmapT = clamp((lt - 2.0) / 1.6, 0, 1);

                return (
                  <div style={{
                    background: TM.chrome,
                    border: `1px solid ${TM.divider}`,
                    borderRadius: 22,
                    padding: 28,
                    display: "grid",
                    gridTemplateColumns: "1.2fr 0.9fr 1fr",
                    gap: 22,
                    opacity: baseT,
                    transform: `translateY(${(1 - baseT) * 20}px)`,
                    boxShadow: "0 1px 2px rgba(12,20,38,0.04), 0 40px 80px -30px rgba(12,20,38,0.18)"
                  }}>
                    <ChannelSplitMod donutProgress={donutT} legendProgress={legendT} />
                    <AudienceMod progress={audienceT} />
                    <RoadmapMod progress={roadmapT} />
                  </div>
                );
              }}
            </Sprite>
          </div>
        );
      }}
    </Sprite>
  );
}

window.ScenePlan = ScenePlan;
