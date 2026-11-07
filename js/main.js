/*
 * Go2 product page — interactions.
 * Requires GSAP 3.13 + ScrollTrigger + ScrollSmoother (loaded with `defer` before this file).
 */
(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  gsap.config({ nullTargetWarn: false });

  const mm = gsap.matchMedia();
  const CONDITIONS = {
    isPortraitRes: '(orientation: portrait)',
    isDesktopRes: '(orientation: landscape)',
    isPortraitResPhone: '(orientation: portrait) and (max-aspect-ratio: 0.625)',
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Smooth scrolling (landscape only, like the original) ---------- */
  mm.add(CONDITIONS, ({ conditions }) => {
    if (!conditions.isDesktopRes || reducedMotion) return;
    const smoother = ScrollSmoother.create({ smooth: 1.5, speed: 0.5, smoothTouch: 0 });
    return () => smoother.kill();
  });

  /* ---------- Hero ---------- */
  function heroVideo() {
    const v = document.getElementById('hero-video');
    if (v) v.play().catch(() => {});
  }

  function introAnimation() {
    mm.add(CONDITIONS, ({ conditions }) => {
      const items = gsap.utils.toArray('.intro-anim');
      gsap.timeline({ defaults: { duration: 1, ease: 'power2.out' }, delay: 0.25 })
        .fromTo(items, { autoAlpha: 0, y: '2vw' }, { autoAlpha: 1, y: '0vw', stagger: 0.15 });
      gsap.timeline({
        scrollTrigger: { trigger: '#hero-section', start: 'top top', end: 'bottom top-=25%', scrub: true },
      }).to('#hero-section', { opacity: 0 });
    });
  }

  /* ---------- Scroll-scrubbed image sequence ---------- */
  function sequenceFrames() {
    const section = document.querySelector('.sequence-section');
    if (!section) return;
    const q = gsap.utils.selector(section);
    const content = q('.content')[0];
    const contentChildren = q('.content > *');
    const pin = q('.sequence-pin')[0];
    const holder = q('.sequence-canvas')[0];
    const canvas = q('#sequence-canvas')[0];
    const ctx = canvas.getContext('2d');
    const count = Number(holder.dataset.frames);
    const path = holder.dataset.path;
    const frames = new Array(count).fill(null);
    const state = { frame: 0 };
    let portrait = false;

    const draw = () => {
      // Use the requested frame, or the nearest loaded one before it.
      let i = state.frame;
      while (i > 0 && !frames[i]) i--;
      const img = frames[i];
      if (!img) return;
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * scale, h = img.height * scale;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };

    const resize = (keep = false) => {
      if (keep) return; // on phones, ignore address-bar resizes
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    // Load even frames first so the whole range is scrubbable quickly, then fill in odd ones.
    const load = (i) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { frames[i] = img; if (i === state.frame || i === 0) draw(); };
      img.src = `${path}${String(i).padStart(4, '0')}.avif`;
    };
    for (let i = 0; i < count; i += 2) load(i);
    for (let i = 1; i < count; i += 2) load(i);

    gsap.timeline({ scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true } })
      .fromTo(holder, { yPercent: window.innerHeight > window.innerWidth ? -5 : -35 }, { yPercent: 0, duration: 2 })
      .from(holder, { opacity: 0, duration: 1.5, ease: 'power1.in' }, '<')
      .from(contentChildren, { opacity: 0, y: '5vw', stagger: 0.25, duration: 0.75 }, 1)
      .fromTo(content, { y: '20vw' }, { y: '0vw', ease: 'power1.out', duration: 1.5 }, '<')
      .to(content, { autoAlpha: 0, ease: 'power1.in', duration: 0.25 }, '-=0.25');

    ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom top', pin, pinSpacing: false });

    mm.add(CONDITIONS, ({ conditions }) => {
      portrait = conditions.isPortraitRes;
      const spec = (n) => `.spec:nth-of-type(${n})`;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section, start: 'top bottom',
          end: portrait ? 'bottom center' : 'bottom top+=35%', scrub: true,
        },
        defaults: { duration: 1 },
      }).fromTo(state, { frame: 0 }, { frame: count - 1, snap: 'frame', ease: 'none', onUpdate: draw });

      [1, 2, 3, 4].forEach((n, idx) => {
        tl.from(gsap.utils.toArray(`${spec(n)} > .wrapper-seq-elem > *`), { yPercent: 100, duration: 0.1 }, idx === 0 ? 0.15 : '>')
          .to(spec(n), { autoAlpha: 0, ease: 'power1.in', duration: 0.1 }, '>');
      });
      gsap.set('.wrapper-seq-elem', { opacity: 1 });
    });

    resize();
    window.addEventListener('resize', () => resize(portrait));
  }

  /* ---------- Section reveals (landscape only) ---------- */
  function simpleSections() {
    mm.add(CONDITIONS, ({ conditions }) => {
      if (conditions.isPortraitRes) return;
      gsap.utils.toArray('.simple-section').forEach((section) => {
        const children = Array.from(section.children);
        gsap.timeline({ scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom bottom', scrub: true } })
          .from(children, { opacity: 0, stagger: 0.2, ease: 'power1.in' })
          .from(children, { y: '5vw', stagger: 0.2 }, 0);
      });
    });
  }

  function techTable() {
    mm.add(CONDITIONS, ({ conditions }) => {
      if (conditions.isPortraitRes) return;
      gsap.timeline({
        scrollTrigger: { trigger: '#tech-section .table .head', start: 'top bottom-=10%', end: 'bottom bottom-=10%', scrub: true },
      }).from(['#tech-section .head .line-element', '#tech-section .head h2'], { opacity: 0, stagger: 0.1 });

      gsap.utils.toArray('#tech-section .robot-spec-table tr').forEach((row) => {
        gsap.timeline({ scrollTrigger: { trigger: row, start: 'top bottom-=15%', end: 'bottom bottom-=10%', scrub: true } })
          .from(row, { yPercent: 10 }, 0)
          .from(row, { opacity: 0 }, 0);
      });
    });
  }

  function cards() {
    mm.add(CONDITIONS, ({ conditions }) => {
      if (conditions.isPortraitRes) return;
      gsap.timeline({ scrollTrigger: { trigger: '.cards-section', start: 'top bottom-=5%', end: 'bottom bottom-=20%', scrub: 0.5 } })
        .from('.cards-section > h2', { opacity: 0 })
        .from('.cards-section .card', { y: '7.5vw', duration: 1, stagger: 0.25 })
        .from('.cards-section .card', { opacity: 0, ease: 'power1.in', duration: 1, stagger: 0.25 }, '<');
    });

    // No store backend in this remake: give visual feedback only.
    document.querySelectorAll('.accessory-atc-wrap:not(.sold-out) .primary-btn').forEach((btn) => {
      const label = btn.firstChild;
      btn.addEventListener('click', () => {
        const wrap = btn.parentElement;
        if (wrap.classList.contains('added')) return;
        wrap.classList.add('added');
        label.textContent = 'Added';
        setTimeout(() => { wrap.classList.remove('added'); label.textContent = 'Add to cart'; }, 1600);
      });
    });
  }

  function bookSection() {
    mm.add(CONDITIONS, ({ conditions }) => {
      if (conditions.isPortraitRes) return;
      const b = '.book-section .book-wrapper';
      gsap.timeline({
        scrollTrigger: { trigger: `${b} .first`, start: 'top bottom+=5%', endTrigger: b, end: 'bottom bottom-=20%', scrub: 0.5 },
      })
        .from(`${b} .second`, { rotateY: -45, duration: 2, ease: 'linear' }, 0)
        .from(`${b} .second .book-shot`, { yPercent: 50, duration: 2 }, 0)
        .from(`${b} .first h4`, { opacity: 0, x: '-1vw' }, 1)
        .from(`${b} .first p`, { opacity: 0, x: '-1vw' }, '<50%')
        .from(`${b} .first .primary-btn`, { opacity: 0, x: '-1vw' }, '<50%')
        .from(`${b} .first .secondary-btn`, { opacity: 0, x: '-1vw' }, '<50%');
    });
  }

  /* ---------- Footer ---------- */
  function footer() {
    mm.add(CONDITIONS, ({ conditions }) => {
      if (conditions.isPortraitResPhone) {
        // Collapsible link groups on phones.
        const groups = gsap.utils.toArray('footer .links');
        let closed = 0;
        const tls = [];
        const handlers = [];
        groups.forEach((group, i) => {
          const q = gsap.utils.selector(group);
          const button = q('button')[0];
          if (i === 0) closed = group.offsetHeight;
          gsap.set(q('a'), { display: 'block' });
          const open = group.offsetHeight;
          const tl = gsap.timeline({ paused: true })
            .fromTo(group, { height: closed }, { height: open })
            .to(q('button img')[0], { rotate: 180 }, '<');
          tl.reversed(true);
          tls.push(tl);
          const onClick = () => tls.forEach((t, j) => (j === i && t.reversed() ? t.play() : t.reverse()));
          button.addEventListener('click', onClick);
          handlers.push([button, onClick]);
        });
        return () => handlers.forEach(([el, fn]) => el.removeEventListener('click', fn));
      }
      // Fade the floating header logo out as the footer logo comes in.
      gsap.timeline({
        scrollTrigger: { trigger: 'footer > .brand', start: 'top bottom', end: 'top bottom-=5%', scrub: true },
      }).to('header > .brand-link', { autoAlpha: 0 });
    });
  }

  /* ---------- Navigation ---------- */
  function desktopNav() {
    const links = Array.from(document.querySelectorAll('nav .nav-link'));
    const panels = Array.from(document.querySelectorAll('nav .sub-nav'));
    const tls = panels.map((panel) => {
      const tl = gsap.timeline({ paused: true })
        .fromTo(panel, { autoAlpha: 0, y: '2vw' }, { autoAlpha: 1, y: '0.5vw', duration: 0.25 })
        .from(panel.querySelectorAll('a'), { opacity: 0, stagger: 0.05, duration: 0.2, ease: 'power1.in' }, '<25%');
      panel.addEventListener('mouseleave', () => tl.timeScale(3).tweenTo(0));
      return tl;
    });
    const show = (linkIndex) => {
      // Link 0 is "home"; links 1..3 own panels 0..2.
      tls.forEach((tl, i) => (i + 1 === linkIndex ? tl.timeScale(1).tweenTo(tl.totalDuration()) : tl.timeScale(3).tweenTo(0)));
    };
    links.forEach((link, i) => {
      link.addEventListener('mouseenter', () => show(i));
      link.addEventListener('focus', () => show(i));
      link.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); } });
    });
    window.addEventListener('click', ({ target }) => {
      if (!target.closest('nav')) tls.forEach((tl) => tl.tweenTo(0));
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') tls.forEach((tl) => tl.tweenTo(0)); });
  }

  function mobileMenu() {
    const burger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    if (!burger || !menu) return;
    const groups = gsap.utils.toArray('#menu .accordion-group');
    burger.addEventListener('click', () => {
      if (menu.classList.contains('open')) groups.forEach((g) => g.classList.add('hidden'));
      menu.classList.toggle('open');
      burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', menu.classList.contains('open'));
    });
    groups.forEach((group) => {
      const btn = group.querySelector(':scope > button');
      if (btn) btn.addEventListener('click', () => group.classList.toggle('hidden'));
    });
  }

  function markActiveLinks() {
    document.querySelectorAll('nav .sub-nav a[href="./"], #menu a[href="./"]').forEach((a) => a.classList.add('active'));
  }

  /* ---------- Boot ---------- */
  heroVideo();
  introAnimation();
  sequenceFrames();
  simpleSections();
  techTable();
  cards();
  bookSection();
  footer();
  desktopNav();
  mobileMenu();
  markActiveLinks();

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
