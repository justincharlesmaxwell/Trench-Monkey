// main.jsx — Compose all 6 scenes for the Studio promo video.
// Total: ~34s.

const T = {
  hookStart:    0.0,  hookEnd:    4.5,
  briefStart:   4.5,  briefEnd:   11.0,
  workStart:    11.0, workEnd:    16.0,
  planStart:    16.0, planEnd:    25.0,
  tabsStart:    25.0, tabsEnd:    30.0,
  outroStart:   30.0, outroEnd:   34.0
};

function SceneTransition({ at, color = "#ffffff", width = 0.35 }) {
  return (
    <Sprite start={at - width / 2} end={at + width / 2}>
      {({ localTime, duration }) => {
        const t = localTime / duration;
        // Wipe left-to-right
        const clip = `inset(0 ${(1 - t) * 100}% 0 0)`;
        return (
          <div style={{
            position: "absolute", inset: 0,
            background: color,
            clipPath: clip,
            pointerEvents: "none",
            zIndex: 99
          }} />
        );
      }}
    </Sprite>
  );
}

function Video() {
  return (
    <div data-video-root data-screen-label="t=0s" style={{ position: "absolute", inset: 0 }}>
      <Stage
        width={1920}
        height={1080}
        duration={34}
        background={TM.canvas}
        loop={true}
        autoplay={true}
      >
        <TimestampTag />

        {/* Scenes */}
        <SceneHook    start={T.hookStart}  end={T.hookEnd} />
        <SceneBrief   start={T.briefStart} end={T.briefEnd} />
        <SceneWorking start={T.workStart}  end={T.workEnd} />
        <ScenePlan    start={T.planStart}  end={T.planEnd} />
        <SceneTabs    start={T.tabsStart}  end={T.tabsEnd} />
        <SceneOutro   start={T.outroStart} end={T.outroEnd} />

        {/* Wipes between scenes */}
        <SceneTransition at={T.hookEnd}  color="#ffffff" />
        <SceneTransition at={T.briefEnd} color={TM.ink} />
        <SceneTransition at={T.workEnd}  color="#ffffff" />
        <SceneTransition at={T.planEnd}  color="#ffffff" />
        <SceneTransition at={T.tabsEnd}  color="#ffffff" />
      </Stage>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Video />);
