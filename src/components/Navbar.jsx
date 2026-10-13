import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  SlidersHorizontal,
  Mail,
  User,
  Sparkles,
  Database
} from 'lucide-react';

export default function Navbar({ 
  profile, 
  theme, 
  toggleTheme, 
  onOpenAdmin, 
  isAdminUnlocked,
  dbStatus
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Me', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Data Analytics', href: '#analytics' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navLinks.map(link => link.href.substring(1));
      const scrollPos = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: isScrolled ? 'var(--bg-glass)' : 'var(--bg-primary)',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${isScrolled ? 'var(--border-color)' : 'transparent'}`,
        transition: 'all 0.25s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
        >
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)'
            }}
          >
            <BarChart2 size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {profile.name || 'Mubashira PK'}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)', letterSpacing: '0.02em' }}>
              {profile.title || 'Aspiring Data Analyst'}
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav 
          style={{ 
            display: 'none', 
            alignItems: 'center', 
            gap: '0.35rem' 
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-blue-light)' : 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--accent-blue)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Controls: Storage Status, Theme Toggle & Admin Edit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* MongoDB Storage Status Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.74rem',
              fontWeight: 700,
              backgroundColor: dbStatus?.status === 'connected' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
              color: dbStatus?.status === 'connected' ? '#10B981' : 'var(--text-muted)',
              border: `1px solid ${dbStatus?.status === 'connected' ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
            }}
            title={
              dbStatus?.status === 'connected'
                ? `MongoDB Connected: ${dbStatus.uri}`
                : 'MongoDB: Local storage fallback'
            }
          >
            <Database size={13} />
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: dbStatus?.status === 'connected' ? '#10B981' : '#94A3B8',
                boxShadow: dbStatus?.status === 'connected' ? '0 0 6px #10B981' : 'none',
              }}
            />
            <span style={{ display: 'none' }} className="db-status-text">
              {dbStatus?.status === 'connected' ? 'MongoDB' : 'Local'}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-icon"
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
            title={`Toggle Theme (Current: ${theme === 'dark' ? 'Dark Mode' : 'Neat White Mode'})`}
            style={{ width: '38px', height: '38px' }}
          >
            {theme === 'dark' ? (
              <Sun size={18} style={{ color: '#F59E0B' }} />
            ) : (
              <Moon size={18} style={{ color: '#2563EB' }} />
            )}
          </button>

          {/* Admin / Edit Portfolio Trigger */}
          <button
            onClick={onOpenAdmin}
            className="btn btn-secondary btn-sm"
            style={{
              gap: '0.4rem',
              height: '38px',
              padding: '0 0.85rem',
              borderColor: isAdminUnlocked ? 'var(--accent-emerald)' : 'var(--border-color)',
              color: isAdminUnlocked ? 'var(--accent-emerald)' : 'var(--text-secondary)',
            }}
            title="Edit Portfolio content without editing code"
          >
            <SlidersHorizontal size={15} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              {isAdminUnlocked ? 'Editing Mode' : 'Edit Portfolio'}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-icon mobile-menu-btn"
            aria-label="Toggle navigation menu"
            style={{ width: '38px', height: '38px' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 1.5rem 1.5rem',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    padding: '0.65rem 1rem',
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--accent-blue)' : 'var(--text-primary)',
                    backgroundColor: isActive ? 'var(--accent-blue-light)' : 'transparent',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{link.name}</span>
                  {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)' }} />}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Media Query Styles for Desktop/Mobile display */}
      <style>{`
        @media (min-width: 960px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
