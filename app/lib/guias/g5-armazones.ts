import type { Guia } from './tipos';
import { MATERIAL_PRICES } from '../precios';

export const G_ARMAZONES: Guia[] = [
  {
    slug: 'glasses-for-your-face-shape', slugEs: 'lentes-segun-tu-forma-de-cara', cat: 'armazones', cta: '/Tienda',
    en: {
      t: 'How to Choose Glasses for Your Face Shape',
      d: 'Round, square, oval or heart-shaped face? Simple guidelines to pick frames that look good on you.',
      i: `There are no strict rules, but contrast usually works: angular frames balance soft faces, and rounded frames soften angular ones.`,
      s: [
        ['Round face', `Rectangular and square frames add definition. Avoid very small round frames.`],
        ['Square face', `Round, oval and cat-eye frames soften a strong jaw.`],
        ['Oval face', `Lucky you: most shapes work. Keep the frame about as wide as the widest part of your face.`],
        ['Heart-shaped face', `Frames wider at the bottom, round styles or light rimless frames balance a wider forehead.`],
        ['Size matters more than shape', `A frame that fits your face width, with your eyes near the center of each lens, almost always looks good.`],
      ],
      f: [
        ['How do I know my face shape?', 'Look in the mirror with your hair back and compare the width of your forehead, cheekbones and jaw.'],
        ['What if I like a frame that "breaks the rules"?', 'Wear it. Rules are only a starting point.'],
      ],
    },
    es: {
      t: 'Cómo elegir lentes según tu forma de cara',
      d: '¿Cara redonda, cuadrada, ovalada o de corazón? Consejos sencillos para elegir armazones que te queden bien.',
      i: `No hay reglas estrictas, pero el contraste suele funcionar: los armazones con ángulos equilibran caras suaves y los redondos suavizan caras angulares.`,
      s: [
        ['Cara redonda', `Los armazones rectangulares y cuadrados dan definición. Evita armazones redondos muy chicos.`],
        ['Cara cuadrada', `Los armazones redondos, ovalados y cat-eye suavizan una mandíbula marcada.`],
        ['Cara ovalada', `Casi todas las formas te quedan. Busca que el armazón sea más o menos igual de ancho que la parte más ancha de tu cara.`],
        ['Cara de corazón', `Los armazones más anchos abajo, redondos o los de tres piezas ligeros equilibran una frente más ancha.`],
        ['La talla importa más que la forma', `Un armazón del ancho de tu cara, con tus ojos cerca del centro de cada mica, casi siempre se ve bien.`],
      ],
      f: [
        ['¿Cómo sé mi forma de cara?', 'Mírate al espejo con el cabello hacia atrás y compara el ancho de la frente, los pómulos y la mandíbula.'],
        ['¿Y si me gusta un armazón que "rompe las reglas"?', 'Úsalo. Las reglas solo son un punto de partida.'],
      ],
    },
  },
  {
    slug: 'glasses-frame-size-guide', slugEs: 'como-saber-tu-talla-de-armazon', cat: 'armazones', cta: '/Tienda',
    en: {
      t: 'Glasses Frame Size Guide: What 52-18-140 Means',
      d: 'Read the numbers on your frame to find your size: lens width, bridge and temple length explained.',
      i: `The easiest way to find your size is to look at your current glasses. Most frames have three numbers printed on the inside of the temple.`,
      s: [
        ['Lens width (first number)', `The width of each lens in millimeters, for example 52.`],
        ['Bridge (second number)', `The distance between the lenses, over your nose, for example 18. A narrow nose bridge needs a smaller number.`],
        ['Temple length (third number)', `The length of the arm, for example 140. Most adults fit 135 to 150.`],
        ['Total width', `Roughly 2 × lens width + bridge + about 10 mm. Under 130 mm is small, 130–139 medium, 140–145 large and 146+ extra large.`],
        ['Tip', `Choose frames within 2–3 mm of your current measurements for a similar fit.`],
      ],
      f: [
        ['My glasses have no numbers. What now?', 'Measure the width of your current frame across the front with a ruler and compare total width.'],
        ['What size fits most people?', 'Medium (about 130–139 mm total width) fits most adult faces.'],
      ],
    },
    es: {
      t: 'Guía de tallas de armazón: qué significa 52-18-140',
      d: 'Lee los números de tu armazón para saber tu talla: ancho de mica, puente y largo de varilla explicados.',
      i: `La forma más fácil de saber tu talla es ver tus lentes actuales. La mayoría trae tres números impresos por dentro de la varilla.`,
      s: [
        ['Ancho de mica (primer número)', `El ancho de cada mica en milímetros, por ejemplo 52.`],
        ['Puente (segundo número)', `La distancia entre las micas, sobre la nariz, por ejemplo 18. Una nariz angosta necesita un número más chico.`],
        ['Largo de varilla (tercer número)', `El largo del brazo, por ejemplo 140. La mayoría de los adultos usa de 135 a 150.`],
        ['Ancho total', `Aproximadamente 2 × ancho de mica + puente + unos 10 mm. Menos de 130 mm es chico, 130–139 mediano, 140–145 grande y 146 o más extra grande.`],
        ['Consejo', `Elige armazones a 2–3 mm de tus medidas actuales para que te queden parecido.`],
      ],
      f: [
        ['Mis lentes no traen números, ¿qué hago?', 'Mide con una regla el ancho del frente de tu armazón actual y compáralo con el ancho total.'],
        ['¿Qué talla le queda a la mayoría?', 'Mediana (unos 130–139 mm de ancho total) le queda a la mayoría de los adultos.'],
      ],
    },
  },
  {
    slug: 'acetate-vs-metal-frames', slugEs: 'armazones-de-acetato-vs-metal', cat: 'armazones', cta: '/Tienda',
    en: {
      t: 'Acetate vs Metal Frames: Which Should You Choose?',
      d: 'Compare acetate and metal eyeglass frames: weight, durability, comfort, adjustability and style.',
      i: `Acetate and metal are the two most common frame materials. Both are good; they just feel and look different.`,
      s: [
        ['Acetate', `A plant-based plastic with rich colors and patterns like tortoise. Bold look, comfortable and durable. Slightly heavier than metal.`],
        ['Metal', `Thin, light and minimal. Usually has adjustable nose pads, which help if frames slide down your nose. Gold, silver and black are classic.`],
        ['How to choose', `For a statement look or thick lenses, acetate hides edges better. For a light, discreet look or adjustable fit, choose metal.`],
      ],
      f: [
        ['Which lasts longer?', 'Both last years with good care. Metal hinges are more adjustable; acetate is harder to bend.'],
        ['Is metal good for sensitive skin?', 'Many people do well with stainless steel or titanium. If you react to metal, acetate is a safe choice.'],
      ],
    },
    es: {
      t: 'Armazones de acetato vs metal: ¿cuál elegir?',
      d: 'Compara armazones de acetato y de metal: peso, resistencia, comodidad, ajuste y estilo.',
      i: `El acetato y el metal son los materiales de armazón más comunes. Los dos son buenos; solo se sienten y se ven diferente.`,
      s: [
        ['Acetato', `Un plástico de origen vegetal con colores y diseños como el carey. Estilo marcado, cómodo y resistente. Un poco más pesado que el metal.`],
        ['Metal', `Delgado, ligero y discreto. Normalmente tiene plaquetas ajustables, que ayudan si los lentes se te resbalan. Dorado, plateado y negro son clásicos.`],
        ['Cómo elegir', `Si quieres un estilo llamativo o tus micas son gruesas, el acetato esconde mejor las orillas. Si quieres algo ligero y discreto o ajustable, elige metal.`],
      ],
      f: [
        ['¿Cuál dura más?', 'Los dos duran años con buen cuidado. El metal se ajusta más fácil; el acetato se dobla menos.'],
        ['¿El metal sirve si tengo piel sensible?', 'Mucha gente usa bien el acero o el titanio. Si te reacciona el metal, el acetato es opción segura.'],
      ],
    },
  },
  {
    slug: 'full-rim-semi-rimless-rimless', slugEs: 'armazon-completo-ranurado-o-tres-piezas', cat: 'armazones', cta: '/Tienda',
    en: {
      t: 'Full-Rim, Semi-Rimless or Rimless Glasses?',
      d: 'The three frame types explained: look, durability and which prescriptions work best with each.',
      i: `The rim is the part of the frame that holds the lens. How much rim there is changes the look, the weight and which lenses work best.`,
      s: [
        ['Full-rim', `The frame surrounds the whole lens. The most durable option, works with any prescription and hides thick lens edges.`],
        ['Semi-rimless', `Rim on top, nylon thread at the bottom. Lighter, modern look. Works well with most prescriptions.`],
        ['Rimless', `The lenses are drilled and screwed to the bridge and temples. The lightest and most discreet look. Use a strong material like polycarbonate (+$${MATERIAL_PRICES.poly}) to avoid cracks around the holes.`],
      ],
      f: [
        ['Which is best for strong prescriptions?', 'Full-rim, because it covers and protects thicker edges.'],
        ['Are rimless glasses fragile?', 'They need more care. Polycarbonate lenses make them much more durable.'],
      ],
    },
    es: {
      t: '¿Armazón completo, ranurado o de tres piezas?',
      d: 'Los tres tipos de armazón explicados: estilo, resistencia y con qué graduaciones funcionan mejor.',
      i: `El aro es la parte del armazón que sostiene la mica. Cuánto aro tiene cambia el estilo, el peso y qué micas funcionan mejor.`,
      s: [
        ['Completo', `El aro rodea toda la mica. Es la opción más resistente, sirve para cualquier graduación y esconde las orillas gruesas.`],
        ['Ranurado', `Aro arriba e hilo de nylon abajo. Más ligero y moderno. Funciona bien con la mayoría de las graduaciones.`],
        ['Tres piezas (al aire)', `Las micas se perforan y se atornillan al puente y a las varillas. El estilo más ligero y discreto. Usa un material resistente como el policarbonato (+$${MATERIAL_PRICES.poly}) para evitar grietas en las perforaciones.`],
      ],
      f: [
        ['¿Cuál es mejor para graduación alta?', 'El completo, porque cubre y protege las orillas más gruesas.'],
        ['¿Los de tres piezas son frágiles?', 'Necesitan más cuidado. Las micas de policarbonato los hacen mucho más resistentes.'],
      ],
    },
  },
  {
    slug: 'tr90-glasses-frames', slugEs: 'armazones-tr90', cat: 'armazones', cta: '/Tienda',
    en: {
      t: 'TR-90 Frames: Light, Flexible and Durable',
      d: 'What TR-90 is, why it is used for kids and active people, and how it compares to acetate.',
      i: `TR-90 is a flexible thermoplastic used in many modern frames. It is very light and bends without breaking.`,
      s: [
        ['Advantages', `Very lightweight, flexible, resistant to impacts and temperature changes, and comfortable for all-day wear.`],
        ['Who it is for', `Kids, people who play sports, and anyone who wants glasses they barely feel.`],
        ['Compared with acetate', `TR-90 is lighter and more flexible; acetate has richer colors and a more premium, solid feel.`],
      ],
      f: [
        ['Can TR-90 frames be adjusted?', 'Yes, with gentle heat by an optician, although they adjust less than metal.'],
        ['Is TR-90 hypoallergenic?', 'It is generally well tolerated by sensitive skin.'],
      ],
    },
    es: {
      t: 'Armazones TR-90: ligeros, flexibles y resistentes',
      d: 'Qué es el TR-90, por qué se usa en niños y personas activas, y cómo se compara con el acetato.',
      i: `El TR-90 es un termoplástico flexible usado en muchos armazones modernos. Es muy ligero y se dobla sin romperse.`,
      s: [
        ['Ventajas', `Muy ligero, flexible, resistente a golpes y cambios de temperatura, y cómodo para usar todo el día.`],
        ['Para quién', `Niños, personas que hacen deporte y quien quiere lentes que casi no se sientan.`],
        ['Comparado con el acetato', `El TR-90 es más ligero y flexible; el acetato tiene colores más intensos y una sensación más sólida.`],
      ],
      f: [
        ['¿Se pueden ajustar?', 'Sí, con calor suave en una óptica, aunque se ajustan menos que el metal.'],
        ['¿El TR-90 es hipoalergénico?', 'Normalmente lo tolera bien la piel sensible.'],
      ],
    },
  },
  {
    slug: 'round-vs-rectangular-glasses', slugEs: 'lentes-redondos-vs-rectangulares', cat: 'armazones', cta: '/Tienda',
    en: {
      t: 'Round vs Rectangular Glasses: Which Suits You?',
      d: 'How round and rectangular frames change your look, and tips for choosing between them.',
      i: `Round and rectangular are the two classic frame shapes. They create very different looks.`,
      s: [
        ['Round frames', `Soft, creative and a little vintage. They balance square or angular faces and look great in tortoise or thin metal.`],
        ['Rectangular frames', `Clean, professional and versatile. They add structure to round or soft faces and are easy to wear every day.`],
        ['For progressives', `Make sure the frame has enough height (about 30 mm) for all the lens zones; very slim rectangles can be too short.`],
      ],
      f: [
        ['Which is more professional?', 'Rectangular frames read as classic and formal, but a simple round frame is also very professional.'],
        ['Which is better for strong prescriptions?', 'Smaller, rounder lenses usually look thinner at the edges.'],
      ],
    },
    es: {
      t: 'Lentes redondos vs rectangulares: ¿cuál te queda?',
      d: 'Cómo cambian tu estilo los armazones redondos y rectangulares, y consejos para elegir.',
      i: `Redondos y rectangulares son las dos formas clásicas de armazón. Dan estilos muy distintos.`,
      s: [
        ['Redondos', `Suaves, creativos y un poco vintage. Equilibran caras cuadradas o angulares y se ven muy bien en carey o metal delgado.`],
        ['Rectangulares', `Limpios, profesionales y versátiles. Dan estructura a caras redondas o suaves y son fáciles de usar diario.`],
        ['Para progresivos', `Revisa que el armazón tenga altura suficiente (unos 30 mm) para todas las zonas; los rectangulares muy delgados pueden quedarse cortos.`],
      ],
      f: [
        ['¿Cuál es más formal?', 'Los rectangulares se ven clásicos y formales, aunque un redondo sencillo también es muy profesional.'],
        ['¿Cuál es mejor para graduación alta?', 'Las micas más chicas y redondas suelen verse más delgadas en la orilla.'],
      ],
    },
  },
  {
    slug: 'cat-eye-glasses', slugEs: 'lentes-cat-eye', cat: 'armazones', cta: '/Tienda',
    en: {
      t: 'Cat-Eye Glasses: How to Wear Them',
      d: 'Cat-eye frames lift the face with an upswept shape. Who they suit and how to choose the right size.',
      i: `Cat-eye frames sweep upward at the outer corners. They add a feminine, elegant lift to the face.`,
      s: [
        ['Who they suit', `They look great on round, square and oval faces. The upward line lifts the cheekbones.`],
        ['Subtle or bold', `Soft cat-eye shapes work every day. Strong angles and thick acetate make a statement.`],
        ['Colors', `Tortoise, black, wine and transparent are the most versatile.`],
      ],
      f: [
        ['Are cat-eye glasses only for women?', 'They are mostly designed for women, but anyone can wear them.'],
        ['Can I get cat-eye progressives?', 'Yes, if the frame has enough lens height.'],
      ],
    },
    es: {
      t: 'Lentes cat-eye: cómo usarlos',
      d: 'Los armazones cat-eye levantan el rostro con su forma hacia arriba. A quién le quedan y cómo elegir la talla.',
      i: `Los armazones cat-eye suben en las esquinas exteriores. Dan un toque elegante y femenino que levanta el rostro.`,
      s: [
        ['A quién le quedan', `Se ven muy bien en caras redondas, cuadradas y ovaladas. La línea hacia arriba resalta los pómulos.`],
        ['Discreto o llamativo', `Los cat-eye suaves sirven para diario. Los de ángulos marcados y acetato grueso llaman la atención.`],
        ['Colores', `Carey, negro, vino y transparente son los más fáciles de combinar.`],
      ],
      f: [
        ['¿Los cat-eye son solo para mujer?', 'La mayoría está diseñada para mujer, pero cualquiera puede usarlos.'],
        ['¿Puedo tener cat-eye con progresivos?', 'Sí, si el armazón tiene altura suficiente.'],
      ],
    },
  },
  {
    slug: 'glasses-for-kids', slugEs: 'lentes-para-ninos', cat: 'armazones', cta: '/Tienda',
    en: {
      t: 'Glasses for Kids: A Parent\'s Guide',
      d: 'Choosing durable, comfortable glasses for children: frame size, materials, polycarbonate lenses and fit.',
      i: `Kids need glasses that survive play time and stay in place. These are the most important things to look for.`,
      s: [
        ['Durable frames', `Flexible materials like TR-90 and spring hinges survive drops and bending.`],
        ['Safe lenses', `Polycarbonate lenses are strongly recommended for children: they are impact-resistant and block UV. At Verly: Thin & Durable, +$${MATERIAL_PRICES.poly}.`],
        ['The right size', `The frame should not be wider than the child's face, and the eyes should sit near the center of the lenses.`],
        ['Let them choose', `Kids are more likely to wear glasses they picked themselves. Let them choose the color.`],
      ],
      f: [
        ['How often do kids need new glasses?', 'Children\'s prescriptions can change quickly. Follow the eye doctor\'s schedule, often yearly.'],
        ['Should kids have a backup pair?', 'It is a good idea, especially for school.'],
      ],
    },
    es: {
      t: 'Lentes para niños: guía para papás',
      d: 'Cómo elegir lentes resistentes y cómodos para niños: talla del armazón, materiales, micas de policarbonato y ajuste.',
      i: `Los niños necesitan lentes que aguanten el juego y no se muevan. Esto es lo más importante a revisar.`,
      s: [
        ['Armazones resistentes', `Materiales flexibles como el TR-90 y bisagras de resorte aguantan caídas y dobleces.`],
        ['Micas seguras', `Se recomiendan mucho las micas de policarbonato para niños: resisten golpes y bloquean los UV. En Verly: Thin & Durable, +$${MATERIAL_PRICES.poly}.`],
        ['La talla correcta', `El armazón no debe ser más ancho que la cara del niño, y sus ojos deben quedar cerca del centro de las micas.`],
        ['Déjalos elegir', `Es más probable que usen lentes que ellos escogieron. Déjalos elegir el color.`],
      ],
      f: [
        ['¿Cada cuándo cambian de lentes?', 'La graduación de los niños puede cambiar rápido. Sigue el calendario del doctor, muchas veces cada año.'],
        ['¿Conviene un par de repuesto?', 'Es buena idea, sobre todo para la escuela.'],
      ],
    },
  },
  {
    slug: 'glasses-for-men', slugEs: 'lentes-para-hombre', cat: 'armazones', cta: '/Tienda?genero=hombre',
    en: {
      t: 'Glasses for Men: Styles That Always Work',
      d: 'Classic frame styles for men, how to choose the right size and which colors are easiest to wear.',
      i: `You don't need to follow trends to look good in glasses. A few classic styles work for almost every man.`,
      s: [
        ['Classic rectangle', `Black or dark tortoise acetate. Professional, easy and timeless.`],
        ['Square and bold', `Thicker acetate frames give a strong, modern look and suit oval and round faces.`],
        ['Metal and aviator', `Thin metal frames in gunmetal, black or gold look clean and light. Aviators add a casual touch.`],
        ['Get the size right', `Most men fit a medium or large frame. Compare with your current glasses.`],
      ],
      f: [
        ['What color is the safest choice?', 'Black, dark tortoise and gunmetal match almost everything.'],
        ['Which frames are best for a big head?', 'Look for large or extra-large sizes with longer temples (145–150 mm).'],
      ],
    },
    es: {
      t: 'Lentes para hombre: estilos que siempre funcionan',
      d: 'Estilos clásicos de armazón para hombre, cómo elegir la talla y qué colores son más fáciles de usar.',
      i: `No necesitas seguir modas para verte bien con lentes. Unos cuantos estilos clásicos le funcionan a casi cualquier hombre.`,
      s: [
        ['Rectangular clásico', `Acetato negro o carey oscuro. Profesional, sencillo y siempre vigente.`],
        ['Cuadrado y grueso', `El acetato más grueso da un estilo fuerte y moderno y le queda bien a caras ovaladas y redondas.`],
        ['Metal y aviador', `Los armazones de metal delgado en gris oscuro, negro o dorado se ven limpios y ligeros. Los aviadores dan un toque casual.`],
        ['Acierta con la talla', `La mayoría de los hombres usa talla mediana o grande. Compara con tus lentes actuales.`],
      ],
      f: [
        ['¿Qué color es el más seguro?', 'Negro, carey oscuro y gris oscuro combinan con casi todo.'],
        ['¿Qué armazón para cabeza grande?', 'Busca tallas grande o extra grande con varillas más largas (145–150 mm).'],
      ],
    },
  },
  {
    slug: 'glasses-for-women', slugEs: 'lentes-para-mujer', cat: 'armazones', cta: '/Tienda?genero=mujer',
    en: {
      t: 'Glasses for Women: How to Choose Your Style',
      d: 'Cat-eye, round, oversized or minimal metal: how to choose women\'s frames for your face and your day.',
      i: `Your glasses are part of your style every day. Think about your face, your wardrobe and how you spend your day.`,
      s: [
        ['Cat-eye', `Elegant and feminine. Lifts the face and works with most face shapes.`],
        ['Round and oval', `Soft and creative. Great in tortoise, transparent or thin gold metal.`],
        ['Oversized', `Bold and fashionable. Make sure the size still keeps your eyes near the center of the lenses.`],
        ['Minimal metal', `Light and discreet for those who prefer glasses that blend in.`],
      ],
      f: [
        ['Which colors are most versatile?', 'Tortoise, black, transparent and soft pinks or wine tones.'],
        ['Can I wear oversized frames with a strong prescription?', 'Larger lenses show more thickness; consider thinner lens materials.'],
      ],
    },
    es: {
      t: 'Lentes para mujer: cómo elegir tu estilo',
      d: 'Cat-eye, redondos, grandes o metal discreto: cómo elegir armazones para mujer según tu cara y tu día.',
      i: `Tus lentes son parte de tu estilo todos los días. Piensa en tu cara, en tu ropa y en cómo pasas el día.`,
      s: [
        ['Cat-eye', `Elegante y femenino. Levanta el rostro y le queda a la mayoría de las formas de cara.`],
        ['Redondos y ovalados', `Suaves y creativos. Se ven muy bien en carey, transparente o metal dorado delgado.`],
        ['Grandes (oversized)', `Llamativos y a la moda. Revisa que la talla mantenga tus ojos cerca del centro de las micas.`],
        ['Metal discreto', `Ligeros y sutiles para quien prefiere lentes que casi no se noten.`],
      ],
      f: [
        ['¿Qué colores combinan con más cosas?', 'Carey, negro, transparente y tonos rosa suave o vino.'],
        ['¿Puedo usar armazones grandes con graduación alta?', 'Las micas grandes muestran más grosor; considera materiales más delgados.'],
      ],
    },
  },
];
