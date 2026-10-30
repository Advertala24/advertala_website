import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseListings } from './xml.js';
import { beaconHtml, safeJson } from './beacons.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');

const cfg = {
  key: process.env.MWG_KEY,
  defaultSubid: process.env.DEFAULT_SUBID || 'shopdepot',
  numAds: Number(process.env.NUM_ADS || 3),
  serveUrl: process.env.SERVE_URL || 'https://marketplace.shopdepot.us/results',
  sourceTag: process.env.SOURCE_TAG || 'mediawave_n2s_xmlb_11649_fb_shopdepot',
  port: Number(process.env.PORT || 3000),
  debugRaw: process.env.DEBUG_RAW === '1',
};
const API = process.env.LISTINGS_API || 'https://tracking.session1.com/mwg/xml/listings';

export const clientIp = (req) => {
  const fwd = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = fwd || req.socket.remoteAddress || '';
  return ip.replace(/^::ffff:/, '');
};

export function listingsUrl({ q, subid, ip, ua }) {
  const p = new URLSearchParams({
    q,
    type: subid,
    num: String(cfg.numAds),
    key: cfg.key,
    ip,
    country: 'us',
    ua,
    serveUrl: cfg.serveUrl,
  });
  // URLSearchParams encodes spaces as "+", which the API accepts for q.
  return `${API}?${p}`;
}

async function fetchListings(req, q, subid) {
  const url = listingsUrl({ q, subid, ip: clientIp(req), ua: req.headers['user-agent'] || '' });
  const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
  if (!res.ok) throw new Error(`listings API ${res.status}`);
  const xml = await res.text();
  if (cfg.debugRaw) console.log('[raw xml]', xml);
  return parseListings(xml);
}

const template = () => fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

function render(res, { head = '', data }) {
  const html = template()
    .replace('<!--SERVER_HEAD-->', head)
    .replace('<!--SERVER_DATA-->', `<script>window.__DATA__=${safeJson(data)};</script>`);
  res.set('Cache-Control', 'no-store').type('html').send(html);
}

export const app = express();
app.set('trust proxy', true);
app.disable('x-powered-by');

app.get('/healthz', (_req, res) => res.send('ok'));
app.use('/assets', express.static(path.join(DIST, 'assets'), { immutable: true, maxAge: '1y' }));

app.get('/', (_req, res) => render(res, { data: { page: 'home' } }));

app.get('/results', async (req, res) => {
  const q = String(req.query.q || '').trim().slice(0, 200);
  const subid = String(req.query.subid || cfg.defaultSubid).slice(0, 64);
  if (!q) return res.redirect(302, '/');
  if (!cfg.key) return res.status(500).send('MWG_KEY is not configured');

  let result = { tokens: {}, ads: [] };
  let error = false;
  try {
    result = await fetchListings(req, q, subid);
  } catch (e) {
    console.error('listings failed:', e.message);
    error = true;
  }
  // Beacons go at the very top of <head>, before any other script.
  const head = result.tokens.searchId ? beaconHtml(result.tokens, cfg.sourceTag) : '';
  render(res, { head, data: { page: 'results', q, subid, ads: result.ads, error } });
});

app.get('*', (_req, res) => res.redirect(302, '/'));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(cfg.port, () => console.log(`shopdepot lander on :${cfg.port}`));
}
