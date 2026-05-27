---
name: trench-monkey-design
description: Use this skill to generate well-branded interfaces and assets for Trench Monkey, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

- `README.md` — full brand/voice/visual reference. Read first.
- `colors_and_type.css` — design tokens as CSS custom properties. Drop into the `<head>` of any HTML.
- `assets/` — mascot, wordmark crops, hero scenes. Use `monkey-logo.png` as the brand mark in every header.
- `ui_kits/app/` — the product UI kit. JSX components + `styles.css` + `index.html` click-thru. Lift `Header.jsx`, `FeatureCard.jsx`, `ProblemSolutionBlock.jsx`, `PitchComposer.jsx` directly.
- `preview/` — design-system tab cards (typography, colors, spacing, components). Reference when you need to see a token in context.

## The two non-negotiables

1. **Blue + Orange always paired.** Never let one show up without the other in a layout. They signal duality (problem/solution, input/output, before/after).
2. **Voice is dry, second-person, slightly-over-it.** No emoji, no "we believe", no buzzwords. Steal real lines from the README's content fundamentals section.
