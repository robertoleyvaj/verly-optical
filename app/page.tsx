// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { useLang } from './components/LanguageContext';

export default function Home() {
  const { t, lang } = useLang();
  const [esMobil, setEsMobil] = useState(false);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <main style={{ fontFamily: 'var(--font-sans)', margin: 0, padding: 0, background: 'var(--cream)', color: 'var(--charcoal)' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: esMobil ? '80vh' : '88vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <img
          src="/hero-man.jpg"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: esMobil ? '70% top' : 'center top',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: esMobil
            ? 'linear-gradient(to bottom, rgba(247,244,239,0.7) 0%, rgba(247,244,239,0.2) 100%)'
            : 'linear-gradient(to right, rgba(247,244,239,0.95) 0%, rgba(247,244,239,0.82) 35%, rgba(247,244,239,0.0) 62%)',
        }}/>

        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: '1180px', width: '100%',
          margin: '0 auto',
          padding: esMobil ? '5rem 1.5rem 3rem' : '6rem 2rem 0',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px', fontWeight: 500, letterSpacing: '2.5px',
            textTransform: 'uppercase', color: 'var(--sage)',
            marginBottom: '1.25rem',
          }}>
            {t('Estilo atemporal. Confianza diaria.', 'Timeless style. Everyday confidence.')}
          </p>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: esMobil ? 'clamp(2.8rem, 9vw, 3.4rem)' : 'clamp(3.2rem, 5vw, 4.4rem)',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: 'var(--charcoal)',
            marginBottom: '1.25rem',
            maxWidth: esMobil ? '100%' : '560px',
          }}>
            {lang === 'es'
              ? <>Lentes de calidad<br />que se adaptan<br /><em style={{ fontStyle: 'italic', color: 'var(--sage-light)' }}>a tu vida.</em></>
              : <>Quality eyewear<br />that fits<br /><em style={{ fontStyle: 'italic', color: 'var(--sage-light)' }}>your life.</em></>
            }
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            color: 'var(--warm-gray)',
            lineHeight: 1.8,
            marginBottom: '2.5rem',
            maxWidth: '380px',
            fontWeight: 400,
          }}>
            {t(
              'Diseños clásicos. Micas premium. Precios justos. Hechos para la vida real.',
              'Classic designs. Premium lenses. Fair prices. Made for real life.'
            )}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '3rem' }}>
            <a href="/Tienda" style={{
              background: 'var(--sage)', color: 'white',
              padding: '14px 32px', borderRadius: '3px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px', fontWeight: 500, textDecoration: 'none',
              letterSpacing: '1.2px', textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--charcoal)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--sage)')}
            >
              {t('Ver armazones', 'Shop Eyeglasses')}
            </a>
            <a href="/sunglasses" style={{
              background: 'white', color: 'var(--charcoal)',
              padding: '13px 28px', borderRadius: '3px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px', fontWeight: 500, textDecoration: 'none',
              letterSpacing: '1px', textTransform: 'uppercase',
              border: '1px solid var(--border)',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--charcoal)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {t('Lentes de sol', 'Shop Sunglasses')}
            </a>
          </div>

          {/* Trust badges */}
          <div style={{
            display: 'flex', gap: '2.5rem', flexWrap: 'wrap',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(28,28,26,0.08)',
            maxWidth: '520px',
          }}>
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
                es: 'Garantía 90 días', en: '90-Day Warranty',
                sub_es: 'En todos los pedidos', sub_en: 'On all orders',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                ),
                es: 'Envío rápido', en: 'Fast Shipping',
                sub_es: '3 a 5 días hábiles', sub_en: '3 to 5 business days',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-5.49"/>
                  </svg>
                ),
                es: 'Devolución 30 días', en: '30-Day Returns',
                sub_es: 'Sin complicaciones', sub_en: 'Hassle-free',
              },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ marginTop: '1px', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', lineHeight: 1.3 }}>
                    {t(item.es, item.en)}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--warm-gray)', marginTop: '2px' }}>
                    {t(item.sub_es, item.sub_en)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY STYLE ── */}
      <section style={{ padding: esMobil ? '3.5rem 1.5rem' : '5rem 2rem', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
            fontWeight: 400, color: 'var(--charcoal)',
            marginBottom: '0.5rem',
          }}>
            {t('Compra por estilo', 'Shop by style')}
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--warm-gray)' }}>
            {t('Formas atemporales. Estilo sin esfuerzo.', 'Timeless shapes. Effortless style.')}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: esMobil ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
          gap: '1rem',
        }}>
          {[
            { es: 'Rectangular', en: 'Rectangle', href: '/Tienda', rx: '6', solar: false },
            { es: 'Redondo', en: 'Round', href: '/Tienda', rx: '30', solar: false },
            { es: 'Ovalado', en: 'Oval', href: '/Tienda', rx: '20', solar: false },
            { es: 'Clásico', en: 'Classic', href: '/Tienda', rx: '10', solar: false },
            { es: 'Solar', en: 'Sunglasses', href: '/sunglasses', rx: '14', solar: true },
          ].map((c, i) => (
            <a key={i} href={c.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--sage)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ height: '130px', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <svg width="110" height="55" viewBox="0 0 110 55" fill="none">
                    <rect x="2" y="7" width="44" height="38" rx={c.rx} fill={c.solar ? '#1A1A2E' : 'white'} fillOpacity={c.solar ? 0.15 : 1} stroke="var(--charcoal)" strokeWidth="1.8"/>
                    <rect x="64" y="7" width="44" height="38" rx={c.rx} fill={c.solar ? '#1A1A2E' : 'white'} fillOpacity={c.solar ? 0.15 : 1} stroke="var(--charcoal)" strokeWidth="1.8"/>
                    <path d="M46 22 C50 18, 60 18, 64 22" stroke="var(--charcoal)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                    <line x1="2" y1="22" x2="-5" y2="18" stroke="var(--charcoal)" strokeWidth="1.6" strokeLinecap="round"/>
                    <line x1="108" y1="22" x2="115" y2="18" stroke="var(--charcoal)" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{ padding: '0.9rem 1rem 1rem' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '4px' }}>
                    {t(c.es, c.en)}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--sage)' }}>
                    {t('Ver ahora →', 'Shop now →')}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" style={{ background: 'white', padding: esMobil ? '3.5rem 1.5rem' : '6rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '0.6rem' }}>
              {t('El proceso', 'The process')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
              {t('Simple como debe ser', 'Simple as it should be')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {[
              { num: '01', es: 'Elige tu armazón', en: 'Choose your frame', desc_es: 'Estilos para todos los gustos.', desc_en: 'Styles for every taste.' },
              { num: '02', es: 'Ingresa tu receta', en: 'Enter your prescription', desc_es: 'Manual o foto, en un minuto.', desc_en: 'Manual or photo, in one minute.' },
              { num: '03', es: 'Personaliza tus micas', en: 'Customize your lenses', desc_es: 'Material, filtros, tipo de visión.', desc_en: 'Material, filters, vision type.' },
              { num: '04', es: 'Recíbelos en casa', en: 'Delivered to your door', desc_es: 'Rápido, seguro y sin complicaciones.', desc_en: 'Fast, secure and hassle-free.' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '1.75rem 1.25rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--cream)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '34px', fontWeight: 300, color: 'var(--cream-dark)', marginBottom: '1rem', lineHeight: 1, WebkitTextStroke: '1px var(--sage-light)' }}>
                  {s.num}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, marginBottom: '5px', color: 'var(--charcoal)' }}>{t(s.es, s.en)}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--warm-gray)', lineHeight: 1.6 }}>{t(s.desc_es, s.desc_en)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER PROMO ── */}
      <section style={{ background: 'var(--charcoal)', padding: esMobil ? '4rem 1.5rem' : '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 70% at 50% 50%, rgba(74,89,64,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 300, letterSpacing: '-0.02em', color: 'white', marginBottom: '1rem', lineHeight: 1.1 }}>
            {t('Tu primer par.', 'Your first pair.')}<br />
            <em style={{ color: 'var(--cream-dark)', fontStyle: 'italic' }}>{t('Nuestro mejor precio.', 'Our best price.')}</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem', fontSize: '14px', lineHeight: 1.7 }}>
            {t('Usa el código ', 'Use code ')}
            <span style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', padding: '2px 10px', borderRadius: '3px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.12)' }}>VERLY10</span>
            {t(' y obtén 10% de descuento en tu primer pedido.', ' and get 10% off your first order.')}
          </p>
          <a href="/Tienda" style={{ background: 'white', color: 'var(--charcoal)', padding: '13px 36px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase', display: 'inline-block' }}>
            {t('Ver armazones', 'Shop frames')}
          </a>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: esMobil ? '4rem 1.5rem' : '7rem 2rem', maxWidth: '660px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '0.6rem' }}>FAQ</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
            {t('Preguntas frecuentes', 'Frequently Asked Questions')}
          </h2>
        </div>
        {[
          { q_es: '¿Necesito aseguranza médica?', q_en: 'Do I need health insurance?', a_es: 'No. Vendemos directamente al cliente, sin necesidad de seguro médico.', a_en: 'No. We sell directly to you, no insurance needed.' },
          { q_es: '¿Cuánto tarda la entrega?', q_en: 'How long does delivery take?', a_es: 'Envío express en 3 a 5 días hábiles.', a_en: 'Express delivery in 3 to 5 business days.' },
          { q_es: '¿Cómo ingreso mi graduación?', q_en: 'How do I enter my prescription?', a_es: 'Puedes escribir los números o subir una foto de tu receta. Ambas opciones disponibles al personalizar tus micas.', a_en: 'You can enter the numbers manually or upload a photo of your prescription.' },
          { q_es: '¿Puedo devolver mis lentes?', q_en: 'Can I return my glasses?', a_es: 'Sí, tienes 30 días para hacer una devolución sin complicaciones.', a_en: 'Yes, you have 30 days for a hassle-free return.' },
          { q_es: '¿Qué métodos de pago aceptan?', q_en: 'What payment methods do you accept?', a_es: 'Aceptamos todas las tarjetas de crédito y débito.', a_en: 'We accept all major credit and debit cards.' },
        ].map((f, i) => (
          <details key={i} style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '0.5rem', overflow: 'hidden' }}>
            <summary style={{ padding: '1.1rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {t(f.q_es, f.q_en)}
              <span style={{ color: 'var(--sage)', fontSize: '18px', fontWeight: 300, flexShrink: 0, marginLeft: '1rem' }}>+</span>
            </summary>
            <div style={{ padding: '0 1.5rem 1.1rem', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--warm-gray)', lineHeight: 1.75 }}>
              {t(f.a_es, f.a_en)}
            </div>
          </details>
        ))}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--charcoal)', color: 'rgba(255,255,255,0.35)', padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto 3rem' }}>
          <div>
            <img src="/logo-trasparente.png" alt="Verly Optical" style={{ height: '36px', width: 'auto', marginBottom: '1rem', opacity: 0.85 }}/>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.8, maxWidth: '200px', color: 'rgba(255,255,255,0.35)' }}>
              {t('Lentes accesibles para toda la familia.', 'Affordable eyewear for everyone.')}
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              {t('Tienda', 'Shop')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/Tienda', es: 'Eyeglasses', en: 'Eyeglasses' },
                { href: '/sunglasses', es: 'Sunglasses', en: 'Sunglasses' },
              ].map((l, i) => (
                <a key={i} href={l.href} style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >{t(l.es, l.en)}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              {t('Ayuda', 'Help')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="#faq" style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >FAQ</a>
              <a href="mailto:customerservice@verlyoptical.com" style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >{t('Contáctanos', 'Contact us')}</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '12px', maxWidth: '1100px', margin: '0 auto', color: 'rgba(255,255,255,0.2)' }}>
          © 2026 Verly Optical
        </div>
      </footer>
    </main>
  );
}