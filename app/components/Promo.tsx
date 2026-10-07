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
export function PromoAncho({ clave, margen = '0', enGrid = false, compacto = false }: { clave: Clave; margen?: string; enGrid?: boolean; compacto?: boolean }) {
  const { lang } = useLang() as any;
  const p = PROMOS[clave];
  const i = lang === 'es' ? 0 : 1;
  return (
    <Link href={p.href} className={`pa pa-${p.tono}${enGrid ? ' pa-grid' : ''}${compacto ? ' pa-comp' : ''}`} style={{ margin: margen }}>
      <img src={p.img} alt="" loading="lazy" style={{ objectPosition: p.pos }} />
      <div className="pa-tx">
        <span className="pa-eye">{p.txt.eye[i]}</span>
        <h3>{p.txt.h[i]}</h3>
        <p>{p.txt.p[i]}</p>
        <span className="pa-cta">{p.txt.cta[i]} →</span>
      </div>
      <style>{`
        .pa{position:relative;display:block;overflow:hidden;text-decoration:none}
        .pa img{display:block;width:100%;height:clamp(220px,19vw,320px);object-fit:cover}
        .pa-grid{grid-column:1/-1;border-radius:4px;margin:6px 0 !important}
        .pa-grid .pa-tx{left:40px}
        .pa-comp{border-radius:6px}
        .pa-comp img{height:210px}
        .pa-comp .pa-tx{left:28px;max-width:56%}
        .pa-comp h3{font-size:1.45rem}
        .pa-comp p{font-size:13px;margin-bottom:10px}
        .pa-tx{position:absolute;top:50%;transform:translateY(-50%);left:max(2.5rem,calc((100vw - 1280px)/2 + 2.5rem));max-width:400px}
        .pa-claro{color:var(--charcoal)}
        .pa-oscuro{color:#fff}
        .pa-eye{display:block;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px;opacity:.75}
        .pa h3{font-size:clamp(1.6rem,2.6vw,2.3rem);font-weight:500;letter-spacing:-.03em;line-height:1.05;margin:0 0 12px;color:inherit}
        .pa p{font-size:14px;line-height:1.55;margin:0 0 14px;opacity:.85}
        .pa-cta{display:inline-block;font-size:13px;font-weight:500;border-bottom:1px solid currentColor;padding-bottom:2px}
        @media (max-width:768px){
          /* En celular: imagen arriba y texto abajo (no encima, para no tapar caras ni armazones) */
          .pa img,.pa-comp img{height:190px}
          .pa-tx,.pa-grid .pa-tx,.pa-comp .pa-tx{position:static;transform:none;max-width:none;padding:18px 1.25rem 22px}
          .pa-claro{background:var(--cream-dark)}
          .pa-oscuro{background:#0b2350}
          .pa h3,.pa-comp h3{font-size:1.45rem;margin-bottom:8px}
          .pa p{font-size:13.5px;margin-bottom:12px}
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
  // Precio grande: se toma del texto (ej. "$49 más…") para no repetir la lista de precios
  const precio = (p.txt.p[i].match(/\$\d+/) || [''])[0];
  return (
    <Link href={p.href} className="pv">
      <img src={p.img} alt="" loading="lazy" />
      <div className="pv-tx">
        <span className="pv-eye">{p.txt.eye[i]}</span>
        <h3>{p.txt.h[i]}</h3>
        {precio && <div className="pv-precio"><small>+</small>{precio}</div>}
        <p>{i === 0 ? 'en cualquier armazón' : 'on any frame'}</p>
        <span className="pv-cta">{p.txt.cta[i]} →</span>
      </div>
      <style>{`
        .pv{position:relative;display:flex;align-items:center;justify-content:center;grid-row:span 2;border-radius:4px;overflow:hidden;text-decoration:none;color:var(--charcoal);min-height:420px}
        .pv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .8s ease}
        .pv:hover img{transform:scale(1.03)}
        /* Tarjeta centrada entre los dos armazones de la foto */
        .pv-tx{position:relative;z-index:1;width:calc(100% - 36px);max-width:290px;text-align:center;background:rgba(253,252,250,.92);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border-radius:14px;padding:20px 18px 18px;box-shadow:0 10px 30px rgba(0,0,0,.08)}
        .pv-eye{display:inline-block;font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#fff;background:var(--sage);border-radius:99px;padding:5px 12px;margin-bottom:12px}
        .pv h3{font-size:1.35rem;font-weight:500;letter-spacing:-.03em;line-height:1.12;margin:0 0 10px;color:inherit}
        .pv-precio{font-size:2.4rem;font-weight:600;letter-spacing:-.04em;line-height:1;color:var(--sage)}
        .pv-precio small{font-size:.55em;font-weight:500;vertical-align:.45em;margin-right:2px}
        .pv p{font-size:12.5px;margin:4px 0 14px;color:var(--warm-gray)}
        .pv-cta{display:inline-block;font-size:12.5px;font-weight:600;color:#fff;background:var(--charcoal);border-radius:99px;padding:9px 18px}
        @media (max-width:900px){.pv-tx{width:calc(100% - 16px);padding:14px 10px 12px;border-radius:12px}.pv-eye{font-size:9px;padding:4px 9px;letter-spacing:.1em}.pv h3{font-size:1rem}.pv-precio{font-size:1.8rem}.pv p{font-size:11px;margin-bottom:10px}.pv-cta{font-size:11px;padding:7px 12px}}
      `}</style>
    </Link>
  );
}
