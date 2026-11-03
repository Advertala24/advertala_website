const EMAIL = 'info@advertala.net';

export default function Contact() {
  return (
    <section className="page">
      <div className="container narrow">
        <h1>Contact Us</h1>
        <p>Send us an email and one of the team will be in touch!</p>
        <a className="btn" href={`mailto:${EMAIL}?subject=${encodeURIComponent('Website enquiry')}`}>
          Email us
        </a>
        <p className="contact-email">
          or write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </div>
    </section>
  );
}
