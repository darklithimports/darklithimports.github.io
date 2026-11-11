// Download com progresso real. Cada arquivo vem por fetch em stream e conta byte a byte; o tamanho sai do
// Content-Length (sem ele, uma estimativa até o arquivo terminar). O JS e o CSS da página já chegaram quando
// este módulo roda: entram no total pelo que a Resource Timing mediu, então o contador abre onde a carga está.
// Fontes viram FontFace a partir dos bytes e imagens viram URL de Blob: nada é baixado duas vezes.
const EST = 40000;

export function carga(paths) {
  const shell = performance.getEntriesByType('resource')
    .filter((e) => e.name.startsWith(location.origin) && /\.(m?js|css)(\?|$)|\/src\/|\/@/.test(e.name))
    .reduce((n, e) => n + (e.encodedBodySize || e.decodedBodySize || 0), 0);
  const items = paths.map((path) => ({ path, got: 0, size: 0, done: false, url: null }));

  const fetchOne = async (it) => {
    try {
      const res = await fetch(it.path);
      if (!res.ok) throw new Error(`${res.status} ${it.path}`);
      it.size = Number(res.headers.get('content-length')) || 0;
      const chunks = [];
      if (res.body) {
        const reader = res.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          it.got += value.byteLength;
        }
      } else {
        const b = new Uint8Array(await res.arrayBuffer());
        chunks.push(b); it.got = b.byteLength;
      }
      const blob = new Blob(chunks, { type: res.headers.get('content-type') || '' });
      if (/\.woff2$/.test(it.path)) await addFont(it.path, await blob.arrayBuffer());
      else it.url = URL.createObjectURL(blob);
    } catch (e) {
      console.warn('[carga]', e.message);
    }
    it.size = it.got || it.size; // sem Content-Length (ou com erro): o arquivo pesa o que veio
    it.done = true;
  };

  // o primeiro arquivo (a fonte do contador) desce sozinho; os outros dividem a banda depois dele
  const first = fetchOne(items[0]);
  const jobs = [first, ...items.slice(1).map((it) => first.then(() => fetchOne(it)))];
  return {
    ready: Promise.all(jobs),
    file: (path) => jobs[paths.indexOf(path)] || Promise.resolve(), // um arquivo só (o contador espera a fonte dele)
    count: items.length,
    progress() {
      let got = shell, total = shell, files = 0;
      for (const it of items) {
        got += it.got;
        total += it.done ? it.got : it.size || Math.max(it.got, EST);
        if (it.done) files++;
      }
      return { p: files === items.length ? 1 : Math.min(0.999, got / total), got, total, files };
    },
    // URL do Blob quando o arquivo é desta carga (espera o download em curso, nunca baixa de novo); senão o caminho
    url: (path) => { const i = paths.indexOf(path); return i < 0 ? path : jobs[i].then(() => items[i].url || path); },
  };
}

// a mesma família, peso e estilo do CSS: a face carregada aqui é a que o texto usa
const FONT = {
  'satoshi-400': ['Satoshi', { weight: '400' }],
  'satoshi-500': ['Satoshi', { weight: '500' }],
  'instrument-serif-italic': ['Instrument Serif', { weight: '400', style: 'italic' }],
  'cinzel-decorative-700': ['Cinzel Decorative', { weight: '700' }],
  'pixelify-400': ['Pixelify Sans', { weight: '400' }],
  'pixelify-500': ['Pixelify Sans', { weight: '500' }],
  'pixelify-700': ['Pixelify Sans', { weight: '700' }],
  'cinzel-500': ['Cinzel', { weight: '500' }],
  'cinzel-600': ['Cinzel', { weight: '600' }],
  'cormorant-400': ['Cormorant Garamond', { weight: '400' }],
  'cormorant-500': ['Cormorant Garamond', { weight: '500' }],
  'cormorant-400-italic': ['Cormorant Garamond', { weight: '400', style: 'italic' }],
  'cormorant-600': ['Cormorant Garamond', { weight: '600' }],
  'cormorant-700': ['Cormorant Garamond', { weight: '700' }],
  'pinyon-400': ['Pinyon Script', { weight: '400' }],
};
async function addFont(path, buf) {
  const key = path.split('/').pop().replace('.woff2', '');
  const [family, desc] = FONT[key] || [];
  if (!family) return;
  const face = new FontFace(family, buf, desc);
  await face.load();
  document.fonts.add(face);
}
