const PARTNER_PRIVACY = 'https://mediawavegroup.org/privacy-policy.html';

export function Privacy({ email }) {
  return (
    <article className="doc">
      <h1>Privacy Policy</h1>
      <p>
        This page explains what information is handled when you use the ShopDepot search page
        (marketplace.shopdepot.us). By using the site you agree to this policy.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>The search terms you enter.</li>
        <li>Technical information sent by your browser: IP address, browser/user-agent string and the pages you request.</li>
        <li>Ad interaction data, such as which sponsored listings were shown or clicked.</li>
        <li>Cookies and similar technologies set by us or by our advertising partners.</li>
      </ul>

      <h2>How it is used</h2>
      <ul>
        <li>To show you search results and sponsored listings that match your search.</li>
        <li>To measure ad performance, prevent fraud and improve the site.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>Advertising partners</h2>
      <p>
        Sponsored listings are supplied by third-party advertising and search partners. To return results, your search terms,
        IP address and user-agent are shared with them, and they may use cookies or pixels to measure ads. Their handling of
        data is governed by their own policies, including the{' '}
        <a href={PARTNER_PRIVACY} target="_blank" rel="noopener noreferrer">MediaWave Group privacy policy</a>.
        Clicking a sponsored listing takes you to an advertiser's site, which has its own privacy practices.
      </p>

      <h2>Cookies</h2>
      <p>
        You can block or delete cookies in your browser settings. Some features may not work without them.
      </p>

      <h2>Retention and security</h2>
      <p>
        We keep information only as long as needed for the purposes above or as required by law. No method of transmission
        or storage is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>Children</h2>
      <p>The site is not directed to children under 13, and we do not knowingly collect their information.</p>

      <h2>Your choices</h2>
      <p>
        To ask what information we hold about you, or to request correction or deletion, contact us at{' '}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy from time to time. Changes take effect when posted on this page.</p>
    </article>
  );
}

export function Contact({ email }) {
  return (
    <article className="doc">
      <h1>Contact Us</h1>
      <p>Questions, feedback or privacy requests? Send us an email and we will get back to you.</p>
      <p>
        <a className="btn" href={`mailto:${email}?subject=${encodeURIComponent('ShopDepot enquiry')}`}>Email us</a>
      </p>
      <p className="muted">Or write to <a href={`mailto:${email}`}>{email}</a>.</p>
      <p className="muted">
        Advertiser enquiries:{' '}
        <a href="https://s3-us-west-2.amazonaws.com/mediawavegroup.org/ForAdvertisers.pdf" target="_blank" rel="noopener noreferrer">
          For Advertisers
        </a>
      </p>
    </article>
  );
}
