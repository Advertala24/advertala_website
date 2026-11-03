const EMAIL = 'info@advertala.net';

function withEmail(text) {
  const parts = text.split(EMAIL);
  return parts.flatMap((part, i) =>
    i < parts.length - 1
      ? [part, <a key={i} href={`mailto:${EMAIL}`}>{EMAIL}</a>]
      : [part]
  );
}

// Renders [tag, text] blocks, grouping consecutive list items into a <ul>.
export default function Legal({ title, blocks }) {
  const out = [];
  let items = [];
  const flush = () => {
    if (items.length) {
      out.push(<ul key={`ul${out.length}`}>{items}</ul>);
      items = [];
    }
  };
  blocks.forEach(([tag, text], i) => {
    if (tag === 'li') {
      items.push(<li key={i}>{withEmail(text)}</li>);
      return;
    }
    flush();
    if (tag === 'h3') out.push(<h3 key={i}>{text}</h3>);
    else out.push(<p key={i}>{withEmail(text)}</p>);
  });
  flush();
  return (
    <section className="page">
      <div className="container narrow legal">
        <h1>{title}</h1>
        {out}
      </div>
    </section>
  );
}
