// tokens.jsx — Studio direction tokens shared across all scenes.

const TM = {
  // Brand colors
  blue:        "#17a8f1",
  blueDeep:    "#0d8acd",
  blueSoft:    "#e3f4fe",
  orange:      "#ff9614",
  orangeDeep:  "#ed7e00",
  orangeSoft:  "#fff1de",
  navy:        "#094cb2",
  navyDeep:    "#062f73",
  navySoft:    "#e2ebfa",
  green:       "#1e9e5b",
  greenDeep:   "#178a4e",
  greenSoft:   "#def4e7",

  // Surfaces
  canvas:   "#fafbfd",
  chrome:   "#ffffff",
  card:     "#f3f5fa",
  cardHover: "#e9ecf3",

  // Ink + text
  ink:      "#0c1426",
  ink2:     "#1a2238",
  text:     "#4a5068",
  muted:    "#7e8499",

  // Dividers
  divider:  "#e7eaf1",
  divider2: "#f0f2f7",

  // Fonts
  display:  "Fredoka, system-ui, sans-serif",
  ui:       "\"Plus Jakarta Sans\", system-ui, sans-serif",
  mono:     "\"JetBrains Mono\", ui-monospace, monospace"
};

window.TM = TM;

// ============================================================
// Timestamp tag — surfaces the current second on the root for
// commenting. Same pattern as the existing video.
// ============================================================
function TimestampTag() {
  const time = useTime();
  const sec = Math.floor(time);
  React.useEffect(() => {
    const el = document.querySelector("[data-video-root]");
    if (el) el.setAttribute("data-screen-label", `t=${sec}s`);
  }, [sec]);
  return null;
}
window.TimestampTag = TimestampTag;
