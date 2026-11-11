# Raven Witch · landing page (@raven.witch__)

Landing page / catálogo de serviços da Raven Witch (tarô, feitiços, rituais). Vite + JS puro, WebGL2 para o fundo
animado, GSAP + Lenis. Todo botão de compra leva para a DM do Instagram (https://instagram.com/raven.witch__).

## Rodar
```bash
npm install
npm run dev        # http://localhost:5232
npm run build      # gera dist/ (caminhos relativos: funciona em /<repo>/ no GitHub Pages)
```

## Regras da dona (Luján) — seguir sempre
- Não inventar serviços, preços nem descrições. Valores e textos vêm dela.
- Sem carrinho, checkout ou formulário de pagamento: todo botão → DM do Instagram.
- Não escrever "agenda aberta", "voltei", "leitura grátis".
- Textos do site em português (BR); a seção "Información y políticas de atención" fica em espanhol, como ela enviou.
- Estética: dark fantasy / ocultista, séria e profissional, com a fofura vinda só dos personagens.
  Preto/violeta-noite, magenta/carmesim, osso e dourado. Nada de letra quadrada/pixel nos textos
  (só a ilustração da bruxinha é pixel art). Títulos: Cormorant Garamond; nome "Raven Witch": Pinyon Script.
- As imagens não devem distorcer com o cursor (lente desligada: `u_mr = 0`).
- Testar sempre em celular (390 px) e desktop.

## Onde está cada coisa
- `index.html` é GERADO por `tools/gen3.py` (que importa dados de `tools/gen.py`).
  **Para mudar textos/preços, edite `tools/gen3.py` (ou as listas em `tools/gen.py`) e rode `python3 tools/gen3.py`.**
  - `tools/gen.py`: listas `amor`, `prot`, `pros`, `mente`, `poder`, `lil` (catálogo original).
  - `tools/gen3.py`: estrutura da página, painéis Leituras/Feitiços/Rituais (`drawer(...)`), listas `limp` e `selfs`,
    seção de números + bandeiras, Oráculo, seção de políticas (`id="politicas"`), rodapé.
- `src/main.js`: entrada; importa CSS e módulos.
- Peças adaptadas da template Breu (ProfitizeBuild; licença: usar nos projetos dela, não revender nem publicar o prompt):
  - `src/motion/logo-intro.js`: intro do logo (substitui o antigo loader): o pentagrama aparece, "raven witch" sai de trás
    dele e o conjunto voa até `.nav__brand`. Markup em `gen3.py` (`.logo-intro`) e CSS crítico inline (`INTRO_HEAD`).
    A marca da nav e a da intro usam o mesmo `.brand` em em: mudou uma, mude a outra.
  - `src/motion/pill.js`: "ritual" no título final numa pill de vidro que um fio de luz contorna (`PILL` em `gen3.py`).
  - `src/motion/agua.js`: o rodapé com "Raven Witch" sobre a água; uma gota de luz cai e o nome acende (`AGUA` em `gen3.py`).
  - Estilos das três em `src/sections/breu.css` (luz de vela: osso, ouro e magenta).
- Caminhos de imagens e fontes são relativos (`img/...`, `fonts/...`, sem `/` no começo) por causa do GitHub Pages.
- `src/gl/world.js`: canvas WebGL do fundo (estrelas, fluxo de faíscas, título desenhado, objetos `[data-obj]`).
- `src/gl/heroi.js`: a bruxinha da capa (arte `public/img/fechamento.webp`) — respira, pisca, embaralha;
  ao tocar, uma carta voa e o gatinho busca.
- `src/gl/shaders.js`: shaders (imagens, nebulosa/chama negra, partículas).
- `src/motion/site.js`: abas/painéis (`.tabp`, botões de área `[data-area]`), parede 3D de prints, lightbox.
- `src/motion/oraculo.js` + `arcanos.js`: Oráculo (arcano do dia/semana, 22 arcanos com conselhos).
- Estilos: `src/styles/tokens.css` → `pixel.css` → `elegante.css` (visual atual) → `mobile.css` (celular).
- `public/img` imagens, `public/fb` 20 prints de feedback, `public/fonts` fontes (carregadas por `src/motion/carga.js`).

## Pendências
- Conteúdo das abas Consultar, Biblioteca e Comunidade (ela vai enviar).
- Seção "Sobre mim" (ela vai enviar o texto).
- Política diz "página web ou número de contato": hoje o agendamento é só pela DM — confirmar com ela.
- Hospedagem: dentro do repo darklithimports.github.io. Este código-fonte fica em `_raven-witch/` (o GitHub Pages ignora pastas com `_`) e o site publicado em `raven-witch/`. Para publicar uma mudança: `npm install - Hospedagem: GitHub Pages pelo workflow `.github/workflows/pages.yml` (cada push na `main` publica); domínio próprio opcional.- Hospedagem: GitHub Pages pelo workflow `.github/workflows/pages.yml` (cada push na `main` publica); domínio próprio opcional. npm run build` aqui e copiar `dist/` por cima de `../raven-witch/`.
