# CaseCraft

A researched repository of business & product case studies. Pick a sector, pick a product, and read through six tabs: **What it does**, **Differentiator / MOAT**, **Product teardown**, **Metrics**, **Improvements**, and **Interview questions**.

This is a plain static site — no build step, no framework, no dependencies. It's just `index.html` + `styles.css` + `app.js` + `data.js`. That means it deploys to Vercel in about a minute and you never have to fight a broken `npm install`.

## What's included right now

10 fully researched case studies across 7 sectors:

- **Fintech & Payments** — Stripe, Zerodha, CRED
- **Marketplaces & Travel** — Airbnb
- **SaaS & Productivity** — Notion, Figma
- **Streaming & Media** — Netflix
- **Consumer & EdTech** — Duolingo
- **Quick Commerce & Retail** — Zepto
- **Mobility & Logistics** — Uber

Every case study is built from real, current financial and strategic research (SEC filings, shareholder letters, and reporting current as of September 2026), not generic filler.

## Deploying to Vercel

**Option A — drag and drop (fastest):**
1. Go to [vercel.com/new](https://vercel.com/new).
2. Drag this whole folder onto the page, or use "Deploy" → upload folder.
3. Vercel will detect it as a static site automatically (no framework, no build command needed). Click Deploy.

**Option B — via GitHub (recommended for ongoing updates):**
1. Create a new GitHub repo and push this folder to it:
   ```bash
   cd casecraft
   git init
   git add .
   git commit -m "Initial CaseCraft site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/casecraft.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), import the GitHub repo.
3. Leave all build settings blank/default — Vercel will serve the static files as-is.
4. Every future `git push` auto-deploys.

**Option C — Vercel CLI:**
```bash
npm i -g vercel
cd casecraft
vercel
```

## Previewing locally

No install needed — any static file server works:
```bash
cd casecraft
python3 -m http.server 8000
# open http://localhost:8000
```

## Adding more case studies (for future batches)

All content lives in one file: `data.js`. Each case study is a plain JS object appended to the `CASE_STUDIES` array. To add a new one, copy this template and fill it in — the site will pick it up automatically, no other file needs to change:

```js
{
  slug: "company-slug",              // used in the URL, lowercase, no spaces
  name: "Company Name",
  sector: "Fintech & Payments",       // must match one of the SECTORS values, or add a new sector to the SECTORS array at the top of data.js
  oneLiner: "One sentence describing what it is.",
  founded: "2015",
  hq: "City, Country",
  founders: "Name One, Name Two",
  logoLetter: "C",                    // single letter shown in the logo badge

  whatItDoes: [
    { heading: "The core product", body: "..." },
    { heading: "...", body: "..." },
  ],
  moat: [
    { heading: "...", body: "..." },
  ],
  teardown: [
    { heading: "...", body: "..." },
  ],
  metrics: [
    { label: "Revenue (2025)", value: "$1.2B", note: "+20% YoY" },
  ],
  improvements: [
    { title: "...", body: "..." },
  ],
  interview: [
    { category: "Product sense", question: "...", angle: "What a strong answer covers..." },
  ],
}
```

Guidance for keeping quality high as you scale up:
- **Research before writing.** Every existing entry is grounded in real filings, shareholder letters, or reputable reporting — not assumption. Pull current numbers before writing metrics.
- **3–4 sub-sections per tab is plenty** for "What it does", "MOAT", and "Teardown" — depth over exhaustiveness.
- **4–6 metrics** with a clear source-year label reads better than a wall of numbers.
- **4 improvements, each with a one-sentence "why"** is enough; avoid generic advice ("do more marketing").
- **5 interview questions** spanning product sense, strategy, metrics, a guesstimate, and an execution/RCA question gives good category coverage.

If you want, come back and ask for the next batch (aim for 8–10 at a time) and specify sectors — I'll research and write them in the same format.
