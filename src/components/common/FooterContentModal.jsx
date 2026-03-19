import { useEffect } from 'react';
import { X } from 'lucide-react';

const content = {
  features: {
    title: 'Features',
    body: (
      <div>
        <p>Alice Exam Proctor comes packed with cutting-edge capabilities designed to maintain academic integrity at scale.</p>
        <ul>
          <li><strong>AI Face Detection</strong> — Real-time multi-face detection flags unauthorized persons instantly.</li>
          <li><strong>Gaze Tracking</strong> — Monitors eye movement to detect off-screen attention.</li>
          <li><strong>Tab Switch Detection</strong> — Logs every attempt to leave the exam window.</li>
          <li><strong>Live Violation Feed</strong> — Teachers see violations as they happen, with severity levels.</li>
          <li><strong>Alice AI Assistant</strong> — Built-in AI chat for student support during exams.</li>
          <li><strong>WebSocket Proctoring</strong> — Low-latency real-time communication between student and proctor.</li>
          <li><strong>Role-based Access</strong> — Separate dashboards for students, teachers, and admins.</li>
          <li><strong>Quiz Creator</strong> — Teachers can build, schedule, and manage exams with a unique join code.</li>
          <li><strong>Detailed Reports</strong> — Post-exam analytics with violation timelines and scores.</li>
        </ul>
      </div>
    ),
  },
  howItWorks: {
    title: 'How it Works',
    body: (
      <div>
        <p>Alice uses a multi-layered approach to ensure exam integrity without being intrusive.</p>
        <ol>
          <li><strong>Student joins</strong> using a unique exam code provided by the teacher.</li>
          <li><strong>Camera access</strong> is requested — Alice's AI begins monitoring via TensorFlow.js models running entirely in the browser.</li>
          <li><strong>Behavioral signals</strong> like gaze direction, face count, and tab switches are analyzed in real time.</li>
          <li><strong>Violations are logged</strong> with timestamps and severity, streamed live to the teacher dashboard via WebSocket.</li>
          <li><strong>On submission</strong>, a full report is generated including score, violation timeline, and risk assessment.</li>
          <li><strong>Teachers review</strong> flagged sessions and can take action from the violations management panel.</li>
        </ol>
      </div>
    ),
  },
  pricing: {
    title: 'Pricing',
    body: (
      <div>
        <p>Alice Exam Proctor is currently in open beta — free for everyone.</p>
        <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
          {[
            { plan: 'Free', price: '$0', features: ['Up to 30 students per exam', 'Basic violation detection', 'Email support', 'Community access'] },
            { plan: 'Pro', price: '$19/mo', features: ['Unlimited students', 'Advanced AI proctoring', 'Priority support', 'Detailed analytics', 'Custom branding'] },
            { plan: 'Enterprise', price: 'Custom', features: ['On-premise deployment', 'SLA guarantee', 'Dedicated support', 'API access', 'SSO integration'] },
          ].map(({ plan, price, features }) => (
            <div key={plan} style={{ padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>{plan}</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>{price}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {features.map(f => <li key={f} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', marginBottom: 4 }}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  changelog: {
    title: 'Changelog',
    body: (
      <div>
        {[
          { version: 'v1.3.0', date: 'March 2026', changes: ['Added Alice AI Chat assistant', 'Improved gaze detection accuracy by 40%', 'New admin super dashboard with live activity feed'] },
          { version: 'v1.2.0', date: 'February 2026', changes: ['WebSocket-based live proctoring', 'Multi-face detection with face count logging', 'Teacher live monitor cards'] },
          { version: 'v1.1.0', date: 'January 2026', changes: ['Quiz creator with question bank', 'Student performance summary', 'Violation timeline in results'] },
          { version: 'v1.0.0', date: 'December 2025', changes: ['Initial release', 'Basic face detection', 'Role-based auth with JWT', 'MongoDB + Django backend'] },
        ].map(({ version, date, changes }) => (
          <div key={version} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
              <span style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', padding: '2px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>{version}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>{date}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {changes.map(c => <li key={c} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', marginBottom: 4 }}>{c}</li>)}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  docs: {
    title: 'Documentation',
    body: (
      <div>
        <p>Get up and running with Alice Exam Proctor quickly.</p>
        <h4>Quick Start</h4>
        <pre style={{ background: 'rgba(0,0,0,0.4)', padding: 14, borderRadius: 8, fontSize: '0.8rem', overflowX: 'auto' }}>{`# Clone the repo
git clone https://github.com/adii0018/alice-exam-proctor

# Install frontend deps
npm install

# Setup backend
cd django_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver`}</pre>
        <h4>Environment Variables</h4>
        <p>Copy <code>.env.example</code> to <code>.env</code> and fill in your MongoDB URI, Redis URL, and secret key.</p>
        <h4>Roles</h4>
        <ul>
          <li><strong>Student</strong> — joins exams via code, monitored during session</li>
          <li><strong>Teacher</strong> — creates quizzes, monitors live sessions, reviews violations</li>
          <li><strong>Admin</strong> — full system access, user management, audit logs</li>
        </ul>
      </div>
    ),
  },
  api: {
    title: 'API Reference',
    body: (
      <div>
        <p>All endpoints are prefixed with <code>/api/</code>. Authentication uses Bearer JWT tokens.</p>
        {[
          { group: 'Auth', endpoints: [['POST', '/api/auth/register/', 'Register new user'], ['POST', '/api/auth/login/', 'Login and get token'], ['GET', '/api/auth/me/', 'Get current user']] },
          { group: 'Quiz', endpoints: [['GET', '/api/quiz/', 'List quizzes'], ['POST', '/api/quiz/', 'Create quiz'], ['GET', '/api/quiz/:id/', 'Get quiz by ID'], ['DELETE', '/api/quiz/:id/', 'Delete quiz']] },
          { group: 'Violations', endpoints: [['GET', '/api/violations/', 'List violations'], ['POST', '/api/violations/', 'Log violation']] },
          { group: 'Flags', endpoints: [['GET', '/api/flags/', 'List flags'], ['PATCH', '/api/flags/:id/', 'Update flag status']] },
        ].map(({ group, endpoints }) => (
          <div key={group} style={{ marginBottom: 20 }}>
            <div style={{ color: '#34d399', fontWeight: 600, marginBottom: 8, fontSize: '0.85rem', letterSpacing: '0.05em' }}>{group}</div>
            {endpoints.map(([method, path, desc]) => (
              <div key={path} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.82rem' }}>
                <span style={{ minWidth: 52, padding: '2px 8px', borderRadius: 4, background: method === 'GET' ? 'rgba(96,165,250,0.1)' : method === 'POST' ? 'rgba(52,211,153,0.1)' : method === 'DELETE' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)', color: method === 'GET' ? '#60a5fa' : method === 'POST' ? '#34d399' : method === 'DELETE' ? '#f87171' : '#fbbf24', fontWeight: 600, textAlign: 'center', fontSize: '0.72rem' }}>{method}</span>
                <code style={{ color: 'rgba(255,255,255,0.7)', flex: 1 }}>{path}</code>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>{desc}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  help: {
    title: 'Help Center',
    body: (
      <div>
        {[
          { q: 'Camera not working?', a: 'Make sure you\'ve granted camera permissions in your browser. Check site settings and reload the page.' },
          { q: 'Exam code not found?', a: 'Double-check the code with your teacher. Codes are case-insensitive but must be exactly 6 characters.' },
          { q: 'Getting flagged incorrectly?', a: 'Ensure good lighting and sit directly in front of the camera. Avoid having other people visible in the frame.' },
          { q: 'WebSocket disconnected?', a: 'This usually means a network issue. Refresh the page — your progress is saved automatically.' },
          { q: 'Forgot password?', a: 'Contact your teacher or admin to reset your account. Self-service password reset is coming in v1.4.' },
          { q: 'How do I contact support?', a: 'Email us at singhrajputaditya982@gmail.com or use the contact form on the landing page.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ marginBottom: 18, padding: '14px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#fff', fontWeight: 500, marginBottom: 6, fontSize: '0.88rem' }}>{q}</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.83rem', lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>
    ),
  },
  community: {
    title: 'Community',
    body: (
      <div>
        <p>Join the Alice community — share feedback, report bugs, and connect with other educators using the platform.</p>
        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {[
            { name: 'GitHub Discussions', desc: 'Ask questions, share ideas, and contribute to the project.', link: 'https://github.com/adii0018', cta: 'Open GitHub' },
            { name: 'LinkedIn', desc: 'Follow updates and connect with the developer.', link: 'https://www.linkedin.com/in/aditya-singh-rajput-720aa8326', cta: 'Connect' },
            { name: 'Email', desc: 'Direct line for feedback, partnerships, or bug reports.', link: 'mailto:singhrajputaditya982@gmail.com', cta: 'Send Email' },
          ].map(({ name, desc, link, cta }) => (
            <div key={name} style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, marginBottom: 4, fontSize: '0.88rem' }}>{name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{desc}</div>
              </div>
              <a href={link} target="_blank" rel="noopener noreferrer" style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>{cta}</a>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    body: (
      <div style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)' }}>
        <p><em>Last updated: March 2026</em></p>
        <h4>Data We Collect</h4>
        <p>We collect your name, email, and role during registration. During exams, we process webcam frames locally in your browser — no raw video is stored or transmitted to our servers.</p>
        <h4>How We Use Your Data</h4>
        <p>Your data is used solely to operate the proctoring service: authenticating users, logging violations, and generating exam reports. We do not sell or share your data with third parties.</p>
        <h4>Data Storage</h4>
        <p>User data is stored in MongoDB Atlas with encryption at rest. Violation logs are retained for 90 days after exam completion.</p>
        <h4>Your Rights</h4>
        <p>You may request deletion of your account and associated data at any time by contacting singhrajputaditya982@gmail.com.</p>
        <h4>Cookies</h4>
        <p>We use only essential cookies for session management. No tracking or advertising cookies are used.</p>
        <h4>Contact</h4>
        <p>For privacy concerns: singhrajputaditya982@gmail.com</p>
      </div>
    ),
  },
  terms: {
    title: 'Terms of Service',
    body: (
      <div style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)' }}>
        <p><em>Last updated: March 2026</em></p>
        <h4>Acceptance</h4>
        <p>By using Alice Exam Proctor, you agree to these terms. If you do not agree, do not use the service.</p>
        <h4>Permitted Use</h4>
        <p>Alice is intended for legitimate academic proctoring. You may not use it to harass, surveil, or collect data on individuals outside of an exam context.</p>
        <h4>Account Responsibility</h4>
        <p>You are responsible for maintaining the security of your account credentials. Report any unauthorized access immediately.</p>
        <h4>Exam Integrity</h4>
        <p>Students agree not to attempt to circumvent proctoring measures. Teachers agree to use violation data fairly and in accordance with their institution's policies.</p>
        <h4>Limitation of Liability</h4>
        <p>Alice Exam Proctor is provided "as is". We are not liable for exam outcomes, technical failures, or decisions made based on proctoring data.</p>
        <h4>Changes</h4>
        <p>We may update these terms. Continued use after changes constitutes acceptance.</p>
      </div>
    ),
  },
  cookies: {
    title: 'Cookie Policy',
    body: (
      <div style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)' }}>
        <p><em>Last updated: March 2026</em></p>
        <h4>What Are Cookies</h4>
        <p>Cookies are small text files stored in your browser to help websites remember information about your visit.</p>
        <h4>Cookies We Use</h4>
        <div style={{ marginTop: 8 }}>
          {[
            { name: 'Session Token', purpose: 'Keeps you logged in during your session', duration: 'Session' },
            { name: 'Theme Preference', purpose: 'Remembers your light/dark mode choice', duration: '1 year' },
          ].map(({ name, purpose, duration }) => (
            <div key={name} style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
              <div style={{ color: '#fff', fontWeight: 500 }}>{name}</div>
              <div>{purpose} — <em>{duration}</em></div>
            </div>
          ))}
        </div>
        <h4>Third-Party Cookies</h4>
        <p>We do not use any third-party tracking or advertising cookies.</p>
        <h4>Managing Cookies</h4>
        <p>You can clear cookies at any time through your browser settings. Disabling session cookies will require you to log in each visit.</p>
      </div>
    ),
  },
  gdpr: {
    title: 'GDPR',
    body: (
      <div style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)' }}>
        <p><em>Last updated: March 2026</em></p>
        <p>Alice Exam Proctor is committed to compliance with the General Data Protection Regulation (GDPR) for users in the European Economic Area.</p>
        <h4>Legal Basis for Processing</h4>
        <p>We process your data based on contractual necessity (to provide the proctoring service) and legitimate interest (exam integrity).</p>
        <h4>Your GDPR Rights</h4>
        <ul>
          <li><strong>Right of Access</strong> — Request a copy of your personal data</li>
          <li><strong>Right to Rectification</strong> — Correct inaccurate data</li>
          <li><strong>Right to Erasure</strong> — Request deletion of your data</li>
          <li><strong>Right to Portability</strong> — Receive your data in a portable format</li>
          <li><strong>Right to Object</strong> — Object to processing in certain circumstances</li>
        </ul>
        <h4>Data Transfers</h4>
        <p>Data may be stored on servers outside the EEA (MongoDB Atlas). Appropriate safeguards are in place per GDPR Article 46.</p>
        <h4>Contact Our DPO</h4>
        <p>For GDPR requests: singhrajputaditya982@gmail.com — we respond within 30 days.</p>
      </div>
    ),
  },
};

const FooterContentModal = ({ contentKey, onClose }) => {
  const item = content[contentKey];

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!item) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        .fcm-body h4 { color: rgba(255,255,255,0.8); margin: 18px 0 8px; font-size: 0.9rem; }
        .fcm-body p, .fcm-body li { color: rgba(255,255,255,0.45); font-size: 0.85rem; line-height: 1.75; }
        .fcm-body ul, .fcm-body ol { padding-left: 20px; }
        .fcm-body li { margin-bottom: 6px; }
        .fcm-body code { background: rgba(255,255,255,0.08); padding: 1px 6px; border-radius: 4px; font-size: 0.82rem; color: #34d399; }
        .fcm-body pre { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 14px; font-size: 0.78rem; overflow-x: auto; color: rgba(255,255,255,0.6); }
        .fcm-body strong { color: rgba(255,255,255,0.75); }
        .fcm-scroll::-webkit-scrollbar { width: 4px; }
        .fcm-scroll::-webkit-scrollbar-track { background: transparent; }
        .fcm-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d1117',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 18,
          width: '100%',
          maxWidth: 620,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.25s ease',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.05rem', fontWeight: 600 }}>{item.title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <X size={15} />
          </button>
        </div>
        {/* Body */}
        <div className="fcm-body fcm-scroll" style={{ padding: '20px 24px', overflowY: 'auto' }}>
          {item.body}
        </div>
      </div>
    </div>
  );
};

export default FooterContentModal;
