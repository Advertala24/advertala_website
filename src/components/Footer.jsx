import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <nav>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-conditions">Terms &amp; Conditions</Link>
          <Link to="/contact-us">Contact Us</Link>
        </nav>
        <p>Copyright {new Date().getFullYear()} Advertala Pte. Ltd. | All Rights Reserved</p>
      </div>
    </footer>
  );
}
