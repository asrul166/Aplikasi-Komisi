const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// Needs both dev servers running, `npm i puppeteer-core` and Google Chrome.
const root = path.resolve(__dirname, '..');
const out = root + '/portfolio';
const logo = fs.readFileSync(root + '/apps/web/public/favicon.svg').toString('base64');
const settle = async (page) => {
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1500));
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200, deviceScaleFactor: 1.05 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.type('input[type=email]', 'admin@komisia.test');
  await page.type('input[type=password]', 'Komisia123!');
  await page.click('button[type=submit]');
  await page.waitForSelector('tbody tr');
  await settle(page);
  const app = await page.screenshot({ encoding: 'base64' });
  fs.writeFileSync(path.join(out, 'komisia-dashboard.png'), Buffer.from(app, 'base64'));

  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:1200px;height:630px;display:flex;background:#fff;font-family:'Segoe UI',sans-serif;overflow:hidden}
    .left{width:520px;background:#173c2e;color:#fff;padding:0 50px;display:flex;flex-direction:column;justify-content:center}
    .logo{width:64px;height:64px;border-radius:14px;box-shadow:0 0 0 2px rgba(255,255,255,.25);margin-bottom:22px}
    h1{font-size:72px;line-height:1.08;letter-spacing:-1.5px}
    h2{font-size:28px;font-weight:600;color:#d9e6d8;margin-top:2px}
    .desc{font-size:24px;line-height:1.5;margin-top:30px}
    .stat{font-size:21px;color:#d9e6d8;margin-top:38px}
    .tech{font-size:15.5px;color:#b8cbbd;margin-top:10px;line-height:1.6}
    img.app{margin-left:8px;width:672px;height:630px;display:block}
  </style>
  <div class="left">
    <img class="logo" src="data:image/svg+xml;base64,${logo}">
    <h1>Komisia</h1>
    <h2>Komisi &amp; Pembukuan</h2>
    <p class="desc">Catat penjualan, setujui transaksi, dan biarkan komisi flat maupun bertingkat dihitung otomatis.</p>
    <p class="stat">3 peran pengguna · Impor &amp; ekspor CSV</p>
    <p class="tech">React · TypeScript · Vite · Tailwind<br>Express · PostgreSQL · Drizzle ORM · Better Auth</p>
  </div>
  <img class="app" src="data:image/png;base64,${app}">`);
  await settle(page);
  await page.screenshot({ path: path.join(out, 'komisia-cover.png') });
  await browser.close();
  console.log('ok');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
