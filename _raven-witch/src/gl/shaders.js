// Shaders do mundo da Sinal. Tudo sai em branco puro sobre preto (1-bit): sem cinza, sem alfa parcial,
// exceto a borda suave das letras sólidas do título.
// Convenção: coordenadas de tela com origem no canto de cima à esquerda, em px de dispositivo.

const COMMON = /* glsl */ `
float bayer2(vec2 a){ a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a){ return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(0.5 * a) * 0.25 + bayer2(a); }
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
`;

// ---------- quad genérico (imagens, título sólido, brilhos) ----------
export const QUAD_VS = /* glsl */ `#version 300 es
layout(location=0) in vec2 a_p;   // 0..1
uniform vec2 u_res;               // px de dispositivo do canvas
uniform vec4 u_rect;              // x, y, w, h em px de dispositivo (topo à esquerda)
void main(){
  vec2 p = u_rect.xy + a_p * u_rect.zw;
  gl_Position = vec4(p.x / u_res.x * 2.0 - 1.0, 1.0 - p.y / u_res.y * 2.0, 0.0, 1.0);
}`;

// Imagem em tons de cinza → dither ordenado 1-bit em células quadradas presas à imagem (o padrão não
// "nada" quando ela se move). O lado de onde o fluxo chega se desfaz em pontos deslocados contra o fluxo;
// a entrada (u_form) traz cada célula de longe, ao longo do fluxo, com atraso aleatório.
export const IMAGE_FS = /* glsl */ `#version 300 es
precision highp float;
${COMMON}
uniform vec2 u_res;
uniform vec4 u_rect;
uniform float u_cell;
uniform sampler2D u_tex;
uniform float u_form;
uniform vec2 u_dir;      // direção do fluxo nesta imagem (unitária, y para baixo)
uniform float u_dis;     // quanto o lado de entrada se desfaz
uniform vec3 u_tone;     // piso, ganho, gama
uniform vec2 u_mouse;    // px de dispositivo
uniform float u_mr;      // raio da lente do cursor (0 = sem)
uniform float u_seed;
uniform float u_edge;    // margem de esmaecimento nas bordas (uv)
uniform float u_fadeB;
uniform float u_travel;  // quanto a entrada traz as células de longe
uniform float u_color;   // 1 = imagem colorida (ilustração), 0 = tons de cinza pintados de vinho→rosé   // esmaecimento extra embaixo (o pulso que sai da seção)
out vec4 o;
const vec3 INK = vec3(0.94, 0.9, 0.84);  // osso (Raven Witch: noite violeta + carmesim + osso)
const vec3 INK2 = vec3(0.84, 0.42, 0.52); // carmesim-rosa das cartas
const vec3 WINE = vec3(0.2, 0.08, 0.16);
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 local = p - u_rect.xy;
  float bc = u_cell * 2.0;                    // blocos pequenos que chegam voando e se fundem na imagem
  vec2 cell = floor(local / bc);
  vec2 c = (cell + 0.5) * bc;
  float r = hash(cell + u_seed);
  // lente do cursor: o conteúdo abre espaço em volta do ponteiro
  vec2 cm = u_rect.xy + c - u_mouse;
  float dm = length(cm);
  float push = u_mr > 0.0 ? smoothstep(u_mr, 0.0, dm) : 0.0;
  vec2 sc = c - (dm > 0.001 ? cm / dm : vec2(0.0)) * push * push * u_mr * 0.32;
  vec2 uv = sc / u_rect.zw;
  // lado de entrada do fluxo: -1 (saída) .. 1 (entrada)
  float side = dot(uv - 0.5, -u_dir) * 2.0;
  float D = smoothstep(-0.1, 0.95, side) * u_dis;
  float delay = r * 0.55 + (1.0 - clamp(side * 0.5 + 0.5, 0.0, 1.0)) * 0.25;
  float k = smoothstep(delay, delay + 0.3, u_form);
  vec2 off = u_dir * (D * D * (0.04 + r * 0.22) + (1.0 - k) * (0.18 + r * 0.5) * u_travel);
  // formada a célula, a imagem é lida no pixel exato (nítida); antes, o bloco inteiro vem deslocado
  float done = step(0.999, k);
  float PB = u_color > 0.5 ? 1.0 : max(3.0, floor(u_cell * 1.5));   // pixel de arte (a ilustração da bruxinha já é pixel art)
  vec2 pl = (floor(local / PB) + 0.5) * PB;
  vec2 puv = (pl - (c - sc)) / u_rect.zw;
  vec2 suv = mix(uv + (local - c) / u_rect.zw - off, puv - u_dir * D * D * 0.02, done);
  vec4 tx = vec4(0.0);
  if (suv.x > 0.0 && suv.y > 0.0 && suv.x < 1.0 && suv.y < 1.0) tx = texture(u_tex, suv);
  vec2 fu = local / u_rect.zw;
  vec2 e = smoothstep(vec2(0.0), vec2(u_edge), fu) * smoothstep(vec2(0.0), vec2(u_edge), 1.0 - fu);
  float a = e.x * e.y * smoothstep(0.0, 1.0, k) * (1.0 - D * 0.35);
  if (u_fadeB > 0.0) a *= smoothstep(1.0, 1.0 - u_fadeB, fu.y);
  vec3 col;
  if (u_color > 0.5) {
    col = tx.rgb;
    a *= tx.a;
  } else {
    float l0 = dot(tx.rgb, vec3(0.299, 0.587, 0.114));
    float lum = pow(clamp((l0 - u_tone.x) / (1.0 - u_tone.x) * u_tone.y, 0.0, 1.0), u_tone.z);
    float q = floor(lum * 6.0 + 0.5) / 6.0;      // 7 tons: paleta roxa da bruxinha
    // mapa de gradiente: sombras violeta → meios-tons malva/carmesim → luzes cor de osso
    vec3 P0 = vec3(0.043, 0.031, 0.063), P1 = vec3(0.12, 0.08, 0.19), P2 = vec3(0.23, 0.14, 0.31),
         P3 = vec3(0.37, 0.2, 0.38), P4 = vec3(0.6, 0.33, 0.42), P5 = vec3(0.84, 0.72, 0.64), P6 = vec3(0.97, 0.93, 0.87);
    float t6 = q * 6.0;
    col = t6 < 0.5 ? P0 : t6 < 1.5 ? P1 : t6 < 2.5 ? P2 : t6 < 3.5 ? P3 : t6 < 4.5 ? P4 : t6 < 5.5 ? P5 : P6;
    a *= step(0.08, q) * 0.98 + 0.02 * step(0.02, lum);
  }
  if (a < 0.004) discard;
  o = vec4(col * a, a);
}`;

// Brilho dithered: halo em volta da esfera (cresce no pulso); com u_core, o disco também
// (cabeça do sinal e a luz do fechamento, que não têm disco na imagem).
export const GLOW_FS = /* glsl */ `#version 300 es
precision highp float;
${COMMON}
uniform vec2 u_res;
uniform vec4 u_rect;
uniform vec2 u_c;       // centro, px de dispositivo (inteiro)
uniform float u_R;      // raio do disco, px de dispositivo
uniform float u_cell;
uniform float u_int;    // intensidade
uniform float u_ring;   // fase da onda 0..1
uniform float u_core;   // preenche o disco
uniform float u_halo;   // força do halo
out vec4 o;
const vec3 INK = vec3(0.94, 0.9, 0.84);  // osso (Raven Witch: noite violeta + carmesim + osso)
const vec3 INK2 = vec3(0.84, 0.42, 0.52); // carmesim-rosa das cartas
const vec3 WINE = vec3(0.2, 0.08, 0.16);
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 cc = p - u_c;
  float d = length(cc) / u_R;
  float lum = d < 1.0 ? u_core * (1.0 - 0.35 * smoothstep(0.5, 1.0, d)) : exp(-(d - 1.0) * 3.4) * u_halo;
  lum = clamp(lum * u_int, 0.0, 1.0);
  if (lum < 0.004) discard;
  vec3 gc = mix(vec3(0.62, 0.14, 0.27), vec3(1.0, 0.96, 0.9), smoothstep(0.2, 0.9, lum));
  o = vec4(gc * lum, lum);
}`;

// Mostrador do loader: 64 marcas em volta da esfera, em células 1-bit. As acesas vão até o progresso real
// do download; as apagadas ficam como pontilhado ralo. Na saída o anel abre (u_rad cresce) e se desfaz (u_a).
export const DIAL_FS = /* glsl */ `#version 300 es
precision highp float;
${COMMON}
uniform vec2 u_res;
uniform vec4 u_rect;
uniform vec2 u_c;       // centro, px de dispositivo (inteiro)
uniform float u_R;      // raio da esfera, px de dispositivo
uniform float u_cell;
uniform float u_prog;   // 0..1
uniform float u_rad;    // raio do anel, em raios da esfera
uniform float u_a;      // intensidade geral
out vec4 o;
const vec3 INK = vec3(0.94, 0.9, 0.84);  // osso (Raven Witch: noite violeta + carmesim + osso)
const vec3 INK2 = vec3(0.84, 0.42, 0.52); // carmesim-rosa das cartas
const vec3 WINE = vec3(0.2, 0.08, 0.16);
const float PI2 = 6.2831853;
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 cell = floor((p - u_c) / u_cell);
  vec2 cc = (cell + 0.5) * u_cell;
  float d = length(cc) / u_R;
  float f = fract(atan(cc.x, -cc.y) / PI2 + 1.0);      // 0 no topo, horário
  float k = f * 64.0, idx = floor(k);
  bool major = mod(idx, 8.0) < 0.5;
  float th = major ? 0.24 : 0.13;
  float r0 = u_rad - (major ? 0.04 : 0.0);
  if (d < r0 || d > r0 + th) discard;
  if (fract(k) > 0.42) discard;                        // vão entre marcas
  float lit = clamp(u_prog * 64.0 - idx, 0.0, 1.0);    // a marca corrente acende em pontilhado
  float lum = mix(0.16, 1.0, lit) * u_a;
  lum = clamp(lum, 0.0, 1.0);
  if (lum < 0.004) discard;
  o = vec4(INK * lum, lum);
}`;

// Título sólido: só as células cuja ordem de solidificação (S) já passou; o resto é feito de pontos.
export const TITLE_FS = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform vec4 u_rect;
uniform float u_cell;
uniform float u_solid;
uniform sampler2D u_cov;   // cobertura das letras, px de dispositivo
uniform sampler2D u_S;     // ordem de solidificação por célula (0..1, >=1 nunca)
out vec4 o;
const vec3 INK = vec3(0.94, 0.9, 0.84);  // osso (Raven Witch: noite violeta + carmesim + osso)
const vec3 INK2 = vec3(0.84, 0.42, 0.52); // carmesim-rosa das cartas
const vec3 WINE = vec3(0.2, 0.08, 0.16);
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 local = p - u_rect.xy;
  ivec2 cell = ivec2(floor(local / u_cell));
  float S = texelFetch(u_S, cell, 0).r * 2.0;
  if (u_solid <= S) discard;
  float a = texelFetch(u_cov, ivec2(floor(local)), 0).r;
  if (a < 0.004) discard;
  o = vec4(INK * a, a);
}`;

// ---------- partículas ----------
// tipo 0: estrelas (fundo, lentas), 1: marcas de primeiro plano (rápidas, nas bordas),
// 2: explosão que sai da esfera, 3: o fluxo que desce a página pelo caminho.
export const POINTS_VS = /* glsl */ `#version 300 es
precision highp float;
layout(location=0) in vec4 a_r;
layout(location=1) in float a_k;
uniform vec2 u_vp;        // tela em px css
uniform vec2 u_res;
uniform float u_dpr, u_cell, u_time, u_scroll;
uniform vec2 u_mouse;     // px css de tela
uniform vec2 u_mpar;      // deslocamento do mouse para a profundidade 1 (px css)
uniform vec2 u_sph;       // centro da esfera (px css do documento)
uniform float u_sphR;
uniform vec2 u_bdir;
uniform float u_blen, u_reach, u_stars, u_pulse, u_fg;
uniform sampler2D u_path; // linha 0: x, y, nx, ny; linha 1: largura
uniform int u_pn;
uniform float u_plen, u_head;
uniform vec4 u_rects[32];
uniform int u_nr;
out float v_shape;
out float v_rot;
out float v_pick;
#define HIDE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
float gauss(float a, float b){ return sqrt(-2.0 * log(max(a, 1e-4))) * cos(6.2831853 * b); }
vec2 depth(vec2 doc, float f){
  float y = doc.y - u_scroll - (f - 1.0) * (u_scroll - (doc.y - u_vp.y * 0.5));
  return vec2(doc.x, y);
}
void main(){
  int k = int(a_k + 0.5);
  vec2 p; float size = 1.0; v_shape = 0.0; v_rot = (fract(a_r.w * 71.3) - 0.5) * 1.1; v_pick = fract(a_r.w * 13.7 + a_r.x * 3.1);
  if (k == 0) {
    if (a_r.w > u_stars) HIDE
    float f = 0.12 + a_r.z * 0.3;
    float H = u_vp.y * 1.5;
    p = vec2(a_r.x * u_vp.x, mod(a_r.y * H - u_scroll * f, H) - u_vp.y * 0.25) + u_mpar * (0.15 + a_r.z * 0.35);
    size = fract(a_r.w * 17.3) > 0.97 ? 2.0 : 1.0;
  } else if (k == 1) {
    if (a_r.w > u_fg) HIDE
    float side = a_r.x < 0.5 ? a_r.x * 2.0 * 0.12 + 0.01 : 0.99 - (a_r.x - 0.5) * 2.0 * 0.12;
    float f = 1.7 + a_r.y * 0.6;
    float H = u_vp.y * 2.4;
    p = vec2(side * u_vp.x, mod(a_r.z * H - u_scroll * f, H) - u_vp.y * 0.7) + u_mpar * f * 1.5;
    size = 7.0 + floor(fract(a_r.w * 31.7) * 4.0) * 2.0;
    v_shape = 2.0;
  } else if (k == 2) {
    float t = fract(a_r.x + u_time * (0.035 + 0.04 * a_r.y));
    float g1 = gauss(fract(a_r.z * 91.7), a_r.w);
    float g2 = gauss(fract(a_r.w * 37.3), fract(a_r.z * 5.3));
    float reach = 0.35 + 0.65 * fract(a_r.y * 17.1);
    float dist = u_sphR * 0.8 + pow(t, 1.5) * u_blen * reach;
    float ang = g1 * 0.13;
    vec2 d = mat2(cos(ang), sin(ang), -sin(ang), cos(ang)) * u_bdir;
    vec2 n = vec2(-d.y, d.x);
    vec2 doc = u_sph + d * dist + n * g2 * (u_sphR * 0.35 + dist * 0.07);
    doc += d * u_pulse * 30.0 * (1.0 - t);
    if (dist > u_sphR + u_reach * u_blen) HIDE
    if (t > 0.8 + 0.2 * fract(a_r.y * 7.7)) HIDE
    float f = 1.0 + (a_r.z - 0.5) * 0.3;
    p = depth(doc, f) + u_mpar * f;
    size = a_r.z > 0.85 ? 4.0 : 2.5;
    v_shape = 2.0;
  } else {
    float s = mod(a_r.x * u_plen + u_time * (34.0 + 46.0 * a_r.y), u_plen);
    if (s > u_head - 320.0 * a_r.z) HIDE
    float fi = s / u_plen * float(u_pn - 1);
    int i0 = int(floor(fi)); float fr = fi - float(i0);
    int i1 = min(i0 + 1, u_pn - 1);
    vec4 A = texelFetch(u_path, ivec2(i0, 0), 0), B = texelFetch(u_path, ivec2(i1, 0), 0);
    float w = mix(texelFetch(u_path, ivec2(i0, 1), 0).x, texelFetch(u_path, ivec2(i1, 1), 0).x, fr);
    vec2 pos = mix(A.xy, B.xy, fr);
    vec2 n = normalize(mix(A.zw, B.zw, fr) + 1e-5);
    float g = gauss(fract(a_r.z * 53.1), a_r.w);
    float lat = g * w + sin(u_time * 0.5 + a_r.y * 40.0) * 6.0;
    vec2 doc = pos + n * lat;
    float f = 0.88 + a_r.w * 0.3;
    p = depth(doc, f) + u_mpar * f;
    size = fract(a_r.y * 13.3) > 0.9 ? 3.5 : 2.0;
    v_shape = 2.0;
  }
  // o cursor afasta os pontos
  vec2 dm = p - u_mouse;
  float dl = length(dm);
  p += dm / max(dl, 1.0) * 26.0 * smoothstep(95.0, 0.0, dl);
  if (p.y < -60.0 || p.y > u_vp.y + 60.0 || p.x < -60.0 || p.x > u_vp.x + 60.0) HIDE
  // texto: os pontos rareiam perto e somem por cima
  float edge = 30.0 * fract(a_r.w * 7.77 + a_r.x);
  for (int i = 0; i < 32; i++) {
    if (i >= u_nr) break;
    vec4 R = u_rects[i];
    vec2 q = max(R.xy - p, p - R.zw);
    if (max(q.x, q.y) < edge) HIDE
  }
  float sz = size * u_cell;
  vec2 c = floor(p * u_dpr) + mod(sz, 2.0) * 0.5;
  gl_Position = vec4(c.x / u_res.x * 2.0 - 1.0, 1.0 - c.y / u_res.y * 2.0, 0.0, 1.0);
  gl_PointSize = sz;
}`;

export const POINTS_FS = /* glsl */ `#version 300 es
precision highp float;
in float v_shape;
in float v_rot;
in float v_pick;
out vec4 o;
const vec3 INK = vec3(0.94, 0.9, 0.84);
const vec3 INK2 = vec3(0.84, 0.42, 0.52);
void main(){
  if (v_shape > 1.5) {
    // brasa redonda e suave (faíscas mágicas; nada de cartas caindo)
    float pd = length(gl_PointCoord - 0.5);
    if (pd > 0.5) discard;
    float pa = smoothstep(0.5, 0.05, pd);
    float pick = v_pick;
    vec3 cc = pick < 0.45 ? vec3(0.86, 0.36, 0.72) : pick < 0.8 ? vec3(0.72, 0.62, 0.98) : vec3(0.95, 0.88, 0.58);   // magenta, lavanda, amarelo-lua
    o = vec4(cc * pa, pa);
    return;
  }
  if (v_shape > 0.5) {
    vec2 c = gl_PointCoord;
    bool a = c.x < 0.5 && c.y < 0.5, b = c.x >= 0.5 && c.y >= 0.5;
    if (!(a || b)) discard;
  }
  o = vec4(INK, 1.0);
}`;

// Pontos do título: cada célula de tinta sai da esfera, arqueia pela direção da explosão e pousa no
// lugar. Depois as de fora viram letra sólida (TITLE_FS) e as de dentro ficam como dither que respira.
export const TITLE_VS = /* glsl */ `#version 300 es
precision highp float;
layout(location=0) in vec4 a_t;   // célula x, y; S; D
layout(location=1) in vec4 a_u;   // cobertura, bayer, aleatório, atraso
uniform vec2 u_res;
uniform vec2 u_org;               // origem do título, px de dispositivo (inteiro)
uniform vec2 u_sph;               // esfera em px de dispositivo de tela
uniform vec2 u_arc, u_drift;     // para onde o voo arqueia; para onde os pontos soltos respiram
uniform float u_spread, u_amp;    // espalhamento da origem (px de dispositivo); amplitude da respiração
uniform float u_cell, u_dpr, u_tT, u_solid, u_time, u_pulse;
#define HIDE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
void main(){
  float S = a_t.z, D = a_t.w;
  float cov = a_u.x, bay = a_u.y, r = a_u.z, delay = a_u.w;
  if (u_solid > S) HIDE
  float th = mix(1.01, cov * (1.0 - D * 0.86), u_solid);
  if (bay >= th) HIDE
  float k = clamp((u_tT - delay) / 1.25, 0.0, 1.0);
  if (k <= 0.0) HIDE
  float e = 1.0 - pow(1.0 - k, 4.0);
  vec2 tgt = u_org + (a_t.xy + 0.5) * u_cell;
  vec2 s0 = u_sph + (vec2(r, fract(r * 13.17)) - 0.5) * vec2(u_spread, u_spread * 0.25);
  vec2 ctrl = mix(s0, tgt, 0.45) + u_arc * length(tgt - s0) * 0.38;
  vec2 pos = mix(mix(s0, ctrl, e), mix(ctrl, tgt, e), e);
  float amp = D * D * (12.0 + 30.0 * r) * u_solid * u_amp;
  pos += u_drift * u_dpr * (amp * (0.5 - 0.5 * cos(u_time * 0.7 + r * 6.2831)) + u_pulse * D * D * 22.0);
  vec2 c = floor(pos - u_cell * 0.5) + u_cell * 0.5;
  gl_Position = vec4(c.x / u_res.x * 2.0 - 1.0, 1.0 - c.y / u_res.y * 2.0, 0.0, 1.0);
  gl_PointSize = u_cell;
}`;

export const POINTS_SOLID_FS = /* glsl */ `#version 300 es
precision highp float;
out vec4 o;
const vec3 INK = vec3(0.94, 0.9, 0.84);  // osso (Raven Witch: noite violeta + carmesim + osso)
const vec3 INK2 = vec3(0.84, 0.42, 0.52); // carmesim-rosa das cartas
const vec3 WINE = vec3(0.2, 0.08, 0.16);
void main(){ o = vec4(INK, 1.0); }`;

// Raven Witch: o portal que o athame abre. Vórtice em espiral (violeta → carmesim → osso) com vazio estrelado no
// centro, borda de fogo, anel de marcas douradas, névoa em volta. O cursor puxa o vórtice (lente), acelera o giro e
// acende a borda; um clique/toque solta uma onda de choque. Tudo em pixels (blocos) e paleta reduzida.
export const PORTAL_FS = /* glsl */ `#version 300 es
precision highp float;
${COMMON}
uniform vec2 u_res;
uniform vec4 u_rect;
uniform vec2 u_c;
uniform float u_R, u_time, u_open, u_hov, u_shock, u_cell;
uniform vec2 u_m;
out vec4 o;
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
void main(){
  if (u_open < 0.002) discard;
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  float PB = max(2.0, floor(u_cell * 1.0));
  p = (floor(p / PB) + 0.5) * PB;
  // lente do cursor: o vórtice é puxado na direção do ponteiro
  vec2 dm = p - u_m;
  float md = length(dm);
  vec2 q = p - u_c - dm * 0.32 * u_hov * exp(-md * md / (u_R * u_R * 0.9));
  float R = u_R * u_open * (1.0 + 0.035 * sin(u_time * 1.4) + 0.07 * u_hov);
  float r = length(q), d = r / max(R, 1.0), a = atan(q.y, q.x);
  float spin = u_time * (0.32 + 1.4 * u_hov);
  float sw = a + 2.4 / (d + 0.22) - spin * 2.0;
  float f = fbm(vec2(cos(sw), sin(sw)) * (1.4 + d) + vec2(log(d + 0.04) * 2.4 - u_time * 0.9, u_time * 0.2));
  vec3 col = vec3(0.0); float al = 0.0;
  if (d < 1.0) {
    vec3 deep = vec3(0.02, 0.01, 0.035), vio = vec3(0.3, 0.18, 0.55), cri = vec3(0.72, 0.2, 0.55), bone = vec3(0.98, 0.93, 0.98);
    col = mix(deep, vio, smoothstep(0.38, 0.72, f) * smoothstep(0.05, 0.75, d));
    col = mix(col, cri, smoothstep(0.58, 0.86, f) * smoothstep(0.25, 0.98, d));
    float arm = smoothstep(0.78, 0.97, 0.5 + 0.5 * sin(sw * 3.0 + f * 5.0));
    col += bone * arm * 0.32 * smoothstep(0.15, 1.0, d);
    // vazio estrelado no centro
    float s = step(0.988, hash(floor(q / PB) + floor(u_time * 0.5)));
    col += vec3(0.95, 0.9, 1.0) * s * (1.0 - d) * 0.9;
    col += vec3(0.8, 0.3, 0.7) * exp(-d * d * 16.0) * (0.18 + 0.55 * u_hov);
    al = 1.0;
  }
  // borda de fogo
  float rim = exp(-pow((d - 1.0) * R / (PB * 2.4), 2.0));
  float fl = 0.65 + 0.35 * fbm(vec2(cos(a), sin(a)) * 4.5 + vec2(u_time * 3.2, 0.0));
  col += mix(vec3(0.62, 0.3, 0.95), vec3(1.0, 0.86, 0.98), 0.5 + 0.5 * sin(a * 9.0 + u_time * 3.5)) * rim * fl * (1.1 + 0.6 * u_hov);
  // anel de marcas douradas
  float ra = abs(d - 1.16) * R;
  float tk = step(0.55, fract(a * 36.0 / 6.2831853 + u_time * 0.04 * (1.0 + 5.0 * u_hov)));
  float ring = step(ra, PB * 0.7) * tk * smoothstep(0.6, 1.0, u_open);
  col += vec3(0.93, 0.85, 0.55) * ring;
  float ring2 = step(abs(d - 1.24) * R, PB * 0.5) * smoothstep(0.7, 1.0, u_open);
  col += vec3(0.6, 0.2, 0.55) * ring2 * 0.8;
  float outA = 0.0;
  if (d >= 1.0) {
    float t = fbm(vec2(cos(a + u_time * 0.12), sin(a + u_time * 0.12)) * 2.6 + vec2((d - 1.0) * 3.5 - u_time * 0.7, 0.0));
    float h = exp(-(d - 1.0) * 2.6) * (0.3 + 0.7 * t) * (0.55 + 0.8 * u_hov);
    col += vec3(0.42, 0.16, 0.5) * h + vec3(0.2, 0.12, 0.42) * h * 0.5;
    outA = clamp(h * 0.85 + rim + ring + ring2 * 0.8, 0.0, 1.0);
  }
  // onda de choque do clique
  if (u_shock < 1.6) {
    float sr = u_shock * R * 2.6;
    float w = exp(-pow((r - sr) / (PB * 3.0), 2.0)) * (1.0 - u_shock / 1.6);
    col += vec3(0.95, 0.85, 1.0) * w; outA = max(outA, w);
  }
  al = max(al, outA);
  col = floor(col * 9.0 + 0.5) / 9.0;
  if (al < 0.01) discard;
  o = vec4(col, al);
}`;

// Raven Witch: o fundo do herói. Chama negra / nebulosa: fumaça preta subindo (domínio dobrado por ruído) sobre uma
// névoa violeta, com as bordas acesas em violeta e magenta, em faixas chapadas de quadrinho. As línguas de fogo
// convergem para o portal; o cursor abre caminho na fumaça e acende as bordas em volta dele.
export const NEBULA_FS = /* glsl */ `#version 300 es
precision highp float;
${COMMON}
uniform vec2 u_res;
uniform vec4 u_rect;
uniform float u_time, u_top, u_h;
uniform vec2 u_c, u_m;
uniform float u_R, u_hov, u_open, u_vig;
out vec4 o;
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.02 + 3.7; a *= 0.5; } return s; }
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  float y = (p.y - u_top) / u_h;                 // 0 no topo do herói, 1 embaixo
  vec2 uv = vec2(p.x, p.y - u_top) / u_h;
  // o cursor afasta a fumaça
  vec2 dm = p - u_m; float md = length(dm);
  vec2 push = dm / max(md, 1.0) * exp(-md / (u_h * 0.16)) * 0.09;
  // puxada para o portal (línguas que convergem)
  vec2 toC = (u_c - p) / u_h; float dc = length(toC);
  vec2 q = uv - push + toC * 0.18 * exp(-dc * 2.2);
  float t = u_time;
  vec2 w1 = vec2(fbm(q * 2.1 + vec2(0.0, t * 0.12)), fbm(q * 2.1 + vec2(5.2, t * 0.1)));
  vec2 w2 = vec2(fbm(q * 2.6 + w1 * 1.7 + vec2(1.7, t * 0.3)), fbm(q * 2.6 + w1 * 1.7 + vec2(8.3, t * 0.26)));
  float n = fbm(q * vec2(3.0, 1.15) + w2 * 2.2 + vec2(0.0, t * 0.45));     // sobe com o tempo
  // mais densa embaixo e nas bordas; o centro (a bruxinha) fica livre
  vec2 dq = (p - u_c) / u_h; dq.x *= 0.62;
  float m = smoothstep(0.26, 0.7, length(dq)) * 0.85 + smoothstep(0.72, 1.0, y) * 0.6;
  m = clamp(m, 0.0, 1.0);
  float dens = n * (0.6 + 0.5 * smoothstep(0.3, 1.05, y));
  float body = smoothstep(0.5, 0.62, dens) * m;
  float rim = (smoothstep(0.43, 0.5, dens) - smoothstep(0.5, 0.62, dens)) * (0.35 + 0.65 * m);
  float hot = clamp(exp(-md / (u_h * 0.18)) * 0.9, 0.0, 1.0);
  vec3 rimC = mix(vec3(0.46, 0.3, 0.8), vec3(0.88, 0.34, 0.7), hot);
  float haze = fbm(q * 1.2 + vec2(t * 0.02, 0.0));
  float hz = (0.25 + 0.35 * smoothstep(0.3, 0.85, haze)) * m;
  vec3 hazeC = mix(vec3(0.05, 0.02, 0.09), vec3(0.16, 0.07, 0.26), haze);
  // vinheta: escurece as bordas e o pé do herói (o texto fica legível e o cenário se funde à página)
  float vig = clamp(smoothstep(0.35, 1.0, length(dq * vec2(1.0, 0.9))) * 0.55 + smoothstep(mix(0.78, 0.55, u_vig), 1.0, y) * mix(0.9, 0.92, u_vig), 0.0, 1.0);
  float A = clamp(max(max(body * 0.94, hz), vig), 0.0, 1.0);
  vec3 col = hazeC * hz * (1.0 - body) + vec3(0.02, 0.012, 0.03) * body;
  col += rimC * rim * (1.0 + 0.8 * hot);
  A = max(A, rim * 0.9);
  float a = smoothstep(-0.02, 0.04, y) * (1.0 - smoothstep(1.0, 1.02, y));
  if (A * a < 0.01) discard;
  o = vec4(col * a, A * a);
}`;
