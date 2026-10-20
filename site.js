// Shared behaviour for every page: live version, founder seats, copy buttons.
(function () {
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // The same feed the app polls for updates.
  window.latysFeed = fetch('./latys-latest.json', { cache: 'no-store' })
    .then((r) => r.json())
    .catch(() => null);
  window.latysFeed.then((d) => {
    if (!d || !d.version) return;
    $$('[data-version]').forEach((el) => { el.textContent = 'v' + d.version; });
    $$('[data-notes]').forEach((el) => { el.textContent = d.notes || ''; });
  });

  // The founder run closed on 2026-10-19 with 8 founders (5 at $5, 3 at $10).
  // Each founder is one leaf off the tree.
  const FOUNDERS = 8;
  const LEAF_COLORS = ['#e8b662', '#e2703a', '#d98aa8', '#b9c47c', '#9fb3d1', '#c4452c', '#e08f73', '#8b6dff', '#25c8a8', '#dfa843'];
  const LEAF_TILT = [-8, 5, -3, 7, -6, 4, -5, 8, -4, 6];
  $$('[data-leaves]').forEach((box) => {
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', FOUNDERS + ' founders');
    for (let i = 0; i < FOUNDERS; i++) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 32');
      svg.setAttribute('aria-hidden', 'true');
      svg.classList.add('taken', 'grow');
      svg.style.setProperty('--r', LEAF_TILT[i] + 'deg');
      svg.style.setProperty('--c', LEAF_COLORS[i]);
      svg.style.animationDelay = i * 70 + 'ms';
      svg.innerHTML = '<path class="blade" d="M12 1C4 9 3 20 12 31C21 20 20 9 12 1Z"/><path class="rib" d="M12 6V30"/>';
      box.append(svg);
    }
  });

  $$('[data-copy]').forEach((b) => {
    b.addEventListener('click', async () => {
      const text = b.parentElement.querySelector('code').textContent;
      try { await navigator.clipboard.writeText(text); b.textContent = 'Copied'; b.classList.add('ok'); }
      catch { b.textContent = 'Select it'; }
      setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('ok'); }, 1600);
    });
  });
})();
