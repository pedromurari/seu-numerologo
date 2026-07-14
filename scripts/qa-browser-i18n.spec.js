import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const root = process.cwd();
let server;
let baseURL;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';
    const file = path.join(root, pathname.replace(/^\/+/, ''));
    if (!file.startsWith(root)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404).end('not found');
        return;
      }
      res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  });
  await new Promise((resolve) => server.listen(4181, '127.0.0.1', resolve));
  baseURL = 'http://127.0.0.1:4181';
});

test.afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

for (const lang of ['en', 'es']) {
  test(`preview map renders dynamic labels in ${lang}`, async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await page.route('**/functions/v1/lead-event', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"ok":true,"id":"qa"}',
    }));

    await page.goto(`${baseURL}/index.html?i18n_preview=1`, { waitUntil: 'networkidle' });
    await page.evaluate((targetLang) => window.SN_I18N.setLang(targetLang), lang);
    await page.reload({ waitUntil: 'networkidle' });
    await page.fill('#v2Name', lang === 'en' ? 'Maria Silva' : 'María Silva');
    await page.fill('#v2Date', '14/03/1990');
    await page.fill('#v2Email', `qa-${lang}@example.com`);
    await page.fill('#v2Phone', '11999999999');
    await page.click('#v2Submit');
    await page.waitForFunction(() => window._nums && document.querySelector('#v2Phases .v2-phase'), null, { timeout: 15000 });
    await page.evaluate(() => document.querySelectorAll('.v2-phase').forEach((el) => el.classList.add('open')));

    const text = await page.locator('#v2Map').innerText();
    const htmlLang = await page.locator('html').getAttribute('lang');
    const buttonText = await page.locator('#v2Map #v2PdfBtn').evaluateAll((els) => els.map((el) => el.textContent.trim()).join(' '));

    if (lang === 'en') {
      expect(htmlLang).toBe('en');
      expect(text).toMatch(/overview/i);
      expect(text).toContain('SOUL SPHERE');
      expect(text).toContain('MAP SYNTHESIS');
      expect(buttonText).toMatch(/Download PDF|Generating PDF/);
      expect(text).not.toContain('Visão Geral');
      expect(text).not.toContain('ESFERA DA ALMA');
      expect(text).not.toContain('SÍNTESE DO MAPA');
    } else {
      expect(htmlLang).toBe('es');
      expect(text).toMatch(/visi.n general/i);
      expect(text).toContain('ESFERA DEL ALMA');
      expect(text).toContain('SÍNTESIS DEL MAPA');
      expect(buttonText).toMatch(/Descargar PDF|Generando PDF/);
      expect(text).not.toContain('Overview');
      expect(text).not.toContain('SOUL SPHERE');
      expect(text).not.toContain('MAP SYNTHESIS');
    }
    expect(errors).toEqual([]);
    await page.screenshot({ path: `qa-${lang}-map.png`, fullPage: false });
  });
}
