// app/armazon/[id]/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useLang } from '../../components/LanguageContext';
import { supabase } from '../../supabase';

type Armazon = {
  id: number; nombre: string; forma: string; genero: string;
  stock: number; badge: string | null; precio: number; color: string;
  imagen_url?: string; imagen2_url?: string; imagen3_url?: string;
  imagen4_url?: string; imagen5_url?: string; tipo?: string;
  material?: string; medidas?: string; talla?: string; descuento?: number;
  color1?: string; color2?: string; color3?: string; modelo?: string;
};

type PaqueteVerly = {
  vision: { id: string; nombre: string; nombre_en: string; precio: number };
  material: { id: string; nombre: string; nombre_en: string; precio: number };
  filtroBase: { id: string; nombre: string; nombre_en: string; precio: number };
  precioOriginal: number; precioFinal: number; descuento: number;
  condicion: string; explicacion: string;
  upsells: { id: string; nombre: string; precio: number; razon: string }[];
};

type RecetaData = {
  sph_od: number | null; cyl_od: number | null; axis_od: number | null;
  sph_os: number | null; cyl_os: number | null; axis_os: number | null;
  add: number | null; dp: number | null; prisma: string;
};

type RecetaEstado = 'sin_receta' | 'manual' | 'foto' | 'despues' | 'sin_graduacion' | 'guardada';

const PRECIO_ARMAZON = 13;

const visionOpts = [
  { id: 'mono', nombre: 'Monofocal básico', nombre_en: 'Single Vision', desc_es: 'Para ver de lejos o cerca. Ideal para uso diario.', desc_en: 'For distance or near vision. Great for everyday use.', precio: 15 },
  { id: 'bi', nombre: 'Bifocal', nombre_en: 'Bifocal', desc_es: 'Para ver de lejos y cerca con línea visible.', desc_en: 'For distance and near vision with a visible line.', precio: 49 },
  { id: 'prog', nombre: 'Progresivo', nombre_en: 'Progressive', desc_es: 'Visión para todas las distancias sin línea visible.', desc_en: 'All-distance vision without a visible line.', precio: 89 },
];

const materialOpts = [
  { id: 'cr39', nombre: 'Standard Vision', nombre_en: 'Standard Vision', desc_es: 'Mica básica para graduaciones bajas y uso diario.', desc_en: 'Basic lens for low prescriptions and everyday use.', precio: 0 },
  { id: 'poly', nombre: 'Thin & Durable', nombre_en: 'Thin & Durable', desc_es: 'Más resistente, ligera y recomendada para uso diario.', desc_en: 'Stronger, lighter, and recommended for everyday wear.', precio: 29 },
  { id: 'hd', nombre: 'ClearView Plus', nombre_en: 'ClearView Plus', desc_es: 'Mejor claridad visual y apariencia más ligera.', desc_en: 'Better visual clarity with a lighter look.', precio: 39 },
  { id: 'hi', nombre: 'Ultra Thin', nombre_en: 'Ultra Thin', desc_es: 'Ideal para graduaciones medias-altas. Más delgada y estética.', desc_en: 'Ideal for medium-high prescriptions. Thinner and cleaner look.', precio: 59 },
  { id: 'shi', nombre: 'Ultra Thin Pro', nombre_en: 'Ultra Thin Pro', desc_es: 'Nuestra opción más delgada para graduaciones altas.', desc_en: 'Our thinnest option for high prescriptions.', precio: 89 },
];

const filtroOpts = [
  { id: 'ar', nombre: 'Essential AR', nombre_en: 'Essential AR', desc_es: 'Reduce reflejos básicos para una visión más cómoda.', desc_en: 'Reduces basic reflections for more comfortable vision.', precio: 11 },
  { id: 'blue', nombre: 'Blue Light Comfort', nombre_en: 'Blue Light Comfort', desc_es: 'Ayuda si usas computadora, celular o pantallas por muchas horas.', desc_en: 'Helpful if you use computers, phones, or screens for long hours.', precio: 18 },
  { id: 'foto', nombre: 'Fotocromático', nombre_en: 'Photochromic', desc_es: 'Se oscurece en exterior y vuelve claro en interior.', desc_en: 'Darkens outdoors and returns clear indoors.', precio: 49 },
  { id: 'anti', nombre: 'Anti-Fog', nombre_en: 'Anti-Fog', desc_es: 'Ayuda a reducir el empañamiento.', desc_en: 'Helps reduce fogging.', precio: 15 },
  { id: 'arprem', nombre: 'Premium Clarity AR', nombre_en: 'Premium Clarity AR', desc_es: 'Mejor antirreflejante. Ideal para manejar de noche.', desc_en: 'Better anti-reflective coating. Ideal for night driving.', precio: 24 },
  { id: 'pol', nombre: 'Polarizado', nombre_en: 'Polarized', desc_es: 'Reduce reflejos fuertes en exterior. Ideal para lentes de sol.', desc_en: 'Reduces strong outdoor glare. Ideal for sunglasses.', precio: 70 },
  { id: 'tinte', nombre: 'Tinte estético', nombre_en: 'Fashion Tint', desc_es: 'Agrega color a tus lentes para un look personalizado.', desc_en: 'Adds color to your lenses for a personalized look.', precio: 28 },
];

const filtroOptsSolar = [
  { id: 'pol', nombre: 'Polarizado', nombre_en: 'Polarized', desc_es: 'Elimina reflejos intensos. El estándar para lentes de sol de calidad.', desc_en: 'Eliminates intense glare. The standard for quality sunglasses.', precio: 70 },
  { id: 'foto', nombre: 'Fotocromático', nombre_en: 'Photochromic', desc_es: 'Se oscurece en exterior y aclara en interior automáticamente.', desc_en: 'Darkens outdoors and clears indoors automatically.', precio: 49 },
  { id: 'tinte', nombre: 'Tinte estético', nombre_en: 'Fashion Tint', desc_es: 'Elige el color de tus lentes para un look único.', desc_en: 'Choose your lens color for a unique look.', precio: 28 },
  { id: 'arprem', nombre: 'Premium Clarity AR', nombre_en: 'Premium Clarity AR', desc_es: 'Reduce reflejos internos para mayor claridad.', desc_en: 'Reduces internal reflections for better clarity.', precio: 24 },
  { id: 'anti', nombre: 'Anti-Fog', nombre_en: 'Anti-Fog', desc_es: 'Ayuda a reducir el empañamiento.', desc_en: 'Helps reduce fogging.', precio: 15 },
];

const COLORES_FOTO = [
  { id: 'gris', nombre_es: 'Gris', nombre_en: 'Gray', hex: '#6B7280' },
  { id: 'cafe', nombre_es: 'Café', nombre_en: 'Brown', hex: '#92400E' },
  { id: 'rosa', nombre_es: 'Rosa', nombre_en: 'Pink', hex: '#EC4899' },
  { id: 'azul', nombre_es: 'Azul', nombre_en: 'Blue', hex: '#3B82F6' },
  { id: 'morado', nombre_es: 'Morado', nombre_en: 'Purple', hex: '#8B5CF6' },
  { id: 'amarillo', nombre_es: 'Amarillo', nombre_en: 'Yellow', hex: '#F59E0B' },
];

const COLORES_POLARIZADO = [
  { id: 'negro', nombre_es: 'Negro', nombre_en: 'Black', hex: '#1A1A2E' },
  { id: 'cafe', nombre_es: 'Café', nombre_en: 'Brown', hex: '#92400E' },
];

const COLORES_TINTE = [
  { id: 'negro', nombre_es: 'Negro', nombre_en: 'Black', hex: '#1A1A2E' },
  { id: 'cafe', nombre_es: 'Café', nombre_en: 'Brown', hex: '#92400E' },
  { id: 'gris', nombre_es: 'Gris', nombre_en: 'Gray', hex: '#6B7280' },
  { id: 'azul', nombre_es: 'Azul', nombre_en: 'Blue', hex: '#3B82F6' },
  { id: 'morado', nombre_es: 'Morado', nombre_en: 'Purple', hex: '#8B5CF6' },
  { id: 'rosa', nombre_es: 'Rosa', nombre_en: 'Pink', hex: '#EC4899' },
  { id: 'verde', nombre_es: 'Verde', nombre_en: 'Green', hex: '#4A7C59' },
  { id: 'ambar', nombre_es: 'Ámbar', nombre_en: 'Amber', hex: '#D97706' },
];

function getColoresDisponibles(visionId: string, materialId: string) {
  const soloGris = [{ id: 'gris', nombre_es: 'Gris', nombre_en: 'Gray', hex: '#6B7280' }];
  if (visionId === 'bi') return soloGris;
  if (visionId === 'mono') {
    if (materialId === 'cr39' || materialId === 'hi') return COLORES_FOTO;
    return soloGris;
  }
  if (visionId === 'prog') {
    if (materialId === 'cr39' || materialId === 'hi' || materialId === 'hd')
      return COLORES_FOTO.filter(c => c.id === 'gris' || c.id === 'cafe');
    return soloGris;
  }
  return soloGris;
}

function range(min: number, max: number, step: number): number[] {
  const result: number[] = [];
  for (let v = min; v <= max + 0.001; v += step) result.push(parseFloat(v.toFixed(2)));
  return result;
}

const SPH_OPTS = range(-20, 20, 0.25);
const CYL_OPTS = range(-8, 8, 0.25);
const AXIS_OPTS = range(1, 180, 1);
const ADD_OPTS = range(0.75, 3.50, 0.25);
const DP_OPTS = range(35, 79, 0.5);

function CeldaReceta({ value, onChange, options, disabled, unit }: {
  value: number | null; onChange: (v: number | null) => void;
  options: number[]; disabled?: boolean; unit?: 'axis' | 'dp' | 'add' | 'sph' | 'cyl';
}) {
  const [open, setOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [abreArriba, setAbreArriba] = useState(false);

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setAbreArriba(window.innerHeight - rect.bottom < 260);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setBusqueda(''); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        if (!busqueda) {
          const el = listRef.current?.querySelector(`[data-val="${value ?? 0}"]`) as HTMLElement;
          if (el) el.scrollIntoView({ block: 'center' });
        }
      }, 60);
    } else setBusqueda('');
  }, [open]);

  const formatVal = (v: number) => {
    if (unit === 'axis') return `${v}°`;
    if (unit === 'dp') return v.toFixed(1);
    return (v >= 0 ? '+' : '') + v.toFixed(2);
  };

  const opcionesFiltradas = busqueda.trim()
    ? (() => {
        const num = parseFloat(busqueda.replace(',', '.'));
        if (isNaN(num)) return options.filter(o => formatVal(o).includes(busqueda));
        return [...options].sort((a, b) => Math.abs(a - num) - Math.abs(b - num)).slice(0, 15);
      })()
    : options;

  const usarGrid = unit === 'add' || unit === 'dp';
  const isEmpty = value === null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => !disabled && setOpen(!open)} disabled={disabled} style={{ width: '100%', padding: '8px 4px', background: disabled ? '#F5F5F5' : open ? '#f0f4ef' : isEmpty ? '#FAFAFA' : 'white', border: `1.5px solid ${disabled ? '#e5e5e5' : open ? '#55624c' : isEmpty ? '#e5e5e5' : '#55624c'}`, borderRadius: '6px', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans), sans-serif', transition: 'all 0.15s', textAlign: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.3px', color: disabled ? '#ccc' : isEmpty ? '#9a9a9a' : value === 0 ? '#9a9a9a' : '#1d1d1d' }}>
          {disabled ? '—' : isEmpty ? '—' : formatVal(value!)}
        </span>
      </button>
      {open && !disabled && (
        <div style={{ position: 'absolute', ...(abreArriba ? { bottom: 'calc(100% + 4px)', top: 'auto' } : { top: 'calc(100% + 4px)', bottom: 'auto' }), left: '50%', transform: 'translateX(-50%)', width: usarGrid ? '200px' : '130px', background: 'white', borderRadius: '8px', zIndex: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
          <div style={{ padding: '6px', borderBottom: '1px solid #f0f0f0', background: '#fafaf9' }}>
            <input ref={inputRef} type="text" placeholder={unit === 'axis' ? 'Ej: 90' : unit === 'dp' ? 'Ej: 63' : 'Ej: -1.25'} value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #e5e5e5', fontSize: '12px', outline: 'none', boxSizing: 'border-box', textAlign: 'center', background: 'white', fontFamily: 'var(--font-sans)' }}/>
          </div>
          <div onClick={() => { onChange(null); setOpen(false); }} style={{ padding: '7px', cursor: 'pointer', fontSize: '13px', color: '#9a9a9a', fontWeight: 500, textAlign: 'center', borderBottom: '1px solid #f0f0f0', background: isEmpty ? '#f5f1eb' : 'white' }}>—</div>
          {usarGrid ? (
            <div ref={listRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', padding: '6px', maxHeight: '200px', overflowY: 'auto' }}>
              {opcionesFiltradas.map(opt => (
                <div key={opt} data-val={opt} onClick={() => { onChange(opt); setOpen(false); setBusqueda(''); }} style={{ padding: '8px 4px', cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: value === opt ? 700 : 400, color: value === opt ? 'white' : '#1d1d1d', background: value === opt ? '#55624c' : '#faf9f7', borderRadius: '4px', transition: 'all 0.1s' }}>{formatVal(opt)}</div>
              ))}
            </div>
          ) : (
            <div ref={listRef} style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {opcionesFiltradas.map(opt => (
                <div key={opt} data-val={opt} onClick={() => { onChange(opt); setOpen(false); setBusqueda(''); }} style={{ padding: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '13px', fontWeight: value === opt ? 700 : 400, color: value === opt ? '#55624c' : '#1d1d1d', background: value === opt ? '#f0f4ef' : 'white', borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s' }}>{formatVal(opt)}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FormReceta({ receta, onChange, errores, t }: { receta: RecetaData; onChange: (r: RecetaData) => void; errores: string[]; t: (es: string, en: string) => string; }) {
  const cylOdActivo = receta.cyl_od !== null && receta.cyl_od !== 0;
  const cylOsActivo = receta.cyl_os !== null && receta.cyl_os !== 0;
  return (
    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e8e5e0', overflow: 'visible' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', overflow: 'visible' }}>
        <thead>
          <tr style={{ background: '#faf9f7' }}>
            <th style={{ padding: '10px 8px', width: '52px', borderBottom: '1px solid #f0ede8' }}></th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 600, color: '#6f6a63', letterSpacing: '1px', textAlign: 'center', borderBottom: '1px solid #f0ede8' }}>SPH *</th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 600, color: '#6f6a63', letterSpacing: '1px', textAlign: 'center', borderBottom: '1px solid #f0ede8' }}>CYL</th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 600, color: '#6f6a63', letterSpacing: '1px', textAlign: 'center', borderBottom: '1px solid #f0ede8' }}>{t('EJE', 'AXIS')}</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #f5f3ef' }}>
            <td style={{ padding: '8px', textAlign: 'center' }}>
              <span style={{ background: '#55624c', color: 'white', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '2px' }}>OD</span>
              <span style={{ fontSize: '9px', color: '#6f6a63' }}>{t('Der.', 'Right')}</span>
            </td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.sph_od} onChange={v => onChange({ ...receta, sph_od: v })} options={SPH_OPTS} unit="sph"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.cyl_od} onChange={v => onChange({ ...receta, cyl_od: v, axis_od: (!v || v === 0) ? null : receta.axis_od })} options={CYL_OPTS} unit="cyl"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={cylOdActivo ? receta.axis_od : null} onChange={v => onChange({ ...receta, axis_od: v })} options={AXIS_OPTS} disabled={!cylOdActivo} unit="axis"/></td>
          </tr>
          <tr>
            <td style={{ padding: '8px', textAlign: 'center' }}>
              <span style={{ background: '#6f7f62', color: 'white', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '2px' }}>OS</span>
              <span style={{ fontSize: '9px', color: '#6f6a63' }}>{t('Izq.', 'Left')}</span>
            </td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.sph_os} onChange={v => onChange({ ...receta, sph_os: v })} options={SPH_OPTS} unit="sph"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.cyl_os} onChange={v => onChange({ ...receta, cyl_os: v, axis_os: (!v || v === 0) ? null : receta.axis_os })} options={CYL_OPTS} unit="cyl"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={cylOsActivo ? receta.axis_os : null} onChange={v => onChange({ ...receta, axis_os: v })} options={AXIS_OPTS} disabled={!cylOsActivo} unit="axis"/></td>
          </tr>
        </tbody>
      </table>
      <div style={{ padding: '10px 8px', background: '#faf9f7', borderTop: '1px solid #f0ede8', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#6f6a63', letterSpacing: '0.5px', textAlign: 'center', marginBottom: '5px' }}>ADD <span style={{ fontWeight: 400, fontSize: '9px' }}>({t('ambos ojos', 'both eyes')})</span></div>
          <CeldaReceta value={receta.add} onChange={v => onChange({ ...receta, add: v })} options={ADD_OPTS} unit="add"/>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#6f6a63', letterSpacing: '0.5px', textAlign: 'center', marginBottom: '5px' }}>DP / PD <span style={{ fontWeight: 400, fontSize: '9px' }}>({t('total', 'total')})</span></div>
          <CeldaReceta value={receta.dp} onChange={v => onChange({ ...receta, dp: v })} options={DP_OPTS} unit="dp"/>
        </div>
      </div>
      <div style={{ padding: '8px 10px', borderTop: '1px solid #f0ede8' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: '#6f6a63', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>{t('Prisma / Notas', 'Prism / Notes')}</div>
        <input type="text" placeholder={t('Ej: 1.0 base OUT OD', 'Ex: 1.0 base OUT OD')} value={receta.prisma} onChange={e => onChange({ ...receta, prisma: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e8e5e0', fontSize: '12px', color: '#1d1d1d', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }} onFocus={e => (e.currentTarget.style.borderColor = '#55624c')} onBlur={e => (e.currentTarget.style.borderColor = '#e8e5e0')}/>
      </div>
      {errores.length > 0 && (
        <div style={{ padding: '8px 10px', borderTop: '1px solid #ffe0e0', background: '#fff5f5' }}>
          {errores.map((e, i) => <div key={i} style={{ fontSize: '12px', color: '#c0392b', fontWeight: 500, marginBottom: i < errores.length - 1 ? '3px' : 0 }}>⚠ {e}</div>)}
        </div>
      )}
    </div>
  );
}

function calcularPaquete(r: RecetaData, lang: 'es' | 'en'): PaqueteVerly {
  const sph_od = r.sph_od ?? 0, sph_os = r.sph_os ?? 0;
  const cyl_od = r.cyl_od ?? 0, cyl_os = r.cyl_os ?? 0;
  const add = r.add ?? 0;
  const eq = Math.max(Math.abs(sph_od + cyl_od / 2), Math.abs(sph_os + cyl_os / 2));
  const cyl = Math.max(Math.abs(cyl_od), Math.abs(cyl_os));
  const astigmatismo = cyl >= 0.75;
  let vision = visionOpts[0];
  if (add > 0) vision = visionOpts[2];
  let material = materialOpts[1];
  if (eq > 4.0) material = materialOpts[4];
  else if (eq > 2.0) material = materialOpts[3];
  const filtroBase = astigmatismo || add > 0 ? filtroOpts[4] : filtroOpts[2];
  let condicion = '', explicacion = '';
  if (add > 0) { condicion = lang === 'es' ? 'Presbicia' : 'Presbyopia'; explicacion = lang === 'es' ? `Tienes adición (ADD +${add.toFixed(2)}), indicando presbicia.` : `You have presbyopia. Progressive lenses correct all distances.`; }
  else if (cyl >= 1.50) { condicion = lang === 'es' ? 'Astigmatismo alto' : 'High astigmatism'; explicacion = lang === 'es' ? 'Astigmatismo alto detectado. Premium Clarity AR ayuda a reducir reflejos.' : 'High astigmatism detected. Premium Clarity AR helps reduce reflections.'; }
  else if (astigmatismo) { condicion = lang === 'es' ? 'Astigmatismo' : 'Astigmatism'; explicacion = lang === 'es' ? 'Tienes astigmatismo. Premium Clarity AR mejora la comodidad visual.' : 'You have astigmatism. Premium Clarity AR improves visual comfort.'; }
  else if (eq > 4.0) { condicion = lang === 'es' ? 'Graduación muy alta' : 'Very high prescription'; explicacion = lang === 'es' ? 'El Ultra Thin Pro hará tus lentes delgados y elegantes.' : 'Ultra Thin Pro makes your lenses thin and elegant.'; }
  else if (eq > 2.0) { condicion = lang === 'es' ? 'Graduación alta' : 'High prescription'; explicacion = lang === 'es' ? 'El Ultra Thin reducirá el grosor hasta un 30%.' : 'Ultra Thin will reduce lens thickness by up to 30%.'; }
  else { condicion = lang === 'es' ? 'Graduación moderada' : 'Moderate prescription'; explicacion = lang === 'es' ? 'Thin & Durable es resistente y el Fotocromático te da comodidad.' : 'Thin & Durable is strong and Photochromic gives indoor/outdoor comfort.'; }
  const precioOriginal = PRECIO_ARMAZON + vision.precio + material.precio + filtroBase.precio;
  const descuento = Math.round(precioOriginal * 0.10);
  const precioFinal = precioOriginal - descuento;
  const upsells: { id: string; nombre: string; precio: number; razon: string }[] = [];
  if (filtroBase.id === 'arprem') {
    upsells.push({ id: 'blue', nombre: 'Blue Light Comfort', precio: 18, razon: lang === 'es' ? 'Para uso diario de pantallas' : 'For daily screen use' });
    upsells.push({ id: 'anti', nombre: 'Anti-Fog', precio: 15, razon: lang === 'es' ? 'Evita empañamiento' : 'Prevents fogging' });
  } else {
    upsells.push({ id: 'arprem', nombre: 'Premium Clarity AR', precio: 24, razon: lang === 'es' ? 'Reduce reflejos al manejar de noche' : 'Reduces reflections when driving at night' });
    upsells.push({ id: 'anti', nombre: 'Anti-Fog', precio: 15, razon: lang === 'es' ? 'Evita empañamiento' : 'Prevents fogging' });
  }
  return { vision, material, filtroBase, precioOriginal, precioFinal, descuento, condicion, explicacion, upsells };
}

function LenteSVG({ color, forma, size = 'large', solar = false }: { color: string; forma: string; size?: string; solar?: boolean }) {
  const rx = forma === 'ovalada' ? '30' : forma === 'rectangular' ? '8' : '14';
  const w = size === 'large' ? 280 : 90; const h = size === 'large' ? 160 : 50;
  return (
    <svg width={w} height={h} viewBox="0 0 160 90" fill="none">
      <rect x="4" y="12" width="64" height="66" rx={rx} fill={solar ? color : 'white'} fillOpacity={solar ? 0.15 : 1} stroke={color} strokeWidth="3.5"/>
      <rect x="92" y="12" width="64" height="66" rx={rx} fill={solar ? color : 'white'} fillOpacity={solar ? 0.15 : 1} stroke={color} strokeWidth="3.5"/>
      <path d="M68 38 C72 32, 88 32, 92 38" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <line x1="4" y1="36" x2="-6" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="156" y1="36" x2="166" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function VerlyModalPaquete({ paquete, armazonNombre, onAceptar, onManual, lang }: { paquete: PaqueteVerly; armazonNombre: string; onAceptar: (extrasIds: string[]) => void; onManual: () => void; lang: 'es' | 'en'; }) {
  const [paso, setPaso] = useState<'paquete' | 'upsell'>('paquete');
  const [extras, setExtras] = useState<string[]>([]);
  const toggleExtra = (id: string) => setExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  const precioExtras = extras.reduce((sum, id) => sum + (paquete.upsells.find(u => u.id === id)?.precio || 0), 0);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)', overflow: 'hidden', animation: 'slideUp 0.3s ease-out', maxHeight: '90vh', overflowY: 'auto' }}>
        {paso === 'paquete' ? (
          <>
            <div style={{ background: '#1d1d1d', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>{lang === 'es' ? 'Verly recomienda' : 'Verly recommends'}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'white', lineHeight: 1.2 }}>{lang === 'es' ? 'El paquete perfecto para ti' : 'The perfect package for you'}</div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ background: '#faf9f7', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '13px', color: '#1d1d1d', lineHeight: 1.6 }}>{paquete.explicacion}</div>
              <div style={{ border: '1px solid #e8e5e0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <div style={{ background: '#f5f1eb', padding: '0.65rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1d1d1d' }}>{lang === 'es' ? `Paquete ${paquete.condicion}` : `${paquete.condicion} Package`}</span>
                  <span style={{ background: '#55624c', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>-{paquete.descuento}% OFF</span>
                </div>
                <div style={{ padding: '0.75rem 1rem' }}>
                  {[{ label: armazonNombre, valor: `$${PRECIO_ARMAZON}` }, { label: lang === 'es' ? paquete.vision.nombre : paquete.vision.nombre_en, valor: `+$${paquete.vision.precio}` }, { label: lang === 'es' ? paquete.material.nombre : paquete.material.nombre_en, valor: paquete.material.precio === 0 ? (lang === 'es' ? 'Incluido' : 'Included') : `+$${paquete.material.precio}` }, { label: lang === 'es' ? paquete.filtroBase.nombre : paquete.filtroBase.nombre_en, valor: `+$${paquete.filtroBase.precio}` }].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: i < 3 ? '1px solid #f5f3ef' : 'none' }}>
                      <span style={{ color: '#6f6a63' }}>{item.label}</span><span style={{ fontWeight: 500 }}>{item.valor}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.75rem 1rem', background: '#faf9f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#9a9a9a', textDecoration: 'line-through' }}>${paquete.precioOriginal} USD</div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: '#55624c' }}>${paquete.precioFinal} USD</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6f6a63' }}>{lang === 'es' ? `Ahorras $${paquete.descuento}` : `You save $${paquete.descuento}`}</div>
                </div>
              </div>
              <button onClick={() => setPaso('upsell')} style={{ width: '100%', background: '#55624c', color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-sans)' }}>{lang === 'es' ? 'Sí, quiero este paquete →' : 'Yes, I want this package →'}</button>
              <button onClick={onManual} style={{ width: '100%', background: 'white', color: '#6f6a63', border: '1px solid #e8e5e0', borderRadius: '6px', padding: '12px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{lang === 'es' ? 'Prefiero elegir manualmente' : 'I prefer to choose manually'}</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ background: '#f5f1eb', padding: '1.25rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #e8e5e0' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, color: '#1d1d1d' }}>{lang === 'es' ? '¿Le añadimos algo más?' : 'Shall we add anything else?'}</div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#6f6a63', marginTop: '4px' }}>{lang === 'es' ? 'Opcional' : 'Optional'}</div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {paquete.upsells.map(u => (
                <div key={u.id} onClick={() => toggleExtra(u.id)} style={{ border: extras.includes(u.id) ? '1.5px solid #55624c' : '1px solid #e8e5e0', borderRadius: '8px', padding: '1rem', cursor: 'pointer', background: extras.includes(u.id) ? '#f0f4ef' : 'white', marginBottom: '0.75rem', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '1.5px solid', borderColor: extras.includes(u.id) ? '#55624c' : '#e8e5e0', background: extras.includes(u.id) ? '#55624c' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', flexShrink: 0 }}>{extras.includes(u.id) ? '✓' : ''}</div>
                    <div><div style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1d' }}>{u.nombre}</div><div style={{ fontSize: '12px', color: '#6f6a63', marginTop: '2px' }}>{u.razon}</div></div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#55624c', flexShrink: 0 }}>+${u.precio}</div>
                </div>
              ))}
              <div style={{ background: '#faf9f7', borderRadius: '8px', padding: '0.9rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#6f6a63' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300, color: '#1d1d1d' }}>${paquete.precioFinal + precioExtras} USD</span>
              </div>
              <button onClick={() => onAceptar(extras)} style={{ width: '100%', background: '#55624c', color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-sans)' }}>{lang === 'es' ? 'Ir al resumen →' : 'Go to summary →'}</button>
              <button onClick={() => onAceptar([])} style={{ width: '100%', background: 'white', color: '#6f6a63', border: '1px solid #e8e5e0', borderRadius: '6px', padding: '11px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{lang === 'es' ? 'No gracias, ir al resumen' : 'No thanks, go to summary'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ModalRecetaObligatoria({ onGuardar, onSinGraduacion, lang, t }: { onGuardar: (receta: RecetaData | null, foto: string | null) => void; onSinGraduacion: () => void; lang: 'es' | 'en'; t: (es: string, en: string) => string; }) {
  const [modo, setModo] = useState<'opciones' | 'manual' | 'foto'>('opciones');
  const [receta, setReceta] = useState<RecetaData>({ sph_od: null, cyl_od: null, axis_od: null, sph_os: null, cyl_os: null, axis_os: null, add: null, dp: null, prisma: '' });
  const [fotoUrl, setFotoUrl] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const validar = () => {
    const errs: string[] = [];
    if (receta.sph_od === null && receta.sph_os === null) errs.push(t('Ingresa al menos el SPH de un ojo', 'Enter at least the SPH for one eye'));
    if (receta.cyl_od !== null && receta.cyl_od !== 0 && receta.axis_od === null) errs.push(t('EJE requerido para OD', 'AXIS required for OD'));
    if (receta.cyl_os !== null && receta.cyl_os !== 0 && receta.axis_os === null) errs.push(t('EJE requerido para OS', 'AXIS required for OS'));
    return errs;
  };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)', overflow: 'hidden', animation: 'slideUp 0.3s ease-out', maxHeight: '92vh', overflowY: 'auto', fontFamily: 'var(--font-sans), sans-serif' }}>
        <div style={{ background: '#1d1d1d', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300, color: 'white', marginBottom: '4px' }}>{t('Necesitamos tu graduación', 'We need your prescription')}</div>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>{t('Para fabricar tus lentes perfectamente', 'To make your lenses perfectly')}</div>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {modo === 'opciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ icon: '✏️', title: t('Escribir graduación', 'Enter prescription manually'), sub: t('SPH, CYL, EJE, ADD y PD', 'SPH, CYL, AXIS, ADD and PD'), onClick: () => setModo('manual') }, { icon: '📷', title: t('Subir foto de mi receta', 'Upload prescription photo'), sub: t('Foto, PDF o captura de pantalla', 'Photo, PDF or screenshot'), onClick: () => setModo('foto') }, { icon: '🕶️', title: t('No tengo graduación', "I don't have a prescription"), sub: t('Lentes sin aumento, blue light o moda', 'Non-prescription, blue light or fashion'), onClick: onSinGraduacion }].map((opt, i) => (
                <button key={i} onClick={opt.onClick} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e8e5e0', background: '#faf9f7', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s', fontFamily: 'var(--font-sans)' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#55624c'; (e.currentTarget as HTMLButtonElement).style.background = '#f0f4ef'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e5e0'; (e.currentTarget as HTMLButtonElement).style.background = '#faf9f7'; }}>
                  <span style={{ fontSize: '22px' }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}><div style={{ fontSize: '14px', fontWeight: 500, color: '#1d1d1d' }}>{opt.title}</div><div style={{ fontSize: '12px', color: '#6f6a63', marginTop: '2px' }}>{opt.sub}</div></div>
                  <span style={{ color: '#9a9a9a', fontSize: '18px' }}>›</span>
                </button>
              ))}
            </div>
          )}
          {modo === 'manual' && (
            <div>
              <button onClick={() => setModo('opciones')} style={{ background: 'none', border: 'none', color: '#55624c', fontSize: '13px', cursor: 'pointer', marginBottom: '1rem', padding: 0, fontFamily: 'var(--font-sans)' }}>← {t('Atrás', 'Back')}</button>
              <FormReceta receta={receta} onChange={setReceta} errores={errores} t={t}/>
              <button onClick={() => { const errs = validar(); if (errs.length > 0) { setErrores(errs); return; } onGuardar(receta, null); }} style={{ width: '100%', background: '#55624c', color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1rem', fontFamily: 'var(--font-sans)' }}>{t('Confirmar graduación y pagar →', 'Confirm prescription & pay →')}</button>
            </div>
          )}
          {modo === 'foto' && (
            <div>
              <button onClick={() => setModo('opciones')} style={{ background: 'none', border: 'none', color: '#55624c', fontSize: '13px', cursor: 'pointer', marginBottom: '1rem', padding: 0, fontFamily: 'var(--font-sans)' }}>← {t('Atrás', 'Back')}</button>
              {fotoUrl ? (
                <div style={{ marginBottom: '1rem' }}>
                  <img src={fotoUrl} alt="receta" style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'contain', border: '1px solid #e8e5e0' }}/>
                  <button onClick={() => setFotoUrl('')} style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: '12px', cursor: 'pointer', marginTop: '8px', fontFamily: 'var(--font-sans)' }}>{t('Quitar foto', 'Remove photo')}</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
                  {[{ icon: '📁', title: t('Subir archivo', 'Upload file'), sub: 'JPG, PNG, PDF', capture: undefined, accept: 'image/*,.pdf' }, { icon: '📸', title: t('Tomar foto ahora', 'Take photo now'), sub: t('Usa la cámara de tu dispositivo', 'Use your device camera'), capture: 'environment' as const, accept: 'image/*' }].map((opt, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '8px', border: '1px dashed #e8e5e0', cursor: 'pointer', background: '#faf9f7' }}>
                      <input type="file" accept={opt.accept} capture={opt.capture} style={{ display: 'none' }} onChange={e => { const file = e.target.files?.[0]; if (file) setFotoUrl(URL.createObjectURL(file)); }}/>
                      <span style={{ fontSize: '22px' }}>{opt.icon}</span>
                      <div><div style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1d' }}>{opt.title}</div><div style={{ fontSize: '12px', color: '#6f6a63' }}>{opt.sub}</div></div>
                    </label>
                  ))}
                </div>
              )}
              {fotoUrl && <button onClick={() => onGuardar(null, fotoUrl)} style={{ width: '100%', background: '#55624c', color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>{t('Confirmar foto y pagar →', 'Confirm photo & pay →')}</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectorColores({ colores, valorActivo, onChange, lang }: { colores: { id: string; nombre_es: string; nombre_en: string; hex: string }[]; valorActivo: string; onChange: (id: string) => void; lang: string; }) {
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {colores.map(c => (
        <div key={c.id} onClick={() => onChange(c.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.hex, border: valorActivo === c.id ? '2.5px solid #1d1d1d' : '2.5px solid transparent', outline: valorActivo === c.id ? '1.5px solid #55624c' : 'none', outlineOffset: '2px', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', transition: 'all 0.15s' }}/>
          <span style={{ fontSize: '10px', fontWeight: valorActivo === c.id ? 600 : 400, color: valorActivo === c.id ? '#1d1d1d' : '#6f6a63' }}>{lang === 'es' ? c.nombre_es : c.nombre_en}</span>
        </div>
      ))}
    </div>
  );
}

function Acordeon({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 400, color: '#1d1d1d', textAlign: 'left', letterSpacing: '0.01em' }}>
        {titulo}
        <span style={{ fontSize: '20px', color: '#9a9a9a', transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.25s', display: 'inline-block', lineHeight: 1 }}>+</span>
      </button>
      {open && <div style={{ paddingBottom: '1.25rem', fontSize: '13px', color: '#6f6a63', lineHeight: 1.8 }}>{children}</div>}
    </div>
  );
}

export default function DetalleArmazon() {
  const { id } = useParams();
  const { t, lang } = useLang() as any;
  const [armazon, setArmazon] = useState<Armazon | null>(null);
  const [relacionados, setRelacionados] = useState<Armazon[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [verlyModal, setVerlyModal] = useState(false);
  const [paqueteVerly, setPaqueteVerly] = useState<PaqueteVerly | null>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const [modalRecetaPago, setModalRecetaPago] = useState(false);

  const esSolar = armazon?.tipo === 'solar';

  type DrawerEstado = 'inicio' | 'inicio_solar' | 'manual' | 'foto' | 'config';
  const [drawerEstado, setDrawerEstado] = useState<DrawerEstado>('inicio');
  const [recetaEstado, setRecetaEstado] = useState<RecetaEstado>('sin_receta');
  const [fotoReceta, setFotoReceta] = useState('');
  const [receta, setReceta] = useState<RecetaData>({ sph_od: null, cyl_od: null, axis_od: null, sph_os: null, cyl_os: null, axis_os: null, add: null, dp: null, prisma: '' });

  const [paso, setPaso] = useState(1);
  const [vision, setVision] = useState('');
  const [material, setMaterial] = useState('');
  const [filtros, setFiltros] = useState<string[]>([]);
  const [colorFoto, setColorFoto] = useState('gris');
  const [colorPolarizado, setColorPolarizado] = useState('negro');
  const [colorTinte, setColorTinte] = useState('negro');
  const [loadingPago, setLoadingPago] = useState(false);
  const [soloArmazon, setSoloArmazon] = useState(false);
  const [fotoActiva, setFotoActiva] = useState(0);
  const [posZoom, setPosZoom] = useState({ x: 50, y: 50 });
  const [zoomActivo, setZoomActivo] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [esMobil, setEsMobil] = useState(false);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const precioArmazon = armazon?.precio || PRECIO_ARMAZON;
  const precioVision = visionOpts.find(v => v.id === vision)?.precio || 0;
  const precioMaterial = materialOpts.find(m => m.id === material)?.precio || 0;
  const precioFiltros = filtroOpts.filter(f => filtros.includes(f.id)).reduce((a, f) => a + f.precio, 0);
  const total = soloArmazon ? precioArmazon : precioArmazon + precioVision + precioMaterial + precioFiltros;

  const toggleFiltro = (fid: string) => setFiltros(prev => prev.includes(fid) ? prev.filter(f => f !== fid) : [...prev, fid]);
  const tieneReceta = recetaEstado === 'guardada' || recetaEstado === 'foto' || recetaEstado === 'sin_graduacion';

  const validarReceta = (): string[] => {
    const errs: string[] = [];
    if (receta.sph_od === null && receta.sph_os === null) errs.push(t('Ingresa al menos el SPH de un ojo', 'Enter at least the SPH for one eye'));
    if (receta.cyl_od !== null && receta.cyl_od !== 0 && receta.axis_od === null) errs.push(t('EJE requerido para OD cuando hay CYL', 'AXIS required for OD when CYL is set'));
    if (receta.cyl_os !== null && receta.cyl_os !== 0 && receta.axis_os === null) errs.push(t('EJE requerido para OS cuando hay CYL', 'AXIS required for OS when CYL is set'));
    return errs;
  };

  const guardarRecetaManual = () => {
    const errs = validarReceta();
    if (errs.length > 0) { setErrores(errs); return; }
    setErrores([]);
    const sesion = JSON.parse(sessionStorage.getItem('verly_sesion') || '{}');
    sesion.receta = receta;
    sessionStorage.setItem('verly_sesion', JSON.stringify(sesion));
    const paquete = calcularPaquete(receta, lang || 'en');
    setPaqueteVerly(paquete);
    setRecetaEstado('guardada');
    setVerlyModal(true);
  };

  const aceptarPaquete = (extrasIds: string[]) => {
    if (!paqueteVerly) return;
    setVision(paqueteVerly.vision.id);
    setMaterial(paqueteVerly.material.id);
    setFiltros([paqueteVerly.filtroBase.id, ...extrasIds]);
    setVerlyModal(false);
    setDrawerEstado('config');
    setPaso(4);
  };

  const elegirManual = () => { setVerlyModal(false); setDrawerEstado('config'); setPaso(1); };

  const handlePago = async () => {
    if (soloArmazon) { await ejecutarPago(); return; }
    if (!tieneReceta) { setModalRecetaPago(true); return; }
    await ejecutarPago();
  };

  const ejecutarPago = async () => {
    setLoadingPago(true);
    setModalRecetaPago(false);
    try {
      let items = '';
      if (soloArmazon) { items = `${armazon?.nombre} (solo armazón)`; }
      else {
        const v = lang === 'es' ? (visionOpts.find(x => x.id === vision)?.nombre || '') : (visionOpts.find(x => x.id === vision)?.nombre_en || '');
        const m = lang === 'es' ? (materialOpts.find(x => x.id === material)?.nombre || '') : (materialOpts.find(x => x.id === material)?.nombre_en || '');
        const fs = filtroOpts.filter(f => filtros.includes(f.id)).map(f => {
          const nombre = lang === 'es' ? f.nombre : f.nombre_en;
          if (f.id === 'foto') return `${nombre} (${COLORES_FOTO.find(c => c.id === colorFoto)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorFoto})`;
          if (f.id === 'pol') return `${nombre} (${COLORES_POLARIZADO.find(c => c.id === colorPolarizado)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorPolarizado})`;
          if (f.id === 'tinte') return `${nombre} (${COLORES_TINTE.find(c => c.id === colorTinte)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorTinte})`;
          return nombre;
        }).join(', ');
        items = `${armazon?.nombre} + ${v} + ${m}${fs ? ' + ' + fs : ''}`;
      }
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, total }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { alert(t('Error al procesar el pago.', 'Error processing payment.')); setLoadingPago(false); }
    } catch { alert(t('Error al procesar el pago.', 'Error processing payment.')); setLoadingPago(false); }
  };

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('armazones').select('*').eq('id', id).single();
      if (data) {
        setArmazon(data);
        const { data: rel } = await supabase.from('armazones').select('*').eq('activo', true).neq('id', id).limit(6);
        setRelacionados(rel || []);
      }
      setLoading(false);
    }
    cargar();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen || verlyModal || modalRecetaPago ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen, verlyModal, modalRecetaPago]);

  const abrirDrawer = () => { setDrawerOpen(true); setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio'); setSoloArmazon(false); };

  const verlyTips: Record<number, string> = {
    1: t('Selecciona el tipo de visión que necesitas.', 'Select the vision type you need.'),
    2: t('El material afecta el grosor y peso de tus lentes.', 'Material affects thickness and weight.'),
    3: t('Los filtros protegen tus ojos según tu estilo de vida.', 'Filters protect your eyes based on your lifestyle.'),
    4: t('Revisa tu pedido y procede al pago seguro.', 'Review your order and proceed to secure payment.'),
  };

  const resumenReceta = () => {
    if (recetaEstado === 'sin_graduacion') return t('Sin graduación', 'No prescription');
    if (recetaEstado === 'foto') return t('Foto adjunta', 'Photo attached');
    if (recetaEstado === 'guardada') return `OD: ${receta.sph_od !== null ? (receta.sph_od >= 0 ? '+' : '') + receta.sph_od.toFixed(2) : '—'} · OS: ${receta.sph_os !== null ? (receta.sph_os >= 0 ? '+' : '') + receta.sph_os.toFixed(2) : '—'}`;
    return '';
  };

  const pasos = [t('Visión', 'Vision'), t('Material', 'Material'), t('Filtros', 'Filters'), t('Resumen', 'Summary')];
  const coloresDisponibles = getColoresDisponibles(vision, material);
  const filtrosActivos = esSolar ? filtroOptsSolar : filtroOpts;

  // Fotos de galería — hasta 4 fotos (imagen_url a imagen4_url), imagen5_url es exclusiva para lifestyle
  const fotos = [armazon?.imagen_url, armazon?.imagen2_url, armazon?.imagen3_url, armazon?.imagen4_url].filter(Boolean) as string[];
  const fotoLifestyle = armazon?.imagen5_url || null;
  const partesMedidas = armazon?.medidas?.split('-') || [];

  if (loading) return (
    <main style={{ fontFamily: 'var(--font-sans), sans-serif', background: '#f5f1eb', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '8rem', color: '#6f6a63', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300 }}>{t('Cargando...', 'Loading...')}</div>
    </main>
  );

  if (!armazon) return (
    <main style={{ fontFamily: 'var(--font-sans), sans-serif', background: '#f5f1eb', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '8rem', color: '#6f6a63' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300 }}>{t('Armazón no encontrado.', 'Frame not found.')}</p>
        <a href="/Tienda" style={{ color: '#55624c', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('← Volver', '← Back')}</a>
      </div>
    </main>
  );

  return (
    <main style={{ fontFamily: 'var(--font-sans), sans-serif', background: '#f5f1eb', minHeight: '100vh', color: '#1d1d1d' }}>
      <Navbar />

      {verlyModal && paqueteVerly && <VerlyModalPaquete paquete={paqueteVerly} armazonNombre={armazon.nombre} onAceptar={aceptarPaquete} onManual={elegirManual} lang={lang || 'en'}/>}
      {modalRecetaPago && <ModalRecetaObligatoria lang={lang || 'en'} t={t} onGuardar={(r, foto) => { if (r) { setReceta(r); setRecetaEstado('guardada'); } if (foto) { setFotoReceta(foto); setRecetaEstado('foto'); } ejecutarPago(); }} onSinGraduacion={() => { setRecetaEstado('sin_graduacion'); ejecutarPago(); }}/>}
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>}

      {/* ══ DRAWER ══════════════════════════════════════════════════════════ */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '480px', maxWidth: '100vw', background: 'white', zIndex: 201, boxShadow: '-2px 0 40px rgba(0,0,0,0.08)', transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
          <div>
            <p style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a9a9a', margin: 0 }}>{t('Personalizando', 'Customizing')}</p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, margin: '3px 0 0', color: '#1d1d1d' }}>{armazon.nombre}</h3>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: '#f5f3ef', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: '#6f6a63', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = '#ede9e0')} onMouseLeave={e => (e.currentTarget.style.background = '#f5f3ef')}>×</button>
        </div>

        {drawerEstado === 'inicio_solar' && (
          <div style={{ padding: '2rem', flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: '#1d1d1d', marginBottom: '0.5rem' }}>{t('¿Cómo quieres tus lentes?', 'How do you want your lenses?')}</p>
              <p style={{ fontSize: '0.8rem', color: '#6f6a63' }}>{t('Puedes llevarlos como vienen o personalizarlos.', 'Wear them as-is or customize them.')}</p>
            </div>
            {[{ title: t('Solo el armazón', 'Frame only'), precio: `$${precioArmazon} USD`, desc: t('Incluye lentes oscuros estándar. Sin graduación.', 'Includes standard dark lenses. No prescription.'), dark: false, onClick: () => { setSoloArmazon(true); setDrawerEstado('config'); setPaso(4); } }, { title: t('Personalizar mis micas', 'Customize my lenses'), precio: `${t('desde', 'from')} $${precioArmazon + 15}`, desc: t('Agregar graduación, polarizado, fotocromático y más.', 'Add prescription, polarized, photochromic and more.'), dark: true, onClick: () => { setSoloArmazon(false); setDrawerEstado('inicio'); } }].map((opt, i) => (
              <div key={i} onClick={opt.onClick} style={{ border: opt.dark ? 'none' : '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '1.5rem', cursor: 'pointer', background: opt.dark ? '#1d1d1d' : '#faf9f7', marginBottom: '0.75rem', transition: 'all 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, color: opt.dark ? 'white' : '#1d1d1d' }}>{opt.title}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: opt.dark ? 'rgba(255,255,255,0.7)' : '#6f6a63' }}>{opt.precio}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: opt.dark ? 'rgba(255,255,255,0.6)' : '#6f6a63', lineHeight: 1.6, margin: 0 }}>{opt.desc}</p>
              </div>
            ))}
          </div>
        )}

        {drawerEstado === 'inicio' && (
          <div style={{ padding: '2rem', flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300, color: '#1d1d1d', marginBottom: '6px' }}>{t('¿Tienes tu graduación?', 'Do you have your prescription?')}</p>
              <p style={{ fontSize: '0.8rem', color: '#6f6a63' }}>{t('Úsala para personalizar tus micas o agrégala después', 'Use it to customize your lenses or add it later')}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[{ icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>), title: t('Escribir manualmente', 'Enter manually'), sub: t('SPH, CYL, EJE, ADD, PD', 'SPH, CYL, AXIS, ADD, PD'), onClick: () => setDrawerEstado('manual') }, { icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>), title: t('Subir foto de mi receta', 'Upload prescription photo'), sub: t('Foto, PDF o captura de pantalla', 'Photo, PDF or screenshot'), onClick: () => setDrawerEstado('foto') }, { icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>), title: t('La agregaré después', "I'll add it later"), sub: t('Agrega tu receta antes de pagar', 'Add your prescription before paying'), onClick: () => { setRecetaEstado('despues'); setDrawerEstado('config'); setPaso(1); } }].map((opt, i) => (
                <button key={i} onClick={opt.onClick} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '1.1rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', background: '#faf9f7', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s', fontFamily: 'var(--font-sans)' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#55624c'; (e.currentTarget as HTMLButtonElement).style.background = '#f0f4ef'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.08)'; (e.currentTarget as HTMLButtonElement).style.background = '#faf9f7'; }}>
                  <div style={{ color: '#55624c', flexShrink: 0 }}>{opt.icon}</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: '14px', fontWeight: 500, color: '#1d1d1d' }}>{opt.title}</div><div style={{ fontSize: '12px', color: '#6f6a63', marginTop: '2px' }}>{opt.sub}</div></div>
                  <span style={{ color: '#9a9a9a', fontSize: '18px' }}>›</span>
                </button>
              ))}
            </div>
            {esSolar && <button onClick={() => setDrawerEstado('inicio_solar')} style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: '#6f6a63', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>← {t('Volver', 'Back')}</button>}
          </div>
        )}

        {drawerEstado === 'manual' && (
          <div style={{ padding: '2rem', flex: 1 }}>
            <button onClick={() => setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio')} style={{ background: 'none', border: 'none', color: '#55624c', fontSize: '13px', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontFamily: 'var(--font-sans)' }}>← {t('Atrás', 'Back')}</button>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, color: '#1d1d1d', marginBottom: '1rem' }}>{t('Tu receta óptica', 'Your optical prescription')}</p>
            <FormReceta receta={receta} onChange={setReceta} errores={errores} t={t}/>
            <button onClick={guardarRecetaManual} style={{ width: '100%', background: '#55624c', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1rem', fontFamily: 'var(--font-sans)' }}>{t('Guardar y ver recomendación →', 'Save & see recommendation →')}</button>
            <button onClick={() => { setRecetaEstado('despues'); setDrawerEstado('config'); setPaso(1); }} style={{ width: '100%', background: 'none', border: 'none', color: '#9a9a9a', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: '10px', marginTop: '4px' }}>{t('Continuar sin receta por ahora', 'Continue without prescription for now')}</button>
          </div>
        )}

        {drawerEstado === 'foto' && (
          <div style={{ padding: '2rem', flex: 1 }}>
            <button onClick={() => setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio')} style={{ background: 'none', border: 'none', color: '#55624c', fontSize: '13px', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontFamily: 'var(--font-sans)' }}>← {t('Atrás', 'Back')}</button>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '1rem' }}>{t('Sube tu receta', 'Upload your prescription')}</p>
            {fotoReceta ? (
              <div style={{ marginBottom: '1rem' }}>
                <img src={fotoReceta} alt="receta" style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'contain', border: '1px solid #e8e5e0' }}/>
                <button onClick={() => setFotoReceta('')} style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: '12px', cursor: 'pointer', marginTop: '8px', fontFamily: 'var(--font-sans)' }}>{t('Quitar foto', 'Remove photo')}</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                {[{ title: t('Subir archivo', 'Upload file'), sub: 'JPG, PNG, PDF', capture: undefined, accept: 'image/*,.pdf' }, { title: t('Tomar foto ahora', 'Take photo now'), sub: t('Usa la cámara de tu dispositivo', 'Use your device camera'), capture: 'environment' as const, accept: 'image/*' }].map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.1rem 1.25rem', borderRadius: '10px', border: '1px dashed rgba(0,0,0,0.12)', cursor: 'pointer', background: '#faf9f7' }}>
                    <input type="file" accept={opt.accept} capture={opt.capture} style={{ display: 'none' }} onChange={e => { const file = e.target.files?.[0]; if (file) setFotoReceta(URL.createObjectURL(file)); }}/>
                    <div><div style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1d' }}>{opt.title}</div><div style={{ fontSize: '12px', color: '#6f6a63' }}>{opt.sub}</div></div>
                  </label>
                ))}
              </div>
            )}
            {fotoReceta && <button onClick={() => { setRecetaEstado('foto'); setDrawerEstado('config'); setPaso(1); }} style={{ width: '100%', background: '#55624c', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>{t('Foto guardada — continuar →', 'Photo saved — continue →')}</button>}
            <button onClick={() => { setRecetaEstado('despues'); setDrawerEstado('config'); setPaso(1); }} style={{ width: '100%', background: 'none', border: 'none', color: '#9a9a9a', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: '10px', marginTop: '8px' }}>{t('Continuar sin foto por ahora', 'Continue without photo for now')}</button>
          </div>
        )}

        {drawerEstado === 'config' && (
          <>
            {tieneReceta && (
              <div style={{ padding: '10px 1.5rem', background: '#f0f4ef', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#55624c', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>✓</div>
                <div style={{ flex: 1, fontSize: '11px', color: '#1d1d1d', fontWeight: 500 }}>{resumenReceta()}</div>
                <button onClick={() => setDrawerEstado('inicio')} style={{ background: 'none', border: 'none', color: '#55624c', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{t('Editar', 'Edit')}</button>
              </div>
            )}
            {recetaEstado === 'despues' && (
              <div style={{ padding: '10px 1.5rem', background: '#fffbeb', borderBottom: '1px solid rgba(245,197,24,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706', flexShrink: 0 }}/>
                <div style={{ flex: 1, fontSize: '11px', color: '#92400e', fontWeight: 500 }}>{t('Recuerda agregar tu graduación antes de pagar', 'Remember to add your prescription before paying')}</div>
                <button onClick={() => setDrawerEstado('inicio')} style={{ background: 'none', border: 'none', color: '#92400e', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{t('Agregar', 'Add')}</button>
              </div>
            )}
            {soloArmazon ? (
              <div style={{ padding: '2rem', flex: 1 }}>
                <div style={{ background: '#faf9f7', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><span style={{ color: '#6f6a63' }}>{armazon.nombre}</span><span style={{ fontWeight: 500 }}>${precioArmazon}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}><span style={{ color: '#6f6a63' }}>{t('Lentes oscuros estándar', 'Standard dark lenses')}</span><span style={{ color: '#55624c', fontWeight: 500 }}>{t('Incluido', 'Included')}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300 }}><span>Total</span><span>${precioArmazon} USD</span></div>
                </div>
                <button onClick={() => { setSoloArmazon(false); setDrawerEstado('inicio_solar'); }} style={{ width: '100%', background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '11px', fontSize: '12px', color: '#6f6a63', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginBottom: '10px' }}>{t('← Personalizar mis micas', '← Customize my lenses')}</button>
                <button onClick={handlePago} disabled={loadingPago} style={{ width: '100%', background: loadingPago ? '#9a9a9a' : '#1d1d1d', color: 'white', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '13px', fontWeight: 600, cursor: loadingPago ? 'not-allowed' : 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>{loadingPago ? t('Procesando...', 'Processing...') : t('Pagar con tarjeta →', 'Pay with card →')}</button>
              </div>
            ) : (
              <>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pasos.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: paso > i + 1 ? '#55624c' : 'white', border: paso >= i + 1 ? '1.5px solid #55624c' : '1.5px solid #e8e5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '11px', color: paso > i + 1 ? 'white' : paso === i + 1 ? '#55624c' : '#9a9a9a' }}>{paso > i + 1 ? '✓' : i + 1}</div>
                          <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', color: paso >= i + 1 ? '#55624c' : '#9a9a9a' }}>{p}</span>
                        </div>
                        {i < pasos.length - 1 && <div style={{ width: '36px', height: '1px', background: paso > i + 1 ? '#55624c' : '#e8e5e0', margin: '0 4px 16px' }}/>}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '2rem', flex: 1 }}>
                  {paso === 1 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, marginBottom: '0.25rem' }}>{t('Tipo de visión', 'Vision type')}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#6f6a63', marginBottom: '1.25rem' }}>{t('¿Cómo ves?', 'How do you see?')}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {visionOpts.map(o => (
                          <div key={o.id} onClick={() => setVision(o.id)} style={{ border: vision === o.id ? '1.5px solid #55624c' : '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '1rem 1.1rem', cursor: 'pointer', background: vision === o.id ? '#f0f4ef' : '#faf9f7', transition: 'all 0.15s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div><div style={{ fontSize: '14px', fontWeight: 500 }}>{lang === 'es' ? o.nombre : o.nombre_en}</div><div style={{ fontSize: '12px', color: '#6f6a63', marginTop: '2px' }}>{t(o.desc_es, o.desc_en)}</div></div>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: '#55624c' }}>+${o.precio}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {paso === 2 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, marginBottom: '0.25rem' }}>{t('Material de la mica', 'Lens material')}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#6f6a63', marginBottom: '1.25rem' }}>{t('Afecta el grosor y peso.', 'Affects thickness and weight.')}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {materialOpts.map(o => (
                          <div key={o.id} onClick={() => setMaterial(o.id)} style={{ border: material === o.id ? '1.5px solid #55624c' : '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '1rem 1.1rem', cursor: 'pointer', background: material === o.id ? '#f0f4ef' : '#faf9f7', transition: 'all 0.15s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div><div style={{ fontSize: '14px', fontWeight: 500 }}>{lang === 'es' ? o.nombre : o.nombre_en}</div><div style={{ fontSize: '12px', color: '#6f6a63', marginTop: '2px' }}>{t(o.desc_es, o.desc_en)}</div></div>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: '#55624c' }}>{o.precio === 0 ? t('Incluido', 'Included') : `+$${o.precio}`}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {paso === 3 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, marginBottom: '0.25rem' }}>{t('Filtros y protecciones', 'Filters & coatings')}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#6f6a63', marginBottom: '1.25rem' }}>{t('Opcionales. Puedes elegir varios.', 'Optional. You can choose multiple.')}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {filtrosActivos.map(o => {
                          const tieneColores = (o.id === 'foto' || o.id === 'pol' || o.id === 'tinte') && filtros.includes(o.id);
                          return (
                            <div key={o.id}>
                              <div onClick={() => toggleFiltro(o.id)} style={{ border: filtros.includes(o.id) ? '1.5px solid #55624c' : '1px solid rgba(0,0,0,0.08)', borderRadius: tieneColores ? '10px 10px 0 0' : '10px', padding: '1rem 1.1rem', cursor: 'pointer', background: filtros.includes(o.id) ? '#f0f4ef' : '#faf9f7', transition: 'all 0.15s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '1.5px solid', borderColor: filtros.includes(o.id) ? '#55624c' : '#d0ccc5', background: filtros.includes(o.id) ? '#55624c' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', flexShrink: 0 }}>{filtros.includes(o.id) ? '✓' : ''}</div>
                                    <div><div style={{ fontSize: '13px', fontWeight: 500 }}>{lang === 'es' ? o.nombre : o.nombre_en}</div><div style={{ fontSize: '12px', color: '#6f6a63' }}>{t(o.desc_es, o.desc_en)}</div></div>
                                  </div>
                                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#55624c' }}>+${o.precio}</div>
                                </div>
                              </div>
                              {o.id === 'foto' && filtros.includes('foto') && <div style={{ border: '1.5px solid #55624c', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '1rem', background: '#f8faf7' }}><div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6f6a63', marginBottom: '10px' }}>{t('Elige el color', 'Choose the color')}</div><SelectorColores colores={coloresDisponibles} valorActivo={colorFoto} onChange={setColorFoto} lang={lang}/></div>}
                              {o.id === 'pol' && filtros.includes('pol') && <div style={{ border: '1.5px solid #55624c', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '1rem', background: '#f8faf7' }}><div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6f6a63', marginBottom: '10px' }}>{t('Elige el color', 'Choose the color')}</div><SelectorColores colores={COLORES_POLARIZADO} valorActivo={colorPolarizado} onChange={setColorPolarizado} lang={lang}/></div>}
                              {o.id === 'tinte' && filtros.includes('tinte') && <div style={{ border: '1.5px solid #55624c', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '1rem', background: '#f8faf7' }}><div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6f6a63', marginBottom: '10px' }}>{t('Elige el color', 'Choose the color')}</div><SelectorColores colores={COLORES_TINTE} valorActivo={colorTinte} onChange={setColorTinte} lang={lang}/></div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {paso === 4 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, marginBottom: '1.25rem' }}>{t('Resumen de tu pedido', 'Order summary')}</h4>
                      <div style={{ background: '#faf9f7', borderRadius: '10px', padding: '1.1rem', marginBottom: '1.25rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                        {[{ label: t('Armazón', 'Frame'), value: `$${precioArmazon}` }, { label: `${t('Visión', 'Vision')}: ${lang === 'es' ? (visionOpts.find(v => v.id === vision)?.nombre || '-') : (visionOpts.find(v => v.id === vision)?.nombre_en || '-')}`, value: `+$${precioVision}` }, { label: `${t('Material', 'Material')}: ${lang === 'es' ? (materialOpts.find(m => m.id === material)?.nombre || '-') : (materialOpts.find(m => m.id === material)?.nombre_en || '-')}`, value: precioMaterial === 0 ? t('Incluido', 'Included') : `+$${precioMaterial}` }, ...filtroOpts.filter(f => filtros.includes(f.id)).map(f => { const nombre = lang === 'es' ? f.nombre : f.nombre_en; let label = nombre; if (f.id === 'foto') label = `${nombre} — ${COLORES_FOTO.find(c => c.id === colorFoto)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorFoto}`; if (f.id === 'pol') label = `${nombre} — ${COLORES_POLARIZADO.find(c => c.id === colorPolarizado)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorPolarizado}`; if (f.id === 'tinte') label = `${nombre} — ${COLORES_TINTE.find(c => c.id === colorTinte)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorTinte}`; return { label, value: `+$${f.precio}` }; })].map((item, i, arr) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', fontSize: '13px' }}><span style={{ color: '#6f6a63' }}>{item.label}</span><span style={{ fontWeight: 500 }}>{item.value}</span></div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300 }}><span>Total</span><span>${total} USD</span></div>
                      </div>
                      {!tieneReceta && (
                        <div style={{ background: '#fffbeb', borderRadius: '8px', padding: '0.9rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(245,197,24,0.3)' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706', flexShrink: 0 }}/>
                          <div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: 500, color: '#92400e' }}>{t('Graduación pendiente', 'Prescription pending')}</div><div style={{ fontSize: '11px', color: '#a16207' }}>{t('Se pedirá antes de finalizar el pago', "Will be requested before payment")}</div></div>
                          <button onClick={() => setDrawerEstado('inicio')} style={{ background: '#1d1d1d', border: 'none', borderRadius: '4px', padding: '5px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'var(--font-sans)' }}>{t('Agregar', 'Add')}</button>
                        </div>
                      )}
                      <button onClick={handlePago} disabled={loadingPago} style={{ width: '100%', background: loadingPago ? '#9a9a9a' : '#1d1d1d', color: 'white', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '13px', fontWeight: 600, cursor: loadingPago ? 'not-allowed' : 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', transition: 'background 0.2s' }} onMouseEnter={e => !loadingPago && (e.currentTarget.style.background = '#55624c')} onMouseLeave={e => !loadingPago && (e.currentTarget.style.background = '#1d1d1d')}>{loadingPago ? t('Procesando...', 'Processing...') : tieneReceta ? t('Pagar con tarjeta →', 'Pay with card →') : t('Continuar al pago →', 'Continue to payment →')}</button>
                    </div>
                  )}
                </div>
                {paso < 4 && (
                  <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, background: 'white' }}>
                    {paso > 1 ? <button onClick={() => setPaso(p => p - 1)} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px 20px', fontSize: '12px', cursor: 'pointer', color: '#6f6a63', fontFamily: 'var(--font-sans)' }}>← {t('Atrás', 'Back')}</button> : <button onClick={() => setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio')} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px 20px', fontSize: '12px', cursor: 'pointer', color: '#6f6a63', fontFamily: 'var(--font-sans)' }}>← {t('Mi receta', 'My prescription')}</button>}
                    <button onClick={() => { if (paso === 1 && !vision) return; if (paso === 2 && !material) return; setPaso(p => p + 1); }} style={{ background: (paso === 1 && !vision) || (paso === 2 && !material) ? '#e8e5e0' : '#55624c', color: (paso === 1 && !vision) || (paso === 2 && !material) ? '#9a9a9a' : 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '12px', fontWeight: 600, cursor: (paso === 1 && !vision) || (paso === 2 && !material) ? 'not-allowed' : 'pointer', letterSpacing: '0.08em', fontFamily: 'var(--font-sans)' }}>{paso === 3 ? t('Ver resumen →', 'See summary →') : t('Siguiente →', 'Next →')}</button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* ══ BREADCRUMB ══════════════════════════════════════════════════════ */}
      <div style={{ padding: '1rem 2rem', fontSize: '0.72rem', color: '#9a9a9a', letterSpacing: '0.02em', marginTop: '64px', maxWidth: '1440px', margin: '64px auto 0' }}>
        <a href="/" style={{ color: '#9a9a9a', textDecoration: 'none' }}>{t('Inicio', 'Home')}</a>
        <span style={{ margin: '0 8px', opacity: 0.5 }}>›</span>
        <a href={esSolar ? '/sunglasses' : '/Tienda'} style={{ color: '#9a9a9a', textDecoration: 'none' }}>{esSolar ? 'Sunglasses' : t('Tienda', 'Store')}</a>
        <span style={{ margin: '0 8px', opacity: 0.5 }}>›</span>
        <span style={{ color: '#1d1d1d' }}>{armazon.nombre}</span>
      </div>

      {/* ══ PRODUCTO PRINCIPAL ══════════════════════════════════════════════ */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: esMobil ? '0 0 5rem' : '2rem 3rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '1fr 440px', gap: esMobil ? '0' : '6rem', alignItems: 'start' }}>

          {/* ── GALERÍA ─────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: esMobil ? 'column' : 'row', gap: '16px' }}>

            {/* Miniaturas verticales — solo desktop */}
            {fotos.length > 1 && !esMobil && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '68px', flexShrink: 0 }}>
                {fotos.map((foto, i) => (
                  <button key={i} onClick={() => setFotoActiva(i)} style={{ width: '68px', height: '68px', borderRadius: '8px', overflow: 'hidden', border: fotoActiva === i ? '2px solid #1d1d1d' : '2px solid transparent', background: 'white', cursor: 'pointer', padding: 0, transition: 'all 0.2s', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', opacity: fotoActiva === i ? 1 : 0.65 }}>
                    <img src={foto} alt={`${armazon.nombre} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px', boxSizing: 'border-box' }}/>
                  </button>
                ))}
                <button style={{ width: '68px', height: '32px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6f6a63" strokeWidth="1.5" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  <span style={{ fontSize: '9px', color: '#6f6a63', fontWeight: 600, letterSpacing: '0.05em' }}>360°</span>
                </button>
              </div>
            )}

            {/* Foto principal */}
            <div style={{ flex: 1, position: 'relative' }}>
              <div
                style={{ background: 'white', borderRadius: esMobil ? '0' : '20px', overflow: 'hidden', position: 'relative', aspectRatio: '1/1', boxShadow: esMobil ? 'none' : '0 2px 40px rgba(0,0,0,0.05)', cursor: fotos.length > 0 ? 'crosshair' : 'default' }}
                onMouseMove={e => { if (esMobil) return; const rect = e.currentTarget.getBoundingClientRect(); setPosZoom({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 }); setZoomActivo(true); }}
                onMouseLeave={() => setZoomActivo(false)}
                onTouchStart={e => setTouchStart(e.touches[0].clientX)}
onTouchEnd={e => {
  if (touchStart === null) return;
  const diff = touchStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) setFotoActiva(prev => Math.min(prev + 1, fotos.length - 1));
    else setFotoActiva(prev => Math.max(prev - 1, 0));
  }
  setTouchStart(null);
}}
              >
                {fotos.length > 0 ? (
                  <img src={fotos[fotoActiva] || fotos[0]} alt={armazon.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: esMobil ? '1.5rem' : '3rem', boxSizing: 'border-box', transformOrigin: `${posZoom.x}% ${posZoom.y}%`, transform: zoomActivo ? 'scale(1.9)' : 'scale(1)', transition: zoomActivo ? 'none' : 'transform 0.4s ease' }}/>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', boxSizing: 'border-box' }}>
                    <LenteSVG color={armazon.color || '#1d1d1d'} forma={armazon.forma} size="large" solar={esSolar}/>
                  </div>
                )}
                {/* Wishlist */}
                <button style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', background: 'white', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff0f0'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6f6a63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
                {esSolar && <div style={{ position: 'absolute', bottom: '16px', left: '16px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#55624c', background: '#f0f4ef', padding: '4px 10px', borderRadius: '20px', border: '1px solid #c8dbc4' }}>{t('Graduable', 'Rx Ready')}</div>}
              </div>

              {/* Dots en móvil */}
              {fotos.length > 1 && esMobil && (
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '14px', padding: '0 1rem' }}>
                  {fotos.map((_, i) => (
                    <button key={i} onClick={() => setFotoActiva(i)} style={{ width: fotoActiva === i ? '20px' : '8px', height: '8px', borderRadius: '4px', background: fotoActiva === i ? '#1d1d1d' : 'rgba(0,0,0,0.18)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }}/>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── INFO DERECHA ─────────────────────────────────────────────── */}
          <div style={{ position: esMobil ? 'relative' : 'sticky', top: esMobil ? 'auto' : '84px', padding: esMobil ? '1.5rem 1.25rem 0' : '0' }}>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#55624c', padding: '5px 12px', border: '1px solid #55624c', borderRadius: '2px' }}>
                {armazon.genero === 'hombre' ? t('Hombre', 'Men') : armazon.genero === 'mujer' ? t('Mujer', 'Women') : 'Unisex'}
              </span>
              {armazon.badge && (
                <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6f6a63', padding: '5px 12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '2px' }}>
                  {armazon.badge}
                </span>
              )}
            </div>

            {/* Nombre */}
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2.8rem' : '4rem', fontWeight: 400, letterSpacing: '-0.03em', margin: '0 0 0.5rem', lineHeight: 1, color: '#1d1d1d' }}>
              {armazon.nombre}
            </h1>
            <p style={{ fontSize: '1rem', color: '#6f6a63', marginBottom: '2rem', letterSpacing: '0.01em', fontWeight: 400 }}>
              {[armazon.material, armazon.forma && `${armazon.forma.charAt(0).toUpperCase() + armazon.forma.slice(1)}`].filter(Boolean).join(' · ')}
            </p>

            {/* Precio */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1 }}>${armazon.precio}</span>
              <span style={{ fontSize: '0.85rem', color: '#9a9a9a', fontWeight: 400 }}>USD</span>
              {armazon.descuento && armazon.descuento > 0 && (
                <span style={{ background: '#c0392b', color: 'white', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '3px', letterSpacing: '0.04em' }}>-{armazon.descuento}%</span>
              )}
            </div>

            {/* Callout micas */}
            <div style={{ marginBottom: '1.75rem' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1d1d1d', margin: '0 0 3px' }}>{t('Graduadas desde $15', 'With lenses from $15')}</p>
              <p style={{ fontSize: '0.78rem', color: '#9a9a9a', margin: 0 }}>Single Vision · Blue Light · {t('Fotocromático', 'Photochromic')} · {t('Progresivo', 'Progressive')}</p>
            </div>

            {/* Botón principal — oculto en móvil (aparece sticky abajo) */}
            {!esMobil && (
              <button onClick={abrirDrawer} style={{ display: 'block', width: '100%', textAlign: 'center', background: '#55624c', color: 'white', padding: '20px 32px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', marginBottom: '2.5rem', transition: 'all 0.3s ease', fontFamily: 'var(--font-sans)' }} onMouseEnter={e => { (e.currentTarget.style.background = '#3f4a37'); (e.currentTarget.style.transform = 'translateY(-1px)'); (e.currentTarget.style.boxShadow = '0 8px 24px rgba(85,98,76,0.3)'); }} onMouseLeave={e => { (e.currentTarget.style.background = '#55624c'); (e.currentTarget.style.transform = 'translateY(0)'); (e.currentTarget.style.boxShadow = 'none'); }}>
                {esSolar ? t('Configurar mis lentes →', 'Configure my lenses →') : t('Personaliza tus micas →', 'Customize my lenses →')}
              </button>
            )}

            {/* Benefits row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '1.5rem 0', marginBottom: '2.5rem' }}>
              {[
                { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4a2 2 0 0 1 2 2v6H16V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>), label: t('Envío rápido', 'Fast shipping'), sub: t('5–7 días', '5–7 days') },
                { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>), label: t('Pago seguro', 'Secure pay'), sub: 'Stripe' },
                { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>), label: t('Soporte', 'Support'), sub: t('Rápido', 'Fast') },
                { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>), label: t('Sin aseguranza', 'No insurance'), sub: t('Directo', 'Direct') },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '0 8px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                  <div style={{ color: '#6f6a63' }}>{b.icon}</div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#1d1d1d', marginBottom: '2px', letterSpacing: '0.02em' }}>{b.label}</div>
                    <div style={{ fontSize: '9px', color: '#9a9a9a' }}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <Acordeon titulo={t('Detalles del armazón', 'Frame details')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {armazon.material && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Material</span><span style={{ fontWeight: 500, color: '#1d1d1d' }}>{armazon.material}</span></div>}
                  {armazon.forma && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t('Forma', 'Shape')}</span><span style={{ fontWeight: 500, color: '#1d1d1d', textTransform: 'capitalize' }}>{armazon.forma}</span></div>}
                  {armazon.medidas && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t('Medidas', 'Measurements')}</span><span style={{ fontWeight: 500, color: '#1d1d1d' }}>{armazon.medidas}</span></div>}
                  {armazon.talla && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t('Talla', 'Size')}</span><span style={{ fontWeight: 500, color: '#1d1d1d' }}>{armazon.talla}</span></div>}
                  {armazon.genero && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t('Género', 'Gender')}</span><span style={{ fontWeight: 500, color: '#1d1d1d', textTransform: 'capitalize' }}>{armazon.genero}</span></div>}
                </div>
              </Acordeon>
              <Acordeon titulo={t('¿Cómo medir mi cara?', 'How to measure my face?')}>
                {t('Mide el ancho de tu cara de sien a sien. Menos de 13cm → S, 13–14cm → M, 14–15cm → L, más de 15cm → XL. La talla de este armazón es', 'Measure from temple to temple. Under 5.1" → S, 5.1–5.5" → M, 5.5–5.9" → L, over 5.9" → XL. This frame is size')} <strong style={{ color: '#1d1d1d' }}>{armazon.talla || 'M'}</strong>.
              </Acordeon>
              <Acordeon titulo={t('Envío y devoluciones', 'Shipping & returns')}>
                {t('Enviamos a toda la Unión Americana en 5–7 días hábiles. Los lentes graduados tardan hasta 10 días adicionales. Si no estás satisfecho contáctanos en los primeros 30 días.', "We ship across the US in 5–7 business days. Prescription lenses take up to 10 additional days. Contact us within 30 days if not satisfied.")}
              </Acordeon>
              <Acordeon titulo={t('¿Por qué Verly?', 'Why Verly?')}>
                {t('Armazones de calidad a una fracción del precio de una óptica tradicional. Sin aseguranza, sin citas. Tus lentes llegan listos a tu puerta.', "Quality frames at a fraction of traditional optical prices. No insurance, no appointments. Your glasses arrive ready at your door.")}
              </Acordeon>
            </div>

          </div>
        </div>
      </div>

      {/* ══ MEDIDAS ═════════════════════════════════════════════════════════ */}
      {armazon.medidas && partesMedidas.length >= 2 && (
        <div style={{ background: '#edeae3', padding: esMobil ? '2.5rem 1.25rem' : '3rem' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: esMobil ? '0' : '0 3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '200px 1fr', gap: esMobil ? '1.5rem' : '3rem', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a9a9a', margin: '0 0 6px' }}>{t('MEDIDAS', 'MEASUREMENTS')}</p>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '1.5rem' : '2rem', fontWeight: 400, color: '#1d1d1d', margin: '0 0 4px', lineHeight: 1 }}>{t('TALLA', 'SIZE')} {armazon.talla || 'M'}</p>
                <p style={{ fontSize: '0.78rem', color: '#6f6a63', margin: '0 0 1.5rem' }}>{t('Para rostros medianos a grandes', 'For medium to large faces')}</p>
                <button style={{ background: '#1d1d1d', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{t('Guía de medidas', 'Size guide')}</button>
              </div>
              <div style={{ display: 'flex', gap: '0', flexWrap: esMobil ? 'wrap' : 'nowrap' }}>
                {[
                  { icon: (<svg width="32" height="20" viewBox="0 0 48 30" fill="none"><rect x="2" y="4" width="20" height="22" rx="6" fill="none" stroke="#1d1d1d" strokeWidth="2"/><rect x="26" y="4" width="20" height="22" rx="6" fill="none" stroke="#1d1d1d" strokeWidth="2"/><path d="M22 13 C24 10, 24 10, 26 13" stroke="#1d1d1d" strokeWidth="1.5" fill="none"/></svg>), valor: `${partesMedidas[0]}mm`, label: t('Ancho de lente', 'Lens width') },
                  { icon: (<svg width="32" height="20" viewBox="0 0 48 30" fill="none"><path d="M14 15 L34 15" stroke="#1d1d1d" strokeWidth="2" strokeLinecap="round"/><path d="M10 10 L10 20" stroke="#1d1d1d" strokeWidth="1.5" strokeLinecap="round"/><path d="M38 10 L38 20" stroke="#1d1d1d" strokeWidth="1.5" strokeLinecap="round"/></svg>), valor: `${partesMedidas[1]}mm`, label: t('Puente', 'Bridge') },
                  { icon: (<svg width="32" height="20" viewBox="0 0 48 30" fill="none"><path d="M4 15 L44 15" stroke="#1d1d1d" strokeWidth="2" strokeLinecap="round"/><path d="M38 8 L44 15 L38 22" stroke="#1d1d1d" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>), valor: `${partesMedidas[2] || '—'}mm`, label: t('Varilla', 'Temple') },
                  { icon: (<svg width="32" height="20" viewBox="0 0 48 30" fill="none"><rect x="14" y="2" width="20" height="26" rx="4" fill="none" stroke="#1d1d1d" strokeWidth="2"/></svg>), valor: '51mm', label: t('Alto de lente', 'Lens height') },
                  { icon: (<svg width="32" height="20" viewBox="0 0 48 30" fill="none"><path d="M4 15 L44 15" stroke="#1d1d1d" strokeWidth="2" strokeLinecap="round"/><path d="M4 8 L4 22" stroke="#1d1d1d" strokeWidth="1.5" strokeLinecap="round"/><path d="M44 8 L44 22" stroke="#1d1d1d" strokeWidth="1.5" strokeLinecap="round"/></svg>), valor: '139mm', label: t('Ancho total', 'Total width') },
                ].map((m, i) => (
                  <div key={i} style={{ flex: esMobil ? '0 0 calc(33% - 8px)' : 1, minWidth: '80px', padding: esMobil ? '0 0 1rem' : '0 2rem 0 0', borderRight: !esMobil && i < 4 ? '1px solid rgba(0,0,0,0.1)' : 'none', marginRight: !esMobil && i < 4 ? '2rem' : 0 }}>
                    <div style={{ marginBottom: '0.75rem', opacity: 0.7 }}>{m.icon}</div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '1.2rem' : '1.5rem', fontWeight: 400, color: '#1d1d1d', marginBottom: '4px' }}>{m.valor}</div>
                    <div style={{ fontSize: '0.72rem', color: '#6f6a63' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ LIFESTYLE SECTION ═══════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '1fr 1fr 280px', minHeight: esMobil ? 'auto' : '420px', margin: '0' }}>
        {/* Texto izquierda */}
        <div style={{ background: '#f5f1eb', padding: esMobil ? '2.5rem 1.25rem' : '4rem 3rem 4rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a9a9a', margin: '0 0 1.5rem' }}>Verly Optical</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 400, color: '#1d1d1d', margin: '0 0 1rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            {t('Diseñado para', 'Designed for')}<br/><em style={{ fontStyle: 'italic' }}>{t('tu día a día', 'your daily life')}</em>
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#6f6a63', margin: '0 0 2rem', lineHeight: 1.7 }}>{t('Estilo, comodidad y calidad que se adaptan a ti.', 'Style, comfort and quality that adapt to you.')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
            {[t('Ligero y resistente', 'Light and resistant'), t('Comodidad prolongada', 'Extended comfort')].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#6f6a63' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55624c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {b}
              </div>
            ))}
          </div>
          <button onClick={abrirDrawer} style={{ alignSelf: 'flex-start', background: '#1d1d1d', color: 'white', border: 'none', borderRadius: '6px', padding: '12px 24px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = '#55624c')} onMouseLeave={e => (e.currentTarget.style.background = '#1d1d1d')}>
            {t('Ver en modelo', 'See on model')}
          </button>
        </div>

        {/* Imagen modelo — usa imagen5_url exclusivamente */}
        <div style={{ background: '#ddd8cf', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: esMobil ? '280px' : '420px', position: 'relative', overflow: 'hidden' }}>
          {fotoLifestyle ? (
            <img src={fotoLifestyle} alt={`${armazon.nombre} lifestyle`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}/>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.35, padding: '2rem' }}>
              <LenteSVG color="#55624c" forma={armazon.forma} size="large"/>
              <p style={{ fontSize: '0.72rem', color: '#6f6a63', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>{t('Sube una foto lifestyle desde el admin (Foto 5)', 'Upload a lifestyle photo from admin (Photo 5)')}</p>
            </div>
          )}
        </div>

        {/* Highlights verdes — ocultos en móvil para no apilar demasiado */}
        {!esMobil && (
          <div style={{ background: '#55624c', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
            {[
              { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>), titulo: t('Calidad accesible', 'Accessible quality'), sub: t('Gafas premium a precios justos.', 'Premium frames at fair prices.') },
              { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>), titulo: t('Listos para tu receta', 'Ready for your prescription'), sub: t('Micas graduadas para tu estilo de vida.', 'Prescription lenses for your lifestyle.') },
              { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>), titulo: t('Estilo atemporal', 'Timeless style'), sub: t('Diseños modernos que duran.', 'Modern designs that last.') },
              { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4a2 2 0 0 1 2 2v6H16V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>), titulo: t('Envío rápido', 'Fast shipping'), sub: t('Recibe tus lentes en 5–7 días.', 'Receive your glasses in 5–7 days.') },
            ].map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, marginTop: '2px' }}>{h.icon}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '3px' }}>{h.titulo}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{h.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ TAMBIÉN TE PUEDE GUSTAR ══════════════════════════════════════════ */}
      {relacionados.length > 0 && (
        <div style={{ background: '#f5f1eb', padding: esMobil ? '3rem 0' : '4rem 0' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: esMobil ? '0 1.25rem' : '0 3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '1.6rem' : '2rem', fontWeight: 400, color: '#1d1d1d', margin: 0, letterSpacing: '-0.01em' }}>{t('También te puede gustar', 'You might also like')}</h2>
              <a href={esSolar ? '/sunglasses' : '/Tienda'} style={{ fontSize: '0.75rem', color: '#6f6a63', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.15)', paddingBottom: '2px' }}>{t('Ver todos →', 'See all →')}</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: esMobil ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: esMobil ? '12px' : '16px' }}>
              {relacionados.slice(0, 4).map(r => (
                <a key={r.id} href={`/armazon/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s ease', border: '1px solid rgba(0,0,0,0.04)' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
                    <div style={{ aspectRatio: '4/3', background: '#faf9f7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                      {r.imagen_url ? (
                        <img src={r.imagen_url} alt={r.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1.25rem', boxSizing: 'border-box', transition: 'transform 0.4s ease' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}/>
                      ) : (
                        <div style={{ opacity: 0.3 }}><LenteSVG color={r.color || '#1d1d1d'} forma={r.forma} size="small"/></div>
                      )}
                      <button onClick={e => e.preventDefault()} style={{ position: 'absolute', bottom: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '50%', background: 'white', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6f6a63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                    </div>
                    <div style={{ padding: '0.9rem 1.1rem 1.1rem' }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9a9a9a', marginBottom: '4px' }}>{r.nombre}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 400, color: '#1d1d1d' }}>${r.precio}</div>
                        <div style={{ fontSize: '0.65rem', color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>USD</div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ BLOQUE EDITORIAL FINAL ══════════════════════════════════════════ */}
      <div style={{ background: '#edeae3', padding: esMobil ? '3rem 1.25rem' : '5rem 4rem', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '1fr 1fr', gap: esMobil ? '2.5rem' : '4rem', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3.5rem', fontWeight: 400, color: '#1d1d1d', margin: '0 0 1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Verly Optical<br/>
            <em style={{ fontStyle: 'italic', color: '#6f6a63' }}>I see the difference.</em>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#9a9a9a', margin: 0, letterSpacing: '0.02em' }}>{t('Unos lentes, miles de historias.', 'One pair of glasses, thousands of stories.')}</p>
        </div>
        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Acordeon titulo={t('Detalles del armazón', 'Frame details')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {armazon.material && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Material</span><span style={{ fontWeight: 500, color: '#1d1d1d' }}>{armazon.material}</span></div>}
              {armazon.medidas && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t('Medidas', 'Measurements')}</span><span style={{ fontWeight: 500, color: '#1d1d1d' }}>{armazon.medidas}</span></div>}
            </div>
          </Acordeon>
          <Acordeon titulo={t('¿Cómo medir mi cara?', 'How to measure my face?')}>
            {t('Talla S: menos de 13cm · M: 13–14cm · L: 14–15cm · XL: más de 15cm.', 'Size S: under 5.1" · M: 5.1–5.5" · L: 5.5–5.9" · XL: over 5.9".')}
          </Acordeon>
          <Acordeon titulo={t('Envío y devoluciones', 'Shipping & returns')}>
            {t('5–7 días hábiles. Graduados hasta 10 días adicionales. Satisfacción garantizada.', '5–7 business days. Prescription up to 10 additional days. Satisfaction guaranteed.')}
          </Acordeon>
          <Acordeon titulo={t('¿Por qué Verly?', 'Why Verly?')}>
            {t('Calidad premium sin el precio de óptica. Sin aseguranza, sin complicaciones.', 'Premium quality without the optical store price. No insurance, no complications.')}
          </Acordeon>
        </div>
      </div>

      {/* ══ BOTÓN STICKY MÓVIL ══════════════════════════════════════════════ */}
      {esMobil && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem', background: 'white', borderTop: '1px solid rgba(0,0,0,0.08)', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
          <button onClick={abrirDrawer} style={{ display: 'block', width: '100%', textAlign: 'center', background: '#55624c', color: 'white', padding: '18px 32px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            {esSolar ? t('Configurar mis lentes →', 'Configure my lenses →') : t('Personalizar mis micas →', 'Customize my lenses →')}
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </main>
  );
}