# Jyoti Narang — SAP leadership portfolio

A multi-page portfolio for Director / Senior Director opportunities in SAP finance transformation, treasury modernization and enterprise AI. It brings enterprise engagements, ongoing agent projects, publications, speaking and community work into one interface.

## Run locally

From this directory:

```powershell
npm start
```

Open http://127.0.0.1:4173 . Alternatively, double-click `Start-Portfolio.cmd`. Keep the process running for folder updates. No npm dependencies need to be installed. Development used Node.js 24.22.1 and Windows PowerShell 5.1.

## Maintain and verify

```powershell
npm run build
npm test
```

- Editorial content and GitHub configuration: [dist/data/content.js](dist/data/content.js).
- Section copy: [content/sections.json](content/sections.json).
- Page generation and navigation: [scripts/build-pages.mjs](scripts/build-pages.mjs).
- Local folder connections: `sources.local.json` (ignored by Git).

The site has nine pages, including dedicated Lockbox Agent and Cash Sweep Agent experiences. Lockbox is an illustrative workbench with synthetic data; Cash Sweep is a planning calculator. Neither connects to a live SAP system or moves money.

## Current status: November 19, 2026

- The home page is now a speaking and publishing hub: SAP Press book banner, three signature pillars, a demo showcase with modals, a speaker kit, Executive Storytelling videos and a smart inquiry form.
- New demo: Treasury Transformation ROI Simulator (`roi-simulator.html`, standalone at `demos/roi/`).
- SEO: canonical, OpenGraph and Twitter tags on every page, Person JSON-LD on the home page, a sitemap, robots, a 404 page, a CNAME and a social card (`assets/og-card.jpg`).
- Hosting plan: GitHub Pages at https://jyotinarang.com. Not deployed yet; see [deployment](docs/DEPLOYMENT.md).
- The inquiry form needs a Web3Forms key in `dist/data/content.js` to deliver email. Until then it opens the visitor's email app.

## Earlier status: November 11, 2026

- Local routes, internal links, project calculations and GitHub helper tests passed.
- GitHub username `jyotinarang-hue` is configured. Live repository retrieval could not be verified from this environment.
- BD and CSL folder scanning is working. Perdue and MSC folder locations remain unresolved.
- Credly and Toastmasters achievements await accessible evidence; no unverified credentials are marked current.
- Git is installed. Hosted publishing is blocked by connectivity to the Sites source server; no deployment succeeded.
- Visual browser QA remains unverified because browser startup timed out.

## Documentation

Start with the [documentation index](docs/INDEX.md) or [project memory](MEMORY.md). The docs include architecture, context, source provenance, build history, decisions, operating instructions, testing and deployment recovery.
