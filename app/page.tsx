'use client';
import Navbar from './components/Navbar';
import { useLang } from './components/LanguageContext';

export default function Home() {
  const { t } = useLang();

  return (
    <main style={{fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#FAF7F2'}}>

      <Navbar />

      {/* HERO */}
      <div style={{background: 'linear-gradient(135deg, #FDF6EE 0%, #E0F7F4 100%)', padding: '4rem 2rem', textAlign: 'center'}}>
        <div style={{background: '#F5C518', color: '#1A1A2E', display: 'inline-block', padding: '8px 20px', borderRadius: '30px', fontWeight: 700, marginBottom: '1.5rem'}}>
          🔥 {t('¡Arma tus lentes desde solo $5 USD!', 'Build your lenses from just $5 USD!')}
        </div>
        <h1 style={{fontSize: '3rem', fontWeight: 800, color: '#2BBFB3', marginBottom: '1rem', lineHeight: 1.1}}>
          {t('Tu Visión Perfecta,', 'Your Perfect Vision,')} <br/>
          {t('Nuestro Diseño Único.', 'Our Unique Design.')}
        </h1>
        <p style={{fontSize: '16px', color: '#4A5568', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem'}}>
          {t('Lentes ópticos a tu medida, entrega rápida a California. Sin aseguranza.', 'Custom optical lenses, fast delivery to California. No insurance needed.')}
        </p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="/Tienda" style={{background: '#2BBFB3', color: 'white', borderRadius: '30px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block'}}>
            {t('Explorar Lentes', 'Explore Lenses')}
          </a>
          <a href="/receta" style={{background: 'transparent', color: '#2BBFB3', border: '2px solid #2BBFB3', borderRadius: '30px', padding: '12px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block'}}>
            {t('Ingresar mi Receta', 'Enter My Prescription')}
          </a>
        </div>
      </div>

      {/* BARRA DE CONFIANZA */}
      <div style={{background: 'white', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '1.2rem 2rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap'}}>
        <span style={{color: '#4A5568', fontSize: '13px', fontWeight: 500}}>✓ {t('Desde $5 USD', 'From $5 USD')}</span>
        <span style={{color: '#4A5568', fontSize: '13px', fontWeight: 500}}>✓ {t('Entrega 3–5 días', 'Delivery 3–5 days')}</span>
        <span style={{color: '#4A5568', fontSize: '13px', fontWeight: 500}}>✓ {t('Sin aseguranza', 'No insurance needed')}</span>
        <span style={{color: '#4A5568', fontSize: '13px', fontWeight: 500}}>✓ {t('30 días de devolución', '30-day returns')}</span>
      </div>

      {/* COLECCIONES */}
      <div style={{padding: '4rem 2rem', maxWidth: '1180px', margin: '0 auto'}}>
        <h2 style={{fontSize: '2rem', fontWeight: 800, color: '#2BBFB3', textAlign: 'center', marginBottom: '2.5rem'}}>
          {t('Nuestras Colecciones', 'Our Collections')}
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem'}}>
          {[
            { emoji: '👓', es: 'Lentes para Ella', en: 'For Her', desc_es: 'Elegancia y estilo en cada diseño.', desc_en: 'Elegance and style in every design.', bg: 'linear-gradient(135deg, #FFD6DC, #FFB8C4)' },
            { emoji: '🕶️', es: 'Estilo Masculino', en: "Men's Style", desc_es: 'Sofisticación y carácter.', desc_en: 'Sophistication and character.', bg: 'linear-gradient(135deg, #B3F0EB, #7DE8E0)' },
            { emoji: '✨', es: 'Últimos Diseños', en: 'Latest Designs', desc_es: 'Descubre lo más reciente.', desc_en: 'Discover the latest.', bg: 'linear-gradient(135deg, #E8F4FF, #B3D4FF)' },
            { emoji: '⭐', es: 'Los Favoritos', en: 'Favorites', desc_es: 'Nuestras opciones más populares.', desc_en: 'Our most popular options.', bg: 'linear-gradient(135deg, #FFE8C8, #FFDDB3)' },
          ].map((c, i) => (
            <a key={i} href="/Tienda" style={{textDecoration: 'none', color: 'inherit'}}>
              <div style={{background: 'white', borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', cursor: 'pointer'}}>
                <div style={{height: '180px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>{c.emoji}</div>
                <div style={{padding: '1.25rem'}}>
                  <div style={{fontSize: '17px', fontWeight: 700, marginBottom: '4px'}}>{t(c.es, c.en)}</div>
                  <div style={{fontSize: '13px', color: '#4A5568', marginBottom: '12px'}}>{t(c.desc_es, c.desc_en)}</div>
                  <div style={{color: '#2BBFB3', fontSize: '13px', fontWeight: 700}}>{t('Explorar Lentes ›', 'Explore Lenses ›')}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <div style={{background: 'white', padding: '4rem 2rem'}}>
        <h2 style={{fontSize: '2rem', fontWeight: 800, color: '#2BBFB3', textAlign: 'center', marginBottom: '2.5rem'}}>
          {t('¿Cómo funciona?', 'How does it work?')}
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto'}}>
          {[
            { num: '1', es: 'Elige tu armazón', en: 'Choose your frame', desc_es: 'Explora más de 60 estilos.', desc_en: 'Explore 60+ styles.', link: '/Tienda' },
            { num: '2', es: 'Ingresa tu receta', en: 'Enter your prescription', desc_es: 'Manual o foto en 1 minuto.', desc_en: 'Manual or photo in 1 minute.', link: '/receta' },
            { num: '3', es: 'Arma tus lentes', en: 'Build your lenses', desc_es: 'Elige material y filtros.', desc_en: 'Choose material and filters.', link: '/configurador2' },
            { num: '4', es: 'Recíbelos en casa', en: 'Receive at home', desc_es: 'Entrega en 3-5 días a California.', desc_en: 'Delivery in 3-5 days to California.', link: '/Tienda' },
          ].map((s, i) => (
            <a key={i} href={s.link} style={{textDecoration: 'none'}}>
              <div style={{textAlign: 'center', padding: '1.5rem', border: '1px solid #E2E8F0', borderRadius: '16px', cursor: 'pointer'}}>
                <div style={{width: '44px', height: '44px', background: '#2BBFB3', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, margin: '0 auto 1rem'}}>{s.num}</div>
                <div style={{fontSize: '15px', fontWeight: 600, marginBottom: '6px', color: '#1A1A2E'}}>{t(s.es, s.en)}</div>
                <div style={{fontSize: '13px', color: '#4A5568'}}>{t(s.desc_es, s.desc_en)}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* BANNER PROMO */}
      <div style={{background: '#1a9990', color: 'white', textAlign: 'center', padding: '3rem 2rem'}}>
        <h2 style={{fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem'}}>
          {t('Tu primer par. Nuestro mejor precio.', 'Your first pair. Our best price.')}
        </h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem'}}>
          {t('Usa el código ', 'Use code ')}<strong>VERLY10</strong>{t(' y obtén 10% de descuento.', ' for 10% off your first order.')}
        </p>
        <a href="/Tienda" style={{background: 'white', color: '#1a9990', borderRadius: '30px', padding: '13px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block'}}>
          {t('Ir a la tienda', 'Go to store')}
        </a>
      </div>

      {/* FAQ */}
      <div id="faq" style={{padding: '4rem 2rem', maxWidth: '700px', margin: '0 auto'}}>
        <h2 style={{fontSize: '2rem', fontWeight: 800, color: '#2BBFB3', textAlign: 'center', marginBottom: '2rem'}}>
          {t('Preguntas frecuentes', 'Frequently Asked Questions')}
        </h2>
        {[
          { q_es: '¿Necesito aseguranza médica?', q_en: 'Do I need health insurance?', a_es: 'No. Vendemos directamente sin necesidad de seguro médico.', a_en: 'No. We sell directly without health insurance.' },
          { q_es: '¿Cuánto tarda la entrega?', q_en: 'How long does delivery take?', a_es: 'Entre 3 y 5 días hábiles a California.', a_en: '3 to 5 business days to California.' },
          { q_es: '¿Cómo ingreso mi graduación?', q_en: 'How do I enter my prescription?', a_es: 'Puedes ingresar los números manualmente o subir una foto.', a_en: 'You can enter numbers manually or upload a photo.' },
          { q_es: '¿Puedo devolver mis lentes?', q_en: 'Can I return my glasses?', a_es: 'Sí, tienes 30 días para hacer una devolución.', a_en: 'Yes, you have 30 days to make a return.' },
          { q_es: '¿Qué métodos de pago aceptan?', q_en: 'What payment methods do you accept?', a_es: 'Aceptamos todas las tarjetas de crédito y débito.', a_en: 'We accept all credit and debit cards.' },
        ].map((f, i) => (
          <div key={i} style={{background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', marginBottom: '0.75rem'}}>
            <div style={{fontSize: '15px', fontWeight: 700, marginBottom: '6px', color: '#1A1A2E'}}>❓ {t(f.q_es, f.q_en)}</div>
            <div style={{fontSize: '14px', color: '#4A5568', lineHeight: 1.6}}>{t(f.a_es, f.a_en)}</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{background: '#1A2535', color: 'rgba(255,255,255,0.7)', padding: '3rem 2rem'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto 2rem'}}>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px'}}>
              <span style={{fontSize: '18px', fontWeight: 800, color: '#2BBFB3'}}>Verly</span>
              <span style={{fontSize: '9px', fontWeight: 700, color: '#F5C518', letterSpacing: '2px'}}>OPTICAL</span>
            </div>
            <p style={{fontSize: '13px', lineHeight: 1.7}}>{t('Lentes accesibles para todos. Sirviendo a la comunidad latina en California.', 'Affordable lenses for everyone. Serving the Latino community in California.')}</p>
          </div>
          <div>
            <h4 style={{color: 'white', fontSize: '13px', fontWeight: 700, marginBottom: '12px'}}>{t('Tienda', 'Store')}</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <a href="/Tienda" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>{t('Todos los armazones', 'All frames')}</a>
              <a href="/receta" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>{t('Mi Receta', 'My Prescription')}</a>
              <a href="/configurador2" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>{t('Armar Lentes', 'Build Lenses')}</a>
            </div>
          </div>
          <div>
            <h4 style={{color: 'white', fontSize: '13px', fontWeight: 700, marginBottom: '12px'}}>{t('Ayuda', 'Help')}</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <a href="#faq" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>{t('Preguntas frecuentes', 'FAQ')}</a>
              <a href="mailto:hola@verlyoptical.com" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>{t('Contáctanos', 'Contact us')}</a>
            </div>
          </div>
        </div>
        <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '12px', maxWidth: '1100px', margin: '0 auto'}}>
          © 2025 Verly Optical — verlyoptical.com
        </div>
      </footer>

    </main>
  );
}