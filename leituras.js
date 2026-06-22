<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mapa Numerológico Pitagórico</title>
  <meta name="theme-color" content="#0a0a0f"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Cinzel:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root{
      --bg:#06060c;
      --panel:#0d0d18;
      --card:#101020;
      --gold:#c8a96e;
      --gold2:#e2c98a;
      --gold3:rgba(200,169,110,.15);
      --text:#e0d8c8;
      --muted:#8a8070;
      --line:rgba(200,169,110,.22);
      --line2:rgba(200,169,110,.1);
      --shadow:0 40px 100px rgba(0,0,0,.8);
      --red:rgba(232,128,128,1);
      --redMuted:rgba(232,128,128,.7);
      --redLine:rgba(232,128,128,.25);
      --redBg:rgba(232,128,128,.04);
      --blue:rgba(130,160,220,1);
      --blueMuted:rgba(130,160,220,.7);
      --blueLine:rgba(130,160,220,.25);
      --blueBg:rgba(130,160,220,.04);
      --green:rgba(120,190,150,1);
      --greenMuted:rgba(120,190,150,.7);
      --greenLine:rgba(120,190,150,.25);
      --greenBg:rgba(120,190,150,.04);
    }
    *{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{
      background:var(--bg);
      color:var(--text);
      font-family:'Poppins',system-ui,sans-serif;
      font-size:18px;
      line-height:1.8;
      min-height:100vh;
      overflow-x:hidden;
    }
    body::before{
      content:'';
      position:fixed;inset:0;
      background:
        radial-gradient(ellipse 70% 50% at 10% 0%, rgba(200,169,110,.06) 0%, transparent 55%),
        radial-gradient(ellipse 50% 35% at 90% 8%, rgba(200,169,110,.04) 0%, transparent 50%);
      pointer-events:none;z-index:0;
    }
    .wrap{position:relative;z-index:1;width:min(1100px,calc(100% - 28px));margin:0 auto;padding:40px 0 60px}
    .hidden{display:none!important}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .anim{animation:fadeUp .7s ease both}

    .orn{display:flex;align-items:center;gap:14px;color:var(--gold);font-size:.85rem;letter-spacing:.3em;margin:20px 0}
    .orn::before,.orn::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--line),transparent)}

    /* ── FORMULÁRIO ── */
    #formScreen{max-width:700px;margin:0 auto;text-align:center;padding-top:80px}
    .sigil{
      width:68px;height:68px;border-radius:50%;
      border:1px solid var(--line);
      display:flex;align-items:center;justify-content:center;
      margin:0 auto 32px;
      font-size:1.4rem;color:var(--gold);
      box-shadow:0 0 40px rgba(201,168,76,.1);
    }
    .formTitle{
      font-family:'Poppins',sans-serif;
      font-size:clamp(1.8rem,4.5vw,3rem);
      font-weight:800;color:#f0e8d5;
      line-height:1.2;letter-spacing:.04em;
      margin-bottom:12px;
    }
    .formSub{
      font-size:1rem;color:var(--muted);
      letter-spacing:.15em;margin-bottom:48px;
      font-weight:400;text-transform:uppercase;
    }
    .formCard{
      background:var(--panel);
      border:1px solid var(--line2);
      border-radius:4px;
      padding:36px 40px;
      text-align:left;
      box-shadow:var(--shadow);
    }
    .fieldLabel{
      display:block;
      font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;
      color:var(--gold);margin-bottom:10px;font-weight:400;
    }
    .fieldInput{
      width:100%;padding:15px 18px;
      background:rgba(255,255,255,.03);
      border:1px solid var(--line2);
      border-radius:2px;
      color:var(--text);
      font-family:'Poppins',sans-serif;font-size:1.15rem;
      outline:none;
      transition:border-color .3s,box-shadow .3s;
      margin-bottom:22px;
    }
    .fieldInput:focus{border-color:rgba(201,168,76,.5);box-shadow:0 0 0 3px rgba(201,168,76,.07)}
    .fieldInput::placeholder{color:rgba(154,144,128,.4)}
    .btnReveal{
      width:100%;padding:17px;
      background:transparent;
      border:1px solid var(--gold);
      border-radius:2px;
      color:var(--gold2);
      font-family:'Poppins',sans-serif;font-size:1rem;font-weight:600;
      letter-spacing:.06em;cursor:pointer;
      transition:background .3s,color .3s;
      margin-top:4px;
    }
    .btnReveal:hover{background:rgba(201,168,76,.08)}
    .errMsg{color:#e08080;font-size:.92rem;min-height:1.4em;margin-top:12px;text-align:center}

    /* ── RESULTADO ── */
    #resultScreen{max-width:900px;margin:0 auto}
    .resHeader{text-align:center;padding:60px 0 40px;border-bottom:1px solid var(--line2)}
    .resKicker{font-size:.65rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:16px}
    .resName{font-family:'Poppins',sans-serif;font-size:clamp(1.8rem,4.5vw,3.2rem);font-weight:800;color:#f5eedd;letter-spacing:.06em;}
    .resMeta{color:var(--muted);font-size:.88rem;letter-spacing:.18em;margin-top:10px;text-transform:uppercase}

    /* ── SEÇÕES ── */
    .section{padding:48px 0}
    .sectionHead{
      font-family:'Poppins',sans-serif;font-size:.85rem;font-weight:700;
      color:var(--gold2);letter-spacing:.3em;text-transform:uppercase;
      margin-bottom:32px;display:flex;align-items:center;gap:16px;
    }
    .sectionHead::after{content:'';flex:1;height:1px;background:var(--line2)}

    /* ── PIRÂMIDE ── */
    .pyramidWrap{overflow-x:auto;padding-bottom:8px}
    .pyramidFlex{
      display:flex;flex-direction:column;align-items:center;
      gap:5px;font-family:'Poppins',sans-serif;
      font-size:1rem;font-weight:500;
    }
    .pyrRow{display:flex;gap:5px;justify-content:center;align-items:center}
    .pyrCell{
      width:36px;height:36px;
      display:flex;align-items:center;justify-content:center;
      border:1px solid rgba(200,169,110,.12);
      border-radius:2px;
      color:rgba(224,216,200,.6);
      background:rgba(255,255,255,.015);
      font-size:.95rem;flex-shrink:0;
    }
    .pyrCell.apex{
      color:#fff8e8;border-color:var(--gold2);
      box-shadow:0 0 24px rgba(200,169,110,.4);
      font-weight:700;font-size:1.2rem;
      background:rgba(200,169,110,.08);
    }
    .pyrCell.seq{
      color:#e89090;border-color:rgba(232,144,144,.35);
      background:rgba(232,144,144,.06);
    }
    .letterRow .pyrLetter{
      border:none;background:none;
      color:var(--gold);font-size:.78rem;font-weight:500;
      letter-spacing:.08em;font-family:'Cinzel',serif;
      height:28px;
    }
    .pyrCaption{
      text-align:center;font-size:.7rem;letter-spacing:.25em;
      text-transform:uppercase;color:var(--muted);margin-top:16px;
    }
    .seqAlert{
      margin-top:20px;padding:16px 20px;
      border:1px solid rgba(232,128,128,.25);
      border-radius:2px;background:rgba(232,128,128,.04);
      font-size:.95rem;color:#e8a0a0;
    }
    .seqAlertTitle{font-family:'Cinzel',serif;font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:10px;color:#f0b0b0}
    .seqAlertSub{font-size:.88rem;margin-bottom:12px;color:var(--muted)}
    .seqItem{margin-top:10px;padding-top:10px;border-top:1px solid rgba(232,128,128,.15)}
    .seqNum{font-family:'Cinzel',serif;font-size:1.1rem;color:#f0b0b0;margin-right:10px}
    .seqDesc{font-size:.9rem;line-height:1.6}

    /* ── CARDS ── */
    .cardsGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
    .numCard{
      background:var(--card);border:1px solid var(--line2);
      border-radius:2px;padding:22px 20px;cursor:pointer;
      transition:border-color .25s,background .25s;
    }
    .numCard:hover{border-color:rgba(201,168,76,.35);background:rgba(201,168,76,.03)}
    .numCard.dominant{border-color:rgba(201,168,76,.4)}
    .numCard .cLabel{font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
    .numCard .cVal{font-family:'Poppins',sans-serif;font-size:2.8rem;color:#f0e8d5;line-height:1;margin-bottom:8px;}
    .numCard .cTit{color:var(--muted);font-size:.95rem;font-style:italic}
    .numCard .cSub{color:rgba(138,128,112,.5);font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;margin-top:6px}

    .domSection{margin-top:28px;padding:24px;border:1px solid var(--line2);border-radius:2px;background:rgba(201,168,76,.03);}
    .domTitle{font-family:'Poppins',sans-serif;font-size:1.1rem;color:var(--gold2);margin-bottom:16px;font-weight:400;}
    .domItem{margin-bottom:12px;color:var(--text);font-size:1rem;line-height:1.7}
    .domItem strong{color:var(--gold2)}

    /* ── ACCORDION ── */
    .accordion{display:grid;gap:10px;margin-top:8px}
    .accItem{border:1px solid var(--line2);border-radius:2px;overflow:hidden}
    .accHead{
      width:100%;background:none;border:none;color:var(--text);padding:20px 22px;
      display:flex;justify-content:space-between;align-items:center;
      cursor:pointer;text-align:left;transition:background .2s;
    }
    .accHead:hover{background:rgba(201,168,76,.04)}
    .accLeft{display:flex;flex-direction:column;gap:4px}
    .accLeft .aLabel{font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold)}
    .aLabelSub{color:var(--muted);letter-spacing:.1em;text-transform:none;font-size:.85em}
    .accLeft .aNum{font-family:'Poppins',sans-serif;font-size:1.5rem;color:#f0e8d5;}
    .accLeft .aTit{font-size:.9rem;color:var(--muted);font-style:italic}
    .accChev{color:var(--gold);font-size:1.1rem;transition:transform .3s}
    .accItem.open .accChev{transform:rotate(180deg)}
    .accBody{max-height:0;overflow:hidden;transition:max-height .5s ease,padding .4s;border-top:1px solid transparent;}
    .accItem.open .accBody{max-height:4000px;padding:28px 28px 32px;border-top-color:var(--line2);}
    .reading{display:grid;gap:16px}
    .reading p{color:#d8cdb8;font-size:1.08rem;line-height:1.9}
    .reading p.statement{color:#f0e8d5;font-size:1.15rem;font-style:italic;border-left:2px solid var(--gold);padding-left:18px;}
    .readingAffirm{
      margin-top:8px;padding:16px 20px;
      border:1px solid var(--line);border-radius:2px;
      background:rgba(200,169,110,.05);
      font-size:1rem;color:var(--gold2);line-height:1.7;
      font-style:italic;
    }
    .readingAffirm strong{font-style:normal;color:var(--gold);font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:6px;}

    /* ── PINÁCULOS ── */
    .pinsWrap{display:grid;gap:16px}
    .pinRow{
      display:grid;grid-template-columns:1fr auto 1fr;
      align-items:center;gap:16px;
      padding:20px 24px;
      border:1px solid var(--line2);border-radius:2px;
      background:var(--card);
    }
    .pinRow.active{border-color:rgba(201,168,76,.4);background:rgba(201,168,76,.03)}
    .pinLeft{display:flex;flex-direction:column;gap:4px}
    .pinLabel{font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold)}
    .pinTit{font-family:'Poppins',sans-serif;font-size:.95rem;color:var(--muted);font-style:italic}
    .pinPeriod{font-size:.8rem;color:var(--muted);letter-spacing:.05em}
    .pinNum{
      font-family:'Poppins',sans-serif;font-size:3rem;
      color:#f0e8d5;line-height:1;text-align:center;min-width:60px;
    }
    .pinRow.active .pinNum{color:var(--gold2)}
    .pinRight{display:flex;flex-direction:column;gap:4px;text-align:right}
    .pinDesc{font-size:.9rem;color:var(--muted);font-style:italic;line-height:1.5}
    .pinActiveBadge{
      display:inline-block;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;
      color:var(--gold);border:1px solid var(--line);padding:3px 8px;border-radius:1px;
      margin-top:4px;
    }

    /* ── DESAFIOS ── */
    .desafiosGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
    .desafioCard{
      background:var(--card);border:1px solid var(--redLine);
      border-radius:2px;padding:22px 20px;
    }
    .desafioCard .dLabel{font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:var(--red);margin-bottom:12px}
    .desafioCard .dVal{font-family:'Poppins',sans-serif;font-size:2.8rem;color:#f0e8d5;line-height:1;margin-bottom:8px;}
    .desafioCard .dTit{color:var(--redMuted);font-size:.95rem;font-style:italic}
    .desafioCard .dSub{color:rgba(138,128,112,.5);font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;margin-top:6px}
    .desafioCard.principal{border-color:rgba(232,128,128,.5);background:rgba(232,128,128,.025)}

    /* ── LIÇÕES KÁRMICAS ── */
    .licoesWrap{display:flex;flex-direction:column;gap:12px}
    .licaoItem{
      display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start;
      padding:18px 20px;border:1px solid var(--blueLine);border-radius:2px;
      background:var(--blueBg);
    }
    .licaoNum{
      font-family:'Poppins',sans-serif;font-size:2.2rem;
      color:var(--blue);line-height:1;min-width:44px;text-align:center;
    }
    .licaoRight .lTit{font-family:'Cinzel',serif;font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;color:var(--blueMuted);margin-bottom:8px}
    .licaoRight .lDesc{font-size:1rem;color:#d0c8b8;line-height:1.8}
    .semLicoes{
      padding:24px;border:1px solid var(--line2);border-radius:2px;
      color:var(--muted);font-style:italic;font-size:1rem;text-align:center;
    }

    /* ── MATURIDADE & EQUILÍBRIO ── */
    .specialGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:28px}
    .specialCard{
      background:var(--card);border:1px solid var(--greenLine);
      border-radius:2px;padding:24px 22px;
    }
    .specialCard .sLabel{font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:var(--green);margin-bottom:12px}
    .specialCard .sVal{font-family:'Poppins',sans-serif;font-size:2.8rem;color:#f0e8d5;line-height:1;margin-bottom:8px;}
    .specialCard .sTit{color:var(--greenMuted);font-size:.95rem;font-style:italic}
    .specialCard .sSub{color:rgba(138,128,112,.5);font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;margin-top:6px}
    .specialCard .sDesc{color:#c8c0b0;font-size:.95rem;line-height:1.75;margin-top:14px;border-top:1px solid var(--greenLine);padding-top:14px}

    /* ── CICLOS DE VIDA ── */
    .ciclosWrap{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .cicloCard{
      background:var(--card);border:1px solid var(--line2);
      border-radius:2px;padding:22px 20px;position:relative;overflow:hidden;
    }
    .cicloCard.active{border-color:rgba(201,168,76,.4)}
    .cicloCard::before{
      content:'';position:absolute;top:0;left:0;right:0;height:2px;
      background:linear-gradient(90deg,transparent,var(--gold3),transparent);
    }
    .cicloCard.active::before{background:linear-gradient(90deg,transparent,var(--gold),transparent)}
    .cicloCard .ccPhase{font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:8px}
    .cicloCard .ccNum{font-family:'Poppins',sans-serif;font-size:2.8rem;color:#f0e8d5;line-height:1;margin-bottom:6px}
    .cicloCard.active .ccNum{color:var(--gold2)}
    .cicloCard .ccName{color:var(--muted);font-size:.95rem;font-style:italic;margin-bottom:6px}
    .cicloCard .ccPeriod{font-size:.75rem;color:rgba(138,128,112,.6);letter-spacing:.08em}
    .cicloCard .ccDesc{font-size:.88rem;color:#c0b8a8;line-height:1.65;margin-top:12px;padding-top:12px;border-top:1px solid var(--line2)}

    .btnNew{
      display:block;margin:40px auto 0;padding:14px 36px;
      background:transparent;border:1px solid var(--line);border-radius:2px;color:var(--muted);
      font-family:'Poppins',sans-serif;font-size:1rem;letter-spacing:.15em;cursor:pointer;
      transition:border-color .3s,color .3s;
    }
    .btnNew:hover{border-color:var(--gold);color:var(--gold2)}
    .footNote{text-align:center;color:var(--muted);font-size:.85rem;margin-top:20px;letter-spacing:.05em;}

    @media(max-width:720px){
      .cardsGrid{grid-template-columns:1fr 1fr}
      .formCard{padding:24px 20px}
      #formScreen{padding-top:40px}
      .desafiosGrid{grid-template-columns:1fr 1fr}
      .specialGrid{grid-template-columns:1fr}
      .ciclosWrap{grid-template-columns:1fr}
      .pinRow{grid-template-columns:1fr auto;grid-template-rows:auto auto}
      .pinRight{text-align:left;grid-column:1/-1}
    }
    @media(max-width:480px){
      .cardsGrid{grid-template-columns:1fr}
      .desafiosGrid{grid-template-columns:1fr}
      .ciclosWrap{grid-template-columns:1fr}
    }
  </style>
</head>
<body>
<div class="wrap">

  <!-- FORMULÁRIO -->
  <div id="formScreen" class="anim">
    <div class="sigil">✦</div>
    <h1 class="formTitle">Seu Mapa Numerológico</h1>
    <p class="formSub">Sistema Pitagórico · Leitura Completa</p>
    <div class="orn">⬦</div>
    <div class="formCard">
      <label class="fieldLabel" for="inpName">Nome completo de nascimento</label>
      <input class="fieldInput" id="inpName" type="text" placeholder="Ex.: Maria da Silva Pereira" autocomplete="off"/>
      <label class="fieldLabel" for="inpDate">Data de nascimento</label>
      <input class="fieldInput" id="inpDate" type="tel" placeholder="DD/MM/AAAA" inputmode="numeric" maxlength="10" autocomplete="off"/>
      <button class="btnReveal" id="btnReveal" type="button">Revelar meu mapa ✦</button>
      <div class="errMsg" id="errMsg"></div>
    </div>
  </div>

  <!-- RESULTADO -->
  <div id="resultScreen" class="hidden anim"></div>

</div>

<script>
(function(){
  const ANO_ATUAL = new Date().getFullYear();
  const IDADE_ATUAL_BASE = ANO_ATUAL; // used for pinacle active detection

  /* ── Tabela Pitagórica ── */
  const TAB = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
  const VOGAIS = new Set(['A','E','I','O','U']);
  const MESTRES = new Set([11,22,33]);

  /* ── Utilitários ── */
  function limpar(nome){
    return nome.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z\s]/g,' ').trim();
  }

  function reduzir(n){
    n = Math.abs(+n || 0);
    while(n > 9 && !MESTRES.has(n)){
      n = String(n).split('').reduce((a,b) => a + Number(b), 0);
    }
    return n;
  }

  function somarDigitos(str){
    return str.replace(/\D/g,'').split('').reduce((a,b) => a + Number(b), 0);
  }

  function parseDateBR(s){
    const m = /^\s*(\d{2})\/(\d{2})\/(\d{4})\s*$/.exec(s||'');
    if(!m) return null;
    const [,d,mo,y] = m.map(Number);
    if(d<1||d>31||mo<1||mo>12) return null;
    const dt = new Date(y, mo-1, d);
    if(dt.getFullYear()!==y||dt.getMonth()!==mo-1||dt.getDate()!==d) return null;
    return {dia:d, mes:mo, ano:y};
  }

  function reduzirSimples(n){
    n = Math.abs(+n || 0);
    while(n > 9){
      n = String(n).split('').reduce((a,b) => a + Number(b), 0);
    }
    return n;
  }

  /* ── Cálculos dos números principais ── */
  function calcCaminhoVida(date){
    const dia = reduzir(somarDigitos(String(date.dia)));
    const mes = reduzir(somarDigitos(String(date.mes)));
    const ano = reduzir(somarDigitos(String(date.ano)));
    return reduzir(dia + mes + ano);
  }

  function calcExpressao(nome){
    const s = limpar(nome).replace(/\s/g,'');
    return reduzir([...s].map(c => TAB[c]||0).reduce((a,b) => a+b, 0));
  }

  function calcAlma(nome){
    const s = limpar(nome).replace(/\s/g,'');
    return reduzir([...s].filter(c => VOGAIS.has(c)).map(c => TAB[c]||0).reduce((a,b) => a+b, 0));
  }

  function calcPersonalidade(nome){
    const s = limpar(nome).replace(/\s/g,'');
    return reduzir([...s].filter(c => !VOGAIS.has(c) && TAB[c]).map(c => TAB[c]||0).reduce((a,b) => a+b, 0));
  }

  function calcDia(date){ return reduzir(date.dia); }

  function calcAnoPessoal(date){
    const dia = reduzir(somarDigitos(String(date.dia)));
    const mes = reduzir(somarDigitos(String(date.mes)));
    const ano = reduzir(somarDigitos(String(ANO_ATUAL)));
    return reduzir(dia + mes + ano);
  }

  /* ── PINÁCULOS ──
     1º = dia + mês
     2º = dia + ano
     3º = 1º + 2º
     4º = mês + ano
  */
  function calcPinaculos(date){
    const dia = reduzir(somarDigitos(String(date.dia)));
    const mes = reduzir(somarDigitos(String(date.mes)));
    const ano = reduzir(somarDigitos(String(date.ano)));
    const p1 = reduzir(dia + mes);   // 1º pináculo: dia + mês
    const p2 = reduzir(mes + ano);   // 2º pináculo: mês + ano
    const p3 = reduzir(p1 + p2);     // 3º pináculo: P1 + P2
    const p4 = reduzir(dia + ano);   // 4º pináculo: dia + ano
    return [p1, p2, p3, p4];
  }

  function calcPeriodosPinaculos(caminho, anoNasc){
    // 1º pináculo dura (36 - caminho de vida) anos
    const durP1 = 36 - (MESTRES.has(caminho) ? reduzirSimples(caminho) : caminho);
    const ini1 = anoNasc;
    const fim1 = anoNasc + durP1 - 1;
    const ini2 = fim1 + 1;
    const fim2 = ini2 + 8;
    const ini3 = fim2 + 1;
    const fim3 = ini3 + 8;
    const ini4 = fim3 + 1;
    return [
      {ini:ini1, fim:fim1, label:`${ini1}–${fim1}`},
      {ini:ini2, fim:fim2, label:`${ini2}–${fim2}`},
      {ini:ini3, fim:fim3, label:`${ini3}–${fim3}`},
      {ini:ini4, fim:null,  label:`${ini4} em diante`},
    ];
  }

  /* ── DESAFIOS ──
     1º = |dia − mês|
     2º = |ano − dia|
     3º = |2º − 1º|  (Desafio Principal)
     4º = |ano − mês|
  */
  function calcDesafios(date){
    const dia = reduzirSimples(somarDigitos(String(date.dia)));
    const mes = reduzirSimples(somarDigitos(String(date.mes)));
    const ano = reduzirSimples(somarDigitos(String(date.ano)));
    const d1 = Math.abs(dia - mes);
    const d2 = Math.abs(ano - dia);
    const d3 = Math.abs(d2 - d1);
    const d4 = Math.abs(ano - mes);
    return [d1, d2, d3, d4];
  }

  /* ── LIÇÕES KÁRMICAS ── números de 1-9 ausentes no nome */
  function calcLicoesKarmicas(nome){
    const s = limpar(nome).replace(/\s/g,'');
    const presentes = new Set([...s].map(c => TAB[c]).filter(Boolean));
    const ausentes = [];
    for(let i = 1; i <= 9; i++){ if(!presentes.has(i)) ausentes.push(i); }
    return ausentes;
  }

  /* ── NÚMERO DE MATURIDADE ── Caminho de Vida + Expressão */
  function calcMaturidade(caminho, expressao){
    return reduzir(caminho + expressao);
  }

  /* ── NÚMERO DE EQUILÍBRIO ── iniciais do nome completo */
  function calcEquilibrio(nomeRaw){
    const partes = limpar(nomeRaw).split(/\s+/).filter(p => p.length > 0);
    const soma = partes.reduce((acc, p) => acc + (TAB[p[0]] || 0), 0);
    return reduzir(soma);
  }

  /* ── CICLOS DE VIDA ──
     Formativo (nascimento~28): mês de nascimento
     Produtivo (29–56): dia de nascimento
     Colheita (57+): ano de nascimento
  */
  function calcCiclos(date){
    const formativo  = reduzir(somarDigitos(String(date.mes)));
    const produtivo  = reduzir(somarDigitos(String(date.dia)));
    const colheita   = reduzir(somarDigitos(String(date.ano)));
    return [formativo, produtivo, colheita];
  }

  /* ════════════════════════════════════════════
     PIRÂMIDE PITAGÓRICA
  ════════════════════════════════════════════ */
  function calcPiramide(nome){
    const letrasValidas = [...limpar(nome).replace(/\s/g,'')].filter(c => TAB[c]);
    if(letrasValidas.length < 2) return null;
    const linhaBase = letrasValidas.map(c => TAB[c]);
    const linhas = [linhaBase];
    let atual = linhaBase;
    while(atual.length > 1){
      const prox = [];
      for(let i = 0; i < atual.length - 1; i++){
        prox.push(reduzirSimples(atual[i] + atual[i+1]));
      }
      linhas.push(prox);
      atual = prox;
    }
    return { linhas, letras: letrasValidas };
  }

  function detectarSequencias(linhas){
    const encontradas = [];
    linhas.forEach((linha, li) => {
      let i = 0;
      while(i < linha.length){
        let j = i;
        while(j < linha.length && linha[j] === linha[i]) j++;
        const tam = j - i;
        if(tam >= 3) encontradas.push({num: linha[i], tamanho: tam, linhaIdx: li});
        i = j;
      }
    });
    return encontradas;
  }

  function interpretarSequencia(n, tam){
    const grau = tam >= 5 ? 'Concentração extrema' : tam === 4 ? 'Forte concentração' : 'Concentração';
    const map = {
      1:`${grau} da energia do 1: impulso excessivo, dificuldade de cooperar, necessidade compulsiva de controle e tendência ao isolamento.`,
      2:`${grau} da energia do 2: hiperdependência emocional, indecisão paralisante, dificuldade de se posicionar.`,
      3:`${grau} da energia do 3: dispersão criativa, dificuldade de concluir projetos, superficialidade relacional.`,
      4:`${grau} da energia do 4: rigidez mental, resistência intensa à mudança, perfeccionismo paralisante.`,
      5:`${grau} da energia do 5: instabilidade crônica, dificuldade de comprometimento, fuga de aprofundamento.`,
      6:`${grau} da energia do 6: sobrecarga de responsabilidade afetiva, tendência ao martírio emocional.`,
      7:`${grau} da energia do 7: isolamento excessivo, desconfiança crônica, dificuldade de conexão emocional.`,
      8:`${grau} da energia do 8: obsessão por controle, ambição desmedida, confusão entre valor pessoal e conquistas.`,
      9:`${grau} da energia do 9: apego ao passado, dificuldade de encerrar ciclos, compaixão que vira sacrifício identitário.`,
    };
    return map[n] || 'Energia amplificada que exige atenção e trabalho consciente de equilíbrio.';
  }

  function renderPiramide(nome){
    const resultado = calcPiramide(nome);
    if(!resultado) return '<p style="color:var(--muted)">Nome insuficiente para calcular a pirâmide.</p>';
    const {linhas, letras} = resultado;
    const seqCells = new Set();
    linhas.forEach((linha, li) => {
      let i = 0;
      while(i < linha.length){
        let j = i;
        while(j < linha.length && linha[j] === linha[i]) j++;
        if(j - i >= 3){ for(let k = i; k < j; k++) seqCells.add(`${li}-${k}`); }
        i = j;
      }
    });
    const numLinhas = linhas.length;
    let html = '<div class="pyramidWrap"><div class="pyramidFlex">';
    html += '<div class="pyrRow letterRow">';
    letras.forEach(l => { html += `<div class="pyrCell pyrLetter">${l}</div>`; });
    html += '</div>';
    linhas.forEach((linha, li) => {
      html += '<div class="pyrRow">';
      linha.forEach((n, ci) => {
        const isApex = li === numLinhas - 1 && ci === 0;
        const isSeq  = seqCells.has(`${li}-${ci}`);
        let cls = 'pyrCell';
        if(isApex) cls += ' apex';
        else if(isSeq) cls += ' seq';
        html += `<div class="${cls}">${n}</div>`;
      });
      html += '</div>';
    });
    html += '</div></div>';
    html += `<p class="pyrCaption">Pirâmide pitagórica · ${letras.length} letras → ${numLinhas} níveis → ápice: ${linhas[numLinhas-1][0]}</p>`;
    const sequencias = detectarSequencias(linhas);
    if(sequencias.length){
      const msgs = sequencias.map(s =>
        `<div class="seqItem"><span class="seqNum">${String(s.num).repeat(s.tamanho)}</span> <span class="seqDesc">${interpretarSequencia(s.num, s.tamanho)}</span></div>`
      ).join('');
      html += `<div class="seqAlert"><div class="seqAlertTitle">⚠ Sequências detectadas na pirâmide</div><p class="seqAlertSub">Repetição de 3 ou mais números idênticos consecutivos — energia em excesso que pede atenção consciente.</p>${msgs}</div>`;
    }
    return html;
  }

  /* ── Leituras ── */
  const TITULOS = {
    1:'O Pioneiro', 2:'A Ponte do Vínculo', 3:'A Voz que Ilumina', 4:'O Arquiteto do Real',
    5:'O Mensageiro Livre', 6:'O Guardião do Amor', 7:'O Eremita Sagrado', 8:'A Autoridade da Matéria',
    9:'O Mestre da Entrega', 11:'O Canal da Luz', 22:'O Arquiteto da Grande Obra', 33:'A Compaixão Mestra'
  };

  const LEITURAS = {
    1:{
      caminho:`<p class="statement">Seu Caminho de Vida é de liderança e inauguração. Você veio ao mundo para abrir trilhas, não seguir mapas já traçados.</p><p>As grandes lições da sua jornada giram em torno de aprender a decidir sem depender de validação, sustentar o próprio ritmo sem atropelar quem caminha junto, e transformar força em inspiração — não em imposição. Você foi colocado em posições de início não por acidente, mas porque sua alma possui o fôlego de quem pode suportar o vazio antes da criação.</p><p>Seus maiores obstáculos virão disfarçados de impaciência: com os outros, com o processo, com você mesmo. O universo colocará em seu caminho situações que só se resolvem na lentidão deliberada. Aprender a esperar sem perder a direção é o seu desafio mais refinado.</p><p>Em termos práticos, sua trajetória tende a ter começos fortes, viravoltas bruscas e recomeços corajosos. Cada ciclo de queda prepara a musculatura para um salto mais alto. Confie no padrão, mesmo quando ele dói.</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu nasci para começar. Cada início que carrego é uma semente que o mundo ainda não viu florescer.</div>`,
      expressao:`<p class="statement">Sua Expressão é a marca da liderança criativa. O modo como você age no mundo carrega a assinatura do 1: diretividade, clareza e uma presença que ocupa o espaço antes mesmo de falar.</p><p>Seus talentos naturais são iniciativa, objetividade e a capacidade de mobilizar recursos e pessoas em torno de uma visão. Quando você entra em um ambiente, algo muda — não pela imposição, mas pela clareza de intenção que emana. Você foi construído para inaugurar, não para manter.</p><p>O risco da sua expressão é a solidão criativa: você pensa mais rápido que a maioria e isso pode criar a sensação de que ninguém acompanha. Aprenda a diminuir o passo sem interpretar isso como derrota. Liderar é também calibrar o ritmo do grupo.</p><p>Profissionalmente, você prospera em posições de autonomia real — onde possa criar estruturas novas, não apenas administrar as existentes.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Minha voz inaugura. Meu talento é abrir o que ainda não existe.</div>`,
      alma:`<p class="statement">No fundo do seu ser pulsa um desejo inabalável de ser inteiro, original e irredutível. Sua Alma quer ser vista como ela é — não como uma versão domesticada do que o mundo espera.</p><p>O que move você por dentro é a necessidade de autonomia existencial. Não necessariamente solidão — mas liberdade de ser. Quando você sente que está sendo moldado pelas expectativas alheias, há uma resistência interior que cresce silenciosamente até explodir em reposicionamento radical.</p><p>Seu desejo mais profundo é deixar uma marca que seja inequivocamente sua. Não fama — autenticidade. Você quer que a sua passagem pelo mundo tenha a sua assinatura, não a de um personagem que outros desenharam para você.</p><p>O desafio da sua Alma é aprender que dependência e conexão não são a mesma coisa. Você pode precisar de alguém sem se dissolver nessa necessidade.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Meu desejo mais verdadeiro é existir com plenitude e autoria. Sou original por natureza.</div>`,
      personalidade:`<p class="statement">A primeira impressão que você causa no mundo é de alguém decidido, direto e com presença. As pessoas sentem, antes mesmo de você falar, que há um centro firme ali — alguém que sabe onde está e para onde vai.</p><p>Sua aparência exterior carrega autoridade natural. Isso abre portas, mas também pode criar barreiras: nem todos se sentem à vontade para se aproximar de quem parece tão certo de si. Às vezes, o que eles leem como arrogância é apenas concentração.</p><p>Seu desafio de personalidade é suavizar o acesso sem perder a substância. Você não precisa se tornar menos para que as pessoas se sintam confortáveis — mas pode aprender a criar pontes antes de construir torres.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença é magnética. Aprendo a ser acessível sem me tornar menor.</div>`,
      dia:`<p class="statement">Nascido no dia que vibra o 1, você carrega desde o início uma energia de autossuficiência e singularidade. Há algo em você que sempre soube que precisava andar com as próprias pernas — mesmo quando pequeno, já tinha opiniões próprias.</p><p>Esse número de nascimento confere iniciativa precoce, uma certa impaciência com a mediocridade e um impulso constante para melhorar o que existe. Você não aceita facilmente o "porque sempre foi assim" como justificativa.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com o dom da iniciativa. Meu ponto de partida é sempre a coragem.</div>`,
      ano:`<p class="statement">Este é um Ano Pessoal 1 — o início de um novo ciclo de nove anos. O universo está literalmente abrindo uma nova página para você, e o que você semear agora terá efeitos por anos.</p><p>Este não é um ano para hesitar. É um ano de decisões inaugurais, novos começos e posicionamento claro. Se você tem adiado uma mudança de rota, de carreira, de relação ou de identidade — este é o momento em que o cosmos oferece suporte para esse salto.</p><p>Cuidado com o excesso de planejamento. A energia do 1 é de ação. Você pode preparar, mas o que o ano pede mesmo é movimento. Comece antes de se sentir 100% pronto — porque esse 100% não chegará antes do começo.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo pede inauguração. Plante agora o que você quer colher nos próximos nove anos.</div>`,
    },
    2:{
      caminho:`<p class="statement">Seu Caminho de Vida é de mediação, sensibilidade e a arte de criar pontes onde havia distância. Você veio aprender que força pode ser suave e que o poder de unir é tão valioso quanto o poder de liderar.</p><p>A grande lição do número 2 como destino é aprender a cooperar sem se apagar. Você tem uma habilidade rara de sentir o outro antes que ele fale — e isso pode ser dom ou armadilha. O dom: você cria conexões profundas e autênticas com facilidade. A armadilha: você pode silenciar sua própria verdade para preservar a paz.</p><p>Ao longo da vida, você será colocado em situações onde precisará decidir entre a sua necessidade e a necessidade alheia. O universo não pede que você sempre escolha o outro — pede que você aprenda a honrar os dois. Essa é a arte mais refinada do caminho 2.</p><p>Relacionamentos, parcerias, trabalho em equipe e colaboração são o terreno fértil onde sua alma cresce. Você é alguém que floresce no encontro — e sua missão é transformar esses encontros em algo maior do que a soma das partes.</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu sou ponte. Meu poder está na conexão que construo com delicadeza e verdade.</div>`,
      expressao:`<p class="statement">Sua Expressão no mundo tem a marca da sensibilidade afinada: você ouve mais do que fala, percebe mais do que revela e age com uma sutileza que muitos confundem com timidez — mas é precisão.</p><p>Seus talentos naturais incluem diplomacia, mediação, colaboração, escuta ativa e uma inteligência emocional que poucos cultivam conscientemente. Você tem a rara habilidade de perceber o que está nas entrelinhas de uma conversa — e isso te torna um parceiro valioso em qualquer contexto.</p><p>O risco da sua expressão é a subestimação: você pode deixar que seu poder passe despercebido porque não o anuncia com barulho. Aprenda a se posicionar com a mesma clareza com que percebe os outros. Sua voz importa tanto quanto sua escuta.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Minha sensibilidade é competência. Percebo o que outros ignoram e construo com o que encontro.</div>`,
      alma:`<p class="statement">O que sua Alma verdadeiramente deseja é pertencimento — ser visto, reconhecido e amado como é, sem precisar se transformar para caber no espaço do outro.</p><p>Você busca profundamente por relações de verdade: onde a reciprocidade é real, onde o cuidado flui nos dois sentidos e onde você não precisa ser forte o tempo todo para ser respeitado. Seu coração quer ternura — não dependência, não fusão — mas a ternura de ser recebido inteiro.</p><p>O desafio da sua Alma é não confundir amabilidade com valor. Você não precisa ser útil para ser amado. Você não precisa ceder para ser aceito. Sua essência é digna de recepção pura — não de transação emocional.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Meu desejo mais profundo é ser recebido como sou. Mereço reciprocidade, não apenas gratidão.</div>`,
      personalidade:`<p class="statement">A impressão que você passa ao mundo é de gentileza, cuidado e uma presença que acolhe antes de qualquer palavra. As pessoas se sentem seguras perto de você — como se pudessem baixar a guarda.</p><p>Esse magnetismo suave é um dos seus maiores dons, mas exige discernimento: nem toda pessoa que se aproxima está em paz com a generosidade que você irradia. Aprenda a distinguir quem se aproxima para crescer junto e quem se aproxima para se beneficiar.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença acolhe. Aprendo a ser gentil com o mundo e firme com meus limites.</div>`,
      dia:`<p class="statement">Nascido em um dia 2, você chegou ao mundo com uma sensibilidade aguçada para o outro — a capacidade de sentir o que não foi dito, de notar o detalhe que os outros ignoram e de criar harmonia onde havia tensão.</p><p>Esse dom veio acompanhado de um desafio: aprender a se posicionar com a mesma clareza com que percebe os outros. Você foi generoso desde cedo — agora o universo pede que você seja igualmente generoso consigo.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com o dom da percepção emocional. Minha sensibilidade é força.</div>`,
      ano:`<p class="statement">Um Ano Pessoal 2 pede paciência, cultivo e gestação. Este não é o ano dos grandes saltos — é o ano de regar o que foi plantado no ciclo anterior e construir alianças que sustentarão os próximos anos.</p><p>Relacionamentos terão papel central: parcerias profissionais, vínculos afetivos e conexões de longa data vão pedir atenção e cuidado. O universo está criando condições para que você construa em conjunto — não sozinho.</p><p>Cuidado com a impaciência. Este é um ano de ritmo lento e resultados invisíveis que se tornarão sólidos depois. Resista à tentação de forçar colheitas antes do tempo.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo pede cultivo. Cuide dos vínculos e deixe o tempo trabalhar a seu favor.</div>`,
    },
    3:{
      caminho:`<p class="statement">Seu Caminho de Vida é de expressão, criatividade e o dom de transformar experiência em linguagem. Você veio ao mundo para comunicar — não apenas informações, mas estados de ser que inspiram os outros a sentir mais profundamente.</p><p>A grande lição do caminho 3 é aprender a sustentar profundidade sem perder leveza. Você tem uma capacidade natural de encantar, mas o universo vai te desafiar com situações que exigem mais do que charme — exigem consistência, foco e a coragem de ir fundo mesmo quando o raso é mais confortável.</p><p>Dispersão é o seu fantasma mais frequente. A vida vai te oferecer mil possibilidades ao mesmo tempo, e sua missão é aprender a escolher com sabedoria — não por medo de perder, mas por clareza sobre o que realmente importa para você.</p><p>Sua trajetória tende a ser rica, colorida e cheia de encontros marcantes. O mundo se lembra de você — porque você deixa uma impressão viva onde passa. Use esse dom com consciência: sua voz tem mais poder do que você imagina.</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu vim para iluminar com palavras, arte e presença. Minha voz é instrumento de transformação.</div>`,
      expressao:`<p class="statement">Sua Expressão é criativa, comunicativa e irresistivelmente presente. O modo como você age no mundo tem cor, ritmo e uma energia que contagia — mesmo quando você não está tentando.</p><p>Seus talentos naturais incluem oratória, escrita, improviso, humor, conexão social e uma capacidade única de tornar o complexo acessível e o pesado mais leve. Você foi feito para criar, compartilhar e inspirar.</p><p>O risco da sua expressão é usar o brilho como escudo. Quando a vida fica pesada, você pode recorrer ao humor ou à leveza para não precisar ser visto na vulnerabilidade. Mas são exatamente nesses momentos que sua expressão mais profunda emerge — e é essa versão de você que mais toca as pessoas.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Minha criatividade é meu dom ao mundo. Expresso com alegria e com profundidade.</div>`,
      alma:`<p class="statement">No fundo do seu ser existe um desejo intenso de ser admirado, amado e celebrado pela sua singularidade. Sua Alma quer que sua criatividade seja reconhecida — não como performance, mas como contribuição genuína.</p><p>Você busca relacionamentos e ambientes onde possa ser expressivo sem julgamento, onde sua originalidade seja vista como valor e não como excentricidade. O que mais alimenta sua alma é a sensação de que sua presença faz diferença — que o mundo ficou mais vivo porque você passou por ele.</p><p>O desafio da sua Alma é aprender que reconhecimento externo não substitui a autorvalidação. Quando você aprende a celebrar sua própria criação — independente de aplauso — sua expressão atinge um nível de liberdade que nenhuma audiência poderia dar.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Minha alma deseja criar e ser celebrada. Aprendo a ser minha própria audiência primeiro.</div>`,
      personalidade:`<p class="statement">O mundo te enxerga como alguém alegre, criativo e magnético. Sua presença ilumina ambientes — você tem o dom raro de fazer as pessoas rirem, pensarem e sentirem ao mesmo tempo.</p><p>Essa imagem te abre portas — mas às vezes cria a expectativa de que você esteja sempre bem, sempre inspirado, sempre pronto. Aprenda a mostrar quando está cansado. As pessoas que te amam de verdade querem a versão inteira, não apenas a versão brilhante.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença é luminosa. Mostro ao mundo meu brilho — e também minha humanidade.</div>`,
      dia:`<p class="statement">Nascido em um dia 3, você chegou com o dom da expressão inscrito no corpo. Desde cedo, havia algo em você que precisava ser dito, mostrado, criado — uma urgência criativa que nunca descansou completamente.</p><p>Esse número de nascimento confere leveza, humor e uma capacidade natural de encantar. Seu desafio é usar esses dons com intenção — transformar o talento bruto em contribuição consciente.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com o dom de encantar. Minha leveza é ponte, não fuga.</div>`,
      ano:`<p class="statement">Um Ano Pessoal 3 é um convite à expansão criativa, à socialização e à expressão sem filtro. Este é o ano de criar, colaborar, se mostrar e deixar que sua presença chegue a novos espaços.</p><p>É um período favorável para projetos criativos, comunicação, viagens, novos vínculos e tudo que envolva expressão genuína. O universo está amplificando sua voz — use essa janela com coragem e intenção.</p><p>Cuidado com a dispersão: a energia do 3 é expansiva e pode te fazer querer tudo ao mesmo tempo. Escolha com clareza o que quer criar neste ciclo e dedique seu brilho a isso.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo pede expressão. Crie, mostre-se, conecte-se. Sua voz quer mais espaço.</div>`,
    },
    4:{
      caminho:`<p class="statement">Seu Caminho de Vida é de construção, disciplina e a criação de estruturas que duram. Você veio ao mundo para edificar — não apenas coisas, mas sistemas, processos e fundações que sustentam outras vidas.</p><p>A grande lição do caminho 4 é aprender que ordem e controle não são a mesma coisa. Você tem um talento genuíno para organizar o caótico e tornar o impossível gerenciável — mas o universo vai te desafiar com situações que simplesmente não se encaixam em nenhum planejamento. Nesses momentos, sua evolução está na capacidade de continuar construindo sem saber o resultado final.</p><p>Sua trajetória terá muitas fases de trabalho árduo e resultado invisível. Haverá momentos em que você sentirá que deu tudo e colheu pouco. Confie no processo: o número 4 constrói devagar — mas o que ele constrói não desmorona.</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu construo com paciência e precisão. O que ergo com minhas mãos permanece.</div>`,
      expressao:`<p class="statement">Sua Expressão é metódica, confiável e orientada para resultados concretos. O modo como você age no mundo carrega a marca da seriedade: você faz o que promete, entrega o que planeja e constrói o que projeta.</p><p>Seus talentos naturais incluem organização, planejamento, disciplina, atenção ao detalhe e a capacidade de transformar ideias abstratas em planos executáveis. Você é aquele que faz o sonho dos outros virar realidade — porque enquanto eles sonham, você está calculando as fundações.</p><p>O risco é a rigidez: quando o plano muda, você pode travar. Aprenda a construir com flexibilidade — o projeto que aguenta imprevisto é mais sólido do que o perfeito que quebra na primeira tempestade.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Meu talento é transformar visão em estrutura. Construo com rigor e com capacidade de adaptação.</div>`,
      alma:`<p class="statement">No fundo do seu ser existe um desejo profundo de segurança — não riqueza, não status, mas a sensação de que o chão sob seus pés é sólido e que o que você construiu não vai desaparecer da noite para o dia.</p><p>Sua Alma busca estabilidade emocional, vínculos duráveis e ambientes onde a previsibilidade seja possível. O caos externo te drena — não porque você seja fraco, mas porque sua energia foi feita para construir, não para apagar incêndios.</p><p>O desafio da sua Alma é aprender que segurança real vem de dentro. Nenhuma estrutura externa garante permanência. Sua paz mais profunda emergirá quando você descobrir que, mesmo sem certezas, você tem a capacidade de reconstruir.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Minha alma busca solidez. Aprendo que a maior segurança é a fé na minha própria capacidade de construir.</div>`,
      personalidade:`<p class="statement">O mundo te enxerga como alguém confiável, sério e com os pés no chão. As pessoas sabem que quando você faz uma promessa, ela será cumprida — e isso te dá uma reputação de integridade que poucos conseguem construir.</p><p>Essa imagem abre portas profissionais e cria vínculos de longo prazo. O desafio é que alguns podem te ver como rígido ou inflexível. Mostre que por trás da estrutura existe também calor — e que você é capaz de improvisar quando necessário.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença inspira confiança. Sou sólido e também capaz de surpreender.</div>`,
      dia:`<p class="statement">Nascido em um dia 4, você chegou com um senso natural de responsabilidade e uma seriedade que às vezes surpreendia os adultos ao seu redor quando criança. Você tinha método antes de ter teoria.</p><p>Esse número de nascimento confere resistência, determinação e uma capacidade de trabalho que impressiona. Seu desafio é não transformar esforço em identidade — você não precisa merecer descanso, ele é seu por direito.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com o dom da persistência. Construo com cada tijolo e com cada pausa necessária.</div>`,
      ano:`<p class="statement">Um Ano Pessoal 4 é o ano do trabalho sólido, da estruturação e de colocar em ordem o que ficou bagunçado. Este não é um ano de expansão dramática — é o ano de construir as bases que sustentarão os próximos ciclos.</p><p>Projetos que exigem método, disciplina e atenção ao detalhe terão mais sucesso agora. É um período excelente para reorganizar finanças, criar rotinas saudáveis, consolidar aprendizados e fortalecer relações que têm substância real.</p><p>Resista à frustração com a lentidão. A energia do 4 não promete explosões — promete solidez. E solidez dura.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo pede estruturação. Construa com cuidado e confie no que está sendo erguido.</div>`,
    },
    5:{
      caminho:`<p class="statement">Seu Caminho de Vida é de liberdade, transformação e a experiência direta do mundo em toda a sua diversidade. Você veio para conhecer, experimentar e conectar — e sua alma cresce através da variedade, não da constância.</p><p>A grande lição do caminho 5 é aprender a usar a liberdade com propósito. Você tem uma sede natural de novidade e uma inquietação que pode te levar a lugares que poucos têm coragem de visitar — mas também pode te manter em movimento perpétuo, sem nunca aprofundar o que toca.</p><p>O universo vai te colocar em situações que desafiam sua capacidade de comprometimento. Não porque comprometimento seja sua fraqueza — mas porque é o músculo que sua alma veio desenvolver. Liberdade madura é a que escolhe onde se aprofundar.</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu vim para experienciar a vida com coragem e intensidade. Minha liberdade é consciente e tem direção.</div>`,
      expressao:`<p class="statement">Sua Expressão é dinâmica, versátil e multifacetada. O modo como você age no mundo carrega uma energia de adaptação: você consegue funcionar em contextos muito diferentes e fazer isso parecer natural.</p><p>Seus talentos incluem comunicação, persuasão, adaptabilidade, curiosidade intelectual e uma capacidade de conectar ideias de campos completamente diferentes. Você pensa de forma não-linear e isso é um ativo em ambientes que precisam de inovação.</p><p>O risco é a falta de profundidade: você pode dominar a superfície de muitas áreas sem mergulhar em nenhuma. O mundo precisa tanto dos seus pontos de conexão quanto da sua especialidade. Encontre o campo onde sua versatilidade encontra profundidade real.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Minha versatilidade é riqueza. Aprendo a aprofundar sem perder a amplitude.</div>`,
      alma:`<p class="statement">No fundo do seu ser existe um desejo inabalável de liberdade — não apenas física, mas existencial. Sua Alma quer escolher, mudar e explorar sem que ninguém defina os limites antes de você.</p><p>Você é movido internamente por uma curiosidade que nunca se satisfaz completamente — e isso é exatamente o que te mantém vivo. O que te sufoca por dentro é a previsibilidade forçada, os papéis fixos e as expectativas que não cabem na sua pele.</p><p>O desafio da sua Alma é aprender que liberdade não é ausência de compromisso — é a capacidade de escolher comprometimentos que expandem, não que aprisionam. Quando você encontra vínculos que deixam você ser, você descobre que liberdade e amor não são opostos.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Minha alma precisa de espaço para existir. Encontro vínculos que me expandem, não que me confinam.</div>`,
      personalidade:`<p class="statement">O mundo te enxerga como alguém interessante, estimulante e cheio de energia. Você tem o dom de tornar qualquer conversa mais viva — e as pessoas sentem que, ao seu lado, algo pode acontecer.</p><p>Essa energia abre portas sociais com facilidade. O desafio é não criar a expectativa de que você é sempre disponível, sempre em movimento. Mostrar que você também pode ser presença constante — quando o quer — é o que transforma admiração em confiança real.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença é vibrante. Ofereço movimento e também a âncora da minha escolha consciente.</div>`,
      dia:`<p class="statement">Nascido em um dia 5, você chegou com inquietação nas veias e olhos curiosos para tudo. Desde cedo, o mundo te pareceu pequeno — havia sempre mais para ver, mais para experimentar, mais para conhecer.</p><p>Esse número de nascimento confere agilidade mental, charme natural e uma capacidade de aprender rápido que impressiona. Seu desafio é canalizar essa energia intensa em direção a algo que valha ser aprofundado.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com o dom da curiosidade infinita. Minha inquietação é motor de descoberta.</div>`,
      ano:`<p class="statement">Um Ano Pessoal 5 é o ano da mudança, da expansão e de abraçar o inesperado. Este é um ano em que o universo vai agitar sua vida — não para te destruir, mas para criar espaço para o que precisa chegar.</p><p>Novas experiências, viagens, mudanças de rota, encontros transformadores e oportunidades inéditas marcam este ciclo. A palavra de ordem é adaptabilidade: quem souber se mover com o fluxo colherá muito. Quem resistir à mudança sofrerá mais.</p><p>Este não é o melhor ano para estabilizar — é o melhor ano para explorar. Confie nas viradas.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo pede coragem para mudar. O que chega agora carrega mais potencial do que o que parte.</div>`,
    },
    6:{
      caminho:`<p class="statement">Seu Caminho de Vida é de cuidado, responsabilidade e a arte de criar ambientes onde a vida possa florescer. Você veio ao mundo para nutrir — pessoas, relações, espaços e comunidades.</p><p>A grande lição do caminho 6 é aprender que cuidar dos outros não pode vir à custa de se abandonar. Você tem uma tendência natural de colocar as necessidades alheias à frente das suas — e o universo vai te colocar repetidamente em situações onde essa escolha tem um preço alto demais para ser sustentável.</p><p>Seu desafio mais profundo é aprender que você não precisa se sacrificar para ser amado, que não é responsável por resolver tudo ao redor e que a perfeição que você busca no mundo começa pela aceitação da imperfeição em si mesmo.</p><p>Quando equilibrado, o 6 é uma das vibrações mais poderosas de cura e transformação coletiva. Você cria família onde não há laço de sangue — e esse é um dos dons mais raros da existência.</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu cuido com amor e com limites. Minha responsabilidade começa em mim.</div>`,
      expressao:`<p class="statement">Sua Expressão no mundo tem a marca do acolhimento e da harmonia. O modo como você age carrega cuidado, senso estético e uma atenção ao bem-estar dos outros que se manifesta em cada detalhe.</p><p>Seus talentos naturais incluem liderança com empatia, senso de justiça, capacidade de cuidar e ensinar, refinamento estético e uma habilidade de criar ambientes onde as pessoas se sentem seguras para ser quem são.</p><p>O risco da sua expressão é o perfeccionismo paralisante: você pode se tornar tão exigente consigo e com o entorno que o ideal se torna inimigo do real. Aprenda a fazer bem sem precisar fazer perfeito.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Meu talento é criar beleza e acolhimento. Sirvo com amor e com inteligência emocional.</div>`,
      alma:`<p class="statement">No fundo do seu ser existe um desejo profundo de harmonia — em casa, nos relacionamentos, no mundo ao redor. Sua Alma quer um lar que seja também refúgio, onde o amor seja incondicional e o cuidado seja mútuo.</p><p>Você é movido internamente pela necessidade de pertencer a algo maior — família, comunidade, causa. Quando esse pertencimento é saudável, você floresce. Quando ele se torna obrigação ou culpa, você murcha sem entender por quê.</p><p>O desafio da sua Alma é aceitar que amor real não precisa de martírio. Você não precisa sofrer para provar que se importa. O amor que sua alma busca é o que nutre — não o que esgota.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Minha alma deseja amor verdadeiro e harmonia real. Cuido sem me perder, amo sem me sacrificar.</div>`,
      personalidade:`<p class="statement">O mundo te enxerga como alguém confiável, caloroso e com uma presença que acolhe. As pessoas buscam você quando precisam de conselho, de cuidado ou simplesmente de um lugar seguro para ser.</p><p>Essa reputação é valiosa — mas pode te colocar no papel de quem "resolve tudo", sem espaço para ser o que precisa de cuidado também. Mostre ao mundo que você também tem necessidades. Essa vulnerabilidade não te diminui — te aproxima.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença acolhe e inspira. Também sei pedir o que preciso.</div>`,
      dia:`<p class="statement">Nascido em um dia 6, você chegou com um senso de responsabilidade afetiva desde cedo. Talvez tenha sido o filho que cuidava dos outros, o amigo em quem todos confiavam ou o estudante que se preocupava com o coletivo além do individual.</p><p>Esse número de nascimento confere generosidade natural, senso de beleza e uma maturidade emocional que às vezes surpreendia os adultos ao seu redor. Seu desafio é não transformar cuidado em identidade obrigatória.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com o dom do cuidado. Amo com consciência e com limites sagrados.</div>`,
      ano:`<p class="statement">Um Ano Pessoal 6 é o ano das responsabilidades afetivas, da vida doméstica e dos relacionamentos próximos. Este ciclo pede atenção ao lar — em todos os sentidos: o físico, o emocional e o espiritual.</p><p>É um ano favorável para resolver questões familiares, aprofundar vínculos, cuidar da saúde e criar mais harmonia nos ambientes onde você vive. Decisões de longo prazo sobre moradia, família e compromissos afetivos podem ganhar mais clareza.</p><p>O desafio do ano é não se perder no cuidado dos outros ao ponto de negligenciar o que você precisa. Cuide de quem ama — e cuide de si com a mesma dedicação.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo pede amor ativo e responsabilidade consciente. O lar é onde sua alma cresce agora.</div>`,
    },
    7:{
      caminho:`<p class="statement">Seu Caminho de Vida é de aprofundamento, conhecimento e a busca pela compreensão das camadas invisíveis da existência. Você veio ao mundo para ir fundo — em ideias, em espiritualidade, em si mesmo.</p><p>A grande lição do caminho 7 é aprender a confiar na intuição tanto quanto na razão — e entender que o isolamento que você busca às vezes não é refúgio, mas fuga. O universo vai te colocar em situações de conexão real, onde fugir não será uma opção — e nesses momentos, você descobrirá que a profundidade que buscava nos livros também existe nas pessoas.</p><p>Sua trajetória vai ter fases de grande solidão e fases de encontros que mudam tudo. Não lute contra as fases de isolamento — elas são o seu laboratório. Mas não as prolongue artificialmente quando a vida pede que você saia e se conecte.</p><p>Você é alguém que precisa de sentido antes de agir. Quando o sentido está claro, você é imparável. Quando está ausente, nem a vontade se move. Cuide do seu alimento espiritual — ele é a gasolina de tudo o que você é.</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu busco o que está além do aparente. Minha profundidade é serviço ao mundo.</div>`,
      expressao:`<p class="statement">Sua Expressão no mundo tem a marca da inteligência analítica e da busca pela excelência. O modo como você age carrega precisão, cuidado com a verdade e uma tendência a ir além do óbvio em tudo que toca.</p><p>Seus talentos naturais incluem análise, pesquisa, observação, intuição refinada e a capacidade de encontrar padrões onde outros veem caos. Você tem uma mente que não se satisfaz com respostas superficiais — e isso pode ser uma das suas contribuições mais valiosas ao mundo.</p><p>O risco da sua expressão é o excesso de introspecção: você pode refletir tanto que a ação fica paralisada. O mundo precisa não apenas do seu pensamento — precisa da sua manifestação. Às vezes, compartilhar o que você descobriu é tão importante quanto descobrir.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Minha profundidade analítica é dom. Penso com rigor e compartilho com coragem.</div>`,
      alma:`<p class="statement">No fundo do seu ser existe uma sede quase insaciável de compreensão — você quer entender não apenas como as coisas funcionam, mas por que existem. Sua Alma é de um pesquisador do invisível.</p><p>O que você busca profundamente é sentido — nas relações, no trabalho, no sofrimento, na alegria. Quando algo não faz sentido para você, não consegue se engajar plenamente. Sua motivação interna é ativada pela compreensão, não pela obrigação.</p><p>O desafio da sua Alma é aprender a se relacionar com o mistério sem precisar resolvê-lo. Nem tudo que você busca pode ser compreendido — e aprender a viver com as perguntas em aberto é parte do seu amadurecimento mais profundo.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Minha alma busca sabedoria. Aprendo a viver com as perguntas tanto quanto com as respostas.</div>`,
      personalidade:`<p class="statement">O mundo te enxerga como alguém enigmático, sábio e com uma presença que carrega profundidade. As pessoas sentem que há muito mais em você do que o que aparece — e isso cria tanto fascínio quanto distância.</p><p>Seu ar de mistério é genuíno — você de fato não entrega tudo de uma vez, porque precisa de tempo para confiar. Aprenda a criar pontes antes que a distância se torne isolamento permanente. As pessoas que conseguem chegar perto de você raramente querem ir embora.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença tem profundidade. Crio conexões reais ao meu próprio ritmo.</div>`,
      dia:`<p class="statement">Nascido em um dia 7, você chegou ao mundo com a marca do questionador. Desde cedo, aceitava pouco pelo valor aparente — queria entender o mecanismo por trás das coisas, as razões por baixo das explicações.</p><p>Esse número de nascimento confere intuição aguçada, capacidade analítica e uma vida interior rica. Seu desafio é não se perder nessa vida interior ao ponto de se isolar do mundo que também tem muito a te ensinar.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com o dom da profundidade. Minha mente questiona e minha alma sente além do visível.</div>`,
      ano:`<p class="statement">Um Ano Pessoal 7 é o ano da introspecção, do aprofundamento espiritual e da revisão interna. Este é um ano de menos ação externa e mais trabalho interno — e isso não é estagnação, é refinamento.</p><p>Estudos, meditação, terapia, retiros, pesquisa e qualquer prática que te leve para dentro são favorecidos. O universo está te pedindo para pausar, refletir e entender o que ficou sem resposta nos ciclos anteriores.</p><p>Evite forçar resultados externos neste ano — o que você planta agora em termos de autoconhecimento florescerá nos próximos ciclos de forma que você ainda não consegue prever.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo pede silêncio e profundidade. O que você descobre em si mesmo agora transforma tudo que vem depois.</div>`,
    },
    8:{
      caminho:`<p class="statement">Seu Caminho de Vida é de poder, abundância e a arte de exercer autoridade com integridade. Você veio ao mundo para lidar com recursos — financeiros, materiais, humanos — e para aprender que o verdadeiro poder não corrompe quando está alinhado com valores.</p><p>A grande lição do caminho 8 é descobrir a diferença entre poder sobre e poder com. Você tem uma energia natural de comando e uma capacidade real de gerar resultados concretos — mas o universo vai te testar sobre como você usa essa força quando ninguém está olhando.</p><p>Sua trajetória terá oscilações dramáticas entre abundância e escassez, poder e impotência. Cada queda é uma lição sobre desapego — não para abandonar a ambição, mas para não confundir o que você tem com o que você vale.</p><p>Quando equilibrado, o 8 é uma força extraordinária de materialização e liderança. Você tem o potencial de construir impérios — materiais e espirituais. A questão é sempre: a serviço de quê?</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu exerço poder com responsabilidade. Minha abundância serve ao bem maior.</div>`,
      expressao:`<p class="statement">Sua Expressão no mundo carrega autoridade natural, capacidade de execução e uma presença que comunica competência antes de qualquer palavra. Você tem o talento de transformar visão em resultado concreto.</p><p>Seus dons naturais incluem liderança executiva, pensamento estratégico, capacidade de gerenciar recursos com eficiência e uma visão de longo prazo que enxerga além do óbvio. Você tem o que é preciso para construir algo que dura.</p><p>O risco da sua expressão é confundir eficiência com frieza. A busca por resultado pode criar uma distância emocional que afasta as pessoas que você precisa ter ao lado. Os maiores resultados são construídos em parceria, não em solidão.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Meu talento é materializar com maestria. Lidero com inteligência e com calor humano.</div>`,
      alma:`<p class="statement">No fundo do seu ser existe um desejo profundo de conquista real — não de aparência de sucesso, mas de impacto concreto. Sua Alma quer sentir o peso do que construiu nas próprias mãos.</p><p>Você é movido internamente por uma ambição que não é egoísta — é existencial. Você quer provar para si mesmo que é capaz de materializar o que imagina. Quando isso acontece, há uma satisfação que vai além do resultado: é a confirmação de que sua força é real.</p><p>O desafio da sua Alma é aprender que valor não se mede apenas por conquista. Nos momentos de perda, de queda, de reconstrução — é lá que sua alma mais cresce. O 8 precisa aprender que o que ele é vale mais do que o que ele tem.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Minha alma deseja conquista com integridade. Aprendo que meu valor não depende do que possuo.</div>`,
      personalidade:`<p class="statement">O mundo te enxerga como alguém poderoso, competente e com uma presença que inspira respeito — e às vezes, até um certo temor. Você tem uma energia de autoridade que precede a conversa.</p><p>Essa imagem te abre portas em posições de liderança e confiança. O desafio é que pode criar uma distância com pessoas que gostariam de se aproximar, mas se sentem pequenas demais. Mostre que por trás da autoridade existe também humanidade — isso multiplica sua influência real.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença impõe respeito. Também sei criar espaço para que outros cresçam.</div>`,
      dia:`<p class="statement">Nascido em um dia 8, você chegou ao mundo com ambição natural e um senso precoce de que queria algo concreto desta vida. Desde cedo, havia em você uma determinação que os outros percebiam — mesmo que não soubessem nomear.</p><p>Esse número de nascimento confere resistência, capacidade de recuperação e uma relação intensa com o mundo material. Seu desafio é equilibrar ambição com desapego — conquistar sem se tornar escravo do que conquistou.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com o dom da força executora. Materializo com determinação e integridade.</div>`,
      ano:`<p class="statement">Um Ano Pessoal 8 é o ano da materialização, do poder e das grandes movimentações no mundo concreto. Este é o ciclo em que o esforço dos anos anteriores pode finalmente se transformar em resultado visível e concreto.</p><p>Negócios, finanças, carreira e posições de liderança são favorecidos. O universo está abrindo espaço para que você exerça poder real — e a pergunta é se você está pronto para isso com maturidade e integridade.</p><p>Cuidado com a ambição desmedida: a energia do 8 pode amplificar tanto a conquista quanto a perda. Tome decisões com discernimento, não apenas com urgência.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo pede ação concreta e liderança consciente. O que você constrói agora tem o peso da permanência.</div>`,
    },
    9:{
      caminho:`<p class="statement">Seu Caminho de Vida é de completude, compaixão universal e a sabedoria que vem de ter vivido muita coisa — mesmo quando essa memória não é consciente. Você veio ao mundo para servir ao coletivo com a sabedoria que acumulou.</p><p>A grande lição do caminho 9 é aprender a encerrar ciclos sem dor. Você tem uma tendência a se agarrar ao que foi — pessoas, fases, versões de si mesmo — mesmo quando já está claro que o ciclo se completou. O universo vai te colocar em situações de término repetidas, não como punição, mas como convite à libertação.</p><p>Sua trajetória será marcada por períodos de grande generosidade e períodos em que você precisará receber — e essa última parte é a mais difícil para o 9. Aprender a receber sem culpa é um dos seus maiores desafios.</p><p>Quando equilibrado, o 9 é uma das forças mais humanizadoras da numerologia. Você tem a capacidade de ver além das diferenças e encontrar o que é universalmente humano.</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu sirvo com sabedoria e encerro ciclos com gratidão. Minha compaixão transforma o mundo.</div>`,
      expressao:`<p class="statement">Sua Expressão no mundo tem a marca da humanidade ampliada: você age com uma consciência do coletivo que vai além do interesse pessoal. O que você oferece carrega uma generosidade que as pessoas sentem — não como performance, mas como verdade.</p><p>Seus talentos naturais incluem compaixão, sabedoria intuitiva, capacidade de inspirar, visão humanista e uma habilidade de fazer as pessoas se sentirem menos sozinhas simplesmente por ouvir com presença real.</p><p>O risco da sua expressão é o autoabandono: você pode dar tanto que não sobra nada para si. Aprenda que sua generosidade é mais sustentável quando parte de um lugar de plenitude — não de sacrifício.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Meu talento é servir com sabedoria. Dou com abundância e recebo com graça.</div>`,
      alma:`<p class="statement">No fundo do seu ser existe um amor pelo mundo que às vezes parece grande demais para caber. Sua Alma quer contribuir para algo que vai além da vida individual — um legado, uma cura, uma transformação que permaneça.</p><p>Você é movido internamente por uma compaixão que pode ser dolorosa: você sente o sofrimento ao redor com uma intensidade que outros não entendem. Essa sensibilidade é sua maior força — e também o lugar de onde vem sua maior dor.</p><p>O desafio da sua Alma é aprender a amar sem se perder no amor. A compaixão que cura não é a que se dissolve no outro — é a que permanece firme enquanto oferece calor. Aprenda a ser presença sem ser absorção.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Minha alma ama o mundo com sabedoria. Sirvo com inteireza e com limites sagrados.</div>`,
      personalidade:`<p class="statement">O mundo te enxerga como alguém sábio, compassivo e com uma presença que transmite que "já viveu muita coisa". Há em você uma maturidade que não depende da idade — as pessoas buscam sua perspectiva porque sentem que você enxerga além.</p><p>Essa imagem cria vínculos de confiança e admiração. O desafio é que pode te colocar no papel de quem "já superou tudo" — e isso pode te impedir de pedir ajuda quando precisar. Mostre também sua vulnerabilidade. Ela é parte da sabedoria.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença transmite sabedoria. Também aprendo e peço ajuda com humildade.</div>`,
      dia:`<p class="statement">Nascido em um dia 9, você chegou ao mundo com uma sensibilidade para o sofrimento humano que, desde cedo, te tornava diferente dos que te rodeavam. Talvez você tenha sentido o peso do mundo antes de ter palavras para isso.</p><p>Esse número de nascimento confere compaixão natural, intuição refinada e uma sabedoria que parece mais antiga do que os anos vividos. Seu desafio é transformar essa sensibilidade em serviço — sem se perder no processo.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com o dom da compaixão. Minha sensibilidade é instrumento de cura.</div>`,
      ano:`<p class="statement">Um Ano Pessoal 9 é o ano do encerramento, da liberação e da conclusão de um ciclo de nove anos. Este é o momento de deixar ir — pessoas, padrões, crenças, situações — que já cumpriram seu papel na sua vida.</p><p>Pode haver perdas neste ciclo — e elas são parte necessária da limpeza que precede o novo começo. O universo está criando espaço para algo totalmente novo que chegará no próximo ciclo. Resista à tentação de agarrar o que já está pronto para partir.</p><p>É um ano favorável para encerrar projetos, resolver pendências emocionais, perdoar e ser perdoado, e para práticas de cura e espiritualidade profunda.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo pede encerramento e liberação. O que você deixa ir abre espaço para tudo que ainda vai chegar.</div>`,
    },
    11:{
      caminho:`<p class="statement">Seu Caminho de Vida é de inspiração, iluminação e a missão de trazer luz a espaços que ainda não a encontraram. O 11 é um Número Mestre — e isso significa que seu destino carrega uma vibração amplificada, com dons extraordinários e desafios à altura.</p><p>A grande lição do caminho 11 é aprender a confiar na sua própria percepção. Você capta frequências que a maioria não percebe — intuições, atmosferas, mensagens entre as linhas. Mas há momentos em que essa sensibilidade te paralisa, porque o que você sente parece grande demais para ser real. Aprenda a acreditar no que percebe.</p><p>Sua trajetória tende a ser intensa, não linear e profundamente transformadora — tanto para você quanto para quem está ao seu lado. O 11 não está aqui para uma vida comum. Ele está aqui para encarnar uma possibilidade de ser que serve de referência para outros — não por perfeição, mas por autenticidade radical.</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu sou canal de luz. Minha sensibilidade é missão — não fraqueza.</div>`,
      expressao:`<p class="statement">Sua Expressão carrega uma frequência elevada de inspiração e visão. O modo como você age no mundo toca as pessoas em camadas que vão além do racional — você transmite algo difícil de nomear, mas impossível de ignorar.</p><p>Seus talentos incluem percepção intuitiva, comunicação inspiracional, criatividade elevada e uma capacidade de ver conexões entre coisas que, para outros, parecem completamente separadas. Você faz as pessoas pensarem de formas novas.</p><p>O risco da sua expressão é a dispersão pela hipersensibilidade: absorver demais do ambiente ao redor pode te deixar sobrecarregado e sem energia para criar. Aprenda práticas de proteção energética como ferramenta de produtividade, não de isolamento.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Minha expressão inspira. Canalizo minha sensibilidade em criação consciente.</div>`,
      alma:`<p class="statement">No fundo do seu ser existe uma chama que não se apaga — um desejo de elevar, de inspirar, de tocar o divino e trazer um fragmento dele para o plano humano. Sua Alma é de um visionário que sente que existe mais do que o que os olhos veem.</p><p>Você busca profundamente por conexões espirituais autênticas, por vínculos de alma, por experiências que transcendam o ordinário. A banalidade te entedia não por arrogância — mas porque sua alma sabe que existe uma frequência mais alta e ela anseia por ela.</p><p>O desafio da sua Alma é aprender a viver o sagrado no cotidiano. O extraordinário não está apenas nos picos de experiência espiritual — está também no ritual simples, na conversa honesta, no silêncio compartilhado. Aterrar a luz é sua tarefa mais delicada.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Minha alma busca o sagrado em tudo. Aprendo a encontrar o infinito no cotidiano.</div>`,
      personalidade:`<p class="statement">O mundo te enxerga como alguém diferente — não no sentido de excêntrico, mas no sentido de que sua presença carrega algo que não se enquadra facilmente nas categorias habituais. As pessoas sentem que há mais em você.</p><p>Essa percepção cria fascínio e, às vezes, certa incompreensão. Você pode se sentir solitário mesmo rodeado de pessoas — porque o que você precisa compartilhar nem sempre encontra reciprocidade. Busque seus pares: eles existem.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença é singular e inspiradora. Encontro os que me compreendem em profundidade.</div>`,
      dia:`<p class="statement">Nascido em um dia que vibra o 11, você chegou ao mundo com a sensibilidade amplificada de um receptor fino. Desde cedo, havia em você algo que percebia o que outros não viam — emoções nas entrelinhas, atmosferas de ambientes, verdades por trás das aparências.</p><p>Esse número confere intuição poderosa, criatividade elevada e uma vida interior rica. Seu desafio é aprender a aterrar essa sensibilidade — não sufocá-la, mas dar a ela forma e direção no mundo concreto.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com sensibilidade de antena. Minha percepção é dom que aprendo a usar com sabedoria.</div>`,
      ano:`<p class="statement">Um Ano Pessoal 11 é raro e intenso. É um ano em que o véu entre o ordinário e o extraordinário fica mais fino — e sua percepção espiritual se aguça de formas que podem surpreender até você mesmo.</p><p>Inspirações incomuns, encontros significativos, revelações inesperadas e uma sensação de que algo maior está se organizando ao redor da sua vida marcam este ciclo. Fique atento aos sinais — eles são mais frequentes e mais claros do que o habitual.</p><p>Cuide do sistema nervoso: a intensidade do 11 pode ser desgastante. Rotinas de aterramento, silêncio e práticas de restauração são essenciais para atravessar este ano com sanidade e aproveitamento real.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo amplifica sua percepção. Fique atento, ancorado e aberto ao que o universo está revelando.</div>`,
    },
    22:{
      caminho:`<p class="statement">Seu Caminho de Vida é de materialização em escala — você veio para construir algo que vai além do individual e que serve ao coletivo de formas concretas e duradouras. O 22 é o Número Mestre do construtor visionário.</p><p>A grande lição do caminho 22 é aprender a sustentar a grandeza sem se perder nela. Você tem uma capacidade real de criar estruturas que impactam muitas vidas — mas o peso dessa missão pode se tornar esmagador se você não aprender a delegar, a descansar e a reconhecer seus próprios limites.</p><p>Sua trajetória terá momentos de grandiosidade e momentos de colapso que parecem incompatíveis com seu tamanho. Não se engane: os colapsos são parte da limpeza que o prepara para a próxima fase de construção.</p><p>O que você constrói durante a vida — seja uma empresa, uma família, uma instituição ou uma obra — carrega a vibração do 22: solidez, propósito e permanência. Mas tudo isso começa pela clareza de para que você está construindo.</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu construo em grande escala com propósito e equilíbrio. Minha obra serve além de mim.</div>`,
      expressao:`<p class="statement">Sua Expressão combina visão elevada com capacidade de execução concreta — uma combinação extraordinariamente rara. Você consegue sonhar grande e, ao mesmo tempo, montar o passo a passo para chegar lá.</p><p>Seus talentos incluem planejamento estratégico, liderança de alto nível, capacidade de inspirar e organizar ao mesmo tempo, e uma habilidade de ver o sistema inteiro enquanto cuida dos detalhes. Você é um arquiteto em sentido amplo.</p><p>O risco é a sobrecarga: você assume responsabilidades que muitas vezes ninguém pediu que assumisse — porque sente que, se não fizer, não será feito. Aprenda que parte da sua missão é também capacitar outros a construir.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Meu talento é construir o que permanece. Lidero com visão e com sabedoria de delegar.</div>`,
      alma:`<p class="statement">No fundo do seu ser existe um desejo de deixar o mundo melhor do que encontrou — não como slogan, mas como necessidade existencial. Sua Alma sente o peso da responsabilidade coletiva e não consegue se satisfazer apenas com conquistas individuais.</p><p>Você busca internamente por projetos que tenham impacto real, por legados que resistam ao tempo e por uma sensação de que o esforço que você emprega está servindo a algo maior. Quando esse senso de propósito está presente, você é imparável. Quando está ausente, você murcha mesmo em meio ao sucesso.</p><p>O desafio da sua Alma é aprender que descanso também é missão. Você não pode construir o mundo se estiver destruindo a si mesmo no processo. Cuidar de você é parte da grande obra.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Minha alma deseja construir legado com equilíbrio. Sirvo ao mundo a partir de um lugar de plenitude.</div>`,
      personalidade:`<p class="statement">O mundo te enxerga como alguém capaz — alguém que parece ter a medida certa de ambição, competência e responsabilidade. As pessoas confiam em você com projetos grandes porque sua presença transmite que você pode sustentar o peso.</p><p>Essa reputação é valiosa — e também pode se tornar uma armadilha. Você pode se sentir preso no papel de quem "sempre consegue". Permita-se também ser visto nas dificuldades. A vulnerabilidade não apaga a grandeza — ela a humaniza.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença transmite capacidade. Também sei pedir o suporte que preciso.</div>`,
      dia:`<p class="statement">Nascido em um dia que vibra o 22, você chegou ao mundo com uma seriedade de propósito que muitos demoraram anos para desenvolver. Desde cedo, havia em você um senso de que estava aqui para algo — mesmo antes de saber o que era.</p><p>Esse número confere potência construtiva, resistência excepcional e uma visão que naturalmente pensa em sistemas, não apenas em partes. Seu desafio é não deixar esse peso de missão se tornar ansiedade — construa no ritmo que sustenta, não no ritmo que exaure.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com a força de construir grande. Manifesto com visão e com equilíbrio.</div>`,
      ano:`<p class="statement">Um Ano Pessoal 22 é extraordinário e exigente. É um ciclo em que oportunidades de impacto real chegam — e em que a capacidade de materializar em grande escala está amplificada.</p><p>Projetos que podem mudar a trajetória da sua vida e de outros estão sendo convocados agora. O universo está oferecendo estrutura para que você construa algo que dure — mas pede que você apareça com comprometimento total.</p><p>Cuidado com o esgotamento: a grandiosidade do 22 pode te levar a assumir mais do que é humanamente sustentável. Escolha com sabedoria onde investir sua energia — porque ela é finita, mesmo quando o propósito parece infinito.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo pede construção em grande escala. Apareça com propósito e com sabedoria de cuidar de si no processo.</div>`,
    },
    33:{
      caminho:`<p class="statement">Seu Caminho de Vida carrega a vibração mais rara dos Números Mestres — a do amor consciente que cura sem se perder, que serve sem se sacrificar e que inspira sem precisar de palco. O 33 é o mestre da compaixão.</p><p>A grande lição do caminho 33 é aprender que você não pode salvar ninguém — mas pode iluminar o caminho para que as pessoas se salvem a si mesmas. Há em você um impulso quase irresistível de resolver a dor alheia. Mas o universo vai te mostrar, repetidas vezes, que isso não funciona — nem para eles, nem para você.</p><p>Sua trajetória será marcada por encontros profundos, pela dor de amar muito e pela alegria de ver transformações que você cultivou em outros. O 33 como caminho é uma honra que poucos carregam. E é também um peso que só se torna leve quando você aprende que a compaixão mais poderosa começa por você mesmo.</p><div class="readingAffirm"><strong>Afirmação do Caminho</strong>Eu amo com sabedoria e limites sagrados. Minha compaixão começa por mim e se expande para o mundo.</div>`,
      expressao:`<p class="statement">Sua Expressão no mundo tem a marca do amor em ação — você carrega uma presença que acolhe, que ensina pelo exemplo e que transforma simplesmente por estar plenamente presente.</p><p>Seus talentos incluem cura emocional, ensino com amor, liderança compassiva, capacidade de inspirar mudança sem imposição e uma sensibilidade para o sofrimento humano que te torna uma presença transformadora em qualquer espaço.</p><p>O risco é o esgotamento emocional: quando você absorve mais do que oferece de volta para si, o poço seca. Aprenda práticas de restauração e proteção como parte essencial da sua expressão — não como luxo, mas como necessidade.</p><div class="readingAffirm"><strong>Afirmação da Expressão</strong>Meu talento é amar e curar com consciência. Sirvo a partir de um coração que cuida também de si.</div>`,
      alma:`<p class="statement">No fundo do seu ser existe um amor pelo ser humano que, em seus momentos mais intensos, parece não ter bordas. Sua Alma ama em escala coletiva — e essa amplitude é simultaneamente sua maior dádiva e seu maior desafio.</p><p>O que você busca profundamente não é reconhecimento — é a certeza de que fez diferença. Que alguém, graças à sua presença, ficou um pouco mais inteiro. Essa é a moeda da sua alma — e ela é escassa no mundo contemporâneo.</p><p>O desafio da sua Alma é aprender a receber o amor que você dá com tanta facilidade. Você foi feito para dar — mas também para receber. Permita-se ser cuidado. Essa abertura é, talvez, sua maior conquista.</p><div class="readingAffirm"><strong>Afirmação da Alma</strong>Minha alma ama em escala coletiva. Aprendo a receber com a mesma graça com que dou.</div>`,
      personalidade:`<p class="statement">O mundo te enxerga como alguém profundamente humano — alguém que irradia uma presença que cura simplesmente por existir. As pessoas se sentem melhor depois de passar um tempo com você — sem saber exatamente por quê.</p><p>Esse dom é extraordinário e precisa de cuidado. Nem todas as pessoas que se aproximam estão prontas para a qualidade de amor que você oferece — algumas podem se tornar dependentes, outras podem tomar mais do que dão. Aprenda a discernir sem se fechar.</p><div class="readingAffirm"><strong>Afirmação da Personalidade</strong>Minha presença cura e inspira. Mantenho limites que protegem minha luz.</div>`,
      dia:`<p class="statement">Nascido em um dia que vibra o 33, você chegou ao mundo com uma sensibilidade para o sofrimento humano que, desde cedo, te tornava diferente. Talvez você tenha sido o que confortava os amigos, o que sentia o clima antes de todos ou o que simplesmente ficava ao lado sem precisar de palavras.</p><p>Esse número confere amor expandido, intuição emocional profunda e uma presença naturalmente curativa. Seu desafio é não transformar isso em martírio — você pode amar e ser amado de volta.</p><div class="readingAffirm"><strong>Dom do Dia</strong>Nasci com o dom da compaixão mestra. Amo com sabedoria e recebo com graça.</div>`,
      ano:`<p class="statement">Um Ano Pessoal 33 é raro e profundamente espiritual. É um ciclo em que seu papel de presença curativa e amorosa está amplificado — e em que o universo convoca você para servir de formas que talvez ainda não antecipou.</p><p>Oportunidades de ensinar, curar, inspirar e contribuir para o bem coletivo surgem em quantidade e qualidade incomuns. Seu coração está especialmente aberto — e com isso vem tanto a possibilidade de grande amor quanto de grande vulnerabilidade.</p><p>Cuide de si com a mesma dedicação que cuida dos outros. Este é um ano para amar bem — não apenas muito.</p><div class="readingAffirm"><strong>Mensagem do Ano</strong>Este ciclo pede amor consciente e serviço com sabedoria. Sua compaixão está em pleno florescimento.</div>`,
    },
  };
  function getLeitura(num, ctx){
    const entry = LEITURAS[num];
    if(!entry) return `<p>Leitura para o número ${num} em construção.</p>`;
    return entry[ctx] || entry.caminho || `<p>Leitura para este contexto em breve.</p>`;
  }

  /* ── Leituras para novos módulos ── */

  const PINACULOS_LEITURAS = {
    1:'Período de iniciativas, autonomia e coragem. O universo favorece quem age com determinação.',
    2:'Período de parcerias, diplomacia e sensibilidade. Relacionamentos moldam o caminho.',
    3:'Período de expressão criativa, comunicação e expansão social.',
    4:'Período de construção sólida, trabalho disciplinado e estabelecimento de bases.',
    5:'Período de mudanças, liberdade e experiências transformadoras.',
    6:'Período de responsabilidades familiares, cuidado e harmonia nos relacionamentos.',
    7:'Período de introspecção, estudo profundo e desenvolvimento espiritual.',
    8:'Período de poder, realizações materiais e liderança.',
    9:'Período de conclusões, serviço ao próximo e fechamento de ciclos.',
    11:'Período de iluminação, intuição elevada e missão espiritual intensa.',
    22:'Período de construções monumentais e legado coletivo.',
    33:'Período de amor incondicional, ensino e serviço transformador.',
  };

  const DESAFIOS_LEITURAS = {
    0:'O desafio 0 é o mais exigente: todos os desafios se somam. Você veio aprender em amplitude total — a liberdade é sua, mas também a responsabilidade.',
    1:'Dificuldade em afirmar a própria identidade. O desafio é desenvolver autoconfiança sem arrogância, aprender a se posicionar sem depender da validação externa.',
    2:'Dificuldade nas relações interpessoais. O desafio é aprender a cooperar sem se perder, a ser sensível sem ser reativo, a criar paz genuína.',
    3:'Dificuldade de expressão e autoestima. O desafio é vencer o medo de ser julgado ao se expressar, e aprender a canalizar a criatividade com foco.',
    4:'Dificuldade com ordem, disciplina e limitações práticas. O desafio é encontrar liberdade dentro das estruturas, não apesar delas.',
    5:'Dificuldade com comprometimento e foco. O desafio é aprender que a verdadeira liberdade não está na fuga das responsabilidades.',
    6:'Dificuldade com responsabilidades e relacionamentos afetivos. O desafio é cuidar sem se martirizar, e receber com a mesma abertura com que dá.',
    7:'Dificuldade com fé e confiança — em si mesmo e no universo. O desafio é aprender a agir mesmo sem certeza absoluta.',
    8:'Dificuldade com poder e dinheiro. O desafio é desenvolver uma relação saudável com a abundância material, sem nem rejeitar nem obsessionar.',
    9:'Dificuldade com desapego e compaixão. O desafio é aprender a se entregar sem se perder, a servir sem se anular.',
  };

  const LICOES_LEITURAS = {
    1:'Autoconfiança e iniciativa precisam ser cultivadas. Você veio aprender a ser o primeiro, a ocupar seu espaço sem pedir licença.',
    2:'Cooperação, diplomacia e sensibilidade às necessidades alheias são habilidades a desenvolver nesta vida.',
    3:'Expressão criativa, comunicação e alegria de viver pedem desenvolvimento. Aprender a se mostrar é parte da sua jornada.',
    4:'Disciplina, organização e trabalho consistente são lições kármicas. Você aprende o valor da paciência e da construção sólida.',
    5:'Flexibilidade, adaptação e abertura ao novo são temas centrais desta encarnação.',
    6:'Amor incondicional, responsabilidade com o próximo e harmonia nos relacionamentos são aprendizados centrais.',
    7:'Fé, introspecção e busca pelo conhecimento profundo são caminhos que precisam ser trilhados com mais consciência.',
    8:'Maestria sobre o mundo material — dinheiro, poder, influência — é uma lição kármica importante nesta vida.',
    9:'Desapego, compaixão universal e capacidade de encerrar ciclos são habilidades que a alma veio desenvolver.',
  };

  const MATURIDADE_LEITURAS = {
    1:'A maturidade revela um ser de liderança genuína. Após os 45, você naturalmente ocupa espaços de pioneirismo com muito mais leveza e autenticidade.',
    2:'A maturidade traz uma sensibilidade refinada e profunda capacidade de conexão. Você se torna um mediador nato nas esferas que habita.',
    3:'A maturidade amplifica sua expressão criativa. A segunda metade da vida tende a ser a mais fértil e genuinamente sua.',
    4:'A maturidade consolida um ser de estrutura e sabedoria prática. Você se torna referência de solidez e integridade.',
    5:'A maturidade liberta. A segunda metade da vida traz uma liberdade mais consciente, menos reativa e mais rica em significado.',
    6:'A maturidade aprofunda sua capacidade de amar com sabedoria. O cuidado que você oferece após os 45 é mais equilibrado e menos sacrificial.',
    7:'A maturidade revela o filósofo que sempre esteve em você. Seus anos mais velhos tendem a ser os de maior clareza espiritual.',
    8:'A maturidade traz maestria genuína sobre o mundo material e espiritual. Você se torna um modelo de como poder e integridade coexistem.',
    9:'A maturidade transforma toda a sua experiência em sabedoria coletiva. Você se torna um repositório vivo de humanidade.',
    11:'A maturidade aguça sua intuição a níveis extraordinários. A segunda metade da vida tende a ser profundamente espiritual.',
    22:'A maturidade revela o grande construtor. Seus projetos mais significativos e duradouros tendem a surgir após os 45.',
    33:'A maturidade consagra o mestre do amor. Você se torna um farol de cura e sabedoria para todos ao redor.',
  };

  const EQUILIBRIO_LEITURAS = {
    1:'Em momentos de crise, você recorre à sua força interior e à capacidade de agir sozinho. Sua âncora é a autonomia.',
    2:'Em crise, você busca equilíbrio através da harmonia e do diálogo. Parcerias e escuta profunda são seu porto seguro.',
    3:'Em crise, você se ancora na expressão criativa. Criar, comunicar e conectar-se são seu remédio natural.',
    4:'Em crise, você busca ordem e estrutura. Rotinas e planejamento concreto restauram sua sensação de segurança.',
    5:'Em crise, você precisa de movimento e abertura. Mudança de perspectiva e novas experiências te reequilibram.',
    6:'Em crise, você encontra equilíbrio no cuidado e na harmonia relacional. O amor é sua âncora fundamental.',
    7:'Em crise, você recorre à introspecção e ao conhecimento. Silêncio, estudo e contemplação te restauram.',
    8:'Em crise, você busca retomar o controle através da ação concreta e do foco em resultados mensuráveis.',
    9:'Em crise, você encontra equilíbrio no serviço e na perspectiva ampla. Ajudar ao próximo te recalibra.',
    11:'Em crise, você recorre à intuição e à espiritualidade. Meditação e conexão com o invisível são seu refúgio.',
    22:'Em crise, você se ancora em grandes propósitos. Retornar à visão maior te reequilibra quando o imediato parece caótico.',
    33:'Em crise, você encontra equilíbrio no amor incondicional — por si mesmo primeiro, depois pelo mundo.',
  };

  const CICLOS_LEITURAS = {
    formativo: {
      1:'Formação marcada pela necessidade de desenvolver identidade própria. Os primeiros anos pedem que você aprenda a confiar em si.',
      2:'Formação moldada pela sensibilidade e pela necessidade de harmonia. Relações afetivas têm peso central neste ciclo.',
      3:'Formação criativa e expressiva. Você veio ao mundo com um dom de comunicação que começa a florescer cedo.',
      4:'Formação estruturada. Os primeiros anos te ensinam o valor do esforço, da disciplina e da construção sólida.',
      5:'Formação marcada por mudanças e adaptações. Você aprende cedo que a vida é fluxo, e isso molda sua flexibilidade.',
      6:'Formação centrada na família e nas responsabilidades afetivas. O ambiente doméstico é determinante para sua estrutura emocional.',
      7:'Formação introspectiva. Desde cedo você buscou compreender mais do que apenas vivenciar.',
      8:'Formação que te coloca diante de temas de poder e recursos. Você aprende cedo a lidar com ambição e seus efeitos.',
      9:'Formação marcada pela sensibilidade ao coletivo. Desde pequeno, você carrega a dor e a alegria do mundo.',
      11:'Formação intensa e sensível. Sua hipersensibilidade define muito da sua infância e adolescência.',
      22:'Formação que canaliza grandes aspirações. Você sente desde cedo que há algo maior à sua espera.',
      33:'Formação profundamente afetiva e vocacional. Você aprende o amor em sua forma mais plena nos primeiros anos.',
    },
    produtivo: {
      1:'Fase adulta de liderança e iniciativas pioneiras. É neste ciclo que sua força de vontade e independência se consolidam.',
      2:'Fase adulta centrada em parcerias e relações. As grandes decisões desta fase são moldadas pelas conexões que você constrói.',
      3:'Fase adulta criativa e comunicativa. Este é o período de maior expressão e expansão social.',
      4:'Fase adulta de construção concreta. Trabalho duro, disciplina e resultados tangíveis definem este período.',
      5:'Fase adulta de mudanças e aventuras. Este é o período de maior dinamismo e transformação.',
      6:'Fase adulta de responsabilidades familiares e profissionais. O cuidado com o outro é tema central.',
      7:'Fase adulta de aprofundamento e especialização. É neste ciclo que você desenvolve seu maior conhecimento.',
      8:'Fase adulta de poder e realizações. Ambição e execução definem este período produtivo.',
      9:'Fase adulta de serviço e sabedoria crescente. Você começa a olhar além do individual.',
      11:'Fase adulta de missão e inspiração. Seu maior impacto sobre os outros se manifesta neste ciclo.',
      22:'Fase adulta de grandes construções. Os seus projetos de maior escala e legado tomam forma aqui.',
      33:'Fase adulta de amor maduro e ensino através do exemplo.',
    },
    colheita: {
      1:'Colheita de autonomia conquistada. A terceira fase revela um ser que se tornou genuinamente seu.',
      2:'Colheita de relações profundas e sabedoria interpessoal. Você termina sua jornada como construtor de pontes.',
      3:'Colheita criativa e expressiva. Os últimos anos tendem a ser os mais prolíficos em expressão genuína.',
      4:'Colheita de solidez e legado concreto. O que você construiu permanece.',
      5:'Colheita de liberdade consciente. A terceira fase traz uma leveza conquistada através da experiência.',
      6:'Colheita de amor. Você termina sua jornada cercado de vínculos profundos que cultivou ao longo da vida.',
      7:'Colheita espiritual e filosófica. Os últimos anos são de grande clareza e paz interior.',
      8:'Colheita de poder e maestria. Você termina sabendo como equilibrar conquista e sabedoria.',
      9:'Colheita de compaixão universal. A terceira fase te revela como repositório vivo de humanidade.',
      11:'Colheita de iluminação. A terceira fase é a de maior clareza espiritual e intuição.',
      22:'Colheita de legado. O que você construiu transcende sua própria existência.',
      33:'Colheita de amor puro e incondicional. A terceira fase consagra o mestre que você sempre foi.',
    },
  };

  /* ── Render resultado completo ── */
  function renderResultado(nomeRaw, dateRaw){
    const date = parseDateBR(dateRaw);
    const nome = limpar(nomeRaw);
    const idadeAprox = ANO_ATUAL - date.ano;

    const nums = {
      'Caminho de Vida':        {val: calcCaminhoVida(date),   ctx:'caminho',       sub:'data de nascimento'},
      'Expressão':              {val: calcExpressao(nome),     ctx:'expressao',     sub:'todas as letras do nome'},
      'Alma':                   {val: calcAlma(nome),          ctx:'alma',          sub:'vogais · motivação interior'},
      'Personalidade':          {val: calcPersonalidade(nome), ctx:'personalidade', sub:'consoantes · impressão externa'},
      'Dia de Nascimento':      {val: calcDia(date),           ctx:'dia',           sub:'dom do dia'},
      [`Ano Pessoal ${ANO_ATUAL}`]: {val: calcAnoPessoal(date), ctx:'ano',           sub:'ciclo vigente'},
    };

    const caminho = nums['Caminho de Vida'].val;
    const expressao = nums['Expressão'].val;

    // Detectar dominâncias
    const contagem = {};
    Object.values(nums).forEach(({val}) => { contagem[val] = (contagem[val]||0) + 1; });
    const dominantes = Object.entries(contagem).filter(([,c]) => c >= 2)
      .map(([n,c]) => ({num:+n, count:c}))
      .sort((a,b) => b.count - a.count);
    const domSet = new Set(dominantes.map(d => d.num));

    // Pináculos
    const pinaculos = calcPinaculos(date);
    const periodos = calcPeriodosPinaculos(caminho, date.ano);

    // Desafios
    const desafios = calcDesafios(date);

    // Lições
    const licoes = calcLicoesKarmicas(nomeRaw);

    // Maturidade e Equilíbrio
    const maturidade = calcMaturidade(caminho, expressao);
    const equilibrio = calcEquilibrio(nomeRaw);

    // Ciclos
    const ciclos = calcCiclos(date);

    /* ── HTML Cards principais ── */
    const cards = Object.entries(nums).map(([label,{val, sub}]) => {
      const titulo = TITULOS[val] || '';
      return `<div class="numCard${domSet.has(val)?' dominant':''}">
        <div class="cLabel">${label}</div>
        <div class="cVal">${val}</div>
        <div class="cTit">${titulo}</div>
        <div class="cSub">${sub}</div>
      </div>`;
    }).join('');

    let domHtml = '';
    if(dominantes.length){
      const msgs = dominantes.map(({num, count}) => {
        const labels = Object.entries(nums).filter(([,{val}]) => val === num).map(([l]) => l);
        return `<div class="domItem"><strong>${num}</strong> — aparece ${count} vezes (${labels.join(', ')}). A repetição de um número amplifica tanto seu dom quanto seu desafio.</div>`;
      }).join('');
      domHtml = `<div class="domSection"><div class="domTitle">✦ Números dominantes no seu mapa</div>${msgs}</div>`;
    }

    /* ── Accordion principal ── */
    const accordion = Object.entries(nums).map(([label,{val,ctx,sub}]) => {
      const titulo = TITULOS[val] || '';
      const leitura = getLeitura(val, ctx);
      return `<div class="accItem">
        <button class="accHead" type="button">
          <div class="accLeft">
            <span class="aLabel">${label} <span class="aLabelSub">· ${sub}</span></span>
            <span class="aNum">${val}</span>
            <span class="aTit">${titulo}</span>
          </div>
          <span class="accChev">▾</span>
        </button>
        <div class="accBody">
          <div class="reading">${leitura}</div>
        </div>
      </div>`;
    }).join('');

    /* ── HTML Pináculos ── */
    const pinaNames = ['Primeiro Pináculo','Segundo Pináculo','Terceiro Pináculo','Quarto Pináculo'];
    const pinaContext = ['Formação e impulso inicial','Realização e amadurecimento','Síntese dos ciclos anteriores','Plenitude e legado'];
    const pinsHtml = pinaculos.map((p, i) => {
      const per = periodos[i];
      const isActive = idadeAprox >= (per.ini - date.ano) && (per.fim === null || idadeAprox <= (per.fim - date.ano));
      const desc = PINACULOS_LEITURAS[p] || '';
      return `<div class="pinRow${isActive?' active':''}">
        <div class="pinLeft">
          <div class="pinLabel">${pinaNames[i]}</div>
          <div class="pinTit">${pinaContext[i]}</div>
          <div class="pinPeriod">${per.label}</div>
        </div>
        <div class="pinNum">${p}</div>
        <div class="pinRight">
          <div class="pinDesc">${desc}</div>
          ${isActive ? '<span class="pinActiveBadge">✦ Período atual</span>' : ''}
        </div>
      </div>`;
    }).join('');

    /* ── HTML Desafios ── */
    const desafioNames = ['Primeiro Desafio','Segundo Desafio','Desafio Principal','Quarto Desafio'];
    const desafioSubs = ['|dia − mês|','|ano − dia|','|2º − 1º|','|ano − mês|'];
    const desafiosHtml = desafios.map((d, i) => {
      const isPrincipal = i === 2;
      const desc = DESAFIOS_LEITURAS[d] || '';
      return `<div class="desafioCard${isPrincipal?' principal':''}">
        <div class="dLabel">${desafioNames[i]}${isPrincipal?' ✦':''}</div>
        <div class="dVal">${d}</div>
        <div class="dTit">${isPrincipal?'Desafio de toda a vida':'Desafio do período'}</div>
        <div class="dSub">${desafioSubs[i]}</div>
        <div style="margin-top:14px;font-size:.9rem;color:#c0b8a8;line-height:1.7;border-top:1px solid var(--redLine);padding-top:12px">${desc}</div>
      </div>`;
    }).join('');

    /* ── HTML Lições Kármicas ── */
    let licoesHtml;
    if(licoes.length === 0){
      licoesHtml = `<div class="semLicoes">Todos os números de 1 a 9 estão presentes no seu nome. Você não possui lições kármicas ausentes nesta encarnação — uma raridade que indica um nível elevado de completude vibratória no nome.</div>`;
    } else {
      licoesHtml = `<div class="licoesWrap">${licoes.map(n => {
        const desc = LICOES_LEITURAS[n] || '';
        return `<div class="licaoItem">
          <div class="licaoNum">${n}</div>
          <div class="licaoRight">
            <div class="lTit">Lição Kármica ${n}</div>
            <div class="lDesc">${desc}</div>
          </div>
        </div>`;
      }).join('')}</div>`;
    }

    /* ── HTML Maturidade e Equilíbrio ── */
    const maturidadeDesc = MATURIDADE_LEITURAS[maturidade] || '';
    const equilibrioDesc = EQUILIBRIO_LEITURAS[equilibrio] || '';
    const specialHtml = `<div class="specialGrid">
      <div class="specialCard">
        <div class="sLabel">Número de Maturidade</div>
        <div class="sVal">${maturidade}</div>
        <div class="sTit">${TITULOS[maturidade]||''}</div>
        <div class="sSub">Caminho de Vida + Expressão · Ativo após os 45</div>
        <div class="sDesc">${maturidadeDesc}</div>
      </div>
      <div class="specialCard">
        <div class="sLabel">Número de Equilíbrio</div>
        <div class="sVal">${equilibrio}</div>
        <div class="sTit">${TITULOS[equilibrio]||''}</div>
        <div class="sSub">Iniciais do nome completo · Âncora em crises</div>
        <div class="sDesc">${equilibrioDesc}</div>
      </div>
    </div>`;

    /* ── HTML Ciclos de Vida ── */
    const cicloNames = ['Ciclo Formativo','Ciclo Produtivo','Ciclo da Colheita'];
    const cicloPeriods = ['Nascimento até ~28 anos','~29 a ~56 anos','~57 anos em diante'];
    const cicloKeys = ['formativo','produtivo','colheita'];
    const ciclosHtml = ciclos.map((c, i) => {
      const isActive = (i === 0 && idadeAprox <= 28) || (i === 1 && idadeAprox >= 29 && idadeAprox <= 56) || (i === 2 && idadeAprox >= 57);
      const desc = (CICLOS_LEITURAS[cicloKeys[i]] || {})[c] || '';
      return `<div class="cicloCard${isActive?' active':''}">
        <div class="ccPhase">${cicloNames[i]}${isActive?' · Atual':''}</div>
        <div class="ccNum">${c}</div>
        <div class="ccName">${TITULOS[c]||''}</div>
        <div class="ccPeriod">${cicloPeriods[i]}</div>
        <div class="ccDesc">${desc}</div>
      </div>`;
    }).join('');

    document.getElementById('resultScreen').innerHTML = `
      <div class="resHeader">
        <div class="resKicker">Consulta realizada</div>
        <div class="resName">${nomeRaw.trim()}</div>
        <div class="resMeta">${dateRaw.trim()} &nbsp;·&nbsp; Sistema Pitagórico</div>
      </div>

      <div class="section">
        <div class="sectionHead">Pirâmide Pitagórica</div>
        ${renderPiramide(nome)}
      </div>

      <div class="orn">⬦ ⬦ ⬦</div>

      <div class="section">
        <div class="sectionHead">Números Principais</div>
        <div class="cardsGrid">${cards}</div>
        ${domHtml}
      </div>

      <div class="orn">⬦ ⬦ ⬦</div>

      <div class="section">
        <div class="sectionHead">Leituras Completas</div>
        <div class="accordion">${accordion}</div>
      </div>

      <div class="orn">⬦ ⬦ ⬦</div>

      <div class="section">
        <div class="sectionHead">Ciclos de Vida</div>
        <div class="ciclosWrap">${ciclosHtml}</div>
      </div>

      <div class="orn">⬦ ⬦ ⬦</div>

      <div class="section">
        <div class="sectionHead">Pináculos · Os Quatro Grandes Ciclos</div>
        <div class="pinsWrap">${pinsHtml}</div>
      </div>

      <div class="orn">⬦ ⬦ ⬦</div>

      <div class="section">
        <div class="sectionHead">Desafios · Obstáculos que Promovem Crescimento</div>
        <div class="desafiosGrid">${desafiosHtml}</div>
      </div>

      <div class="orn">⬦ ⬦ ⬦</div>

      <div class="section">
        <div class="sectionHead">Lições Kármicas · Ausências no Nome</div>
        ${licoesHtml}
      </div>

      <div class="orn">⬦ ⬦ ⬦</div>

      <div class="section">
        <div class="sectionHead">Maturidade e Equilíbrio</div>
        ${specialHtml}
      </div>

      <button class="btnNew" id="btnNew" type="button">✦ Nova consulta</button>
      <p class="footNote">Leitura simbólica e interpretativa · Sistema Pitagórico</p>
    `;

    document.querySelectorAll('.accItem').forEach(item => {
      item.querySelector('.accHead').addEventListener('click', () => {
        item.classList.toggle('open');
      });
    });

    document.getElementById('btnNew').addEventListener('click', () => {
      document.getElementById('resultScreen').classList.add('hidden');
      document.getElementById('formScreen').classList.remove('hidden');
      window.scrollTo({top:0, behavior:'smooth'});
    });

    document.getElementById('formScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');
    window.scrollTo({top:0, behavior:'smooth'});
  }

  /* ── Máscara de data ── */
  document.getElementById('inpDate').addEventListener('input', function(){
    const digits = this.value.replace(/\D/g,'').slice(0,8);
    let v = '';
    if(digits.length <= 2) v = digits;
    else if(digits.length <= 4) v = digits.slice(0,2) + '/' + digits.slice(2);
    else v = digits.slice(0,2) + '/' + digits.slice(2,4) + '/' + digits.slice(4);
    this.value = v;
  });

  document.getElementById('btnReveal').addEventListener('click', () => {
    const nome = document.getElementById('inpName').value.trim();
    const data = document.getElementById('inpDate').value.trim();
    const err  = document.getElementById('errMsg');
    if(!nome){ err.textContent = 'Por favor, informe o nome completo.'; return; }
    if(!parseDateBR(data)){ err.textContent = 'Data inválida. Use o formato DD/MM/AAAA.'; return; }
    err.textContent = '';
    renderResultado(nome, data);
  });

  document.getElementById('inpDate').addEventListener('keydown', function(e){
    const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'];
    if(allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if(e.key === 'Enter'){ document.getElementById('btnReveal').click(); return; }
    if(!/^\d$/.test(e.key)) e.preventDefault();
  });

})();
</script>
</body>
</html>
