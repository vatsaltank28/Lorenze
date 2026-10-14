/* Vanilla ports of the React Bits effects used on the site (reactbits.dev).
   Every effect is progressive: it is skipped on touch devices, reduced motion or slow devices (LOWPERF in app.js). */
(function effects() {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const rich = !reduce && !window.LOWPERF; // heavy, purely decorative effects

  /* ---------- StarBorder: light that travels around key blocks ---------- */
  $$('.plan, .who-card, .cta-strip, .bay, .nl, .est').forEach(el => {
    el.classList.add('star');
    el.insertAdjacentHTML('afterbegin', '<i class="sb sb-b" aria-hidden="true"></i><i class="sb sb-t" aria-hidden="true"></i>');
  });

  /* ---------- GlareHover: diagonal sheen on media cards ---------- */
  const addGlare = root => $$('.vc, .win-card, .shot', root).forEach(el => {
    if (!el.querySelector(':scope > .glare')) el.insertAdjacentHTML('beforeend', '<i class="glare" aria-hidden="true"></i>');
  });
  addGlare(document);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && addGlare(n.parentNode || n))))
    .observe($('main'), { childList: true, subtree: true });

  /* ---------- MagicBento: border glow + particles + tilt on blocks ---------- */
  $$('.cmp-col, .shot, .win-card, .plan, .nl').forEach(el => el.classList.add('bento', 'spot'));
  if (fine && rich) {
    document.addEventListener('pointerover', e => {
      const c = e.target.closest('.bento'); if (!c || c.contains(e.relatedTarget)) return;
      for (let i = 0; i < 8; i++) {
        const p = document.createElement('i'); p.className = 'bento-p'; p.setAttribute('aria-hidden', 'true');
        p.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--dx:${(Math.random() - .5) * 90}px;--dy:${(Math.random() - .5) * 90}px;animation-delay:${i * 60}ms`;
        c.append(p); setTimeout(() => p.remove(), 1600 + i * 60);
      }
    });
    document.addEventListener('pointermove', e => {
      const c = e.target.closest('.bento:not(.win-card)'); if (!c) return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    }, { passive: true });
    document.addEventListener('pointerout', e => {
      const c = e.target.closest('.bento'); if (c && !c.contains(e.relatedTarget)) c.style.transform = '';
    });
  }

  /* ---------- LogoLoop: tools marquee ---------- */
  const loop = $('.logo-loop-track');
  if (loop) loop.insertAdjacentHTML('beforeend', loop.innerHTML.replace(/<i /g, '<i aria-hidden="true" '));

  /* ---------- TrueFocus: focus frame that jumps between words ---------- */
  $$('[data-true-focus]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.innerHTML = words.map(w => `<span class="tf-w" aria-hidden="true">${w}</span>`).join(' ') + '<span class="tf-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    const ws = $$('.tf-w', el), frame = $('.tf-frame', el);
    if (reduce) { el.classList.add('tf-static'); return; }
    let i = 0, timer = null;
    const go = () => {
      ws.forEach((w, k) => w.classList.toggle('on', k === i));
      const r = ws[i].getBoundingClientRect(), p = el.getBoundingClientRect();
      frame.style.cssText = `opacity:1;transform:translate(${r.left - p.left}px,${r.top - p.top}px);width:${r.width}px;height:${r.height}px`;
      i = (i + 1) % ws.length;
    };
    new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) { go(); timer = setInterval(go, 1100); }
    }).observe(el);
    if (fine) ws.forEach((w, k) => w.addEventListener('pointerenter', () => { clearInterval(timer); i = k; go(); }));
  });

  /* ---------- Crosshair: on the panels that show editing ---------- */
  if (fine && !reduce) $$('.reel, .bay-view').forEach(box => {
    box.insertAdjacentHTML('beforeend', '<span class="xh" aria-hidden="true"><i class="xh-x"></i><i class="xh-y"></i><b class="xh-tc"></b></span>');
    const xh = $('.xh', box), tc = $('.xh-tc', box);
    box.addEventListener('pointermove', e => {
      const r = box.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      xh.style.setProperty('--x', x + 'px'); xh.style.setProperty('--y', y + 'px');
      const f = Math.round((x / r.width) * 1440);
      tc.textContent = `00:00:${String(Math.floor(f / 24)).padStart(2, '0')}:${String(f % 24).padStart(2, '0')}`;
    }, { passive: true });
  });

  /* ---------- TargetCursor: corner brackets that lock onto clickable things ---------- */
  if (fine && !reduce) {
    const cur = document.createElement('div');
    cur.className = 'tcur'; cur.setAttribute('aria-hidden', 'true');
    cur.innerHTML = '<i class="tc-dot"></i><i class="tc-c tl"></i><i class="tc-c tr"></i><i class="tc-c bl"></i><i class="tc-c br"></i>';
    document.body.append(cur); document.documentElement.classList.add('tcur-on');
    const TARGET = 'a, button, [data-open], [data-img], select, label:has(input[type=radio]), label:has(input[type=checkbox])';
    let x = -100, y = -100, tgt = null, raf = 0;
    const draw = () => {
      raf = 0;
      cur.style.transform = `translate(${x}px,${y}px)`;
      if (tgt && tgt.isConnected) {
        const r = tgt.getBoundingClientRect(), p = 6;
        cur.classList.add('lock');
        cur.style.setProperty('--l', `${r.left - x - p}px`); cur.style.setProperty('--t', `${r.top - y - p}px`);
        cur.style.setProperty('--r', `${r.right - x + p}px`); cur.style.setProperty('--b', `${r.bottom - y + p}px`);
      } else cur.classList.remove('lock');
    };
    const q = () => raf || (raf = requestAnimationFrame(draw));
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; cur.classList.add('show'); q(); }, { passive: true });
    addEventListener('scroll', q, { passive: true });
    document.addEventListener('pointerover', e => { tgt = e.target.closest(TARGET); q(); });
    document.documentElement.addEventListener('pointerleave', () => cur.classList.remove('show'));
    addEventListener('pointerdown', () => cur.classList.add('down'));
    addEventListener('pointerup', () => cur.classList.remove('down'));
  }

  /* ---------- Strands: flowing lines in open, empty spaces ---------- */
  if (rich) $$('canvas.strands').forEach(cv => {
    const ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio, 1.5), N = 9;
    let w = 0, h = 0, vis = false, t = 0;
    const size = () => { w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener('resize', size);
    new IntersectionObserver(([e]) => { const was = vis; vis = e.isIntersecting; if (vis && !was) requestAnimationFrame(frame); }).observe(cv);
    function frame() {
      if (!vis) return;
      t += .006; ctx.clearRect(0, 0, w, h);
      for (let s = 0; s < N; s++) {
        const k = s / (N - 1), g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, 'rgba(61,110,245,0)'); g.addColorStop(.5, `rgba(${90 + k * 60},${110 + k * 20},245,${.18 + k * .12})`); g.addColorStop(1, 'rgba(139,108,246,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.beginPath();
        for (let x = 0; x <= w; x += 12) {
          const y = h / 2 + Math.sin(x * .004 + t * (1 + k) + s) * h * .22 * (.4 + k * .6) + Math.sin(x * .011 - t * 1.7 + s * 2) * h * .06;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      requestAnimationFrame(frame);
    }
  });

  /* ---------- GooeyNav (desktop): sliding pill + particle burst ---------- */
  const nl = $('.nav-links');
  if (nl) {
    const pill = document.createElement('li'); pill.className = 'goo-pill'; pill.setAttribute('aria-hidden', 'true');
    nl.append(pill);
    const move = a => {
      if (!a) { pill.style.opacity = 0; return; }
      const r = a.getBoundingClientRect(), p = nl.getBoundingClientRect();
      pill.style.cssText = `opacity:1;transform:translateX(${r.left - p.left - 14}px);width:${r.width + 28}px`;
    };
    const burst = a => {
      if (reduce) return;
      const r = a.getBoundingClientRect(), p = nl.getBoundingClientRect();
      for (let i = 0; i < 10; i++) {
        const d = document.createElement('i'); d.className = 'goo-p'; d.setAttribute('aria-hidden', 'true');
        const ang = Math.PI * 2 * i / 10;
        d.style.cssText = `left:${r.left - p.left + r.width / 2}px;top:${r.height / 2}px;--dx:${Math.cos(ang) * 34}px;--dy:${Math.sin(ang) * 22}px`;
        nl.append(d); setTimeout(() => d.remove(), 700);
      }
    };
    const current = () => $('a.on', nl);
    new MutationObserver(() => move(current())).observe(nl, { subtree: true, attributes: true, attributeFilter: ['class'] });
    $$('a', nl).forEach(a => {
      a.addEventListener('pointerenter', () => move(a));
      a.addEventListener('click', () => burst(a));
    });
    nl.addEventListener('pointerleave', () => move(current()));
    addEventListener('resize', () => move(current()));
  }

  /* ---------- StaggeredMenu + CardNav (phone) ---------- */
  const burger = $('.burger'), menu = $('.mobile-menu');
  if (burger && menu) {
    const close = () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); };
    const sync = () => {
      const open = menu.classList.contains('open');
      menu.setAttribute('aria-hidden', String(!open));
      menu.inert = !open;
      document.documentElement.classList.toggle('menu-open', open);
    };
    new MutationObserver(sync).observe(menu, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { close(); burger.focus(); } });
    menu.addEventListener('click', e => { if (e.target === menu || e.target.classList.contains('sm-layer')) close(); });
    addEventListener('resize', () => { if (innerWidth > 860 && menu.classList.contains('open')) close(); });
    sync();
  }

  /* ---------- ScrollStack: process steps stack as you scroll ---------- */
  const steps = $$('.steps .step');
  if (steps.length && !reduce) {
    let tops = [], ticking = false;
    const measure = () => tops = steps.map(s => parseFloat(getComputedStyle(s).top) || 0);
    const stack = () => {
      ticking = false;
      steps.forEach((s, i) => {
        let over = 0;
        for (let j = i + 1; j < steps.length; j++) if (steps[j].getBoundingClientRect().top <= tops[j] + 2) over++;
        s.style.transform = over ? `scale(${1 - over * .035})` : '';
        s.style.filter = over ? `brightness(${1 - over * .14})` : '';
      });
    };
    measure();
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(stack); } }, { passive: true });
    addEventListener('resize', () => { measure(); stack(); });
    stack();
  }
})();
