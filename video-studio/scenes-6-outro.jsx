// scenes-6-outro.jsx — 30–34s: Outro. Wordmark, brand promise, CTA, URL.

function SceneOutro({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        // Background drift
        const drift = localTime / duration;
        return (
          <div style={{
            position: "absolute", inset: 0,
            background: `
              radial-gradient(ellipse 60% 50% at ${50 + drift * 6}% ${30 - drift * 4}%, rgba(255,150,20,0.18) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at ${50 - drift * 6}% ${100 - drift * 4}%, rgba(23,168,241,0.18) 0%, transparent 60%),
              ${TM.canvas}
            `,
            overflow: "hidden",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}>
            {/* Logo plate */}
            <Sprite start={start} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutBack(clamp(lt / 0.6, 0, 1));
                return (
                  <div style={{
                    width: 132, height: 132,
                    borderRadius: 28,
                    overflow: "hidden",
                    background: TM.chrome,
                    border: `1px solid ${TM.divider}`,
                    transform: `scale(${0.6 + t * 0.4})`,
                    opacity: clamp(t * 1.5, 0, 1),
                    boxShadow: "0 30px 60px -20px rgba(12,20,38,0.25)"
                  }}>
                    <img src="assets/monkey-logo.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                );
              }}
            </Sprite>

            {/* Wordmark */}
            <Sprite start={start + 0.4} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
                return (
                  <div style={{
                    marginTop: 36,
                    opacity: t,
                    transform: `translateY(${(1 - t) * 16}px)`
                  }}>
                    <Wordmark size={108} />
                  </div>
                );
              }}
            </Sprite>

            {/* Brand promise */}
            <Sprite start={start + 0.9} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
                return (
                  <div style={{
                    marginTop: 28,
                    fontFamily: TM.display, fontWeight: 600, fontSize: 56,
                    color: TM.ink, letterSpacing: "-0.025em",
                    opacity: t,
                    transform: `translateY(${(1 - t) * 12}px)`,
                    textAlign: "center"
                  }}>
                    Brief in. <span style={{ color: TM.orange }}>Plan</span> out.
                  </div>
                );
              }}
            </Sprite>

            {/* Subhead */}
            <Sprite start={start + 1.2} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
                return (
                  <div style={{
                    marginTop: 16,
                    fontFamily: TM.ui, fontWeight: 500, fontSize: 24,
                    color: TM.text, letterSpacing: "-0.005em",
                    opacity: t,
                    transform: `translateY(${(1 - t) * 10}px)`,
                    textAlign: "center"
                  }}>
                    Back to the work that pays.
                  </div>
                );
              }}
            </Sprite>

            {/* CTA button */}
            <Sprite start={start + 1.6} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
                // Pulse the button after entry
                const pulseT = lt > 0.6 ? (lt - 0.6) : 0;
                const pulseScale = 1 + Math.sin(pulseT * 3) * 0.012;
                const haloScale = 1 + (pulseT % 1.4) * 0.5;
                const haloOpacity = 0.4 * Math.max(0, 1 - ((pulseT % 1.4) / 1.4));

                return (
                  <div style={{
                    marginTop: 48,
                    position: "relative",
                    opacity: t,
                    transform: `translateY(${(1 - t) * 12}px) scale(${pulseScale})`
                  }}>
                    {/* Halo */}
                    <div style={{
                      position: "absolute", inset: -16,
                      borderRadius: 24,
                      background: TM.orange,
                      opacity: haloOpacity,
                      transform: `scale(${haloScale})`,
                      pointerEvents: "none"
                    }} />
                    <button style={{
                      position: "relative",
                      display: "inline-flex", alignItems: "center", gap: 16,
                      background: TM.orange, color: TM.ink,
                      padding: "20px 32px",
                      borderRadius: 16,
                      border: 0,
                      fontFamily: TM.ui, fontWeight: 700, fontSize: 22,
                      letterSpacing: "-0.005em"
                    }}>
                      Start a brief — free
                      <span style={{
                        width: 36, height: 36,
                        background: TM.ink, color: TM.orange,
                        borderRadius: "50%",
                        display: "grid", placeItems: "center",
                        fontSize: 20, fontWeight: 700
                      }}>→</span>
                    </button>
                  </div>
                );
              }}
            </Sprite>

            {/* URL */}
            <Sprite start={start + 2.0} end={end}>
              {({ localTime: lt }) => {
                const t = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
                return (
                  <div style={{
                    position: "absolute", bottom: 64, left: 0, right: 0,
                    textAlign: "center",
                    fontFamily: TM.mono, fontSize: 18,
                    color: TM.muted,
                    letterSpacing: "0.04em",
                    opacity: t * 0.8
                  }}>
                    trenchmonkey.app
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

window.SceneOutro = SceneOutro;
