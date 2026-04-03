import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import UserAvatar from '../components/common/UserAvatar';
import { AVATAR_STYLES } from '../utils/avatarGenerator';

/**
 * Avatar Showcase Page
 * Demonstrates different DiceBear avatar styles
 */
const AvatarShowcase = () => {
  const { darkMode } = useTheme();
  const [selectedStyle, setSelectedStyle] = useState(AVATAR_STYLES.INITIALS);
  const [username, setUsername] = useState('john.doe');

  const demoUsers = [
    { username: 'alice.wonder', name: 'Alice Wonder', email: 'alice@example.com' },
    { username: 'bob.builder', name: 'Bob Builder', email: 'bob@example.com' },
    { username: 'charlie.brown', name: 'Charlie Brown', email: 'charlie@example.com' },
    { username: 'diana.prince', name: 'Diana Prince', email: 'diana@example.com' },
    { username: 'eve.adams', name: 'Eve Adams', email: 'eve@example.com' },
    { username: 'frank.castle', name: 'Frank Castle', email: 'frank@example.com' },
  ];

  const styles = [
    { key: AVATAR_STYLES.INITIALS, name: 'Initials', desc: 'Simple text-based avatars' },
    { key: AVATAR_STYLES.LORELEI, name: 'Lorelei', desc: 'Illustrated female characters' },
    { key: AVATAR_STYLES.AVATAAARS, name: 'Avataaars', desc: 'Cartoon-style avatars' },
    { key: AVATAR_STYLES.BOTTTS, name: 'Bottts', desc: 'Robot avatars' },
    { key: AVATAR_STYLES.PIXEL_ART, name: 'Pixel Art', desc: 'Retro 8-bit style' },
    { key: AVATAR_STYLES.ADVENTURER, name: 'Adventurer', desc: 'Adventure characters' },
    { key: AVATAR_STYLES.BIG_SMILE, name: 'Big Smile', desc: 'Happy face avatars' },
    { key: AVATAR_STYLES.THUMBS, name: 'Thumbs', desc: 'Thumbs up style' },
    { key: AVATAR_STYLES.NOTIONISTS, name: 'Notionists', desc: 'Notion-style avatars' },
    { key: AVATAR_STYLES.PERSONAS, name: 'Personas', desc: 'Professional personas' },
  ];

  const gh = {
    bg: darkMode ? '#0d1117' : '#ffffff',
    cardBg: darkMode ? '#161b22' : '#f6f8fa',
    border: darkMode ? '#30363d' : '#d0d7de',
    text: darkMode ? '#e6edf3' : '#24292f',
    subText: darkMode ? '#8b949e' : '#57606a',
    hover: darkMode ? '#21262d' : '#f3f4f6',
    active: darkMode ? '#238636' : '#2da44e',
    activeBg: darkMode ? 'rgba(35,134,54,0.15)' : 'rgba(45,164,78,0.15)',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: gh.bg, padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: gh.text, marginBottom: 12 }}>
            🎨 Avatar Showcase
          </h1>
          <p style={{ fontSize: 16, color: gh.subText, maxWidth: 600, margin: '0 auto' }}>
            Powered by DiceBear API - Unique avatars generated from usernames
          </p>
        </div>

        {/* Username Input */}
        <div style={{ 
          backgroundColor: gh.cardBg, 
          border: `1px solid ${gh.border}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 32
        }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: gh.text, marginBottom: 8 }}>
            Try with your username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: darkMode ? '#0d1117' : '#ffffff',
              border: `1px solid ${gh.border}`,
              borderRadius: 8,
              color: gh.text,
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>

        {/* Style Selector */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: gh.text, marginBottom: 16 }}>
            Select Avatar Style
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12
          }}>
            {styles.map((style) => (
              <button
                key={style.key}
                onClick={() => setSelectedStyle(style.key)}
                style={{
                  padding: 16,
                  backgroundColor: selectedStyle === style.key ? gh.activeBg : gh.cardBg,
                  border: `2px solid ${selectedStyle === style.key ? gh.active : gh.border}`,
                  borderRadius: 12,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedStyle !== style.key) {
                    e.currentTarget.style.backgroundColor = gh.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedStyle !== style.key) {
                    e.currentTarget.style.backgroundColor = gh.cardBg;
                  }
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14, color: gh.text, marginBottom: 4 }}>
                  {style.name}
                </div>
                <div style={{ fontSize: 12, color: gh.subText }}>
                  {style.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current User Preview */}
        <div style={{
          backgroundColor: gh.cardBg,
          border: `1px solid ${gh.border}`,
          borderRadius: 12,
          padding: 32,
          marginBottom: 32,
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: gh.text, marginBottom: 24 }}>
            Your Avatar Preview
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {[64, 96, 128].map((size) => (
              <div key={size} style={{ textAlign: 'center' }}>
                <UserAvatar
                  user={{ username }}
                  size={size}
                  style={selectedStyle}
                  showBorder={true}
                  borderColor={gh.border}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: gh.subText }}>
                  {size}px
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Users Grid */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: gh.text, marginBottom: 16 }}>
            Demo Users
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16
          }}>
            {demoUsers.map((user) => (
              <div
                key={user.username}
                style={{
                  backgroundColor: gh.cardBg,
                  border: `1px solid ${gh.border}`,
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <UserAvatar
                  user={user}
                  size={56}
                  style={selectedStyle}
                  showBorder={true}
                  borderColor={gh.border}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: gh.text, marginBottom: 2 }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: 12, color: gh.subText }}>
                    @{user.username}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div style={{
          marginTop: 48,
          padding: 24,
          backgroundColor: darkMode ? 'rgba(56,139,253,0.1)' : 'rgba(13,110,253,0.1)',
          border: `1px solid ${darkMode ? '#388bfd' : '#0d6efd'}`,
          borderRadius: 12,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: gh.text, marginBottom: 12 }}>
            💡 How it works
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: gh.subText, fontSize: 14, lineHeight: 1.8 }}>
            <li>Avatars are generated using the DiceBear API</li>
            <li>Each username generates a unique, consistent avatar</li>
            <li>No images are stored - generated on-the-fly via URL</li>
            <li>Fallback to initials if image fails to load</li>
            <li>Multiple styles available for different use cases</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvatarShowcase;
