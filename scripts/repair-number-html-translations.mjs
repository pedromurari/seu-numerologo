import fs from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const source = JSON.parse(fs.readFileSync('locales/pt.json', 'utf8'));
const args = process.argv.slice(2);
const onlyArg = args.find((arg) => arg.startsWith('--only='));
const onlyPaths = onlyArg
  ? new Set(onlyArg.slice('--only='.length).split(',').map((path) => path.trim()).filter(Boolean))
  : null;
const targets = args.filter((arg) => !arg.startsWith('--only='));
if (!targets.length) targets.push('en', 'es');
const endpoint = 'https://translate.googleapis.com/translate_a/single';

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function leaves(obj, prefix = [], out = []) {
  if (isObject(obj)) {
    for (const key of Object.keys(obj)) leaves(obj[key], prefix.concat(key), out);
  } else {
    out.push({ path: prefix, value: obj });
  }
  return out;
}

function set(obj, path, value) {
  let cur = obj;
  for (const key of path.slice(0, -1)) {
    if (!isObject(cur[key])) cur[key] = {};
    cur = cur[key];
  }
  cur[path[path.length - 1]] = value;
}

async function translateText(text, targetLang, attempt = 1) {
  if (!text.trim()) return text;

  const leading = text.match(/^\s*/)?.[0] || '';
  const trailing = text.match(/\s*$/)?.[0] || '';
  const core = text.trim();
  if (!core) return text;

  const url = new URL(endpoint);
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'pt');
  url.searchParams.set('tl', targetLang);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', core);

  const res = await fetch(url);
  if (!res.ok) {
    if (attempt < 4) {
      await sleep(500 * attempt);
      return translateText(text, targetLang, attempt + 1);
    }
    throw new Error(`translate ${targetLang} ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const translated = (data?.[0] || []).map((part) => part?.[0] || '').join('');
  await sleep(120);
  return leading + translated + trailing;
}

async function translateHtmlPreservingTags(html, targetLang) {
  const tokens = String(html).split(/(<[^>]+>)/g);
  const out = [];
  for (const token of tokens) {
    if (!token) continue;
    if (token.startsWith('<') && token.endsWith('>')) {
      out.push(token);
    } else {
      out.push(await translateText(token, targetLang));
    }
  }
  return out.join('');
}

const htmlLeaves = leaves(source.numbers).filter((item) => {
  if (!(typeof item.value === 'string' && item.value.includes('<'))) return false;
  return !onlyPaths || onlyPaths.has(item.path.join('.'));
});

for (const lang of targets) {
  const file = `locales/${lang}.json`;
  const target = JSON.parse(fs.readFileSync(file, 'utf8'));
  let count = 0;
  for (const item of htmlLeaves) {
    process.stdout.write(`[${lang}] html ${++count}/${htmlLeaves.length} ${item.path.join('.')}\n`);
    set(target.numbers, item.path, await translateHtmlPreservingTags(item.value, lang));
    fs.writeFileSync(file, JSON.stringify(target, null, 2) + '\n');
  }
  console.log(`[${lang}] html repair complete`);
}
