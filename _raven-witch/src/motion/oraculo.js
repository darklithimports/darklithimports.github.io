// Oráculo da bruxinha: a pessoa escolhe "arcano do dia" ou "da semana"; a bruxinha (canvas do fechamento) tira
// uma carta, a carta vira na tela e aparece o conselho. Um arcano por dia e um por semana: fica guardado no
// navegador e, se a pessoa voltar no mesmo período, vê a mesma carta.
import { ARCANOS } from './arcanos.js';

const pad = (n) => String(n).padStart(2, '0');
function periodo(kind, d = new Date()) {
  if (kind === 'dia') return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-S${pad(Math.ceil(((t - y0) / 864e5 + 1) / 7))}`;
}
const KEY = (kind) => `rw-arcano-${kind}-${periodo(kind)}`;
const get = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k, v) => { try { localStorage.setItem(k, v); } catch { /* sem armazenamento: só não lembra */ } };

export function oraculo(world) {
  const box = document.querySelector('[data-ora]');
  if (!box) return;
  const $ = (s) => box.querySelector(s);
  const ask = $('[data-ora-ask]'), busy = $('[data-ora-busy]'), res = $('[data-ora-res]'), arc = $('[data-arc]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lock = false, cur = 'dia';

  function show(kind, i, nova) {
    const a = ARCANOS[i];
    cur = kind;
    $('[data-arc-num]').textContent = a.num;
    $('[data-arc-name]').textContent = a.nome;
    $('[data-ora-k]').textContent = kind === 'dia' ? 'O seu arcano do dia' : 'O seu arcano da semana';
    $('[data-ora-n]').textContent = `${a.num} · ${a.nome}`;
    $('[data-ora-w]').textContent = a.chave;
    $('[data-ora-t]').textContent = kind === 'dia' ? a.dia : a.semana;
    $('[data-ora-note]').textContent = nova
      ? (kind === 'dia' ? 'Este arcano fica com você até o fim do dia.' : 'Este arcano acompanha você até o fim da semana.')
      : (kind === 'dia' ? 'Você já tirou o seu arcano de hoje. Volte amanhã para uma nova carta.' : 'Você já tirou o arcano desta semana. Na próxima semana, uma nova carta.');
    $('[data-ora-other]').textContent = kind === 'dia' ? 'Tirar o arcano da semana' : 'Tirar o arcano do dia';
    ask.hidden = true; busy.hidden = true; res.hidden = false;
    arc.classList.remove('is-open'); void arc.offsetWidth;
    requestAnimationFrame(() => arc.classList.add('is-open'));
    lock = false;
  }

  function go(kind) {
    if (lock) return;
    const saved = get(KEY(kind));
    if (saved !== null && ARCANOS[+saved]) { show(kind, +saved, false); return; }
    lock = true;
    const i = Math.floor(Math.random() * ARCANOS.length);
    set(KEY(kind), String(i));
    ask.hidden = true; res.hidden = true; busy.hidden = false;
    world?.objs?.fechamento?.pc?.pull?.();
    setTimeout(() => show(kind, i, true), reduced ? 200 : 2300);
  }

  box.querySelectorAll('[data-ora-go]').forEach((b) => b.addEventListener('click', () => go(b.dataset.oraGo)));
  $('[data-ora-other]').addEventListener('click', () => go(cur === 'dia' ? 'semana' : 'dia'));
}
