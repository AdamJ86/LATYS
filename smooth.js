// Smooth, inertial wheel scrolling (Lenis) on every page. Touch screens keep
// their native scrolling, and reduced motion turns this off entirely.
(function () {
  if (!window.Lenis || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lenis = new Lenis({ lerp: 0.09, autoRaf: !window.gsap });
  if (window.gsap) {
    // One clock for scrolling and the scroll-driven scenes, so they never drift apart.
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  window.lenis = lenis;

  // In-page links glide instead of jumping. A target can name its own scroll
  // position (data-scroll-to), which the pinned opening scene uses for the film.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.pathname !== location.pathname || a.hash.length < 2) return;
    const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    const bar = document.querySelector('.titlebar');
    const y = target.dataset.scrollTo
      ? Number(target.dataset.scrollTo)
      : target.getBoundingClientRect().top + window.scrollY - (bar ? bar.offsetHeight : 0) - 16;
    lenis.scrollTo(y, { duration: 1.4 });
    history.replaceState(null, '', a.hash);
  });
})();
