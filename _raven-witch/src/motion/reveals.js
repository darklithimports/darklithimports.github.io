// Textos entram por tempo quando chegam na tela (nunca scrub em texto).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function splitLines(el) {
  const parts = el.innerHTML.split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
  el.innerHTML = parts.map((p) => `<span class="line-mask"><span>${p}</span></span>`).join('');
  return el.querySelectorAll('.line-mask > span');
}

export function reveals({ reduced = false } = {}) {
  document.querySelectorAll('[data-lines]').forEach((el) => {
    const lines = splitLines(el);
    if (reduced) return;
    gsap.set(lines, { yPercent: 115 });
    ScrollTrigger.create({
      trigger: el, start: 'top 86%', once: true,
      onEnter: () => gsap.to(lines, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.085 }),
    });
  });
  if (reduced) return;
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.set(el, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: Number(el.dataset.delay) || 0 }),
    });
  });
}
