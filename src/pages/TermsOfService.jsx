import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, UserX, ShieldAlert, AlertTriangle, Gavel, ChevronRight } from 'lucide-react';

const sections = [
  {
    id: 'acceptance',
    icon: CheckCircle,
    title: 'Acceptance of Terms',
    color: '#34d399',
    content: (
      <>
        <p>By accessing or using Alice Exam Proctor (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms in their entirety, you must not access or use the Service.</p>
        <p>These Terms apply to all users of the Service, including students, teachers, and administrators. If you are using the Service on behalf of an institution, you represent that you are authorized to bind that institution to these Terms.</p>
        <div className="tos-callout">
          <AlertTriangle size={15} />
          <span>These Terms may be updated periodically. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.</span>
        </div>
      </>
    ),
  },
  {
    id: 'permitted-use',
    icon: CheckCircle,
    title: 'Permitted Use',
    color: '#60a5fa',
    content: (
      <>
        <p>The Service is intended exclusively for legitimate, academic proctoring purposes. You are permitted to:</p>
        <ul>
          <li>Create and administer online examinations for enrolled students</li>
          <li>Monitor exam sessions for academic integrity violations</li>
          <li>Review AI-generated violation reports and take appropriate action per your institution's policy</li>
          <li>Access the platform via standard web browsers</li>
        </ul>
        <p>These permissions are granted on the condition that the Service is used ethically and in compliance with applicable laws.</p>
      </>
    ),
  },
  {
    id: 'prohibited-use',
    icon: UserX,
    title: 'Prohibited Conduct',
    color: '#f87171',
    content: (
      <>
        <p>You expressly agree <strong>not</strong> to engage in any of the following:</p>
        <ul>
          <li>Circumventing or attempting to bypass any proctoring measure, AI monitoring, or security feature</li>
          <li>Impersonating another student, teacher, or administrator during an exam session</li>
          <li>Using the Service to surveil, monitor, or collect data on individuals outside of a legitimate exam context</li>
          <li>Reverse-engineering, decompiling, or extracting source code from the platform</li>
          <li>Sharing login credentials or allowing unauthorized access to your account</li>
          <li>Introducing malware, bots, scrapers, or any automated tools to interact with the Service</li>
          <li>Using violation data to harass, discriminate against, or unfairly penalise students</li>
        </ul>
        <p>Violation of these prohibitions may result in immediate account termination and, where applicable, referral to appropriate authorities.</p>
      </>
    ),
  },
  {
    id: 'account-responsibility',
    icon: ShieldAlert,
    title: 'Account Responsibility',
    color: '#f59e0b',
    content: (
      <>
        <p>You are solely responsible for maintaining the confidentiality and security of your account credentials.</p>
        <ul>
          <li>You must use a strong, unique password and not share it with anyone.</li>
          <li>You must notify us immediately at <a href="mailto:singhrajputaditya982@gmail.com" className="tos-link">singhrajputaditya982@gmail.com</a> if you suspect unauthorized access.</li>
          <li>All activity that occurs under your account is your responsibility, regardless of whether it was authorized by you.</li>
        </ul>
        <p>We reserve the right to suspend or terminate accounts that we believe have been compromised or are being used in violation of these Terms.</p>
      </>
    ),
  },
  {
    id: 'exam-integrity',
    icon: Gavel,
    title: 'Exam Integrity Standards',
    color: '#a78bfa',
    content: (
      <>
        <p>All parties using the Service agree to uphold the following integrity standards:</p>
        <ul>
          <li><strong>Students</strong> agree not to attempt to cheat, use unauthorized resources, or manipulate proctoring signals during exams.</li>
          <li><strong>Teachers</strong> agree to use violation reports fairly, in good faith, and in accordance with their institution's academic integrity policies.</li>
          <li><strong>Admins</strong> agree to manage user access and system settings responsibly, without unauthorized data access or manipulation.</li>
        </ul>
        <p>Alice Exam Proctor provides AI-generated signals as <em>evidence</em> — not as conclusive proof of misconduct. Final academic decisions rest solely with the appropriate human authority (teacher, institution, or review panel).</p>
      </>
    ),
  },
  {
    id: 'limitation',
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    color: '#fb923c',
    content: (
      <>
        <p>The Service is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind, express or implied, including but not limited to:</p>
        <ul>
          <li>Fitness for a particular purpose or specific exam format</li>
          <li>Uninterrupted or error-free operation of AI proctoring features</li>
          <li>Accuracy of behavioral flags or violation severity assessments</li>
        </ul>
        <p>To the maximum extent permitted by law, Alice Exam Proctor and its developers shall not be liable for:</p>
        <ul>
          <li>Academic outcomes, grades, or institutional decisions based on proctoring data</li>
          <li>Service outages, data loss, or technical failures beyond our reasonable control</li>
          <li>Indirect, incidental, or consequential damages arising from use or inability to use the Service</li>
        </ul>
      </>
    ),
  },
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('acceptance');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms of Service — Alice Exam Proctor';
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

        .tos-navbar {
          position: sticky; top: 0; z-index: 50;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(8,12,16,0.85);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 16px 5%;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }

        .tos-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.5); text-decoration: none;
          font-size: 0.85rem; padding: 8px 14px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03);
          transition: all 0.2s ease;
        }
        .tos-back-btn:hover { color: #60a5fa; border-color: rgba(96,165,250,0.3); background: rgba(96,165,250,0.05); }

        .tos-layout {
          max-width: 1100px; margin: 0 auto; padding: 60px 5% 100px;
          display: grid; grid-template-columns: 240px 1fr; gap: 60px; align-items: start;
        }
        @media (max-width: 768px) { .tos-layout { grid-template-columns: 1fr; gap: 40px; } .tos-sidebar { display: none; } }

        .tos-sidebar { position: sticky; top: 80px; }

        .tos-toc-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; border-radius: 8px;
          color: rgba(255,255,255,0.35); font-size: 0.8rem;
          cursor: pointer; transition: all 0.2s;
          border: 1px solid transparent; text-decoration: none; margin-bottom: 4px;
        }
        .tos-toc-item:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.03); }
        .tos-toc-item.active { color: #60a5fa; background: rgba(96,165,250,0.06); border-color: rgba(96,165,250,0.15); }

        .tos-section { margin-bottom: 60px; scroll-margin-top: 100px; }

        .tos-section-header {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 24px; padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .tos-section-icon { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .tos-content p { color: rgba(255,255,255,0.55); font-size: 0.9rem; line-height: 1.85; margin-bottom: 16px; }
        .tos-content ul { padding-left: 0; list-style: none; margin-bottom: 20px; }
        .tos-content li {
          color: rgba(255,255,255,0.5); font-size: 0.87rem; line-height: 1.8;
          padding: 6px 0 6px 20px; position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .tos-content li:last-child { border-bottom: none; }
        .tos-content li::before { content: '→'; position: absolute; left: 0; color: #60a5fa; font-size: 0.75rem; top: 8px; }
        .tos-content strong { color: rgba(255,255,255,0.8); font-weight: 600; }
        .tos-content em { color: rgba(255,255,255,0.5); font-style: italic; }

        .tos-callout {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 14px 18px; border-radius: 10px;
          background: rgba(96,165,250,0.04); border: 1px solid rgba(96,165,250,0.15);
          color: rgba(255,255,255,0.5); font-size: 0.83rem; line-height: 1.7; margin-top: 16px;
        }
        .tos-callout svg { color: #60a5fa; flex-shrink: 0; margin-top: 2px; }
        .tos-link { color: #60a5fa; text-decoration: none; border-bottom: 1px solid rgba(96,165,250,0.3); transition: border-color 0.2s; }
        .tos-link:hover { border-color: #60a5fa; }
      `}</style>

      {/* Navbar */}
      <nav className="tos-navbar">
        <Link to="/" className="tos-back-btn">
          <ArrowLeft size={14} />
          Back to Home
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={16} style={{ color: '#60a5fa' }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>Terms of Service</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/cookies" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>Cookies</Link>
          <Link to="/gdpr" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>GDPR</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '64px 5% 48px',
        background: 'linear-gradient(180deg, rgba(96,165,250,0.03) 0%, transparent 100%)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', marginBottom: 20 }}>
          <FileText size={13} style={{ color: '#60a5fa' }} />
          <span style={{ color: '#60a5fa', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Legal Agreement</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px', background: 'linear-gradient(135deg, #e2e8f0, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Terms of Service
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Please read these terms carefully before using Alice Exam Proctor. By using the Service, you agree to be bound by these terms.
        </p>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>Last updated: March 2026</span>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>•</span>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>Version 1.0</span>
        </div>
      </div>

      {/* Layout */}
      <div className="tos-layout">
        {/* Sidebar */}
        <aside className="tos-sidebar">
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Contents</div>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className={`tos-toc-item ${activeSection === s.id ? 'active' : ''}`}>
              <s.icon size={13} />
              {s.title}
              <ChevronRight size={11} style={{ marginLeft: 'auto', opacity: 0.4 }} />
            </a>
          ))}
        </aside>

        {/* Sections */}
        <main>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="tos-section">
              <div className="tos-section-header">
                <div className="tos-section-icon" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Section {i + 1}</div>
                  <h2 style={{ color: '#e2e8f0', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{s.title}</h2>
                </div>
              </div>
              <div className="tos-content">{s.content}</div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
