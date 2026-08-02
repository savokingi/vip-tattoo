const fs = require('fs');
const path = require('path');

const DIR = path.join(process.cwd(), 'assets', 'img');
fs.mkdirSync(DIR, { recursive: true });

const html = fs.readFileSync(process.env.TEMP + '/yagallery.html', 'utf8');
// base ids: get-altay/<num>/<hash>/
const bases = [...new Set(
  [...html.matchAll(/https?:\/\/avatars\.mds\.yandex\.net\/get-altay\/\d+\/[a-f0-9]+\//g)].map(m => m[0])
)];
console.log('unique photo bases:', bases.length);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  let downloaded = 0, fail = 0;
  const CHUNK = bases.slice(0, 24);
  for (let i = 0; i < CHUNK.length; i++) {
    const base = CHUNK[i];
    const url = base + 'orig';
    const file = path.join(DIR, 'ph' + String(i).padStart(2, '0') + '.jpg');
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(file, buf);
      console.log('ok', i, (buf.length / 1024).toFixed(0) + 'KB', file);
      downloaded++;
    } catch (e) {
      console.log('FAIL', i, e.message);
      fail++;
    }
    await sleep(250);
  }
  console.log('DONE downloaded=' + downloaded + ' failed=' + fail);
})();