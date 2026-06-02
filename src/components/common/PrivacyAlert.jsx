import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyAlert() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('alice_cookie_consent');
    if (!consent) {
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('alice_cookie_consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('alice_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      background: 'rgba(22, 27, 34, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid #30363d',
      padding: '16px 24px',
      borderRadius: 12,
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      maxWidth: 'calc(100% - 48px)',
      width: 'max-content',
      animation: 'slide-up-cookie 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <style>{`
        @keyframes slide-up-cookie {
          from { transform: translate(-50%, 100px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        @media (max-width: 768px) {
          .privacy-alert-inner {
            flex-direction: column;
            align-items: flex-start !important;
            text-align: left;
            gap: 12px !important;
          }
          .privacy-btn-group {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>

      <div className="privacy-alert-inner" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ 
            width: 38, height: 38, borderRadius: '50%', 
            background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3fb950', flexShrink: 0 
          }}>
            <Shield size={18} />
          </div>
          
          <div>
            <div style={{ color: '#e6edf3', fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>We value your privacy</div>
            <div style={{ color: '#8b949e', fontSize: '0.8rem', maxWidth: 450, lineHeight: 1.5 }}>
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
            </div>
          </div>
        </div>

        <div className="privacy-btn-group" style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={handleDecline}
            style={{ 
              background: 'transparent', border: '1px solid #30363d', color: '#e6edf3',
              padding: '8px 16px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.2s', whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#21262d'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            style={{ 
              background: '#2ea043', border: '1px solid rgba(240,246,252,0.1)', color: '#fff',
              padding: '8px 16px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.2s', whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#3fb950'}
            onMouseOut={(e) => e.currentTarget.style.background = '#2ea043'}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
