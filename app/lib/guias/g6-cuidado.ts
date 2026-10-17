import type { Guia } from './tipos';
import { GARANTIA_DIAS } from '../marca';

export const G_CUIDADO: Guia[] = [
  {
    slug: 'how-to-clean-glasses', slugEs: 'como-limpiar-tus-lentes', cat: 'cuidado', cta: '/Tienda',
    en: {
      t: 'How to Clean Your Glasses Without Scratching Them',
      d: 'The right way to clean prescription glasses, and the common habits that scratch lenses and damage coatings.',
      i: `Most scratches come from cleaning the wrong way. Two minutes and the right steps keep your lenses clear for longer.`,
      s: [
        ['Step by step', `1. Rinse under lukewarm water to remove dust.\n2. Put a small drop of mild dish soap (without lotion) on your fingertips and rub both sides of the lenses and the frame.\n3. Rinse well.\n4. Shake off the water and dry gently with a clean microfiber cloth.`],
        ['Avoid', `Paper towels, napkins and your shirt (they scratch), household glass cleaners, ammonia or acetone (they damage coatings), and hot water.`],
        ['Wash the microfiber cloth', `A dirty cloth spreads oil and dust. Wash it regularly without fabric softener.`],
      ],
      f: [
        ['Can I use alcohol wipes?', 'Lens-specific wipes are fine occasionally. For daily cleaning, water, mild soap and microfiber are best.'],
        ['How often should I clean my glasses?', 'A quick clean daily, and a wash with soap whenever they look greasy.'],
      ],
    },
    es: {
      t: 'Cómo limpiar tus lentes sin rayarlos',
      d: 'La forma correcta de limpiar tus lentes graduados y los hábitos comunes que rayan las micas y dañan los tratamientos.',
      i: `La mayoría de los rayones vienen de limpiar mal. Dos minutos y los pasos correctos mantienen tus micas claras por más tiempo.`,
      s: [
        ['Paso a paso', `1. Enjuágalos con agua tibia para quitar el polvo.\n2. Pon una gotita de jabón para trastes suave (sin crema) en los dedos y talla las micas por ambos lados y el armazón.\n3. Enjuaga bien.\n4. Sacude el agua y seca con suavidad con un paño de microfibra limpio.`],
        ['Evita', `Toallas de papel, servilletas y tu camisa (rayan), limpiadores de vidrios, amoníaco o acetona (dañan los tratamientos) y agua caliente.`],
        ['Lava el paño de microfibra', `Un paño sucio esparce grasa y polvo. Lávalo seguido sin suavizante.`],
      ],
      f: [
        ['¿Puedo usar toallitas con alcohol?', 'Las toallitas especiales para lentes sirven de vez en cuando. Para diario, lo mejor es agua, jabón suave y microfibra.'],
        ['¿Cada cuándo los limpio?', 'Una limpieza rápida diario y lavarlos con jabón cuando se vean grasosos.'],
      ],
    },
  },
  {
    slug: 'glasses-slipping-down-nose', slugEs: 'mis-lentes-se-resbalan', cat: 'cuidado', cta: '/Tienda',
    en: {
      t: 'Glasses Slipping Down Your Nose? How to Fix It',
      d: 'Why glasses slide down and simple fixes: the right size, nose pads, temple adjustment and cleaning.',
      i: `Glasses that keep sliding are annoying and can change how you see through the lens. Here are the usual causes and fixes.`,
      s: [
        ['The frame is too wide', `If the frame is wider than your face, it will slide. Choose a size closer to your current glasses.`],
        ['The bridge does not fit', `Frames without nose pads need the bridge to match your nose. Metal frames with adjustable pads are easier to fit.`],
        ['The temples are loose', `An optician can bend the tips of the temples behind your ears for a secure fit. It takes a minute.`],
        ['Oily skin', `Clean the nose pads and your nose; skin oils make frames slide.`],
      ],
      f: [
        ['Can I adjust the frame myself?', 'Small adjustments are possible, but bending a frame cold can break it. A local optician can do it quickly.'],
        ['Which frames slide less?', 'Frames with adjustable nose pads or a well-fitted bridge.'],
      ],
    },
    es: {
      t: '¿Tus lentes se resbalan? Cómo solucionarlo',
      d: 'Por qué se resbalan los lentes y soluciones sencillas: talla correcta, plaquetas, ajuste de varillas y limpieza.',
      i: `Los lentes que se resbalan son molestos y pueden cambiar cómo ves por la mica. Estas son las causas comunes y cómo arreglarlas.`,
      s: [
        ['El armazón es muy ancho', `Si el armazón es más ancho que tu cara, se va a resbalar. Elige una talla más parecida a tus lentes actuales.`],
        ['El puente no te queda', `Los armazones sin plaquetas necesitan un puente a la medida de tu nariz. Los de metal con plaquetas ajustables son más fáciles de acomodar.`],
        ['Las varillas están flojas', `En una óptica pueden doblar la punta de las varillas detrás de tus orejas para que queden firmes. Toma un minuto.`],
        ['Piel grasa', `Limpia las plaquetas y tu nariz; la grasa de la piel hace que se resbalen.`],
      ],
      f: [
        ['¿Puedo ajustarlos yo?', 'Ajustes pequeños sí, pero doblar el armazón en frío puede romperlo. En una óptica lo hacen rápido.'],
        ['¿Qué armazones se resbalan menos?', 'Los que tienen plaquetas ajustables o un puente que te queda bien.'],
      ],
    },
  },
  {
    slug: 'scratched-glasses-lenses', slugEs: 'micas-rayadas-que-hacer', cat: 'cuidado', cta: '/warranty',
    en: {
      t: 'Scratched Glasses Lenses: What Can You Do?',
      d: 'Can scratches be removed from glasses? What works, what damages your lenses and when to replace them.',
      i: `Unfortunately, scratches on prescription lenses cannot be truly repaired. Here is what to know and how to prevent them.`,
      s: [
        ['Do not try "home remedies"', `Toothpaste, baking soda or car polish remove coatings and can make vision worse.`],
        ['When to replace', `Small scratches at the edges usually do not matter. Scratches in the center that blur your vision mean it is time for new lenses.`],
        ['Prevention', `Always store glasses in a hard case, never lens-down on a table, and clean only with water, mild soap and microfiber.`],
        ['Manufacturing defects', `If there is a defect in your lenses when you receive them, contact us within ${GARANTIA_DIAS} days.`],
      ],
      f: [
        ['Do anti-scratch coatings prevent all scratches?', 'They make lenses more resistant, not scratch-proof.'],
        ['Are scratches covered by warranty?', 'Normal wear and accidents are not; manufacturing defects are.'],
      ],
    },
    es: {
      t: 'Micas rayadas: ¿qué puedes hacer?',
      d: '¿Se pueden quitar los rayones de las micas? Qué sirve, qué las daña y cuándo cambiarlas.',
      i: `Lamentablemente, los rayones en las micas graduadas no se pueden reparar de verdad. Esto es lo que debes saber y cómo evitarlos.`,
      s: [
        ['No uses "remedios caseros"', `La pasta de dientes, el bicarbonato o el pulidor de carro quitan los tratamientos y pueden empeorar tu visión.`],
        ['Cuándo cambiarlas', `Los rayones pequeños en las orillas normalmente no importan. Los rayones en el centro que nublan tu vista indican que ya toca micas nuevas.`],
        ['Cómo evitarlos', `Guarda siempre tus lentes en estuche duro, nunca los dejes con las micas hacia abajo y límpialos solo con agua, jabón suave y microfibra.`],
        ['Defectos de fabricación', `Si tus micas llegan con algún defecto, escríbenos dentro de los primeros ${GARANTIA_DIAS} días.`],
      ],
      f: [
        ['¿El tratamiento antirrayas evita todos los rayones?', 'Hace las micas más resistentes, no a prueba de rayones.'],
        ['¿La garantía cubre rayones?', 'El desgaste normal y los accidentes no; los defectos de fabricación sí.'],
      ],
    },
  },
  {
    slug: 'how-to-store-glasses', slugEs: 'como-guardar-tus-lentes', cat: 'cuidado', cta: '/Tienda',
    en: {
      t: 'How to Store Your Glasses So They Last Longer',
      d: 'Simple habits that protect your glasses: hard case, never lens-down, away from heat and how to take them off.',
      i: `Most damage to glasses happens when they are not on your face. These habits protect your frame and lenses.`,
      s: [
        ['Use the hard case', `Every time you take them off and are not putting them right back on, store them in the case.`],
        ['Never lens-down', `If you put them on a table, fold them and place them with the temples down.`],
        ['Avoid heat', `Do not leave them on the car dashboard. High heat can warp frames and damage coatings.`],
        ['Take them off with both hands', `Pulling with one hand stretches the frame and loosens hinges over time.`],
      ],
      f: [
        ['Is it bad to wear glasses on my head?', 'It stretches the temples and the frame becomes loose.'],
        ['Should I keep my glasses in a soft pouch?', 'A soft pouch prevents scratches but not crushing. A hard case is better.'],
      ],
    },
    es: {
      t: 'Cómo guardar tus lentes para que duren más',
      d: 'Hábitos sencillos que protegen tus lentes: estuche duro, nunca con las micas hacia abajo, lejos del calor y cómo quitártelos.',
      i: `La mayoría de los daños pasan cuando los lentes no están en tu cara. Estos hábitos protegen tu armazón y tus micas.`,
      s: [
        ['Usa el estuche duro', `Cada vez que te los quites y no te los vayas a poner luego, guárdalos en el estuche.`],
        ['Nunca con las micas hacia abajo', `Si los dejas en la mesa, dóblalos y déjalos apoyados en las varillas.`],
        ['Evita el calor', `No los dejes en el tablero del carro. El calor puede deformar el armazón y dañar los tratamientos.`],
        ['Quítatelos con las dos manos', `Jalarlos con una sola mano estira el armazón y afloja las bisagras con el tiempo.`],
      ],
      f: [
        ['¿Es malo ponérmelos en la cabeza?', 'Estira las varillas y el armazón se afloja.'],
        ['¿Sirve una funda suave?', 'Evita rayones pero no aplastones. El estuche duro es mejor.'],
      ],
    },
  },
];
