// app/sunglasses/page.tsx
'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { supabase } from '../lib/supabase';

type Armazon = {
  id: number; nombre: string; forma: string; genero: string;
  stock: number; badge: string | null; activo: boolean;
  precio: number; color: string; imagen_url?: string; material?: string;
};

function LenteSVG({ color, forma }: { color: string; forma: string }) {
  const rx = forma === 'ovalada' ? '30' : forma === 'rectangular' ? '8' : '14';
  return (
    <svg width="140" height="78" viewBox="0 0 160 90" fill="none">
      <rect x="4" y="12" width="64" height="66" rx={rx} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="3"/>
      <rect x="92" y="12" width="64" height="66" rx={rx} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="3"/>
      <path d="M68 38 C72 32, 88 32, 92 38" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <line x1="4" y1="36" x2="-6" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="156" y1="36" x2="166" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

const CATEGORIAS = [
  { id: 'todos', es: 'Todos', en: 'All' },
  { id: 'hombre', es: 'Hombre', en: 'Men' },
  { id: 'mujer', es: 'Mujer', en: 'Women' },
  { id: 'unisex', es: 'Unisex', en: 'Unisex' },
];

function SunglassesContent() {
  const { t, lang } = useLang() as any;
  const searchParams = useSearchParams();
  const esPromoRegalo = searchParams.get('promo') === 'regalo';

  const [armazones, setArmazones] = useState<Armazon[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [esMobil, setEsMobil] = useState(false);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    supabase
      .from('armazones')
      .select('*')
      .eq('activo', true).eq('publicar_verly', true)
      .eq('tipo', 'solar')
      .order('id')
      .then(({ data }) => { setArmazones(data || []); setLoading(false); });
  }, []);

  const filtrados = filtro === 'todos'
    ? armazones
    : armazones.filter(a => a.genero === filtro || a.genero === 'unisex');

  return (
    <main style={{ fontFamily: 'var(--font-sans)', background: 'var(--cream)', minHeight: '100vh', color: 'var(--charcoal)' }}>
      <Navbar />

      {/* Banner promo regalo */}
      {esPromoRegalo && (
        <div style={{ background: 'var(--charcoal)', padding: '1rem 2rem', textAlign: 'center', marginTop: '72px' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 300, color: 'white', margin: 0 }}>
            🎁 {lang === 'es' ? 'Elige tu par de lentes de sol gratis — el armazón es cortesía de Verly.' : 'Choose your free sunglasses — the frame is on us.'}
          </p>
        </div>
      )}

      {/* HERO */}
      <div style={{ position: 'relative', width: '100%', height: esMobil ? '340px' : '520px', overflow: 'hidden', marginTop: esPromoRegalo ? '0' : '72px' }}>
        <img
          src="/hero-solar.jpg"
          alt="Sunglasses"
          onError={e => { (e.target as HTMLImageElement).src = '/hero-tienda.jpg'; }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(28,28,26,0.75) 0%, rgba(28,28,26,0.35) 55%, transparent 85%)' }}/>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: esMobil ? '2rem 1.75rem' : '0 5rem' }}>
          <div style={{ maxWidth: '480px' }}>
            <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 0.75rem' }}>
              {esPromoRegalo ? '🎁 FREE SUNGLASSES' : 'VERLY OPTICAL — SUNGLASSES'}
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '3rem' : '4.8rem', fontWeight: 300, letterSpacing: '-0.03em', color: 'white', margin: 0, lineHeight: 1.0 }}>
              {esPromoRegalo
                ? (lang === 'es' ? 'Tu par gratis.' : 'Your free pair.')
                : (lang === 'es' ? 'Lentes de sol\ncon carácter.' : 'Sunglasses\nwith character.')}
            </h1>
            <div style={{ width: '32px', height: '1px', background: 'var(--sage-light)', margin: '1.1rem 0' }}/>
            <p style={{ fontSize: esMobil ? '0.82rem' : '0.88rem', color: 'rgba(255,255,255,0.65)', margin: '0 0 2rem', lineHeight: 1.8, maxWidth: '340px' }}>
              {esPromoRegalo
                ? (lang === 'es' ? 'Elige el modelo que más te guste. Sin costo.' : 'Pick the model you like most. On the house.')
                : (lang === 'es' ? 'Protección UV400. Todos graduables. Sin seguro.' : 'UV400 protection. All prescription-ready. No insurance.')}
            </p>
            <button
              onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: 'var(--charcoal)', padding: '12px 26px', borderRadius: '2px', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}
            >
              {esPromoRegalo ? (lang === 'es' ? 'Elegir mi par →' : 'Choose my pair →') : (lang === 'es' ? 'Ver colección' : 'Shop now')}
            </button>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'white', position: 'sticky', top: '0', zIndex: 50 }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: esMobil ? '0 1rem' : '0 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            {CATEGORIAS.map(c => (
              <button
                key={c.id}
                onClick={() => setFiltro(c.id)}
                style={{ fontFamily: 'var(--font-sans)', fontSize: esMobil ? '0.65rem' : '0.7rem', fontWeight: filtro === c.id ? 600 : 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: filtro === c.id ? 'var(--sage)' : 'var(--warm-gray)', background: 'none', border: 'none', borderBottom: filtro === c.id ? '2px solid var(--sage)' : '2px solid transparent', padding: esMobil ? '0.9rem 0.75rem' : '1rem 1.25rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s, border-color 0.2s', marginBottom: '-1px' }}
              >
                {t(c.es, c.en)}
              </button>
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.67rem', letterSpacing: '0.04em', color: 'var(--warm-gray)', whiteSpace: 'nowrap' }}>
            {filtrados.length} {t('estilos', 'styles')}
          </span>
        </div>
      </div>

      {/* GRID */}
      <div id="catalogo" style={{ maxWidth: '1360px', margin: '0 auto', padding: esMobil ? '0 0 4rem' : '0 3rem 5rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', marginTop: '1px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: 'var(--cream)', height: esMobil ? '280px' : '420px', animation: 'shimmer 1.5s infinite' }}/>
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>{t('Sin resultados', 'No results')}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--warm-gray)' }}>{t('Prueba otro filtro', 'Try another filter')}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', marginTop: '1px' }}>
            {filtrados.map(a => (
              <Link
                key={a.id}
                href={esPromoRegalo ? `/armazon/${a.id}?promo=regalo` : `/armazon/${a.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  onMouseEnter={() => setHoveredId(a.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ background: hoveredId === a.id ? 'var(--cream-dark)' : 'var(--cream)', cursor: 'pointer', transition: 'background 0.25s ease', position: 'relative', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ aspectRatio: '4/3', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {a.imagen_url ? (
                      <img src={a.imagen_url} alt={a.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.55s ease', transform: hoveredId === a.id ? 'scale(1.04)' : 'scale(1)' }}/>
                    ) : (
                      <div style={{ opacity: 0.5 }}>
                        <LenteSVG color="var(--sage)" forma={a.forma || 'cuadrada'} />
                      </div>
                    )}

                    {/* Badge FREE promo o Graduable */}
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontFamily: 'var(--font-sans)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: esPromoRegalo ? 'white' : 'var(--sage)', background: esPromoRegalo ? 'var(--sage)' : 'rgba(247,244,239,0.92)', padding: '3px 9px', border: esPromoRegalo ? 'none' : '1px solid rgba(74,89,64,0.2)', borderRadius: '2px', backdropFilter: 'blur(4px)' }}>
                      {esPromoRegalo ? 'FREE' : t('Graduable', 'Rx Ready')}
                    </div>

                    {a.badge && !esPromoRegalo && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px', fontFamily: 'var(--font-sans)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)', background: 'rgba(247,244,239,0.92)', padding: '3px 10px', border: '1px solid var(--border)', borderRadius: '2px', backdropFilter: 'blur(4px)' }}>
                        {a.badge}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: esMobil ? '0.9rem 1rem 1.1rem' : '1.25rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '4px' }}>
                      {a.genero === 'hombre' ? t('Hombre', 'Men') : a.genero === 'mujer' ? t('Mujer', 'Women') : 'Unisex'}
                      {a.forma ? ` · ${a.forma}` : ''}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '1.05rem' : '1.3rem', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--charcoal)', margin: '0 0 0.75rem', lineHeight: 1.2 }}>
                      {a.nombre}
                    </h3>
                    {a.material && <span style={{ fontSize: '0.68rem', color: 'var(--warm-gray)', marginBottom: '0.75rem', textTransform: 'capitalize' }}>{a.material}</span>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      {esPromoRegalo ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', textDecoration: 'line-through' }}>${a.precio}</span>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--sage)' }}>$0</span>
                        </div>
                      ) : (
                        <div>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 500, color: 'var(--charcoal)' }}>${a.precio}</span>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: 'var(--warm-gray)', marginLeft: '4px', letterSpacing: '0.06em' }}>USD</span>
                        </div>
                      )}
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: hoveredId === a.id ? 'var(--charcoal)' : 'var(--warm-gray)', display: 'flex', alignItems: 'center', gap: '5px', transition: 'color 0.2s' }}>
                        {t('Ver', 'View')}
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* FEATURES STRIP */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'white', padding: esMobil ? '2rem 1.5rem' : '2.5rem 3rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: esMobil ? '1fr 1fr' : 'repeat(4, 1fr)', gap: esMobil ? '1.5rem' : '0' }}>
          {[
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>, label: 'UV400', sub: t('Protección total', 'Full protection') },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: t('Polarizado', 'Polarized'), sub: t('Disponible', 'Available') },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, label: t('Graduables', 'Rx Ready'), sub: t('Todos los modelos', 'All models') },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, label: t('Envío gratis', 'Free shipping'), sub: '+$69 USD' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: esMobil ? 'flex-start' : 'center', gap: '10px', padding: esMobil ? '0' : '0 2rem', textAlign: esMobil ? 'left' : 'center', borderRight: !esMobil && i < 3 ? '1px solid var(--border)' : 'none' }}>
              {f.icon}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '2px' }}>{f.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--warm-gray)' }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BANNER INFERIOR */}
      <div style={{ background: 'var(--sage)', padding: esMobil ? '3.5rem 1.5rem' : '5rem 3rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '1fr 1fr', gap: esMobil ? '2rem' : '4rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 0.6rem' }}>Verly Optical</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '2.8rem', fontWeight: 300, color: 'white', margin: '0 0 1rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {lang === 'es' ? '¿Necesitas graduación?' : 'Need a prescription?'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 2rem', maxWidth: '400px' }}>
              {lang === 'es' ? 'Todos nuestros lentes de sol se pueden graduar. Sin seguro, sin citas.' : 'All our sunglasses can be made with prescription lenses. No insurance, no appointments.'}
            </p>
            <Link href="/Tienda" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: 'var(--charcoal)', padding: '12px 26px', borderRadius: '2px', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
              {lang === 'es' ? 'Ver eyeglasses' : 'Shop eyeglasses'}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { num: '01', label: t('Elige tu armazón', 'Choose your frame') },
              { num: '02', label: t('Agrega tu graduación', 'Add your prescription') },
              { num: '03', label: t('Selecciona el filtro solar', 'Pick your lens filter') },
              { num: '04', label: t('Recíbelos en casa', 'Receive at home') },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'rgba(255,255,255,0.25)', minWidth: '36px', lineHeight: 1 }}>{step.num}</span>
                <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-sans)' }}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}

export default function Sunglasses() {
  return (
    <Suspense fallback={null}>
      <SunglassesContent />
    </Suspense>
  );
}