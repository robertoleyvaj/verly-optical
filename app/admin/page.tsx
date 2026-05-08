'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabase';

export default function Admin() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [armazones, setArmazones] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [tab, setTab] = useState('armazones');
  const [loading, setLoading] = useState(false);

  // Form nuevo armazón
  const [form, setForm] = useState({ nombre: '', forma: '', genero: '', stock: 10, badge: '', activo: true, precio: 43, color: '#1A1A2E' });
  const [editId, setEditId] = useState<number | null>(null);

  const login = () => {
    if (usuario === 'admin@verlyoptical.com' && password === 'verly2024') {
      setAutenticado(true);
      cargarDatos();
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const cargarDatos = async () => {
    setLoading(true);
    const { data: a } = await supabase.from('armazones').select('*').order('id');
    const { data: p } = await supabase.from('pedidos').select('*').order('created_at', { ascending: false });
    setArmazones(a || []);
    setPedidos(p || []);
    setLoading(false);
  };

  const guardarArmazon = async () => {
    if (!form.nombre) return alert('El nombre es requerido');
    if (editId) {
      await supabase.from('armazones').update(form).eq('id', editId);
    } else {
      await supabase.from('armazones').insert(form);
    }
    setForm({ nombre: '', forma: '', genero: '', stock: 10, badge: '', activo: true, precio: 43, color: '#1A1A2E' });
    setEditId(null);
    cargarDatos();
  };

  const eliminarArmazon = async (id: number) => {
    if (!confirm('¿Eliminar este armazón?')) return;
    await supabase.from('armazones').delete().eq('id', id);
    cargarDatos();
  };

  const editarArmazon = (a: any) => {
    setForm({ nombre: a.nombre, forma: a.forma, genero: a.genero, stock: a.stock, badge: a.badge || '', activo: a.activo, precio: a.precio, color: a.color || '#1A1A2E' });
    setEditId(a.id);
    setTab('armazones');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: '6px',
    border: '1.5px solid #E2E8F0', fontSize: '14px',
    fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box',
  };

  if (!autenticado) return (
    <main style={{ fontFamily: 'sans-serif', background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', width: '360px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#2BBFB3' }}>Verly</span>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#F5C518', letterSpacing: '2px' }}>ADMIN</span>
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '1.5rem', color: '#1A1A2E' }}>Panel de administración</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6478', display: 'block', marginBottom: '4px' }}>USUARIO</label>
          <input type="email" value={usuario} onChange={e => setUsuario(e.target.value)} style={inputStyle} placeholder="admin@verlyoptical.com"/>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6478', display: 'block', marginBottom: '4px' }}>CONTRASEÑA</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} style={inputStyle} placeholder="••••••••"/>
        </div>
        <button onClick={login} style={{ width: '100%', background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>
          Entrar
        </button>
      </div>
    </main>
  );

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* NAVBAR ADMIN */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#2BBFB3' }}>Verly</span>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#F5C518', letterSpacing: '2px' }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '13px', color: '#5A6478', textDecoration: 'none' }}>← Ver sitio</a>
          <button onClick={() => setAutenticado(false)} style={{ fontSize: '13px', color: '#E05A5A', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'sans-serif' }}>Salir</button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
        {/* TABS */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {['armazones', 'pedidos'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: '6px', border: '1.5px solid',
              borderColor: tab === t ? '#2BBFB3' : '#E2E8F0',
              background: tab === t ? '#2BBFB3' : 'white',
              color: tab === t ? 'white' : '#5A6478',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif',
              textTransform: 'capitalize',
            }}>
              {t === 'armazones' ? `Armazones (${armazones.length})` : `Pedidos (${pedidos.length})`}
            </button>
          ))}
        </div>

        {/* ARMAZONES */}
        {tab === 'armazones' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
            {/* Lista */}
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    {['ID', 'Nombre', 'Forma', 'Género', 'Precio', 'Stock', 'Activo', 'Acciones'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#5A6478', textAlign: 'left', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {armazones.map((a, i) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #F0F0F0', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#7A8494' }}>{a.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{a.nombre}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#5A6478', textTransform: 'capitalize' }}>{a.forma}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#5A6478', textTransform: 'capitalize' }}>{a.genero}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#2BBFB3' }}>${a.precio}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>{a.stock}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: a.activo ? '#E0F7F4' : '#FFE8E8', color: a.activo ? '#2BBFB3' : '#E05A5A', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                          {a.activo ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => editarArmazon(a)} style={{ fontSize: '12px', color: '#2BBFB3', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'sans-serif' }}>Editar</button>
                          <button onClick={() => eliminarArmazon(a.id)} style={{ fontSize: '12px', color: '#E05A5A', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'sans-serif' }}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Formulario */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '1.25rem', color: '#1A1A2E' }}>
                {editId ? `Editando #${editId}` : 'Nuevo armazón'}
              </h3>
              {[
                { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ej: Clásico Negro' },
                { key: 'forma', label: 'Forma', type: 'text', placeholder: 'cuadrada / ovalada / rectangular' },
                { key: 'genero', label: 'Género', type: 'text', placeholder: 'hombre / mujer / unisex' },
                { key: 'badge', label: 'Badge (opcional)', type: 'text', placeholder: 'Nuevo / Popular / Favorito' },
                { key: 'precio', label: 'Precio ($)', type: 'number', placeholder: '43' },
                { key: 'stock', label: 'Stock', type: 'number', placeholder: '10' },
                { key: 'color', label: 'Color hex', type: 'text', placeholder: '#1A1A2E' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#5A6478', display: 'block', marginBottom: '3px', letterSpacing: '0.5px' }}>{f.label.toUpperCase()}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={form.activo} onChange={e => setForm(prev => ({ ...prev, activo: e.target.checked }))} id="activo"/>
                <label htmlFor="activo" style={{ fontSize: '13px', fontWeight: 600, color: '#5A6478' }}>Activo (visible en tienda)</label>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={guardarArmazon} style={{ flex: 1, background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>
                  {editId ? 'Guardar cambios' : 'Agregar'}
                </button>
                {editId && (
                  <button onClick={() => { setEditId(null); setForm({ nombre: '', forma: '', genero: '', stock: 10, badge: '', activo: true, precio: 43, color: '#1A1A2E' }); }} style={{ background: 'none', border: '1.5px solid #E2E8F0', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif', color: '#5A6478' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PEDIDOS */}
        {tab === 'pedidos' && (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {pedidos.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#7A8494' }}>No hay pedidos aún.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    {['ID', 'Fecha', 'Items', 'Total', 'Estado'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#5A6478', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F0F0F0', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#7A8494' }}>{p.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>{new Date(p.created_at).toLocaleDateString('es-MX')}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.items}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#2BBFB3' }}>${p.total}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: '#E0F7F4', color: '#2BBFB3', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                          {p.status || 'pagado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </main>
  );
}