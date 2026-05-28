// LoadingScreen.jsx — Cheeky multi-step progress, mascot bobbing in the middle.
const { useState: useLS, useEffect: useLE } = React;

const LOADING_STEPS = [
  { label: "Digging the trench…",            ms: 900, icon: "shovel" },
  { label: "Sniffing out the market…",       ms: 800, icon: "search" },
  { label: "Stealing competitor secrets…",   ms: 900, icon: "binoculars" },
  { label: "Drawing audience portraits…",    ms: 800, icon: "users" },
  { label: "Splitting the budget pie…",      ms: 700, icon: "pie-chart" },
  { label: "Polishing the pitch deck…",      ms: 600, icon: "sparkles" }
];

function LoadingScreen({ onComplete, brand }) {
  const [current, setCurrent] = useLS(0);
  const [elapsedTime, setElapsedTime] = useLS(0);

  useLE(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  useLE(() => {
    let cancelled = false;
    let running = 0;

    const startInterval = setInterval(() => {
      if (cancelled) return;
      setElapsedTime(t => t + 0.1);
    }, 100);

    async function run() {
      for (let i = 0; i < LOADING_STEPS.length; i++) {
        if (cancelled) return;
        setCurrent(i);
        await new Promise(r => { running = setTimeout(r, LOADING_STEPS[i].ms); });
        if (window.lucide) window.lucide.createIcons();
      }
      if (cancelled) return;
      setCurrent(LOADING_STEPS.length); // all done
      await new Promise(r => setTimeout(r, 300));
      clearInterval(startInterval);
      if (!cancelled) onComplete && onComplete();
    }
    run();
    return () => { cancelled = true; clearTimeout(running); clearInterval(startInterval); };
  }, []);

  return (
    <main className="loading-screen" data-screen-label="02 Loading">
      <div className="loading-screen__mascot">
        <img src="app/assets/monkey-logo.png" alt="Trench Monkey" />
      </div>
      <h2 className="loading-screen__title">
        <span className="blue">Researching</span> <span className="orange">{brand}</span>
      </h2>
      <p className="loading-screen__caption">
        Six dirty jobs, one report. {elapsedTime.toFixed(1)}s elapsed · target under 40s.
      </p>

      <div className="loading-steps">
        {LOADING_STEPS.map((step, i) => {
          const state = i < current ? "done" : i === current ? "active" : "pending";
          return (
            <div key={i} className={"loading-step" + (state === "active" ? " loading-step--active" : state === "done" ? " loading-step--done" : "")}>
              <span className="loading-step__ic">
                <i data-lucide={state === "done" ? "check" : state === "active" ? "loader-2" : step.icon}></i>
              </span>
              <span className="loading-step__label">{step.label}</span>
              {state === "done" && <span className="loading-step__time">✓ done</span>}
              {state === "active" && <span className="loading-step__time">working…</span>}
            </div>
          );
        })}
      </div>
    </main>
  );
}

window.LoadingScreen = LoadingScreen;
