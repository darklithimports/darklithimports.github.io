// Intro do logo (skill logo-intro, origem: site da Plano Alpha): a flor aparece grande no centro, encolhe e
// desliza para a esquerda enquanto "breu" sai de trás dela com a borda borrada; quando a página está pronta,
// o logo inteiro voa (FLIP) até a marca da nav e o breu da tela se dissolve na entrada do hero.
// Precisa do markup e do CSS crítico inline no <head> do index.html (o primeiro quadro já sai certo).
import { gsap } from 'gsap';

export async function initLogoIntro({ target, ready = [], font, maxWait = 4000, landColor, smooth, onReveal, speed = 1 }) {
  const root = document.documentElement;
  const loader = document.querySelector('[data-logo-intro]');
  const finish = () => {
    root.classList.add('logo-intro-done');
    loader?.remove();
  };
  // sem motion (reduced motion ou o failsafe disparou): direto para a página
  if (!loader || !root.classList.contains('logo-intro-on')) {
    finish();
    onReveal?.();
    return;
  }

  const logo = loader.querySelector('[data-logo-intro-logo]');
  const mark = loader.querySelector('[data-logo-intro-mark]');
  const word = loader.querySelector('[data-logo-intro-word]');
  const to = typeof target === 'string' ? document.querySelector(target) : target;
  const k = 1 / speed;

  // prende o scroll sem esconder a barra (esconder faz a página pular quando ela volta)
  smooth?.stop();
  window.scrollTo(0, 0);
  const pin = () => window.scrollY && window.scrollTo(0, 0);
  window.addEventListener('scroll', pin);

  const isReady = Promise.race([
    Promise.all([document.fonts.ready, ...ready].map((p) => Promise.resolve(p).catch(() => {}))),
    new Promise((r) => setTimeout(r, maxWait)),
  ]);

  // a largura do logo depende da fonte da palavra: espera ela um instante (a flor ainda está invisível)
  if (font) await Promise.race([document.fonts.load(font).catch(() => {}), new Promise((r) => setTimeout(r, 500))]);

  // a flor começa no centro da tela e maior; a palavra fica mascarada
  const W = logo.offsetWidth;
  gsap.set(mark, { x: W / 2 - mark.offsetWidth / 2, scale: 1.9, rotate: -30, transformOrigin: '50% 50%', opacity: 0 });
  gsap.set(word, { '--reveal': '-20%', filter: 'blur(6px)' });

  const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
  tl.to(mark, { opacity: 1, scale: 1.6, rotate: 0, duration: 0.5 * k, ease: 'power2.out' })
    .to(mark, { x: 0, scale: 1, duration: 0.85 * k }, `+=${0.05 * k}`)
    // a palavra só sai quando a flor já quase assentou (nunca aparece pelos vãos das pétalas)
    .fromTo(word, { x: -W * 0.06 }, { x: 0, '--reveal': '120%', filter: 'blur(0px)', duration: 0.8 * k, ease: 'power2.out' }, `-=${0.25 * k}`);

  Promise.all([isReady, tl.then()]).then(() => {
    const a = logo.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const bg = getComputedStyle(loader).backgroundColor.replace(/^rgba?\(([^,]+),([^,]+),([^,)]+).*$/, 'rgba($1,$2,$3,0)');
    const fly = gsap.timeline({
      delay: 0.1 * k,
      onComplete: () => {
        window.removeEventListener('scroll', pin);
        finish();
        smooth?.start();
      },
    });
    fly
      .add(() => onReveal?.(), 0.15 * k)
      .to(logo, { x: b.left - a.left, y: b.top - a.top, scale: b.width / a.width, duration: 1 * k, ease: 'expo.inOut' }, 0)
      .to(loader, { backgroundColor: bg, duration: 0.9 * k, ease: 'power2.inOut' }, 0.25 * k);
    if (landColor) fly.to(logo, { color: landColor, duration: 0.6 * k, ease: 'none' }, 0.45 * k);
  });
}
