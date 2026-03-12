import React, { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Instagram, Mail, Shield, Eye, Brain, Clock, Award, Users, BookOpen, FileText, HelpCircle, Send } from 'lucide-react';
import FloatingShape from './FloatingShape';

const PremiumFooterEnhanced = ({ darkMode = false }) => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  const features = [
    { icon: Shield, label: 'Secure Proctoring', description: 'End-to-end encrypted monitoring' },
    { icon: Eye, label: 'Real-time Detection', description: 'AI-powered violation tracking' },
    { icon: Brain, label: 'Smart AI', description: 'Advanced behavior analysis' },
    { icon: Clock, label: '24/7 Support', description: 'Always here to help' },
    { icon: Award, label: 'Certified', description: 'Industry-standard compliance' },
    { icon: Users, label: 'Multi-user', description: 'Unlimited concurrent exams' },
  ];

  const quickLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
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
    { 
      icon: Github, 
      label: 'GitHub', 
      href: 'https://github.com/adii0018',
      color: 'hover:text-purple-400',
      glowColor: 'hover:shadow-purple-500/30'
    },
    { 
      icon: Linkedin, 
      label: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/aditya-singh-rajput-720aa8326',
      color: 'hover:text-blue-400',
      glowColor: 'hover:shadow-blue-500/30'
    },
    { 
      icon: Instagram, 
      label: 'Instagram', 
      href: 'https://www.instagram.com/http._.adiix?igsh=MXVscHpwMWtxZGZpNg==',
      color: 'hover:text-pink-400',
      glowColor: 'hover:shadow-pink-500/30'
    },
    { 
      icon: Mail, 
      label: 'Email', 
      href: 'mailto:singhrajputaditya982@gmail.com',
      color: 'hover:text-indigo-400',
      glowColor: 'hover:shadow-indigo-500/30'
    },
  ];

  return (
    <footer 
      ref={footerRef}
      className={`relative overflow-hidden transition-all duration-300 border-t ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${
        darkMode 
          ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-black border-white/5' 
          : 'bg-gradient-to-b from-gray-50 via-white to-gray-100 border-gray-200'
      }`}
    >
      {/* Floating 3D Shapes */}
      <FloatingShape size="lg" position="left" delay={0} duration={25} />
      <FloatingShape size="md" position="right" delay={2} duration={20} />
      <FloatingShape size="sm" position="center" delay={4} duration={18} />

      {/* Gradient Mesh Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      <div className={`relative max-w-7xl mx-auto px-6 py-16 lg:py-20 transition-all duration-1000 delay-200
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        
        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.label}
              className={`group relative p-4 rounded-xl backdrop-blur-sm border transition-all duration-500 
                hover:scale-105 hover:-translate-y-2 hover:shadow-2xl ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                    : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className={`w-8 h-8 mx-auto mb-3 transition-all duration-300 group-hover:scale-110 ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <h4 className={`text-sm font-semibold mb-1 ${
                darkMode ? 'text-slate-200' : 'text-gray-800'
              }`}>
                {feature.label}
              </h4>
              <p className={`text-xs ${
                darkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-indigo-500/0 
                group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-indigo-500/20 
                transition-all duration-500 blur-xl -z-10" />
            </div>
          ))}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-slate-200' : 'text-gray-800'
            }`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-sm transition-all duration-300 hover:translate-x-2 inline-block ${
                      darkMode 
                        ? 'text-slate-400 hover:text-purple-400' 
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-slate-200' : 'text-gray-800'
            }`}>
              Resources
            </h4>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.label}>
                  <a
                    href={resource.href}
                    className={`text-sm transition-all duration-300 hover:translate-x-2 inline-flex items-center gap-2 ${
                      darkMode 
                        ? 'text-slate-400 hover:text-purple-400' 
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <resource.icon className="w-4 h-4" />
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-slate-200' : 'text-gray-800'
            }`}>
              Legal
            </h4>
            <ul className="space-y-2">
              {legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-sm transition-all duration-300 hover:translate-x-2 inline-block ${
                      darkMode 
                        ? 'text-slate-400 hover:text-purple-400' 
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-slate-200' : 'text-gray-800'
            }`}>
              Stay Updated
            </h4>
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Get the latest updates and news
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 text-slate-200 placeholder-slate-500' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                  }`}
                  disabled={subscribed}
                />
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 
                  flex items-center justify-center gap-2 ${
                    subscribed
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : darkMode
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                  }`}
              >
                {subscribed ? (
                  <>✓ Subscribed!</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center text-center space-y-8 border-t pt-12" style={{
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)'
        }}>
          
          {/* Product Branding with 3D Effect */}
          <div className="space-y-3 perspective-1000">
            <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 
              bg-clip-text text-transparent transform-3d hover:scale-105 transition-transform duration-500
              relative group">
              Alice Exam Proctor
              <span className="absolute -inset-4 bg-gradient-to-r from-blue-500/0 via-purple-500/20 to-indigo-500/0 
                blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </h3>
            <p className={`text-sm lg:text-base font-light tracking-wide transition-colors duration-300 ${
              darkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              AI-Powered Fair Online Examinations
            </p>
          </div>

          {/* Decorative Line with Glow */}
          <div className="relative w-32 h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent blur-sm" />
          </div>

          {/* Social Media Icons with 3D Lift */}
          <div className="flex items-center gap-4 lg:gap-6 perspective-1000">
            {socialLinks.map((social, index) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 
                  hover:scale-110 hover:-translate-y-2 hover:shadow-2xl ${social.glowColor} ${social.color}
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 
                  transform-gpu preserve-3d ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 focus:ring-offset-slate-900' 
                      : 'bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 focus:ring-offset-white'
                  }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  transitionDelay: `${index * 50}ms`
                }}
                aria-label={social.label}
              >
                <social.icon className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300 
                  group-hover:scale-110 transform-gpu ${
                    darkMode ? 'text-slate-300' : 'text-gray-600'
                  }`} />
                
                {/* Tooltip with 3D Effect */}
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800/90 backdrop-blur-sm
                  text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300
                  pointer-events-none whitespace-nowrap border border-white/10 shadow-xl
                  group-hover:-translate-y-1 transform-gpu">
                  {social.label}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 
                    border-r border-b border-white/10" />
                </span>

                {/* Animated Glow Ring */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-indigo-500/0 
                  group-hover:from-blue-500/30 group-hover:via-purple-500/30 group-hover:to-indigo-500/30 
                  transition-all duration-500 blur-xl -z-10 group-hover:scale-150" />
              </a>
            ))}
          </div>

          {/* Decorative Line with Glow */}
          <div className="relative w-32 h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent blur-sm" />
          </div>

          {/* Personal Branding with Subtle Glow */}
          <div className="space-y-2">
            <p className={`text-sm font-light transition-colors duration-300 ${
              darkMode ? 'text-slate-500' : 'text-gray-500'
            }`}>
              Designed & Developed by
            </p>
            <div className="relative inline-block group">
              <p className={`text-lg lg:text-xl font-semibold relative z-10 transition-all duration-300 group-hover:scale-105 ${
                darkMode 
                  ? 'bg-gradient-to-r from-slate-200 via-purple-200 to-slate-200 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-gray-700 via-purple-600 to-gray-700 bg-clip-text text-transparent'
              }`}>
                Aditya Singh Rajput
              </p>
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 -inset-x-8 blur-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-purple-500/0 
                opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
              {/* Subtle Underline */}
              <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent 
                scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          </div>

          {/* Copyright with Fade */}
          <div className={`pt-8 border-t w-full transition-colors duration-300 ${
            darkMode ? 'border-white/5' : 'border-gray-200'
          }`}>
            <p className={`text-xs lg:text-sm font-light transition-colors duration-300 ${
              darkMode ? 'text-slate-600' : 'text-gray-500'
            }`}>
              © {new Date().getFullYear()} Alice Exam Proctor. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm" />
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent blur-2xl" />
    </footer>
  );
};

export default PremiumFooterEnhanced;
