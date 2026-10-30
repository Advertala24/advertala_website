// Renders ad text that may contain <b>…</b> and HTML entities, without
// dangerouslySetInnerHTML: every other tag is dropped, entities are decoded.
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…',
};

const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const c = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return c > 0 && c <= 0x10ffff ? String.fromCodePoint(c) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });

export default function RichText({ text }) {
  const parts = [];
  let bold = false;
  for (const tok of String(text ?? '').split(/(<\/?b>|<[^>]*>)/i)) {
    if (/^<b>$/i.test(tok)) bold = true;
    else if (/^<\/b>$/i.test(tok)) bold = false;
    else if (tok.startsWith('<') && tok.endsWith('>')) continue;
    else if (tok) parts.push(bold ? <b key={parts.length}>{decode(tok)}</b> : decode(tok));
  }
  return <>{parts}</>;
}
