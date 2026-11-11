import './styles/tokens.css';
import './styles/base.css';
import './styles/buttons.css';
import './sections/nav.css';
import './sections/hero.css';
import './sections/como.css';
import './sections/estudio.css';
import './sections/trabalhos.css';
import './sections/numeros.css';
import './sections/planos.css';
import './sections/final.css';
import './sections/catalogo.css';
import './styles/pixel.css';
import './styles/elegante.css';
import './styles/mobile.css';
import './sections/breu.css';
import { ritual } from './motion/ritual.js';
import { oraculo } from './motion/oraculo.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createWorld } from './gl/world.js';
import { smoothScroll } from './motion/smooth.js';
import { intro } from './motion/intro.js';
import { carga } from './motion/carga.js';
import { initLogoIntro } from './motion/logo-intro.js';
import { pill } from './motion/pill.js';
import { agua } from './motion/agua.js';
import IMG from './gl/imagens.json';
import { reveals } from './motion/reveals.js';
import { prompt } from './motion/prompt.js';
import { nav } from './motion/nav.js';
import { fitFootWord } from './motion/footword.js';
import { site } from './motion/site.js';

gsap.registerPlugin(ScrollTrigger);
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const hd = new URLSearchParams(location.search).has('hd');

// a carga começa antes de tudo: fontes e as mãos do hero; no ?hd, todas as imagens da peça
const FONTES = ['fonts/cormorant-600.woff2', 'fonts/pinyon-400.woff2', 'fonts/cormorant-700.woff2', 'fonts/cormorant-400.woff2', 'fonts/cormorant-500.woff2', 'fonts/cormorant-400-italic.woff2']; // a do contador primeiro
const IMAGENS = Object.keys(IMG).map((k) => `img/${k}.webp`);
const c = carga([...FONTES, ...(hd ? IMAGENS : ['img/maos.webp', 'img/fechamento.webp'])]);

let world = null;
try { world = createWorld({ reduced, src: c.url }); } catch (e) { console.error(e); }
gsap.ticker.add(() => world?.frame());
// com as fontes aplicadas, o título e o wordmark são rasterizados de novo, ainda durante o loader (não no quadro da passagem)
c.ready.then(() => { fitFootWord(); world?.measure(true); });

// intro do logo (Breu): o pentagrama e "raven witch" seguram a tela até as fontes e as mãos do hero estarem
// prontas (no máximo 9 s), e o logo voa até a nav enquanto a entrada do hero começa
const pronto = Promise.all([c.ready, world?.load(world.objs.maos)]);
window.__logoIntroBooted = true;
await Promise.race([c.file('fonts/pinyon-400.woff2'), new Promise((r) => setTimeout(r, 800))]);
await new Promise((resolve) => initLogoIntro({ target: '.nav__brand', ready: [pronto], maxWait: 9000, onReveal: resolve }));

window.addEventListener('resize', fitFootWord);
reveals({ reduced });
// a pill de "ritual" acende quando o título final termina de subir
const ritualPill = pill({ reduced });
if (!reduced) ScrollTrigger.create({ trigger: '.final__title', start: 'top 80%', once: true, onEnter: () => gsap.delayedCall(0.75, ritualPill.play) });
agua({ reduced });
prompt({ world, reduced });
const lenis = reduced ? null : smoothScroll();
const navUpdate = nav();
world?.measure(); // os textos foram divididos em linhas: refaz as áreas que o fluxo evita
gsap.ticker.add(navUpdate);
intro({ world, reduced });
ScrollTrigger.refresh();
site();
window.__sinal = { world, lenis };
ritual(world);
oraculo(world);
