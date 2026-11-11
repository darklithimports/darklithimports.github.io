// Raven Witch · o herói: a ilustração da bruxinha (arte da Luján) em tela cheia, viva.
// - respira e balança a cabeça de leve (um recorte da cabeça e do tronco, com borda esfumada, desliza por cima)
// - embaralha: as cartas de cima do maço sobem e voltam, uma de cada vez
// - de vez em quando levanta os olhos (e segue o cursor); pisca
// - toque: uma carta sai voando para a esquerda ou para a direita; o gatinho preto pula, pega no ar, cai na mesa,
//   leva a carta de volta para a mão dela e volta para o lugarzinho dele.
// Coordenadas no espaço da imagem original (1254 × 1254).
const ease = (u) => u * u * (3 - 2 * u);
const lerp = (a, b, u) => a + (b - a) * u;
const arcP = (p0, p1, h, u) => [lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u) - Math.sin(Math.PI * u) * h];

export function heroCanvas(img, { size = 1040 } = {}) {
  const S = size, K = S / 1254;
  const c = document.createElement('canvas'); c.width = S; c.height = S;
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';

  // recorte móvel (cabeça + ombros) com borda esfumada
  const HR = [440, 210, 560, 560]; // x, y, w, h
  const head = document.createElement('canvas'); head.width = Math.round(HR[2] * K); head.height = Math.round(HR[3] * K);
  {
    const g = head.getContext('2d');
    g.drawImage(img, HR[0], HR[1], HR[2], HR[3], 0, 0, head.width, head.height);
    g.globalCompositeOperation = 'destination-in';
    const rg = g.createRadialGradient(head.width * 0.5, head.height * 0.46, head.width * 0.2, head.width * 0.5, head.height * 0.5, head.width * 0.5);
    rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(0.72, 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg; g.fillRect(0, 0, head.width, head.height);
  }

  // cartas em pixel art (verso com estrela, frente com lua)
  const pix = (w, h, fn) => { const q = document.createElement('canvas'); q.width = w; q.height = h; fn(q.getContext('2d'), w, h); return q; };
  const px = (g, col, x0, y0, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(x0, y0, w, h); };
  const backC = pix(20, 26, (g, w, h) => {
    px(g, '#0b0812', 0, 0, w, h); px(g, '#d9cff2', 1, 1, w - 2, h - 2); px(g, '#2a1f45', 2, 2, w - 4, h - 4);
    px(g, '#8a76c0', 3, 3, w - 6, 1); px(g, '#8a76c0', 3, h - 4, w - 6, 1); px(g, '#8a76c0', 3, 3, 1, h - 6); px(g, '#8a76c0', w - 4, 3, 1, h - 6);
    for (let i = 0; i < 5; i++) { px(g, '#cbbde8', 10 - i, 8 + i); px(g, '#cbbde8', 9 + i, 8 + i); px(g, '#cbbde8', 10 - i, 17 - i); px(g, '#cbbde8', 9 + i, 17 - i); }
    px(g, '#f3eefc', 9, 12, 2, 2);
  });
  const frontC = pix(20, 26, (g, w, h) => {
    px(g, '#0b0812', 0, 0, w, h); px(g, '#f3eefc', 1, 1, w - 2, h - 2); px(g, '#4e3c78', 2, 2, w - 4, h - 4); px(g, '#cbbde8', 3, 3, w - 6, h - 6);
    for (const [mx, my, mw] of [[8, 6, 4], [7, 7, 3], [6, 8, 3], [6, 9, 2], [6, 10, 2], [6, 11, 2], [6, 12, 3], [7, 13, 3], [8, 14, 4]]) px(g, '#2a1f45', mx, my, mw);
    px(g, '#ffffff', 13, 8); px(g, '#ffffff', 12, 9, 3); px(g, '#ffffff', 13, 10);
    px(g, '#2a1f45', 4, 19, w - 8, 3); px(g, '#cbbde8', 6, 20, w - 12, 1);
  });
  function card(cx, cy, ang, flip, sc = 1) {
    const w = 104 * sc, h = 136 * sc;
    x.save(); x.translate(cx * K, cy * K); x.rotate(ang);
    x.scale(Math.max(Math.abs(Math.cos(flip * Math.PI)), 0.03) * K, K);
    x.imageSmoothingEnabled = false;
    x.drawImage(flip < 0.5 ? backC : frontC, -w / 2, -h / 2, w, h);
    x.restore(); x.imageSmoothingEnabled = true;
  }
  function glow(gx, gy, r, rgb, al) {
    const g = x.createRadialGradient(gx * K, gy * K, 0, gx * K, gy * K, r * K);
    g.addColorStop(0, `rgba(${rgb},${al})`); g.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = g; x.fillRect((gx - r) * K, (gy - r) * K, 2 * r * K, 2 * r * K);
  }
  // blocos de pixel no grid da arte (≈5 px da imagem)
  const B = 5;
  const blk = (bx, by, bw, bh, col) => { x.fillStyle = col; x.fillRect(Math.round(bx / B) * B * K, Math.round(by / B) * B * K, Math.max(1, Math.round(bw / B)) * B * K, Math.max(1, Math.round(bh / B)) * B * K); };

  // olhos abertos (pixel art) por cima dos cílios baixos; gx/gy: para onde ela olha (-1..1)
  const SKIN = '#efe6f4', SKIN2 = '#d9cde6';
  // elipse em linhas de pixel (contorno "em degrau" da pixel art)
  const ell = (cx, cy, rx, ry, col) => { for (let yy = -ry; yy < ry; yy += B) { const k = 1 - ((yy + B / 2) / ry) ** 2; if (k <= 0) continue; const hw = rx * Math.sqrt(k); blk(cx - hw, cy + yy, hw * 2, B, col); } };
  function eyesOpen(ox, oy, gx, gy, lid) {
    for (const [ex, ey, w, sg] of [[662, 550, 70, -1], [768, 548, 60, 1]]) {
      const cx = ex + ox, cy = ey + oy, rx = w / 2;
      // pele por cima dos cílios baixos
      ell(cx, cy - 2, rx + 8, 26, SKIN);
      blk(cx - rx, cy + 16, w, 5, SKIN2);
      const ry = Math.max(4, 17 * (1 - lid));
      if (ry > 6) {
        ell(cx, cy, rx - 2, ry, '#fbf8ff');
        // íris grande e escura (estilo da arte), com brilhos
        const ix = cx + gx * rx * 0.35, iy = cy + gy * 3 + 2;
        ell(ix, iy, 15, Math.min(18, ry + 2), '#3e2766');
        ell(ix, iy + 2, 10, Math.min(13, ry - 1), '#160c26');
        blk(ix - 11, iy - 11, 7, 7, '#ffffff');
        blk(ix + 5, iy + 4, 4, 4, '#cdb8f2');
        // pálpebra de baixo
        blk(cx - rx + 8, cy + ry - 1, w - 16, 3, '#b8a6cf');
      }
      // pálpebra de cima: linha grossa curva + cílio de canto
      for (let xx = -rx - 4; xx < rx + 4; xx += B) { const k = 1 - (xx / (rx + 6)) ** 2; blk(cx + xx, cy - ry * Math.sqrt(Math.max(0, k)) - 6, B, 8, '#0b0810'); }
      blk(cx + sg * (rx + 2), cy - 6, 10, 5, '#0b0810');
      blk(cx + sg * (rx + 8), cy - 10, 6, 4, '#0b0810');
    }
  }

  // ---- gatinho preto ----
  function kitten(kx, ky, stretch, dir, t, carry) {
    const Z = 2.5;
    x.save(); x.translate(kx * K, ky * K); x.scale(dir * K * Z, K * Z);
    x.lineCap = 'round'; x.lineJoin = 'round';
    const sw = Math.sin(t * 3.4) * 0.35;
    x.strokeStyle = '#c2acf0'; x.lineWidth = 6.8; x.beginPath(); x.moveTo(-9 - stretch * 4, 2); x.quadraticCurveTo(-22 - stretch * 6, -2 + sw * 10, -18 - stretch * 10, -16 + sw * 14 + stretch * 10); x.stroke();
    x.strokeStyle = '#0b0810'; x.lineWidth = 4; x.stroke();
    const blob = (cx, cy, rx, ry) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); x.fillStyle = '#0b0810'; x.fill(); x.strokeStyle = '#c2acf0'; x.lineWidth = 1.6; x.stroke(); };
    blob(0, 0, 11 + stretch * 6, 8 - stretch * 2);
    if (stretch > 0.4) { blob(14 + stretch * 4, 4, 5, 2.4); blob(-12 - stretch * 4, 4, 5, 2.4); } else { blob(6, 7, 3, 2.4); blob(-5, 7, 3, 2.4); }
    const hx = 11 + stretch * 8, hy = -7 + stretch * 3;
    for (const sg of [-1, 1]) { x.beginPath(); x.moveTo(hx + sg * 7, hy - 3); x.lineTo(hx + sg * 6, hy - 13); x.lineTo(hx + sg * 1, hy - 6); x.closePath(); x.fillStyle = '#0b0810'; x.fill(); x.strokeStyle = '#c2acf0'; x.lineWidth = 1.4; x.stroke(); }
    blob(hx, hy, 8, 7);
    const bl = (t % 3.7) > 3.58;
    for (const ex of [hx - 3, hx + 3.4]) { x.fillStyle = '#efd94e'; if (bl) x.fillRect(ex - 1.8, hy - 1.4, 3.6, 0.9); else { x.beginPath(); x.ellipse(ex, hy - 1, 2, 2.4, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#050307'; x.fillRect(ex - 0.4, hy - 2.8, 0.9, 3.6); } }
    x.fillStyle = '#d86aa8'; x.fillRect(hx - 1, hy + 2, 2, 1.2);
    x.restore();
    if (carry) card(kx + dir * (hx + 8) * Z, ky + (hy + 7) * Z, 0.35 * dir, 1, 0.8);
  }

  // ---- posições (escolhidas para ficarem visíveis no computador e no celular) ----
  const DECK = [828, 752, 190, 214];        // maço + mão direita (redesenhados por cima da carta que sai)
  const TOP = [930, 790];
  const LH = [418, 868, 120, 170];            // a outra mão (sobre a mesa)                   // topo do maço
  const NEST = [985, 1005];                 // lugarzinho do gatinho, na mesa, ao lado da bola
  const SIDES = { l: { catch: [500, 420], land: [560, 1010] }, r: { catch: [1040, 380], land: [1030, 1010] } };
  const st = { t0: null, req: false, running: false, side: 'r', gx: 0, gy: 0, lookT: -9 };

  function draw(t) {
    x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    x.drawImage(img, 0, 0, S, S);
    // respiração e balanço da cabeça
    const ox = Math.sin(t * 0.7) * 3 + st.gx * 3, oy = Math.sin(t * 1.5) * 2 - 1;
    x.drawImage(head, (HR[0] + ox) * K, (HR[1] + oy) * K);
    // olhar: levanta os olhos a cada ~7 s (ou quando o cursor chega perto / no toque)
    // piscar: a cada ~4 s os cílios da arte descem e se fecham por um instante (o próprio desenho, comprimido)
    if ((t % 4.3) > 4.14) {
      const E0 = [632, 536, 166, 46], yb = E0[1] + E0[3];
      // pele tirada da própria arte (a faixa logo abaixo dos olhos), esticada por cima da pálpebra
      x.drawImage(img, E0[0], 588, E0[2], 6, (E0[0] + ox) * K, (E0[1] + oy) * K, E0[2] * K, 24 * K);
      x.drawImage(img, E0[0], E0[1], E0[2], E0[3], (E0[0] + ox) * K, (yb - E0[3] * 0.5 + oy) * K, E0[2] * K, E0[3] * 0.5 * K);
    }
    // toque: carta voa para o lado escolhido, gatinho busca
    if (st.req) { st.t0 = t; st.req = false; st.side = Math.random() < 0.5 ? 'l' : 'r'; }
    const u = st.t0 === null ? 99 : t - st.t0;
    st.running = u < 4.8;
    const sd = SIDES[st.side], dirTo = st.side === 'l' ? -1 : 1;
    // embaralhar (as cartas de cima sobem e voltam), menos enquanto a carta está voando
    if (!st.running || u > 3.6) {
      const ph = (t * 1.3) % 1, k = ease(Math.sin(Math.PI * Math.min(1, ph / 0.8)));
      const alt = Math.floor(t * 1.3) % 2;
      card(TOP[0] + (alt ? 14 : -6) * k, TOP[1] - 64 * k, 0.42 + (alt ? 0.12 : -0.08) * k, 0);
      x.drawImage(img, DECK[0], DECK[1], DECK[2], DECK[3], DECK[0] * K, DECK[1] * K, DECK[2] * K, DECK[3] * K);
    }
    let kp = { p: NEST, s: 0, d: -1, carry: false };
    if (u < 4.8) {
      if (u < 0.8) { const a = ease(u / 0.8); const [cx, cy] = arcP(TOP, sd.catch, 160, a); card(cx, cy, dirTo * a * 6.5, a > 0.35 ? 1 : 0, 0.9 - a * 0.3); }
      if (u >= 0.35 && u < 0.85) { const a = ease((u - 0.35) / 0.5); kp = { p: arcP(NEST, [sd.catch[0] - dirTo * 30, sd.catch[1] + 20], 220, a), s: 1, d: dirTo }; }
      else if (u >= 0.85 && u < 1.75) { const a = Math.min(1, (u - 0.85) / 0.9); kp = { p: arcP([sd.catch[0] - dirTo * 30, sd.catch[1] + 20], sd.land, 40, a * a), s: 1 - a * 0.6, d: -dirTo, carry: true }; }
      else if (u >= 1.75 && u < 2.6) { const a = (u - 1.75) / 0.85; kp = { p: [lerp(sd.land[0], TOP[0] + (dirTo > 0 ? 60 : -80), a), sd.land[1] - Math.abs(Math.sin(a * Math.PI * 3)) * 14], s: 0.3, d: -dirTo, carry: true }; }
      else if (u >= 2.6 && u < 3.3) { const a = ease((u - 2.6) / 0.7); kp = { p: arcP([TOP[0] + (dirTo > 0 ? 60 : -80), sd.land[1]], [TOP[0] + 10, TOP[1] + 40], 110, a), s: 0.8, d: dirTo > 0 ? -1 : 1, carry: a < 0.97 }; }
      else { const a = ease(Math.min(1, (u - 3.3) / 1.4)); kp = { p: arcP([TOP[0] + 10, TOP[1] + 40], NEST, 160, a), s: a < 0.95 ? 0.9 : 0, d: 1 }; }
    }
    // luz: velas, bola de cristal, cartas da mesa
    x.globalCompositeOperation = 'lighter';
    const fl = 0.75 + 0.25 * Math.sin(t * 13.1) * Math.sin(t * 7.7 + 1.3);
    glow(148, 630, 130, '255,200,170', 0.3 * fl);
    glow(388, 300, 60, '255,200,170', 0.22 * (1.6 - fl));
    glow(1065, 990, 160, '160,130,255', 0.16 + 0.1 * Math.sin(t * 1.7));
    const tab = [[430, 1110], [575, 1115], [740, 1118], [890, 1120]];
    const ti = Math.floor(t / 1.4) % 4, tu = (t / 1.4) % 1;
    glow(tab[ti][0], tab[ti][1], 95, '150,120,240', 0.26 * Math.sin(tu * Math.PI));
    x.globalCompositeOperation = 'source-over';
    kitten(kp.p[0], kp.p[1], kp.s, kp.d, t, kp.carry);
    // o gato grande pisca
    if (t % 5.3 > 5.12) { x.fillStyle = '#0b0812'; x.fillRect(228 * K, 945 * K, 26 * K, 20 * K); x.fillRect(281 * K, 945 * K, 26 * K, 20 * K); }
  }
  return {
    canvas: c, draw,
    hit: { x0: 0.18, y0: 0.15, x1: 0.92, y1: 0.95 },
    toss() { if (!st.running) { st.req = true; st.lookT = -9; } },
    gaze(gx, gy, near) { st.gx += (Math.max(-1, Math.min(1, gx)) - st.gx) * 0.15; st.gy += (Math.max(-1, Math.min(1, gy)) - st.gy) * 0.15; st.near = !!near; },
  };
}
