import { Link } from 'react-router-dom';

const platforms = ['Windows', 'macOS', 'Android', 'iOS', 'Chrome', 'Firefox', 'Edge', 'Safari'];
const networks = [
  { name: 'Google', src: '/images/google.png' },
  { name: 'Facebook', src: '/images/facebook.png' },
  { name: 'Outbrain', src: '/images/outbrain.png' },
  { name: 'Taboola', src: '/images/taboola.png' },
  { name: 'TikTok', src: '/images/tiktok.png' },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>Experts in browser technology, search monetisation, and media buying</h1>
            <Link className="btn" to="/contact-us">CONTACT US</Link>
          </div>
          <img src="/images/dashboard.png" alt="Website analytics dashboard" />
        </div>
      </section>

      <section id="browser_tech" className="split">
        <div className="container split-grid">
          <div>
            <h2>Browser Technology</h2>
            <p>
              We specialise in the creation of personalized desktop and mobile browsers tailored to meet
              your unique requirements. Our browsers encompass a diverse array of functionalities, enabling
              you to explore, shop, and have a secure online experience. We also help in optimizing your
              revenue potential through our versatile products, which includes popular browser extensions,
              mobile apps, and websites.
            </p>
            <p>
              Our browser solutions are designed to be compatible with all leading devices, ensuring
              accessibility for a wide audience. In fact, they are relied upon and utilized by hundreds of
              thousands of users monthly, reaching a diverse audience across various platforms.
            </p>
          </div>
          <div className="platforms">
            <p>We provide solutions for every popular platform.</p>
            <ul className="chips">
              {platforms.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="search_monetize" className="split alt">
        <div className="container split-grid">
          <div>
            <h2>Search Monetisation</h2>
            <p>
              Unlock a world of possibilities with our cutting-edge desktop, mobile browser extensions and
              apps. Equipped with specially crafted search engines, they empower users to navigate the web
              effortlessly.
            </p>
            <p>
              Our revenue generation stems from collaborations with top-tier search providers such as Bing,
              Yahoo, and Google, providing monetization options for Homepages, New Tabs, and Default Search
              functionalities.
            </p>
          </div>
          <img className="side-img" src="/images/search.jpg" alt="Search monetisation" />
        </div>
      </section>

      <section id="publisher" className="split">
        <div className="container split-grid">
          <div>
            <h2>Publishers</h2>
            <p>
              Publishers are continuously looking to maximise their onsite and traffic monetisation.
              Advertala leverages its proprietary technology and network of partnerships with leading
              players in the space to help do just that.
            </p>
            <p>Simple implementations, competitive payouts and ongoing optimisation support to truly maximise revenues.</p>
            <p>
              Are you a Publisher looking to generate revenue on your products and monetise your online user
              base? If so, please get in touch.
            </p>
            <Link className="btn" to="/contact-us">Talk to us</Link>
          </div>
          <img className="side-img" src="/images/rocket.png" alt="" />
        </div>
      </section>

      <section id="advertisers" className="split alt">
        <div className="container">
          <h2>Advertisers</h2>
          <p>
            With access to millions of customers and high intent users across desktop and mobile. We help
            leading advertisers and agencies achieve the very best ROI from their ad spend, to ensure
            tangible results and premium performance.
          </p>
          <p>Proprietary AI technology, experienced team, ongoing analysis, optimisation and high ROI.</p>
          <Link className="btn" to="/contact-us">Talk to us</Link>
          <ul className="networks">
            {networks.map((n) => (
              <li key={n.name}>
                <img src={n.src} alt={n.name} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="what_we_do" className="split">
        <div className="container">
          <h2>What We DO</h2>
          <p>
            We are digital marketing specialists with decades of experience in the online space spanning
            multiple sectors like browser technology, search monetisation, and media buying. We are
            specialists in the development of extensions, apps and browsers across desktop and mobile
            devices. We combine our creative ability with our technical skills to develop impactful products
            for our worldwide user community, optimizing profitability and revenue through tailored search
            feeds.
          </p>
          <p>
            Moreover, Our team is highly skilled, with expertise in traffic acquisition across all channels
            and platforms, business development, data, technology and online strategy.
          </p>
          <p>
            Through a global network of partnerships with key players in the industry, we offer a wide range
            of global solutions for publishers and advertisers across all platforms. With a focus on
            generating the highest ROI for our clients.
          </p>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>For a free consultation and see how we can enhance your business and brand</h2>
          <Link className="btn btn-light" to="/contact-us">CONTACT US NOW</Link>
        </div>
      </section>
    </>
  );
}
