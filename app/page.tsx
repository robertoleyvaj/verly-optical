// app/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { useLang } from './components/LanguageContext';
import { supabase } from './supabase';

type Armazon = {
  id: number;
  nombre: string;
  forma: string;
  precio: number;
  color: string;
  imagen_url?: string;
  badge?: string;
};

export default function Home() {
  const { t, lang } = useLang() as any;
  const [esMobil, setEsMobil] = useState(false);
  const [armazones, setArmazones] = useState<Armazon[]>([]);
  const carruselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from('armazones')
        .select('*')
        .eq('activo', true)
        .order('id')
        .limit(8);
      setArmazones(data || []);
    }
    cargar();
  }, []);

  // ── MOBILE ───────────────────────────────────────────────────────────────
  if (esMobil) {
    return (
      <main style={{ fontFamily: 'var(--font-sans)', margin: 0, padding: 0, background: 'var(--cream)', color: 'var(--charcoal)', overflowX: 'hidden' }}>
        <Navbar />

        {/* ── 1. FEATURED FRAMES ── */}
        <section style={{ paddingTop: '80px', paddingBottom: '2rem' }}>
          <div style={{ padding: '0 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '4px' }}>
                {t('Esta semana', 'This week')}
              </p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)', margin: 0, lineHeight: 1.1 }}>
                {t('Armazones destacados', 'Featured frames')}
              </h2>
            </div>
            <Link href="/Tienda" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--warm-gray)', textDecoration: 'none', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              {t('Ver todos →', 'View all →')}
            </Link>
          </div>

          {/* Carrusel */}
          <div
            ref={carruselRef}
            style={{
              display: 'flex',
              gap: '0.75rem',
              overflowX: 'auto',
              paddingLeft: '1.25rem',
              paddingRight: '1.25rem',
              paddingBottom: '0.5rem',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {armazones.map(a => (
              <Link
                key={a.id}
                href={`/armazon/${a.id}`}
                style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0, scrollSnapAlign: 'start' }}
              >
                <div style={{ width: '160px' }}>
                  {/* Imagen */}
                  <div style={{
                    width: '160px',
                    height: '140px',
                    background: a.color ? `${a.color}12` : 'var(--cream-dark)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.6rem',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {a.imagen_url ? (
                      <img src={a.imagen_url} alt={a.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    ) : (
                      <svg width="90" height="48" viewBox="0 0 160 90" fill="none">
                        <rect x="4" y="12" width="64" height="66" rx="14" fill="none" stroke={a.color || 'var(--charcoal)'} strokeWidth="3.5"/>
                        <rect x="92" y="12" width="64" height="66" rx="14" fill="none" stroke={a.color || 'var(--charcoal)'} strokeWidth="3.5"/>
                        <path d="M68 38 C72 32, 88 32, 92 38" stroke={a.color || 'var(--charcoal)'} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                        <line x1="4" y1="36" x2="-6" y2="30" stroke={a.color || 'var(--charcoal)'} strokeWidth="2.5" strokeLinecap="round"/>
                        <line x1="156" y1="36" x2="166" y2="30" stroke={a.color || 'var(--charcoal)'} strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    )}
                    {a.badge && (
                      <div style={{ position: 'absolute', top: '8px', left: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--charcoal)', background: 'var(--cream)', padding: '3px 7px', border: '1px solid var(--border)', borderRadius: '2px' }}>
                        {a.badge}
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 2px' }}>
                    {a.forma}
                  </p>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 4px', lineHeight: 1.2 }}>
                    {a.nombre}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: 500, color: 'var(--charcoal)', margin: 0 }}>
                    ${a.precio} <span style={{ fontWeight: 400, color: 'var(--warm-gray)', fontSize: '0.7rem' }}>USD</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Ver más */}
          <div style={{ padding: '1rem 1.25rem 0' }}>
            <Link href="/Tienda" style={{
              display: 'block',
              textAlign: 'center',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--charcoal)',
              border: '1px solid var(--border)',
              padding: '0.85rem',
              borderRadius: '3px',
              textDecoration: 'none',
            }}>
              {t('Ver más armazones →', 'View more frames →')}
            </Link>
          </div>
        </section>

        {/* ── 2. HERO EDITORIAL ── */}
        <section style={{ margin: '0 1.25rem 2.5rem', borderRadius: '10px', overflow: 'hidden', position: 'relative', height: '340px' }}>
          <img
            src="/hero-mobile.jpg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(28,28,26,0.72) 0%, rgba(28,28,26,0.3) 55%, rgba(28,28,26,0.0) 100%)' }}/>
          {/* Texto */}
          <div style={{ position: 'absolute', bottom: '1.75rem', left: '1.5rem', right: '40%' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 300, color: 'white', lineHeight: 1.15, margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>
              {lang === 'es'
                ? <>Lentes que<br />se adaptan<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>a tu vida.</em></>
                : <>Eyewear that<br />fits<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>your life.</em></>
              }
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 1rem', lineHeight: 1.6 }}>
              {t('Diseños atemporales. Calidad que se siente.', 'Timeless designs. Quality you can feel.')}
            </p>
            <Link href="/Tienda" style={{
              display: 'inline-block',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--charcoal)',
              background: 'white',
              padding: '0.65rem 1.1rem',
              borderRadius: '2px',
              textDecoration: 'none',
            }}>
              {t('Ver armazones', 'Shop frames')}
            </Link>
          </div>
        </section>

        {/* ── 3. COMPRA POR ESTILO ── */}
        <section style={{ padding: '0 1.25rem 2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: 0 }}>
              {t('Compra por estilo', 'Shop by style')}
            </p>
            <Link href="/Tienda" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--warm-gray)', textDecoration: 'none' }}>
              {t('Ver todos →', 'View all →')}
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {[
              { es: 'Rectangulares', en: 'Rectangle', bg: '#E8E4DC', rx: '6' },
              { es: 'Redondos', en: 'Round', bg: '#E4E8E0', rx: '30' },
              { es: 'Ovalados', en: 'Oval', bg: '#E0E4E8', rx: '20' },
              { es: 'Clásicos', en: 'Classic', bg: '#E8E0DC', rx: '10' },
            ].map((c, i) => (
              <Link key={i} href="/Tienda" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: c.bg, borderRadius: '8px', padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="52" height="28" viewBox="0 0 110 55" fill="none">
                    <rect x="2" y="7" width="44" height="38" rx={c.rx} fill="none" stroke="var(--charcoal)" strokeWidth="2.2"/>
                    <rect x="64" y="7" width="44" height="38" rx={c.rx} fill="none" stroke="var(--charcoal)" strokeWidth="2.2"/>
                    <path d="M46 22 C50 18, 60 18, 64 22" stroke="var(--charcoal)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                    <line x1="2" y1="22" x2="-5" y2="18" stroke="var(--charcoal)" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="108" y1="22" x2="115" y2="18" stroke="var(--charcoal)" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500, color: 'var(--charcoal)', textAlign: 'center', letterSpacing: '0.04em' }}>
                    {t(c.es, c.en)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 4. PROMO EDITORIAL ── */}
        <section style={{ margin: '0 1.25rem 2.5rem', background: 'var(--charcoal)', borderRadius: '10px', padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(74,89,64,0.15)' }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'white', lineHeight: 1.15, margin: '0 0 0.4rem' }}>
                  {t('Tu primer par.', 'Your first pair.')}
                </p>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.15 }}>
                  {t('Nuestro mejor precio.', 'Our best price.')}
                </p>
              </div>
              <div style={{ flexShrink: 0, width: '64px', height: '64px', borderRadius: '50%', background: 'var(--sage)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600, color: 'white', lineHeight: 1 }}>10%</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>OFF</span>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
              {t('Usa el código ', 'Use code ')}
              <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', padding: '2px 8px', borderRadius: '2px', fontWeight: 600, letterSpacing: '2px', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.1)' }}>VERLY10</span>
              {t(' en tu primer pedido.', ' on your first order.')}
            </p>
            <Link href="/Tienda" style={{
              display: 'inline-block',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--charcoal)',
              background: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '2px',
              textDecoration: 'none',
            }}>
              {t('Ver armazones', 'Shop frames')}
            </Link>
          </div>
        </section>

        {/* ── 5. CÓMO FUNCIONA ── */}
        <section style={{ padding: '0 1.25rem 2.5rem' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {t('Así de fácil', 'This easy')}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M20.188 10.934c.2.4.312.846.312 1.311V12a8.5 8.5 0 1 1-8.5-8.5h.244"/>
                  </svg>
                ),
                es: 'Elige tu armazón', en: 'Choose a frame',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                ),
                es: 'Sube tu receta', en: 'Upload your Rx',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                  </svg>
                ),
                es: 'Recíbelos en casa', en: 'Delivered home',
              },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '90px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.icon}
                  </div>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--charcoal)', textAlign: 'center', lineHeight: 1.4, fontWeight: 400 }}>
                    {t(s.es, s.en)}
                  </span>
                </div>
                {i < 2 && (
                  <div style={{ width: '20px', height: '1px', background: 'var(--border)', margin: '0 0 1.5rem', flexShrink: 0 }}/>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. BENEFICIOS ── */}
        <section style={{ margin: '0 1.25rem 3rem', background: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
                es: 'Garantía 90 días', en: '90-Day Warranty',
                sub_es: 'En todos los pedidos', sub_en: 'On all orders',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                ),
                es: 'Envío rápido', en: 'Fast Shipping',
                sub_es: '3–5 días hábiles', sub_en: '3–5 business days',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-5.49"/>
                  </svg>
                ),
                es: 'Devoluciones fáciles', en: 'Easy Returns',
                sub_es: 'Sin complicaciones', sub_en: 'Hassle-free',
              },
            ].map((b, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '6px',
                padding: '0.5rem',
                borderRight: i < 2 ? '1px solid var(--border)' : 'none',
              }}>
                {b.icon}
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500, color: 'var(--charcoal)', lineHeight: 1.3 }}>
                  {t(b.es, b.en)}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.58rem', color: 'var(--warm-gray)', lineHeight: 1.3 }}>
                  {t(b.sub_es, b.sub_en)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER MOBILE ── */}
        <footer style={{ background: 'var(--charcoal)', padding: '2.5rem 1.25rem 2rem' }}>
          <img src="/logo-trasparente.png" alt="Verly Optical" style={{ height: '28px', width: 'auto', marginBottom: '1rem', opacity: 0.8 }}/>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {t('Lentes accesibles para toda la familia.', 'Affordable eyewear for everyone.')}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
            {[
              { href: '/Tienda', label: 'Eyeglasses' },
              { href: '/sunglasses', label: 'Sunglasses' },
              { href: '#faq', label: 'FAQ' },
            ].map((l, i) => (
              <a key={i} href={l.href} style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
                {l.label}
              </a>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgba(255,255,255,0.15)', margin: 0 }}>
            © 2026 Verly Optical
          </p>
        </footer>

        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
      </main>
    );
  }

  // ── DESKTOP ───────────────────────────────────────────────────────────────
  return (
    <main style={{ fontFamily: 'var(--font-sans)', margin: 0, padding: 0, background: 'var(--cream)', color: 'var(--charcoal)' }}>
      <Navbar />

      {/* ── HERO DESKTOP ── */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <img src="/hero-man.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(247,244,239,0.97) 0%, rgba(247,244,239,0.85) 35%, rgba(247,244,239,0.0) 62%)' }}/>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1180px', margin: '0 auto', padding: '6rem 2rem 0' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '1rem' }}>
            {t('Estilo atemporal. Confianza diaria.', 'Timeless style. Everyday confidence.')}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3.2rem, 5vw, 4.4rem)', fontWeight: 400, lineHeight: 1.08, letterSpacing: '-0.02em', color: 'var(--charcoal)', marginBottom: '1rem', maxWidth: '560px' }}>
            {lang === 'es'
              ? <>Lentes de calidad<br />que se adaptan<br /><em style={{ fontStyle: 'italic', color: '#3d6b35' }}>a tu vida.</em></>
              : <>Quality eyewear<br />that fits<br /><em style={{ fontStyle: 'italic', color: '#3d6b35' }}>your life.</em></>
            }
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--warm-gray)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '380px', fontWeight: 400 }}>
            {t('Diseños clásicos. Micas premium. Precios justos. Hechos para la vida real.', 'Classic designs. Premium lenses. Fair prices. Made for real life.')}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '3rem' }}>
            <Link href="/Tienda" style={{ background: 'var(--sage)', color: 'white', padding: '14px 32px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, textDecoration: 'none', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'inline-block' }}>
              {t('Ver armazones', 'Shop Eyeglasses')}
            </Link>
            <Link href="/sunglasses" style={{ background: 'white', color: 'var(--charcoal)', padding: '13px 28px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid var(--border)', display: 'inline-block' }}>
              {t('Lentes de sol', 'Shop Sunglasses')}
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', paddingTop: '2rem', borderTop: '1px solid rgba(28,28,26,0.1)', maxWidth: '520px' }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, es: 'Garantía 90 días', en: '90-Day Warranty', sub_es: 'En todos los pedidos', sub_en: 'On all orders' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, es: 'Envío rápido', en: 'Fast Shipping', sub_es: '3 a 5 días hábiles', sub_en: '3–5 business days' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-5.49"/></svg>, es: 'Devolución 30 días', en: '30-Day Returns', sub_es: 'Sin complicaciones', sub_en: 'Hassle-free' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ marginTop: '1px', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', lineHeight: 1.3 }}>{t(item.es, item.en)}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--warm-gray)', marginTop: '1px' }}>{t(item.sub_es, item.sub_en)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY STYLE DESKTOP ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>
            {t('Compra por estilo', 'Shop by style')}
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--warm-gray)' }}>
            {t('Formas atemporales. Estilo sin esfuerzo.', 'Timeless shapes. Effortless style.')}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          {[
            { es: 'Rectangular', en: 'Rectangle', href: '/Tienda', rx: '6', solar: false },
            { es: 'Redondo', en: 'Round', href: '/Tienda', rx: '30', solar: false },
            { es: 'Ovalado', en: 'Oval', href: '/Tienda', rx: '20', solar: false },
            { es: 'Clásico', en: 'Classic', href: '/Tienda', rx: '10', solar: false },
            { es: 'Solar', en: 'Sunglasses', href: '/sunglasses', rx: '14', solar: true },
          ].map((c, i) => (
            <Link key={i} href={c.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--sage)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
              >
                <div style={{ height: '130px', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <svg width="100" height="50" viewBox="0 0 110 55" fill="none">
                    <rect x="2" y="7" width="44" height="38" rx={c.rx} fill={c.solar ? '#1A1A2E' : 'white'} fillOpacity={c.solar ? 0.15 : 1} stroke="var(--charcoal)" strokeWidth="1.8"/>
                    <rect x="64" y="7" width="44" height="38" rx={c.rx} fill={c.solar ? '#1A1A2E' : 'white'} fillOpacity={c.solar ? 0.15 : 1} stroke="var(--charcoal)" strokeWidth="1.8"/>
                    <path d="M46 22 C50 18, 60 18, 64 22" stroke="var(--charcoal)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                    <line x1="2" y1="22" x2="-5" y2="18" stroke="var(--charcoal)" strokeWidth="1.6" strokeLinecap="round"/>
                    <line x1="108" y1="22" x2="115" y2="18" stroke="var(--charcoal)" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{ padding: '0.9rem 1rem 1rem' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '3px' }}>{t(c.es, c.en)}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--sage)' }}>{t('Ver ahora →', 'Shop now →')}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CÓMO FUNCIONA DESKTOP ── */}
      <section id="como-funciona" style={{ background: 'white', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '0.6rem' }}>{t('El proceso', 'The process')}</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: 'var(--charcoal)' }}>{t('Simple como debe ser', 'Simple as it should be')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {[
              { num: '01', es: 'Elige tu armazón', en: 'Choose your frame', desc_es: 'Estilos para todos los gustos.', desc_en: 'Styles for every taste.' },
              { num: '02', es: 'Ingresa tu receta', en: 'Enter your prescription', desc_es: 'Manual o foto, en un minuto.', desc_en: 'Manual or photo, in one minute.' },
              { num: '03', es: 'Personaliza tus micas', en: 'Customize your lenses', desc_es: 'Material, filtros, tipo de visión.', desc_en: 'Material, filters, vision type.' },
              { num: '04', es: 'Recíbelos en casa', en: 'Delivered to your door', desc_es: 'Rápido, seguro y sin complicaciones.', desc_en: 'Fast, secure and hassle-free.' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '1.75rem 1.25rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--cream)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '34px', fontWeight: 300, color: 'var(--cream-dark)', marginBottom: '1rem', lineHeight: 1, WebkitTextStroke: '1px var(--sage-light)' }}>{s.num}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, marginBottom: '5px', color: 'var(--charcoal)' }}>{t(s.es, s.en)}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--warm-gray)', lineHeight: 1.6 }}>{t(s.desc_es, s.desc_en)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER PROMO DESKTOP ── */}
      <section style={{ background: 'var(--charcoal)', padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 70% at 50% 50%, rgba(74,89,64,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, letterSpacing: '-0.02em', color: 'white', marginBottom: '1rem', lineHeight: 1.1 }}>
            {t('Tu primer par.', 'Your first pair.')}<br/>
            <em style={{ color: 'var(--cream-dark)', fontStyle: 'italic' }}>{t('Nuestro mejor precio.', 'Our best price.')}</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem', fontSize: '14px', lineHeight: 1.7 }}>
            {t('Usa el código ', 'Use code ')}
            <span style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', padding: '2px 10px', borderRadius: '3px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.12)' }}>VERLY10</span>
            {t(' y obtén 10% de descuento en tu primer pedido.', ' and get 10% off your first order.')}
          </p>
          <Link href="/Tienda" style={{ background: 'white', color: 'var(--charcoal)', padding: '13px 36px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase', display: 'inline-block' }}>
            {t('Ver armazones', 'Shop frames')}
          </Link>
        </div>
      </section>

      {/* ── FAQ DESKTOP ── */}
      <section id="faq" style={{ padding: '7rem 2rem', maxWidth: '660px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '0.6rem' }}>FAQ</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: 'var(--charcoal)' }}>{t('Preguntas frecuentes', 'Frequently Asked Questions')}</h2>
        </div>
        {[
          { q_es: '¿Necesito aseguranza médica?', q_en: 'Do I need health insurance?', a_es: 'No. Vendemos directamente al cliente, sin necesidad de seguro médico.', a_en: 'No. We sell directly to you, no insurance needed.' },
          { q_es: '¿Cuánto tarda la entrega?', q_en: 'How long does delivery take?', a_es: 'Envío express en 3 a 5 días hábiles.', a_en: 'Express delivery in 3 to 5 business days.' },
          { q_es: '¿Cómo ingreso mi graduación?', q_en: 'How do I enter my prescription?', a_es: 'Puedes escribir los números o subir una foto de tu receta.', a_en: 'You can enter the numbers manually or upload a photo.' },
          { q_es: '¿Puedo devolver mis lentes?', q_en: 'Can I return my glasses?', a_es: 'Sí, tienes 30 días para hacer una devolución sin complicaciones.', a_en: 'Yes, you have 30 days for a hassle-free return.' },
          { q_es: '¿Qué métodos de pago aceptan?', q_en: 'What payment methods do you accept?', a_es: 'Aceptamos todas las tarjetas de crédito y débito.', a_en: 'We accept all major credit and debit cards.' },
        ].map((f, i) => (
          <details key={i} style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '0.5rem', overflow: 'hidden' }}>
            <summary style={{ padding: '1.1rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {t(f.q_es, f.q_en)}
              <span style={{ color: 'var(--sage)', fontSize: '18px', fontWeight: 300, flexShrink: 0, marginLeft: '1rem' }}>+</span>
            </summary>
            <div style={{ padding: '0 1.5rem 1.1rem', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--warm-gray)', lineHeight: 1.75 }}>
              {t(f.a_es, f.a_en)}
            </div>
          </details>
        ))}
      </section>

      {/* ── FOOTER DESKTOP ── */}
      <footer style={{ background: 'var(--charcoal)', color: 'rgba(255,255,255,0.35)', padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto 3rem' }}>
          <div>
            <img src="/logo-trasparente.png" alt="Verly Optical" style={{ height: '32px', width: 'auto', marginBottom: '1rem', opacity: 0.85 }}/>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.8, maxWidth: '200px', color: 'rgba(255,255,255,0.35)' }}>
              {t('Lentes accesibles para toda la familia.', 'Affordable eyewear for everyone.')}
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>{t('Tienda', 'Shop')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ href: '/Tienda', label: 'Eyeglasses' }, { href: '/sunglasses', label: 'Sunglasses' }].map((l, i) => (
                <a key={i} href={l.href} style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >{l.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>{t('Ayuda', 'Help')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="#faq" style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >FAQ</a>
              <a href="mailto:customerservice@verlyoptical.com" style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >{t('Contáctanos', 'Contact us')}</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '12px', maxWidth: '1100px', margin: '0 auto', color: 'rgba(255,255,255,0.2)' }}>
          © 2026 Verly Optical
        </div>
      </footer>
    </main>
  );
}