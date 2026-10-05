// app/Tienda/page.tsx — Catálogo (rediseño: limpio, tarjetas con línea fina, botones píldora)
'use client';
import { useState, useEffect, useMemo, Suspense, Fragment } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { PromoAncho, PromoVertical } from '../components/Promo';
import { useLang } from '../components/LanguageContext';
import { supabase } from '../lib/supabase';
import { useFavoritos } from '../context/FavoritosContext';
import { swatchColor, nombreColor } from '../lib/colores';
import { nombreMaterial, claveMaterial, nombreBadge } from '../lib/textos';
import { precioArmazonFinal, VISION_PRICES } from '../lib/precios';
import { ENVIO_GRATIS_DESDE } from '../lib/envio';
import { GENEROS, FORMAS, AROS, TALLAS, FAMILIAS, familiasDeColor, normForma, tallaDeMedidas } from '../lib/armazon-web';

type Armazon = {
  id: number; nombre: string | null; modelo?: string | null; forma: string | null; genero: string | null;
  precio: number; color: string; imagen_url?: string;
  badge?: string; material?: string; talla?: string; tipo?: string; medidas?: string | null; aro?: string | null;
  color1?: string; descuento?: number; descuento_verly?: number;
};

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
          <img src={imagen} alt={a.nombre || a.modelo || ''} loading="lazy" />
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
          onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorito({ id: a.id, nombre: a.nombre || a.modelo || '', imagen_url: a.imagen_url, precio: a.precio, forma: a.forma ?? undefined, material: a.material }); }}
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
            <div className="vc-name">{a.nombre || a.modelo}</div>
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

// ── Íconos de forma (silueta de la mica) ─────────────────
function IconoForma({ f }: { f: string }) {
  const p: Record<string, React.ReactNode> = {
    rectangle: <rect x="3" y="8" width="13" height="9" rx="2" />,
    square: <rect x="4" y="5.5" width="11" height="11" rx="2.5" />,
    round: <circle cx="9.5" cy="11" r="6" />,
    oval: <ellipse cx="9.5" cy="11" rx="7" ry="5" />,
    aviator: <path d="M3 7.5 h13 c0 6 -3 9.5 -6.5 9.5 S3 13 3 7.5z" />,
    'cat-eye': <path d="M2.5 9 C6 6 13 6 16.5 6.5 C16 13 12 16 8.5 16 C5 16 3 13 2.5 9z" />,
    hexagonal: <path d="M6 5.5 h7 l3.5 5.5 l-3.5 5.5 h-7 l-3.5 -5.5z" />,
  }
  return <svg width="22" height="22" viewBox="0 0 19 22" fill="none" stroke="currentColor" strokeWidth="1.5">{p[f]}</svg>
}

// ── PAGE ─────────────────────────────────────────────────
type Rango = 'm20' | '20a30' | 'p30'
const RANGOS: { v: Rango; es: string; en: string; ok: (p: number) => boolean }[] = [
  { v: 'm20', es: 'Menos de $20', en: 'Under $20', ok: p => p < 20 },
  { v: '20a30', es: '$20 a $30', en: '$20 – $30', ok: p => p >= 20 && p <= 30 },
  { v: 'p30', es: 'Más de $30', en: 'Over $30', ok: p => p > 30 },
]
type Orden = 'rec' | 'precio_asc' | 'precio_desc' | 'nuevos'
type Filtros = { forma: string[]; aro: string[]; material: string[]; talla: string[]; color: string[]; precio: Rango[] }
const VACIO: Filtros = { forma: [], aro: [], material: [], talla: [], color: [], precio: [] }

function TiendaContent() {
  const { t, lang } = useLang() as any;
  const searchParams = useSearchParams();
  const [armazones, setArmazones] = useState<Armazon[]>([]);
  const [coloresPorModelo, setColoresPorModelo] = useState<Record<number, ColorCard[]>>({});
  const [loading, setLoading] = useState(true);
  const [genero, setGenero] = useState('all');
  const [f, setF] = useState<Filtros>(VACIO);
  const [orden, setOrden] = useState<Orden>('rec');
  const [abierto, setAbierto] = useState<string | null>(null);   // qué filtro tiene su ventanita abierta

  useEffect(() => {
    const g = searchParams.get('genero');
    if (g && g !== 'all') setGenero(g);
    // Filtros que llegan desde la portada: ?forma=round, ?material=ACETATE, ?color=transparente
    const lista = (k: string) => (searchParams.get(k) || '').split(',').map(x => x.trim()).filter(Boolean);
    const forma = lista('forma'), material = lista('material'), color = lista('color'), aro = lista('aro');
    if (forma.length || material.length || color.length || aro.length) setF({ ...VACIO, forma, material, color, aro });
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
        const ids = lista.map(a => a.id);
        if (!ids.length) return;
        const { data: cols } = await supabase.from('armazon_colores')
          .select('*').in('armazon_id', ids).eq('publicar_verly', true).order('orden');
        const mapa: Record<number, ColorCard[]> = {};
        for (const c of (cols || []) as ColorCard[]) (mapa[c.armazon_id] ||= []).push(c);
        setColoresPorModelo(mapa);
      });
  }, []);

  // Datos de cada armazón ya normalizados (sirve para nuevos de OptiOS y viejos)
  const info = useMemo(() => armazones.map(a => {
    const cols = coloresPorModelo[a.id] ?? [];
    const nombresColor = cols.length ? cols.map(c => c.color) : [a.color1 || a.color || ''];
    return {
      a,
      forma: normForma(a.forma),
      aro: a.aro ?? null,
      material: claveMaterial(a.material),
      talla: tallaDeMedidas(a.medidas)?.talla ?? (a.talla || null),
      colores: [...new Set(nombresColor.flatMap(familiasDeColor))],
      precio: precioArmazonFinal(a.precio, a.descuento_verly),
    };
  }), [armazones, coloresPorModelo]);

  const pasaGenero = (x: typeof info[number]) => genero === 'all' || x.a.genero === genero || (x.a.genero === 'unisex' && genero !== 'nino');
  const pasa = (x: typeof info[number], fx: Filtros) =>
    (!fx.forma.length || (x.forma !== null && fx.forma.includes(x.forma))) &&
    (!fx.aro.length || (x.aro !== null && fx.aro.includes(x.aro))) &&
    (!fx.material.length || fx.material.includes(x.material)) &&
    (!fx.talla.length || (x.talla !== null && fx.talla.includes(x.talla))) &&
    (!fx.color.length || x.colores.some(c => fx.color.includes(c))) &&
    (!fx.precio.length || fx.precio.some(r => RANGOS.find(z => z.v === r)!.ok(x.precio)))

  const filtered = useMemo(() => {
    const r = info.filter(x => pasaGenero(x) && pasa(x, f))
    if (orden === 'precio_asc') r.sort((p, q) => p.precio - q.precio)
    else if (orden === 'precio_desc') r.sort((p, q) => q.precio - p.precio)
    else if (orden === 'nuevos') r.sort((p, q) => q.a.id - p.a.id)
    else r.sort((p, q) => Number(!!q.a.badge) - Number(!!p.a.badge))
    return r.map(x => x.a)
  }, [info, genero, f, orden]); // eslint-disable-line react-hooks/exhaustive-deps

  // Opciones que de verdad existen (no ofrecer filtros que dejan 0) + cuántos hay de cada una
  const base = info.filter(pasaGenero)
  const cuenta = (campo: keyof Filtros, v: string) => base.filter(x => pasa(x, { ...f, [campo]: [v] })).length
  const toggle = (campo: keyof Filtros, v: string) => setF(p => ({ ...p, [campo]: (p[campo] as string[]).includes(v) ? (p[campo] as string[]).filter(z => z !== v) : [...(p[campo] as string[]), v] }))
  const limpiar = () => setF(VACIO)
  const nActivos = Object.values(f).reduce((s, l) => s + l.length, 0)

  const materialesDisp = [...new Set(info.map(x => x.material).filter(Boolean))].sort()
  const etiquetaMaterial = (k: string) => nombreMaterial(info.find(x => x.material === k)?.a.material ?? k, lang)

  type Opcion = { v: string; label: string; icono?: React.ReactNode; swatch?: string }
  const FILTROS: { k: keyof Filtros; titulo: string; opciones: Opcion[] }[] = [
    { k: 'forma', titulo: t('Forma', 'Shape'), opciones: FORMAS.map(o => ({ v: o.v, label: lang === 'es' ? o.es : o.en, icono: <IconoForma f={o.v} /> })) },
    { k: 'aro', titulo: t('Tipo', 'Frame type'), opciones: AROS.map(o => ({ v: o.v, label: lang === 'es' ? o.es : o.en })) },
    { k: 'material', titulo: 'Material', opciones: materialesDisp.map(m => ({ v: m, label: etiquetaMaterial(m) })) },
    { k: 'talla', titulo: t('Talla', 'Size'), opciones: TALLAS.map(o => ({ v: o.v, label: `${o.v} · ${lang === 'es' ? o.es : o.en}` })) },
    { k: 'color', titulo: 'Color', opciones: FAMILIAS.map(o => ({ v: o.v, label: lang === 'es' ? o.es : o.en, swatch: o.hex })) },
    { k: 'precio', titulo: t('Precio', 'Price'), opciones: RANGOS.map(o => ({ v: o.v, label: lang === 'es' ? o.es : o.en })) },
  ]
  const ORDENES: { v: Orden; label: string }[] = [
    { v: 'rec', label: t('Recomendados', 'Featured') },
    { v: 'precio_asc', label: t('Precio: menor a mayor', 'Price: low to high') },
    { v: 'precio_desc', label: t('Precio: mayor a menor', 'Price: high to low') },
    { v: 'nuevos', label: t('Lo más nuevo', 'Newest') },
  ]

  const panel = (fl: typeof FILTROS[number]) => {
    const opciones = fl.opciones.map(o => ({ ...o, n: cuenta(fl.k, o.v) })).filter(o => o.n > 0 || (f[fl.k] as string[]).includes(o.v))
    return (
      <>
        <div className={`vf-ops ${fl.k === 'forma' ? 'vf-ops-forma' : ''} ${fl.k === 'color' ? 'vf-ops-color' : ''}`}>
          {opciones.length === 0 && <p className="vf-nada">{t('No hay opciones con los filtros actuales.', 'No options with the current filters.')}</p>}
          {opciones.map(o => {
            const on = (f[fl.k] as string[]).includes(o.v)
            return (
              <button key={o.v} className={`vf-op ${on ? 'on' : ''}`} onClick={() => toggle(fl.k, o.v)}>
                {o.icono && <span className="vf-ico">{o.icono}</span>}
                {o.swatch && <span className="vf-sw" style={{ background: o.swatch }} />}
                <span className="vf-lb">{o.label}</span>
                <span className="vf-n">{o.n}</span>
              </button>
            )
          })}
        </div>
        <div className="vf-pie">
          {(f[fl.k] as string[]).length > 0 ? <button className="vf-limpiar" onClick={() => setF(p => ({ ...p, [fl.k]: [] }))}>{t('Quitar', 'Clear')}</button> : <span />}
          <button className="vt-pill vt-pill-main vf-ver" onClick={() => setAbierto(null)}>{t(`Ver ${filtered.length}`, `Show ${filtered.length}`)}</button>
        </div>
      </>
    )
  }

  const chipsActivos = FILTROS.flatMap(fl => (f[fl.k] as string[]).map(v => ({ k: fl.k, v, label: fl.opciones.find(o => o.v === v)?.label ?? v })))

  return (
    <main className="vt">
      <Navbar />

      {/* ── ENCABEZADO ── */}
      <header className="vt-hero">
        <div className="vt-wrap">
          <p className="vt-kicker">{t('Lentes con graduación', 'Prescription eyeglasses')}</p>
          <h1>{t('Encuentra tu armazón.', 'Find your frame.')}</h1>
        </div>
      </header>

      {/* ── BARRA DE FILTROS (una sola fila) ── */}
      <div className="vt-bar">
        <div className="vt-wrap vf-fila">
          <div className="vt-seg">
            {[{ v: 'all', es: 'Todos', en: 'All' }, ...GENEROS].map(g => (
              <button key={g.v} className={genero === g.v ? 'on' : ''} onClick={() => setGenero(g.v)}>{lang === 'es' ? g.es : g.en}</button>
            ))}
          </div>
          <div className="vf-botones">
            {FILTROS.map(fl => {
              const n = (f[fl.k] as string[]).length
              return (
                <div key={fl.k} className="vf-item">
                  <button className={`vf-btn ${n ? 'activo' : ''} ${abierto === fl.k ? 'abierto' : ''}`} onClick={() => setAbierto(a => a === fl.k ? null : fl.k)}>
                    {fl.titulo}{n > 0 && <i>{n}</i>}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  {abierto === fl.k && <div className="vf-pop"><div className="vf-pop-h"><b>{fl.titulo}</b><button onClick={() => setAbierto(null)} aria-label={t('Cerrar', 'Close')}>×</button></div>{panel(fl)}</div>}
                </div>
              )
            })}
            <div className="vf-item vf-orden">
              <button className={`vf-btn ${abierto === 'orden' ? 'abierto' : ''}`} onClick={() => setAbierto(a => a === 'orden' ? null : 'orden')}>
                {t('Ordenar', 'Sort')}: <b>{ORDENES.find(o => o.v === orden)?.label}</b>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {abierto === 'orden' && (
                <div className="vf-pop vf-pop-der">
                  <div className="vf-pop-h"><b>{t('Ordenar', 'Sort')}</b><button onClick={() => setAbierto(null)} aria-label={t('Cerrar', 'Close')}>×</button></div>
                  <div className="vf-ops">
                    {ORDENES.map(o => <button key={o.v} className={`vf-op ${orden === o.v ? 'on' : ''}`} onClick={() => { setOrden(o.v); setAbierto(null) }}><span className="vf-lb">{o.label}</span></button>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {(chipsActivos.length > 0) && (
          <div className="vt-wrap vf-activos">
            {chipsActivos.map(c => (
              <button key={`${c.k}-${c.v}`} className="vf-chip" onClick={() => toggle(c.k, c.v)}>{c.label} <span>×</span></button>
            ))}
            <button className="vf-limpiar" onClick={limpiar}>{t('Limpiar todo', 'Clear all')}</button>
            <span className="vf-total">{filtered.length} {t('estilos', 'styles')}</span>
          </div>
        )}
      </div>
      {abierto && <div className="vf-fondo" onClick={() => setAbierto(null)} />}

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
            <button className="vt-pill" onClick={() => { limpiar(); setGenero('all') }}>{t('Limpiar filtros', 'Clear filters')}</button>
          </div>
        ) : (
          <div className="vt-grid">
            {filtered.map((a, i) => (
              <Fragment key={a.id}>
                <ArmazonCard a={a} t={t} lang={lang} colores={coloresPorModelo[a.id]} />
                {/* Fotocromático arriba: después de 2 armazones, ocupa 2 filas */}
                {i === 1 && filtered.length > 6 && <PromoVertical clave="fotocromatico" />}
                {/* Progresivos entre la 3ª y 4ª fila (6 armazones junto al vertical + 4 de la 3ª) */}
                {i === 9 && filtered.length > 12 && <PromoAncho clave="progresivos" enGrid />}
              </Fragment>
            ))}
          </div>
        )}
      </section>

      {/* ── ASÍ DE FÁCIL ── */}
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

      <style>{`

        .vt{font-family:var(--font-sans);background:#fff;color:var(--charcoal);min-height:100vh}
        .vt *{-webkit-tap-highlight-color:transparent}
        .vt-wrap{max-width:1280px;margin:0 auto;padding:0 2rem}
        .vt button{font-family:var(--font-sans)}

        /* encabezado */
        .vt-hero{background:var(--cream);padding:calc(72px + 2rem) 0 1.25rem}
        .vt-kicker{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--warm-gray);margin:0 0 .75rem}
        .vt-hero h1{font-size:clamp(2.6rem,5.5vw,4.4rem);font-weight:600;letter-spacing:-.035em;line-height:1.02;margin:0 0 1rem}
        .vt-sub{font-size:1.05rem;line-height:1.55;color:#55555a;max-width:520px;margin:0 0 1.5rem}
        .vt-trust{display:flex;gap:1.5rem;flex-wrap:wrap;font-size:13px;color:#55555a}

        /* barra */
        .vt-bar{position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid #e8e8ea}
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
        .vt-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;grid-auto-flow:dense}
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
          .vt-hero{padding:calc(64px + 1.25rem) 0 1rem}
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
      
        /* filtros compactos */
        .vf-fila{display:flex;align-items:center;gap:12px;min-height:64px;padding-top:10px;padding-bottom:10px}
        .vf-botones{display:flex;gap:8px;align-items:center;flex:1;min-width:0}
        .vf-item{position:relative}
        .vf-orden{margin-left:auto}
        .vf-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid #dcdce0;background:#fff;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:500;color:var(--charcoal);cursor:pointer;white-space:nowrap;transition:border-color .15s}
        .vf-btn:hover,.vf-btn.abierto{border-color:var(--charcoal)}
        .vf-btn.activo{border-color:var(--sage);background:#f1f4ef}
        .vf-btn i{font-style:normal;background:var(--sage);color:#fff;border-radius:999px;font-size:11px;padding:0 6px;line-height:17px}
        .vf-btn b{font-weight:600}
        .vf-btn svg{opacity:.55}
        .vf-fondo{position:fixed;inset:0;z-index:49}
        .vf-pop{position:absolute;top:calc(100% + 8px);left:0;z-index:60;background:#fff;border:1px solid #e6e6e9;border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.12);padding:14px;min-width:280px;max-width:360px}
        .vf-pop-der{left:auto;right:0}
        .vf-pop-h{display:none}
        .vf-ops{display:flex;flex-direction:column;gap:2px;max-height:320px;overflow-y:auto}
        .vf-ops-forma{display:grid;grid-template-columns:1fr 1fr;gap:6px}
        .vf-ops-color{display:grid;grid-template-columns:1fr 1fr;gap:4px}
        .vf-op{display:flex;align-items:center;gap:10px;border:1px solid transparent;background:none;border-radius:10px;padding:9px 10px;font-size:13.5px;color:var(--charcoal);cursor:pointer;text-align:left}
        .vf-op:hover{background:#f5f5f7}
        .vf-op.on{border-color:var(--sage);background:#f1f4ef;font-weight:600}
        .vf-ops-forma .vf-op{flex-direction:column;gap:4px;padding:12px 6px;border-color:#ececef;text-align:center}
        .vf-ops-forma .vf-op.on{border-color:var(--sage)}
        .vf-ico{color:var(--charcoal);display:flex}
        .vf-sw{width:18px;height:18px;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,.14);flex-shrink:0}
        .vf-lb{flex:1}
        .vf-n{font-size:11.5px;color:var(--warm-gray)}
        .vf-ops-forma .vf-n{display:none}
        .vf-nada{font-size:13px;color:var(--warm-gray);padding:6px}
        .vf-pie{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid #efeff1}
        .vf-ver{padding:9px 18px;font-size:13px}
        .vf-limpiar{background:none;border:0;color:var(--warm-gray);text-decoration:underline;font-size:13px;cursor:pointer;padding:0}
        .vf-activos{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding-bottom:12px}
        .vf-chip{display:inline-flex;gap:6px;align-items:center;border:0;background:#f1f4ef;color:var(--sage);border-radius:999px;padding:6px 12px;font-size:12.5px;font-weight:600;cursor:pointer}
        .vf-chip span{font-size:15px;line-height:1;opacity:.7}
        .vf-total{margin-left:auto;font-size:12.5px;color:var(--warm-gray)}
        @media (max-width:1100px){.vf-fila{flex-wrap:wrap}.vf-botones{overflow-x:auto;scrollbar-width:none;padding-bottom:2px}.vf-botones::-webkit-scrollbar{display:none}}
        @media (max-width:900px){
          .vf-fila{flex-direction:column;align-items:stretch;gap:10px;flex-wrap:nowrap}
          .vf-botones{width:100%;max-width:100%}
          .vt-seg{align-self:flex-start;max-width:100%}
          .vf-orden{margin-left:0}
          .vf-item{position:static}
          .vf-pop,.vf-pop-der{position:fixed;left:0;right:0;bottom:0;top:auto;max-width:none;min-width:0;border-radius:20px 20px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom));max-height:78vh;display:flex;flex-direction:column;animation:vfsube .25s ease}
          .vf-pop-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
          .vf-pop-h button{width:32px;height:32px;border-radius:50%;border:0;background:#f1f1f3;font-size:18px;cursor:pointer}
          .vf-ops{max-height:none;flex:1}
          .vf-fondo{background:rgba(0,0,0,.35)}
          .vf-op{padding:12px 10px;font-size:14.5px}
          .vf-total{width:100%;margin-left:0}
        }
        @keyframes vfsube{from{transform:translateY(100%)}to{transform:none}}
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
