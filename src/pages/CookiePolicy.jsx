import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Info, Settings, XCircle, ChevronRight } from 'lucide-react';

const sections = [
  {
    id: 'what-are-cookies',
    icon: Info,
    title: 'What Are Cookies?',
    color: '#fb923c',
    content: (
      <>
        <p>Cookies are small text files that websites store on your device when you visit them. They help websites remember information about your visit — like keeping you logged in, or remembering your preferences.</p>
        <p>Cookies can be "session" cookies (which expire when you close your browser) or "persistent" cookies (which remain for a set period or until you delete them).</p>
      </>
    ),
  },
  {
    id: 'cookies-we-use',
    icon: Cookie,
    title: 'Cookies We Use',
    color: '#34d399',
    content: (
      <>
        <p>We use only the minimum cookies necessary to operate the Service. We do <strong>not</strong> use any tracking, advertising, or profiling cookies.</p>
        <div className="ck-table-wrap">
          <table>
            <thead>
              <tr><th>Cookie Name</th><th>Purpose</th><th>Type</th><th>Duration</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>alice_token</code></td>
                <td>JWT authentication token — keeps you logged in</td>
                <td>Essential</td>
                <td>Session</td>
              </tr>
              <tr>
                <td><code>alice_theme</code></td>
                <td>Remembers your light/dark mode preference</td>
                <td>Functional</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td><code>alice_role</code></td>
                <td>Caches your user role for faster routing</td>
                <td>Essential</td>
                <td>Session</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>All cookies listed above are first-party (set by alice-exam-proctor.vercel.app). No third-party cookies are placed on your device by our service.</p>
      </>
    ),
  },
  {
    id: 'no-tracking',
    icon: XCircle,
    title: 'No Tracking Cookies',
    color: '#f87171',
    content: (
      <>
        <p>We are committed to your privacy. Alice Exam Proctor does <strong>not</strong> use:</p>
        <ul>
          <li>Google Analytics, Hotjar, or any other analytics tracking cookies</li>
          <li>Facebook Pixel, Google Ads, or any advertising/remarketing cookies</li>
          <li>Cross-site tracking cookies or fingerprinting techniques</li>
          <li>Any cookies that share your behaviour with third parties</li>
        </ul>
        <p>Webcam processing happens entirely in your browser via TensorFlow.js. Nothing from your camera is stored as a cookie or transmitted externally.</p>
      </>
    ),
  },
  {
    id: 'managing-cookies',
    icon: Settings,
    title: 'Managing & Disabling Cookies',
    color: '#a78bfa',
    content: (
      <>
        <p>You have full control over cookies through your browser settings. Most modern browsers let you:</p>
        <ul>
          <li>View all cookies stored by a website</li>
          <li>Delete specific cookies or all cookies for a site</li>
          <li>Block cookies from being set in the future</li>
          <li>Set exceptions to allow cookies only from trusted sites</li>
        </ul>
        <p>Browser-specific instructions:</p>
        <ul>
          <li><strong>Chrome</strong> — Settings → Privacy and Security → Cookies and other site data</li>
          <li><strong>Firefox</strong> — Settings → Privacy & Security → Cookies and Site Data</li>
          <li><strong>Safari</strong> — Preferences → Privacy → Manage Website Data</li>
          <li><strong>Edge</strong> — Settings → Cookies and site permissions → Cookies and site data</li>
        </ul>
        <div className="ck-callout">
          <Info size={15} />
          <span><strong>Note:</strong> Disabling the <code>alice_token</code> session cookie will prevent you from staying logged in. You'll need to re-authenticate on every visit.</span>
        </div>
      </>
    ),
  },
];

export default function CookiePolicy() {
  const [activeSection, setActiveSection] = useState('what-are-cookies');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Cookie Policy — Alice Exam Proctor';
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      for (const s of [...sections].reverse()) {
        const el = document.getElementById(s.id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(s.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c10',
      color: '#e2e8f0',
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .ck-navbar {
          position: sticky; top: 0; z-index: 50;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          background: rgba(8,12,16,0.85); border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 16px 5%; display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }
        .ck-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.85rem;
          padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03); transition: all 0.2s ease;
        }
        .ck-back-btn:hover { color: #fb923c; border-color: rgba(251,146,60,0.3); background: rgba(251,146,60,0.05); }

        .ck-layout {
          max-width: 1100px; margin: 0 auto; padding: 60px 5% 100px;
          display: grid; grid-template-columns: 240px 1fr; gap: 60px; align-items: start;
        }
        @media (max-width: 768px) { .ck-layout { grid-template-columns: 1fr; gap: 40px; } .ck-sidebar { display: none; } }

        .ck-sidebar { position: sticky; top: 80px; }
        .ck-toc-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; border-radius: 8px;
          color: rgba(255,255,255,0.35); font-size: 0.8rem;
          cursor: pointer; transition: all 0.2s;
          border: 1px solid transparent; text-decoration: none; margin-bottom: 4px;
        }
        .ck-toc-item:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.03); }
        .ck-toc-item.active { color: #fb923c; background: rgba(251,146,60,0.06); border-color: rgba(251,146,60,0.15); }

        .ck-section { margin-bottom: 60px; scroll-margin-top: 100px; }
        .ck-section-header {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ck-section-icon { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .ck-content p { color: rgba(255,255,255,0.55); font-size: 0.9rem; line-height: 1.85; margin-bottom: 16px; }
        .ck-content ul { padding-left: 0; list-style: none; margin-bottom: 20px; }
        .ck-content li {
          color: rgba(255,255,255,0.5); font-size: 0.87rem; line-height: 1.8;
          padding: 6px 0 6px 20px; position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .ck-content li:last-child { border-bottom: none; }
        .ck-content li::before { content: '→'; position: absolute; left: 0; color: #fb923c; font-size: 0.75rem; top: 8px; }
        .ck-content strong { color: rgba(255,255,255,0.8); font-weight: 600; }
        .ck-content code { background: rgba(255,255,255,0.07); padding: 1px 7px; border-radius: 5px; font-size: 0.82rem; color: #fb923c; font-family: 'JetBrains Mono', monospace; }

        .ck-callout {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 14px 18px; border-radius: 10px;
          background: rgba(251,146,60,0.04); border: 1px solid rgba(251,146,60,0.15);
          color: rgba(255,255,255,0.5); font-size: 0.83rem; line-height: 1.7; margin-top: 16px;
        }
        .ck-callout svg { color: #fb923c; flex-shrink: 0; margin-top: 2px; }

        .ck-table-wrap { overflow-x: auto; margin: 16px 0; border-radius: 10px; border: 1px solid rgba(255,255,255,0.07); }
        .ck-table-wrap table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
        .ck-table-wrap th {
          background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.45); font-weight: 600;
          text-align: left; padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.07);
          font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase;
        }
        .ck-table-wrap td { color: rgba(255,255,255,0.45); padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .ck-table-wrap tr:last-child td { border-bottom: none; }
        .ck-table-wrap code { background: rgba(255,255,255,0.07); padding: 1px 7px; border-radius: 5px; font-size: 0.82rem; color: #fb923c; }
      `}</style>

      {/* Navbar */}
      <nav className="ck-navbar">
        <Link to="/" className="ck-back-btn"><ArrowLeft size={14} />Back to Home</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Cookie size={16} style={{ color: '#fb923c' }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>Cookie Policy</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Terms</Link>
          <Link to="/gdpr" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>GDPR</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '64px 5% 48px', background: 'linear-gradient(180deg, rgba(251,146,60,0.03) 0%, transparent 100%)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)', marginBottom: 20 }}>
          <Cookie size={13} style={{ color: '#fb923c' }} />
          <span style={{ color: '#fb923c', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Zero Tracking</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px', background: 'linear-gradient(135deg, #e2e8f0, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Cookie Policy
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          We use only the essential cookies needed to run the Service — no advertising, no analytics, no cross-site tracking.
        </p>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>Last updated: March 2026</span>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>•</span>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>Version 1.0</span>
        </div>
      </div>

      {/* Layout */}
      <div className="ck-layout">
        <aside className="ck-sidebar">
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Contents</div>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className={`ck-toc-item ${activeSection === s.id ? 'active' : ''}`}>
              <s.icon size={13} />
              {s.title}
              <ChevronRight size={11} style={{ marginLeft: 'auto', opacity: 0.4 }} />
            </a>
          ))}
        </aside>
        <main>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="ck-section">
              <div className="ck-section-header">
                <div className="ck-section-icon" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Section {i + 1}</div>
                  <h2 style={{ color: '#e2e8f0', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{s.title}</h2>
                </div>
              </div>
              <div className="ck-content">{s.content}</div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
