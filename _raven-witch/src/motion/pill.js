// A assinatura do hero: "meia-noite" vira uma pill de vidro que condensa e acende.
// 1) um fio de luz contorna a pill, nascendo do meio de baixo e subindo pelos dois lados até se encontrar
//    em cima; 2) o vidro fosco condensa dentro do contorno; 3) a luz percorre a palavra da esquerda para a
//    direita, que sai do cinza para o branco; 4) a palavra floresce num brilho e um traço de luz se abre
//    embaixo da pill. Tudo por tempo, uma vez; depois só respira (um reflexo passa pelo vidro de vez em quando).
// O contorno é <path> com pathLength e o atributo stroke-dashoffset animado (o Safari não desenha
// dasharray em <text> e o GSAP arredonda a propriedade CSS).
import { gsap } from 'gsap';

export function pill({ reduced = false } = {}) {
  const el = document.querySelector('[data-pill]');
  const svg = el.querySelector('[data-pill-edge]');
  const [pl, pr] = svg.querySelectorAll('path');
  const glass = el.querySelector('.pill__glass');
  const txt = el.querySelector('.pill__txt');
  const glow = el.querySelector('.pill__glow');
  const line = el.querySelector('.pill__line');

  // contorno de retângulo arredondado em duas metades: do meio de baixo, pela esquerda / pela direita, até o meio de cima
  function shape() {
    const w = el.offsetWidth, h = el.offsetHeight;
    const r = Math.min(h * 0.36, w / 2), i = 0.75; // meia espessura do traço
    const x0 = i, y0 = i, x1 = w - i, y1 = h - i, cx = w / 2;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    pl.setAttribute('d', `M${cx},${y1} H${x0 + r} A${r},${r} 0 0 1 ${x0},${y1 - r} V${y0 + r} A${r},${r} 0 0 1 ${x0 + r},${y0} H${cx}`);
    pr.setAttribute('d', `M${cx},${y1} H${x1 - r} A${r},${r} 0 0 0 ${x1},${y1 - r} V${y0 + r} A${r},${r} 0 0 0 ${x1 - r},${y0} H${cx}`);
    [pl, pr].forEach((p) => { p.setAttribute('pathLength', '1000'); p.setAttribute('stroke-dasharray', '1000 1000'); });
  }
  shape();
  new ResizeObserver(shape).observe(el);

  function finalState() {
    gsap.set([pl, pr], { attr: { 'stroke-dashoffset': 0 } });
    gsap.set(glass, { opacity: 1, scale: 1 });
    gsap.set(txt, { '--sweep': '0%' });
    gsap.set(glow, { opacity: 1 });
    gsap.set(line, { scaleX: 1, opacity: 1 });
    el.classList.add('is-lit');
  }
  if (reduced) { finalState(); return { play: () => gsap.timeline() }; }

  gsap.set([pl, pr], { attr: { 'stroke-dashoffset': 1000 } });
  gsap.set(glass, { opacity: 0, scale: 0.94 });
  gsap.set(txt, { '--sweep': '100%' });
  gsap.set(glow, { opacity: 0 });
  gsap.set(line, { scaleX: 0, opacity: 0 });

  function play() {
    const tl = gsap.timeline();
    tl.to([pl, pr], { attr: { 'stroke-dashoffset': 0 }, duration: 1.15, ease: 'power3.inOut' }, 0)
      .to(glass, { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out' }, 0.35)
      .to(txt, { '--sweep': '0%', duration: 1.25, ease: 'power2.inOut' }, 0.55)
      .add(() => el.classList.add('is-lit'), 1.25)
      .to(glow, { opacity: 1, duration: 1.6, ease: 'power2.out' }, 1.15)
      .to(line, { scaleX: 1, opacity: 1, duration: 1.3, ease: 'expo.out' }, 1.3);
    return tl;
  }
  return { play };
}
