/**
 * vega-webhook — Seu Numerólogo
 *
 * Produto filtrado: "Mapa Numerológico Pitagórico Aplicado - SN"
 *
 * sale_wait_payment → envia PIX via WPP (wpp-enviar do 11ds)
 * sale_paid         → atualiza lead + envia PDF por email (Resend) + WPP
 *
 * Env vars no projeto SN:
 *   DS11_URL              https://qdpitjwpvmqsgshsdiab.supabase.co
 *   DS11_SERVICE_ROLE_KEY service role key do projeto 11ds
 *   RESEND_API_KEY        API key do Resend (para email com anexo PDF)
 *   EMAIL_FROM            ex: noreply@seunumerologo.com.br
 *   EMAIL_FROM_NAME       ex: Seu Numerólogo
 *   SITE_URL              https://mapa.seunumerologo.com.br (opcional)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void };

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hub-signature, event',
};

// ── Meta CAPI ─────────────────────────────────────────────────────────────────

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sendCapiPurchase(opts: {
  email: string; phone: string; nome: string;
  value: number; eventSourceUrl: string; eventId: string;
  fbc?: string | null; fbp?: string | null; externalId?: string | null;
}): Promise<void> {
  const pixelId  = Deno.env.get('META_PIXEL_ID')  ?? '';
  const apiToken = Deno.env.get('META_CAPI_TOKEN') ?? '';
  if (!pixelId || !apiToken) { console.warn('META_PIXEL_ID ou META_CAPI_TOKEN não configurados'); return; }

  const nameParts = opts.nome.trim().split(' ');
  const [emHash, phHash, fnHash, lnHash, countryHash] = await Promise.all([
    opts.email ? sha256hex(opts.email.toLowerCase().trim()) : Promise.resolve(null),
    opts.phone ? sha256hex(opts.phone) : Promise.resolve(null),
    nameParts[0]  ? sha256hex(nameParts[0].toLowerCase())                   : Promise.resolve(null),
    nameParts[1]  ? sha256hex(nameParts.slice(1).join(' ').toLowerCase())   : Promise.resolve(null),
    sha256hex('br'),
  ]);

  const userData: Record<string, unknown> = { country: [countryHash] };
  if (emHash)           userData.em          = [emHash];
  if (phHash)           userData.ph          = [phHash];
  if (fnHash)           userData.fn          = [fnHash];
  if (lnHash)           userData.ln          = [lnHash];
  if (opts.fbc)         userData.fbc         = opts.fbc;
  if (opts.fbp)         userData.fbp         = opts.fbp;
  if (opts.externalId)  userData.external_id = [await sha256hex(opts.externalId)];

  const payload = {
    data: [{
      event_name:       'Purchase',
      event_time:       Math.floor(Date.now() / 1000),
      event_id:         opts.eventId,
      event_source_url: opts.eventSourceUrl,
      action_source:    'website',
      user_data:        userData,
      custom_data: {
        currency:     'BRL',
        value:        opts.value.toFixed(2),
        content_name: 'Mapa Numerológico Pitagórico Aplicado',
        content_ids:  ['mapa-sn'],
        content_type: 'product',
      },
    }],
    access_token: apiToken,
  };

  const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) console.warn(`CAPI ${res.status}: ${(await res.text()).slice(0, 300)}`);
  else console.log(`CAPI Purchase enviado → event_id=${opts.eventId}`);
}

const PRODUTO_ALVO = 'Mapa Numerológico Pitagórico Aplicado - SN';
const SITE_URL     = Deno.env.get('SITE_URL') ?? 'https://mapa.seunumerologo.com.br';

// ── helpers ───────────────────────────────────────────────────────────────────

function phone(raw: string) { return raw.replace(/\D/g, ''); }
function sleep(ms: number)  { return new Promise(r => setTimeout(r, ms)); }

/** Chama Edge Function do projeto 11ds */
async function call11ds(path: string, body: unknown): Promise<void> {
  const base   = (Deno.env.get('DS11_URL') ?? '').replace(/\/$/, '');
  const svcKey = Deno.env.get('DS11_SERVICE_ROLE_KEY') ?? '';
  if (!base || !svcKey) { console.warn('DS11_URL ou DS11_SERVICE_ROLE_KEY não configurado'); return; }
  const res = await fetch(`${base}/functions/v1/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${svcKey}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.warn(`call11ds ${path} → ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

function sendWpp(numero: string, mensagem: string) {
  return call11ds('wpp-enviar', { numero, mensagem, typing_delay_ms: 2500 });
}

/** Busca PDF do Supabase Storage e retorna como base64 (ou null se não encontrado) */
async function fetchPdfBase64(db: ReturnType<typeof createClient>, pdfPath: string): Promise<string | null> {
  try {
    const { data, error } = await db.storage
      .from('mapa-pdfs')
      .download(pdfPath.replace(/^mapa-pdfs\//, ''));
    if (error || !data) { console.warn('Storage download error:', error?.message); return null; }
    const buf = await data.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let b64 = '';
    for (let i = 0; i < bytes.length; i++) b64 += String.fromCharCode(bytes[i]);
    return btoa(b64);
  } catch (e) {
    console.warn('fetchPdfBase64 error:', (e as Error).message);
    return null;
  }
}

/** Envia email via Resend com PDF anexo opcional */
async function sendEmailResend(opts: {
  to: string; to_name: string; subject: string;
  html: string; text: string;
  pdfBase64?: string | null; pdfFilename?: string;
}) {
  const apiKey    = Deno.env.get('RESEND_API_KEY') ?? '';
  const fromEmail = Deno.env.get('EMAIL_FROM')      ?? 'noreply@seunumerologo.com.br';
  const fromName  = Deno.env.get('EMAIL_FROM_NAME') ?? 'Seu Numerólogo';
  if (!apiKey) { console.warn('RESEND_API_KEY não configurado — e-mail não enviado'); return; }

  const body: Record<string, unknown> = {
    from: `${fromName} <${fromEmail}>`,
    to:   [`${opts.to_name} <${opts.to}>`],
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  };

  if (opts.pdfBase64) {
    body.attachments = [{
      filename: opts.pdfFilename ?? 'Mapa_Numerologico.pdf',
      content:  opts.pdfBase64,
    }];
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.warn(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

// ── templates ─────────────────────────────────────────────────────────────────

type Lang = 'pt' | 'en' | 'es';

function normalizeLang(value: unknown): Lang {
  return value === 'en' || value === 'es' || value === 'pt' ? value : 'pt';
}

function firstName(nome: string, fallback: string) {
  return nome.trim().split(' ')[0] || fallback;
}

function wppPixRegistrado(nome: string, lang: Lang) {
  const p = firstName(nome, lang === 'en' ? 'there' : lang === 'es' ? 'ti' : 'você');
  if (lang === 'en') {
    return `Hi, ${p}! 👋\n\nYour *Applied Pythagorean Numerology Map* order was registered.\n\nHere is the PIX copy-and-paste code to confirm your access:`;
  }
  if (lang === 'es') {
    return `Hola, ${p}! 👋\n\nTu pedido del *Mapa Numerológico Pitagórico Aplicado* fue registrado.\n\nAquí tienes el código PIX copia y pega para confirmar tu acceso:`;
  }
  return `Olá, ${p}! 👋\n\nSeu pedido do *Mapa Numerológico Pitagórico Aplicado* foi registrado.\n\nSegue o PIX copia e cola para confirmar seu acesso:`;
}

function wppPixInstrucao(lang: Lang) {
  if (lang === 'en') return `Copy the code above and paste it into your banking app. ✅\n\nOnce the payment is confirmed, we will send your complete map here and by e-mail. 🔢`;
  if (lang === 'es') return `Solo copia el código de arriba y pégalo en la app de tu banco. ✅\n\nCuando el pago sea confirmado, enviaremos tu mapa completo por aquí y por e-mail. 🔢`;
  return `É só copiar o código acima e colar no app do seu banco. ✅\n\nAssim que o pagamento for confirmado, enviaremos seu mapa completo por aqui e por e-mail. 🔢`;
}

function wppBoasVindas(nome: string, lang: Lang) {
  const p = firstName(nome, lang === 'en' ? 'there' : lang === 'es' ? 'ti' : 'você');
  if (lang === 'en') {
    return `Hi, ${p}! 🌟\n\nYour *Applied Pythagorean Numerology Map* has been confirmed! ✨\n\nWe have just sent your complete map to your e-mail, with all 12 personalized analyses in PDF.\n\n📧 Please check your inbox and spam folder, just in case.\n\nIf you need anything, reply here. We are with you! 🔢`;
  }
  if (lang === 'es') {
    return `Hola, ${p}! 🌟\n\nTu *Mapa Numerológico Pitagórico Aplicado* fue confirmado! ✨\n\nAcabamos de enviar tu mapa completo a tu e-mail, con los 12 análisis personalizados en PDF.\n\n📧 Revisa tu bandeja de entrada y la carpeta de spam, por si acaso.\n\nCualquier duda, responde aquí. Estamos contigo! 🔢`;
  }
  return `Olá, ${p}! 🌟\n\nSeu *Mapa Numerológico Pitagórico Aplicado* foi confirmado! ✨\n\nAcabamos de enviar o seu mapa completo para o seu e-mail — com todas as 12 análises personalizadas em PDF.\n\n📧 Verifique sua caixa de entrada (e o spam, por precaução).\n\nQualquer dúvida é só responder aqui. Estamos com você! 🔢`;
}

function emailBoasVindas(nome: string, temPdf: boolean, lang: Lang): { subject: string; html: string; text: string } {
  const p = firstName(nome, lang === 'en' ? 'there' : lang === 'es' ? 'ti' : 'você');
  const copy = {
    pt: {
      htmlLang: 'pt-BR',
      subject: `✨ Seu Mapa Numerológico está aqui, ${p}!`,
      logo: 'Seu Numerólogo',
      title: 'Seu Mapa chegou ✨',
      hello: `Olá, ${p}!`,
      confirmed: 'Seu <strong style="color:#D4B06A">Mapa Numerológico Pitagórico Aplicado</strong> foi confirmado com sucesso.',
      pdf: temPdf
        ? 'Seu mapa completo está <strong style="color:#D4B06A">anexado a este e-mail</strong> em PDF — 12 análises personalizadas prontas para você explorar.'
        : `Seu mapa está sendo finalizado e em breve você receberá outro e-mail com o PDF completo. Se precisar antes, acesse: <a href="${SITE_URL}" style="color:#D4B06A">${SITE_URL}</a>`,
      badge1: '📄 Mapa Numerológico Completo · 12 Análises',
      badge2: 'Alma · Imagem · Expressão · Talento · Psíquico · Destino',
      badge3: 'Ciclos · Desafios · Direcionamento · Plano de Ação',
      support: 'Se tiver qualquer dúvida ou precisar de suporte, responda este e-mail.',
      signoff: 'Com gratidão,',
      team: 'Equipe Seu Numerólogo',
      footer: 'Seu Numerólogo · Sistema Pitagórico Sistêmico',
      text: `Olá, ${p}!\n\nSeu Mapa Numerológico Pitagórico Aplicado foi confirmado.\n\n${temPdf ? 'O PDF completo está anexado a este e-mail.' : `Acesse: ${SITE_URL}`}\n\nEquipe Seu Numerólogo`,
    },
    en: {
      htmlLang: 'en',
      subject: `✨ Your Numerology Map is here, ${p}!`,
      logo: 'Seu Numerólogo',
      title: 'Your Map has arrived ✨',
      hello: `Hi, ${p}!`,
      confirmed: 'Your <strong style="color:#D4B06A">Applied Pythagorean Numerology Map</strong> has been confirmed.',
      pdf: temPdf
        ? 'Your complete map is <strong style="color:#D4B06A">attached to this e-mail</strong> as a PDF, with 12 personalized analyses ready for you to explore.'
        : `Your map is being finalized and you will soon receive another e-mail with the full PDF. If you need it sooner, visit: <a href="${SITE_URL}" style="color:#D4B06A">${SITE_URL}</a>`,
      badge1: '📄 Complete Numerology Map · 12 Analyses',
      badge2: 'Soul · Image · Expression · Talent · Psychic · Destiny',
      badge3: 'Cycles · Challenges · Direction · Action Plan',
      support: 'If you have any questions or need support, reply to this e-mail.',
      signoff: 'With gratitude,',
      team: 'Seu Numerólogo Team',
      footer: 'Seu Numerólogo · Systemic Pythagorean Method',
      text: `Hi, ${p}!\n\nYour Applied Pythagorean Numerology Map has been confirmed.\n\n${temPdf ? 'The complete PDF is attached to this e-mail.' : `Visit: ${SITE_URL}`}\n\nSeu Numerólogo Team`,
    },
    es: {
      htmlLang: 'es',
      subject: `✨ Tu Mapa Numerológico está aquí, ${p}!`,
      logo: 'Seu Numerólogo',
      title: 'Tu Mapa llegó ✨',
      hello: `Hola, ${p}!`,
      confirmed: 'Tu <strong style="color:#D4B06A">Mapa Numerológico Pitagórico Aplicado</strong> fue confirmado con éxito.',
      pdf: temPdf
        ? 'Tu mapa completo está <strong style="color:#D4B06A">adjunto a este e-mail</strong> en PDF, con 12 análisis personalizados listos para explorar.'
        : `Tu mapa está siendo finalizado y pronto recibirás otro e-mail con el PDF completo. Si lo necesitas antes, accede a: <a href="${SITE_URL}" style="color:#D4B06A">${SITE_URL}</a>`,
      badge1: '📄 Mapa Numerológico Completo · 12 Análisis',
      badge2: 'Alma · Imagen · Expresión · Talento · Psíquico · Destino',
      badge3: 'Ciclos · Desafíos · Dirección · Plan de Acción',
      support: 'Si tienes cualquier duda o necesitas soporte, responde este e-mail.',
      signoff: 'Con gratitud,',
      team: 'Equipo Seu Numerólogo',
      footer: 'Seu Numerólogo · Sistema Pitagórico Sistémico',
      text: `Hola, ${p}!\n\nTu Mapa Numerológico Pitagórico Aplicado fue confirmado.\n\n${temPdf ? 'El PDF completo está adjunto a este e-mail.' : `Accede a: ${SITE_URL}`}\n\nEquipo Seu Numerólogo`,
    },
  }[lang];

  const subject = copy.subject;

  const html = `<!DOCTYPE html>
<html lang="${copy.htmlLang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
<style>
  body{margin:0;padding:0;background:#0A0A16;font-family:Georgia,serif;color:#E8E0D0}
  .wrap{max-width:580px;margin:0 auto;padding:0 16px}
  .header{background:#0A0A16;padding:40px 0 24px;text-align:center;border-bottom:1px solid rgba(212,176,106,.2)}
  .logo{font-size:11px;letter-spacing:.2em;color:#D4B06A;text-transform:uppercase;margin-bottom:6px}
  .title{font-size:26px;color:#D4B06A;font-weight:normal;margin:0;line-height:1.3}
  .body{background:#0D0D1C;padding:36px 32px;border:1px solid rgba(212,176,106,.15);border-top:none}
  p{font-size:15px;line-height:1.75;color:#B0A898;margin:0 0 18px}
  .badge{display:inline-block;background:rgba(212,176,106,.1);border:1px solid rgba(212,176,106,.3);
         border-radius:8px;padding:14px 20px;margin:8px 0 24px;font-size:14px;color:#D4B06A;line-height:1.6}
  .ornament{text-align:center;color:#D4B06A;font-size:18px;letter-spacing:8px;margin:24px 0}
  .footer{padding:24px 0;text-align:center;font-size:12px;color:#403830;border-top:1px solid rgba(212,176,106,.1)}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">${copy.logo}</div>
    <h1 class="title">${copy.title}</h1>
  </div>
  <div class="body">
    <p>${copy.hello}</p>
    <p>${copy.confirmed}</p>
    <p>${copy.pdf}</p>
    <div class="badge">
      ${copy.badge1}<br>
      ${copy.badge2}<br>
      ${copy.badge3}
    </div>
    <div class="ornament">* * *</div>
    <p>${copy.support}</p>
    <p style="font-size:13px;color:#706050">${copy.signoff}<br><strong style="color:#D4B06A">${copy.team}</strong></p>
  </div>
  <div class="footer">
    ${copy.footer}<br>
    <a href="${SITE_URL}" style="color:#6A5A40">${SITE_URL}</a>
  </div>
</div>
</body>
</html>`;

  return { subject, html, text: copy.text };
}

// ── processamento principal ───────────────────────────────────────────────────

async function process(body: Record<string, unknown>, eventType: string) {
  // Extrai produto — testa múltiplos caminhos do payload Vega
  const produtoTitle = String(
    (body?.plans as any)?.[0]?.products?.[0]?.title
    ?? (body?.product as any)?.name
    ?? (body?.order as any)?.product_name
    ?? body?.produto
    ?? ''
  );

  if (produtoTitle !== PRODUTO_ALVO) {
    console.log(`vega-webhook-sn: produto ignorado "${produtoTitle}"`);
    return;
  }

  const nome     = String(body?.customer?.name  ?? body?.name  ?? '');
  const email    = String(body?.customer?.email ?? body?.email ?? '');
  const phoneRaw = String(body?.customer?.phone ?? body?.phone ?? '');
  const pixCode  = String(body?.pix_code ?? '');
  const numero   = phone(phoneRaw);

  console.log(`vega-webhook-sn: event=${eventType} nome="${nome}" email=${email} phone=${numero}`);

  const db = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  let lead: any = null;
  let lang = normalizeLang((body as any)?.language ?? (body as any)?.metadata?.language);
  if (email) {
    const { data, error } = await db
      .from('seu_numerologo_leads')
      .select('pdf_path, fbc, fbp, id, language')
      .eq('email', email)
      .maybeSingle();
    if (error) console.warn('select lead:', error.message);
    lead = data;
    lang = normalizeLang(lead?.language ?? lang);
  }

  // ── sale_wait_payment: envia PIX ─────────────────────────────────────────
  if (eventType === 'sale_wait_payment') {
    if (!pixCode) { console.warn('pix_code ausente'); return; }
    if (!numero)  { console.warn('phone ausente');    return; }
    await sendWpp(numero, wppPixRegistrado(nome, lang));
    await sleep(2000);
    await sendWpp(numero, pixCode);
    await sleep(1500);
    await sendWpp(numero, wppPixInstrucao(lang));
    return;
  }

  // ── sale_paid: entrega ───────────────────────────────────────────────────
  if (eventType === 'sale_paid') {
    // 1. Busca lead para obter pdf_path
    let pdfPath: string | null = null;
    if (email) {
      pdfPath = lead?.pdf_path ?? null;

      // Atualiza status
      await db.from('seu_numerologo_leads').upsert({
        email,
        nome:     nome || undefined,
        status:   'pago',
        pago_at:  new Date().toISOString(),
        whatsapp: numero || undefined,
        language: lang,
      }, { onConflict: 'email', ignoreDuplicates: false })
      .then(({ error }) => { if (error) console.warn('upsert lead:', error.message); });
    }

    // 2. Baixa PDF do Storage (se existir)
    let pdfBase64: string | null = null;
    if (pdfPath) {
      pdfBase64 = await fetchPdfBase64(db, pdfPath);
      console.log(`vega-webhook-sn: PDF ${pdfBase64 ? 'encontrado' : 'não encontrado'} em ${pdfPath}`);
    } else {
      console.warn(`vega-webhook-sn: pdf_path não encontrado para ${email}`);
    }

    // 3. Email com PDF anexo
    if (email) {
      const pdfFilename = `${(nome||'Mapa').replace(/[^a-zA-Z0-9]/g,'_')}_Mapa_Numerologico.pdf`;
      const { subject, html, text } = emailBoasVindas(nome, !!pdfBase64, lang);
      await sendEmailResend({ to: email, to_name: nome, subject, html, text, pdfBase64, pdfFilename });
    }

    // 4. WPP
    if (numero) {
      await sendWpp(numero, wppBoasVindas(nome, lang));
    }

    // 5. CAPI Purchase (server-side — captura o que o pixel browser pode perder)
    if (email) {
      const rawAmount = (body as any)?.amount ?? (body as any)?.order?.amount ?? (body as any)?.plans?.[0]?.amount;
      const saleValue = rawAmount ? Number(rawAmount) / 100 : 37.00;
      const eventId   = 'sn_' + btoa(email).replace(/[+=\/]/g, '');
      const leadData  = (body as any)?._lead as { fbc?: string; fbp?: string; id?: string } | undefined;
      await sendCapiPurchase({
        email, phone: numero, nome,
        value: saleValue,
        eventSourceUrl: `${SITE_URL}/obrigado`,
        eventId,
        fbc:        (lead as any)?.fbc        ?? leadData?.fbc        ?? null,
        fbp:        (lead as any)?.fbp        ?? leadData?.fbp        ?? null,
        externalId: (lead as any)?.id         ?? leadData?.id         ?? null,
      });
    }
  }
}

// ── serve ─────────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const body      = await req.json().catch(() => ({})) as Record<string, unknown>;
    const eventType = req.headers.get('event') ?? String(body?.event ?? '');

    const task = process(body, eventType).catch(e =>
      console.error('vega-webhook-sn error:', e?.message ?? e),
    );
    try { EdgeRuntime.waitUntil(task); } catch { /* sem waitUntil */ }

    return new Response(JSON.stringify({ ok: true, received: eventType }), {
      status: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
