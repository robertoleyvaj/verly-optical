'use client';
// Banners de promoción de micas y filtros (imagen limpia + texto encima, en ES/EN).
import Link from 'next/link';
import { useLang } from './LanguageContext';
import { VISION_PRICES, MATERIAL_PRICES, FILTRO_PRICES } from '../lib/precios';

type Clave = 'luzAzul' | 'progresivos' | 'fotocromatico' | 'policarbonato';
type Txt = { eye: [string, string]; h: [string, string]; p: [string, string]; cta: [string, string] };

const PROMOS: Record<Clave, { img: string; href: string; tono: 'claro' | 'oscuro'; pos: string; txt: Txt }> = {
  luzAzul: {
    img: '/promo/luz-azul.jpg', href: '/blue-light-glasses', tono: 'oscuro', pos: '78% center',
    txt: {
      eye: ['Filtro de luz azul', 'Blue light filter'],
      h: ['Descansa tus ojos frente a la pantalla', 'Give your eyes a break from screens'],
      p: [`Agrégalo a cualquier armazón por $${FILTRO_PRICES.blue} más.`, `Add it to any frame for $${FILTRO_PRICES.blue} more.`],
      cta: ['Conocer más', 'Learn more'],
    },
  },
  progresivos: {
    img: '/promo/progresivos.jpg', href: '/progressive-glasses', tono: 'claro', pos: '80% center',
    txt: {
      eye: ['Lentes progresivos', 'Progressive lenses'],
      h: ['De cerca y de lejos, en un solo lente', 'Near and far, in one lens'],
      p: [`Sin cambiar de lentes en todo el día. Desde $${VISION_PRICES.prog} más el armazón.`, `No more switching glasses. From $${VISION_PRICES.prog} plus the frame.`],
      cta: ['Conocer más', 'Learn more'],
    },
  },
  fotocromatico: {
    img: '/promo/fotocromatico.jpg', href: '/photochromic-glasses', tono: 'claro', pos: 'center',
    txt: {
      eye: ['Fotocromático', 'Photochromic'],
      h: ['Claros adentro, oscuros al sol', 'Clear inside, dark in the sun'],
      p: [`$${FILTRO_PRICES.foto} más en cualquier armazón.`, `$${FILTRO_PRICES.foto} more on any frame.`],
      cta: ['Conocer más', 'Learn more'],
    },
  },
  policarbonato: {
    img: '/promo/policarbonato.jpg', href: '/lenses', tono: 'claro', pos: '82% center',
    txt: {
      eye: ['Micas de policarbonato', 'Polycarbonate lenses'],
      h: ['Más ligeras y resistentes', 'Lighter and stronger'],
      p: [`Más delgadas que la mica estándar. Ideales para niños, deporte y graduaciones altas. $${MATERIAL_PRICES.poly} más.`, `Thinner than standard lenses. Great for kids, sports and stronger prescriptions. $${MATERIAL_PRICES.poly} more.`],
      cta: ['Conocer más', 'Learn more'],
    },
  },
};

// Banner ancho (portada, catálogo, página del armazón)
export function PromoAncho({ clave, margen = '0' }: { clave: Clave; margen?: string }) {
  const { lang } = useLang() as any;
  const p = PROMOS[clave];
  const i = lang === 'es' ? 0 : 1;
  return (
    <Link href={p.href} className={`pa pa-${p.tono}`} style={{ margin: margen }}>
      <img src={p.img} alt="" loading="lazy" style={{ objectPosition: p.pos }} />
      <div className="pa-tx">
        <span className="pa-eye">{p.txt.eye[i]}</span>
        <h3>{p.txt.h[i]}</h3>
        <p>{p.txt.p[i]}</p>
        <span className="pa-cta">{p.txt.cta[i]} →</span>
      </div>
      <style>{`
        .pa{position:relative;display:block;overflow:hidden;text-decoration:none}
        .pa img{display:block;width:100%;height:clamp(300px,30vw,480px);object-fit:cover}
        .pa-tx{position:absolute;top:50%;transform:translateY(-50%);left:max(2.5rem,calc((100vw - 1280px)/2 + 2.5rem));max-width:400px}
        .pa-claro{color:var(--charcoal)}
        .pa-oscuro{color:#fff}
        .pa-eye{display:block;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;margin-bottom:12px;opacity:.75}
        .pa h3{font-size:clamp(1.8rem,3vw,2.7rem);font-weight:500;letter-spacing:-.03em;line-height:1.05;margin:0 0 12px;color:inherit}
        .pa p{font-size:14.5px;line-height:1.6;margin:0 0 20px;opacity:.85}
        .pa-cta{display:inline-block;font-size:13px;font-weight:500;border-bottom:1px solid currentColor;padding-bottom:2px}
        @media (max-width:768px){
          .pa img{height:460px}
          .pa::after{content:'';position:absolute;inset:0}
          .pa-claro::after{background:linear-gradient(to bottom,rgba(247,244,239,.96) 0%,rgba(247,244,239,.85) 40%,rgba(247,244,239,0) 70%)}
          .pa-oscuro::after{background:linear-gradient(to bottom,rgba(6,28,70,.9) 0%,rgba(6,28,70,.7) 40%,rgba(6,28,70,0) 70%)}
          .pa-tx{top:28px;transform:none;left:1.25rem;right:1.25rem;z-index:1}
        }
      `}</style>
    </Link>
  );
}

// Tarjeta vertical para el catálogo (ocupa el lugar de un armazón y el alto de dos)
export function PromoVertical({ clave }: { clave: Clave }) {
  const { lang } = useLang() as any;
  const p = PROMOS[clave];
  const i = lang === 'es' ? 0 : 1;
  return (
    <Link href={p.href} className="pv">
      <img src={p.img} alt="" loading="lazy" />
      <div className="pv-tx">
        <span className="pv-eye">{p.txt.eye[i]}</span>
        <h3>{p.txt.h[i]}</h3>
        <p>{p.txt.p[i]}</p>
        <span className="pv-cta">{p.txt.cta[i]} →</span>
      </div>
      <style>{`
        .pv{position:relative;display:block;grid-row:span 2;border-radius:20px;overflow:hidden;text-decoration:none;color:var(--charcoal);min-height:420px}
        .pv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .pv::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(247,244,239,.95) 0%,rgba(247,244,239,.8) 22%,rgba(247,244,239,0) 40%)}
        .pv-tx{position:relative;z-index:1;padding:24px 22px}
        .pv-eye{display:block;font-size:10.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;opacity:.7;margin-bottom:10px}
        .pv h3{font-size:1.55rem;font-weight:500;letter-spacing:-.03em;line-height:1.08;margin:0 0 8px;color:inherit}
        .pv p{font-size:13px;line-height:1.5;margin:0 0 12px;opacity:.85}
        .pv-cta{font-size:12.5px;font-weight:500;border-bottom:1px solid currentColor;padding-bottom:2px}
        @media (max-width:900px){.pv{border-radius:16px}.pv-tx{padding:16px 14px}.pv h3{font-size:1.2rem}.pv p{font-size:12px}}
      `}</style>
    </Link>
  );
}
