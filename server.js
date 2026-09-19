const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8787;
const DIR = __dirname;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// ── Runway Database Indexer ──
function parseHeading(ident, rawHeading) {
  if (rawHeading && !isNaN(parseFloat(rawHeading))) return parseFloat(rawHeading);
  const m = ident.match(/^(\d{1,2})/);
  if (m) {
    let num = parseInt(m[1]) * 10;
    if (num === 0) num = 360;
    return num;
  }
  return null;
}

const runwayIndex = {};
try {
  const csvPath = path.join(DIR, 'runways.csv');
  if (fs.existsSync(csvPath)) {
    const lines = fs.readFileSync(csvPath, 'utf8').split('\n');
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',');
      if (parts.length < 15) continue;
      const ident = parts[2].replace(/"/g, '').toUpperCase();
      const le_ident = parts[8] ? parts[8].replace(/"/g, '') : '';
      const he_ident = parts[14] ? parts[14].replace(/"/g, '') : '';
      if (!le_ident) continue;

      const le_hdg = parseHeading(le_ident, parts[12]);
      const he_hdg = he_ident ? parseHeading(he_ident, parts[18]) : (le_hdg ? (le_hdg + 180) % 360 || 360 : null);
      const length_ft = parseInt(parts[3]) || null;
      const width_ft = parseInt(parts[4]) || null;
      const surface = (parts[5] || '').replace(/"/g, '');
      const closed = parts[7] === '1';

      if (!runwayIndex[ident]) runwayIndex[ident] = [];
      runwayIndex[ident].push({
        name: he_ident ? `${le_ident}/${he_ident}` : le_ident,
        surface,
        closed,
        length_ft,
        length_m: length_ft ? Math.round(length_ft * 0.3048) : null,
        width_ft,
        width_m: width_ft ? Math.round(width_ft * 0.3048) : null,
        ends: [
          { ident: le_ident, heading: le_hdg },
          ...(he_ident ? [{ ident: he_ident, heading: he_hdg }] : [])
        ]
      });
    }
    console.log(`  ✈️  Pist veritabanı yüklendi (${Object.keys(runwayIndex).length} meydan)`);
  }
} catch (e) {
  console.error('Pist veritabanı yüklenirken hata:', e.message);
}

const server = http.createServer((req, res) => {
  // Runway API endpoint
  if (req.url.startsWith('/api/runways?')) {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const airport = (urlObj.searchParams.get('airport') || '').toUpperCase().trim();
    const runways = runwayIndex[airport] || [];
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ airport, runways }));
    return;
  }

  // METAR API proxy
  if (req.url.startsWith('/api/metar?')) {
    const query = req.url.split('?')[1];
    const url = `https://aviationweather.gov/api/data/metar?${query}`;

    https.get(url, { headers: { 'User-Agent': 'MetarWindApp/1.0' } }, (upstream) => {
      let data = '';
      upstream.on('data', chunk => data += chunk);
      upstream.on('end', () => {
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
      });
    }).on('error', (e) => {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end(`Upstream error: ${e.message}`);
    });
    return;
  }

  // Static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(DIR, filePath);

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  ✈️  METAR Rüzgar Tahmin Sistemi`);
  console.log(`  ─────────────────────────────`);
  console.log(`  🌐 http://localhost:${PORT}`);
  console.log(`  Durdurmak için Ctrl+C\n`);
});
