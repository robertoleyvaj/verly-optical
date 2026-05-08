'use client';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';

export default function Home() {
  const { t } = useLang();

  return (
    <main style={{fontFamily: 'var(--font-jakarta), sans-serif', margin: 0, padding: 0, background: '#FAFAFA', color: '#1A1A2E'}}>

      <navbar />

      {/* HERO */}
      <section style={{minHeight: '92vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(160deg, #F0FDFB 0%, #FAFAFA 50%, #FFF8E7 100%)', padding: '0 2rem', position: 'relative', overflow: 'hidden'}}>
        
        {/* Fondo decorativo */}
        <div style={{position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,191,179,0.08) 0%, transparent 70%)', pointerEvents: 'none'}} />
        <div style={{position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,197,24,0.06) 0%, transparent 70%)', pointerEvents: 'none'}} />

        <div style={{maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center'}}>
          
          {/* LEFT */}
          <div>
            <div style={{display: 'inline-block', background: '#E0F7F4', color: '#1a9990', fontSize: '12px', fontWeight: 700, padding: '6px 16px', borderRadius: '20px', letterSpacing: '0.5px', marginBottom: '1.5rem', textTransform: 'uppercase'}}>
              {t('Lentes desde $5 USD — Sin aseguranza', 'Lenses from $5 USD — No insurance needed')}
            </div>
            <h1 style={{fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-1px'}}>
              {t('Los lentes que', 'The glasses')} <br/>
              <span style={{color: '#2BBFB3'}}>{t('te quedan perfectos,', 'that fit you perfectly,')}</span><br/>
              {t('al precio que mereces.', 'at the price you deserve.')}
            </h1>
            <p style={{fontSize: '17px', color: '#4A5568', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '440px', fontWeight: 400}}>
              {t('Elige tu armazón, ingresa tu receta y recibe tus lentes en casa. Simple, rápido y accesible.', 'Choose your frame, enter your prescription and receive your lenses at home. Simple, fast and affordable.')}
            </p>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              <a href="/Tienda" style={{background: '#2BBFB3', color: 'white', borderRadius: '14px', padding: '16px 32px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(43,191,179,0.3)'}}>
                {t('Ver armazones', 'Shop frames')}
              </a>
              <a href="/receta" style={{background: 'transparent', color: '#1A1A2E', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '15px 32px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block'}}>
                {t('Ingresar mi receta', 'Enter my prescription')}
              </a>
            </div>
            {/* TRUST */}
            <div style={{display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap'}}>
              {[
                { es: 'Entrega 3-5 días', en: '3-5 day delivery' },
                { es: '30 días de garantía', en: '30-day guarantee' },
                { es: 'Sin aseguranza', en: 'No insurance' },
              ].map((item, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#4A5568', fontWeight: 500}}>
                  <div style={{width: '6px', height: '6px', borderRadius: '50%', background: '#2BBFB3', flexShrink: 0}} />
                  {t(item.es, item.en)}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — placeholder elegante */}
          <div style={{position: 'relative'}}>
            <div style={{background: 'linear-gradient(135deg, #E0F7F4 0%, #B3EDE8 100%)', borderRadius: '32px', height: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', top: '20px', right: '20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(245,197,24,0.15)'}} />
              <div style={{position: 'absolute', bottom: '30px', left: '20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(43,191,179,0.2)'}} />
              <div style={{textAlign: 'center', zIndex: 1}}>
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="32" cy="30" rx="24" ry="18" stroke="#2BBFB3" strokeWidth="4" fill="rgba(43,191,179,0.1)"/>
                  <ellipse cx="88" cy="30" rx="24" ry="18" stroke="#2BBFB3" strokeWidth="4" fill="rgba(43,191,179,0.1)"/>
                  <line x1="56" y1="30" x2="64" y2="30" stroke="#2BBFB3" strokeWidth="4"/>
                  <line x1="8" y1="28" x2="0" y2="26" stroke="#2BBFB3" strokeWidth="3"/>
                  <line x1="112" y1="28" x2="120" y2="26" stroke="#2BBFB3" strokeWidth="3"/>
                </svg>
                <div style={{marginTop: '1.5rem', fontSize: '14px', fontWeight: 600, color: '#1a9990'}}>
                  {t('Fotos próximamente', 'Photos coming soon')}
                </div>
                <div style={{fontSize: '12px', color: '#4A5568', marginTop: '4px'}}>
                  {t('Armazones reales en camino', 'Real frames on the way')}
                </div>
              </div>
            </div>
            {/* FLOATING CARD */}
            <div style={{position: 'absolute', bottom: '-20px', left: '-20px', background: 'white', borderRadius: '16px', padding: '1rem 1.25rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', minWidth: '180px'}}>
              <div style={{fontSize: '11px', fontWeight: 700, color: '#8A97A8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'}}>{t('Precio promedio', 'Average price')}</div>
              <div style={{fontSize: '24px', fontWeight: 800, color: '#2BBFB3'}}>$67 USD</div>
              <div style={{fontSize: '12px', color: '#4A5568', marginTop: '2px'}}>{t('armazón + micas', 'frame + lenses')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{padding: '6rem 2rem', background: 'white'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <div style={{fontSize: '12px', fontWeight: 700, color: '#2BBFB3', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem'}}>
              {t('Así de fácil', 'This easy')}
            </div>
            <h2 style={{fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.5px'}}>
              {t('De tu receta a tu puerta', 'From your prescription to your door')}
            </h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem'}}>
            {[
              { num: '01', es: 'Elige tu armazón', en: 'Choose your frame', desc_es: 'Explora nuestra colección y encuentra el estilo que va contigo.', desc_en: 'Explore our collection and find the style that fits you.', link: '/Tienda' },
              { num: '02', es: 'Ingresa tu receta', en: 'Enter your prescription', desc_es: 'Escribe tus números o sube una foto de tu receta médica.', desc_en: 'Type your numbers or upload a photo of your prescription.', link: '/receta' },
              { num: '03', es: 'Personaliza tus lentes', en: 'Customize your lenses', desc_es: 'Elige material y filtros. Te guiamos para que elijas lo mejor.', desc_en: 'Choose material and filters. We guide you to choose the best.', link: '/configurador2' },
              { num: '04', es: 'Recíbelos en casa', en: 'Receive them at home', desc_es: 'Entrega en 3-5 días hábiles a cualquier dirección en California.', desc_en: 'Delivery in 3-5 business days to any address in California.', link: '/Tienda' },
            ].map((s, i) => (
              <a key={i} href={s.link} style={{textDecoration: 'none', color: 'inherit'}}>
                <div style={{padding: '2rem', border: '1px solid #F0F0F0', borderRadius: '20px', height: '100%', transition: 'all 0.2s', cursor: 'pointer'}}>
                  <div style={{fontSize: '13px', fontWeight: 800, color: '#2BBFB3', marginBottom: '1rem', letterSpacing: '1px'}}>{s.num}</div>
                  <div style={{fontSize: '17px', fontWeight: 700, marginBottom: '0.75rem', color: '#1A1A2E'}}>{t(s.es, s.en)}</div>
                  <div style={{fontSize: '14px', color: '#6B7280', lineHeight: 1.7}}>{t(s.desc_es, s.desc_en)}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* COLECCIONES */}
      <section style={{padding: '6rem 2rem', background: '#FAFAFA'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem'}}>
            <div>
              <div style={{fontSize: '12px', fontWeight: 700, color: '#2BBFB3', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem'}}>
                {t('Colecciones', 'Collections')}
              </div>
              <h2 style={{fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.5px'}}>
                {t('Encuentra tu estilo', 'Find your style')}
              </h2>
            </div>
            <a href="/Tienda" style={{fontSize: '14px', fontWeight: 600, color: '#2BBFB3', textDecoration: 'none', borderBottom: '1px solid #2BBFB3', paddingBottom: '2px'}}>
              {t('Ver todo', 'View all')}
            </a>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem'}}>
            {[
              { es: 'Para ella', en: 'For her', desc_es: 'Elegancia en cada detalle', desc_en: 'Elegance in every detail', bg: '#FDF2F4', accent: '#E8B4BC' },
              { es: 'Para él', en: 'For him', desc_es: 'Sofisticación y carácter', desc_en: 'Sophistication and character', bg: '#F0FDFB', accent: '#7DE8E0' },
              { es: 'Nuevos diseños', en: 'New designs', desc_es: 'Lo más reciente', desc_en: 'The latest styles', bg: '#EEF2FF', accent: '#B3C6FF' },
              { es: 'Los favoritos', en: 'Favorites', desc_es: 'Los más populares', desc_en: 'Most popular', bg: '#FFFBEB', accent: '#FCD34D' },
            ].map((c, i) => (
              <a key={i} href="/Tienda" style={{textDecoration: 'none', color: 'inherit'}}>
                <div style={{background: c.bg, borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s'}}>
                  <div style={{height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                    <svg width="100" height="50" viewBox="0 0 100 50" fill="none">
                      <ellipse cx="27" cy="25" rx="19" ry="14" stroke={c.accent} strokeWidth="3.5" fill={`${c.accent}30`}/>
                      <ellipse cx="73" cy="25" rx="19" ry="14" stroke={c.accent} strokeWidth="3.5" fill={`${c.accent}30`}/>
                      <line x1="46" y1="25" x2="54" y2="25" stroke={c.accent} strokeWidth="3.5"/>
                      <line x1="8" y1="23" x2="0" y2="21" stroke={c.accent} strokeWidth="2.5"/>
                      <line x1="92" y1="23" x2="100" y2="21" stroke={c.accent} strokeWidth="2.5"/>
                    </svg>
                  </div>
                  <div style={{padding: '1.25rem 1.5rem 1.5rem'}}>
                    <div style={{fontSize: '16px', fontWeight: 700, marginBottom: '4px'}}>{t(c.es, c.en)}</div>
                    <div style={{fontSize: '13px', color: '#6B7280'}}>{t(c.desc_es, c.desc_en)}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER */}
      <section style={{padding: '6rem 2rem', background: '#1A1A2E', color: 'white'}}>
        <div style={{maxWidth: '700px', margin: '0 auto', textAlign: 'center'}}>
          <div style={{fontSize: '12px', fontWeight: 700, color: '#2BBFB3', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem'}}>
            {t('Oferta de bienvenida', 'Welcome offer')}
          </div>
          <h2 style={{fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.5px', lineHeight: 1.1}}>
            {t('Tu primer par con 10% de descuento', 'Your first pair with 10% off')}
          </h2>
          <p style={{color: 'rgba(255,255,255,0.65)', marginBottom: '2rem', fontSize: '16px', lineHeight: 1.7}}>
            {t('Usa el código ', 'Use code ')}<span style={{color: '#F5C518', fontWeight: 700}}>VERLY10</span>{t(' al momento de pagar.', ' at checkout.')}
          </p>
          <a href="/Tienda" style={{background: '#2BBFB3', color: 'white', borderRadius: '14px', padding: '16px 36px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 20px rgba(43,191,179,0.3)'}}>
            {t('Ir a la tienda', 'Go to store')}
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{padding: '6rem 2rem', background: 'white'}}>
        <div style={{maxWidth: '700px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '3rem'}}>
            <div style={{fontSize: '12px', fontWeight: 700, color: '#2BBFB3', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem'}}>FAQ</div>
            <h2 style={{fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.5px'}}>
              {t('Preguntas frecuentes', 'Frequently asked questions')}
            </h2>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {[
              { q_es: '¿Necesito aseguranza médica?', q_en: 'Do I need health insurance?', a_es: 'No. Vendemos directamente al público sin necesidad de seguro médico.', a_en: 'No. We sell directly to the public without health insurance.' },
              { q_es: '¿Cuánto tarda la entrega?', q_en: 'How long does delivery take?', a_es: 'Entre 3 y 5 días hábiles a cualquier dirección en California.', a_en: '3 to 5 business days to any address in California.' },
              { q_es: '¿Cómo ingreso mi graduación?', q_en: 'How do I enter my prescription?', a_es: 'Puedes ingresar los números manualmente o subir una foto de tu receta médica.', a_en: 'You can enter the numbers manually or upload a photo of your prescription.' },
              { q_es: '¿Puedo devolver mis lentes?', q_en: 'Can I return my glasses?', a_es: 'Sí, tienes 30 días para hacer una devolución si no estás satisfecho.', a_en: 'Yes, you have 30 days to make a return if you are not satisfied.' },
              { q_es: '¿Qué métodos de pago aceptan?', q_en: 'What payment methods do you accept?', a_es: 'Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, Amex).', a_en: 'We accept all credit and debit cards (Visa, Mastercard, Amex).' },
            ].map((f, i) => (
              <div key={i} style={{background: '#FAFAFA', borderRadius: '14px', border: '1px solid #F0F0F0', padding: '1.5rem'}}>
                <div style={{fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: '#1A1A2E'}}>{t(f.q_es, f.q_en)}</div>
                <div style={{fontSize: '14px', color: '#6B7280', lineHeight: 1.7}}>{t(f.a_es, f.a_en)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background: '#1A1A2E', color: 'rgba(255,255,255,0.6)', padding: '4rem 2rem 2rem'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem', marginBottom: '3rem'}}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem'}}>
                <span style={{fontSize: '18px', fontWeight: 800, color: 'white'}}>Verly</span>
                <span style={{fontSize: '9px', fontWeight: 700, color: '#F5C518', letterSpacing: '2px'}}>OPTICAL</span>
              </div>
              <p style={{fontSize: '13px', lineHeight: 1.8}}>{t('Lentes accesibles para todos. Sirviendo a la comunidad latina en California.', 'Affordable lenses for everyone. Serving the Latino community in California.')}</p>
            </div>
            <div>
              <h4 style={{color: 'white', fontSize: '13px', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{t('Tienda', 'Store')}</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <a href="/Tienda" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px'}}>{t('Todos los armazones', 'All frames')}</a>
                <a href="/receta" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px'}}>{t('Mi receta', 'My prescription')}</a>
                <a href="/configurador2" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px'}}>{t('Armar lentes', 'Build lenses')}</a>
              </div>
            </div>
            <div>
              <h4 style={{color: 'white', fontSize: '13px', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{t('Ayuda', 'Help')}</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <a href="#faq" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px'}}>{t('Preguntas frecuentes', 'FAQ')}</a>
                <a href="mailto:hola@verlyoptical.com" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px'}}>{t('Contacto', 'Contact')}</a>
              </div>
            </div>
          </div>
          <div style={{borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
            <div style={{fontSize: '13px'}}>© 2025 Verly Optical — verlyoptical.com</div>
            <div style={{fontSize: '13px'}}>{t('Hecho con amor en California', 'Made with love in California')}</div>
          </div>
        </div>
      </footer>

    </main>
  );
}