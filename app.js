/* Content lives in config.js (loaded first). */
const DISCORD_URL = CONTACT.discordId ? `https://discord.com/users/${CONTACT.discordId}` : '';
const WA_URL = CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}` : '';
/* Entries with no destination are dropped — no dead or "coming soon" icons. */
const SOCIALS = [
  { name: 'WhatsApp', icon: 'whatsapp', brand: '#25D366', href: WA_URL },
  { name: 'Discord', icon: 'discord', brand: '#5865F2', href: DISCORD_URL, label: CONTACT.discord },
  { name: 'Email', icon: 'gmail', brand: '#EA4335', href: CONTACT.email ? `mailto:${CONTACT.email}` : '', label: CONTACT.email },
  { name: 'X (Twitter)', icon: 'x', brand: '#000', href: CONTACT.twitter },
  { name: 'Facebook', icon: 'facebook', brand: '#1877F2', href: CONTACT.facebook },
  { name: 'TikTok', icon: 'tiktok', brand: '#111', href: CONTACT.tiktok },
].filter(s => s.href);
const ALL_VIDEOS = Object.entries(SHORT_FORM).flatMap(([cat, list]) => list.map(v => ({ ...v, cat })));
const money = n => '$' + n.toFixed(2);

/* Analytics: forwards to Plausible / gtag / dataLayer only if one is installed. Never send personal data. */
function track(name, props = {}) {
  if (!ANALYTICS.enabled) return;
  try {
    if (window.plausible) window.plausible(name, { props });
    if (window.gtag) window.gtag('event', name, props);
    if (window.dataLayer) window.dataLayer.push({ event: name, ...props });
    if (ANALYTICS.debug || /[?&]debug/.test(location.search)) console.debug('[track]', name, props);
  } catch (e) {}
}

/* ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
/* Slow device / data saver: show posters only — no autoplaying or hover-preview video. */
const LOWPERF = window.LOWPERF = (() => {
  const c = navigator.connection || {};
  return !!(c.saveData || /(^|-)2g|3g/.test(c.effectiveType || '') || (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2));
})();
if (LOWPERF) document.documentElement.classList.add('lowperf');
const fmt = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

/* ---------- smooth scroll (Lenis smooths wheel only; touch stays native) ---------- */
let lenis = null;
if (window.Lenis && !reduce) {
  lenis = new Lenis({ duration: 1.05, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  if (window.gsap) { gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
}
const hasGsap = !!(window.gsap && window.ScrollTrigger);
if (hasGsap) { gsap.registerPlugin(ScrollTrigger); lenis && lenis.on('scroll', ScrollTrigger.update); }

/* scroll progress bar */
const bar = $('.progress span');
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* nav: anchors through Lenis, mobile menu, active link */
const burger = $('.burger'), menu = $('.mobile-menu');
burger.addEventListener('click', () => burger.setAttribute('aria-expanded', menu.classList.toggle('open')));
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  if (id === '#') { e.preventDefault(); return; }
  const el = $(id); if (!el) return;
  e.preventDefault();
  menu.classList.remove('open'); burger.setAttribute('aria-expanded', false);
  lenis ? lenis.scrollTo(el, { offset: id === '#top' ? 0 : -80 }) : el.scrollIntoView({ behavior: 'smooth' });
}));
const navLinks = $$('.nav-links a');
const sectObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
['work', 'wins', 'creators', 'process', 'reviews', 'pricing', 'faq'].forEach(id => $('#' + id) && sectObs.observe($('#' + id)));

/* ---------- copy-to-clipboard ---------- */
const toast = $('.copied');
async function copyText(t, msg) {
  try { await navigator.clipboard.writeText(t); }
  catch { const ta = Object.assign(document.createElement('textarea'), { value: t }); document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
  if (toast) { toast.textContent = msg || `Copied “${t}”`; clearTimeout(copyText.t); copyText.t = setTimeout(() => toast.textContent = '', 2800); }
}
document.addEventListener('click', e => {
  const c = e.target.closest('[data-copy]'); if (!c) return;
  e.preventDefault(); copyText(c.dataset.copy);
});

/* ---------- availability: always online (values in config.js AVAILABILITY) ---------- */
$$('[data-live-pill]').forEach(el => el.textContent = `${AVAILABILITY.label} · typical reply ${AVAILABILITY.typicalReply}`);
$$('[data-live-status]').forEach(el => el.textContent = AVAILABILITY.label);
$$('[data-reply]').forEach(el => el.textContent = AVAILABILITY.typicalReply.replace(/^~/, ''));
$$('[data-discord]').forEach(a => DISCORD_URL ? a.href = DISCORD_URL : a.remove());
$$('[data-wa]').forEach(a => WA_URL ? a.href = WA_URL : a.remove());

/* ---------- niches marquee (ScrollVelocity, React Bits) ---------- */
$('#nicheTrack').innerHTML = NICHES.map(n => `<span class="niche">${n}</span>`).join('').repeat(2);
const marquees = $$('.marquee').map(m => ({ track: $('.marquee-track', m), x: 0, base: +m.dataset.speed || 40, w: 0, el: m, vis: true }));
const measure = () => marquees.forEach(m => m.w = m.track.scrollWidth / 2);
measure(); addEventListener('resize', measure); addEventListener('load', measure);
document.fonts && document.fonts.ready.then(measure);
marquees.forEach(m => new IntersectionObserver(([e]) => m.vis = e.isIntersecting).observe(m.el));
let vel = 0, lastY = scrollY, lastT = performance.now();
function tickMarquee(now) {
  const dt = Math.min((now - lastT) / 1000, .05); lastT = now;
  const dy = scrollY - lastY; lastY = scrollY;
  vel += (Math.max(-260, Math.min(260, dy * 4)) - vel) * .08;
  marquees.forEach(m => {
    if (!m.w || !m.vis) return;
    const dir = vel < -4 ? -1 : 1;
    m.x -= dir * (m.base + Math.abs(vel)) * dt;
    if (m.x <= -m.w) m.x += m.w;
    if (m.x > 0) m.x -= m.w;
    m.track.style.transform = `translate3d(${m.x}px,0,0)`;
  });
  requestAnimationFrame(tickMarquee);
}
if (!reduce) requestAnimationFrame(tickMarquee);

/* ---------- work: tabs + lazy video cards (one preview at a time) ---------- */
let activeCard = null;
function stopCard(card) {
  if (!card) return;
  const v = $('video', card); if (v) v.pause();
  card.classList.remove('playing');
  if (activeCard === card) activeCard = null;
}
function startCard(card) {
  if (activeCard && activeCard !== card) stopCard(activeCard);
  let v = $('video', card);
  if (!v) {
    v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.src = card.dataset.src;
    const pbar = $('.vc-bar', card);
    v.addEventListener('timeupdate', () => { if (v.duration) pbar.style.transform = `scaleX(${v.currentTime / v.duration})`; });
    v.addEventListener('playing', () => { card.classList.remove('loading'); if (activeCard === card) card.classList.add('playing'); });
    card.classList.add('loading');
    card.prepend(v);
  }
  activeCard = card;
  v.play().catch(() => {});
}
function cardHTML(v, i) {
  const r = v.w / v.h, ratio = r > 2 ? '21:9' : r > 1.2 ? '16:9' : r > .95 ? '1:1' : r > .65 ? '3:4' : '9:16';
  return `<div class="vc" data-vid="${v.id}" data-src="${v.src}" data-open="${v.yt || v.src}" data-w="${v.w}" data-h="${v.h}" style="--r:${(v.w / v.h).toFixed(4)};aspect-ratio:${v.w}/${v.h};animation-delay:${i * 70}ms" role="button" tabindex="0" aria-label="Play video ${i + 1} with sound">
    <img src="${v.poster}" alt="" loading="lazy" decoding="async">
    <span class="play" aria-hidden="true">▶</span>
    <div class="vc-meta"><b>${String(i + 1).padStart(2, '0')}</b><span>${fmt(v.dur)} · ${ratio}</span></div>
    <i class="vc-bar"></i></div>`;
}
(function buildWork() {
  const tabs = $('#shortTabs'), rail = $('#shortRail'), fmtBox = $('#fmtFilter');
  const shape = v => v.w / v.h > 1.2 ? 'landscape' : v.w / v.h < .95 ? 'vertical' : 'square';
  const cats = ['All', ...Object.keys(SHORT_FORM)];
  const FMTS = [['all', 'All formats'], ['vertical', 'Vertical'], ['square', 'Square'], ['landscape', 'Landscape']];
  let cat = 'All', fmtSel = 'all';
  const list = () => (cat === 'All' ? ALL_VIDEOS : SHORT_FORM[cat]).filter(v => fmtSel === 'all' || shape(v) === fmtSel);
  tabs.innerHTML = cats.map((c, i) => `<button class="tab ${i ? '' : 'on'}" role="tab" aria-selected="${!i}" data-c="${c}">${c}<span class="n">${c === 'All' ? ALL_VIDEOS.length : SHORT_FORM[c].length}</span></button>`).join('');
  fmtBox.innerHTML = FMTS.map(([k, l], i) => `<button class="fmt ${i ? '' : 'on'}" aria-pressed="${!i}" data-f="${k}">${l}</button>`).join('');
  const render = () => {
    stopCard(activeCard);
    const items = list();
    rail.classList.add('swap');
    setTimeout(() => {
      rail.innerHTML = items.length ? items.map(cardHTML).join('') : '<p class="empty">No edits in this format yet — try another filter.</p>';
      rail.scrollTo({ left: 0 }); rail.classList.remove('swap');
    }, reduce ? 0 : 160);
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b) return;
    $$('.tab', tabs).forEach(t => { t.classList.toggle('on', t === b); t.setAttribute('aria-selected', t === b); });
    cat = b.dataset.c; render(); track('portfolio_category', { category: cat });
  });
  fmtBox.addEventListener('click', e => {
    const b = e.target.closest('.fmt'); if (!b) return;
    $$('.fmt', fmtBox).forEach(t => { t.classList.toggle('on', t === b); t.setAttribute('aria-pressed', t === b); });
    fmtSel = b.dataset.f; render(); track('portfolio_format', { format: fmtSel });
  });
  render();

  $('#featured').innerHTML = FEATURED.map((f, i) => {
    const v = ALL_VIDEOS.find(x => x.id === f.video); if (!v) return '';
    return `<article class="feat ${i === 0 ? 'feat-lead' : ''}">
      ${cardHTML(v, i).replace('class="vc"', 'class="vc feat-media"')}
      <div class="feat-body"><span class="feat-niche">${f.niche}</span><h3>${f.desc}</h3>
      <div class="feat-tags"><span>${f.format}</span>${f.style.map(t => `<span>${t}</span>`).join('')}<span>${fmt(v.dur)}</span></div></div>
    </article>`;
  }).join('');

  const roots = [rail, $('#featured')];
  if (fine && !LOWPERF) roots.forEach(root => {
    root.addEventListener('pointerover', e => { const c = e.target.closest('.vc'); if (c && !c.contains(e.relatedTarget)) startCard(c); });
    root.addEventListener('pointerout', e => { const c = e.target.closest('.vc'); if (c && !c.contains(e.relatedTarget)) stopCard(c); });
  });
  roots.forEach(r => new IntersectionObserver(([e]) => { if (!e.isIntersecting && activeCard && r.contains(activeCard)) stopCard(activeCard); }).observe(r));

  /* long-form: poster only until clicked — the full file streams in the lightbox, never preloaded */
  const groups = Object.entries(LONG_FORM).filter(([, l]) => l.length);
  if (groups.length) {
    $('#longWrap').hidden = false;
    $('#longRail').outerHTML = groups.map(([g, l], gi) => `<h3 class="long-cat">${g}<span class="n">${l.length}</span></h3>
      <div class="rail long-rail" id="longRail${gi}">${l.map(cardHTML).join('')}</div>`).join('');
  }
})();
$$('.arrow').forEach(b => b.addEventListener('click', () => {
  const r = $('#' + b.dataset.target);
  r.scrollBy({ left: +b.dataset.dir * r.clientWidth * .8, behavior: 'smooth' });
}));

/* ---------- client wins + feedback ---------- */
$('#winsTrack').innerHTML = CASE_STUDIES.filter(c => c.permission).map(c => `
  <article class="win-card spot${c.wide ? ' wide' : ''}" data-img="${c.img}" data-case="${c.id}" tabindex="0" role="button" aria-label="Open original analytics screenshot: ${c.title}">
    <div class="win-shot"><img src="${c.img}" alt="${c.platform} analytics screenshot" loading="lazy" decoding="async"></div>
    <div class="win-body">
      <span class="win-plat">${c.platform}${c.niche ? ' · ' + c.niche : ''}</span>
      <div class="win-big">${c.metric.value}<small>${c.metric.unit}</small></div>
      <p class="win-def">${c.metric.definition}</p>
      <p class="win-period">${c.metric.period}</p>
      <dl class="win-extra">${c.extra.map(([v, l]) => `<div><dt>${v}</dt><dd>${l}</dd></div>`).join('')}</dl>
      ${c.challenge ? `<p><b>Challenge:</b> ${c.challenge}</p>` : ''}${c.contribution ? `<p><b>My role:</b> ${c.contribution}</p>` : ''}${c.strategy ? `<p><b>Strategy:</b> ${c.strategy}</p>` : ''}
      ${c.testimonial ? `<blockquote>“${c.testimonial}”</blockquote>` : ''}
    </div>
  </article>`).join('');
const STARS = '<span class="stars" aria-label="5 out of 5">★★★★★</span>';
$('#fbGrid').innerHTML = TESTIMONIALS.map((f, i) => `
  <figure class="tm spot${i === 0 ? ' tm-lead' : ''}">
    <span class="tm-q" aria-hidden="true">“</span>
    ${STARS}
    <blockquote>${f.quote}</blockquote>
    <figcaption>
      <span class="avatar" aria-hidden="true">${(f.showName ? f.name : 'C')[0].toUpperCase()}</span>
      <div><b>${f.showName ? f.name : 'Client'}</b><small>${f.context}</small></div>
      <button type="button" class="tm-proof" data-img="${f.img}" aria-label="View the original Discord message from ${f.showName ? f.name : 'this client'}">View chat ↗</button>
    </figcaption>
  </figure>`).join('');

/* ---------- creators worked with ---------- */
const crGrid = $('#crGrid');
if (crGrid && CREATORS.length) {
  crGrid.innerHTML = CREATORS.map(c => {
    const chip = `<span>${c.title}<img src="${c.avatar}" alt="" width="64" height="64" loading="lazy" decoding="async"></span>`;
    return `<div class="flow-item">
    <a class="flow-link" href="${c.url}" target="_blank" rel="noopener" aria-label="${c.title} on YouTube${c.subs ? ', ' + c.subs + ' subscribers' : ''} (opens in a new tab)">
      <img src="${c.avatar}" alt="${c.title} YouTube profile picture" width="52" height="52" loading="lazy" decoding="async">
      <span class="flow-name">${c.title}</span>
      <span class="flow-subs">${c.subs ? `${c.subs}<small>subscribers</small>` : '<small>YouTube ↗</small>'}</span>
    </a>
    <div class="flow-band" aria-hidden="true"><div class="flow-track">${chip.repeat(12)}</div></div>
  </div>`;
  }).join('');
  /* FlowingMenu: the band slides in from whichever edge the pointer entered */
  crGrid.addEventListener('pointerover', e => {
    const it = e.target.closest('.flow-item'); if (!it || it.contains(e.relatedTarget)) return;
    const r = it.getBoundingClientRect(), band = $('.flow-band', it);
    band.style.transition = 'none'; band.classList.toggle('from-top', e.clientY - r.top < r.height / 2);
    band.offsetWidth; band.style.transition = '';
  });
}
else $('#creators') && $('#creators').remove();

/* ---------- socials (real brand icons) ---------- */
const linkAttrs = s => `href="${s.href}"${s.href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener"'}`;
$('#socials').innerHTML = SOCIALS.map(s => `<a class="soc" ${linkAttrs(s)} style="--brand:${s.brand}" aria-label="${s.name}"><img src="assets/icons/${s.icon}.svg" alt="" width="22" height="22">${s.label || s.name}</a>`).join('');
$('#footSocials').innerHTML = SOCIALS.map(s => `<a ${linkAttrs(s)}><img src="assets/icons/${s.icon}.svg" alt="">${s.label ? s.name + ': ' + s.label : s.name}</a>`).join('');

/* ---------- project estimator ---------- */
(function estimator() {
  const form = $('#estForm'); if (!form) return;
  const steps = $$('.est-step', form), dots = $$('.est-steps li'), back = $('[data-est="back"]', form), next = $('[data-est="next"]', form);
  const status = $('.est-status', form), out = $('#briefOut'), KEY = 'de-estimator';
  form.niche.innerHTML += ESTIMATOR.niches.map(n => `<option>${n}</option>`).join('');
  $('#reqChips').innerHTML = ESTIMATOR.requirements.map(r => `<label><input type="checkbox" name="req" value="${r}">${r}</label>`).join('');
  const methods = [['WhatsApp', !!WA_URL], ['Discord', !!DISCORD_URL], ['Email', !!CONTACT.email]].filter(m => m[1]).map(m => m[0]);
  form.method.innerHTML = methods.map(m => `<option>${m}</option>`).join('');
  { const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset()); form.deadline.min = t.toISOString().slice(0, 10); } // local date, not UTC
  let step = 0, started = false, edited = false;

  const data = () => ({
    type: form.type.value, niche: form.niche.value, count: Math.max(1, Math.min(ESTIMATOR.maxVideos, parseInt(form.count.value) || 1)),
    recurring: form.recurring.value, raw: form.raw.value.trim(), final: form.final.value.trim(),
    req: $$('input[name=req]:checked', form).map(c => c.value), other: form.other.value.trim(), deadline: form.deadline.value,
    name: form.name.value.trim(), contact: form.contact.value.trim(), method: form.method.value, channel: form.channel.value.trim(), ref: form.ref.value.trim(),
  });
  const save = () => { try { const d = data(); d.brief = edited ? out.value : ''; d.step = step; sessionStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  const load = () => {
    try {
      const d = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (!d) return null;
      form.type.value = d.type;
      ['niche', 'count', 'recurring', 'raw', 'final', 'other', 'deadline', 'name', 'contact', 'method', 'channel', 'ref'].forEach(k => { if (d[k] != null && form[k]) form[k].value = d[k]; });
      $$('input[name=req]', form).forEach(c => c.checked = (d.req || []).includes(c.value));
      if (d.brief) { out.value = d.brief; edited = true; }
      return d;
    } catch (e) { return null; }
  };
  const summary = () => {
    const d = data(), from = d.type === 'short' ? PRICING.shortFrom : PRICING.longFrom;
    $('#estPrice').textContent = `from ${money(from * d.count)}`;
    $('#estNote').textContent = `${d.count} × ${d.type === 'short' ? 'short-form' : 'long-form'} video${d.count > 1 ? 's' : ''} at the starting price of ${money(from)} each. A starting reference, not a quote — final pricing depends on length, complexity and edit style. Lorenzo confirms the price.`;
  };
  const brief = () => {
    const d = data();
    const lines = [`Hi Lorenzo! I'm ${d.name || '—'}.`, `Reach me on ${d.method}: ${d.contact || '—'}`, '',
      `Format: ${d.type === 'short' ? 'Short-form' : 'Long-form'} · ${d.niche || '—'}`,
      `Videos: ${d.count} (${d.recurring})`,
      `Raw footage per video: ${d.raw || '—'}`, `Finished length: ${d.final || '—'}`,
      `Requirements: ${[...d.req, d.other].filter(Boolean).join(', ') || '—'}`,
      `Deadline: ${d.deadline || '—'}`];
    if (d.channel) lines.push(`Channel: ${d.channel}`);
    if (d.ref) lines.push(`Reference: ${d.ref}`);
    lines.push('', `Site starting reference: from ${money((d.type === 'short' ? PRICING.shortFrom : PRICING.longFrom) * d.count)} — could you confirm a quote?`);
    return lines.join('\n');
  };
  const validate = i => {
    let ok = true;
    $$('[required]', steps[i]).forEach(el => {
      const err = el.parentElement.querySelector('.err'); let msg = '';
      if (!el.value.trim()) msg = 'Required';
      else if (el.name === 'count' && !(parseInt(el.value) >= 1)) msg = 'Enter at least 1';
      else if (el.name === 'deadline' && el.value < el.min) msg = 'Pick a date from today onwards';
      el.setAttribute('aria-invalid', String(!!msg)); if (err) err.textContent = msg;
      if (msg && ok) { ok = false; el.focus(); }
    });
    return ok;
  };
  const renderSend = () => {
    const d = data(), text = encodeURIComponent(out.value);
    const btns = [`<button type="button" class="btn btn-blue btn-sm" data-act="site">Send from website ↗</button>`];
    if (d.method === 'WhatsApp' && WA_URL) btns.push(`<a class="btn btn-ghost btn-sm" data-act="whatsapp" href="${WA_URL}?text=${text}" target="_blank" rel="noopener">Open in WhatsApp ↗</a>`);
    if (d.method === 'Discord' && DISCORD_URL) btns.push(`<button type="button" class="btn btn-ghost btn-sm" data-act="discord">Copy &amp; open Discord ↗</button>`);
    if (d.method === 'Email' && CONTACT.email) btns.push(`<a class="btn btn-ghost btn-sm" data-act="email" href="mailto:${CONTACT.email}?subject=${encodeURIComponent('Project brief — ' + (d.niche || 'video editing'))}&body=${text}">Open in email ↗</a>`);
    btns.push(`<button type="button" class="btn btn-ghost btn-sm" data-act="copy">Copy brief</button>`);
    $('#sendRow').innerHTML = btns.join('');
    status.textContent = 'Nothing has been sent yet.';
  };
  /* Server-side delivery (api/contact.js emails Lorenzo). Success is only shown when the server confirms. */
  let sending = false;
  async function sendSite(btn) {
    if (sending) return; sending = true; btn.disabled = true; btn.textContent = 'Sending…';
    const d = data();
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: d.name, contact: d.contact, method: d.method, channel: d.channel, brief: out.value, website: form.website ? form.website.value : '' }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || 'server error');
      status.textContent = `✓ Sent! Your brief reached Devereux Edits — expect a reply on ${d.method} soon.`;
      btn.textContent = 'Sent ✓'; track('contact_submitted', { channel: 'site' });
    } catch (e) {
      status.textContent = `Couldn't send from the website (${e.message}). Please use ${WA_URL ? 'WhatsApp' : 'another option'} — your brief is still here.`;
      btn.disabled = false; btn.textContent = 'Try again';
    } finally { sending = false; }
  }
  const show = i => {
    step = i;
    steps.forEach((f, k) => f.hidden = k !== i);
    dots.forEach((d, k) => { d.classList.toggle('on', k <= i); if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
    back.hidden = i === 0; next.hidden = i === steps.length - 1;
    next.textContent = i === steps.length - 2 ? 'Build my brief →' : 'Next →';
    if (i === steps.length - 1) { if (!edited) out.value = brief(); renderSend(); track('estimator_completed', { type: data().type }); }
    save();
  };
  form.addEventListener('input', e => {
    if (!started) { started = true; track('estimator_started'); }
    if (e.target === out) edited = true;
    const err = e.target.parentElement && e.target.parentElement.querySelector('.err');
    if (err) { err.textContent = ''; e.target.removeAttribute('aria-invalid'); }
    summary(); save();
  });
  form.addEventListener('change', () => { summary(); save(); if (step === steps.length - 1) renderSend(); });
  next.addEventListener('click', () => { if (validate(step)) show(step + 1); });
  back.addEventListener('click', () => show(step - 1));
  $('#sendRow').addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (!a) return;
    const act = a.dataset.act;
    if (act === 'site') return sendSite(a);
    if (act === 'copy' || act === 'discord') {
      copyText(out.value, act === 'discord' ? `Brief copied — paste it into a DM to ${CONTACT.discord}.` : 'Brief copied to your clipboard.');
      status.textContent = act === 'discord'
        ? `Brief copied. Lorenzo's Discord profile opens in a new tab — paste the brief into a DM and press send there.`
        : 'Brief copied to your clipboard.';
      track('brief_copied', { via: act });
      if (act === 'discord') { window.open(DISCORD_URL, '_blank', 'noopener'); track('contact_click', { channel: 'discord' }); }
    } else {
      status.textContent = `Opening ${act === 'email' ? 'your email app' : 'WhatsApp'} with the brief filled in — press send there.`;
      track('contact_click', { channel: act });
    }
    track('contact_submitted', { channel: act });
  });
  $$('[data-est-type]').forEach(b => b.addEventListener('click', () => { form.type.value = b.dataset.estType; summary(); show(0); }));
  form.addEventListener('submit', e => e.preventDefault());
  const saved = load(); summary();
  show(saved && saved.step ? Math.min(saved.step, steps.length - 1) : 0);
})();

/* ---------- mobile sticky CTA: hidden over hero, contact and footer ---------- */
(function mobileCta() {
  const bar = $('#mCta'); if (!bar) return;
  const seen = new Set();
  const io = new IntersectionObserver(es => {
    es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target));
    bar.classList.toggle('show', seen.size === 0);
  }, { threshold: .05 });
  [$('.hero'), $('#contact'), $('.footer')].forEach(el => el && io.observe(el));
})();

/* section-view + contact analytics */
(function views() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { track('section_view', { section: e.target.id }); io.unobserve(e.target); } }), { threshold: .4 });
  ['wins', 'pricing'].forEach(id => $('#' + id) && io.observe($('#' + id)));
  document.addEventListener('click', e => {
    const s = e.target.closest('.soc, #footSocials a');
    if (s) track('contact_click', { channel: (s.getAttribute('aria-label') || s.textContent).split(':')[0].trim().toLowerCase() });
  });
})();

$('#yr').textContent = new Date().getFullYear();

/* ---------- lightbox: video with sound / full screenshot ---------- */
const modal = $('#modal'), mBody = $('.modal-body', modal), mInner = $('.modal-inner', modal);
let lastFocus = null;
function openModal({ src, img, w, h }) {
  lastFocus = document.activeElement;
  stopCard(activeCard); heroPause();
  mInner.className = 'modal-inner'; mBody.className = 'modal-body'; mBody.style.aspectRatio = mBody.style.width = mInner.style.width = '';
  if (img) {
    mInner.classList.add('narrow'); mBody.classList.add('img');
    mBody.innerHTML = `<img src="${img}" alt="Full screenshot">`;
  } else if (!src) {
    mBody.innerHTML = `<div><p style="font-family:var(--display);font-size:22px;color:#fff;margin-bottom:8px">Long-form edit coming soon</p><p>Full YouTube edits are being added to the portfolio.</p></div>`;
  } else {
    mBody.classList.add('has');
    mBody.style.aspectRatio = `${w}/${h}`;
    mBody.style.width = `min(100%, calc(84vh * ${(w / h).toFixed(4)}))`;
    mInner.style.width = mBody.style.width;
    const yt = src.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    mBody.innerHTML = yt ? `<iframe src="https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
      : `<video src="${src}" controls autoplay playsinline preload="metadata"></video>`;
  }
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  lenis && lenis.stop(); document.documentElement.style.overflow = 'hidden';
  $('.modal-x', modal).focus({ preventScroll: true });
}
function closeModal() {
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
  mBody.innerHTML = ''; mBody.style.aspectRatio = mBody.style.width = mInner.style.width = '';
  lenis && lenis.start(); document.documentElement.style.overflow = '';
  heroCheck(); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
}
document.addEventListener('click', e => {
  if (e.target.closest('.modal')) return;
  const v = e.target.closest('[data-open]');
  if (v) { track(v.classList.contains('reel') ? 'hero_reel_open' : 'video_open', { video: v.dataset.vid || 'hero' }); return openModal({ src: v.dataset.open, w: +v.dataset.w, h: +v.dataset.h }); }
  const im = e.target.closest('[data-img]');
  if (im) { if (im.dataset.case) track('case_study_open', { id: im.dataset.case }); return openModal({ img: im.dataset.img }); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') return closeModal();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-open],[data-img]')) { e.preventDefault(); e.target.click(); }
});
modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('.modal-x')) closeModal(); });

/* ---------- hero showreel: loads only when visible, pauses off-screen ---------- */
const heroV = $('#heroVideo');
let heroVisible = false;
function heroPause() { heroV && heroV.pause(); }
function heroCheck() {
  if (!heroV || reduce || LOWPERF) return;
  if (heroVisible && !document.hidden && !modal.classList.contains('open')) {
    if (!heroV.getAttribute('src')) heroV.src = heroV.dataset.src;
    heroV.play().catch(() => {});
  } else heroV.pause();
}
if (heroV) {
  heroV.muted = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; heroCheck(); }, { threshold: .25 }).observe(heroV);
  document.addEventListener('visibilitychange', heroCheck);
}

/* ---------- FAQ accordion ---------- */
$('#faqList').innerHTML = FAQ.map(([q, a], i) =>
  `<div class="qa ${i ? '' : 'open'}"><button aria-expanded="${!i}">${q}<span class="pm"></span></button><div class="ans"><div><p>${a}</p></div></div></div>`).join('');
$('#faqList').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const qa = b.parentElement, open = !qa.classList.contains('open');
  $$('.qa', qa.parentElement).forEach(x => { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', false); });
  qa.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
  setTimeout(() => hasGsap && ScrollTrigger.refresh(), 500);
});

/* ---------- SpotlightCard + Magnet (React Bits) ---------- */
if (fine) document.addEventListener('pointermove', e => {
  const c = e.target.closest('.spot'); if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', `${e.clientX - r.left}px`);
  c.style.setProperty('--my', `${e.clientY - r.top}px`);
}, { passive: true });
if (fine && !reduce) $$('.magnet').forEach(b => {
  b.addEventListener('pointermove', e => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`;
  });
  b.addEventListener('pointerleave', () => b.style.transform = '');
});

/* ---------- Squares background (React Bits) ---------- */
(function squares() {
  const cv = $('#squares'); if (!cv) return;
  const ctx = cv.getContext('2d'), S = 46, dpr = Math.min(devicePixelRatio, 1.5);
  let w, h, off = 0, hov = null, running = true;
  const size = () => { w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener('resize', size);
  if (fine) $('.hero').addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    hov = [Math.floor((e.clientX - r.left + off) / S), Math.floor((e.clientY - r.top + off) / S)];
  }, { passive: true });
  new IntersectionObserver(([e]) => running = e.isIntersecting).observe(cv);
  const draw = () => {
    if (running) {
      ctx.clearRect(0, 0, w, h);
      if (!reduce) off = (off + .18) % S;
      ctx.strokeStyle = 'rgba(255,255,255,.055)'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w + S; x += S) for (let y = 0; y < h + S; y += S) {
        if (hov && x / S === hov[0] && y / S === hov[1]) { ctx.fillStyle = 'rgba(61,110,245,.2)'; ctx.fillRect(x - off, y - off, S, S); }
        ctx.rect(x - off + .5, y - off + .5, S, S);
      }
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  };
  draw();
})();

/* ---------- ClickSpark (React Bits) ---------- */
(function clickSpark() {
  const cv = $('#spark'), ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio, 2);
  let sparks = [], on = false;
  const size = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener('resize', size);
  addEventListener('pointerdown', e => {
    if (reduce) return;
    const t = performance.now();
    for (let i = 0; i < 8; i++) sparks.push({ x: e.clientX, y: e.clientY, a: (Math.PI * 2 * i) / 8, t });
    if (!on) { on = true; requestAnimationFrame(loop); }
  });
  function loop(now) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    sparks = sparks.filter(s => {
      const p = (now - s.t) / 420; if (p >= 1) return false;
      const ease = p * (2 - p), d = ease * 28, len = 10 * (1 - ease);
      ctx.strokeStyle = '#5a86ff'; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(s.x + d * Math.cos(s.a), s.y + d * Math.sin(s.a));
      ctx.lineTo(s.x + (d + len) * Math.cos(s.a), s.y + (d + len) * Math.sin(s.a));
      ctx.stroke(); return true;
    });
    if (sparks.length) requestAnimationFrame(loop); else { on = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
})();

/* ---------- timeline playhead + timecode ---------- */
(function playhead() {
  const tl = $('.timeline'); if (!tl || reduce) return;
  const ph = $('.playhead', tl), tc = $('.tc', tl), lane = $('.lane', tl);
  let lx = 0, lw = 0, vis = true;
  const m = () => { const lr = lane.getBoundingClientRect(), tr = tl.getBoundingClientRect(); lx = lr.left - tr.left; lw = lr.width; };
  m(); addEventListener('resize', m); addEventListener('load', m);
  new IntersectionObserver(([e]) => vis = e.isIntersecting).observe(tl);
  const start = performance.now(), dur = 9000;
  const loop = now => {
    if (vis) {
      const p = ((now - start) % dur) / dur;
      ph.style.transform = `translateX(${lx - 44 + p * lw}px)`;
      const secs = p * 60, f = Math.floor((secs % 1) * 24);
      tc.textContent = `00:00:${String(Math.floor(secs)).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();

/* ---------- process steps (click or scroll) ---------- */
(function process() {
  const steps = $$('.step');
  const set = idx => steps.forEach((s, i) => s.classList.toggle('active', i <= idx));
  set(0);
  steps.forEach((s, i) => s.addEventListener('click', () => set(i)));
  if (hasGsap) ScrollTrigger.create({ trigger: '.steps', start: 'top 70%', end: 'bottom 45%', onUpdate: self => set(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))) });
})();

/* ---------- ScrollReveal words (React Bits) ---------- */
(function scrollWords() {
  const p = $('.scroll-words'); if (!p) return;
  const hl = new Set(['earn', 'next', 'one.', 'Hooks', 'pacing', 'pattern', 'breaks']);
  p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="sw${hl.has(w) ? ' hl' : ''}">${w}</span>`).join(' ');
  const words = $$('.sw', p);
  if (!hasGsap || reduce) { words.forEach(w => w.classList.add('on')); return; }
  let last = -1;
  ScrollTrigger.create({
    trigger: p, start: 'top 82%', end: 'bottom 50%', scrub: true,
    onUpdate: self => {
      const n = Math.round(self.progress * words.length); if (n === last) return; last = n;
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    },
  });
})();

/* ---------- entrance animations, counters, pinned wins ---------- */
(function intro() {
  const count = el => {
    const to = +el.dataset.to, dec = +el.dataset.dec || 0, t0 = performance.now(), d = 1800;
    const f = now => { const p = Math.min((now - t0) / d, 1); el.textContent = (to * (1 - Math.pow(1 - p, 4))).toFixed(dec); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  };
  const cObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { $$('.count', e.target).forEach(count); cObs.unobserve(e.target); } }), { threshold: .2 });
  // Real values are in the HTML for first paint / no-JS; only count up if the stats start below the fold.
  const st = $('.stats');
  if (!reduce && st && st.getBoundingClientRect().top > innerHeight) cObs.observe(st);

  if (!hasGsap || reduce) return;

  $$('.split .line').forEach(l => { l.innerHTML = l.textContent.trim().split(' ').map(w => `<span class="w">${w}</span>`).join(' '); });
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.pill', { y: 20, opacity: 0, duration: .8 })
    .from('.hero .eyebrow', { y: 16, opacity: 0, duration: .8 }, '<.08')
    .from('.split .w', { yPercent: 110, rotate: 4, duration: 1.1, stagger: .07 }, '<.1')
    .from('.rule', { scaleX: 0, duration: 1 }, '<.45')
    .from('.lede', { y: 20, opacity: 0, duration: .9 }, '<.05')
    .from('.hero-ctas .btn', { y: 20, opacity: 0, duration: .8, stagger: .08, clearProps: 'transform' }, '<.1')
    .from('.monitor', { y: 50, opacity: 0, duration: 1.3 }, .25)
    .from('.timeline', { y: 30, opacity: 0, duration: 1 }, '<.2');

  const groups = ['.sec-head', '.who-card', '.who-copy', '.tm', '.flow-item', '.plan', '.cmp-col', '.cta-strip', '.qa', '.est', '.socials', '.feat', '.process-copy .h2', '.foot-grid > div', '.stats-row', '.wins-head'];
  // reveal via IntersectionObserver — immune to layout shifts from lazy media
  const revObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    revObs.unobserve(e.target);
    gsap.to(e.target, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: (+e.target.dataset.rd || 0), clearProps: 'transform,opacity' });
  }), { rootMargin: '0px 0px -6% 0px' });
  groups.forEach(sel => $$(sel).forEach((el, i) => {
    if (el.getBoundingClientRect().top < innerHeight) return;
    gsap.set(el, { y: 36, opacity: 0 }); el.dataset.rd = (i % 4) * .06; revObs.observe(el);
  }));
  // keep pinned/scrubbed triggers accurate when the page height changes
  let rh = document.body.scrollHeight, rt;
  new ResizeObserver(() => {
    if (Math.abs(document.body.scrollHeight - rh) < 2) return;
    rh = document.body.scrollHeight; clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe(document.body);

  gsap.fromTo('.wm span:first-child', { xPercent: -25 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.wordmark', start: 'top bottom', end: 'center center', scrub: true } });
  gsap.fromTo('.wm span:last-child', { xPercent: 25 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.wordmark', start: 'top bottom', end: 'center center', scrub: true } });

  // Client wins: pinned horizontal scroll on desktop only (native swipe on tablet/phone)
  ScrollTrigger.matchMedia({
    '(min-width: 1025px)': () => {
      const track = $('#winsTrack');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.wins-pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 },
      });
    },
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();

/* ---------- process: the "edit bay" panel mirrors the active step ---------- */
(function editBay() {
  const bay = $('.bay'); if (!bay) return;
  const label = $('.bay-step', bay), pct = $('.bay-pct', bay), fill = $('.bay-fill', bay);
  const names = $$('.step h3').map(h => h.textContent);
  const obs = new MutationObserver(() => {
    const idx = $$('.step.active').length - 1;
    bay.dataset.step = idx;
    label.textContent = names[idx] || '';
    const p = Math.round(((idx + 1) / names.length) * 100);
    pct.textContent = p + '%'; fill.style.transform = `scaleX(${p / 100})`;
  });
  $$('.step').forEach(s => obs.observe(s, { attributes: true, attributeFilter: ['class'] }));
  bay.dataset.step = 0; label.textContent = names[0]; pct.textContent = '20%'; fill.style.transform = 'scaleX(.2)';
})();
