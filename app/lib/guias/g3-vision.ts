import type { Guia } from './tipos';
import { GARANTIA_DIAS } from '../marca';

export const G_VISION: Guia[] = [
  {
    slug: 'nearsighted-vs-farsighted', slugEs: 'miopia-vs-hipermetropia', cat: 'vision', cta: '/Tienda',
    en: {
      t: 'Nearsighted vs Farsighted: What Is the Difference?',
      d: 'Myopia and hyperopia explained simply: symptoms, how they show on your prescription and how glasses correct them.',
      i: `Both are very common focusing problems, and both are corrected with glasses. The difference is which distance looks blurry.`,
      s: [
        ['Nearsighted (myopia)', `You see well up close but distant things are blurry: road signs, the board, the TV. Your prescription has a minus sign (−) in SPH.`],
        ['Farsighted (hyperopia)', `Distant things may look fine, but focusing up close takes effort and can cause tired eyes or headaches when reading. Your prescription has a plus sign (+).`],
        ['Not the same as presbyopia', `Presbyopia is the age-related loss of near focus after about 40. Farsightedness can exist at any age.`],
      ],
      f: [
        ['Can I be nearsighted in one eye and farsighted in the other?', 'Yes, it is less common but it happens. Each lens is made for each eye.'],
        ['Do I need to wear glasses all the time?', 'It depends on your prescription and daily needs. Ask your eye doctor.'],
      ],
    },
    es: {
      t: 'Miopía vs hipermetropía: ¿cuál es la diferencia?',
      d: 'Miopía e hipermetropía explicadas de forma sencilla: síntomas, cómo aparecen en tu receta y cómo se corrigen con lentes.',
      i: `Los dos son problemas de enfoque muy comunes y los dos se corrigen con lentes. La diferencia es qué distancia se ve borrosa.`,
      s: [
        ['Miopía', `Ves bien de cerca pero lo lejano se ve borroso: letreros, el pizarrón, la tele. Tu receta tiene signo menos (−) en la esfera.`],
        ['Hipermetropía', `De lejos puede verse bien, pero enfocar de cerca cuesta trabajo y puede causar ojos cansados o dolor de cabeza al leer. Tu receta tiene signo más (+).`],
        ['No es lo mismo que la vista cansada', `La presbicia o vista cansada es la pérdida de enfoque de cerca después de los 40. La hipermetropía puede existir a cualquier edad.`],
      ],
      f: [
        ['¿Puedo tener miopía en un ojo e hipermetropía en el otro?', 'Sí, es menos común pero pasa. Cada mica se hace para cada ojo.'],
        ['¿Tengo que usar lentes todo el día?', 'Depende de tu graduación y de tus actividades. Pregunta a tu doctor.'],
      ],
    },
  },
  {
    slug: 'glasses-for-astigmatism', slugEs: 'lentes-para-astigmatismo', cat: 'vision', cta: '/Tienda',
    en: {
      t: 'Glasses for Astigmatism: What You Need to Know',
      d: 'Any frame works for astigmatism. What matters is the exact CYL and AXIS and a correctly centered lens.',
      i: `Good news: you do not need special frames for astigmatism. Any frame works as long as the lenses are made with your exact cylinder and axis.`,
      s: [
        ['Precision matters', `The axis must be cut at the right angle. Copy CYL and AXIS exactly from your prescription, or upload a photo of it.`],
        ['Stable fit', `A frame that slides or tilts moves the axis out of place. Choose a size that sits firmly on your nose and ears.`],
        ['Anti-reflective helps at night', `Astigmatism can make lights look streaked at night. An anti-reflective coating reduces extra glare from the lens itself.`],
        ['Give it a few days', `With a new or stronger astigmatism correction, floors can look tilted for a day or two. That usually goes away as you adapt.`],
      ],
      f: [
        ['Can I wear progressives with astigmatism?', 'Yes. Progressive lenses are made with your full prescription, including CYL and AXIS.'],
        ['Does astigmatism get worse?', 'It can change over time. Regular eye exams keep your prescription current.'],
      ],
    },
    es: {
      t: 'Lentes para astigmatismo: lo que debes saber',
      d: 'Cualquier armazón sirve para astigmatismo. Lo importante es el cilindro y el eje exactos y una mica bien centrada.',
      i: `Buenas noticias: no necesitas armazones especiales para el astigmatismo. Cualquier armazón sirve si las micas se hacen con tu cilindro y eje exactos.`,
      s: [
        ['La precisión importa', `El eje debe cortarse en el ángulo correcto. Copia el cilindro y el eje tal cual vienen en tu receta, o sube una foto.`],
        ['Que el armazón no se mueva', `Un armazón que se resbala o se inclina mueve el eje de lugar. Elige una talla que se sostenga firme en nariz y orejas.`],
        ['El antirreflejante ayuda de noche', `El astigmatismo puede hacer que las luces se vean con rayos de noche. El antirreflejante reduce los reflejos extra de la mica.`],
        ['Date unos días', `Con una corrección nueva o más fuerte, el piso puede verse inclinado uno o dos días. Normalmente se quita al adaptarte.`],
      ],
      f: [
        ['¿Puedo usar progresivos con astigmatismo?', 'Sí. Los progresivos se hacen con toda tu receta, incluyendo cilindro y eje.'],
        ['¿El astigmatismo empeora?', 'Puede cambiar con el tiempo. Los exámenes regulares mantienen tu receta al día.'],
      ],
    },
  },
  {
    slug: 'presbyopia-reading-glasses', slugEs: 'presbicia-vista-cansada', cat: 'vision', cta: '/progressive-glasses',
    en: {
      t: 'Presbyopia After 40: Reading Glasses, Bifocals or Progressives?',
      d: 'Why reading gets harder after 40 and how to choose between readers, bifocals and progressive lenses.',
      i: `If you hold your phone farther away to read it, you are not alone. Presbyopia is a normal change that affects almost everyone after about 40.`,
      s: [
        ['What happens', `The lens inside your eye becomes less flexible, so focusing up close takes more effort. It usually progresses until around 60.`],
        ['Reading glasses', `Simple and affordable if you only need help up close. You take them off to see far.`],
        ['Bifocals', `Two zones in one lens: distance on top, reading at the bottom, with a visible line.`],
        ['Progressives', `A gradual change from far to intermediate (computer) to near, with no line. The most natural option if you also need distance correction.`],
      ],
      f: [
        ['Is presbyopia preventable?', 'No. It is a natural part of aging, but glasses correct it very well.'],
        ['Will my reading power keep increasing?', 'Usually for some years, slowly. Regular eye exams keep your ADD up to date.'],
      ],
    },
    es: {
      t: 'Vista cansada después de los 40: ¿lentes de lectura, bifocales o progresivos?',
      d: 'Por qué cuesta leer después de los 40 y cómo elegir entre lentes de lectura, bifocales y progresivos.',
      i: `Si alejas el celular para poder leerlo, no eres el único. La presbicia o vista cansada es un cambio normal que le pasa a casi todos después de los 40.`,
      s: [
        ['Qué pasa', `El cristalino dentro del ojo pierde flexibilidad y enfocar de cerca cuesta más. Normalmente avanza hasta cerca de los 60.`],
        ['Lentes de lectura', `Sencillos y económicos si solo necesitas ayuda de cerca. Te los quitas para ver de lejos.`],
        ['Bifocales', `Dos zonas en una mica: arriba para lejos, abajo para leer, con una línea visible.`],
        ['Progresivos', `Un cambio gradual de lejos a intermedio (computadora) y de cerca, sin línea. La opción más natural si también necesitas ver de lejos.`],
      ],
      f: [
        ['¿Se puede prevenir?', 'No. Es parte natural de la edad, pero los lentes la corrigen muy bien.'],
        ['¿Mi graduación para leer seguirá subiendo?', 'Normalmente durante algunos años, poco a poco. Los exámenes regulares mantienen tu adición al día.'],
      ],
    },
  },
  {
    slug: 'signs-you-need-glasses', slugEs: 'senales-de-que-necesitas-lentes', cat: 'vision', cta: '/Tienda',
    en: {
      t: '9 Signs You Might Need Glasses',
      d: 'Squinting, headaches, tired eyes or trouble driving at night can mean it is time for an eye exam.',
      i: `Vision changes slowly, so many people don't notice. These are common signs that it is time for an eye exam.`,
      s: [
        ['Common signs', `1. You squint to see far or near.\n2. Frequent headaches, especially after reading or screens.\n3. Tired or burning eyes.\n4. Blurry road signs or TV.\n5. Trouble seeing at night or halos around lights.\n6. You hold your phone farther away to read.\n7. Double vision.\n8. Your eyes water when focusing.\n9. You need more light than before to read.`],
        ['What to do', `Schedule an eye exam with an optometrist. If you already have glasses and notice these signs, your prescription may have changed.`],
        ['When to see a doctor right away', `Sudden vision loss, flashes of light, a curtain over your vision or eye pain need immediate medical attention, not new glasses.`],
      ],
      f: [
        ['Can headaches really come from vision?', 'Yes. Uncorrected vision makes your eyes work harder, which can cause headaches.'],
        ['How often should adults get an eye exam?', 'Many adults are checked every one to two years; follow your eye doctor\'s advice.'],
      ],
    },
    es: {
      t: '9 señales de que podrías necesitar lentes',
      d: 'Entrecerrar los ojos, dolor de cabeza, ojos cansados o problemas para manejar de noche pueden indicar que necesitas examen.',
      i: `La vista cambia poco a poco y mucha gente no lo nota. Estas son señales comunes de que ya toca un examen de la vista.`,
      s: [
        ['Señales comunes', `1. Entrecierras los ojos para ver de lejos o de cerca.\n2. Dolores de cabeza frecuentes, sobre todo después de leer o usar pantallas.\n3. Ojos cansados o con ardor.\n4. Letreros o la tele se ven borrosos.\n5. Te cuesta ver de noche o ves halos en las luces.\n6. Alejas el celular para leer.\n7. Visión doble.\n8. Te lloran los ojos al enfocar.\n9. Necesitas más luz que antes para leer.`],
        ['Qué hacer', `Agenda un examen de la vista con un optometrista. Si ya usas lentes y notas estas señales, quizá cambió tu graduación.`],
        ['Cuándo ir al doctor de inmediato', `Pérdida repentina de visión, destellos de luz, una sombra como cortina o dolor en el ojo necesitan atención médica inmediata, no lentes nuevos.`],
      ],
      f: [
        ['¿De verdad el dolor de cabeza puede ser por la vista?', 'Sí. Una vista sin corregir hace que tus ojos trabajen de más y eso puede causar dolor de cabeza.'],
        ['¿Cada cuándo debe revisarse un adulto?', 'Muchos adultos se revisan cada uno o dos años; sigue la recomendación de tu doctor.'],
      ],
    },
  },
  {
    slug: 'eye-strain-from-screens', slugEs: 'vista-cansada-por-pantallas', cat: 'vision', cta: '/blue-light-glasses',
    en: {
      t: 'Eye Strain From Screens: Causes and What Actually Helps',
      d: 'Tired, dry eyes after hours on your computer or phone? Simple habits and lens options that help.',
      i: `Many people spend eight hours or more a day on screens. Tired, dry or burning eyes are common, and most of it can be improved with simple changes.`,
      s: [
        ['Why screens tire your eyes', `Focusing at the same short distance for hours, blinking less and glare from the screen all add up. An outdated prescription makes it worse.`],
        ['The 20-20-20 rule', `Every 20 minutes, look at something about 20 feet (6 meters) away for 20 seconds. It relaxes your focusing muscles.`],
        ['Set up your screen', `Keep it about an arm's length away, slightly below eye level, with brightness similar to the room. Reduce glare from windows and lamps.`],
        ['Lens options', `An up-to-date prescription comes first. Anti-reflective coatings reduce glare. Blue light filters may feel more comfortable for some people, although the main relief comes from breaks and correct lenses.`],
      ],
      f: [
        ['Do I need computer glasses?', 'If you are over 40 or spend many hours at a screen, lenses set for intermediate distance can be more comfortable.'],
        ['Does screen time damage my eyes?', 'Current evidence shows it causes temporary strain, not permanent damage. Breaks and good lenses help.'],
      ],
    },
    es: {
      t: 'Vista cansada por pantallas: causas y qué ayuda de verdad',
      d: '¿Ojos cansados y secos después de horas en la computadora o el celular? Hábitos y opciones de micas que ayudan.',
      i: `Mucha gente pasa ocho horas o más al día frente a pantallas. Los ojos cansados, secos o con ardor son comunes, y casi siempre mejoran con cambios sencillos.`,
      s: [
        ['Por qué cansan las pantallas', `Enfocar a la misma distancia corta por horas, parpadear menos y los reflejos de la pantalla se suman. Una graduación desactualizada lo empeora.`],
        ['La regla 20-20-20', `Cada 20 minutos, mira algo a unos 6 metros durante 20 segundos. Relaja los músculos que enfocan.`],
        ['Acomoda tu pantalla', `A un brazo de distancia, un poco abajo de tus ojos, con brillo parecido al del cuarto. Evita reflejos de ventanas y lámparas.`],
        ['Opciones de micas', `Primero, una graduación actualizada. El antirreflejante reduce reflejos. El filtro de luz azul puede sentirse más cómodo para algunas personas, aunque el alivio principal viene de los descansos y de la graduación correcta.`],
      ],
      f: [
        ['¿Necesito lentes para computadora?', 'Si tienes más de 40 o pasas muchas horas frente a la pantalla, unas micas para distancia intermedia pueden ser más cómodas.'],
        ['¿Las pantallas dañan la vista?', 'La evidencia actual indica que causan cansancio temporal, no daño permanente. Los descansos y buenas micas ayudan.'],
      ],
    },
  },
  {
    slug: 'headaches-from-new-glasses', slugEs: 'dolor-de-cabeza-con-lentes-nuevos', cat: 'vision', cta: '/warranty',
    en: {
      t: 'Headaches From New Glasses: Normal or a Problem?',
      d: 'Why new glasses can cause mild headaches for a few days, and when it means something needs fixing.',
      i: `It is common to feel a little strange during the first days with new glasses, especially with a new prescription. Here is how to tell normal adaptation from a real problem.`,
      s: [
        ['Normal adaptation', `Mild headaches, slight dizziness or floors that look curved can happen for a few days while your brain adjusts. Wear your new glasses consistently instead of switching back to the old ones.`],
        ['When it is not normal', `If discomfort lasts more than one to two weeks, vision is blurry in one eye, or you see double, something may be off: the prescription, the PD or the fit.`],
        ['What to check', `Compare the prescription you ordered with your paper prescription. Check that the frame sits straight and does not slide down.`],
        ['We can help', `At Verly, if your prescription doesn't feel right within ${GARANTIA_DIAS} days, we remake your lenses free.`],
      ],
      f: [
        ['How long does adaptation take?', 'Usually a few days. Progressives can take one to two weeks.'],
        ['Should I go back to my old glasses?', 'Try to keep wearing the new ones; switching back and forth slows adaptation.'],
      ],
    },
    es: {
      t: 'Dolor de cabeza con lentes nuevos: ¿normal o problema?',
      d: 'Por qué los lentes nuevos pueden causar un poco de dolor de cabeza unos días y cuándo significa que algo hay que corregir.',
      i: `Es común sentirse un poco raro los primeros días con lentes nuevos, sobre todo con una graduación nueva. Así distingues la adaptación normal de un problema real.`,
      s: [
        ['Adaptación normal', `Un poco de dolor de cabeza, ligero mareo o ver el piso curveado puede pasar unos días mientras tu cerebro se ajusta. Usa tus lentes nuevos todo el día en vez de regresar a los viejos.`],
        ['Cuándo no es normal', `Si la molestia dura más de una o dos semanas, ves borroso de un ojo o ves doble, algo puede estar mal: la graduación, la DP o el ajuste.`],
        ['Qué revisar', `Compara la receta que pediste con tu receta en papel. Revisa que el armazón quede derecho y no se resbale.`],
        ['Te ayudamos', `En Verly, si tu graduación no queda en los primeros ${GARANTIA_DIAS} días, rehacemos tus micas gratis.`],
      ],
      f: [
        ['¿Cuánto tarda la adaptación?', 'Normalmente unos días. Los progresivos pueden tardar una o dos semanas.'],
        ['¿Regreso a mis lentes viejos?', 'Trata de seguir con los nuevos; cambiar de uno a otro hace más lenta la adaptación.'],
      ],
    },
  },
  {
    slug: 'adjusting-to-new-glasses', slugEs: 'como-adaptarte-a-tus-lentes-nuevos', cat: 'vision', cta: '/help',
    en: {
      t: 'How to Adjust to New Glasses Faster',
      d: 'Practical tips to get comfortable with a new prescription, new frame or new lens type in just a few days.',
      i: `New glasses can feel different even when everything is correct. These tips help your eyes and brain adapt faster.`,
      s: [
        ['Wear them all day', `Put them on in the morning and keep them on. Consistency is what trains your brain.`],
        ['Move your head, not just your eyes', `Especially with progressives or strong prescriptions, turn your head toward what you want to see.`],
        ['Make sure they fit', `A frame that sits too low or tilts changes how you see through the lens. A small adjustment at the nose pads or temples helps.`],
        ['Be careful on stairs the first days', `Depth can feel slightly different at first. Take it easy on stairs and curbs.`],
      ],
      f: [
        ['Is it normal for edges to look blurry?', 'A little at first, especially with progressives. It improves as you learn to look through the right zone.'],
        ['What if I still feel uncomfortable after two weeks?', `Contact us. We will check your order, and if needed remake your lenses within the ${GARANTIA_DIAS}-day guarantee.`],
      ],
    },
    es: {
      t: 'Cómo adaptarte más rápido a tus lentes nuevos',
      d: 'Consejos prácticos para acostumbrarte a una graduación nueva, un armazón nuevo o un tipo de mica nuevo en pocos días.',
      i: `Los lentes nuevos pueden sentirse diferentes aunque todo esté bien. Estos consejos ayudan a que tus ojos y tu cerebro se adapten más rápido.`,
      s: [
        ['Úsalos todo el día', `Póntelos en la mañana y no te los quites. La constancia es lo que entrena a tu cerebro.`],
        ['Mueve la cabeza, no solo los ojos', `Sobre todo con progresivos o graduaciones altas, voltea la cabeza hacia lo que quieres ver.`],
        ['Revisa que te queden bien', `Un armazón muy abajo o inclinado cambia cómo ves por la mica. Un pequeño ajuste en las plaquetas o las varillas ayuda.`],
        ['Cuidado con las escaleras los primeros días', `La profundidad puede sentirse un poco distinta al principio. Ve con calma en escaleras y banquetas.`],
      ],
      f: [
        ['¿Es normal ver borroso en las orillas?', 'Un poco al principio, sobre todo con progresivos. Mejora al aprender a ver por la zona correcta.'],
        ['¿Y si después de dos semanas sigo incómodo?', `Escríbenos. Revisamos tu pedido y, si hace falta, rehacemos tus micas dentro de la garantía de ${GARANTIA_DIAS} días.`],
      ],
    },
  },
];
