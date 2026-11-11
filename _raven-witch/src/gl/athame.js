// Raven Witch: a mão feminina (unhas stiletto pretas, manga de renda) segurando um athame, em pixel art.
// Desenhada pequena (418 × 235), reduzida à paleta da marca (sem meio-tom borrado) e ampliada 4× sem suavizar:
// sai como a textura "maos" do mundo, por cima do portal (shaders.js · PORTAL_FS).
export const PORTAL = { u: 0.56, v: 0.42, r: 0.092 }; // centro e raio do portal (fração da largura da imagem)

const PAL = [
  [5, 3, 7], [20, 14, 26], [42, 31, 54], [74, 58, 92],          // tinta, renda, sombras
  [60, 30, 44], [120, 78, 88], [176, 128, 128], [222, 186, 172], [244, 224, 212], // pele
  [70, 66, 86], [124, 120, 146], [192, 190, 212], [246, 244, 255], // lâmina
  [86, 58, 26], [150, 112, 52], [214, 176, 98],                  // ouro velho
  [94, 15, 34], [158, 31, 58], [228, 72, 95],                    // carmesim
  [185, 169, 152],                                               // osso (faixas do cabo)
];

export function athameCanvas() {
  // o athame sozinho, flutuando no portal, em traço de quadrinho (tinta preta, luz chapada, sem pixel)
  const W = 418, H = 235, S = 4;
  const c = document.createElement('canvas'); c.width = W * S; c.height = H * S;
  const x = c.getContext('2d');
  x.scale(S, S);
  const C = { x: PORTAL.u * W, y: PORTAL.v * H };
  const TILT = -0.42, BL = 74;
  const G = { x: C.x + Math.sin(-TILT) * BL * 0.62, y: C.y + Math.cos(TILT) * BL * 0.62 }; // a lâmina atravessa o centro
  const INK = '#07040a';
  const pth = (pts, fill, lw = 1.3) => { x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); if (fill) { x.fillStyle = fill; x.fill(); } if (lw) { x.strokeStyle = INK; x.lineWidth = lw; x.lineJoin = 'round'; x.stroke(); } };
  const dot = (a, b, r, fill, lw = 1.1) => { x.beginPath(); x.arc(a, b, r, 0, Math.PI * 2); if (fill) { x.fillStyle = fill; x.fill(); } if (lw) { x.strokeStyle = INK; x.lineWidth = lw; x.stroke(); } };
  const rr = (x0, y0, w, h, r, fill, lw = 1.2) => { x.beginPath(); x.roundRect(x0, y0, w, h, r); x.fillStyle = fill; x.fill(); if (lw) { x.strokeStyle = INK; x.lineWidth = lw; x.stroke(); } };
  x.save(); x.translate(G.x, G.y); x.rotate(TILT);
  const wAt = (t) => 7.2 * Math.pow(t, 0.58) * (1 - 0.14 * Math.sin(t * Math.PI));
  const edge = (sg, off = 0) => { const o = []; for (let i = 0; i <= 30; i++) { const t = i / 30; o.push([sg * (wAt(t) - off), -BL * (1 - t)]); } return o; };
  // lâmina: lado escuro, lado claro, fio central, brilho
  pth([...edge(-1), ...edge(1).reverse()], '#6f6a8c', 1.5);
  pth([...edge(-1, 0.2), [0, 0], [0, -BL]], '#d9d4ef', 0);
  x.strokeStyle = '#ffffff'; x.lineWidth = 0.9; x.beginPath(); x.moveTo(-0.6, -BL + 6); x.lineTo(-0.6, -5); x.stroke();
  x.strokeStyle = INK; x.lineWidth = 0.6; x.beginPath(); x.moveTo(0.2, -BL + 3); x.lineTo(0.2, -2); x.stroke();
  // runas gravadas
  x.fillStyle = '#a7307a';
  for (let i = 0; i < 5; i++) { const yy = -12 - i * 11; x.fillRect(2.2, yy, 1.4, 3); x.fillRect(1.6, yy + 1, 2.6, 0.8); }
  // guarda em arco, com pontas
  pth([[-23, -1], [-19, -6], [-8, -4.5], [0, -6.5], [8, -4.5], [19, -6], [23, -1], [19, 2.5], [8, 0.8], [0, 2.4], [-8, 0.8], [-19, 2.5]], '#b59446', 1.5);
  pth([[-19, -4.2], [-8, -3], [0, -4.8], [8, -3], [19, -4.2], [8, -1.6], [0, -2.6], [-8, -1.6]], '#ecd58e', 0);
  dot(-23, -1, 2.1, '#ecd58e'); dot(23, -1, 2.1, '#ecd58e');
  dot(0, -1.6, 3.8, '#7b1d5e'); dot(-1, -2.8, 1.3, '#f08ac0', 0);
  // cabo preto com faixas e pomo
  rr(-4.6, 2.4, 9.2, 34, 2.2, '#16101c', 1.4);
  x.strokeStyle = '#8b78ad'; x.lineWidth = 0.9;
  for (let yy = 6; yy < 35; yy += 4.5) { x.beginPath(); x.moveTo(-4.2, yy); x.lineTo(4.2, yy + 2.4); x.stroke(); }
  x.strokeStyle = '#3a2d4c'; x.lineWidth = 1; x.beginPath(); x.moveTo(-2.6, 4); x.lineTo(-2.6, 34); x.stroke();
  pth([[-6, 36], [6, 36], [4, 39.5], [-4, 39.5]], '#b59446', 1.2);
  dot(0, 44, 5.2, '#b59446', 1.4); dot(-1.2, 42.6, 2.4, '#ecd58e', 0); dot(0.4, 44.4, 1.9, '#7b1d5e', 0.8);
  x.restore();
  return c;
}
