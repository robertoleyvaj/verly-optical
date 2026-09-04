'use client';
import { useState, useEffect, useRef } from 'react';

// Formulario de receta manual — compartido entre la página de producto y el carrito.
export type RecetaData = {
  sph_od: number | null; cyl_od: number | null; axis_od: number | null;
  sph_os: number | null; cyl_os: number | null; axis_os: number | null;
  add: number | null; dp: number | null; prisma: string;
};

export const recetaVacia = (): RecetaData => ({
  sph_od: null, cyl_od: null, axis_od: null, sph_os: null, cyl_os: null, axis_os: null, add: null, dp: null, prisma: '',
});

// Valida una receta manual. Devuelve lista de errores (vacía = válida).
export function validarReceta(r: RecetaData, t: (es: string, en: string) => string): string[] {
  const errs: string[] = [];
  if (r.sph_od === null && r.sph_os === null) errs.push(t('Ingresa al menos el SPH de un ojo', 'Enter at least the SPH for one eye'));
  if (r.cyl_od !== null && r.cyl_od !== 0 && r.axis_od === null) errs.push(t('EJE requerido para OD cuando hay CYL', 'AXIS required for OD when CYL is set'));
  if (r.cyl_os !== null && r.cyl_os !== 0 && r.axis_os === null) errs.push(t('EJE requerido para OS cuando hay CYL', 'AXIS required for OS when CYL is set'));
  return errs;
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
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        style={{
          width: '100%', padding: '8px 4px',
          background: disabled ? 'var(--cream)' : open ? 'rgba(74,89,64,0.07)' : isEmpty ? 'var(--cream)' : 'white',
          border: `1.5px solid ${disabled ? 'var(--border)' : open ? 'var(--sage)' : isEmpty ? 'var(--border)' : 'var(--sage)'}`,
          borderRadius: '4px', cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-sans)', transition: 'all 0.15s', textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.3px', color: disabled ? 'var(--border)' : isEmpty ? 'var(--warm-gray)' : value === 0 ? 'var(--warm-gray)' : 'var(--charcoal)' }}>
          {disabled ? '—' : isEmpty ? '—' : formatVal(value!)}
        </span>
      </button>
      {open && !disabled && (
        <div style={{ position: 'absolute', ...(abreArriba ? { bottom: 'calc(100% + 4px)', top: 'auto' } : { top: 'calc(100% + 4px)', bottom: 'auto' }), left: '50%', transform: 'translateX(-50%)', width: usarGrid ? '200px' : '130px', background: 'white', borderRadius: '6px', zIndex: 500, boxShadow: '0 8px 32px rgba(28,28,26,0.10)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '6px', borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
            <input ref={inputRef} type="text" placeholder={unit === 'axis' ? 'Ej: 90' : unit === 'dp' ? 'Ej: 63' : 'Ej: -1.25'} value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: '3px', border: '1px solid var(--border)', fontSize: '12px', outline: 'none', boxSizing: 'border-box', textAlign: 'center', background: 'white', fontFamily: 'var(--font-sans)' }}/>
          </div>
          <div onClick={() => { onChange(null); setOpen(false); }} style={{ padding: '7px', cursor: 'pointer', fontSize: '13px', color: 'var(--warm-gray)', fontWeight: 500, textAlign: 'center', borderBottom: '1px solid var(--border)', background: isEmpty ? 'var(--cream-dark)' : 'white' }}>—</div>
          {usarGrid ? (
            <div ref={listRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', padding: '6px', maxHeight: '200px', overflowY: 'auto' }}>
              {opcionesFiltradas.map(opt => (
                <div key={opt} data-val={opt} onClick={() => { onChange(opt); setOpen(false); setBusqueda(''); }} style={{ padding: '8px 4px', cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: value === opt ? 700 : 400, color: value === opt ? 'white' : 'var(--charcoal)', background: value === opt ? 'var(--sage)' : 'var(--cream)', borderRadius: '3px', transition: 'all 0.1s' }}>{formatVal(opt)}</div>
              ))}
            </div>
          ) : (
            <div ref={listRef} style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {opcionesFiltradas.map(opt => (
                <div key={opt} data-val={opt} onClick={() => { onChange(opt); setOpen(false); setBusqueda(''); }} style={{ padding: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '13px', fontWeight: value === opt ? 700 : 400, color: value === opt ? 'var(--sage)' : 'var(--charcoal)', background: value === opt ? 'rgba(74,89,64,0.07)' : 'white', borderBottom: '1px solid var(--cream)', transition: 'background 0.1s' }}>{formatVal(opt)}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FormReceta({ receta, onChange, errores, t }: { receta: RecetaData; onChange: (r: RecetaData) => void; errores: string[]; t: (es: string, en: string) => string; }) {
  const cylOdActivo = receta.cyl_od !== null && receta.cyl_od !== 0;
  const cylOsActivo = receta.cyl_os !== null && receta.cyl_os !== 0;
  return (
    <div style={{ background: 'white', borderRadius: '6px', border: '1px solid var(--border)', overflow: 'visible' }}>
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
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.5px', textAlign: 'center', marginBottom: '5px' }}>ADD <span style={{ fontWeight: 400, fontSize: '9px' }}>({t('ambos ojos', 'both eyes')})</span></div>
          <CeldaReceta value={receta.add} onChange={v => onChange({ ...receta, add: v })} options={ADD_OPTS} unit="add"/>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.5px', textAlign: 'center', marginBottom: '5px' }}>DP / PD <span style={{ fontWeight: 400, fontSize: '9px' }}>({t('total', 'total')})</span></div>
          <CeldaReceta value={receta.dp} onChange={v => onChange({ ...receta, dp: v })} options={DP_OPTS} unit="dp"/>
        </div>
      </div>
      <div style={{ padding: '8px 10px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>{t('Prisma / Notas', 'Prism / Notes')}</div>
        <input type="text" placeholder={t('Ej: 1.0 base OUT OD', 'Ex: 1.0 base OUT OD')} value={receta.prisma} onChange={e => onChange({ ...receta, prisma: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--charcoal)', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }} onFocus={e => (e.currentTarget.style.borderColor = 'var(--sage)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}/>
      </div>
      {errores.length > 0 && (
        <div style={{ padding: '8px 10px', borderTop: '1px solid var(--border)', background: '#fff5f5' }}>
          {errores.map((e, i) => (
            <p key={i} style={{ fontSize: '11px', color: '#c0392b', margin: '2px 0', fontFamily: 'var(--font-sans)' }}>• {e}</p>
          ))}
        </div>
      )}
    </div>
  );
}
