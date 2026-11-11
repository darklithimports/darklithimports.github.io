// Lenis no ticker do GSAP: a única suavização do scroll (o mundo lê window.scrollY a cada quadro).
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function smoothScroll() {
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, touchMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.addEventListener('refresh', () => lenis.resize());
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = id === '#topo' ? 0 : document.querySelector(id);
      if (el == null) return;
      e.preventDefault();
      lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    });
  });
  return lenis;
}
