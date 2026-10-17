// Guías (contenido para Google y asistentes de IA). Cada guía existe en inglés (/guides/...) y español (/es/guias/...).
export type Doc = {
  t: string;            // título (h1 y <title>)
  d: string;            // descripción corta (meta description, ~150 caracteres)
  i: string;            // introducción
  s: [string, string][]; // secciones: [subtítulo, texto]. Párrafos separados con \n\n
  f: [string, string][]; // preguntas frecuentes: [pregunta, respuesta]
};
export type Cat = 'comprar' | 'receta' | 'vision' | 'micas' | 'armazones' | 'cuidado';
export type Guia = {
  slug: string;    // inglés
  slugEs: string;  // español
  cat: Cat;
  cta: string;     // a dónde manda el botón final (ruta de la tienda)
  en: Doc;
  es: Doc;
};

export const CATS: Record<Cat, { en: string; es: string }> = {
  comprar: { en: 'Buying glasses', es: 'Comprar lentes' },
  receta: { en: 'Your prescription', es: 'Tu receta' },
  vision: { en: 'Vision and eye comfort', es: 'Visión y comodidad' },
  micas: { en: 'Lenses and coatings', es: 'Micas y filtros' },
  armazones: { en: 'Frames and fit', es: 'Armazones y talla' },
  cuidado: { en: 'Care and maintenance', es: 'Cuidado' },
};
