// O nome no rodapé (adaptado do rodapé da Breu, ProfitizeBuild): "Raven Witch" em caligrafia, medido para a
// tinta encher a largura menos uma margem mínima, no escuro sobre a água parada. Quando entra, por tempo:
// uma gota de luz cai até a água, a água abre um anel e a luz se espalha pelas letras a partir de onde a
// gota caiu (gradiente radial que cresce), com brilho e o reflexo invertido embaixo. Antes, o nome mal aparece.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const FONT = '"Pinyon Script"';
const DROP_AT = 0.5; // onde a gota cai, em fração da largura

export function agua({ reduced = false } = {}) {
  const el = document.querySelector('[data-agua]');
  if (!el) return null;
  const foot = el.closest('.foot');
  const svgs = [...el.querySelectorAll('svg')];
  const texts = svgs.map((s) => s.querySelector('text'));
  const grad = el.querySelector('#rw-luz');
  const gota = el.querySelector('.agua__gota'), anel = el.querySelector('.agua__anel'), linha = el.querySelector('.agua__linha');
  const brilho = el.querySelector('.agua__brilho');
  const word = texts[0].textContent;
  const st = { W: 0, lit: 0 };

  function setLit(v) {
    st.lit = v;
    grad.setAttribute('r', (v * st.W * 0.95 + 0.01).toFixed(1));
  }

  function measure() {
    const vw = document.documentElement.clientWidth;
    const m = parseFloat(getComputedStyle(foot).getPropertyValue('--m')) || Math.max(10, vw * 0.016);
    const W = vw - 2 * m;
    const c = document.createElement('canvas').getContext('2d');
    c.font = `400 1000px ${FONT}`;
    const t = c.measureText(word);
    // a caligrafia tem floreios que saem da caixa: mede a tinta, não o avanço
    const inkL = t.actualBoundingBoxLeft, ink = inkL + t.actualBoundingBoxRight;
    const s = W / ink;
    const asc = t.actualBoundingBoxAscent * s, desc = Math.max(0, t.actualBoundingBoxDescent) * s;
    const H = asc + desc;
    for (const [i, svg] of svgs.entries()) {
      svg.setAttribute('viewBox', `0 0 ${W.toFixed(2)} ${H.toFixed(2)}`);
      svg.setAttribute('width', W.toFixed(2));
      svg.setAttribute('height', H.toFixed(2));
      texts[i].setAttribute('x', (inkL * s).toFixed(2));
      texts[i].setAttribute('y', asc.toFixed(2));
      texts[i].setAttribute('font-size', (1000 * s).toFixed(2));
    }
    const fx = m + W * DROP_AT;
    st.W = W;
    el.style.setProperty('--asc', H + 'px');
    el.style.setProperty('--agua-h', H * (vw < 760 ? 1.55 : 1.3) + 'px');
    el.style.setProperty('--fx', fx + 'px');
    grad.setAttribute('cx', (fx - m).toFixed(1));
    grad.setAttribute('cy', H.toFixed(1));
    setLit(st.lit);
  }

  measure();
  document.fonts.ready.then(measure);
  window.addEventListener('resize', measure);

  if (reduced) {
    setLit(1);
    gsap.set(brilho, { opacity: 0.45 });
    gsap.set(linha, { opacity: 1 });
    return { measure };
  }
  const o = { v: 0 };
  ScrollTrigger.create({
    trigger: el, start: 'top bottom-=24', once: true,
    onEnter: () => {
      measure();
      gsap.timeline()
        .fromTo(gota, { scaleY: 0, opacity: 1 }, { scaleY: 1, duration: 0.85, ease: 'power2.in' }, 0)
        .to(gota, { opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.9)
        .fromTo(anel, { scale: 0.2, opacity: 1 }, { scale: 14, opacity: 0, duration: 2.2, ease: 'expo.out' }, 0.82)
        .fromTo(linha, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.82)
        .to(o, { v: 1, duration: 2.8, ease: 'power2.out', onUpdate: () => setLit(o.v) }, 0.84)
        .to(brilho, { opacity: 0.45, duration: 2.2, ease: 'power2.out' }, 1.2);
    },
  });
  return { measure };
}
