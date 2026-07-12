import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Lang = 'pt' | 'en' | 'es';

function cleanString(value: unknown, max = 500): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text ? text.slice(0, max) : null;
}

function cleanEmail(value: unknown): string | null {
  const email = cleanString(value, 254)?.toLowerCase() ?? null;
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function cleanLang(value: unknown): Lang {
  return value === 'en' || value === 'es' || value === 'pt' ? value : 'pt';
}

function cleanNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

function client() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function leadFilter(query: any, payload: Record<string, unknown>) {
  const id = cleanString(payload.id, 80);
  const email = cleanEmail(payload.email);
  if (id) return query.eq('id', id);
  if (email) return query.eq('email', email);
  throw new Error('id or email is required');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  try {
    const body = await req.json().catch(() => null) as Record<string, unknown> | null;
    if (!body) return json({ ok: false, error: 'invalid_json' }, 400);

    const action = cleanString(body.action, 40);
    const db = client();

    if (action === 'save_lead') {
      const email = cleanEmail(body.email);
      const nome = cleanString(body.nome, 180);
      const dataNascimento = cleanString(body.data_nascimento, 20);
      if (!email || !nome || !dataNascimento) {
        return json({ ok: false, error: 'missing_required_fields' }, 400);
      }

      const { data, error } = await db
        .from('seu_numerologo_leads')
        .upsert({
          nome,
          email,
          data_nascimento: dataNascimento,
          destino: cleanNumber(body.destino),
          whatsapp: cleanString(body.whatsapp, 32),
          language: cleanLang(body.language),
          status: 'lead',
          utm_source: cleanString(body.utm_source, 300),
          utm_medium: cleanString(body.utm_medium, 300),
          utm_campaign: cleanString(body.utm_campaign, 300),
          utm_content: cleanString(body.utm_content, 300),
          utm_term: cleanString(body.utm_term, 300),
          referrer: cleanString(body.referrer, 1000),
        }, { onConflict: 'email', ignoreDuplicates: false })
        .select('id')
        .single();

      if (error) throw error;
      return json({ ok: true, id: data?.id ?? null });
    }

    if (action === 'update_nums' || action === 'checkout') {
      const payload = {
        status: action === 'checkout' ? 'checkout' : 'calculou',
        alma: cleanNumber(body.alma),
        imagem: cleanNumber(body.imagem),
        expressao: cleanNumber(body.expressao),
        talento: cleanNumber(body.talento),
        psiquico: cleanNumber(body.psiquico),
        destino: cleanNumber(body.destino),
        ano_pessoal: cleanNumber(body.ano_pessoal),
        language: cleanLang(body.language),
        ...(action === 'checkout'
          ? { comprou_at: new Date().toISOString() }
          : { calculou_at: new Date().toISOString() }),
      };

      const query = leadFilter(db.from('seu_numerologo_leads').update(payload), body);
      const { error } = await query;
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === 'pdf_path') {
      const pdfPath = cleanString(body.pdf_path, 600);
      if (!pdfPath || !pdfPath.startsWith('mapa-pdfs/')) {
        return json({ ok: false, error: 'invalid_pdf_path' }, 400);
      }
      const query = leadFilter(db.from('seu_numerologo_leads').update({
        pdf_path: pdfPath,
        language: cleanLang(body.language),
      }), body);
      const { error } = await query;
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ ok: false, error: 'unknown_action' }, 400);
  } catch (err) {
    console.error('lead-event error:', err);
    return json({ ok: false, error: 'internal_error' }, 500);
  }
});
