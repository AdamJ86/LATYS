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

  // Founder seats come from the Stripe-backed worker (community/SEATS-COUNTER-SETUP.md).
  const SEATS_ENDPOINT = 'https://latys-seats.latys.workers.dev';
  const SEATS_TOTAL = 10;
  function paintSeats(d) {
    const total = (d && d.total) || SEATS_TOTAL;
    const left = Math.max(0, d && d.left != null ? d.left : total);
    const soldOut = !!(d && d.soldOut) || left === 0;
    $$('[data-seats-text]').forEach((el) => {
      el.textContent = soldOut ? 'Founder run sold out' : left + ' of ' + total + ' founder seats left';
    });
    $$('[data-seats-fill]').forEach((el) => { el.style.width = Math.round(((total - left) / total) * 100) + '%'; });
    $$('[data-seats]').forEach((el) => el.classList.toggle('sold', soldOut));
    document.dispatchEvent(new CustomEvent('latys:seats', { detail: { total, left, soldOut } }));
  }
  function refreshSeats() {
    fetch(SEATS_ENDPOINT, { cache: 'no-store' }).then((r) => r.json()).then(paintSeats).catch(() => {});
  }
  if (document.querySelector('[data-seats]')) {
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
