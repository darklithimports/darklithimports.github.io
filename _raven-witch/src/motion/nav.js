// Nav: barra preta depois de 40 px; some ao descer (depois de meia tela) e volta ao subir (6 px de folga).
export function nav() {
  const el = document.querySelector('[data-nav]');
  let last = window.scrollY;
  let scrolled = null, hidden = null;
  return function update() {
    if (!el) return;
    const y = window.scrollY;
    const s = y > 40;
    if (s !== scrolled) { el.classList.toggle('is-scrolled', s); scrolled = s; }
    let h = hidden;
    if (y < window.innerHeight * 0.5) h = false;
    else if (y > last + 6) h = true;
    else if (y < last - 6) h = false;
    if (Math.abs(y - last) > 6 || y < window.innerHeight * 0.5) last = y;
    if (h !== hidden) { el.classList.toggle('is-hidden', h); hidden = h; }
  };
}
