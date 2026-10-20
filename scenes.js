// Scroll-driven scenes for the overview page (GSAP + ScrollTrigger).
// Everything animates transform and opacity only, so it stays on the GPU.
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if (window.lenis) window.lenis.on('scroll', ScrollTrigger.update);
  const root = document.documentElement;
  const mm = gsap.matchMedia();

  // Opening scene, wide screens: the page holds still while the tree dissolves
  // and the film grows out of it.
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    root.classList.add('cine');
    const scene = document.getElementById('scene');
    const reel = document.getElementById('film');
    const frame = reel.querySelector('.frame');
    const tree = scene.querySelector('.stage video');
    const bar = () => document.querySelector('.titlebar').offsetHeight;

    // A video layer is expensive to scale and fade, even paused. While the scene
    // moves, the tree is swapped for a canvas holding its current frame.
    const still = document.createElement('canvas');
    still.setAttribute('aria-hidden', 'true');
    still.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;visibility:hidden';
    tree.after(still);
    let frozen = false;
    const freeze = () => {
      if (frozen) return;
      frozen = true;
      tree.pause();
      if (tree.readyState >= 2) {
        still.width = tree.videoWidth;
        still.height = tree.videoHeight;
        still.getContext('2d').drawImage(tree, 0, 0);
        still.style.visibility = 'visible';
        tree.style.visibility = 'hidden';
      }
    };
    const thaw = () => {
      if (!frozen) return;
      frozen = false;
      tree.style.visibility = '';
      still.style.visibility = 'hidden';
      tree.play().catch(() => {});
    };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: scene,
        start: () => 'top ' + bar() + 'px',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: (st) => { reel.dataset.scrollTo = Math.round(st.end); },
        onUpdate: (st) => { if (st.progress > 0.005) freeze(); else thaw(); }
      }
    });
    tl.to('.caption', { autoAlpha: 0, y: -48, duration: 0.28 }, 0)
      .to('.callouts', { autoAlpha: 0, duration: 0.18 }, 0)
      .to('.zoom', { scale: 1.45, yPercent: -4, duration: 0.75, ease: 'power1.in' }, 0)
      .to('.zoom', { autoAlpha: 0, duration: 0.3 }, 0.42)
      .fromTo(frame, { scale: 0.38, autoAlpha: 0, y: 80 }, { scale: 1, autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.3)
      .fromTo('.reel-note', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.8)
      .to({}, { duration: 0.1 }); // hold the finished frame a beat before the page moves on

    return () => {
      thaw();
      still.remove();
      root.classList.remove('cine');
      delete reel.dataset.scrollTo;
    };
  });

  // The statement lights up word by word as it is read.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const say = document.querySelector('[data-say]');
    if (!say) return;
    const text = say.textContent;
    say.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'sr';
    sr.textContent = text;
    say.append(sr);
    const words = text.split(' ').map((word) => {
      const w = document.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      w.textContent = word;
      say.append(w, ' ');
      return w;
    });
    gsap.set(words, { opacity: 0.16 });
    gsap.to(words, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: say, start: 'top 82%', end: 'bottom 42%', scrub: true }
    });
    return () => { say.textContent = text; };
  });

  // Web fonts change line heights; measure again once they are in.
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
