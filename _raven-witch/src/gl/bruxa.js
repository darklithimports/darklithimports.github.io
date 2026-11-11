// Raven Witch · o herói: a bruxinha de capuz preto, franja e cabelo pretos, sentada numa poltrona vitoriana roxa,
// abrindo o livro "WITCHCRAFT". Traço de quadrinho (tinta preta, cor chapada) desenhado em canvas e animado.
// Ao tocar perto dela, o livro sai voando; o gatinho preto pula do braço da poltrona, pega o livro no ar, cai,
// traz o livro de volta, entrega à bruxinha e volta para o lugar dele.
export const BRUXA_AR = 1; // quadrada

const INK = '#07040a';
const ease = (u) => u * u * (3 - 2 * u);
const clamp01 = (u) => Math.max(0, Math.min(1, u));
const lerp = (a, b, u) => a + (b - a) * u;
// arco entre dois pontos com altura h (para cima)
const arc = (p0, p1, h, u) => ({ x: lerp(p0.x, p1.x, u), y: lerp(p0.y, p1.y, u) - Math.sin(Math.PI * u) * h });

export function bruxaCanvas() {
  const L = 360, WK = 240, UP = 3;                        // desenho em 360 → quadro de 240 px → ampliado 3×
  const wk = document.createElement('canvas'); wk.width = WK; wk.height = WK;
  const x = wk.getContext('2d', { willReadFrequently: true });
  const c = document.createElement('canvas'); c.width = WK * UP; c.height = WK * UP;
  const out = c.getContext('2d'); out.imageSmoothingEnabled = false;
  const S = WK / L;
  const PAL = [[7, 4, 10], [13, 10, 18], [22, 15, 32], [34, 24, 54], [52, 38, 84], [74, 54, 120], [93, 60, 156], [122, 89, 194], [150, 120, 210], [185, 168, 225], [217, 207, 240], [243, 238, 252], [233, 220, 239], [201, 182, 220],
    [90, 58, 52], [138, 87, 63], [193, 141, 102], [227, 196, 114], [236, 213, 142], [194, 69, 154], [90, 26, 68], [239, 217, 78], [241, 231, 214], [255, 255, 255]];
  const near = new Map();
  function toPal() {
    const id = x.getImageData(0, 0, WK, WK), d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 120) { d[i + 3] = 0; continue; }
      const key = (d[i] >> 3) << 10 | (d[i + 1] >> 3) << 5 | (d[i + 2] >> 3);
      let k = near.get(key);
      if (k === undefined) {
        let bd = 1e9; k = 0;
        for (let j = 0; j < PAL.length; j++) { const q = PAL[j], dr = d[i] - q[0], dg = d[i + 1] - q[1], db = d[i + 2] - q[2], dd = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11; if (dd < bd) { bd = dd; k = j; } }
        near.set(key, k);
      }
      const q = PAL[k]; d[i] = q[0]; d[i + 1] = q[1]; d[i + 2] = q[2]; d[i + 3] = 255;
    }
    x.putImageData(id, 0, 0);
    out.clearRect(0, 0, c.width, c.height); out.drawImage(wk, 0, 0, c.width, c.height);
  }
  x.lineJoin = 'round'; x.lineCap = 'round';

  const P = (pts, fill, lw = 2.2, stroke = INK) => { x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); if (fill) { x.fillStyle = fill; x.fill(); } if (lw) { x.strokeStyle = stroke; x.lineWidth = lw; x.stroke(); } };
  const E = (cx, cy, rx, ry, fill, lw = 2.2, rot = 0) => { x.beginPath(); x.ellipse(cx, cy, Math.max(rx, 0.1), Math.max(ry, 0.1), rot, 0, Math.PI * 2); if (fill) { x.fillStyle = fill; x.fill(); } if (lw) { x.strokeStyle = INK; x.lineWidth = lw; x.stroke(); } };
  const path = (fn, fill, lw = 2.2) => { x.beginPath(); fn(); if (fill) { x.fillStyle = fill; x.fill(); } if (lw) { x.strokeStyle = INK; x.lineWidth = lw; x.stroke(); } };

  // ---------- poltrona ----------
  function chair() {
    // encosto: moldura de madeira escura + estofado roxo capitonê
    path(() => { x.moveTo(84, 236); x.bezierCurveTo(70, 150, 86, 58, 180, 40); x.bezierCurveTo(274, 58, 290, 150, 276, 236); x.closePath(); }, '#7a4a3e', 2.6);
    path(() => { x.moveTo(98, 232); x.bezierCurveTo(88, 156, 100, 72, 180, 56); x.bezierCurveTo(260, 72, 272, 156, 262, 232); x.closePath(); }, '#5d3c9c', 2);
    x.strokeStyle = '#c18d66'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(90, 232); x.bezierCurveTo(78, 152, 92, 64, 180, 47); x.bezierCurveTo(268, 64, 282, 152, 270, 232); x.stroke();
    // luz no estofado
    path(() => { x.moveTo(112, 220); x.bezierCurveTo(106, 160, 116, 92, 170, 72); x.bezierCurveTo(132, 104, 124, 160, 128, 220); x.closePath(); }, '#7a59c2', 0);
    // botões do capitonê
    for (const [bx, by] of [[140, 104], [180, 92], [220, 104], [126, 146], [166, 140], [206, 140], [242, 146], [140, 186], [220, 186]]) {
      E(bx, by, 3.2, 3.2, '#2d1a55', 1.2);
      x.strokeStyle = 'rgba(20,10,40,.55)'; x.lineWidth = 1; x.beginPath(); x.moveTo(bx - 9, by - 7); x.lineTo(bx, by); x.lineTo(bx + 9, by - 7); x.stroke();
    }
    // coroa entalhada no topo
    path(() => { x.moveTo(156, 44); x.quadraticCurveTo(168, 26, 180, 30); x.quadraticCurveTo(192, 26, 204, 44); x.quadraticCurveTo(180, 38, 156, 44); }, '#b8805e', 2);
    E(180, 32, 4, 4, '#c9a25a', 1.4);
    // assento
    path(() => { x.moveTo(78, 236); x.quadraticCurveTo(180, 220, 282, 236); x.lineTo(286, 262); x.quadraticCurveTo(180, 272, 74, 262); x.closePath(); }, '#6b48b0', 2.4);
    path(() => { x.moveTo(92, 240); x.quadraticCurveTo(180, 228, 268, 240); x.quadraticCurveTo(180, 236, 92, 246); x.closePath(); }, '#8a68d0', 0);
    // faixa de madeira e pernas torneadas
    path(() => { x.moveTo(74, 262); x.quadraticCurveTo(180, 274, 286, 262); x.lineTo(284, 278); x.quadraticCurveTo(180, 290, 76, 278); x.closePath(); }, '#7a4a3e', 2.2);
    for (const lx of [96, 264]) {
      P([[lx - 7, 280], [lx + 7, 280], [lx + 5, 296], [lx + 8, 306], [lx + 4, 330], [lx + 6, 338], [lx - 6, 338], [lx - 4, 330], [lx - 8, 306], [lx - 5, 296]], '#8a573f', 2);
      E(lx, 306, 7, 3.4, '#c18d66', 1.4);
      x.fillStyle = '#c9a25a'; x.fillRect(lx - 5, 334, 10, 3);
    }
    // braços em voluta
    for (const sg of [-1, 1]) {
      const ax = 180 + sg * 104;
      path(() => { x.moveTo(ax - sg * 14, 250); x.quadraticCurveTo(ax + sg * 8, 236, ax + sg * 4, 206); x.bezierCurveTo(ax + sg * 2, 186, ax - sg * 26, 186, ax - sg * 26, 204); x.lineTo(ax - sg * 24, 250); x.closePath(); }, '#5d3c9c', 2.4);
      path(() => { x.arc(ax - sg * 8, 200, 11, 0, Math.PI * 2); }, '#8a573f', 2.2);
      path(() => { x.arc(ax - sg * 8, 200, 5.5, 0, Math.PI * 2); }, '#c9a25a', 1.4);
    }
  }

  // ---------- livro ----------
  function bookCover(w, h, front) {
    x.fillStyle = front ? '#2c1846' : '#24133a'; x.fillRect(-w / 2, -h / 2, w, h);
    x.strokeStyle = INK; x.lineWidth = 2; x.strokeRect(-w / 2, -h / 2, w, h);
    x.strokeStyle = '#c9a25a'; x.lineWidth = 1.1; x.strokeRect(-w / 2 + 3.5, -h / 2 + 3.5, w - 7, h - 7);
    if (front) {
      x.fillStyle = '#ecd58e';
      x.font = `700 ${Math.round(h * 0.2)}px "Pixelify Sans", monospace`;
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText('WITCH', 0, -h * 0.12); x.fillText('CRAFT', 0, h * 0.1);
      x.fillRect(-w * 0.22, h * 0.27, w * 0.44, 1.2);
    }
  }
  // livro aberto em "V" (a bruxinha lê por trás: vemos as capas; a da direita tem o título)
  function bookOpen(cx, cy, open, rot, sc = 1) {
    const w = 42 * sc, h = 56 * sc;
    x.save(); x.translate(cx, cy); x.rotate(rot);
    // páginas (miolo creme) aparecendo no meio
    P([[-3 * sc, -h / 2 + 2], [3 * sc, -h / 2 + 2], [3 * sc, h / 2 - 2], [-3 * sc, h / 2 - 2]], '#f1e7d6', 1.4);
    const k = 0.55 + 0.45 * Math.cos(open * Math.PI * 0.5); // abre = capas mais de lado
    x.save(); x.translate(-1, 0); x.scale(k, 1); x.translate(-w / 2, 0); bookCover(w, h, false); x.restore();
    x.save(); x.translate(1, 0); x.scale(k, 1); x.translate(w / 2, 0); bookCover(w, h, true); x.restore();
    x.restore();
  }
  // livro voando: aberto, as capas batem como asas
  function bookFly(cx, cy, flap, rot, sc = 0.86) {
    const w = 42 * sc, h = 56 * sc;
    x.save(); x.translate(cx, cy); x.rotate(rot);
    for (const sg of [-1, 1]) {
      const k = 0.35 + 0.65 * Math.abs(Math.cos(flap + (sg > 0 ? 0 : 0.4)));
      x.save(); x.scale(sg * k, 1); x.translate(w / 2, 0);
      x.fillStyle = '#f1e7d6'; x.fillRect(-w / 2, -h / 2 + 2, w - 2, h - 4); // páginas
      x.strokeStyle = INK; x.lineWidth = 1.5; x.strokeRect(-w / 2, -h / 2 + 2, w - 2, h - 4);
      x.strokeStyle = '#b9a998'; x.lineWidth = 0.8; for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(-w / 2 + 6, -h / 2 + 12 + i * 8); x.lineTo(w / 2 - 8, -h / 2 + 12 + i * 8); x.stroke(); }
      x.restore();
    }
    x.restore();
  }
  // livro fechado (na boca do gato)
  function bookClosed(cx, cy, rot, sc = 0.62) {
    x.save(); x.translate(cx, cy); x.rotate(rot); bookCover(42 * sc, 56 * sc, true); x.restore();
  }

  // ---------- bruxinha (a da ilustração da Luján: cabelo preto longo e ondulado, franja reta, presilha de caveira,
  // brinco de cruz, gola de renda com laço, gargantilha, vestido preto), recostada de lado na poltrona: pernas
  // dobradas para cima com as botas no braço esquerdo, a cabeça apoiada na mão, lendo o grimório ----------
  const limb = (pts, w, fill) => {
    x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
    x.strokeStyle = INK; x.lineWidth = w + 3; x.stroke(); x.strokeStyle = fill; x.lineWidth = w; x.stroke();
  };
  const boot = (bx, by, rot) => {
    x.save(); x.translate(bx, by); x.rotate(rot);
    P([[-8, -8], [8, -8], [9, 4], [16, 6], [17, 12], [-9, 12]], '#0d0a12', 2.2);
    x.fillStyle = '#3a2d4c'; x.fillRect(-9, 9, 26, 2.2);
    x.strokeStyle = '#6a5a7e'; x.lineWidth = 1; for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(-4, -5 + i * 3.4); x.lineTo(5, -5 + i * 3.4); x.stroke(); }
    x.restore();
  };
  function witch(t, look, held) {
    const sway = Math.sin(t * 0.8) * 1.2;
    // cabelo de trás: cai pelas costas até o assento
    path(() => { x.moveTo(226, 92); x.bezierCurveTo(262, 96, 266, 140, 262, 170); for (let i = 1; i <= 8; i++) x.lineTo(262 - i * 1.2 + Math.sin(i * 1.4) * 5, 170 + i * 9); x.lineTo(214, 242); x.bezierCurveTo(206, 200, 196, 150, 198, 120); x.bezierCurveTo(200, 98, 212, 92, 226, 92); x.closePath(); }, '#130c1c', 2.2);
    x.strokeStyle = '#6a4a96'; x.lineWidth = 1.6;
    for (const x0 of [244, 254]) { x.beginPath(); x.moveTo(x0, 150); x.bezierCurveTo(x0 + 8, 184, x0 - 6, 212, x0 + 2 + sway, 238); x.stroke(); }
    // saia/quadril no assento
    path(() => { x.moveTo(190, 214); x.quadraticCurveTo(228, 200, 252, 226); x.quadraticCurveTo(250, 252, 216, 256); x.quadraticCurveTo(180, 254, 168, 236); x.closePath(); }, '#17111d', 2.4);
    // pernas dobradas para cima (meia-calça preta), joelhos altos, botas no braço esquerdo da poltrona
    limb([[204, 238], [154, 172], [102, 212]], 15, '#120c18');
    limb([[214, 244], [170, 188], [114, 230]], 15, '#16101c');
    x.strokeStyle = 'rgba(150,120,210,.55)'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(198, 226); x.lineTo(156, 170); x.lineTo(110, 202); x.stroke(); x.beginPath(); x.moveTo(208, 236); x.lineTo(172, 186); x.lineTo(120, 222); x.stroke();
    boot(96, 210, -0.5); boot(108, 228, -0.4);
    // saia por cima das coxas (babado)
    path(() => { x.moveTo(214, 206); x.quadraticCurveTo(184, 190, 164, 196); x.quadraticCurveTo(170, 214, 196, 230); x.quadraticCurveTo(220, 232, 230, 224); x.closePath(); }, '#1c1424', 2);
    // tronco: vestido preto, recostado no lado direito
    path(() => { x.moveTo(206, 156); x.quadraticCurveTo(232, 148, 252, 162); x.quadraticCurveTo(258, 196, 246, 226); x.quadraticCurveTo(220, 232, 200, 222); x.quadraticCurveTo(194, 190, 206, 156); x.closePath(); }, '#17111d', 2.4);
    x.strokeStyle = 'rgba(160,120,230,.6)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(250, 166); x.quadraticCurveTo(256, 196, 246, 222); x.stroke();
    // braço direito: cotovelo no braço da poltrona, mão no rosto
    limb([[246, 170], [266, 196], [248, 140]], 11, '#17111d');
    for (let i = 0; i < 4; i++) E(244 + i * 2.6, 146 + i * 1.2, 1.7, 1.7, '#f1ebf4', 0.5);
    // pescoço, gargantilha, gola de renda e laço
    P([[218, 142], [232, 142], [232, 158], [218, 158]], '#e9dcef', 1.6);
    x.fillStyle = '#0b0810'; x.fillRect(217, 148, 16, 4);
    path(() => { x.moveTo(206, 158); x.quadraticCurveTo(225, 152, 244, 158); for (let i = 0; i <= 8; i++) { const u = i / 8; x.lineTo(lerp(244, 206, u), 167 + (i % 2 ? 4 : 0) + Math.sin(u * Math.PI) * 3); } x.closePath(); }, '#f1ebf4', 1.5);
    P([[225, 162], [218, 158], [218, 167]], '#0b0810', 1); P([[225, 162], [232, 158], [232, 167]], '#0b0810', 1);
    x.strokeStyle = '#0b0810'; x.lineWidth = 1.3; x.beginPath(); x.moveTo(224, 163); x.lineTo(221, 184); x.moveTo(226, 163); x.lineTo(229, 184); x.stroke();
    // cabeça inclinada, apoiada na mão
    x.save(); x.translate(226, 112); x.rotate(0.12); x.translate(-180, -112);
    path(() => { x.moveTo(156, 106); x.bezierCurveTo(156, 132, 166, 146, 180, 149); x.bezierCurveTo(194, 146, 204, 132, 204, 106); x.bezierCurveTo(198, 86, 162, 86, 156, 106); x.closePath(); }, '#e9dcef', 2);
    x.fillStyle = 'rgba(200,110,170,.26)'; x.beginPath(); x.ellipse(167, 131, 5.4, 2.8, 0, 0, Math.PI * 2); x.fill(); x.beginPath(); x.ellipse(193, 131, 5.4, 2.8, 0, 0, Math.PI * 2); x.fill();
    const blink = (t % 4.6) > 4.45;
    for (const [ex, sg] of [[169, -1], [191, 1]]) {
      x.save(); x.translate(ex, 120);
      if (look > 0.5 && !blink) {
        E(0, -1, 5.4, 6.2, '#ffffff', 1.6); E(sg * 0.6, -2.6, 3.4, 3.8, '#3a2456', 0); E(sg * 0.6, -2.6, 1.5, 1.7, INK, 0); E(-1, -4.4, 1.1, 1.1, '#ffffff', 0);
        x.strokeStyle = INK; x.lineWidth = 2.4; x.beginPath(); x.moveTo(-6.4, -4); x.quadraticCurveTo(0, -9, 6.4, -4); x.stroke();
      } else {
        x.fillStyle = '#c9b6dc'; x.beginPath(); x.ellipse(0, -1, 6.6, 3.8, 0, Math.PI, 0); x.fill();
        x.strokeStyle = INK; x.lineWidth = 2.6; x.beginPath(); x.moveTo(-6.6, -0.5); x.quadraticCurveTo(0, 4, 6.6, -0.5); x.stroke();
        x.lineWidth = 1.1; for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(i * 2, 2.4 - Math.abs(i) * 0.3); x.lineTo(i * 2.3, 5.4 - Math.abs(i) * 0.5); x.stroke(); }
      }
      x.restore();
    }
    if (look > 0.5) E(180, 139, 2.3, 2.1, '#3a0f2a', 1);
    else { x.fillStyle = '#5a1a44'; x.beginPath(); x.moveTo(176, 139); x.quadraticCurveTo(180, 137.5, 184, 139); x.quadraticCurveTo(180, 142, 176, 139); x.fill(); }
    // orelha esquerda (do lado de fora) com brinco de cruz
    E(156, 118, 3, 4.8, '#e9dcef', 1.4);
    x.strokeStyle = '#d9d4ef'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(155.5, 124); x.lineTo(155.5, 139); x.moveTo(152, 129); x.lineTo(159, 129); x.stroke();
    // franja reta
    path(() => { x.moveTo(152, 114); x.bezierCurveTo(148, 80, 162, 66, 180, 66); x.bezierCurveTo(198, 66, 212, 80, 208, 114); x.lineTo(204, 112); for (let i = 8; i >= -8; i--) x.lineTo(180 + i * 3, 109 + (i % 2 ? 2.2 : 0)); x.lineTo(156, 112); x.closePath(); }, '#130c1c', 1.6);
    x.strokeStyle = 'rgba(150,120,210,.55)'; x.lineWidth = 1.4; x.beginPath(); x.arc(180, 94, 23, Math.PI * 1.12, Math.PI * 1.42); x.stroke();
    // mecha da frente, caindo pelo ombro esquerdo
    path(() => { x.moveTo(152, 108); x.bezierCurveTo(146, 140, 158, 160, 150, 196); x.lineTo(142, 194); x.bezierCurveTo(148, 160, 140, 138, 148, 108); x.closePath(); }, '#130c1c', 1.2);
    // presilha de caveira
    x.save(); x.translate(162, 84); x.rotate(-0.3);
    x.strokeStyle = '#f1ebf4'; x.lineWidth = 2.2; x.beginPath(); x.moveTo(-8, -6); x.lineTo(8, 6); x.moveTo(8, -6); x.lineTo(-8, 6); x.stroke();
    E(0, -1, 5.2, 4.6, '#f1ebf4', 1.2); P([[-2.8, 2.6], [2.8, 2.6], [2.2, 5.4], [-2.2, 5.4]], '#f1ebf4', 1);
    E(-1.9, -1, 1.3, 1.5, INK, 0); E(1.9, -1, 1.3, 1.5, INK, 0);
    x.restore();
    x.restore();
    // mão direita apoiando o rosto (por cima da bochecha)
    E(247, 134, 6, 7.5, '#e9dcef', 1.8);
    for (let i = 0; i < 3; i++) { E(242 + i * 1.2, 126 + i * 3.6, 3.4, 1.5, '#e9dcef', 1); x.fillStyle = '#0b0810'; x.beginPath(); x.moveTo(239 + i, 125.2 + i * 3.6); x.lineTo(235 + i, 124 + i * 3.6); x.lineTo(239 + i, 127 + i * 3.6); x.fill(); }
    // braço esquerdo: segura o livro na frente (ou se levanta, surpresa, quando o livro voa)
    if (held) { limb([[208, 172], [190, 196], [190, 168]], 10, '#17111d'); }
    else { limb([[208, 172], [186, 168], [176, 138]], 10, '#17111d'); }
    const hx = held ? 188 : 176, hy = held ? 164 : 134;
    for (let i = 0; i < 5; i++) E(hx - 4 + i * 2.4, hy + 6 + (i % 2), 1.6, 1.6, '#f1ebf4', 0.5);
    E(hx, hy, 6.2, 5.4, '#e9dcef', 1.8);
    for (let i = 0; i < 3; i++) { E(hx - 5, hy - 3 + i * 3.1, 3.4, 1.5, '#e9dcef', 1.1); x.fillStyle = '#0b0810'; x.beginPath(); x.moveTo(hx - 8, hy - 3.6 + i * 3.1); x.lineTo(hx - 12.5, hy - 3 + i * 3.1); x.lineTo(hx - 8, hy - 2.1 + i * 3.1); x.fill(); }
    x.fillStyle = '#e3c472'; x.fillRect(hx - 4, hy - 1, 2, 2.4);
  }

  // ---------- gatinho preto ----------
  function cat(cx, cy, stretch, dir, t, carry) {
    const K = 1.45;
    x.save(); x.translate(cx, cy); x.scale(dir * K, K);
    const sw = Math.sin(t * 3.2) * 0.35;
    // rabo
    x.strokeStyle = INK; x.lineWidth = 5; x.beginPath();
    x.moveTo(-9 - stretch * 4, 2); x.quadraticCurveTo(-22 - stretch * 6, -2 + sw * 10, -18 - stretch * 10, -16 + sw * 14 + stretch * 10); x.stroke();
    x.strokeStyle = '#1c1426'; x.lineWidth = 2.4; x.stroke();
    // corpo
    E(0, 0, 11 + stretch * 6, 8 - stretch * 2, '#120c18', 2);
    // patas
    if (stretch > 0.4) { E(14 + stretch * 4, 4, 5, 2.4, '#120c18', 1.6, 0.4); E(-12 - stretch * 4, 4, 5, 2.4, '#120c18', 1.6, -0.4); }
    else { E(6, 7, 3, 2.4, '#120c18', 1.6); E(-5, 7, 3, 2.4, '#120c18', 1.6); }
    // cabeça
    const hx = 11 + stretch * 8, hy = -7 + stretch * 3;
    P([[hx - 7, hy - 3], [hx - 6, hy - 13], [hx - 1, hy - 6]], '#120c18', 1.6);
    P([[hx + 7, hy - 3], [hx + 6, hy - 13], [hx + 1, hy - 6]], '#120c18', 1.6);
    E(hx, hy, 8, 7, '#120c18', 2);
    x.fillStyle = '#3a2d4c'; x.beginPath(); x.moveTo(hx - 5, hy - 5); x.lineTo(hx - 5.5, hy - 10); x.lineTo(hx - 2.6, hy - 6); x.fill();
    // olhos amarelos
    const bl = (t % 3.7) > 3.58;
    for (const ex of [hx - 3, hx + 3.4]) {
      if (bl) { x.strokeStyle = '#e8d24a'; x.lineWidth = 1; x.beginPath(); x.moveTo(ex - 1.8, hy - 1); x.lineTo(ex + 1.8, hy - 1); x.stroke(); }
      else { E(ex, hy - 1, 2, 2.4, '#efd94e', 0); x.fillStyle = INK; x.fillRect(ex - 0.4, hy - 2.8, 0.9, 3.6); }
    }
    x.fillStyle = '#d86aa8'; x.beginPath(); x.moveTo(hx - 1, hy + 2); x.lineTo(hx + 1, hy + 2); x.lineTo(hx, hy + 3.2); x.fill();
    x.restore();
    if (carry) bookClosed(cx + dir * (hx + 7) * K, cy + (hy + 6) * K, 0.3 * dir, 0.7);
  }

  // ---------- animação ----------
  const B0 = { x: 182, y: 150 }, P1 = { x: 312, y: 46 }, C0 = { x: 96, y: 172 }, F = { x: 300, y: 330 }, FEET = { x: 250, y: 330 }, LAP = { x: 236, y: 222 };
  const T = 4.6;
  const st = { t0: null, req: false };
  function draw(t) {
    if (st.req) { st.t0 = t; st.req = false; }
    const u = st.t0 === null ? 99 : t - st.t0;
    st.running = u < T;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, WK, WK);
    x.setTransform(S, 0, 0, S, 0, 0);
    chair();
    let book = null, catP = { x: C0.x, y: C0.y, s: 0.55, d: 1, carry: false }, look = 0, held = true;
    if (u < T) {
      look = u < 3.3 ? 1 : 0;
      held = u >= 3.3;
      if (u < 0.95) {
        const a = ease(clamp01(u / 0.8));
        const p = arc(B0, P1, 50, a);
        book = { kind: 'fly', x: p.x, y: p.y + (u > 0.8 ? Math.sin((u - 0.8) * 30) * 2 : 0), r: a * 5.5, flap: u * 22 };
      }
      if (u >= 0.35 && u < 0.95) { const a = ease((u - 0.35) / 0.6); const p = arc(C0, { x: P1.x - 8, y: P1.y + 6 }, 70, a); catP = { x: p.x, y: p.y, s: 1, d: 1 }; }
      else if (u >= 0.95 && u < 1.9) { const a = clamp01((u - 0.95) / 0.95); const p = arc({ x: P1.x - 8, y: P1.y + 6 }, F, 20, a * a); catP = { x: p.x, y: p.y, s: 1 - a * 0.6, d: 1, carry: true }; }
      else if (u >= 1.9 && u < 2.7) { const a = (u - 1.9) / 0.8; catP = { x: lerp(F.x, FEET.x, a), y: F.y - Math.abs(Math.sin(a * Math.PI * 3)) * 6, s: 0.3, d: -1, carry: true }; }
      else if (u >= 2.7 && u < 3.3) { const a = ease((u - 2.7) / 0.6); const p = arc(FEET, LAP, 46, a); catP = { x: p.x, y: p.y, s: 0.8, d: -1, carry: a < 0.98 }; }
      else if (u >= 3.3 && u < T) { const a = ease((u - 3.3) / (T - 3.3)); const p = arc(LAP, C0, 60, a); catP = { x: p.x, y: p.y, s: a < 0.95 ? 0.9 : 0.55, d: a < 0.95 ? -1 : 1 }; }
      if (u >= 0.95 && u < 3.3) book = null;
    }
    witch(t, look, held);
    if (held) bookOpen(B0.x, B0.y, 0.55 + 0.08 * Math.sin(t * 1.6), -0.12 + Math.sin(t * 0.9) * 0.03, 0.9);
    if (book) bookFly(book.x, book.y, book.flap, book.r);
    // brilho mágico saindo do livro aberto
    if (held && u >= T) {
      for (let k = 0; k < 7; k++) {
        const v = (t * 0.35 + k / 7) % 1;
        x.fillStyle = `rgba(${k % 2 ? '200,150,255' : '240,200,120'},${Math.sin(v * Math.PI) * 0.9})`;
        x.fillRect(B0.x + Math.sin(k * 2.3 + t) * 16 - 1, B0.y - 30 - v * 40, 2.4, 2.4);
      }
    }
    cat(catP.x, catP.y, catP.s, catP.d, t, catP.carry);
    toPal();
  }
  // área de toque (em fração do quadro): a bruxinha e a poltrona
  const hit = { x0: 0.16, y0: 0.08, x1: 0.84, y1: 0.98 };
  return { canvas: c, draw, hit, toss() { if (!st.running) st.req = true; } };
}
