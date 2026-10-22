import { useMemo, useState } from 'react';

const EMAIL = 'info@advertala.net';

export default function Contact() {
  const [a, b] = useMemo(() => [1 + Math.floor(Math.random() * 15), 1 + Math.floor(Math.random() * 15)], []);
  const [form, setForm] = useState({ name: '', email: '', message: '', captcha: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (Number(form.captcha) !== a + b) {
      setError('Incorrect answer to the verification question.');
      return;
    }
    setError('');
    const subject = encodeURIComponent(`Website enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nName: ${form.name}\nEmail: ${form.email}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="page">
      <div className="container narrow">
        <h1>Contact Us</h1>
        <p>Fill in the form below and one of the team will be in touch!</p>
        <form className="contact-form" onSubmit={submit}>
          <label>Name
            <input required placeholder="Name" value={form.name} onChange={set('name')} />
          </label>
          <label>Email Address
            <input required type="email" placeholder="Email Address" value={form.email} onChange={set('email')} />
          </label>
          <label>Message
            <textarea required rows="6" placeholder="Message" value={form.message} onChange={set('message')} />
          </label>
          <label className="captcha">{a} + {b} =
            <input required inputMode="numeric" value={form.captcha} onChange={set('captcha')} />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn" type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}
