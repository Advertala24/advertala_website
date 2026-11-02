// Renders ad text that may contain <b>…</b> without dangerouslySetInnerHTML:
// every other tag is dropped. Entities are already decoded by the server.
export default function RichText({ text }) {
  const parts = [];
  let bold = false;
  for (const tok of String(text ?? '').split(/(<\/?b>|<[^>]*>)/i)) {
    if (/^<b>$/i.test(tok)) bold = true;
    else if (/^<\/b>$/i.test(tok)) bold = false;
    else if (tok.startsWith('<') && tok.endsWith('>')) continue;
    else if (tok) parts.push(bold ? <b key={parts.length}>{tok}</b> : tok);
  }
  return <>{parts}</>;
}
