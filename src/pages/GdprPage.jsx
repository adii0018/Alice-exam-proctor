import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Scale, Users, ArrowRightLeft, Trash2, Mail, ChevronRight } from 'lucide-react';

const sections = [
  {
    id: 'overview',
    icon: Globe,
    title: 'GDPR Overview',
    color: '#a78bfa',
    content: (
      <>
        <p>The General Data Protection Regulation (GDPR) is a European Union regulation that governs how organisations collect, use, and protect the personal data of individuals within the European Economic Area (EEA).</p>
        <p>Alice Exam Proctor is committed to full GDPR compliance. This page explains the legal basis for our data processing, your rights as a data subject, and how to exercise those rights.</p>
        <div className="gd-callout">
          <Globe size={15} />
          <span>GDPR applies to you if you are located in the European Economic Area (EEA), which includes all EU member states plus Norway, Iceland, and Liechtenstein.</span>
        </div>
      </>
    ),
  },
  {
    id: 'legal-basis',
    icon: Scale,
    title: 'Legal Basis for Processing',
    color: '#60a5fa',
    content: (
      <>
        <p>Under GDPR Article 6, we rely on the following legal bases for processing your personal data:</p>
        <ul>
          <li><strong>Contractual Necessity (Art. 6(1)(b))</strong> — Processing your name, email, and role is necessary to provide you with the Alice Exam Proctor service you have signed up for.</li>
          <li><strong>Legitimate Interests (Art. 6(1)(f))</strong> — Processing exam activity and violation logs is necessary for the legitimate interest of maintaining academic integrity during proctored exams.</li>
          <li><strong>Consent (Art. 6(1)(a))</strong> — For optional features (such as the newsletter), we will always ask for your explicit, freely given consent before processing.</li>
        </ul>
        <p>We do <strong>not</strong> rely on "legal obligation" or "vital interests" as a basis for any routine data processing.</p>
      </>
    ),
  },
  {
    id: 'your-rights',
    icon: Users,
    title: 'Your GDPR Rights',
    color: '#34d399',
    content: (
      <>
        <p>As a data subject under GDPR, you have the following rights which we are committed to upholding:</p>
        <ul>
          <li><strong>Right of Access (Art. 15)</strong> — You may request a complete copy of all personal data we hold about you, including exam records and violation logs.</li>
          <li><strong>Right to Rectification (Art. 16)</strong> — You may request correction of any inaccurate or incomplete personal data.</li>
          <li><strong>Right to Erasure / "Right to be Forgotten" (Art. 17)</strong> — You may request deletion of your account and all associated personal data. We will comply within 30 days.</li>
          <li><strong>Right to Restriction of Processing (Art. 18)</strong> — You may request that we temporarily halt processing of your data in certain circumstances.</li>
          <li><strong>Right to Data Portability (Art. 20)</strong> — You may request your personal data in a structured, machine-readable format (JSON or CSV).</li>
          <li><strong>Right to Object (Art. 21)</strong> — You may object to processing based on legitimate interests, including profiling.</li>
          <li><strong>Right not to be subject to automated decision-making (Art. 22)</strong> — Our AI generates behavioral signals, but all final academic decisions are made by humans (teachers/institutions).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-transfers',
    icon: ArrowRightLeft,
    title: 'International Data Transfers',
    color: '#f59e0b',
    content: (
      <>
        <p>Your data may be stored on infrastructure located outside the European Economic Area (EEA). Specifically:</p>
        <ul>
          <li><strong>MongoDB Atlas</strong> — Database hosting on AWS servers (US-East region by default). MongoDB Atlas is certified under EU-US Data Privacy Framework and implements Standard Contractual Clauses (SCCs) per GDPR Article 46.</li>
          <li><strong>Vercel</strong> — Frontend hosting on Vercel's global edge network. Vercel is also SCCs-compliant for EU data subjects.</li>
          <li><strong>Render</strong> — Backend API hosting. Render processes data under SCCs.</li>
        </ul>
        <p>All third-party processors we use are contractually bound to protect your data to GDPR standards, regardless of the country where the data is processed.</p>
      </>
    ),
  },
  {
    id: 'data-retention',
    icon: Trash2,
    title: 'Data Retention',
    color: '#f87171',
    content: (
      <>
        <p>We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected:</p>
        <ul>
          <li><strong>Account data</strong> (name, email, role) — Retained for the lifetime of your account. Deleted within 30 days of account deletion request.</li>
          <li><strong>Exam activity logs</strong> — Retained for 90 days after exam completion, then automatically purged.</li>
          <li><strong>Violation logs</strong> — Retained for 90 days after exam completion, then automatically purged.</li>
          <li><strong>Support communications</strong> — Retained for 6 months after the support case is resolved.</li>
        </ul>
        <p>You may request early deletion of any category of data at any time by contacting us at the address below.</p>
      </>
    ),
  },
  {
    id: 'contact-dpo',
    icon: Mail,
    title: 'Contact & DPO',
    color: '#a78bfa',
    content: (
      <>
        <p>To exercise any of your GDPR rights, submit a complaint, or ask questions about our data practices, contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:singhrajputaditya982@gmail.com" className="gd-link">singhrajputaditya982@gmail.com</a></li>
          <li><strong>GitHub:</strong> <a href="https://github.com/adii0018" target="_blank" rel="noopener noreferrer" className="gd-link">github.com/adii0018</a></li>
          <li><strong>Response time:</strong> We will acknowledge your request within 72 hours and respond fully within 30 days (as required by GDPR Art. 12).</li>
        </ul>
        <p>If you believe your rights have been violated, you also have the right to lodge a complaint with your national supervisory authority (e.g., ICO in the UK, CNIL in France, or the relevant DPA in your country).</p>
      </>
    ),
  },
];

export default function GdprPage() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'GDPR Compliance — Alice Exam Proctor';
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

        .gd-navbar {
          position: sticky; top: 0; z-index: 50;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          background: rgba(8,12,16,0.85); border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 16px 5%; display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }
        .gd-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.85rem;
          padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03); transition: all 0.2s ease;
        }
        .gd-back-btn:hover { color: #a78bfa; border-color: rgba(167,139,250,0.3); background: rgba(167,139,250,0.05); }

        .gd-layout {
          max-width: 1100px; margin: 0 auto; padding: 60px 5% 100px;
          display: grid; grid-template-columns: 240px 1fr; gap: 60px; align-items: start;
        }
        @media (max-width: 768px) { .gd-layout { grid-template-columns: 1fr; gap: 40px; } .gd-sidebar { display: none; } }

        .gd-sidebar { position: sticky; top: 80px; }
        .gd-toc-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; border-radius: 8px;
          color: rgba(255,255,255,0.35); font-size: 0.8rem;
          cursor: pointer; transition: all 0.2s;
          border: 1px solid transparent; text-decoration: none; margin-bottom: 4px;
        }
        .gd-toc-item:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.03); }
        .gd-toc-item.active { color: #a78bfa; background: rgba(167,139,250,0.06); border-color: rgba(167,139,250,0.15); }

        .gd-section { margin-bottom: 60px; scroll-margin-top: 100px; }
        .gd-section-header {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .gd-section-icon { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .gd-content p { color: rgba(255,255,255,0.55); font-size: 0.9rem; line-height: 1.85; margin-bottom: 16px; }
        .gd-content ul { padding-left: 0; list-style: none; margin-bottom: 20px; }
        .gd-content li {
          color: rgba(255,255,255,0.5); font-size: 0.87rem; line-height: 1.8;
          padding: 6px 0 6px 20px; position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .gd-content li:last-child { border-bottom: none; }
        .gd-content li::before { content: '→'; position: absolute; left: 0; color: #a78bfa; font-size: 0.75rem; top: 8px; }
        .gd-content strong { color: rgba(255,255,255,0.8); font-weight: 600; }

        .gd-callout {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 14px 18px; border-radius: 10px;
          background: rgba(167,139,250,0.04); border: 1px solid rgba(167,139,250,0.15);
          color: rgba(255,255,255,0.5); font-size: 0.83rem; line-height: 1.7; margin-top: 16px;
        }
        .gd-callout svg { color: #a78bfa; flex-shrink: 0; margin-top: 2px; }
        .gd-link { color: #a78bfa; text-decoration: none; border-bottom: 1px solid rgba(167,139,250,0.3); transition: border-color 0.2s; }
        .gd-link:hover { border-color: #a78bfa; }
      `}</style>

      {/* Navbar */}
      <nav className="gd-navbar">
        <Link to="/" className="gd-back-btn"><ArrowLeft size={14} />Back to Home</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe size={16} style={{ color: '#a78bfa' }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>GDPR Compliance</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Terms</Link>
          <Link to="/cookies" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Cookies</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '64px 5% 48px', background: 'linear-gradient(180deg, rgba(167,139,250,0.03) 0%, transparent 100%)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', marginBottom: 20 }}>
          <Globe size={13} style={{ color: '#a78bfa' }} />
          <span style={{ color: '#a78bfa', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>EEA Compliance</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px', background: 'linear-gradient(135deg, #e2e8f0, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          GDPR Compliance
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Our commitment to the General Data Protection Regulation — your rights, our responsibilities, and how we protect EEA data subjects.
        </p>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>Last updated: March 2026</span>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>•</span>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>Version 1.0</span>
        </div>
      </div>

      {/* Layout */}
      <div className="gd-layout">
        <aside className="gd-sidebar">
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Contents</div>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className={`gd-toc-item ${activeSection === s.id ? 'active' : ''}`}>
              <s.icon size={13} />
              {s.title}
              <ChevronRight size={11} style={{ marginLeft: 'auto', opacity: 0.4 }} />
            </a>
          ))}
        </aside>
        <main>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="gd-section">
              <div className="gd-section-header">
                <div className="gd-section-icon" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Section {i + 1}</div>
                  <h2 style={{ color: '#e2e8f0', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{s.title}</h2>
                </div>
              </div>
              <div className="gd-content">{s.content}</div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
