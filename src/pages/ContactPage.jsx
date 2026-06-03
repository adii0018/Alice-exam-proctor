import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send, MapPin, Github, Linkedin, Instagram, MessageSquare, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const INFO_CARDS = [
  {
    icon: Mail,
    title: 'Email Us',
    desc: 'For general queries, feedback, or support requests.',
    value: 'singhrajputaditya982@gmail.com',
    href: 'mailto:singhrajputaditya982@gmail.com',
    color: '#34d399',
  },
  {
    icon: Github,
    title: 'GitHub',
    desc: 'Report bugs, contribute, or explore the source code.',
    value: 'github.com/adii0018',
    href: 'https://github.com/adii0018',
    color: '#e2e8f0',
    external: true,
  },
  {
    icon: Clock,
    title: 'Response Time',
    desc: 'We typically respond within 24–48 hours on business days.',
    value: '< 48 hours',
    color: '#60a5fa',
  },
  {
    icon: MapPin,
    title: 'Location',
    desc: 'We are a remote-first team building from India.',
    value: 'India 🇮🇳',
    color: '#fb923c',
  },
];

const SOCIALS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/adii0018', color: '#e2e8f0' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/aditya-singh-rajput-720aa8326', color: '#60a5fa' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/http._.adiix', color: '#f472b6' },
  { icon: Mail, label: 'Email', href: 'mailto:singhrajputaditya982@gmail.com', color: '#34d399' },
];

const FAQ = [
  { q: 'How do I report a bug?', a: 'Open a GitHub issue or use the contact form above. Include steps to reproduce and any error messages.' },
  { q: 'Can I request a feature?', a: 'Absolutely! Email us or open a GitHub Discussion. We actively review all feature requests.' },
  { q: 'Is Alice free to use?', a: 'Yes — Alice is currently free for all educators. Pro and Enterprise plans are coming soon.' },
  { q: 'How do I reset my password?', a: 'Contact your teacher or admin. Self-service password reset is coming in v1.4.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Contact Us — Alice Exam Proctor';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setStatus(data.success ? { ok: true, msg: data.message || 'Message sent successfully!' } : { ok: false, msg: data.error || 'Failed to send.' });
      if (data.success) setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({ ok: false, msg: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ minHeight: '100vh', background: '#080c10', color: '#e2e8f0', fontFamily: "'Inter','SF Pro Display',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .ct-navbar {
          position: sticky; top: 0; z-index: 50;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          background: rgba(8,12,16,0.85); border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 16px 5%; display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }
        .ct-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.85rem;
          padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03); transition: all 0.2s ease;
        }
        .ct-back-btn:hover { color: #34d399; border-color: rgba(52,211,153,0.3); background: rgba(52,211,153,0.05); }

        .ct-content { max-width: 1100px; margin: 0 auto; padding: 0 5% 100px; }

        .ct-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;
        }
        @media (max-width: 768px) { .ct-grid { grid-template-columns: 1fr; gap: 40px; } }

        .ct-info-card {
          padding: 22px; border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);
          transition: border-color 0.3s, transform 0.3s, background 0.3s;
        }
        .ct-info-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-3px); background: rgba(255,255,255,0.03); }

        .ct-input {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; color: #e2e8f0; font-size: 0.87rem;
          font-family: 'Inter', sans-serif; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; box-sizing: border-box;
        }
        .ct-input:focus { border-color: rgba(52,211,153,0.4); background: rgba(52,211,153,0.03); box-shadow: 0 0 0 3px rgba(52,211,153,0.06); }
        .ct-input::placeholder { color: rgba(255,255,255,0.18); }

        .ct-textarea { resize: vertical; min-height: 130px; }

        .ct-submit {
          width: 100%; padding: 13px;
          border-radius: 10px; border: 1px solid rgba(52,211,153,0.3);
          background: rgba(52,211,153,0.1); color: #34d399;
          font-size: 0.9rem; font-family: 'Inter', sans-serif; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.25s ease;
        }
        .ct-submit:hover:not(:disabled) { background: rgba(52,211,153,0.18); border-color: rgba(52,211,153,0.5); transform: translateY(-1px); }
        .ct-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .ct-social {
          width: 44px; height: 44px; border-radius: 11px;
          border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; transition: all 0.25s ease;
        }
        .ct-social:hover { border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.07); transform: translateY(-3px); }

        .ct-faq {
          border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;
          margin-bottom: 8px; overflow: hidden; transition: border-color 0.2s;
        }
        .ct-faq:hover { border-color: rgba(255,255,255,0.1); }
        .ct-faq-q {
          padding: 16px 20px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,0.02); transition: background 0.2s;
          border: none; width: 100%; text-align: left; font-family: inherit; color: inherit;
        }
        .ct-faq-q:hover { background: rgba(255,255,255,0.04); }
        .ct-faq-a {
          padding: 0 20px 18px; color: rgba(255,255,255,0.4); font-size: 0.85rem; line-height: 1.75;
        }

        .ct-label {
          color: rgba(255,255,255,0.35); font-size: 0.78rem; font-weight: 500; margin-bottom: 8px; display: block;
        }

        @keyframes spin-anim { to { transform: rotate(360deg); } }
      `}</style>

      {/* Navbar */}
      <nav className="ct-navbar">
        <Link to="/" className="ct-back-btn"><ArrowLeft size={14} /> Back to Home</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageSquare size={16} style={{ color: '#34d399' }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>Contact Us</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/blog" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Blog</Link>
          <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Terms</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '56px 5% 44px', background: 'linear-gradient(180deg, rgba(52,211,153,0.03) 0%, transparent 100%)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', marginBottom: 20 }}>
          <Mail size={13} style={{ color: '#34d399' }} />
          <span style={{ color: '#34d399', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Get in Touch</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 14px', background: 'linear-gradient(135deg, #e2e8f0, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Let's Connect
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.92rem', maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>
          Have a question, feedback, or partnership opportunity? We'd love to hear from you.
        </p>
      </div>

      <div className="ct-content">

        {/* Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, padding: '48px 0 56px' }}>
          {INFO_CARDS.map(c => (
            <div key={c.title} className="ct-info-card">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.color}12`, border: `1px solid ${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <c.icon size={18} style={{ color: c.color }} />
              </div>
              <div style={{ color: '#e2e8f0', fontSize: '0.92rem', fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', lineHeight: 1.65, marginBottom: 10 }}>{c.desc}</div>
              {c.href ? (
                <a href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noopener noreferrer' : undefined}
                  style={{ color: c.color, fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none', borderBottom: `1px solid ${c.color}40`, transition: 'border-color 0.2s' }}>
                  {c.value}
                </a>
              ) : (
                <span style={{ color: c.color, fontSize: '0.82rem', fontWeight: 600 }}>{c.value}</span>
              )}
            </div>
          ))}
        </div>

        {/* Main Grid: Form + Sidebar */}
        <div className="ct-grid">

          {/* Contact Form */}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Send a Message</div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="ct-label">Full Name</label>
                  <input type="text" placeholder="Your name" className="ct-input" value={form.name} onChange={e => update('name', e.target.value)} required />
                </div>
                <div>
                  <label className="ct-label">Email Address</label>
                  <input type="email" placeholder="you@example.com" className="ct-input" value={form.email} onChange={e => update('email', e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="ct-label">Subject</label>
                <input type="text" placeholder="What's this about?" className="ct-input" value={form.subject} onChange={e => update('subject', e.target.value)} required />
              </div>
              <div>
                <label className="ct-label">Message</label>
                <textarea placeholder="Tell us more..." className="ct-input ct-textarea" value={form.message} onChange={e => update('message', e.target.value)} required />
              </div>

              <button type="submit" className="ct-submit" disabled={submitting}>
                {submitting ? (
                  <><Loader2 size={16} style={{ animation: 'spin-anim 1s linear infinite' }} /> Sending...</>
                ) : (
                  <><Send size={15} /> Send Message</>
                )}
              </button>

              {status && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', borderRadius: 10,
                  background: status.ok ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)',
                  border: `1px solid ${status.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
                  color: status.ok ? '#34d399' : '#f87171',
                  fontSize: '0.85rem',
                }}>
                  {status.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {status.msg}
                </div>
              )}
            </form>
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Social Links */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Follow Us</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="ct-social">
                    <s.icon size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Frequently Asked</div>
              {FAQ.map((f, i) => (
                <div key={i} className="ct-faq">
                  <button className="ct-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span style={{ color: '#e2e8f0', fontSize: '0.88rem', fontWeight: 500 }}>{f.q}</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.1rem', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.25s' }}>+</span>
                  </button>
                  {openFaq === i && <div className="ct-faq-a">{f.a}</div>}
                </div>
              ))}
            </div>

            {/* CTA card */}
            <div style={{ marginTop: 32, padding: '24px', borderRadius: 14, background: 'linear-gradient(135deg, rgba(52,211,153,0.05), rgba(96,165,250,0.03))', border: '1px solid rgba(52,211,153,0.12)' }}>
              <div style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>Ready to get started?</div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', lineHeight: 1.7, marginBottom: 16 }}>
                Create your free account and start proctoring exams in under 5 minutes.
              </p>
              <Link to="/auth" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 22px', borderRadius: 9,
                background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
                color: '#34d399', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
              }}>
                Get started free <Send size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
