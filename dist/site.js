// Speaking / publishing features: demo showcase + modal, inquiry & notify forms, speaker kit, video embeds.
(() => {
  'use strict';
  const content = window.PORTFOLIO_CONTENT || {};
  const site = content.site || {};
  const el = (tag, text, cls) => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };

  // ── Embedded demos report their height (postMessage) so iframes never need inner scrolling ──
  window.addEventListener('message', e => {
    if (!e.data || e.data.type !== 'jn-embed-height') return;
    document.querySelectorAll('iframe[data-autoheight]').forEach(f => {
      if (f.contentWindow === e.source) f.style.height = Math.min(Math.max(Number(e.data.height) || 0, 400), 4000) + 'px';
    });
  });

  // ── Demo showcase cards + modal (home page) ──
  const showcase = document.getElementById('demo-showcase');
  const modal = document.getElementById('demo-modal');
  if (showcase && modal) {
    const body = document.getElementById('demo-modal-body');
    let opener = null;
    const openDemo = (p, live) => {
      opener = document.activeElement;
      document.getElementById('demo-modal-kicker').textContent = p.category.toUpperCase();
      document.getElementById('demo-modal-title').textContent = p.title;
      body.replaceChildren();
      const ba = el('div', '', 'before-after');
      for (const [label, text] of [['BEFORE', p.before], ['AFTER', p.after]]) { const d = el('div'); d.append(el('p', label, 'eyebrow'), el('p', text)); ba.append(d); }
      const tags = el('div', '', 'tags'); p.tags.forEach(t => tags.append(el('span', t)));
      const actions = el('div', '', 'actions');
      const full = el('a', 'Open full demo page ↗', 'button'); full.href = p.demoUrl || p.page; actions.append(full);
      const more = el('a', 'Business context & architecture', 'link'); more.href = p.page; actions.append(more);
      body.append(ba, tags);
      if (p.embed && live) {
        const frame = document.createElement('iframe');
        frame.src = p.embed; frame.title = p.title + ' (interactive demo)'; frame.className = 'modal-frame';
        frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation'); frame.dataset.autoheight = '';
        body.append(frame);
      } else if (p.embed) {
        const launch = el('button', 'Launch interactive demo here ↗', 'button'); launch.type = 'button';
        launch.addEventListener('click', () => openDemo(p, true)); actions.prepend(launch);
      }
      body.append(actions);
      if (!modal.open) modal.showModal();
      modal.querySelector('.modal-close').focus();
    };
    for (const p of content.projects || []) {
      const card = el('article', '', 'showcase-card');
      card.append(el('p', p.category.toUpperCase(), 'eyebrow'), el('span', p.status, 'status-pill'), el('h3', p.showcaseTitle || p.title), el('p', p.title, 'showcase-name'));
      const ba = el('dl', '', 'mini-ba');
      ba.append(el('dt', 'Before'), el('dd', p.before), el('dt', 'After'), el('dd', p.after));
      const tags = el('div', '', 'tags'); p.tags.forEach(t => tags.append(el('span', t)));
      const actions = el('div', '', 'showcase-actions');
      const launch = el('button', 'Launch interactive demo ↗', 'button'); launch.type = 'button';
      launch.addEventListener('click', () => (p.embed ? openDemo(p, true) : (location.href = p.demoUrl || p.page)));
      const details = el('button', 'Before & after', 'link-button'); details.type = 'button';
      details.addEventListener('click', () => openDemo(p, false));
      actions.append(launch, details);
      card.append(ba, tags, actions);
      showcase.append(card);
    }
    modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) modal.close(); });
    modal.addEventListener('close', () => { body.replaceChildren(); opener?.focus?.(); });
  }

  // ── Form delivery: Web3Forms → Formspree → mailto fallback ──
  const cfg = content.inquiry || {};
  async function deliver(fields) {
    if (cfg.web3formsKey) {
      const r = await fetch('https://api.web3forms.com/submit', {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify({access_key: cfg.web3formsKey, from_name: 'jyotinarang.com', ...fields})});
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success === false) throw Error(j.message || 'The message could not be sent.');
      return 'sent';
    }
    if (cfg.formspreeEndpoint) {
      const r = await fetch(cfg.formspreeEndpoint, {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify(fields)});
      if (!r.ok) { const j = await r.json().catch(() => ({})); throw Error(j.errors?.[0]?.message || 'The message could not be sent.'); }
      return 'sent';
    }
    const lines = Object.entries(fields).filter(([k, v]) => v && k !== 'subject').map(([k, v]) => k[0].toUpperCase() + k.slice(1) + ': ' + v);
    location.href = 'mailto:' + (site.email || '') + '?subject=' + encodeURIComponent(fields.subject) + '&body=' + encodeURIComponent(lines.join('\n\n'));
    return 'mailto';
  }
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  // ── Smart inquiry form ──
  const TOPICS = {
    keynote: {label: 'Keynote / conference speaking', placeholder: 'Tell me about the event: audience size and roles, theme, format (keynote, panel, workshop), date and location, and which topic interests you.', event: true},
    publishing: {label: 'SAP Press / publishing & media', placeholder: 'What are you working on? A book, article, podcast, interview or media request, the angle you have in mind, and your timeline.', event: false},
    advisory: {label: 'Executive advisory / transformation leadership', placeholder: 'Describe your treasury or SAP landscape, the decision or transformation ahead, and where an outside perspective would help most.', event: false},
    demo: {label: 'Demo request', placeholder: 'Which demo (Cash Sweep, Autonomous Lockbox Agent or ROI Simulator) and who would attend? Share your goals and a few dates that work.', event: false}
  };
  const form = document.getElementById('inquiry-form');
  function setTopic(value) {
    if (!form || !TOPICS[value]) return;
    form.elements.topic.value = value;
    form.elements.message.placeholder = TOPICS[value].placeholder;
    form.querySelector('[data-field="event"]').hidden = !TOPICS[value].event;
  }
  if (form) {
    form.addEventListener('change', e => { if (e.target.name === 'topic') setTopic(e.target.value); });
    setTopic(form.elements.topic.value || 'keynote');
    const status = form.querySelector('.form-status'), submit = form.querySelector('[type="submit"]');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.elements.botcheck.checked) return;
      const f = form.elements, topic = TOPICS[f.topic.value];
      const missing = [['name', 'your name'], ['email', 'a valid email'], ['message', 'a message']].filter(([k]) => k === 'email' ? !validEmail(f.email.value.trim()) : !f[k].value.trim());
      form.querySelectorAll('[aria-invalid]').forEach(n => n.removeAttribute('aria-invalid'));
      if (missing.length) { missing.forEach(([k]) => f[k].setAttribute('aria-invalid', 'true')); status.textContent = 'Please add ' + missing.map(m => m[1]).join(', ') + '.'; status.className = 'form-status is-error'; f[missing[0][0]].focus(); return; }
      submit.disabled = true; status.className = 'form-status'; status.textContent = 'Sending…';
      try {
        const how = await deliver({subject: 'Website inquiry: ' + topic.label, topic: topic.label, name: f.name.value.trim(), email: f.email.value.trim(), organization: f.organization.value.trim(), event: topic.event ? f.event.value.trim() : '', message: f.message.value.trim(), page: location.pathname});
        status.className = 'form-status is-ok';
        status.textContent = how === 'sent' ? 'Thank you. Your inquiry has been sent, and I will be in touch.' : 'Your email app should open with the message ready to send.';
        if (how === 'sent') { form.reset(); setTopic('keynote'); }
      } catch (err) { status.className = 'form-status is-error'; status.textContent = err.message + ' You can also email ' + site.email + '.'; }
      finally { submit.disabled = false; }
    });
  }
  // Any link with data-topic preselects the form topic.
  document.addEventListener('click', e => { const a = e.target.closest('a[data-topic]'); if (a) setTopic(a.dataset.topic); });

  // ── Book "notify me" ──
  document.querySelectorAll('form[data-notify]').forEach(nf => {
    const status = nf.querySelector('.form-status');
    nf.addEventListener('submit', async e => {
      e.preventDefault();
      if (nf.elements.botcheck.checked) return;
      const email = nf.elements.email.value.trim();
      if (!validEmail(email)) { status.className = 'form-status is-error'; status.textContent = 'Please enter a valid email address.'; nf.elements.email.focus(); return; }
      status.className = 'form-status'; status.textContent = 'Sending…';
      try {
        const how = await deliver({subject: 'Book updates: notify me / advance chapter', topic: 'SAP Press book updates', email, message: 'Please notify me when the book is announced. I would also like to request an advance chapter.', page: location.pathname});
        status.className = 'form-status is-ok';
        status.textContent = how === 'sent' ? 'You are on the list. Thank you!' : 'Your email app should open with the request ready to send.';
        if (how === 'sent') nf.reset();
      } catch (err) { status.className = 'form-status is-error'; status.textContent = err.message; }
    });
  });

  // ── Speaker kit tabs, copy and download ──
  const tablist = document.querySelector('.speaker-kit [role="tablist"]');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const select = tab => tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; document.getElementById(t.getAttribute('aria-controls')).hidden = !on; });
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        const next = tabs[(i + d + tabs.length) % tabs.length]; select(next); next.focus(); e.preventDefault();
      });
    });
    const kitStatus = document.querySelector('.kit-status');
    const say = t => { if (kitStatus) kitStatus.textContent = t; };
    document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
      const text = [...document.getElementById(b.dataset.copy).querySelectorAll('p')].map(p => p.textContent).join('\n\n');
      const label = b.textContent;
      try { await navigator.clipboard.writeText(text); b.textContent = 'Copied ✓'; say('Bio copied to clipboard.'); }
      catch { const r = document.createRange(); r.selectNodeContents(document.getElementById(b.dataset.copy)); const s = getSelection(); s.removeAllRanges(); s.addRange(r); say('Copy is blocked here. The bio is selected, so press Ctrl+C or ⌘C.'); }
      setTimeout(() => { b.textContent = label; }, 2000);
    }));
    document.querySelector('[data-download-kit]')?.addEventListener('click', () => {
      const k = content.speakerKit; if (!k) return;
      const text = [
        'JYOTI NARANG: SPEAKER KIT', site.jobTitle || '', site.url || '', site.email || '', '',
        'SHORT BIO', k.shortBio, '', 'LONG BIO', k.longBio, '', 'SIGNATURE KEYNOTE TOPICS',
        ...k.topics.flatMap((t, i) => ['', (i + 1) + '. ' + t.title, '   Audience: ' + t.audience, ...t.takeaways.map(x => '   - ' + x)]),
        '', 'Headshot: ' + (site.url || '') + '/assets/jyoti-narang.jpg', 'Booking: ' + (site.url || '') + '/#inquire'
      ].join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], {type: 'text/plain;charset=utf-8'}));
      a.download = 'Jyoti-Narang-Speaker-Kit.txt'; document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000); say('Speaker kit downloaded.');
    });
  }

  // ── YouTube: privacy-enhanced embed loads only on click ──
  document.querySelectorAll('[data-youtube]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.youtube; if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    f.title = b.getAttribute('aria-label') || 'Video'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true; f.className = 'video-embed';
    b.replaceWith(f);
  }));
})();
