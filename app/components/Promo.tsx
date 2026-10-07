'use client';
// Banners de promoción de micas y filtros (imagen limpia + texto encima, en ES/EN).
import Link from 'next/link';
import { useLang } from './LanguageContext';
import { VISION_PRICES, MATERIAL_PRICES, FILTRO_PRICES } from '../lib/precios';

type Clave = 'luzAzul' | 'progresivos' | 'fotocromatico' | 'policarbonato';
// Nombres iguales a los del configurador de micas (Thin & Durable, Blue Light Comfort…)
type Txt = { eye: [string, string]; h: [string, string]; p: [string, string]; cta: [string, string] };
type Promo = { img: string; href: string; tono: 'claro' | 'oscuro'; pos: string; precio: number; desde?: boolean; txt: Txt };

const PROMOS: Record<Clave, Promo> = {
  luzAzul: {
    img: '/promo/luz-azul.jpg', href: '/blue-light-glasses', tono: 'oscuro', pos: '78% center', precio: FILTRO_PRICES.blue,
    txt: {
      eye: ['Blue Light Comfort', 'Blue Light Comfort'],
      h: ['Descansa tus ojos frente a la pantalla', 'Give your eyes a break from screens'],
      p: ['Filtro de luz azul para computadora y celular, en cualquier armazón.', 'Blue light filter for computer and phone, on any frame.'],
      cta: ['Conocer más', 'Learn more'],
    },
  },
  progresivos: {
    img: '/promo/progresivos.jpg', href: '/progressive-glasses', tono: 'claro', pos: '80% center', precio: VISION_PRICES.prog,
    txt: {
      eye: ['Progresivo', 'Progressive'],
      h: ['De cerca y de lejos, en un solo lente', 'Near and far, in one lens'],
      p: ['Sin cambiar de lentes en todo el día. Más el armazón que elijas.', 'No more switching glasses. Plus the frame you choose.'],
      cta: ['Conocer más', 'Learn more'],
    },
  },
  fotocromatico: {
    img: '/promo/fotocromatico.jpg', href: '/photochromic-glasses', tono: 'claro', pos: 'center', precio: FILTRO_PRICES.foto,
    txt: {
      eye: ['Fotocromático', 'Photochromic'],
      h: ['Claros adentro, oscuros al sol', 'Clear inside, dark in the sun'],
      p: ['en cualquier armazón', 'on any frame'],
      cta: ['Conocer más', 'Learn more'],
    },
  },
  policarbonato: {
    img: '/promo/policarbonato.jpg', href: '/lenses', tono: 'claro', pos: '82% center', precio: MATERIAL_PRICES.poly,
    txt: {
      eye: ['Thin & Durable', 'Thin & Durable'],
      h: ['Más ligeras y resistentes', 'Lighter and stronger'],
      p: ['Micas de policarbonato, más delgadas que la estándar. Ideales para niños, deporte y graduaciones altas.', 'Polycarbonate lenses, thinner than standard. Great for kids, sports and stronger prescriptions.'],
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
        <div className="pa-precio"><small>+</small>${p.precio}</div>
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
        .pa-eye{display:inline-block;font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#fff;background:var(--sage);border-radius:99px;padding:5px 12px;margin-bottom:12px}
        .pa-oscuro .pa-eye{background:#fff;color:#0b2350}
        .pa-precio{font-size:2.4rem;font-weight:600;letter-spacing:-.04em;line-height:1;margin:2px 0 8px;color:var(--sage)}
        .pa-oscuro .pa-precio{color:#fff}
        .pa-precio small{font-size:.5em;font-weight:500;vertical-align:.5em;margin-right:2px}
        .pa-comp .pa-precio{font-size:1.9rem}
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
  return (
    <Link href={p.href} className="pv">
      <img src={p.img} alt="" loading="lazy" />
      <div className="pv-tx">
        <span className="pv-eye">{p.txt.eye[i]}</span>
        <h3>{p.txt.h[i]}</h3>
        <div className="pv-precio"><small>+</small>${p.precio}</div>
        <p>{p.txt.p[i]}</p>
        <span className="pv-cta">{p.txt.cta[i]} →</span>
      </div>
      <style>{`
        .pv{position:relative;display:flex;align-items:center;justify-content:center;grid-row:span 2;border-radius:4px;overflow:hidden;text-decoration:none;color:var(--charcoal);min-height:420px}
        .pv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .8s ease}
        .pv:hover img{transform:scale(1.03)}
        /* Texto directo sobre la foto, centrado entre los dos armazones, con un halo suave (sin caja) */
        .pv-tx{position:absolute;z-index:1;left:0;right:0;top:60%;transform:translateY(-50%);padding:0 18px;text-align:center}
        .pv-tx::before{content:'';position:absolute;z-index:-1;left:50%;top:50%;width:125%;height:135%;transform:translate(-50%,-50%);background:radial-gradient(ellipse at center,rgba(253,252,250,.88) 0%,rgba(253,252,250,.6) 42%,rgba(253,252,250,0) 70%);pointer-events:none}
        .pv-eye{display:inline-block;font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#fff;background:var(--sage);border-radius:99px;padding:5px 12px;margin-bottom:10px}
        .pv h3{font-size:1.15rem;font-weight:500;letter-spacing:-.02em;line-height:1.15;margin:0 auto 4px;max-width:200px;color:inherit}
        .pv-precio{font-size:2.3rem;font-weight:600;letter-spacing:-.04em;line-height:1;color:var(--sage)}
        .pv-precio small{font-size:.5em;font-weight:500;vertical-align:.5em;margin-right:2px}
        .pv p{font-size:12.5px;margin:4px 0 10px;color:#4a463f}
        .pv-cta{display:inline-block;font-size:12.5px;font-weight:600;border-bottom:1.5px solid currentColor;padding-bottom:2px}
        @media (max-width:900px){.pv-tx{padding:0 8px}.pv-eye{font-size:9px;padding:4px 9px;letter-spacing:.1em}.pv h3{font-size:1rem}.pv-precio{font-size:1.9rem}.pv p{font-size:11px}.pv-cta{font-size:11px}}
      `}</style>
    </Link>
  );
}
