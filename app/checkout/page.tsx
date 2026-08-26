'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useLang } from '../components/LanguageContext';
import { fbTrack } from '../lib/fpixel';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
  const { items, totalPrecio } = useCart();
  const { t } = useLang() as unknown as { t: (es: string, en: string) => string };
  const [estado, setEstado] = useState<'cargando' | 'vacio' | 'listo'>('cargando');
  const initRef = useRef(false);

  useEffect(() => {
    // El carrito puede hidratar un instante después; damos un pequeño margen.
    const id = setTimeout(() => {
      setEstado(items && items.length > 0 ? 'listo' : 'vacio');
    }, 150);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, embedded: true }),
    });
    const data = await res.json();
    if (!initRef.current) {
      initRef.current = true;
      fbTrack('InitiateCheckout', {
        content_ids: items.map(i => String(i.armazon_id)),
        content_type: 'product',
        value: totalPrecio,
        currency: 'USD',
        num_items: items.length,
      });
    }
    return data.clientSecret as string;
  }, [items, totalPrecio]);

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', fontFamily: 'var(--font-sans)', color: 'var(--charcoal)' }}>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.25rem 5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 400, margin: '0 0 0.4rem' }}>
          {t('Finaliza tu compra', 'Checkout')}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--warm-gray)', margin: '0 0 2rem' }}>
          {t('Pago seguro con Stripe, sin salir de Verly.', 'Secure payment with Stripe, without leaving Verly.')}
        </p>

        {estado === 'vacio' && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ fontSize: '14px', color: 'var(--warm-gray)', marginBottom: '1.5rem' }}>
              {t('Tu carrito está vacío.', 'Your cart is empty.')}
            </p>
            <Link href="/Tienda" style={{ display: 'inline-block', background: 'var(--sage)', color: 'white', padding: '13px 28px', borderRadius: '3px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
              {t('Ver armazones', 'Shop frames')}
            </Link>
          </div>
        )}

        {estado === 'listo' && (
          <>
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 6px 30px rgba(0,0,0,0.05)', padding: '10px', overflow: 'hidden' }}>
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '1.5rem', color: 'var(--warm-gray)', fontSize: '12px', letterSpacing: '0.02em' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{t('Pago cifrado y seguro con Stripe', 'Encrypted, secure payment with Stripe')}</span>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
