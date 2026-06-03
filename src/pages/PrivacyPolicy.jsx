import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Database, UserCheck, Cookie, Mail, ChevronRight } from 'lucide-react';

const sections = [
  {
    id: 'data-we-collect',
    icon: Eye,
    title: 'Data We Collect',
    color: '#34d399',
    content: (
      <>
        <p>We collect the following information when you register and use Alice Exam Proctor:</p>
        <ul>
          <li><strong>Account Information</strong> — Your name, email address, and role (student, teacher, or admin) during registration.</li>
          <li><strong>Exam Activity</strong> — Timestamps of exam sessions, join/leave events, and quiz responses.</li>
          <li><strong>Violation Logs</strong> — Behavioral flags such as tab-switch events, gaze deviation, and face count anomalies, stored with timestamps and severity levels.</li>
          <li><strong>Device & Browser Data</strong> — Browser type, OS, and viewport size for compatibility purposes only.</li>
        </ul>
        <div className="pp-callout">
          <Shield size={15} />
          <span><strong>Important:</strong> All webcam processing (face detection, gaze tracking) runs entirely in your browser using TensorFlow.js. No raw video or images are ever transmitted to or stored on our servers.</span>
        </div>
      </>
    ),
  },
  {
    id: 'how-we-use',
    icon: UserCheck,
    title: 'How We Use Your Data',
    color: '#60a5fa',
    content: (
      <>
        <p>Your data is used exclusively to deliver and improve the Alice Exam Proctor service:</p>
        <ul>
          <li><strong>Authentication</strong> — Verifying your identity and role across sessions.</li>
          <li><strong>Proctoring</strong> — Logging behavioral signals to generate integrity reports for teachers and admins.</li>
          <li><strong>Platform Improvement</strong> — Aggregated, anonymised analytics to improve AI model accuracy and UI performance.</li>
          <li><strong>Support</strong> — Responding to help requests and bug reports.</li>
        </ul>
        <p>We do <strong>not</strong> sell, rent, or share your personal data with third parties for marketing or advertising purposes.</p>
      </>
    ),
  },
  {
    id: 'data-storage',
    icon: Database,
    title: 'Data Storage & Security',
    color: '#a78bfa',
    content: (
      <>
        <p>We take data security seriously and implement industry-standard measures:</p>
        <ul>
          <li><strong>Database</strong> — User data is stored in MongoDB Atlas with encryption at rest (AES-256).</li>
          <li><strong>Transit</strong> — All data transmitted between your browser and our servers is encrypted via TLS 1.2+.</li>
          <li><strong>Retention</strong> — Violation logs are retained for 90 days after exam completion, after which they are automatically purged.</li>
          <li><strong>Access Control</strong> — Only authorized personnel can access raw data. Role-based access restricts teachers to their own exams and students to their own records.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'your-rights',
    icon: UserCheck,
    title: 'Your Rights',
    color: '#f59e0b',
    content: (
      <>
        <p>You have the following rights over your personal data:</p>
        <ul>
          <li><strong>Access</strong> — Request a copy of the personal data we hold about you.</li>
          <li><strong>Correction</strong> — Request correction of inaccurate or incomplete data.</li>
          <li><strong>Deletion</strong> — Request complete deletion of your account and all associated data.</li>
          <li><strong>Portability</strong> — Request your data in a machine-readable format (JSON/CSV).</li>
          <li><strong>Objection</strong> — Object to processing in specific circumstances.</li>
        </ul>
        <p>To exercise any of these rights, contact us at <a href="mailto:singhrajputaditya982@gmail.com" className="pp-link">singhrajputaditya982@gmail.com</a>. We will respond within 30 days.</p>
      </>
    ),
  },
  {
    id: 'cookies',
    icon: Cookie,
    title: 'Cookies',
    color: '#fb923c',
    content: (
      <>
        <p>We use only essential, functional cookies — no tracking or advertising cookies whatsoever.</p>
        <div className="pp-table-wrap">
          <table>
            <thead>
              <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
            </thead>
            <tbody>
              <tr><td>Session Token (JWT)</td><td>Keeps you authenticated during your session</td><td>Session</td></tr>
              <tr><td>Theme Preference</td><td>Remembers your light/dark mode choice</td><td>1 year</td></tr>
            </tbody>
          </table>
        </div>
        <p>You can clear cookies at any time via your browser settings. Clearing the session token will require you to log in again.</p>
      </>
    ),
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Contact & DPO',
    color: '#34d399',
    content: (
      <>
        <p>For any privacy-related questions, data requests, or concerns, please reach out to us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:singhrajputaditya982@gmail.com" className="pp-link">singhrajputaditya982@gmail.com</a></li>
          <li><strong>GitHub:</strong> <a href="https://github.com/adii0018" target="_blank" rel="noopener noreferrer" className="pp-link">github.com/adii0018</a></li>
        </ul>
        <p>We are committed to resolving any privacy concern promptly and transparently.</p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('data-we-collect');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy — Alice Exam Proctor';
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

        .pp-navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(8,12,16,0.85);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 16px 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .pp-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.85rem;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          transition: all 0.2s ease;
        }
        .pp-back-btn:hover {
          color: #34d399;
          border-color: rgba(52,211,153,0.3);
          background: rgba(52,211,153,0.05);
        }

        .pp-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 5% 100px;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 60px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .pp-layout { grid-template-columns: 1fr; gap: 40px; }
          .pp-sidebar { display: none; }
        }

        .pp-sidebar {
          position: sticky;
          top: 80px;
        }

        .pp-toc-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          color: rgba(255,255,255,0.35);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          text-decoration: none;
          margin-bottom: 4px;
        }
        .pp-toc-item:hover {
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.03);
        }
        .pp-toc-item.active {
          color: #34d399;
          background: rgba(52,211,153,0.06);
          border-color: rgba(52,211,153,0.15);
        }

        .pp-section {
          margin-bottom: 60px;
          scroll-margin-top: 100px;
        }

        .pp-section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .pp-section-icon {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pp-content p {
          color: rgba(255,255,255,0.55);
          font-size: 0.9rem;
          line-height: 1.85;
          margin-bottom: 16px;
        }
        .pp-content ul, .pp-content ol {
          padding-left: 0;
          list-style: none;
          margin-bottom: 20px;
        }
        .pp-content li {
          color: rgba(255,255,255,0.5);
          font-size: 0.87rem;
          line-height: 1.8;
          padding: 6px 0 6px 20px;
          position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .pp-content li:last-child { border-bottom: none; }
        .pp-content li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #34d399;
          font-size: 0.75rem;
          top: 8px;
        }
        .pp-content strong {
          color: rgba(255,255,255,0.8);
          font-weight: 600;
        }

        .pp-callout {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 10px;
          background: rgba(52,211,153,0.04);
          border: 1px solid rgba(52,211,153,0.15);
          color: rgba(255,255,255,0.5);
          font-size: 0.83rem;
          line-height: 1.7;
          margin-top: 16px;
        }
        .pp-callout svg { color: #34d399; flex-shrink: 0; margin-top: 2px; }

        .pp-link {
          color: #34d399;
          text-decoration: none;
          border-bottom: 1px solid rgba(52,211,153,0.3);
          transition: border-color 0.2s;
        }
        .pp-link:hover { border-color: #34d399; }

        .pp-table-wrap {
          overflow-x: auto;
          margin: 16px 0;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .pp-table-wrap table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.83rem;
        }
        .pp-table-wrap th {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.45);
          font-weight: 600;
          text-align: left;
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .pp-table-wrap td {
          color: rgba(255,255,255,0.45);
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .pp-table-wrap tr:last-child td { border-bottom: none; }
      `}</style>

      {/* Navbar */}
      <nav className="pp-navbar">
        <Link to="/" className="pp-back-btn">
          <ArrowLeft size={14} />
          Back to Home
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={16} style={{ color: '#34d399' }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>Privacy Policy</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/terms" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Terms</Link>
          <Link to="/cookies" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Cookies</Link>
          <Link to="/gdpr" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>GDPR</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '64px 5% 48px',
        background: 'linear-gradient(180deg, rgba(52,211,153,0.03) 0%, transparent 100%)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', marginBottom: 20 }}>
          <Shield size={13} style={{ color: '#34d399' }} />
          <span style={{ color: '#34d399', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Privacy First</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px', background: 'linear-gradient(135deg, #e2e8f0, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          We believe your data is yours. Here's exactly what we collect, why we collect it, and how we protect it.
        </p>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>Last updated: March 2026</span>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>•</span>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>Version 1.0</span>
        </div>
      </div>

      {/* Layout */}
      <div className="pp-layout">
        {/* Sidebar TOC */}
        <aside className="pp-sidebar">
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Contents</div>
          {sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`pp-toc-item ${activeSection === s.id ? 'active' : ''}`}
            >
              <s.icon size={13} />
              {s.title}
              <ChevronRight size={11} style={{ marginLeft: 'auto', opacity: 0.4 }} />
            </a>
          ))}
        </aside>

        {/* Sections */}
        <main>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="pp-section">
              <div className="pp-section-header">
                <div
                  className="pp-section-icon"
                  style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}
                >
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Section {i + 1}</div>
                  <h2 style={{ color: '#e2e8f0', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{s.title}</h2>
                </div>
              </div>
              <div className="pp-content">{s.content}</div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
