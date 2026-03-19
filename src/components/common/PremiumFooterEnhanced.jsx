import { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Instagram, Mail, Shield, Eye, BookOpen, FileText, HelpCircle, Users, Send, Zap, Lock, Globe, ArrowUpRight } from 'lucide-react';
import FooterContentModal from './FooterContentModal';

const PremiumFooterEnhanced = () => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => { setEmail(''); setSubscribed(false); }, 3000);
    }
  };

  const stats = [
    { value: '99.9%', label: 'Uptime', icon: Zap },
    { value: '256-bit', label: 'Encryption', icon: Lock },
    { value: '50K+', label: 'Exams Proctored', icon: Shield },
    { value: 'Global', label: 'Coverage', icon: Globe },
  ];

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Features', modal: 'features' },
    { label: 'Terminal', href: '#terminal' },
    { label: 'Contact', href: '#contact' },
    { label: 'How it Works', modal: 'howItWorks' },
    { label: 'Pricing', modal: 'pricing' },
    { label: 'Changelog', modal: 'changelog' },
  ];

  const resources = [
    { icon: BookOpen, label: 'Documentation', modal: 'docs' },
    { icon: FileText, label: 'API Reference', modal: 'api' },
    { icon: HelpCircle, label: 'Help Center', modal: 'help' },
    { icon: Users, label: 'Community', modal: 'community' },
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com/adii0018', color: '#e2e8f0' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/aditya-singh-rajput-720aa8326', color: '#60a5fa' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/http._.adiix?igsh=MXVscHpwMWtxZGZpNg==', color: '#f472b6' },
    { icon: Mail, label: 'Email', href: 'mailto:singhrajputaditya982@gmail.com', color: '#34d399' },
  ];

  return (
    <>
    <footer ref={footerRef} style={{
      background: '#080c10',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
          50% { box-shadow: 0 0 0 4px rgba(52,211,153,0); }
        }
        @keyframes shimmer-grad {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ft-stat {
          padding: 20px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          text-align: center;
          transition: border-color 0.3s, background 0.3s, transform 0.3s;
        }
        .ft-stat:hover {
          border-color: rgba(52,211,153,0.2);
          background: rgba(52,211,153,0.04);
          transform: translateY(-4px);
        }

        .ft-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          font-size: 0.85rem;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.2s;
          gap: 8px;
        }
        .ft-link:last-child { border-bottom: none; }
        .ft-link .ft-icon { opacity: 0; transform: translateX(-4px); transition: all 0.2s; }
        .ft-link:hover { color: #fff; }
        .ft-link:hover .ft-icon { opacity: 1; transform: translateX(0); }

        .ft-social {
          width: 40px; height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .ft-social:hover {
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.07);
          transform: translateY(-3px);
        }

        .ft-input {
          width: 100%;
          padding: 11px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #fff;
          font-size: 0.85rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .ft-input:focus {
          border-color: rgba(52,211,153,0.35);
          background: rgba(52,211,153,0.03);
        }
        .ft-input::placeholder { color: rgba(255,255,255,0.2); }

        .ft-btn {
          width: 100%;
          padding: 11px;
          border-radius: 10px;
          border: 1px solid rgba(52,211,153,0.25);
          background: rgba(52,211,153,0.08);
          color: #34d399;
          font-size: 0.85rem;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.25s ease;
        }
        .ft-btn:hover {
          background: rgba(52,211,153,0.14);
          border-color: rgba(52,211,153,0.45);
          transform: translateY(-1px);
        }
        .ft-btn:disabled { opacity: 0.7; cursor: default; transform: none; }

        .ft-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 18px;
        }

        .ft-shimmer {
          background: linear-gradient(270deg, #34d399, #60a5fa, #a78bfa, #34d399);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-grad 4s ease infinite;
        }

        .ft-tech-tag {
          padding: 3px 10px;
          border-radius: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.3);
          font-size: 0.72rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .ft-tech-tag:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.6);
        }
      `}</style>

      {/* Subtle top glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 1, background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.3), rgba(96,165,250,0.2), transparent)', pointerEvents: 'none' }} />

      {/* Stats row */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '36px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {stats.map((s, i) => (
            <div key={s.label} className="ft-stat" style={{ animation: isVisible ? `fade-up 0.5s ease ${i * 0.08}s both` : 'none' }}>
              <s.icon style={{ width: 18, height: 18, color: 'rgba(52,211,153,0.5)', margin: '0 auto 10px', display: 'block' }} />
              <div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: 4, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 5% 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48 }}>

          {/* Brand */}
          <div style={{ animation: isVisible ? 'fade-up 0.6s ease 0.1s both' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(96,165,250,0.1))',
                border: '1px solid rgba(52,211,153,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Eye style={{ width: 18, height: 18, color: '#34d399' }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.02em' }}>
                  Alice<span style={{ color: '#34d399' }}>.</span>
                </div>
                <div style={{ color: 'rgba(52,211,153,0.4)', fontSize: '0.6rem', letterSpacing: '0.2em', marginTop: 1 }}>EXAM PROCTOR</div>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: 24, maxWidth: 280 }}>
              Next-gen AI proctoring platform with real-time behavioral analysis and zero-compromise integrity.
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
              {['AI-Powered', 'Secure', 'Real-time'].map(tag => (
                <span key={tag} style={{
                  padding: '4px 12px', borderRadius: 20,
                  background: 'rgba(52,211,153,0.06)',
                  border: '1px solid rgba(52,211,153,0.12)',
                  color: 'rgba(52,211,153,0.6)',
                  fontSize: '0.7rem', fontWeight: 500,
                }}>{tag}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {socialLinks.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="ft-social">
                  <s.icon style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.45)' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigate + Legal */}
          <div style={{ animation: isVisible ? 'fade-up 0.6s ease 0.15s both' : 'none' }}>
            <div className="ft-label">Navigate</div>
            <nav>
              {navLinks.map(l => (
                <a key={l.label} href={l.href || '#'} onClick={l.modal ? (e) => { e.preventDefault(); setActiveModal(l.modal); } : undefined} className="ft-link">
                  {l.label}
                  <ArrowUpRight className="ft-icon" style={{ width: 13, height: 13, flexShrink: 0 }} />
                </a>
              ))}
            </nav>
            <div className="ft-label" style={{ marginTop: 28 }}>Legal</div>
            <nav>
              {[
                { label: 'Privacy Policy', modal: 'privacy' },
                { label: 'Terms of Service', modal: 'terms' },
                { label: 'Cookie Policy', modal: 'cookies' },
                { label: 'GDPR', modal: 'gdpr' },
              ].map(l => (
                <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); setActiveModal(l.modal); }} className="ft-link">
                  {l.label}
                  <ArrowUpRight className="ft-icon" style={{ width: 13, height: 13, flexShrink: 0 }} />
                </a>
              ))}
            </nav>
          </div>

          {/* Resources + Status */}
          <div style={{ animation: isVisible ? 'fade-up 0.6s ease 0.2s both' : 'none' }}>
            <div className="ft-label">Resources</div>
            <nav>
              {resources.map(r => (
                <a key={r.label} href="#" onClick={(e) => { e.preventDefault(); setActiveModal(r.modal); }} className="ft-link">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <r.icon style={{ width: 13, height: 13, flexShrink: 0 }} />
                    {r.label}
                  </span>
                  <ArrowUpRight className="ft-icon" style={{ width: 13, height: 13, flexShrink: 0 }} />
                </a>
              ))}
            </nav>

            <div style={{
              marginTop: 28, padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(52,211,153,0.04)',
              border: '1px solid rgba(52,211,153,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse-dot 2s infinite', flexShrink: 0 }} />
                <span style={{ color: '#34d399', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.05em' }}>All systems operational</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', marginTop: 6, paddingLeft: 15 }}>Last checked: just now</div>
            </div>
          </div>

          {/* Newsletter */}
          <div style={{ animation: isVisible ? 'fade-up 0.6s ease 0.25s both' : 'none' }}>
            <div className="ft-label">Stay Updated</div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.83rem', lineHeight: 1.7, marginBottom: 18 }}>
              Get notified about new features, security updates, and releases.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="ft-input"
                disabled={subscribed}
              />
              <button type="submit" disabled={subscribed} className="ft-btn">
                {subscribed
                  ? <><span>✓</span> Subscribed!</>
                  : <><Send style={{ width: 13, height: 13 }} /> Subscribe</>}
              </button>
            </form>

            <div style={{ marginTop: 24 }}>
              <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Built with</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['React', 'Django', 'WebSocket', 'TensorFlow'].map(t => (
                  <span key={t} className="ft-tech-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1200, margin: '48px auto 0', padding: '0 5%' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)' }} />
        <div style={{ padding: '20px 0 28px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} Alice Exam Proctor — All rights reserved
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>Crafted by</span>
            <span className="ft-shimmer" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Aditya Singh Rajput</span>
            <span style={{ color: 'rgba(255,100,100,0.6)', fontSize: '0.9rem' }}>♥</span>
          </div>
        </div>
      </div>
    </footer>
    {activeModal && <FooterContentModal contentKey={activeModal} onClose={() => setActiveModal(null)} />}
    </>
  );
};

export default PremiumFooterEnhanced;
