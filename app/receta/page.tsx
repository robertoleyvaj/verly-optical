'use client';
import { useState } from 'react';

export default function Receta() {
  const [tipo, setTipo] = useState<'manual' | 'foto' | null>(null);
  const [form, setForm] = useState({
    odEsfera: '', odCilindro: '', odEje: '', odAdd: '',
    oiEsfera: '', oiCilindro: '', oiEje: '', oiAdd: '',
    dip: '', notas: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = () => {
    if (!form.odEsfera && !form.oiEsfera) {
      alert('Por favor ingresa al menos la esfera de un ojo');
      return;
    }
    setEnviado(true);
  };

  if (enviado) return (
    <main style={{fontFamily: 'sans-serif', background: '#FAF7F2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: 'white', borderRadius: '20px', padding: '3rem', maxWidth: '480px', width: '100%', textAlign: 'center', border: '1px solid #E2E8F0'}}>
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>✅</div>
        <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#2BBFB3', marginBottom: '0.75rem'}}>¡Receta guardada!</h2>
        <p style={{color: '#4A5568', marginBottom: '1.5rem'}}>Tu graduación ha sido registrada. Ahora puedes continuar eligiendo tu armazón.</p>
        <a href="/Tienda" style={{display: 'inline-block', background: '#2BBFB3', color: 'white', borderRadius: '30px', padding: '13px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none'}}>
          Elegir mi armazón →
        </a>
      </div>
    </main>
  );

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

      <div style={{maxWidth: '680px', margin: '0 auto', padding: '2rem'}}>
        <h1 style={{fontSize: '1.8rem', fontWeight: 800, color: '#2BBFB3', textAlign: 'center', marginBottom: '0.5rem'}}>Tu Graduación</h1>
        <p style={{color: '#4A5568', textAlign: 'center', marginBottom: '2rem'}}>Ingresa tu receta médica para que hagamos tus lentes perfectos</p>

        {/* SELECTOR */}
        {!tipo && (
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem'}}>
            <div onClick={() => setTipo('manual')} style={{background: 'white', borderRadius: '16px', border: '2px solid #E2E8F0', padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'}}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#2BBFB3'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'}>
              <div style={{fontSize: '2.5rem', marginBottom: '0.75rem'}}>📝</div>
              <div style={{fontSize: '16px', fontWeight: 700, marginBottom: '4px'}}>Ingresar manualmente</div>
              <div style={{fontSize: '13px', color: '#4A5568'}}>Escribe los números de tu receta</div>
            </div>
            <div onClick={() => setTipo('foto')} style={{background: 'white', borderRadius: '16px', border: '2px solid #E2E8F0', padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'}}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#2BBFB3'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'}>
              <div style={{fontSize: '2.5rem', marginBottom: '0.75rem'}}>📷</div>
              <div style={{fontSize: '16px', fontWeight: 700, marginBottom: '4px'}}>Subir foto</div>
              <div style={{fontSize: '13px', color: '#4A5568'}}>Toma foto de tu receta médica</div>
            </div>
          </div>
        )}

        {/* MANUAL */}
        {tipo === 'manual' && (
          <div style={{background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem'}}>
              <button onClick={() => setTipo(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#2BBFB3', fontSize: '18px'}}>←</button>
              <h2 style={{fontSize: '16px', fontWeight: 700}}>Ingresa tu graduación</h2>
            </div>

            {/* AYUDA */}
            <div style={{background: '#E0F7F4', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', fontSize: '13px', color: '#1a9990'}}>
              💡 <strong>¿Cómo leer tu receta?</strong> Busca los valores SPH (Esfera), CYL (Cilindro) y AXIS (Eje) para cada ojo. OD = Ojo Derecho, OI = Ojo Izquierdo.
            </div>

            {/* OJO DERECHO */}
            <div style={{marginBottom: '1.5rem'}}>
              <div style={{fontSize: '14px', fontWeight: 700, color: '#2BBFB3', marginBottom: '0.75rem'}}>👁 Ojo Derecho (OD)</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem'}}>
                {[
                  { label: 'Esfera (SPH)', key: 'odEsfera', placeholder: 'Ej: -2.25' },
                  { label: 'Cilindro (CYL)', key: 'odCilindro', placeholder: 'Ej: -0.50' },
                  { label: 'Eje (AXIS)', key: 'odEje', placeholder: 'Ej: 180' },
                  { label: 'Adición (ADD)', key: 'odAdd', placeholder: 'Ej: +2.00' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{fontSize: '11px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '4px', textTransform: 'uppercase'}}>{f.label}</label>
                    <input value={form[f.key as keyof typeof form]} onChange={e => setForm({...form, [f.key]: e.target.value})} placeholder={f.placeholder} style={{width: '100%', padding: '9px 10px', border: '1.5px solid #E2E8F0', borderRadius: '9px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none'}} />
                  </div>
                ))}
              </div>
            </div>

            {/* OJO IZQUIERDO */}
            <div style={{marginBottom: '1.5rem'}}>
              <div style={{fontSize: '14px', fontWeight: 700, color: '#2BBFB3', marginBottom: '0.75rem'}}>👁 Ojo Izquierdo (OI)</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem'}}>
                {[
                  { label: 'Esfera (SPH)', key: 'oiEsfera', placeholder: 'Ej: -1.75' },
                  { label: 'Cilindro (CYL)', key: 'oiCilindro', placeholder: 'Ej: -0.25' },
                  { label: 'Eje (AXIS)', key: 'oiEje', placeholder: 'Ej: 175' },
                  { label: 'Adición (ADD)', key: 'oiAdd', placeholder: 'Ej: +2.00' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{fontSize: '11px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '4px', textTransform: 'uppercase'}}>{f.label}</label>
                    <input value={form[f.key as keyof typeof form]} onChange={e => setForm({...form, [f.key]: e.target.value})} placeholder={f.placeholder} style={{width: '100%', padding: '9px 10px', border: '1.5px solid #E2E8F0', borderRadius: '9px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none'}} />
                  </div>
                ))}
              </div>
            </div>

            {/* DIP Y NOTAS */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.5rem'}}>
              <div>
                <label style={{fontSize: '11px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '4px', textTransform: 'uppercase'}}>DIP (mm)</label>
                <input value={form.dip} onChange={e => setForm({...form, dip: e.target.value})} placeholder="Ej: 63" style={{width: '100%', padding: '9px 10px', border: '1.5px solid #E2E8F0', borderRadius: '9px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none'}} />
              </div>
              <div>
                <label style={{fontSize: '11px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '4px', textTransform: 'uppercase'}}>Notas adicionales</label>
                <input value={form.notas} onChange={e => setForm({...form, notas: e.target.value})} placeholder="Cualquier indicación especial..." style={{width: '100%', padding: '9px 10px', border: '1.5px solid #E2E8F0', borderRadius: '9px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none'}} />
              </div>
            </div>

            <button onClick={handleSubmit} style={{width: '100%', background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '28px', padding: '15px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif'}}>
              Guardar Graduación ✓
            </button>
          </div>
        )}

        {/* FOTO */}
        {tipo === 'foto' && (
          <div style={{background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem'}}>
              <button onClick={() => setTipo(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#2BBFB3', fontSize: '18px'}}>←</button>
              <h2 style={{fontSize: '16px', fontWeight: 700}}>Sube foto de tu receta</h2>
            </div>
            <div style={{border: '2px dashed #E2E8F0', borderRadius: '14px', padding: '3rem', textAlign: 'center', marginBottom: '1.5rem', background: '#FAFBFC'}}>
              <div style={{fontSize: '3rem', marginBottom: '0.75rem'}}>📷</div>
              <div style={{fontSize: '15px', fontWeight: 600, marginBottom: '4px'}}>Arrastra tu foto aquí</div>
              <div style={{fontSize: '13px', color: '#8A97A8', marginBottom: '1rem'}}>JPG, PNG o PDF — máximo 5MB</div>
              <input type="file" accept="image/*,.pdf" style={{display: 'none'}} id="file-input" onChange={() => setEnviado(true)} />
              <label htmlFor="file-input" style={{background: '#2BBFB3', color: 'white', borderRadius: '20px', padding: '10px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer'}}>
                Seleccionar archivo
              </label>
            </div>
            <div style={{background: '#FFF9E6', borderRadius: '12px', padding: '1rem', fontSize: '13px', color: '#856404'}}>
              💡 <strong>Tip:</strong> Asegúrate que la foto sea clara y se vean bien todos los números de tu receta.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}