import RichText from './RichText.jsx';

const LOGO = '/shopdepot.png';
// Required footer links from the partner's integration notes.
const LINKS = [
  ['Privacy Policy', 'https://mediawavegroup.org/privacy-policy.html'],
  ['Contact Us', 'https://quickshoppers.co/mbd/contact'],
  ['For Advertisers', 'https://s3-us-west-2.amazonaws.com/mediawavegroup.org/ForAdvertisers.pdf'],
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm5.5-2 5 5" />
    </svg>
  );
}

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
        {ad.siteLinks?.length > 0 && (
          <div className="siteLinks">
            {ad.siteLinks.map((l) => (
              <a key={l.url + l.text} href={l.url} rel="nofollow" className="slinks jlisting">{l.text}</a>
            ))}
          </div>
        )}
        <a {...link} className="jlisting bigsee">
          <span>SEE IT</span>
          <ArrowIcon />
        </a>
      </section>
    </li>
  );
}

const resultsUrl = (q, subid) => `/results?q=${encodeURIComponent(q)}${subid ? `&subid=${encodeURIComponent(subid)}` : ''}`;

// Small pill search used in the header and the sidebar; submitting reloads /results with a new q.
function SearchBox({ q = '', subid, id }) {
  return (
    <form action="/results" method="get" role="search">
      <div className="axil-search">
        <button type="submit" className="search-button" aria-label="Search"><SearchIcon /></button>
        <input
          type="search" name="q" id={id} className="form-control" placeholder="Search" defaultValue={q}
          aria-label="Search" enterKeyHint="search" autoComplete="off" autoCapitalize="none" required
        />
        {subid ? <input type="hidden" name="subid" value={subid} /> : null}
      </div>
    </form>
  );
}

// Right column (desktop only): search again + related searches. Both reload /results with a new q.
function Sidebar({ data }) {
  return (
    <aside id="rside">
      <div className="widget widget_search">
        <h5 className="widget-title">Search</h5>
        <SearchBox q={data.q} subid={data.subid} />
      </div>
      {data.suggestions?.length > 0 && (
        <div className="widget widget_postlist">
          <h5 className="widget-title">Related Searches</h5>
          <ul className="sub-menu">
            {data.suggestions.map((s) => (
              <li key={s}><a href={resultsUrl(s, data.subid)}>{s}</a></li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

function Results({ data }) {
  return (
    <div className="layout">
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
      <Sidebar data={data} />
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
        <div className="top-inner">
          <a className="top-logo" href="/"><img className="logo" src={LOGO} alt="ShopDepot" /></a>
          <nav className="topnav">
            <a href={data.rootUrl || '/'}>Home</a>
            <a href={LINKS[1][1]} target="_blank" rel="noopener noreferrer">Contact Us</a>
          </nav>
          <div className="header-search">
            <SearchBox q={data.q} subid={data.subid} />
          </div>
        </div>
      </header>
      <div id="mainsection">
        <main>{data.page === 'results' ? <Results data={data} /> : <Home />}</main>
        <footer className="foot">
          <div className="foot-inner">
            <div className="foot-left">
              <img className="foot-logo" src={LOGO} alt="" />
              <nav>
                {LINKS.map(([label, href]) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
                ))}
              </nav>
            </div>
            <p className="rights">All Rights Reserved © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </>
  );
}
