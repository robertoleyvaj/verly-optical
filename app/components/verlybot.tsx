'use client';
import { useState, useEffect, useRef } from 'react';
import { useLang } from './LanguageContext';

// ─── TIPOS ───────────────────────────────────────────────────────────────────
type Expresion = 'neutral' | 'feliz' | 'pensando' | 'recomendando' | 'sorprendida';
type TipoCara = 'ovalada' | 'cuadrada' | 'corazon' | 'redonda' | '';
type Mensaje = { de: 'verly' | 'px'; texto: string; paquete?: Paquete };

interface Receta {
  sph_od: number; cyl_od: number; axis_od: number; add_od: number;
  sph_oi: number; cyl_oi: number; axis_oi: number; add_oi: number;
}

interface Paquete {
  nombre: string;
  material: string; precioMaterial: number;
  filtros: { nombre: string; precio: number }[];
  precioOriginal: number;
  precioFinal: number;
  descuento: number;
  condicion: string;
  explicacion: string;
}

interface SesionPx {
  nombre: string;
  tipoCara: TipoCara;
  receta: Receta | null;
  primeraVez: boolean | null;
  estiloVida: Record<string, boolean>;
  armazonId: string;
  paqueteRecomendado: Paquete | null;
}

// ─── PRECIOS ─────────────────────────────────────────────────────────────────
const PRECIOS_MATERIAL: Record<string, number> = {
  'CR-39': 0, 'PolyPlus': 29, 'HD Vision': 39, 'Hi-Index 1.67': 59, 'Súper Hi-Index 1.74': 89,
};
const PRECIOS_FILTRO: Record<string, number> = {
  'AR Normal': 9, 'Blue Light': 17, 'Fotocromático': 39, 'Antiempañante': 15,
  'AR Premium': 39, 'Polarizado': 89, 'Tinte estético': 28,
};
const PRECIO_ARMAZON = 43;

// ─── LÓGICA DE PAQUETE INTELIGENTE ───────────────────────────────────────────
function armarPaquete(receta: Receta, estiloVida: Record<string, boolean>, lang: 'es' | 'en'): Paquete {
  const sph = Math.max(Math.abs(receta.sph_od), Math.abs(receta.sph_oi));
  const cyl = Math.max(Math.abs(receta.cyl_od), Math.abs(receta.cyl_oi));
  const add = Math.max(receta.add_od, receta.add_oi);
  const tieneAstigmatismo = cyl >= 0.75;
  const tienePresbicia = add > 0;
  const miopiaAlta = sph > 5;
  const miopiaMedia = sph > 3;

  let material = 'CR-39';
  let condicion = '';
  let explicacion = '';

  // Material por graduación
  if (miopiaAlta) {
    material = 'Súper Hi-Index 1.74';
    condicion = lang === 'es' ? 'Miopía/Hipermetropía alta' : 'High Myopia/Hyperopia';
    explicacion = lang === 'es'
      ? `Con una graduación tan alta (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}), los lentes convencionales quedarían muy gruesos. El Súper Hi-Index 1.74 es el material más delgado del mercado — tus lentes se verán elegantes y ligeros, no como "fondos de botella".`
      : `With such a high prescription (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}), regular lenses would be very thick. Super Hi-Index 1.74 is the thinnest material available — your lenses will look elegant and light.`;
  } else if (miopiaMedia) {
    material = 'Hi-Index 1.67';
    condicion = lang === 'es' ? 'Miopía/Hipermetropía media-alta' : 'Medium-High Myopia/Hyperopia';
    explicacion = lang === 'es'
      ? `Tu graduación (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}) requiere un material más delgado que el básico. El Hi-Index 1.67 reducirá el grosor de tus lentes un 30% — más cómodos y estéticos.`
      : `Your prescription (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}) needs a thinner material. Hi-Index 1.67 will reduce lens thickness by 30% — more comfortable and attractive.`;
  } else if (sph > 1.5 || tieneAstigmatismo) {
    material = 'PolyPlus';
    condicion = tieneAstigmatismo
      ? (lang === 'es' ? 'Astigmatismo' : 'Astigmatism')
      : (lang === 'es' ? 'Miopía leve' : 'Mild Myopia');
    explicacion = tieneAstigmatismo
      ? (lang === 'es'
        ? `Tienes astigmatismo (CYL ${receta.cyl_od > 0 ? '+' : ''}${receta.cyl_od}). Esto significa que tu córnea tiene una curvatura irregular, lo que causa que la luz se refracte de forma desigual — por eso ves borroso y te encandila mucho la noche. El PolyPlus es más resistente y mantiene mejor la corrección cilíndrica.`
        : `You have astigmatism (CYL ${receta.cyl_od > 0 ? '+' : ''}${receta.cyl_od}). Your cornea has an irregular curvature, causing light to refract unevenly — that's why you see blurry and get easily blinded at night. PolyPlus is more resistant and maintains cylindrical correction better.`)
      : (lang === 'es'
        ? `Con tu graduación, el PolyPlus es el punto perfecto entre calidad y precio — más resistente que el básico sin el costo de los premium.`
        : `With your prescription, PolyPlus hits the sweet spot between quality and price — more resistant than basic without the premium cost.`);
  } else {
    material = 'CR-39';
    condicion = lang === 'es' ? 'Graduación baja' : 'Low prescription';
    explicacion = lang === 'es'
      ? `Tu graduación es baja (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}), así que el CR-39 es perfecto para ti — económico, ligero y de excelente óptica.`
      : `Your prescription is low (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}), so CR-39 is perfect for you — affordable, light and excellent optics.`;
  }

  // Filtros recomendados
  const filtrosRec: { nombre: string; precio: number; razon: string }[] = [];

  if (tieneAstigmatismo) {
    filtrosRec.push({ nombre: 'AR Premium', precio: PRECIOS_FILTRO['AR Premium'], razon: lang === 'es' ? 'El astigmatismo causa halos y reflejos molestos, especialmente de noche. El AR Premium los elimina casi por completo.' : 'Astigmatism causes halos and annoying reflections, especially at night. AR Premium eliminates them almost completely.' });
  } else {
    filtrosRec.push({ nombre: 'AR Normal', precio: PRECIOS_FILTRO['AR Normal'], razon: lang === 'es' ? 'Antirreflejante básico, ideal para uso diario.' : 'Basic anti-reflective, ideal for daily use.' });
  }

  if (estiloVida.computadora) {
    filtrosRec.push({ nombre: 'Blue Light', precio: PRECIOS_FILTRO['Blue Light'], razon: lang === 'es' ? 'Trabajas en pantallas — el Blue Light bloquea la luz azul que causa fatiga visual y altera el sueño.' : 'You work on screens — Blue Light blocks blue light that causes eye strain and disrupts sleep.' });
  }

  if (estiloVida.manejo) {
    const yaTieneAR = filtrosRec.some(f => f.nombre === 'AR Premium');
    if (!yaTieneAR) filtrosRec.push({ nombre: 'AR Premium', precio: PRECIOS_FILTRO['AR Premium'], razon: lang === 'es' ? 'Para manejar de noche, el AR Premium reduce el encandilamiento de faros.' : 'For night driving, AR Premium reduces headlight glare.' });
  }

  if (estiloVida.sol) {
    filtrosRec.push({ nombre: 'Fotocromático', precio: PRECIOS_FILTRO['Fotocromático'], razon: lang === 'es' ? 'Se oscurece automáticamente con el sol — un solo par para adentro y afuera.' : 'Automatically darkens in sunlight — one pair for indoors and outdoors.' });
  }

  if (estiloVida.exterior && !estiloVida.sol) {
    filtrosRec.push({ nombre: 'Polarizado', precio: PRECIOS_FILTRO['Polarizado'], razon: lang === 'es' ? 'Elimina el reflejo del sol en superficies — ideal para trabajo al aire libre.' : 'Eliminates sun glare on surfaces — ideal for outdoor work.' });
  }

  if (tienePresbicia) {
    filtrosRec.push({ nombre: 'Antiempañante', precio: PRECIOS_FILTRO['Antiempañante'], razon: lang === 'es' ? 'Con progresivos, el antiempañante ayuda a que los lentes no se empañen al cambiar de temperatura.' : 'With progressives, anti-fog helps lenses not fog up when changing temperature.' });
  }

  // Calcular precio
  const precioMaterial = PRECIOS_MATERIAL[material];
  const precioFiltros = filtrosRec.reduce((a, f) => a + f.precio, 0);
  const precioOriginal = PRECIO_ARMAZON + precioMaterial + precioFiltros;
  const descuento = Math.round(precioOriginal * 0.10);
  const precioFinal = precioOriginal - descuento;

  return {
    nombre: lang === 'es' ? `Paquete ${condicion}` : `${condicion} Package`,
    material, precioMaterial,
    filtros: filtrosRec,
    precioOriginal, precioFinal, descuento,
    condicion, explicacion,
  };
}

// ─── SVG DE VERLY ─────────────────────────────────────────────────────────────
function VerlyAvatar({ expresion, size = 56 }: { expresion: Expresion; size?: number }) {
  const ojosAbiertos = expresion !== 'pensando';
  const sonrisa = expresion === 'feliz' || expresion === 'recomendando';
  const cejas = expresion === 'sorprendida' ? -3 : expresion === 'pensando' ? 2 : 0;

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Batita de optometrista */}
      <ellipse cx="40" cy="68" rx="22" ry="14" fill="white" stroke="#E2E8F0" strokeWidth="1.5"/>
      <rect x="33" y="58" width="14" height="18" rx="2" fill="white" stroke="#E2E8F0" strokeWidth="1"/>
      {/* Solapa batita */}
      <path d="M33 60 L28 72" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M47 60 L52 72" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Botoncito */}
      <circle cx="40" cy="64" r="1.5" fill="#2BBFB3"/>
      <circle cx="40" cy="69" r="1.5" fill="#2BBFB3"/>
      {/* Cuerpo ovalado */}
      <ellipse cx="40" cy="38" rx="26" ry="30" fill="white" stroke="#2BBFB3" strokeWidth="2.5"/>
      {/* Brillo cuerpo */}
      <ellipse cx="32" cy="22" rx="6" ry="4" fill="#E0F7F4" opacity="0.7"/>
      {/* Cejas */}
      <path d={`M26 ${27 + cejas} Q29 ${25 + cejas} 32 ${27 + cejas}`} stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round"/>
      <path d={`M48 ${27 + cejas} Q51 ${25 + cejas} 54 ${27 + cejas}`} stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round"/>
      {/* Lentecitos */}
      <rect x="22" y="30" width="16" height="11" rx="5" fill="white" stroke="#2BBFB3" strokeWidth="2" opacity="0.85"/>
      <rect x="42" y="30" width="16" height="11" rx="5" fill="white" stroke="#2BBFB3" strokeWidth="2" opacity="0.85"/>
      <line x1="38" y1="35" x2="42" y2="35" stroke="#2BBFB3" strokeWidth="1.5"/>
      <line x1="22" y1="35" x2="18" y2="33" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="58" y1="35" x2="62" y2="33" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Ojos */}
      {ojosAbiertos ? (
        <>
          <ellipse cx="30" cy="35.5" rx="4" ry="4" fill="#1A1A2E"/>
          <ellipse cx="50" cy="35.5" rx="4" ry="4" fill="#1A1A2E"/>
          <circle cx="31.5" cy="34" r="1.2" fill="white"/>
          <circle cx="51.5" cy="34" r="1.2" fill="white"/>
          {expresion === 'sorprendida' && (
            <>
              <ellipse cx="30" cy="35.5" rx="5" ry="5" fill="#1A1A2E"/>
              <ellipse cx="50" cy="35.5" rx="5" ry="5" fill="#1A1A2E"/>
            </>
          )}
        </>
      ) : (
        <>
          <path d="M26 35.5 Q30 32 34 35.5" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M46 35.5 Q50 32 54 35.5" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      )}
      {/* Boca */}
      {sonrisa ? (
        <path d="M34 46 Q40 51 46 46" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
      ) : expresion === 'sorprendida' ? (
        <ellipse cx="40" cy="47" rx="4" ry="5" fill="#1A1A2E"/>
      ) : (
        <path d="M35 47 Q40 49 45 47" stroke="#1A1A2E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      )}
      {/* Mejillas rosadas cuando feliz */}
      {(expresion === 'feliz' || expresion === 'recomendando') && (
        <>
          <ellipse cx="24" cy="43" rx="5" ry="3" fill="#FFB3C6" opacity="0.5"/>
          <ellipse cx="56" cy="43" rx="5" ry="3" fill="#FFB3C6" opacity="0.5"/>
        </>
      )}
      {/* Puntos pensando */}
      {expresion === 'pensando' && (
        <>
          <circle cx="36" cy="47" r="1.5" fill="#2BBFB3"/>
          <circle cx="40" cy="45" r="1.5" fill="#2BBFB3"/>
          <circle cx="44" cy="47" r="1.5" fill="#2BBFB3"/>
        </>
      )}
    </svg>
  );
}

// ─── BURBUJA DE PAQUETE ────────────────────────────────────────────────────────
function BurbujaPaquete({ paquete, onAceptar, lang }: { paquete: Paquete; onAceptar: () => void; lang: 'es' | 'en' }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #E0F7F4 0%, #F0FBF8 100%)',
      border: '2px solid #2BBFB3', borderRadius: '12px', padding: '1rem',
      marginTop: '8px',
    }}>
      <div style={{ fontSize: '12px', fontWeight: 800, color: '#2BBFB3', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
        {paquete.nombre}
      </div>

      {/* Condición */}
      <div style={{ fontSize: '12px', color: '#1A5C58', marginBottom: '10px', lineHeight: 1.5 }}>
        {paquete.explicacion}
      </div>

      {/* Items */}
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

      {/* Precio */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7A8494', textDecoration: 'line-through' }}>${paquete.precioOriginal} USD</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#2BBFB3' }}>${paquete.precioFinal} USD</div>
        </div>
        <div style={{ background: '#F5C518', color: '#1A1A2E', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
          -{paquete.descuento}% OFF
        </div>
      </div>

      <button onClick={onAceptar} style={{
        width: '100%', background: '#1A1A2E', color: 'white',
        border: 'none', borderRadius: '8px', padding: '10px',
        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
        fontFamily: 'var(--font-jakarta), sans-serif',
      }}>
        {lang === 'es' ? 'Agregar este paquete →' : 'Add this package →'}
      </button>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function VerlyBot() {
  const { lang } = useLang() as { lang: 'es' | 'en'; t: (es: string, en: string) => string };
  const [abierto, setAbierto] = useState(false);
  const [expresion, setExpresion] = useState<Expresion>('neutral');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const [paso, setPaso] = useState(0);
  const [sesion, setSesion] = useState<SesionPx>({
    nombre: '', tipoCara: '', receta: null,
    primeraVez: null, estiloVida: {}, armazonId: '', paqueteRecomendado: null,
  });
  const [opciones, setOpciones] = useState<string[]>([]);
  const [pagina, setPagina] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detectar página actual
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      setPagina(path);

      // Cargar sesión guardada
      const sesionGuardada = sessionStorage.getItem('verly_sesion');
      if (sesionGuardada) {
        const s = JSON.parse(sesionGuardada);
        setSesion(s);
        if (s.nombre) {
          setPaso(10); // ya pasó el onboarding
        }
      }
    }
  }, []);

  // Guardar sesión
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('verly_sesion', JSON.stringify(sesion));
    }
  }, [sesion]);

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  // Mensaje de bienvenida al abrir
  useEffect(() => {
    if (abierto && mensajes.length === 0) {
      setTimeout(() => iniciarConversacion(), 400);
    }
  }, [abierto]);

  const agregarMensaje = (de: 'verly' | 'px', texto: string, paquete?: Paquete) => {
    setMensajes(prev => [...prev, { de, texto, paquete }]);
  };

  const cambiarExpresion = (e: Expresion, duracion = 2000) => {
    setExpresion(e);
    setTimeout(() => setExpresion('neutral'), duracion);
  };

  const iniciarConversacion = () => {
    const s = JSON.parse(sessionStorage.getItem('verly_sesion') || '{}');
    if (s.nombre) {
      // Ya conoce al paciente
      const saludo = lang === 'es'
        ? `¡Hola de nuevo, ${s.nombre}! Soy Verly, tu asistente óptica. ¿En qué te puedo ayudar?`
        : `Welcome back, ${s.nombre}! I'm Verly, your optical assistant. How can I help you?`;
      agregarMensaje('verly', saludo);
      cambiarExpresion('feliz');
      setPaso(10);
      mostrarOpcionesPagina(window.location.pathname, s);
    } else {
      // Primera vez
      const bienvenida = lang === 'es'
        ? '¡Hola! Soy Verly, tu asistente de óptica personal. Estoy aquí para ayudarte a encontrar los lentes perfectos para ti. ¿Cómo te llamas?'
        : "Hi! I'm Verly, your personal optical assistant. I'm here to help you find the perfect lenses. What's your name?";
      agregarMensaje('verly', bienvenida);
      cambiarExpresion('feliz', 3000);
      setPaso(1);
      setOpciones([]);
    }
  };

  const mostrarOpcionesPagina = (path: string, s: SesionPx) => {
    if (path.includes('/Tienda') || path === '/Tienda') {
      if (!s.tipoCara) {
        setTimeout(() => {
          agregarMensaje('verly', lang === 'es'
            ? '¿Cuál es la forma de tu cara? Esto me ayuda a recomendarte el armazón ideal.'
            : 'What is your face shape? This helps me recommend the ideal frame for you.');
          setOpciones(lang === 'es'
            ? ['Ovalada', 'Cuadrada', 'Corazón', 'Redonda', 'No sé']
            : ['Oval', 'Square', 'Heart', 'Round', "I don't know"]);
          setPaso(3);
        }, 800);
      } else {
        setTimeout(() => {
          darRecomendacionArmazon(s.tipoCara);
        }, 800);
      }
    } else if (path.includes('/armazon/')) {
      if (s.receta) {
        setTimeout(() => {
          const paquete = armarPaquete(s.receta!, s.estiloVida, lang);
          agregarMensaje('verly',
            lang === 'es'
              ? `Veo que ya tienes tu receta guardada. Basándome en ella, te armé un paquete personalizado:`
              : `I see you already have your prescription saved. Based on it, I put together a personalized package for you:`,
            paquete
          );
          cambiarExpresion('recomendando', 3000);
          setSesion(prev => ({ ...prev, paqueteRecomendado: paquete }));
        }, 800);
      } else {
        setTimeout(() => {
          agregarMensaje('verly', lang === 'es'
            ? '¡Buen gusto en el armazón! Para recomendarte el mejor material y filtros, necesito tu receta óptica. ¿Ya la tienes a la mano?'
            : 'Great frame choice! To recommend the best material and filters, I need your prescription. Do you have it handy?');
          setOpciones(lang === 'es' ? ['Sí, la tengo', 'No la tengo aún', 'Tengo foto de mi receta'] : ['Yes, I have it', "I don't have it yet", 'I have a photo of my prescription']);
          setPaso(5);
        }, 800);
      }
    } else if (path === '/' || path === '') {
      setTimeout(() => {
        agregarMensaje('verly', lang === 'es'
          ? '¿Es tu primera vez comprando lentes en línea?'
          : 'Is this your first time buying glasses online?');
        setOpciones(lang === 'es' ? ['Sí, primera vez', 'Ya he comprado antes', 'Solo estoy explorando'] : ['Yes, first time', 'I\'ve bought before', 'Just browsing']);
        setPaso(2);
      }, 800);
    }
  };

  const darRecomendacionArmazon = (tipoCara: TipoCara) => {
    const recomendaciones: Record<string, { es: string; en: string }> = {
      ovalada: {
        es: 'Tu cara ovalada es muy versátil — casi cualquier armazón te queda bien. Te recomiendo los rectangulares o cuadrados para dar más estructura a tus facciones. ¡Los de forma cuadrada te van a quedar espectacular!',
        en: 'Your oval face is very versatile — almost any frame suits you. I recommend rectangular or square frames to add more structure to your features. Square frames will look spectacular on you!',
      },
      cuadrada: {
        es: 'Para una cara cuadrada, los armazones ovalados o redondos suavizan los ángulos de tu mandíbula. Evita los cuadrados muy angulares — los ovalados te van a verse muy bien.',
        en: 'For a square face, oval or round frames soften your jaw angles. Avoid very angular square frames — ovals will look great on you.',
      },
      corazon: {
        es: 'Con cara de corazón, los armazones más anchos abajo equilibran tu frente. Los ovalados y los aviator son ideales para ti.',
        en: 'With a heart-shaped face, frames wider at the bottom balance your forehead. Oval and aviator styles are ideal for you.',
      },
      redonda: {
        es: 'Para una cara redonda, los armazones rectangulares o cuadrados alargan visualmente el rostro. Evita los redondos que acentúan la forma circular.',
        en: 'For a round face, rectangular or square frames visually elongate the face. Avoid round frames that emphasize the circular shape.',
      },
    };

    const rec = recomendaciones[tipoCara as string];
    if (rec) {
      agregarMensaje('verly', lang === 'es' ? rec.es : rec.en);
      cambiarExpresion('recomendando', 3000);
      setTimeout(() => {
        agregarMensaje('verly', lang === 'es'
          ? '¿Ya tienes tu receta óptica? Si me la compartes, te armo un paquete completo con el mejor material y filtros para tu graduación.'
          : 'Do you have your prescription? If you share it with me, I\'ll put together a complete package with the best material and filters for your prescription.');
        setOpciones(lang === 'es' ? ['Sí, tengo mi receta', 'Todavía no', 'Ver armazones primero'] : ['Yes, I have my prescription', 'Not yet', 'Browse frames first']);
        setPaso(5);
      }, 1500);
    }
  };

  const procesarRespuesta = (texto: string) => {
    agregarMensaje('px', texto);
    setOpciones([]);
    cambiarExpresion('pensando', 1500);

    setTimeout(() => {
      // PASO 1: Nombre
      if (paso === 1) {
        const nombre = texto.trim().split(' ')[0];
        setSesion(prev => ({ ...prev, nombre }));
        agregarMensaje('verly', lang === 'es'
          ? `¡Mucho gusto, ${nombre}! ¿Es tu primera vez comprando lentes en línea?`
          : `Nice to meet you, ${nombre}! Is this your first time buying glasses online?`);
        cambiarExpresion('feliz', 2000);
        setOpciones(lang === 'es' ? ['Sí, primera vez', 'Ya he comprado antes', 'Solo estoy explorando'] : ['Yes, first time', "I've bought before", 'Just browsing']);
        setPaso(2);
      }

      // PASO 2: Primera vez
      else if (paso === 2) {
        const esPrimera = texto.includes('primera') || texto.includes('first') || texto.includes('Sí');
        setSesion(prev => ({ ...prev, primeraVez: esPrimera }));
        if (esPrimera) {
          agregarMensaje('verly', lang === 'es'
            ? '¡No te preocupes! Estoy aquí para guiarte en cada paso. Primero, cuéntame: ¿cuál es la forma de tu cara?'
            : "Don't worry! I'm here to guide you every step of the way. First, tell me: what is your face shape?");
        } else {
          agregarMensaje('verly', lang === 'es'
            ? '¡Perfecto! Entonces ya sabes lo que buscas. Cuéntame, ¿cuál es la forma de tu cara para recomendarte armazones?'
            : 'Perfect! Then you know what you\'re looking for. Tell me, what\'s your face shape so I can recommend frames?');
        }
        setOpciones(lang === 'es'
          ? ['Ovalada', 'Cuadrada', 'Corazón', 'Redonda', 'No sé']
          : ['Oval', 'Square', 'Heart', 'Round', "I don't know"]);
        setPaso(3);
      }

      // PASO 3: Tipo de cara
      else if (paso === 3) {
        let tipoCara: TipoCara = '';
        if (texto.toLowerCase().includes('oval')) tipoCara = 'ovalada';
        else if (texto.toLowerCase().includes('cuadrad') || texto.toLowerCase().includes('square')) tipoCara = 'cuadrada';
        else if (texto.toLowerCase().includes('coraz') || texto.toLowerCase().includes('heart')) tipoCara = 'corazon';
        else if (texto.toLowerCase().includes('redon') || texto.toLowerCase().includes('round')) tipoCara = 'redonda';
        else tipoCara = 'ovalada'; // default

        setSesion(prev => ({ ...prev, tipoCara }));
        darRecomendacionArmazon(tipoCara);
        setPaso(5);
      }

      // PASO 4: Estilo de vida
      else if (paso === 4) {
        const estiloVida: Record<string, boolean> = {
          computadora: texto.toLowerCase().includes('computadora') || texto.toLowerCase().includes('pantalla') || texto.toLowerCase().includes('computer') || texto.toLowerCase().includes('screen'),
          manejo: texto.toLowerCase().includes('manejo') || texto.toLowerCase().includes('manejo') || texto.toLowerCase().includes('drive') || texto.toLowerCase().includes('night'),
          sol: texto.toLowerCase().includes('sol') || texto.toLowerCase().includes('sun') || texto.toLowerCase().includes('luz'),
          exterior: texto.toLowerCase().includes('exterior') || texto.toLowerCase().includes('outdoor') || texto.toLowerCase().includes('aire libre'),
        };
        setSesion(prev => ({ ...prev, estiloVida }));

        if (sesion.receta) {
          const paquete = armarPaquete(sesion.receta, estiloVida, lang);
          agregarMensaje('verly',
            lang === 'es'
              ? `Perfecto. Con tu receta y estilo de vida, te armé este paquete personalizado:`
              : `Perfect. Based on your prescription and lifestyle, I put together this personalized package:`,
            paquete
          );
          cambiarExpresion('recomendando', 3000);
          setSesion(prev => ({ ...prev, paqueteRecomendado: paquete, estiloVida }));
        } else {
          agregarMensaje('verly', lang === 'es'
            ? 'Para armar tu paquete completo, necesito tu receta óptica. ¿La tienes a la mano?'
            : 'To complete your package, I need your prescription. Do you have it handy?');
          setOpciones(lang === 'es' ? ['Sí, la tengo', 'No la tengo'] : ['Yes, I have it', "I don't have it"]);
          setPaso(5);
        }
      }

      // PASO 5: ¿Tiene receta?
      else if (paso === 5) {
        if (texto.includes('Sí') || texto.includes('Yes') || texto.includes('tengo') || texto.includes('have it')) {
          agregarMensaje('verly', lang === 'es'
            ? 'Perfecto. Ingresa tu receta en el formulario de arriba (en el drawer de personalización). Cuando la llenes, yo la leo automáticamente y te armo tu paquete.'
            : 'Perfect. Enter your prescription in the form above (in the customization drawer). When you fill it in, I\'ll read it automatically and build your package.');
          setPaso(10);
        } else if (texto.includes('foto') || texto.includes('photo')) {
          agregarMensaje('verly', lang === 'es'
            ? 'Sube la foto de tu receta en el formulario de arriba y yo la tomaré en cuenta para mis recomendaciones.'
            : 'Upload your prescription photo in the form above and I\'ll take it into account for my recommendations.');
          setPaso(10);
        } else {
          agregarMensaje('verly', lang === 'es'
            ? 'No hay problema. Puedo recomendarte igual. Cuéntame: ¿ves mal de lejos, de cerca, o de las dos distancias?'
            : "No problem. I can still help you. Tell me: do you see poorly far away, up close, or both?");
          setOpciones(lang === 'es'
            ? ['De lejos (miopía)', 'De cerca (hipermetropía)', 'Las dos (presbicia)', 'Astigmatismo también']
            : ['Far away (myopia)', 'Up close (hyperopia)', 'Both (presbyopia)', 'Astigmatism too']);
          setPaso(6);
        }
      }

      // PASO 6: Sin receta — tipo de visión
      else if (paso === 6) {
        let recetaEstimada: Receta = { sph_od: 0, cyl_od: 0, axis_od: 0, add_od: 0, sph_oi: 0, cyl_oi: 0, axis_oi: 0, add_oi: 0 };
        if (texto.includes('lejos') || texto.includes('miopía') || texto.includes('myopia')) {
          recetaEstimada = { ...recetaEstimada, sph_od: -2.5, sph_oi: -2.5 };
        } else if (texto.includes('cerca') || texto.includes('hiperme') || texto.includes('hyperopia')) {
          recetaEstimada = { ...recetaEstimada, sph_od: 2.0, sph_oi: 2.0 };
        } else if (texto.includes('dos') || texto.includes('presbicia') || texto.includes('presbyopia')) {
          recetaEstimada = { ...recetaEstimada, sph_od: 1.5, sph_oi: 1.5, add_od: 2.0, add_oi: 2.0 };
        }
        if (texto.includes('astigma') || texto.includes('astigmatism')) {
          recetaEstimada = { ...recetaEstimada, cyl_od: -1.5, cyl_oi: -1.5 };
        }
        setSesion(prev => ({ ...prev, receta: recetaEstimada }));
        const paquete = armarPaquete(recetaEstimada, sesion.estiloVida, lang);
        agregarMensaje('verly',
          lang === 'es'
            ? `Basándome en lo que me dijiste, aquí está mi recomendación. Para afinar el paquete, ingresa tu receta exacta cuando puedas:`
            : `Based on what you told me, here's my recommendation. To fine-tune the package, enter your exact prescription when you can:`,
          paquete
        );
        cambiarExpresion('recomendando', 3000);
        setSesion(prev => ({ ...prev, paqueteRecomendado: paquete }));
        setPaso(10);
      }

      // PASO 10: Conversación libre
      else {
        const textoLower = texto.toLowerCase();
        if (textoLower.includes('receta') || textoLower.includes('graduaci') || textoLower.includes('prescription')) {
          agregarMensaje('verly', lang === 'es'
            ? 'Puedes ingresar tu receta en el formulario del drawer de personalización (botón "Personalizar mis micas"). Cuando la llenes, te armo un paquete automáticamente.'
            : 'You can enter your prescription in the customization drawer form (button "Customize my lenses"). When you fill it in, I\'ll build a package automatically.');
        } else if (textoLower.includes('precio') || textoLower.includes('costo') || textoLower.includes('price') || textoLower.includes('cost')) {
          agregarMensaje('verly', lang === 'es'
            ? 'Los armazones arrancan en $43 USD. Las micas se personalizan desde +$5 (monofocal básico) hasta +$186 (progresivo súper hi-index con todos los filtros). El precio promedio es ~$67 USD.'
            : 'Frames start at $43 USD. Lenses are customized from +$5 (basic monofocal) to +$186 (progressive super hi-index with all filters). Average price is ~$67 USD.');
          cambiarExpresion('recomendando');
        } else if (textoLower.includes('entrega') || textoLower.includes('envio') || textoLower.includes('delivery') || textoLower.includes('shipping')) {
          agregarMensaje('verly', lang === 'es'
            ? 'Entregamos en 3-5 días hábiles a California. El envío es gratuito en todos los pedidos. Si tienes algún problema, tienes 30 días para devolverlos sin preguntas.'
            : 'We deliver in 3-5 business days to California. Shipping is free on all orders. If there\'s any issue, you have 30 days to return them no questions asked.');
        } else if (textoLower.includes('astigmat')) {
          agregarMensaje('verly', lang === 'es'
            ? 'El astigmatismo ocurre cuando la córnea tiene forma irregular (como un balón de fútbol americano en lugar de una esfera). Esto hace que la luz se enfoque en múltiples puntos, causando visión borrosa y encandilamiento, especialmente de noche. El AR Premium y el material correcto son esenciales para corregirlo bien.'
            : 'Astigmatism occurs when the cornea has an irregular shape (like a football instead of a sphere). This causes light to focus on multiple points, resulting in blurry vision and glare, especially at night. AR Premium coating and the right material are essential for proper correction.');
          cambiarExpresion('recomendando', 3000);
        } else {
          const respuestas = lang === 'es'
            ? ['Entendido! ¿Hay algo más en lo que te pueda ayudar?', '¿Tienes alguna pregunta sobre los materiales o filtros?', '¿Quieres que te arme un paquete personalizado con tu receta?']
            : ['Got it! Is there anything else I can help you with?', 'Do you have any questions about materials or filters?', 'Would you like me to put together a personalized package with your prescription?'];
          agregarMensaje('verly', respuestas[Math.floor(Math.random() * respuestas.length)]);
        }
      }
    }, 800);
  };

  const manejarEnvio = () => {
    if (!input.trim()) return;
    procesarRespuesta(input.trim());
    setInput('');
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <div
        onClick={() => setAbierto(!abierto)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
          cursor: 'pointer',
          animation: 'verlyFloat 3s ease-in-out infinite',
          filter: 'drop-shadow(0 8px 24px rgba(43,191,179,0.4))',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <VerlyAvatar expresion={abierto ? 'feliz' : expresion} size={64}/>
        {/* Notificación */}
        {!abierto && (
          <div style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#F5C518', borderRadius: '50%',
            width: '18px', height: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 800, color: '#1A1A2E',
            border: '2px solid white',
          }}>!</div>
        )}
      </div>

      {/* CHAT */}
      {abierto && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '24px', zIndex: 998,
          width: '360px', maxWidth: 'calc(100vw - 48px)',
          background: 'white', borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '520px',
          animation: 'verlySlideUp 0.3s ease-out',
          fontFamily: 'var(--font-jakarta), sans-serif',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #2BBFB3 0%, #1a9990 100%)',
            padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <VerlyAvatar expresion={expresion} size={44}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>Verly</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
                {lang === 'es' ? 'Tu optometrista virtual' : 'Your virtual optometrist'}
              </div>
            </div>
            <button onClick={() => setAbierto(false)} style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
              width: '28px', height: '28px', color: 'white', cursor: 'pointer',
              fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-jakarta), sans-serif',
            }}>×</button>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mensajes.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.de === 'verly' ? 'row' : 'row-reverse', gap: '8px', alignItems: 'flex-start' }}>
                {m.de === 'verly' && <VerlyAvatar expresion="neutral" size={28}/>}
                <div style={{ maxWidth: '80%' }}>
                  <div style={{
                    background: m.de === 'verly' ? '#F0FBF8' : '#1A1A2E',
                    color: m.de === 'verly' ? '#1A1A2E' : 'white',
                    padding: '10px 14px', borderRadius: m.de === 'verly' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                    fontSize: '13px', lineHeight: 1.6,
                  }}>
                    {m.texto}
                  </div>
                  {m.paquete && (
                    <BurbujaPaquete
                      paquete={m.paquete}
                      lang={lang}
                      onAceptar={() => {
                        cambiarExpresion('feliz', 2000);
                        agregarMensaje('verly', lang === 'es'
                          ? `Excelente elección! El paquete ya está listo. Cuando vayas al drawer de personalización, selecciona ${m.paquete!.material} como material y los filtros recomendados. ¡Tu código de descuento VERLY10 también aplica!`
                          : `Excellent choice! The package is ready. When you go to the customization drawer, select ${m.paquete!.material} as material and the recommended filters. Your discount code VERLY10 also applies!`);
                      }}
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Opciones rápidas */}
            {opciones.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {opciones.map((op, i) => (
                  <button key={i} onClick={() => procesarRespuesta(op)} style={{
                    background: 'white', border: '1.5px solid #2BBFB3', borderRadius: '20px',
                    padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: '#2BBFB3',
                    cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#E0F7F4'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #EAECF0', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && manejarEnvio()}
              placeholder={lang === 'es' ? 'Escribe aquí...' : 'Type here...'}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '20px',
                border: '1.5px solid #EAECF0', fontSize: '13px',
                fontFamily: 'var(--font-jakarta), sans-serif',
                outline: 'none',
              }}
            />
            <button onClick={manejarEnvio} style={{
              background: '#2BBFB3', color: 'white', border: 'none',
              borderRadius: '50%', width: '38px', height: '38px',
              cursor: 'pointer', fontSize: '16px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>→</button>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes verlyFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes verlySlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}