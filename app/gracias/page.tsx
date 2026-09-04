// app/gracias/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { fbTrack } from '../lib/fpixel';

export default function Gracias() {
  const { t, lang } = useLang() as any;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  // Meta Pixel · Purchase — solo si Stripe confirma el pago, y sin duplicar al recargar.
  useEffect(() => {
    const sid = new URLSearchParams(window.location.search).get('session_id');
    if (!sid) return;
    const key = 'fb_purchase_' + sid;
    if (localStorage.getItem(key)) return; // ya se disparó para esta orden
    fetch('/api/verify-payment?session_id=' + encodeURIComponent(sid))
      .then(r => r.json())
      .then(d => {
        if (d && d.paid) {
          localStorage.setItem(key, '1');
          fbTrack('Purchase', {
            content_ids: d.content_ids || [],
            content_type: 'product',
            value: d.value,
            currency: d.currency || 'USD',
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main style={{
      fontFamily: 'var(--font-sans)',
      background: 'var(--cream)',
      minHeight: '100vh',
      color: 'var(--charcoal)',
    }}>
      <Navbar />

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '8rem 2rem 4rem',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>

        {/* Ícono check */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--cream-dark)',
          border: '1.5px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        {/* Título */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.7rem',
          fontWeight: 500,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--sage)',
          marginBottom: '0.75rem',
        }}>
          {t('Pedido confirmado', 'Order confirmed')}
        </p>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          fontWeight: 300,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          color: 'var(--charcoal)',
        }}>
          {lang === 'es'
            ? <>¡Gracias por tu<br />compra!</>
            : <>Thank you for<br />your order!</>
          }
        </h1>

        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '15px',
          color: 'var(--warm-gray)',
          lineHeight: 1.8,
          marginBottom: '3rem',
          maxWidth: '420px',
          margin: '0 auto 3rem',
        }}>
          {t(
            'Hemos recibido tu pedido. Nuestro equipo lo revisará y comenzará a preparar tus lentes. Te contactaremos si necesitamos algo más.',
            'We have received your order. Our team will review it and start preparing your lenses. We will reach out if we need anything else.'
          )}
        </p>

        {/* Pasos */}
        <div style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          textAlign: 'left',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--warm-gray)',
            marginBottom: '1.25rem',
          }}>
            {t('¿Qué sigue?', "What's next?")}
          </p>
          {[
            {
              num: '01',
              es: 'Revisión de receta',
              en: 'Prescription review',
              desc_es: 'Verificamos tu graduación antes de fabricar.',
              desc_en: 'We verify your prescription before manufacturing.',
            },
            {
              num: '02',
              es: 'Fabricación',
              en: 'Manufacturing',
              desc_es: 'Tus micas se fabrican con tu prescripción exacta.',
              desc_en: 'Your lenses are made to your exact prescription.',
            },
            {
              num: '03',
              es: 'Envío',
              en: 'Shipping',
              desc_es: 'Recibirás tu número de rastreo por correo.',
              desc_en: "You'll receive your tracking number by email.",
            },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              paddingBottom: i < 2 ? '1rem' : 0,
              marginBottom: i < 2 ? '1rem' : 0,
              borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem',
                fontWeight: 300,
                color: 'var(--sage)',
                flexShrink: 0,
                lineHeight: 1.3,
              }}>
                {s.num}
              </span>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '2px' }}>
                  {t(s.es, s.en)}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--warm-gray)', lineHeight: 1.6 }}>
                  {t(s.desc_es, s.desc_en)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <Link
            href="/Tienda"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--cream)',
              background: 'var(--charcoal)',
              padding: '0.85rem 2.5rem',
              borderRadius: '2px',
              textDecoration: 'none',
              transition: 'background 0.2s ease',
              display: 'inline-block',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--sage)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--charcoal)')}
          >
            {t('Seguir comprando', 'Continue shopping')}
          </Link>

          
            <a href="mailto:customerservice@verlyoptical.com" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)', textDecoration: 'none', letterSpacing: '0.04em' }}>
            {t('¿Preguntas? Contáctanos', 'Questions? Contact us')}
          </a>
        </div>
      </div>
    </main>
  );
}