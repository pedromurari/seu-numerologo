import fs from 'node:fs';

const files = ['pt', 'en', 'es'].map((lang) => [lang, JSON.parse(fs.readFileSync(`locales/${lang}.json`, 'utf8'))]);
const locales = Object.fromEntries(files);
const langs = ['en', 'es'];
const failures = [];

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function leaves(obj, prefix = [], out = []) {
  if (isObject(obj)) {
    for (const key of Object.keys(obj)) leaves(obj[key], prefix.concat(key), out);
  } else {
    out.push([prefix, obj]);
  }
  return out;
}

function get(obj, path) {
  return path.reduce((cur, key) => (cur && cur[key] !== undefined ? cur[key] : undefined), obj);
}

function placeholders(value) {
  return [...String(value).matchAll(/\{[^}]+\}/g)].map((match) => match[0]).sort().join('|');
}

function htmlTags(value) {
  return [...String(value).matchAll(/<[^>]+>/g)].map((match) => match[0]).join('\n');
}

function addFailure(message) {
  failures.push(message);
}

const ptNumberLeaves = leaves(locales.pt.numbers);

for (const lang of langs) {
  const target = locales[lang];
  for (const [path, ptValue] of ptNumberLeaves) {
    const value = get(target.numbers, path);
    const label = `${lang}.numbers.${path.join('.')}`;
    if (value === undefined) {
      addFailure(`${label}: missing key`);
      continue;
    }
    if (placeholders(ptValue) !== placeholders(value)) {
      addFailure(`${label}: placeholder mismatch pt=[${placeholders(ptValue)}] got=[${placeholders(value)}]`);
    }
    if (typeof ptValue === 'string' && ptValue.includes('<') && htmlTags(ptValue) !== htmlTags(value)) {
      addFailure(`${label}: HTML tag/attribute sequence differs from pt.json`);
    }
  }
}

const suspiciousQuestion = /[A-Za-zÀ-ÿ]\?[A-Za-zÀ-ÿ]| \? /;
for (const lang of langs) {
  for (const [path, value] of leaves(locales[lang])) {
    if (typeof value === 'string' && suspiciousQuestion.test(value)) {
      addFailure(`${lang}.${path.join('.')}: suspicious replacement character "?"`);
    }
  }
}

const esForbidden = [
  /\bLife Path\b/,
  /\bSoul\b/,
  /\bPersonal Year\b/,
  /\bPinnacles\b/,
  /\bKey Challenge\b/,
  /\bDestiny Number\b/,
  /\bExpression Number\b/,
];
const enForbidden = [
  /\bAlma\b/,
  /\bCamino de Vida\b/,
  /\bCaminho de Vida\b/,
  /\bAno Pessoal\b/,
  /\bPersonalidade\b/,
  /\bPin[aá]culos\b/,
];

function checkForbidden(lang, patterns) {
  for (const [path, value] of leaves(locales[lang].numbers)) {
    if (typeof value !== 'string') continue;
    for (const pattern of patterns) {
      if (pattern.test(value)) addFailure(`${lang}.numbers.${path.join('.')}: forbidden term ${pattern}`);
    }
  }
}

checkForbidden('es', esForbidden);
checkForbidden('en', enForbidden);

for (const lang of langs) {
  const insights = locales[lang].numbers?.aidaHook || {};
  for (const num of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '22', '33']) {
    const insight = insights[num]?.insight || '';
    if (lang === 'en' && !new RegExp(`<strong>Life Path ${num}</strong>`).test(insight)) {
      addFailure(`en.numbers.aidaHook.${num}.insight: expected Life Path ${num}`);
    }
    if (lang === 'es' && !new RegExp(`<strong>Camino de Vida ${num}</strong>`).test(insight)) {
      addFailure(`es.numbers.aidaHook.${num}.insight: expected Camino de Vida ${num}`);
    }
  }
}

if (failures.length) {
  console.error(`i18n QA failed with ${failures.length} issue(s):`);
  for (const failure of failures.slice(0, 200)) console.error(`- ${failure}`);
  if (failures.length > 200) console.error(`... ${failures.length - 200} more`);
  process.exit(1);
}

console.log('i18n QA passed');
