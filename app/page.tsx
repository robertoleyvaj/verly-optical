// app/page.tsx — Portada (estilo editorial: crema, verde oscuro, fotos grandes)
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Asistente from './components/Asistente';
import { PromoAncho } from './components/Promo';
import { useLang } from './components/LanguageContext';
import { supabase } from './lib/supabase';
import { swatchColor, nombreColor } from './lib/colores';
import { precioArmazonFinal } from './lib/precios';
import { DIAS_FABRICACION, DIAS_ENVIO, DEVOLUCION_DIAS, GARANTIA_DIAS } from './lib/marca';
import { ENVIO_GRATIS_DESDE } from './lib/envio';

type Destacado = { id: number; nombre: string; precio: number; foto: string; colores: { color: string; hex?: string | null }[] };

const Flecha = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export default function Home() {
  const { t, lang } = useLang() as any;
  const [quizOpen, setQuizOpen] = useState(false);
  const [destacados, setDestacados] = useState<Destacado[]>([]);

  // Armazones reales de OptiOS: los primeros 4 publicados que ya tienen foto
  useEffect(() => {
    (async () => {
      const { data: arms } = await supabase.from('armazones').select('*')
        .eq('activo', true).eq('publicar_verly', true).eq('tipo', 'optico').order('id', { ascending: false }).limit(40);
      const lista = arms || [];
      if (!lista.length) return;
      const { data: cols } = await supabase.from('armazon_colores').select('armazon_id, color, hex, imagen_url, orden')
        .in('armazon_id', lista.map((a: any) => a.id)).eq('publicar_verly', true).order('orden');
      const porModelo: Record<number, any[]> = {};
      for (const c of cols || []) (porModelo[c.armazon_id] ||= []).push(c);
      const out: Destacado[] = [];
      for (const a of lista as any[]) {
        const cs = porModelo[a.id] || [];
        const foto = a.imagen_url || cs.find(c => c.imagen_url)?.imagen_url;
        if (!foto) continue;
        out.push({ id: a.id, nombre: a.nombre, precio: precioArmazonFinal(a.precio, a.descuento_verly), foto, colores: cs.length ? cs : [{ color: a.color || '' }] });
        if (out.length === 4) break;
      }
      setDestacados(out);
    })();
  }, []);

  const formas = [
    { img: '/home/forma-redondos.jpg', es: 'Redondos', en: 'Round', href: '/Tienda?forma=round' },
    { img: '/home/forma-rectangulares.jpg', es: 'Rectangulares', en: 'Rectangular', href: '/Tienda?forma=rectangle,square' },
    { img: '/home/forma-cateye.jpg', es: 'Cat-eye', en: 'Cat-eye', href: '/Tienda?forma=cat-eye' },
    { img: '/home/forma-metal.jpg', es: 'De metal', en: 'Metal', href: '/Tienda?material=METAL' },
  ];

  const pasos = [
    { es: 'Elige tu armazón', en: 'Choose your frame', des: 'Filtra por forma, color y talla.', den: 'Filter by shape, color and size.', img: '/proceso-01.jpg' },
    { es: 'Sube tu receta', en: 'Upload your prescription', des: 'Una foto de tu receta o escribe los números.', den: 'A photo of your prescription, or type the numbers.', img: '/proceso-02.jpg' },
    { es: 'Elige tus micas', en: 'Choose your lenses', des: 'Material y filtros, como luz azul o fotocromático.', den: 'Material and coatings, like blue light or photochromic.', img: '/proceso-03.jpg' },
    { es: 'Recíbelos en casa', en: 'Get them at home', des: `Hacemos tus micas en ${DIAS_FABRICACION.min} a ${DIAS_FABRICACION.max} días y te llegan en ${DIAS_ENVIO.min} a ${DIAS_ENVIO.max} días hábiles.`, den: `We make your lenses in ${DIAS_FABRICACION.min}–${DIAS_FABRICACION.max} days and delivery takes ${DIAS_ENVIO.min}–${DIAS_ENVIO.max} business days.`, img: '/proceso-04.jpg' },
  ];

  const faqs = [
    { q: ['¿Necesito aseguranza?', 'Do I need insurance?'], a: ['No. Nos compras directo, sin aseguranza.', 'No. You buy directly from us, no insurance needed.'] },
    { q: ['¿Cómo envío mi receta?', 'How do I send my prescription?'], a: ['Al comprar puedes subir una foto de tu receta o escribir los números.', 'At checkout you can upload a photo of your prescription or type the numbers.'] },
    { q: ['¿Cuánto tarda en llegar?', 'How long does delivery take?'], a: [`Hacemos tus micas en ${DIAS_FABRICACION.min} a ${DIAS_FABRICACION.max} días hábiles y te llegan en ${DIAS_ENVIO.min} a ${DIAS_ENVIO.max} días hábiles más.`, `We make your lenses in ${DIAS_FABRICACION.min}–${DIAS_FABRICACION.max} business days, then delivery takes ${DIAS_ENVIO.min}–${DIAS_ENVIO.max} business days.`] },
    { q: ['¿Puedo devolver mis lentes?', 'Can I return my glasses?'], a: [`Sí, tienes ${DEVOLUCION_DIAS} días para devolverlos y te regresamos tu dinero.`, `Yes, you have ${DEVOLUCION_DIAS} days to return them for a full refund.`] },
    { q: ['¿Cómo puedo pagar?', 'How can I pay?'], a: ['Con tarjeta de crédito o débito, Apple Pay o Google Pay.', 'With credit or debit card, Apple Pay or Google Pay.'] },
  ];

  return (
    <main className="vh">
      <Navbar />
      {quizOpen && <Asistente onClose={() => setQuizOpen(false)} t={t} lang={lang} />}

      {/* Portada */}
      <section className="vh-hero">
        <picture>
          <source media="(max-width: 768px)" srcSet="/home/hero-movil.jpg" />
          <img src="/home/hero.jpg" alt={t('Armazones sobre pedestales de piedra', 'Frames on stone pedestals')} />
        </picture>
        <div className="vh-hero-tx">
          <h1>{lang === 'es' ? <>Lentes con tu graduación,<br />desde $28.</> : <>Prescription glasses,<br />from $28.</>}</h1>
          <p>{t('Armazón y micas con tu graduación. Sube una foto de tu receta y nosotros hacemos lo demás.', 'Frame and prescription lenses. Upload a photo of your prescription and we do the rest.')}</p>
          <div className="vh-btns">
            <Link href="/Tienda" className="vh-btn">{t('Ver armazones', 'Shop frames')} <Flecha /></Link>
            <button onClick={() => setQuizOpen(true)} className="vh-btn vh-btn-2">{t('Encontrar mi par', 'Find my pair')}</button>
          </div>
        </div>
      </section>

      {/* Formas */}
      <section className="vh-sec">
        <div className="vh-head">
          <div>
            <p className="vh-eye">{t('Nuestra colección', 'Our collection')}</p>
            <h2>{t('Encuentra tu forma', 'Find your shape')}</h2>
          </div>
          <p className="vh-side">{t('Todos los armazones incluyen micas con tu graduación, estuche y paño.', 'Every frame includes prescription lenses, a case and a cleaning cloth.')}</p>
        </div>
        <div className="vh-formas">
          {formas.map(f => (
            <Link key={f.href} href={f.href} className="vh-forma">
              <img src={f.img} alt={t(f.es, f.en)} loading="lazy" />
              <span>{t(f.es, f.en)} <Flecha /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados (productos reales) */}
      {destacados.length > 0 && (
        <section className="vh-sec">
          <div className="vh-head">
            <div>
              <p className="vh-eye">{t('Destacados', 'Featured')}</p>
              <h2>{t('Armazones destacados', 'Featured frames')}</h2>
            </div>
            <Link href="/Tienda" className="vh-link">{t('Ver todos los armazones', 'View all frames')} <Flecha /></Link>
          </div>
          <div className="vh-prods">
            {destacados.map(d => (
              <Link key={d.id} href={`/armazon/${d.id}`} className="vh-prod">
                <div className="vh-prod-img"><img src={d.foto} alt={d.nombre} loading="lazy" /></div>
                <b>{d.nombre}</b>
                <span>{t('Desde', 'From')} ${d.precio}</span>
                <div className="vh-sws">
                  {d.colores.slice(0, 5).map((c, i) => <i key={i} title={nombreColor(c.color, lang)} style={{ background: swatchColor(c.color, c.hex) }} />)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Promoción de micas */}
      <div className="vh-promo"><PromoAncho clave="luzAzul" /></div>

      {/* Dos colecciones */}
      <section className="vh-mitades">
        <Link href="/Tienda?material=ACETATE" className="vh-mitad">
          <img src="/home/acetato.jpg" alt={t('Armazón de acetato carey', 'Tortoise acetate frame')} loading="lazy" />
          <div>
            <h3>{t('Acetato clásico', 'Classic acetate')}</h3>
            <p>{t('Armazones de acetato en carey, negro y colores.', 'Acetate frames in tortoise, black and colors.')}</p>
            <span className="vh-link">{t('Ver colección', 'Shop the collection')} <Flecha /></span>
          </div>
        </Link>
        <Link href="/Tienda?color=transparente" className="vh-mitad">
          <img src="/home/transparentes.jpg" alt={t('Armazón transparente', 'Clear frame')} loading="lazy" />
          <div>
            <h3>{t('Transparentes', 'Clear frames')}</h3>
            <p>{t('Ligeros y fáciles de combinar con todo.', 'Light and easy to wear with anything.')}</p>
            <span className="vh-link">{t('Ver colección', 'Shop the collection')} <Flecha /></span>
          </div>
        </Link>
      </section>

      {/* Banner ancho */}
      <Link href="/Tienda?material=METAL" className="vh-banner">
        <img src="/home/metal-banner.jpg" alt={t('Armazón de metal dorado', 'Gold metal frame')} loading="lazy" />
        <div>
          <h3>{t('Armazones de metal', 'Metal frames')}</h3>
          <p>{t('Delgados y ligeros, en dorado y plateado.', 'Thin and light, in gold and silver.')}</p>
          <span className="vh-link">{t('Ver colección', 'Shop the collection')} <Flecha /></span>
        </div>
      </Link>

      {/* Cómo funciona */}
      <section className="vh-sec" id="como-funciona">
        <p className="vh-eye">{t('Cómo funciona', 'How it works')}</p>
        <h2>{t('Tus lentes en 4 pasos', 'Your glasses in 4 steps')}</h2>
        <div className="vh-pasos">
          {pasos.map((p, i) => (
            <div key={i} className="vh-paso">
              <div className="vh-paso-img"><img src={p.img} alt={t(p.es, p.en)} loading="lazy" /></div>
              <span className="vh-num">{String(i + 1).padStart(2, '0')}</span>
              <b>{t(p.es, p.en)}</b>
              <span>{t(p.des, p.den)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Nuestro compromiso: texto, sin íconos */}
      <section className="vh-sec">
        <p className="vh-eye">{t('Nuestro compromiso', 'Our promise')}</p>
        <h2>{t('Compra con confianza', 'Shop with confidence')}</h2>
        <div className="vh-comp">
          {[
            { n: `${GARANTIA_DIAS}`, u: t('días', 'days'), h: t('Garantía en tus micas', 'Lens guarantee'), p: t('Si tu graduación no queda, rehacemos tus micas gratis.', 'If your prescription isn’t right, we remake your lenses free.'), href: '/warranty' },
            { n: `${DEVOLUCION_DIAS}`, u: t('días', 'days'), h: t('Para devolver', 'To return'), p: t('¿No te convencieron? Te regresamos tu dinero.', 'Not happy? Get a full refund.'), href: '/returns' },
            { n: `$${ENVIO_GRATIS_DESDE}`, u: '', h: t('Envío gratis desde', 'Free shipping over'), p: t('A todo Estados Unidos, con número de guía.', 'Anywhere in the US, with tracking.'), href: '/shipping' },
          ].map(c => (
            <Link key={c.href} href={c.href} className="vh-comp-i">
              <span className="vh-comp-n">{c.n}<small>{c.u}</small></span>
              <b>{c.h}</b>
              <span>{c.p}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Preguntas */}
      <section className="vh-sec vh-faq" id="faq">
        <p className="vh-eye">{t('Preguntas frecuentes', 'FAQ')}</p>
        <h2>{t('Antes de comprar', 'Before you buy')}</h2>
        <div>
          {faqs.map((f, i) => (
            <details key={i}>
              <summary>{t(f.q[0], f.q[1])}<span aria-hidden="true">+</span></summary>
              <p>{t(f.a[0], f.a[1])}</p>
            </details>
          ))}
        </div>
      </section>

      <style>{`
        .vh{background:var(--cream);color:var(--charcoal);overflow-x:hidden;padding-top:106px}
        .vh h2{font-size:clamp(1.9rem,3.4vw,2.9rem);font-weight:500;letter-spacing:-.03em;line-height:1.05;margin:0}
        .vh-eye{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--warm-gray);margin:0 0 10px}
        .vh-link{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:var(--charcoal);text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:2px;white-space:nowrap}
        .vh-btn{display:inline-flex;align-items:center;gap:10px;background:var(--sage);color:#fff;padding:15px 28px;border-radius:999px;font-size:14px;font-weight:500;text-decoration:none;border:0;cursor:pointer;font-family:var(--font-sans);transition:background .2s}
        .vh-btn:hover{background:var(--sage-light)}
        .vh-btn-2{background:transparent;color:var(--charcoal);border:1px solid var(--charcoal)}
        .vh-btn-2:hover{background:rgba(0,0,0,.04)}

        .vh-hero{position:relative;overflow:hidden;background:var(--cream-dark)}
        .vh-hero img{display:block;width:100%;height:clamp(460px,46vw,760px);object-fit:cover;object-position:right center}
        .vh-hero-tx{position:absolute;inset:0;max-width:1280px;margin:0 auto;padding:0 2.5rem;display:flex;flex-direction:column;justify-content:center}
        .vh-hero h1{font-size:clamp(2.6rem,4.6vw,4.4rem);font-weight:500;letter-spacing:-.035em;line-height:1.02;margin:0 0 18px;max-width:560px}
        .vh-hero p{font-size:16px;line-height:1.65;color:#4a463f;max-width:400px;margin:0 0 30px}
        .vh-btns{display:flex;gap:12px;flex-wrap:wrap}

        .vh-sec{max-width:1280px;margin:0 auto;padding:96px 2.5rem 0}
        .vh-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:32px}
        .vh-side{max-width:300px;font-size:14px;line-height:1.6;color:var(--warm-gray);margin:0}

        .vh-formas{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .vh-forma{position:relative;display:block;aspect-ratio:8/9;overflow:hidden;border-radius:4px;text-decoration:none;color:var(--charcoal)}
        .vh-forma img{width:100%;height:100%;object-fit:cover;transition:transform .8s ease}
        .vh-forma:hover img{transform:scale(1.04)}
        .vh-forma span{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;align-items:center;padding:16px 18px;font-size:16px;font-weight:500;background:linear-gradient(to top,rgba(247,244,239,.9),rgba(247,244,239,0))}

        .vh-prods{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .vh-prod{text-decoration:none;color:var(--charcoal);display:flex;flex-direction:column;gap:4px}
        .vh-prod-img{aspect-ratio:4/3;background:#F1EEE9;border-radius:4px;overflow:hidden;margin-bottom:12px}
        .vh-prod-img img{width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;transform:scale(1.08);transition:transform .5s ease}
        .vh-prod:hover .vh-prod-img img{transform:scale(1.13)}
        .vh-prod b{font-size:15px;font-weight:500}
        .vh-prod > span{font-size:13px;color:var(--warm-gray)}
        .vh-sws{display:flex;gap:6px;margin-top:6px}
        .vh-sws i{width:14px;height:14px;border-radius:50%;border:1px solid rgba(0,0,0,.12)}

        .vh-mitades{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}
        .vh-mitad{position:relative;display:block;overflow:hidden;text-decoration:none;color:var(--charcoal)}
        .vh-mitad img{display:block;width:100%;height:clamp(380px,40vw,620px);object-fit:cover;transition:transform .8s ease}
        .vh-mitad:hover img{transform:scale(1.03)}
        .vh-mitad > div{position:absolute;left:clamp(24px,4vw,56px);bottom:clamp(28px,4vw,56px);max-width:320px}
        .vh-mitad h3,.vh-banner h3{font-size:clamp(1.7rem,2.8vw,2.5rem);font-weight:500;letter-spacing:-.03em;line-height:1.05;margin:0 0 10px}
        .vh-mitad p,.vh-banner p{font-size:14px;line-height:1.55;margin:0 0 18px;color:#3f3b35}

        .vh-promo{margin-top:96px}
        .vh-banner{position:relative;display:block;overflow:hidden;margin-top:6px;text-decoration:none;color:#fff;background:#1d2a20}
        .vh-banner img{display:block;width:100%;height:clamp(340px,34vw,560px);object-fit:cover;object-position:right center}
        .vh-banner > div{position:absolute;top:50%;transform:translateY(-50%);left:max(2.5rem,calc((100vw - 1280px)/2 + 2.5rem));max-width:360px}
        .vh-banner p{color:rgba(255,255,255,.8)}
        .vh-banner .vh-link{color:#fff}

        .vh-pasos{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:36px}
        .vh-paso{display:flex;flex-direction:column;gap:6px;color:var(--charcoal)}
        .vh-paso-img{aspect-ratio:4/3;overflow:hidden;border-radius:4px;margin-bottom:12px;background:var(--cream-dark)}
        .vh-paso-img img{width:100%;height:100%;object-fit:cover}
                .vh-num{font-size:12px;font-weight:600;letter-spacing:.12em;color:var(--sage)}
        .vh-paso b{font-size:15px;font-weight:600}
        .vh-paso > span:last-child{font-size:13.5px;line-height:1.55;color:var(--warm-gray)}

        .vh-comp{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:36px;border-top:1px solid var(--border);padding-top:32px}
        .vh-comp-i{display:flex;flex-direction:column;gap:6px;text-decoration:none;color:var(--charcoal)}
        .vh-comp-i + .vh-comp-i{border-left:1px solid var(--border);padding-left:24px}
        .vh-comp-n{font-size:clamp(2.4rem,4vw,3.4rem);font-weight:500;letter-spacing:-.04em;line-height:1;color:var(--sage);margin-bottom:8px}
        .vh-comp-n small{font-size:.38em;letter-spacing:0;margin-left:6px;color:var(--warm-gray);font-weight:500}
        .vh-comp-i b{font-size:15px;font-weight:600}
        .vh-comp-i > span:last-child{font-size:13.5px;line-height:1.55;color:var(--warm-gray)}
        .vh-faq{padding-bottom:110px}
        .vh-faq > div{margin-top:28px;border-top:1px solid var(--border)}
        .vh-faq details{border-bottom:1px solid var(--border)}
        .vh-faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 0;font-size:15.5px;font-weight:500}
        .vh-faq summary::-webkit-details-marker{display:none}
        .vh-faq summary span{font-size:22px;font-weight:300;color:var(--sage);transition:transform .2s}
        .vh-faq details[open] summary span{transform:rotate(45deg)}
        .vh-faq details p{margin:0 0 20px;font-size:14px;line-height:1.7;color:var(--warm-gray);max-width:680px}

        @media (max-width:900px){
          .vh-formas,.vh-prods{grid-template-columns:1fr 1fr;gap:12px}
          .vh-pasos{grid-template-columns:1fr 1fr;gap:24px 12px}
          .vh-comp{grid-template-columns:1fr}
          .vh-comp-i + .vh-comp-i{border-left:0;padding-left:0;border-top:1px solid var(--border);padding-top:24px}
        }
        @media (max-width:768px){
          .vh{padding-top:106px}
          /* Celular: foto completa arriba y una tarjeta crema que se monta sobre la orilla de abajo */
          .vh-hero{background:var(--cream);overflow:visible}
          .vh-hero img{height:auto;aspect-ratio:1/1;object-position:center 75%}
          .vh-hero-tx{position:relative;inset:auto;margin-top:-44px;background:var(--cream);border-radius:22px 22px 0 0;padding:26px 1.25rem 8px;z-index:1}
          .vh-hero h1{font-size:2rem;margin-bottom:10px}
          .vh-hero p{font-size:14px;margin-bottom:18px;max-width:300px}
          .vh-btn{padding:12px 20px;font-size:13px}
          .vh-sec{padding:64px 1.25rem 0}
          .vh-head{flex-direction:column;align-items:flex-start;margin-bottom:22px}
          .vh-mitades{grid-template-columns:1fr;margin-top:6px}
          .vh-promo{margin-top:64px}
          .vh-mitad img{height:420px}
          .vh-banner img{height:420px;object-position:72% center}
          .vh-banner::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,rgba(20,30,22,.75),rgba(20,30,22,0) 75%)}
          .vh-banner > div{left:1.25rem;right:1.25rem;z-index:1}
          .vh-faq{padding-bottom:80px}
        }
      `}</style>
    </main>
  );
}
