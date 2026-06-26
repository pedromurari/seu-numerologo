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

function wppBoasVindas(nome: string) {
  const p = nome.trim().split(' ')[0] || 'você';
  return `Olá, ${p}! 🌟\n\nSeu *Mapa Numerológico Pitagórico Aplicado* foi confirmado! ✨\n\nAcabamos de enviar o seu mapa completo para o seu e-mail — com todas as 12 análises personalizadas em PDF.\n\n📧 Verifique sua caixa de entrada (e o spam, por precaução).\n\nQualquer dúvida é só responder aqui. Estamos com você! 🔢`;
}

function emailBoasVindas(nome: string, temPdf: boolean): { subject: string; html: string; text: string } {
  const p       = nome.trim().split(' ')[0] || 'você';
  const subject = `✨ Seu Mapa Numerológico está aqui, ${p}!`;

  const pdfInfo = temPdf
    ? `<p>Seu mapa completo está <strong style="color:#D4B06A">anexado a este e-mail</strong> em PDF — 12 análises personalizadas prontas para você explorar.</p>`
    : `<p>Seu mapa está sendo finalizado e em breve você receberá outro e-mail com o PDF completo. Se precisar antes, acesse: <a href="${SITE_URL}" style="color:#D4B06A">${SITE_URL}</a></p>`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
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
    <div class="logo">Seu Numerólogo</div>
    <h1 class="title">Seu Mapa chegou ✨</h1>
  </div>
  <div class="body">
    <p>Olá, ${p}!</p>
    <p>Seu <strong style="color:#D4B06A">Mapa Numerológico Pitagórico Aplicado</strong> foi confirmado com sucesso.</p>
    ${pdfInfo}
    <div class="badge">
      📄 Mapa Numerológico Completo · 12 Análises<br>
      Alma · Imagem · Expressão · Talento · Psíquico · Destino<br>
      Ciclos · Desafios · Direcionamento · Plano de Ação
    </div>
    <div class="ornament">* * *</div>
    <p>Se tiver qualquer dúvida ou precisar de suporte, responda este e-mail.</p>
    <p style="font-size:13px;color:#706050">Com gratidão,<br><strong style="color:#D4B06A">Equipe Seu Numerólogo</strong></p>
  </div>
  <div class="footer">
    Seu Numerólogo · Sistema Pitagórico Sistêmico<br>
    <a href="${SITE_URL}" style="color:#6A5A40">${SITE_URL}</a>
  </div>
</div>
</body>
</html>`;

  const text = `Olá, ${p}!\n\nSeu Mapa Numerológico Pitagórico Aplicado foi confirmado.\n\n${temPdf ? 'O PDF completo está anexado a este e-mail.' : `Acesse: ${SITE_URL}`}\n\nEquipe Seu Numerólogo`;

  return { subject, html, text };
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

  // ── sale_wait_payment: envia PIX ─────────────────────────────────────────
  if (eventType === 'sale_wait_payment') {
    if (!pixCode) { console.warn('pix_code ausente'); return; }
    if (!numero)  { console.warn('phone ausente');    return; }
    const p = nome.trim().split(' ')[0] || 'você';
    await sendWpp(numero, `Olá, ${p}! 👋\n\nSeu pedido do *Mapa Numerológico Pitagórico Aplicado* foi registrado.\n\nSegue o PIX copia e cola para confirmar seu acesso:`);
    await sleep(2000);
    await sendWpp(numero, pixCode);
    await sleep(1500);
    await sendWpp(numero, `É só copiar o código acima e colar no app do seu banco. ✅\n\nAssim que o pagamento for confirmado, enviaremos seu mapa completo por aqui e por e-mail. 🔢`);
    return;
  }

  // ── sale_paid: entrega ───────────────────────────────────────────────────
  if (eventType === 'sale_paid') {
    // 1. Busca lead para obter pdf_path
    let pdfPath: string | null = null;
    if (email) {
      const { data: lead } = await db
        .from('seu_numerologo_leads')
        .select('pdf_path')
        .eq('email', email)
        .maybeSingle();
      pdfPath = lead?.pdf_path ?? null;

      // Atualiza status
      await db.from('seu_numerologo_leads').upsert({
        email,
        nome:     nome || undefined,
        status:   'pago',
        pago_at:  new Date().toISOString(),
        whatsapp: numero || undefined,
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
      const { subject, html, text } = emailBoasVindas(nome, !!pdfBase64);
      await sendEmailResend({ to: email, to_name: nome, subject, html, text, pdfBase64, pdfFilename });
    }

    // 4. WPP
    if (numero) {
      await sendWpp(numero, wppBoasVindas(nome));
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
