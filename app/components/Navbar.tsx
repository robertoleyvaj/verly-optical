'use client';
import { useState, useEffect } from 'react';
import { useLang } from './LanguageContext';

export default function Navbar() {
  const { t, lang, setLang } = useLang() as any;
  const [menuOpen, setMenuOpen] = useState(false);
  const [esMobil, setEsMobil] = useState(false);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const links = [
    { href: '/', label: t('Inicio', 'Home') },
    { href: '/Tienda', label: t('Tienda', 'Store') },
    { href: '/FAQ', label: 'FAQ' },
  ];

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'white', borderBottom: '1px solid #EAECF0',
        fontFamily: 'var(--font-jakarta), sans-serif',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: '0 1.25rem', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <a href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <img src="/logo-trasparente.png.png" alt="Verly Optical" style={{ height: '40px', width: 'auto' }}/>
          </a>

          {!esMobil && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {links.map(l => (
                <a key={l.href} href={l.href} style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A2E', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#2BBFB3')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#1A1A2E')}
                >
                  {l.label}
                </a>
              ))}
              <div style={{ display: 'flex', background: '#F0FBF8', borderRadius: '20px', padding: '3px' }}>
                {(['es', 'en'] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{
                    padding: '4px 12px', borderRadius: '16px', border: 'none',
                    background: lang === l ? '#2BBFB3' : 'transparent',
                    color: lang === l ? 'white' : '#5A6478',
                    fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'var(--font-jakarta), sans-serif',
                    transition: 'all 0.15s', textTransform: 'uppercase',
                  }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {esMobil && (
            <button onClick={() => setMenuOpen(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px', borderRadius: '8px',
              display: 'flex', flexDirection: 'column', gap: '5px',
            }} aria-label="Abrir menú">
              <span style={{ display: 'block', width: '22px', height: '2px', background: '#1A1A2E', borderRadius: '2px' }}/>
              <span style={{ display: 'block', width: '22px', height: '2px', background: '#1A1A2E', borderRadius: '2px' }}/>
              <span style={{ display: 'block', width: '16px', height: '2px', background: '#1A1A2E', borderRadius: '2px' }}/>
            </button>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 200, backdropFilter: 'blur(2px)',
        }}/>
      )}

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '280px', maxWidth: '85vw',
        background: 'white', zIndex: 201,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-jakarta), sans-serif',
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #EAECF0',
        }}>
          <img src="/logo-trasparente.png.png" alt="Verly Optical" style={{ height: '36px', width: 'auto' }}/>
          <button onClick={() => setMenuOpen(false)} style={{
            background: '#F5F5F3', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', cursor: 'pointer',
            fontSize: '18px', color: '#5A6478',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        <div style={{ flex: 1, padding: '1rem 0' }}>
          {links.map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.5rem', textDecoration: 'none',
              color: '#1A1A2E', fontSize: '16px', fontWeight: 600,
              borderBottom: i < links.length - 1 ? '1px solid #F5F5F3' : 'none',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F0FBF8')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {l.label}
              <span style={{ color: '#2BBFB3', fontSize: '18px' }}>›</span>
            </a>
          ))}
        </div>

        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #EAECF0' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#7A8494', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            {t('Idioma', 'Language')}
          </p>
          <div style={{ display: 'flex', background: '#F0FBF8', borderRadius: '20px', padding: '3px', width: 'fit-content' }}>
            {(['es', 'en'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '6px 20px', borderRadius: '16px', border: 'none',
                background: lang === l ? '#2BBFB3' : 'transparent',
                color: lang === l ? 'white' : '#5A6478',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-jakarta), sans-serif',
                transition: 'all 0.15s', textTransform: 'uppercase',
              }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}