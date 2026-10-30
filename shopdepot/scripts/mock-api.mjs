// Fake listings API that replays the saved real sample, for local work without network access.
// Usage: node scripts/mock-api.mjs [port]   then run the app with LISTINGS_API=http://localhost:4999/listings
import http from 'node:http';
import fs from 'node:fs';

const port = Number(process.argv[2] || 4999);
const xml = fs.readFileSync(new URL('../server/fixtures/listings.xml', import.meta.url));

http
  .createServer((req, res) => {
    console.log('mock-api', req.url);
    res.setHeader('content-type', 'text/xml');
    res.end(xml);
  })
  .listen(port, () => console.log(`mock listings API on :${port}`));
