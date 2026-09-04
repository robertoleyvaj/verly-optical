// app/lenses/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';

// ── BarraGrosor FUERA del componente ──────────────────────
function BarraGrosor({ valor, max = 5 }: { valor: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {[...Array(max)].map((_, i) => (
        <div key={i} style={{ width: '18px', height: '4px', borderRadius: '2px', background: i < valor ? 'var(--sage)' : 'var(--border)', transition: 'background 0.2s' }}/>
      ))}
    </div>
  );
}

const visionOpts = [
  {
    id: 'mono',
    icono: (
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="24" y1="10" x2="24" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3"/>
        <line x1="10" y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3"/>
      </svg>
    ),
    nombre_es: 'Monofocal', nombre_en: 'Single Vision', precio: 15,
    desc_es: 'Para ver solo de lejos o solo de cerca. El tipo más común.',
    desc_en: 'For distance or near vision only. The most common type.',
    para_es: 'Miopía, hipermetropía', para_en: 'Myopia, hyperopia',
    tag_es: 'Más popular', tag_en: 'Most popular',
  },
  {
    id: 'bi',
    icono: (
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="10" y1="28" x2="38" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <text x="24" y="23" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="serif">D</text>
        <text x="24" y="34" textAnchor="middle" fontSize="6" fill="currentColor" fontFamily="serif">N</text>
      </svg>
    ),
    nombre_es: 'Bifocal', nombre_en: 'Bifocal', precio: 49,
    desc_es: 'Dos zonas: lejos arriba, cerca abajo. Con línea visible.',
    desc_en: 'Two zones: distance on top, near on bottom. Visible line.',
    para_es: 'Presbicia básica', para_en: 'Basic presbyopia',
    tag_es: null, tag_en: null,
  },
  {
    id: 'prog',
    icono: (
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M18 14 Q24 24 18 34" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4"/>
        <path d="M24 12 Q28 24 24 36" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M30 14 Q24 24 30 34" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
    nombre_es: 'Progresivo', nombre_en: 'Progressive', precio: 89,
    desc_es: 'Visión continua para todas las distancias sin línea visible.',
    desc_en: 'Continuous all-distance vision with no visible line.',
    para_es: 'Presbicia + miopía/hiper', para_en: 'Presbyopia + near/far issues',
    tag_es: 'Sin línea', tag_en: 'No line',
  },
];

const materialOpts = [
  { nombre_es: 'Standard', nombre_en: 'Standard', precio: 0, grosor: 1, peso: 1, desc_es: 'Para graduaciones leves. Opción base.', desc_en: 'For mild prescriptions. Base option.', indice: '1.50' },
  { nombre_es: 'Thin & Durable', nombre_en: 'Thin & Durable', precio: 29, grosor: 2, peso: 2, desc_es: 'Más resistente e impacto. Recomendada diario.', desc_en: 'More impact-resistant. Daily recommended.', indice: '1.59' },
  { nombre_es: 'ClearView Plus', nombre_en: 'ClearView Plus', precio: 39, grosor: 3, peso: 3, desc_es: 'Mejor claridad visual. Apariencia más ligera.', desc_en: 'Better visual clarity. Lighter appearance.', indice: '1.60' },
  { nombre_es: 'Ultra Thin', nombre_en: 'Ultra Thin', precio: 59, grosor: 4, peso: 4, desc_es: 'Ideal para graduaciones medias-altas.', desc_en: 'Ideal for medium-high prescriptions.', indice: '1.67' },
  { nombre_es: 'Ultra Thin Pro', nombre_en: 'Ultra Thin Pro', precio: 89, grosor: 5, peso: 5, desc_es: 'Nuestra opción más delgada. Graduaciones altas.', desc_en: 'Our thinnest option. High prescriptions.', indice: '1.74' },
];

const filtroOpts = [
  { id: 'ar',     nombre_es: 'Essential AR',       nombre_en: 'Essential AR',       precio: 11, desc_es: 'Reduce reflejos básicos.',                      desc_en: 'Reduces basic reflections.',             icono: '◈',  color: 'var(--sage)',     tag_es: null,           tag_en: null },
  { id: 'arprem', nombre_es: 'Premium Clarity AR', nombre_en: 'Premium Clarity AR', precio: 24, desc_es: 'Mejor antirreflejante. Ideal para de noche.',   desc_en: 'Better AR. Ideal for night driving.',    icono: '◈◈', color: 'var(--sage)',     tag_es: 'Recomendado',  tag_en: 'Recommended' },
  { id: 'blue',   nombre_es: 'Blue Light',          nombre_en: 'Blue Light',          precio: 18, desc_es: 'Filtra la luz azul de pantallas.',             desc_en: 'Filters blue light from screens.',       icono: '◉',  color: '#3B82F6',         tag_es: null,           tag_en: null },
  { id: 'foto',   nombre_es: 'Fotocromático',       nombre_en: 'Photochromic',        precio: 49, desc_es: 'Se oscurece al sol, aclara en interior.',     desc_en: 'Darkens in sun, clears indoors.',        icono: '◑',  color: 'var(--warm-gray)', tag_es: null,           tag_en: null },
  { id: 'anti',   nombre_es: 'Anti-Fog',            nombre_en: 'Anti-Fog',            precio: 15, desc_es: 'Reduce el empañamiento.',                      desc_en: 'Reduces fogging.',                       icono: '〜', color: 'var(--accent)',   tag_es: null,           tag_en: null },
  { id: 'pol',    nombre_es: 'Polarizado',           nombre_en: 'Polarized',           precio: 70, desc_es: 'Elimina reflejos fuertes del exterior.',       desc_en: 'Eliminates strong outdoor glare.',       icono: '▤',  color: 'var(--charcoal)', tag_es: null,           tag_en: null },
  { id: 'tinte',  nombre_es: 'Fashion Tint',         nombre_en: 'Fashion Tint',         precio: 28, desc_es: 'Agrega color a tus lentes.',                  desc_en: 'Adds color to your lenses.',             icono: '◐',  color: '#EC4899',         tag_es: null,           tag_en: null },
];

// ── PAGE ─────────────────────────────────────────────────
export default function Lenses() {
  const { t, lang } = useLang() as any;
  const [esMobil, setEsMobil] = useState(false);
  const [materialActivo, setMaterialActivo] = useState(1);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <main style={{ fontFamily: 'var(--font-sans)', background: 'var(--cream)', minHeight: '100vh', color: 'var(--charcoal)' }}>
      <Navbar />

      {/* ── HERO ── */}
      <div style={{ paddingTop: esMobil ? '100px' : '120px', paddingBottom: esMobil ? '3rem' : '5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: esMobil ? '0 1.5rem' : '0 5rem', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '1fr 1fr', gap: esMobil ? '2rem' : '6rem', alignItems: 'end' }}>
          <div>
            <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 0.75rem' }}>
              VERLY OPTICAL — LENSES
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '3rem' : '5rem', fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 1rem', lineHeight: 1.0, color: 'var(--charcoal)' }}>
              {lang === 'es' ? 'Tus micas,\na tu medida.' : 'Your lenses,\nyour way.'}
            </h1>
            <div style={{ width: '32px', height: '1px', background: 'var(--sage)', margin: '0 0 1.25rem' }}/>
            <p style={{ fontSize: '0.9rem', color: 'var(--warm-gray)', lineHeight: 1.8, margin: '0 0 2rem', maxWidth: '380px' }}>
              {lang === 'es'
                ? 'Elige el tipo de visión, el material y el filtro. Te guiamos en cada paso — o usamos tu receta para recomendar automáticamente.'
                : 'Choose your vision type, material, and filter. We guide you every step — or use your prescription to recommend automatically.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/Tienda" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--sage)', color: 'white', padding: '12px 24px', borderRadius: '2px', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
                {lang === 'es' ? 'Ir a Eyeglasses' : 'Shop Eyeglasses'}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/sunglasses" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', color: 'var(--charcoal)', padding: '12px 24px', borderRadius: '2px', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid var(--border)' }}>
                {lang === 'es' ? 'Ver Sunglasses' : 'Browse Sunglasses'}
              </Link>
            </div>
          </div>

          {!esMobil && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {[
                { paso: '01', label: lang === 'es' ? 'Elige el armazón' : 'Choose the frame', sub: lang === 'es' ? 'Desde $13 USD' : 'From $13 USD' },
                { paso: '02', label: lang === 'es' ? 'Tipo de visión' : 'Vision type', sub: lang === 'es' ? 'Mono / Bifocal / Progresivo' : 'Single / Bifocal / Progressive' },
                { paso: '03', label: lang === 'es' ? 'Material de la mica' : 'Lens material', sub: lang === 'es' ? '5 opciones de grosor' : '5 thickness options' },
                { paso: '04', label: lang === 'es' ? 'Filtro y coating' : 'Filter & coating', sub: lang === 'es' ? 'Blue light, polarizado y más' : 'Blue light, polarized & more' },
                { paso: '05', label: lang === 'es' ? 'Tu receta' : 'Your prescription', sub: lang === 'es' ? 'Manual, foto o después' : 'Manual, photo or later' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--cream)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--border)', minWidth: '32px' }}>{s.paso}</span>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '2px' }}>{s.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--warm-gray)' }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── VISIÓN ── */}
      <div style={{ padding: esMobil ? '3rem 1.5rem' : '5rem 5rem', maxWidth: '1360px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 0.5rem' }}>
          {lang === 'es' ? 'PASO 1' : 'STEP 1'}
        </p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 0.75rem', color: 'var(--charcoal)' }}>
          {lang === 'es' ? 'Tipo de visión' : 'Vision type'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--warm-gray)', margin: '0 0 3rem', lineHeight: 1.7, maxWidth: '480px' }}>
          {lang === 'es'
            ? 'Si no sabes cuál necesitas, tu receta lo indica. ¿Tienes ADD? → Progresivo. ¿Solo SPH? → Monofocal.'
            : "Not sure? Your prescription indicates it. Have ADD? → Progressive. Only SPH? → Single Vision."}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
          {visionOpts.map(v => (
            <div key={v.id} style={{ background: 'white', padding: esMobil ? '1.5rem' : '2rem 2rem 2.5rem', position: 'relative' }}>
              {(v.tag_es || v.tag_en) && (
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)', background: 'rgba(74,89,64,0.08)', padding: '3px 8px', borderRadius: '2px', border: '1px solid rgba(74,89,64,0.15)' }}>
                  {lang === 'es' ? v.tag_es : v.tag_en}
                </div>
              )}
              <div style={{ color: 'var(--sage)', marginBottom: '1.25rem' }}>{v.icono}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '1.4rem' : '1.8rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.25rem', letterSpacing: '-0.01em' }}>
                {lang === 'es' ? v.nombre_es : v.nombre_en}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--sage)', marginBottom: '0.75rem' }}>+${v.precio} USD</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', lineHeight: 1.7, margin: '0 0 1rem' }}>
                {lang === 'es' ? v.desc_es : v.desc_en}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--warm-gray)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {lang === 'es' ? v.para_es : v.para_en}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MATERIALES ── */}
      <div style={{ background: 'var(--cream-dark)', padding: esMobil ? '3rem 1.5rem' : '5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 0.5rem' }}>
            {lang === 'es' ? 'PASO 2' : 'STEP 2'}
          </p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 0.75rem', color: 'var(--charcoal)' }}>
            {lang === 'es' ? 'Material de la mica' : 'Lens material'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--warm-gray)', margin: '0 0 3rem', lineHeight: 1.7, maxWidth: '480px' }}>
            {lang === 'es'
              ? 'Afecta el grosor, peso y estética. A mayor graduación, más recomendamos subir de índice.'
              : 'Affects thickness, weight, and appearance. Higher prescriptions benefit from higher index.'}
          </p>

          {esMobil ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {materialOpts.map((m, i) => (
                <div key={i} onClick={() => setMaterialActivo(i)} style={{ background: materialActivo === i ? 'white' : 'var(--cream)', padding: '1.1rem 1.25rem', cursor: 'pointer', transition: 'background 0.15s', borderLeft: materialActivo === i ? '3px solid var(--sage)' : '3px solid transparent' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: materialActivo === i ? '0.75rem' : '0' }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--charcoal)' }}>{lang === 'es' ? m.nombre_es : m.nombre_en}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--warm-gray)', marginTop: '2px' }}>Índice {m.indice}</div>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--sage)' }}>{m.precio === 0 ? (lang === 'es' ? 'Incluido' : 'Included') : `+$${m.precio}`}</div>
                  </div>
                  {materialActivo === i && (
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--warm-gray)', margin: '0 0 0.75rem', lineHeight: 1.6 }}>{lang === 'es' ? m.desc_es : m.desc_en}</p>
                      <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '5px' }}>{lang === 'es' ? 'Grosor' : 'Thickness'}</div>
                          <BarraGrosor valor={m.grosor}/>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '5px' }}>{lang === 'es' ? 'Ligereza' : 'Weight'}</div>
                          <BarraGrosor valor={m.peso}/>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px 100px', gap: '0', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                {[lang === 'es' ? 'Material' : 'Material', lang === 'es' ? 'Índice' : 'Index', lang === 'es' ? 'Grosor' : 'Thinness', lang === 'es' ? 'Ligereza' : 'Weight', lang === 'es' ? 'Precio' : 'Price'].map((h, i) => (
                  <div key={i} style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--warm-gray)', textAlign: i > 0 ? 'center' : 'left' }}>{h}</div>
                ))}
              </div>
              {materialOpts.map((m, i) => (
                <div key={i} onClick={() => setMaterialActivo(i)} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px 100px', gap: '0', padding: '1.1rem 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: materialActivo === i ? 'rgba(74,89,64,0.04)' : 'transparent', transition: 'background 0.15s', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: materialActivo === i ? 500 : 400, color: 'var(--charcoal)', marginBottom: '3px' }}>{lang === 'es' ? m.nombre_es : m.nombre_en}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', lineHeight: 1.5 }}>{lang === 'es' ? m.desc_es : m.desc_en}</div>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--warm-gray)', fontWeight: 500 }}>{m.indice}</div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><BarraGrosor valor={m.grosor}/></div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><BarraGrosor valor={m.peso}/></div>
                  <div style={{ textAlign: 'right', fontSize: '0.9rem', fontWeight: 600, color: materialActivo === i ? 'var(--sage)' : 'var(--charcoal)' }}>
                    {m.precio === 0 ? (lang === 'es' ? 'Incluido' : 'Included') : `+$${m.precio}`}
                  </div>
                </div>
              ))}
              <p style={{ fontSize: '0.72rem', color: 'var(--warm-gray)', marginTop: '0.75rem', lineHeight: 1.6 }}>
                {lang === 'es'
                  ? '💡 Graduación baja (SPH ±0 a ±2) → Standard. Media (±2 a ±4) → Ultra Thin. Alta (±4+) → Ultra Thin Pro.'
                  : '💡 Low prescription (SPH ±0 to ±2) → Standard. Medium (±2 to ±4) → Ultra Thin. High (±4+) → Ultra Thin Pro.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── FILTROS ── */}
      <div style={{ padding: esMobil ? '3rem 1.5rem' : '5rem 5rem', maxWidth: '1360px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 0.5rem' }}>
          {lang === 'es' ? 'PASO 3' : 'STEP 3'}
        </p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 0.75rem', color: 'var(--charcoal)' }}>
          {lang === 'es' ? 'Filtros y protecciones' : 'Filters & coatings'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--warm-gray)', margin: '0 0 3rem', lineHeight: 1.7, maxWidth: '480px' }}>
          {lang === 'es'
            ? 'Opcionales. Combina varios según tu estilo de vida. Todos compatibles entre sí.'
            : 'Optional. Combine multiple based on your lifestyle. All compatible with each other.'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(2, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
          {filtroOpts.map(f => (
            <div key={f.id} style={{ background: 'white', padding: '1.5rem 1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--cream)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', color: f.color }}>
                {f.icono}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--charcoal)' }}>{lang === 'es' ? f.nombre_es : f.nombre_en}</span>
                  {f.tag_es && (
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)', background: 'rgba(74,89,64,0.08)', padding: '2px 7px', borderRadius: '2px' }}>
                      {lang === 'es' ? f.tag_es : f.tag_en}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', margin: 0, lineHeight: 1.6 }}>{lang === 'es' ? f.desc_es : f.desc_en}</p>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--sage)', flexShrink: 0 }}>+${f.precio}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ + CTA ── */}
      <div style={{ background: 'var(--cream-dark)', borderTop: '1px solid var(--border)', padding: esMobil ? '3rem 1.5rem' : '4rem 5rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '1fr 1fr', gap: esMobil ? '2.5rem' : '4rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '1.5rem' : '2rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 1.5rem', letterSpacing: '-0.01em' }}>
              {lang === 'es' ? 'Preguntas frecuentes' : 'Quick questions'}
            </h3>
            {[
              { q: lang === 'es' ? '¿Puedo subir mi receta después?' : 'Can I upload my prescription later?', a: lang === 'es' ? 'Sí. Puedes pagar primero y subir tu receta antes de que procesemos tu pedido.' : 'Yes. Pay first and upload your prescription before we process your order.' },
              { q: lang === 'es' ? '¿Necesito seguro médico?' : 'Do I need insurance?', a: lang === 'es' ? 'No. Nuestros precios son directos al consumidor, sin intermediarios.' : 'No. Our prices are direct-to-consumer, no middlemen.' },
              { q: lang === 'es' ? '¿Cuánto tarda el pedido?' : 'How long does the order take?', a: lang === 'es' ? 'Armazón solo: 5–7 días. Con micas graduadas: hasta 10 días adicionales.' : 'Frame only: 5–7 days. With prescription lenses: up to 10 additional days.' },
              { q: lang === 'es' ? '¿Todos los armazones se pueden graduar?' : 'Can all frames take prescription lenses?', a: lang === 'es' ? 'Sí. Eyeglasses y Sunglasses son todos graduables.' : 'Yes. Both eyeglasses and sunglasses are all prescription-ready.' },
            ].map((item, i) => (
              <div key={i} style={{ paddingBottom: '1.1rem', marginBottom: '1.1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '0.4rem' }}>{item.q}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--warm-gray)', lineHeight: 1.7 }}>{item.a}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ background: 'var(--sage)', borderRadius: '4px', padding: '2.5rem' }}>
              <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 0.6rem' }}>Verly Optical</p>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '1.6rem' : '2rem', fontWeight: 300, color: 'white', margin: '0 0 1rem', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                {lang === 'es' ? '¿No sabes qué elegir?' : "Not sure what to pick?"}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 1.75rem' }}>
                {lang === 'es'
                  ? 'Sube tu receta y VerlyBot la analiza para recomendarte el paquete perfecto. Sin costo adicional.'
                  : 'Upload your prescription and VerlyBot recommends the perfect package. No extra cost.'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link href="/Tienda" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'white', color: 'var(--charcoal)', padding: '12px 20px', borderRadius: '2px', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
                  {lang === 'es' ? 'Ir a Eyeglasses →' : 'Shop Eyeglasses →'}
                </Link>
                <Link href="/sunglasses" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: 'rgba(255,255,255,0.75)', padding: '12px 20px', borderRadius: '2px', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                  {lang === 'es' ? 'Ver Sunglasses' : 'Browse Sunglasses'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}