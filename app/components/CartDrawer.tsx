// app/components/CartDrawer.tsx
'use client';
import { useState } from 'react';
import { useCart, CartItem } from '../context/CartContext';
import { useLang } from './LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FormReceta, validarReceta, recetaVacia, RecetaData } from './RecetaManual';

const TURQUESA = '#2BBFB3';

// ── Resolver de receta dentro del carrito (para pares con receta pendiente) ──
function ResolverReceta({ item }: { item: CartItem }) {
  const { t } = useLang() as any;
  const { updateItemReceta } = useCart();
  const [modo, setModo] = useState<'opciones' | 'manual' | 'foto'>('opciones');
  const [receta, setReceta] = useState<RecetaData>(recetaVacia());
  const [errores, setErrores] = useState<string[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [errorFoto, setErrorFoto] = useState('');

  const guardarManual = () => {
    const errs = validarReceta(receta, t);
    setErrores(errs);
    if (errs.length) return;
    updateItemReceta(item.id, { metodo: 'manual', datos: receta });
  };

  const subirFoto = async (file: File) => {
    setSubiendo(true); setErrorFoto('');
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload-receta', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      updateItemReceta(item.id, { metodo: 'foto', foto_url: data.path });
    } catch (e) {
      setErrorFoto(e instanceof Error ? e.message : t('No se pudo subir', 'Upload failed'));
    } finally { setSubiendo(false); }
  };

  const btn = (label: string, sub: string, onClick: () => void) => (
    <button onClick={onClick} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', border: '1px dashed #d6d0c4', background: '#faf8f4', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginBottom: '6px' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1d' }}>{label}</div>
      <div style={{ fontSize: '11px', color: '#9a9a9a' }}>{sub}</div>
    </button>
  );

  return (
    <div style={{ marginTop: '10px', padding: '12px', background: '#fffbeb', borderRadius: '10px', border: '1px solid rgba(245,197,24,0.35)' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', margin: '0 0 8px' }}>
        {t('Agrega la graduación de este par', 'Add this pair’s prescription')}
      </p>

      {modo === 'opciones' && (
        <>
          {btn(t('Escribir a mano', 'Enter manually'), 'SPH, CYL, EJE, ADD, PD', () => setModo('manual'))}
          {btn(t('Subir foto o PDF / Tomar foto', 'Upload photo or PDF / Take photo'), t('Foto, PDF o captura', 'Photo, PDF or screenshot'), () => setModo('foto'))}
          {btn(t('No tengo graduación', 'I don’t have a prescription'), t('Lentes sin aumento / solo estética', 'Non-prescription / cosmetic'), () => updateItemReceta(item.id, { metodo: 'sin_graduacion' }))}
        </>
      )}

      {modo === 'manual' && (
        <div>
          <FormReceta receta={receta} onChange={setReceta} errores={errores} t={t} />
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            <button onClick={guardarManual} style={{ flex: 1, background: TURQUESA, color: 'white', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{t('Guardar receta', 'Save prescription')}</button>
            <button onClick={() => setModo('opciones')} style={{ background: '#f5f3ef', color: '#6f6a63', border: 'none', borderRadius: '6px', padding: '10px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{t('Atrás', 'Back')}</button>
          </div>
        </div>
      )}

      {modo === 'foto' && (
        <div>
          <label style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '8px', border: '1px dashed #d6d0c4', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#1d1d1d', marginBottom: '6px', opacity: subiendo ? 0.5 : 1 }}>
            <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} disabled={subiendo} onChange={e => { const f = e.target.files?.[0]; if (f) subirFoto(f); }} />
            {t('Subir archivo (JPG, PNG, PDF)', 'Upload file (JPG, PNG, PDF)')}
          </label>
          <label style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '8px', border: '1px dashed #d6d0c4', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#1d1d1d', marginBottom: '6px', opacity: subiendo ? 0.5 : 1 }}>
            <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} disabled={subiendo} onChange={e => { const f = e.target.files?.[0]; if (f) subirFoto(f); }} />
            {t('Tomar foto ahora', 'Take photo now')}
          </label>
          {subiendo && <p style={{ fontSize: '11px', color: '#6f6a63', textAlign: 'center', margin: '4px 0' }}>{t('Subiendo…', 'Uploading…')}</p>}
          {errorFoto && <p style={{ fontSize: '11px', color: '#c0392b', textAlign: 'center', margin: '4px 0' }}>{errorFoto}</p>}
          <button onClick={() => setModo('opciones')} style={{ width: '100%', background: 'none', border: 'none', color: '#9a9a9a', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: '6px' }}>{t('Atrás', 'Back')}</button>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  const { t } = useLang() as any;
  const { removeItem, addItem } = useCart();
  const [editandoPaciente, setEditandoPaciente] = useState(false);
  const [nombreTemp, setNombreTemp] = useState(item.paciente || '');

  const guardarNombre = () => {
    if (!nombreTemp.trim()) return;
    removeItem(item.id);
    addItem({ ...item, paciente: nombreTemp.trim() });
    setEditandoPaciente(false);
  };

  return (
    <div style={{ padding: '1.25rem 0', borderBottom: '1px solid #f0ede8' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ width: '72px', height: '60px', borderRadius: '8px', background: '#f5f2ed', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {item.armazon_imagen
            ? <img src={item.armazon_imagen} alt={item.armazon_nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            : <svg width="40" height="22" viewBox="0 0 160 90" fill="none" style={{ opacity: 0.2 }}><rect x="4" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/><rect x="92" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/><path d="M68 38 C72 32, 88 32, 92 38" stroke="#1d1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Nombre / paciente */}
          {editandoPaciente ? (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <input
                autoFocus
                type="text"
                value={nombreTemp}
                onChange={e => setNombreTemp(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') guardarNombre(); if (e.key === 'Escape') setEditandoPaciente(false); }}
                placeholder={t('Nombre...', 'Name...')}
                style={{ flex: 1, padding: '4px 8px', borderRadius: '6px', border: '1.5px solid #55624c', fontSize: '12px', fontFamily: 'var(--font-sans)', outline: 'none' }}
              />
              <button onClick={guardarNombre} style={{ background: '#55624c', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>✓</button>
              <button onClick={() => setEditandoPaciente(false)} style={{ background: '#f5f3ef', color: '#6f6a63', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>✕</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              {item.paciente ? (
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#55624c' }}>{item.paciente}</span>
              ) : (
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#c0392b', background: '#fff5f5', padding: '2px 8px', borderRadius: '20px', border: '1px solid #fcc' }}>
                  ⚠ {t('Sin nombre — requerido', 'No name — required')}
                </span>
              )}
              <button onClick={() => { setNombreTemp(item.paciente || ''); setEditandoPaciente(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a9a9a', fontSize: '10px', fontFamily: 'var(--font-sans)', textDecoration: 'underline', padding: 0 }}>
                {item.paciente ? t('editar', 'edit') : t('agregar', 'add')}
              </button>
            </div>
          )}

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400, color: '#1d1d1d', marginBottom: '4px', lineHeight: 1.2 }}>{item.armazon_nombre}</div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
            {item.solo_armazon && <span style={{ fontSize: '9px', fontWeight: 600, color: '#9a9a9a', background: '#f5f3ef', padding: '2px 8px', borderRadius: '20px' }}>{t('Solo armazón', 'Frame only')}</span>}
          </div>

          {item.lentes && !item.solo_armazon && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '6px' }}>
              <div style={{ fontSize: '11px', color: '#6f6a63' }}>{item.lentes.vision_nombre}</div>
              <div style={{ fontSize: '11px', color: '#6f6a63' }}>{item.lentes.material_nombre}</div>
              {item.lentes.filtros_nombres.length > 0 && <div style={{ fontSize: '11px', color: '#6f6a63' }}>{item.lentes.filtros_nombres.join(' · ')}</div>}
            </div>
          )}

          {item.receta && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: item.receta.metodo === 'despues' ? '#d97706' : '#55624c', flexShrink: 0 }}/>
              <span style={{ fontSize: '10px', color: item.receta.metodo === 'despues' ? '#92400e' : '#55624c', fontWeight: 500 }}>
                {item.receta.metodo === 'manual' && t('Receta ingresada', 'Prescription entered')}
                {item.receta.metodo === 'foto' && t('Foto adjunta', 'Photo attached')}
                {item.receta.metodo === 'despues' && t('Receta pendiente', 'Prescription pending')}
                {item.receta.metodo === 'sin_graduacion' && t('Sin graduación', 'No prescription')}
              </span>
            </div>
          )}

          {/* Par con receta pendiente → resolver aquí mismo */}
          {!item.solo_armazon && item.receta?.metodo === 'despues' && <ResolverReceta item={item} />}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 400, color: '#1d1d1d' }}>${item.precio_total}</div>
          <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a9a9a', fontSize: '11px', fontFamily: 'var(--font-sans)', textDecoration: 'underline', padding: 0 }}>
            {t('Eliminar', 'Remove')}
          </button>
        </div>
      </div>
    </div>
  );
}

function CuponBox() {
  const { t } = useLang() as any;
  const { items, cupon, setCupon } = useCart();
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const aplicar = async () => {
    if (!codigo.trim()) return;
    setCargando(true); setError('');
    try {
      const r = await fetch('/api/cupon/validar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo, items }),
      });
      const j = await r.json();
      if (!j.ok) { setError(j.motivo || t('Código no válido', 'Invalid code')); setCupon(null); return; }
      setCupon({ codigo: j.codigo, descuento: j.descuento, etiqueta: j.etiqueta });
      setCodigo('');
    } catch {
      setError(t('No se pudo validar', 'Could not validate'));
    } finally { setCargando(false); }
  };

  if (cupon) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '0.75rem', background: '#f0f4ef', border: '1px solid #c8dbc4', borderRadius: '8px', padding: '8px 12px' }}>
        <span style={{ fontSize: '12px', color: '#3a4f33', fontWeight: 500 }}>
          ✓ {cupon.codigo} · {cupon.etiqueta}
        </span>
        <button onClick={() => setCupon(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6f6a63', fontSize: '11px', textDecoration: 'underline', fontFamily: 'var(--font-sans)', padding: 0 }}>
          {t('Quitar', 'Remove')}
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          type="text" value={codigo} onChange={e => { setCodigo(e.target.value.toUpperCase()); setError(''); }}
          onKeyDown={e => { if (e.key === 'Enter') aplicar(); }}
          placeholder={t('¿Tienes un código?', 'Have a code?')}
          style={{ flex: 1, padding: '9px 10px', borderRadius: '6px', border: '1px solid #e0dcd3', fontSize: '12px', fontFamily: 'var(--font-sans)', outline: 'none', textTransform: 'uppercase' }}
        />
        <button onClick={aplicar} disabled={cargando || !codigo.trim()} style={{ background: '#1d1d1d', color: 'white', border: 'none', borderRadius: '6px', padding: '0 16px', fontSize: '11px', fontWeight: 600, cursor: cargando ? 'default' : 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', opacity: (!codigo.trim() || cargando) ? 0.5 : 1 }}>
          {cargando ? '…' : t('Aplicar', 'Apply')}
        </button>
      </div>
      {error && <p style={{ fontSize: '11px', color: '#c0392b', margin: '5px 2px 0', fontFamily: 'var(--font-sans)' }}>{error}</p>}
    </div>
  );
}

export default function CartDrawer() {
  const { t, lang } = useLang() as any;
  const { items, removeItem, totalPrecio, totalItems, cupon, cartOpen, setCartOpen } = useCart();
  const totalFinal = Math.max(0, Math.round((totalPrecio - (cupon?.descuento || 0)) * 100) / 100);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
  const sinNombre = items.filter(i => !i.paciente?.trim());
  if (sinNombre.length > 0) {
    alert(t(
      `Por favor agrega un nombre a ${sinNombre.length === 1 ? 'tu par de lentes' : 'todos los pares'} antes de continuar.`,
      `Please add a name to ${sinNombre.length === 1 ? 'your pair of glasses' : 'all pairs'} before continuing.`
    ));
    return;
  }
  // Recordatorio: no dejar pares con la graduación pendiente
  const pendientes = items.filter(i => i.receta?.metodo === 'despues');
  if (pendientes.length > 0) {
    alert(t(
      `Te falta la graduación de ${pendientes.length === 1 ? 'un par' : `${pendientes.length} pares`}. Agrégala en el carrito (o marca "No tengo graduación") antes de pagar.`,
      `${pendientes.length === 1 ? 'One pair is' : `${pendientes.length} pairs are`} missing a prescription. Add it in the cart (or mark "I don’t have a prescription") before checkout.`
    ));
    return;
  }
  // Pago embebido: el checkout ocurre dentro de Verly (página /checkout).
  // El evento InitiateCheckout se dispara ahí, al crear la sesión de Stripe.
  setLoadingCheckout(true);
  setCartOpen(false);
  router.push('/checkout');
};

  const tienePendientes = items.some(i => i.receta?.metodo === 'despues');

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div onClick={() => setCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 300, backdropFilter: 'blur(2px)' }}/>
      )}

      {/* Drawer */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px', maxWidth: '100vw', background: 'white', zIndex: 301, boxShadow: '-2px 0 40px rgba(0,0,0,0.08)', transform: cartOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 400, margin: 0, color: '#1d1d1d' }}>
              {t('Tu carrito', 'Your cart')}
            </h3>
            {totalItems > 0 && (
              <span style={{ background: '#55624c', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: '#f5f3ef', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: '#6f6a63', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{ marginBottom: '1rem', opacity: 0.3 }}>
                <svg width="48" height="28" viewBox="0 0 160 90" fill="none"><rect x="4" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/><rect x="92" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/><path d="M68 38 C72 32, 88 32, 92 38" stroke="#1d1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, color: '#1d1d1d', marginBottom: '0.5rem' }}>
                {t('Tu carrito está vacío', 'Your cart is empty')}
              </p>
              <p style={{ fontSize: '13px', color: '#9a9a9a', marginBottom: '1.5rem' }}>
                {t('Agrega un par de lentes para comenzar.', 'Add a pair of glasses to get started.')}
              </p>
              <Link href="/Tienda" onClick={() => setCartOpen(false)} style={{ display: 'inline-block', background: '#55624c', color: 'white', padding: '12px 24px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>
                {t('Ver colección', 'Browse frames')}
              </Link>
            </div>
          ) : (
            <>
              {/* Items */}
              {items.map(item => (
                <ItemCard key={item.id} item={item} onRemove={() => removeItem(item.id)}/>
              ))}


              {/* Recetas pendientes warning */}
              {tienePendientes && (
                <div style={{ margin: '1rem 0', background: '#fffbeb', borderRadius: '8px', padding: '0.85rem 1rem', border: '1px solid rgba(245,197,24,0.3)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#92400e', margin: '0 0 2px' }}>
                    ⚠ {t('Falta la graduación', 'Prescription needed')}
                  </p>
                  <p style={{ fontSize: '11px', color: '#a16207', margin: 0, lineHeight: 1.5 }}>
                    {t('Agrégala en cada par de arriba antes de pagar, o marca "No tengo graduación".', 'Add it on each pair above before checkout, or mark "I don’t have a prescription".')}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer con total y checkout */}
        {items.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #f0ede8', background: 'white', flexShrink: 0 }}>
            {/* Desglose */}
            <div style={{ marginBottom: '1rem' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6f6a63', marginBottom: '4px' }}>
                  <span style={{ maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.paciente ? `${item.paciente} — ` : ''}{item.armazon_nombre}
                  </span>
                  <span style={{ fontWeight: 500, color: '#1d1d1d', flexShrink: 0 }}>
  {`$${item.precio_total}`}
</span>
                </div>
              ))}
            </div>

            {/* Código de descuento */}
            <CuponBox />

            {/* Descuento aplicado */}
            {cupon && cupon.descuento > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#3a4f33', marginBottom: '4px' }}>
                <span>{t('Descuento', 'Discount')} ({cupon.codigo})</span>
                <span style={{ fontWeight: 500 }}>−${cupon.descuento}</span>
              </div>
            )}

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f0ede8' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: '#1d1d1d', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 400, color: '#1d1d1d' }}>
                {cupon && cupon.descuento > 0 && <span style={{ fontSize: '1rem', color: '#9a9a9a', textDecoration: 'line-through', marginRight: '8px' }}>${totalPrecio}</span>}
                ${totalFinal} <span style={{ fontSize: '0.75rem', color: '#9a9a9a', fontFamily: 'var(--font-sans)' }}>USD</span>
              </span>
            </div>

            {/* Botón checkout */}
            <button onClick={handleCheckout} disabled={loadingCheckout} style={{ width: '100%', background: loadingCheckout ? '#9a9a9a' : '#1d1d1d', color: 'white', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '13px', fontWeight: 600, cursor: loadingCheckout ? 'not-allowed' : 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', transition: 'background 0.2s', marginBottom: '10px' }}
              onMouseEnter={e => !loadingCheckout && (e.currentTarget.style.background = '#55624c')}
              onMouseLeave={e => !loadingCheckout && (e.currentTarget.style.background = '#1d1d1d')}
            >
              {loadingCheckout ? t('Procesando...', 'Processing...') : t('Pagar con tarjeta →', 'Checkout →')}
            </button>

            <p style={{ textAlign: 'center', fontSize: '11px', color: '#9a9a9a', margin: 0 }}>
              🔒 {t('Pago seguro con Stripe', 'Secure payment with Stripe')}
            </p>
          </div>
        )}
      </div>
    </>
  );
}