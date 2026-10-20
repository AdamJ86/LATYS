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

  // The first 20 licenses sell at $79 (Stripe caps that link at 20 payments),
  // then the price steps up to $109. The count comes from the Stripe-backed
  // worker (community/seats-worker). Founders: the $5/$10 run closed with 8.
  const SEATS_ENDPOINT = 'https://latys-seats.latys.workers.dev';
  const SEATS_TOTAL = 20;
  const NEXT_PRICE = 109;
  const NEXT_LINK = 'https://buy.stripe.com/4gMdR9enpaPHbAgdiIaIM03';
  const LEAF_COLORS = ['#e8b662', '#e2703a', '#d98aa8', '#b9c47c', '#9fb3d1', '#c4452c', '#e08f73', '#8b6dff', '#25c8a8', '#dfa843'];
  const LEAF_TILT = [-8, 5, -3, 7, -6, 4, -5, 8, -4, 6];
  let leavesPainted = false;
  function paintLeaves(total, taken, animate) {
    $$('[data-leaves]').forEach((box) => {
      box.setAttribute('role', 'img');
      box.setAttribute('aria-label', taken + ' of ' + total + ' licenses at $79 sold');
      while (box.children.length < total) {
        const i = box.children.length;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 32');
        svg.setAttribute('aria-hidden', 'true');
        svg.style.setProperty('--r', LEAF_TILT[i % LEAF_TILT.length] + 'deg');
        svg.style.setProperty('--c', LEAF_COLORS[i % LEAF_COLORS.length]);
        svg.innerHTML = '<path class="blade" d="M12 1C4 9 3 20 12 31C21 20 20 9 12 1Z"/><path class="rib" d="M12 6V30"/>';
        box.append(svg);
      }
      [...box.children].forEach((leaf, i) => {
        const on = i < taken;
        if (on && animate && !leaf.classList.contains('taken')) {
          leaf.classList.add('grow');
          leaf.style.animationDelay = i * 50 + 'ms';
        }
        leaf.classList.toggle('taken', on);
      });
    });
  }
  paintLeaves(SEATS_TOTAL, 0, false);
  // Leaves grow when the card comes into view, not while it is off screen.
  const leafIo = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); leafIo.unobserve(e.target); }
  }, { threshold: 0.4 });
  $$('[data-leaves]').forEach((box) => leafIo.observe(box));

  function paintSeats(d) {
    const total = (d && d.total) || SEATS_TOTAL;
    const left = Math.max(0, d && d.left != null ? d.left : total);
    const soldOut = !!(d && d.soldOut) || left === 0;
    $$('[data-seats-text]').forEach((el) => {
      el.textContent = soldOut ? 'All ' + total + ' licenses at $79 are sold' : left + ' of ' + total + ' left at $79';
    });
    paintLeaves(total, total - left, !leavesPainted);
    leavesPainted = true;
    $$('[data-step]').forEach((el) => el.classList.toggle('moved', soldOut));
    if (soldOut) {
      $$('[data-price]').forEach((el) => { el.textContent = '$' + NEXT_PRICE; });
      $$('[data-sold-text]').forEach((el) => { el.textContent = el.dataset.soldText; });
      $$('[data-buy]').forEach((el) => { el.href = NEXT_LINK; el.textContent = 'Buy LATYS, $' + NEXT_PRICE; });
    }
  }
  function refreshSeats() {
    fetch(SEATS_ENDPOINT, { cache: 'no-store' }).then((r) => r.json()).then(paintSeats).catch(() => {});
  }
  if (document.querySelector('[data-leaves]')) {
    refreshSeats();
    setInterval(() => { if (!document.hidden) refreshSeats(); }, 30000);
  }

  $$('[data-copy]').forEach((b) => {
    b.addEventListener('click', async () => {
      const text = b.parentElement.querySelector('code').textContent;
      try { await navigator.clipboard.writeText(text); b.textContent = 'Copied'; b.classList.add('ok'); }
      catch { b.textContent = 'Select it'; }
      setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('ok'); }, 1600);
    });
  });
})();
