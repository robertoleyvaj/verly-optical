'use client';
// Páginas de información y políticas (envíos, devoluciones, garantía, privacidad, términos, nosotros).
// Textos bilingües en un solo lugar; los datos (días, correo) salen de app/lib/marca.ts.
import Link from 'next/link';
import Navbar from './Navbar';
import { useLang } from './LanguageContext';
import { SOPORTE_EMAIL, GARANTIA_DIAS, DEVOLUCION_DIAS, DIAS_FABRICACION, DIAS_ENVIO } from '../lib/marca';
import { ENVIO_GRATIS_DESDE, ENVIO_COSTO } from '../lib/envio';

type Seccion = { h: string; p: string[] };
type Doc = { titulo: string; intro: string; secciones: Seccion[] };
export type SlugInfo = 'shipping' | 'returns' | 'warranty' | 'privacy' | 'terms' | 'about';

function contenido(slug: SlugInfo, es: boolean): Doc {
  const fab = `${DIAS_FABRICACION.min}–${DIAS_FABRICACION.max}`, env = `${DIAS_ENVIO.min}–${DIAS_ENVIO.max}`;
  const correo = SOPORTE_EMAIL;
  const D: Record<SlugInfo, Doc> = {
    shipping: es ? {
      titulo: 'Envíos', intro: 'Enviamos a todo Estados Unidos. Cada par se hace a la medida con tu graduación, por eso tarda un poco más que un producto de anaquel.',
      secciones: [
        { h: 'Tiempos', p: [`Hacemos tus micas en ${fab} días hábiles.`, `Después las enviamos: llegan en ${env} días hábiles. Te mandamos el número de guía por correo.`] },
        { h: 'Costo', p: [`Envío gratis en compras desde $${ENVIO_GRATIS_DESDE} USD.`, `En compras menores, el envío cuesta $${ENVIO_COSTO} USD.`] },
        { h: 'Dónde enviamos', p: ['Por ahora solo a direcciones dentro de Estados Unidos.'] },
        { h: '¿Algún problema con tu paquete?', p: [`Escríbenos a ${correo} con tu número de pedido y lo resolvemos.`] },
      ],
    } : {
      titulo: 'Shipping', intro: 'We ship anywhere in the United States. Every pair is custom-made with your prescription, so it takes a little longer than an off-the-shelf product.',
      secciones: [
        { h: 'Timing', p: [`We make your lenses in ${fab} business days.`, `Then we ship them: delivery takes ${env} business days. You’ll get a tracking number by email.`] },
        { h: 'Cost', p: [`Free shipping on orders over $${ENVIO_GRATIS_DESDE} USD.`, `Orders under that amount ship for $${ENVIO_COSTO} USD.`] },
        { h: 'Where we ship', p: ['For now, only to addresses within the United States.'] },
        { h: 'Problem with your package?', p: [`Email us at ${correo} with your order number and we’ll sort it out.`] },
      ],
    },
    returns: es ? {
      titulo: 'Devoluciones', intro: `Queremos que te encanten tus lentes. Si no es así, tienes ${DEVOLUCION_DIAS} días desde que los recibes para devolverlos.`,
      secciones: [
        { h: 'Reembolso completo', p: [`Dentro de los ${DEVOLUCION_DIAS} días te regresamos el precio de tus lentes al mismo método de pago.`, 'El costo del envío original no es reembolsable.'] },
        { h: 'Cómo devolver', p: [`Escríbenos a ${correo} con tu número de pedido. Te mandamos las instrucciones para el envío de regreso.`, 'Los lentes deben venir completos y en buen estado.'] },
        { h: '¿Prefieres cambiarlos?', p: ['También puedes cambiarlos por otro armazón; te ayudamos a escoger.'] },
      ],
    } : {
      titulo: 'Returns', intro: `We want you to love your glasses. If you don’t, you have ${DEVOLUCION_DIAS} days from delivery to return them.`,
      secciones: [
        { h: 'Full refund', p: [`Within ${DEVOLUCION_DIAS} days we refund the price of your glasses to your original payment method.`, 'Original shipping costs are non-refundable.'] },
        { h: 'How to return', p: [`Email us at ${correo} with your order number. We’ll send you return shipping instructions.`, 'Glasses must be complete and in good condition.'] },
        { h: 'Prefer an exchange?', p: ['You can also exchange them for another frame — we’ll help you choose.'] },
      ],
    },
    warranty: es ? {
      titulo: 'Garantía', intro: 'Cada par lo revisan ópticos antes de salir. Aun así, si algo no queda, lo arreglamos.',
      secciones: [
        { h: `Graduación: ${GARANTIA_DIAS} días`, p: [`Si tu graduación no queda o no te adaptas, rehacemos tus micas gratis dentro de los primeros ${GARANTIA_DIAS} días.`] },
        { h: 'Defectos de fabricación', p: ['Si tu armazón o tus micas tienen un defecto de fabricación, los cambiamos sin costo.'] },
        { h: 'Qué no cubre', p: ['Rayones, golpes o daños por uso o accidente.'] },
        { h: 'Cómo hacerla válida', p: [`Escríbenos a ${correo} con tu número de pedido y, si aplica, tu receta actualizada.`] },
      ],
    } : {
      titulo: 'Warranty', intro: 'Every pair is checked by opticians before it ships. Still, if something isn’t right, we fix it.',
      secciones: [
        { h: `Prescription: ${GARANTIA_DIAS} days`, p: [`If your prescription isn’t right or you can’t adapt, we remake your lenses free within the first ${GARANTIA_DIAS} days.`] },
        { h: 'Manufacturing defects', p: ['If your frame or lenses have a manufacturing defect, we replace them at no cost.'] },
        { h: 'Not covered', p: ['Scratches, drops, or damage from use or accidents.'] },
        { h: 'How to claim', p: [`Email us at ${correo} with your order number and, if needed, your updated prescription.`] },
      ],
    },
    privacy: es ? {
      titulo: 'Aviso de privacidad', intro: 'Cuidamos tus datos. Solo pedimos lo necesario para hacer y enviarte tus lentes.',
      secciones: [
        { h: 'Qué datos recopilamos', p: ['Nombre, correo, teléfono (opcional), dirección de envío y tu receta.', 'Los pagos los procesa Stripe; nosotros nunca vemos ni guardamos los datos de tu tarjeta.'] },
        { h: 'Para qué los usamos', p: ['Para fabricar y enviar tu pedido, darte seguimiento y atenderte.', 'Si aceptas, para mandarte promociones; puedes darte de baja cuando quieras.'] },
        { h: 'Con quién los compartimos', p: ['Solo con los servicios necesarios para operar: pagos, paquetería y correo. Nunca vendemos tus datos.'] },
        { h: 'Tus derechos', p: [`Puedes pedir ver, corregir o borrar tus datos escribiendo a ${correo}.`] },
      ],
    } : {
      titulo: 'Privacy policy', intro: 'We take care of your data. We only ask for what we need to make and ship your glasses.',
      secciones: [
        { h: 'What we collect', p: ['Name, email, phone (optional), shipping address and your prescription.', 'Payments are processed by Stripe; we never see or store your card details.'] },
        { h: 'How we use it', p: ['To make and ship your order, keep you updated and support you.', 'If you opt in, to send you offers; you can unsubscribe anytime.'] },
        { h: 'Who we share it with', p: ['Only the services we need to operate: payments, shipping and email. We never sell your data.'] },
        { h: 'Your rights', p: [`You can ask to access, correct or delete your data by emailing ${correo}. California residents have additional rights under the CCPA.`] },
      ],
    },
    terms: es ? {
      titulo: 'Términos y condiciones', intro: 'Al comprar en Verly Optical aceptas estos términos.',
      secciones: [
        { h: 'Tu receta', p: ['Debes contar con una receta válida y vigente. Fabricamos tus lentes con los datos que nos das; revísalos bien antes de pagar.'] },
        { h: 'Precios y pagos', p: ['Los precios están en dólares (USD). El cobro se hace al confirmar tu pedido.'] },
        { h: 'Pedidos', p: ['Podemos contactarte si encontramos algo raro en tu receta antes de fabricar.'] },
        { h: 'Envíos, devoluciones y garantía', p: ['Se rigen por nuestras políticas de envíos, devoluciones y garantía.'] },
        { h: 'Contacto', p: [correo] },
      ],
    } : {
      titulo: 'Terms of service', intro: 'By purchasing from Verly Optical you agree to these terms.',
      secciones: [
        { h: 'Your prescription', p: ['You must have a valid, current prescription. We make your lenses using the data you provide; please double-check it before paying.'] },
        { h: 'Prices and payment', p: ['Prices are in US dollars (USD). You are charged when you place your order.'] },
        { h: 'Orders', p: ['We may contact you if something in your prescription looks unusual before we make your lenses.'] },
        { h: 'Shipping, returns and warranty', p: ['These are governed by our shipping, returns and warranty policies.'] },
        { h: 'Contact', p: [correo] },
      ],
    },
    about: es ? {
      titulo: 'Nosotros', intro: 'Verly nació para que tener lentes con graduación no cueste una fortuna ni requiera aseguranza.',
      secciones: [
        { h: 'Hechos por ópticos', p: ['Detrás de Verly hay ópticos con años de experiencia. Cada par se hace en nuestro propio laboratorio y se revisa antes de salir.'] },
        { h: 'Precio justo', p: ['Sin intermediarios ni marcas infladas. Pagas por buenos armazones y buenas micas, no por el logo.'] },
        { h: 'Cerca de ti', p: [`Te atendemos en español y en inglés. Escríbenos a ${correo}.`] },
      ],
    } : {
      titulo: 'About us', intro: 'Verly was born so that prescription glasses don’t cost a fortune or require insurance.',
      secciones: [
        { h: 'Made by opticians', p: ['Behind Verly are opticians with years of experience. Every pair is made in our own lab and checked before it ships.'] },
        { h: 'Fair prices', p: ['No middlemen, no inflated brands. You pay for good frames and good lenses, not for a logo.'] },
        { h: 'Here for you', p: [`We help you in English and Spanish. Email us at ${correo}.`] },
      ],
    },
  };
  return D[slug];
}

export default function PaginaInfo({ slug }: { slug: SlugInfo }) {
  const { lang } = useLang() as any;
  const d = contenido(slug, lang === 'es');
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <Navbar />
      <div className="vpi">
        <p className="vpi-k">Verly Optical</p>
        <h1>{d.titulo}</h1>
        <p className="vpi-i">{d.intro}</p>
        {d.secciones.map(s => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        ))}
        <div className="vpi-cta"><Link href="/Tienda">{lang === 'es' ? 'Ver lentes →' : 'Shop eyeglasses →'}</Link></div>
      </div>
      <style>{`
        .vpi{max-width:760px;margin:0 auto;padding:calc(72px + 4rem) 1.5rem 5rem;font-family:var(--font-sans)}
        .vpi-k{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--warm-gray);margin:0 0 .6rem}
        .vpi h1{font-size:clamp(2.2rem,5vw,3.4rem);letter-spacing:-.035em;margin:0 0 1rem}
        .vpi-i{font-size:1.1rem;line-height:1.6;color:#55555a;margin:0 0 2.5rem}
        .vpi section{border-top:1px solid var(--border);padding:1.5rem 0}
        .vpi h2{font-size:1.15rem;letter-spacing:-.01em;margin:0 0 .5rem}
        .vpi section p{color:#55555a;line-height:1.65;margin:0 0 .4rem}
        .vpi-cta{margin-top:2rem}
        .vpi-cta a{display:inline-block;background:var(--sage);color:#fff;border-radius:999px;padding:13px 24px;font-weight:600;text-decoration:none}
      `}</style>
    </main>
  );
}
