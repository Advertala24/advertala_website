/**
 * Tolerant parser for the listings response.
 *
 * The API returns XML-ish text that is not well-formed: attribute values hold
 * raw "<b>" tags, HTML entities such as &mdash; that XML does not define, and
 * bare "&" in text. A strict XML parser rejects that, so the few elements we
 * need are extracted directly.
 */

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  hellip: '…', copy: '©', reg: '®', trade: '™', middot: '·', bull: '•',
};

export function decodeEntities(s) {
  return String(s ?? '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

// Text of the first <Tag>…</Tag> (case-insensitive), entities decoded.
const tagText = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([^<]*)</${tag}>`, 'i'));
  return m ? decodeEntities(m[1].trim()) : '';
};

// Index of the ">" that closes the tag opened at `start`, ignoring ">" inside quotes.
function tagEnd(xml, start) {
  let quote = false;
  for (let i = start; i < xml.length; i++) {
    const c = xml[i];
    if (c === '"') quote = !quote;
    else if (c === '>' && !quote) return i;
  }
  return -1;
}

function attrs(openTag) {
  const out = {};
  for (const m of openTag.matchAll(/([\w:.-]+)\s*=\s*"([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

export function parseListings(xml) {
  const tokens = {
    searchId: tagText(xml, 'SearchID'),
    clientId: tagText(xml, 'ClientID'),
    impressionGuid: tagText(xml, 'ImpressionGUID'),
    rguid: tagText(xml, 'RGUId'),
  };

  const ads = [];
  const re = /<Listing\b/gi;
  let m;
  while ((m = re.exec(xml))) {
    const end = tagEnd(xml, m.index);
    if (end < 0) break;
    const a = attrs(xml.slice(m.index, end));
    const close = xml.slice(end).search(/<\/Listing>/i);
    const body = close < 0 ? xml.slice(end + 1) : xml.slice(end + 1, end + close);
    const click = body.match(/<ClickUrl(?:\s[^>]*)?>([^<]*)<\/ClickUrl>/i);
    if (!a.ImpressionId || !click) continue;
    ads.push({
      impressionId: a.ImpressionId,
      appNs: a.appNs ?? '',
      k: a.k ?? '',
      // Passed through untouched: the partner script expects the original value.
      metadata: a.metadata ?? '',
      rank: a.rank ?? '',
      // Kept as the API sends them; the page renders <b> safely and decodes entities.
      title: a.title ?? '',
      description: a.description ?? '',
      host: a.siteHost ?? '',
      url: decodeEntities(click[1].trim()),
    });
  }

  const suggestions = [];
  const sug = xml.match(/<Suggestion>([\s\S]*?)<\/Suggestion>/i);
  if (sug) for (const n of sug[1].matchAll(/<name>([^<]*)<\/name>/gi)) suggestions.push(decodeEntities(n[1].trim()));

  return { tokens, ads, suggestions };
}
