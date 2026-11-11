// Entrada (por tempo): as estrelas acendem, a esfera nas mãos acende, as mãos se condensam a partir dela,
// a explosão corre pela diagonal e os pontos saem da esfera, arqueiam e pousam formando "Faça existir".
// Por fim as letras ficam sólidas de fora para dentro; as bordas de dentro continuam como pontos que
// respiram com o pulso da esfera.
import { gsap } from 'gsap';

export function intro({ world, reduced = false }) {
  const root = document.documentElement;
  const fade = ['.hero__foot > *'];
  // a marca da nav já está no lugar (o logo da intro pousa nela): só o resto da nav entra
  const navRest = ['.nav__in > :not(.nav__brand)', '.nav .sub'];
  root.classList.remove('is-loading');
  if (!world) return gsap.timeline();
  const st = world.st;
  const maos = world.objs.maos;
  const fim = () => { Object.assign(st, { stars: 1, reach: 1, tT: 99, solid: 1, glow: 1, fg: 1, open: 1 }); maos.form = 1; maos.revealed = true; world.startPulse(); };
  if (reduced) { fim(); return gsap.timeline(); }
  gsap.set(fade, { opacity: 0, y: 14 });
  gsap.set(navRest, { opacity: 0 });
  maos.revealed = true;
  const tl = gsap.timeline();
  tl.to(st, { stars: 1, duration: 1.6, ease: 'power1.out' }, 0)
    .to(st, { glow: 1, duration: 0.9, ease: 'expo.out' }, 0.15)
    .fromTo(st, { open: 0 }, { open: 1, duration: 2.6, ease: 'expo.out' }, 0.1)   // o portal se abre
    .to(maos, { form: 1, duration: 2.2, ease: 'power2.out' }, 0.3)
    .to(st, { reach: 1, duration: 2.6, ease: 'expo.out' }, 0.55)
    .add(() => world.startPulse(), 2.9)
    .fromTo(st, { tT: 0 }, { tT: 3.2, duration: 3.2, ease: 'none' }, 0.7)
    .to(st, { solid: 1, duration: 1.5, ease: 'power2.inOut' }, 2.7)
    .to(st, { fg: 1, duration: 1.2, ease: 'none' }, 1.6)
    .to(navRest, { opacity: 1, duration: 1.0, ease: 'power2.out' }, 2.3)
    .to(fade, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07 }, 2.4)
    .add(() => { st.tT = 99; });
  // rede lenta (o loader seguiu pelo limite): as mãos se condensam quando a imagem chegar, em vez de surgir prontas
  if (!maos.tex) maos.ready?.then(() => gsap.fromTo(maos, { form: 0 }, { form: 1, duration: 2.2, ease: 'power2.out', overwrite: 'auto' }));
  return tl;
}
