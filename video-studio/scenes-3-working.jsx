// scenes-3-working.jsx — 11–16s: The monkey works. Progress, status,
// phases lighting up, countdown ticking.

function PhasePill({ phase, lit, color }) {
  return (
    <div style={{
      flex: 1,
      background: lit ? TM.chrome : TM.card,
      border: `1.5px solid ${lit ? color : TM.divider}`,
      borderRadius: 14,
      padding: "20px 18px",
      display: "flex", flexDirection: "column", gap: 8,
      transition: "all 0.3s cubic-bezier(0.2, 0.7, 0.2, 1)",
      boxShadow: lit ? `0 6px 24px -8px ${color}55` : "none",
      transform: lit ? "scale(1.04)" : "scale(1)"
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span style={{
          fontFamily: TM.mono, fontSize: 13, fontWeight: 600,
          color: lit ? color : TM.muted, letterSpacing: "0.06em"
        }}>{phase.num}</span>
        {lit ? (
          <span style={{
            width: 18, height: 18, borderRadius: "50%",
            background: color,
            display: "grid", placeItems: "center",
            color: "#fff", fontSize: 11, fontWeight: 700
          }}>✓</span>
        ) : (
          <span style={{
            width: 18, height: 18, borderRadius: "50%",
            border: `2px solid ${TM.divider}`,
            background: "transparent"
          }} />
        )}
      </div>
      <span style={{
        fontFamily: TM.display, fontSize: 22, fontWeight: 600,
        color: lit ? TM.ink : TM.muted, letterSpacing: "-0.01em"
      }}>{phase.label}</span>
    </div>
  );
}

function SceneWorking({ start, end }) {
  const phaseColors = [TM.blue, TM.orange, TM.navy, TM.green];

  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        // Total scene length ~5s. Each phase lights up over the first ~3.5s,
        // then "ready" state for the last ~1.5s.
        return (
          <div style={{
            position: "absolute", inset: 0,
            background: `
              radial-gradient(ellipse 60% 50% at 50% 0%, rgba(23,168,241,0.16) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 100% 100%, rgba(30,158,91,0.12) 0%, transparent 60%),
              ${TM.canvas}
            `,
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              width: 1400,
              background: TM.chrome,
              border: `1px solid ${TM.divider}`,
              borderRadius: 24,
              padding: 56,
              display: "flex", flexDirection: "column", gap: 36,
              boxShadow: "0 1px 2px rgba(12,20,38,0.04), 0 40px 80px -30px rgba(12,20,38,0.22)"
            }}>
              {/* Header row */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "start"
              }}>
                <div>
                  <Sprite start={start} end={end}>
                    {({ localTime: lt }) => {
                      const t = Easing.easeOutCubic(clamp(lt / 0.4, 0, 1));
                      return (
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 12,
                          background: TM.greenSoft,
                          color: TM.greenDeep,
                          padding: "8px 16px",
                          borderRadius: 9999,
                          fontFamily: TM.ui, fontWeight: 700, fontSize: 14,
                          letterSpacing: "0.08em", textTransform: "uppercase",
                          opacity: t
                        }}>
                          <span style={{
                            width: 10, height: 10, background: TM.green,
                            borderRadius: "50%",
                            boxShadow: `0 0 0 4px ${TM.green}33`,
                            animation: "pulse 1.2s ease-out infinite"
                          }} />
                          Working
                        </div>
                      );
                    }}
                  </Sprite>

                  {/* Status line that cycles */}
                  <Sprite start={start + 0.3} end={end}>
                    {({ localTime: lt }) => {
                      const statuses = [
                        "Researching the kitchen market…",
                        "Benchmarking Wren, Howdens, IKEA…",
                        "Sizing the audience…",
                        "Building a £150K channel split…",
                        "Generating the four-phase plan…",
                        "Plan ready."
                      ];
                      // Show one status per ~0.75s
                      const idx = Math.min(Math.floor(lt / 0.75), statuses.length - 1);
                      const status = statuses[idx];
                      const subT = (lt % 0.75) / 0.75;
                      const opac = subT < 0.15 ? subT / 0.15 : (subT > 0.85 && idx < statuses.length - 1 ? 1 - (subT - 0.85) / 0.15 : 1);
                      return (
                        <h2 style={{
                          fontFamily: TM.display, fontWeight: 600, fontSize: 56,
                          margin: "16px 0 0", color: TM.ink, letterSpacing: "-0.025em",
                          lineHeight: 1.05, opacity: opac,
                          maxWidth: "20ch"
                        }}>
                          {status}
                        </h2>
                      );
                    }}
                  </Sprite>
                </div>

                {/* Countdown */}
                <Sprite start={start + 0.2} end={end}>
                  {({ localTime: lt }) => {
                    const t = Easing.easeOutCubic(clamp(lt / 0.4, 0, 1));
                    // Ticker counts from 27.3s down to 0 across the scene
                    const sceneLen = duration;
                    const remaining = Math.max(0, 27.3 - (lt / sceneLen) * 27.3);
                    return (
                      <div style={{
                        background: TM.ink, color: "#fff",
                        padding: "20px 28px",
                        borderRadius: 18,
                        textAlign: "right",
                        opacity: t,
                        transform: `translateY(${(1 - t) * 8}px)`,
                        boxShadow: "0 20px 60px -20px rgba(12,20,38,0.5)"
                      }}>
                        <div style={{
                          fontFamily: TM.mono, fontSize: 11, fontWeight: 700,
                          letterSpacing: "0.16em", textTransform: "uppercase",
                          color: TM.orange, marginBottom: 6
                        }}>Estimated remaining</div>
                        <div style={{
                          fontFamily: TM.display, fontSize: 64, fontWeight: 600,
                          letterSpacing: "-0.03em", lineHeight: 1
                        }}>
                          {remaining.toFixed(1)}
                          <span style={{ fontSize: 28, color: TM.orange, marginLeft: 4 }}>s</span>
                        </div>
                      </div>
                    );
                  }}
                </Sprite>
              </div>

              {/* Phase row — 4 cards lighting up */}
              <div style={{ display: "flex", gap: 14 }}>
                {window.PHASES.map((p, i) => (
                  <Sprite key={p.id} start={start + 0.6 + i * 0.7} end={end}>
                    {({ localTime: lt }) => {
                      return <PhasePill phase={p} lit={lt > 0.05} color={phaseColors[i]} />;
                    }}
                  </Sprite>
                ))}
                {/* Unlit defaults underneath, so the unlit ones aren't invisible before their start */}
              </div>

              {/* Live feed lines */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14,
                paddingTop: 24, borderTop: `1px solid ${TM.divider}`
              }}>
                {[
                  { lbl: "Data feeds online", v: "18 / 18", c: TM.green },
                  { lbl: "Inputs scraped",     v: "12 sources", c: TM.blue },
                  { lbl: "Tokens", v: "18,400", c: TM.muted }
                ].map((stat, i) => (
                  <Sprite key={i} start={start + 1.0 + i * 0.3} end={end}>
                    {({ localTime: lt }) => {
                      const t = Easing.easeOutCubic(clamp(lt / 0.4, 0, 1));
                      return (
                        <div style={{
                          display: "flex", justifyContent: "space-between", alignItems: "baseline",
                          opacity: t,
                          fontFamily: TM.mono, fontSize: 14
                        }}>
                          <span style={{ color: TM.muted, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600, fontSize: 11 }}>
                            {stat.lbl}
                          </span>
                          <span style={{ color: stat.c, fontWeight: 700, fontSize: 15 }}>{stat.v}</span>
                        </div>
                      );
                    }}
                  </Sprite>
                ))}
              </div>
            </div>

            {/* keyframes */}
            <style>{`
              @keyframes pulse {
                0%   { box-shadow: 0 0 0 0 ${TM.green}66; }
                70%  { box-shadow: 0 0 0 10px ${TM.green}00; }
                100% { box-shadow: 0 0 0 0 ${TM.green}00; }
              }
            `}</style>
          </div>
        );
      }}
    </Sprite>
  );
}

window.SceneWorking = SceneWorking;
