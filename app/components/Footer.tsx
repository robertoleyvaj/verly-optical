'use client';
// Pie de página para todo el sitio: tienda, ayuda, políticas, contacto y formas de pago.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from './LanguageContext';
import Logo from './Logo';
import { SOPORTE_EMAIL, HORARIO, whatsappLink } from '../lib/marca';

export default function Footer() {
  const { t, lang } = useLang() as any;
  const ruta = usePathname();
  if (ruta?.startsWith('/checkout') || ruta?.startsWith('/admin')) return null;
  const wa = whatsappLink(t('Hola, tengo una pregunta sobre mis lentes', 'Hi, I have a question about my glasses'));

  const col = (titulo: string, links: { href: string; label: string }[]) => (
    <div>
      <h4>{titulo}</h4>
      {links.map(l => <Link key={l.href + l.label} href={l.href}>{l.label}</Link>)}
    </div>
  );

  return (
    <footer className="vft">
      <div className="vft-wrap">
        <div className="vft-marca">
          <div className="vft-logo"><Logo color="#fff" size={22} /></div>
          <p>{t('Lentes con graduación a precio justo, hechos por ópticos de verdad.', 'Prescription glasses at a fair price, made by real opticians.')}</p>
          <div className="vft-contacto">
            <a href={`mailto:${SOPORTE_EMAIL}`}>{SOPORTE_EMAIL}</a>
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            <span>{lang === 'es' ? HORARIO.es : HORARIO.en}</span>
          </div>
        </div>
        {col(t('Tienda', 'Shop'), [
          { href: '/Tienda', label: t('Lentes', 'Eyeglasses') },
          { href: '/lenses', label: t('Micas', 'Lenses') },
          { href: '/about', label: t('Nosotros', 'About us') },
        ])}
        {col(t('Ayuda', 'Help'), [
          { href: '/shipping', label: t('Envíos', 'Shipping') },
          { href: '/returns', label: t('Devoluciones', 'Returns') },
          { href: '/warranty', label: t('Garantía', 'Warranty') },
          { href: '/#faq', label: t('Preguntas frecuentes', 'FAQ') },
        ])}
        {col('Legal', [
          { href: '/privacy', label: t('Privacidad', 'Privacy policy') },
          { href: '/terms', label: t('Términos', 'Terms of service') },
        ])}
      </div>
      <div className="vft-base">
        <span>© {new Date().getFullYear()} Verly Optical</span>
        <div className="vft-pagos" aria-label={t('Formas de pago', 'Payment methods')}>
          {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay'].map(p => <span key={p}>{p}</span>)}
        </div>
      </div>
      <style>{`
        .vft{background:#1C1C1A;color:rgba(255,255,255,.55);font-size:13.5px}
        .vft-wrap{max-width:1280px;margin:0 auto;padding:56px 2rem 36px;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:32px}
        .vft-logo{margin-bottom:18px}
        .vft-marca p{max-width:300px;line-height:1.6;margin:0 0 16px}
        .vft-contacto{display:flex;flex-direction:column;gap:6px}
        .vft-contacto a{color:#fff;text-decoration:none}
        .vft-contacto span{font-size:12px;color:rgba(255,255,255,.4)}
        .vft h4{color:#fff;font-size:13px;font-weight:600;margin:0 0 14px;font-family:var(--font-sans);letter-spacing:0}
        .vft-wrap > div:not(.vft-marca){display:flex;flex-direction:column;gap:10px}
        .vft-wrap a{color:rgba(255,255,255,.6);text-decoration:none;transition:color .15s}
        .vft-wrap a:hover{color:#fff}
        .vft-base{max-width:1280px;margin:0 auto;padding:18px 2rem 28px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;font-size:12px;color:rgba(255,255,255,.4)}
        .vft-pagos{display:flex;gap:6px;flex-wrap:wrap}
        .vft-pagos span{border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:3px 8px;font-size:11px;color:rgba(255,255,255,.7)}
        @media (max-width:900px){.vft-wrap{grid-template-columns:1fr 1fr;padding:40px 1.25rem 28px}.vft-marca{grid-column:1/-1}.vft-base{padding:16px 1.25rem 90px}}
      `}</style>
    </footer>
  );
}
