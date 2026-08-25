'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

type Armazon = {
  id: number; nombre: string; forma: string | null; genero: string | null;
  color1: string | null; precio: number | null; imagen_url: string | null; descuento_verly: number | null;
};

// Qué formas de armazón le quedan a cada tipo de cara (guía de óptica).
const CARA_FORMAS: Record<string, string[]> = {
  ovalada: ['redonda', 'cuadrada', 'rectangular', 'ovalada', 'aviador'],
  redonda: ['cuadrada', 'rectangular'],
  cuadrada: ['redonda', 'ovalada', 'aviador'],
  corazon: ['redonda', 'ovalada', 'aviador'],
  alargada: ['cuadrada', 'rectangular', 'aviador'],
};

const SOBRIOS = ['negro', 'black', 'cafe', 'café', 'marron', 'marrón', 'brown', 'gris', 'gray', 'grey',
  'carey', 'tortoise', 'transparente', 'clear', 'cristal', 'plata', 'silver', 'nude', 'beige'];
const esSobrio = (c: string | null) => {
  const s = (c || '').toLowerCase();
  return SOBRIOS.some(k => s.includes(k));
};

// Ilustración de forma de armazón
function Forma({ tipo, color = 'white' }: { tipo: string; color?: string }) {
  const s = color;
  if (tipo === 'redonda') return <svg width="56" height="26" viewBox="0 0 100 44" fill="none"><circle cx="24" cy="22" r="17" stroke={s} strokeWidth="3"/><circle cx="76" cy="22" r="17" stroke={s} strokeWidth="3"/><path d="M41 20 q9 -5 18 0" stroke={s} strokeWidth="2.5"/></svg>;
  if (tipo === 'cuadrada') return <svg width="56" height="26" viewBox="0 0 100 44" fill="none"><rect x="6" y="6" width="34" height="32" rx="4" stroke={s} strokeWidth="3"/><rect x="60" y="6" width="34" height="32" rx="4" stroke={s} strokeWidth="3"/><path d="M40 18 q10 -6 20 0" stroke={s} strokeWidth="2.5"/></svg>;
  if (tipo === 'rectangular') return <svg width="56" height="24" viewBox="0 0 100 40" fill="none"><rect x="5" y="12" width="38" height="20" rx="4" stroke={s} strokeWidth="3"/><rect x="57" y="12" width="38" height="20" rx="4" stroke={s} strokeWidth="3"/><path d="M43 20 q7 -4 14 0" stroke={s} strokeWidth="2.5"/></svg>;
  if (tipo === 'ovalada') return <svg width="56" height="26" viewBox="0 0 100 44" fill="none"><ellipse cx="24" cy="22" rx="19" ry="14" stroke={s} strokeWidth="3"/><ellipse cx="76" cy="22" rx="19" ry="14" stroke={s} strokeWidth="3"/><path d="M43 21 q7 -4 14 0" stroke={s} strokeWidth="2.5"/></svg>;
  return <svg width="56" height="26" viewBox="0 0 100 44" fill="none"><path d="M5 12 h38 l-7 22 q-11 4 -18 -4 z" stroke={s} strokeWidth="3" strokeLinejoin="round"/><path d="M95 12 h-38 l7 22 q11 4 18 -4 z" stroke={s} strokeWidth="3" strokeLinejoin="round"/><path d="M43 16 q7 -4 14 0" stroke={s} strokeWidth="2.5"/></svg>;
}

// Ilustración de tipo de cara
function Cara({ tipo, color = 'white' }: { tipo: string; color?: string }) {
  const s = color;
  if (tipo === 'ovalada') return <svg width="34" height="42" viewBox="0 0 60 72" fill="none"><ellipse cx="30" cy="34" rx="22" ry="30" stroke={s} strokeWidth="3"/></svg>;
  if (tipo === 'redonda') return <svg width="38" height="42" viewBox="0 0 68 72" fill="none"><circle cx="34" cy="36" r="28" stroke={s} strokeWidth="3"/></svg>;
  if (tipo === 'cuadrada') return <svg width="38" height="42" viewBox="0 0 64 72" fill="none"><rect x="6" y="8" width="52" height="56" rx="14" stroke={s} strokeWidth="3"/></svg>;
  if (tipo === 'corazon') return <svg width="34" height="42" viewBox="0 0 58 72" fill="none"><path d="M29 66 C6 46 6 10 29 6 C52 10 52 46 29 66Z" stroke={s} strokeWidth="3" strokeLinejoin="round"/></svg>;
  return <svg width="30" height="42" viewBox="0 0 52 76" fill="none"><ellipse cx="26" cy="38" rx="18" ry="34" stroke={s} strokeWidth="3"/></svg>;
}

export default function Asistente({ onClose, t, lang }: { onClose: () => void; t: any; lang: string }) {
  const [paso, setPaso] = useState(1);
  const [genero, setGenero] = useState('');
  const [cara, setCara] = useState('');
  const [forma, setForma] = useState('');
  const [color, setColor] = useState('');
  const [armazones, setArmazones] = useState<Armazon[]>([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    supabase.from('armazones')
      .select('id, nombre, forma, genero, color1, precio, imagen_url, descuento_verly')
      .eq('activo', true).eq('publicar_verly', true)
      .then(({ data }) => { setArmazones((data || []) as Armazon[]); setCargado(true); });
  }, []);

  const formasRecomendadas = cara && CARA_FORMAS[cara] ? CARA_FORMAS[cara] : null;

  // Recomendación con relajación: si hay muy pocos, aflojamos filtros.
  const recomendar = (): Armazon[] => {
    const filtrar = (formaSet: string[] | null, colorReq: string) => armazones.filter(a => {
      if (genero && genero !== 'cualquiera' && a.genero !== genero && a.genero !== 'unisex') return false;
      if (formaSet && !formaSet.includes((a.forma || '').toLowerCase())) return false;
      if (colorReq === 'sobrios' && !esSobrio(a.color1)) return false;
      if (colorReq === 'llamativos' && esSobrio(a.color1)) return false;
      return true;
    });
    const formaSet = forma ? [forma] : formasRecomendadas;
    let r = filtrar(formaSet, color);
    if (r.length < 3) r = filtrar(formaSet, '');       // afloja color
    if (r.length < 3) r = filtrar(null, '');           // afloja forma
    if (r.length < 3) r = armazones;                   // muéstrame lo que haya
    return r.slice(0, 6);
  };

  const generoQS = genero && genero !== 'cualquiera' ? `&genero=${genero}` : '';
  const verTodosQS = (f?: string) => `/Tienda?tipo=optico${generoQS}${f ? `&forma=${f}` : ''}`;

  // ── Datos de cada paso ──
  const opcionesGenero = [
    { val: 'hombre', label: t('Para él', 'For him') },
    { val: 'mujer', label: t('Para ella', 'For her') },
    { val: 'cualquiera', label: t('No importa', 'Doesn\'t matter') },
  ];
  const opcionesCara = [
    { val: 'ovalada', label: t('Ovalada', 'Oval') },
    { val: 'redonda', label: t('Redonda', 'Round') },
    { val: 'cuadrada', label: t('Cuadrada', 'Square') },
    { val: 'corazon', label: t('Corazón', 'Heart') },
    { val: 'alargada', label: t('Alargada', 'Long') },
  ];
  const opcionesForma = [
    { val: 'redonda', label: t('Redondos', 'Round') },
    { val: 'cuadrada', label: t('Cuadrados', 'Square') },
    { val: 'rectangular', label: t('Rectangulares', 'Rectangle') },
    { val: 'ovalada', label: t('Ovalados', 'Oval') },
    { val: 'aviador', label: t('Aviador', 'Aviator') },
  ];
  const opcionesColor = [
    { val: 'sobrios', label: t('Sobrios', 'Subtle'), sub: t('Negro, café, gris…', 'Black, brown, gray…') },
    { val: 'llamativos', label: t('Llamativos', 'Bold'), sub: t('Colores vivos', 'Vivid colors') },
    { val: 'ambos', label: t('Ambos', 'Both'), sub: t('Muéstrame todo', 'Show me all') },
  ];

  const totalPasos = 5;
  const tituloPaso = paso === 1 ? t('¿Para quién es?', 'Who is it for?')
    : paso === 2 ? t('¿Cuál es tu tipo de cara?', 'What\'s your face shape?')
    : paso === 3 ? t('¿Qué forma te gusta?', 'Which shape do you like?')
    : paso === 4 ? t('¿Y los colores?', 'What about colors?')
    : t('Esto es para ti', 'This is for you');
  const subPaso = paso === 2 ? t('Si no sabes, elige la que más se parezca.', 'If unsure, pick the closest one.')
    : paso === 3 ? (formasRecomendadas ? t('Te marcamos las que te quedan mejor.', 'We highlight the ones that suit you.') : t('Elige tu estilo.', 'Pick your style.'))
    : '';

  const chip = (txt: string) => (
    <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '20px', padding: '3px 11px', color: 'rgba(255,255,255,0.85)' }}>{txt}</span>
  );

  const cardStyle = (activo: boolean): CSSProperties => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '9px',
    background: activo ? 'rgba(120,150,110,0.28)' : 'rgba(255,255,255,0.06)',
    border: activo ? '2px solid var(--sage)' : '1px solid rgba(255,255,255,0.15)',
    borderRadius: '14px', padding: '18px 10px', cursor: 'pointer', minHeight: '110px', color: 'white',
    fontFamily: 'var(--font-sans)',
  });

  const recomendados = paso === 5 ? recomendar() : [];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(28,28,26,0.82)', zIndex: 1000, backdropFilter: 'blur(6px)' }}/>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1001, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '1.5rem', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '640px', margin: 'auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', position: 'relative', marginBottom: '1.5rem' }}>
            <img src="/logo-trasparente.png" alt="Verly" style={{ height: '26px', opacity: 0.9, filter: 'brightness(0) invert(1)', marginBottom: '1rem' }}/>
            <button onClick={onClose} style={{ position: 'absolute', top: 0, right: 0, width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', color: 'white', fontSize: '17px' }}>×</button>
            {/* progreso */}
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '1rem' }}>
              {Array.from({ length: totalPasos }).map((_, i) => (
                <span key={i} style={{ width: '26px', height: '4px', borderRadius: '2px', background: i < paso ? 'var(--sage)' : 'rgba(255,255,255,0.25)' }}/>
              ))}
            </div>
            {/* chips de lo elegido */}
            {(genero || cara || forma || color) && (
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {genero && chip(opcionesGenero.find(o => o.val === genero)?.label || '')}
                {cara && chip(opcionesCara.find(o => o.val === cara)?.label || t('Cara', 'Face'))}
                {forma && chip(opcionesForma.find(o => o.val === forma)?.label || '')}
                {color && chip(opcionesColor.find(o => o.val === color)?.label || '')}
              </div>
            )}
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 400, color: 'white', margin: '0 0 0.35rem', lineHeight: 1.1 }}>{tituloPaso}</h2>
            {subPaso && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>{subPaso}</p>}
          </div>

          {/* Paso 1: género */}
          {paso === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              {opcionesGenero.map(o => (
                <button key={o.val} style={cardStyle(genero === o.val)} onClick={() => { setGenero(o.val); setPaso(2); }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{o.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Paso 2: cara */}
          {paso === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              {opcionesCara.map(o => (
                <button key={o.val} style={cardStyle(cara === o.val)} onClick={() => { setCara(o.val); setPaso(3); }}>
                  <Cara tipo={o.val}/>
                  <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{o.label}</span>
                </button>
              ))}
              <button style={cardStyle(false)} onClick={() => { setCara(''); setPaso(3); }}>
                <span style={{ fontSize: '1.6rem', opacity: 0.7 }}>?</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{t('No sé', 'Not sure')}</span>
              </button>
            </div>
          )}

          {/* Paso 3: forma */}
          {paso === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              {opcionesForma.map(o => {
                const reco = formasRecomendadas?.includes(o.val);
                return (
                  <button key={o.val} style={{ ...cardStyle(forma === o.val), position: 'relative' }} onClick={() => { setForma(o.val); setPaso(4); }}>
                    {reco && <span style={{ position: 'absolute', top: 6, right: 6, fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'var(--sage)', color: 'white', borderRadius: '20px', padding: '2px 7px' }}>{t('Te queda', 'Suits you')}</span>}
                    <Forma tipo={o.val}/>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{o.label}</span>
                  </button>
                );
              })}
              <button style={cardStyle(false)} onClick={() => { setForma(''); setPaso(4); }}>
                <span style={{ fontSize: '1.4rem', opacity: 0.7 }}>✧</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{t('Cualquiera', 'Any')}</span>
              </button>
            </div>
          )}

          {/* Paso 4: color */}
          {paso === 4 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              {opcionesColor.map(o => (
                <button key={o.val} style={cardStyle(color === o.val)} onClick={() => { setColor(o.val); setPaso(5); }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{o.label}</span>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.55)' }}>{o.sub}</span>
                </button>
              ))}
            </div>
          )}

          {/* Paso 5: resultados */}
          {paso === 5 && (
            <div>
              {!cargado ? (
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', padding: '2rem 0' }}>{t('Buscando tus armazones…', 'Finding your frames…')}</p>
              ) : recomendados.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', padding: '2rem 0' }}>{t('No encontramos coincidencias. Mira todo el catálogo.', 'No matches. Browse the full catalog.')}</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                  {recomendados.map(a => (
                    <Link key={a.id} href={`/armazon/${a.id}`} onClick={onClose} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none' }}>
                      <div style={{ height: '86px', background: '#f3f0ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {a.imagen_url ? <img src={a.imagen_url} alt={a.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <Forma tipo={a.forma || 'redonda'} color="#888"/>}
                      </div>
                      <div style={{ padding: '8px 10px' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'var(--font-sans)' }}>{a.nombre}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: 'var(--warm-gray)', fontFamily: 'var(--font-sans)' }}>{t('Desde', 'From')} ${a.precio}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '1.5rem' }}>
                <Link href={verTodosQS(forma || undefined)} onClick={onClose} style={{ fontSize: '0.75rem', color: 'white', fontFamily: 'var(--font-sans)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('Ver todos', 'Browse all')}</Link>
                <button onClick={() => { setGenero(''); setCara(''); setForma(''); setColor(''); setPaso(1); }} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{t('Empezar de nuevo', 'Start over')}</button>
              </div>
            </div>
          )}

          {/* Volver / saltar */}
          {paso > 1 && paso < 5 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
              <button onClick={() => setPaso(paso - 1)} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline' }}>{t('Atrás', 'Back')}</button>
              <button onClick={() => setPaso(paso + 1)} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{t('Saltar', 'Skip')} →</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
