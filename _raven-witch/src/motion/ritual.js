// Raven Witch: o selo ritual (pentagrama invertido) que gira em volta da esfera do herói, os pentagramas que se
// desenham quando aparecem e o rastro de brasas carmesim/osso que segue o cursor.
export function ritual(world) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- pentagramas dos divisores: desenham o traço ao entrar na tela ----
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: 0.6 });
  document.querySelectorAll('[data-draw]').forEach((el) => io.observe(el));

  // ---- selo do herói ----
  const sig = document.querySelector('[data-sigil]');
  const hero = document.querySelector('.hero');
  let mx = 0, my = 0, ex = 0, ey = 0, spin = 0, lastS = scrollY, vel = 0;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  function place() {
    if (!sig || !world) return;
    const s = world.sphere();
    const size = s.r * (innerWidth < 760 ? 2.75 : 2.65);
    const ht = hero.getBoundingClientRect().top + scrollY;
    sig.style.width = size + 'px';
    sig.dataset.x = s.x - size / 2; sig.dataset.y = s.y - ht - size / 2;
  }
  place();
  addEventListener('resize', () => requestAnimationFrame(place));
  setTimeout(() => { place(); sig && sig.classList.add('on'); }, document.documentElement.classList.contains('is-loading') ? 1800 : 300);
  new MutationObserver(() => { if (!document.documentElement.classList.contains('is-loading')) { place(); sig && sig.classList.add('on'); } }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // ---- brasas do cursor ----
  const fx = document.querySelector('.cursor-fx canvas');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ctx = fx && fine && !reduced ? fx.getContext('2d') : null;
  const P = [];
  let lx = null, ly = null;
  function size() { if (!ctx) return; const d = Math.min(devicePixelRatio || 1, 2); fx.width = innerWidth * d; fx.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); }
  size(); addEventListener('resize', size);
  if (ctx) addEventListener('pointermove', (e) => {
    const x = e.clientX, y = e.clientY;
    if (lx !== null) {
      const dist = Math.hypot(x - lx, y - ly), n = Math.min(3, 1 + dist / 22);
      for (let i = 0; i < n; i++) {
        const t = i / n;
        const r = Math.random();
        P.push({ x: lx + (x - lx) * t + (Math.random() - 0.5) * 6, y: ly + (y - ly) * t + (Math.random() - 0.5) * 6, vx: (Math.random() - 0.5) * 0.6, vy: -0.4 - Math.random() * 1.1, life: 1, d: 0.012 + Math.random() * 0.02, s: Math.random() < 0.25 ? 4 : 2, c: r < 0.55 ? '200,50,79' : r < 0.85 ? '238,228,211' : '200,161,90' });
      }
      if (P.length > 140) P.splice(0, P.length - 140);
    }
    lx = x; ly = y;
  }, { passive: true });

  let fr = 0;
  function tick() {
    if (fr++ % 30 === 0) place();
    // selo: segue a esfera, puxa um pouco para o cursor e gira mais rápido quando a página rola
    if (sig && sig.dataset.x) {
      const s = scrollY; vel += ((s - lastS) - vel) * 0.1; lastS = s;
      spin += 0.02 + Math.abs(vel) * 0.04;
      ex += (mx - ex) * 0.06; ey += (my - ey) * 0.06;
      const k = Math.min(1, s / (innerHeight * 0.9));
      sig.style.transform = `translate3d(${+sig.dataset.x + ex * 34}px, ${+sig.dataset.y + ey * 24}px, 0) scale(${1 + k * 0.5})`;
      sig.style.setProperty('--spin', spin + 'deg');
      sig.style.opacity = sig.classList.contains('on') ? String(1 - k) : '';
    }
    if (ctx) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.x += p.vx; p.y += p.vy; p.vy *= 0.985; p.life -= p.d;
        if (p.life <= 0) { P.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(${p.c},${p.life})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 0.6, 0, Math.PI * 2); ctx.fill();
      }
    }
    requestAnimationFrame(tick);
  }
  if (!reduced) requestAnimationFrame(tick);
  else if (sig) { place(); sig.style.transform = `translate(${sig.dataset.x}px, ${sig.dataset.y}px)`; }
}
