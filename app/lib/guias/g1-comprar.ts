import type { Guia } from './tipos';
import { VISION_PRICES, FILTRO_PRICES, MATERIAL_PRICES } from '../precios';
import { ENVIO_GRATIS_DESDE } from '../envio';
import { GARANTIA_DIAS, DEVOLUCION_DIAS, DIAS_FABRICACION, DIAS_ENVIO } from '../marca';

const fab = `${DIAS_FABRICACION.min}–${DIAS_FABRICACION.max}`, env = `${DIAS_ENVIO.min}–${DIAS_ENVIO.max}`;

export const G_COMPRAR: Guia[] = [
  {
    slug: 'prescription-glasses-without-insurance', slugEs: 'lentes-graduados-sin-aseguranza', cat: 'comprar', cta: '/Tienda',
    en: {
      t: 'Prescription Glasses Without Insurance: How to Pay Less',
      d: 'No vision insurance? Here is what prescription glasses really cost, where the money goes, and how to get a good pair for less.',
      i: `Millions of people in the US buy glasses without vision insurance. The good news: you don't need insurance to get a quality pair at a fair price. You need your prescription, a frame you like and lenses that match how you use your eyes.`,
      s: [
        ['Why glasses cost so much at a traditional store', `At many optical stores the price includes rent, staff, brand licensing and the expectation that insurance will pay part of the bill. Without insurance, you pay all of it.\n\nBuying online removes most of those costs. The frame and lenses are made the same way, with your prescription, by an optical lab.`],
        ['What you actually need', `1. A valid prescription from an eye exam (glasses prescription, not contact lenses).\n2. Your pupillary distance (PD), the distance between your pupils.\n3. A frame that fits your face width.\nWith those three things you can order online with confidence.`],
        ['How to save without losing quality', `Start with single-vision lenses if your prescription allows it (+$${VISION_PRICES.mono}). Add only what you really use: anti-reflective (+$${FILTRO_PRICES.ar}) if you drive at night, a blue light filter (+$${FILTRO_PRICES.blue}) if you spend hours on screens, photochromic (+$${FILTRO_PRICES.foto}) if you are in and out of the sun.\n\nFor strong prescriptions, a thinner lens material avoids heavy, thick lenses.`],
        ['What to look for in an online store', `A clear price before checkout, a guarantee if your prescription doesn't feel right, an easy return policy and real people who answer. At Verly you get a ${GARANTIA_DIAS}-day lens guarantee, ${DEVOLUCION_DIAS}-day returns and free shipping on orders over $${ENVIO_GRATIS_DESDE}.`],
      ],
      f: [
        ['Can I buy glasses without insurance?', 'Yes. You only need a valid glasses prescription. Insurance is not required to buy frames or lenses.'],
        ['Do I need an eye exam first?', 'Yes, you need a current prescription from an optometrist or ophthalmologist. Online stores make the glasses; they do not replace an eye exam.'],
        ['Can I use HSA or FSA?', 'Many HSA and FSA cards work like a regular debit card for prescription glasses. Check with your plan provider before you pay.'],
      ],
    },
    es: {
      t: 'Lentes graduados sin aseguranza: cómo pagar menos',
      d: '¿No tienes aseguranza de la vista? Te explicamos cuánto cuestan de verdad los lentes graduados y cómo conseguir unos buenos por menos.',
      i: `Millones de personas en Estados Unidos compran lentes sin aseguranza. La buena noticia: no la necesitas para tener unos lentes de calidad a buen precio. Solo necesitas tu receta, un armazón que te guste y micas de acuerdo a cómo usas tu vista.`,
      s: [
        ['Por qué los lentes salen tan caros en una óptica tradicional', `En muchas ópticas el precio incluye renta, personal, licencias de marca y la idea de que la aseguranza va a pagar una parte. Sin aseguranza, tú pagas todo.\n\nComprando en línea se eliminan casi todos esos costos. El armazón y las micas se hacen igual, con tu receta, en un laboratorio óptico.`],
        ['Lo que realmente necesitas', `1. Una receta vigente de un examen de la vista (de lentes, no de lentes de contacto).\n2. Tu distancia pupilar (DP), la distancia entre tus pupilas.\n3. Un armazón del ancho de tu cara.\nCon eso puedes pedir en línea con confianza.`],
        ['Cómo ahorrar sin perder calidad', `Empieza con micas monofocales si tu receta lo permite (+$${VISION_PRICES.mono}). Agrega solo lo que vas a usar: antirreflejante (+$${FILTRO_PRICES.ar}) si manejas de noche, filtro de luz azul (+$${FILTRO_PRICES.blue}) si pasas horas en pantallas, fotocromático (+$${FILTRO_PRICES.foto}) si entras y sales del sol.\n\nSi tu graduación es alta, una mica más delgada evita lentes gruesos y pesados.`],
        ['Qué revisar en una tienda en línea', `Precio claro antes de pagar, garantía si tu graduación no queda, devoluciones fáciles y personas reales que contesten. En Verly tienes ${GARANTIA_DIAS} días de garantía en tus micas, ${DEVOLUCION_DIAS} días para devolver y envío gratis desde $${ENVIO_GRATIS_DESDE}.`],
      ],
      f: [
        ['¿Puedo comprar lentes sin aseguranza?', 'Sí. Solo necesitas una receta vigente de lentes. La aseguranza no es necesaria para comprar armazón ni micas.'],
        ['¿Necesito un examen de la vista antes?', 'Sí, necesitas una receta actual de un optometrista u oftalmólogo. La tienda en línea hace los lentes, pero no sustituye el examen.'],
        ['¿Puedo usar HSA o FSA?', 'Muchas tarjetas HSA y FSA funcionan como una tarjeta de débito normal para lentes graduados. Confírmalo con tu plan antes de pagar.'],
      ],
    },
  },
  {
    slug: 'how-much-do-prescription-glasses-cost', slugEs: 'cuanto-cuestan-los-lentes-graduados', cat: 'comprar', cta: '/Tienda',
    en: {
      t: 'How Much Do Prescription Glasses Cost?',
      d: 'A clear breakdown of what you pay for in prescription glasses: frame, lens type, material and coatings, with real example prices.',
      i: `The price of prescription glasses depends on four things: the frame, the type of vision you need, the lens material and the coatings you add. Once you understand those parts, it is easy to see where your money goes.`,
      s: [
        ['1. The frame', `Frames go from simple everyday styles to designer brands. The material (acetate, metal, TR-90) and the brand change the price more than the quality of your vision.`],
        ['2. Type of vision', `Single vision corrects one distance (far or near). Bifocals have two zones with a visible line. Progressives cover every distance with no line and cost more because they are more complex to make.\n\nAt Verly: single vision +$${VISION_PRICES.mono}, bifocal +$${VISION_PRICES.bi}, progressive +$${VISION_PRICES.prog}.`],
        ['3. Lens material', `Standard lenses are included. Thinner and stronger materials (polycarbonate, high-index) cost more, and they make sense for kids, sports or strong prescriptions. Polycarbonate (Thin & Durable) is +$${MATERIAL_PRICES.poly}.`],
        ['4. Coatings', `Anti-reflective (+$${FILTRO_PRICES.ar}), blue light filter (+$${FILTRO_PRICES.blue}), photochromic (+$${FILTRO_PRICES.foto}), anti-fog (+$${FILTRO_PRICES.anti}). Choose only what you will use every day.`],
      ],
      f: [
        ['What is the cheapest way to get prescription glasses?', 'A simple frame with single-vision standard lenses. Add coatings only if you need them.'],
        ['Why are progressive lenses more expensive?', 'They have a gradual change of power from distance to reading and must be made precisely for your prescription and the frame.'],
      ],
    },
    es: {
      t: '¿Cuánto cuestan los lentes graduados?',
      d: 'Te explicamos qué pagas en unos lentes graduados: armazón, tipo de visión, material y filtros, con precios de ejemplo.',
      i: `El precio de unos lentes graduados depende de cuatro cosas: el armazón, el tipo de visión que necesitas, el material de la mica y los filtros que agregas. Entendiendo eso, es fácil ver a dónde va tu dinero.`,
      s: [
        ['1. El armazón', `Hay desde estilos sencillos para diario hasta marcas de diseñador. El material (acetato, metal, TR-90) y la marca cambian el precio más que la calidad de tu visión.`],
        ['2. Tipo de visión', `Monofocal corrige una distancia (lejos o cerca). Bifocal tiene dos zonas con una línea visible. Progresivo cubre todas las distancias sin línea y cuesta más porque es más complejo de fabricar.\n\nEn Verly: monofocal +$${VISION_PRICES.mono}, bifocal +$${VISION_PRICES.bi}, progresivo +$${VISION_PRICES.prog}.`],
        ['3. Material de la mica', `La mica estándar está incluida. Los materiales más delgados y resistentes (policarbonato, alto índice) cuestan más y conviene usarlos en niños, deporte o graduaciones altas. Policarbonato (Thin & Durable) +$${MATERIAL_PRICES.poly}.`],
        ['4. Filtros', `Antirreflejante (+$${FILTRO_PRICES.ar}), filtro de luz azul (+$${FILTRO_PRICES.blue}), fotocromático (+$${FILTRO_PRICES.foto}), antiempañante (+$${FILTRO_PRICES.anti}). Elige solo lo que vas a usar diario.`],
      ],
      f: [
        ['¿Cuál es la forma más barata de tener lentes graduados?', 'Un armazón sencillo con micas monofocales estándar. Agrega filtros solo si los necesitas.'],
        ['¿Por qué los progresivos cuestan más?', 'Tienen un cambio gradual de graduación de lejos a cerca y se fabrican con precisión para tu receta y tu armazón.'],
      ],
    },
  },
  {
    slug: 'how-to-buy-glasses-online', slugEs: 'como-comprar-lentes-en-linea', cat: 'comprar', cta: '/help',
    en: {
      t: 'How to Buy Prescription Glasses Online, Step by Step',
      d: 'Everything you need to order glasses online: prescription, PD, frame size and lens options, explained simply.',
      i: `Buying glasses online is easier than most people think. If you have your prescription and know a few measurements, you can order in minutes from your phone.`,
      s: [
        ['Before you start', `Have your glasses prescription at hand (a photo is fine) and your pupillary distance (PD). Look at your current glasses: the three numbers on the temple, like 52-18-140, tell you the size that fits you.`],
        ['Step 1: choose your frame', `Filter by shape, color and size. Compare the frame measurements with your current glasses; if they are within a few millimeters, the fit will be similar.`],
        ['Step 2: add your prescription', `Type the values (SPH, CYL, AXIS, ADD, PD) or upload a photo of your prescription. If you are not sure, you can add it later, before paying.`],
        ['Step 3: choose your lenses', `Pick your vision type (single vision, bifocal or progressive), the lens material and any coatings. The price updates as you go.`],
        ['Step 4: pay and receive', `Pay by card, Apple Pay or Google Pay. At Verly we make your lenses in ${fab} business days and delivery takes ${env} business days.`],
      ],
      f: [
        ['What if my glasses do not fit right?', `You have ${GARANTIA_DIAS} days to tell us. If your prescription doesn't feel right we remake your lenses at no cost.`],
        ['Can I order without my PD?', 'Your PD is needed to center the lenses. You can measure it at home with a ruler and a mirror; see our PD guide.'],
      ],
    },
    es: {
      t: 'Cómo comprar lentes graduados en línea, paso a paso',
      d: 'Todo lo que necesitas para pedir lentes en línea: receta, distancia pupilar, talla del armazón y tipos de mica.',
      i: `Comprar lentes en línea es más fácil de lo que parece. Si tienes tu receta y un par de medidas, puedes pedirlos en minutos desde tu celular.`,
      s: [
        ['Antes de empezar', `Ten a la mano tu receta de lentes (una foto sirve) y tu distancia pupilar (DP). Revisa tus lentes actuales: los tres números de la varilla, por ejemplo 52-18-140, te dicen la talla que te queda.`],
        ['Paso 1: elige tu armazón', `Filtra por forma, color y talla. Compara las medidas con las de tus lentes actuales; si están a unos milímetros, te van a quedar parecido.`],
        ['Paso 2: agrega tu receta', `Escribe los valores (ESF, CIL, EJE, ADD, DP) o sube una foto de tu receta. Si tienes dudas, puedes agregarla después, antes de pagar.`],
        ['Paso 3: elige tus micas', `Escoge el tipo de visión (monofocal, bifocal o progresivo), el material y los filtros. El precio se actualiza al momento.`],
        ['Paso 4: paga y recibe', `Paga con tarjeta, Apple Pay o Google Pay. En Verly hacemos tus micas en ${fab} días hábiles y te llegan en ${env} días hábiles más.`],
      ],
      f: [
        ['¿Y si no me quedan bien?', `Tienes ${GARANTIA_DIAS} días para avisarnos. Si tu graduación no queda, rehacemos tus micas sin costo.`],
        ['¿Puedo pedir sin mi distancia pupilar?', 'La DP se necesita para centrar las micas. Puedes medirla en casa con una regla y un espejo; revisa nuestra guía de DP.'],
      ],
    },
  },
  {
    slug: 'is-it-safe-to-buy-glasses-online', slugEs: 'es-seguro-comprar-lentes-en-linea', cat: 'comprar', cta: '/warranty',
    en: {
      t: 'Is It Safe to Buy Glasses Online?',
      d: 'What to check before ordering prescription glasses online, and how a guarantee and return policy protect you.',
      i: `Yes, buying glasses online is safe when the store makes lenses with your exact prescription, shows prices clearly and stands behind its work. Here is how to tell.`,
      s: [
        ['Your lenses are made by an optical lab', `Prescription lenses are cut and mounted by an optical lab using your prescription and PD, the same process used by physical stores.`],
        ['Check the guarantee', `A good store lets you fix problems. At Verly, if your prescription doesn't feel right within ${GARANTIA_DIAS} days, we remake your lenses free. You also have ${DEVOLUCION_DIAS} days to return them for a full refund.`],
        ['Look for secure payment', `Pay only on stores with secure checkout (https, card processors like Stripe, Apple Pay or Google Pay). Never send card numbers by message or email.`],
        ['When to buy in person instead', `If you have a very complex prescription, prisms, or you have never worn glasses and want to try frames on, an in-person visit may be better for your first pair.`],
      ],
      f: [
        ['Are online glasses lower quality?', 'Not necessarily. Quality depends on the lab and materials, not on where you buy.'],
        ['What if the prescription is wrong?', 'Check your prescription first. If the lenses were made correctly but you still have trouble, contact the store; a lens guarantee should cover a remake.'],
      ],
    },
    es: {
      t: '¿Es seguro comprar lentes en línea?',
      d: 'Qué revisar antes de pedir lentes graduados en línea y cómo te protegen la garantía y las devoluciones.',
      i: `Sí, comprar lentes en línea es seguro cuando la tienda hace las micas con tu receta exacta, muestra precios claros y responde por su trabajo. Así lo puedes saber.`,
      s: [
        ['Tus micas las hace un laboratorio óptico', `Las micas graduadas se cortan y montan en un laboratorio óptico con tu receta y tu DP, igual que en una óptica física.`],
        ['Revisa la garantía', `Una buena tienda te deja corregir problemas. En Verly, si tu graduación no queda en los primeros ${GARANTIA_DIAS} días, rehacemos tus micas gratis. Además tienes ${DEVOLUCION_DIAS} días para devolverlos y te regresamos tu dinero.`],
        ['Busca pago seguro', `Paga solo en tiendas con pago seguro (https, procesadores como Stripe, Apple Pay o Google Pay). Nunca mandes números de tarjeta por mensaje o correo.`],
        ['Cuándo conviene ir en persona', `Si tu receta es muy compleja, lleva prisma, o nunca has usado lentes y quieres probarte armazones, quizá convenga ir en persona para tu primer par.`],
      ],
      f: [
        ['¿Los lentes en línea son de menor calidad?', 'No necesariamente. La calidad depende del laboratorio y los materiales, no de dónde compras.'],
        ['¿Y si la graduación sale mal?', 'Revisa primero tu receta. Si las micas se hicieron bien y sigues con molestias, contacta a la tienda; la garantía debe cubrir rehacerlas.'],
      ],
    },
  },
  {
    slug: 'cheap-glasses-what-to-check', slugEs: 'lentes-baratos-que-revisar', cat: 'comprar', cta: '/Tienda',
    en: {
      t: 'Cheap Prescription Glasses: What to Check Before You Buy',
      d: 'Low price does not have to mean low quality. Five things to check in affordable prescription glasses.',
      i: `Affordable glasses can be great glasses. The trick is knowing which details matter for your eyes and which ones only raise the price.`,
      s: [
        ['1. The lens is what you see through', `Your vision depends on the lenses being made with your exact prescription and centered with your PD. That matters more than a brand name on the temple.`],
        ['2. Hinges and materials', `Look for metal hinges and durable materials like acetate, TR-90 or stainless steel. Flexible TR-90 frames are light and resist bending.`],
        ['3. The right size', `A frame that is too wide slides down; too narrow presses on your temples. Compare with your current glasses (for example 52-18-140).`],
        ['4. Only the coatings you need', `Anti-reflective is worth it for night driving and screens. Skip extras you will not use.`],
        ['5. Guarantee and returns', `Cheap is not cheap if you cannot fix a problem. Make sure there is a lens guarantee and an easy return policy.`],
      ],
      f: [
        ['Are cheap glasses bad for your eyes?', 'No. Glasses made with your correct prescription and PD are safe at any price.'],
        ['How long do affordable glasses last?', 'With good care, one to two years or more. Most people update their glasses when the prescription changes.'],
      ],
    },
    es: {
      t: 'Lentes graduados baratos: qué revisar antes de comprar',
      d: 'Precio bajo no tiene que ser mala calidad. Cinco cosas que revisar en unos lentes graduados económicos.',
      i: `Unos lentes económicos pueden ser muy buenos lentes. La clave es saber qué detalles importan para tu vista y cuáles solo suben el precio.`,
      s: [
        ['1. La mica es por donde ves', `Tu visión depende de que las micas se hagan con tu receta exacta y se centren con tu DP. Eso importa más que una marca en la varilla.`],
        ['2. Bisagras y materiales', `Busca bisagras de metal y materiales resistentes como acetato, TR-90 o acero. Los armazones TR-90 son ligeros y flexibles.`],
        ['3. La talla correcta', `Un armazón muy ancho se resbala; uno muy angosto aprieta las sienes. Compara con tus lentes actuales (por ejemplo 52-18-140).`],
        ['4. Solo los filtros que necesitas', `El antirreflejante vale la pena si manejas de noche o usas pantallas. Evita extras que no vas a usar.`],
        ['5. Garantía y devoluciones', `Lo barato sale caro si no puedes corregir un problema. Revisa que haya garantía en las micas y devoluciones fáciles.`],
      ],
      f: [
        ['¿Los lentes baratos dañan la vista?', 'No. Unos lentes con tu receta y DP correctas son seguros a cualquier precio.'],
        ['¿Cuánto duran unos lentes económicos?', 'Con buen cuidado, uno a dos años o más. La mayoría los cambia cuando cambia su graduación.'],
      ],
    },
  },
  {
    slug: 'how-often-should-you-replace-glasses', slugEs: 'cada-cuando-cambiar-tus-lentes', cat: 'comprar', cta: '/Tienda',
    en: {
      t: 'How Often Should You Replace Your Glasses?',
      d: 'When to get new glasses: prescription changes, scratched lenses, loose frames and other signs it is time.',
      i: `There is no fixed date to replace glasses, but most people do it every one to two years. These signs tell you it is time.`,
      s: [
        ['Your prescription changed', `If you squint, get headaches or see blurry with your current glasses, schedule an eye exam. Many adults get checked every one to two years.`],
        ['The lenses are scratched', `Scratches in the center of the lens scatter light and reduce sharpness. They cannot be polished out; the lens has to be replaced.`],
        ['The frame no longer holds', `Loose hinges, bent temples or a frame that keeps sliding down make your lenses sit in the wrong position, which affects your vision.`],
        ['You need something new', `Starting a screen-heavy job, driving more at night or turning 40 (reading gets harder) are good moments to update your lenses.`],
      ],
      f: [
        ['Can I put new lenses in my old frame?', 'Sometimes, but it is often similar in price to a new pair with lenses included, and an old frame may break during the process.'],
        ['Should I keep my old glasses?', 'Yes, as a backup pair if the prescription is close to your current one.'],
      ],
    },
    es: {
      t: '¿Cada cuándo cambiar tus lentes?',
      d: 'Cuándo comprar lentes nuevos: cambio de graduación, micas rayadas, armazón flojo y otras señales.',
      i: `No hay una fecha fija para cambiar de lentes, pero la mayoría lo hace cada uno o dos años. Estas señales te dicen que ya es momento.`,
      s: [
        ['Tu graduación cambió', `Si entrecierras los ojos, te duele la cabeza o ves borroso con tus lentes, agenda un examen de la vista. Muchos adultos se revisan cada uno o dos años.`],
        ['Las micas están rayadas', `Los rayones en el centro dispersan la luz y quitan nitidez. No se pueden pulir; hay que cambiar la mica.`],
        ['El armazón ya no sostiene', `Bisagras flojas, varillas dobladas o un armazón que se resbala dejan las micas en mala posición y afectan tu visión.`],
        ['Necesitas algo nuevo', `Un trabajo con muchas pantallas, manejar más de noche o cumplir 40 (cuando cuesta leer de cerca) son buenos momentos para actualizar tus micas.`],
      ],
      f: [
        ['¿Puedo poner micas nuevas en mi armazón viejo?', 'A veces, pero el precio suele ser parecido a unos lentes nuevos con micas incluidas, y un armazón viejo puede romperse en el proceso.'],
        ['¿Conviene guardar los lentes viejos?', 'Sí, como repuesto, si la graduación es parecida a la actual.'],
      ],
    },
  },
  {
    slug: 'backup-pair-of-glasses', slugEs: 'lentes-de-repuesto', cat: 'comprar', cta: '/Tienda',
    en: {
      t: 'Why You Should Have a Backup Pair of Glasses',
      d: 'Losing or breaking your only pair can stop your day. Why a spare pair makes sense and how to choose it.',
      i: `If you need glasses to drive, work or read, a backup pair is cheap insurance. Here is why it makes sense and how to pick one.`,
      s: [
        ['Accidents happen', `Glasses get sat on, dropped or lost. Without a spare pair you may be unable to drive or work until a replacement arrives.`],
        ['Different glasses for different moments', `Many people use their backup as a second style: a bolder color for weekends, prescription sunglasses, or a computer pair with a blue light filter.`],
        ['How to choose a backup', `Use the same prescription and PD. A simple, durable frame (TR-90 or acetate) with standard lenses keeps the cost low.`],
      ],
      f: [
        ['Can my backup pair be cheaper?', 'Yes. A simple frame with single-vision standard lenses works well as a spare.'],
        ['Where should I keep it?', 'In a hard case at home, in your car or at work, wherever losing your main pair would hurt most.'],
      ],
    },
    es: {
      t: 'Por qué tener unos lentes de repuesto',
      d: 'Perder o romper tus únicos lentes puede detener tu día. Por qué conviene un repuesto y cómo elegirlo.',
      i: `Si necesitas lentes para manejar, trabajar o leer, un par de repuesto es un seguro barato. Te explicamos por qué y cómo escogerlo.`,
      s: [
        ['Los accidentes pasan', `Los lentes se sientan, se caen o se pierden. Sin repuesto, quizá no puedas manejar ni trabajar hasta que llegue el reemplazo.`],
        ['Lentes distintos para cada momento', `Muchos usan el repuesto como segundo estilo: un color más llamativo, lentes de sol graduados o unos para computadora con filtro de luz azul.`],
        ['Cómo escoger el repuesto', `Usa la misma receta y DP. Un armazón sencillo y resistente (TR-90 o acetato) con micas estándar mantiene el precio bajo.`],
      ],
      f: [
        ['¿El repuesto puede ser más barato?', 'Sí. Un armazón sencillo con micas monofocales estándar funciona muy bien como repuesto.'],
        ['¿Dónde lo guardo?', 'En un estuche duro en casa, en el carro o en el trabajo, donde más te afectaría perder tus lentes principales.'],
      ],
    },
  },
];
