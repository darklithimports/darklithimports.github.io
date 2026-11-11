# Raven Witch · página (v3): menos coisa na landing. Feitiços e Rituais viram dois painéis que abrem por botão;
# "Clientes" no menu leva aos feedbacks; o Oráculo da bruxinha tira um arcano do dia ou da semana.
import html
G = __import__('os').path.join(__import__('os').path.dirname(__file__), 'gen.py')
src = open(G).read(); src = src[:src.index("o=[]")]
ns = {}; exec(src, ns)
card, frame, menu_item, E, IG = ns['card'], ns['frame'], ns['menu_item'], ns['E'], ns['IG']
amor, prot, pros, mente, poder, lil = ns['amor'], ns['prot'], ns['pros'], ns['mente'], ns['poder'], ns['lil']

STAR = "M0 40 L-23.51 -32.36 L38.04 12.36 L-38.04 12.36 L23.51 -32.36 Z"
PENT = '<svg class="nav__mark" aria-hidden="true"><use href="#pent"/></svg>'
# Breu (ProfitizeBuild), adaptado: a pill de vidro que acende na palavra do título final
PILL = ('<span class="pill" data-pill><span class="pill__glass"></span>'
        '<svg class="pill__edge" data-pill-edge aria-hidden="true"><path/><path/></svg>'
        '<span class="pill__glow" aria-hidden="true">ritual</span><span class="pill__txt">ritual</span>'
        '<i class="pill__line" aria-hidden="true"></i></span>')
# Breu, adaptado: o nome no rodapé acende sobre a água parada quando uma gota de luz cai
_NOME = '<text fill="url(#rw-luz)">Raven Witch</text>'
AGUA = ('<div class="agua" data-agua role="img" aria-label="Raven Witch">'
        '<i class="agua__gota" aria-hidden="true"></i>'
        '<svg class="agua__nome" aria-hidden="true"><defs><radialGradient id="rw-luz" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="0.01">'
        '<stop offset="0" stop-color="#fff6ea"/><stop offset="0.3" stop-color="#f6d7a8"/><stop offset="0.62" stop-color="#e07bbf"/>'
        '<stop offset="0.9" stop-color="#8a2a6e"/><stop offset="1" stop-color="#241020"/></radialGradient></defs>' + _NOME + '</svg>'
        '<svg class="agua__brilho" aria-hidden="true">' + _NOME + '</svg>'
        '<i class="agua__linha" aria-hidden="true"></i><i class="agua__anel" aria-hidden="true"></i>'
        '<svg class="agua__reflexo" aria-hidden="true">' + _NOME + '</svg></div>')
# Breu, adaptado: a intro do logo (o pentagrama aparece, "raven witch" sai de trás dele e o conjunto voa até a nav).
# CSS crítico inline para o primeiro quadro já sair certo; o failsafe tira a intro se o JS não subir.
INTRO_HEAD = '''  <script>
    (function () {
      var d = document.documentElement;
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) d.classList.add('logo-intro-on');
      setTimeout(function () { if (!window.__logoIntroBooted) { d.classList.remove('logo-intro-on'); d.classList.add('logo-intro-done'); } }, 3500);
    })();
  </script>
  <style>
    .logo-intro { display: none; }
    .logo-intro-on .logo-intro { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; background: #0b0810; }
    .brand { display: inline-flex; align-items: center; gap: 0.5em; font-family: 'Pinyon Script', 'Cormorant Garamond', serif; font-weight: 700; letter-spacing: 0.04em; line-height: 1; color: #f6eee2; }
    .brand__mark { flex: none; width: 1.06em; height: 1.06em; color: #c2459a; }
    .brand__mark svg { display: block; width: 100%; height: 100%; overflow: visible; }
    .brand__word { display: block; padding: 0.12em 0.1em 0.18em 0; }
    .logo-intro__logo { font-size: clamp(44px, 9vw, 120px); transform-origin: 0 0; }
    .logo-intro__logo .brand__mark { position: relative; z-index: 1; opacity: 0; filter: drop-shadow(0 0 0.12em rgba(194, 69, 154, 0.8)); }
    .logo-intro__logo .brand__word {
      --reveal: -20%;
      -webkit-mask-image: linear-gradient(90deg, #000 calc(var(--reveal) - 18%), transparent var(--reveal));
      mask-image: linear-gradient(90deg, #000 calc(var(--reveal) - 18%), transparent var(--reveal));
    }
    .logo-intro-on:not(.logo-intro-done) .nav__brand { visibility: hidden; }
  </style>'''
DIV = '<div class="div" aria-hidden="true"><span class="div__l"></span><i>◆</i><b>☽</b><svg class="div__pent" data-draw aria-hidden="true"><use href="#pent"/></svg><b>☾</b><i>◆</i><span class="div__l"></span></div>'
RING_TXT = '✦ RAVEN WITCH ✦ TARÔ ✦ RITUAIS ✦ MAGIA ✦ TRANSFORMAÇÃO ✦ LILITH'

def head(num, title, sub=None):
    s = f'<p class="sec__sub">{E(sub)}</p>' if sub else ''
    return f'<header class="sec__head reveal"><span class="sec__num">{num}</span><h2 class="sec__h">{title}</h2>{s}{DIV}</header>'
def foot(t): return f'<p class="sec__foot reveal">{t}</p>'
def obj(key, label, cap, cls, way=True, anchor=True, w='0.1'):
    attrs = (' data-way' if way else '') + (' data-anchor' if anchor else '') + f' data-w="{w}"'
    return f'<figure class="panel {cls}"><div class="obj" data-obj="{key}"{attrs} role="img" aria-label="{E(label)}"></div><figcaption class="capbox">{cap}</figcaption></figure>'
ICO_GO = '<svg class="btn__ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.8v10.4L13 8z" fill="currentColor"/></svg>'
ICO_P = '<svg class="btn__ico" aria-hidden="true"><use href="#pent"/></svg>'

limp = [("PROTEÇÃO COMPLETA", "700", "Inclui reversão com espelhos."), ("PROTEÇÃO COM FOCO NA ÁREA PROFISSIONAL / FINANÇAS", "577", None), ("HEAL MIND", "500", None)]
selfs = [("MAGNETISMO & ATRAÇÃO FINANCEIRA", "600", "Ativa o seu magnetismo pessoal para que você atue como um ímã. Além de fortalecer a sua presença e o seu poder de atração, direciona essa energia para o lado material, abrindo caminho para dinheiro, oportunidades, clientes e prosperidade."), ("MAGNETISMO & ATRAÇÃO", "600", "Focado em atrair pessoas. Você escolhe o gênero: homens, mulheres ou ambos, e o trabalho pode ser personalizado. Atrai olhares e desperta o interesse das pessoas por você, para que não passe despercebida onde quer que vá, magnetizando pessoas para você."), ("GLAMOUR & BEAUTY", "600", None)]
poder = [it for it in poder if it[0] != "GLAMOUR & BEAUTY"]
n_feit = len(amor) + 2 + len(pros) + len(mente) + len(limp) + len(selfs)
n_rit = len(prot) + len(poder) + sum(len(i) for _, i in lil)
lil_html = ''.join(f'<h3 class="grp grp--c">{E(g)}</h3><div class="list">' + ''.join(card(n, 'moon', d) for n, d in items) + '</div>' for g, items in lil)

def drawer(key, title, sub, chips, inner):
    ch = ''.join(f'<a href="#{i}" class="area" data-area><span>{n}</span></a>' for j, (i, n) in enumerate(chips))
    return f'''<div class="tabp tabp--cat" id="{key}" data-panel="{key}" data-lenis-prevent hidden role="dialog" aria-modal="true" aria-label="{title}">
    <div class="tabp__bar"><button type="button" class="tabp__x" data-close aria-label="Voltar para a página">← Voltar</button><p class="tabp__t">{title}<small>{sub}</small></p><a class="btn btn--primary btn--sm" href="{IG}" target="_blank" rel="noopener">Agendar na DM</a></div>
    {'<p class="tabp__note"><b>Orientação espiritual prévia</b> ' + 'Não realizo trabalhos espirituais sem oráculo prévio.' + ' Ela é necessária para quem deseja adquirir algum feitiço ou ritual.</p>' if key in ('feiticos', 'rituais') else ''}
    <nav class="tabp__areas" aria-label="Áreas"><p class="tabp__ask">Escolha a área</p><div class="areas" style="--n:{len(chips)}">{ch}</div></nav>
    <div class="tabp__in">{inner}
      <div class="tabp__end" data-end><p class="final__q">“Envie na DM o nome do serviço escolhido para agendar o seu atendimento.”</p><a class="cta-big" href="{IG}" target="_blank" rel="noopener"><span>@raven.witch__</span></a><p class="kicker kicker--s">Atendimento por ordem de pagamento · agendamento prévio obrigatório</p></div>
    </div>
  </div>'''

feiticos = drawer('feiticos', 'Feitiços', f'{n_feit} trabalhos', [('amor', 'Amor'), ('prosperidade', 'Finanças &amp; área material'), ('limpeza', 'Limpezas &amp; proteções'), ('self', 'Glamour, beleza &amp; self spells'), ('mente', 'Fortalecimento mental')], f'''
      <section class="sec" id="amor">
        {head("I.", "AMOR &amp; RELAÇÕES", "Rituais para atrair, unir, intensificar e transformar")}
        <div class="list">{''.join(card(n, p, d, i + 1) for i, (n, p, d) in enumerate(amor))}</div>
        <h3 class="grp grp--c">Trabalhos em destaque</h3>
        <div class="grid2">
          {card("CRY FOR ME", None, "Promove um profundo impacto emocional, favorecendo a nostalgia, o arrependimento e o desejo de restabelecer o contato. Ajuda a diminuir o orgulho e as resistências emocionais.", cls="svc--big")}
          {card("MIND SHIFT", None, "Trabalho específico para mudar a ideia ou percepção que uma pessoa tem sobre você ou sobre uma situação. Promove uma nova perspectiva, favorecendo a abertura mental e emocional. Pode ser aplicado no âmbito profissional, amoroso ou pessoal.", cls="svc--big")}
        </div>
        {foot("AMOR · DESEJO · PODER")}
      </section>
      <section class="sec sec--gold" id="prosperidade">
        {head("II.", "PROSPERIDADE &amp; NEGÓCIOS")}
        <div class="list">{''.join(card(n, p, num=i + 1) for i, (n, p) in enumerate(pros))}</div>
        {foot("ABUNDÂNCIA · SUCESSO · CAMINHOS")}
      </section>
      <section class="sec" id="mente">
        {head("III.", "FORTALECIMENTO MENTAL", "e transformação pessoal")}
        <div class="list">{''.join(card(n, p) for n, p in mente)}</div>
        {foot("MENTE · DISCERNIMENTO · EXPRESSÃO · TRANSFORMAÇÃO")}
      </section>
      <section class="sec" id="limpeza">
        {head("IV.", "LIMPEZA &amp; PROTEÇÃO")}
        <div class="list">{''.join(card(n, p, d) for n, p, d in limp)}</div>
      </section>
      <section class="sec" id="self">
        {head("V.", "GLAMOUR, BELEZA &amp; SELF SPELLS")}
        <div class="list">{''.join(card(n, p, d) for n, p, d in selfs)}</div>
      </section>''')

rituais = drawer('rituais', 'Rituais', f'{n_rit} trabalhos', [('protecao', 'Proteção, limpezas &amp; reversões'), ('poder', 'Poder &amp; beleza'), ('lilith', 'Catálogo Lilith')], f'''
      <section class="sec sec--velas" id="protecao">
        {head("I.", "PROTEÇÃO, LIMPEZAS &amp; REVERSÕES")}
        <div class="list">{''.join(card(n, p) for n, p in prot)}</div>
        {foot("PROTEÇÃO · LIMPEZA · LIBERTAÇÃO")}
      </section>
      <section class="sec" id="poder">
        {head("II.", "RITUAIS DE PODER &amp; BELEZA")}
        <div class="list">{''.join(card(n, p) for n, p in poder)}</div>
        {foot("GLAMOUR · PODER · AMOR-PRÓPRIO")}
      </section>
      <section class="sec sec--lilith" id="lilith">
        {head("III.", "CATÁLOGO LILITH")}
        <div class="lil__txt"><div class="seal"><span>A PARTIR DE</span><b><small>R$</small>1.333</b></div><p class="lil__q">“O poder também habita na sua sombra.”</p></div>
        {lil_html}
        {foot("PODER · LIBERDADE · DESEJO · TRANSFORMAÇÃO")}
      </section>''')

leituras = drawer('leituras', 'Leituras', 'tarô', [('taro', 'Leituras de tarô'), ('metodos', 'Leituras com métodos'), ('ciclo', 'Leituras de ciclo')], f'''
      <section class="sec" id="taro">
      {head("I.", "LEITURAS DE TARÔ")}
      <div class="taro__grid">
        <div class="taro__menus">
          {frame('<h3 class="grp">Leituras por perguntas</h3><ul class="menu">' + menu_item("1 pergunta", "50") + menu_item("2 perguntas", "90") + menu_item("3 perguntas", "130") + '</ul>')}
          {frame('<h3 class="grp">Leituras por tempo</h3><ul class="menu">' + menu_item("Leitura de 30 minutos", "150") + menu_item("Leitura de 1 hora", "250") + '</ul>')}
          {frame('<p class="star__k">Destaque</p><h3 class="star__h">ORIENTAÇÃO ESPIRITUAL</h3><p class="star__p"><small>R$</small>300</p><p class="star__d">As orientações espirituais são necessárias para quem deseja adquirir algum feitiço ou ritual. Nelas verificamos tudo o que é preciso para seguir adiante com o trabalho.</p><p class="star__n">Não realizo trabalhos espirituais sem oráculo prévio.</p>', 'star')}
        </div>
      </div>
      </section>
      <section class="sec" id="metodos">
      {head("I.", "LEITURAS COM MÉTODOS", "Tiragens específicas para perguntas específicas")}
      <div class="list">
        {card("TOMADA DE DECISÃO", "90", "Veremos os prós e contras da sua decisão para que você tenha um panorama melhor sobre a sua escolha.")}
      </div>
      </section>
      <section class="sec" id="ciclo">
      {head("I.", "LEITURAS DE CICLO", "Semana, mês e ano")}
      <div class="list">
        {card("VEJA A SUA SEMANA", "80", "A energia da sua semana para você se preparar e compreendê-la melhor + prós e contras + direcionamento. PDF com banho de ervas incluso.")}
        {card("CONSELHO MENSAL", "150", "A energia do mês + prós e contras + direcionamento. PDF com indicações de banhos de ervas incluso.")}
        {card("MANDALA ASTROLÓGICA ANUAL", "300")}
      </div>
      </section>''')

def door(key, title, cats, count, objkey, label, cap):
    return f'''<article class="door reveal">
          {obj(objkey, label, cap, 'panel--door')}
          <div class="door__t">
            <p class="eyebrow">{count}</p>
            <h3 class="door__h">{title}</h3>
            <ul class="door__cats">{''.join(f'<li>{c}</li>' for c in cats)}</ul>
            <a class="btn btn--primary" href="#{key}" data-tab="{key}">{ICO_P}Ver {title.lower()} e valores</a>
          </div>
        </article>'''

body = f'''
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="pent" viewBox="-50 -50 100 100"><circle r="46" fill="none" stroke="currentColor" stroke-width="5"/><path d="{STAR}" transform="scale(1.1)" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="miter"/></symbol>
<path id="sig-arc" d="M0,-88 A88,88 0 1,1 -0.01,-88"/>
</defs></svg>
<div class="logo-intro" data-logo-intro aria-hidden="true">
  <div class="brand logo-intro__logo" data-logo-intro-logo>
    <span class="brand__mark" data-logo-intro-mark><svg aria-hidden="true"><use href="#pent"/></svg></span>
    <span class="brand__word" data-logo-intro-word>raven witch</span>
  </div>
</div>
<div class="cursor-fx" aria-hidden="true"><canvas></canvas></div>
  <canvas class="world" aria-hidden="true"></canvas>

  <header class="nav" data-nav>
    <div class="wrap nav__in">
      <a class="nav__brand brand" href="#topo" aria-label="Raven Witch, voltar ao topo"><span class="brand__mark"><svg aria-hidden="true"><use href="#pent"/></svg></span><span class="brand__word">raven witch</span></a>
      <nav class="tabs" aria-label="Áreas">
        <a href="#topo" data-tab="catalogo" aria-current="page">Catálogo</a>
        <a href="#clientes" class="tabs__cli">Clientes</a>
        <a href="#consultar" data-tab="consultar">Consultar</a>
        <a href="#biblioteca" data-tab="biblioteca">Biblioteca</a>
        <a href="#comunidade" data-tab="comunidade">Comunidade</a>
      </nav>
      <a class="btn btn--primary btn--sm nav__cta" href="{IG}" target="_blank" rel="noopener">Agendar na DM</a>
    </div>
    <nav class="wrap sub" aria-label="Seções">
      <a href="#leituras" data-tab="leituras">Leituras</a> <span aria-hidden="true">·</span> <a href="#como" data-s="como">Como funciona</a> <span aria-hidden="true">·</span> <a href="#feiticos" data-tab="feiticos">Feitiços</a> <span aria-hidden="true">·</span> <a href="#rituais" data-tab="rituais">Rituais</a> <span aria-hidden="true">·</span> <a href="#clientes" data-s="clientes">Clientes</a> <span aria-hidden="true">·</span> <a href="#oraculo" data-s="oraculo">Oráculo</a> <span aria-hidden="true">·</span> <a href="#politicas" data-s="politicas">Políticas</a>
    </nav>
  </header>

  <main id="topo">
    <section class="hero" data-scene="hero">
      <div class="hero__maos" data-obj="maos" aria-hidden="true"></div>
      <div class="hero__bruxa" data-obj="bruxa" role="img" aria-label="A bruxinha de cabelo preto e franja tirando cartas de tarô no seu quarto, com um gatinho preto"></div>
      <h1 class="hero__title" data-title><span class="w w1">Raven</span> <span class="w w2">Witch</span></h1>
      <div class="hero__foot">
        <div class="hero__lead">
          <p class="kicker kicker--box">Catálogo de serviços</p>
          <p class="hero__tagl">Rituais · Magia · Transformação</p>
          <p class="balloon">“Tarô, rituais e trabalhos espirituais para quem leva o oculto a sério.”</p>
          <div class="hero__ctas">
            <a class="btn btn--primary" href="#servicos">{ICO_P}Ver o catálogo</a>
            <a class="btn btn--secondary" href="{IG}" target="_blank" rel="noopener">{ICO_GO}Agendar na DM</a>
          </div>
        </div>
      </div>
      <p class="hero__scroll" aria-hidden="true"><i></i>Toque na bruxinha</p>
    </section>

    <section class="section como" id="como-e">
      <div class="wrap como__grid">
        <div class="como__l">
          <span class="eyebrow" data-reveal>Como é uma consulta</span>
          <h2 class="h2" data-lines>Da pergunta<br>à resposta<br>por áudio.</h2>
          <div class="prompt card" data-prompt data-reveal data-frase="O que as cartas dizem sobre a minha semana?" data-busy="Embaralhando" data-ok="Leitura pronta · enviada por áudio">
            <span class="prompt__label">A sua pergunta</span>
            <p class="prompt__field"><span data-prompt-text></span><i class="prompt__caret" aria-hidden="true"></i></p>
            <div class="prompt__bar"><span class="prompt__status" data-prompt-status>Tarô · leitura de ciclo</span><span class="prompt__go" data-prompt-go><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M9 4.5 12.5 8 9 11.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span></div>
          </div>
          <ol class="steps">
            <li class="step" data-reveal><span class="step__n">I</span><b>Você escolhe</b><p>O serviço do catálogo, e envia o nome dele na DM.</p></li>
            <li class="step" data-reveal data-delay="0.08"><span class="step__n">II</span><b>Agendamento prévio</b><p>Obrigatório para todos os tipos de consulta.</p></li>
            <li class="step" data-reveal data-delay="0.16"><span class="step__n">III</span><b>A resposta</b><p>Por áudio nas leituras por perguntas; por chamada nas leituras por tempo.</p></li>
          </ol>
        </div>
        <div class="como__r">{obj('altar', 'Altar com vela vermelha acesa, espelho ornamentado e livros antigos', 'O altar', 'panel--como')}</div>
      </div>
    </section>

    <section class="sec" id="servicos">
      {head("✦", "LEITURAS, FEITIÇOS &amp; RITUAIS", "Escolha a categoria para ver todos os trabalhos e valores")}
      <div class="doors">
        {door('leituras', 'Leituras', ['Leituras de tarô por perguntas e por tempo', 'Leituras com métodos', 'Leituras de ciclo'], 'Tarô', 'olho', 'Bruxa de vestido preto no alto de um cemitério, em ilustração de quadrinho', 'Leituras')}
        {door('feiticos', 'Feitiços', ['Amor', 'Finanças &amp; área material', 'Limpezas &amp; proteções', 'Glamour, beleza &amp; self spells', 'Fortalecimento mental'], f'{n_feit} trabalhos', 'marca', 'Bruxa lendo um jornal em chamas, em ilustração de quadrinho', 'Feitiços')}
        {door('rituais', 'Rituais', ['Proteção, limpezas &amp; reversões', 'Poder &amp; beleza', 'Catálogo Lilith'], f'{n_rit} trabalhos', 'lua', 'Bruxa loira de vestido preto num balanço sob a lua, em ilustração de quadrinho', 'Rituais')}
      </div>
    </section>

    <section class="sec" id="como">
      <header class="sec__head"><span class="sec__num">✦</span><h2 class="sec__h">COMO FUNCIONA</h2><p class="sec__sub">Modalidades de atendimento</p>{DIV}</header>
      <div class="notice"><b>AGENDAMENTO PRÉVIO</b><span>Obrigatório para todos os tipos de consulta.</span></div>
      <ol class="modes">
        <li><span class="dia"><span>I</span></span><div><h3>Leituras por perguntas</h3><p>Realizadas exclusivamente por áudio.</p></div></li>
        <li><span class="dia"><span>II</span></span><div><h3>Leituras por tempo (30 min / 1 hora)</h3><p>Realizadas normalmente por chamada. A modalidade por áudio também está disponível como opção.</p></div></li>
        <li><span class="dia"><span>III</span></span><div><h3>Orientação para trabalhos espirituais</h3><p>As orientações espirituais são necessárias para quem deseja adquirir algum feitiço ou ritual. Nelas verificamos tudo o que é preciso para seguir adiante com o trabalho.</p><p class="mode__n">Não realizo trabalhos espirituais sem oráculo prévio.</p><p>Atendimentos realizados por ordem de pagamento e dia de agendamento. Após a conclusão da leitura, todas as informações e detalhes são enviados por áudio.</p></div></li>
      </ol>
    </section>

    <section class="sec" id="clientes">
      <header class="sec__head"><span class="sec__num">✦</span><h2 class="sec__h">CLIENTES</h2><p class="sec__sub">Feedbacks reais, do jeito que chegaram</p>{DIV}</header>
      <section class="t3d-root" id="t3d" tabindex="0" aria-label="Feedbacks de clientes"><div class="t3d-scene"><div class="t3d-plane" id="t3d-plane"></div></div><div class="t3d-fade t3d-fade--top"></div><div class="t3d-fade t3d-fade--bottom"></div><div class="t3d-fade t3d-fade--left"></div><div class="t3d-fade t3d-fade--right"></div></section>
      <p class="parede__hint">Passe o mouse para pausar uma coluna · toque num print para ver grande</p>
    </section>

    <section class="section numeros" id="numeros">
      <div class="wrap"><div class="num__r">
        <span class="eyebrow" data-reveal>Quatro anos de cartomancia</span>
        <h2 class="h2" data-lines>Raven Witch<br>em números.</h2>
        <div class="stats">
          <div class="stat" data-reveal><b>4</b><span>anos de cartomancia</span></div>
          <div class="stat" data-reveal data-delay="0.08"><b>9 mil+</b><span>atendimentos em todo o mundo</span></div>
          <div class="stat" data-reveal data-delay="0.16"><b>20</b><span>feedbacks publicados</span></div>
          <div class="stat" data-reveal data-delay="0.24"><b>70+</b><span>serviços no catálogo</span></div>
        </div>
        <div class="world-flags" data-reveal><p class="world-flags__k">Atendimentos em</p><ul><li><svg viewBox="0 0 30 20" role="img" aria-label="Brasil"><title>Brasil</title><rect width="30" height="20" fill="#009c3b"/><path d="M15 2.4 27.4 10 15 17.6 2.6 10z" fill="#ffdf00"/><circle cx="15" cy="10" r="4.6" fill="#002776"/><path d="M10.6 9.2q4.4-1.6 8.8 1.4" stroke="#fff" stroke-width=".8" fill="none"/></svg><span>Brasil</span></li><li><svg viewBox="0 0 30 20" role="img" aria-label="México"><title>México</title><rect width="10" height="20" fill="#006847"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ce1126"/><circle cx="15" cy="10" r="2.6" fill="#8b5a2b"/><path d="M12.6 11.6q2.4 1.6 4.8 0" stroke="#006847" stroke-width=".8" fill="none"/></svg><span>México</span></li><li><svg viewBox="0 0 30 20" role="img" aria-label="Paraguai"><title>Paraguai</title><rect width="30" height="7" fill="#d52b1e"/><rect y="6.6" width="30" height="6.8" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#0038a8"/><circle cx="15" cy="10" r="2.4" fill="none" stroke="#0038a8" stroke-width=".7"/><circle cx="15" cy="10" r=".8" fill="#fedf00"/></svg><span>Paraguai</span></li><li><svg viewBox="0 0 30 20" role="img" aria-label="Japão"><title>Japão</title><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#bc002d"/></svg><span>Japão</span></li><li><svg viewBox="0 0 30 20" role="img" aria-label="Estados Unidos"><title>Estados Unidos</title><rect y="0.00" width="30" height="1.59" fill="#b22234"/><rect y="1.54" width="30" height="1.59" fill="#fff"/><rect y="3.08" width="30" height="1.59" fill="#b22234"/><rect y="4.62" width="30" height="1.59" fill="#fff"/><rect y="6.15" width="30" height="1.59" fill="#b22234"/><rect y="7.69" width="30" height="1.59" fill="#fff"/><rect y="9.23" width="30" height="1.59" fill="#b22234"/><rect y="10.77" width="30" height="1.59" fill="#fff"/><rect y="12.31" width="30" height="1.59" fill="#b22234"/><rect y="13.85" width="30" height="1.59" fill="#fff"/><rect y="15.38" width="30" height="1.59" fill="#b22234"/><rect y="16.92" width="30" height="1.59" fill="#fff"/><rect y="18.46" width="30" height="1.59" fill="#b22234"/><rect width="12.5" height="10.8" fill="#3c3b6e"/><circle cx="1.4" cy="1.4" r=".45" fill="#fff"/><circle cx="3.6" cy="1.4" r=".45" fill="#fff"/><circle cx="5.8" cy="1.4" r=".45" fill="#fff"/><circle cx="8.0" cy="1.4" r=".45" fill="#fff"/><circle cx="10.2" cy="1.4" r=".45" fill="#fff"/><circle cx="1.4" cy="3.4" r=".45" fill="#fff"/><circle cx="3.6" cy="3.4" r=".45" fill="#fff"/><circle cx="5.8" cy="3.4" r=".45" fill="#fff"/><circle cx="8.0" cy="3.4" r=".45" fill="#fff"/><circle cx="10.2" cy="3.4" r=".45" fill="#fff"/><circle cx="1.4" cy="5.4" r=".45" fill="#fff"/><circle cx="3.6" cy="5.4" r=".45" fill="#fff"/><circle cx="5.8" cy="5.4" r=".45" fill="#fff"/><circle cx="8.0" cy="5.4" r=".45" fill="#fff"/><circle cx="10.2" cy="5.4" r=".45" fill="#fff"/><circle cx="1.4" cy="7.4" r=".45" fill="#fff"/><circle cx="3.6" cy="7.4" r=".45" fill="#fff"/><circle cx="5.8" cy="7.4" r=".45" fill="#fff"/><circle cx="8.0" cy="7.4" r=".45" fill="#fff"/><circle cx="10.2" cy="7.4" r=".45" fill="#fff"/><circle cx="1.4" cy="9.4" r=".45" fill="#fff"/><circle cx="3.6" cy="9.4" r=".45" fill="#fff"/><circle cx="5.8" cy="9.4" r=".45" fill="#fff"/><circle cx="8.0" cy="9.4" r=".45" fill="#fff"/><circle cx="10.2" cy="9.4" r=".45" fill="#fff"/></svg><span>Estados Unidos</span></li><li><svg viewBox="0 0 30 20" role="img" aria-label="Canadá"><title>Canadá</title><rect width="30" height="20" fill="#fff"/><rect width="7.5" height="20" fill="#d80621"/><rect x="22.5" width="7.5" height="20" fill="#d80621"/><path d="M15 4.2l1.1 2.2 1.6-.6-.5 3 2-1.6.5 1.2 1.8-.3-.8 2 .9.6-3.2 2.4.4 1.2-2.9-.4v2.6h-.8v-2.6l-2.9.4.4-1.2-3.2-2.4.9-.6-.8-2 1.8.3.5-1.2 2 1.6-.5-3 1.6.6z" fill="#d80621"/></svg><span>Canadá</span></li><li><svg viewBox="0 0 30 20" role="img" aria-label="Colômbia"><title>Colômbia</title><rect width="30" height="10" fill="#fcd116"/><rect y="10" width="30" height="5" fill="#003893"/><rect y="15" width="30" height="5" fill="#ce1126"/></svg><span>Colômbia</span></li><li><svg viewBox="0 0 30 20" role="img" aria-label="Chile"><title>Chile</title><rect width="30" height="20" fill="#fff"/><rect y="10" width="30" height="10" fill="#d52b1e"/><rect width="10" height="10" fill="#0039a6"/><path d="M5 2.4l.9 2.6h2.7l-2.2 1.6.8 2.6L5 7.6 2.8 9.2l.8-2.6L1.4 5h2.7z" fill="#fff"/></svg><span>Chile</span></li></ul></div>
      </div></div>
    </section>

    <section class="sec oraculo" id="oraculo">
      {head("✦", "ORÁCULO", "Um arcano maior para o seu dia ou para a sua semana")}
      <div class="ora">
        <div class="witch-frame"><div class="witch-ring" aria-hidden="true"><svg viewBox="-100 -100 200 200"><circle r="98" class="sg sg--thin"/><circle r="93" class="sg sg--dash"/><text class="sigil__txt"><textPath href="#sig-arc" textLength="545">{RING_TXT}</textPath></text></svg></div><div class="obj obj--fechamento" data-obj="fechamento" role="img" aria-label="A bruxinha tirando cartas de tarô na sua mesa"></div></div>
        <div class="ora__box" data-ora>
          <div class="ora__ask" data-ora-ask>
            <p class="ora__say">A bruxinha embaralha os 22 arcanos maiores e tira uma carta para você, com um conselho.</p>
            <p class="ora__q">Para quando é a sua carta?</p>
            <div class="ora__pick">
              <button type="button" class="btn btn--primary" data-ora-go="dia">{ICO_P}Arcano do dia</button>
              <button type="button" class="btn btn--secondary" data-ora-go="semana">{ICO_P}Arcano da semana</button>
            </div>
          </div>
          <div class="ora__busy" data-ora-busy hidden><span class="ora__dots" aria-hidden="true"><i></i><i></i><i></i></span><p>Embaralhando…</p></div>
          <div class="ora__res" data-ora-res hidden aria-live="polite">
            <div class="arc" data-arc><div class="arc__in"><div class="arc__back" aria-hidden="true"><svg><use href="#pent"/></svg></div><div class="arc__front"><span class="arc__num" data-arc-num></span><svg class="arc__mark" aria-hidden="true"><use href="#pent"/></svg><span class="arc__name" data-arc-name></span></div></div></div>
            <div class="ora__msg">
              <p class="ora__k" data-ora-k></p>
              <h3 class="ora__n" data-ora-n></h3>
              <p class="ora__w" data-ora-w></p>
              <p class="ora__t" data-ora-t></p>
              <p class="ora__note" data-ora-note></p>
              <div class="ora__ctas"><a class="btn btn--primary btn--sm" href="{IG}" target="_blank" rel="noopener">Aprofundar na DM</a><button type="button" class="btn btn--secondary btn--sm" data-ora-other></button></div>
            </div>
          </div>
        </div>
      </div>
      <p class="ora__legal">O oráculo é um conselho simbólico de reflexão. Para uma leitura completa, agende na DM.</p>
    </section>

    <section class="sec pol" id="politicas" lang="es">
      <header class="sec__head reveal"><span class="sec__num">✦</span><h2 class="sec__h">INFORMACIÓN Y POLÍTICAS DE ATENCIÓN</h2><p class="sec__sub">Lee con atención antes de contratar cualquier servicio</p>{DIV}</header>
      <div class="pol__list">
        <details class="pol__item" open>
          <summary><span class="pol__n">01</span><span class="pol__t">¿Cómo funciona el sistema?</span><i class="pol__ic" aria-hidden="true"></i></summary>
          <div class="pol__body">
            <p>Todos los atendimientos se realizan mediante agenda previa, a través de la página web o del número de contacto directo.</p>
            <h4>Proceso</h4>
            <ol class="pol__steps">
              <li>Selecciona el servicio que deseas contratar.</li>
              <li>Completa todos los datos solicitados.</li>
              <li>Escoge una fecha disponible.</li>
              <li>Realiza el pago correspondiente.</li>
              <li>Espera la confirmación de tu agendamiento.</li>
              <li>Recibe tu atención en la fecha establecida.</li>
            </ol>
            <p>El tiempo de entrega de las consultas es de <b>1 a 3 días</b>, dependiendo de la demanda.</p>
            <p>Los agendamientos son anticipados y están sujetos a disponibilidad.</p>
            <p class="pol__alert"><b>Atención prioritaria</b>Para adelantar un turno y pasar a la primera fila de atención, se aplica un recargo del 100% sobre el valor original del servicio.</p>
          </div>
        </details>
        <details class="pol__item">
          <summary><span class="pol__n">02</span><span class="pol__t">Información necesaria para la consulta</span><i class="pol__ic" aria-hidden="true"></i></summary>
          <div class="pol__body">
            <p>Es obligatorio completar los datos solicitados antes de la fecha del atendimiento.</p>
            <h4>Datos requeridos</h4>
            <ul class="pol__ul">
              <li>Nombre y apellido completos.</li>
              <li>Fecha de nacimiento.</li>
              <li>Preguntas específicas que deseas consultar.</li>
            </ul>
            <p>Cuando la consulta involucre a terceros, también se deberán proporcionar los datos de esa persona: nombre, fecha de nacimiento y fotografía actual, cuando esté disponible.</p>
            <p>Se recomienda proporcionar la mayor cantidad de información posible.</p>
            <p class="pol__note"><b>Orientación espiritual</b>No es necesario estar presente durante la lectura. El atendimiento se realiza en la fecha agendada y el resultado se entrega mediante audios con las indicaciones correspondientes.</p>
            <p>Si no sabes cómo formular tus preguntas, recomiendo contratar una lectura por llamada.</p>
          </div>
        </details>
        <details class="pol__item pol__item--warn">
          <summary><span class="pol__n">03</span><span class="pol__t">Política sobre las preguntas</span><span class="pol__tag">Importante</span><i class="pol__ic" aria-hidden="true"></i></summary>
          <div class="pol__body">
            <p class="pol__alert"><b>Una pregunta = un interrogante</b>Cada pregunta contratada corresponde a un único interrogante específico. No está permitido agrupar varias preguntas dentro de una misma frase.</p>
            <h4>Ejemplo</h4>
            <blockquote class="pol__q">«¿Esta persona me ama, tiene sentimientos por mí y va a regresar?»</blockquote>
            <p>Esto corresponde a <b>tres preguntas diferentes</b>.</p>
            <p>Si contratas 3 preguntas, debes enviar exactamente 3 interrogantes.</p>
            <p class="pol__alert">En caso de recibir una pregunta compuesta, únicamente responderé al primer interrogante presentado. Los demás no serán considerados ni habrá consultas adicionales ni compensaciones.</p>
            <p>Las preguntas deben ser claras, específicas y objetivas.</p>
            <div class="pol__cols">
              <div class="pol__col pol__col--no">
                <h4>No se consideran preguntas válidas</h4>
                <ul class="pol__ul">
                  <li>Quiero saber sobre el amor.</li>
                  <li>Quiero saber sobre mis finanzas.</li>
                  <li>Quiero saber sobre mi espiritualidad y mi familia.</li>
                </ul>
                <p class="pol__small">Estas son áreas temáticas, no preguntas concretas.</p>
              </div>
              <div class="pol__col pol__col--yes">
                <h4>Si deseas consultar sobre el amor, especifica qué quieres saber</h4>
                <ul class="pol__ul">
                  <li>¿Mi pareja y yo tendremos futuro juntos?</li>
                  <li>¿Esta persona tiene sentimientos por mí?</li>
                  <li>¿Existe una traición en mi relación?</li>
                </ul>
              </div>
            </div>
            <p>Lo mismo se aplica a las demás áreas. Para una exploración completa de un área, deberás contratar la lectura específica correspondiente.</p>
            <p class="pol__remember"><b>Recuerda:</b> una pregunta es un interrogante específico, no un tema general.</p>
          </div>
        </details>
        <details class="pol__item pol__item--warn">
          <summary><span class="pol__n">04</span><span class="pol__t">Políticas de cancelación y reembolso</span><span class="pol__tag">Importante</span><i class="pol__ic" aria-hidden="true"></i></summary>
          <div class="pol__body">
            <div class="pol__cols">
              <div class="pol__col">
                <h4>Lecturas y consultas</h4>
                <ul class="pol__ul">
                  <li>Se permite solicitar la cancelación dentro de las <b>primeras 24 horas</b> posteriores al pago.</li>
                  <li>Pasado ese plazo, no se realizan devoluciones.</li>
                  <li>Una vez realizada y entregada la consulta, no se admiten reembolsos por inconformidad con los resultados o interpretaciones.</li>
                </ul>
              </div>
              <div class="pol__col">
                <h4>Trabajos espirituales</h4>
                <ul class="pol__ul">
                  <li>Se permite solicitar la cancelación dentro de las <b>primeras 48 horas</b> posteriores al agendamiento.</li>
                  <li>Transcurrido ese plazo, no se realizan devoluciones.</li>
                  <li>Una vez iniciado o realizado el trabajo espiritual, no se admiten solicitudes de reembolso.</li>
                </ul>
              </div>
            </div>
          </div>
        </details>
        <details class="pol__item">
          <summary><span class="pol__n">05</span><span class="pol__t">Lo que debes saber antes de contratar</span><i class="pol__ic" aria-hidden="true"></i></summary>
          <div class="pol__body">
            <p>Mi práctica sigue una línea propia, vinculada a la brujería, la hechicería y el satanismo teísta, siguiendo actualmente el Levhampath.</p>
            <p>Mi metodología y perspectiva espiritual pueden diferir de otras tradiciones y corrientes.</p>
            <p>Al contratar cualquiera de mis servicios, el cliente debe leer y comprender previamente las condiciones de atención.</p>
            <h4>Es responsabilidad del cliente</h4>
            <ul class="pol__ul">
              <li>Proporcionar correctamente todos los datos solicitados.</li>
              <li>Completar sus preguntas antes de la fecha acordada.</li>
              <li>Verificar que la información enviada sea correcta.</li>
              <li>Respetar las condiciones y fechas de agendamiento.</li>
            </ul>
            <p class="pol__alert">No me responsabilizo por limitaciones derivadas de información incompleta o datos que el cliente no haya proporcionado a tiempo. Si los datos o preguntas no están completos en la fecha acordada, el atendimiento podrá verse limitado o necesitar una reprogramación.</p>
          </div>
        </details>
      </div>
      <div class="pol__back"><a class="btn btn--primary" href="#servicos">{ICO_P}Volver a los servicios</a></div>
    </section>

    <section class="final" id="agendar">
      <p class="kicker">Atendimento por ordem de pagamento</p>
      <h2 class="final__title" data-lines>Escolha<br>o seu {PILL}.</h2>
      {DIV}
      <p class="final__q">“Envie na DM o nome do serviço escolhido para agendar o seu atendimento.”</p>
      <div class="final__ctas"><a class="cta-big" href="{IG}" target="_blank" rel="noopener"><span>@raven.witch__</span></a></div>
      <p class="kicker kicker--s">Agendamento prévio obrigatório</p>
    </section>
  </main>

  <footer class="foot" data-scene="foot" id="contato">
    <div class="foot__cols">
      <div><b>Catálogo</b><a href="#leituras" data-tab="leituras">Leituras</a><a href="#feiticos" data-tab="feiticos">Feitiços</a><a href="#rituais" data-tab="rituais">Rituais</a></div>
      <div><b>Raven Witch</b><a href="#politicas">Políticas de atención</a><a href="#clientes">Clientes</a><a href="#oraculo">Oráculo</a><a href="#consultar" data-tab="consultar">Consultar</a><a href="#biblioteca" data-tab="biblioteca">Biblioteca</a><a href="#comunidade" data-tab="comunidade">Comunidade</a></div>
      <div><b>Contato</b><a href="{IG}" target="_blank" rel="noopener">@raven.witch__</a><span>Agendamento pela DM</span></div>
      <div><b>Siga</b><a href="{IG}" target="_blank" rel="noopener">Instagram</a></div>
    </div>
    <div class="foot__legal"><span>RAVEN WITCH · Rituais · Magia · Transformação · @raven.witch__</span><a href="#topo">Voltar ao topo ↑</a></div>
    {AGUA}
  </footer>

  {leituras}
  {feiticos}
  {rituais}
  {''.join(f"""<div class="tabp" id="{k}" data-panel="{k}" data-lenis-prevent hidden role="dialog" aria-modal="true" aria-label="{t}"><div class="tabp__bar"><button type="button" class="tabp__x" data-close aria-label="Voltar para a página">← Voltar</button><p class="tabp__t">{t}</p><a class="btn btn--primary btn--sm" href="{IG}" target="_blank" rel="noopener">Agendar na DM</a></div><div class="tabp__in"><div class="sec"><header class="sec__head"><span class="sec__num">✦</span><h2 class="sec__h">{t.upper()}</h2>{DIV}</header>{frame('<p class="soon">Esta área está sendo preparada.</p><a class="cta-big cta-big--sm" href="'+IG+'" target="_blank" rel="noopener"><span>Falar na DM</span></a>','soon-f')}</div></div></div>""" for k, t in [('consultar', 'Consultar'), ('biblioteca', 'Biblioteca'), ('comunidade', 'Comunidade')])}
  <div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Feedback"><button type="button" class="lb__x" id="lb-x" aria-label="Fechar">✕</button><button type="button" id="lb-p" aria-label="Anterior">‹</button><img id="lb-img" alt=""><button type="button" id="lb-n" aria-label="Próximo">›</button><p class="lb__cap" id="lb-cap"></p></div>
  <a class="fab" href="{IG}" target="_blank" rel="noopener">Agendar na DM</a>
'''
page = f'''<!doctype html>
<html lang="pt-BR" class="is-loading">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Raven Witch · Catálogo de Serviços</title>
  <meta name="description" content="Raven Witch: leituras de tarô, feitiços e rituais. Agendamento pela DM do Instagram @raven.witch__.">
  <meta name="theme-color" content="#0b0810">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
{INTRO_HEAD}
</head>
<body>{body}
  <script type="module" src="/src/main.js"></script>
</body>
</html>
'''
open(__import__('os').path.join(__import__('os').path.dirname(__file__), '..', 'index.html'), 'w').write(page)
print(len(page), n_feit, n_rit)
