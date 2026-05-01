import { Link, useLocation } from 'react-router-dom'
import AliceLogo from './AliceLogo'
import './GlassmorphicNav.css'

const GlassmorphicNav = () => {
  const location = useLocation()

  const navItems = [
    { label: 'Home', href: '/', active: location.pathname === '/' },
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ]

  return (
    <nav className="glassmorphic-nav">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <AliceLogo size={28} />
          <span className="logo-text">
            Alice<sup className="text-xs">®</sup>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`nav-link ${item.active ? 'nav-link-active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <Link to="/auth" className="nav-cta liquid-glass">
          Get Started
        </Link>
      </div>
    </nav>
  )
}

export default GlassmorphicNav