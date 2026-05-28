// ui-bits.jsx — Studio-aesthetic UI mocks reused across scenes.
// All components are pure presentational; pass values in via props.

// ============================================================
// Wordmark
// ============================================================
function Wordmark({ size = 72, gap = 14, color = "default" }) {
  const blue = color === "white" ? "#fff" : TM.blue;
  const orange = color === "white" ? "rgba(255,255,255,0.7)" : TM.orange;
  return (
    <span style={{
      fontFamily: TM.display, fontWeight: 600, fontSize: size,
      letterSpacing: "-0.015em", lineHeight: 1,
      display: "inline-flex", alignItems: "baseline", gap: gap * 0.25
    }}>
      <span style={{ color: blue }}>Trench</span>
      <span style={{ color: orange }}>Monkey</span>
    </span>
  );
}
window.Wordmark = Wordmark;

// Mini brand lockup (logo plate + wordmark) for app/nav
function BrandLockup({ size = 36, fontSize = 22 }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: size, height: size, borderRadius: 8,
        overflow: "hidden", background: TM.blueSoft,
        display: "grid", placeItems: "center"
      }}>
        <img src="assets/monkey-logo.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <Wordmark size={fontSize} />
    </div>
  );
}
window.BrandLockup = BrandLockup;

// ============================================================
// Browser chrome — frames any embedded UI shot
// ============================================================
function BrowserChrome({ url, width, height, children, tilt = 0 }) {
  return (
    <div style={{
      width, background: TM.chrome,
      border: `1px solid ${TM.divider}`,
      borderRadius: 18,
      boxShadow: "0 1px 2px rgba(12,20,38,0.04), 0 30px 70px -20px rgba(12,20,38,0.18)",
      overflow: "hidden",
      transform: tilt ? `rotate(${tilt}deg)` : undefined
    }}>
      <div style={{
        height: 42, display: "flex", alignItems: "center", gap: 8,
        padding: "0 16px",
        borderBottom: `1px solid ${TM.divider}`
      }}>
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c941" }} />
        <span style={{
          flex: 1, textAlign: "center",
          fontFamily: TM.mono, fontSize: 12, color: TM.muted,
          background: TM.card, padding: "5px 12px", borderRadius: 6,
          margin: "0 24px"
        }}>{url}</span>
      </div>
      <div style={{ width: "100%", height: height - 42, background: TM.chrome }}>
        {children}
      </div>
    </div>
  );
}
window.BrowserChrome = BrowserChrome;

// ============================================================
// Donut chart (animated)
// progress: 0–1 — sweeps the segments in around the ring
// ============================================================
function Donut({ data, palette, size = 240, progress = 1, showCenter = true, center = "£150K", subCenter = "PER MONTH" }) {
  const r = 14;
  const C = 2 * Math.PI * r;
  // Compute cumulative percentages
  let offset = 0;
  const segs = data.map((d) => {
    const start = offset;
    offset += d.pct;
    return { ...d, start, end: offset };
  });
  // Animate the global progress against the cumulative %
  const totalPct = progress * 100;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <circle cx="20" cy="20" r={r} fill="none" stroke={TM.divider2} strokeWidth="6" />
      {segs.map((s, i) => {
        const visible = Math.max(0, Math.min(s.end, totalPct) - s.start);
        if (visible <= 0) return null;
        const len = (visible / 100) * C;
        const off = (s.start / 100) * C;
        return (
          <circle key={i} cx="20" cy="20" r={r} fill="none"
            stroke={palette[s.key]} strokeWidth="6"
            strokeDasharray={`${len} ${C}`}
            strokeDashoffset={-off}
            transform="rotate(-90 20 20)" />
        );
      })}
      {showCenter && (
        <React.Fragment>
          <text x="20" y="21" textAnchor="middle" fontSize="6" fontWeight="700" fill={TM.ink} fontFamily="Fredoka">{center}</text>
          {subCenter && <text x="20" y="27" textAnchor="middle" fontSize="2.6" fill={TM.muted} fontFamily="JetBrains Mono" letterSpacing="0.1em">{subCenter}</text>}
        </React.Fragment>
      )}
    </svg>
  );
}
window.Donut = Donut;

// ============================================================
// Audience bars
// progress: 0–1 — fills the bars to their final width
// ============================================================
function AudienceBars({ data, progress = 1, fontSize = 13 }) {
  const colors = [TM.blue, TM.orange, TM.navy, "url(#audGrad)"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((a, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ color: TM.ink, fontSize, fontWeight: 500 }}>{a.name}</span>
            <span style={{ color: TM.ink, fontFamily: TM.mono, fontSize: fontSize - 1, fontWeight: 600 }}>{a.pct}%</span>
          </div>
          <div style={{ height: 6, background: TM.card, borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${a.pct * progress}%`,
              background: i === 3 ? `linear-gradient(90deg, ${TM.blue}, ${TM.orange})` : colors[i],
              borderRadius: 3,
              transition: "width 0.05s linear"
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
window.AudienceBars = AudienceBars;

// ============================================================
// Phase tabs
// active: id of active phase. shrink: scale factor.
// ============================================================
const PHASES = [
  { id: "diagnosis",   num: "01", label: "Diagnosis" },
  { id: "strategy",    num: "02", label: "Strategy" },
  { id: "tactics",     num: "03", label: "Tactics" },
  { id: "measurement", num: "04", label: "Measurement" }
];
window.PHASES = PHASES;

function PhaseTabs({ active, fontSize = 16, gap = 8, scale = 1 }) {
  return (
    <div style={{
      display: "inline-flex",
      gap: 6,
      padding: 5,
      background: TM.card,
      borderRadius: 12,
      transform: `scale(${scale})`,
      transformOrigin: "left center"
    }}>
      {PHASES.map((p) => {
        const isActive = p.id === active;
        return (
          <div key={p.id} style={{
            padding: "10px 18px",
            borderRadius: 8,
            background: isActive ? TM.chrome : "transparent",
            color: isActive ? TM.ink : TM.text,
            boxShadow: isActive ? "0 1px 2px rgba(12,20,38,0.08)" : "none",
            fontWeight: 600, fontSize, fontFamily: TM.ui,
            display: "inline-flex", alignItems: "center", gap: 8,
            transition: "all 0.18s cubic-bezier(0.2, 0.7, 0.2, 1)"
          }}>
            <span style={{ fontFamily: TM.mono, fontSize: fontSize - 2, color: isActive ? TM.blue : TM.muted }}>{p.num}</span>
            {p.label}
          </div>
        );
      })}
    </div>
  );
}
window.PhaseTabs = PhaseTabs;

// ============================================================
// Plan module shell
// ============================================================
function PlanMod({ title, meta, children, style }) {
  return (
    <div style={{
      background: TM.chrome,
      border: `1px solid ${TM.divider}`,
      borderRadius: 14,
      padding: 22,
      display: "flex", flexDirection: "column", gap: 14,
      ...style
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        paddingBottom: 12, borderBottom: `1px solid ${TM.divider2}`
      }}>
        <span style={{ fontFamily: TM.display, fontSize: 18, fontWeight: 600, color: TM.ink, letterSpacing: "-0.01em" }}>{title}</span>
        <span style={{ fontFamily: TM.mono, fontSize: 12, color: TM.muted }}>{meta}</span>
      </div>
      {children}
    </div>
  );
}
window.PlanMod = PlanMod;

// ============================================================
// Cursor — pointer arrow for click choreography
// ============================================================
function Cursor({ x, y, scale = 1 }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" style={{
      position: "absolute", left: x, top: y, transform: `scale(${scale})`,
      transformOrigin: "top left", pointerEvents: "none", zIndex: 100,
      filter: "drop-shadow(0 6px 14px rgba(12,20,38,0.35))"
    }}>
      <path d="M5 3 L5 19 L9.5 15 L12.5 22 L15 21 L12 14 L18 14 Z"
        fill={TM.ink} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
window.Cursor = Cursor;

// ============================================================
// Sample data (mirrors the marketing page's SAMPLE)
// ============================================================
window.SAMPLE = {
  brand: { name: "Magnet", url: "magnet.co.uk" },
  industry: "Home improvement · Fitted kitchens",
  competitors: ["Wren", "Howdens", "IKEA", "B&Q", "Wickes"],
  budget: { value: "£150,000", cadence: "per month" },

  phases: PHASES,

  budgetSplit: [
    { name: "Paid social",   pct: 28, key: "blue" },
    { name: "Paid search",   pct: 22, key: "orange" },
    { name: "SEO & content", pct: 18, key: "green" },
    { name: "Email & CRM",   pct: 12, key: "blue" },
    { name: "Partnerships",  pct: 10, key: "orange" },
    { name: "Brand",         pct: 10, key: "navy" }
  ],

  audience: [
    { name: "Renovators, 35–54",        pct: 42 },
    { name: "First-time buyers, 28–40", pct: 28 },
    { name: "Trade professionals",      pct: 18 },
    { name: "Interior designers",       pct: 12 }
  ]
};

window.PALETTE = {
  blue:   TM.blue,
  orange: TM.orange,
  navy:   TM.navy,
  green:  TM.green
};
