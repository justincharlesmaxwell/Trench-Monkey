// visuals.jsx — Reusable visualization components for the report.
import React, { useState as useV, useEffect as useVE, useRef as useVR, useMemo as useVM } from 'react';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Award, BarChart3, Binoculars,
  Radio, Building2, Calendar, CalendarX, Check, CheckCircle2,
  ChevronRight, Compass, Cpu, Download, FileEdit, FileText,
  FlaskConical, FolderOpen, Gauge, GitFork, Globe, GripVertical,
  HeartHandshake, History, Images, Info, Instagram, Key,
  Layout, Link2, Loader2, Lock, LockOpen, MailPlus, Mic,
  PieChart, PlayCircle, Plus, Presentation, Puzzle, Ruler,
  Scale, Search, Settings, Share2, Shield, ShieldAlert, Shovel,
  Sparkles, Sun, Target, Trophy, Type, Users, Video, Youtube, Zap,
} from 'lucide-react';

const ICON_MAP = {
  'alert-triangle': AlertTriangle, 'arrow-left': ArrowLeft, 'arrow-right': ArrowRight,
  'award': Award, 'bar-chart-3': BarChart3, 'binoculars': Binoculars,
  'broadcast': Radio, 'building-2': Building2, 'calendar': Calendar,
  'calendar-x': CalendarX, 'check': Check, 'check-circle-2': CheckCircle2,
  'chevron-right': ChevronRight, 'compass': Compass, 'cpu': Cpu,
  'download': Download, 'file-edit': FileEdit, 'file-text': FileText,
  'flask-conical': FlaskConical, 'folder-open': FolderOpen, 'gauge': Gauge,
  'git-fork': GitFork, 'globe': Globe, 'grip-vertical': GripVertical,
  'heart-handshake': HeartHandshake, 'history': History, 'images': Images,
  'info': Info, 'instagram': Instagram, 'key': Key, 'layout': Layout,
  'link-2': Link2, 'loader-2': Loader2, 'lock': Lock, 'lock-open': LockOpen,
  'mail-plus': MailPlus, 'mic': Mic, 'pie-chart': PieChart,
  'play-circle': PlayCircle, 'plus': Plus, 'presentation': Presentation,
  'puzzle': Puzzle, 'ruler': Ruler, 'scale': Scale, 'search': Search,
  'settings': Settings, 'share-2': Share2, 'shield': Shield,
  'shield-alert': ShieldAlert, 'shovel': Shovel, 'sparkles': Sparkles,
  'sun': Sun, 'target': Target, 'trophy': Trophy, 'type': Type,
  'users': Users, 'video': Video, 'youtube': Youtube, 'zap': Zap,
};

// Icons are now React components from lucide-react — no DOM mutation needed.
function useLucide() {}

function Icon({ name, size = 16, color }) {
  const LucideIcon = ICON_MAP[name];
  return LucideIcon ? <LucideIcon size={size} color={color} /> : null;
}

// =====================================================================
// Expandable Card
// =====================================================================
function ExpCard({ icon = "circle", title, meta, defaultOpen = false, children }) {
  const [open, setOpen] = useV(defaultOpen);
  return (
    <div className={"exp-card" + (open ? " exp-card--open" : "")}>
      <button className="exp-card__btn" onClick={() => setOpen(!open)}>
        <span className="exp-card__icon"><Icon name={icon} size={18} /></span>
        <span className="exp-card__title">{title}</span>
        {meta && <span className="exp-card__meta">{meta}</span>}
        <span className="exp-card__chev"><Icon name="chevron-right" size={16} /></span>
      </button>
      {open && <div className="exp-card__body">{children}</div>}
    </div>
  );
}

// =====================================================================
// Tag pill
// =====================================================================
function Tag({ tone = "default", children, icon }) {
  const cls = tone === "default" ? "tag" : `tag tag--${tone}`;
  return (
    <span className={cls}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}

// =====================================================================
// Stat Tile
// =====================================================================
function Stat({ label, value, caption, delta, deltaTone, variant }) {
  const cls = "stat-tile" + (variant === "card" ? " stat-tile--card" : "");
  return (
    <div className={cls}>
      <div className="stat-tile__label">{label}</div>
      <div className="stat-tile__value">{value}</div>
      {delta && (
        <div className={"stat-tile__delta stat-tile__delta--" + (deltaTone || "up")}>
          <Icon name={deltaTone === "down" ? "trending-down" : "trending-up"} size={12} />
          {delta}
        </div>
      )}
      {caption && <div className="stat-tile__caption">{caption}</div>}
    </div>
  );
}

// =====================================================================
// Competitor positioning 2x2 quadrant map
// =====================================================================
function QuadMap({ competitors, yLabels = ["Premium", "Value"], xLabels = ["Showroom-led", "Digital-led"], axis = "Price tier" }) {
  return (
    <div className="quad-map">
      <div className="quad-map__y quad-map__y--top">{yLabels[0]}</div>
      <div className="quad-map__y quad-map__y--bot">{yLabels[1]}</div>
      <div className="quad-map__x quad-map__x--left">{xLabels[0]}</div>
      <div className="quad-map__x quad-map__x--right">{xLabels[1]}</div>
      <div className="quad-map__yaxis"><span>{axis}</span></div>
      <div className="quad-map__plot">
        {competitors.map((c, i) => (
          <div
            key={i}
            className={"quad-map__dot" + (c.isSelf ? " quad-map__dot--self" : "")}
            style={{ left: `${c.x * 100}%`, top: `${(1 - c.y) * 100}%` }}
            title={c.note}
          >
            <span className="quad-map__bubble"></span>
            <span className="quad-map__label">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// SWOT 2x2
// =====================================================================
function SWOT({ data }) {
  const blocks = [
    { key: "strengths",    short: "s", title: "Strengths",    icon: "check-circle-2", items: data.strengths },
    { key: "weaknesses",   short: "w", title: "Weaknesses",   icon: "alert-triangle", items: data.weaknesses },
    { key: "opportunities",short: "o", title: "Opportunities",icon: "compass",        items: data.opportunities },
    { key: "threats",      short: "t", title: "Threats",      icon: "shield-alert",   items: data.threats }
  ];
  return (
    <div className="swot">
      {blocks.map(b => (
        <div key={b.key} className={`swot__quad swot__quad--${b.short}`}>
          <div className="swot__h"><Icon name={b.icon} size={14} /> {b.title}</div>
          <ul className="swot__list">
            {b.items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

// =====================================================================
// Persona Card
// =====================================================================
function PersonaCard({ persona, primary = false }) {
  return (
    <div className="persona">
      <div className="persona__head">
        <div className="persona__avatar">{persona.initials}</div>
        <div style={{ flex: 1 }}>
          <h3 className="persona__name">{persona.name}</h3>
          <p className="persona__role">{persona.role}</p>
        </div>
        {primary && <span className="persona__primary">Primary</span>}
      </div>
      <div className="persona__body">
        <dl className="persona__stats">
          {persona.stats.map((s, i) => (
            <li key={i}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </li>
          ))}
        </dl>
        <div className="persona__quote">{persona.quote}</div>
        <div className="persona__block">
          <strong>Jobs to be done</strong>
          {persona.jtbd}
        </div>
        <div className="persona__block">
          <strong>Pain points</strong>
          {persona.pains}
        </div>
        <div className="persona__block">
          <strong>Where they research</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {persona.channels.map((c, i) => <Tag key={i} tone="ghost">{c}</Tag>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Buyer Journey Map (5 stages × N rows)
// =====================================================================
function JourneyMap({ stages, rows }) {
  return (
    <div className="journey">
      <div className="journey__bar">
        {stages.map((s, i) => <div className="journey__bar-cell" key={i}>{s}</div>)}
      </div>
      <div className="journey__rows">
        {rows.map((row, i) => [
          <div className="journey__rh" key={`rh-${i}`}>
            <Icon name={row.icon} size={14} /> {row.label}
          </div>,
          ...row.cells.map((cell, j) => (
            <div className="journey__cell" key={`c-${i}-${j}`}>
              {row.label === "Emotion" ? (
                <div className="journey__emotion-row">
                  <span className={"journey__face journey__face--" + cell.mood}>
                    <Icon name={cell.icon} size={14} />
                  </span>
                  <span>{cell.text}</span>
                </div>
              ) : (
                <React.Fragment>
                  {cell.title && <strong>{cell.title}</strong>}
                  {cell.body || cell}
                </React.Fragment>
              )}
            </div>
          ))
        ])}
      </div>
    </div>
  );
}

// =====================================================================
// Budget Donut SVG
// =====================================================================
function BudgetDonut({ allocations, total, size = 260, stroke = 36 }) {
  const cx = size / 2, cy = size / 2;
  const r = (size - stroke) / 2 - 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const sumPct = allocations.reduce((s, a) => s + a.pct, 0) || 1;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--tm-card)" strokeWidth={stroke} />
      {allocations.map((a, i) => {
        const frac = (a.pct / sumPct);
        const dash = frac * circ;
        const seg = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={a.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 320ms var(--tm-ease-out)" }}
          />
        );
        offset += dash;
        return seg;
      })}
    </svg>
  );
}

// =====================================================================
// Draggable + Lockable Budget Allocation Rows
// =====================================================================
function BudgetAllocator({ initial, total = 150000, currency = "£", filter = null }) {
  const [allocs, setAllocs] = useV(initial);
  const [locked, setLocked] = useV({});
  const dragSrc = useVR(null);
  const [overId, setOverId] = useV(null);

  const visible = useVM(() => filter
    ? allocs.filter(a => !filter || a.stage.includes(filter))
    : allocs, [allocs, filter]);

  const formatAmount = (pct) => {
    const v = (pct / 100) * total;
    if (v >= 1000) return currency + (v / 1000).toFixed(1) + "k";
    return currency + Math.round(v);
  };

  const toggleLock = (id) => setLocked(L => ({ ...L, [id]: !L[id] }));

  const onDragStart = (e, id) => { dragSrc.current = id; e.dataTransfer.effectAllowed = "move"; };
  const onDragOver = (e, id) => { e.preventDefault(); setOverId(id); };
  const onDrop = (e, id) => {
    e.preventDefault();
    const src = dragSrc.current;
    setOverId(null);
    if (!src || src === id) return;
    setAllocs(arr => {
      const next = [...arr];
      const sIdx = next.findIndex(x => x.id === src);
      const dIdx = next.findIndex(x => x.id === id);
      if (sIdx < 0 || dIdx < 0) return arr;
      const [moved] = next.splice(sIdx, 1);
      next.splice(dIdx, 0, moved);
      return next;
    });
  };
  const onDragEnd = () => { dragSrc.current = null; setOverId(null); };

  return (
    <div className="alloc-list">
      {visible.map(a => (
        <div
          key={a.id}
          className={"alloc-row" + (overId === a.id ? " alloc-row--over" : "")}
          draggable
          onDragStart={(e) => onDragStart(e, a.id)}
          onDragOver={(e) => onDragOver(e, a.id)}
          onDrop={(e) => onDrop(e, a.id)}
          onDragEnd={onDragEnd}
        >
          <span className="alloc-grip"><Icon name="grip-vertical" size={14} /></span>
          <span className="alloc-swatch" style={{ background: a.color }}></span>
          <div className="alloc-name">
            {a.name}
            {a.sub && <span className="alloc-name__sub">· {a.sub}</span>}
          </div>
          <div className="alloc-bar">
            <div className="alloc-bar__fill" style={{ width: `${a.pct}%`, background: a.color }}></div>
          </div>
          <div>
            <div className="alloc-pct">{a.pct}%</div>
            <div className="alloc-amount">{formatAmount(a.pct)}/mo</div>
          </div>
          <button
            className={"alloc-row__lock" + (locked[a.id] ? " alloc-row__lock--on" : "")}
            onClick={() => toggleLock(a.id)}
            title={locked[a.id] ? "Unlock" : "Lock"}
          >
            <Icon name={locked[a.id] ? "lock" : "lock-open"} size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

// =====================================================================
// Funnel diagram (Measurement)
// =====================================================================
function Funnel({ rows }) {
  const counts = rows.map(r => {
    const s = String(r.count || "");
    const n = parseFloat(s.replace(/[^0-9.]/g, "")) * (s.includes("M") ? 1e6 : s.includes("k") ? 1e3 : 1);
    return isNaN(n) ? 0 : n;
  });
  const max = Math.max(...counts, 1);
  return (
    <div className="funnel">
      {rows.map((r, i) => {
        const c = counts[i];
        const w = Math.max(28, Math.round((c / max) * 100));
        return (
          <div className="funnel__row" key={i}>
            <div className={"funnel__bar" + (r.color === "orange" ? " funnel__bar--orange" : "")}
                 style={{ width: `${w}%` }}>
              <span className="funnel__bar__stage">{r.stage}</span>
              <span className="funnel__bar__count">{r.count}</span>
            </div>
            <div className="funnel__meta">
              <strong>{r.channel}</strong>
              <span>{r.caption}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =====================================================================
// Roadmap (timeline)
// =====================================================================
function Roadmap({ streams }) {
  const Pill = ({ kind, label }) => (
    <span className={"roadmap__pill" + (kind ? ` roadmap__pill--${kind}` : "")}>{label}</span>
  );
  return (
    <div className="roadmap">
      <div className="roadmap__header">
        <div>Workstream</div>
        <div>30 days</div>
        <div>60 days</div>
        <div>90 days</div>
      </div>
      {streams.map((s, i) => (
        <div className="roadmap__row" key={i}>
          <div className="roadmap__streamname">{s.stream}<span>{s.sub}</span></div>
          <div className="roadmap__bar"><Pill kind={s.d30.kind} label={s.d30.label} /></div>
          <div className="roadmap__bar"><Pill kind={s.d60.kind} label={s.d60.label} /></div>
          <div className="roadmap__bar"><Pill kind={s.d90.kind} label={s.d90.label} /></div>
        </div>
      ))}
    </div>
  );
}

// =====================================================================
// Channel matrix (effort vs impact)
// =====================================================================
function ChannelMatrix({ channels }) {
  return (
    <div className="quad-map" style={{ aspectRatio: "1.4 / 1" }}>
      <div className="quad-map__y quad-map__y--top">High impact</div>
      <div className="quad-map__y quad-map__y--bot">Low impact</div>
      <div className="quad-map__x quad-map__x--left">Low effort</div>
      <div className="quad-map__x quad-map__x--right">High effort</div>
      <div className="quad-map__yaxis"><span>Impact</span></div>
      <div className="quad-map__plot">
        {channels.map((c, i) => {
          const x = (c.effort - 1) / 9;
          const y = (c.impact - 1) / 9;
          const isTOFU = c.stage.includes("TOFU");
          const isBOFU = c.stage.includes("BOFU");
          const color = isBOFU ? "var(--tm-orange)" : isTOFU ? "var(--tm-blue)" : "var(--tm-navy)";
          return (
            <div
              key={i}
              className="quad-map__dot quad-map__dot--big"
              style={{ left: `${x * 100}%`, top: `${(1 - y) * 100}%` }}
              title={c.note}
            >
              <span className="quad-map__bubble" style={{ background: color, boxShadow: `0 0 0 5px ${color.replace(")", ",0.18)").replace("var(--tm-orange)", "rgba(255,150,20,0.18)").replace("var(--tm-blue)", "rgba(23,168,241,0.18)").replace("var(--tm-navy)", "rgba(9,76,178,0.18)")}` }}></span>
              <span className="quad-map__label">{c.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export {
  Icon, ExpCard, Tag, Stat,
  QuadMap, SWOT, PersonaCard, JourneyMap,
  BudgetDonut, BudgetAllocator,
  Funnel, Roadmap, ChannelMatrix,
  useLucide,
};
