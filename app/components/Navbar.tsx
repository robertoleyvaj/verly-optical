'use client';
import { useLang } from './LanguageContext';

export default function Navbar() {
  const { lang, setLang, t } = useLang();

  return (
    <nav style={{background: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '66px', position: 'sticky', top: 0, zIndex: 100, fontFamily: 'sans-serif'}}>
      
      {/* LOGO */}
      <a href="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px'}}>
        <span style={{fontSize: '20px', fontWeight: 800, color: '#2BBFB3'}}>Verly</span>
        <span style={{fontSize: '10px', fontWeight: 700, color: '#F5C518', letterSpacing: '2px'}}>OPTICAL</span>
      </a>

      {/* LINKS */}
      <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
        <a href="/" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500, fontSize: '14px'}}>
          {t('Inicio', 'Home')}
        </a>
        <a href="/Tienda" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500, fontSize: '14px'}}>
          {t('Tienda', 'Store')}
        </a>
        <a href="/receta" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500, fontSize: '14px'}}>
          {t('Mi Receta', 'My Prescription')}
        </a>
        <a href="#faq" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500, fontSize: '14px'}}>
          FAQ
        </a>
      </div>

      {/* LANG TOGGLE */}
      <div style={{display: 'flex', background: '#E0F7F4', borderRadius: '20px', padding: '4px'}}>
        <button
          onClick={() => setLang('es')}
          style={{
            padding: '5px 14px', borderRadius: '16px', border: 'none',
            background: lang === 'es' ? '#2BBFB3' : 'transparent',
            color: lang === 'es' ? 'white' : '#2BBFB3',
            fontWeight: 700, fontSize: '12px', cursor: 'pointer',
            fontFamily: 'sans-serif', transition: 'all 0.2s'
          }}
        >ES</button>
        <button
          onClick={() => setLang('en')}
          style={{
            padding: '5px 14px', borderRadius: '16px', border: 'none',
            background: lang === 'en' ? '#2BBFB3' : 'transparent',
            color: lang === 'en' ? 'white' : '#2BBFB3',
            fontWeight: 700, fontSize: '12px', cursor: 'pointer',
            fontFamily: 'sans-serif', transition: 'all 0.2s'
          }}
        >EN</button>
      </div>

    </nav>
  );
}