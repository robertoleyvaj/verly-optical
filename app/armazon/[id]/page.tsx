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
  imagen_url?: string; tipo?: string;
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
      <button onClick={() => !disabled && setOpen(!open)} disabled={disabled} style={{
        width: '100%', padding: '8px 4px',
        background: disabled ? '#F5F5F5' : open ? 'var(--cream-dark)' : isEmpty ? '#FAFAFA' : 'white',
        border: `1.5px solid ${disabled ? 'var(--border)' : open ? 'var(--sage)' : isEmpty ? 'var(--border)' : 'var(--sage)'}`,
        borderRadius: '6px', cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-sans), sans-serif', transition: 'all 0.15s', textAlign: 'center',
      }}>
        <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.3px', color: disabled ? 'var(--border)' : isEmpty ? 'var(--warm-gray)' : value === 0 ? 'var(--warm-gray)' : 'var(--charcoal)' }}>
          {disabled ? '—' : isEmpty ? '—' : formatVal(value!)}
        </span>
      </button>
      {open && !disabled && (
        <div style={{
          position: 'absolute',
          ...(abreArriba ? { bottom: 'calc(100% + 4px)', top: 'auto' } : { top: 'calc(100% + 4px)', bottom: 'auto' }),
          left: '50%', transform: 'translateX(-50%)',
          width: usarGrid ? '200px' : '130px',
          background: 'white', borderRadius: '8px', zIndex: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '6px', borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
            <input ref={inputRef} type="text"
              placeholder={unit === 'axis' ? 'Ej: 90' : unit === 'dp' ? 'Ej: 63' : 'Ej: -1.25'}
              value={busqueda} onChange={e => setBusqueda(e.target.value)}
              style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '12px', fontFamily: 'var(--font-sans), sans-serif', outline: 'none', boxSizing: 'border-box', textAlign: 'center', background: 'white' }}
            />
          </div>
          <div onClick={() => { onChange(null); setOpen(false); }} style={{ padding: '7px', cursor: 'pointer', fontSize: '13px', color: 'var(--warm-gray)', fontWeight: 500, textAlign: 'center', borderBottom: '1px solid var(--border)', background: isEmpty ? 'var(--cream-dark)' : 'white' }}>—</div>
          {usarGrid ? (
            <div ref={listRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', padding: '6px', maxHeight: '200px', overflowY: 'auto' }}>
              {opcionesFiltradas.map(opt => (
                <div key={opt} data-val={opt} onClick={() => { onChange(opt); setOpen(false); setBusqueda(''); }}
                  style={{ padding: '8px 4px', cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: value === opt ? 700 : 400, color: value === opt ? 'white' : 'var(--charcoal)', background: value === opt ? 'var(--sage)' : 'var(--cream)', borderRadius: '4px', transition: 'all 0.1s' }}
                >{formatVal(opt)}</div>
              ))}
            </div>
          ) : (
            <div ref={listRef} style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {opcionesFiltradas.map(opt => (
                <div key={opt} data-val={opt} onClick={() => { onChange(opt); setOpen(false); setBusqueda(''); }}
                  style={{ padding: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '13px', fontWeight: value === opt ? 700 : 400, color: value === opt ? 'var(--sage)' : 'var(--charcoal)', background: value === opt ? 'var(--cream-dark)' : 'white', borderBottom: '1px solid var(--cream)', transition: 'background 0.1s' }}
                >{formatVal(opt)}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FormReceta({ receta, onChange, errores, t }: {
  receta: RecetaData; onChange: (r: RecetaData) => void;
  errores: string[]; t: (es: string, en: string) => string;
}) {
  const cylOdActivo = receta.cyl_od !== null && receta.cyl_od !== 0;
  const cylOsActivo = receta.cyl_os !== null && receta.cyl_os !== 0;
  return (
    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'visible' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', overflow: 'visible' }}>
        <thead>
          <tr style={{ background: 'var(--cream)' }}>
            <th style={{ padding: '10px 8px', width: '52px', borderBottom: '1px solid var(--border)' }}></th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '1px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>SPH *</th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '1px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>CYL</th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '1px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>{t('EJE', 'AXIS')}</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--cream)' }}>
            <td style={{ padding: '8px', textAlign: 'center' }}>
              <span style={{ background: 'var(--sage)', color: 'white', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '2px' }}>OD</span>
              <span style={{ fontSize: '9px', color: 'var(--warm-gray)' }}>{t('Der.', 'Right')}</span>
            </td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.sph_od} onChange={v => onChange({ ...receta, sph_od: v })} options={SPH_OPTS} unit="sph"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.cyl_od} onChange={v => onChange({ ...receta, cyl_od: v, axis_od: (!v || v === 0) ? null : receta.axis_od })} options={CYL_OPTS} unit="cyl"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={cylOdActivo ? receta.axis_od : null} onChange={v => onChange({ ...receta, axis_od: v })} options={AXIS_OPTS} disabled={!cylOdActivo} unit="axis"/></td>
          </tr>
          <tr>
            <td style={{ padding: '8px', textAlign: 'center' }}>
              <span style={{ background: 'var(--sage-light)', color: 'white', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '2px' }}>OS</span>
              <span style={{ fontSize: '9px', color: 'var(--warm-gray)' }}>{t('Izq.', 'Left')}</span>
            </td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.sph_os} onChange={v => onChange({ ...receta, sph_os: v })} options={SPH_OPTS} unit="sph"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.cyl_os} onChange={v => onChange({ ...receta, cyl_os: v, axis_os: (!v || v === 0) ? null : receta.axis_os })} options={CYL_OPTS} unit="cyl"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={cylOsActivo ? receta.axis_os : null} onChange={v => onChange({ ...receta, axis_os: v })} options={AXIS_OPTS} disabled={!cylOsActivo} unit="axis"/></td>
          </tr>
        </tbody>
      </table>
      <div style={{ padding: '10px 8px', background: 'var(--cream)', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.5px', textAlign: 'center', marginBottom: '5px' }}>
            ADD <span style={{ fontWeight: 400, fontSize: '9px' }}>({t('ambos ojos', 'both eyes')})</span>
          </div>
          <CeldaReceta value={receta.add} onChange={v => onChange({ ...receta, add: v })} options={ADD_OPTS} unit="add"/>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.5px', textAlign: 'center', marginBottom: '5px' }}>
            DP / PD <span style={{ fontWeight: 400, fontSize: '9px' }}>({t('total', 'total')})</span>
          </div>
          <CeldaReceta value={receta.dp} onChange={v => onChange({ ...receta, dp: v })} options={DP_OPTS} unit="dp"/>
        </div>
      </div>
      <div style={{ padding: '8px 10px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>{t('Prisma / Notas', 'Prism / Notes')}</div>
        <input type="text" placeholder={t('Ej: 1.0 base OUT OD', 'Ex: 1.0 base OUT OD')} value={receta.prisma}
          onChange={e => onChange({ ...receta, prisma: e.target.value })}
          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--charcoal)', fontFamily: 'var(--font-sans), sans-serif', outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--sage)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        />
      </div>
      {errores.length > 0 && (
        <div style={{ padding: '8px 10px', borderTop: '1px solid #FFE0E0', background: '#FFF5F5' }}>
          {errores.map((e, i) => (
            <div key={i} style={{ fontSize: '12px', color: '#C0392B', fontWeight: 500, marginBottom: i < errores.length - 1 ? '3px' : 0 }}>⚠ {e}</div>
          ))}
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
  if (add > 0) {
    condicion = lang === 'es' ? 'Presbicia' : 'Presbyopia';
    explicacion = lang === 'es' ? `Tienes adición (ADD +${add.toFixed(2)}), indicando presbicia. El Progresivo corrige todas las distancias sin línea visible.` : `You have presbyopia. Progressive lenses correct all distances without a visible line.`;
  } else if (cyl >= 1.50) {
    condicion = lang === 'es' ? 'Astigmatismo alto' : 'High astigmatism';
    explicacion = lang === 'es' ? 'Astigmatismo alto detectado. Premium Clarity AR ayuda a reducir reflejos y halos al manejar de noche.' : 'High astigmatism detected. Premium Clarity AR helps reduce reflections and night glare.';
  } else if (astigmatismo) {
    condicion = lang === 'es' ? 'Astigmatismo' : 'Astigmatism';
    explicacion = lang === 'es' ? 'Tienes astigmatismo. Premium Clarity AR mejora la comodidad visual y reduce reflejos.' : 'You have astigmatism. Premium Clarity AR improves visual comfort and reduces reflections.';
  } else if (eq > 4.0) {
    condicion = lang === 'es' ? 'Graduación muy alta' : 'Very high prescription';
    explicacion = lang === 'es' ? 'El Ultra Thin Pro hará tus lentes delgados y elegantes.' : 'Ultra Thin Pro makes your lenses thin and elegant.';
  } else if (eq > 2.0) {
    condicion = lang === 'es' ? 'Graduación alta' : 'High prescription';
    explicacion = lang === 'es' ? 'El Ultra Thin reducirá el grosor hasta un 30%.' : 'Ultra Thin will reduce lens thickness by up to 30%.';
  } else {
    condicion = lang === 'es' ? 'Graduación moderada' : 'Moderate prescription';
    explicacion = lang === 'es' ? 'Thin & Durable es resistente para uso diario y el Fotocromático te da comodidad en interior y exterior.' : 'Thin & Durable is strong for everyday wear and Photochromic gives indoor/outdoor comfort.';
  }

  const precioOriginal = PRECIO_ARMAZON + vision.precio + material.precio + filtroBase.precio;
  const descuento = Math.round(precioOriginal * 0.10);
  const precioFinal = precioOriginal - descuento;

  const upsells: { id: string; nombre: string; precio: number; razon: string }[] = [];
  if (filtroBase.id === 'arprem') {
    upsells.push({ id: 'blue', nombre: 'Blue Light Comfort', precio: 18, razon: lang === 'es' ? 'Ayuda con el uso diario de pantallas digitales' : 'Helps with daily digital screen use' });
    upsells.push({ id: 'anti', nombre: 'Anti-Fog', precio: 15, razon: lang === 'es' ? 'Evita que se empañen al cambiar de temperatura' : 'Prevents fogging when changing temperature' });
  } else {
    upsells.push({ id: 'arprem', nombre: 'Premium Clarity AR', precio: 24, razon: lang === 'es' ? 'Ayuda a reducir reflejos al manejar de noche' : 'Helps reduce reflections when driving at night' });
    upsells.push({ id: 'anti', nombre: 'Anti-Fog', precio: 15, razon: lang === 'es' ? 'Evita que se empañen al cambiar de temperatura' : 'Prevents fogging when changing temperature' });
  }

  return { vision, material, filtroBase, precioOriginal, precioFinal, descuento, condicion, explicacion, upsells };
}

function LenteSVG({ color, forma, size = 'large', solar = false }: { color: string; forma: string; size?: string; solar?: boolean }) {
  const rx = forma === 'ovalada' ? '30' : forma === 'rectangular' ? '8' : '14';
  const w = size === 'large' ? 320 : 100;
  const h = size === 'large' ? 180 : 56;
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

function VerlyTip({ mensaje }: { mensaje: string }) {
  if (!mensaje) return null;
  return (
    <div style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.9rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--sage)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0, fontFamily: 'var(--font-serif)' }}>V</div>
      <p style={{ fontSize: '13px', color: 'var(--charcoal)', lineHeight: 1.6, margin: 0 }}>{mensaje}</p>
    </div>
  );
}

function VerlyModalPaquete({ paquete, armazonNombre, onAceptar, onManual, lang }: {
  paquete: PaqueteVerly; armazonNombre: string;
  onAceptar: (extrasIds: string[]) => void; onManual: () => void; lang: 'es' | 'en';
}) {
  const [paso, setPaso] = useState<'paquete' | 'upsell'>('paquete');
  const [extras, setExtras] = useState<string[]>([]);
  const toggleExtra = (id: string) => setExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  const precioExtras = extras.reduce((sum, id) => sum + (paquete.upsells.find(u => u.id === id)?.precio || 0), 0);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)', overflow: 'hidden', animation: 'slideUp 0.3s ease-out', maxHeight: '90vh', overflowY: 'auto' }}>
        {paso === 'paquete' ? (
          <>
            <div style={{ background: 'var(--charcoal)', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                {lang === 'es' ? 'Verly recomienda' : 'Verly recommends'}
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'white', lineHeight: 1.2 }}>
                {lang === 'es' ? 'El paquete perfecto para ti' : 'The perfect package for you'}
              </div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '13px', color: 'var(--charcoal)', lineHeight: 1.6 }}>{paquete.explicacion}</div>
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <div style={{ background: 'var(--cream-dark)', padding: '0.65rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)' }}>
                    {lang === 'es' ? `Paquete ${paquete.condicion}` : `${paquete.condicion} Package`}
                  </span>
                  <span style={{ background: 'var(--sage)', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>-{paquete.descuento}% OFF</span>
                </div>
                <div style={{ padding: '0.75rem 1rem' }}>
                  {[
                    { label: armazonNombre, valor: `$${PRECIO_ARMAZON}` },
                    { label: lang === 'es' ? paquete.vision.nombre : paquete.vision.nombre_en, valor: `+$${paquete.vision.precio}` },
                    { label: lang === 'es' ? paquete.material.nombre : paquete.material.nombre_en, valor: paquete.material.precio === 0 ? (lang === 'es' ? 'Incluido' : 'Included') : `+$${paquete.material.precio}` },
                    { label: lang === 'es' ? paquete.filtroBase.nombre : paquete.filtroBase.nombre_en, valor: `+$${paquete.filtroBase.precio}` },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: i < 3 ? '1px solid var(--cream)' : 'none' }}>
                      <span style={{ color: 'var(--warm-gray)' }}>{item.label}</span>
                      <span style={{ fontWeight: 500 }}>{item.valor}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.75rem 1rem', background: 'var(--cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--warm-gray)', textDecoration: 'line-through' }}>${paquete.precioOriginal} USD</div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--sage)' }}>${paquete.precioFinal} USD</div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--warm-gray)' }}>{lang === 'es' ? `Ahorras $${paquete.descuento}` : `You save $${paquete.descuento}`}</div>
                </div>
              </div>
              <button onClick={() => setPaso('upsell')} style={{ width: '100%', background: 'var(--charcoal)', color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', marginBottom: '10px' }}>
                {lang === 'es' ? 'Sí, quiero este paquete →' : 'Yes, I want this package →'}
              </button>
              <button onClick={onManual} style={{ width: '100%', background: 'white', color: 'var(--warm-gray)', border: '1px solid var(--border)', borderRadius: '6px', padding: '12px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                {lang === 'es' ? 'Prefiero elegir manualmente' : 'I prefer to choose manually'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ background: 'var(--cream-dark)', padding: '1.25rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, color: 'var(--charcoal)' }}>{lang === 'es' ? '¿Le añadimos algo más?' : 'Shall we add anything else?'}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--warm-gray)', marginTop: '4px' }}>{lang === 'es' ? 'Opcional' : 'Optional'}</div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {paquete.upsells.map(u => (
                <div key={u.id} onClick={() => toggleExtra(u.id)} style={{ border: extras.includes(u.id) ? '1.5px solid var(--sage)' : '1px solid var(--border)', borderRadius: '8px', padding: '1rem', cursor: 'pointer', background: extras.includes(u.id) ? 'var(--cream-dark)' : 'white', marginBottom: '0.75rem', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '1.5px solid', borderColor: extras.includes(u.id) ? 'var(--sage)' : 'var(--border)', background: extras.includes(u.id) ? 'var(--sage)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', flexShrink: 0 }}>
                      {extras.includes(u.id) ? '✓' : ''}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)' }}>{u.nombre}</div>
                      <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{u.razon}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--sage)', flexShrink: 0 }}>+${u.precio}</div>
                </div>
              ))}
              <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '0.9rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--warm-gray)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--charcoal)' }}>${paquete.precioFinal + precioExtras} USD</span>
              </div>
              <button onClick={() => onAceptar(extras)} style={{ width: '100%', background: 'var(--sage)', color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', marginBottom: '10px' }}>
                {lang === 'es' ? 'Ir al resumen →' : 'Go to summary →'}
              </button>
              <button onClick={() => onAceptar([])} style={{ width: '100%', background: 'white', color: 'var(--warm-gray)', border: '1px solid var(--border)', borderRadius: '6px', padding: '11px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                {lang === 'es' ? 'No gracias, ir al resumen' : 'No thanks, go to summary'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ModalRecetaObligatoria({ onGuardar, onSinGraduacion, lang, t }: {
  onGuardar: (receta: RecetaData | null, foto: string | null) => void;
  onSinGraduacion: () => void;
  lang: 'es' | 'en';
  t: (es: string, en: string) => string;
}) {
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
        <div style={{ background: 'var(--charcoal)', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300, color: 'white', marginBottom: '4px' }}>
            {t('Necesitamos tu graduación', 'We need your prescription')}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
            {t('Para fabricar tus lentes perfectamente', 'To make your lenses perfectly')}
          </div>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {modo === 'opciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: '✏️', title: t('Escribir graduación', 'Enter prescription manually'), sub: t('SPH, CYL, EJE, ADD y PD', 'SPH, CYL, AXIS, ADD and PD'), onClick: () => setModo('manual') },
                { icon: '📷', title: t('Subir foto de mi receta', 'Upload prescription photo'), sub: t('Foto, PDF o captura de pantalla', 'Photo, PDF or screenshot'), onClick: () => setModo('foto') },
                { icon: '🕶️', title: t('No tengo graduación', "I don't have a prescription"), sub: t('Lentes sin aumento, blue light o moda', 'Non-prescription, blue light or fashion'), onClick: onSinGraduacion },
              ].map((opt, i) => (
                <button key={i} onClick={opt.onClick} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans), sans-serif', width: '100%', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--sage)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--cream-dark)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--cream)'; }}
                >
                  <span style={{ fontSize: '22px' }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)' }}>{opt.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{opt.sub}</div>
                  </div>
                  <span style={{ color: 'var(--warm-gray)', fontSize: '18px' }}>›</span>
                </button>
              ))}
            </div>
          )}
          {modo === 'manual' && (
            <div>
              <button onClick={() => setModo('opciones')} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontSize: '13px', cursor: 'pointer', marginBottom: '1rem', padding: 0, fontFamily: 'var(--font-sans)' }}>
                ← {t('Atrás', 'Back')}
              </button>
              <FormReceta receta={receta} onChange={setReceta} errores={errores} t={t}/>
              <button onClick={() => {
                const errs = validar();
                if (errs.length > 0) { setErrores(errs); return; }
                onGuardar(receta, null);
              }} style={{ width: '100%', background: 'var(--charcoal)', color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', marginTop: '1rem' }}>
                {t('Confirmar graduación y pagar →', 'Confirm prescription & pay →')}
              </button>
            </div>
          )}
          {modo === 'foto' && (
            <div>
              <button onClick={() => setModo('opciones')} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontSize: '13px', cursor: 'pointer', marginBottom: '1rem', padding: 0, fontFamily: 'var(--font-sans)' }}>
                ← {t('Atrás', 'Back')}
              </button>
              {fotoUrl ? (
                <div style={{ marginBottom: '1rem' }}>
                  <img src={fotoUrl} alt="receta" style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'contain', border: '1px solid var(--border)' }}/>
                  <button onClick={() => setFotoUrl('')} style={{ background: 'none', border: 'none', color: '#C0392B', fontSize: '12px', cursor: 'pointer', marginTop: '8px', fontFamily: 'var(--font-sans)' }}>
                    {t('Quitar foto', 'Remove photo')}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
                  {[
                    { icon: '📁', title: t('Subir archivo', 'Upload file'), sub: 'JPG, PNG, PDF', capture: undefined, accept: 'image/*,.pdf' },
                    { icon: '📸', title: t('Tomar foto ahora', 'Take photo now'), sub: t('Usa la cámara de tu dispositivo', 'Use your device camera'), capture: 'environment' as const, accept: 'image/*' },
                  ].map((opt, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--border)', cursor: 'pointer', background: 'var(--cream)' }}>
                      <input type="file" accept={opt.accept} capture={opt.capture} style={{ display: 'none' }}
                        onChange={e => { const file = e.target.files?.[0]; if (file) setFotoUrl(URL.createObjectURL(file)); }}
                      />
                      <span style={{ fontSize: '22px' }}>{opt.icon}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)' }}>{opt.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--warm-gray)' }}>{opt.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {fotoUrl && (
                <button onClick={() => onGuardar(null, fotoUrl)} style={{ width: '100%', background: 'var(--charcoal)', color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}>
                  {t('Confirmar foto y pagar →', 'Confirm photo & pay →')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HELPER: selector de colores ─────────────────────────────────────────────
function SelectorColores({ colores, valorActivo, onChange, lang }: {
  colores: { id: string; nombre_es: string; nombre_en: string; hex: string }[];
  valorActivo: string;
  onChange: (id: string) => void;
  lang: string;
}) {
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {colores.map(c => (
        <div key={c.id} onClick={() => onChange(c.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.hex, border: valorActivo === c.id ? '2.5px solid var(--charcoal)' : '2.5px solid transparent', outline: valorActivo === c.id ? '1.5px solid var(--sage)' : 'none', outlineOffset: '2px', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', transition: 'all 0.15s' }}/>
          <span style={{ fontSize: '10px', fontWeight: valorActivo === c.id ? 600 : 400, color: valorActivo === c.id ? 'var(--charcoal)' : 'var(--warm-gray)' }}>
            {lang === 'es' ? c.nombre_es : c.nombre_en}
          </span>
        </div>
      ))}
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

  const emptyReceta = (): RecetaData => ({
    sph_od: null, cyl_od: null, axis_od: null,
    sph_os: null, cyl_os: null, axis_os: null,
    add: null, dp: null, prisma: '',
  });
  const [receta, setReceta] = useState<RecetaData>(emptyReceta());

  const [paso, setPaso] = useState(1);
  const [vision, setVision] = useState('');
  const [material, setMaterial] = useState('');
  const [filtros, setFiltros] = useState<string[]>([]);
  const [colorFoto, setColorFoto] = useState('gris');
  const [colorPolarizado, setColorPolarizado] = useState('negro');
  const [colorTinte, setColorTinte] = useState('negro');
  const [loadingPago, setLoadingPago] = useState(false);
  const [fotoActiva, setFotoActiva] = useState(0);
const [zoom, setZoom] = useState(false);
const [posZoom, setPosZoom] = useState({ x: 50, y: 50 }); 

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

  const toggleFiltro = (fid: string) => {
    setFiltros(prev => prev.includes(fid) ? prev.filter(f => f !== fid) : [...prev, fid]);
  };

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

  const elegirManual = () => {
    setVerlyModal(false);
    setDrawerEstado('config');
    setPaso(1);
  };

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
      if (soloArmazon) {
        items = `${armazon?.nombre} (solo armazón)`;
      } else {
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
        const { data: rel } = await supabase.from('armazones').select('*').eq('activo', true).eq('forma', data.forma).neq('id', id).limit(4);
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

  const abrirDrawer = () => {
    setDrawerOpen(true);
    setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio');
    setSoloArmazon(false);
  };

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

  if (loading) return (
    <main style={{ fontFamily: 'var(--font-sans), sans-serif', background: 'var(--cream)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--warm-gray)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300 }}>{t('Cargando...', 'Loading...')}</div>
    </main>
  );

  if (!armazon) return (
    <main style={{ fontFamily: 'var(--font-sans), sans-serif', background: 'var(--cream)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--warm-gray)' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300 }}>{t('Armazón no encontrado.', 'Frame not found.')}</p>
        <a href="/Tienda" style={{ color: 'var(--sage)', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('← Volver', '← Back')}</a>
      </div>
    </main>
  );

  return (
    <main style={{ fontFamily: 'var(--font-sans), sans-serif', background: 'var(--cream)', minHeight: '100vh', color: 'var(--charcoal)' }}>
      <Navbar />

      {verlyModal && paqueteVerly && (
        <VerlyModalPaquete paquete={paqueteVerly} armazonNombre={armazon.nombre} onAceptar={aceptarPaquete} onManual={elegirManual} lang={lang || 'en'}/>
      )}

      {modalRecetaPago && (
        <ModalRecetaObligatoria lang={lang || 'en'} t={t}
          onGuardar={(r, foto) => {
            if (r) { setReceta(r); setRecetaEstado('guardada'); }
            if (foto) { setFotoReceta(foto); setRecetaEstado('foto'); }
            ejecutarPago();
          }}
          onSinGraduacion={() => { setRecetaEstado('sin_graduacion'); ejecutarPago(); }}
        />
      )}

      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>}

      {/* DRAWER */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '480px', maxWidth: '100vw', background: 'white', zIndex: 201, boxShadow: '-4px 0 32px rgba(0,0,0,0.10)', transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: 0 }}>{t('Personalizando', 'Customizing')}</p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, margin: '2px 0 0', color: 'var(--charcoal)' }}>{armazon.nombre}</h3>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'var(--cream)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', fontSize: '18px', color: 'var(--warm-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* INICIO SOLAR */}
        {drawerEstado === 'inicio_solar' && (
          <div style={{ padding: '1.5rem', flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>
                {t('¿Cómo quieres tus lentes?', 'How do you want your lenses?')}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--warm-gray)', letterSpacing: '0.02em' }}>
                {t('Puedes llevarlos como vienen o personalizarlos completamente.', 'Wear them as-is or fully customize them.')}
              </p>
            </div>
            <div
              onClick={() => { setSoloArmazon(true); setDrawerEstado('config'); setPaso(4); }}
              style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.25rem 1.5rem', cursor: 'pointer', background: 'var(--cream)', marginBottom: '0.75rem', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--sage)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--cream-dark)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--cream)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--charcoal)' }}>{t('Solo el armazón', 'Frame only')}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 500 }}>${precioArmazon} USD</span>
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--warm-gray)', lineHeight: 1.6, margin: '0 0 0.75rem' }}>
                {t('Incluye lentes oscuros estándar. Sin graduación.', 'Includes standard dark lenses. No prescription.')}
              </p>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)' }}>{t('Seleccionar →', 'Select →')}</span>
            </div>
            <div
              onClick={() => { setSoloArmazon(false); setDrawerEstado('inicio'); }}
              style={{ border: '1px solid var(--charcoal)', borderRadius: '8px', padding: '1.25rem 1.5rem', cursor: 'pointer', background: 'var(--charcoal)', marginBottom: '1.5rem', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#2a2a28'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--charcoal)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, color: 'white' }}>{t('Personalizar mis micas', 'Customize my lenses')}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginTop: '4px' }}>{t('desde', 'from')} ${precioArmazon + 15}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: '0 0 0.75rem' }}>
                {t('Agregar graduación, polarizado, fotocromático, tinte y más.', 'Add prescription, polarized, photochromic, tint and more.')}
              </p>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>{t('Personalizar →', 'Customize →')}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--warm-gray)', textAlign: 'center', letterSpacing: '0.02em', lineHeight: 1.6 }}>
              {t('Todos nuestros lentes de sol se pueden graduar.', 'All our sunglasses can be made with prescription lenses.')}
            </p>
          </div>
        )}

        {/* INICIO ÓPTICO */}
        {drawerEstado === 'inicio' && (
          <div style={{ padding: '1.5rem', flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '4px' }}>{t('¿Tienes tu graduación?', 'Do you have your prescription?')}</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--warm-gray)' }}>{t('Úsala para personalizar tus micas o agrégala después', 'Use it to customize your lenses or add it later')}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: '✏️', title: t('Escribir manualmente', 'Enter manually'), sub: t('SPH, CYL, EJE, ADD, PD', 'SPH, CYL, AXIS, ADD, PD'), onClick: () => setDrawerEstado('manual') },
                { icon: '📷', title: t('Subir o tomar foto', 'Upload or take photo'), sub: t('Foto, PDF o captura de tu receta', 'Photo, PDF or screenshot'), onClick: () => setDrawerEstado('foto') },
                { icon: '🕐', title: t('La agregaré después', "I'll add it later"), sub: t('Continúa y agrega tu receta antes de pagar', 'Keep going and add your prescription before paying'), onClick: () => { setRecetaEstado('despues'); setDrawerEstado('config'); setPaso(1); } },
              ].map((opt, i) => (
                <button key={i} onClick={opt.onClick} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans), sans-serif', width: '100%', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--sage)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--cream-dark)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--cream)'; }}
                >
                  <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)' }}>{opt.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{opt.sub}</div>
                  </div>
                  <span style={{ color: 'var(--warm-gray)', fontSize: '18px' }}>›</span>
                </button>
              ))}
            </div>
            {esSolar && (
              <button onClick={() => setDrawerEstado('inicio_solar')} style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: 'var(--warm-gray)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '0.04em' }}>
                ← {t('Volver', 'Back')}
              </button>
            )}
          </div>
        )}

        {/* MANUAL */}
        {drawerEstado === 'manual' && (
          <div style={{ padding: '1.5rem', flex: 1 }}>
            <button onClick={() => setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio')} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontSize: '13px', cursor: 'pointer', marginBottom: '1rem', padding: 0, fontFamily: 'var(--font-sans)' }}>
              ← {t('Atrás', 'Back')}
            </button>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '1rem' }}>{t('Tu receta óptica', 'Your optical prescription')}</div>
            <FormReceta receta={receta} onChange={setReceta} errores={errores} t={t}/>
            <button onClick={guardarRecetaManual} style={{ width: '100%', background: 'var(--charcoal)', color: 'white', border: 'none', borderRadius: '6px', padding: '13px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', marginTop: '1rem' }}>
              {t('Guardar y ver recomendación de Verly →', 'Save & see Verly recommendation →')}
            </button>
            <button onClick={() => { setRecetaEstado('despues'); setDrawerEstado('config'); setPaso(1); }} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--warm-gray)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: '8px', marginTop: '4px' }}>
              {t('Continuar sin receta por ahora', 'Continue without prescription for now')}
            </button>
          </div>
        )}

        {/* FOTO */}
        {drawerEstado === 'foto' && (
          <div style={{ padding: '1.5rem', flex: 1 }}>
            <button onClick={() => setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio')} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontSize: '13px', cursor: 'pointer', marginBottom: '1rem', padding: 0, fontFamily: 'var(--font-sans)' }}>
              ← {t('Atrás', 'Back')}
            </button>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 300, marginBottom: '1rem' }}>{t('Sube tu receta', 'Upload your prescription')}</div>
            {fotoReceta ? (
              <div style={{ marginBottom: '1rem' }}>
                <img src={fotoReceta} alt="receta" style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'contain', border: '1px solid var(--border)' }}/>
                <button onClick={() => setFotoReceta('')} style={{ background: 'none', border: 'none', color: '#C0392B', fontSize: '12px', cursor: 'pointer', marginTop: '8px', fontFamily: 'var(--font-sans)' }}>
                  {t('Quitar foto', 'Remove photo')}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
                {[
                  { icon: '📁', title: t('Subir archivo', 'Upload file'), sub: 'JPG, PNG, PDF', capture: undefined, accept: 'image/*,.pdf' },
                  { icon: '📸', title: t('Tomar foto ahora', 'Take photo now'), sub: t('Usa la cámara de tu dispositivo', 'Use your device camera'), capture: 'environment' as const, accept: 'image/*' },
                ].map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px dashed var(--border)', cursor: 'pointer', background: 'var(--cream)' }}>
                    <input type="file" accept={opt.accept} capture={opt.capture} style={{ display: 'none' }}
                      onChange={e => { const file = e.target.files?.[0]; if (file) setFotoReceta(URL.createObjectURL(file)); }}
                    />
                    <span style={{ fontSize: '22px' }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)' }}>{opt.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--warm-gray)' }}>{opt.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            {fotoReceta && (
              <button onClick={() => { setRecetaEstado('foto'); setDrawerEstado('config'); setPaso(1); }} style={{ width: '100%', background: 'var(--charcoal)', color: 'white', border: 'none', borderRadius: '6px', padding: '13px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}>
                {t('Foto guardada — continuar →', 'Photo saved — continue →')}
              </button>
            )}
            <button onClick={() => { setRecetaEstado('despues'); setDrawerEstado('config'); setPaso(1); }} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--warm-gray)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: '8px', marginTop: '8px' }}>
              {t('Continuar sin foto por ahora', 'Continue without photo for now')}
            </button>
          </div>
        )}

        {/* CONFIG */}
        {drawerEstado === 'config' && (
          <>
            {tieneReceta && (
              <div style={{ padding: '10px 1.5rem', background: 'var(--cream-dark)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--sage)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>✓</div>
                <div style={{ flex: 1, fontSize: '11px', color: 'var(--charcoal)', fontWeight: 500 }}>{resumenReceta()}</div>
                <button onClick={() => setDrawerEstado('inicio')} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{t('Editar', 'Edit')}</button>
              </div>
            )}
            {recetaEstado === 'despues' && (
              <div style={{ padding: '10px 1.5rem', background: '#FFF8E8', borderBottom: '1px solid #F5C51830', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px' }}>⚠️</span>
                <div style={{ flex: 1, fontSize: '11px', color: '#9A7000', fontWeight: 500 }}>{t('Recuerda agregar tu graduación antes de pagar', 'Remember to add your prescription before paying')}</div>
                <button onClick={() => setDrawerEstado('inicio')} style={{ background: 'none', border: 'none', color: '#B8860B', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{t('Agregar', 'Add')}</button>
              </div>
            )}

            {/* Solo armazón */}
            {soloArmazon ? (
              <div style={{ padding: '1.5rem', flex: 1 }}>
                <VerlyTip mensaje={t('Llevarás el armazón con lentes oscuros estándar, sin graduación.', "You'll get the frame with standard dark lenses, no prescription.")} />
                <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--warm-gray)' }}>{armazon.nombre}</span>
                    <span style={{ fontWeight: 500 }}>${precioArmazon}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}>
                    <span style={{ color: 'var(--warm-gray)' }}>{t('Lentes oscuros estándar', 'Standard dark lenses')}</span>
                    <span style={{ color: 'var(--sage)', fontWeight: 500 }}>{t('Incluido', 'Included')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300 }}>
                    <span>Total</span><span>${precioArmazon} USD</span>
                  </div>
                </div>
                <button onClick={() => { setSoloArmazon(false); setDrawerEstado('inicio_solar'); }} style={{ width: '100%', background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px', fontSize: '12px', color: 'var(--warm-gray)', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginBottom: '10px' }}>
                  {t('← Personalizar mis micas', '← Customize my lenses')}
                </button>
                <button onClick={handlePago} disabled={loadingPago} style={{ width: '100%', background: loadingPago ? 'var(--warm-gray)' : 'var(--charcoal)', color: 'white', border: 'none', borderRadius: '6px', padding: '15px', fontSize: '13px', cursor: loadingPago ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '0.08em' }}>
                  {loadingPago ? t('Procesando...', 'Processing...') : t('Pagar con tarjeta →', 'Pay with card →')}
                </button>
              </div>
            ) : (
              <>
                {/* Stepper */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pasos.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: paso > i + 1 ? 'var(--sage)' : 'white', border: paso >= i + 1 ? '1.5px solid var(--sage)' : '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '11px', color: paso > i + 1 ? 'white' : paso === i + 1 ? 'var(--sage)' : 'var(--warm-gray)' }}>
                            {paso > i + 1 ? '✓' : i + 1}
                          </div>
                          <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', color: paso >= i + 1 ? 'var(--sage)' : 'var(--warm-gray)' }}>{p}</span>
                        </div>
                        {i < pasos.length - 1 && <div style={{ width: '36px', height: '1px', background: paso > i + 1 ? 'var(--sage)' : 'var(--border)', margin: '0 4px 16px' }}/>}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <VerlyTip mensaje={verlyTips[paso] || ''} />

                  {/* Paso 1 — Visión */}
                  {paso === 1 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '0.25rem' }}>{t('Tipo de visión', 'Vision type')}</h4>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: '1rem' }}>{t('¿Cómo ves?', 'How do you see?')}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {visionOpts.map(o => (
                          <div key={o.id} onClick={() => setVision(o.id)} style={{ border: vision === o.id ? '1.5px solid var(--sage)' : '1px solid var(--border)', borderRadius: '8px', padding: '0.9rem 1rem', cursor: 'pointer', background: vision === o.id ? 'var(--cream-dark)' : 'white', transition: 'all 0.15s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 500 }}>{lang === 'es' ? o.nombre : o.nombre_en}</div>
                                <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{t(o.desc_es, o.desc_en)}</div>
                              </div>
                              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--sage)' }}>+${o.precio}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Paso 2 — Material */}
                  {paso === 2 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '0.25rem' }}>{t('Material de la mica', 'Lens material')}</h4>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: '1rem' }}>{t('Afecta el grosor y peso.', 'Affects thickness and weight.')}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {materialOpts.map(o => (
                          <div key={o.id} onClick={() => setMaterial(o.id)} style={{ border: material === o.id ? '1.5px solid var(--sage)' : '1px solid var(--border)', borderRadius: '8px', padding: '0.9rem 1rem', cursor: 'pointer', background: material === o.id ? 'var(--cream-dark)' : 'white', transition: 'all 0.15s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 500 }}>{lang === 'es' ? o.nombre : o.nombre_en}</div>
                                <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{t(o.desc_es, o.desc_en)}</div>
                              </div>
                              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--sage)' }}>{o.precio === 0 ? t('Incluido', 'Included') : `+$${o.precio}`}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Paso 3 — Filtros */}
                  {paso === 3 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '0.25rem' }}>{t('Filtros y protecciones', 'Filters & coatings')}</h4>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: '1rem' }}>{t('Opcionales. Puedes elegir varios.', 'Optional. You can choose multiple.')}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {filtrosActivos.map(o => {
                          const tieneColores = (o.id === 'foto' || o.id === 'pol' || o.id === 'tinte') && filtros.includes(o.id);
                          return (
                            <div key={o.id}>
                              <div
                                onClick={() => toggleFiltro(o.id)}
                                style={{ border: filtros.includes(o.id) ? '1.5px solid var(--sage)' : '1px solid var(--border)', borderRadius: tieneColores ? '8px 8px 0 0' : '8px', padding: '0.9rem 1rem', cursor: 'pointer', background: filtros.includes(o.id) ? 'var(--cream-dark)' : 'white', transition: 'all 0.15s' }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '3px', border: '1.5px solid', borderColor: filtros.includes(o.id) ? 'var(--sage)' : 'var(--border)', background: filtros.includes(o.id) ? 'var(--sage)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', flexShrink: 0 }}>
                                      {filtros.includes(o.id) ? '✓' : ''}
                                    </div>
                                    <div>
                                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{lang === 'es' ? o.nombre : o.nombre_en}</div>
                                      <div style={{ fontSize: '12px', color: 'var(--warm-gray)' }}>{t(o.desc_es, o.desc_en)}</div>
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--sage)' }}>+${o.precio}</div>
                                </div>
                              </div>

                              {/* Selector de colores para fotocromático */}
                              {o.id === 'foto' && filtros.includes('foto') && (
                                <div style={{ border: '1.5px solid var(--sage)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1rem', background: 'var(--cream)' }}>
                                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '10px' }}>
                                    {t('Elige el color', 'Choose the color')}
                                  </div>
                                  <SelectorColores colores={coloresDisponibles} valorActivo={colorFoto} onChange={setColorFoto} lang={lang}/>
                                </div>
                              )}

                              {/* Selector de colores para polarizado */}
                              {o.id === 'pol' && filtros.includes('pol') && (
                                <div style={{ border: '1.5px solid var(--sage)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1rem', background: 'var(--cream)' }}>
                                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '10px' }}>
                                    {t('Elige el color', 'Choose the color')}
                                  </div>
                                  <SelectorColores colores={COLORES_POLARIZADO} valorActivo={colorPolarizado} onChange={setColorPolarizado} lang={lang}/>
                                </div>
                              )}

                              {/* Selector de colores para tinte */}
                              {o.id === 'tinte' && filtros.includes('tinte') && (
                                <div style={{ border: '1.5px solid var(--sage)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1rem', background: 'var(--cream)' }}>
                                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '10px' }}>
                                    {t('Elige el color', 'Choose the color')}
                                  </div>
                                  <SelectorColores colores={COLORES_TINTE} valorActivo={colorTinte} onChange={setColorTinte} lang={lang}/>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Paso 4 — Resumen */}
                  {paso === 4 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '1rem' }}>{t('Resumen de tu pedido', 'Order summary')}</h4>
                      <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                        {[
                          { label: t('Armazón', 'Frame'), value: `$${precioArmazon}` },
                          { label: `${t('Visión', 'Vision')}: ${lang === 'es' ? (visionOpts.find(v => v.id === vision)?.nombre || '-') : (visionOpts.find(v => v.id === vision)?.nombre_en || '-')}`, value: `+$${precioVision}` },
                          { label: `${t('Material', 'Material')}: ${lang === 'es' ? (materialOpts.find(m => m.id === material)?.nombre || '-') : (materialOpts.find(m => m.id === material)?.nombre_en || '-')}`, value: precioMaterial === 0 ? t('Incluido', 'Included') : `+$${precioMaterial}` },
                          ...filtroOpts.filter(f => filtros.includes(f.id)).map(f => {
                            const nombre = lang === 'es' ? f.nombre : f.nombre_en;
                            let label = nombre;
                            if (f.id === 'foto') label = `${nombre} — ${COLORES_FOTO.find(c => c.id === colorFoto)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorFoto}`;
                            if (f.id === 'pol') label = `${nombre} — ${COLORES_POLARIZADO.find(c => c.id === colorPolarizado)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorPolarizado}`;
                            if (f.id === 'tinte') label = `${nombre} — ${COLORES_TINTE.find(c => c.id === colorTinte)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorTinte}`;
                            return { label, value: `+$${f.precio}` };
                          }),
                        ].map((item, i, arr) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', fontSize: '13px' }}>
                            <span style={{ color: 'var(--warm-gray)' }}>{item.label}</span>
                            <span style={{ fontWeight: 500 }}>{item.value}</span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300 }}>
                          <span>Total</span><span>${total} USD</span>
                        </div>
                      </div>
                      {!tieneReceta && (
                        <div style={{ background: '#FFF8E8', borderRadius: '8px', padding: '0.9rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #F5C518' }}>
                          <span>⚠️</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: 500, color: '#9A7000' }}>{t('Graduación pendiente', 'Prescription pending')}</div>
                            <div style={{ fontSize: '11px', color: '#9A7000' }}>{t('Se te pedirá antes de finalizar el pago', "You'll be asked before completing payment")}</div>
                          </div>
                          <button onClick={() => setDrawerEstado('inicio')} style={{ background: '#F5C518', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: 'var(--charcoal)', fontFamily: 'var(--font-sans)' }}>
                            {t('Agregar', 'Add')}
                          </button>
                        </div>
                      )}
                      <button onClick={handlePago} disabled={loadingPago} style={{ width: '100%', background: loadingPago ? 'var(--warm-gray)' : 'var(--charcoal)', color: 'white', border: 'none', borderRadius: '6px', padding: '15px', fontSize: '13px', cursor: loadingPago ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '0.08em' }}>
                        {loadingPago ? t('Procesando...', 'Processing...') : tieneReceta ? t('Pagar con tarjeta →', 'Pay with card →') : t('Continuar al pago →', 'Continue to payment →')}
                      </button>
                    </div>
                  )}
                </div>

                {paso < 4 && (
                  <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, background: 'white' }}>
                    {paso > 1
                      ? <button onClick={() => setPaso(p => p - 1)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '4px', padding: '9px 18px', fontSize: '12px', cursor: 'pointer', color: 'var(--warm-gray)', fontFamily: 'var(--font-sans)', letterSpacing: '0.04em' }}>← {t('Atrás', 'Back')}</button>
                      : <button onClick={() => setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '4px', padding: '9px 18px', fontSize: '12px', cursor: 'pointer', color: 'var(--warm-gray)', fontFamily: 'var(--font-sans)', letterSpacing: '0.04em' }}>← {t('Mi receta', 'My prescription')}</button>
                    }
                    <button
                      onClick={() => { if (paso === 1 && !vision) return; if (paso === 2 && !material) return; setPaso(p => p + 1); }}
                      style={{ background: (paso === 1 && !vision) || (paso === 2 && !material) ? 'var(--border)' : 'var(--charcoal)', color: (paso === 1 && !vision) || (paso === 2 && !material) ? 'var(--warm-gray)' : 'white', border: 'none', borderRadius: '4px', padding: '9px 22px', fontSize: '12px', fontWeight: 500, cursor: (paso === 1 && !vision) || (paso === 2 && !material) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}
                    >
                      {paso === 3 ? t('Ver resumen →', 'See summary →') : t('Siguiente →', 'Next →')}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* BREADCRUMB */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '0.85rem 2rem', fontSize: '0.72rem', color: 'var(--warm-gray)', letterSpacing: '0.04em', marginTop: '64px' }}>
        <a href="/" style={{ color: 'var(--warm-gray)', textDecoration: 'none' }}>{t('Inicio', 'Home')}</a>
        <span style={{ margin: '0 8px' }}>›</span>
        <a href={esSolar ? '/sunglasses' : '/Tienda'} style={{ color: 'var(--warm-gray)', textDecoration: 'none' }}>{esSolar ? 'Sunglasses' : t('Tienda', 'Store')}</a>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: 'var(--charcoal)' }}>{armazon.nombre}</span>
      </div>

      {/* DETALLE PRINCIPAL */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: esMobil ? '1.5rem 1rem' : '3rem 2rem', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '1fr 1fr', gap: esMobil ? '1.5rem' : '4rem', alignItems: 'start' }}>
        {/* GALERÍA */}
        {(() => { const fotos = [armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean) as string[]; return null; })()}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{ background: '#EDEAE4', borderRadius: '4px', overflow: 'hidden', position: 'relative', cursor: [armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean).length > 0 ? (zoom ? 'zoom-out' : 'zoom-in') : 'default', aspectRatio: '4/3' }}
            onClick={() => [armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean).length > 0 && setZoom(!zoom)}
            onMouseMove={e => { const rect = e.currentTarget.getBoundingClientRect(); setPosZoom({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 }); }}
            onMouseLeave={() => setZoom(false)}
          >
            {[armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean).length > 0 ? (
              <img
                src={([armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean) as string[])[fotoActiva]}
                alt={armazon.nombre}
                style={{ width: '100%', height: '100%', objectFit: 'contain', transformOrigin: `${posZoom.x}% ${posZoom.y}%`, transform: zoom ? 'scale(2.2)' : 'scale(1)', transition: zoom ? 'none' : 'transform 0.3s ease', display: 'block', padding: '1.5rem', boxSizing: 'border-box' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', boxSizing: 'border-box' }}>
                <LenteSVG color={armazon.color || 'var(--charcoal)'} forma={armazon.forma} size="large" solar={esSolar}/>
              </div>
            )}
            {[armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean).length > 1 && !zoom && (
              <>
                <button onClick={e => { e.stopPropagation(); setFotoActiva(prev => (prev - 1 + [armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean).length) % [armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean).length); }} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', color: 'var(--charcoal)' }}>‹</button>
                <button onClick={e => { e.stopPropagation(); setFotoActiva(prev => (prev + 1) % [armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean).length); }} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', color: 'var(--charcoal)' }}>›</button>
              </>
            )}
            {esSolar && (
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)', background: 'var(--cream)', padding: '3px 9px', border: '1px solid var(--border)' }}>
                {t('Graduable', 'Rx Ready')}
              </div>
            )}
            {[armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean).length > 0 && !zoom && (
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(255,255,255,0.75)', borderRadius: '4px', padding: '3px 8px', fontSize: '10px', color: 'var(--warm-gray)', fontFamily: 'var(--font-sans)', pointerEvents: 'none' }}>
                🔍 Zoom
              </div>
            )}
          </div>
          {[armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean).length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {([armazon.imagen_url, (armazon as any).imagen2_url, (armazon as any).imagen3_url].filter(Boolean) as string[]).map((foto, i) => (
                <button key={i} onClick={() => setFotoActiva(i)} style={{ width: '72px', height: '72px', borderRadius: '4px', overflow: 'hidden', border: fotoActiva === i ? '2px solid var(--charcoal)' : '2px solid var(--border)', background: '#EDEAE4', cursor: 'pointer', padding: 0, flexShrink: 0, transition: 'border-color 0.15s' }}>
                  <img src={foto} alt={`${armazon.nombre} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px', boxSizing: 'border-box' }}/>
                </button>
              ))}
            </div>
          )}
        </div>
        </div>

        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', background: 'var(--cream-dark)', padding: '4px 10px', border: '1px solid var(--border)' }}>
              {armazon.genero === 'hombre' ? t('Hombre', 'Men') : armazon.genero === 'mujer' ? t('Mujer', 'Women') : 'Unisex'}
            </span>
            {armazon.badge && (
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)', background: 'var(--cream-dark)', padding: '4px 10px', border: '1px solid var(--border)' }}>
                {armazon.badge}
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 300, letterSpacing: '-0.01em', marginBottom: '0.25rem', lineHeight: 1.1 }}>{armazon.nombre}</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: '1.5rem', letterSpacing: '0.04em', textTransform: 'capitalize' }}>{t(`Forma ${armazon.forma}`, `${armazon.forma} frame`)}</p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300 }}>${armazon.precio}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--warm-gray)', letterSpacing: '0.06em' }}>USD</span>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--warm-gray)', marginBottom: '2rem', lineHeight: 1.7 }}>
            {esSolar
              ? t('Lentes de sol con opción de graduación. Personaliza tus micas o llévalo tal como es.', 'Sunglasses with prescription option. Customize your lenses or wear them as-is.')
              : t('Personaliza tus lentes según tu graduación y estilo de vida.', 'Customize your lenses based on your prescription and lifestyle.')
            }
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '0.75rem' }}>{t('Color', 'Color')}</p>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: armazon.color, border: '2px solid var(--border)' }}/>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { es: 'Envío rápido dentro de Estados Unidos', en: 'Fast U.S. shipping' },
              { es: 'Pago seguro con tarjeta', en: 'Secure card checkout' },
              { es: 'No necesitas aseguranza', en: 'No insurance needed' },
              esSolar
                ? { es: 'Se puede graduar con cualquier receta', en: 'Can be made with any prescription' }
                : { es: 'Micas personalizadas a tu graduación', en: 'Lenses customized to your prescription' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--warm-gray)' }}>
                <span style={{ color: 'var(--sage)' }}>✓</span>{t(b.es, b.en)}
              </div>
            ))}
          </div>

          <button onClick={abrirDrawer}
            style={{ display: 'block', width: '100%', textAlign: 'center', background: 'var(--charcoal)', color: 'white', padding: '16px 32px', borderRadius: '2px', fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', marginBottom: '12px', transition: 'background 0.2s ease' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--sage)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--charcoal)')}
          >
            {esSolar ? t('Configurar →', 'Configure →') : t('Personalizar mis micas →', 'Customize my lenses →')}
          </button>
          <a href={esSolar ? '/sunglasses' : '/Tienda'}
            style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', padding: '12px', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: '2px', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--charcoal)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            {esSolar ? t('← Ver más lentes de sol', '← See more sunglasses') : t('← Ver más armazones', '← See more frames')}
          </a>
        </div>
      </div>

      {/* RELACIONADOS */}
      {relacionados.length > 0 && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 4rem' }}>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '3rem', marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--warm-gray)', display: 'block', marginBottom: '0.5rem' }}>{t('También te puede gustar', 'You might also like')}</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300 }}>{t('Estilos similares', 'Similar styles')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {relacionados.map(r => (
              <a key={r.id} href={`/armazon/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'var(--cream)', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--cream-dark)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream)')}
                >
                  <div style={{ aspectRatio: '4/3', background: '#EDEAE4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {r.imagen_url
                      ? <img src={r.imagen_url} alt={r.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      : <div style={{ opacity: 0.5 }}><LenteSVG color={r.color || 'var(--charcoal)'} forma={r.forma} size="small"/></div>
                    }
                  </div>
                  <div style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 300, marginBottom: '2px' }}>{r.nombre}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--warm-gray)' }}>${r.precio} USD</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </main>
  );
}