'use client';
import { useState } from 'react';

const visionOpts = [
  { id: 'mono', nombre: 'Monofocal', desc: 'Para ver de lejos o cerca (una sola distancia).', precio: 5 },
  { id: 'bi', nombre: 'Bifocal', desc: 'Con línea visible, para lejos y cerca.', precio: 13 },
  { id: 'prog', nombre: 'Progresivo', desc: 'Sin línea, ve lejos, intermedio y cerca.', precio: 48 },
];

const materialOpts = [
  { id: 'cr39', nombre: 'CR-39', desc: 'Plástico básico, económico.', precio: 0 },
  { id: 'poly', nombre: 'PolyPlus', desc: 'Policarbonato, más resistente.', precio: 29 },
  { id: 'hd', nombre: 'HD Vision', desc: 'Más claro y delgado que CR-39.', precio: 39 },
  { id: 'hi', nombre: 'Hi-Index 1.67', desc: 'Para graduaciones altas.', precio: 59 },
  { id: 'shi', nombre: 'Súper Hi-Index 1.74', desc: 'El más delgado y estético.', precio: 89 },
];

const filtroOpts = [
  { id: 'ar', nombre: 'AR Normal', desc: 'Antirreflejante estándar.', precio: 9 },
  { id: 'blue', nombre: 'Blue Light', desc: 'Protección contra pantallas.', precio: 17 },
  { id: 'foto', nombre: 'Fotocromático', desc: 'Se oscurece con el sol.', precio: 39 },
  { id: 'anti', nombre: 'Antiempañante', desc: 'Evita que se empañen.', precio: 15 },
  { id: 'pol', nombre: 'Polarizado', desc: 'Ideal para manejar.', precio: 89 },
  { id: 'tinte', nombre: 'Tinte estético', desc: 'Colores (gris, café, etc.)', precio: 28 },
];

export default function Configurador() {
  const [paso, setPaso] = useState(1);
  const [vision, setVision] = useState('');
  const [material, setMaterial] = useState('');
  const [filtros, setFiltros] = useState<string[]>([]);

  const precioArmazon = 43;
  const precioVision = visionOpts.find(v => v.id === vision)?.precio || 0;
  const precioMaterial = materialOpts.find(m => m.id === material)?.precio || 0;
  const precioFiltros = filtroOpts.filter(f => filtros.includes(f.id)).reduce((a, f) => a + f.precio, 0);
  const total = precioArmazon + precioVision + precioMaterial + precioFiltros;

  const toggleFiltro = (id: string) => {
    setFiltros(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const pasos = ['Visión', 'Material', 'Filtros', 'Resumen'];

  return (
    <main style={{fontFamily: 'sans-serif', background: '#FAF7F2', minHeight: '100vh'}}>

      {/* NAV */}
      <nav style={{background: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '66px', position: 'sticky', top: 0, zIndex: 100}}>
        <a href="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px'}}>
          <span style={{fontSize: '20px', fontWeight: 800, color: '#2BBFB3'}}>Verly</span>
          <span style={{fontSize: '10px', fontWeight: 700, color: '#F5C518', letterSpacing: '2px'}}>OPTICAL</span>
        </a>
        <div style={{display: 'flex', gap: '2rem'}}>
          <a href="/" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500}}>Inicio</a>
          <a href="/Tienda" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500}}>Tienda</a>
        </div>
      </nav>

      <div style={{maxWidth: '700px', margin: '0 auto', padding: '2rem'}}>
        <h1 style={{fontSize: '1.8rem', fontWeight: 800, color: '#2BBFB3', textAlign: 'center', marginBottom: '0.5rem'}}>Arma tus Lentes</h1>
        <p style={{color: '#4A5568', textAlign: 'center', marginBottom: '2rem'}}>Paso a paso — elige lo que mejor te quede</p>

        {/* PROGRESS BAR */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', gap: '0'}}>
          {pasos.map((p, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'}}>
                <div style={{width: '36px', height: '36px', borderRadius: '50%', background: paso > i + 1 ? '#2BBFB3' : paso === i + 1 ? 'white' : 'white', border: paso >= i + 1 ? '2.5px solid #2BBFB3' : '2.5px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', color: paso > i + 1 ? 'white' : paso === i + 1 ? '#2BBFB3' : '#8A97A8'}}>
                  {paso > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{fontSize: '10px', fontWeight: 600, color: paso >= i + 1 ? '#2BBFB3' : '#8A97A8'}}>{p}</span>
              </div>
              {i < pasos.length - 1 && <div style={{width: '60px', height: '2px', background: paso > i + 1 ? '#2BBFB3' : '#E2E8F0', marginBottom: '18px'}}></div>}
            </div>
          ))}
        </div>

        {/* PASO 1: VISION */}
        {paso === 1 && (
          <div style={{background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem'}}>
            <h2 style={{fontSize: '16px', fontWeight: 700, marginBottom: '4px'}}>Paso 1: Tipo de Visión</h2>
            <p style={{fontSize: '13px', color: '#4A5568', marginBottom: '1.25rem'}}>¿Cómo ves? Elige la opción que mejor te describe.</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {visionOpts.map(o => (
                <div key={o.id} onClick={() => setVision(o.id)} style={{border: vision === o.id ? '2px solid #2BBFB3' : '2px solid #E2E8F0', borderRadius: '12px', padding: '1rem', cursor: 'pointer', background: vision === o.id ? '#E0F7F4' : 'white', transition: 'all 0.2s'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <div style={{fontSize: '15px', fontWeight: 700}}>{o.nombre}</div>
                      <div style={{fontSize: '12px', color: '#4A5568', marginTop: '2px'}}>{o.desc}</div>
                    </div>
                    <div style={{fontSize: '15px', fontWeight: 700, color: '#2BBFB3'}}>+${o.precio}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem'}}>
              <button onClick={() => vision && setPaso(2)} style={{background: vision ? '#2BBFB3' : '#E2E8F0', color: vision ? 'white' : '#8A97A8', border: 'none', borderRadius: '24px', padding: '11px 28px', fontSize: '14px', fontWeight: 700, cursor: vision ? 'pointer' : 'not-allowed'}}>
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: MATERIAL */}
        {paso === 2 && (
          <div style={{background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem'}}>
            <h2 style={{fontSize: '16px', fontWeight: 700, marginBottom: '4px'}}>Paso 2: Material de la Mica</h2>
            <p style={{fontSize: '13px', color: '#4A5568', marginBottom: '1.25rem'}}>El material afecta el grosor y peso de tu lente.</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {materialOpts.map(o => (
                <div key={o.id} onClick={() => setMaterial(o.id)} style={{border: material === o.id ? '2px solid #2BBFB3' : '2px solid #E2E8F0', borderRadius: '12px', padding: '1rem', cursor: 'pointer', background: material === o.id ? '#E0F7F4' : 'white', transition: 'all 0.2s'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <div style={{fontSize: '15px', fontWeight: 700}}>{o.nombre}</div>
                      <div style={{fontSize: '12px', color: '#4A5568', marginTop: '2px'}}>{o.desc}</div>
                    </div>
                    <div style={{fontSize: '15px', fontWeight: 700, color: '#2BBFB3'}}>{o.precio === 0 ? 'Incluido' : `+$${o.precio}`}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem'}}>
              <button onClick={() => setPaso(1)} style={{background: 'none', border: '1.5px solid #E2E8F0', borderRadius: '24px', padding: '10px 22px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#4A5568'}}>← Atrás</button>
              <button onClick={() => material && setPaso(3)} style={{background: material ? '#2BBFB3' : '#E2E8F0', color: material ? 'white' : '#8A97A8', border: 'none', borderRadius: '24px', padding: '11px 28px', fontSize: '14px', fontWeight: 700, cursor: material ? 'pointer' : 'not-allowed'}}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* PASO 3: FILTROS */}
        {paso === 3 && (
          <div style={{background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem'}}>
            <h2 style={{fontSize: '16px', fontWeight: 700, marginBottom: '4px'}}>Paso 3: Filtros y Protecciones</h2>
            <p style={{fontSize: '13px', color: '#4A5568', marginBottom: '1.25rem'}}>Opcionales. Puedes elegir uno o más.</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {filtroOpts.map(o => (
                <div key={o.id} onClick={() => toggleFiltro(o.id)} style={{border: filtros.includes(o.id) ? '2px solid #2BBFB3' : '2px solid #E2E8F0', borderRadius: '12px', padding: '1rem', cursor: 'pointer', background: filtros.includes(o.id) ? '#E0F7F4' : 'white', transition: 'all 0.2s'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <div style={{width: '20px', height: '20px', borderRadius: '4px', border: '2px solid', borderColor: filtros.includes(o.id) ? '#2BBFB3' : '#E2E8F0', background: filtros.includes(o.id) ? '#2BBFB3' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700, flexShrink: 0}}>
                        {filtros.includes(o.id) ? '✓' : ''}
                      </div>
                      <div>
                        <div style={{fontSize: '14px', fontWeight: 700}}>{o.nombre}</div>
                        <div style={{fontSize: '12px', color: '#4A5568'}}>{o.desc}</div>
                      </div>
                    </div>
                    <div style={{fontSize: '14px', fontWeight: 700, color: '#2BBFB3'}}>+${o.precio}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem'}}>
              <button onClick={() => setPaso(2)} style={{background: 'none', border: '1.5px solid #E2E8F0', borderRadius: '24px', padding: '10px 22px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#4A5568'}}>← Atrás</button>
              <button onClick={() => setPaso(4)} style={{background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '24px', padding: '11px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer'}}>Ver Resumen →</button>
            </div>
          </div>
        )}

        {/* PASO 4: RESUMEN */}
        {paso === 4 && (
          <div style={{background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem'}}>
            <h2 style={{fontSize: '16px', fontWeight: 700, marginBottom: '1.25rem'}}>Paso 4: Resumen de tu Pedido</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E2E8F0', fontSize: '14px'}}><span>Armazón</span><span style={{fontWeight: 600}}>${precioArmazon}</span></div>
              <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E2E8F0', fontSize: '14px'}}><span>Visión: {visionOpts.find(v => v.id === vision)?.nombre}</span><span style={{fontWeight: 600}}>+${precioVision}</span></div>
              <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E2E8F0', fontSize: '14px'}}><span>Material: {materialOpts.find(m => m.id === material)?.nombre}</span><span style={{fontWeight: 600}}>{precioMaterial === 0 ? 'Incluido' : `+$${precioMaterial}`}</span></div>
              {filtroOpts.filter(f => filtros.includes(f.id)).map(f => (
                <div key={f.id} style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E2E8F0', fontSize: '14px'}}><span>{f.nombre}</span><span style={{fontWeight: 600}}>+${f.precio}</span></div>
              ))}
              <div style={{display: 'flex', justifyContent: 'space-between', padding: '14px 0', fontSize: '18px', fontWeight: 800, color: '#2BBFB3'}}><span>TOTAL</span><span>${total} USD</span></div>
            </div>
            <button style={{width: '100%', background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '28px', padding: '15px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem'}}>
              Añadir al Carrito 🛍
            </button>
            <button onClick={() => setPaso(3)} style={{width: '100%', background: 'none', border: '1.5px solid #E2E8F0', borderRadius: '28px', padding: '13px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#4A5568', marginTop: '10px'}}>← Volver</button>
          </div>
        )}
      </div>
    </main>
  );
}