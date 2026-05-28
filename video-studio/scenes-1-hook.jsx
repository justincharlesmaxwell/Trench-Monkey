// scenes-1-hook.jsx — 0–4.5s: Brand hook with the mascot as the star.
// Type on the left, monkey bouncing in from the right.

function SceneHook({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const drift = localTime / duration;

        return (
          <div style={{ position: "absolute", inset: 0, background: TM.canvas, overflow: "hidden" }}>
            {/* Soft brand-color halos */}
            <div style={{
              position: "absolute", inset: 0,
              background: `
                radial-gradient(ellipse 60% 50% at ${85 - drift * 5}% ${10 + drift * 4}%, rgba(23,168,241,0.22) 0%, transparent 60%),
                radial-gradient(ellipse 50% 60% at ${0 + drift * 8}% ${100 - drift * 6}%, rgba(255,150,20,0.18) 0%, transparent 60%)
              `
            }} />

            {/* Brand lockup — top-left */}
            <Sprite start={start} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.6, 0, 1));
                return (
                  <div style={{
                    position: "absolute", left: 96, top: 88,
                    transform: `translateY(${(1 - t) * 12}px)`,
                    opacity: t
                  }}>
                    <BrandLockup size={56} fontSize={32} />
                  </div>
                );
              }}
            </Sprite>

            {/* MASCOT — right side, bouncy entry */}
            <Sprite start={start + 0.15} end={end}>
              {({ localTime: lt }) => {
                // Bounce in from the right, settle, then bob gently
                const entryT = Easing.easeOutBack(clamp(lt / 0.75, 0, 1));
                const settleLt = Math.max(0, lt - 0.75);
                const bob = Math.sin(settleLt * 1.8) * 8;
                const tilt = Math.sin(settleLt * 1.4) * 1.5;

                // X position: starts at +400 off-screen-right, lands at 0 offset
                const xOff = (1 - entryT) * 400;
                // Y entry: drops 40px then settles
                const yEntry = (1 - entryT) * -30;

                return (
                  <div style={{
                    position: "absolute",
                    right: 70,
                    top: "50%",
                    width: 820,
                    height: 600,
                    transform: `translate(${xOff}px, calc(-50% + ${yEntry + bob}px)) rotate(${tilt}deg)`,
                    opacity: clamp(entryT * 1.3, 0, 1)
                  }}>
                    <img
                      src="assets/mascot-hero.png"
                      alt="Trench Monkey"
                      style={{
                        width: "100%", height: "100%",
                        objectFit: "contain",
                        WebkitMaskImage: "radial-gradient(ellipse 78% 92% at 55% 52%, black 55%, transparent 92%)",
                        maskImage: "radial-gradient(ellipse 78% 92% at 55% 52%, black 55%, transparent 92%)"
                      }}
                    />
                  </div>
                );
              }}
            </Sprite>

            {/* Eyebrow — left column */}
            <Sprite start={start + 0.5} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
                return (
                  <div style={{
                    position: "absolute", left: 96, top: 280,
                    transform: `translateY(${(1 - t) * 12}px)`,
                    opacity: t,
                    display: "inline-flex", alignItems: "center", gap: 14
                  }}>
                    <div style={{ width: 36, height: 2, background: TM.navy }} />
                    <span style={{
                      fontFamily: TM.ui, fontWeight: 700, fontSize: 17,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: TM.navy
                    }}>The Platform · v3.2</span>
                  </div>
                );
              }}
            </Sprite>

            {/* Headline — line 1 */}
            <Sprite start={start + 0.8} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.6, 0, 1));
                return (
                  <div style={{
                    position: "absolute", left: 96, top: 350,
                    transform: `translateY(${(1 - t) * 24}px)`,
                    opacity: t
                  }}>
                    <span style={{
                      fontFamily: TM.display, fontWeight: 600, fontSize: 102,
                      letterSpacing: "-0.035em", lineHeight: 1,
                      color: TM.ink
                    }}>World-class</span>
                  </div>
                );
              }}
            </Sprite>

            {/* Headline — line 2 */}
            <Sprite start={start + 1.15} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.6, 0, 1));
                return (
                  <div style={{
                    position: "absolute", left: 96, top: 470,
                    transform: `translateY(${(1 - t) * 24}px)`,
                    opacity: t
                  }}>
                    <span style={{
                      fontFamily: TM.display, fontWeight: 600, fontSize: 102,
                      letterSpacing: "-0.035em", lineHeight: 1,
                      color: TM.ink
                    }}>market intelligence,</span>
                  </div>
                );
              }}
            </Sprite>

            {/* Headline — line 3 with orange highlight */}
            <Sprite start={start + 1.55} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.6, 0, 1));
                const pulse = lt > 0.8 ? 1 + Math.sin((lt - 0.8) * 4) * 0.012 : 1;
                return (
                  <div style={{
                    position: "absolute", left: 96, top: 590,
                    transformOrigin: "left center",
                    transform: `translateY(${(1 - t) * 24}px) scale(${pulse})`,
                    opacity: t
                  }}>
                    <span style={{
                      fontFamily: TM.display, fontWeight: 600, fontSize: 102,
                      letterSpacing: "-0.035em", lineHeight: 1,
                      color: TM.ink
                    }}>
                      in{" "}
                      <span style={{ color: TM.orange }}>forty seconds.</span>
                    </span>
                  </div>
                );
              }}
            </Sprite>

            {/* Subhead */}
            <Sprite start={start + 2.4} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
                return (
                  <div style={{
                    position: "absolute", left: 96, top: 740,
                    transform: `translateY(${(1 - t) * 12}px)`,
                    opacity: t
                  }}>
                    <span style={{
                      fontFamily: TM.ui, fontWeight: 500, fontSize: 26,
                      color: TM.text, letterSpacing: "-0.005em"
                    }}>
                      Four inputs in. A four-phase marketing plan out.
                    </span>
                  </div>
                );
              }}
            </Sprite>

            {/* Stat pills — full-width bottom row */}
            <Sprite start={start + 2.9} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutBack(clamp(lt / 0.6, 0, 1));
                const stats = [
                  { v: "27.3s", l: "Median", color: TM.blue },
                  { v: "82,401", l: "Plans shipped", color: TM.orange },
                  { v: "18", l: "Live feeds", color: TM.greenDeep },
                  { v: "99.97%", l: "Uptime", color: TM.navy }
                ];
                return (
                  <div style={{
                    position: "absolute", left: 96, right: 96, top: 900,
                    display: "flex", gap: 14,
                    transform: `translateY(${(1 - t) * 20}px) scale(${0.94 + t * 0.06})`,
                    transformOrigin: "left center",
                    opacity: clamp(t * 1.4, 0, 1)
                  }}>
                    {stats.map((s, i) => (
                      <div key={i} style={{
                        background: TM.chrome,
                        border: `1px solid ${TM.divider}`,
                        borderRadius: 14,
                        padding: "14px 22px",
                        display: "flex", alignItems: "baseline", gap: 10,
                        boxShadow: "0 1px 2px rgba(12,20,38,0.04)"
                      }}>
                        <span style={{
                          fontFamily: TM.display, fontSize: 30, fontWeight: 600,
                          color: s.color, letterSpacing: "-0.02em"
                        }}>{s.v}</span>
                        <span style={{
                          fontFamily: TM.ui, fontSize: 14, color: TM.muted,
                          fontWeight: 500
                        }}>{s.l}</span>
                      </div>
                    ))}
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

window.SceneHook = SceneHook;
