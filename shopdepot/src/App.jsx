import RichText from './RichText.jsx';

const LOGO = '/shopdepot.png';
// Required footer links from the partner's integration notes.
const LINKS = [
  ['Privacy Policy', 'https://mediawavegroup.org/privacy-policy.html'],
  ['Contact Us', 'https://quickshoppers.co/mbd/contact'],
  ['For Advertisers', 'https://s3-us-west-2.amazonaws.com/mediawavegroup.org/ForAdvertisers.pdf'],
];

function ArrowIcon() {
  return (
    <svg className="barrow" viewBox="0 0 512 512" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm-28.9 143.6l75.5 72.4H120c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h182.6l-75.5 72.4c-9.7 9.3-9.9 24.8-.4 34.3l11 10.9c9.4 9.4 24.6 9.4 33.9 0L404.3 273c9.4-9.4 9.4-24.6 0-33.9L271.6 106.3c-9.4-9.4-24.6-9.4-33.9 0l-11 10.9c-9.5 9.6-9.3 25.1.4 34.4z"
      />
    </svg>
  );
}

// Every clickable part of an ad (title, host, description, button) goes to the same click URL.
function Ad({ ad }) {
  const link = { href: ad.url, rel: 'nofollow' };
  return (
    <li
      className="yahoo"
      data-yiid={ad.impressionId}
      data-appns={ad.appNs}
      data-k={ad.k}
      data-admd={ad.metadata}
      data-bingads-suffix={`${ad.appNs},${ad.k}`}
    >
      <section className="listingsection">
        <a {...link} className="h4 jlisting"><RichText text={ad.title} /></a>
        {ad.host ? (
          <a {...link} className="jlisting thesite">
            <span className="h5 ad-url" data-site={ad.host}>{ad.host}</span>
          </a>
        ) : null}
        <a {...link} className="jlisting desc"><p className="yahoo"><RichText text={ad.description} /></p></a>
        <a {...link} className="jlisting bigsee">
          <span>SEE IT</span>
          <ArrowIcon />
        </a>
      </section>
    </li>
  );
}

function Results({ data }) {
  return (
    <div className="serp">
      <label>Sponsored results for: <b>{data.q}</b></label>
      {data.ads.length > 0 ? (
        <ul className="ads tops">{data.ads.map((ad, i) => <Ad key={ad.impressionId || i} ad={ad} />)}</ul>
      ) : (
        <p className="empty">
          {data.error ? 'Results are unavailable right now. Please try again.' : `No sponsored results for “${data.q}”.`}
        </p>
      )}
    </div>
  );
}

function Home() {
  return (
    <section className="hero">
      <h1>Find great deals, fast.</h1>
      <form className="search" action="/results" method="get" role="search">
        <input
          name="q" type="search" placeholder="Search deals…" aria-label="Search"
          enterKeyHint="search" autoComplete="off" autoCapitalize="none" required
        />
        <button type="submit">Search</button>
      </form>
    </section>
  );
}

export default function App({ data }) {
  return (
    <>
      <header className="top">
        <a href="/"><img className="logo" src={LOGO} alt="ShopDepot" /></a>
      </header>
      <div id="mainsection">
        <main>{data.page === 'results' ? <Results data={data} /> : <Home />}</main>
        <footer className="foot">
          <nav>
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
            ))}
          </nav>
        </footer>
      </div>
    </>
  );
}
