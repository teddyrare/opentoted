/* ── HAMBURGER MENU (homepage, about, work samples) ── */
(function () {
  const hamburger = document.getElementById('page-hamburger');
  const drawer    = document.getElementById('page-drawer');
  if (!hamburger || !drawer) return;

  function openMenu() {
    drawer.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    drawer.classList.contains('open') ? closeMenu() : openMenu();
  });
  document.addEventListener('click', function (e) {
    if (!drawer.contains(e.target)) closeMenu();
  });
})();

/* ── AI MODAL (homepage only) ── */
(function () {
  const btn      = document.getElementById('ai-float-btn');
  const backdrop = document.getElementById('ai-modal-backdrop');
  const closeBtn = document.getElementById('ai-modal-close');
  if (!btn || !backdrop || !closeBtn) return;

  function openModal()  { backdrop.classList.add('open'); }
  function closeModal() { backdrop.classList.remove('open'); }

  btn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
})();
