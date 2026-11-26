import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const ver = f => crypto.createHash('md5').update(fs.readFileSync(path.join('dist', f))).digest('hex').slice(0, 8);

const sections = JSON.parse(fs.readFileSync('content/sections.json', 'utf8').replace(/^\uFEFF/, ''));
const context = {window: {}}; vm.createContext(context);
vm.runInContext(fs.readFileSync('dist/data/content.js', 'utf8'), context);
const content = context.window.PORTFOLIO_CONTENT;
const site = content.site;
const BASE = site.url.replace(/\/$/, '');

const escape = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const links = [['index.html', 'Home'], ['projects.html', 'Demos'], ['speaking.html', 'Speaking'], ['publications.html', 'Publications'], ['experience.html', 'Experience'], ['community.html', 'Community'], ['credentials.html', 'Credentials']];
const pages = [];
function add(file, title, description, body, extra = '', opts = {}) { pages.push({file, title, description, body, extra, ...opts}); }
const teaser = (title, text, url, label) => `<article class="hub-card"><h3>${title}</h3><p>${text}</p><a class="link" href="${url}">${label} ↗</a></article>`;
const hero = (eyebrow, title, description) => `<section class="page-hero section"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="intro">${description}</p></section>`;
const rootLink = html => html.replace(/href="#work"/g, 'href="experience.html"').replace(/href="#ideas"/g, 'href="publications.html"').replace(/href="#projects"/g, 'href="projects.html"');
const projectPages = Object.fromEntries(content.projects.map(p => [p.id, p.page]));

// ── Reusable generated sections ──
const book = content.book;
const bookBanner = `<section id="book" class="section book-banner"><div class="book-cover" aria-hidden="true"><span>WEEKLY SERIES</span><strong>${escape(book.title)}</strong><small>Jyoti Narang</small></div><div><p class="eyebrow">${escape(book.badge)}</p><h2>From a vague request<br><em>to a live SAP solution.</em></h2><p class="large">${escape(book.summary)}</p><p class="small-note">${escape(book.status)}.${book.titleIsWorking ? ' Working title; subject to publisher approval.' : ''} <a class="link" href="https://www.linkedin.com/posts/jyoti-narang-30a8ba56_translate-trace-transform-preface-ugcPost-7529622513140830209-P5mk/" target="_blank" rel="noopener">Read the preface on LinkedIn ↗</a></p><form class="notify-form" data-notify novalidate><label for="notify-email">Get each new recipe and the book announcement</label><div class="notify-row"><input id="notify-email" name="email" type="email" autocomplete="email" placeholder="you@company.com" required maxlength="160"><input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="button" type="submit">Notify me ↗</button></div><p class="form-status" role="status" aria-live="polite"></p></form></div></section>`;

const kit = content.speakerKit;
const paras = t => t.split(/\n\n+/).map(p => `<p>${escape(p)}</p>`).join('');
const wordCount = t => t.trim().split(/\s+/).length;
const speakerKit = `<section id="speaker-kit" class="section speaker-kit"><p class="eyebrow">ONE-CLICK SPEAKER KIT</p><div class="heading"><h2>Everything you need<br><em>for the program.</em></h2><p>Copy a bio straight into your agenda, review the signature topics or download the full kit with headshot.</p></div><div class="tabs" role="tablist" aria-label="Speaker kit"><button role="tab" id="tab-short" aria-controls="panel-short" aria-selected="true">Short bio</button><button role="tab" id="tab-long" aria-controls="panel-long" aria-selected="false" tabindex="-1">Long bio</button><button role="tab" id="tab-topics" aria-controls="panel-topics" aria-selected="false" tabindex="-1">Keynote topics</button><button role="tab" id="tab-assets" aria-controls="panel-assets" aria-selected="false" tabindex="-1">Headshot &amp; download</button></div>
<div class="tab-panel" role="tabpanel" id="panel-short" aria-labelledby="tab-short"><div class="bio-text" id="bio-short">${paras(kit.shortBio)}</div><div class="kit-actions"><button class="button" type="button" data-copy="bio-short">Copy short bio</button><span class="small-note">${wordCount(kit.shortBio)} words</span></div></div>
<div class="tab-panel" role="tabpanel" id="panel-long" aria-labelledby="tab-long" hidden><div class="bio-text" id="bio-long">${paras(kit.longBio)}</div><div class="kit-actions"><button class="button" type="button" data-copy="bio-long">Copy long bio</button><span class="small-note">${wordCount(kit.longBio)} words</span></div></div>
<div class="tab-panel" role="tabpanel" id="panel-topics" aria-labelledby="tab-topics" hidden><div class="topic-grid">${kit.topics.map((t, i) => `<article class="topic"><span>0${i + 1}</span><h3>${escape(t.title)}</h3><p class="eyebrow">${escape(t.audience)}</p><h4>Audiences leave knowing</h4><ol>${t.takeaways.map(k => `<li>${escape(k)}</li>`).join('')}</ol></article>`).join('')}</div><div class="kit-actions"><a class="button" href="#inquire" data-topic="keynote">Request one of these topics ↗</a></div></div>
<div class="tab-panel" role="tabpanel" id="panel-assets" aria-labelledby="tab-assets" hidden><div class="assets-row"><img src="assets/jyoti-narang.jpg" alt="Headshot of Jyoti Narang" width="220" height="260" loading="lazy"><div><h3>Headshot &amp; speaker kit</h3><p>High-resolution headshot for programs and promotion, plus a plain-text kit with both bios and all three topics.</p><div class="kit-actions"><a class="button" href="assets/jyoti-narang-full.jpg" download="Jyoti-Narang-headshot.jpg">Download headshot ↗</a><a class="button" href="assets/brand/jyoti-narang-logo.png" download="Jyoti-Narang-logo.png">Download logo ↗</a><a class="link" href="assets/brand/jyoti-narang-logo-pack.zip" download>Logo pack (.zip) ↗</a><button class="link-button" type="button" data-download-kit>Download speaker kit (.txt) ↗</button><a class="link" href="assets/Jyoti-Narang-Resume.docx" download>Resume (.docx) ↗</a></div></div></div></div><p class="form-status kit-status" role="status" aria-live="polite"></p></section>`;

const videoCard = v => {
  const id = /^[A-Za-z0-9_-]{11}$/.test(v.youtubeId || '') ? v.youtubeId : '';
  const frame = id
    ? `<button class="video-frame" type="button" data-youtube="${id}" aria-label="Play ${escape(v.title)}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><span class="play" aria-hidden="true">▶</span></button>`
    : `<div class="video-frame is-pending"><span class="pending-mark">JN</span><span class="pending-text">Recording link coming soon</span></div>`;
  return `<article class="video-card">${frame}<p class="eyebrow">${escape(v.label)}</p><h3>${escape(v.title)}</h3><p>${escape(v.description)}</p>${id ? `<a class="link" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">Watch on YouTube ↗</a>` : ''}</article>`;
};
const talks = `<section id="talks" class="section talks"><p class="eyebrow">FEATURED KEYNOTES &amp; VIDEO TALKS</p><div class="heading"><h2>See how I hold<br><em>a room.</em></h2><div><p>Executive Storytelling: short leadership stories on trust, change and transformation. The AI-powered cash sweeps webinar follows below.</p>${content.videoPlaylist ? `<a class="link" href="${content.videoPlaylist.url}" target="_blank" rel="noopener">Watch the full ${escape(content.videoPlaylist.title)} playlist ↗</a>` : ''}</div></div><div class="video-grid">${content.videos.map(videoCard).join('')}</div></section>`;
const proposals = content.speakingProposals.length ? `<div class="talk"><p class="eyebrow">SPEAKING PROPOSALS IN REVIEW</p><ul class="proposal-list">${content.speakingProposals.map(p => `<li><strong>${escape(p.org)}</strong><span>${escape(p.status)}</span></li>`).join('')}</ul></div>` : '';
const speakingSection = sections.speaking.replace(/<\/section>$/, proposals + '</section>');

const homeHub = sections.homeHub.replace('${HUB}',
  teaser('Speaker kit', 'Short and long bios, three signature keynotes with takeaways, headshot and a one-click copy.', 'speaking.html#speaker-kit', 'Open the speaker kit') +
  teaser('Publications', 'SAP Community articles and whitepapers on intelligent payment architecture, cash application and liquidity.', 'publications.html', 'Read the writing') +
  teaser('Talks &amp; Executive Storytelling', 'Six leadership stories on YouTube, the AI-powered cash sweeps webinar and Toastmasters speech manuscripts.', 'speaking.html#talks', 'Watch the talks') +
  teaser('Enterprise transformations', 'Global finance, treasury and banking programs for CSL, BD, Equinor, Amgen and more.', 'experience.html', 'Explore experience'));

// ── Pages ──
add('index.html', 'SAP Treasury, Banking & Enterprise AI Speaker', `Jyoti Narang: Managing Solution Architect and Global SAP Treasury & Banking Transformation Lead. Keynotes, the Translate, Trace, Transform series, and working AI agents for treasury.`,
  sections.hero + sections.stats + sections.paths + sections.pillars + sections.showcase + bookBanner + homeHub + sections.leadership, '', {jsonld: true});
add('projects.html', 'AI & Treasury Demos', 'Explore the Cash Sweep Agent, Autonomous Lockbox Agent and Treasury Transformation ROI Simulator: business problems, architecture and interactive demonstrations.',
  hero('THE DEMO STUDIO', 'Ideas become clearer<br><em>when you can explore them.</em>', 'Three prototypes in intelligent liquidity, cash application and the treasury business case. Open each one for its business context, architecture and interactive experience.') + sections.projects);
add('speaking.html', 'Speaking, Speaker Kit & Keynotes', 'Book Jyoti Narang for keynotes and panels on SAP treasury, intelligent payments and enterprise AI. Bios, signature topics, headshot and recorded talks.',
  hero('SPEAKING &amp; EXECUTIVE COMMUNICATION', 'Make the complex clear.<br><em>Make the change human.</em>', 'Treasury innovation, architecture and leadership, turned into talks that audiences can act on.') + speakerKit + talks + speakingSection + sections.speeches);
add('publications.html', 'Publications, Book Series & SAP Community', 'The weekly Translate, Trace, Transform series, SAP Community articles and whitepapers by Jyoti Narang on treasury, SAP payments and enterprise AI.',
  hero('PUBLICATIONS', 'Thought leadership<br><em>grounded in finance.</em>', 'Perspectives for treasury leaders, SAP practitioners and executives building the next generation of financial operations.') + bookBanner + sections.publications);
add('experience.html', 'Enterprise Experience', 'Selected SAP finance and treasury transformation engagements, leadership scope and project evidence.',
  hero('ENTERPRISE EXPERIENCE', 'Complex enterprises.<br><em>Purposeful transformation.</em>', 'Finance strategy, architectural depth and global delivery across treasury, payments, banking and enterprise change.') + sections.mandate + sections.experience,
  '<script defer src="data/work.js"></script><script defer src="work.js"></script>');
add('community.html', 'Community & Show-and-Tell', 'Agent demonstrations and community learning with Jyoti Narang.',
  hero('COMMUNITY', 'Build in practice.<br><em>Learn in good company.</em>', 'A place for experiments, show-and-tell and sharing what works across treasury, SAP and AI communities.') + sections.community +
  `<section class="section"><div class="heading"><h2>Explore the current work</h2><p>Interactive demonstrations available on this site. These are illustrative projects in development.</p></div><div class="hub-grid">${teaser('Lockbox Agent walkthrough', 'Explore a synthetic cash-application workbench with illustrative decision scenarios.', 'lockbox-agent.html#demo', 'Open the workbench')}${teaser('Cash Sweep decision lab', 'Explore how balances, expected flows and liquidity buffers shape a cash-sweep recommendation.', 'cash-sweep-agent.html#demo', 'Open the decision lab')}${teaser('Treasury ROI Simulator', 'Model working capital, bank fees, STP and exception effort with your own assumptions.', 'roi-simulator.html#demo', 'Open the simulator')}</div></section>`);
add('credentials.html', 'Career & Credentials', 'Career foundation, education and links to issuer-hosted credentials for Jyoti Narang.',
  hero('CAREER &amp; CREDENTIALS', 'Experience built over time.<br><em>Learning that continues.</em>', 'A career spanning enterprise consulting, SAP product ownership and global finance transformation.') + sections.credentials);

// ── Demo detail pages (one per project; routing comes from each project's `page`) ──
const architectures = {
  lockbox: ['Bank receipts, BAI2 &amp; ISO 20022 remittances', 'SAP customer &amp; open-item evidence', 'Customer identification, matching &amp; policy checks', 'Analyst review or controlled posting'],
  'cash-sweep': ['Cash position &amp; expected flows', 'Forecast liquidity &amp; buffer needs', 'Explainable sweep proposal', 'Treasury approval &amp; SAP execution'],
  roi: ['Your assumptions', 'Working capital, fee, STP &amp; exception drivers', 'Annual benefit, payback &amp; 3-year view', 'A business case leaders can challenge']
};
const sweepLab = `<section id="demo" class="section integrated-demo"><p class="eyebrow">INTERACTIVE / ILLUSTRATIVE SCENARIO</p><div class="heading"><h2>Cash Sweep decision lab</h2><p>A planning illustration of available cash, expected flows and a minimum liquidity buffer. It demonstrates a decision rule, not a trained AI model or a live payment service.</p></div><div class="decision-lab"><form id="sweep-form"><p class="small">Enter USD amounts for one planning period.</p><label>Current available cash<input name="balance" type="number" min="0" max="1000000000000" step="0.01" value="20000000" required></label><label>Expected receipts<input name="receipts" type="number" min="0" max="1000000000000" step="0.01" value="3000000" required></label><label>Expected payments<input name="payments" type="number" min="0" max="1000000000000" step="0.01" value="5000000" required></label><label>Minimum liquidity buffer<input name="buffer" type="number" min="0" max="1000000000000" step="0.01" value="7000000" required></label><button class="button" type="submit">Evaluate scenario ↗</button><p id="sweep-error" role="alert"></p></form><div id="sweep-result" class="sweep-result" aria-live="polite"></div></div><p class="small">Actual treasury decisions also require timing, forecast confidence, FX, legal entity, tax, intercompany and policy checks. No funds move from this tool.</p></section>`;
const demos = {
  lockbox: `<section id="demo" class="section integrated-demo"><div class="heading"><h2>The Lockbox workbench</h2><p>Illustrative scenarios using synthetic data. The workbench does not connect to a live bank or SAP system.</p></div><a class="link" href="demos/lockbox/index.html" target="_blank" rel="noopener">Open the workbench in a full window ↗</a><iframe title="Lockbox Agent illustrative cash application workbench" src="demos/lockbox/index.html" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" class="workbench-frame"></iframe></section>`,
  'cash-sweep': sweepLab,
  roi: `<section id="demo" class="section integrated-demo"><div class="heading"><h2>The ROI Simulator</h2><p>Replace the example assumptions with your own. Every result shows how it was calculated, and nothing you enter is sent or stored.</p></div><a class="link" href="demos/roi/index.html" target="_blank" rel="noopener">Open the simulator in a full window ↗</a><iframe title="Treasury Transformation ROI Simulator" src="demos/roi/index.html" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" class="workbench-frame embed-autoheight" data-autoheight></iframe></section>`
};
const resources = {
  lockbox: `<section class="section"><h2>Continue exploring</h2><div class="actions"><a class="button" href="roi-simulator.html">Model the business case ↗</a><a class="link" href="cash-sweep-agent.html">Explore Cash Sweep Agent</a><a class="link" href="projects.html">All demos</a></div></section>`,
  'cash-sweep': `<section class="section"><h2>Go deeper into the concept</h2><div class="actions"><a class="button" href="assets/ai-cash-sweeps.pdf" target="_blank" rel="noopener">Open the presentation ↗</a><a class="link" href="assets/liquidity-whitepaper.pdf" target="_blank" rel="noopener">Read the whitepaper ↗</a><a class="link" href="speaking.html#speaking">Watch the webinar ↗</a></div></section>`,
  roi: `<section class="section"><h2>Turn the model into a roadmap</h2><p class="intro">Want to pressure-test these assumptions against your landscape, or run this live with your leadership team?</p><div class="actions"><a class="button" href="#inquire" data-topic="advisory">Discuss your business case ↗</a><a class="link" href="lockbox-agent.html">See the Lockbox Agent</a><a class="link" href="cash-sweep-agent.html">See the Cash Sweep Agent</a></div></section>`
};
for (const p of content.projects) {
  if (!p.page || !demos[p.id]) throw Error('Project ' + p.id + ' needs a page and a demo template in build-pages.mjs');
  const detail = `${hero('DEMO STUDIO / ' + escape(p.category).toUpperCase(), escape(p.title), escape(p.approach))}<section class="section project-overview"><a class="link" href="projects.html">← All demos</a><div class="detail-meta"><span class="status-pill">${escape(p.status)}</span><div class="tags">${p.tags.map(t => `<span>${escape(t)}</span>`).join('')}</div></div><div class="before-after"><div><p class="eyebrow">BEFORE</p><p>${escape(p.before)}</p></div><div><p class="eyebrow">AFTER</p><p>${escape(p.after)}</p></div></div><div class="split"><div><h2>The business problem</h2><p>${escape(p.problem)}</p></div><div><h3>Value to evaluate</h3><p>${escape(p.value)}</p><h3>Controls &amp; accountability</h3><p>${escape(p.controls)}</p></div></div><div class="evidence-note"><h3>Project evidence &amp; maturity</h3><p>${escape(p.evidence)}</p></div><div data-links="${p.id}" class="project-links">${p.repo ? `<a class="link" href="${escape(p.repo)}" target="_blank" rel="noopener">View repository ↗</a>` : ''}</div></section>`;
  const flow = `<section class="section architecture"><p class="eyebrow">REFERENCE APPROACH</p><h2>From information<br><em>to an accountable decision.</em></h2><ol class="architecture-flow">${architectures[p.id].map((step, i) => `<li><span>0${i + 1}</span><strong>${step}</strong></li>`).join('')}</ol></section>`;
  add(p.page, p.title, p.problem, detail + flow + demos[p.id] + resources[p.id] + (content.github.username ? '<p id="github-status" class="section small" aria-live="polite"></p>' : ''), p.id === 'cash-sweep' ? '<script defer src="sweep.js"></script>' : '', {crumb: true});
}

// ── Shared document shell ──
const ogImage = fs.existsSync('dist/assets/og-card.jpg') ? 'assets/og-card.jpg' : 'assets/jyoti-narang.jpg';
const personLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {'@type': 'Person', '@id': BASE + '/#person', name: site.name, url: BASE + '/', image: BASE + '/assets/jyoti-narang.jpg', email: 'mailto:' + site.email, jobTitle: 'Managing Solution Architect',
      description: 'Global SAP Treasury & Banking Transformation Lead and Enterprise AI strategist with 22 years of SAP S/4HANA Finance, Treasury & Risk Management, BCM, In-House Cash and ISO 20022 experience.',
      knowsAbout: ['SAP S/4HANA Finance', 'SAP Treasury and Risk Management', 'Bank Communication Management', 'In-House Cash', 'ISO 20022', 'SAP BTP', 'SAP Joule', 'Cash management', 'Enterprise AI agents', 'Treasury transformation'],
      sameAs: [site.linkedin, content.sapProfile, site.github, site.credly].filter(Boolean)},
    {'@type': 'WebSite', '@id': BASE + '/#website', url: BASE + '/', name: site.name, publisher: {'@id': BASE + '/#person'}}
  ]
};
const canonical = file => BASE + '/' + (file === 'index.html' ? '' : file);
const year = new Date().getFullYear();
for (const p of pages) {
  const title = `${p.title} | ${site.name}`;
  const isProject = Object.values(projectPages).includes(p.file);
  const header = `<header><a class="brand" href="index.html" aria-label="Jyoti Narang, home"><img class="brand-mark" src="assets/brand/logo-mark.png" width="44" height="44" alt=""><span>JYOTI NARANG<small>SAP TREASURY · BANKING · AI</small></span></a><button id="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false">Menu ☰</button><nav id="main-nav" aria-label="Main navigation">${links.map(([url, label]) => `<a href="${url}"${p.file === url || (url === 'projects.html' && isProject) ? ' aria-current="page"' : ''}>${label}</a>`).join('')}<a href="assets/Jyoti-Narang-Resume.docx" class="nav-resume" download>Resume ↗</a></nav><a href="#inquire" class="header-cta" data-topic="keynote">Book Jyoti ↗</a></header>`;
  const footer = `<footer><a class="brand" href="index.html" aria-label="Jyoti Narang, home"><img class="brand-mark" src="assets/brand/logo-mark.png" width="44" height="44" alt=""><span>JYOTI NARANG</span></a><nav class="footer-links" aria-label="Footer"><a href="speaking.html#speaker-kit">Speaker kit</a><a href="publications.html#book">Book series</a><a href="projects.html">Demos</a><a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a><a href="mailto:${site.email}">Email ↗</a></nav><span>© ${year} ${site.name}</span></footer>`;
  const crumb = p.file !== 'index.html' ? `<div class="breadcrumb"><a href="index.html">Home</a> / ${p.crumb ? '<a href="projects.html">Demos</a> / ' : ''}${escape(p.title)}</div>` : '';
  const head = [
    '<meta charset="utf-8">', '<meta name="viewport" content="width=device-width,initial-scale=1">',
    `<title>${escape(title)}</title>`, `<meta name="description" content="${escape(p.description)}">`,
    `<link rel="canonical" href="${canonical(p.file)}">`, '<link rel="icon" href="favicon.svg" type="image/svg+xml">', '<link rel="apple-touch-icon" href="apple-touch-icon.png">', '<meta name="theme-color" content="#244d43">',
    `<meta property="og:type" content="${p.file === 'index.html' ? 'profile' : 'website'}">`, `<meta property="og:site_name" content="${escape(site.name)}">`,
    `<meta property="og:title" content="${escape(title)}">`, `<meta property="og:description" content="${escape(p.description)}">`,
    `<meta property="og:url" content="${canonical(p.file)}">`, `<meta property="og:image" content="${BASE}/${ogImage}">`, `<meta property="og:image:alt" content="Jyoti Narang, SAP Treasury, Banking and Enterprise AI">`,
    ...(p.file === 'index.html' ? ['<meta property="profile:first_name" content="Jyoti">', '<meta property="profile:last_name" content="Narang">'] : []),
    '<meta name="twitter:card" content="summary_large_image">', `<meta name="twitter:title" content="${escape(title)}">`, `<meta name="twitter:description" content="${escape(p.description)}">`, `<meta name="twitter:image" content="${BASE}/${ogImage}">`,
    `<link rel="stylesheet" href="style.css?v=${ver('style.css')}">`,
    ...['data/content.js', 'github.js', 'portfolio.js', 'site.js'].map(f => `<script defer src="${f}?v=${ver(f)}"></script>`), p.extra,
    /^[a-z0-9-]+$/.test(site.goatcounter || '') ? `<script data-goatcounter="https://${site.goatcounter}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>` : '',
    p.jsonld ? `<script type="application/ld+json">${JSON.stringify(personLD).replace(/</g, '\\u003c')}</script>` : ''
  ].filter(Boolean).join('');
  fs.writeFileSync(path.join('dist', p.file), `<!doctype html><html lang="en"><head>${head}</head><body><a class="skip" href="#main">Skip to content</a>${header}<main id="main">${crumb}${p.body}${rootLink(sections.contact)}</main>${footer}</body></html>`);
}

// ── 404, sitemap, robots, CNAME, .nojekyll ──
fs.writeFileSync('dist/404.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | ${escape(site.name)}</title><meta name="robots" content="noindex"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css"></head><body><main id="main"><section class="page-hero section"><p class="eyebrow">404</p><h1>That page has moved<br><em>or never existed.</em></h1><p class="intro">Try the home page, the demos or the speaker kit.</p><div class="actions"><a class="button" href="/">Go to the home page ↗</a><a class="link" href="/projects.html">Demos</a><a class="link" href="/speaking.html#speaker-kit">Speaker kit</a></div></section></main></body></html>`);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>${canonical(p.file)}</loc><lastmod>${today}</lastmod><priority>${p.file === 'index.html' ? '1.0' : '0.7'}</priority></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /demos/\n\nSitemap: ${BASE}/sitemap.xml\n`);
fs.writeFileSync('dist/CNAME', new URL(BASE).hostname + '\n');
fs.writeFileSync('dist/.nojekyll', '');
console.log('Built ' + pages.length + ' portfolio pages, 404, sitemap, robots and CNAME.');
