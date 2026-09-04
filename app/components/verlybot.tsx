// app/components/verlybot.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLang } from './LanguageContext';

type Expresion = 'neutral' | 'feliz' | 'pensando' | 'recomendando' | 'sorprendida';
type Mensaje = { de: 'verly' | 'px'; texto: string; paquete?: Paquete };

interface Paquete {
  nombre: string; material: string; precioMaterial: number;
  filtros: { nombre: string; precio: number }[];
  precioOriginal: number; precioFinal: number; descuento: number;
  condicion: string; explicacion: string;
}

interface Receta {
  sph_od: number; cyl_od: number; axis_od: number; add_od: number;
  sph_oi: number; cyl_oi: number; axis_oi: number; add_oi: number;
}

interface SesionPx {
  nombre: string; receta: Receta | null;
  estiloVida: Record<string, boolean>;
  paqueteRecomendado: Paquete | null;
}

const PRECIOS_MATERIAL: Record<string, number> = {
  'CR-39': 0, 'PolyPlus': 29, 'HD Vision': 39, 'Hi-Index 1.67': 59, 'Súper Hi-Index 1.74': 89,
};
const PRECIOS_FILTRO: Record<string, number> = {
  'AR Normal': 9, 'Blue Light': 17, 'Fotocromático': 39, 'Antiempañante': 15,
  'AR Premium': 39, 'Polarizado': 89, 'Tinte estético': 28,
};
const PRECIO_ARMAZON = 13;

function armarPaquete(receta: Receta, estiloVida: Record<string, boolean>, lang: 'es' | 'en'): Paquete {
  const sph = Math.max(Math.abs(receta.sph_od), Math.abs(receta.sph_oi));
  const cyl = Math.max(Math.abs(receta.cyl_od), Math.abs(receta.cyl_oi));
  const add = Math.max(receta.add_od, receta.add_oi);
  const tieneAstigmatismo = cyl >= 0.75;
  const tienePresbicia = add > 0;

  let material = 'CR-39';
  let condicion = '';
  let explicacion = '';

  if (sph > 5) {
    material = 'Súper Hi-Index 1.74';
    condicion = lang === 'es' ? 'Graduación muy alta' : 'Very high prescription';
    explicacion = lang === 'es' ? 'Con graduación alta, el Súper Hi-Index 1.74 es el material más delgado del mercado.' : 'With a high prescription, Super Hi-Index 1.74 is the thinnest material available.';
  } else if (sph > 3) {
    material = 'Hi-Index 1.67';
    condicion = lang === 'es' ? 'Graduación alta' : 'High prescription';
    explicacion = lang === 'es' ? 'El Hi-Index 1.67 reduce el grosor hasta un 30%.' : 'Hi-Index 1.67 reduces thickness up to 30%.';
  } else if (sph > 1.5 || tieneAstigmatismo) {
    material = 'PolyPlus';
    condicion = tieneAstigmatismo ? (lang === 'es' ? 'Astigmatismo' : 'Astigmatism') : (lang === 'es' ? 'Graduación moderada' : 'Moderate prescription');
    explicacion = lang === 'es' ? 'PolyPlus es el punto perfecto entre calidad y precio.' : 'PolyPlus hits the sweet spot between quality and price.';
  } else {
    material = 'CR-39';
    condicion = lang === 'es' ? 'Graduación baja' : 'Low prescription';
    explicacion = lang === 'es' ? 'CR-39 es perfecto — económico, ligero y excelente calidad óptica.' : 'CR-39 is perfect — affordable, light and excellent optical quality.';
  }

  const filtrosRec: { nombre: string; precio: number }[] = [];
  if (tieneAstigmatismo) filtrosRec.push({ nombre: 'AR Premium', precio: PRECIOS_FILTRO['AR Premium'] });
  else filtrosRec.push({ nombre: 'AR Normal', precio: PRECIOS_FILTRO['AR Normal'] });
  if (estiloVida.computadora) filtrosRec.push({ nombre: 'Blue Light', precio: PRECIOS_FILTRO['Blue Light'] });
  if (estiloVida.manejo && !filtrosRec.find(f => f.nombre === 'AR Premium')) filtrosRec.push({ nombre: 'AR Premium', precio: PRECIOS_FILTRO['AR Premium'] });
  if (estiloVida.sol) filtrosRec.push({ nombre: 'Fotocromático', precio: PRECIOS_FILTRO['Fotocromático'] });
  if (estiloVida.exterior && !estiloVida.sol) filtrosRec.push({ nombre: 'Polarizado', precio: PRECIOS_FILTRO['Polarizado'] });
  if (tienePresbicia) filtrosRec.push({ nombre: 'Antiempañante', precio: PRECIOS_FILTRO['Antiempañante'] });

  const precioMaterial = PRECIOS_MATERIAL[material];
  const precioFiltrosTot = filtrosRec.reduce((a, f) => a + f.precio, 0);
  const precioOriginal = PRECIO_ARMAZON + precioMaterial + precioFiltrosTot;
  const descuento = Math.round(precioOriginal * 0.10);
  const precioFinal = precioOriginal - descuento;

  return { nombre: lang === 'es' ? `Paquete ${condicion}` : `${condicion} Package`, material, precioMaterial, filtros: filtrosRec, precioOriginal, precioFinal, descuento, condicion, explicacion };
}

function VerlyAvatar({ expresion, size = 48 }: { expresion: Expresion; size?: number }) {
  const ojosAbiertos = expresion !== 'pensando';
  const sonrisa = expresion === 'feliz' || expresion === 'recomendando';
  const cejas = expresion === 'sorprendida' ? -4 : expresion === 'pensando' ? 2 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ flexShrink: 0 }}>
      <ellipse cx="40" cy="40" rx="34" ry="36" fill="var(--cream)" stroke="var(--border)" strokeWidth="2"/>
      <ellipse cx="30" cy="24" rx="7" ry="4" fill="white" opacity="0.4"/>
      <path d={`M22 ${30+cejas} Q27 ${27+cejas} 32 ${30+cejas}`} stroke="var(--charcoal)" strokeWidth="2" strokeLinecap="round"/>
      <path d={`M48 ${30+cejas} Q53 ${27+cejas} 58 ${30+cejas}`} stroke="var(--charcoal)" strokeWidth="2" strokeLinecap="round"/>
      <rect x="18" y="33" width="20" height="13" rx="5" fill="white" stroke="var(--charcoal)" strokeWidth="2" opacity="0.95"/>
      <rect x="42" y="33" width="20" height="13" rx="5" fill="white" stroke="var(--charcoal)" strokeWidth="2" opacity="0.95"/>
      <path d="M38 39 C39 36, 41 36, 42 39" stroke="var(--charcoal)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="18" y1="39" x2="12" y2="36" stroke="var(--charcoal)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="62" y1="39" x2="68" y2="36" stroke="var(--charcoal)" strokeWidth="1.5" strokeLinecap="round"/>
      {ojosAbiertos ? (
        <>
          <ellipse cx="28" cy="39" rx="3.5" ry="3.5" fill="var(--charcoal)"/>
          <ellipse cx="52" cy="39" rx="3.5" ry="3.5" fill="var(--charcoal)"/>
          <circle cx="29.5" cy="37.5" r="1" fill="white"/>
          <circle cx="53.5" cy="37.5" r="1" fill="white"/>
        </>
      ) : (
        <>
          <path d="M24 39 Q28 35.5 32 39" stroke="var(--charcoal)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M48 39 Q52 35.5 56 39" stroke="var(--charcoal)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      )}
      {sonrisa
        ? <path d="M32 54 Q40 60 48 54" stroke="var(--charcoal)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        : expresion === 'sorprendida'
        ? <ellipse cx="40" cy="55" rx="4" ry="5" fill="var(--charcoal)"/>
        : expresion === 'pensando'
        ? <>
            <circle cx="34" cy="55" r="1.5" fill="var(--sage)"/>
            <circle cx="40" cy="53" r="1.5" fill="var(--sage)"/>
            <circle cx="46" cy="55" r="1.5" fill="var(--sage)"/>
          </>
        : <path d="M34 55 Q40 58 46 55" stroke="var(--charcoal)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      }
      {sonrisa && (
        <>
          <ellipse cx="20" cy="50" rx="5" ry="3" fill="var(--sage-light)" opacity="0.2"/>
          <ellipse cx="60" cy="50" rx="5" ry="3" fill="var(--sage-light)" opacity="0.2"/>
        </>
      )}
    </svg>
  );
}

function BurbujaPaquete({ paquete, onAceptar, lang }: { paquete: Paquete; onAceptar: () => void; lang: 'es' | 'en' }) {
  return (
    <div style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', marginTop: '8px' }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '8px' }}>{paquete.nombre}</div>
      <div style={{ fontSize: '12px', color: 'var(--charcoal)', marginBottom: '10px', lineHeight: 1.6 }}>{paquete.explicacion}</div>
      <div style={{ background: 'white', borderRadius: '6px', padding: '0.75rem', marginBottom: '10px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: '1px solid var(--cream-dark)' }}>
          <span style={{ color: 'var(--warm-gray)' }}>{lang === 'es' ? 'Armazón' : 'Frame'}</span>
          <span style={{ fontWeight: 500 }}>${PRECIO_ARMAZON}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: '1px solid var(--cream-dark)' }}>
          <span style={{ color: 'var(--warm-gray)' }}>{paquete.material}</span>
          <span style={{ fontWeight: 500 }}>{paquete.precioMaterial === 0 ? (lang === 'es' ? 'Incluido' : 'Included') : `+$${paquete.precioMaterial}`}</span>
        </div>
        {paquete.filtros.map((f, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: i < paquete.filtros.length - 1 ? '1px solid var(--cream-dark)' : 'none' }}>
            <span style={{ color: 'var(--warm-gray)' }}>{f.nombre}</span>
            <span style={{ fontWeight: 500 }}>+${f.precio}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--warm-gray)', textDecoration: 'line-through' }}>${paquete.precioOriginal} USD</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--sage)' }}>${paquete.precioFinal} USD</div>
        </div>
        <div style={{ background: 'var(--sage)', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 500 }}>-{paquete.descuento}% OFF</div>
      </div>
      <button onClick={onAceptar} style={{ width: '100%', background: 'var(--charcoal)', color: 'white', border: 'none', borderRadius: '4px', padding: '10px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
        {lang === 'es' ? 'Quiero este paquete →' : 'I want this package →'}
      </button>
    </div>
  );
}

export default function VerlyBot() {
  const { lang } = useLang() as { lang: 'es' | 'en'; t: (es: string, en: string) => string };
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [visible, setVisible] = useState(true);
  const [expresion, setExpresion] = useState<Expresion>('neutral');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const [sesion, setSesion] = useState<SesionPx>({ nombre: '', receta: null, estiloVida: {}, paqueteRecomendado: null });
  const [esMobil, setEsMobil] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevPathname = useRef(pathname);

  // Detectar móvil
  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── DRAG (solo desktop) ───────────────────────────────────────────────────
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, startPosX: 24, startPosY: 24 });
  const hasDragged = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    if (esMobil) return;
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, startPosX: pos.x, startPosY: pos.y };
    hasDragged.current = false;
    e.preventDefault();
  };

  useEffect(() => {
    if (esMobil) return;
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.dragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;
      // right/bottom based positioning
      const newRight = Math.max(8, Math.min(window.innerWidth - 72, dragRef.current.startPosX - dx));
      const newBottom = Math.max(8, Math.min(window.innerHeight - 72, dragRef.current.startPosY - dy));
      setPos({ x: newRight, y: newBottom });
    };
    const onUp = () => { dragRef.current.dragging = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [esMobil]);

  // ── RESET AL CAMBIAR DE PÁGINA ────────────────────────────────────────────
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      setVisible(true);
      setAbierto(false);
      setMensajes([]);
    }
  }, [pathname]);

  // ── ESCUCHAR RECETA DESDE DRAWER ──────────────────────────────────────────
  useEffect(() => {
    const onRecetaActualizada = () => {
      const s = JSON.parse(sessionStorage.getItem('verly_sesion') || '{}');
      if (s.receta) {
        setSesion(s);
        const paquete = armarPaquete(s.receta, s.estiloVida || {}, lang);
        setExpresion('recomendando');
        setTimeout(() => setExpresion('neutral'), 4000);
        agregarMensaje('verly',
          lang === 'es'
            ? '¡Leí tu receta! Te armé un paquete personalizado con 10% de descuento:'
            : 'I read your prescription! Here is a personalized package with 10% off:',
          paquete
        );
        const nuevaSesion = { ...s, paqueteRecomendado: paquete };
        setSesion(nuevaSesion);
        sessionStorage.setItem('verly_sesion', JSON.stringify(nuevaSesion));
        setVisible(true);
        setAbierto(true);
      }
    };
    window.addEventListener('verly_receta_actualizada', onRecetaActualizada);
    return () => window.removeEventListener('verly_receta_actualizada', onRecetaActualizada);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  useEffect(() => {
    if (abierto && mensajes.length === 0) {
      setTimeout(() => iniciarConversacion(), 300);
    }
  }, [abierto]);

  const agregarMensaje = (de: 'verly' | 'px', texto: string, paquete?: Paquete) => {
    setMensajes(prev => [...prev, { de, texto, paquete }]);
  };

  const iniciarConversacion = () => {
    const s = JSON.parse(sessionStorage.getItem('verly_sesion') || '{}');
    setSesion(s);
    const nombre = s.nombre || '';
    agregarMensaje('verly',
      lang === 'es'
        ? (nombre ? `¡Hola de nuevo, ${nombre}! ¿En qué te puedo ayudar?` : '¡Hola! Soy Verly 👋 ¿En qué te puedo ayudar hoy?')
        : (nombre ? `Welcome back, ${nombre}! How can I help you?` : "Hi! I'm Verly 👋 How can I help you today?")
    );
    setExpresion('feliz');
    setTimeout(() => setExpresion('neutral'), 3000);
  };

  const procesarRespuesta = async (texto: string) => {
    agregarMensaje('px', texto);
    setExpresion('pensando');
    const historial = [...mensajes, { de: 'px' as const, texto }].map(m => ({
      role: m.de === 'verly' ? 'assistant' : 'user',
      content: m.texto,
    }));
    const s = JSON.parse(sessionStorage.getItem('verly_sesion') || '{}');
    const contexto = `Page: ${window.location.pathname}. ${s.nombre ? `Customer: ${s.nombre}.` : ''} ${s.receta ? 'Has prescription saved.' : 'No prescription yet.'}`;
    try {
      const res = await fetch('/api/verly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historial, lang, contexto }),
      });
      const data = await res.json();
      agregarMensaje('verly', data.texto);
      setExpresion('feliz');
      setTimeout(() => setExpresion('neutral'), 2000);
    } catch {
      agregarMensaje('verly', lang === 'es' ? 'Lo siento, hubo un error.' : 'Sorry, there was an error.');
      setExpresion('neutral');
    }
  };

  const manejarEnvio = () => {
    if (!input.trim()) return;
    procesarRespuesta(input.trim());
    setInput('');
  };

  const handleClick = () => {
    if (hasDragged.current) return;
    setAbierto(!abierto);
  };

  const cerrar = () => {
    setVisible(false);
    setAbierto(false);
  };

  if (!visible) return null;

  // Posición del botón: fijo abajo derecha en móvil, arrastrable en desktop
  const bottonStyle: React.CSSProperties = esMobil
    ? { position: 'fixed', bottom: '90px', right: '16px', zIndex: 999 }
    : { position: 'fixed', bottom: `${pos.y}px`, right: `${pos.x}px`, zIndex: 999 };

  const chatStyle: React.CSSProperties = esMobil
    ? { position: 'fixed', bottom: '0', left: '0', right: '0', zIndex: 998, width: '100%', maxWidth: '100%', borderRadius: '16px 16px 0 0', maxHeight: '75vh' }
    : { position: 'fixed', bottom: `${pos.y + 76}px`, right: `${pos.x}px`, zIndex: 998, width: '360px', maxWidth: 'calc(100vw - 48px)', borderRadius: '12px' };

  return (
    <>
      {/* VENTANA DE CHAT */}
      {abierto && (
        <div style={{
          ...chatStyle,
          background: 'white',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.12)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'verlySlideUp 0.25s ease-out',
          fontFamily: 'var(--font-sans), sans-serif',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ background: 'var(--charcoal)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <VerlyAvatar expresion={expresion} size={40}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 300, color: 'white' }}>Verly</div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
                {lang === 'es' ? 'Asistente virtual' : 'Virtual assistant'}
              </div>
            </div>
            <button onClick={() => setAbierto(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>−</button>
            <button onClick={cerrar} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--cream)', maxHeight: esMobil ? 'calc(75vh - 130px)' : '340px' }}>
            {mensajes.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.de === 'verly' ? 'row' : 'row-reverse', gap: '8px', alignItems: 'flex-start' }}>
                {m.de === 'verly' && <VerlyAvatar expresion="neutral" size={28}/>}
                <div style={{ maxWidth: '82%' }}>
                  <div style={{ background: m.de === 'verly' ? 'white' : 'var(--charcoal)', color: m.de === 'verly' ? 'var(--charcoal)' : 'white', padding: '9px 13px', borderRadius: m.de === 'verly' ? '3px 10px 10px 10px' : '10px 3px 10px 10px', fontSize: '13px', lineHeight: 1.6, border: m.de === 'verly' ? '1px solid var(--border)' : 'none', fontFamily: 'var(--font-sans)' }}>
                    {m.texto}
                  </div>
                  {m.paquete && (
                    <BurbujaPaquete paquete={m.paquete} lang={lang} onAceptar={() => {
                      setExpresion('feliz');
                      setTimeout(() => setExpresion('neutral'), 2500);
                      agregarMensaje('verly', lang === 'es'
                        ? `¡Excelente elección! Selecciona ${m.paquete!.material} en el configurador.`
                        : `Great choice! Select ${m.paquete!.material} in the configurator.`);
                    }}/>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', flexShrink: 0, background: 'white' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && manejarEnvio()}
              placeholder={lang === 'es' ? 'Escribe aquí...' : 'Type here...'}
              style={{ flex: 1, padding: '9px 13px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '13px', fontFamily: 'var(--font-sans)', outline: 'none', background: 'var(--cream)', color: 'var(--charcoal)' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--sage)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
            <button onClick={manejarEnvio} style={{ background: 'var(--sage)', color: 'white', border: 'none', borderRadius: '4px', width: '38px', height: '38px', cursor: 'pointer', fontSize: '16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--charcoal)')} onMouseLeave={e => (e.currentTarget.style.background = 'var(--sage)')}>→</button>
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE */}
      <div style={bottonStyle}>
        {/* Botón × para cerrar — siempre visible en móvil, visible en desktop al hover */}
        {!abierto && (
          <button
            onClick={e => { e.stopPropagation(); cerrar(); }}
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'var(--charcoal)',
              border: '2px solid white',
              color: 'white',
              fontSize: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              lineHeight: 1,
              fontWeight: 700,
            }}
          >×</button>
        )}

        <div
          onMouseDown={onMouseDown}
          onClick={handleClick}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'white',
            border: '2px solid var(--border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: esMobil ? 'pointer' : 'grab',
            userSelect: 'none',
            transition: 'box-shadow 0.2s, transform 0.2s',
            animation: !abierto ? 'verlyFloat 3s ease-in-out infinite' : 'none',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.18)'; (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
        >
          <VerlyAvatar expresion={abierto ? 'feliz' : expresion} size={40}/>
        </div>

        {/* Dot verde */}
        {!abierto && (
          <div style={{ position: 'absolute', top: '2px', left: '2px', width: '11px', height: '11px', borderRadius: '50%', background: 'var(--sage)', border: '2px solid white', pointerEvents: 'none' }}/>
        )}
      </div>

      <style>{`
        @keyframes verlyFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes verlySlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}