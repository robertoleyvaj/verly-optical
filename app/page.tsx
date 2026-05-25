// app/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'none' }) {
  const { ref, visible } = useScrollReveal();
  const transforms: Record<string, string> = { up: 'translateY(32px)', left: 'translateX(-32px)', right: 'translateX(32px)', none: 'none' };
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : transforms[direction], transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function QuizModal({ onClose, t, lang }: { onClose: () => void; t: any; lang: string }) {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [tipo, setTipo] = useState('');

  const handleTipo = (val: string) => { setTipo(val); setPaso(2); };
  const handleGenero = (val: string) => { router.push(`/Tienda?tipo=${tipo}&genero=${val}`); onClose(); };

  const paso1Cards = [
    { val: 'optico', img: '/quiz-optico.jpg', title: t('Prescription glasses', 'Prescription glasses'), desc: t('Para tu visión diaria', 'For your daily vision'), icon: (<svg width="28" height="16" viewBox="0 0 110 55" fill="none"><rect x="2" y="7" width="44" height="38" rx="8" fill="none" stroke="white" strokeWidth="3"/><rect x="64" y="7" width="44" height="38" rx="8" fill="none" stroke="white" strokeWidth="3"/><path d="M46 22 C50 18, 60 18, 64 22" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/><line x1="2" y1="22" x2="-5" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="108" y1="22" x2="115" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>) },
    { val: 'solar', img: '/quiz-solar.jpg', title: t('Sunglasses', 'Sunglasses'), desc: t('Protección y estilo', 'Protection and style'), icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>) },
  ];

  const paso2Cards = [
    { val: 'hombre', img: tipo === 'solar' ? '/quiz-hombre-solar.jpg' : '/quiz-hombre.jpg', title: t('Hombre', 'Men'), desc: t('Clásicos, cómodos y resistentes', 'Classic, comfortable and durable') },
    { val: 'mujer', img: tipo === 'solar' ? '/quiz-mujer-solar.jpg' : '/quiz-mujer.jpg', title: t('Mujer', 'Women'), desc: t('Modernos, ligeros y versátiles', 'Modern, lightweight and versatile') },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(28,28,26,0.75)', zIndex: 1000, backdropFilter: 'blur(6px)' }}/>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1001, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', width: '100%', maxWidth: '700px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img src="/logo-trasparente.png" alt="Verly" style={{ height: '28px', opacity: 0.9, filter: 'brightness(0) invert(1)' }}/>
          </div>
          <button onClick={onClose} style={{ position: 'absolute', top: 0, right: 0, width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', backdropFilter: 'blur(4px)' }}>×</button>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>
            {paso === 1 ? t('Paso 1 de 2', 'Step 1 of 2') : t('Paso 2 de 2', 'Step 2 of 2')}
          </p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, color: 'white', margin: '0 0 0.5rem', lineHeight: 1.1 }}>
            {paso === 1 ? t('¿Qué buscas?', 'What are you looking for?') : t('¿Para quién?', 'Who is it for?')}
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            {paso === 1 ? t('Elige el tipo de lentes', 'Choose the type of lenses') : t('Personaliza tu experiencia', 'Personalize your experience')}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', maxWidth: '700px' }}>
          {(paso === 1 ? paso1Cards : paso2Cards).map(card => (
            <button key={card.val} onClick={() => paso === 1 ? handleTipo(card.val) : handleGenero(card.val)}
              style={{ position: 'relative', height: 'clamp(240px, 35vh, 380px)', borderRadius: '16px', overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0, background: 'transparent' }}>
              <img src={(card as any).img} alt={(card as any).title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: paso === 1 ? 'center bottom' : '50% 20%' }}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)' }}/>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem', textAlign: 'left' }}>
                {paso === 1 && (card as any).icon && <div style={{ marginBottom: '0.75rem', opacity: 0.9 }}>{(card as any).icon}</div>}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, color: 'white', margin: '0 0 0.4rem', lineHeight: 1.1 }}>{(card as any).title}</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 1.25rem', lineHeight: 1.5 }}>{(card as any).desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'white' }}>{t('EXPLORAR', 'EXPLORE')}</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.4)', maxWidth: '40px' }}/>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
        {paso === 2 && (
          <button onClick={() => setPaso(1)} style={{ marginTop: '1.25rem', background: 'none', border: 'none', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline' }}>
            ← {t('Volver', 'Back')}
          </button>
        )}
      </div>
    </>
  );
}

export default function Home() {
  const { t, lang } = useLang() as any;
  const [esMobil, setEsMobil] = useState(false);
  const [armazones, setArmazones] = useState<Armazon[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const carruselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('armazones').select('*').eq('activo', true).order('id').limit(8);
      setArmazones(data || []);
    }
    cargar();
  }, []);

  if (esMobil) {
    return (
      <main style={{ fontFamily: 'var(--font-sans)', margin: 0, padding: 0, background: 'var(--cream)', color: 'var(--charcoal)', overflowX: 'hidden' }}>
        <Navbar />
        {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} t={t} lang={lang} />}

        <section style={{ paddingTop: '80px', paddingBottom: '2rem' }}>
          <div style={{ padding: '0 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '4px' }}>{t('Esta semana', 'This week')}</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)', margin: 0, lineHeight: 1.1 }}>{t('Armazones destacados', 'Featured frames')}</h2>
            </div>
            <Link href="/Tienda" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--warm-gray)', textDecoration: 'none', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{t('Ver todos →', 'View all →')}</Link>
          </div>
          <div ref={carruselRef} style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingBottom: '0.5rem', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {armazones.map(a => (
              <Link key={a.id} href={`/armazon/${a.id}`} style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0, scrollSnapAlign: 'start' }}>
                <div style={{ width: '160px' }}>
                  <div style={{ width: '160px', height: '140px', background: a.color ? `${a.color}12` : 'var(--cream-dark)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.6rem', overflow: 'hidden', position: 'relative' }}>
                    {a.imagen_url ? <img src={a.imagen_url} alt={a.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : (
                      <svg width="90" height="48" viewBox="0 0 160 90" fill="none">
                        <rect x="4" y="12" width="64" height="66" rx="14" fill="none" stroke={a.color || 'var(--charcoal)'} strokeWidth="3.5"/>
                        <rect x="92" y="12" width="64" height="66" rx="14" fill="none" stroke={a.color || 'var(--charcoal)'} strokeWidth="3.5"/>
                        <path d="M68 38 C72 32, 88 32, 92 38" stroke={a.color || 'var(--charcoal)'} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                      </svg>
                    )}
                    {a.badge && <div style={{ position: 'absolute', top: '8px', left: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--charcoal)', background: 'var(--cream)', padding: '3px 7px', border: '1px solid var(--border)', borderRadius: '2px' }}>{a.badge}</div>}
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 2px' }}>{a.forma}</p>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 4px', lineHeight: 1.2 }}>{a.nombre}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: 500, color: 'var(--charcoal)', margin: 0 }}>${a.precio} <span style={{ fontWeight: 400, color: 'var(--warm-gray)', fontSize: '0.7rem' }}>USD</span></p>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ padding: '1rem 1.25rem 0' }}>
            <Link href="/Tienda" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--charcoal)', border: '1px solid var(--border)', padding: '0.85rem', borderRadius: '3px', textDecoration: 'none' }}>{t('Ver más armazones →', 'View more frames →')}</Link>
          </div>
        </section>

        <section style={{ margin: '0 1.25rem 2.5rem', borderRadius: '10px', overflow: 'hidden', position: 'relative', height: '340px' }}>
          <img src="/hero-mobile.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(28,28,26,0.72) 0%, rgba(28,28,26,0.3) 55%, rgba(28,28,26,0.0) 100%)' }}/>
          <div style={{ position: 'absolute', bottom: '1.75rem', left: '1.5rem', right: '40%' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 300, color: 'white', lineHeight: 1.15, margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>
              {lang === 'es' ? <>Lentes que<br />se adaptan<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>a tu vida.</em></> : <>Eyewear that<br />fits<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>your life.</em></>}
            </h1>
            <button onClick={() => setQuizOpen(true)} style={{ display: 'inline-block', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--charcoal)', background: 'white', padding: '0.65rem 1.1rem', borderRadius: '2px', border: 'none', cursor: 'pointer' }}>
              {t('Encontrar mi par →', 'Find my frames →')}
            </button>
          </div>
        </section>

        <section style={{ margin: '0 1.25rem 2.5rem', background: 'var(--charcoal)', borderRadius: '10px', padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(74,89,64,0.15)' }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'white', lineHeight: 1.15, margin: '0 0 0.4rem' }}>{t('Tu primer par.', 'Your first pair.')}</p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', margin: '0 0 1rem', lineHeight: 1.15 }}>{t('Nuestro mejor precio.', 'Our best price.')}</p>
            <button onClick={() => setQuizOpen(true)} style={{ display: 'inline-block', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--charcoal)', background: 'white', padding: '0.75rem 1.5rem', borderRadius: '2px', border: 'none', cursor: 'pointer' }}>
              {t('Encontrar mi par →', 'Find my frames →')}
            </button>
          </div>
        </section>

        <footer style={{ background: 'var(--charcoal)', padding: '2.5rem 1.25rem 2rem' }}>
          <img src="/logo-trasparente.png" alt="Verly Optical" style={{ height: '28px', width: 'auto', marginBottom: '1rem', opacity: 0.8 }}/>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{t('Lentes accesibles para toda la familia.', 'Affordable eyewear for everyone.')}</p>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
            {[{ href: '/Tienda', label: 'Eyeglasses' }, { href: '/sunglasses', label: 'Sunglasses' }, { href: '#faq', label: 'FAQ' }].map((l, i) => (
              <a key={i} href={l.href} style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>{l.label}</a>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgba(255,255,255,0.15)', margin: 0 }}>© 2026 Verly Optical</p>
        </footer>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      </main>
    );
  }

  return (
    <main style={{ fontFamily: 'var(--font-sans)', margin: 0, padding: 0, background: 'var(--cream)', color: 'var(--charcoal)', overflowX: 'hidden' }}>
      <Navbar />
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} t={t} lang={lang} />}

      {/* ── 1. HERO ── */}
      <section style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <img src="/hero-man.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.08)' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(247,244,239,0.98) 0%, rgba(247,244,239,0.88) 38%, rgba(247,244,239,0.0) 65%)' }}/>
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1180px', margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '1.25rem' }}>
            {t('Estilo atemporal. Confianza diaria.', 'Timeless style. Everyday confidence.')}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3.5rem, 5.5vw, 5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--charcoal)', marginBottom: '1.25rem', maxWidth: '580px' }}>
            {lang === 'es'
              ? <>Lentes de calidad<br />que se adaptan<br /><em style={{ fontStyle: 'italic', color: 'var(--sage)' }}>a tu vida.</em></>
              : <>Quality eyewear<br />that fits<br /><em style={{ fontStyle: 'italic', color: 'var(--sage)' }}>your life.</em></>
            }
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--warm-gray)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '360px', fontWeight: 400 }}>
            {t('Diseños clásicos. Micas premium. Precios justos.', 'Classic designs. Premium lenses. Fair prices.')}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={() => setQuizOpen(true)} style={{ background: 'var(--sage)', color: 'white', padding: '15px 36px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '1.2px', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
              {t('Encontrar mi par →', 'Find my frames →')}
            </button>
            <Link href="/Tienda" style={{ background: 'rgba(255,255,255,0.8)', color: 'var(--charcoal)', padding: '14px 28px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid var(--border)', display: 'inline-block', backdropFilter: 'blur(8px)' }}>
              {t('Ver todo', 'Browse all')}
            </Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.4 }}>
          <div style={{ width: '1px', height: '48px', background: 'var(--charcoal)' }}/>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="var(--charcoal)" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </div>
      </section>

      {/* ── 2. PROMO BANNER ── */}
      <Reveal>
        <section style={{ position: 'relative', width: '100%', height: '500px', overflow: 'hidden' }}>
          <img src="/promo-banner.jpg" alt="Verly Promo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(237,232,223,0.92) 0%, rgba(237,232,223,0.6) 35%, rgba(237,232,223,0.0) 60%)' }}/>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 5rem' }}>
            <div style={{ maxWidth: '440px' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '1rem' }}>
                {t('Oferta de lanzamiento', 'Limited time offer')}
              </p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', fontWeight: 400, color: 'var(--charcoal)', margin: '0 0 0.5rem', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
                {t('Lentes de sol', 'Sunglasses')}
              </h2>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--sage)', margin: '0 0 1.25rem', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
                {t('de regalo.', 'on us.')}
              </h2>
              <div style={{ width: '40px', height: '1px', background: 'var(--sage)', marginBottom: '1.25rem', opacity: 0.6 }}/>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--warm-gray)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '320px' }}>
                {t('Con cualquier compra de lentes graduados. Un par premium de lentes de sol, gratis.', 'With any prescription glasses purchase. A premium pair of sunglasses, yours free.')}
              </p>
              <Link href="/Tienda?tipo=optico" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--charcoal)', color: 'white', padding: '13px 28px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
                {t('Ver lentes graduados', 'Shop prescription glasses')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── 3. HOW IT WORKS ── */}
      <Reveal>
        <section style={{ background: 'var(--cream)', padding: '8rem 2rem', overflow: 'hidden' }}>
          <style>{`
            .how-editorial-wrap { max-width: 1180px; margin: 0 auto; }
            .how-editorial-header { text-align: center; margin-bottom: 5.5rem; }
            .how-eyebrow { font-family: var(--font-sans); font-size: 10px; font-weight: 600; letter-spacing: .26em; text-transform: uppercase; color: var(--warm-gray); margin-bottom: 1.2rem; }
            .how-title { font-family: var(--font-serif); font-size: clamp(3rem, 5vw, 5.2rem); font-weight: 400; line-height: .95; letter-spacing: -.045em; color: var(--charcoal); margin: 0 0 1.5rem; }
            .how-subline { display: flex; justify-content: center; align-items: center; gap: 1rem; }
            .how-subline span { width: 52px; height: 1px; background: var(--warm-gray); opacity: .35; }
            .how-subline p { font-family: var(--font-sans); font-size: 13px; color: var(--warm-gray); margin: 0; }
            .how-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; }
            .how-card { position: relative; background: var(--cream-dark); border: 1px solid rgba(80,70,58,.07); border-radius: 18px; overflow: hidden; box-shadow: 0 24px 70px rgba(56,43,30,.06); }
            .how-card:nth-child(2), .how-card:nth-child(4) { transform: translateY(2.2rem); }
            .how-image { position: relative; height: 255px; overflow: hidden; }
            .how-image img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; transition: transform .9s ease; }
            .how-card:hover .how-image img { transform: scale(1.035); }
            .how-content { position: relative; padding: 2.1rem 2rem 2.2rem; }
            .how-number-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
            .how-number { font-family: var(--font-serif); font-size: clamp(4.2rem, 7vw, 6.5rem); font-weight: 300; line-height: .75; letter-spacing: -.06em; color: var(--sage); opacity: 0.7; }
            .how-line { flex: 1; height: 1px; background: var(--warm-gray); opacity: .35; margin-top: .8rem; }
            .how-step-title { font-family: var(--font-serif); font-size: clamp(1.6rem, 2.2vw, 2rem); font-weight: 400; line-height: 1.05; letter-spacing: -.025em; color: var(--charcoal); margin: 0 0 .8rem; }
            .how-step-text { font-family: var(--font-sans); font-size: 13px; line-height: 1.75; color: var(--warm-gray); max-width: 360px; margin: 0; }
            @media (max-width: 900px) {
              .how-grid { grid-template-columns: 1fr; gap: 2rem; }
              .how-card:nth-child(2), .how-card:nth-child(4) { transform: none; }
              .how-image { height: 220px; }
              .how-content { padding: 1.8rem 1.5rem 2rem; }
            }
          `}</style>
          <div className="how-editorial-wrap">
            <Reveal>
              <div className="how-editorial-header">
                <p className="how-eyebrow">{t('Cómo funciona', 'How it works')}</p>
                <h2 className="how-title">
                  {lang === 'es' ? <>Cuatro pasos simples.<br/>Mejor visión.</> : <>Four simple steps.<br/>Better vision.</>}
                </h2>
                <div className="how-subline">
                  <span/><p>{t('De tu receta a tu puerta.', 'From your prescription to your door.')}</p><span/>
                </div>
              </div>
            </Reveal>
            <div className="how-grid">
              {[
                { num: '01', title_es: 'Elige tu armazón', title_en: 'Choose your frame', desc_es: 'Explora nuestra colección y encuentra el estilo perfecto para ti.', desc_en: 'Explore our collection and find the perfect style for you.', img: '/proceso-01.jpg', delay: 0 },
                { num: '02', title_es: 'Sube tu receta', title_en: 'Upload your Rx', desc_es: 'Toma una foto de tu receta o escribe los números manualmente.', desc_en: 'Upload a photo of your prescription or type the numbers manually.', img: '/proceso-02.jpg', delay: 100 },
                { num: '03', title_es: 'Fabricamos tus lentes', title_en: 'We craft your lenses', desc_es: 'Micas hechas con precisión según tu graduación, material y filtros.', desc_en: 'Precision lenses made for your prescription, material and filters.', img: '/proceso-03.jpg', delay: 160 },
                { num: '04', title_es: 'Recíbelos en casa', title_en: 'Delivered to your door', desc_es: 'Envío rápido y seguro. Porque ver bien debería ser sencillo.', desc_en: 'Fast, secure shipping. Because great vision should feel effortless.', img: '/proceso-04.jpg', delay: 220 },
              ].map((step, i) => (
                <Reveal key={i} delay={step.delay} direction="up">
                  <article className="how-card">
                    <div className="how-image">
                      <img src={step.img} alt={lang === 'es' ? step.title_es : step.title_en}/>
                    </div>
                    <div className="how-content">
                      <div className="how-number-row">
                        <span className="how-number">{step.num}</span>
                        <span className="how-line"/>
                      </div>
                      <h3 className="how-step-title">{lang === 'es' ? step.title_es : step.title_en}</h3>
                      <p className="how-step-text">{lang === 'es' ? step.desc_es : step.desc_en}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── 4. BEST SELLERS ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1180px', margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sage)', margin: '0 0 6px' }}>{t('Best sellers', 'Best sellers')}</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: 'var(--charcoal)', margin: 0 }}>{t('Los más populares', 'Most popular')}</h2>
            </div>
            <Link href="/Tienda" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--warm-gray)', textDecoration: 'none', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {t('Ver todos', 'View all')} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {armazones.slice(0, 4).map((a, i) => (
            <Reveal key={a.id} delay={i * 80} direction="up">
              <Link href={`/armazon/${a.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)', transition: 'all 0.35s ease', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.09)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ aspectRatio: '4/3', background: '#f5f2ed', overflow: 'hidden', position: 'relative' }}>
                    {a.imagen_url ? <img src={a.imagen_url} alt={a.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="70" height="38" viewBox="0 0 160 90" fill="none" style={{ opacity: 0.12 }}>
                          <rect x="4" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/>
                          <rect x="92" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/>
                          <path d="M68 38 C72 32, 88 32, 92 38" stroke="#1d1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                        </svg>
                      </div>
                    )}
                    {a.badge && <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '3px', background: '#1d1d1d', color: 'white' }}>{a.badge}</div>}
                  </div>
                  <div style={{ padding: '1rem 1.1rem 1.1rem' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 400, color: '#1d1d1d', marginBottom: '6px' }}>{a.nombre}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1d1d1d' }}>${a.precio}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sage)' }}>{t('Ver →', 'View →')}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 5. FOR HIM / FOR HER ── */}
      <section style={{ padding: '0 2rem 6rem', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {[
            { img: '/hero-hombre.jpg', titulo_es: 'Para él', titulo_en: 'For him', href: '/Tienda?tipo=optico&genero=hombre' },
            { img: '/hero-mujer.jpg', titulo_es: 'Para ella', titulo_en: 'For her', href: '/Tienda?tipo=optico&genero=mujer' },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 150} direction={i === 0 ? 'left' : 'right'}>
              <Link href={c.href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ position: 'relative', height: '420px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget.querySelector('img') as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { (e.currentTarget.querySelector('img') as HTMLImageElement).style.transform = 'scale(1)'; }}
                >
                  <img src={c.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', transition: 'transform 0.7s ease' }}/>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.0) 55%)' }}/>
                  <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 400, color: 'white', lineHeight: 1, marginBottom: '0.6rem' }}>
                      {lang === 'es' ? c.titulo_es : c.titulo_en}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>{t('Explorar', 'Explore')}</span>
                      <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.5)' }}/>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 6. FAQ ── */}
      <section id="faq" style={{ padding: '6rem 2rem', maxWidth: '640px', margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '0.75rem' }}>FAQ</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: 'var(--charcoal)', margin: 0 }}>{t('Preguntas frecuentes', 'Common questions')}</h2>
          </div>
        </Reveal>
        {[
          { q_es: '¿Necesito aseguranza médica?', q_en: 'Do I need health insurance?', a_es: 'No. Vendemos directamente al cliente, sin necesidad de seguro médico.', a_en: 'No. We sell directly to you, no insurance needed.' },
          { q_es: '¿Cuánto tarda la entrega?', q_en: 'How long does delivery take?', a_es: 'Envío express en 3 a 5 días hábiles.', a_en: 'Express delivery in 3 to 5 business days.' },
          { q_es: '¿Cómo ingreso mi graduación?', q_en: 'How do I enter my prescription?', a_es: 'Puedes escribir los números o subir una foto de tu receta.', a_en: 'You can enter the numbers manually or upload a photo.' },
          { q_es: '¿Puedo devolver mis lentes?', q_en: 'Can I return my glasses?', a_es: 'Sí, tienes 30 días para hacer una devolución sin complicaciones.', a_en: 'Yes, you have 30 days for a hassle-free return.' },
          { q_es: '¿Qué métodos de pago aceptan?', q_en: 'What payment methods do you accept?', a_es: 'Aceptamos todas las tarjetas de crédito y débito.', a_en: 'We accept all major credit and debit cards.' },
        ].map((f, i) => (
          <Reveal key={i} delay={i * 60}>
            <details style={{ borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
              <summary style={{ padding: '1.25rem 0', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {t(f.q_es, f.q_en)}
                <span style={{ color: 'var(--sage)', fontSize: '20px', fontWeight: 300, flexShrink: 0, marginLeft: '1rem', lineHeight: 1 }}>+</span>
              </summary>
              <div style={{ padding: '0 0 1.25rem', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--warm-gray)', lineHeight: 1.8 }}>
                {t(f.a_es, f.a_en)}
              </div>
            </details>
          </Reveal>
        ))}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--charcoal)', color: 'rgba(255,255,255,0.35)', padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto 3rem' }}>
          <div>
            <img src="/logo-trasparente.png" alt="Verly Optical" style={{ height: '32px', width: 'auto', marginBottom: '1rem', opacity: 0.85 }}/>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.8, maxWidth: '200px', color: 'rgba(255,255,255,0.35)' }}>{t('Lentes accesibles para toda la familia.', 'Affordable eyewear for everyone.')}</p>
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