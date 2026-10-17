import type { Guia } from './tipos';
import { VISION_PRICES, FILTRO_PRICES, MATERIAL_PRICES } from '../precios';

export const G_MICAS: Guia[] = [
  {
    slug: 'single-vision-lenses', slugEs: 'micas-monofocales', cat: 'micas', cta: '/Tienda',
    en: {
      t: 'Single Vision Lenses: What They Are and Who Needs Them',
      d: 'Single vision lenses correct one distance. The most common and affordable lens type, explained.',
      i: `Single vision lenses have the same power across the whole lens. They are the most common type of prescription lens and the most affordable.`,
      s: [
        ['Who uses them', `People who are nearsighted, farsighted or have astigmatism and need correction for one distance: far, or near for reading.`],
        ['Reading glasses are single vision too', `If you only need help up close, single-vision reading lenses use your near prescription.`],
        ['Price at Verly', `Single vision is +$${VISION_PRICES.mono} on top of the frame, with standard lens material included.`],
      ],
      f: [
        ['Can single vision lenses correct astigmatism?', 'Yes. They include your CYL and AXIS.'],
        ['Do I need single vision or progressive?', 'If your prescription has no ADD, single vision is what you need.'],
      ],
    },
    es: {
      t: 'Micas monofocales: qué son y quién las necesita',
      d: 'Las micas monofocales corrigen una sola distancia. El tipo de mica más común y económico, explicado.',
      i: `Las micas monofocales tienen la misma graduación en toda la mica. Son las más comunes y las más económicas.`,
      s: [
        ['Quién las usa', `Personas con miopía, hipermetropía o astigmatismo que necesitan corregir una sola distancia: de lejos, o de cerca para leer.`],
        ['Los lentes de lectura también son monofocales', `Si solo necesitas ayuda de cerca, las micas monofocales para leer usan tu graduación de cerca.`],
        ['Precio en Verly', `Monofocal es +$${VISION_PRICES.mono} sobre el armazón, con mica estándar incluida.`],
      ],
      f: [
        ['¿Las monofocales corrigen astigmatismo?', 'Sí. Incluyen tu cilindro y eje.'],
        ['¿Necesito monofocal o progresivo?', 'Si tu receta no trae adición (ADD), lo que necesitas es monofocal.'],
      ],
    },
  },
  {
    slug: 'bifocal-vs-progressive-lenses', slugEs: 'bifocales-vs-progresivos', cat: 'micas', cta: '/progressive-glasses',
    en: {
      t: 'Bifocal vs Progressive Lenses: Which One Is Right for You?',
      d: 'Compare bifocals and progressives: how they work, how they look, adaptation and price.',
      i: `Both bifocals and progressives let you see far and near with one pair. The difference is how the lens changes from one distance to the other.`,
      s: [
        ['Bifocals', `Two clear zones: distance on top and reading at the bottom, with a visible line. Easy to get used to, wide reading area. There is no zone for intermediate distance like a computer. At Verly: +$${VISION_PRICES.bi}.`],
        ['Progressives', `A smooth change from distance to intermediate to near, with no visible line. They look like regular lenses and cover computer distance too. Adaptation takes one to two weeks. At Verly: +$${VISION_PRICES.prog}.`],
        ['How to choose', `Choose progressives if you want a natural look and use a computer. Choose bifocals if you want the simplest adaptation and a wide reading zone at a lower price.`],
      ],
      f: [
        ['Which is easier to get used to?', 'Bifocals, usually. Progressives take a little practice but most people adapt in one to two weeks.'],
        ['Can I switch from bifocals to progressives?', 'Yes. Expect a short adaptation period.'],
      ],
    },
    es: {
      t: 'Bifocales vs progresivos: ¿cuál te conviene?',
      d: 'Compara bifocales y progresivos: cómo funcionan, cómo se ven, adaptación y precio.',
      i: `Los bifocales y los progresivos te dejan ver de lejos y de cerca con un solo par. La diferencia es cómo cambia la mica de una distancia a otra.`,
      s: [
        ['Bifocales', `Dos zonas claras: arriba para lejos y abajo para leer, con una línea visible. Fáciles de acostumbrarse y con zona de lectura amplia. No tienen zona intermedia para la computadora. En Verly: +$${VISION_PRICES.bi}.`],
        ['Progresivos', `Un cambio suave de lejos a intermedio y de cerca, sin línea visible. Se ven como micas normales y cubren la distancia de la computadora. La adaptación toma una o dos semanas. En Verly: +$${VISION_PRICES.prog}.`],
        ['Cómo elegir', `Elige progresivos si quieres que se vean naturales y usas computadora. Elige bifocales si quieres la adaptación más sencilla y una zona amplia para leer a menor precio.`],
      ],
      f: [
        ['¿Cuál es más fácil de acostumbrarse?', 'Normalmente los bifocales. Los progresivos requieren un poco de práctica, pero la mayoría se adapta en una o dos semanas.'],
        ['¿Puedo cambiar de bifocales a progresivos?', 'Sí. Espera un periodo corto de adaptación.'],
      ],
    },
  },
  {
    slug: 'progressive-lenses-guide', slugEs: 'guia-de-lentes-progresivos', cat: 'micas', cta: '/progressive-glasses',
    en: {
      t: 'Progressive Lenses: A Complete Beginner\'s Guide',
      d: 'How progressive lenses work, which frames fit them best and what to expect in the first weeks.',
      i: `Progressive lenses correct far, intermediate and near vision in one lens with no visible line. Here is everything to know before your first pair.`,
      s: [
        ['How they work', `The top of the lens is for distance. Moving down, the power increases gradually through an intermediate zone (computer, dashboard) to the reading zone at the bottom.`],
        ['Choosing a frame', `The frame needs enough height for all three zones: about 30 mm of lens height or more is a good guide. Very narrow frames shrink the reading area.`],
        ['Accurate PD matters', `Progressives are more sensitive to centering. A dual PD (one number per eye) gives the best result.`],
        ['Price', `At Verly, progressive lenses are +$${VISION_PRICES.prog} on top of the frame.`],
      ],
      f: [
        ['Why are the sides blurry?', 'All progressive designs have softer zones at the sides. You learn to turn your head instead of your eyes.'],
        ['Can I use progressives for driving?', 'Yes. The top distance zone is designed for it.'],
      ],
    },
    es: {
      t: 'Lentes progresivos: guía completa para principiantes',
      d: 'Cómo funcionan los progresivos, qué armazones les quedan mejor y qué esperar las primeras semanas.',
      i: `Los lentes progresivos corrigen lejos, intermedio y cerca en una sola mica, sin línea visible. Esto es lo que debes saber antes de tu primer par.`,
      s: [
        ['Cómo funcionan', `La parte de arriba es para lejos. Bajando, la graduación aumenta poco a poco por una zona intermedia (computadora, tablero del carro) hasta la zona de lectura abajo.`],
        ['Cómo elegir el armazón', `El armazón necesita altura suficiente para las tres zonas: unos 30 mm de alto de mica o más es una buena guía. Los armazones muy angostos achican la zona de lectura.`],
        ['La DP exacta importa', `Los progresivos son más sensibles al centrado. Una DP doble (un número por ojo) da el mejor resultado.`],
        ['Precio', `En Verly, los progresivos son +$${VISION_PRICES.prog} sobre el armazón.`],
      ],
      f: [
        ['¿Por qué se ve borroso a los lados?', 'Todos los progresivos tienen zonas menos nítidas en los lados. Aprendes a voltear la cabeza en lugar de solo los ojos.'],
        ['¿Puedo manejar con progresivos?', 'Sí. La zona de arriba está pensada para ver de lejos.'],
      ],
    },
  },
  {
    slug: 'adapting-to-progressive-lenses', slugEs: 'como-acostumbrarte-a-los-progresivos', cat: 'micas', cta: '/progressive-glasses',
    en: {
      t: 'How to Get Used to Progressive Lenses',
      d: 'Simple exercises and habits to adapt to progressive lenses in days, not weeks.',
      i: `Most people adapt to progressives in one to two weeks. These habits make the process faster and easier.`,
      s: [
        ['Point your nose at what you want to see', `Turn your head toward the object, then move your eyes up or down to find the sharp zone.`],
        ['Reading: lower your eyes, not your head', `Hold reading material a bit lower and look through the bottom of the lens.`],
        ['Computer: adjust your screen height', `Place your screen slightly below eye level so you look through the intermediate zone naturally.`],
        ['Stairs: tilt your head down', `Look down through the top (distance) part of the lens when walking down stairs.`],
      ],
      f: [
        ['What if I cannot adapt after two weeks?', 'Check the frame fit and PD. If the issue continues, contact us under the lens guarantee.'],
        ['Should I keep my old glasses for reading?', 'Try to use only the progressives during adaptation.'],
      ],
    },
    es: {
      t: 'Cómo acostumbrarte a los lentes progresivos',
      d: 'Ejercicios y hábitos sencillos para adaptarte a los progresivos en días, no semanas.',
      i: `La mayoría se adapta a los progresivos en una o dos semanas. Estos hábitos hacen el proceso más rápido y fácil.`,
      s: [
        ['Apunta la nariz hacia lo que quieres ver', `Voltea la cabeza hacia el objeto y luego mueve los ojos arriba o abajo hasta encontrar la zona nítida.`],
        ['Para leer: baja los ojos, no la cabeza', `Sostén lo que lees un poco más abajo y mira por la parte de abajo de la mica.`],
        ['Computadora: ajusta la altura de la pantalla', `Ponla un poco abajo de tus ojos para ver por la zona intermedia de forma natural.`],
        ['Escaleras: baja la cabeza', `Al bajar escaleras, mira por la parte de arriba (lejos) de la mica.`],
      ],
      f: [
        ['¿Y si no me adapto en dos semanas?', 'Revisa que el armazón te quede bien y tu DP. Si sigue el problema, escríbenos dentro de la garantía.'],
        ['¿Uso mis lentes viejos para leer?', 'Durante la adaptación trata de usar solo los progresivos.'],
      ],
    },
  },
  {
    slug: 'do-blue-light-glasses-work', slugEs: 'funcionan-los-lentes-de-luz-azul', cat: 'micas', cta: '/blue-light-glasses',
    en: {
      t: 'Do Blue Light Glasses Work? An Honest Answer',
      d: 'What blue light filters can and cannot do for screen users, and when they are worth it.',
      i: `Blue light glasses are popular, and many people find them more comfortable. Here is what they do, and what the evidence says.`,
      s: [
        ['What they do', `A blue light filter reflects or absorbs part of the blue light from screens and LED lighting. Many users report less glare and a more relaxed feeling.`],
        ['What the evidence says', `Studies have not shown that screen blue light damages the eyes, and the main cause of digital eye strain is long focusing time and less blinking. Breaks and an up-to-date prescription matter most.`],
        ['When they are worth it', `If you spend many hours at a screen and like the more comfortable feel, it is a low-cost addition: Blue Light Comfort is +$${FILTRO_PRICES.blue} at Verly. Pair it with anti-reflective for less glare.`],
      ],
      f: [
        ['Can I get blue light glasses without a prescription?', 'Yes, many people use non-prescription screen glasses.'],
        ['Do they help me sleep?', 'Reducing evening blue light may help some people, but turning screens off before bed helps the most.'],
      ],
    },
    es: {
      t: '¿Funcionan los lentes con filtro de luz azul? Una respuesta honesta',
      d: 'Qué puede y qué no puede hacer el filtro de luz azul si usas pantallas, y cuándo vale la pena.',
      i: `Los lentes con filtro de luz azul son populares y mucha gente los siente más cómodos. Te explicamos qué hacen y qué dice la evidencia.`,
      s: [
        ['Qué hacen', `El filtro refleja o absorbe parte de la luz azul de pantallas y focos LED. Muchos usuarios notan menos reflejo y una sensación más relajada.`],
        ['Qué dice la evidencia', `Los estudios no han demostrado que la luz azul de las pantallas dañe los ojos, y la causa principal del cansancio es enfocar mucho tiempo y parpadear menos. Lo que más ayuda son los descansos y una graduación actualizada.`],
        ['Cuándo valen la pena', `Si pasas muchas horas en pantallas y te gusta la sensación más cómoda, es un extra económico: Blue Light Comfort cuesta +$${FILTRO_PRICES.blue} en Verly. Combínalo con antirreflejante para menos reflejos.`],
      ],
      f: [
        ['¿Puedo tener lentes de luz azul sin graduación?', 'Sí, mucha gente los usa sin graduación para pantallas.'],
        ['¿Me ayudan a dormir?', 'Reducir la luz azul en la noche puede ayudar a algunas personas, pero lo que más ayuda es dejar las pantallas antes de dormir.'],
      ],
    },
  },
  {
    slug: 'photochromic-lenses', slugEs: 'micas-fotocromaticas', cat: 'micas', cta: '/photochromic-glasses',
    en: {
      t: 'Photochromic Lenses: Glasses That Darken in the Sun',
      d: 'How photochromic lenses work, how fast they change and their limits in the car.',
      i: `Photochromic lenses are clear indoors and darken outdoors in sunlight. One pair works as regular glasses and sunglasses.`,
      s: [
        ['How they work', `Molecules in the lens react to UV light and darken. When UV goes away, the lens clears again.`],
        ['How fast', `They usually darken in about a minute and take a few minutes to clear fully. They get darker in cold weather and slightly lighter in hot weather.`],
        ['Limit: inside the car', `Most car windshields block UV, so standard photochromic lenses darken very little while driving.`],
        ['Price', `At Verly, photochromic is +$${FILTRO_PRICES.foto} on any frame, available in gray and other colors.`],
      ],
      f: [
        ['Do photochromic lenses protect from UV?', 'Yes, they block UV rays both clear and dark.'],
        ['Are they as dark as sunglasses?', 'Outdoors in strong sun they get close. For very bright places like the beach, polarized sunglasses can be more comfortable.'],
      ],
    },
    es: {
      t: 'Micas fotocromáticas: lentes que se oscurecen con el sol',
      d: 'Cómo funcionan las micas fotocromáticas, qué tan rápido cambian y su límite dentro del carro.',
      i: `Las micas fotocromáticas son claras adentro y se oscurecen afuera con el sol. Un solo par funciona como lentes normales y de sol.`,
      s: [
        ['Cómo funcionan', `Moléculas dentro de la mica reaccionan a la luz UV y se oscurecen. Cuando no hay UV, la mica se vuelve a aclarar.`],
        ['Qué tan rápido', `Normalmente se oscurecen en un minuto y tardan unos minutos en aclararse por completo. Con frío se ponen más oscuras y con calor un poco más claras.`],
        ['Límite: dentro del carro', `La mayoría de los parabrisas bloquea los UV, así que las fotocromáticas estándar se oscurecen muy poco al manejar.`],
        ['Precio', `En Verly, el fotocromático es +$${FILTRO_PRICES.foto} en cualquier armazón, en gris y otros colores.`],
      ],
      f: [
        ['¿Protegen de los rayos UV?', 'Sí, bloquean los UV tanto claras como oscuras.'],
        ['¿Son tan oscuras como unos lentes de sol?', 'Con sol fuerte se acercan. Para lugares muy brillantes como la playa, unos polarizados pueden ser más cómodos.'],
      ],
    },
  },
  {
    slug: 'anti-reflective-coating', slugEs: 'que-es-el-antirreflejante', cat: 'micas', cta: '/lenses',
    en: {
      t: 'Anti-Reflective Coating: Is It Worth It?',
      d: 'What anti-reflective coating does for night driving, screens and photos, and the difference between basic and premium.',
      i: `Anti-reflective (AR) coating reduces the reflections on your lenses. It is one of the most useful additions for everyday comfort.`,
      s: [
        ['What it improves', `Less glare from headlights at night, fewer reflections from screens and overhead lights, and clearer lenses in photos and video calls: people see your eyes, not a reflection.`],
        ['Basic or premium', `Essential AR (+$${FILTRO_PRICES.ar}) removes most reflections. Premium Clarity AR (+$${FILTRO_PRICES.arprem}) reduces them further and is better for night driving.`],
        ['Who benefits most', `People who drive at night, work on computers, or have thicker lenses from a strong prescription.`],
      ],
      f: [
        ['Does AR coating scratch easily?', 'Good AR coatings are durable. Clean with water and a microfiber cloth, never with paper or a shirt.'],
        ['Can AR be added later?', 'Not to existing lenses. It is applied when the lenses are made.'],
      ],
    },
    es: {
      t: 'Antirreflejante: ¿vale la pena?',
      d: 'Qué hace el antirreflejante para manejar de noche, usar pantallas y salir en fotos, y la diferencia entre básico y premium.',
      i: `El antirreflejante (AR) reduce los reflejos en tus micas. Es de los extras más útiles para la comodidad diaria.`,
      s: [
        ['Qué mejora', `Menos deslumbramiento de faros de noche, menos reflejos de pantallas y lámparas, y micas más limpias en fotos y videollamadas: se ven tus ojos, no un reflejo.`],
        ['Básico o premium', `Essential AR (+$${FILTRO_PRICES.ar}) quita la mayoría de los reflejos. Premium Clarity AR (+$${FILTRO_PRICES.arprem}) los reduce todavía más y es mejor para manejar de noche.`],
        ['A quién le conviene más', `A quien maneja de noche, trabaja en computadora o tiene micas gruesas por graduación alta.`],
      ],
      f: [
        ['¿El antirreflejante se raya fácil?', 'Un buen antirreflejante es resistente. Límpialo con agua y paño de microfibra, nunca con papel ni con la camisa.'],
        ['¿Se puede agregar después?', 'No a micas ya hechas. Se aplica cuando se fabrican.'],
      ],
    },
  },
  {
    slug: 'polycarbonate-lenses', slugEs: 'micas-de-policarbonato', cat: 'micas', cta: '/lenses',
    en: {
      t: 'Polycarbonate Lenses: Thinner and Stronger',
      d: 'Why polycarbonate lenses are recommended for kids, sports and safety, and how they compare to standard plastic.',
      i: `Polycarbonate is a lightweight, impact-resistant lens material. It is thinner than standard plastic and much harder to break.`,
      s: [
        ['Main advantages', `High impact resistance, lighter weight, thinner lenses and built-in UV protection.`],
        ['Who should choose it', `Children, people who play sports, anyone who is hard on their glasses, rimless frames and medium to strong prescriptions.`],
        ['At Verly', `Our polycarbonate option is called Thin & Durable: +$${MATERIAL_PRICES.poly} on any frame.`],
      ],
      f: [
        ['Is polycarbonate better than standard plastic?', 'It is stronger and thinner. Standard plastic can offer slightly crisper optics in low prescriptions, so it is still a good basic option.'],
        ['Does it need anti-reflective?', 'It is recommended, because polycarbonate reflects a bit more light than standard plastic.'],
      ],
    },
    es: {
      t: 'Micas de policarbonato: más delgadas y resistentes',
      d: 'Por qué se recomiendan las micas de policarbonato para niños, deporte y seguridad, y cómo se comparan con el plástico estándar.',
      i: `El policarbonato es un material de mica ligero y resistente a golpes. Es más delgado que el plástico estándar y mucho más difícil de romper.`,
      s: [
        ['Ventajas principales', `Alta resistencia a golpes, menos peso, micas más delgadas y protección UV integrada.`],
        ['Quién debería elegirlo', `Niños, personas que hacen deporte, quien trata duro sus lentes, armazones de tres piezas y graduaciones medias a altas.`],
        ['En Verly', `Nuestra opción de policarbonato se llama Thin & Durable: +$${MATERIAL_PRICES.poly} en cualquier armazón.`],
      ],
      f: [
        ['¿Es mejor que el plástico estándar?', 'Es más resistente y delgado. El plástico estándar puede dar una visión un poco más nítida en graduaciones bajas, así que sigue siendo buena opción básica.'],
        ['¿Necesita antirreflejante?', 'Se recomienda, porque el policarbonato refleja un poco más de luz que el plástico estándar.'],
      ],
    },
  },
  {
    slug: 'high-index-lenses', slugEs: 'micas-de-alto-indice', cat: 'micas', cta: '/lenses',
    en: {
      t: 'High-Index Lenses: When Are They Worth It?',
      d: 'What high-index means, how much thinner the lenses get and which prescriptions benefit most.',
      i: `High-index lenses bend light more efficiently, so the same prescription needs less material. The result is thinner, lighter glasses.`,
      s: [
        ['The index number', `Standard plastic is about 1.50, polycarbonate 1.59, and high-index options go from 1.60 to 1.74. A higher number means a thinner lens.`],
        ['Who benefits', `Prescriptions from about ±4.00 and above notice the difference most. With low prescriptions, the gain is small.`],
        ['At Verly', `Ultra Thin (+$${MATERIAL_PRICES.hi}) and Ultra Thin Pro (+$${MATERIAL_PRICES.shi}), our thinnest option for strong prescriptions.`],
      ],
      f: [
        ['Are high-index lenses heavier?', 'No, they are usually lighter because there is less material.'],
        ['Do they need anti-reflective?', 'Yes, recommended. High-index lenses reflect more light.'],
      ],
    },
    es: {
      t: 'Micas de alto índice: ¿cuándo valen la pena?',
      d: 'Qué significa alto índice, cuánto más delgadas quedan las micas y qué graduaciones se benefician más.',
      i: `Las micas de alto índice desvían la luz con más eficiencia, así que la misma graduación necesita menos material. El resultado son lentes más delgados y ligeros.`,
      s: [
        ['El número de índice', `El plástico estándar es de 1.50, el policarbonato 1.59, y los de alto índice van de 1.60 a 1.74. Un número más alto significa una mica más delgada.`],
        ['Quién se beneficia', `Las graduaciones desde ±4.00 aproximadamente notan más la diferencia. Con graduaciones bajas, la ganancia es poca.`],
        ['En Verly', `Ultra Thin (+$${MATERIAL_PRICES.hi}) y Ultra Thin Pro (+$${MATERIAL_PRICES.shi}), nuestra opción más delgada para graduaciones altas.`],
      ],
      f: [
        ['¿Pesan más?', 'No, normalmente son más ligeras porque llevan menos material.'],
        ['¿Necesitan antirreflejante?', 'Sí, se recomienda. Las micas de alto índice reflejan más luz.'],
      ],
    },
  },
  {
    slug: 'polarized-vs-photochromic', slugEs: 'polarizado-vs-fotocromatico', cat: 'micas', cta: '/lenses',
    en: {
      t: 'Polarized vs Photochromic Lenses: What Is the Difference?',
      d: 'Polarized lenses cut glare; photochromic lenses darken in the sun. Which one fits your day?',
      i: `Both help in the sun, but they solve different problems.`,
      s: [
        ['Polarized', `Always dark. They block glare reflected from water, roads and car hoods. Great for driving in the sun, the beach and fishing. At Verly: +$${FILTRO_PRICES.pol}.`],
        ['Photochromic', `Clear indoors, dark outdoors. One pair for all day, but they darken little inside a car. At Verly: +$${FILTRO_PRICES.foto}.`],
        ['How to choose', `If you want one pair for everything, choose photochromic. If you want the best sunglasses for driving and outdoor activities, choose polarized as a second pair.`],
      ],
      f: [
        ['Can I wear polarized lenses indoors?', 'They are too dark for indoor use.'],
        ['Do polarized lenses affect screens?', 'They can make some phone or dashboard screens look dark at certain angles.'],
      ],
    },
    es: {
      t: 'Polarizado vs fotocromático: ¿cuál es la diferencia?',
      d: 'Los polarizados quitan el reflejo; los fotocromáticos se oscurecen con el sol. ¿Cuál va con tu día?',
      i: `Los dos ayudan con el sol, pero resuelven problemas distintos.`,
      s: [
        ['Polarizado', `Siempre oscuro. Bloquea el reflejo del agua, la carretera y el cofre del carro. Ideal para manejar con sol, la playa y pescar. En Verly: +$${FILTRO_PRICES.pol}.`],
        ['Fotocromático', `Claro adentro, oscuro afuera. Un solo par para todo el día, aunque se oscurece poco dentro del carro. En Verly: +$${FILTRO_PRICES.foto}.`],
        ['Cómo elegir', `Si quieres un solo par para todo, elige fotocromático. Si quieres los mejores lentes de sol para manejar y estar afuera, elige polarizado como segundo par.`],
      ],
      f: [
        ['¿Puedo usar polarizados adentro?', 'Son demasiado oscuros para usar en interiores.'],
        ['¿Los polarizados afectan las pantallas?', 'Pueden hacer que algunas pantallas del celular o del carro se vean oscuras en ciertos ángulos.'],
      ],
    },
  },
  {
    slug: 'anti-fog-lenses', slugEs: 'micas-antiempanantes', cat: 'micas', cta: '/lenses',
    en: {
      t: 'Anti-Fog Lenses: Stop Your Glasses From Fogging Up',
      d: 'Why glasses fog with masks, cooking or cold weather and how an anti-fog lens treatment helps.',
      i: `Glasses fog when warm, humid air touches a cooler lens: masks, cooking, entering a warm room from the cold, or hot drinks.`,
      s: [
        ['What anti-fog does', `It helps moisture spread into a clear layer instead of tiny droplets, so the lens stays see-through.`],
        ['Who needs it', `People who wear masks at work, cooks, delivery and outdoor workers, and anyone in cold climates.`],
        ['At Verly', `Anti-Fog is +$${FILTRO_PRICES.anti} on any prescription lens.`],
      ],
      f: [
        ['Does anti-fog last forever?', 'Its performance can decrease with time and cleaning. Clean gently with water and microfiber.'],
        ['Other tips?', 'A well-fitted mask with a nose wire directs breath away from your glasses.'],
      ],
    },
    es: {
      t: 'Micas antiempañantes: que tus lentes no se empañen',
      d: 'Por qué se empañan los lentes con cubrebocas, al cocinar o con frío, y cómo ayuda el tratamiento antiempañante.',
      i: `Los lentes se empañan cuando el aire caliente y húmedo toca una mica más fría: cubrebocas, cocinar, entrar a un lugar cálido desde el frío o bebidas calientes.`,
      s: [
        ['Qué hace el antiempañante', `Ayuda a que la humedad se extienda en una capa transparente en lugar de gotitas, así la mica sigue viéndose clara.`],
        ['Quién lo necesita', `Personas que usan cubrebocas en el trabajo, cocineros, repartidores, trabajadores al aire libre y quien vive en lugares fríos.`],
        ['En Verly', `El antiempañante cuesta +$${FILTRO_PRICES.anti} en cualquier mica graduada.`],
      ],
      f: [
        ['¿El antiempañante dura para siempre?', 'Su efecto puede bajar con el tiempo y la limpieza. Limpia con cuidado con agua y microfibra.'],
        ['¿Algún otro consejo?', 'Un cubrebocas bien ajustado con alambre en la nariz desvía el aliento lejos de tus lentes.'],
      ],
    },
  },
  {
    slug: 'computer-glasses', slugEs: 'lentes-para-computadora', cat: 'micas', cta: '/blue-light-glasses',
    en: {
      t: 'Computer Glasses: Do You Need Them?',
      d: 'What makes a good pair of computer glasses: the right distance, anti-reflective and optional blue light filter.',
      i: `Computer glasses are lenses optimized for the distance of your screen, about 20 to 30 inches away. They can make long work days more comfortable.`,
      s: [
        ['Who benefits most', `People over 40 whose reading lenses are too close for a monitor, and progressive wearers who tilt their head to see the screen.`],
        ['What to include', `Your correct prescription, anti-reflective to cut glare, and optionally a blue light filter if you find it more comfortable.`],
        ['Under 40?', `If your distance glasses feel fine at the screen, you may not need a separate pair. Breaks and anti-reflective often help most.`],
      ],
      f: [
        ['Can I drive with computer glasses?', 'Not if they are set for intermediate distance; distant objects will be blurry.'],
        ['Are blue light glasses the same as computer glasses?', 'Not exactly. Blue light is a filter; computer glasses are about the right focusing distance.'],
      ],
    },
    es: {
      t: 'Lentes para computadora: ¿los necesitas?',
      d: 'Qué hace buenos unos lentes para computadora: la distancia correcta, antirreflejante y filtro de luz azul opcional.',
      i: `Los lentes para computadora tienen micas pensadas para la distancia de tu pantalla, unos 50 a 75 cm. Pueden hacer más cómodos los días largos de trabajo.`,
      s: [
        ['A quién le sirven más', `A personas de más de 40 cuyos lentes de lectura enfocan demasiado cerca para un monitor, y a quien usa progresivos y levanta la cabeza para ver la pantalla.`],
        ['Qué incluir', `Tu graduación correcta, antirreflejante para quitar reflejos y, si te resulta más cómodo, filtro de luz azul.`],
        ['¿Menos de 40?', `Si tus lentes de lejos se sienten bien frente a la pantalla, quizá no necesites otro par. Los descansos y el antirreflejante suelen ayudar más.`],
      ],
      f: [
        ['¿Puedo manejar con lentes para computadora?', 'No si están graduados para distancia intermedia; de lejos verás borroso.'],
        ['¿Son lo mismo que los de luz azul?', 'No exactamente. La luz azul es un filtro; los de computadora tienen que ver con la distancia de enfoque.'],
      ],
    },
  },
  {
    slug: 'glasses-for-night-driving', slugEs: 'lentes-para-manejar-de-noche', cat: 'micas', cta: '/lenses',
    en: {
      t: 'Glasses for Night Driving: What Actually Helps',
      d: 'Glare, halos and headlights at night: how an updated prescription and anti-reflective lenses help, and what to avoid.',
      i: `Night driving is harder for many people: headlights, halos and glare. The right glasses can make a real difference.`,
      s: [
        ['Start with an updated prescription', `Small uncorrected errors, especially astigmatism, are more noticeable at night when the pupils are larger.`],
        ['Anti-reflective is key', `It removes reflections on the lens itself so headlights do not create extra glare. Premium Clarity AR (+$${FILTRO_PRICES.arprem}) is the best choice for night driving.`],
        ['Avoid tinted "night driving" lenses', `Yellow tinted lenses reduce the total light reaching your eyes. They can make you feel like you see better while actually seeing less.`],
        ['Keep lenses clean', `Smudges and scratches scatter light. Clean your glasses before you drive.`],
      ],
      f: [
        ['Why do I see halos around lights?', 'It can be uncorrected astigmatism, a dirty lens or an eye condition. If it is new or getting worse, see your eye doctor.'],
        ['Do photochromic lenses work at night?', 'Yes, they are clear at night.'],
      ],
    },
    es: {
      t: 'Lentes para manejar de noche: lo que sí ayuda',
      d: 'Reflejos, halos y faros de noche: cómo ayudan una graduación actualizada y el antirreflejante, y qué evitar.',
      i: `Manejar de noche cuesta más a mucha gente: faros, halos y reflejos. Los lentes correctos pueden hacer una gran diferencia.`,
      s: [
        ['Primero, una graduación actualizada', `Errores pequeños sin corregir, sobre todo el astigmatismo, se notan más de noche cuando las pupilas están más abiertas.`],
        ['El antirreflejante es clave', `Quita los reflejos de la propia mica para que los faros no generen deslumbramiento extra. Premium Clarity AR (+$${FILTRO_PRICES.arprem}) es la mejor opción para manejar de noche.`],
        ['Evita las micas amarillas "para noche"', `Las micas con tinte amarillo reducen la luz total que llega a tus ojos. Pueden hacerte sentir que ves mejor cuando en realidad ves menos.`],
        ['Mantén las micas limpias', `Las manchas y rayones dispersan la luz. Limpia tus lentes antes de manejar.`],
      ],
      f: [
        ['¿Por qué veo halos en las luces?', 'Puede ser astigmatismo sin corregir, una mica sucia o algo del ojo. Si es nuevo o va empeorando, ve con tu doctor.'],
        ['¿Las fotocromáticas sirven de noche?', 'Sí, de noche están claras.'],
      ],
    },
  },
];
