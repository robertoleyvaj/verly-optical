export default function Gracias() {
  return (
    <main style={{fontFamily: 'sans-serif', background: '#FAF7F2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: 'white', borderRadius: '20px', padding: '3rem', maxWidth: '480px', width: '100%', textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 8px 32px rgba(0,0,0,.08)'}}>
        <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🎉</div>
        <h1 style={{fontSize: '1.8rem', fontWeight: 800, color: '#2BBFB3', marginBottom: '0.75rem'}}>¡Gracias por tu pedido!</h1>
        <p style={{color: '#4A5568', fontSize: '15px', marginBottom: '1.5rem', lineHeight: 1.7}}>
          Hemos recibido tu pago correctamente. En breve recibirás un correo de confirmación con los detalles de tu pedido.
        </p>
        <div style={{background: '#E0F7F4', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem'}}>
          <div style={{fontSize: '13px', color: '#1a9990', fontWeight: 600}}>⏱ Tu pedido estará listo en 3–5 días hábiles</div>
        </div>
        <a href="/" style={{display: 'inline-block', background: '#2BBFB3', color: 'white', borderRadius: '30px', padding: '13px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none'}}>
          Volver al inicio
        </a>
      </div>
    </main>
  );
}