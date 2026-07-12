import fs from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const source = JSON.parse(fs.readFileSync('locales/pt.json', 'utf8'));
const langs = process.argv.slice(2);
const targets = langs.length ? langs : ['en', 'es'];

const endpoint = 'https://translate.googleapis.com/translate_a/single';
const sourceLang = 'pt';

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function get(obj, path) {
  return path.reduce((cur, key) => (cur && cur[key] !== undefined ? cur[key] : undefined), obj);
}

function set(obj, path, value) {
  let cur = obj;
  for (const key of path.slice(0, -1)) {
    if (!isObject(cur[key])) cur[key] = {};
    cur = cur[key];
  }
  cur[path[path.length - 1]] = value;
}

function leaves(obj, prefix = [], out = []) {
  if (isObject(obj)) {
    for (const key of Object.keys(obj)) leaves(obj[key], prefix.concat(key), out);
  } else {
    out.push({ path: prefix, value: obj });
  }
  return out;
}

function splitText(text, max = 3800) {
  if (text.length <= max) return [text];

  const parts = [];
  let remaining = text;
  while (remaining.length > max) {
    let idx = remaining.lastIndexOf('</p>', max);
    if (idx !== -1 && idx > 500) idx += 4;
    else {
      idx = remaining.lastIndexOf('. ', max);
      if (idx !== -1 && idx > 500) idx += 2;
      else idx = max;
    }
    parts.push(remaining.slice(0, idx));
    remaining = remaining.slice(idx);
  }
  if (remaining) parts.push(remaining);
  return parts;
}

async function translateChunk(text, targetLang, attempt = 1) {
  const url = new URL(endpoint);
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', sourceLang);
  url.searchParams.set('tl', targetLang);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);

  const res = await fetch(url);
  if (!res.ok) {
    if (attempt < 4) {
      await sleep(500 * attempt);
      return translateChunk(text, targetLang, attempt + 1);
    }
    throw new Error(`translate ${targetLang} ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return (data?.[0] || []).map((part) => part?.[0] || '').join('');
}

async function translateText(text, targetLang) {
  if (typeof text !== 'string') return text;
  if (/^#[0-9a-f]{6}$/i.test(text)) return text;
  const chunks = splitText(text);
  const translated = [];
  for (const chunk of chunks) {
    translated.push(await translateChunk(chunk, targetLang));
    await sleep(120);
  }
  return translated.join('');
}

for (const lang of targets) {
  const file = `locales/${lang}.json`;
  const target = JSON.parse(fs.readFileSync(file, 'utf8'));
  target.numbers ||= {};

  const all = leaves(source.numbers);
  let done = 0;
  for (const item of all) {
    if (get(target.numbers, item.path) !== undefined) continue;
    const pathText = item.path.join('.');
    process.stdout.write(`[${lang}] ${++done} ${pathText}\n`);
    const translated = await translateText(String(item.value), lang);
    set(target.numbers, item.path, translated);
    fs.writeFileSync(file, JSON.stringify(target, null, 2) + '\n');
  }
  console.log(`[${lang}] complete`);
}
