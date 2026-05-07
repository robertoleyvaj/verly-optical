'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Tienda() {
  const [armazones, setArmazones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('Todo');

  useEffect(() => {
    loadArmazones();
  }, []);

  const loadArmazones = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('armazones')
      .select('*')
      .eq('activo', true)
      .order('id');
    if (data) setArmazones(data);
    if (error) console.error(error);
    setLoading(false);
  };

  const filtros = ['Todo', 'Mujer', 'Hombre', 'Unisex', 'Redondo', 'Cuadrado', 'Cat-Eye', 'Aviador'];

  const filtrados = armazones.filter(a => {
    if (filtro === 'Todo') return true;
    return a.genero === filtro || a.forma === filtro;
  });

  const badgeColor: Record<string, string> = {
    'Novedad': '#2BBFB3',
    'Bestseller': '#FF9F1C',
    'Oferta': '#E53E3E',
  };

  const bgColors = ['#FFE4E8', '#FFF3CC', '#E8F4FF', '#E0F7F4'];

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
          <a href="/Tienda" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 700, borderBottom: '2px solid #2BBFB3'}}>Tienda</a>
          <a href="#" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500}}>FAQ</a>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{padding: '3rem 2rem 1rem', textAlign: 'center'}}>
        <h1 style={{fontSize: '2rem', fontWeight: 800, color: '#2BBFB3', marginBottom: '0.5rem'}}>Nuestra Tienda</h1>
        <p style={{color: '#4A5568', fontSize: '15px'}}>Elige tu armazón favorito y arma tus lentes a tu medida</p>
      </div>

      {/* FILTROS */}
      <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', padding: '1rem 2rem'}}>
        {filtros.map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{padding: '8px 18px', borderRadius: '20px', border: `1.5px solid ${filtro === f ? '#2BBFB3' : '#E2E8F0'}`, background: filtro === f ? '#2BBFB3' : 'white', color: filtro === f ? 'white' : '#4A5568', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif', transition: 'all 0.2s'}}>
            {f}
          </button>
        ))}
      </div>

      {/* PRODUCTOS */}
      <div style={{padding: '1.5rem 2rem', maxWidth: '1200px', margin: '0 auto'}}>
        {loading && (
          <div style={{textAlign: 'center', padding: '4rem', color: '#8A97A8'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>👓</div>
            <div>Cargando armazones...</div>
          </div>
        )}
        {!loading && filtrados.length === 0 && (
          <div style={{textAlign: 'center', padding: '4rem', color: '#8A97A8'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>😕</div>
            <div style={{fontWeight: 600, marginBottom: '8px'}}>No hay armazones disponibles</div>
            <div style={{fontSize: '13px'}}>Pronto agregaremos nuevos modelos</div>
          </div>
        )}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem'}}>
          {filtrados.map((a, i) => (
            <div key={a.id} style={{background: 'white', borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s'}}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(43,191,179,.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>

              {/* IMAGEN */}
              <div style={{height: '200px', background: bgColors[i % bgColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                <span style={{fontSize: '4rem'}}>👓</span>
                {a.badge && (
                  <div style={{position: 'absolute', top: '10px', left: '10px', background: badgeColor[a.badge] || '#2BBFB3', color: 'white', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px'}}>
                    {a.badge}
                  </div>
                )}
              </div>

              {/* INFO */}
              <div style={{padding: '1.1rem'}}>
                <div style={{fontSize: '16px', fontWeight: 700, marginBottom: '4px'}}>{a.nombre}</div>
                <div style={{fontSize: '12px', color: '#8A97A8', marginBottom: '14px'}}>{a.forma} · {a.genero}</div>
                <a href="/configurador2" style={{display: 'block', width: '100%', background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '20px', padding: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif', textAlign: 'center', textDecoration: 'none'}}>
                  Elegir este armazón →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}