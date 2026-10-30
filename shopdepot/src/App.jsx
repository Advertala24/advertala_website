const LOGO = 'https://s3-us-west-2.amazonaws.com/mediawavegroup.org/shopdepot.png';
const LINKS = [
  ['Privacy Policy', 'https://mediawavegroup.org/privacy-policy.html'],
  ['Contact Us', 'https://quickshoppers.co/mbd/contact'],
  ['For Advertisers', 'https://s3-us-west-2.amazonaws.com/mediawavegroup.org/ForAdvertisers.pdf'],
];

function SearchForm({ q = '', subid }) {
  return (
    <form className="search" action="/results" method="get" role="search">
      <input name="q" defaultValue={q} placeholder="Search deals, products, services…" aria-label="Search" required />
      {subid ? <input type="hidden" name="subid" value={subid} /> : null}
      <button type="submit">Search</button>
    </form>
  );
}

function Ad({ ad }) {
  return (
    <li
      className="ad"
      data-yiid={ad.impressionId}
      data-appns={ad.appNs}
      data-k={ad.k}
      data-admd={ad.metadata}
    >
      <span className="sponsored">Sponsored</span>
      <a className="ad-title" href={ad.url} target="_blank" rel="noopener sponsored">{ad.title}</a>
      {ad.host ? <span className="ad-host">{ad.host}</span> : null}
      <p className="ad-desc">{ad.description}</p>
    </li>
  );
}

export default function App({ data }) {
  const results = data.page === 'results';
  return (
    <>
      <header className="top">
        <a href="/"><img className="logo" src={LOGO} alt="ShopDepot" /></a>
      </header>
      <main>
        {results ? (
          <>
            <SearchForm q={data.q} subid={data.subid} />
            {data.ads.length > 0 ? (
              <ul className="ads">{data.ads.map((ad, i) => <Ad key={ad.impressionId || i} ad={ad} />)}</ul>
            ) : (
              <p className="empty">
                {data.error ? 'Results are unavailable right now. Please try again.' : `No results for “${data.q}”.`}
              </p>
            )}
          </>
        ) : (
          <section className="hero">
            <h1>Find great deals, fast.</h1>
            <SearchForm />
          </section>
        )}
      </main>
      <footer className="foot">
        <nav>
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
          ))}
        </nav>
      </footer>
    </>
  );
}
