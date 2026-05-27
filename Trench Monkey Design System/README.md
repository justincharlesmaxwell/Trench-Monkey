# Trench Monkey Design System

> Cheeky construction-trench mascot meets serious AI marketing tooling. This system captures the visual + tonal DNA seen in the current product so future designs stay on-brand.

## What is Trench Monkey?

Trench Monkey is an **AI Market Intelligence** app aimed at marketing folks who'd rather be on the golf course than writing pitch decks. The user feeds it a prospect's details — industry, budget, audience — and the app returns a full, presentable pitch: market research, audience segmentation, competitor positioning, seasonal calendar, and budget split. Time-to-value sits "under 40 seconds." The whole vibe leans into a knowing, irreverent voice: digging trenches is hard work — let the monkey do it.

The mascot is a hard-hat-wearing cartoon monkey, rendered photoreal-cartoon (think 3D Pixar-style render). The visual identity pairs that mascot with a tight, businesslike layout: clean white nav, a near-white blue-gray canvas, a single bold sans for content, and a rounded chunky display face for the wordmark and "moment" headings (The Problem / The Solution).

## Source material

This system was reconstructed from **two product screenshots only** — no codebase or Figma was provided.

- `uploads/Screenshot 2026-05-27 at 15.23.55.png` — homepage v1, **uppercase** wordmark `TRENCH MONKEY`
- `uploads/Screenshot 2026-05-27 at 13.33.33.png` — homepage v2, **title-case** wordmark `Trench Monkey`

⚠️ **Caveats from screenshot-only sourcing:**
- Font identity is a visual best-guess. The display face has been substituted with **Fredoka** (Google Fonts, closest rounded-chunky match). The UI/body face is **Plus Jakarta Sans**. If you have the real fonts, drop them into `fonts/` and update `colors_and_type.css`.
- The monkey logo is **cropped out of the screenshot** — it carries the screenshot's white background. A clean transparent-PNG export from the original artwork would replace `assets/monkey-logo.png` cleanly.
- Icons are best-guess **Lucide** — the stroke weight, corner rounding, and shapes (zap, shield, badge-check, history, settings) all match Lucide. If the real product uses something else, swap the CDN link in component files.
- No real component source was available, so the UI kit is reconstructed from the screenshots' visible affordances. Components like buttons, inputs, modals, and the actual pitch-generation flow are inferred from the homepage's visual language.

---

## Content Fundamentals

Trench Monkey's voice is the system's most distinctive asset. It is **deadpan-irreverent on top of a fully serious product proposition**. It treats the reader as a fellow grown-up who is tired of marketing-jargon overpromises.

### Voice characteristics

- **Second person (you / your).** "Enter your prospect's details and Trench Monkey will…" The brand speaks _to_ the user, never about the user. The brand never refers to itself in first-person plural unless it's stating policy ("…never sent to our servers"). The product is named in the third person ("Trench Monkey will research the market…") — almost like it's a colleague doing the dirty work.
- **Confident, slightly cheeky.** "No templates. No guesswork. Just a pitch ready to present." Three-beat staccato closers. The brand is allowed to be funny about itself.
- **Specific numbers > vague claims.** "under 40 seconds," "under 30 seconds." Hard quantities beat soft adjectives. Never "fast" — always _how_ fast.
- **Self-aware irreverence.** The Solution section literally promises to take you "onto the golf course where life really matters." This is the brand's tell: it knows marketing is largely theatre, and it's _on the user's side_ in being slightly over it.
- **Sentence case in body. ALL CAPS for eyebrow labels.** Card eyebrows read `DATA-BACKED`, `INSTANT RESULTS`, `SCHOLARLY PRIVACY` — punchy two-word noun phrases, all caps, letter-spaced.

### Casing & punctuation

- Headings use **sentence case** with proper-noun caps (`World Class AI Market Intelligence`). No title-case-every-word.
- Em dashes (`—`) are welcome and used liberally — they're how the brand keeps long sentences readable.
- Oxford comma, yes.
- Numbers under 100 may be spelled out _or_ numeric — favor numeric when bragging about speed (`40 seconds`, not `forty seconds`).
- **No emoji.** The brand has a mascot for personality; it doesn't need emoji on top.

### Example copy snippets

> **Hero:** World Class AI Market Intelligence
>
> Enter your prospect's details and Trench Monkey will research the market, segment the audience, position against competitors, build a seasonal calendar, and split the budget — all in under 40 seconds.

> **Eyebrow + line:** `INSTANT RESULTS` — Receive a curated deck outline and strategic copy in under 30 seconds.

> **Section moment:** _The Problem_ → _The Solution_. Always paired. The Problem is empathetic and brief; the Solution is borderline absurd, leaning into the mascot world (golf, beers, trenches).

### What to avoid

- AI-pitch-deck buzzwords: "revolutionize," "synergy," "supercharge," "unleash"
- Hedging filler: "powerful," "robust," "world-class" (allowed _only_ ironically in marketing headlines)
- Emoji
- Em dashes as decoration without purpose
- First-person plural ("we believe…") — Trench Monkey doesn't believe, it ships

---

## Visual Foundations

### Color

A four-color brand: **sky-cyan blue**, **warm orange**, **deep navy** accents, and a **near-black ink** for body. Page sits on a barely-tinted blue-gray canvas; cards are a touch cooler than the canvas; nav is near-white.

- **Brand Blue** `#17a8f1` — wordmark "Trench", section heading "The Problem", small accent rules. Sky-cyan, vivid but not neon.
- **Brand Orange** `#ff9614` — wordmark "Monkey", section heading "The Solution". Always paired with Brand Blue, never used alone.
- **Brand Navy** `#094cb2` — deep cobalt. Used for icon glyphs inside feature cards and the small accent rule above the hero.
- **Ink** `#0f1523` — near-black with the slightest blue undertone. Headings + dense type.
- **Text** `#4a5068` — slate. Body copy, secondary UI.
- **Eyebrow** `#414652` — slightly warmer slate, used at small sizes with letter-spacing for labels.
- **Card** `#eef0f7` — pale cool gray, the workhorse surface for feature cards.
- **Canvas** `#f5f6f9` — page background.
- **Chrome** `#fdfdfe` — near-white nav background; effectively white with the merest cool tint.

Use Blue + Orange as **a paired set** to signal duality (problem/solution, before/after, input/output). They never share a single object — one element is blue _or_ orange, not both.

### Type

Two families, both Google Fonts (substitutions — see caveats).

- **Display: Fredoka** (400 / 500 / 600 / 700). Rounded geometric. Used for the wordmark, section "moment" headings ("The Problem"/"The Solution"), and any place the brand wants to feel a little personable. Weight 600–700, tight-to-normal tracking.
- **UI: Plus Jakarta Sans** (400 / 500 / 600 / 700 / 800). Bookish modern sans. Used for headings, body, UI labels. Weight 800 for hero headings, 400 for body, 600 for eyebrows.

Hero headings are tracked tight (`-0.02em`). Body copy sits at `1.55` line-height. Eyebrow labels are `0.75rem`, `font-weight: 600`, `letter-spacing: 0.12em`, uppercase.

### Spacing & rhythm

- Page padding: **64px** desktop, 24px mobile.
- Card padding: **24px**. Card-to-card gap in a row: **20px**.
- Section spacing (vertical between major blocks): **64px**.
- Stack rhythm within a block: **16px** between paragraphs, **24px** between headline and body, **40px** between body and the next visual block (cards, videos).
- Header height: **76px**.

### Corners

- Cards: **16px** border-radius.
- Buttons: **10px**.
- Logo container: **10px** (square-ish with a soft round).
- Video / hero media: **12px**, clipped.
- Pills / chips: **fully rounded** (`9999px`).

Trench Monkey **does not use sharp 0px corners** anywhere visible in the product. Even the wordmark letterforms are rounded.

### Borders, shadows & elevation

- Cards use **flat fill, no shadow, no border**. The slight tint differential from the canvas is the only edge cue. This is deliberate — it keeps the page feeling like one calm document rather than a stack of UI chrome.
- Nav has a **1px hairline bottom border** in `#e5e8ee` to separate from canvas.
- Buttons (when raised) use a soft shadow: `0 1px 2px rgba(15, 21, 35, 0.08), 0 1px 1px rgba(15, 21, 35, 0.04)`.
- No glassmorphism, no blurs, no inner shadows.

### Backgrounds

- Solid colors only. **No gradients** in the product chrome. (Hero photography may contain natural color gradients — that's incidental, not a system pattern.)
- No repeating patterns, no textures, no full-bleed background imagery on UI surfaces.
- Brand imagery sits **inside framed video/image containers** with rounded corners, never as bleeding background.

### Imagery

- **Photoreal cartoon-3D renders** of the mascot in absurd situations: digging in a trench (the problem), drinking with friends (the solution v1), swinging a golf club (the solution v2). The mascot always wears its yellow hard hat.
- Warm, natural light. Saturated but not neon. Slight cinematic depth-of-field.
- Mascot photos are **always presented as embedded video players** with native controls — they're short clips, not stills.
- No stock photography of people. No icons-as-illustration. The mascot _is_ the illustration system.

### Animation

- The product is mostly static — no obvious motion in screenshots. Where motion is needed:
  - **Page transitions**: 200ms ease-out fade + 4px upward translate.
  - **Hover on interactive elements**: 120ms ease-out, opacity 1 → 0.85 _or_ background 1 step darker.
  - **Press on buttons**: scale 0.98 over 80ms.
  - **No bouncy spring physics.** The brand voice is dry; the motion matches.

### Hover & press states

- **Buttons (filled)**: hover lifts the shadow + darkens the fill ~6%. Press flattens shadow + scales 0.98.
- **Cards (interactive)**: hover shifts background from `#eef0f7` to `#e6e9f1`. No translate.
- **Icons / nav buttons**: hover → 100% → 70% opacity over 120ms.
- **Text links**: brand blue at rest, underline on hover. Never color-change on hover (avoid Orange/Blue swap — they're a paired set, not interchangeable).

### Transparency & blur

- Generally **avoid both.** No frosted-glass overlays. Modals dim the background with `rgba(15, 21, 35, 0.5)` and sit on a solid white panel.
- The only acceptable transparency is on overlays/scrims; never on UI surfaces themselves.

### Layout rules

- Top nav: **fixed at top**, full-width, 76px tall, near-white with hairline bottom border. Logo+wordmark on the left, utility icons on the right.
- Main content: **max-width 1100px**, centered, with 64px horizontal padding on the canvas around it.
- Section openers use a tiny **2px-tall, ~32px-wide brand-navy rule** (`#094cb2`) as a section eyebrow — see top of hero in the screenshots.
- Two-up content blocks (Problem / Solution) sit on a 12-column conceptual grid as 6-and-6.
- Three-up feature cards take equal thirds with 20px gaps.

---

## Iconography

See the `ICONOGRAPHY` section in this README below.

The product appears to use **Lucide** icons. Visible in the screenshots:

- `badge-check` (Data-Backed eyebrow card)
- `zap` (Instant Results card)
- `shield` (Scholarly Privacy card)
- `history` (top-right nav, recent pitches)
- `settings` (top-right nav, gear)

All icons render in **Brand Navy** `#094cb2` when used as semantic accents inside cards, and in **Text** `#4a5068` when used as nav utility chrome. Stroke weight is `2px` (Lucide default). Size is **20px** for nav chrome, **24px** for card icons.

We pull Lucide from CDN via `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js">` in the UI kit. Icon names map 1:1 to Lucide's catalogue.

**No emoji.** **No unicode glyphs as icons** (no `→`, `✓`, `★` standing in for an icon). When the screenshots show punctuation that looks decorative, like em dashes, it's typographic, not iconographic.

**No PNG icons** in the product chrome. The only PNG raster asset is the **mascot logo** and the embedded video posters.

### Iconography substitution flag

⚠️ Lucide is a **best-guess substitution** based on visual matching. If the real product uses Heroicons, Phosphor, or a custom set, replace `assets/iconography.md` and the CDN link in `ui_kits/app/index.html`.

---

## Index

```
README.md                      ← you are here
SKILL.md                       ← agent-skill manifest (cross-compatible with Claude Code skills)
colors_and_type.css            ← CSS custom properties for the whole system
fonts/                         ← (empty — using Google Fonts via CDN)
assets/
  monkey-logo.png              ← mascot, cropped from screenshot
  wordmark-uppercase.png       ← TRENCH MONKEY wordmark variant
  wordmark-titlecase.png       ← Trench Monkey wordmark variant
  hero-trench.jpg              ← "The Problem" mascot scene (trench)
  hero-pub.jpg                 ← "The Solution" mascot scene v1 (pub)
  hero-golf.jpg                ← "The Solution" mascot scene v2 (golf course)
preview/                       ← Design System tab card files
ui_kits/
  app/                         ← the Trench Monkey product UI kit
    README.md
    index.html
    Header.jsx
    HeroSection.jsx
    FeatureCard.jsx
    ProblemSolutionBlock.jsx
    PitchComposer.jsx
    Button.jsx
```

---

## Open questions / asks for the user

1. **Real font files?** Fredoka + Plus Jakarta Sans are my best guesses. If you have the originals, send them.
2. **Real logo asset?** The current logo is cropped from your screenshot. A clean transparent PNG or SVG of the mascot would replace it cleanly.
3. **Icon library confirmation?** I've assumed Lucide. Confirm or send the real one.
4. **Buttons / forms / modals?** Not visible in the provided screenshots — I've inferred them from the visual language. Send screenshots of any other surfaces (form fields, the pitch-input flow, settings, history) and I'll re-render them.
