// app/Tienda/page.tsx
'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { supabase } from '../lib/supabase';
import { useFavoritos } from '../context/FavoritosContext';

type Armazon = {
  id: number; nombre: string; forma: string; genero: string;
  precio: number; color: string; imagen_url?: string;
  badge?: string; material?: string; talla?: string; tipo?: string;
  color1?: string; descuento?: number;
};

const FORMAS = ['Rectangle', 'Round', 'Square', 'Oval', 'Aviator'];
const MATERIALES = ['Acetato', 'Metálico', 'TR-90', 'Titanio', 'Mixto'];
const TALLAS = ['S', 'M', 'L', 'XL'];

// ── CARD ────────────────────────────────────────────────
function ArmazonCard({
  a, esMobil, t, esPromoRegalo,
}: {
  a: Armazon; esMobil: boolean;
  t: (es: string, en: string) => string;
  esPromoRegalo: boolean;
}) {
  const { toggleFavorito, esFavorito } = useFavoritos();
  const liked = esFavorito(a.id);
  const [hovered, setHovered] = useState(false);
  const href = esPromoRegalo ? `/armazon/${a.id}?promo=regalo` : `/armazon/${a.id}`;

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'white',
          borderRadius: '3px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          transition: 'box-shadow 0.35s ease, transform 0.35s ease',
          cursor: 'pointer',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          boxShadow: hovered ? '0 16px 48px rgba(28,28,26,0.07)' : 'none',
        }}
      >
        {/* Image */}
        <div style={{ aspectRatio: '4/3', background: 'var(--cream)', overflow: 'hidden', position: 'relative' }}>
          {a.imagen_url ? (
            <img
              src={a.imagen_url}
              alt={a.nombre}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center',
                display: 'block',
                transition: 'transform 0.6s ease',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="72" height="40" viewBox="0 0 160 90" fill="none" style={{ opacity: 0.1 }}>
                <rect x="4" y="12" width="64" height="66" rx="14" stroke="var(--charcoal)" strokeWidth="3"/>
                <rect x="92" y="12" width="64" height="66" rx="14" stroke="var(--charcoal)" strokeWidth="3"/>
                <path d="M68 38 C72 32, 88 32, 92 38" stroke="var(--charcoal)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          )}

          {/* Badges */}
          {esPromoRegalo && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: '2px', background: 'var(--sage)', color: 'white' }}>
              FREE
            </div>
          )}
          {!esPromoRegalo && a.badge && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.57rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: '2px', background: ['nuevo','new'].includes(a.badge.toLowerCase()) ? 'var(--sage)' : 'var(--charcoal)', color: 'white' }}>
              {a.badge}
            </div>
          )}
          {!esPromoRegalo && a.descuento && a.descuento > 0 && (
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '0.6rem', fontWeight: 700, padding: '3px 8px', borderRadius: '2px', background: 'var(--charcoal)', color: 'white' }}>
              -{a.descuento}%
            </div>
          )}

          {/* Favorite */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorito({ id: a.id, nombre: a.nombre, imagen_url: a.imagen_url, precio: a.precio, forma: a.forma, material: a.material }); }}
            style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(247,244,239,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', transition: 'transform 0.2s', transform: liked ? 'scale(1.12)' : 'scale(1)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? 'var(--sage)' : 'none'} stroke={liked ? 'var(--sage)' : 'var(--warm-gray)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: esMobil ? '0.75rem' : '1rem 1.1rem 1.1rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '1rem' : '1.15rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '2px', letterSpacing: '-0.01em' }}>
            {a.nombre}
          </div>
          {a.material && (
            <div style={{ fontSize: '0.68rem', color: 'var(--warm-gray)', marginBottom: '0.75rem', textTransform: 'capitalize', letterSpacing: '0.02em' }}>
              {a.material}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {esPromoRegalo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', textDecoration: 'line-through' }}>${a.precio}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--sage)' }}>$0</span>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--charcoal)' }}>
                {t('Desde', 'From')} <span style={{ fontWeight: 600 }}>${a.precio}</span>
              </div>
            )}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: hovered ? 'white' : 'var(--sage)',
              background: hovered ? 'var(--sage)' : 'transparent',
              padding: hovered ? '4px 10px' : '4px 0',
              borderRadius: '2px',
              transition: 'all 0.25s ease',
            }}>
              {t('Ver', 'View')}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── PAGE ─────────────────────────────────────────────────
function TiendaContent() {
  const { t, lang } = useLang() as any;
  const searchParams = useSearchParams();
  const [armazones, setArmazones] = useState<Armazon[]>([]);
  const [loading, setLoading] = useState(true);
  const [esMobil, setEsMobil] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [generoTab, setGeneroTab] = useState('all');
  const [filtroForma, setFiltroForma] = useState<string[]>([]);
  const [filtroMaterial, setFiltroMaterial] = useState<string[]>([]);
  const [filtroTalla, setFiltroTalla] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<string[]>(['shape']);
  const [esPromoRegalo, setEsPromoRegalo] = useState(false);

  useEffect(() => {
    const genero = searchParams.get('genero');
    const promo = searchParams.get('promo');
    if (genero && genero !== 'all') setGeneroTab(genero);
    if (promo === 'regalo') setEsPromoRegalo(true);
  }, [searchParams]);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 900);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    supabase
      .from('armazones')
      .select('*')
      .eq('activo', true).eq('publicar_verly', true)
      .eq('tipo', 'optico')
      .order('id')
      .then(({ data }) => { setArmazones(data || []); setLoading(false); });
  }, []);

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  const toggleSection = (s: string) =>
    setOpenSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const clearAll = () => { setFiltroForma([]); setFiltroMaterial([]); setFiltroTalla([]); };

  const chips = [
    ...filtroForma.map(v => ({ label: v, type: 'forma', val: v })),
    ...filtroMaterial.map(v => ({ label: v, type: 'material', val: v })),
    ...filtroTalla.map(v => ({ label: `Size ${v}`, type: 'talla', val: v })),
  ];
  const removeChip = (chip: { type: string; val: string }) => {
    if (chip.type === 'forma') setFiltroForma(p => p.filter(x => x !== chip.val));
    if (chip.type === 'material') setFiltroMaterial(p => p.filter(x => x !== chip.val));
    if (chip.type === 'talla') setFiltroTalla(p => p.filter(x => x !== chip.val));
  };

  const filtered = useMemo(() => {
    let r = [...armazones];
    if (generoTab !== 'all') r = r.filter(a => a.genero === generoTab || a.genero === 'unisex');
    if (filtroForma.length) r = r.filter(a => filtroForma.some(f => a.forma?.toLowerCase().includes(f.toLowerCase())));
    if (filtroMaterial.length) r = r.filter(a => filtroMaterial.some(m => a.material === m));
    if (filtroTalla.length) r = r.filter(a => filtroTalla.includes(a.talla || 'M'));
    return r;
  }, [armazones, generoTab, filtroForma, filtroMaterial, filtroTalla]);

  // ── Checkbox ──
  const Checkbox = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
    <div
      onClick={onClick}
      style={{ width: '15px', height: '15px', borderRadius: '2px', border: `1.5px solid ${checked ? 'var(--sage)' : 'var(--border)'}`, background: checked ? 'var(--sage)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s', cursor: 'pointer' }}
    >
      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );

  // ── Sidebar filters ──
  const SidebarContent = () => (
    <div>
      {[
        {
          id: 'shape', label: t('Forma', 'Shape'),
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', paddingBottom: '1.1rem' }}>
              {FORMAS.map(f => (
                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <Checkbox checked={filtroForma.includes(f)} onClick={() => setFiltroForma(p => toggleArr(p, f))}/>
                  <span style={{ fontSize: '13px', color: 'var(--charcoal)', fontFamily: 'var(--font-sans)' }}>{f}</span>
                </label>
              ))}
            </div>
          ),
        },
        {
          id: 'material', label: 'Material',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', paddingBottom: '1.1rem' }}>
              {MATERIALES.map(m => (
                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <Checkbox checked={filtroMaterial.includes(m)} onClick={() => setFiltroMaterial(p => toggleArr(p, m))}/>
                  <span style={{ fontSize: '13px', color: 'var(--charcoal)', fontFamily: 'var(--font-sans)' }}>{m}</span>
                </label>
              ))}
            </div>
          ),
        },
        {
          id: 'size', label: t('Talla', 'Size'),
          content: (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingBottom: '1.1rem' }}>
              {TALLAS.map(s => (
                <button key={s} onClick={() => setFiltroTalla(p => toggleArr(p, s))} style={{ padding: '6px 14px', borderRadius: '2px', border: `1.5px solid ${filtroTalla.includes(s) ? 'var(--sage)' : 'var(--border)'}`, background: filtroTalla.includes(s) ? 'var(--sage)' : 'white', color: filtroTalla.includes(s) ? 'white' : 'var(--charcoal)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-sans)' }}>
                  {s}
                </button>
              ))}
            </div>
          ),
        },
      ].map(sec => (
        <div key={sec.id} style={{ borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => toggleSection(sec.id)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--charcoal)' }}
          >
            {sec.label}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--warm-gray)" strokeWidth="1.5" strokeLinecap="round" style={{ transform: openSections.includes(sec.id) ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {openSections.includes(sec.id) && sec.content}
        </div>
      ))}
    </div>
  );

  return (
    <main style={{ fontFamily: 'var(--font-sans)', background: 'var(--cream)', minHeight: '100vh', color: 'var(--charcoal)' }}>
      <Navbar />

      {/* Promo banner */}
      {esPromoRegalo && (
        <div style={{ background: 'var(--charcoal)', padding: '1rem 2rem', textAlign: 'center', marginTop: '72px' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 300, color: 'white', margin: 0, letterSpacing: '-0.01em' }}>
            {t('Elige tu par de lentes gratis — el armazón es cortesía de Verly.', 'Choose your free frame — on us.')}
          </p>
        </div>
      )}

      {/* ── HERO ── */}
      <div style={{ marginTop: esPromoRegalo ? '0' : '72px', position: 'relative', width: '100%', height: esMobil ? '320px' : '500px', overflow: 'hidden' }}>
        <img
          src="/hero-tienda.jpg"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(28,28,26,0.72) 0%, rgba(28,28,26,0.32) 55%, transparent 85%)' }}/>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: esMobil ? '2rem 1.75rem' : '0 5rem' }}>
          <div style={{ maxWidth: '480px' }}>
            <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 0.75rem' }}>
              VERLY OPTICAL — EYEGLASSES
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '3rem' : '4.8rem', fontWeight: 300, letterSpacing: '-0.03em', color: 'white', margin: 0, lineHeight: 1.0 }}>
              {lang === 'es' ? 'Encuentra\ntu par.' : 'Find your\npair.'}
            </h1>
            <div style={{ width: '32px', height: '1px', background: 'var(--sage-light)', margin: '1.1rem 0' }}/>
            <p style={{ fontSize: esMobil ? '0.82rem' : '0.88rem', color: 'rgba(255,255,255,0.65)', margin: '0 0 2rem', lineHeight: 1.8, maxWidth: '320px' }}>
              {lang === 'es'
                ? 'Diseño atemporal. Comodidad diaria. Precios justos.'
                : 'Timeless design. Everyday comfort. Fair prices.'}
            </p>
            <button
              onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: 'var(--charcoal)', padding: '12px 26px', borderRadius: '2px', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}
            >
              {lang === 'es' ? 'Ver colección' : 'Shop now'}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── GENDER TABS ── */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: '0', zIndex: 50 }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: esMobil ? '0 1rem' : '0 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            {[
              { val: 'all',    label: t('Todos', 'All') },
              { val: 'hombre', label: t('Hombre', 'Men') },
              { val: 'mujer',  label: t('Mujer', 'Women') },
              { val: 'unisex', label: 'Unisex' },
            ].map(tab => (
              <button
                key={tab.val}
                onClick={() => setGeneroTab(tab.val)}
                style={{
                  padding: esMobil ? '0.9rem 0.75rem' : '1rem 1.25rem',
                  background: 'none', border: 'none',
                  borderBottom: generoTab === tab.val ? '2px solid var(--sage)' : '2px solid transparent',
                  fontSize: esMobil ? '0.65rem' : '0.7rem',
                  fontWeight: generoTab === tab.val ? 600 : 400,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: generoTab === tab.val ? 'var(--sage)' : 'var(--warm-gray)',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  transition: 'all 0.2s', marginBottom: '-1px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.67rem', color: 'var(--warm-gray)', letterSpacing: '0.04em', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)' }}>
            {filtered.length} {t('estilos', 'styles')}
          </span>
        </div>
      </div>

      {/* ── QUICK FILTERS STRIP ── */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: esMobil ? '0.6rem 1rem' : '0.6rem 3rem', display: 'flex', gap: '6px', alignItems: 'center', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginRight: '2px', flexShrink: 0 }}>
            {t('Forma:', 'Shape:')}
          </span>
          {FORMAS.map(f => (
            <button key={f} onClick={() => setFiltroForma(p => toggleArr(p, f))} style={{ padding: '5px 13px', borderRadius: '20px', border: `1px solid ${filtroForma.includes(f) ? 'var(--sage)' : 'var(--border)'}`, background: filtroForma.includes(f) ? 'var(--sage)' : 'white', color: filtroForma.includes(f) ? 'white' : 'var(--charcoal)', fontSize: '0.68rem', fontWeight: 400, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s', flexShrink: 0 }}>
              {f}
            </button>
          ))}
          <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 3px', flexShrink: 0 }}/>
          <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginRight: '2px', flexShrink: 0 }}>
            Material:
          </span>
          {MATERIALES.map(m => (
            <button key={m} onClick={() => setFiltroMaterial(p => toggleArr(p, m))} style={{ padding: '5px 13px', borderRadius: '20px', border: `1px solid ${filtroMaterial.includes(m) ? 'var(--sage)' : 'var(--border)'}`, background: filtroMaterial.includes(m) ? 'var(--sage)' : 'white', color: filtroMaterial.includes(m) ? 'white' : 'var(--charcoal)', fontSize: '0.68rem', fontWeight: 400, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s', flexShrink: 0 }}>
              {m}
            </button>
          ))}
          {(filtroForma.length > 0 || filtroMaterial.length > 0) && (
            <button onClick={clearAll} style={{ padding: '5px 10px', border: 'none', background: 'none', color: 'var(--warm-gray)', fontSize: '0.68rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline', flexShrink: 0 }}>
              {t('Limpiar', 'Clear')}
            </button>
          )}
        </div>
      </div>

      {/* ── CATÁLOGO ── */}
      <div
        id="catalogo"
        style={{ maxWidth: '1360px', margin: '0 auto', padding: esMobil ? '1.5rem 1rem 3rem' : '3rem 3rem 4rem', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '210px 1fr', gap: esMobil ? '0' : '3.5rem', alignItems: 'start' }}
      >
        {/* Desktop sidebar */}
        {!esMobil && (
          <div style={{ position: 'sticky', top: '160px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--charcoal)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
                </svg>
                {t('Filtros', 'Filters')}
              </span>
              {chips.length > 0 && (
                <button onClick={clearAll} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--sage)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline' }}>
                  {t('Limpiar', 'Clear all')}
                </button>
              )}
            </div>
            <SidebarContent />
          </div>
        )}

        {/* Products */}
        <div>
          {/* Mobile filter button */}
          {esMobil && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
              <button
                onClick={() => setFiltersOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', color: 'var(--charcoal)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
                </svg>
                {t('Filtros', 'Filters')}
                {chips.length > 0 && (
                  <span style={{ background: 'var(--sage)', color: 'white', borderRadius: '20px', padding: '1px 7px', fontSize: '10px', fontWeight: 700 }}>
                    {chips.length}
                  </span>
                )}
              </button>
              <span style={{ fontSize: '0.68rem', color: 'var(--warm-gray)' }}>
                {filtered.length} {t('estilos', 'styles')}
              </span>
            </div>
          )}

          {/* Active chip tags */}
          {chips.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
              {chips.map((chip, i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px 4px 12px', background: 'var(--cream-dark)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '11px', fontWeight: 500, color: 'var(--sage)' }}>
                  {chip.label}
                  <button onClick={() => removeChip(chip)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warm-gray)', fontSize: '15px', lineHeight: 1, padding: '0 2px', display: 'flex', alignItems: 'center' }}>×</button>
                </div>
              ))}
              <button onClick={clearAll} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--warm-gray)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline' }}>
                {t('Limpiar todo', 'Clear all')}
              </button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--warm-gray)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300 }}>
              {t('Cargando...', 'Loading...')}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>
                {t('Sin resultados', 'No results found')}
              </div>
              <p style={{ color: 'var(--warm-gray)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
                {t('Prueba otros filtros', 'Try different filters')}
              </p>
              <button onClick={clearAll} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--charcoal)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', padding: '10px 24px', fontFamily: 'var(--font-sans)' }}>
                {t('Limpiar filtros', 'Clear filters')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: esMobil ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: esMobil ? '10px' : '18px' }}>
              {filtered.map(a => (
                <ArmazonCard key={a.id} a={a} esMobil={esMobil} t={t} esPromoRegalo={esPromoRegalo} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── WHY VERLY ── */}
      <div style={{ background: 'var(--sage)', padding: esMobil ? '3.5rem 1.5rem' : '5.5rem 3rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '0 0 0.6rem' }}>
            Verly Optical
          </p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '2.8rem', fontWeight: 300, textAlign: 'center', color: 'white', margin: '0 0 3.5rem', letterSpacing: '-0.02em' }}>
            {t('¿Por qué Verly?', 'Why Verly?')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(3, 1fr)', gap: esMobil ? '2rem' : '4rem' }}>
            {[
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                title: t('Envío rápido', 'Fast delivery'),
                desc: t('Gratis en pedidos +$69 a toda la república.', 'Free shipping over $69 nationwide.'),
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                title: t('Micas accesibles', 'Affordable lenses'),
                desc: t('Sin seguro. Sin burocracia. Desde $28.', 'No insurance. No hassle. From $28.'),
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
                title: t('Receta fácil', 'Easy prescription'),
                desc: t('Foto o captura manual. Listo en un minuto.', 'Photo or manual entry. Done in a minute.'),
              },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: esMobil ? 'row' : 'column', gap: esMobil ? '1.25rem' : '1.1rem', alignItems: esMobil ? 'flex-start' : 'center', textAlign: esMobil ? 'left' : 'center' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '5px', fontFamily: 'var(--font-sans)' }}>{b.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, fontFamily: 'var(--font-sans)' }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      {esMobil && (
        <>
          {filtersOpen && (
            <div onClick={() => setFiltersOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(28,28,26,0.45)', zIndex: 200, backdropFilter: 'blur(3px)' }}/>
          )}
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: 'white', borderRadius: '12px 12px 0 0', boxShadow: '0 -8px 48px rgba(28,28,26,0.12)', transform: filtersOpen ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)', maxHeight: '82vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--charcoal)', fontFamily: 'var(--font-sans)' }}>{t('Filtros', 'Filters')}</span>
              <button onClick={() => setFiltersOpen(false)} style={{ background: 'var(--cream)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: 'var(--warm-gray)' }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem' }}>
              <SidebarContent />
            </div>
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', flexShrink: 0 }}>
              <button onClick={() => { clearAll(); setFiltersOpen(false); }} style={{ flex: 1, background: 'white', border: '1px solid var(--border)', borderRadius: '2px', padding: '13px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', color: 'var(--warm-gray)' }}>
                {t('Limpiar', 'Clear all')}
              </button>
              <button onClick={() => setFiltersOpen(false)} style={{ flex: 2, background: 'var(--sage)', border: 'none', borderRadius: '2px', padding: '13px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', color: 'white', letterSpacing: '0.08em' }}>
                {t('Aplicar', 'Apply')} {chips.length > 0 && `(${chips.length})`}
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}

export default function Tienda() {
  return (
    <Suspense fallback={null}>
      <TiendaContent />
    </Suspense>
  );
}