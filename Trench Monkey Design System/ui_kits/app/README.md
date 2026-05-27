# Trench Monkey App — UI Kit

A click-thru recreation of the Trench Monkey homepage / pitch-generator app, built from the two reference screenshots. All visuals use the system tokens from `../../colors_and_type.css`.

## Files

- `index.html` — top-level page; demonstrates Header → Hero → FeatureCards → PitchComposer → Problem/Solution moment. Click "Generate pitch" to see the composer flow.
- `Header.jsx` — fixed top nav, mascot logo + wordmark, history/settings icons.
- `HeroSection.jsx` — navy section rule + hero headline + lede + supporting paragraph.
- `FeatureCard.jsx` — single icon-eyebrow-description card (used three-up).
- `PitchComposer.jsx` — the inferred "enter your prospect's details" form. Not visible in screenshots; reconstructed from the hero copy promising prospect details → market research output.
- `ProblemSolutionBlock.jsx` — paired display-headed block with embedded mascot video.
- `Button.jsx` — primary / accent / secondary / ghost.

## Status

- **Header**: matched 1:1 to screenshots.
- **Hero + Feature cards + Problem/Solution**: matched 1:1 to screenshots.
- **PitchComposer**: **inferred**, not in screenshots. Sized and styled to match the visual language. Flag for review.
- The video clips themselves are not available — the embedded `<video>` tags use the cropped poster images from the screenshots and `controls` for fidelity, but won't actually play. Drop real `.mp4` files into `ui_kits/app/media/` and update the `<source src>` attributes.

## Substitutions flagged

See root `README.md` "Open questions" — fonts (Fredoka / Plus Jakarta Sans), icon set (Lucide), and the mascot logo (cropped from screenshot, carries white background instead of being a clean transparent PNG).
