'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useFavoritos } from '../context/FavoritosContext';
import { useLang } from './LanguageContext';

export default function FavoritosDrawer() {
  const { favoritos, toggleFavorito, favoritosOpen, setFavoritosOpen } = useFavoritos();
  const { t } = useLang() as any;

  useEffect(() => {
    document.body.style.overflow = favoritosOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [favoritosOpen]);

  return (
    <>
      {favoritosOpen && (
        <div
          onClick={() => setFavoritosOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200, backdropFilter: 'blur(2px)' }}
        />
      )}

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '420px', maxWidth: '100vw',
        background: 'var(--cream)',
        zIndex: 201,
        boxShadow: '-2px 0 40px rgba(0,0,0,0.08)',
        transform: favoritosOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--cream)',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: 0 }}>
              {t('Guardados', 'Saved')}
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, margin: '3px 0 0', color: 'var(--charcoal)' }}>
              {t('Mis favoritos', 'My favorites')}
              {favoritos.length > 0 && (
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 400, color: 'var(--warm-gray)', marginLeft: '8px' }}>
                  ({favoritos.length})
                </span>
              )}
            </h3>
          </div>
          <button onClick={() => setFavoritosOpen(false)} style={{ background: 'var(--cream-dark)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: 'var(--warm-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Lista */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {favoritos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--warm-gray)', margin: '0 0 0.5rem' }}>
                {t('Aún no tienes favoritos', 'No favorites yet')}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--warm-gray)', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
                {t('Toca el ❤️ en cualquier armazón para guardarlo aquí.', 'Tap the ❤️ on any frame to save it here.')}
              </p>
              <button onClick={() => setFavoritosOpen(false)} style={{ background: 'var(--charcoal)', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 24px', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                {t('Explorar', 'Browse frames')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {favoritos.map(f => (
                <div key={f.id} style={{ display: 'flex', gap: '12px', background: 'white', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  {/* Imagen */}
                  <div style={{ width: '100px', height: '80px', flexShrink: 0, background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {f.imagen_url
                      ? <img src={f.imagen_url} alt={f.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px', boxSizing: 'border-box' }}/>
                      : <svg width="40" height="22" viewBox="0 0 160 90" fill="none" style={{ opacity: 0.2 }}><rect x="4" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/><rect x="92" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/><path d="M68 38 C72 32, 88 32, 92 38" stroke="#1d1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
                    }
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, padding: '0.75rem 0.75rem 0.75rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400, color: 'var(--charcoal)', margin: '0 0 2px' }}>{f.nombre}</p>
                      {f.material && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--warm-gray)', margin: 0, textTransform: 'capitalize' }}>{f.material}</p>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--charcoal)' }}>${f.precio}</span>
                      <Link
                        href={`/armazon/${f.id}`}
                        onClick={() => setFavoritosOpen(false)}
                        style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {t('Ver', 'View')}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                      </Link>
                    </div>
                  </div>
                  {/* Quitar */}
                  <button
                    onClick={() => toggleFavorito(f)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px', color: 'var(--warm-gray)', display: 'flex', alignItems: 'center', fontSize: '16px', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--warm-gray)')}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con CTA si hay favoritos */}
        {favoritos.length > 0 && (
          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', background: 'var(--cream)' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--warm-gray)', margin: '0 0 0.75rem', textAlign: 'center' }}>
              {t('¿Listo para decidirte?', 'Ready to decide?')}
            </p>
            <Link
              href="/Tienda"
              onClick={() => setFavoritosOpen(false)}
              style={{ display: 'block', textAlign: 'center', background: 'var(--sage)', color: 'white', padding: '13px', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              {t('Seguir explorando', 'Keep browsing')}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}