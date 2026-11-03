// Fake listings API that replays the saved real samples (a query containing "subaru" gets the Subaru one), for local work without network access.
// Usage: node scripts/mock-api.mjs [port]   then run the app with LISTINGS_API=http://localhost:4999/listings
import http from 'node:http';
import fs from 'node:fs';

const port = Number(process.argv[2] || 4999);
const load = (f) => fs.readFileSync(new URL(`../server/fixtures/${f}`, import.meta.url));
const fixtures = { default: load('listings.xml'), subaru: load('listings-subaru.xml') };

http
  .createServer((req, res) => {
    console.log('mock-api', req.url);
    res.setHeader('content-type', 'text/xml');
    const q = new URL(req.url, 'http://x').searchParams.get('q') || '';
    res.end(/subaru/i.test(q) ? fixtures.subaru : fixtures.default);
  })
  .listen(port, () => console.log(`mock listings API on :${port}`));
