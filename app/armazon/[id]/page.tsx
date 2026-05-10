'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useLang } from '../../components/LanguageContext';
import { supabase } from '../../supabase';

type Armazon = {
  id: number; nombre: string; forma: string; genero: string;
  stock: number; badge: string | null; precio: number; color: string; imagen_url?: string;
};

type PaqueteVerly = {
  vision: { id: string; nombre: string; precio: number };
  material: { id: string; nombre: string; precio: number };
  filtroBase: { id: string; nombre: string; precio: number };
  precioOriginal: number; precioFinal: number; descuento: number;
  condicion: string; explicacion: string;
  upsells: { id: string; nombre: string; precio: number; razon: string }[];
};

type RecetaData = {
  sph_od: number | null; cyl_od: number | null; axis_od: number | null;
  sph_os: number | null; cyl_os: number | null; axis_os: number | null;
  add: number | null; dp: number | null;
  prisma: string;
};

const PRECIO_ARMAZON = 43;

const visionOpts = [
  { id: 'mono', nombre: 'Monofocal', desc_es: 'Para ver de lejos o cerca.', desc_en: 'For distance or near vision.', precio: 5 },
  { id: 'bi', nombre: 'Bifocal', desc_es: 'Con línea, para lejos y cerca.', desc_en: 'With line, for far and near.', precio: 13 },
  { id: 'prog', nombre: 'Progresivo', desc_es: 'Sin línea, todas las distancias.', desc_en: 'No line, all distances.', precio: 48 },
];

const materialOpts = [
  { id: 'cr39', nombre: 'CR-39', desc_es: 'Económico y ligero.', desc_en: 'Affordable and light.', precio: 0 },
  { id: 'poly', nombre: 'PolyPlus', desc_es: 'Más resistente para uso diario.', desc_en: 'More resistant for daily use.', precio: 29 },
  { id: 'hd', nombre: 'HD Vision', desc_es: 'Más claro y delgado.', desc_en: 'Clearer and thinner.', precio: 39 },
  { id: 'hi', nombre: 'Hi-Index 1.67', desc_es: 'Para graduaciones altas.', desc_en: 'For high prescriptions.', precio: 59 },
  { id: 'shi', nombre: 'Súper Hi-Index 1.74', desc_es: 'El más delgado y estético.', desc_en: 'The thinnest and most aesthetic.', precio: 89 },
];

const filtroOpts = [
  { id: 'ar', nombre: 'AR Normal', desc_es: 'Antirreflejante estándar.', desc_en: 'Standard anti-reflective.', precio: 9 },
  { id: 'blue', nombre: 'Blue Light', desc_es: 'Protección contra pantallas.', desc_en: 'Screen protection.', precio: 17 },
  { id: 'foto', nombre: 'Fotocromático', desc_es: 'Se oscurece con el sol.', desc_en: 'Darkens in sunlight.', precio: 39 },
  { id: 'anti', nombre: 'Antiempañante', desc_es: 'Evita que se empañen.', desc_en: 'Anti-fog coating.', precio: 15 },
  { id: 'arprem', nombre: 'AR Premium', desc_es: 'Ideal para manejar de noche.', desc_en: 'Ideal for night driving.', precio: 39 },
  { id: 'pol', nombre: 'Polarizado', desc_es: 'Ideal para exteriores.', desc_en: 'Ideal for outdoors.', precio: 89 },
  { id: 'tinte', nombre: 'Tinte estético', desc_es: 'Color gris, café, etc.', desc_en: 'Gray, brown tint, etc.', precio: 28 },
];

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

// ── CELDA DROPDOWN CON BÚSQUEDA ───────────────────────────────────────────────
function CeldaReceta({ value, onChange, options, disabled, unit }: {
  value: number | null;
  onChange: (v: number | null) => void;
  options: number[];
  disabled?: boolean;
  unit?: 'axis' | 'dp' | 'add' | 'sph' | 'cyl';
}) {
  const [open, setOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [abreArriba, setAbreArriba] = useState(false);

  // Detectar si hay espacio abajo o debe abrir arriba
  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const espacioAbajo = window.innerHeight - rect.bottom;
      setAbreArriba(espacioAbajo < 260);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setBusqueda('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        if (!busqueda) {
          const targetVal = value ?? 0;
          const el = listRef.current?.querySelector(`[data-val="${targetVal}"]`) as HTMLElement;
          if (el) el.scrollIntoView({ block: 'center' });
        }
      }, 60);
    } else {
      setBusqueda('');
    }
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

  // ADD y DP usan cuadrícula
  const usarGrid = unit === 'add' || unit === 'dp';
  const isEmpty = value === null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        style={{
          width: '100%', padding: '8px 4px',
          background: disabled ? '#F5F5F5' : open ? '#E0F7F4' : isEmpty ? '#FAFAFA' : 'white',
          border: `1.5px solid ${disabled ? '#EAECF0' : open ? '#2BBFB3' : isEmpty ? '#E2E8F0' : '#2BBFB3'}`,
          borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-jakarta), sans-serif', transition: 'all 0.15s', textAlign: 'center',
        }}
      >
        <span style={{
          fontSize: '14px', fontWeight: 700, letterSpacing: '-0.3px',
          color: disabled ? '#C8D8E8' : isEmpty ? '#C8D8E8' : value === 0 ? '#7A8494' : '#1A1A2E',
        }}>
          {disabled ? '—' : isEmpty ? '—' : formatVal(value!)}
        </span>
      </button>

      {open && !disabled && (
        <div style={{
          position: 'absolute',
          ...(abreArriba
            ? { bottom: 'calc(100% + 4px)', top: 'auto' }
            : { top: 'calc(100% + 4px)', bottom: 'auto' }),
          left: '50%',
          transform: 'translateX(-50%)',
          width: usarGrid ? '200px' : '130px',
          background: 'white', borderRadius: '10px', zIndex: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.16)', border: '1.5px solid #E0F7F4',
          overflow: 'hidden', animation: 'dropDown 0.15s ease-out',
        }}>
          {/* Buscador */}
          <div style={{ padding: '6px', borderBottom: '1px solid #F0F0F0', background: '#FAFAFA' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder={unit === 'axis' ? 'Ej: 90' : unit === 'dp' ? 'Ej: 63' : 'Ej: -1.25'}
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{
                width: '100%', padding: '5px 8px', borderRadius: '6px',
                border: '1.5px solid #E0F7F4', fontSize: '12px',
                fontFamily: 'var(--font-jakarta), sans-serif',
                outline: 'none', boxSizing: 'border-box', textAlign: 'center',
              }}
            />
          </div>

          {/* Opción ninguno */}
          <div
            onClick={() => { onChange(null); setOpen(false); }}
            style={{
              padding: '7px', cursor: 'pointer', fontSize: '13px',
              color: '#AAB4C0', fontWeight: 600, textAlign: 'center',
              borderBottom: '1px solid #F0F0F0',
              background: isEmpty ? '#F0FBF8' : 'white',
            }}
          >—</div>

          {/* Lista o cuadrícula */}
          {usarGrid ? (
            <div ref={listRef} style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2px', padding: '6px', maxHeight: '200px', overflowY: 'auto',
            }}>
              {opcionesFiltradas.map(opt => (
                <div
                  key={opt}
                  data-val={opt}
                  onClick={() => { onChange(opt); setOpen(false); setBusqueda(''); }}
                  style={{
                    padding: '8px 4px', cursor: 'pointer', textAlign: 'center',
                    fontSize: '12px', fontWeight: value === opt ? 800 : 500,
                    color: value === opt ? 'white' : '#1A1A2E',
                    background: value === opt ? '#2BBFB3' : '#F8F9FA',
                    borderRadius: '6px', transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { if (value !== opt) (e.currentTarget as HTMLDivElement).style.background = '#E0F7F4'; }}
                  onMouseLeave={e => { if (value !== opt) (e.currentTarget as HTMLDivElement).style.background = '#F8F9FA'; }}
                >
                  {formatVal(opt)}
                </div>
              ))}
            </div>
          ) : (
            <div ref={listRef} style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {opcionesFiltradas.map(opt => (
                <div
                  key={opt}
                  data-val={opt}
                  onClick={() => { onChange(opt); setOpen(false); setBusqueda(''); }}
                  style={{
                    padding: '8px', cursor: 'pointer', textAlign: 'center',
                    fontSize: '13px', fontWeight: value === opt ? 800 : 500,
                    color: value === opt ? '#2BBFB3' : '#1A1A2E',
                    background: value === opt ? '#E0F7F4' : 'white',
                    borderBottom: '1px solid #F8F9FA', transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (value !== opt) (e.currentTarget as HTMLDivElement).style.background = '#F0FBF8'; }}
                  onMouseLeave={e => { if (value !== opt) (e.currentTarget as HTMLDivElement).style.background = 'white'; }}
                >
                  {formatVal(opt)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
// ── FORMULARIO RECETA ESTILO TABLA ────────────────────────────────────────────
function FormReceta({ receta, onChange, errores, t }: {
  receta: RecetaData;
  onChange: (r: RecetaData) => void;
  errores: string[];
  t: (es: string, en: string) => string;
}) {
  const cylOdActivo = receta.cyl_od !== null && receta.cyl_od !== 0;
  const cylOsActivo = receta.cyl_os !== null && receta.cyl_os !== 0;

  return (
   <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #E0F7F4', overflow: 'visible', boxShadow: '0 2px 12px rgba(43,191,179,0.06)' }}>

      {/* TABLA */}
    <table style={{ width: '100%', borderCollapse: 'collapse', overflow: 'visible' }}>
        <thead>
          <tr style={{ background: '#F0FBF8' }}>
            <th style={{ padding: '10px 8px', width: '52px', borderBottom: '1.5px solid #E0F7F4' }}></th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 700, color: '#5A6478', letterSpacing: '1px', textAlign: 'center', borderBottom: '1.5px solid #E0F7F4' }}>SPH *</th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 700, color: '#5A6478', letterSpacing: '1px', textAlign: 'center', borderBottom: '1.5px solid #E0F7F4' }}>CYL</th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 700, color: '#AAB4C0', letterSpacing: '1px', textAlign: 'center', borderBottom: '1.5px solid #E0F7F4' }}>{t('EJE', 'AXIS')}</th>
          </tr>
        </thead>
        <tbody>
          {/* OD */}
          <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
            <td style={{ padding: '8px', textAlign: 'center' }}>
              <span style={{ background: '#2BBFB3', color: 'white', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 800, display: 'block', marginBottom: '2px' }}>OD</span>
              <span style={{ fontSize: '9px', color: '#7A8494' }}>{t('Der.', 'Right')}</span>
            </td>
            <td style={{ padding: '6px 4px' }}>
              <CeldaReceta value={receta.sph_od} onChange={v => onChange({ ...receta, sph_od: v })} options={SPH_OPTS} unit="sph"/>
            </td>
            <td style={{ padding: '6px 4px' }}>
              <CeldaReceta value={receta.cyl_od} onChange={v => onChange({ ...receta, cyl_od: v, axis_od: (!v || v === 0) ? null : receta.axis_od })} options={CYL_OPTS} unit="cyl"/>
            </td>
            <td style={{ padding: '6px 4px' }}>
              <CeldaReceta value={cylOdActivo ? receta.axis_od : null} onChange={v => onChange({ ...receta, axis_od: v })} options={AXIS_OPTS} disabled={!cylOdActivo} unit="axis"/>
            </td>
          </tr>
          {/* OS */}
          <tr>
            <td style={{ padding: '8px', textAlign: 'center' }}>
              <span style={{ background: '#E08A2A', color: 'white', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 800, display: 'block', marginBottom: '2px' }}>OS</span>
              <span style={{ fontSize: '9px', color: '#7A8494' }}>{t('Izq.', 'Left')}</span>
            </td>
            <td style={{ padding: '6px 4px' }}>
              <CeldaReceta value={receta.sph_os} onChange={v => onChange({ ...receta, sph_os: v })} options={SPH_OPTS} unit="sph"/>
            </td>
            <td style={{ padding: '6px 4px' }}>
              <CeldaReceta value={receta.cyl_os} onChange={v => onChange({ ...receta, cyl_os: v, axis_os: (!v || v === 0) ? null : receta.axis_os })} options={CYL_OPTS} unit="cyl"/>
            </td>
            <td style={{ padding: '6px 4px' }}>
              <CeldaReceta value={cylOsActivo ? receta.axis_os : null} onChange={v => onChange({ ...receta, axis_os: v })} options={AXIS_OPTS} disabled={!cylOsActivo} unit="axis"/>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ADD y DP compartidos */}
      <div style={{ padding: '10px 8px', background: '#FAFAFA', borderTop: '1.5px solid #F0F0F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#7A8494', letterSpacing: '0.5px', textAlign: 'center', marginBottom: '5px' }}>
            ADD <span style={{ fontWeight: 400, color: '#AAB4C0', fontSize: '9px' }}>({t('ambos ojos', 'both eyes')})</span>
          </div>
          <CeldaReceta value={receta.add} onChange={v => onChange({ ...receta, add: v })} options={ADD_OPTS} unit="add"/>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#7A8494', letterSpacing: '0.5px', textAlign: 'center', marginBottom: '5px' }}>
            DP / DIP <span style={{ fontWeight: 400, color: '#AAB4C0', fontSize: '9px' }}>({t('total', 'total')})</span>
          </div>
          <CeldaReceta value={receta.dp} onChange={v => onChange({ ...receta, dp: v })} options={DP_OPTS} unit="dp"/>
        </div>
      </div>

      {/* Prisma */}
      <div style={{ padding: '8px 10px', borderTop: '1px solid #F0F0F0' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#AAB4C0', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>
          {t('Prisma / Notas', 'Prism / Notes')}
        </div>
        <input
          type="text"
          placeholder={t('Ej: 1.0 base OUT OD', 'Ex: 1.0 base OUT OD')}
          value={receta.prisma}
          onChange={e => onChange({ ...receta, prisma: e.target.value })}
          style={{
            width: '100%', padding: '8px 10px', borderRadius: '8px',
            border: '1.5px solid #EAECF0', fontSize: '12px', color: '#1A1A2E',
            fontFamily: 'var(--font-jakarta), sans-serif', outline: 'none', boxSizing: 'border-box',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#2BBFB3')}
          onBlur={e => (e.currentTarget.style.borderColor = '#EAECF0')}
        />
      </div>

      {/* Errores */}
      {errores.length > 0 && (
        <div style={{ padding: '8px 10px', borderTop: '1px solid #FFE0E0', background: '#FFF5F5' }}>
          {errores.map((e, i) => (
            <div key={i} style={{ fontSize: '12px', color: '#E05A5A', fontWeight: 600, marginBottom: i < errores.length - 1 ? '3px' : 0 }}>
              ⚠ {e}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CÁLCULO DE PAQUETE ────────────────────────────────────────────────────────
function calcularPaquete(r: RecetaData, lang: 'es' | 'en'): PaqueteVerly {
  const sph_od = r.sph_od ?? 0;
  const sph_os = r.sph_os ?? 0;
  const cyl_od = r.cyl_od ?? 0;
  const cyl_os = r.cyl_os ?? 0;
  const add = r.add ?? 0;

  const eq = Math.max(Math.abs(sph_od + cyl_od / 2), Math.abs(sph_os + cyl_os / 2));
  const cyl = Math.max(Math.abs(cyl_od), Math.abs(cyl_os));
  const astigmatismo = cyl >= 0.75;

  let vision = visionOpts[0];
  if (add > 0) vision = visionOpts[2];

  let material = materialOpts[1];
  if (eq > 4.0) material = materialOpts[4];
  else if (eq > 2.0) material = materialOpts[3];

  let filtroBase = astigmatismo || add > 0 ? filtroOpts[4] : filtroOpts[2];

  let condicion = '', explicacion = '';
  if (add > 0) {
    condicion = lang === 'es' ? 'Presbicia' : 'Presbyopia';
    explicacion = lang === 'es'
      ? `Tienes adición (ADD +${add.toFixed(2)}), indicando presbicia. El Progresivo corrige todas las distancias sin línea visible.`
      : `You have an addition (ADD +${add.toFixed(2)}), indicating presbyopia. Progressive lenses correct all distances without a visible line.`;
  } else if (cyl >= 1.50) {
    condicion = lang === 'es' ? 'Astigmatismo alto' : 'High astigmatism';
    explicacion = lang === 'es'
      ? `Tu CYL de ${cyl_od >= 0 ? '+' : ''}${cyl_od.toFixed(2)} indica astigmatismo alto. Tu córnea tiene curvatura irregular causando halos nocturnos. El AR Premium los elimina.`
      : `Your CYL of ${cyl_od >= 0 ? '+' : ''}${cyl_od.toFixed(2)} indicates high astigmatism. AR Premium eliminates halos and night glare.`;
  } else if (astigmatismo) {
    condicion = lang === 'es' ? 'Astigmatismo' : 'Astigmatism';
    explicacion = lang === 'es'
      ? `Tienes astigmatismo (CYL ${cyl_od >= 0 ? '+' : ''}${cyl_od.toFixed(2)}). El AR Premium mejora la calidad visual eliminando reflejos.`
      : `You have astigmatism (CYL ${cyl_od >= 0 ? '+' : ''}${cyl_od.toFixed(2)}). AR Premium improves visual quality.`;
  } else if (eq > 4.0) {
    condicion = lang === 'es' ? 'Graduación muy alta' : 'Very high prescription';
    explicacion = lang === 'es'
      ? `Con equivalente esférico ${eq.toFixed(2)}, el Súper Hi-Index 1.74 hará tus lentes delgados y elegantes.`
      : `With spherical equivalent ${eq.toFixed(2)}, Super Hi-Index 1.74 makes your lenses thin and elegant.`;
  } else if (eq > 2.0) {
    condicion = lang === 'es' ? 'Graduación alta' : 'High prescription';
    explicacion = lang === 'es'
      ? `El Hi-Index 1.67 reducirá el grosor de tus lentes hasta un 30%.`
      : `Hi-Index 1.67 will reduce lens thickness by up to 30%.`;
  } else {
    condicion = lang === 'es' ? 'Graduación moderada' : 'Moderate prescription';
    explicacion = lang === 'es'
      ? `El PolyPlus es más resistente y el Fotocromático te da protección solar automática.`
      : `PolyPlus is more durable and Photochromic gives automatic sun protection.`;
  }

  const precioOriginal = PRECIO_ARMAZON + vision.precio + material.precio + filtroBase.precio;
  const descuento = Math.round(precioOriginal * 0.10);
  const precioFinal = precioOriginal - descuento;

  const upsells: { id: string; nombre: string; precio: number; razon: string }[] = [];
  if (filtroBase.id === 'arprem') {
    upsells.push({ id: 'blue', nombre: 'Blue Light', precio: 17, razon: lang === 'es' ? 'Protege tus ojos de pantallas digitales' : 'Protects your eyes from digital screens' });
    upsells.push({ id: 'anti', nombre: 'Antiempañante', precio: 15, razon: lang === 'es' ? 'Evita que se empañen al cambiar de temperatura' : 'Prevents fogging when changing temperature' });
  } else {
    upsells.push({ id: 'arprem', nombre: 'AR Premium', precio: 39, razon: lang === 'es' ? 'Elimina reflejos al manejar de noche' : 'Eliminates reflections when driving at night' });
    upsells.push({ id: 'anti', nombre: 'Antiempañante', precio: 15, razon: lang === 'es' ? 'Evita que se empañen al cambiar de temperatura' : 'Prevents fogging when changing temperature' });
  }

  return { vision, material, filtroBase, precioOriginal, precioFinal, descuento, condicion, explicacion, upsells };
}

function LenteSVG({ color, forma, size = 'large' }: { color: string; forma: string; size?: string }) {
  const rx = forma === 'ovalada' ? '30' : forma === 'rectangular' ? '8' : '14';
  const w = size === 'large' ? 320 : 100;
  const h = size === 'large' ? 180 : 56;
  return (
    <svg width={w} height={h} viewBox="0 0 160 90" fill="none">
      <rect x="4" y="12" width="64" height="66" rx={rx} fill="white" stroke={color} strokeWidth="4"/>
      <rect x="92" y="12" width="64" height="66" rx={rx} fill="white" stroke={color} strokeWidth="4"/>
      <path d="M68 38 C72 32, 88 32, 92 38" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <line x1="4" y1="36" x2="-6" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <line x1="156" y1="36" x2="166" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="26" cy="36" rx="10" ry="6" fill={color} opacity="0.08"/>
      <ellipse cx="114" cy="36" rx="10" ry="6" fill={color} opacity="0.08"/>
    </svg>
  );
}

function VerlyTip({ mensaje }: { mensaje: string }) {
  if (!mensaje) return null;
  return (
    <div style={{ background: '#E0F7F4', border: '1px solid #2BBFB3', borderRadius: '12px', padding: '0.9rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2BBFB3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, flexShrink: 0 }}>V</div>
      <p style={{ fontSize: '13px', color: '#1A5C58', lineHeight: 1.6, margin: 0 }}>{mensaje}</p>
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'slideUp 0.3s ease-out', maxHeight: '90vh', overflowY: 'auto' }}>
        {paso === 'paquete' ? (
          <>
            <div style={{ background: 'linear-gradient(135deg, #2BBFB3, #1a9990)', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
                  <ellipse cx="40" cy="36" rx="26" ry="28" fill="white"/>
                  <path d="M25 26 Q29 23 33 26" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M47 26 Q51 23 55 26" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="21" y="29" width="17" height="11" rx="5" fill="white" stroke="#2BBFB3" strokeWidth="2" opacity="0.9"/>
                  <rect x="42" y="29" width="17" height="11" rx="5" fill="white" stroke="#2BBFB3" strokeWidth="2" opacity="0.9"/>
                  <line x1="38" y1="34.5" x2="42" y2="34.5" stroke="#2BBFB3" strokeWidth="1.5"/>
                  <ellipse cx="29.5" cy="34.5" rx="3.5" ry="3.5" fill="#1A1A2E"/>
                  <ellipse cx="50.5" cy="34.5" rx="3.5" ry="3.5" fill="#1A1A2E"/>
                  <circle cx="31" cy="33" r="1" fill="white"/>
                  <circle cx="52" cy="33" r="1" fill="white"/>
                  <path d="M33 46 Q40 52 47 46" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <ellipse cx="23" cy="43" rx="4.5" ry="2.5" fill="#FFB3C6" opacity="0.5"/>
                  <ellipse cx="57" cy="43" rx="4.5" ry="2.5" fill="#FFB3C6" opacity="0.5"/>
                </svg>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginBottom: '4px' }}>{lang === 'es' ? 'Verly recomienda' : 'Verly recommends'}</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>{lang === 'es' ? '¡Encontré el paquete perfecto para ti!' : 'I found the perfect package for you!'}</div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ background: '#F0FBF8', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '13px', color: '#1A5C58', lineHeight: 1.6 }}>{paquete.explicacion}</div>
              <div style={{ border: '2px solid #2BBFB3', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <div style={{ background: '#E0F7F4', padding: '0.65rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#1A5C58' }}>{lang === 'es' ? `Paquete ${paquete.condicion}` : `${paquete.condicion} Package`}</span>
                  <span style={{ background: '#F5C518', color: '#1A1A2E', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>-{paquete.descuento}% OFF</span>
                </div>
                <div style={{ padding: '0.75rem 1rem' }}>
                  {[
                    { label: armazonNombre, valor: `$${PRECIO_ARMAZON}` },
                    { label: paquete.vision.nombre, valor: `+$${paquete.vision.precio}` },
                    { label: paquete.material.nombre, valor: paquete.material.precio === 0 ? (lang === 'es' ? 'Incluido' : 'Included') : `+$${paquete.material.precio}` },
                    { label: paquete.filtroBase.nombre, valor: `+$${paquete.filtroBase.precio}` },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0', borderBottom: i < 3 ? '1px solid #F0F0F0' : 'none' }}>
                      <span style={{ color: '#5A6478' }}>{item.label}</span>
                      <span style={{ fontWeight: 600 }}>{item.valor}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.75rem 1rem', background: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#7A8494', textDecoration: 'line-through' }}>${paquete.precioOriginal} USD</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#2BBFB3' }}>${paquete.precioFinal} USD</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#7A8494' }}>{lang === 'es' ? `Ahorras $${paquete.descuento}` : `You save $${paquete.descuento}`}</div>
                </div>
              </div>
              <button onClick={() => setPaso('upsell')} style={{ width: '100%', background: '#1A1A2E', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif', marginBottom: '10px' }}>
                {lang === 'es' ? '✓ Sí, quiero este paquete' : '✓ Yes, I want this package'}
              </button>
              <button onClick={onManual} style={{ width: '100%', background: 'white', color: '#5A6478', border: '1.5px solid #EAECF0', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif' }}>
                {lang === 'es' ? 'Prefiero elegir manualmente' : 'I prefer to choose manually'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2A2A4E)', padding: '1.25rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>✨</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>{lang === 'es' ? '¿Le añadimos algo más?' : 'Shall we add anything else?'}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>{lang === 'es' ? 'Opcional — puedes saltarte esto' : 'Optional — you can skip this'}</div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {paquete.upsells.map(u => (
                <div key={u.id} onClick={() => toggleExtra(u.id)} style={{ border: extras.includes(u.id) ? '2px solid #2BBFB3' : '1.5px solid #EAECF0', borderRadius: '12px', padding: '1rem', cursor: 'pointer', background: extras.includes(u.id) ? '#E0F7F4' : 'white', marginBottom: '0.75rem', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: '2px solid', borderColor: extras.includes(u.id) ? '#2BBFB3' : '#EAECF0', background: extras.includes(u.id) ? '#2BBFB3' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                      {extras.includes(u.id) ? '✓' : ''}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E' }}>{u.nombre}</div>
                      <div style={{ fontSize: '12px', color: '#7A8494', marginTop: '2px' }}>{u.razon}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#2BBFB3', flexShrink: 0 }}>+${u.precio}</div>
                </div>
              ))}
              <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '0.9rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#5A6478' }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#2BBFB3' }}>${paquete.precioFinal + precioExtras} USD</span>
              </div>
              <button onClick={() => onAceptar(extras)} style={{ width: '100%', background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif', marginBottom: '10px' }}>
                {lang === 'es' ? 'Ir al resumen →' : 'Go to summary →'}
              </button>
              <button onClick={() => onAceptar([])} style={{ width: '100%', background: 'white', color: '#7A8494', border: '1.5px solid #EAECF0', borderRadius: '10px', padding: '11px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif' }}>
                {lang === 'es' ? 'No gracias, ir al resumen' : 'No thanks, go to summary'}
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes dropDown { from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
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
  const [irResumen, setIrResumen] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  // ESTADOS DEL DRAWER
  type DrawerEstado = 'receta' | 'manual' | 'resumen';
  const [drawerEstado, setDrawerEstado] = useState<DrawerEstado>('receta');
  const [recetaGuardada, setRecetaGuardada] = useState(false);

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
  const [loadingPago, setLoadingPago] = useState(false);

  const precioArmazon = armazon?.precio || 43;
  const precioVision = visionOpts.find(v => v.id === vision)?.precio || 0;
  const precioMaterial = materialOpts.find(m => m.id === material)?.precio || 0;
  const precioFiltros = filtroOpts.filter(f => filtros.includes(f.id)).reduce((a, f) => a + f.precio, 0);
  const total = precioArmazon + precioVision + precioMaterial + precioFiltros;

  const toggleFiltro = (fid: string) => setFiltros(prev => prev.includes(fid) ? prev.filter(f => f !== fid) : [...prev, fid]);

  const validarReceta = (): string[] => {
    const errs: string[] = [];
    if (receta.sph_od === null && receta.sph_os === null) {
      errs.push(t('Ingresa al menos el SPH de un ojo', 'Enter at least the SPH for one eye'));
    }
    if (receta.cyl_od !== null && receta.cyl_od !== 0 && receta.axis_od === null) {
      errs.push(t('EJE requerido para OD cuando hay CYL', 'AXIS required for OD when CYL is set'));
    }
    if (receta.cyl_os !== null && receta.cyl_os !== 0 && receta.axis_os === null) {
      errs.push(t('EJE requerido para OS cuando hay CYL', 'AXIS required for OS when CYL is set'));
    }
    return errs;
  };

  const guardarReceta = () => {
    const errs = validarReceta();
    if (errs.length > 0) { setErrores(errs); return; }
    setErrores([]);
    const sesion = JSON.parse(sessionStorage.getItem('verly_sesion') || '{}');
    sesion.receta = receta;
    sessionStorage.setItem('verly_sesion', JSON.stringify(sesion));
    const paquete = calcularPaquete(receta, lang || 'es');
    setPaqueteVerly(paquete);
    setRecetaGuardada(true);
    setVerlyModal(true);
  };

  const aceptarPaquete = (extrasIds: string[]) => {
    if (!paqueteVerly) return;
    setVision(paqueteVerly.vision.id);
    setMaterial(paqueteVerly.material.id);
    setFiltros([paqueteVerly.filtroBase.id, ...extrasIds]);
    setVerlyModal(false);
    setDrawerEstado('resumen');
    setPaso(4);
  };

  const elegirManual = () => {
    setVerlyModal(false);
    setDrawerEstado('manual');
    setPaso(1);
  };

  const handlePago = async () => {
    setLoadingPago(true);
    try {
      const v = visionOpts.find(x => x.id === vision)?.nombre || '';
      const m = materialOpts.find(x => x.id === material)?.nombre || '';
      const fs = filtroOpts.filter(f => filtros.includes(f.id)).map(f => f.nombre).join(', ');
      const items = `${armazon?.nombre} + ${v} + ${m}${fs ? ' + ' + fs : ''}`;
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, total }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { alert('Error al procesar el pago.'); setLoadingPago(false); }
    } catch { alert('Error al procesar el pago.'); setLoadingPago(false); }
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
    document.body.style.overflow = drawerOpen || verlyModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen, verlyModal]);

  const verlyTips: Record<number, string> = {
    1: t('Selecciona el tipo de visión que necesitas.', 'Select the vision type you need.'),
    2: t('El material afecta el grosor y peso de tus lentes.', 'Material affects thickness and weight.'),
    3: t('Los filtros protegen tus ojos según tu estilo de vida.', 'Filters protect your eyes based on your lifestyle.'),
    4: t('Revisa tu pedido y procede al pago seguro.', 'Review your order and proceed to secure payment.'),
  };

  if (loading) return <main style={{ fontFamily: 'var(--font-jakarta), sans-serif', background: '#FAFAFA', minHeight: '100vh' }}><Navbar /><div style={{ textAlign: 'center', padding: '6rem', color: '#7A8494' }}>{t('Cargando...', 'Loading...')}</div></main>;
  if (!armazon) return <main style={{ fontFamily: 'var(--font-jakarta), sans-serif', background: '#FAFAFA', minHeight: '100vh' }}><Navbar /><div style={{ textAlign: 'center', padding: '6rem', color: '#7A8494' }}>{t('Armazón no encontrado.', 'Frame not found.')}<br/><a href="/Tienda" style={{ color: '#2BBFB3', fontWeight: 700 }}>{t('← Volver', '← Back')}</a></div></main>;

  const pasos = [t('Visión', 'Vision'), t('Material', 'Material'), t('Filtros', 'Filters'), t('Resumen', 'Summary')];

  return (
    <main style={{ fontFamily: 'var(--font-jakarta), sans-serif', background: '#FAFAFA', minHeight: '100vh', color: '#1A1A2E' }}>
      <Navbar />

      {verlyModal && paqueteVerly && (
        <VerlyModalPaquete
          paquete={paqueteVerly} armazonNombre={armazon.nombre}
          onAceptar={aceptarPaquete} onManual={elegirManual}
          lang={lang || 'es'}
        />
      )}

      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>}

      {/* DRAWER */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '480px', maxWidth: '100vw', background: 'white', zIndex: 201, boxShadow: '-8px 0 40px rgba(0,0,0,0.15)', transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EAECF0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#2BBFB3', margin: 0 }}>{t('Personalizando', 'Customizing')}</p>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '2px 0 0' }}>{armazon.nombre}</h3>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: '#F5F5F3', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '20px', color: '#5A6478', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-jakarta), sans-serif' }}>×</button>
        </div>

        {/* ── ESTADO: RECETA ── */}
        {(drawerEstado === 'receta') && (
          <div style={{ padding: '1.5rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A2E' }}>{t('Tu receta óptica', 'Your optical prescription')}</label>
              {recetaGuardada && (
                <button onClick={() => { setRecetaGuardada(false); setErrores([]); }} style={{ background: 'none', border: 'none', color: '#2BBFB3', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif' }}>
                  {t('Editar', 'Edit')}
                </button>
              )}
            </div>

            {recetaGuardada ? (
              <div style={{ background: '#E0F7F4', borderRadius: '10px', padding: '0.9rem 1rem', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2BBFB3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>✓</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A5C58' }}>{t('Receta guardada', 'Prescription saved')}</div>
                  <div style={{ fontSize: '11px', color: '#2BBFB3', marginTop: '3px' }}>
                    OD: {receta.sph_od !== null ? (receta.sph_od >= 0 ? '+' : '') + receta.sph_od.toFixed(2) : '—'} / {receta.cyl_od !== null ? (receta.cyl_od >= 0 ? '+' : '') + receta.cyl_od.toFixed(2) : '—'}
                    &nbsp;·&nbsp;
                    OS: {receta.sph_os !== null ? (receta.sph_os >= 0 ? '+' : '') + receta.sph_os.toFixed(2) : '—'} / {receta.cyl_os !== null ? (receta.cyl_os >= 0 ? '+' : '') + receta.cyl_os.toFixed(2) : '—'}
                  </div>
                </div>
              </div>
            ) : (
              <FormReceta receta={receta} onChange={setReceta} errores={errores} t={t}/>
            )}

            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={guardarReceta} style={{ width: '100%', background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif' }}>
                {t('Guardar receta y ver recomendación →', 'Save prescription & see recommendation →')}
              </button>
              <button onClick={() => { setDrawerEstado('manual'); setPaso(1); }} style={{ width: '100%', background: 'none', border: 'none', color: '#7A8494', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif', padding: '6px' }}>
                {t('Prefiero elegir manualmente sin receta', 'I prefer to choose manually')}
              </button>
            </div>
          </div>
        )}

        {/* ── ESTADO: MANUAL O RESUMEN ── */}
        {(drawerEstado === 'manual' || drawerEstado === 'resumen') && (
          <>
            {/* Receta guardada mini — solo si se guardó */}
            {recetaGuardada && (
              <div style={{ padding: '10px 1.5rem', background: '#E0F7F4', borderBottom: '1px solid #2BBFB330', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#2BBFB3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>✓</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A5C58' }}>{t('Receta guardada', 'Prescription saved')}</div>
                  <div style={{ fontSize: '10px', color: '#2BBFB3' }}>
                    OD: {receta.sph_od !== null ? (receta.sph_od >= 0 ? '+' : '') + receta.sph_od.toFixed(2) : '—'} · OS: {receta.sph_os !== null ? (receta.sph_os >= 0 ? '+' : '') + receta.sph_os.toFixed(2) : '—'}
                  </div>
                </div>
                <button onClick={() => { setDrawerEstado('receta'); setRecetaGuardada(false); }} style={{ background: 'none', border: 'none', color: '#2BBFB3', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif' }}>
                  {t('Editar', 'Edit')}
                </button>
              </div>
            )}

            {/* Stepper */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #EAECF0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pasos.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: paso > i + 1 ? '#2BBFB3' : 'white', border: paso >= i + 1 ? '2px solid #2BBFB3' : '2px solid #EAECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: paso > i + 1 ? 'white' : paso === i + 1 ? '#2BBFB3' : '#7A8494' }}>
                        {paso > i + 1 ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: 600, color: paso >= i + 1 ? '#2BBFB3' : '#7A8494' }}>{p}</span>
                    </div>
                    {i < pasos.length - 1 && <div style={{ width: '40px', height: '2px', background: paso > i + 1 ? '#2BBFB3' : '#EAECF0', margin: '0 4px 16px' }}/>}
                  </div>
                ))}
              </div>
            </div>

            {/* Contenido pasos */}
            <div style={{ padding: '1.5rem', flex: 1 }}>
              <VerlyTip mensaje={verlyTips[paso] || ''} />

              {paso === 1 && (
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{t('Tipo de visión', 'Vision type')}</h4>
                  <p style={{ fontSize: '13px', color: '#7A8494', marginBottom: '1rem' }}>{t('¿Cómo ves?', 'How do you see?')}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {visionOpts.map(o => (
                      <div key={o.id} onClick={() => setVision(o.id)} style={{ border: vision === o.id ? '2px solid #2BBFB3' : '1.5px solid #EAECF0', borderRadius: '10px', padding: '0.9rem 1rem', cursor: 'pointer', background: vision === o.id ? '#E0F7F4' : 'white', transition: 'all 0.15s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 700 }}>{o.nombre}</div>
                            <div style={{ fontSize: '12px', color: '#7A8494', marginTop: '2px' }}>{t(o.desc_es, o.desc_en)}</div>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#2BBFB3' }}>+${o.precio}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paso === 2 && (
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{t('Material de la mica', 'Lens material')}</h4>
                  <p style={{ fontSize: '13px', color: '#7A8494', marginBottom: '1rem' }}>{t('Afecta el grosor y peso.', 'Affects thickness and weight.')}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {materialOpts.map(o => (
                      <div key={o.id} onClick={() => setMaterial(o.id)} style={{ border: material === o.id ? '2px solid #2BBFB3' : '1.5px solid #EAECF0', borderRadius: '10px', padding: '0.9rem 1rem', cursor: 'pointer', background: material === o.id ? '#E0F7F4' : 'white', transition: 'all 0.15s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 700 }}>{o.nombre}</div>
                            <div style={{ fontSize: '12px', color: '#7A8494', marginTop: '2px' }}>{t(o.desc_es, o.desc_en)}</div>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#2BBFB3' }}>{o.precio === 0 ? t('Incluido', 'Included') : `+$${o.precio}`}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paso === 3 && (
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{t('Filtros y protecciones', 'Filters & coatings')}</h4>
                  <p style={{ fontSize: '13px', color: '#7A8494', marginBottom: '1rem' }}>{t('Opcionales. Puedes elegir varios.', 'Optional. You can choose multiple.')}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {filtroOpts.map(o => (
                      <div key={o.id} onClick={() => toggleFiltro(o.id)} style={{ border: filtros.includes(o.id) ? '2px solid #2BBFB3' : '1.5px solid #EAECF0', borderRadius: '10px', padding: '0.9rem 1rem', cursor: 'pointer', background: filtros.includes(o.id) ? '#E0F7F4' : 'white', transition: 'all 0.15s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid', borderColor: filtros.includes(o.id) ? '#2BBFB3' : '#EAECF0', background: filtros.includes(o.id) ? '#2BBFB3' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                              {filtros.includes(o.id) ? '✓' : ''}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 700 }}>{o.nombre}</div>
                              <div style={{ fontSize: '12px', color: '#7A8494' }}>{t(o.desc_es, o.desc_en)}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#2BBFB3' }}>+${o.precio}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paso === 4 && (
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '1rem' }}>{t('Resumen de tu pedido', 'Order summary')}</h4>
                  <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
                    {[
                      { label: t('Armazón', 'Frame'), value: `$${precioArmazon}` },
                      { label: `${t('Visión', 'Vision')}: ${visionOpts.find(v => v.id === vision)?.nombre || '-'}`, value: `+$${precioVision}` },
                      { label: `${t('Material', 'Material')}: ${materialOpts.find(m => m.id === material)?.nombre || '-'}`, value: precioMaterial === 0 ? t('Incluido', 'Included') : `+$${precioMaterial}` },
                      ...filtroOpts.filter(f => filtros.includes(f.id)).map(f => ({ label: f.nombre, value: `+$${f.precio}` })),
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EAECF0', fontSize: '13px' }}>
                        <span style={{ color: '#5A6478' }}>{item.label}</span>
                        <span style={{ fontWeight: 600 }}>{item.value}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: '18px', fontWeight: 800, color: '#2BBFB3' }}>
                      <span>TOTAL</span><span>${total} USD</span>
                    </div>
                  </div>
                  <button onClick={handlePago} disabled={loadingPago} style={{ width: '100%', background: loadingPago ? '#7A8494' : '#2BBFB3', color: 'white', border: 'none', borderRadius: '8px', padding: '15px', fontSize: '15px', fontWeight: 700, cursor: loadingPago ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-jakarta), sans-serif' }}>
                    {loadingPago ? t('Procesando...', 'Processing...') : t('Pagar con tarjeta →', 'Pay with card →')}
                  </button>
                </div>
              )}
            </div>

            {/* Footer navegación */}
            {paso < 4 && (
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #EAECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, background: 'white' }}>
                {paso > 1
                  ? <button onClick={() => setPaso(p => p - 1)} style={{ background: 'none', border: '1.5px solid #EAECF0', borderRadius: '6px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#5A6478', fontFamily: 'var(--font-jakarta), sans-serif' }}>← {t('Atrás', 'Back')}</button>
                  : <button onClick={() => setDrawerEstado('receta')} style={{ background: 'none', border: '1.5px solid #EAECF0', borderRadius: '6px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#5A6478', fontFamily: 'var(--font-jakarta), sans-serif' }}>← {t('Mi receta', 'My prescription')}</button>
                }
                <button
                  onClick={() => { if (paso === 1 && !vision) return; if (paso === 2 && !material) return; setPaso(p => p + 1); }}
                  style={{ background: (paso === 1 && !vision) || (paso === 2 && !material) ? '#E2E8F0' : '#1A1A2E', color: (paso === 1 && !vision) || (paso === 2 && !material) ? '#7A8494' : 'white', border: 'none', borderRadius: '6px', padding: '10px 24px', fontSize: '13px', fontWeight: 700, cursor: (paso === 1 && !vision) || (paso === 2 && !material) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-jakarta), sans-serif' }}
                >
                  {paso === 3 ? t('Ver resumen →', 'See summary →') : t('Siguiente →', 'Next →')}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* BREADCRUMB */}
      <div style={{ background: 'white', borderBottom: '1px solid #EAECF0', padding: '0.85rem 2rem', fontSize: '13px', color: '#7A8494' }}>
        <a href="/" style={{ color: '#7A8494', textDecoration: 'none' }}>{t('Inicio', 'Home')}</a>
        <span style={{ margin: '0 8px' }}>›</span>
        <a href="/Tienda" style={{ color: '#7A8494', textDecoration: 'none' }}>{t('Tienda', 'Store')}</a>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#1A1A2E', fontWeight: 600 }}>{armazon.nombre}</span>
      </div>

      {/* DETALLE */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #EAECF0', padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '360px', position: 'sticky', top: '90px' }}>
          {armazon.imagen_url ? <img src={armazon.imagen_url} alt={armazon.nombre} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}/> : <LenteSVG color={armazon.color || '#2BBFB3'} forma={armazon.forma} size="large"/>}
        </div>
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ background: '#F0FBF8', color: '#2BBFB3', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
              {armazon.genero === 'hombre' ? t('Hombre', 'Men') : armazon.genero === 'mujer' ? t('Mujer', 'Women') : 'Unisex'}
            </span>
            {armazon.badge && <span style={{ background: '#FFF8D6', color: '#9A7000', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{armazon.badge}</span>}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>{armazon.nombre}</h1>
          <p style={{ color: '#7A8494', fontSize: '14px', marginBottom: '1.5rem', textTransform: 'capitalize' }}>{t(`Forma ${armazon.forma}`, `${armazon.forma} frame`)}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '32px', fontWeight: 800 }}>${armazon.precio}</span>
            <span style={{ fontSize: '14px', color: '#7A8494' }}>USD</span>
          </div>
          <p style={{ fontSize: '13px', color: '#7A8494', marginBottom: '2rem' }}>{t('Armazón incluido · Micas desde +$5 USD', 'Frame included · Lenses from +$5 USD')}</p>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#7A8494', marginBottom: '0.75rem' }}>{t('Color', 'Color')}</p>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: armazon.color, border: '3px solid #2BBFB3', boxShadow: '0 0 0 2px white inset' }}/>
          </div>
          <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { es: 'Entrega 3–5 días a California', en: 'Delivery 3–5 days to California' },
              { es: '30 días de devolución gratis', en: '30-day free returns' },
              { es: 'Sin necesidad de aseguranza', en: 'No insurance needed' },
              { es: 'Micas personalizadas a tu graduación', en: 'Lenses customized to your prescription' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#5A6478' }}>
                <span style={{ color: '#2BBFB3', fontWeight: 800 }}>✓</span>{t(b.es, b.en)}
              </div>
            ))}
          </div>
          <button onClick={() => { setDrawerOpen(true); setDrawerEstado(irResumen ? 'resumen' : 'receta'); if (irResumen) setPaso(4); }} style={{ display: 'block', width: '100%', textAlign: 'center', background: '#1A1A2E', color: 'white', padding: '16px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.3px', marginBottom: '12px', fontFamily: 'var(--font-jakarta), sans-serif' }}>
            {irResumen ? t('Ver mi resumen →', 'View my summary →') : t('Personalizar mis micas →', 'Customize my lenses →')}
          </button>
          <a href="/Tienda" style={{ display: 'block', textAlign: 'center', background: 'transparent', color: '#5A6478', padding: '14px 32px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', border: '1.5px solid #EAECF0' }}>
            {t('← Ver más armazones', '← See more frames')}
          </a>
        </div>
      </div>

      {/* RELACIONADOS */}
      {relacionados.length > 0 && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 4rem' }}>
          <div style={{ borderTop: '1px solid #EAECF0', paddingTop: '3rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#2BBFB3', marginBottom: '0.5rem' }}>{t('También te puede gustar', 'You might also like')}</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{t('Estilos similares', 'Similar styles')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {relacionados.map(r => (
              <a key={r.id} href={`/armazon/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #EAECF0', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
                >
                  <div style={{ height: '130px', background: '#F5F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {r.imagen_url ? <img src={r.imagen_url} alt={r.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <LenteSVG color={r.color || '#2BBFB3'} forma={r.forma} size="small"/>}
                  </div>
                  <div style={{ padding: '0.9rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{r.nombre}</div>
                    <div style={{ fontSize: '13px', color: '#7A8494' }}>${r.precio} USD</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}