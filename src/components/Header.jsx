import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const anchors = [
  ['Browser Technology', '/#browser_tech'],
  ['Search Monetisation', '/#search_monetize'],
  ['Publisher', '/#publisher'],
  ['Advertisers', '/#advertisers'],
  ['What We Do', '/#what_we_do'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" onClick={close} className="logo">
          <img src="/images/logo.png" alt="Advertala" />
        </Link>
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>
        <nav className={open ? 'nav open' : 'nav'}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          {anchors.map(([label, to]) => (
            <Link key={to} to={to} onClick={close}>{label}</Link>
          ))}
          <NavLink to="/about-us" onClick={close}>About Us</NavLink>
        </nav>
      </div>
    </header>
  );
}
