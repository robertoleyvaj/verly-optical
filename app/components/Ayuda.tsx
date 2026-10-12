'use client';
// Página de Ayuda (/help): 5 guías con su video (cuando exista) y los pasos escritos.
// Sirve también para mandar el link a un cliente: /help#receta lleva directo a esa guía.
import Link from 'next/link';
import Navbar from './Navbar';
import { useLang } from './LanguageContext';
import { VIDEOS_AYUDA, SOPORTE_EMAIL, GARANTIA_DIAS, DEVOLUCION_DIAS, whatsappLink } from '../lib/marca';
import { VISION_PRICES, FILTRO_PRICES } from '../lib/precios';
import { ENVIO_GRATIS_DESDE } from '../lib/envio';

type Guia = { id: keyof typeof VIDEOS_AYUDA; h: [string, string]; intro: [string, string]; pasos: [string, string][]; link?: { href: string; t: [string, string] } };

const GUIAS: Guia[] = [
  {
    id: 'comprar',
    h: ['Cómo comprar tus lentes', 'How to buy your glasses'],
    intro: ['Todo se hace desde el celular en unos minutos.', 'You can do it all from your phone in a few minutes.'],
    pasos: [
      ['Entra a Armazones y usa los filtros (forma, color, talla) para encontrar el tuyo.', 'Go to Frames and use the filters (shape, color, size) to find yours.'],
      ['Abre el armazón, elige el color y toca "Elegir mis micas".', 'Open the frame, pick a color and tap "Choose my lenses".'],
      ['Agrega tu receta (escribiéndola o con una foto).', 'Add your prescription (type it or upload a photo).'],
      ['Elige el tipo de visión, el material y los filtros que quieras.', 'Choose your vision type, lens material and any coatings.'],
      ['Revisa el resumen, agrega al carrito y paga con tarjeta, Apple Pay o Google Pay.', 'Review the summary, add to cart and pay with card, Apple Pay or Google Pay.'],
    ],
    link: { href: '/Tienda', t: ['Ver armazones', 'Shop frames'] },
  },
  {
    id: 'tratamientos',
    h: ['Cómo agregar filtros a tus micas', 'How to add lens coatings'],
    intro: ['Cada filtro es un extra que se suma al precio de tus lentes. Ves el total antes de pagar.', 'Each coating is an add-on to the price of your glasses. You see the total before paying.'],
    pasos: [
      ['Abre un armazón y toca "Elegir mis micas".', 'Open a frame and tap "Choose my lenses".'],
      ['En el paso Filtros escoge los que quieras: antirreflejante, Blue Light Comfort, fotocromático y más.', 'In the Filters step pick what you want: anti-reflective, Blue Light Comfort, photochromic and more.'],
      [`Ejemplo: agrega antirreflejante por $${FILTRO_PRICES.ar} más o fotocromático por $${FILTRO_PRICES.foto} más.`, `Example: add anti-reflective for $${FILTRO_PRICES.ar} more or photochromic for $${FILTRO_PRICES.foto} more.`],
      ['El precio se actualiza al momento en el resumen.', 'The price updates instantly in the summary.'],
    ],
    link: { href: '/lenses', t: ['Ver todas las micas y filtros', 'See all lenses and coatings'] },
  },
  {
    id: 'receta',
    h: ['Cómo poner tu graduación', 'How to enter your prescription'],
    intro: ['Tienes tres opciones. Si tienes dudas, nosotros revisamos tu receta antes de hacer tus micas.', 'You have three options. If you are unsure, we review your prescription before making your lenses.'],
    pasos: [
      ['Escribirla: llena los valores SPH, CYL, EJE, ADD y DP de cada ojo tal como vienen en tu receta.', 'Type it: enter SPH, CYL, AXIS, ADD and PD for each eye exactly as they appear on your prescription.'],
      ['Subir una foto: tómale foto a tu receta o sube un PDF o una captura de pantalla.', 'Upload a photo: take a picture of your prescription, or upload a PDF or a screenshot.'],
      ['Agregarla después: puedes seguir eligiendo tus micas y poner tu receta antes de pagar.', 'Add it later: keep choosing your lenses and add your prescription before you pay.'],
    ],
  },
  {
    id: 'bifocales',
    h: ['Bifocales o progresivos: cómo elegir', 'Bifocal or progressive: how to choose'],
    intro: ['Si necesitas ver de lejos y de cerca, tienes dos opciones.', 'If you need to see far and near, you have two options.'],
    pasos: [
      [`Bifocal (+$${VISION_PRICES.bi}): dos zonas, una para lejos y otra para cerca, con una línea visible.`, `Bifocal (+$${VISION_PRICES.bi}): two zones, one for distance and one for reading, with a visible line.`],
      [`Progresivo (+$${VISION_PRICES.prog}): todas las distancias en un solo lente, sin línea visible.`, `Progressive (+$${VISION_PRICES.prog}): every distance in one lens, with no visible line.`],
      ['Escógelo en el paso Visión al personalizar tus micas. El precio se suma al de tus lentes.', 'Choose it in the Vision step when customizing your lenses. The price is added to your glasses.'],
    ],
    link: { href: '/progressive-glasses', t: ['Más sobre progresivos', 'More about progressive lenses'] },
  },
  {
    id: 'garantias',
    h: ['Garantía y devoluciones', 'Guarantee and returns'],
    intro: ['Compra con confianza.', 'Shop with confidence.'],
    pasos: [
      [`Garantía de ${GARANTIA_DIAS} días: si tu graduación no queda o no te adaptas, rehacemos tus micas gratis.`, `${GARANTIA_DIAS}-day guarantee: if your prescription isn’t right or you can’t adapt, we remake your lenses free.`],
      [`${DEVOLUCION_DIAS} días para devolver: te regresamos tu dinero y te mandamos la guía de regreso gratis.`, `${DEVOLUCION_DIAS}-day returns: full refund and a free prepaid return label.`],
      ['Defectos de fabricación: cambiamos tu armazón o tus micas sin costo.', 'Manufacturing defects: we replace your frame or lenses at no cost.'],
      [`Envío gratis en compras desde $${ENVIO_GRATIS_DESDE}.`, `Free shipping on orders over $${ENVIO_GRATIS_DESDE}.`],
    ],
    link: { href: '/returns', t: ['Leer la política completa', 'Read the full policy'] },
  },
];

function Video({ url, titulo }: { url: string; titulo: string }) {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/);
  if (yt) return (
    <div className="ay-video"><iframe src={`https://www.youtube-nocookie.com/embed/${yt[1]}`} title={titulo} allow="encrypted-media; picture-in-picture" allowFullScreen /></div>
  );
  return <div className="ay-video"><video src={url} controls playsInline preload="metadata" /></div>;
}

export default function Ayuda() {
  const { lang } = useLang() as any;
  const i = lang === 'es' ? 0 : 1;
  const wa = whatsappLink(i === 0 ? 'Hola, tengo una pregunta' : 'Hi, I have a question');
  return (
    <main className="ay">
      <Navbar />
      <header className="ay-wrap ay-head">
        <p className="ay-eye">{i === 0 ? 'Ayuda' : 'Help'}</p>
        <h1>{i === 0 ? '¿Cómo te ayudamos?' : 'How can we help?'}</h1>
        <nav className="ay-indice">
          {GUIAS.map(g => <a key={g.id} href={`#${g.id}`}>{g.h[i]}</a>)}
        </nav>
      </header>

      <div className="ay-wrap">
        {GUIAS.map(g => (
          <section key={g.id} id={g.id} className="ay-guia">
            <div className="ay-col">
              <h2>{g.h[i]}</h2>
              <p className="ay-intro">{g.intro[i]}</p>
              <ol>{g.pasos.map((p, k) => <li key={k}>{p[i]}</li>)}</ol>
              {g.link && <Link href={g.link.href} className="ay-link">{g.link.t[i]} →</Link>}
            </div>
            <Video url={VIDEOS_AYUDA[g.id]} titulo={g.h[i]} />
          </section>
        ))}

        <section className="ay-contacto">
          <h2>{i === 0 ? '¿Sigues con dudas?' : 'Still have questions?'}</h2>
          <p>{i === 0 ? 'Escríbenos y te ayudamos en español o en inglés.' : 'Message us and we’ll help you in English or Spanish.'}</p>
          <div>
            <a href={`mailto:${SOPORTE_EMAIL}`} className="ay-btn">{SOPORTE_EMAIL}</a>
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="ay-btn ay-btn-2">WhatsApp</a>}
          </div>
        </section>
      </div>

      <style>{`
        .ay{background:var(--cream);color:var(--charcoal);min-height:100vh;padding-top:72px}
        .ay-wrap{max-width:1100px;margin:0 auto;padding:0 2.5rem}
        .ay-head{padding-top:56px;padding-bottom:32px;border-bottom:1px solid var(--border)}
        .ay-eye{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--warm-gray);margin:0 0 10px}
        .ay h1{font-size:clamp(2.2rem,4vw,3.2rem);font-weight:500;letter-spacing:-.035em;margin:0 0 22px}
        .ay-indice{display:flex;flex-wrap:wrap;gap:8px}
        .ay-indice a{font-size:13px;color:var(--charcoal);text-decoration:none;border:1px solid var(--border);border-radius:99px;padding:8px 14px}
        .ay-indice a:hover{border-color:var(--charcoal)}
        .ay-guia{display:grid;grid-template-columns:1fr auto;gap:40px;padding:48px 0;border-bottom:1px solid var(--border);scroll-margin-top:90px}
        .ay-guia h2,.ay-contacto h2{font-size:clamp(1.5rem,2.4vw,2rem);font-weight:500;letter-spacing:-.03em;margin:0 0 8px}
        .ay-intro{font-size:15px;color:var(--warm-gray);margin:0 0 18px;line-height:1.6}
        .ay ol{margin:0 0 18px;padding-left:22px;display:flex;flex-direction:column;gap:10px}
        .ay li{font-size:15px;line-height:1.6;padding-left:4px}
        .ay li::marker{color:var(--sage);font-weight:600}
        .ay-link{font-size:13.5px;font-weight:500;color:var(--charcoal);text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:2px}
        .ay-video{width:270px;aspect-ratio:9/16;border-radius:14px;overflow:hidden;background:#000;flex-shrink:0}
        .ay-video video,.ay-video iframe{width:100%;height:100%;border:0;display:block;object-fit:cover}
        .ay-contacto{padding:56px 0 100px;text-align:center}
        .ay-contacto p{color:var(--warm-gray);margin:0 0 20px}
        .ay-contacto div{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
        .ay-btn{display:inline-block;background:var(--sage);color:#fff;border-radius:99px;padding:13px 22px;font-size:14px;font-weight:500;text-decoration:none}
        .ay-btn-2{background:transparent;color:var(--charcoal);border:1px solid var(--charcoal)}
        @media (max-width:800px){
          .ay-wrap{padding:0 1.25rem}
          .ay-guia{grid-template-columns:1fr;gap:20px;padding:36px 0}
          .ay-video{width:100%;max-width:320px;margin:0 auto}
        }
      `}</style>
    </main>
  );
}
