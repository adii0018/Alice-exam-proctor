import { useState } from 'react';
import ModernLightBackground from '../components/common/ModernLightBackground';
import { Check, Zap, Shield, TrendingUp } from 'lucide-react';

/**
 * Demo page to showcase the Modern Light Background
 * with test cards to verify readability and design
 */
export default function BackgroundDemo() {
  const [showCards, setShowCards] = useState(true);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Modern Light Background */}
      <ModernLightBackground />

      {/* Content Layer */}
      <div style={{ position: 'relative', zIndex: 1, padding: '60px 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: '#1f2328',
            marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
          }}>
            Modern SaaS Background
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#57606a',
            maxWidth: 600,
            margin: '0 auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
          }}>
            Premium light-mode background with floating blobs, ambient glows, and subtle grain texture
          </p>
          <button
            onClick={() => setShowCards(!showCards)}
            style={{
              marginTop: 24,
              padding: '12px 24px',
              backgroundColor: '#2da44e',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#2c974b';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(45,164,78,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#2da44e';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {showCards ? 'Hide Test Cards' : 'Show Test Cards'}
          </button>
        </div>

        {/* Test Cards Grid */}
        {showCards && (
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {/* Card 1 */}
            <TestCard
              icon={<Zap style={{ width: 24, height: 24, color: '#2da44e' }} />}
              title="Lightning Fast"
              description="Optimized performance with smooth animations and minimal resource usage"
            />

            {/* Card 2 */}
            <TestCard
              icon={<Shield style={{ width: 24, height: 24, color: '#2da44e' }} />}
              title="Secure & Reliable"
              description="Built with modern security practices and enterprise-grade reliability"
            />

            {/* Card 3 */}
            <TestCard
              icon={<TrendingUp style={{ width: 24, height: 24, color: '#2da44e' }} />}
              title="Scalable Design"
              description="Grows with your needs from startup to enterprise scale"
            />

            {/* Card 4 */}
            <TestCard
              icon={<Check style={{ width: 24, height: 24, color: '#2da44e' }} />}
              title="Premium Quality"
              description="Crafted with attention to detail and modern design principles"
            />
          </div>
        )}

        {/* Feature Showcase */}
        <div style={{
          maxWidth: 800,
          margin: '80px auto 0',
          padding: 40,
          backgroundColor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: 14,
          border: '0.8px solid #d0e8e0',
          boxShadow: '0 8px 32px rgba(31,35,40,0.08)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#1f2328',
            marginBottom: 20,
          }}>
            Background Features
          </h2>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <FeatureItem text="Soft radial gradient from #eef6f2 to #f6f8fa" />
            <FeatureItem text="6 floating blobs with extreme blur (40-60px)" />
            <FeatureItem text="3 ambient glow layers for aurora-like warmth" />
            <FeatureItem text="16 glow dots with subtle halos (star replacements)" />
            <FeatureItem text="Subtle grain texture overlay (5% opacity)" />
            <FeatureItem text="Smooth floating animations for organic feel" />
            <FeatureItem text="Premium color palette: mint, teal, sky blue, aqua" />
          </ul>
        </div>

        {/* Color Palette */}
        <div style={{
          maxWidth: 800,
          margin: '40px auto 0',
          padding: 40,
          backgroundColor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: 14,
          border: '0.8px solid #d0e8e0',
          boxShadow: '0 8px 32px rgba(31,35,40,0.08)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#1f2328',
            marginBottom: 20,
          }}>
            Color Palette
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <ColorSwatch color="#c3e6d8" name="Soft Mint" />
            <ColorSwatch color="#b8d8f0" name="Sky Blue" />
            <ColorSwatch color="#a8d4c8" name="Teal" />
            <ColorSwatch color="#c0e0f4" name="Light Aqua" />
            <ColorSwatch color="#d4ede4" name="Pale Seafoam" />
            <ColorSwatch color="#9fd4c0" name="Mint Dot" />
            <ColorSwatch color="#8ec8e8" name="Blue Dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Test Card Component
function TestCard({ icon, title, description }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: 14,
        border: '0.8px solid #d0e8e0',
        padding: 28,
        transition: 'all 0.2s',
        cursor: 'default',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(31,35,40,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: 'rgba(45,164,78,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#1f2328',
        marginBottom: 8,
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '0.95rem',
        color: '#57606a',
        lineHeight: 1.6,
      }}>
        {description}
      </p>
    </div>
  );
}

// Feature Item Component
function FeatureItem({ text }) {
  return (
    <li style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: '0.95rem',
      color: '#57606a',
    }}>
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: '#2da44e',
        flexShrink: 0,
      }} />
      {text}
    </li>
  );
}

// Color Swatch Component
function ColorSwatch({ color, name }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: color,
        border: '1px solid #d0d7de',
        boxShadow: '0 2px 8px rgba(31,35,40,0.08)',
      }} />
      <div>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#1f2328',
        }}>
          {name}
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: '#57606a',
          fontFamily: 'monospace',
        }}>
          {color}
        </div>
      </div>
    </div>
  );
}
