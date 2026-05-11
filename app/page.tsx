'use client';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { useLang } from './components/LanguageContext';

export default function Home() {
  const { t } = useLang();
  const [esMobil, setEsMobil] = useState(false);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <main style={{ fontFamily: 'var(--font-jakarta), sans-serif', margin: 0, padding: 0, background: '#FAFAFA', color: '#1A1A2E' }}>

      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        background: '#F5F2EE',
        minHeight: esMobil ? '100vh' : '88vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 80% at 80% 50%, #E0F7F5 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '-60px', top: '50%', transform: 'translateY(-50%)',
          width: '560px', height: '560px',
          background: 'radial-gradient(circle, #2BBFB322 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: '1180px', margin: '0 auto',
          padding: esMobil ? '3rem 1.5rem' : '6rem 2rem',
          display: 'grid',
          gridTemplateColumns: esMobil ? '1fr' : '1fr 1fr',
          gap: esMobil ? '2rem' : '4rem',
          alignItems: 'center',
          width: '100%',
        }}>
          {/* Texto */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#2BBFB3', color: 'white',
              padding: '6px 16px', borderRadius: '4px',
              fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
              marginBottom: '2rem',
            }}>
              {t('Desde $5 USD · Sin aseguranza', 'From $5 USD · No insurance needed')}
            </div>

            <h1 style={{
              fontSize: esMobil ? 'clamp(2rem, 8vw, 2.8rem)' : 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#1A1A2E',
              marginBottom: '1.5rem',
            }}>
              {t('Lentes a tu medida.', 'Lenses made')}<br />
              <span style={{ color: '#2BBFB3' }}>
                {t('Precio justo.', 'for you.')}
              </span>
            </h1>

            <p style={{
              fontSize: '17px',
              color: '#5A6478',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: '420px',
            }}>
              {t(
                'Armazones de calidad con micas hechas a tu graduación. Entrega rápida a California. Sin citas. Sin seguro.',
                'Quality frames with lenses made to your prescription. Fast delivery to California. No appointments. No insurance.'
              )}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/Tienda" style={{
                background: '#1A1A2E', color: 'white',
                padding: '15px 32px', borderRadius: '6px',
                fontSize: '14px', fontWeight: 700, textDecoration: 'none',
                letterSpacing: '0.5px',
              }}>
                {t('Explorar Lentes', 'Explore Frames')}
              </a>
              <a href="/receta" style={{
                background: 'transparent', color: '#1A1A2E',
                border: '1.5px solid #C8CDD6',
                padding: '15px 32px', borderRadius: '6px',
                fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                letterSpacing: '0.5px',
              }}>
                {t('Ingresar mi Receta', 'Enter My Prescription')}
              </a>
            </div>
          </div>

          {/* Visual lado derecho */}
          {!esMobil && (
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '420px', height: '420px',
                background: 'linear-gradient(145deg, #E0F7F5, #F0FBF8)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <svg width="280" height="140" viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="20" width="108" height="100" rx="32" fill="white" stroke="#2BBFB3" strokeWidth="5"/>
                  <rect x="164" y="20" width="108" height="100" rx="32" fill="white" stroke="#2BBFB3" strokeWidth="5"/>
                  <path d="M116 60 C124 50, 156 50, 164 60" stroke="#2BBFB3" strokeWidth="4" fill="none" strokeLinecap="round"/>
                  <line x1="8" y1="55" x2="-8" y2="48" stroke="#2BBFB3" strokeWidth="4" strokeLinecap="round"/>
                  <line x1="272" y1="55" x2="288" y2="48" stroke="#2BBFB3" strokeWidth="4" strokeLinecap="round"/>
                  <ellipse cx="42" cy="52" rx="14" ry="8" fill="#E0F7F5" opacity="0.7"/>
                  <ellipse cx="198" cy="52" rx="14" ry="8" fill="#E0F7F5" opacity="0.7"/>
                </svg>

                <div style={{
                  position: 'absolute', bottom: '40px', right: '-10px',
                  background: '#F5C518', color: '#1A1A2E',
                  padding: '12px 18px', borderRadius: '12px',
                  fontSize: '13px', fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(245,197,24,0.35)',
                }}>
                  {t('Desde $5 USD', 'From $5 USD')}
                </div>

                <div style={{
                  position: 'absolute', top: '40px', left: '-10px',
                  background: 'white', color: '#1A1A2E',
                  padding: '10px 16px', borderRadius: '12px',
                  fontSize: '12px', fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  border: '1px solid #E2E8F0',
                }}>
                  {t('Entrega 3–5 días', 'Delivery 3–5 days')}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── BARRA DE CONFIANZA ── */}
      <div style={{
        background: 'white',
        borderTop: '1px solid #EAECF0',
        borderBottom: '1px solid #EAECF0',
        padding: esMobil ? '1rem' : '1.4rem 2rem',
        display: 'flex', justifyContent: 'center',
        gap: esMobil ? '0.75rem' : '4rem',
        flexWrap: 'wrap',
      }}>
        {[
          { es: 'Desde $5 USD', en: 'From $5 USD' },
          { es: 'Entrega 3–5 días a California', en: 'Delivery 3–5 days to CA' },
          { es: 'Sin aseguranza médica', en: 'No insurance required' },
          { es: '30 días de devolución', en: '30-day free returns' },
        ].map((item, i) => (
          <span key={i} style={{
            color: '#5A6478', fontSize: esMobil ? '11px' : '13px', fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{ color: '#2BBFB3', fontWeight: 800 }}>—</span>
            {t(item.es, item.en)}
          </span>
        ))}
      </div>

      {/* ── COLECCIONES ── */}
      <section style={{ padding: esMobil ? '3rem 1.5rem' : '6rem 2rem', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3.5rem' }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', color: '#2BBFB3', marginBottom: '0.75rem',
          }}>
            {t('Colecciones', 'Collections')}
          </p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontWeight: 800, letterSpacing: '-0.025em',
            color: '#1A1A2E',
          }}>
            {t('Encuentra tu estilo', 'Find your style')}
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: esMobil ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}>
          {[
            { es: 'Para Ella', en: 'For Her', desc_es: 'Diseños delicados y modernos.', desc_en: 'Delicate and modern designs.', color: '#F7E8ED', accent: '#D4708A' },
            { es: 'Estilo Masculino', en: "Men's Style", desc_es: 'Sofisticación y carácter.', desc_en: 'Sophistication and character.', color: '#E8F4F7', accent: '#2A7FA8' },
            { es: 'Últimos Diseños', en: 'New Arrivals', desc_es: 'Lo más reciente de temporada.', desc_en: 'The latest of the season.', color: '#EEF0F8', accent: '#5B68C0' },
            { es: 'Los Favoritos', en: 'Best Sellers', desc_es: 'Los más pedidos por nuestros clientes.', desc_en: 'Most ordered by our customers.', color: '#FBF3E4', accent: '#C08A2A' },
          ].map((c, i) => (
            <a key={i} href="/Tienda" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: 'white', borderRadius: '12px',
                overflow: 'hidden', border: '1px solid #EAECF0',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.10)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                }}
              >
                <div style={{
                  height: '180px', background: c.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="100" height="52" viewBox="0 0 100 52" fill="none">
                    <rect x="2" y="6" width="38" height="40" rx="12" fill="white" stroke={c.accent} strokeWidth="2.5"/>
                    <rect x="60" y="6" width="38" height="40" rx="12" fill="white" stroke={c.accent} strokeWidth="2.5"/>
                    <path d="M40 22 C44 18, 56 18, 60 22" stroke={c.accent} strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <line x1="2" y1="22" x2="-4" y2="19" stroke={c.accent} strokeWidth="2" strokeLinecap="round"/>
                    <line x1="98" y1="22" x2="104" y2="19" stroke={c.accent} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{ padding: '1.4rem' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '5px', color: '#1A1A2E' }}>{t(c.es, c.en)}</div>
                  <div style={{ fontSize: '13px', color: '#7A8494', marginBottom: '14px', lineHeight: 1.5 }}>{t(c.desc_es, c.desc_en)}</div>
                  <div style={{ color: '#2BBFB3', fontSize: '13px', fontWeight: 700 }}>{t('Ver colección →', 'View collection →')}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section style={{ background: 'white', padding: esMobil ? '3rem 1.5rem' : '6rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase', color: '#2BBFB3', marginBottom: '0.75rem',
            }}>
              {t('El proceso', 'The process')}
            </p>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 800, letterSpacing: '-0.025em', color: '#1A1A2E',
            }}>
              {t('Tan fácil como 1, 2, 3, 4', 'As easy as 1, 2, 3, 4')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { num: '01', es: 'Elige tu armazón', en: 'Choose your frame', desc_es: 'Más de 60 estilos disponibles.', desc_en: '60+ styles available.', link: '/Tienda' },
              { num: '02', es: 'Ingresa tu receta', en: 'Enter your prescription', desc_es: 'Manual o foto en 1 minuto.', desc_en: 'Manual or photo in 1 minute.', link: '/receta' },
              { num: '03', es: 'Personaliza tus micas', en: 'Customize your lenses', desc_es: 'Material, filtros, visión.', desc_en: 'Material, filters, vision type.', link: '/configurador2' },
              { num: '04', es: 'Recíbelos en casa', en: 'Receive at home', desc_es: 'Entrega 3–5 días a California.', desc_en: 'Delivery 3–5 days to California.', link: '/Tienda' },
            ].map((s, i) => (
              <a key={i} href={s.link} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '1.5rem 1.25rem', border: '1px solid #EAECF0',
                  borderRadius: '12px', height: '100%',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#2BBFB3';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(43,191,179,0.12)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#EAECF0';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: '28px', fontWeight: 800, color: '#E8F7F6',
                    marginBottom: '1rem', letterSpacing: '-1px',
                    WebkitTextStroke: '1.5px #2BBFB3',
                  }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1A1A2E' }}>{t(s.es, s.en)}</div>
                  <div style={{ fontSize: '12px', color: '#7A8494', lineHeight: 1.6 }}>{t(s.desc_es, s.desc_en)}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER PROMO ── */}
      <section style={{
        background: '#1A1A2E', padding: esMobil ? '3rem 1.5rem' : '5rem 2rem',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, #2BBFB315 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: '#2BBFB3', marginBottom: '1rem',
          }}>
            {t('Oferta de bienvenida', 'Welcome offer')}
          </p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: 'white', marginBottom: '1rem',
          }}>
            {t('Tu primer par.', 'Your first pair.')}<br />
            <span style={{ color: '#F5C518' }}>{t('Nuestro mejor precio.', 'Our best price.')}</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2.5rem', fontSize: '16px' }}>
            {t('Usa el código ', 'Use code ')}
            <span style={{
              background: 'rgba(245,197,24,0.15)', color: '#F5C518',
              padding: '2px 10px', borderRadius: '4px',
              fontWeight: 800, letterSpacing: '1px', fontFamily: 'monospace',
            }}>VERLY10</span>
            {t(' y obtén 10% de descuento en tu primer pedido.', ' and get 10% off your first order.')}
          </p>
          <a href="/Tienda" style={{
            background: '#2BBFB3', color: 'white',
            padding: '15px 36px', borderRadius: '6px',
            fontSize: '14px', fontWeight: 700, textDecoration: 'none',
            letterSpacing: '0.5px', display: 'inline-block',
          }}>
            {t('Ir a la tienda', 'Go to store')}
          </a>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: esMobil ? '3rem 1.5rem' : '6rem 2rem', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', color: '#2BBFB3', marginBottom: '0.75rem',
          }}>FAQ</p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontWeight: 800, letterSpacing: '-0.025em', color: '#1A1A2E',
          }}>
            {t('Preguntas frecuentes', 'Frequently Asked Questions')}
          </h2>
        </div>

        {[
          { q_es: '¿Necesito aseguranza médica?', q_en: 'Do I need health insurance?', a_es: 'No. Vendemos directamente al cliente, sin necesidad de seguro médico.', a_en: 'No. We sell directly to customers, no health insurance needed.' },
          { q_es: '¿Cuánto tarda la entrega?', q_en: 'How long does delivery take?', a_es: 'Entre 3 y 5 días hábiles a California.', a_en: '3 to 5 business days to California.' },
          { q_es: '¿Cómo ingreso mi graduación?', q_en: 'How do I enter my prescription?', a_es: 'Puedes ingresar los números manualmente o subir una foto de tu receta.', a_en: 'You can enter numbers manually or upload a photo of your prescription.' },
          { q_es: '¿Puedo devolver mis lentes?', q_en: 'Can I return my glasses?', a_es: 'Sí, tienes 30 días para hacer una devolución sin complicaciones.', a_en: 'Yes, you have 30 days for a hassle-free return.' },
          { q_es: '¿Qué métodos de pago aceptan?', q_en: 'What payment methods do you accept?', a_es: 'Aceptamos todas las tarjetas de crédito y débito a través de Stripe.', a_en: 'We accept all credit and debit cards through Stripe.' },
        ].map((f, i) => (
          <details key={i} style={{
            background: 'white', borderRadius: '10px',
            border: '1px solid #EAECF0', marginBottom: '0.75rem', overflow: 'hidden',
          }}>
            <summary style={{
              padding: '1.2rem 1.5rem',
              fontSize: '15px', fontWeight: 600, color: '#1A1A2E',
              cursor: 'pointer', listStyle: 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              {t(f.q_es, f.q_en)}
              <span style={{ color: '#2BBFB3', fontSize: '18px', fontWeight: 300 }}>+</span>
            </summary>
            <div style={{ padding: '0 1.5rem 1.2rem', fontSize: '14px', color: '#5A6478', lineHeight: 1.7 }}>
              {t(f.a_es, f.a_en)}
            </div>
          </details>
        ))}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#111827', color: 'rgba(255,255,255,0.5)', padding: '4rem 2rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: esMobil ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem', maxWidth: '1100px', margin: '0 auto 3rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>Verly</span>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#F5C518', letterSpacing: '2.5px' }}>OPTICAL</span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.8, maxWidth: '220px' }}>
              {t('Lentes accesibles para la comunidad latina en California.', 'Affordable eyewear for the Latino community in California.')}
            </p>
          </div>
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              {t('Tienda', 'Shop')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/Tienda', es: 'Todos los armazones', en: 'All frames' },
                { href: '/receta', es: 'Mi Receta', en: 'My Prescription' },
                { href: '/configurador2', es: 'Armar Lentes', en: 'Build Lenses' },
              ].map((l, i) => (
                <a key={i} href={l.href} style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '13px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  {t(l.es, l.en)}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              {t('Ayuda', 'Help')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="#faq" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >FAQ</a>
              <a href="mailto:hola@verlyoptical.com" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                {t('Contáctanos', 'Contact us')}
              </a>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem',
          textAlign: 'center', fontSize: '12px', maxWidth: '1100px', margin: '0 auto',
        }}>
          © 2025 Verly Optical — verlyoptical.com
        </div>
      </footer>

    </main>
  );
}