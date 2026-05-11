'use client';
import { useState, useEffect, useRef } from 'react';
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
const PRECIO_ARMAZON = 43;

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
    explicacion = lang === 'es'
      ? `Con graduación alta, el Súper Hi-Index 1.74 es el material más delgado del mercado.`
      : `With a high prescription, Super Hi-Index 1.74 is the thinnest material available.`;
  } else if (sph > 3) {
    material = 'Hi-Index 1.67';
    condicion = lang === 'es' ? 'Graduación alta' : 'High prescription';
    explicacion = lang === 'es'
      ? `El Hi-Index 1.67 reduce el grosor hasta un 30%.`
      : `Hi-Index 1.67 reduces thickness up to 30%.`;
  } else if (sph > 1.5 || tieneAstigmatismo) {
    material = 'PolyPlus';
    condicion = tieneAstigmatismo ? (lang === 'es' ? 'Astigmatismo' : 'Astigmatism') : (lang === 'es' ? 'Graduación moderada' : 'Moderate prescription');
    explicacion = lang === 'es'
      ? `PolyPlus es el punto perfecto entre calidad y precio.`
      : `PolyPlus hits the sweet spot between quality and price.`;
  } else {
    material = 'CR-39';
    condicion = lang === 'es' ? 'Graduación baja' : 'Low prescription';
    explicacion = lang === 'es'
      ? `CR-39 es perfecto — económico, ligero y excelente calidad óptica.`
      : `CR-39 is perfect — affordable, light and excellent optical quality.`;
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

function VerlyAvatar({ expresion, size = 56 }: { expresion: Expresion; size?: number }) {
  const ojosAbiertos = expresion !== 'pensando';
  const sonrisa = expresion === 'feliz' || expresion === 'recomendando';
  const cejas = expresion === 'sorprendida' ? -4 : expresion === 'pensando' ? 2 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ flexShrink: 0 }}>
      <ellipse cx="40" cy="70" rx="20" ry="12" fill="white" stroke="#E2E8F0" strokeWidth="1.5"/>
      <rect x="34" y="60" width="12" height="16" rx="2" fill="white" stroke="#E2E8F0" strokeWidth="1"/>
      <path d="M34 62 L30 74" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M46 62 L50 74" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="40" cy="66" r="1.5" fill="#2BBFB3"/>
      <circle cx="40" cy="71" r="1.5" fill="#2BBFB3"/>
      <ellipse cx="40" cy="36" rx="26" ry="28" fill="white" stroke="#2BBFB3" strokeWidth="2.5"/>
      <ellipse cx="32" cy="22" rx="6" ry="3.5" fill="#E0F7F4" opacity="0.6"/>
      <path d={`M25 ${26+cejas} Q29 ${23+cejas} 33 ${26+cejas}`} stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round"/>
      <path d={`M47 ${26+cejas} Q51 ${23+cejas} 55 ${26+cejas}`} stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round"/>
      <rect x="21" y="29" width="17" height="11" rx="5" fill="white" stroke="#2BBFB3" strokeWidth="2" opacity="0.9"/>
      <rect x="42" y="29" width="17" height="11" rx="5" fill="white" stroke="#2BBFB3" strokeWidth="2" opacity="0.9"/>
      <line x1="38" y1="34.5" x2="42" y2="34.5" stroke="#2BBFB3" strokeWidth="1.5"/>
      <line x1="21" y1="34.5" x2="17" y2="32" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="59" y1="34.5" x2="63" y2="32" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      {ojosAbiertos ? (
        <>
          <ellipse cx="29.5" cy="34.5" rx="3.5" ry="3.5" fill="#1A1A2E"/>
          <ellipse cx="50.5" cy="34.5" rx="3.5" ry="3.5" fill="#1A1A2E"/>
          <circle cx="31" cy="33" r="1" fill="white"/>
          <circle cx="52" cy="33" r="1" fill="white"/>
        </>
      ) : (
        <>
          <path d="M26 34.5 Q29.5 31 33 34.5" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M47 34.5 Q50.5 31 54 34.5" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      )}
      {sonrisa
        ? <path d="M33 46 Q40 52 47 46" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
        : expresion === 'sorprendida'
        ? <ellipse cx="40" cy="47" rx="4" ry="5" fill="#1A1A2E"/>
        : <path d="M35 47 Q40 50 45 47" stroke="#1A1A2E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      }
      {(expresion === 'feliz' || expresion === 'recomendando') && (
        <>
          <ellipse cx="23" cy="43" rx="4.5" ry="2.5" fill="#FFB3C6" opacity="0.5"/>
          <ellipse cx="57" cy="43" rx="4.5" ry="2.5" fill="#FFB3C6" opacity="0.5"/>
        </>
      )}
      {expresion === 'pensando' && (
        <>
          <circle cx="36" cy="48" r="1.5" fill="#2BBFB3"/>
          <circle cx="40" cy="46" r="1.5" fill="#2BBFB3"/>
          <circle cx="44" cy="48" r="1.5" fill="#2BBFB3"/>
        </>
      )}
    </svg>
  );
}

function BurbujaPaquete({ paquete, onAceptar, lang }: { paquete: Paquete; onAceptar: () => void; lang: 'es' | 'en' }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #E0F7F4, #F0FBF8)', border: '2px solid #2BBFB3', borderRadius: '12px', padding: '1rem', marginTop: '8px' }}>
      <div style={{ fontSize: '11px', fontWeight: 800, color: '#2BBFB3', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{paquete.nombre}</div>
      <div style={{ fontSize: '12px', color: '#1A5C58', marginBottom: '10px', lineHeight: 1.6 }}>{paquete.explicacion}</div>
      <div style={{ background: 'white', borderRadius: '8px', padding: '0.75rem', marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: '1px solid #F0F0F0' }}>
          <span style={{ color: '#5A6478' }}>{lang === 'es' ? 'Armazón' : 'Frame'}</span>
          <span style={{ fontWeight: 600 }}>${PRECIO_ARMAZON}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: '1px solid #F0F0F0' }}>
          <span style={{ color: '#5A6478' }}>{paquete.material}</span>
          <span style={{ fontWeight: 600 }}>{paquete.precioMaterial === 0 ? (lang === 'es' ? 'Incluido' : 'Included') : `+$${paquete.precioMaterial}`}</span>
        </div>
        {paquete.filtros.map((f, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: i < paquete.filtros.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
            <span style={{ color: '#5A6478' }}>{f.nombre}</span>
            <span style={{ fontWeight: 600 }}>+${f.precio}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7A8494', textDecoration: 'line-through' }}>${paquete.precioOriginal} USD</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#2BBFB3' }}>${paquete.precioFinal} USD</div>
        </div>
        <div style={{ background: '#F5C518', color: '#1A1A2E', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 }}>-{paquete.descuento}% OFF</div>
      </div>
      <button onClick={onAceptar} style={{ width: '100%', background: '#1A1A2E', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif' }}>
        {lang === 'es' ? 'Quiero este paquete →' : 'I want this package →'}
      </button>
    </div>
  );
}

export default function VerlyBot() {
  const { lang } = useLang() as { lang: 'es' | 'en'; t: (es: string, en: string) => string };
  const [abierto, setAbierto] = useState(false);
  const [expresion, setExpresion] = useState<Expresion>('neutral');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const [opciones, setOpciones] = useState<string[]>([]);
  const [burbujaVisible, setBurbujaVisible] = useState(false);
  const [sesion, setSesion] = useState<SesionPx>({
    nombre: '', receta: null, estiloVida: {}, paqueteRecomendado: null,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── DRAG ──────────────────────────────────────────────────────────────────
  const [pos, setPos] = useState({ x: 28, y: 28 });
  const dragRef = useRef<{ dragging: boolean; startX: number; startY: number; startPosX: number; startPosY: number }>({
    dragging: false, startX: 0, startY: 0, startPosX: 28, startPosY: 28,
  });
  const hasDragged = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, startPosX: pos.x, startPosY: pos.y };
    hasDragged.current = false;
    e.preventDefault();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    dragRef.current = { dragging: true, startX: t.clientX, startY: t.clientY, startPosX: pos.x, startPosY: pos.y };
    hasDragged.current = false;
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current.dragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const dx = clientX - dragRef.current.startX;
      const dy = clientY - dragRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;
      const newX = Math.max(8, Math.min(window.innerWidth - 88, dragRef.current.startPosX - dx));
      const newY = Math.max(8, Math.min(window.innerHeight - 88, dragRef.current.startPosY - dy));
      setPos({ x: newX, y: newY });
    };
    const onUp = () => { dragRef.current.dragging = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  // ── BURBUJA BIENVENIDA ─────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setBurbujaVisible(true), 1500);
    const hide = setTimeout(() => setBurbujaVisible(false), 6000);
    return () => { clearTimeout(timer); clearTimeout(hide); };
  }, []);

  const cargarSesion = (): SesionPx => {
    if (typeof window === 'undefined') return { nombre: '', receta: null, estiloVida: {}, paqueteRecomendado: null };
    return JSON.parse(sessionStorage.getItem('verly_sesion') || '{}');
  };

  const guardarSesion = (s: SesionPx) => {
    if (typeof window !== 'undefined') sessionStorage.setItem('verly_sesion', JSON.stringify(s));
  };

  const cambiarExpresion = (e: Expresion, ms = 2500) => {
    setExpresion(e);
    setTimeout(() => setExpresion('neutral'), ms);
  };

  const agregarMensaje = (de: 'verly' | 'px', texto: string, paquete?: Paquete) => {
    setMensajes(prev => [...prev, { de, texto, paquete }]);
  };

  // ── ESCUCHAR RECETA DESDE DRAWER ──────────────────────────────────────────
  useEffect(() => {
    const onRecetaActualizada = () => {
      const s = cargarSesion();
      if (s.receta) {
        setSesion(s);
        const paquete = armarPaquete(s.receta, s.estiloVida || {}, lang);
        cambiarExpresion('recomendando', 4000);
        agregarMensaje('verly',
          lang === 'es'
            ? '¡Leí tu receta! Te armé un paquete personalizado con 10% de descuento:'
            : 'I read your prescription! I put together a personalized package with 10% off:',
          paquete
        );
        const nuevaSesion = { ...s, paqueteRecomendado: paquete };
        setSesion(nuevaSesion);
        guardarSesion(nuevaSesion);
        if (!abierto) setAbierto(true);
      }
    };
    window.addEventListener('verly_receta_actualizada', onRecetaActualizada);
    return () => window.removeEventListener('verly_receta_actualizada', onRecetaActualizada);
  }, [lang, abierto]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  useEffect(() => {
    if (abierto && mensajes.length === 0) {
      setTimeout(() => iniciarConversacion(), 400);
    }
  }, [abierto]);

  const iniciarConversacion = () => {
    const s = cargarSesion();
    setSesion(s);
    const nombre = s.nombre || '';
    agregarMensaje('verly',
      lang === 'es'
        ? (nombre ? `¡Hola de nuevo, ${nombre}! ¿En qué te puedo ayudar?` : '¡Hola! Soy Verly 👋 Tu asistente virtual de Verly Optical. ¿En qué te puedo ayudar hoy?')
        : (nombre ? `Welcome back, ${nombre}! How can I help you?` : "Hi! I'm Verly 👋 Your virtual assistant at Verly Optical. How can I help you today?")
    );
    cambiarExpresion('feliz', 3000);
  };

  // ── IA: PROCESAR RESPUESTA ─────────────────────────────────────────────────
  const procesarRespuesta = async (texto: string) => {
    agregarMensaje('px', texto);
    setOpciones([]);
    cambiarExpresion('pensando', 2000);

    const historial = [...mensajes, { de: 'px' as const, texto }].map(m => ({
      role: m.de === 'verly' ? 'assistant' : 'user',
      content: m.texto,
    }));

    const s = cargarSesion();
    if (s.nombre !== sesion.nombre && texto.length < 30 && mensajes.length <= 2) {
      const nuevaSesion = { ...s, nombre: texto.trim().split(' ')[0] };
      setSesion(nuevaSesion);
      guardarSesion(nuevaSesion);
    }

    const contexto = `Page: ${window.location.pathname}. ${s.nombre ? `Customer: ${s.nombre}.` : ''} ${s.receta ? 'Has prescription saved.' : 'No prescription yet.'}`;

    try {
      const res = await fetch('/api/verly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historial, lang, contexto }),
      });
      const data = await res.json();
      agregarMensaje('verly', data.texto);
      cambiarExpresion('feliz', 2000);
    } catch {
      agregarMensaje('verly', lang === 'es' ? 'Lo siento, hubo un error.' : 'Sorry, there was an error.');
    }
  };

  const manejarEnvio = () => {
    if (!input.trim()) return;
    procesarRespuesta(input.trim());
    setInput('');
  };

  const handleClick = () => {
    if (hasDragged.current) return;
    setBurbujaVisible(false);
    setAbierto(!abierto);
  };

  return (
    <>
      {/* BURBUJA BIENVENIDA */}
      {burbujaVisible && !abierto && (
        <div style={{
          position: 'fixed', bottom: `${pos.y + 82}px`, right: `${pos.x}px`, zIndex: 998,
          background: 'white', borderRadius: '16px 16px 4px 16px',
          padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1.5px solid #E0F7F4', maxWidth: '220px',
          animation: 'verlySlideUp 0.4s ease-out',
          fontFamily: 'var(--font-jakarta), sans-serif',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>
            {lang === 'es' ? '¡Hola! Soy Verly 👋' : "Hi! I'm Verly 👋"}
          </div>
          <div style={{ fontSize: '12px', color: '#5A6478', lineHeight: 1.5 }}>
            {lang === 'es'
              ? 'Tu asistente virtual. ¿Te ayudo a encontrar los lentes perfectos?'
              : 'Your virtual assistant. Can I help you find the perfect glasses?'}
          </div>
          <button onClick={() => setBurbujaVisible(false)} style={{ position: 'absolute', top: '6px', right: '8px', background: 'none', border: 'none', fontSize: '14px', color: '#AAB4C0', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* BOTÓN FLOTANTE */}
      <div onMouseDown={onMouseDown} onTouchStart={onTouchStart} onClick={handleClick} style={{
        position: 'fixed', bottom: `${pos.y}px`, right: `${pos.x}px`, zIndex: 999,
        cursor: 'grab',
        animation: !abierto ? 'verlyFloat 3s ease-in-out infinite' : 'none',
        filter: 'drop-shadow(0 8px 28px rgba(43,191,179,0.45))',
        userSelect: 'none',
      }}>
        <VerlyAvatar expresion={abierto ? 'feliz' : expresion} size={72}/>
        {!abierto && (
          <div style={{
            position: 'absolute', top: '-2px', right: '-2px',
            background: '#F5C518', borderRadius: '50%', width: '20px', height: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 800, color: '#1A1A2E', border: '2px solid white',
          }}>!</div>
        )}
      </div>

      {/* VENTANA DE CHAT */}
      {abierto && (
        <div style={{
          position: 'fixed', bottom: `${pos.y + 88}px`, right: `${pos.x}px`, zIndex: 998,
          width: '380px', maxWidth: 'calc(100vw - 56px)',
          background: 'white', borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', maxHeight: '560px',
          animation: 'verlySlideUp 0.3s ease-out',
          fontFamily: 'var(--font-jakarta), sans-serif',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #2BBFB3, #1a9990)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <VerlyAvatar expresion={expresion} size={48}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>Verly</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
                {lang === 'es' ? 'Tu asistente virtual' : 'Your virtual assistant'}
              </div>
            </div>
            <button onClick={() => setAbierto(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>×</button>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mensajes.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.de === 'verly' ? 'row' : 'row-reverse', gap: '8px', alignItems: 'flex-start' }}>
                {m.de === 'verly' && <VerlyAvatar expresion="neutral" size={30}/>}
                <div style={{ maxWidth: '82%' }}>
                  <div style={{
                    background: m.de === 'verly' ? '#F0FBF8' : '#1A1A2E',
                    color: m.de === 'verly' ? '#1A1A2E' : 'white',
                    padding: '10px 14px',
                    borderRadius: m.de === 'verly' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                    fontSize: '13px', lineHeight: 1.6,
                  }}>
                    {m.texto}
                  </div>
                  {m.paquete && (
                    <BurbujaPaquete paquete={m.paquete} lang={lang} onAceptar={() => {
                      cambiarExpresion('feliz', 2500);
                      agregarMensaje('verly', lang === 'es'
                        ? `¡Excelente! Selecciona ${m.paquete!.material} en el drawer y agrega los filtros recomendados.`
                        : `Excellent! Select ${m.paquete!.material} in the drawer and add the recommended filters.`);
                    }}/>
                  )}
                </div>
              </div>
            ))}
            {opciones.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {opciones.map((op, i) => (
                  <button key={i} onClick={() => procesarRespuesta(op)} style={{
                    background: 'white', border: '1.5px solid #2BBFB3', borderRadius: '20px',
                    padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: '#2BBFB3',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#E0F7F4'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
                  >{op}</button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #EAECF0', display: 'flex', gap: '8px', flexShrink: 0 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && manejarEnvio()}
              placeholder={lang === 'es' ? 'Escribe aquí...' : 'Type here...'}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1.5px solid #EAECF0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
            />
            <button onClick={manejarEnvio} style={{
              background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '50%',
              width: '40px', height: '40px', cursor: 'pointer', fontSize: '18px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>→</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes verlyFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes verlySlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}