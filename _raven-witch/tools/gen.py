import html
E=html.escape
IG="https://instagram.com/raven.witch__"
def price(p):
    if p is None: return '<div class="svc__p svc__p--q">A consultar</div>'
    if p=='moon': return '<div class="svc__p svc__p--moon" aria-label="Valor a partir de R$ 1.333">☾</div>'
    return f'<div class="svc__p"><small>R$</small>{p}</div>'
def card(name,p=None,desc=None,num=None,cls=''):
    n=f'<span class="svc__n">{num}.</span> ' if num else ''
    d=f'<p>{E(desc)}</p>' if desc else ''
    return f'<article class="svc reveal {cls}"><i class="lz lz--l"></i><div class="svc__t"><h3>{n}{E(name)}</h3>{d}</div><span class="svc__sep" aria-hidden="true"></span>{price(p)}<i class="lz lz--r"></i></article>'
DIV='<div class="div" aria-hidden="true"><span class="div__l"></span><i>◆</i><b>☽</b><b>●</b><b>☾</b><i>◆</i><span class="div__l"></span></div>'
def head(num,title,sub=None,small=None):
    s=f'<p class="sec__sub">{E(sub)}</p>' if sub else ''
    return f'<header class="sec__head reveal"><span class="sec__num">{num}</span><h2 class="sec__h">{title}</h2>{s}{DIV}</header>'
def foot(t): return f'<p class="sec__foot reveal">{t}</p>'
def panel(src,alt,cap=None,cls=''):
    c=f'<span class="cap">{cap}</span>' if cap else ''
    return f'<figure class="panel {cls}"><img src="{src}" alt="{E(alt)}" loading="lazy" decoding="async">{c}</figure>'
def frame(inner,cls=''): return f'<div class="frame {cls}"><span class="frame__c tl">✦</span><span class="frame__c tr">✦</span><span class="frame__c bl">✦</span><span class="frame__c br">✦</span>{inner}</div>'

amor=[("FEITIÇO DE AMOR-PRÓPRIO","499","Fortalece a autoconfiança, a conexão consigo mesma e o fortalecimento interior."),
("ADOÇAMENTO AMOROSO DE CASAL","666","Estimula a doçura, o afeto e a harmonia na relação do casal."),
("AMOR SUBLIME","666","Estimula, renova e fortalece o afeto, a união e a harmonia entre casais que já estão juntos."),
("ARREPENDIMENTO E DESESPERO","700","Gera desespero, ansiedade e instabilidade emocional, orientado à reflexão e ao arrependimento."),
("PENSAMENTO OBSESSIVO","800","Gera pensamentos e sonhos recorrentes, criando uma atração energética e mental que favorece a aproximação e a comunicação."),
("COME TO ME BOY","666","Atrai, adoça e intensifica o interesse e a proximidade do rapaz desejado."),
("COME TO ME GIRL","666","Atrai, adoça e intensifica o interesse e a proximidade da moça desejada."),
("ATRAÇÃO SEXUAL E LUXÚRIA","777","Sensualidade, atração física e desejo."),
("DOMINAÇÃO AMOROSA",None,"Influência, controle e maior entrega na relação."),
("BONECO DE DOMINAÇÃO","2.000","Trabalho de dominação e submissão afetiva."),
("RECONCILIAÇÃO AMOROSA","800","Diálogo, aproximação e possível reconciliação.")]
prot=[("UNCROSSING",None),("CORTA E LIMPA","600"),("CORTES ENERGÉTICOS","600"),("CORTE DE VÍCIOS",None),("DIVÓRCIO ENERGÉTICO","477"),("REVERSÃO",None),("CASOS JUDICIAIS",None),("LIMPEZA ENERGÉTICA INDIVIDUAL · SIMPLES","400"),("LIMPEZA, CLAREZA MENTAL E FORTALECIMENTO","666")]
pros=[("DESBLOQUEIO FINANCEIRO","600"),("EXPANSÃO DE NEGÓCIOS","800"),("PROSPERIDADE","500"),("PROSPERIDADE E PROTEÇÃO DAS FINANÇAS","800"),("BLOCK BUSTER","800"),("ABERTURA DE CAMINHOS","666"),("COROA DO SUCESSO","990"),("ATRAÇÃO DE CLIENTES","600"),("FAST MONEY","555")]
mente=[("CAST OFF EVIL","888"),("CLAREZA MENTAL, FORTALECIMENTO E PROTEÇÃO","500"),("CUIDADO MENTAL E PSÍQUICO","666"),("COMUNICAÇÃO E EXPRESSÃO","577")]
poder=[("MEN AT MY FEET","700"),("QUEEN B","770"),("GLAMOUR & BEAUTY","500"),("CORPORAL CHANGE","500"),("AMOR-PRÓPRIO","500")]
lil=[("Limpeza, proteção e renascimento",[("LIMPEZA ESPIRITUAL + PROTEÇÃO","Limpeza profunda de energias, fechamento de acessos e proteção com Lilith."),("QUEBRA DE DEMANDA","Quebra demandas, feitiçaria, bruxaria, alta magia e trabalhos enviados com entidades, deuses ou demônios, conforme a avaliação do caso."),("PROTEÇÃO · BLINDAGEM ESPIRITUAL","Blindagem energética e resguardo espiritual com a energia de Lilith."),("RENASCIMENTO · FECHAMENTO DE CICLOS","Liberação de padrões, encerramento de etapas e abertura de novos caminhos com Lilith."),("CONTRATO ESPIRITUAL","Trabalho individualizado segundo os seus objetivos e pactos com Lilith.")]),
("Soberania e poder pessoal",[("SOBERANIA INTERNA & AUTOCONFIANÇA","Reconecta você com o seu poder, a sua autonomia e a sua essência."),("MAGNETISMO PESSOAL & PODER","Potencializa a sua presença, a sua influência e a sua energia magnética."),("SUCESSO MAGNÉTICO · PROFISSIONAL","Atração de oportunidades, crescimento e reconhecimento profissional."),("CRIATIVIDADE SACRA","Ativa a sua energia criadora, a inspiração e a expressão autêntica."),("TRABALHO OBSCURO · INTERNO","Transformação profunda, conexão com a sua sombra e despertar espiritual.")]),
("Desejo, domínio e sombra",[("LUXÚRIA HIPNÓTICA","Potencializa a sua sensualidade, desejabilidade e poder de atração."),("DOMÍNIO · HOMENS E MULHERES","Influência, controle e submissão. Trabalho personalizado conforme o caso."),("CORDEIRO SUBMISSO","Trabalho para alcançar entrega, obediência e devoção total."),("CRAZY GUY · ATAQUE","Trabalho de ataque para deixá-lo louco, insano e desestabilizar o seu psíquico."),("VAMPIRISMO · ATAQUES","Trabalho avançado para drenar, enfraquecer e controlar energias."),("MALDIÇÃO","Trabalho de ruptura, bloqueios e consequências conforme o caso.")])]

SECS=[("taro","Tarô"),("amor","Amor"),("protecao","Proteção"),("prosperidade","Prosperidade"),("mente","Mente"),("poder","Poder & Beleza"),("lilith","Lilith")]
def menu_item(p,price_): return f'<li class="menu__i"><em>{p}</em><span class="menu__dots" aria-hidden="true"></span><span class="menu__p"><small>R$</small>{price_}</span></li>'

o=[]
o.append(f'''<section class="hero" id="topo">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__grid">
  <div class="hero__in reveal">
    <p class="kicker kicker--box">CATÁLOGO DE SERVIÇOS</p>
    <h1 class="logo-big">RAVEN WITCH</h1>
    <p class="hero__tag">RITUAIS · MAGIA · TRANSFORMAÇÃO</p>
    {DIV}
    <p class="hero__q balloon">“Tarô, rituais e trabalhos espirituais para quem leva o oculto a sério.”</p>
    <nav class="hero__btns" aria-label="Atalhos">{''.join(f'<a class="chip" href="#{i}">{n}</a>' for i,n in SECS)}</nav>
  </div>
  {panel("img/heroina-cemiterio.webp","Bruxa de vestido preto no alto de um cemitério, em ilustração de quadrinho","Capítulo I · O chamado","panel--hero reveal")}
  </div>
</section>''')
# Tarô
o.append(f'''<section class="sec" id="taro">
  {head("I.","LEITURAS DE TARÔ")}
  <div class="grid2">
    {frame('<h3 class="grp">Leituras por perguntas</h3><ul class="menu">'+menu_item("1 pergunta","50")+menu_item("2 perguntas","90")+menu_item("3 perguntas","130")+'</ul>','reveal')}
    {frame('<h3 class="grp">Leituras por tempo</h3><ul class="menu">'+menu_item("Leitura de 30 minutos","150")+menu_item("Leitura de 1 hora","250")+'</ul>','reveal')}
  </div>
  {frame('<p class="star__k">Destaque</p><h3 class="star__h">ORIENTAÇÃO ESPIRITUAL</h3><p class="star__p"><small>R$</small>300</p>','star reveal')}
</section>
<section class="sec" id="metodos">
  {head("I.","LEITURAS COM MÉTODOS","Tiragens específicas para perguntas específicas")}
  <div class="list">
    {card("TOMADA DE DECISÃO","90","Veremos os prós e contras da sua decisão para que você tenha um panorama melhor sobre a sua escolha.")}
    <article class="svc svc--big reveal"><i class="lz lz--l"></i><div class="svc__t"><h3>ESSA PESSOA VALE O INVESTIMENTO?</h3><p>Serve para ficantes, novas amizades, namorados e mais.</p><p class="svc__k">O QUE VEREMOS</p><ul class="moons"><li>Posso confiar nessa pessoa?</li><li>Se eu permanecer, o que tende a acontecer com base na energia que aparece?</li><li>Alerta a respeito dessa pessoa</li><li>Conselho</li></ul></div><span class="svc__sep" aria-hidden="true"></span><div class="svc__p"><small>R$</small>140</div><i class="lz lz--r"></i></article>
  </div>
</section>
<section class="sec" id="ciclo">
  {head("I.","LEITURAS DE CICLO","Semana, mês e ano")}
  <div class="list">
    {card("VEJA A SUA SEMANA","100","A energia da sua semana para você se preparar e compreendê-la melhor + prós e contras + direcionamento. PDF com banho de ervas incluso.")}
    {card("CONSELHO MENSAL","150","A energia do mês + prós e contras + direcionamento. PDF com indicações de banhos de ervas incluso.")}
    {card("MANDALA ASTROLÓGICA ANUAL","300")}
  </div>
</section>
<section class="sec" id="como">
  <header class="sec__head reveal"><span class="sec__num">✦</span><h2 class="sec__h">COMO FUNCIONA</h2><p class="sec__sub">Modalidades de atendimento</p>{DIV}</header>
  <div class="notice reveal"><b>AGENDAMENTO PRÉVIO</b><span>Obrigatório para todos os tipos de consulta.</span></div>
  <ol class="modes">
    <li class="reveal"><span class="dia"><span>I</span></span><div><h3>Leituras por perguntas</h3><p>Realizadas exclusivamente por áudio.</p></div></li>
    <li class="reveal"><span class="dia"><span>II</span></span><div><h3>Leituras por tempo (30 min / 1 hora)</h3><p>Realizadas normalmente por chamada. A modalidade por áudio também está disponível como opção.</p></div></li>
    <li class="reveal"><span class="dia"><span>III</span></span><div><h3>Orientação para trabalhos espirituais</h3><p>Atendimentos realizados por ordem de pagamento e dia de agendamento. Após a conclusão da leitura, todas as informações e detalhes são enviados por áudio.</p></div></li>
  </ol>
</section>''')
o.append(f'''<section class="sec" id="amor">
  {head("II.","AMOR &amp; RELAÇÕES","Rituais para atrair, unir, intensificar e transformar")}
  <div class="list">{''.join(card(n,p,d,i+1) for i,(n,p,d) in enumerate(amor))}</div>
  <h3 class="grp grp--c reveal">Trabalhos em destaque</h3>
  <div class="grid2">
    {card("CRY FOR ME",None,"Promove um profundo impacto emocional, favorecendo a nostalgia, o arrependimento e o desejo de restabelecer o contato. Ajuda a diminuir o orgulho e as resistências emocionais.",cls="svc--big")}
    {card("MIND SHIFT",None,"Trabalho específico para mudar a ideia ou percepção que uma pessoa tem sobre você ou sobre uma situação. Promove uma nova perspectiva, favorecendo a abertura mental e emocional. Pode ser aplicado no âmbito profissional, amoroso ou pessoal.",cls="svc--big")}
  </div>
  {foot("AMOR · DESEJO · PODER")}
</section>''')
o.append(f'''<section class="sec sec--photo sec--velas" id="protecao" style="--foto:url(img/altar-espelho.webp)">
  <div class="sec__photo" aria-hidden="true"></div>
  {head("III.","PROTEÇÃO, LIMPEZAS &amp; REVERSÕES")}
  <div class="list">{''.join(card(n,p) for n,p in prot)}</div>
  {foot("PROTEÇÃO · LIMPEZA · LIBERTAÇÃO")}
</section>
<section class="sec sec--photo sec--gold" id="prosperidade">
  <div class="sec__photo" aria-hidden="true"></div>
  {head("IV.","PROSPERIDADE &amp; NEGÓCIOS")}
  <div class="list">{''.join(card(n,p,num=i+1) for i,(n,p) in enumerate(pros))}</div>
  {foot("ABUNDÂNCIA · SUCESSO · CAMINHOS")}
</section>
<section class="sec sec--fire" id="mente">
  {head("V.","FORTALECIMENTO MENTAL","e transformação pessoal")}
  <div class="split"><div class="list">{''.join(card(n,p) for n,p in mente)}</div>{panel("img/mente-fogo.webp","Bruxa lendo um jornal em chamas, em ilustração de quadrinho","O que não serve, queima","panel--side reveal")}</div>
  {foot("MENTE · DISCERNIMENTO · EXPRESSÃO · TRANSFORMAÇÃO")}
</section>
<section class="sec" id="poder">
  {head("VI.","RITUAIS DE PODER &amp; BELEZA")}
  <div class="list">{''.join(card(n,p) for n,p in poder)}</div>
  {foot("GLAMOUR · PODER · AMOR-PRÓPRIO")}
</section>''')
lb=''.join(f'<h3 class="grp grp--c reveal">{E(g)}</h3><div class="list">'+''.join(card(n,'moon',d) for n,d in items)+'</div>' for g,items in lil)
o.append(f'''<section class="sec sec--lilith" id="lilith">
  {head("VII.","CATÁLOGO LILITH")}
  <div class="lil__top">
    {panel("img/lilith-balanco.webp","Bruxa loira de vestido preto num balanço sob a lua, em ilustração de quadrinho","Lilith","panel--lil reveal")}
    <div class="lil__txt"><div class="seal reveal"><span>A PARTIR DE</span><b><small>R$</small>1.333</b></div>
    <p class="lil__q balloon reveal">“O poder também habita na sua sombra.”</p></div>
  </div>
  {lb}
  {foot("PODER · LIBERDADE · DESEJO · TRANSFORMAÇÃO")}
</section>
<section class="sec" id="feedbacks">
  <header class="sec__head reveal"><span class="sec__num">✦</span><h2 class="sec__h">FEEDBACKS</h2><p class="sec__sub">Os prints, do jeito que chegaram</p>{DIV}</header>
  <div id="parede" class="parede reveal"></div>
  <p class="parede__hint reveal">Passe o mouse para pausar uma coluna · toque num print para ver grande</p>
</section>
<section class="final" id="agendar">
  <div class="final__bg" aria-hidden="true" style="--foto:url(img/altar-espelho.webp)"></div>
  <div class="final__in reveal">
    <p class="kicker">ATENDIMENTO POR ORDEM DE PAGAMENTO</p>
    <h2 class="logo-big logo-big--sm">ESCOLHA O SEU RITUAL</h2>
    {DIV}
    <p class="hero__q">“Envie na DM o nome do serviço escolhido para agendar o seu atendimento.”</p>
    <a class="cta-big" href="{IG}" target="_blank" rel="noopener"><span>@raven.witch__</span></a>
    <p class="kicker kicker--s">AGENDAMENTO PRÉVIO OBRIGATÓRIO</p>
  </div>
</section>''')
catalog='\n'.join(o)
def soon(id_,title,sub):
    return f'''<section class="tabp" id="tab-{id_}" data-tab="{id_}" hidden>
  <div class="sec"><header class="sec__head"><span class="sec__num">✦</span><h2 class="sec__h">{title}</h2>{DIV}</header>
  {frame('<p class="soon">Esta área está sendo preparada.</p><a class="cta-big cta-big--sm" href="'+IG+'" target="_blank" rel="noopener"><span>Falar na DM</span></a>','soon-f')}</div>
</section>'''
page=f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Raven Witch · Catálogo de Serviços</title>
<meta name="description" content="Catálogo de serviços da Raven Witch: leituras de tarô, rituais de amor, proteção, prosperidade, poder e Catálogo Lilith. Agendamento pela DM do Instagram @raven.witch__.">
<meta name="theme-color" content="#0c0608">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap">
<link rel="stylesheet" href="/src/styles.css">
</head>
<body>
<header class="top" id="top">
  <div class="top__row">
    <a class="top__logo" href="#catalogo">RAVEN WITCH</a>
    <nav class="tabs" role="tablist" aria-label="Áreas">
      <a role="tab" href="#catalogo" data-go="catalogo" aria-selected="true">Catálogo</a>
      <a role="tab" href="#consultar" data-go="consultar" aria-selected="false">Consultar</a>
      <a role="tab" href="#biblioteca" data-go="biblioteca" aria-selected="false">Biblioteca</a>
      <a role="tab" href="#comunidade" data-go="comunidade" aria-selected="false">Comunidade</a>
    </nav>
  </div>
  <nav class="sub" aria-label="Seções do catálogo" data-sub>
    {' <span aria-hidden="true">·</span> '.join(f'<a href="#{i}" data-s="{i}">{n}</a>' for i,n in SECS)}
  </nav>
</header>
<main>
<div class="tabp" id="tab-catalogo" data-tab="catalogo">
{catalog}
</div>
{soon("consultar","CONSULTAR","Tire as suas dúvidas antes de agendar")}
{soon("biblioteca","BIBLIOTECA","Conteúdos e materiais da Raven Witch")}
{soon("comunidade","COMUNIDADE","Um espaço para quem caminha junto")}
</main>
<footer class="foot"><p><b>RAVEN WITCH</b> · Rituais · Magia · Transformação · <a href="{IG}" target="_blank" rel="noopener">@raven.witch__</a></p></footer>
<a class="fab" href="{IG}" target="_blank" rel="noopener">Agendar na DM</a>
<script type="module" src="/src/main.tsx"></script>
</body>
</html>
'''
open('/home/claude/raven-catalogo/index.html','w').write(page)
print(len(page))
