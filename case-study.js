(function () {
  const hero        = document.getElementById('hero');
  const stickyNav   = document.getElementById('sticky-nav');
  const navItems    = Array.from(document.querySelectorAll('.nav-item'));
  const drawerItems = Array.from(document.querySelectorAll('.drawer-item'));
  const hamburger   = document.getElementById('nav-hamburger');
  const drawer      = document.getElementById('nav-drawer');

  function closeDrawer() {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const opening = !drawer.classList.contains('open');
    drawer.classList.toggle('open', opening);
    hamburger.classList.toggle('open', opening);
    hamburger.setAttribute('aria-expanded', String(opening));
  });

  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t)    { return a + (b - a) * t; }

  // Sticky nav visibility
  new IntersectionObserver(
    ([e]) => {
      const visible = !e.isIntersecting;
      stickyNav.classList.toggle('visible', visible);
      if (!visible) closeDrawer();
    },
    { threshold: 0.05 }
  ).observe(hero);

  let data = [];

  function measureAndInit() {
    data = Array.from(document.querySelectorAll('.cs-section')).map(sec => {
      const body = sec.querySelector('.section-body');
      body.style.height   = 'auto';
      body.style.overflow = 'visible';
      const bodyH = body.scrollHeight;
      body.style.overflow = 'hidden';
      body.style.height   = bodyH + 'px';
      const secH = sec.offsetHeight;
      return { sec, body, secH };
    });
    update();
  }

  window.addEventListener('load', measureAndInit);

  const ACTIVE_Y    = 0.25;
  const ENTRY_PRE   = 350;
  const BOT_START_F = 0.78;
  const BOT_END_F   = 0.06;

  let ticking = false;

  function update() {
    if (!data.length) return;
    const vH        = window.innerHeight;
    const activeTop = vH * ACTIVE_Y;
    const entryFrom = vH + Math.min(ENTRY_PRE, vH * 0.5);
    const botStart  = vH * BOT_START_F;
    const botEnd    = vH * BOT_END_F;

    const tops = data.map(d => d.sec.getBoundingClientRect().top);

    let navActive = -1;
    let maxBodyOp = 0;

    tops.forEach((top, i) => {
      const { sec, body, secH } = data[i];
      const bottom = top + secH;

      const exitT  = clamp((botStart - bottom) / (botStart - botEnd), 0, 1);
      const enterT = clamp((entryFrom - top) / (entryFrom - activeTop), 0, 1);

      let secOpacity, bodyOpacity, scale;

      if (top > entryFrom) {
        secOpacity = 0; bodyOpacity = 0; scale = 0.82;
      } else if (exitT > 0) {
        secOpacity  = lerp(1, 0.2, exitT);
        bodyOpacity = clamp(1 - exitT * 1.6, 0, 1);
        scale       = 1;
      } else {
        secOpacity  = enterT;
        bodyOpacity = enterT;
        scale       = lerp(0.82, 1, enterT);
      }

      sec.style.opacity   = secOpacity.toFixed(3);
      sec.style.transform = `scale(${scale.toFixed(4)})`;
      body.style.opacity  = bodyOpacity.toFixed(3);

      sec.classList.toggle('past', exitT >= 1);

      if (bodyOpacity > maxBodyOp) { maxBodyOp = bodyOpacity; navActive = i; }
    });

    navItems.forEach((item, i) => item.classList.toggle('active', i === navActive));
    drawerItems.forEach((item, i) => item.classList.toggle('active', i === navActive));
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
})();
