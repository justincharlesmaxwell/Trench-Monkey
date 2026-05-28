// scenes-2-brief.jsx — 4.5–11s: The brief form fills in.

// --- Helpers ---
function typeWriter(text, progress) {
  const n = Math.floor(text.length * clamp(progress, 0, 1));
  return text.slice(0, n);
}

// A single form-field row. Pass a `fill` 0–1 to animate the value typing in.
function BriefField({ label, value, sym, caret, hint, fill = 1, focused = false, showValue = true, isChips = false, chipFill = 0, opt = "required" }) {
  const typed = showValue ? typeWriter(value || "", fill) : "";
  const showCaret = showValue && fill > 0 && fill < 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{
        fontSize: 14, fontWeight: 600, color: TM.ink,
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        fontFamily: TM.ui
      }}>
        <span>{label}</span>
        <span style={{ fontWeight: 500, color: TM.muted, fontSize: 12 }}>{opt}</span>
      </div>

      {isChips ? (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8,
          padding: 14,
          background: focused ? TM.chrome : TM.card,
          border: `1.5px solid ${focused ? TM.blue : TM.divider}`,
          boxShadow: focused ? `0 0 0 4px ${TM.blueSoft}` : "none",
          borderRadius: 12,
          minHeight: 60,
          alignItems: "center"
        }}>
          {window.SAMPLE.competitors.map((c, i) => {
            const chipT = clamp((chipFill - i * 0.18) / 0.32, 0, 1);
            if (chipT <= 0) return null;
            return (
              <span key={c} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 14px",
                background: TM.chrome,
                border: `1px solid ${TM.divider}`,
                borderRadius: 9999,
                fontSize: 14, fontWeight: 500, color: TM.ink,
                fontFamily: TM.ui,
                transform: `scale(${0.6 + chipT * 0.4})`,
                opacity: chipT
              }}>
                {c}
                <span style={{ color: TM.muted }}>×</span>
              </span>
            );
          })}
          {chipFill > 0.8 && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px",
              border: `1px dashed ${TM.divider}`,
              borderRadius: 9999,
              fontSize: 13, color: TM.muted,
              fontFamily: TM.ui
            }}>+ add competitor</span>
          )}
        </div>
      ) : (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px",
          background: focused ? TM.chrome : TM.card,
          border: `1.5px solid ${focused ? TM.blue : TM.divider}`,
          boxShadow: focused ? `0 0 0 4px ${TM.blueSoft}` : "none",
          borderRadius: 12,
          fontSize: 17, color: TM.ink,
          fontFamily: TM.ui, fontWeight: 500,
          minHeight: 28
        }}>
          {sym && <span style={{ color: TM.muted, fontFamily: TM.mono, fontSize: 15 }}>{sym}</span>}
          <span style={{ flex: 1 }}>
            {typed}
            {showCaret && <span style={{
              display: "inline-block", width: 2, height: 18, background: TM.ink,
              marginLeft: 2, verticalAlign: "middle",
              animation: "blink 0.8s steps(2) infinite"
            }} />}
          </span>
          {caret && <span style={{ color: TM.muted, fontSize: 13 }}>{caret}</span>}
        </div>
      )}

      <span style={{ fontSize: 12.5, color: TM.muted, lineHeight: 1.5, fontFamily: TM.ui }}>{hint}</span>
    </div>
  );
}

// ============================================================
// Scene 2: BRIEF
// ============================================================
function SceneBrief({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        // Inject blink keyframes once
        if (!document.getElementById("__vs_blink")) {
          const st = document.createElement("style");
          st.id = "__vs_blink";
          st.textContent = "@keyframes blink { 0%, 50% { opacity: 1 } 50.01%, 100% { opacity: 0 } }";
          document.head.appendChild(st);
        }

        // Subtle background tint
        return (
          <div style={{
            position: "absolute", inset: 0,
            background: `
              radial-gradient(ellipse 50% 40% at 0% 0%, rgba(23,168,241,0.10) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 100% 100%, rgba(255,150,20,0.08) 0%, transparent 60%),
              ${TM.canvas}
            `,
            overflow: "hidden"
          }}>
            {/* Browser frame containing the form, centered */}
            <div style={{
              position: "absolute",
              left: "50%", top: "50%",
              transform: "translate(-50%, -50%)"
            }}>
              <BrowserChrome url="trenchmonkey.app/brief/new" width={1300} height={920}>
                {/* Top of form */}
                <div style={{ padding: "32px 56px", display: "flex", flexDirection: "column", gap: 24, height: "100%", boxSizing: "border-box" }}>
                  {/* Header */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "end",
                    paddingBottom: 16, borderBottom: `1px solid ${TM.divider}`
                  }}>
                    <div>
                      <div style={{ fontSize: 13, color: TM.muted, marginBottom: 8, fontFamily: TM.ui }}>
                        Plans / <span style={{ color: TM.ink, fontWeight: 600 }}>New brief</span>
                      </div>
                      <h1 style={{
                        fontFamily: TM.display, fontWeight: 600, fontSize: 48,
                        margin: 0, color: TM.ink, letterSpacing: "-0.025em", lineHeight: 1
                      }}>
                        Brief the <span style={{ color: TM.orange }}>monkey</span>.
                      </h1>
                    </div>
                    <Sprite start={start + 6.3} end={end}>
                      {({ localTime: lt }) => {
                        const t = Easing.easeOutCubic(clamp(lt / 0.3, 0, 1));
                        return (
                          <div style={{
                            textAlign: "right", fontSize: 12, color: TM.muted, lineHeight: 1.5,
                            opacity: t, transform: `translateY(${(1 - t) * 8}px)`,
                            fontFamily: TM.ui
                          }}>
                            <div style={{
                              fontFamily: TM.display, fontSize: 26, fontWeight: 600,
                              color: TM.green, letterSpacing: "-0.02em", lineHeight: 1
                            }}>≈ 27.3<span style={{ fontSize: 14, color: TM.muted }}>s</span></div>
                            estimated run time
                          </div>
                        );
                      }}
                    </Sprite>
                  </div>

                  {/* Form card */}
                  <div style={{
                    background: TM.chrome,
                    border: `1px solid ${TM.divider}`,
                    borderRadius: 18,
                    padding: 28,
                    display: "flex", flexDirection: "column", gap: 18,
                    boxShadow: "0 1px 2px rgba(12,20,38,0.04)"
                  }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                      {/* Field 1 — URL */}
                      <Sprite start={start + 0.3} end={end}>
                        {({ localTime: lt }) => {
                          const fill = clamp(lt / 0.8, 0, 1);
                          const focused = lt < 1.2;
                          return (
                            <BriefField
                              label="Company URL"
                              value="magnet.co.uk"
                              sym="↗"
                              hint="We'll scrape positioning, tech stack, and content inventory."
                              fill={fill}
                              focused={focused}
                            />
                          );
                        }}
                      </Sprite>

                      {/* Field 2 — Industry */}
                      <Sprite start={start + 1.4} end={end}>
                        {({ localTime: lt }) => {
                          const fill = clamp(lt / 0.7, 0, 1);
                          const focused = lt > 0 && lt < 1.0;
                          return (
                            <BriefField
                              label="Industry"
                              value="Home improvement · Fitted kitchens"
                              caret="▾"
                              hint="Anchors market size, trends, and category benchmarks."
                              fill={fill}
                              focused={focused}
                            />
                          );
                        }}
                      </Sprite>
                    </div>

                    {/* Chip row — full width */}
                    <Sprite start={start + 2.3} end={end}>
                      {({ localTime: lt }) => {
                        const chipFill = clamp(lt / 1.4, 0, 1);
                        const focused = lt < 1.6;
                        return (
                          <BriefField
                            label="Competitors"
                            opt="5 of 8 · comma or Enter to add"
                            hint="We'll benchmark traffic, share-of-voice, messaging cadence, and content mix."
                            isChips
                            chipFill={chipFill}
                            focused={focused}
                          />
                        );
                      }}
                    </Sprite>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                      {/* Field 4 — Budget */}
                      <Sprite start={start + 4.4} end={end}>
                        {({ localTime: lt }) => {
                          const fill = clamp(lt / 0.7, 0, 1);
                          const focused = lt < 1.0;
                          return (
                            <BriefField
                              label="Marketing budget"
                              value="150,000"
                              sym="£"
                              hint="Split across channels in Phase 03 — Tactics."
                              fill={fill}
                              focused={focused}
                            />
                          );
                        }}
                      </Sprite>

                      {/* Field 5 — Cadence */}
                      <Sprite start={start + 5.0} end={end}>
                        {({ localTime: lt }) => {
                          const fill = clamp(lt / 0.5, 0, 1);
                          const focused = lt > 0 && lt < 0.8;
                          return (
                            <BriefField
                              label="Cadence"
                              opt=""
                              value="Per month"
                              caret="▾"
                              hint="Time-box for the budget allocation."
                              fill={fill}
                              focused={focused}
                            />
                          );
                        }}
                      </Sprite>
                    </div>

                    {/* CTA row */}
                    <Sprite start={start + 5.4} end={end}>
                      {({ localTime: lt }) => {
                        const t = Easing.easeOutCubic(clamp(lt / 0.3, 0, 1));
                        const press = lt > 0.85 ? clamp((lt - 0.85) / 0.15, 0, 1) : 0;
                        const pressScale = 1 - press * 0.04;
                        return (
                          <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            paddingTop: 18, borderTop: `1px solid ${TM.divider2}`,
                            opacity: t,
                            transform: `translateY(${(1 - t) * 6}px)`
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 10,
                              fontSize: 13, color: TM.muted,
                              fontFamily: TM.ui
                            }}>
                              <span style={{
                                width: 22, height: 22,
                                background: TM.blueSoft, color: TM.navy,
                                borderRadius: "50%",
                                display: "grid", placeItems: "center",
                                fontSize: 11
                              }}>🔒</span>
                              Inputs processed locally — never sent to our servers.
                            </span>
                            <button style={{
                              display: "inline-flex", alignItems: "center", gap: 12,
                              background: TM.orange, color: TM.ink,
                              padding: "14px 24px",
                              borderRadius: 12,
                              border: 0,
                              fontFamily: TM.ui, fontWeight: 700, fontSize: 16,
                              cursor: "pointer",
                              transform: `scale(${pressScale})`,
                              boxShadow: press > 0 ? "0 0 0 6px rgba(255,150,20,0.3)" : "none",
                              transition: "box-shadow 0.1s linear"
                            }}>
                              Generate plan
                              <span style={{
                                width: 26, height: 26,
                                background: TM.ink, color: TM.orange,
                                borderRadius: "50%",
                                display: "grid", placeItems: "center",
                                fontSize: 14, fontWeight: 700
                              }}>→</span>
                            </button>
                          </div>
                        );
                      }}
                    </Sprite>
                  </div>
                </div>
              </BrowserChrome>
            </div>

            {/* Cursor choreography — moves to each field then to the button */}
            <Sprite start={start + 5.7} end={start + 6.3}>
              {({ localTime: lt }) => {
                // Cursor zips in from below to the generate button
                const t = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
                // Button is roughly at right-bottom of the centered card
                const targetX = 1280;
                const targetY = 750;
                const startX = 1280;
                const startY = 1000;
                const x = startX + (targetX - startX) * t;
                const y = startY + (targetY - startY) * t;
                return <Cursor x={x} y={y} scale={1.4} />;
              }}
            </Sprite>
          </div>
        );
      }}
    </Sprite>
  );
}

window.SceneBrief = SceneBrief;
