# Pitch Builder

A single-page web app for advertising/marketing agencies to generate new business pitches. Takes a prospect's URL, industry, competitors, and budget — produces market research, audience segmentation, competitor positioning, a seasonal trigger calendar, and a channel budget split. Exports the whole thing to PowerPoint.

Built as plain HTML/CSS/JS — no build step, no backend. Deploys to GitHub Pages in two clicks.

## How it works

1. User enters their Anthropic API key once (stored in `localStorage`, never sent anywhere except `api.anthropic.com`)
2. User fills in 4 fields: company URL, industry, competitors, budget
3. The app calls Claude directly from the browser, asks for structured JSON
4. Renders the result as a styled web page
5. "Export to slides" turns it into a `.pptx` file using [PptxGenJS](https://gitbrent.github.io/PptxGenJS/)

## Local development

It's literally just three static files. Open `index.html` in a browser, or:

```bash
# Any static server works
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Create a new GitHub repo (public or private — Pages works on both with a paid plan; free plan needs public)
2. Push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings** → **Pages**
4. Under "Build and deployment", set **Source** to "Deploy from a branch"
5. Set **Branch** to `main` and folder to `/ (root)`, click **Save**
6. Wait 1–2 minutes. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Getting an Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com/settings/keys)
2. Sign up (you get free credits) or buy credits
3. Create a new API key — copy it (starts with `sk-ant-`)
4. Paste it into the app's settings (⚙ icon, top right)

Each pitch generation uses roughly 5,000–8,000 tokens of Claude Sonnet 4.5 — costs around 2–4 pence per pitch.

## Security note

This app uses the `anthropic-dangerous-direct-browser-access` header to call the Anthropic API directly from the browser. The user's API key never leaves their machine except to go to Anthropic.

**Important caveats:**
- If you share your hosted URL with other people, they'd use their own keys — keys are per-browser via `localStorage`
- Never commit your own API key to the repo
- For a production agency tool used by many people, you'd want a backend proxy (Vercel/Netlify Functions) so the agency holds one shared key and users don't need their own. Ping me if you want that version.

## Customising

- **Prompt:** edit the `buildPrompt()` function in `app.js` — that's where you'd tune the strategist's voice, add your agency's frameworks, change the output schema, etc.
- **Branding:** edit `:root` colour variables in `styles.css` to match your agency. The slide template colours are in `app.js` (`DARK`, `ACCENT`, `BG` constants in `exportToSlides()`).
- **Slide layout:** all in `exportToSlides()` in `app.js`. PptxGenJS is well documented — [pptxgenjs.com](https://gitbrent.github.io/PptxGenJS/).

## File layout

```
/
├── index.html       # App shell, all the UI structure
├── styles.css       # Visual styling
├── app.js           # All logic: API calls, rendering, PPTX export
└── README.md        # This file
```

## Stack

- Vanilla HTML/CSS/JS — no frameworks, no build step
- [PptxGenJS 3.12](https://gitbrent.github.io/PptxGenJS/) for slide export (loaded from CDN)
- Anthropic Claude API (Sonnet 4.5) for the strategic content
