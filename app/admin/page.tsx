'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';

const MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>) },
  { id: 'pedidos', label: 'Pedidos', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>) },
  { id: 'clientes', label: 'Clientes', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>) },
  { id: 'catalogo', label: 'Catálogo', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M20.188 10.934c.2.4.312.846.312 1.311V12a8.5 8.5 0 1 1-8.5-8.5h.244"/></svg>) },
  { id: 'finanzas', label: 'Finanzas', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>) },
  { id: 'promociones', label: 'Promociones', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>) },
  { id: 'marketing', label: 'Marketing', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>) },
];

const ESTADOS = ['pendiente', 'en proceso', 'enviado', 'entregado'];
const ESTADO_COLORS: any = {
  'pendiente': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  'en proceso': { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  'enviado': { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
  'entregado': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
};

function orderCode(id: number): string { return `VRL-${2846 + id}`; }

function tallaDesdeMedias(medidas: string): string {
  const match = medidas.match(/(\d+)/);
  if (!match) return 'M';
  const lente = parseInt(match[1]);
  if (lente <= 48) return 'S';
  if (lente <= 52) return 'M';
  if (lente <= 56) return 'L';
  return 'XL';
}

const ARMAZON_VACIO = {
  nombre: '', modelo: '', marca: 'Verly', precio: '13', stock: '10',
  badge: '', color1: '#1A1A2E', color2: '', color3: '',
  material: '', forma: 'cuadrada', genero: 'unisex', tipo: 'optico',
  descuento: '0', medidas: '', talla: 'M', activo: true,
  imagen_url: '', imagen2_url: '', imagen3_url: '', imagen4_url: '', imagen5_url: '',
};

const inputStyle: any = { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans), sans-serif', background: 'var(--cream)', color: 'var(--charcoal)' };
const labelStyle: any = { fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-sans), sans-serif' };
const btnSage: any = { background: 'var(--sage)', color: 'white', border: 'none', borderRadius: '4px', padding: '9px 18px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans), sans-serif', letterSpacing: '0.06em' };
const btnGhost: any = { background: 'white', color: 'var(--warm-gray)', border: '1px solid var(--border)', borderRadius: '4px', padding: '9px 18px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans), sans-serif' };
const btnDanger: any = { background: 'white', color: '#C0392B', border: '1px solid #C0392B', borderRadius: '4px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans), sans-serif' };
const btnPrimary: any = { background: 'var(--charcoal)', color: 'white', border: 'none', borderRadius: '4px', padding: '9px 18px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans), sans-serif', letterSpacing: '0.06em' };

// ── FOTO UPLOAD con progreso ───────────────────────────────────────────────
function FotoUpload({ campo, label, valor, onUpload, onClear }: {
  campo: string;
  label: string;
  valor: string;
  onUpload: (file: File, campo: string) => Promise<void>;
  onClear: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      await onUpload(file, campo);
    } catch {
      setError('Error al subir. Intenta de nuevo.');
    }
    setUploading(false);
  };

  return (
    <div>
      <div style={{ fontSize: '10px', color: 'var(--warm-gray)', marginBottom: '4px', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      {valor ? (
        <div>
          <div style={{ position: 'relative' }}>
            <img src={valor} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)', display: 'block' }}/>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.4)'; (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)'; (e.currentTarget as HTMLDivElement).style.opacity = '0'; }}
            >
              <label style={{ background: 'white', color: 'var(--charcoal)', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 500 }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}/>
                Cambiar
              </label>
              <button type="button" onClick={onClear} style={{ background: '#C0392B', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>×</button>
            </div>
          </div>
          {uploading && <div style={{ marginTop: '4px', height: '3px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}><div style={{ height: '100%', background: 'var(--sage)', animation: 'progress 1s ease-in-out infinite' }}/></div>}
        </div>
      ) : (
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '1rem 0.5rem', borderRadius: '6px', border: uploading ? '1.5px solid var(--sage)' : '1.5px dashed var(--border)', cursor: uploading ? 'wait' : 'pointer', background: uploading ? '#f0f4ef' : 'var(--cream)', minHeight: '80px', justifyContent: 'center', transition: 'all 0.2s' }}>
          <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}/>
          {uploading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              <span style={{ fontSize: '10px', color: 'var(--sage)', fontWeight: 500 }}>Subiendo...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warm-gray)" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span style={{ fontSize: '10px', color: 'var(--warm-gray)', textAlign: 'center' }}>Subir foto</span>
            </>
          )}
        </label>
      )}
      {error && <div style={{ fontSize: '10px', color: '#C0392B', marginTop: '3px', textAlign: 'center' }}>{error}</div>}
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <input type="color" value={value || '#FFFFFF'} onChange={e => onChange(e.target.value)} style={{ width: '36px', height: '34px', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', padding: '2px', background: 'white' }}/>
        <input value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="#000000"/>
        {value && <button type="button" onClick={() => onChange('')} style={{ background: 'none', border: 'none', color: 'var(--warm-gray)', cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}>×</button>}
      </div>
    </div>
  );
}

function ArmazonForm({ data, onChange, onFotoUpload }: {
  data: any;
  onChange: (field: string, value: any) => void;
  onFotoUpload: (file: File, campo: string) => Promise<void>;
}) {
  const handleMedidas = (val: string) => {
    onChange('medidas', val);
    onChange('talla', tallaDesdeMedias(val));
  };

  const fotos = [
    { campo: 'imagen_url', label: 'Principal' },
    { campo: 'imagen2_url', label: 'Foto 2' },
    { campo: 'imagen3_url', label: 'Foto 3' },
    { campo: 'imagen4_url', label: 'Foto 4' },
    { campo: 'imagen5_url', label: 'Lifestyle' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* FOTOS */}
      <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Fotos <span style={{ fontWeight: 400, color: 'var(--sage)' }}>— se guardan automáticamente al seleccionar</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {fotos.map(f => (
            <FotoUpload
              key={f.campo}
              campo={f.campo}
              label={f.label}
              valor={data[f.campo] || ''}
              onUpload={onFotoUpload}
              onClear={() => onChange(f.campo, '')}
            />
          ))}
        </div>
      </div>

      {/* INFO BÁSICA */}
      <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Información básica</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px' }}>
          <div><label style={labelStyle}>Nombre</label><input value={data.nombre} onChange={e => onChange('nombre', e.target.value)} style={inputStyle} placeholder="Old Fashion"/></div>
          <div><label style={labelStyle}>Modelo</label><input value={data.modelo || ''} onChange={e => onChange('modelo', e.target.value)} style={inputStyle} placeholder="VRL-001"/></div>
          <div><label style={labelStyle}>Marca</label><input value={data.marca} onChange={e => onChange('marca', e.target.value)} style={inputStyle} placeholder="Verly"/></div>
          <div><label style={labelStyle}>Material</label>
            <select value={data.material || ''} onChange={e => onChange('material', e.target.value)} style={inputStyle}>
              <option value="">Seleccionar</option>
              {['Acetato','Metálico','TR-90','Tres piezas','Titanio','Mixto'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Badge</label><input value={data.badge || ''} onChange={e => onChange('badge', e.target.value)} style={inputStyle} placeholder="Nuevo / Popular"/></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
            <input type="checkbox" checked={data.activo} onChange={e => onChange('activo', e.target.checked)} id={`activo-${data.id || 'new'}`}/>
            <label htmlFor={`activo-${data.id || 'new'}`} style={{ fontSize: '13px', fontWeight: 500 }}>Activo</label>
          </div>
        </div>
      </div>

      {/* PRECIOS */}
      <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Precio e inventario</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <div><label style={labelStyle}>Precio ($)</label><input type="number" value={data.precio} onChange={e => onChange('precio', e.target.value)} style={inputStyle}/></div>
          <div><label style={labelStyle}>Descuento (%)</label><input type="number" value={data.descuento || '0'} onChange={e => onChange('descuento', e.target.value)} style={inputStyle} placeholder="0"/></div>
          <div><label style={labelStyle}>Stock</label><input type="number" value={data.stock} onChange={e => onChange('stock', e.target.value)} style={inputStyle}/></div>
        </div>
      </div>

      {/* CARACTERÍSTICAS */}
      <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Características</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div><label style={labelStyle}>Forma</label>
            <select value={data.forma} onChange={e => onChange('forma', e.target.value)} style={inputStyle}>
              {['cuadrada','ovalada','rectangular','redonda'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Género</label>
            <select value={data.genero} onChange={e => onChange('genero', e.target.value)} style={inputStyle}>
              {['hombre','mujer','unisex'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Tipo</label>
            <select value={data.tipo} onChange={e => onChange('tipo', e.target.value)} style={inputStyle}>
              <option value="optico">Óptico</option>
              <option value="solar">Solar</option>
            </select>
          </div>
          <div><label style={labelStyle}>Medidas → Talla auto</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input value={data.medidas || ''} onChange={e => handleMedidas(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="52-18-140"/>
              <div style={{ padding: '8px 12px', background: 'white', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--sage)', whiteSpace: 'nowrap' }}>{data.talla || 'M'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* COLORES */}
      <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Colores (hasta 3)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <ColorPicker label="Color 1 (principal)" value={data.color1 || data.color || ''} onChange={v => onChange('color1', v)}/>
          <ColorPicker label="Color 2" value={data.color2 || ''} onChange={v => onChange('color2', v)}/>
          <ColorPicker label="Color 3" value={data.color3 || ''} onChange={v => onChange('color3', v)}/>
        </div>
      </div>

    </div>
  );
}

// ── MODAL NUEVO ARMAZÓN — flujo de 2 pasos ───────────────────────────────
function ModalNuevoArmazon({ onClose, onSaved, subirFotoDirecto }: {
  onClose: () => void;
  onSaved: () => void;
  subirFotoDirecto: (file: File, campo: string, id: number) => Promise<string | null>;
}) {
  const [data, setData] = useState<any>({ ...ARMAZON_VACIO });
  const [guardando, setGuardando] = useState(false);
  const [armazonId, setArmazonId] = useState<number | null>(null);
  const [guardado, setGuardado] = useState(false);

  const onChange = useCallback((field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  // Guardar info básica primero (sin fotos)
  const guardarInfo = async () => {
    if (!data.nombre.trim()) { alert('El nombre es obligatorio'); return; }
    setGuardando(true);
    const payload = {
      nombre: data.nombre, modelo: data.modelo, marca: data.marca,
      precio: parseInt(data.precio) || 13, stock: parseInt(data.stock) || 10,
      badge: data.badge, color1: data.color1, color2: data.color2, color3: data.color3,
      color: data.color1, material: data.material, forma: data.forma,
      genero: data.genero, tipo: data.tipo, descuento: parseFloat(data.descuento) || 0,
      medidas: data.medidas, talla: data.talla, activo: data.activo,
    };
    const { data: saved, error } = await supabase.from('armazones').insert(payload).select().single();
    setGuardando(false);
    if (error || !saved) { alert('Error al guardar: ' + (error?.message || 'intenta de nuevo')); return; }
    setArmazonId(saved.id);
    setGuardado(true);
  };

  // Upload de foto — solo funciona después de tener ID
  const onFotoUpload = async (file: File, campo: string) => {
    if (!armazonId) return;
    const url = await subirFotoDirecto(file, campo, armazonId);
    if (url) {
      setData((prev: any) => ({ ...prev, [campo]: url }));
      // Actualizar en BD inmediatamente
      await supabase.from('armazones').update({ [campo]: url }).eq('id', armazonId);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Nuevo armazón</h3>
            {armazonId && <div style={{ fontSize: '11px', color: 'var(--sage)', marginTop: '2px' }}>✓ Guardado — ID #{armazonId} — ahora puedes subir fotos</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
        </div>

        {!guardado ? (
          // PASO 1: Solo info básica
          <div>
            <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '12px', color: '#92400e' }}>
              💡 Primero guarda la info básica, luego podrás subir las fotos sin perder nada.
            </div>
            {/* Info básica, características, precios, colores — sin fotos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Información básica</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px' }}>
                  <div><label style={labelStyle}>Nombre *</label><input value={data.nombre} onChange={e => onChange('nombre', e.target.value)} style={{ ...inputStyle, borderColor: !data.nombre ? '#fca5a5' : undefined }} placeholder="Old Fashion"/></div>
                  <div><label style={labelStyle}>Modelo</label><input value={data.modelo || ''} onChange={e => onChange('modelo', e.target.value)} style={inputStyle} placeholder="VRL-001"/></div>
                  <div><label style={labelStyle}>Marca</label><input value={data.marca} onChange={e => onChange('marca', e.target.value)} style={inputStyle} placeholder="Verly"/></div>
                  <div><label style={labelStyle}>Material</label>
                    <select value={data.material || ''} onChange={e => onChange('material', e.target.value)} style={inputStyle}>
                      <option value="">Seleccionar</option>
                      {['Acetato','Metálico','TR-90','Tres piezas','Titanio','Mixto'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>Badge</label><input value={data.badge || ''} onChange={e => onChange('badge', e.target.value)} style={inputStyle} placeholder="Nuevo / Popular"/></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                    <input type="checkbox" checked={data.activo} onChange={e => onChange('activo', e.target.checked)} id="activo-new"/>
                    <label htmlFor="activo-new" style={{ fontSize: '13px', fontWeight: 500 }}>Activo</label>
                  </div>
                </div>
              </div>
              <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Precio e inventario</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div><label style={labelStyle}>Precio ($)</label><input type="number" value={data.precio} onChange={e => onChange('precio', e.target.value)} style={inputStyle}/></div>
                  <div><label style={labelStyle}>Descuento (%)</label><input type="number" value={data.descuento || '0'} onChange={e => onChange('descuento', e.target.value)} style={inputStyle}/></div>
                  <div><label style={labelStyle}>Stock</label><input type="number" value={data.stock} onChange={e => onChange('stock', e.target.value)} style={inputStyle}/></div>
                </div>
              </div>
              <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Características</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                  <div><label style={labelStyle}>Forma</label>
                    <select value={data.forma} onChange={e => onChange('forma', e.target.value)} style={inputStyle}>
                      {['cuadrada','ovalada','rectangular','redonda'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>Género</label>
                    <select value={data.genero} onChange={e => onChange('genero', e.target.value)} style={inputStyle}>
                      {['hombre','mujer','unisex'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>Tipo</label>
                    <select value={data.tipo} onChange={e => onChange('tipo', e.target.value)} style={inputStyle}>
                      <option value="optico">Óptico</option>
                      <option value="solar">Solar</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>Medidas</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input value={data.medidas || ''} onChange={e => { onChange('medidas', e.target.value); onChange('talla', tallaDesdeMedias(e.target.value)); }} style={{ ...inputStyle, flex: 1 }} placeholder="52-18-140"/>
                      <div style={{ padding: '8px 10px', background: 'white', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--sage)' }}>{data.talla || 'M'}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Colores</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <ColorPicker label="Color 1 (principal)" value={data.color1 || ''} onChange={v => onChange('color1', v)}/>
                  <ColorPicker label="Color 2" value={data.color2 || ''} onChange={v => onChange('color2', v)}/>
                  <ColorPicker label="Color 3" value={data.color3 || ''} onChange={v => onChange('color3', v)}/>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={onClose} style={btnGhost}>Cancelar</button>
              <button onClick={guardarInfo} disabled={guardando} style={{ ...btnSage, opacity: guardando ? 0.6 : 1 }}>
                {guardando ? 'Guardando...' : 'Guardar y continuar con fotos →'}
              </button>
            </div>
          </div>
        ) : (
          // PASO 2: Subir fotos
          <div>
            <div style={{ background: '#f0f4ef', border: '1px solid #c8dbc4', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '12px', color: '#3a4f33' }}>
              ✓ Armazón <strong>{data.nombre}</strong> guardado. Ahora sube las fotos — cada una se guarda automáticamente al seleccionarla.
            </div>
            <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Fotos del armazón</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {[
                  { campo: 'imagen_url', label: 'Principal' },
                  { campo: 'imagen2_url', label: 'Foto 2' },
                  { campo: 'imagen3_url', label: 'Foto 3' },
                  { campo: 'imagen4_url', label: 'Foto 4' },
                  { campo: 'imagen5_url', label: 'Lifestyle' },
                ].map(f => (
                  <FotoUpload
                    key={f.campo}
                    campo={f.campo}
                    label={f.label}
                    valor={data[f.campo] || ''}
                    onUpload={onFotoUpload}
                    onClear={async () => {
                      onChange(f.campo, '');
                      if (armazonId) await supabase.from('armazones').update({ [f.campo]: null }).eq('id', armazonId);
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--warm-gray)', marginTop: '0.75rem', marginBottom: 0 }}>
                Las fotos son opcionales — puedes agregarlas después editando el armazón.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => { onSaved(); onClose(); }} style={btnSage}>Listo, cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ADMIN ─────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [modulo, setModulo] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [armazones, setArmazones] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [finanzas, setFinanzas] = useState<any[]>([]);

  const [editArmazon, setEditArmazon] = useState<any>(null);
  const [editPedido, setEditPedido] = useState<any>(null);
  const [editCliente, setEditCliente] = useState<any>(null);
  const [showNewPedido, setShowNewPedido] = useState(false);
  const [showNewCliente, setShowNewCliente] = useState(false);
  const [showNewArmazon, setShowNewArmazon] = useState(false);

  const [newPedido, setNewPedido] = useState<any>({
    cliente_id: '', armazon_id: '', estado: 'pendiente',
    precio_venta: '', notas_admin: '', notas_cliente: '',
    tracking: '', paqueteria: '',
    receta: { sph_od: '', cyl_od: '', axis_od: '', sph_os: '', cyl_os: '', axis_os: '', add_val: '', dp: '' },
    finanzas: { costo_armazon: '', costo_laboratorio: '', otros_costos: '' },
  });
  const [newCliente, setNewCliente] = useState({ nombre: '', email: '', telefono: '', direccion: '', notas: '' });

  useEffect(() => { if (authed) cargarTodo(); }, [authed]);

  async function cargarTodo() {
    const [{ data: a }, { data: p }, { data: c }, { data: f }] = await Promise.all([
      supabase.from('armazones').select('*').order('id'),
      supabase.from('pedidos').select('*, clientes(*), armazones(*), recetas(*), pedido_items(*), finanzas(*)').order('created_at', { ascending: false }),
      supabase.from('clientes').select('*').order('created_at', { ascending: false }),
      supabase.from('finanzas').select('*'),
    ]);
    setArmazones(a || []);
    setPedidos(p || []);
    setClientes(c || []);
    setFinanzas(f || []);
  }

  const subirFotoDirecto = useCallback(async (file: File, campo: string, id: number): Promise<string | null> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const nombre = `armazon-${id}-${campo}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('armazones').upload(nombre, file, { upsert: true });
    if (error) { console.error('Upload error:', error); return null; }
    const { data } = supabase.storage.from('armazones').getPublicUrl(nombre);
    return data.publicUrl;
  }, []);

  const handleEditArmazonChange = useCallback((field: string, value: any) => {
    setEditArmazon((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  // Upload para armazón en edición — sube y guarda en BD inmediatamente
  const onFotoUploadEdit = useCallback(async (file: File, campo: string) => {
    if (!editArmazon?.id) return;
    const url = await subirFotoDirecto(file, campo, editArmazon.id);
    if (url) {
      setEditArmazon((prev: any) => ({ ...prev, [campo]: url }));
      await supabase.from('armazones').update({ [campo]: url }).eq('id', editArmazon.id);
    }
  }, [editArmazon?.id, subirFotoDirecto]);

  const totalVentas = pedidos.reduce((s, p) => s + (p.precio_venta || 0), 0);
  const totalCostos = finanzas.reduce((s, f) => s + (f.costo_armazon || 0) + (f.costo_laboratorio || 0) + (f.otros_costos || 0), 0);
  const ganancia = totalVentas - totalCostos;
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans), sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '2.5rem', width: '360px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo-trasparente.png" alt="Verly" style={{ height: '36px', marginBottom: '1rem' }}/>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: 0 }}>Panel de administración</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} style={inputStyle}/>
          <input type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (user === 'admin@verlyoptical.com' && pass === 'verly2024' ? setAuthed(true) : alert('Credenciales incorrectas'))}
            style={inputStyle}/>
          <button onClick={() => user === 'admin@verlyoptical.com' && pass === 'verly2024' ? setAuthed(true) : alert('Credenciales incorrectas')}
            style={{ ...btnPrimary, padding: '12px', marginTop: '4px' }}>Entrar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-sans), sans-serif', background: 'var(--cream)', color: 'var(--charcoal)' }}>

      {/* SIDEBAR */}
      <div style={{ width: sidebarOpen ? '220px' : '56px', flexShrink: 0, background: 'var(--charcoal)', color: 'white', transition: 'width 0.25s ease', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: sidebarOpen ? '1.5rem 1.25rem 1rem' : '1.5rem 0 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
          {sidebarOpen ? <img src="/logo-trasparente.png" alt="Verly" style={{ height: '28px', opacity: 0.9 }}/> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/></svg>}
        </div>
        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {MENU.map(m => (
            <button key={m.id} onClick={() => setModulo(m.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: sidebarOpen ? '10px 16px' : '10px 0', justifyContent: sidebarOpen ? 'flex-start' : 'center', border: 'none', background: modulo === m.id ? 'rgba(255,255,255,0.08)' : 'transparent', color: modulo === m.id ? 'white' : 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: '13px', fontWeight: modulo === m.id ? 500 : 400, borderLeft: modulo === m.id ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent', textAlign: 'left', fontFamily: 'var(--font-sans), sans-serif' }}>
              <span style={{ flexShrink: 0 }}>{m.icon}</span>
              {sidebarOpen && <span>{m.label}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">{sidebarOpen ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}</svg>
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0.85rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)', letterSpacing: '0.02em' }}>{MENU.find(m => m.id === modulo)?.label}</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a href="/" target="_blank" style={{ color: 'var(--warm-gray)', fontSize: '12px', textDecoration: 'none' }}>Ver sitio →</a>
            <button onClick={() => setAuthed(false)} style={{ ...btnGhost, padding: '6px 12px', fontSize: '11px' }}>Salir</button>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>

          {/* DASHBOARD */}
          {modulo === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Ventas totales', valor: `$${totalVentas.toFixed(0)}`, sub: 'USD' },
                  { label: 'Ganancia neta', valor: `$${ganancia.toFixed(0)}`, sub: 'USD' },
                  { label: 'Pedidos', valor: pedidos.length, sub: 'total' },
                  { label: 'Pendientes', valor: pedidosPendientes, sub: 'por atender' },
                  { label: 'Clientes', valor: clientes.length, sub: 'registrados' },
                  { label: 'Armazones', valor: armazones.length, sub: 'en catálogo' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '1.25rem', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--warm-gray)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{m.label}</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1 }}>{m.valor}</div>
                    <div style={{ fontSize: '11px', color: 'var(--warm-gray)', marginTop: '4px' }}>{m.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontSize: '13px', fontWeight: 500 }}>Pedidos recientes</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: 'var(--cream)' }}>{['#','Cliente','Armazón','Total','Estado','Fecha'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {pedidos.slice(0, 8).map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)', fontWeight: 500 }}>{orderCode(p.id)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.clientes?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--warm-gray)' }}>{p.armazones?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>${p.precio_venta || 0}</td>
                        <td style={{ padding: '12px 16px' }}><span style={{ background: ESTADO_COLORS[p.estado]?.bg, color: ESTADO_COLORS[p.estado]?.text, border: `1px solid ${ESTADO_COLORS[p.estado]?.border}`, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>{p.estado}</span></td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {pedidos.length === 0 && <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--warm-gray)', fontSize: '13px' }}>Sin pedidos aún</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PEDIDOS */}
          {modulo === 'pedidos' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--warm-gray)' }}>{pedidos.length} pedidos</p>
                <button onClick={() => setShowNewPedido(true)} style={btnPrimary}>+ Nuevo pedido</button>
              </div>
              {showNewPedido && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Nuevo pedido</h3>
                      <button onClick={() => setShowNewPedido(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div><label style={labelStyle}>Cliente</label><select value={newPedido.cliente_id} onChange={e => setNewPedido({...newPedido, cliente_id: e.target.value})} style={inputStyle}><option value="">Seleccionar</option>{clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
                      <div><label style={labelStyle}>Armazón</label><select value={newPedido.armazon_id} onChange={e => setNewPedido({...newPedido, armazon_id: e.target.value})} style={inputStyle}><option value="">Seleccionar</option>{armazones.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}</select></div>
                      <div><label style={labelStyle}>Precio de venta ($)</label><input type="number" value={newPedido.precio_venta} onChange={e => setNewPedido({...newPedido, precio_venta: e.target.value})} style={inputStyle}/></div>
                      <div><label style={labelStyle}>Estado</label><select value={newPedido.estado} onChange={e => setNewPedido({...newPedido, estado: e.target.value})} style={inputStyle}>{ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    </div>
                    <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Receta óptica</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {[{key:'sph_od',label:'SPH OD'},{key:'cyl_od',label:'CYL OD'},{key:'axis_od',label:'EJE OD'},{key:'sph_os',label:'SPH OS'},{key:'cyl_os',label:'CYL OS'},{key:'axis_os',label:'EJE OS'},{key:'add_val',label:'ADD'},{key:'dp',label:'DP'}].map(f => (
                          <div key={f.key}><label style={{...labelStyle, fontSize:'9px'}}>{f.label}</label><input type="number" step="0.25" value={newPedido.receta[f.key]} onChange={e => setNewPedido({...newPedido, receta: {...newPedido.receta, [f.key]: e.target.value}})} style={{...inputStyle, padding:'6px 8px'}} placeholder="—"/></div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Costos</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        {[{key:'costo_armazon',label:'Armazón'},{key:'costo_laboratorio',label:'Laboratorio'},{key:'otros_costos',label:'Otros'}].map(f => (
                          <div key={f.key}><label style={{...labelStyle, fontSize:'9px'}}>{f.label}</label><input type="number" value={newPedido.finanzas[f.key]} onChange={e => setNewPedido({...newPedido, finanzas: {...newPedido.finanzas, [f.key]: e.target.value}})} style={{...inputStyle, padding:'6px 8px'}} placeholder="0"/></div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div><label style={labelStyle}>Notas internas</label><textarea value={newPedido.notas_admin} onChange={e => setNewPedido({...newPedido, notas_admin: e.target.value})} style={{...inputStyle, resize:'none'}} rows={2}/></div>
                      <div><label style={labelStyle}>Notas del cliente</label><textarea value={newPedido.notas_cliente} onChange={e => setNewPedido({...newPedido, notas_cliente: e.target.value})} style={{...inputStyle, resize:'none'}} rows={2}/></div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setShowNewPedido(false)} style={btnGhost}>Cancelar</button>
                      <button onClick={async () => {
                        const { data: ped } = await supabase.from('pedidos').insert({ cliente_id: newPedido.cliente_id || null, armazon_id: newPedido.armazon_id || null, estado: newPedido.estado, precio_venta: parseFloat(newPedido.precio_venta)||0, notas_admin: newPedido.notas_admin, notas_cliente: newPedido.notas_cliente }).select().single();
                        if (ped) {
                          await supabase.from('recetas').insert({ pedido_id: ped.id, ...Object.fromEntries(Object.entries(newPedido.receta).map(([k,v]) => [k, parseFloat(v as string)||null])) });
                          await supabase.from('finanzas').insert({ pedido_id: ped.id, precio_venta: parseFloat(newPedido.precio_venta)||0, ...Object.fromEntries(Object.entries(newPedido.finanzas).map(([k,v]) => [k, parseFloat(v as string)||0])) });
                        }
                        setShowNewPedido(false); cargarTodo();
                      }} style={btnSage}>Guardar pedido</button>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: 'var(--cream)' }}>{['#','Cliente','Armazón','Total','Estado','Dirección','Tracking','Fecha',''].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {pedidos.map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)', fontWeight: 500 }}>{orderCode(p.id)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 500 }}>{p.clientes?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--warm-gray)' }}>{p.armazones?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>${p.precio_venta||0}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <select value={p.estado} onChange={async e => { await supabase.from('pedidos').update({ estado: e.target.value }).eq('id', p.id); cargarTodo(); }} style={{ padding: '4px 8px', borderRadius: '20px', border: `1px solid ${ESTADO_COLORS[p.estado]?.border}`, background: ESTADO_COLORS[p.estado]?.bg, color: ESTADO_COLORS[p.estado]?.text, fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.clientes?.direccion || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)' }}>{p.tracking || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px' }}><button onClick={() => setEditPedido(p)} style={{ ...btnGhost, padding: '4px 12px', fontSize: '11px' }}>Ver</button></td>
                      </tr>
                    ))}
                    {pedidos.length === 0 && <tr><td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: 'var(--warm-gray)', fontSize: '13px' }}>Sin pedidos aún</td></tr>}
                  </tbody>
                </table>
              </div>
              {editPedido && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{orderCode(editPedido.id)}</h3>
                      <button onClick={() => setEditPedido(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div><span style={labelStyle}>Cliente</span><p style={{ margin: 0, fontSize: '14px' }}>{editPedido.clientes?.nombre || '—'}</p></div>
                      <div><span style={labelStyle}>Armazón</span><p style={{ margin: 0, fontSize: '14px' }}>{editPedido.armazones?.nombre || '—'}</p></div>
                      <div><span style={labelStyle}>Total</span><p style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>${editPedido.precio_venta}</p></div>
                      <div><label style={labelStyle}>Estado</label><select value={editPedido.estado} onChange={async e => { await supabase.from('pedidos').update({ estado: e.target.value }).eq('id', editPedido.id); setEditPedido({...editPedido, estado: e.target.value}); cargarTodo(); }} style={inputStyle}>{ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    </div>
                    {editPedido.clientes?.direccion && <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}><span style={labelStyle}>Dirección de envío</span><p style={{ margin: 0, fontSize: '13px' }}>{editPedido.clientes.direccion}</p></div>}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div><label style={labelStyle}>Tracking</label><input value={editPedido.tracking || ''} onChange={e => setEditPedido({...editPedido, tracking: e.target.value})} style={inputStyle} placeholder="Número de tracking"/></div>
                      <div><label style={labelStyle}>Paquetería</label><input value={editPedido.paqueteria || ''} onChange={e => setEditPedido({...editPedido, paqueteria: e.target.value})} style={inputStyle} placeholder="FedEx, DHL..."/></div>
                    </div>
                    {editPedido.notas_cliente && <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}><span style={labelStyle}>Detalle del pedido</span><p style={{ margin: 0, fontSize: '12px', color: 'var(--warm-gray)', lineHeight: 1.6 }}>{editPedido.notas_cliente}</p></div>}
                    {editPedido.recetas?.[0] && (
                      <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Receta óptica</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', fontSize: '12px' }}>
                          {['sph_od','cyl_od','axis_od','sph_os','cyl_os','axis_os','add_val','dp'].map(k => (
                            <div key={k}><span style={{ color: 'var(--warm-gray)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</span><br/><strong>{editPedido.recetas[0][k] ?? '—'}</strong></div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Actualizar estado y notificar</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button disabled={editPedido.estado !== 'pendiente'} onClick={async () => {
                          if (!confirm('¿Marcar como En Fabricación y notificar al cliente?')) return;
                          const res = await fetch('/api/emails', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo: 'fabricacion', order_id: editPedido.id }) });
                          if (res.ok) { setEditPedido({...editPedido, estado: 'en proceso'}); cargarTodo(); alert('Email enviado'); }
                        }} style={{ ...btnSage, opacity: editPedido.estado !== 'pendiente' ? 0.4 : 1, cursor: editPedido.estado !== 'pendiente' ? 'not-allowed' : 'pointer', fontSize: '11px', padding: '7px 14px' }}>En fabricación</button>
                        <button disabled={editPedido.estado !== 'en proceso'} onClick={async () => {
                          const tracking = prompt('Número de tracking:'); if (!tracking) return;
                          const paqueteria = prompt('Paquetería:') || 'paquetería';
                          const res = await fetch('/api/emails', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo: 'enviado', order_id: editPedido.id, tracking, paqueteria }) });
                          if (res.ok) { setEditPedido({...editPedido, estado: 'enviado', tracking, paqueteria}); cargarTodo(); alert('Email enviado'); }
                        }} style={{ background: '#1E40AF', color: 'white', border: 'none', borderRadius: '4px', padding: '7px 14px', fontSize: '11px', fontWeight: 500, cursor: editPedido.estado !== 'en proceso' ? 'not-allowed' : 'pointer', opacity: editPedido.estado !== 'en proceso' ? 0.4 : 1, fontFamily: 'var(--font-sans)' }}>Enviado</button>
                        <button disabled={editPedido.estado !== 'enviado'} onClick={async () => {
                          if (!confirm('¿Marcar como Entregado?')) return;
                          const res = await fetch('/api/emails', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo: 'entregado', order_id: editPedido.id }) });
                          if (res.ok) { setEditPedido({...editPedido, estado: 'entregado'}); cargarTodo(); alert('Email enviado. 30 días programado.'); }
                        }} style={{ background: '#065F46', color: 'white', border: 'none', borderRadius: '4px', padding: '7px 14px', fontSize: '11px', fontWeight: 500, cursor: editPedido.estado !== 'enviado' ? 'not-allowed' : 'pointer', opacity: editPedido.estado !== 'enviado' ? 0.4 : 1, fontFamily: 'var(--font-sans)' }}>Entregado</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={async () => { await supabase.from('pedidos').update({ tracking: editPedido.tracking, paqueteria: editPedido.paqueteria, estado: editPedido.estado }).eq('id', editPedido.id); setEditPedido(null); cargarTodo(); }} style={btnSage}>Guardar cambios</button>
                      <button onClick={async () => { if (confirm('¿Eliminar pedido?')) { await supabase.from('recetas').delete().eq('pedido_id', editPedido.id); await supabase.from('finanzas').delete().eq('pedido_id', editPedido.id); await supabase.from('pedidos').delete().eq('id', editPedido.id); setEditPedido(null); cargarTodo(); } }} style={btnDanger}>Eliminar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CLIENTES */}
          {modulo === 'clientes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--warm-gray)' }}>{clientes.length} clientes</p>
                <button onClick={() => setShowNewCliente(true)} style={btnPrimary}>+ Nuevo cliente</button>
              </div>
              {showNewCliente && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Nuevo cliente</h3>
                      <button onClick={() => setShowNewCliente(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[{key:'nombre',label:'Nombre',placeholder:'Juan García'},{key:'email',label:'Email',placeholder:'juan@email.com'},{key:'telefono',label:'Teléfono',placeholder:'+1 (555) 000-0000'},{key:'direccion',label:'Dirección',placeholder:'Ciudad, Estado'}].map(f => (
                        <div key={f.key}><label style={labelStyle}>{f.label}</label><input value={(newCliente as any)[f.key]} onChange={e => setNewCliente({...newCliente, [f.key]: e.target.value})} style={inputStyle} placeholder={f.placeholder}/></div>
                      ))}
                      <div><label style={labelStyle}>Notas</label><textarea value={newCliente.notas} onChange={e => setNewCliente({...newCliente, notas: e.target.value})} style={{...inputStyle, resize:'none'}} rows={2}/></div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                      <button onClick={() => setShowNewCliente(false)} style={btnGhost}>Cancelar</button>
                      <button onClick={async () => { await supabase.from('clientes').insert(newCliente); setNewCliente({nombre:'',email:'',telefono:'',direccion:'',notas:''}); setShowNewCliente(false); cargarTodo(); }} style={btnSage}>Guardar</button>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: 'var(--cream)' }}>{['Nombre','Email','Teléfono','Dirección','Pedidos',''].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {clientes.map(c => (
                      <tr key={c.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 500 }}>{c.nombre}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--warm-gray)' }}>{c.email||'—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--warm-gray)' }}>{c.telefono||'—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.direccion||'—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>{pedidos.filter(p => p.cliente_id === c.id).length}</td>
                        <td style={{ padding: '12px 16px' }}><button onClick={() => setEditCliente(c)} style={{ ...btnGhost, padding: '4px 12px', fontSize: '11px' }}>Ver</button></td>
                      </tr>
                    ))}
                    {clientes.length === 0 && <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--warm-gray)', fontSize: '13px' }}>Sin clientes aún</td></tr>}
                  </tbody>
                </table>
              </div>
              {editCliente && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{editCliente.nombre}</h3>
                      <button onClick={() => setEditCliente(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                      {['nombre','email','telefono','direccion'].map(k => (<div key={k}><label style={labelStyle}>{k}</label><input value={editCliente[k]||''} onChange={e => setEditCliente({...editCliente, [k]: e.target.value})} style={inputStyle}/></div>))}
                      <div><label style={labelStyle}>Notas</label><textarea value={editCliente.notas||''} onChange={e => setEditCliente({...editCliente, notas: e.target.value})} style={{...inputStyle, resize:'none'}} rows={3}/></div>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Pedidos</div>
                      {pedidos.filter(p => p.cliente_id === editCliente.id).map(p => (
                        <div key={p.id} style={{ background: 'var(--cream)', borderRadius: '6px', padding: '10px 14px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span>{orderCode(p.id)} — {p.armazones?.nombre}</span>
                          <span style={{ fontWeight: 600 }}>${p.precio_venta}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={async () => { await supabase.from('clientes').update(editCliente).eq('id', editCliente.id); setEditCliente(null); cargarTodo(); }} style={btnSage}>Guardar</button>
                      <button onClick={async () => { if (confirm('¿Eliminar cliente?')) { await supabase.from('clientes').delete().eq('id', editCliente.id); setEditCliente(null); cargarTodo(); } }} style={btnDanger}>Eliminar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CATÁLOGO */}
          {modulo === 'catalogo' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--warm-gray)' }}>{armazones.length} armazones</p>
                <button onClick={() => setShowNewArmazon(true)} style={btnPrimary}>+ Nuevo armazón</button>
              </div>

              {showNewArmazon && (
                <ModalNuevoArmazon
                  onClose={() => setShowNewArmazon(false)}
                  onSaved={cargarTodo}
                  subirFotoDirecto={subirFotoDirecto}
                />
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {armazones.map(a => (
                  <div key={a.id} style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '160px', background: `${a.color || a.color1 || '#1A1A2E'}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {a.imagen_url
                        ? <img src={a.imagen_url} alt={a.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        : <svg width="100" height="56" viewBox="0 0 160 90" fill="none"><rect x="4" y="12" width="64" height="66" rx="14" fill="none" stroke={a.color||'#1A1A2E'} strokeWidth="3.5"/><rect x="92" y="12" width="64" height="66" rx="14" fill="none" stroke={a.color||'#1A1A2E'} strokeWidth="3.5"/><path d="M68 38 C72 32, 88 32, 92 38" stroke={a.color||'#1A1A2E'} strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
                      }
                      <div style={{ position: 'absolute', top: '8px', right: '8px', background: a.activo ? '#D1FAE5' : '#FEE2E2', color: a.activo ? '#065F46' : '#991B1B', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: 500 }}>{a.activo ? 'Activo' : 'Inactivo'}</div>
                      {a.tipo === 'solar' && <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--charcoal)', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: 500 }}>Solar</div>}
                      {a.descuento > 0 && <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: '#C0392B', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: 600 }}>-{a.descuento}%</div>}
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                        {[a.color1||a.color, a.color2, a.color3].filter(Boolean).map((c, i) => (
                          <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, border: '1.5px solid white' }}/>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '2px' }}>{a.nombre}</div>
                      <div style={{ fontSize: '11px', color: 'var(--warm-gray)', marginBottom: '2px', textTransform: 'capitalize' }}>{a.material && `${a.material} · `}{a.forma} · {a.genero}</div>
                      {a.medidas && <div style={{ fontSize: '11px', color: 'var(--warm-gray)', marginBottom: '8px' }}>{a.medidas} · Talla {a.talla}</div>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '16px' }}>${a.precio}</span>
                          {a.descuento > 0 && <span style={{ fontSize: '11px', color: '#C0392B', marginLeft: '6px' }}>-{a.descuento}%</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => setEditArmazon({...a, color1: a.color1||a.color||'#1A1A2E'})} style={{ ...btnGhost, padding: '4px 12px', fontSize: '11px' }}>Editar</button>
                          <button onClick={async () => { if (confirm('¿Eliminar?')) { await supabase.from('armazones').delete().eq('id', a.id); cargarTodo(); } }} style={{ ...btnDanger, padding: '4px 12px', fontSize: '11px' }}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* MODAL EDITAR */}
              {editArmazon && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Editando: {editArmazon.nombre}</h3>
                      <button onClick={() => setEditArmazon(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
                    </div>
                    <ArmazonForm
                      data={editArmazon}
                      onChange={handleEditArmazonChange}
                      onFotoUpload={onFotoUploadEdit}
                    />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                      <button onClick={() => setEditArmazon(null)} style={btnGhost}>Cancelar</button>
                      <button onClick={async () => {
                        await supabase.from('armazones').update({
                          ...editArmazon,
                          precio: parseInt(editArmazon.precio),
                          stock: parseInt(editArmazon.stock),
                          descuento: parseFloat(editArmazon.descuento) || 0,
                          color: editArmazon.color1 || editArmazon.color,
                        }).eq('id', editArmazon.id);
                        setEditArmazon(null);
                        cargarTodo();
                      }} style={btnSage}>Guardar cambios</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FINANZAS */}
          {modulo === 'finanzas' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[{label:'Ingresos totales',valor:`$${totalVentas.toFixed(2)}`},{label:'Costos totales',valor:`$${totalCostos.toFixed(2)}`},{label:'Ganancia bruta',valor:`$${ganancia.toFixed(2)}`},{label:'Margen',valor:totalVentas>0?`${((ganancia/totalVentas)*100).toFixed(1)}%`:'0%'}].map((m,i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '1.25rem', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--warm-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{m.label}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--charcoal)' }}>{m.valor}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontSize: '13px', fontWeight: 500 }}>Desglose por pedido</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: 'var(--cream)' }}>{['Pedido','Venta','C. Armazón','C. Lab','Otros','Ganancia','Margen'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {pedidos.filter(p => p.finanzas?.[0]).map(p => {
                      const f = p.finanzas[0];
                      const costos = (f.costo_armazon||0)+(f.costo_laboratorio||0)+(f.otros_costos||0);
                      const gan = (p.precio_venta||0)-costos;
                      const margen = p.precio_venta>0?((gan/p.precio_venta)*100).toFixed(1):'0';
                      return (
                        <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 16px', fontSize: '12px', color: 'var(--warm-gray)', fontWeight: 500 }}>{orderCode(p.id)}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600 }}>${p.precio_venta}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', color: '#C0392B' }}>${f.costo_armazon||0}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', color: '#C0392B' }}>${f.costo_laboratorio||0}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', color: '#C0392B' }}>${f.otros_costos||0}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: gan>=0?'#065F46':'#C0392B' }}>${gan.toFixed(2)}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 500, color: 'var(--sage)' }}>{margen}%</td>
                        </tr>
                      );
                    })}
                    {pedidos.filter(p => p.finanzas?.[0]).length===0 && <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--warm-gray)', fontSize: '13px' }}>Sin datos financieros aún</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {modulo === 'promociones' && (
            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>Promociones</p>
              <p style={{ fontSize: '13px', color: 'var(--warm-gray)' }}>Disponible en la siguiente fase.</p>
            </div>
          )}

          {modulo === 'marketing' && (
            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>Marketing & UTM</p>
              <p style={{ fontSize: '13px', color: 'var(--warm-gray)' }}>Disponible en la siguiente fase.</p>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes progress { 0% { width: 0%; margin-left: 0; } 50% { width: 60%; margin-left: 20%; } 100% { width: 0%; margin-left: 100%; } }
      `}</style>
    </div>
  );
}