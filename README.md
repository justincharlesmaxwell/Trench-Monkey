# Trench Monkey

A single-page web app for advertising/marketing agencies to generate new business pitches. Takes a prospect's URL, industry, competitors, and budget — and produces a four-phase marketing plan (Diagnosis → Strategy → Tactics → Measurement): market research, audience segments and personas, competitor positioning, channel budget split, a 30/60/90 roadmap, KPIs, and a measurement framework. Export the whole thing to PDF.

Built as plain HTML + in-browser React — no build step, no backend. Deploys to GitHub Pages in two clicks.

## How it works

1. User enters their Anthropic API key once (stored in `localStorage`, never sent anywhere except `api.anthropic.com`)
2. User fills in four fields: company URL, industry, competitors, budget (with a currency selector)
3. The app calls Claude directly from the browser, asking for a single structured JSON document
4. `app/transform.jsx` maps that JSON into the report's data shape (with safe fallbacks if a field is missing)
5. The report renders as a styled, navigable four-phase web page
6. **Export PDF** opens the browser print dialog with a print stylesheet (choose "Save as PDF"); **Copy summary** puts a Markdown digest on the clipboard

## Local development

No build step — it's static files. Open `index.html` via any static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

React, ReactDOM, and Babel are loaded from a CDN and the `.jsx` files are transpiled in the browser, so you must serve over HTTP (not `file://`).

## Deploying to GitHub Pages

1. Create a new GitHub repo (public, or private on a paid plan)
2. Push everything — **including the `app/` directory** — to the `main` branch
3. In the repo: **Settings** → **Pages**
4. Under "Build and deployment", set **Source** to "Deploy from a branch"
5. Set **Branch** to `main` and folder to `/ (root)`, click **Save**
6. Wait 1–2 minutes. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Getting an Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com/settings/keys)
2. Sign up (you get free credits) or buy credits
3. Create a new API key — copy it (starts with `sk-ant-`)
4. Paste it into the app when prompted (or via the tweaks panel → "Set API key")

By default the app uses **Claude Sonnet 4.6**, which costs roughly 2–4 pence per pitch. Switch to Opus for deeper output by changing `TM_MODEL` in `app/app.jsx` (it raises cost several-fold).

## Security note

This app uses the `anthropic-dangerous-direct-browser-access` header to call the Anthropic API directly from the browser. The user's API key never leaves their machine except to go to Anthropic.

**Important caveats:**
- If you share your hosted URL with other people, they'd use their own keys — keys are per-browser via `localStorage`
- Never commit your own API key to the repo
- For a production agency tool used by many people, you'd want a backend proxy (Vercel/Netlify Functions) so the agency holds one shared key and users don't need their own

## Customising

- **Prompt & output schema:** edit `callClaude()` in `app/app.jsx` — that's where the strategist's voice and the JSON schema live. The model is the `TM_MODEL` constant in the same file.
- **Data mapping:** `app/transform.jsx` turns Claude's JSON into the report shape. Each section falls back to a heuristic if the model omits a field.
- **Report content & layout:** the four phase views are in `app/phases.jsx`; reusable visual components in `app/visuals.jsx`.
- **Branding:** edit the colour and type tokens in `app/colors_and_type.css`.

## File layout

```
/
├── index.html                # App shell; loads React + the app/ modules
├── app/
│   ├── app.jsx               # Root component, Claude API call, routing
│   ├── InputForm.jsx         # Landing page + prospect brief form
│   ├── LoadingScreen.jsx     # Generation progress
│   ├── Report.jsx            # Report shell, nav, PDF export, copy summary
│   ├── phases.jsx            # The four phase views
│   ├── transform.jsx         # Claude JSON → report data shape
│   ├── visuals.jsx           # Reusable charts/cards
│   ├── tweaks-panel.jsx      # Dev tweaks panel
│   ├── *.css                 # Styles + design tokens
│   └── assets/               # Logo, images
└── README.md                 # This file
```

## Tests

A lightweight, dependency-free test for the data transform:

```bash
node app/transform.test.js
```

## Stack

- HTML + in-browser React 18 (transpiled by Babel standalone from a CDN) — no build step
- Anthropic Claude API (Sonnet 4.6 by default) for the strategic content
- Browser print for PDF export
</content>
</invoke>
