import type { Guia } from './tipos';
import { MATERIAL_PRICES } from '../precios';

export const G_RECETA: Guia[] = [
  {
    slug: 'how-to-read-eyeglass-prescription', slugEs: 'como-leer-tu-receta-de-lentes', cat: 'receta', cta: '/help#receta',
    en: {
      t: 'How to Read Your Eyeglass Prescription',
      d: 'OD, OS, SPH, CYL, AXIS, ADD and PD explained in plain English, with an example prescription.',
      i: `Your prescription looks like a table of numbers, but each one has a simple meaning. Once you know them, ordering glasses online is easy.`,
      s: [
        ['OD and OS', `OD (oculus dexter) is your right eye. OS (oculus sinister) is your left eye. Some prescriptions say RE and LE instead. OU means both eyes.`],
        ['SPH (sphere)', `The main power of the lens. A minus sign (−) means you are nearsighted: you see well up close but blurry far away. A plus sign (+) means you are farsighted.`],
        ['CYL and AXIS', `CYL corrects astigmatism, an uneven curve of the eye. AXIS (a number from 1 to 180) tells the lab the direction of that correction. If CYL is empty, you have no astigmatism and AXIS is not needed.`],
        ['ADD', `Extra power for reading, usually from +0.75 to +3.00. It appears when you need bifocals or progressives, often after age 40.`],
        ['PD (pupillary distance)', `The distance in millimeters between the centers of your pupils, for example 63. It centers the lenses in front of your eyes. Sometimes it is written as two numbers, one per eye (31.5 / 31.5).`],
        ['Example', `OD: SPH −2.25, CYL −0.50, AXIS 180\nOS: SPH −2.00, CYL −0.75, AXIS 175\nPD: 63\nThis person is nearsighted in both eyes with mild astigmatism, and needs single-vision lenses.`],
      ],
      f: [
        ['Is my contact lens prescription the same?', 'No. Contact lens prescriptions include other measurements and can have different powers. Use a glasses prescription.'],
        ['What if my prescription has no PD?', 'Many do not include it. You can measure it at home; see our PD guide.'],
        ['What does "plano" or "PL" mean?', 'It means zero power for that value: no correction needed.'],
      ],
    },
    es: {
      t: 'Cómo leer tu receta de lentes',
      d: 'OD, OI, ESF, CIL, EJE, ADD y DP explicados de forma sencilla, con un ejemplo de receta.',
      i: `Tu receta parece una tabla de números, pero cada uno tiene un significado sencillo. Sabiendo leerla, pedir lentes en línea es muy fácil.`,
      s: [
        ['OD y OI (OS)', `OD es tu ojo derecho. OI u OS es tu ojo izquierdo. AO u OU significa ambos ojos.`],
        ['ESF o SPH (esfera)', `La graduación principal. Un signo menos (−) significa miopía: ves bien de cerca y borroso de lejos. Un signo más (+) significa hipermetropía.`],
        ['CIL y EJE (CYL y AXIS)', `El cilindro corrige el astigmatismo, una curvatura irregular del ojo. El eje (un número de 1 a 180) le dice al laboratorio la dirección de esa corrección. Si no hay cilindro, no tienes astigmatismo y no se necesita eje.`],
        ['ADD (adición)', `Graduación extra para leer, normalmente de +0.75 a +3.00. Aparece cuando necesitas bifocales o progresivos, casi siempre después de los 40.`],
        ['DP (distancia pupilar)', `La distancia en milímetros entre el centro de tus pupilas, por ejemplo 63. Sirve para centrar las micas frente a tus ojos. A veces viene en dos números, uno por ojo (31.5 / 31.5).`],
        ['Ejemplo', `OD: ESF −2.25, CIL −0.50, EJE 180\nOI: ESF −2.00, CIL −0.75, EJE 175\nDP: 63\nEsta persona tiene miopía en ambos ojos con un poco de astigmatismo y necesita micas monofocales.`],
      ],
      f: [
        ['¿Mi receta de lentes de contacto sirve?', 'No. La receta de lentes de contacto lleva otras medidas y puede tener graduaciones diferentes. Usa una receta de lentes.'],
        ['¿Y si mi receta no trae la DP?', 'Muchas no la traen. Puedes medirla en casa; revisa nuestra guía de distancia pupilar.'],
        ['¿Qué significa "neutro", "plano" o "PL"?', 'Que ese valor es cero: no necesita corrección.'],
      ],
    },
  },
  {
    slug: 'what-is-sph-on-prescription', slugEs: 'que-es-la-esfera-en-tu-receta', cat: 'receta', cta: '/help#receta',
    en: {
      t: 'What Does SPH Mean on an Eyeglass Prescription?',
      d: 'SPH (sphere) is the main power of your lenses. What minus and plus numbers mean and how strong your prescription is.',
      i: `SPH, short for sphere, is the main correction in your glasses. It tells the lab how much power your lens needs to focus light correctly.`,
      s: [
        ['Minus numbers: nearsighted', `A negative SPH (for example −1.50) corrects myopia. Distant things look blurry; close things look sharp. The bigger the number, the stronger the correction.`],
        ['Plus numbers: farsighted', `A positive SPH (for example +1.25) corrects hyperopia. Close things are harder to focus, and your eyes may feel tired when reading.`],
        ['How strong is my prescription?', `As a general guide: up to ±2.00 is mild, ±2.25 to ±5.00 is moderate, and above ±5.00 is strong. Strong prescriptions benefit from thinner lens materials.`],
        ['Units', `SPH is measured in diopters and changes in steps of 0.25.`],
      ],
      f: [
        ['Can SPH be different in each eye?', 'Yes, it is very common to have a different power in each eye.'],
        ['What if SPH says 0.00 or plano?', 'That eye needs no sphere correction, although it may still have CYL for astigmatism.'],
      ],
    },
    es: {
      t: '¿Qué significa ESF (esfera) en tu receta de lentes?',
      d: 'La esfera es la graduación principal de tus lentes. Qué significan los números con menos y con más, y qué tan alta es tu graduación.',
      i: `ESF o SPH (esfera) es la corrección principal de tus lentes. Le dice al laboratorio cuánta graduación necesita tu mica para enfocar bien la luz.`,
      s: [
        ['Números con menos: miopía', `Una esfera negativa (por ejemplo −1.50) corrige la miopía. Lo lejano se ve borroso y lo cercano se ve bien. Mientras más grande el número, más fuerte la corrección.`],
        ['Números con más: hipermetropía', `Una esfera positiva (por ejemplo +1.25) corrige la hipermetropía. Cuesta enfocar de cerca y los ojos se cansan al leer.`],
        ['¿Qué tan alta es mi graduación?', `Como guía general: hasta ±2.00 es baja, de ±2.25 a ±5.00 es media, y más de ±5.00 es alta. Las graduaciones altas se benefician de micas más delgadas.`],
        ['Unidades', `La esfera se mide en dioptrías y cambia de 0.25 en 0.25.`],
      ],
      f: [
        ['¿Puede ser diferente en cada ojo?', 'Sí, es muy común tener una graduación distinta en cada ojo.'],
        ['¿Y si dice 0.00 o neutro?', 'Ese ojo no necesita corrección de esfera, aunque puede tener cilindro por astigmatismo.'],
      ],
    },
  },
  {
    slug: 'cyl-and-axis-astigmatism', slugEs: 'cilindro-y-eje-astigmatismo', cat: 'receta', cta: '/help#receta',
    en: {
      t: 'CYL and AXIS: Understanding Astigmatism on Your Prescription',
      d: 'What cylinder and axis mean, why they always go together and how astigmatism is corrected with glasses.',
      i: `If your prescription has numbers under CYL and AXIS, you have astigmatism. It is very common and glasses correct it easily.`,
      s: [
        ['What astigmatism is', `The front of the eye is not perfectly round, so light focuses unevenly. Things can look slightly blurry or stretched at any distance.`],
        ['CYL (cylinder)', `The amount of astigmatism, in diopters. It can be written with a minus or a plus sign depending on the doctor; both are correct.`],
        ['AXIS', `A number from 1 to 180 that tells the lab the angle of the correction. It has no unit and no sign. AXIS only exists when there is a CYL value.`],
        ['Type them exactly', `When ordering online, copy CYL and AXIS exactly as written for each eye. A wrong axis can make your glasses feel uncomfortable.`],
      ],
      f: [
        ['Is astigmatism serious?', 'Usually not. It is a common refractive error that glasses or contact lenses correct.'],
        ['Why does my CYL have a plus sign?', 'Some doctors write it in plus form. The lab converts it; just copy it exactly.'],
      ],
    },
    es: {
      t: 'Cilindro y eje: cómo entender el astigmatismo en tu receta',
      d: 'Qué significan cilindro y eje, por qué siempre van juntos y cómo se corrige el astigmatismo con lentes.',
      i: `Si tu receta tiene números en CIL y EJE, tienes astigmatismo. Es muy común y se corrige fácilmente con lentes.`,
      s: [
        ['Qué es el astigmatismo', `La parte de enfrente del ojo no es perfectamente redonda, así que la luz enfoca de forma desigual. Las cosas pueden verse un poco borrosas o estiradas a cualquier distancia.`],
        ['CIL (cilindro)', `La cantidad de astigmatismo, en dioptrías. Puede venir con signo menos o más según el doctor; las dos formas son correctas.`],
        ['EJE', `Un número de 1 a 180 que le dice al laboratorio el ángulo de la corrección. No lleva unidad ni signo. Solo existe cuando hay cilindro.`],
        ['Escríbelos exactos', `Al pedir en línea, copia el cilindro y el eje tal como vienen para cada ojo. Un eje equivocado puede hacer que tus lentes se sientan incómodos.`],
      ],
      f: [
        ['¿El astigmatismo es grave?', 'Normalmente no. Es un error refractivo común que se corrige con lentes o lentes de contacto.'],
        ['¿Por qué mi cilindro tiene signo más?', 'Algunos doctores lo escriben en positivo. El laboratorio lo convierte; solo cópialo igual.'],
      ],
    },
  },
  {
    slug: 'what-is-add-on-prescription', slugEs: 'que-es-add-en-tu-receta', cat: 'receta', cta: '/progressive-glasses',
    en: {
      t: 'What Does ADD Mean on an Eyeglass Prescription?',
      d: 'ADD is extra reading power for bifocals and progressives. What the number means and which lenses you need.',
      i: `ADD (addition) is the extra magnifying power you need to see up close. If your prescription has an ADD value, you probably need bifocals, progressives or reading glasses.`,
      s: [
        ['Why ADD appears', `After about 40, the eye's lens loses flexibility and focusing up close gets harder. This is called presbyopia and it is completely normal.`],
        ['Typical values', `ADD goes from +0.75 to about +3.00 and usually increases slowly with age. It is often the same for both eyes.`],
        ['Which lenses use ADD', `Bifocals (two zones with a line), progressives (gradual, no line) and single-vision reading glasses all use it.`],
      ],
      f: [
        ['Do I have to use ADD?', 'Only if you want lenses that also help you read. For distance-only glasses, the ADD is not used.'],
        ['Can I just buy readers?', 'Off-the-shelf readers only work if both eyes have the same power and no astigmatism.'],
      ],
    },
    es: {
      t: '¿Qué significa ADD (adición) en tu receta?',
      d: 'La adición es graduación extra para leer en bifocales y progresivos. Qué significa el número y qué micas necesitas.',
      i: `ADD (adición) es la graduación extra que necesitas para ver de cerca. Si tu receta trae adición, probablemente necesitas bifocales, progresivos o lentes para leer.`,
      s: [
        ['Por qué aparece la adición', `Después de los 40, el cristalino del ojo pierde flexibilidad y cuesta enfocar de cerca. Se llama presbicia o vista cansada y es completamente normal.`],
        ['Valores comunes', `La adición va de +0.75 a +3.00 y suele subir poco a poco con la edad. Casi siempre es igual en los dos ojos.`],
        ['Qué micas la usan', `Bifocales (dos zonas con línea), progresivos (cambio gradual, sin línea) y lentes monofocales para leer.`],
      ],
      f: [
        ['¿Tengo que usar la adición?', 'Solo si quieres micas que también te ayuden a leer. Para lentes solo de lejos no se usa.'],
        ['¿Puedo comprar lentes de lectura de farmacia?', 'Solo funcionan si los dos ojos tienen la misma graduación y no tienes astigmatismo.'],
      ],
    },
  },
  {
    slug: 'how-to-measure-pupillary-distance', slugEs: 'como-medir-tu-distancia-pupilar', cat: 'receta', cta: '/help#receta',
    en: {
      t: 'How to Measure Your Pupillary Distance (PD) at Home',
      d: 'Measure your PD in two minutes with a ruler and a mirror, or with a friend. Step-by-step instructions.',
      i: `Your PD centers each lens in front of your pupil. If your prescription doesn't include it, you can measure it at home in a couple of minutes.`,
      s: [
        ['What you need', `A ruler with millimeters and a mirror, or a friend to help.`],
        ['With a mirror', `1. Stand about 8 inches (20 cm) from the mirror.\n2. Hold the ruler flat against your eyebrows.\n3. Close your right eye and line up the 0 with the center of your left pupil.\n4. Close your left eye, open the right one and read the number at the center of your right pupil.\n5. Repeat two or three times and use the average.`],
        ['With a friend', `Look straight at a point far away while your friend holds the ruler and measures from the center of one pupil to the other. Looking far keeps your eyes parallel.`],
        ['Typical values', `Most adults have a PD between 54 and 74 mm. Children usually measure between 43 and 58 mm.`],
      ],
      f: [
        ['What is dual PD?', 'Two numbers, one for each eye measured from the center of the nose (for example 31.5 / 32). It is more precise, especially for progressives.'],
        ['What if I am off by 1 mm?', 'A small difference is usually fine for single-vision lenses. For strong prescriptions or progressives, precision matters more.'],
      ],
    },
    es: {
      t: 'Cómo medir tu distancia pupilar (DP) en casa',
      d: 'Mide tu DP en dos minutos con una regla y un espejo, o con ayuda de alguien. Instrucciones paso a paso.',
      i: `La DP sirve para centrar cada mica frente a tu pupila. Si tu receta no la trae, puedes medirla en casa en un par de minutos.`,
      s: [
        ['Qué necesitas', `Una regla con milímetros y un espejo, o alguien que te ayude.`],
        ['Con un espejo', `1. Párate a unos 20 cm del espejo.\n2. Pon la regla recta sobre tus cejas.\n3. Cierra el ojo derecho y alinea el 0 con el centro de tu pupila izquierda.\n4. Cierra el izquierdo, abre el derecho y lee el número en el centro de tu pupila derecha.\n5. Repite dos o tres veces y saca el promedio.`],
        ['Con ayuda de alguien', `Mira de frente a un punto lejano mientras la otra persona sostiene la regla y mide de pupila a pupila. Mirar lejos mantiene tus ojos paralelos.`],
        ['Valores comunes', `La mayoría de los adultos tiene una DP entre 54 y 74 mm. En niños suele estar entre 43 y 58 mm.`],
      ],
      f: [
        ['¿Qué es la DP doble?', 'Dos números, uno por ojo, medidos desde el centro de la nariz (por ejemplo 31.5 / 32). Es más precisa, sobre todo en progresivos.'],
        ['¿Y si me equivoco por 1 mm?', 'En monofocales una diferencia pequeña normalmente no afecta. En graduaciones altas o progresivos la precisión importa más.'],
      ],
    },
  },
  {
    slug: 'od-os-ou-meaning', slugEs: 'que-significa-od-oi-ao', cat: 'receta', cta: '/help#receta',
    en: {
      t: 'OD, OS and OU: What They Mean on Your Prescription',
      d: 'The Latin abbreviations on your eyeglass prescription explained: right eye, left eye and both eyes.',
      i: `Eye doctors use Latin abbreviations for each eye. Mixing them up is one of the most common mistakes when ordering glasses online.`,
      s: [
        ['OD: right eye', `Oculus dexter. Always the right eye, from your point of view, not the doctor's.`],
        ['OS: left eye', `Oculus sinister. Some prescriptions write OI (oculus izquierdo) or LE.`],
        ['OU: both eyes', `Oculus uterque. Used when a value applies to both eyes, often for ADD.`],
        ['Tip', `When you type your prescription online, fill the right-eye row with the OD numbers and the left-eye row with the OS numbers. Uploading a photo of your prescription avoids mistakes.`],
      ],
      f: [
        ['What if my prescription says RE and LE?', 'RE is right eye (OD) and LE is left eye (OS).'],
        ['What happens if I swap them?', 'If your eyes have different powers, swapping them will make your glasses blurry and uncomfortable.'],
      ],
    },
    es: {
      t: 'OD, OI y AO: qué significan en tu receta',
      d: 'Las abreviaturas de tu receta de lentes explicadas: ojo derecho, ojo izquierdo y ambos ojos.',
      i: `Los doctores de la vista usan abreviaturas para cada ojo. Confundirlas es uno de los errores más comunes al pedir lentes en línea.`,
      s: [
        ['OD: ojo derecho', `Oculus dexter. Siempre es tu ojo derecho, visto desde ti, no desde el doctor.`],
        ['OI u OS: ojo izquierdo', `Ojo izquierdo. En recetas en inglés aparece como OS (oculus sinister) o LE.`],
        ['AO u OU: ambos ojos', `Se usa cuando un valor aplica a los dos ojos, muchas veces en la adición.`],
        ['Consejo', `Al escribir tu receta en línea, llena el renglón del ojo derecho con los números de OD y el del izquierdo con los de OI/OS. Subir una foto de tu receta evita errores.`],
      ],
      f: [
        ['¿Y si dice RE y LE?', 'RE es ojo derecho (OD) y LE es ojo izquierdo (OI).'],
        ['¿Qué pasa si los invierto?', 'Si tus ojos tienen graduaciones diferentes, tus lentes se verán borrosos e incómodos.'],
      ],
    },
  },
  {
    slug: 'does-eyeglass-prescription-expire', slugEs: 'la-receta-de-lentes-caduca', cat: 'receta', cta: '/help#receta',
    en: {
      t: 'Does an Eyeglass Prescription Expire?',
      d: 'How long a glasses prescription is valid in the US, and why it is worth checking your eyes regularly.',
      i: `Yes. In the US, glasses prescriptions usually have an expiration date, commonly one to two years, depending on the state and the doctor.`,
      s: [
        ['Why prescriptions expire', `Vision changes over time, and an eye exam also checks the health of your eyes, not only the numbers. Expiration dates encourage regular checkups.`],
        ['How to know yours', `Look for an expiration date on the prescription. If there is none, ask your eye doctor's office.`],
        ['When to get a new exam sooner', `Blurry vision, headaches, eye strain or trouble seeing at night are reasons to get checked even if your prescription has not expired.`],
      ],
      f: [
        ['Can I order glasses with an expired prescription?', 'It is best to use a current prescription so your glasses match your vision today.'],
        ['Do children need exams more often?', 'Yes. Children\'s vision can change quickly; follow your eye doctor\'s recommendation.'],
      ],
    },
    es: {
      t: '¿La receta de lentes caduca?',
      d: 'Cuánto tiempo es válida una receta de lentes en Estados Unidos y por qué conviene revisarte con regularidad.',
      i: `Sí. En Estados Unidos las recetas de lentes normalmente tienen fecha de vencimiento, por lo general de uno a dos años, según el estado y el doctor.`,
      s: [
        ['Por qué caduca', `La vista cambia con el tiempo y el examen también revisa la salud de tus ojos, no solo los números. La fecha de vencimiento ayuda a revisarte con regularidad.`],
        ['Cómo saber la tuya', `Busca la fecha de vencimiento en tu receta. Si no la trae, pregunta en el consultorio de tu doctor.`],
        ['Cuándo revisarte antes', `Visión borrosa, dolor de cabeza, ojos cansados o dificultad para ver de noche son motivos para revisarte aunque tu receta no haya vencido.`],
      ],
      f: [
        ['¿Puedo pedir lentes con una receta vencida?', 'Lo mejor es usar una receta actual para que tus lentes correspondan a tu vista de hoy.'],
        ['¿Los niños necesitan examen más seguido?', 'Sí. La vista de los niños puede cambiar rápido; sigue la recomendación de su doctor.'],
      ],
    },
  },
  {
    slug: 'contact-lens-vs-glasses-prescription', slugEs: 'receta-de-lentes-de-contacto-vs-lentes', cat: 'receta', cta: '/help#receta',
    en: {
      t: 'Contact Lens vs Glasses Prescription: Why They Are Different',
      d: 'You cannot use a contact lens prescription to order glasses. Here is why the numbers are different.',
      i: `A contact lens sits on your eye; glasses sit about half an inch in front of it. That distance changes the power you need, so the prescriptions are not interchangeable.`,
      s: [
        ['Different power', `For stronger prescriptions, the power of a contact lens and a glasses lens can differ noticeably because of the distance from the eye.`],
        ['Different measurements', `Contact lens prescriptions include base curve (BC), diameter (DIA) and a brand. Glasses prescriptions include PD and sometimes prism instead.`],
        ['What to do', `Ask your eye doctor for your glasses prescription. Most offices can give you a copy.`],
      ],
      f: [
        ['Can I convert my contact prescription?', 'Not reliably at home. Ask your eye doctor for a glasses prescription.'],
        ['Is my glasses PD on my contact prescription?', 'Usually not. You can measure it at home.'],
      ],
    },
    es: {
      t: 'Receta de lentes de contacto vs receta de lentes: por qué son diferentes',
      d: 'No puedes usar la receta de lentes de contacto para pedir lentes. Te explicamos por qué los números cambian.',
      i: `El lente de contacto va sobre el ojo; los lentes van a poco más de un centímetro enfrente. Esa distancia cambia la graduación que necesitas, así que las recetas no son intercambiables.`,
      s: [
        ['Graduación distinta', `En graduaciones altas, la graduación de un lente de contacto y la de una mica pueden ser bastante diferentes por la distancia al ojo.`],
        ['Medidas distintas', `La receta de contacto incluye curva base (CB), diámetro (DIA) y una marca. La de lentes incluye distancia pupilar y a veces prisma.`],
        ['Qué hacer', `Pide a tu doctor tu receta de lentes. La mayoría de los consultorios te da una copia.`],
      ],
      f: [
        ['¿Puedo convertir mi receta de contacto?', 'No de forma confiable en casa. Pide a tu doctor la receta de lentes.'],
        ['¿Mi receta de contacto trae la DP?', 'Normalmente no. Puedes medirla en casa.'],
      ],
    },
  },
  {
    slug: 'glasses-for-high-prescription', slugEs: 'lentes-para-graduacion-alta', cat: 'receta', cta: '/lenses',
    en: {
      t: 'Glasses for a High Prescription: Thinner, Lighter Lenses',
      d: 'Strong prescription? How lens material and frame size keep your glasses thin, light and comfortable.',
      i: `With a strong prescription, standard lenses can look thick at the edges (for minus powers) or in the center (for plus powers). The right material and frame make a big difference.`,
      s: [
        ['Choose a thinner material', `Polycarbonate (Thin & Durable, +$${MATERIAL_PRICES.poly}) is thinner and much stronger than standard plastic. High-index materials go thinner still, and are worth it from about ±4.00 and up.`],
        ['Choose a smaller frame', `Smaller, rounder lenses mean less thickness at the edge. Very large or very wide frames make thick lenses more visible.`],
        ['Full-rim frames hide edges', `A full rim covers the edge of the lens. Rimless styles show the full thickness.`],
        ['Add anti-reflective', `Thicker lenses reflect more light. An anti-reflective coating makes them look clearer and reduces glare.`],
      ],
      f: [
        ['From what prescription should I use thin lenses?', 'As a general rule, consider them from about ±4.00, or earlier if you want lighter glasses.'],
        ['Are thin lenses more fragile?', 'No. Polycarbonate is one of the most impact-resistant lens materials.'],
      ],
    },
    es: {
      t: 'Lentes para graduación alta: micas más delgadas y ligeras',
      d: '¿Graduación alta? Cómo el material de la mica y la talla del armazón mantienen tus lentes delgados, ligeros y cómodos.',
      i: `Con graduación alta, las micas estándar pueden verse gruesas en la orilla (miopía) o en el centro (hipermetropía). El material y el armazón correctos hacen una gran diferencia.`,
      s: [
        ['Elige un material más delgado', `El policarbonato (Thin & Durable, +$${MATERIAL_PRICES.poly}) es más delgado y mucho más resistente que el plástico estándar. Los de alto índice son todavía más delgados y valen la pena desde ±4.00 aproximadamente.`],
        ['Elige un armazón más chico', `Micas más chicas y redondeadas tienen menos grosor en la orilla. Los armazones muy grandes o anchos hacen más visible el grosor.`],
        ['Armazón completo esconde la orilla', `El aro completo cubre la orilla de la mica. Los estilos al aire (tres piezas) muestran todo el grosor.`],
        ['Agrega antirreflejante', `Las micas gruesas reflejan más luz. El antirreflejante las hace verse más limpias y reduce los reflejos.`],
      ],
      f: [
        ['¿Desde qué graduación conviene una mica delgada?', 'Como regla general, desde ±4.00, o antes si quieres lentes más ligeros.'],
        ['¿Las micas delgadas son más frágiles?', 'No. El policarbonato es de los materiales más resistentes a golpes.'],
      ],
    },
  },
];
