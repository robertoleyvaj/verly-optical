'use client';
// Franja de confianza: garantía, devoluciones, envío y pago seguro.
// variante "franja" (portada/catálogo) o "compacta" (junto al botón de comprar).
import Link from 'next/link';
import { useLang } from './LanguageContext';
import { GARANTIA_DIAS, DEVOLUCION_DIAS } from '../lib/marca';
import { ENVIO_GRATIS_DESDE } from '../lib/envio';

const Ico = ({ d }: { d: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

export default function Garantias({ variante = 'franja' }: { variante?: 'franja' | 'compacta' }) {
  const { t } = useLang() as any;
  const items = [
    { href: '/warranty', ico: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z M9 12l2 2 4-4', h: t(`Garantía de ${GARANTIA_DIAS} días`, `${GARANTIA_DIAS}-day guarantee`), p: t('Si tu graduación no queda, rehacemos tus micas gratis.', 'If your prescription isn’t right, we remake your lenses free.') },
    { href: '/returns', ico: 'M4 12a8 8 0 1 0 3-6.2 M4 4v4h4', h: t(`${DEVOLUCION_DIAS} días para devolver`, `${DEVOLUCION_DIAS}-day returns`), p: t('¿No te convencieron? Te regresamos tu dinero.', 'Not happy? Get a full refund.') },
    { href: '/shipping', ico: 'M3 7h11v9H3z M14 10h4l3 3v3h-7z M7 19a1.5 1.5 0 1 0 0-.01 M17 19a1.5 1.5 0 1 0 0-.01', h: t('Envío gratis desde $' + ENVIO_GRATIS_DESDE, 'Free shipping over $' + ENVIO_GRATIS_DESDE), p: t('A todo Estados Unidos, con número de guía.', 'Anywhere in the US, with tracking.') },
    { href: '/shipping', ico: 'M5 11h14v9H5z M8 11V8a4 4 0 0 1 8 0v3', h: t('Pago seguro', 'Secure checkout'), p: t('Tarjeta, Apple Pay o Google Pay.', 'Card, Apple Pay or Google Pay.') },
  ];

  if (variante === 'compacta') {
    return (
      <div className="vg-c">
        {items.slice(0, 3).map(i => (
          <Link key={i.h} href={i.href} className="vg-c-i"><span className="vg-ico"><Ico d={i.ico} /></span><span><b>{i.h}</b><br />{i.p}</span></Link>
        ))}
        <style>{`
          .vg-c{display:flex;flex-direction:column;gap:10px;border:1px solid var(--border);border-radius:16px;padding:14px 16px;background:#fff}
          .vg-c-i{display:flex;gap:12px;align-items:flex-start;text-decoration:none;color:var(--warm-gray);font-size:12.5px;line-height:1.45}
          .vg-c-i b{color:var(--charcoal);font-size:13.5px;font-weight:600}
          .vg-ico{color:var(--sage);flex-shrink:0;margin-top:1px}
        `}</style>
      </div>
    );
  }

  return (
    <section className="vg-f">
      <div className="vg-wrap">
        {items.map(i => (
          <Link key={i.h} href={i.href} className="vg-i">
            <span className="vg-ico"><Ico d={i.ico} /></span>
            <span className="vg-tx"><b>{i.h}</b><span>{i.p}</span></span>
          </Link>
        ))}
      </div>
      <style>{`
        .vg-f{background:var(--cream-dark);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .vg-wrap{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)}
        .vg-i{display:flex;flex-direction:row;align-items:center;gap:14px;padding:24px 24px;text-decoration:none;color:var(--warm-gray);font-size:13.5px;line-height:1.5;border-right:1px solid var(--border);transition:background .2s}
        .vg-i:last-child{border-right:0}
        .vg-i:hover{background:rgba(255,255,255,.45)}
        .vg-tx{display:flex;flex-direction:column;gap:2px;font-size:12.5px}
        .vg-i b{color:var(--charcoal);font-size:14px;font-weight:600}
        .vg-ico{color:var(--sage)}
        @media (max-width:900px){.vg-wrap{grid-template-columns:1fr 1fr}.vg-i{padding:20px 16px;border-bottom:1px solid var(--border)}.vg-i:nth-child(2n){border-right:0}}
      `}</style>
    </section>
  );
}
