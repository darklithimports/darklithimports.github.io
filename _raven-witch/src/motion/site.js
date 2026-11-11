// Abas (Consultar · Biblioteca · Comunidade abrem por cima do catálogo), seção ativa no menu, entrada dos cartões
// do catálogo e a parede 3D com os prints de feedback.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function site() {
  // ---- abas ----
  const panels = Object.fromEntries($$('[data-panel]').map((p) => [p.dataset.panel, p]));
  let last = null;
  function openTab(k) {
    Object.entries(panels).forEach(([n, p]) => { p.hidden = n !== k; });
    $$('.tabs [data-tab]').forEach((a) => a.toggleAttribute('aria-current', a.dataset.tab === (panels[k] ? k : 'catalogo')));
    document.documentElement.classList.toggle('has-panel', !!panels[k]);
    if (panels[k]) { panels[k]._reset?.(); panels[k].scrollTop = 0; $('[data-close]', panels[k])?.focus(); }
  }
  function route() { const h = location.hash.slice(1); openTab(panels[h] ? h : 'catalogo'); }
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => { history.pushState(null, '', '#topo'); openTab('catalogo'); }));
  addEventListener('hashchange', route);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.documentElement.classList.contains('has-panel')) { history.pushState(null, '', '#topo'); openTab('catalogo'); } });
  // os links de aba não rolam a página (o Lenis intercepta "#"): abrimos o painel na mão
  $$('a[data-tab]').forEach((a) => a.addEventListener('click', (e) => {
    const k = a.dataset.tab;
    if (panels[k]) { e.preventDefault(); e.stopImmediatePropagation(); history.pushState(null, '', '#' + k); openTab(k); }
    else if (k === 'catalogo') openTab('catalogo');
  }, true));
  route();
  // painéis Leituras / Feitiços / Rituais: botões de área; cada área mostra só a sua seção
  $$('.tabp--cat').forEach((p) => {
    const btns = $$('[data-area]', p);
    const ids = btns.map((b) => b.getAttribute('href').slice(1));
    const show = (id, scroll) => {
      ids.forEach((k) => { const el = document.getElementById(k); if (el) el.hidden = k !== id; });
      btns.forEach((b) => b.toggleAttribute('aria-current', b.getAttribute('href') === '#' + id));
      const end = $('[data-end]', p); if (end) end.hidden = !id;
      p.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      if (scroll) { const a = $('.tabp__areas', p); p.scrollTo({ top: a.offsetTop + a.offsetHeight - (p.querySelector('.tabp__bar')?.offsetHeight || 0) - 8, behavior: 'smooth' }); }
    };
    btns.forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); e.stopImmediatePropagation(); show(b.getAttribute('href').slice(1), true); }, true));
    // ao abrir, só os botões de área; os trabalhos aparecem quando a pessoa escolhe uma área
    show(null, false);
    p._reset = () => show(null, false);
  });
  // "Clientes" no menu: marca a aba enquanto os feedbacks estão na tela
  const cli = $('.tabs__cli'), cs = document.getElementById('clientes');
  if (cli && cs) new IntersectionObserver(([e]) => { cli.classList.toggle('is-on', e.isIntersecting); }, { rootMargin: '-40% 0px -40% 0px' }).observe(cs);

  // ---- seção ativa no menu do catálogo ----
  const sub = $('.sub');
  const group = { taro: 'taro', metodos: 'taro', ciclo: 'taro', como: 'como', servicos: 'como', clientes: 'clientes', numeros: 'clientes', oraculo: 'oraculo', politicas: 'politicas', agendar: 'politicas' };
  const so = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const g = group[e.target.id];
    $$('[data-s]').forEach((a) => a.classList.toggle('on', a.dataset.s === g));
    const a = g && $(`[data-s="${g}"]`);
    if (a && sub && sub.scrollWidth > sub.clientWidth) sub.scrollTo({ left: a.offsetLeft - sub.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' });
  }), { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(group).forEach((id) => { const el = document.getElementById(id); if (el) so.observe(el); });

  // ---- entrada dos cartões do catálogo (por tempo, uma vez) ----
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));
  document.documentElement.classList.add('js-reveal');

  // ---- o botão flutuante some enquanto o hero (que já tem os botões) está na tela ----
  const hero = $('.hero');
  if (hero) new IntersectionObserver(([e]) => document.documentElement.classList.toggle('at-hero', e.intersectionRatio > 0.35), { threshold: [0, 0.35, 1] }).observe(hero);

  // ---- parede 3D de prints ----
  const L = ['Divórcio energético', 'Leitura amorosa · baralho cigano', 'Leitura de vidas passadas', 'Limpeza + proteção + self love', 'Trabalho personalizado', 'Leitura de tarô', 'Leitura de tarô', 'Leitura de tarô', 'Leitura de tarô', 'Leitura de tarô', 'Leitura de tarô', 'Leitura de tarô', 'Leitura de tarô', 'Feedback', 'Leitura oracular', 'Dominação amorosa & honey jar', 'Ritual com Lilith', 'Tarô + limpeza e amor', 'Limpeza espiritual + clareza mental', 'Ritual com Lilith'];
  const src = (i) => `fb/${String(i + 1).padStart(2, '0')}.webp`;
  const plane = $('#t3d-plane');
  if (plane) {
    const n = L.length, cols = 4, rep = 2;
    const card = (i, hide) => `<button type="button" class="t3d-card rw-print" data-lb="${i}"${hide ? ' tabindex="-1"' : ''} aria-label="Feedback · ${L[i]}"><img src="${src(i)}" alt="" decoding="async" draggable="false"><span class="rw-print__tag">${L[i]}</span></button>`;
    plane.innerHTML = Array.from({ length: cols }, (_, c) => {
      const st = Math.floor((c * n) / cols);
      const order = [...Array(n).keys()].slice(st).concat([...Array(n).keys()].slice(0, st));
      const groups = Array.from({ length: rep }, (_, g) => `<div class="t3d-group"${g > 0 ? ' aria-hidden="true"' : ''}>${order.map((i) => card(i, c > 0 || g > 0)).join('')}</div>`).join('');
      return `<div class="t3d-marquee"${c % 2 ? ' data-reverse' : ''}${c > 0 ? ' aria-hidden="true"' : ''}>${groups}</div>`;
    }).join('');
    let cur = 0, lastF = null;
    const lb = $('#lb');
    const show = () => { $('#lb-img').src = src(cur); $('#lb-img').alt = 'Feedback · ' + L[cur]; $('#lb-cap').textContent = `${L[cur]} · ${cur + 1}/${n}`; };
    const open = (i) => { lastF = document.activeElement; cur = i; show(); lb.hidden = false; $('#lb-x').focus(); };
    const close = () => { lb.hidden = true; lastF?.focus(); };
    plane.addEventListener('click', (e) => { const b = e.target.closest('[data-lb]'); if (b) open(+b.dataset.lb); });
    $('#lb-x').onclick = close; $('#lb-p').onclick = () => { cur = (cur + n - 1) % n; show(); }; $('#lb-n').onclick = () => { cur = (cur + 1) % n; show(); };
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') $('#lb-n').click(); if (e.key === 'ArrowLeft') $('#lb-p').click(); });
  }
}
