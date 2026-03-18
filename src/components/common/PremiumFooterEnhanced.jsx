import { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Instagram, Mail, Shield, Eye, BookOpen, FileText, HelpCircle, Users, Send, ArrowUpRight, Zap, Lock, Globe } from 'lucide-react';

const PremiumFooterEnhanced = () => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);

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
    { label: 'Features', href: '#features' },
    { label: 'Terminal', href: '#terminal' },
    { label: 'Contact', href: '#contact' },
  ];

  const resources = [
    { icon: BookOpen, label: 'Documentation', href: '#docs' },
    { icon: FileText, label: 'API Reference', href: '#api' },
    { icon: HelpCircle, label: 'Help Center', href: '#help' },
    { icon: Users, label: 'Community', href: '#community' },
  ];

  const legal = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
    { label: 'GDPR Compliance', href: '#gdpr' },
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com/adii0018', accent: '#00ff9f' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/aditya-singh-rajput-720aa8326', accent: '#00b4ff' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/http._.adiix?igsh=MXVscHpwMWtxZGZpNg==', accent: '#ff6eb4' },
    { icon: Mail, label: 'Email', href: 'mailto:singhrajputaditya982@gmail.com', accent: '#00ff9f' },
  ];

  return (
    <footer ref={footerRef} style={{
      background: 'linear-gradient(180deg, #050505 0%, #000 100%)',
      borderTop: '1px solid rgba(0,255,159,0.1)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 1s ease, transform 1s ease',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&display=swap');

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #00ff9f; }
          50% { opacity: 0.4; box-shadow: 0 0 14px #00ff9f; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .f-stat-card {
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,255,159,0.08);
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          overflow: hidden;
        }
        .f-stat-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(0,255,159,0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .f-stat-card:hover {
          border-color: rgba(0,255,159,0.35);
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(0,255,159,0.08);
          background: rgba(0,255,159,0.03);
        }
        .f-stat-card:hover::before { opacity: 1; }
        .f-stat-card:hover .f-stat-icon { color: #00ff9f !important; filter: drop-shadow(0 0 8px #00ff9f); }

        .f-link {
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 0;
          transition: all 0.25s ease;
          border-bottom: 1px solid transparent;
        }
        .f-link .f-arrow { opacity: 0; transform: translate(-4px, 4px); transition: all 0.25s ease; }
        .f-link:hover { color: #00ff9f; padding-left: 6px; }
        .f-link:hover .f-arrow { opacity: 1; transform: translate(0, 0); }

        .f-social {
          width: 44px; height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }
        .f-social:hover { transform: translateY(-5px) scale(1.08); }

        .f-input {
          background: rgba(255,255,255,0.03) !important;
          border: 1px solid rgba(0,255,159,0.12) !important;
          color: #fff !important;
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 0.8rem !important;
          border-radius: 10px !important;
          padding: 12px 16px !important;
          width: 100% !important;
          outline: none !important;
          transition: all 0.3s !important;
          box-sizing: border-box !important;
        }
        .f-input:focus {
          border-color: rgba(0,255,159,0.45) !important;
          box-shadow: 0 0 0 3px rgba(0,255,159,0.07), 0 0 20px rgba(0,255,159,0.05) !important;
          background: rgba(0,255,159,0.03) !important;
        }
        .f-input::placeholder { color: rgba(255,255,255,0.18) !important; }

        .f-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(0,255,159,0.3);
          background: linear-gradient(135deg, rgba(0,255,159,0.08) 0%, rgba(0,180,255,0.05) 100%);
          color: #00ff9f;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }
        .f-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(0,255,159,0.15) 0%, rgba(0,180,255,0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .f-btn:hover::before { opacity: 1; }
        .f-btn:hover {
          border-color: rgba(0,255,159,0.6);
          box-shadow: 0 0 30px rgba(0,255,159,0.15), 0 4px 20px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }

        .f-section-label {
          font-size: 0.65rem;
          letter-spacing: 3px;
          color: rgba(0,255,159,0.6);
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .f-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(0,255,159,0.2), transparent);
        }

        .f-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid rgba(0,255,159,0.15);
          background: rgba(0,255,159,0.04);
          color: rgba(0,255,159,0.65);
          font-size: 0.65rem;
          letter-spacing: 1px;
          transition: all 0.2s;
        }
        .f-tag:hover {
          border-color: rgba(0,255,159,0.35);
          background: rgba(0,255,159,0.08);
          color: #00ff9f;
        }

        .f-glass-box {
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 16px;
        }

        .f-shimmer-text {
          background: linear-gradient(90deg, #00ff9f 0%, #00b4ff 50%, #00ff9f 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '-100px', left: '5%', width: 600, height: 500, background: 'radial-gradient(ellipse, rgba(0,255,159,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '-60px', right: '10%', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(0,180,255,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: '30%', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(0,255,159,0.03) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* ── STATS BAR ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '40px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {stats.map((s, i) => (
              <div key={s.label} className="f-stat-card" style={{
                animation: isVisible ? `float-up 0.6s ease ${i * 0.1}s both` : 'none',
              }}>
                <s.icon className="f-stat-icon" style={{ width: 20, height: 20, color: 'rgba(0,255,159,0.35)', margin: '0 auto 12px', display: 'block', transition: 'all 0.3s' }} />
                <div style={{ color: '#00ff9f', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-1px', textShadow: '0 0 30px rgba(0,255,159,0.4)' }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', marginTop: 6, letterSpacing: '2px', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 5% 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.4fr', gap: 56, marginBottom: 0 }}>

          {/* Brand column */}
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                border: '1px solid rgba(0,255,159,0.25)',
                background: 'linear-gradient(135deg, rgba(0,255,159,0.1) 0%, rgba(0,180,255,0.05) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0,255,159,0.1)',
              }}>
                <Eye style={{ width: 20, height: 20, color: '#00ff9f', filter: 'drop-shadow(0 0 8px #00ff9f)' }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '1px' }}>
                  Alice<span style={{ color: '#00ff9f' }}>_</span>
                  <span style={{ animation: 'blink 1.2s step-end infinite', color: '#00ff9f' }}>|</span>
                </div>
                <div style={{ color: 'rgba(0,255,159,0.45)', fontSize: '0.58rem', letterSpacing: '3px', marginTop: 2 }}>EXAM PROCTOR</div>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', lineHeight: 1.9, marginBottom: 28, maxWidth: 290 }}>
              Next-gen AI proctoring platform. Real-time behavioral analysis, zero-compromise integrity, built for the modern classroom.
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
              <span className="f-tag"><Shield style={{ width: 10, height: 10 }} /> AI-Powered</span>
              <span className="f-tag"><Lock style={{ width: 10, height: 10 }} /> Secure</span>
              <span className="f-tag"><Zap style={{ width: 10, height: 10 }} /> Real-time</span>
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: 10 }}>
              {socialLinks.map((s, i) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="f-social"
                  onMouseEnter={() => setHoveredSocial(i)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    borderColor: hoveredSocial === i ? `${s.accent}60` : 'rgba(255,255,255,0.08)',
                    boxShadow: hoveredSocial === i ? `0 0 24px ${s.accent}30, 0 8px 20px rgba(0,0,0,0.4)` : 'none',
                    background: hoveredSocial === i ? `${s.accent}10` : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <s.icon style={{ width: 17, height: 17, color: hoveredSocial === i ? s.accent : 'rgba(255,255,255,0.4)', transition: 'color 0.3s', position: 'relative', zIndex: 1 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <div className="f-section-label">Navigate</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="f-link">
                    {l.label}
                    <ArrowUpRight className="f-arrow" style={{ width: 13, height: 13, marginLeft: 'auto' }} />
                  </a>
                </li>
              ))}
            </ul>

            <div className="f-section-label" style={{ marginTop: 32 }}>Legal</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="f-link">
                    {l.label}
                    <ArrowUpRight className="f-arrow" style={{ width: 13, height: 13, marginLeft: 'auto' }} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="f-section-label">Resources</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {resources.map((r) => (
                <li key={r.label}>
                  <a href={r.href} className="f-link">
                    <r.icon style={{ width: 13, height: 13, flexShrink: 0 }} />
                    {r.label}
                    <ArrowUpRight className="f-arrow" style={{ width: 13, height: 13, marginLeft: 'auto' }} />
                  </a>
                </li>
              ))}
            </ul>

            {/* Status indicator */}
            <div style={{ marginTop: 32 }} className="f-glass-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff9f', display: 'inline-block', animation: 'pulse-dot 2s infinite', flexShrink: 0 }} />
                <span style={{ color: '#00ff9f', fontSize: '0.68rem', letterSpacing: '1.5px' }}>ALL SYSTEMS OPERATIONAL</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', paddingLeft: 16 }}>Last checked: just now</div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="f-section-label">Stay Updated</div>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.8rem', lineHeight: 1.8, marginBottom: 20 }}>
              Get notified about new features, security updates, and platform releases.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="f-input"
                disabled={subscribed}
              />
              <button type="submit" disabled={subscribed} className="f-btn">
                {subscribed
                  ? <><span style={{ color: '#00ff9f', position: 'relative', zIndex: 1 }}>✓</span> <span style={{ position: 'relative', zIndex: 1 }}>Subscribed!</span></>
                  : <><Send style={{ width: 13, height: 13, position: 'relative', zIndex: 1 }} /> <span style={{ position: 'relative', zIndex: 1 }}>Subscribe</span></>}
              </button>
            </form>

            {/* Built with */}
            <div style={{ marginTop: 24 }} className="f-glass-box">
              <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.65rem', marginBottom: 10, letterSpacing: '2px' }}>BUILT WITH</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['React', 'Django', 'WebSocket', 'TensorFlow'].map(t => (
                  <span key={t} style={{
                    padding: '3px 10px', borderRadius: 6,
                    background: 'rgba(0,255,159,0.04)',
                    border: '1px solid rgba(0,255,159,0.1)',
                    color: 'rgba(0,255,159,0.5)',
                    fontSize: '0.65rem',
                    transition: 'all 0.2s',
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ maxWidth: 1200, margin: '56px auto 0', padding: '0 5%' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,159,0.15) 30%, rgba(0,180,255,0.1) 70%, transparent 100%)' }} />
        <div style={{ padding: '24px 0 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.72rem', letterSpacing: '0.5px' }}>
              © {new Date().getFullYear()} Alice Exam Proctor
            </span>
            <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.72rem' }}>All rights reserved</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem' }}>Crafted by</span>
            <span className="f-shimmer-text" style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.5px' }}>
              Aditya Singh Rajput
            </span>
            <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '0.7rem' }}>with</span>
            <span style={{ color: 'rgba(255,80,80,0.7)', fontSize: '0.85rem' }}>♥</span>
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,159,0.3) 40%, rgba(0,180,255,0.2) 60%, transparent 100%)' }} />
    </footer>
  );
};

export default PremiumFooterEnhanced;
