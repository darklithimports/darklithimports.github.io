// Ajudantes mínimos de WebGL2.
export function program(gl, vs, fs) {
  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src.split('\n').map((l, i) => `${i + 1}: ${l}`).join('\n'));
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const cache = {};
  const loc = (n) => (n in cache ? cache[n] : (cache[n] = gl.getUniformLocation(p, n)));
  return {
    p,
    use() { gl.useProgram(p); return this; },
    f(n, ...v) { const l = loc(n); if (l) gl[`uniform${v.length}f`](l, ...v); return this; },
    i(n, v) { const l = loc(n); if (l) gl.uniform1i(l, v); return this; },
    v4(n, arr) { const l = loc(n); if (l) gl.uniform4fv(l, arr); return this; },
  };
}

export function texture(gl, src, { filter = gl.LINEAR, format = gl.RGBA, internal = gl.RGBA, type = gl.UNSIGNED_BYTE, w, h } = {}) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  if (w != null) gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, src);
  else gl.texImage2D(gl.TEXTURE_2D, 0, internal, format, type, src);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

export const fract = (x) => x - Math.floor(x);
export function bayer8(x, y) {
  const b2 = (a, b) => { a = Math.floor(a); b = Math.floor(b); return fract(a * 0.5 + b * b * 0.75); };
  const b4 = (a, b) => b2(a * 0.5, b * 0.5) * 0.25 + b2(a, b);
  return b4(x * 0.5, y * 0.5) * 0.25 + b2(x, y);
}
export const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
