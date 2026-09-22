// Vercel Edge Middleware — detecção de idioma por IP (pt/en/es)
// Roda antes do CDN servir o HTML estático. Não altera o conteúdo do arquivo —
// só seta o cookie sn_lang na primeira visita, que assets/i18n.js lê no client
// pra escolher qual /locales/{lang}.json carregar.
//
// Usa next() do @vercel/edge em vez de `await fetch(request)` — fazer fetch da
// própria requisição reentra no pipeline de rotas/middleware da Vercel e causa
// loop infinito (o cookie ainda não existe na requisição refeita, então
// hasLangCookie() dá false de novo, pra sempre). next() sinaliza "continue pra
// origem/estático" sem essa recursão.
import { next } from '@vercel/edge';

export const config = {
  // Aplica em qualquer rota que não seja asset estático (tem extensão) nem
  // /assets, /locales — evita rodar o middleware em toda requisição de imagem/JS/JSON.
  matcher: ['/((?!assets|locales|.*\\..*).*)'],
};

var COUNTRY_TO_LANG = {
  BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt', CV: 'pt', GW: 'pt', ST: 'pt', TL: 'pt',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es',
  GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es', SV: 'es', NI: 'es',
  CR: 'es', PA: 'es', UY: 'es', GQ: 'es',
};
var DEFAULT_LANG = 'en';
var COOKIE_NAME = 'sn_lang';

function hasLangCookie(request) {
  var cookieHeader = request.headers.get('cookie') || '';
  return new RegExp('(?:^|; )' + COOKIE_NAME + '=').test(cookieHeader);
}

export default async function middleware(request) {
  if (hasLangCookie(request)) return; // já detectado/escolhido — segue sem mexer

  var country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();
  var lang = COUNTRY_TO_LANG[country] || DEFAULT_LANG;

  var response = next();
  response.headers.append(
    'Set-Cookie',
    COOKIE_NAME + '=' + lang + '; Path=/; Max-Age=31536000; SameSite=Lax'
  );
  return response;
}
