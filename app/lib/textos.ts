// Textos que vienen de la base en español (OptiOS) y se muestran según el idioma.

const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim();

// Material: clave normalizada → { es, en }
const MATERIAL: Record<string, { es: string; en: string }> = {
  ACETATO: { es: 'Acetato', en: 'Acetate' },
  PASTA: { es: 'Acetato', en: 'Acetate' },
  METALICO: { es: 'Metálico', en: 'Metal' },
  METAL: { es: 'Metálico', en: 'Metal' },
  'TR-90': { es: 'TR-90', en: 'TR-90' },
  TR90: { es: 'TR-90', en: 'TR-90' },
  TITANIO: { es: 'Titanio', en: 'Titanium' },
  MIXTO: { es: 'Mixto', en: 'Mixed' },
  'TRES PIEZAS': { es: 'Tres piezas', en: 'Rimless' },
  'AL AIRE': { es: 'Al aire', en: 'Semi-rimless' },
  PLASTICO: { es: 'Plástico', en: 'Plastic' },
}

// Clave común para filtrar sin importar mayúsculas/acentos/idioma ("METÁLICO" = "Metálico" = "Metal")
export function claveMaterial(m: string | null | undefined): string {
  const k = sinAcentos(m || '');
  const hit = MATERIAL[k];
  return hit ? hit.en.toUpperCase() : k;
}

export function nombreMaterial(m: string | null | undefined, lang: string): string {
  const k = sinAcentos(m || '');
  if (!k) return '';
  const hit = MATERIAL[k];
  if (hit) return lang === 'es' ? hit.es : hit.en;
  return (m || '').charAt(0).toUpperCase() + (m || '').slice(1).toLowerCase();
}

const BADGE: Record<string, { es: string; en: string }> = {
  NUEVO: { es: 'Nuevo', en: 'New' }, NEW: { es: 'Nuevo', en: 'New' },
  OFERTA: { es: 'Oferta', en: 'Sale' }, SALE: { es: 'Oferta', en: 'Sale' },
  'MAS VENDIDO': { es: 'Más vendido', en: 'Best seller' }, 'BEST SELLER': { es: 'Más vendido', en: 'Best seller' },
  AGOTADO: { es: 'Agotado', en: 'Sold out' }, POPULAR: { es: 'Popular', en: 'Popular' },
}

export function nombreBadge(b: string | null | undefined, lang: string): string {
  const k = sinAcentos(b || '');
  const hit = BADGE[k];
  return hit ? (lang === 'es' ? hit.es : hit.en) : (b || '');
}
