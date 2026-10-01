// app/Tienda/page.tsx — Catálogo (rediseño: limpio, tarjetas con línea fina, botones píldora)
'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { supabase } from '../lib/supabase';
import { useFavoritos } from '../context/FavoritosContext';
import { swatchColor, nombreColor } from '../lib/colores';
import { nombreMaterial, claveMaterial, nombreBadge } from '../lib/textos';
import { precioArmazonFinal, VISION_PRICES } from '../lib/precios';
import { ENVIO_GRATIS_DESDE } from '../lib/envio';

type Armazon = {
  id: number; nombre: string; forma: string; genero: string;
  precio: number; color: string; imagen_url?: string;
  badge?: string; material?: string; talla?: string; tipo?: string;
  color1?: string; descuento?: number; descuento_verly?: number;
};

const FORMAS = ['Rectangle', 'Round', 'Square', 'Oval', 'Aviator'];
const MATERIALES = ['Acetato', 'Metálico', 'TR-90', 'Titanio', 'Mixto'];
const TALLAS = ['S', 'M', 'L', 'XL'];
const FORMA_ES: Record<string, string> = { Rectangle: 'Rectangular', Round: 'Redondo', Square: 'Cuadrado', Oval: 'Ovalado', Aviator: 'Aviador' };

type ColorCard = { armazon_id: number; sku: string | null; color: string; hex?: string | null; imagen_url?: string | null };

// ── CARD ────────────────────────────────────────────────
function ArmazonCard({
  a, t, lang, colores = [],
}: {
  a: Armazon;
  t: (es: string, en: string) => string;
  lang: string;
  colores?: ColorCard[];
}) {
  const { toggleFavorito, esFavorito } = useFavoritos();
  const liked = esFavorito(a.id);
  const [colorIdx, setColorIdx] = useState(0);
  const colorSel = colores[colorIdx];
  const imagen = colorSel?.imagen_url || a.imagen_url;
  const href = `/armazon/${a.id}${colorIdx > 0 && colorSel?.sku ? `?color=${encodeURIComponent(colorSel.sku)}` : ''}`;
  const MAX_DOTS = 5;
  const dv = a.descuento_verly || 0;
  const precio = precioArmazonFinal(a.precio, dv);
  const completo = precio + VISION_PRICES.mono;

  return (
    <Link href={href} className="vc-card">
      {/* Foto */}
      <div className="vc-img">
        {imagen ? (
          <img src={imagen} alt={a.nombre} loading="lazy" />
        ) : (
          <svg width="72" height="40" viewBox="0 0 160 90" fill="none" style={{ opacity: 0.12 }}>
            <rect x="4" y="12" width="64" height="66" rx="14" stroke="var(--charcoal)" strokeWidth="3"/>
            <rect x="92" y="12" width="64" height="66" rx="14" stroke="var(--charcoal)" strokeWidth="3"/>
            <path d="M68 38 C72 32, 88 32, 92 38" stroke="var(--charcoal)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        )}
        <div className="vc-tags">
          {a.badge && (
            <span className={`vc-tag ${['nuevo', 'new'].includes(a.badge.toLowerCase()) ? 'vc-tag-new' : ''}`}>{nombreBadge(a.badge, lang)}</span>
          )}
          {dv > 0 && <span className="vc-tag vc-tag-dark">−{dv}%</span>}
        </div>
        <button
          className={`vc-fav ${liked ? 'on' : ''}`}
          aria-label={t('Favorito', 'Favorite')}
          onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorito({ id: a.id, nombre: a.nombre, imagen_url: a.imagen_url, precio: a.precio, forma: a.forma, material: a.material }); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? 'var(--sage)' : 'none'} stroke={liked ? 'var(--sage)' : 'var(--charcoal)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="vc-body">
        <div className="vc-row">
          <div style={{ minWidth: 0 }}>
            <div className="vc-name">{a.nombre}</div>
            {a.material && <div className="vc-meta">{nombreMaterial(a.material, lang)}</div>}
          </div>
          <div className="vc-price">
            {dv > 0 && <s>${a.precio}</s>}${precio}
          </div>
        </div>

        <div className="vc-dots">
          {colores.length > 1 ? (
            <>
              {colores.slice(0, MAX_DOTS).map((c, i) => (
                <button key={i} type="button" aria-label={nombreColor(c.color, lang)} title={nombreColor(c.color, lang)}
                  className={i === colorIdx ? 'on' : ''}
                  style={{ background: swatchColor(c.color, c.hex) }}
                  onMouseEnter={() => setColorIdx(i)}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setColorIdx(i); }} />
              ))}
              {colores.length > MAX_DOTS && <span className="vc-meta">+{colores.length - MAX_DOTS}</span>}
              <span className="vc-meta vc-colname">{nombreColor(colorSel?.color, lang)}</span>
            </>
          ) : (
            <span className="vc-meta">{colores[0] && !/^[ÚU]NICO$/i.test(colores[0].color.trim()) ? nombreColor(colores[0].color, lang) : ' '}</span>
          )}
        </div>

        <div className="vc-foot">
          <span>{t('Con micas desde', 'With lenses from')} <b>${completo}</b></span>
          <span className="vc-go">{t('Elegir', 'Choose')} →</span>
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
  const [coloresPorModelo, setColoresPorModelo] = useState<Record<number, ColorCard[]>>({});
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [generoTab, setGeneroTab] = useState('all');
  const [filtroForma, setFiltroForma] = useState<string[]>([]);
  const [filtroMaterial, setFiltroMaterial] = useState<string[]>([]);
  const [filtroTalla, setFiltroTalla] = useState<string[]>([]);

  useEffect(() => {
    const genero = searchParams.get('genero');
    if (genero && genero !== 'all') setGeneroTab(genero);
  }, [searchParams]);

  useEffect(() => {
    supabase
      .from('armazones')
      .select('*')
      .eq('activo', true).eq('publicar_verly', true)
      .eq('tipo', 'optico')
      .order('id')
      .then(async ({ data }) => {
        const lista = (data || []) as Armazon[];
        setArmazones(lista);
        setLoading(false);
        // Colores publicados de cada modelo (circulitos de la tarjeta)
        const ids = lista.map(a => a.id);
        if (!ids.length) return;
        const { data: cols } = await supabase.from('armazon_colores')
          .select('*').in('armazon_id', ids).eq('publicar_verly', true).order('orden');
        const mapa: Record<number, ColorCard[]> = {};
        for (const c of (cols || []) as ColorCard[]) (mapa[c.armazon_id] ||= []).push(c);
        setColoresPorModelo(mapa);
      });
  }, []);

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  const clearAll = () => { setFiltroForma([]); setFiltroMaterial([]); setFiltroTalla([]); };
  const nombreForma = (f: string) => lang === 'es' ? (FORMA_ES[f] || f) : f;
  const nActivos = filtroForma.length + filtroMaterial.length + filtroTalla.length;

  const filtered = useMemo(() => {
    let r = [...armazones];
    if (generoTab !== 'all') r = r.filter(a => a.genero === generoTab || a.genero === 'unisex');
    if (filtroForma.length) r = r.filter(a => filtroForma.some(f => a.forma?.toLowerCase().includes(f.toLowerCase())));
    if (filtroMaterial.length) r = r.filter(a => filtroMaterial.some(m => claveMaterial(a.material) === claveMaterial(m)));
    if (filtroTalla.length) r = r.filter(a => filtroTalla.includes(a.talla || 'M'));
    return r;
  }, [armazones, generoTab, filtroForma, filtroMaterial, filtroTalla]);

  // Grupo de chips de filtro (se usa en la barra y en el panel del celular)
  const Grupo = ({ titulo, items, sel, onToggle, etiqueta }: { titulo: string; items: string[]; sel: string[]; onToggle: (v: string) => void; etiqueta: (v: string) => string }) => (
    <div className="vt-group">
      <span className="vt-label">{titulo}</span>
      {items.map(v => (
        <button key={v} className={`vt-chip ${sel.includes(v) ? 'on' : ''}`} onClick={() => onToggle(v)}>{etiqueta(v)}</button>
      ))}
    </div>
  );
  const grupos = (
    <>
      <Grupo titulo={t('Forma', 'Shape')} items={FORMAS} sel={filtroForma} onToggle={v => setFiltroForma(p => toggleArr(p, v))} etiqueta={nombreForma} />
      <Grupo titulo="Material" items={MATERIALES} sel={filtroMaterial} onToggle={v => setFiltroMaterial(p => toggleArr(p, v))} etiqueta={v => nombreMaterial(v, lang)} />
      <Grupo titulo={t('Talla', 'Size')} items={TALLAS} sel={filtroTalla} onToggle={v => setFiltroTalla(p => toggleArr(p, v))} etiqueta={v => v} />
    </>
  );

  return (
    <main className="vt">
      <Navbar />

      {/* ── ENCABEZADO ── */}
      <header className="vt-hero">
        <div className="vt-wrap">
          <p className="vt-kicker">{t('Lentes con graduación', 'Prescription eyeglasses')}</p>
          <h1>{t('Encuentra tu armazón.', 'Find your frame.')}</h1>
          <p className="vt-sub">
            {t(`Cada armazón lleva tus micas con graduación. Tus lentes completos desde $${13 + VISION_PRICES.mono}.`,
               `Every frame comes with your prescription lenses. Complete pairs from $${13 + VISION_PRICES.mono}.`)}
          </p>
          <div className="vt-trust">
            <span>✓ {t('Armazón + micas', 'Frame + lenses')}</span>
            <span>✓ {t(`Envío gratis en EE.UU. desde $${ENVIO_GRATIS_DESDE}`, `Free US shipping over $${ENVIO_GRATIS_DESDE}`)}</span>
            <span>✓ {t('No necesitas aseguranza', 'No insurance needed')}</span>
          </div>
        </div>
      </header>

      {/* ── BARRA: género + filtros ── */}
      <div className="vt-bar">
        <div className="vt-wrap vt-bar-in">
          <div className="vt-seg">
            {[
              { val: 'all',    label: t('Todos', 'All') },
              { val: 'hombre', label: t('Hombre', 'Men') },
              { val: 'mujer',  label: t('Mujer', 'Women') },
              { val: 'unisex', label: 'Unisex' },
            ].map(tab => (
              <button key={tab.val} className={generoTab === tab.val ? 'on' : ''} onClick={() => setGeneroTab(tab.val)}>{tab.label}</button>
            ))}
          </div>
          <div className="vt-bar-r">
            <span className="vt-count">{filtered.length} {t('estilos', 'styles')}</span>
            <button className={`vt-filtros ${nActivos ? 'on' : ''}`} onClick={() => setFiltersOpen(o => !o)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
              {t('Filtros', 'Filters')}{nActivos > 0 && <i>{nActivos}</i>}
            </button>
          </div>
        </div>
        {/* Computadora: los filtros se despliegan debajo de la barra */}
        {filtersOpen && (
          <div className="vt-wrap vt-panel vt-desk">
            {grupos}
            {nActivos > 0 && <button className="vt-clear" onClick={clearAll}>{t('Limpiar filtros', 'Clear filters')}</button>}
          </div>
        )}
      </div>

      {/* ── CATÁLOGO ── */}
      <section id="catalogo" className="vt-wrap vt-cat">
        {loading ? (
          <div className="vt-grid">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="vc-skel" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="vt-empty">
            <h3>{t('Sin resultados', 'No results')}</h3>
            <p>{t('Prueba con otros filtros.', 'Try different filters.')}</p>
            <button className="vt-pill" onClick={clearAll}>{t('Limpiar filtros', 'Clear filters')}</button>
          </div>
        ) : (
          <div className="vt-grid">
            {filtered.map(a => (
              <ArmazonCard key={a.id} a={a} t={t} lang={lang} colores={coloresPorModelo[a.id]} />
            ))}
          </div>
        )}
      </section>

      {/* ── POR QUÉ VERLY ── */}
      <section className="vt-why">
        <div className="vt-wrap">
          <h2>{t('Así de fácil.', 'Easy as that.')}</h2>
          <div className="vt-why-grid">
            {[
              { n: '01', h: t('Elige tu armazón', 'Choose your frame'), p: t('Escoge el estilo y el color que te guste.', 'Pick the style and color you like.') },
              { n: '02', h: t('Agrega tu receta', 'Add your prescription'), p: t('Sube una foto o escríbela. Te recomendamos las micas ideales.', 'Upload a photo or type it in. We’ll recommend the right lenses.') },
              { n: '03', h: t('Te los mandamos', 'We ship them to you'), p: t(`Te llegan a tu casa. Envío gratis desde $${ENVIO_GRATIS_DESDE}.`, `Delivered to your door. Free shipping over $${ENVIO_GRATIS_DESDE}.`) },
            ].map(s => (
              <div key={s.n} className="vt-step">
                <span>{s.n}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CELULAR: panel de filtros desde abajo ── */}
      <div className={`vt-sheet-bg ${filtersOpen ? 'on' : ''}`} onClick={() => setFiltersOpen(false)} />
      <div className={`vt-sheet ${filtersOpen ? 'on' : ''}`}>
        <div className="vt-sheet-h">
          <b>{t('Filtros', 'Filters')}</b>
          <button onClick={() => setFiltersOpen(false)} aria-label={t('Cerrar', 'Close')}>×</button>
        </div>
        <div className="vt-sheet-b">{grupos}</div>
        <div className="vt-sheet-f">
          <button className="vt-pill vt-pill-soft" onClick={() => { clearAll(); }}>{t('Limpiar', 'Clear')}</button>
          <button className="vt-pill vt-pill-main" onClick={() => setFiltersOpen(false)}>{t(`Ver ${filtered.length} estilos`, `Show ${filtered.length} styles`)}</button>
        </div>
      </div>

      <style>{`
        .vt{font-family:var(--font-sans);background:#fff;color:var(--charcoal);min-height:100vh}
        .vt *{-webkit-tap-highlight-color:transparent}
        .vt-wrap{max-width:1280px;margin:0 auto;padding:0 2rem}
        .vt button{font-family:var(--font-sans)}

        /* encabezado */
        .vt-hero{background:#f5f5f7;padding:calc(72px + 3.5rem) 0 3rem}
        .vt-kicker{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--warm-gray);margin:0 0 .75rem}
        .vt-hero h1{font-size:clamp(2.6rem,5.5vw,4.4rem);font-weight:600;letter-spacing:-.035em;line-height:1.02;margin:0 0 1rem}
        .vt-sub{font-size:1.05rem;line-height:1.55;color:#55555a;max-width:520px;margin:0 0 1.5rem}
        .vt-trust{display:flex;gap:1.5rem;flex-wrap:wrap;font-size:13px;color:#55555a}

        /* barra */
        .vt-bar{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid #e8e8ea}
        .vt-bar-in{display:flex;justify-content:space-between;align-items:center;gap:1rem;height:64px}
        .vt-seg{display:flex;background:#f1f1f3;border-radius:999px;padding:4px;gap:2px;overflow-x:auto;scrollbar-width:none}
        .vt-seg button{border:0;background:none;border-radius:999px;padding:8px 16px;font-size:13px;font-weight:500;color:#6e6e73;cursor:pointer;white-space:nowrap;transition:all .2s}
        .vt-seg button.on{background:#fff;color:var(--charcoal);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.08)}
        .vt-bar-r{display:flex;align-items:center;gap:12px;flex-shrink:0}
        .vt-count{font-size:13px;color:var(--warm-gray)}
        .vt-filtros{display:inline-flex;align-items:center;gap:7px;border:1px solid #d9d9dd;background:#fff;border-radius:999px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer;color:var(--charcoal)}
        .vt-filtros.on{border-color:var(--charcoal)}
        .vt-filtros i{font-style:normal;background:var(--sage);color:#fff;border-radius:999px;font-size:11px;padding:1px 7px}
        .vt-panel{padding-top:.25rem;padding-bottom:1.25rem;display:flex;flex-direction:column;gap:.75rem}
        .vt-group{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
        .vt-label{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--warm-gray);min-width:70px}
        .vt-chip{border:1px solid #dcdce0;background:#fff;border-radius:999px;padding:7px 14px;font-size:13px;cursor:pointer;color:var(--charcoal);transition:all .15s}
        .vt-chip:hover{border-color:var(--charcoal)}
        .vt-chip.on{background:var(--sage);border-color:var(--sage);color:#fff}
        .vt-clear{align-self:flex-start;background:none;border:0;color:var(--warm-gray);text-decoration:underline;font-size:13px;cursor:pointer;padding:0}

        /* catálogo */
        .vt-cat{padding-top:2rem;padding-bottom:5rem}
        .vt-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
        .vc-card{display:block;color:inherit;text-decoration:none;border:1px solid #e6e6e9;border-radius:20px;overflow:hidden;background:#fff;transition:border-color .2s,transform .25s}
        .vc-card:hover{border-color:var(--charcoal);transform:translateY(-2px)}
        .vc-img{position:relative;aspect-ratio:4/3;background:#f5f5f7;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .vc-img img{width:100%;height:100%;object-fit:contain;padding:8% 6%;mix-blend-mode:multiply;display:block;transition:transform .6s ease}
        .vc-card:hover .vc-img img{transform:scale(1.04)}
        .vc-tags{position:absolute;top:12px;left:12px;display:flex;gap:6px}
        .vc-tag{font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:#fff;color:var(--charcoal);border-radius:999px;padding:4px 10px}
        .vc-tag-new{background:var(--sage);color:#fff}
        .vc-tag-dark{background:var(--charcoal);color:#fff}
        .vc-fav{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.92);border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s}
        .vc-fav:hover,.vc-fav.on{transform:scale(1.1)}
        .vc-body{padding:14px 16px 16px}
        .vc-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
        .vc-name{font-size:16px;font-weight:600;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .vc-meta{font-size:12.5px;color:var(--warm-gray)}
        .vc-price{font-size:15px;font-weight:600;white-space:nowrap}
        .vc-price s{color:var(--warm-gray);font-weight:400;font-size:13px;margin-right:6px}
        .vc-dots{display:flex;align-items:center;gap:7px;min-height:18px;margin:12px 0}
        .vc-dots button{width:15px;height:15px;border-radius:50%;padding:0;border:0;box-shadow:0 0 0 1px rgba(0,0,0,.14);cursor:pointer;transition:box-shadow .15s}
        .vc-dots button.on{box-shadow:0 0 0 2px #fff,0 0 0 3.5px var(--charcoal)}
        .vc-colname{margin-left:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .vc-foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #efeff1;padding-top:12px;font-size:12.5px;color:#6e6e73}
        .vc-foot b{color:var(--charcoal)}
        .vc-go{font-weight:600;color:var(--sage)}
        .vc-skel{aspect-ratio:3/3.3;border-radius:20px;background:linear-gradient(90deg,#f3f3f5 0%,#fafafb 50%,#f3f3f5 100%);background-size:200% 100%;animation:vcsk 1.2s infinite}
        @keyframes vcsk{to{background-position:-200% 0}}
        .vt-empty{text-align:center;padding:5rem 1rem}
        .vt-empty h3{font-size:1.6rem;font-weight:600;margin:0 0 .5rem}
        .vt-empty p{color:var(--warm-gray);margin:0 0 1.5rem}
        .vt-pill{border:0;border-radius:999px;padding:13px 22px;font-size:14px;font-weight:600;cursor:pointer;background:#ececef;color:var(--charcoal)}
        .vt-pill-main{background:var(--sage);color:#fff}
        .vt-pill-soft{background:#ececef}

        /* así de fácil */
        .vt-why{background:#f5f5f7;padding:5rem 0}
        .vt-why h2{font-size:clamp(2rem,4vw,2.8rem);font-weight:600;letter-spacing:-.03em;margin:0 0 1.75rem}
        .vt-why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .vt-step{background:#fff;border-radius:24px;padding:28px}
        .vt-step span{font-size:12px;font-weight:700;letter-spacing:.12em;color:var(--sage)}
        .vt-step h3{font-size:1.35rem;font-weight:600;letter-spacing:-.02em;margin:.6rem 0 .4rem}
        .vt-step p{color:#6e6e73;font-size:15px;line-height:1.5;margin:0}

        /* panel de filtros en celular */
        .vt-sheet-bg,.vt-sheet{display:none}
        @media (max-width:1100px){.vt-grid{grid-template-columns:repeat(3,1fr)}}
        @media (max-width:900px){
          .vt-wrap{padding:0 1rem}
          .vt-hero{padding:calc(64px + 2rem) 0 2rem}
          .vt-trust{gap:.4rem 1rem;font-size:12.5px}
          .vt-grid{grid-template-columns:repeat(2,1fr);gap:10px}
          .vt-count{display:none}
          .vt-desk{display:none}
          .vc-card{border-radius:16px}
          .vc-body{padding:10px 12px 12px}
          .vc-name{font-size:14.5px}.vc-price{font-size:14px}
          .vc-foot .vc-go{display:none}
          .vc-foot{font-size:11.5px}
          .vt-why-grid{grid-template-columns:1fr}
          .vt-why{padding:3.5rem 0}
          .vt-sheet-bg{display:block;position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:200;opacity:0;pointer-events:none;transition:opacity .25s}
          .vt-sheet-bg.on{opacity:1;pointer-events:auto}
          .vt-sheet{display:flex;flex-direction:column;position:fixed;left:0;right:0;bottom:0;z-index:201;background:#fff;border-radius:20px 20px 0 0;max-height:82vh;transform:translateY(100%);transition:transform .35s cubic-bezier(.4,0,.2,1)}
          .vt-sheet.on{transform:none}
          .vt-sheet-h{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.25rem;border-bottom:1px solid #eee}
          .vt-sheet-h button{width:32px;height:32px;border-radius:50%;border:0;background:#f1f1f3;font-size:18px;cursor:pointer}
          .vt-sheet-b{overflow-y:auto;padding:1rem 1.25rem;display:flex;flex-direction:column;gap:1.1rem}
          .vt-sheet-b .vt-group{flex-direction:row}
          .vt-sheet-b .vt-label{width:100%}
          .vt-sheet-f{display:flex;gap:10px;padding:1rem 1.25rem;border-top:1px solid #eee}
          .vt-sheet-f .vt-pill-main{flex:2}.vt-sheet-f .vt-pill-soft{flex:1}
        }
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
