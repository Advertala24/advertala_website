import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: '#text',
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
});

const asText = (v) => {
  if (v == null) return '';
  if (typeof v === 'object') return v['#text'] != null ? String(v['#text']) : '';
  return String(v);
};

// First value (attribute or element) whose key matches one of `names`, case-insensitive.
const pick = (obj, names) => {
  if (!obj || typeof obj !== 'object') return '';
  const wanted = names.map((n) => n.toLowerCase());
  for (const [k, v] of Object.entries(obj)) {
    if (wanted.includes(k.toLowerCase())) {
      const t = asText(Array.isArray(v) ? v[0] : v);
      if (t) return t;
    }
  }
  return '';
};

// Depth-first walk over every object node.
function* walk(node) {
  if (Array.isArray(node)) {
    for (const n of node) yield* walk(n);
  } else if (node && typeof node === 'object') {
    yield node;
    for (const v of Object.values(node)) yield* walk(v);
  }
}

const hasKey = (obj, re) => Object.keys(obj).some((k) => re.test(k));

/**
 * Normalises the listings XML into { tokens, ads }.
 *
 * The response schema is not documented in the integration notes, so ads are
 * detected structurally: any node that carries an ImpressionId. Field names
 * are matched case-insensitively with a few common aliases. Verify against a
 * real response (DEBUG_RAW=1) and tighten the alias lists if needed.
 */
export function parseListings(xml) {
  const root = parser.parse(xml);
  const nodes = [...walk(root)];

  const tokens = {};
  for (const [out, names] of Object.entries({
    searchId: ['SearchID', 'SearchId'],
    clientId: ['ClientID', 'ClientId'],
    impressionGuid: ['ImpressionGUID', 'ImpressionGuid'],
    rguid: ['RGUId', 'RGUID', 'Rguid'],
  })) {
    for (const n of nodes) {
      const v = pick(n, names);
      if (v) { tokens[out] = v; break; }
    }
    tokens[out] ??= '';
  }

  const ads = nodes
    .filter((n) => hasKey(n, /^impressionid$/i))
    .map((n) => ({
      impressionId: pick(n, ['ImpressionId']),
      appNs: pick(n, ['AppNs']),
      k: pick(n, ['K']),
      metadata: pick(n, ['Metadata', 'AdMd']),
      title: pick(n, ['Title', 'Name', 'Headline']),
      description: pick(n, ['Description', 'Desc', 'Body']),
      url: pick(n, ['ClickUrl', 'Url', 'Link', 'RedirectUrl']),
      host: pick(n, ['SiteHost', 'DisplayUrl', 'Host', 'Domain']),
    }));

  return { tokens, ads };
}
