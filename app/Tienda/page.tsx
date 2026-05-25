// app/Tienda/page.tsx
'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { supabase } from '../supabase';

type Armazon = {
  id: number; nombre: string; forma: string; genero: string;
  precio: number; color: string; imagen_url?: string;
  badge?: string; material?: string; talla?: string; tipo?: string;
  color1?: string; descuento?: number;
};

const FORMAS = ['Rectangle', 'Round', 'Square', 'Oval', 'Aviator'];
const MATERIALES = ['Acetato', 'Metálico', 'TR-90', 'Titanio', 'Mixto'];
const TALLAS = ['S', 'M', 'L', 'XL'];

const HERO_CONFIG: Record<string, { img: string; label: string; titulo_es: string; titulo_en: string; sub_es: string; sub_en: string; acento: string }> = {
  'optico-hombre': { img: '/hero-hombre.jpg', label: "MEN'S OPTICAL", titulo_es: 'Para él.', titulo_en: 'For him.', sub_es: 'Armazones clásicos, cómodos y resistentes.', sub_en: 'Timeless frames. Made for everyday confidence.', acento: '#3a4f33' },
  'optico-mujer':  { img: '/hero-mujer.jpg', label: "WOMEN'S OPTICAL", titulo_es: 'Para ella.', titulo_en: 'For her.', sub_es: 'Estilos modernos, ligeros y fáciles de combinar.', sub_en: 'Modern styles, lightweight and versatile.', acento: '#6B7A5E' },
  'solar-hombre':  { img: '/hero-hombre-solar.jpg', label: "MEN'S SUNGLASSES", titulo_es: 'Sol para él.', titulo_en: 'Sun styles for him.', sub_es: 'Protección UV y estilo sin compromiso.', sub_en: 'UV protection and style without compromise.', acento: '#3a4f33' },
  'solar-mujer':   { img: '/hero-mujer-solar.jpg', label: "WOMEN'S SUNGLASSES", titulo_es: 'Sol para ella.', titulo_en: 'Sun styles for her.', sub_es: 'Protección UV y estilo sin compromiso.', sub_en: 'UV protection and style without compromise.', acento: '#6B7A5E' },
  'optico-all':    { img: '/hero-tienda.jpg', label: 'EYEGLASSES', titulo_es: 'Encuentra tu par.', titulo_en: 'Find your pair.', sub_es: 'Diseño atemporal. Comodidad diaria. Precios justos.', sub_en: 'Timeless design. Everyday comfort. Fair prices.', acento: '#4A5940' },
  'solar-all':     { img: '/hero-tienda.jpg', label: 'SUNGLASSES', titulo_es: 'Lentes solares.', titulo_en: 'Sunglasses.', sub_es: 'Protección UV y estilo sin compromiso.', sub_en: 'UV protection and style without compromise.', acento: '#4A5940' },
};

function ArmazonCard({ a, esMobil, t }: { a: Armazon; esMobil: boolean; t: (es: string, en: string) => string }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/armazon/${a.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${hovered ? 'rgba(85,98,76,0.2)' : 'rgba(0,0,0,0.04)'}`, transition: 'all 0.4s ease', cursor: 'pointer', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.09)' : 'none' }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div style={{ aspectRatio: '4/3', background: '#f5f2ed', overflow: 'hidden', position: 'relative' }}>
          {a.imagen_url ? (
            <img src={a.imagen_url} alt={a.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.5s ease', display: 'block', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}/>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="80" height="44" viewBox="0 0 160 90" fill="none" style={{ opacity: 0.15 }}>
                <rect x="4" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/>
                <rect x="92" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/>
                <path d="M68 38 C72 32, 88 32, 92 38" stroke="#1d1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          )}
          {a.badge && <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: '3px', background: a.badge?.toLowerCase() === 'nuevo' || a.badge?.toLowerCase() === 'new' ? '#55624c' : '#1d1d1d', color: 'white' }}>{a.badge}</div>}
          <button onClick={e => { e.preventDefault(); e.stopPropagation(); setLiked(l => !l); }} style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '50%', background: 'white', border: `1px solid ${liked ? 'rgba(192,57,43,0.25)' : 'rgba(0,0,0,0.06)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s', transform: liked ? 'scale(1.1)' : 'scale(1)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill={liked ? '#c0392b' : 'none'} stroke={liked ? '#c0392b' : '#6f6a63'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          {a.descuento && a.descuento > 0 && <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '0.6rem', fontWeight: 700, padding: '3px 8px', borderRadius: '3px', background: '#c0392b', color: 'white' }}>-{a.descuento}%</div>}
        </div>
        <div style={{ padding: esMobil ? '0.75rem' : '1rem 1.25rem 1.25rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '0.95rem' : '1.1rem', fontWeight: 400, color: '#1d1d1d', marginBottom: '2px', letterSpacing: '-0.01em' }}>{a.nombre}</div>
          {a.material && <div style={{ fontSize: '0.72rem', color: '#9a9a9a', marginBottom: '8px', textTransform: 'capitalize' }}>{a.material}</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1d1d1d' }}>{t('Desde', 'From')} ${a.precio}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: hovered ? 'white' : '#55624c', background: hovered ? '#55624c' : 'transparent', padding: hovered ? '4px 10px' : '4px 0', borderRadius: '4px', transition: 'all 0.25s ease' }}>
              {t('Ver', 'View')} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function TiendaContent() {
  const { t, lang } = useLang() as any;
  const searchParams = useSearchParams();
  const [armazones, setArmazones] = useState<Armazon[]>([]);
  const [loading, setLoading] = useState(true);
  const [esMobil, setEsMobil] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [generoTab, setGeneroTab] = useState('all');
  const [tipoActivo, setTipoActivo] = useState('optico');
  const [filtroForma, setFiltroForma] = useState<string[]>([]);
  const [filtroMaterial, setFiltroMaterial] = useState<string[]>([]);
  const [filtroTalla, setFiltroTalla] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<string[]>(['shape']);

  useEffect(() => {
    const tipo = searchParams.get('tipo');
    const genero = searchParams.get('genero');
    if (tipo) setTipoActivo(tipo);
    if (genero && genero !== 'all') setGeneroTab(genero);
  }, [searchParams]);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    supabase.from('armazones').select('*').eq('activo', true).order('id')
      .then(({ data }) => { setArmazones(data || []); setLoading(false); });
  }, []);

  const toggleArr = (arr: string[], val: string) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  const toggleSection = (s: string) => setOpenSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const clearAll = () => { setFiltroForma([]); setFiltroMaterial([]); setFiltroTalla([]); };

  const chips = [
    ...filtroForma.map(v => ({ label: v, type: 'forma', val: v })),
    ...filtroMaterial.map(v => ({ label: v, type: 'material', val: v })),
    ...filtroTalla.map(v => ({ label: `Size ${v}`, type: 'talla', val: v })),
  ];

  const removeChip = (chip: any) => {
    if (chip.type === 'forma') setFiltroForma(prev => prev.filter(x => x !== chip.val));
    if (chip.type === 'material') setFiltroMaterial(prev => prev.filter(x => x !== chip.val));
    if (chip.type === 'talla') setFiltroTalla(prev => prev.filter(x => x !== chip.val));
  };

  const filtered = useMemo(() => {
    let r = armazones.filter(a => a.tipo === tipoActivo);
    if (generoTab !== 'all') r = r.filter(a => a.genero === generoTab || a.genero === 'unisex');
    if (filtroForma.length) r = r.filter(a => filtroForma.some(f => a.forma?.toLowerCase().includes(f.toLowerCase())));
    if (filtroMaterial.length) r = r.filter(a => filtroMaterial.some(m => a.material === m));
    if (filtroTalla.length) r = r.filter(a => filtroTalla.includes(a.talla || 'M'));
    return r;
  }, [armazones, generoTab, tipoActivo, filtroForma, filtroMaterial, filtroTalla]);

  const heroKey = `${tipoActivo}-${generoTab}`;
  const hero = HERO_CONFIG[heroKey] || HERO_CONFIG[`${tipoActivo}-all`];

  const Checkbox = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
    <div onClick={onClick} style={{ width: '16px', height: '16px', borderRadius: '3px', border: `1.5px solid ${checked ? '#55624c' : '#d1ccc5'}`, background: checked ? '#55624c' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s', cursor: 'pointer' }}>
      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {[
        { id: 'shape', label: t('Forma', 'Shape'), content: (<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '1rem' }}>{FORMAS.map(f => (<label key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1d1d1d' }}><Checkbox checked={filtroForma.includes(f)} onClick={() => setFiltroForma(prev => toggleArr(prev, f))}/>{f}</label>))}</div>) },
        { id: 'material', label: 'Material', content: (<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '1rem' }}>{MATERIALES.map(m => (<label key={m} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1d1d1d' }}><Checkbox checked={filtroMaterial.includes(m)} onClick={() => setFiltroMaterial(prev => toggleArr(prev, m))}/>{m}</label>))}</div>) },
        { id: 'size', label: t('Talla', 'Size'), content: (<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '1rem' }}>{TALLAS.map(s => (<button key={s} onClick={() => setFiltroTalla(prev => toggleArr(prev, s))} style={{ padding: '6px 14px', borderRadius: '4px', border: `1.5px solid ${filtroTalla.includes(s) ? '#55624c' : '#e2ddd6'}`, background: filtroTalla.includes(s) ? '#55624c' : 'white', color: filtroTalla.includes(s) ? 'white' : '#1d1d1d', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-sans)' }}>{s}</button>))}</div>) },
      ].map(sec => (
        <div key={sec.id} style={{ borderBottom: '1px solid #f0ede8' }}>
          <button onClick={() => toggleSection(sec.id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1d1d1d' }}>
            {sec.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="1.5" strokeLinecap="round" style={{ transform: openSections.includes(sec.id) ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {openSections.includes(sec.id) && sec.content}
        </div>
      ))}
    </div>
  );

  return (
    <main style={{ fontFamily: 'var(--font-sans), sans-serif', background: '#f7f4ef', minHeight: '100vh', color: '#1d1d1d' }}>
      <Navbar />

      {/* ── HERO DINÁMICO ── */}
      <div style={{ marginTop: '64px', position: 'relative', width: '100%', height: esMobil ? '300px' : '460px', overflow: 'hidden' }}>
        <img key={hero.img} src={hero.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.0) 80%)' }}/>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: esMobil ? '2rem 1.5rem' : '0 5rem' }}>
          <div style={{ maxWidth: '500px' }}>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.75rem' }}>{hero.label}</p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2.8rem' : '4.2rem', fontWeight: 400, letterSpacing: '-0.03em', color: 'white', margin: '0 0 0.5rem', lineHeight: 1.0 }}>
              {lang === 'es' ? hero.titulo_es : hero.titulo_en}
            </h1>
            <div style={{ width: '40px', height: '2px', background: hero.acento, margin: '0.75rem 0 1rem', borderRadius: '2px' }}/>
            <p style={{ fontSize: esMobil ? '0.85rem' : '0.95rem', color: 'rgba(255,255,255,0.75)', margin: '0 0 1.75rem', lineHeight: 1.7, maxWidth: '360px' }}>
              {lang === 'es' ? hero.sub_es : hero.sub_en}
            </p>
            <button onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#1d1d1d', padding: '12px 28px', borderRadius: '4px', fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
              {t('Ver colección', 'Shop now')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── TABS GÉNERO ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2ddd6', position: 'sticky', top: '64px', zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: esMobil ? '0 1rem' : '0 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            {[{ val: 'all', label: t('Todos', 'All') }, { val: 'hombre', label: t('Hombre', 'Men') }, { val: 'mujer', label: t('Mujer', 'Women') }, { val: 'unisex', label: 'Unisex' }].map(tab => (
              <button key={tab.val} onClick={() => setGeneroTab(tab.val)} style={{ padding: esMobil ? '0.85rem 0.85rem' : '1rem 1.25rem', background: 'none', border: 'none', borderBottom: generoTab === tab.val ? '2px solid #55624c' : '2px solid transparent', fontSize: esMobil ? '0.68rem' : '0.75rem', fontWeight: generoTab === tab.val ? 700 : 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: generoTab === tab.val ? '#55624c' : '#9a9a9a', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s', marginBottom: '-1px' }}>
                {tab.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#9a9a9a', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{filtered.length} {t('estilos', 'styles')}</span>
        </div>
      </div>

      {/* ── CHIPS FILTROS RÁPIDOS ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #f0ede8', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: esMobil ? '0.75rem 1rem' : '0.75rem 3rem', display: 'flex', gap: '0.5rem', alignItems: 'center', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9a9a9a', marginRight: '0.25rem', flexShrink: 0 }}>{t('Forma:', 'Shape:')}</span>
          {FORMAS.map(f => (<button key={f} onClick={() => setFiltroForma(prev => toggleArr(prev, f))} style={{ padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${filtroForma.includes(f) ? '#55624c' : '#e2ddd6'}`, background: filtroForma.includes(f) ? '#55624c' : 'white', color: filtroForma.includes(f) ? 'white' : '#1d1d1d', fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s', flexShrink: 0 }}>{f}</button>))}
          <div style={{ width: '1px', height: '20px', background: '#e2ddd6', margin: '0 0.25rem', flexShrink: 0 }}/>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9a9a9a', flexShrink: 0 }}>Material:</span>
          {MATERIALES.map(m => (<button key={m} onClick={() => setFiltroMaterial(prev => toggleArr(prev, m))} style={{ padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${filtroMaterial.includes(m) ? '#55624c' : '#e2ddd6'}`, background: filtroMaterial.includes(m) ? '#55624c' : 'white', color: filtroMaterial.includes(m) ? 'white' : '#1d1d1d', fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s', flexShrink: 0 }}>{m}</button>))}
          {(filtroForma.length > 0 || filtroMaterial.length > 0) && (<button onClick={clearAll} style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', background: 'none', color: '#9a9a9a', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline', flexShrink: 0 }}>{t('Limpiar', 'Clear')}</button>)}
        </div>
      </div>

      {/* ── CATÁLOGO ── */}
      <div id="catalogo" style={{ maxWidth: '1280px', margin: '0 auto', padding: esMobil ? '1.5rem 1rem' : '2.5rem 3rem', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '220px 1fr', gap: esMobil ? '0' : '3rem', alignItems: 'start' }}>
        {!esMobil && (
          <div style={{ position: 'sticky', top: '145px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1d1d1d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
                {t('Filtros', 'Filters')}
              </span>
              {chips.length > 0 && <button onClick={clearAll} style={{ background: 'none', border: 'none', fontSize: '11px', color: '#55624c', cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline' }}>{t('Limpiar', 'Clear all')}</button>}
            </div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative', height: '180px' }}>
              <img src="/tienda-detalle.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)' }}/>
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400, color: 'white', margin: '0 0 2px', lineHeight: 1.2 }}>{t('Calidad que se', 'Quality you can')}<br/>{t('ve y se siente.', 'see and feel.')}</p>
                <div style={{ width: '24px', height: '1.5px', background: hero.acento, marginTop: '6px', borderRadius: '2px' }}/>
              </div>
            </div>
            <SidebarContent />
          </div>
        )}

        <div>
          {esMobil && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <button onClick={() => setFiltersOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', background: 'white', border: '1px solid #e2ddd6', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', color: '#1d1d1d' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
                {t('Filtros', 'Filters')}
                {chips.length > 0 && <span style={{ background: '#55624c', color: 'white', borderRadius: '20px', padding: '1px 7px', fontSize: '10px', fontWeight: 700 }}>{chips.length}</span>}
              </button>
              <span style={{ fontSize: '0.72rem', color: '#9a9a9a' }}>{filtered.length} {t('estilos', 'styles')}</span>
            </div>
          )}

          {chips.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
              {chips.map((chip, i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px 4px 12px', background: '#f0f4ef', border: '1px solid #c8dbc4', borderRadius: '20px', fontSize: '11px', fontWeight: 500, color: '#3a4f33' }}>
                  {chip.label}
                  <button onClick={() => removeChip(chip)} style={{ background: 'rgba(85,98,76,0.15)', border: 'none', cursor: 'pointer', color: '#55624c', fontSize: '12px', lineHeight: 1, padding: '1px 4px', display: 'flex', alignItems: 'center', borderRadius: '50%', marginLeft: '2px' }}>×</button>
                </div>
              ))}
              <button onClick={clearAll} style={{ background: 'none', border: 'none', fontSize: '11px', color: '#9a9a9a', cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline' }}>{t('Limpiar todo', 'Clear all')}</button>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#9a9a9a', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300 }}>{t('Cargando...', 'Loading...')}</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#9a9a9a' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300, marginBottom: '0.5rem' }}>{t('Sin resultados', 'No results found')}</div>
              <button onClick={clearAll} style={{ background: 'none', border: 'none', color: '#55624c', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}>{t('Limpiar filtros', 'Clear filters')}</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: esMobil ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: esMobil ? '12px' : '20px' }}>
              {filtered.map(a => <ArmazonCard key={a.id} a={a} esMobil={esMobil} t={t} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── WHY VERLY ── */}
      <div style={{ background: '#55624c', padding: esMobil ? '3rem 1.25rem' : '5rem 3rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textAlign: 'center', margin: '0 0 0.75rem' }}>Verly Optical</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '1.8rem' : '2.4rem', fontWeight: 400, textAlign: 'center', color: 'white', margin: '0 0 3rem', letterSpacing: '-0.02em' }}>{t('¿Por qué Verly?', 'Why Verly?')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(3, 1fr)', gap: esMobil ? '2rem' : '3rem' }}>
            {[
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>), title: t('Envío rápido', 'Fast delivery'), desc: t('Envío gratis en pedidos +$69.', 'Free shipping over $69.') },
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>), title: t('Micas accesibles', 'Affordable lenses'), desc: t('Sin aseguranza. Sin complicaciones.', 'No insurance. No hassle.') },
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>), title: t('Receta fácil', 'Easy prescription'), desc: t('Foto o manual. En un minuto.', 'Photo or manual. Done in a minute.') },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: esMobil ? 'row' : 'column', gap: esMobil ? '1rem' : '1.25rem', alignItems: esMobil ? 'flex-start' : 'center', textAlign: esMobil ? 'left' : 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{b.icon}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '6px' }}>{b.title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DRAWER FILTROS MÓVIL ── */}
      {esMobil && (
        <>
          {filtersOpen && <div onClick={() => setFiltersOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>}
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: 'white', borderRadius: '16px 16px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.12)', transform: filtersOpen ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)', maxHeight: '82vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f0ede8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1d' }}>{t('Filtros', 'Filters')}</span>
              <button onClick={() => setFiltersOpen(false)} style={{ background: '#f5f3ef', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#6f6a63' }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem' }}><SidebarContent /></div>
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f0ede8', display: 'flex', gap: '10px', flexShrink: 0, background: 'white' }}>
              <button onClick={() => { clearAll(); setFiltersOpen(false); }} style={{ flex: 1, background: 'white', border: '1px solid #e2ddd6', borderRadius: '8px', padding: '13px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', color: '#6f6a63' }}>{t('Limpiar todo', 'Clear all')}</button>
              <button onClick={() => setFiltersOpen(false)} style={{ flex: 2, background: '#55624c', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', color: 'white', letterSpacing: '0.06em' }}>
                {t('Aplicar', 'Apply')} {chips.length > 0 && `(${chips.length})`}
              </button>
            </div>
          </div>
        </>
      )}
      <style>{`* { -webkit-tap-highlight-color: transparent; } div::-webkit-scrollbar { display: none; }`}</style>
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