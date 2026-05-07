'use client';
import { useState } from 'react';
import { useLang } from './LanguageContext';

const preguntas = {
  es: [
    { id: 'computadora', texto: '¿Trabajas muchas horas frente a una computadora o pantalla?' },
    { id: 'manejo', texto: '¿Manejas seguido, especialmente de noche?' },
    { id: 'sol', texto: '¿Te molesta mucho el sol o la luz brillante?' },
    { id: 'exterior', texto: '¿Trabajas o pasas mucho tiempo al aire libre?' },
    { id: 'ligeros', texto: '¿Prefieres lentes más ligeros y delgados?' },
  ],
  en: [
    { id: 'computadora', texto: 'Do you spend many hours in front of a computer or screen?' },
    { id: 'manejo', texto: 'Do you drive often, especially at night?' },
    { id: 'sol', texto: 'Are you sensitive to sunlight or bright light?' },
    { id: 'exterior', texto: 'Do you work or spend a lot of time outdoors?' },
    { id: 'ligeros', texto: 'Do you prefer lighter and thinner lenses?' },
  ]
};

type Respuestas = Record<string, boolean>;

function getRecomendacion(grad: number, resp: Respuestas, lang: 'es' | 'en') {
  const abs = Math.abs(grad);
  let material = '';
  let filtros: string[] = [];
  let explicacion = '';

  if (lang === 'es') {
    if (abs <= 1.5) { material = 'CR-39'; explicacion = 'Tu graduación es baja, el CR-39 es perfecto — económico y ligero.'; }
    else if (abs <= 3.0) { material = 'PolyPlus (Policarbonato)'; explicacion = 'Tu graduación es media. El policarbonato es más resistente para uso diario.'; }
    else if (abs <= 5.0) { material = 'Hi-Index 1.67'; explicacion = 'Tu graduación es alta. El Hi-Index hará tus lentes más delgados y estéticos.'; }
    else { material = 'Súper Hi-Index 1.74'; explicacion = 'Tu graduación es muy alta. El Súper Hi-Index es lo más delgado disponible.'; }
    if (resp.computadora) filtros.push('Blue Light — protección para pantallas');
    if (resp.manejo) filtros.push('AR Premium — antirreflejante para manejar de noche');
    if (resp.sol) filtros.push('Fotocromático — se oscurece con el sol');
    if (resp.exterior) filtros.push('Polarizado — ideal para exteriores');
  } else {
    if (abs <= 1.5) { material = 'CR-39'; explicacion = 'Your prescription is low. CR-39 is perfect — affordable and lightweight.'; }
    else if (abs <= 3.0) { material = 'PolyPlus (Polycarbonate)'; explicacion = 'Your prescription is medium. Polycarbonate is more durable for daily use.'; }
    else if (abs <= 5.0) { material = 'Hi-Index 1.67'; explicacion = 'Your prescription is high. Hi-Index will make your lenses thinner and more aesthetic.'; }
    else { material = 'Super Hi-Index 1.74'; explicacion = 'Your prescription is very high. Super Hi-Index is the thinnest option available.'; }
    if (resp.computadora) filtros.push('Blue Light — screen protection');
    if (resp.manejo) filtros.push('AR Premium — anti-reflective for night driving');
    if (resp.sol) filtros.push('Photochromic — darkens in sunlight');
    if (resp.exterior) filtros.push('Polarized — ideal for outdoors');
  }

  return { material, filtros, explicacion };
}

export default function Verly() {
  const { lang, t } = useLang();
  const [abierto, setAbierto] = useState(false);
  const [paso, setPaso] = useState(0);
  const [graduacion, setGraduacion] = useState('');
  const [gradError, setGradError] = useState('');
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [mensajes, setMensajes] = useState<{tipo: 'bot'|'user', texto: string}[]>([
    { tipo: 'bot', texto: t('¡Hola! Soy Verly 👓 Estoy aquí para ayudarte a encontrar los lentes perfectos. ¿Empezamos?', "Hi! I'm Verly 👓 I'm here to help you find the perfect lenses. Shall we start?") }
  ]);

  const agregarMensaje = (tipo: 'bot'|'user', texto: string) => {
    setMensajes(prev => [...prev, { tipo, texto }]);
  };

  const iniciar = () => {
    setPaso(1);
    agregarMensaje('bot', t(
      '¿Cuál es tu graduación aproximada? (Ej: -2.50 o +1.75). Si no la sabes escribe 0.',
      'What is your approximate prescription? (Ex: -2.50 or +1.75). If you don\'t know, type 0.'
    ));
  };

  const procesarGraduacion = () => {
    const num = parseFloat(graduacion);
    if (isNaN(num)) {
      setGradError(t('Por favor escribe un número válido, ej: -2.50', 'Please enter a valid number, ex: -2.50'));
      return;
    }
    setGradError('');
    agregarMensaje('user', graduacion);
    agregarMensaje('bot', t(`Entendido 👍 Ahora te haré ${preguntas.es.length} preguntas rápidas.`, `Got it 👍 I'll ask you ${preguntas.en.length} quick questions.`));
    setTimeout(() => {
      agregarMensaje('bot', preguntas[lang][0].texto);
      setPaso(2);
      setPreguntaActual(0);
    }, 800);
  };

  const responder = (resp: boolean) => {
    const pregunta = preguntas[lang][preguntaActual];
    agregarMensaje('user', resp ? t('Sí', 'Yes') : t('No', 'No'));
    const nuevasResp = { ...respuestas, [pregunta.id]: resp };
    setRespuestas(nuevasResp);

    if (preguntaActual < preguntas[lang].length - 1) {
      const siguiente = preguntaActual + 1;
      setPreguntaActual(siguiente);
      setTimeout(() => agregarMensaje('bot', preguntas[lang][siguiente].texto), 500);
    } else {
      setTimeout(() => {
        const grad = parseFloat(graduacion) || 0;
        const rec = getRecomendacion(grad, nuevasResp, lang);
        const filtrosTexto = rec.filtros.length > 0
          ? `\n\n🔹 ${t('Filtros recomendados', 'Recommended filters')}:\n${rec.filtros.map(f => `• ${f}`).join('\n')}`
          : `\n\n✅ ${t('No necesitas filtros especiales.', 'You don\'t need special filters.')}`;
        agregarMensaje('bot',
          `${t('¡Tu recomendación personalizada!', 'Your personalized recommendation!')}\n\n💎 ${t('Material', 'Material')}: ${rec.material}\n\n${rec.explicacion}${filtrosTexto}\n\n${t('¿Quieres ver los armazones?', 'Want to see the frames?')}`
        );
        setPaso(3);
      }, 500);
    }
  };

  const reiniciar = () => {
    setPaso(0);
    setGraduacion('');
    setRespuestas({});
    setPreguntaActual(0);
    setMensajes([{ tipo: 'bot', texto: t('¡Hola! Soy Verly 👓 Estoy aquí para ayudarte a encontrar los lentes perfectos. ¿Empezamos?', "Hi! I'm Verly 👓 I'm here to help you find the perfect lenses. Shall we start?") }]);
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#2BBFB3', color: 'white', border: 'none',
          fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(43,191,179,.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        title="Verly"
      >
        {abierto ? '✕' : '👓'}
      </button>

      {/* CHAT */}
      {abierto && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', zIndex: 998,
          width: 'min(360px, calc(100vw - 48px))',
          height: 'min(500px, calc(100vh - 120px))',
          background: 'white', borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(0,0,0,.15)',
          display: 'flex', flexDirection: 'column',
          fontFamily: 'sans-serif', overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}>

          {/* HEADER */}
          <div style={{background: '#2BBFB3', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '10px'}}>
            <div style={{width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'}}>👓</div>
            <div>
              <div style={{color: 'white', fontWeight: 700, fontSize: '14px'}}>Verly</div>
              <div style={{color: 'rgba(255,255,255,.8)', fontSize: '11px'}}>{t('Tu asistente óptico personal', 'Your personal optical assistant')}</div>
            </div>
            <button onClick={reiniciar} style={{marginLeft: 'auto', background: 'rgba(255,255,255,.2)', border: 'none', color: 'white', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontFamily: 'sans-serif'}}>
              {t('Reiniciar', 'Restart')}
            </button>
          </div>

          {/* MENSAJES */}
          <div style={{flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {mensajes.map((m, i) => (
              <div key={i} style={{display: 'flex', justifyContent: m.tipo === 'user' ? 'flex-end' : 'flex-start'}}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px',
                  borderRadius: m.tipo === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.tipo === 'user' ? '#2BBFB3' : '#F4F6F9',
                  color: m.tipo === 'user' ? 'white' : '#1A1A2E',
                  fontSize: '13px', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                }}>
                  {m.texto}
                </div>
              </div>
            ))}
          </div>

          {/* INPUTS */}
          <div style={{padding: '1rem', borderTop: '1px solid #E2E8F0'}}>
            {paso === 0 && (
              <button onClick={iniciar} style={{width: '100%', background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '24px', padding: '11px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif'}}>
                {t('¡Sí, empecemos! 🚀', "Yes, let's start! 🚀")}
              </button>
            )}
            {paso === 1 && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <input
                  value={graduacion}
                  onChange={e => setGraduacion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && procesarGraduacion()}
                  placeholder={t('Ej: -2.50 o +1.75', 'Ex: -2.50 or +1.75')}
                  style={{width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', fontFamily: 'sans-serif', outline: 'none'}}
                />
                {gradError && <div style={{color: '#E53E3E', fontSize: '12px'}}>{gradError}</div>}
                <button onClick={procesarGraduacion} style={{background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '24px', padding: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif'}}>
                  {t('Continuar →', 'Continue →')}
                </button>
              </div>
            )}
            {paso === 2 && (
              <div style={{display: 'flex', gap: '8px'}}>
                <button onClick={() => responder(true)} style={{flex: 1, background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '24px', padding: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif'}}>
                  {t('Sí ✓', 'Yes ✓')}
                </button>
                <button onClick={() => responder(false)} style={{flex: 1, background: '#F4F6F9', color: '#4A5568', border: '1.5px solid #E2E8F0', borderRadius: '24px', padding: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif'}}>
                  {t('No', 'No')}
                </button>
              </div>
            )}
            {paso === 3 && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <a href="/Tienda" style={{display: 'block', textAlign: 'center', background: '#2BBFB3', color: 'white', borderRadius: '24px', padding: '11px', fontSize: '14px', fontWeight: 700, textDecoration: 'none'}}>
                  {t('Ver armazones →', 'See frames →')}
                </a>
                <a href="/configurador2" style={{display: 'block', textAlign: 'center', background: '#F4F6F9', color: '#4A5568', borderRadius: '24px', padding: '10px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', border: '1.5px solid #E2E8F0'}}>
                  {t('Ir al configurador', 'Go to configurator')}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}