// Colores de armazón: circulito (swatch) y nombre en el idioma de la página.
// El color se captura en OptiOS en español y en mayúsculas ("NEGRO MATE", "CAREY").
// Si en OptiOS se eligió el color del circulito (hex), se usa ese; si no, se adivina por el nombre.

const SWATCH: [string, string][] = [
  ['NEGR', '#1d1d1d'], ['BLANC', '#e8e8e8'], ['AZUL', '#2f4a8c'], ['ROJO', '#a83232'], ['ROSA', '#d46a90'],
  ['VERDE', '#3a7d4d'], ['GRIS', '#8a8a8a'], ['CAFE', '#5a3a1e'], ['CAFÉ', '#5a3a1e'], ['CAREY', '#6b4423'],
  ['DORAD', '#c9a227'], ['PLATE', '#b8b8b8'], ['MORAD', '#6a3d9a'], ['LILA', '#b39ddb'], ['NARANJ', '#e07b2f'],
  ['VINO', '#722f37'], ['AMARIL', '#e6c229'], ['TRANSP', '#d8e4e8'], ['CRISTAL', '#d8e4e8'], ['BRONCE', '#8c6239'],
  ['GUINDA', '#722f37'], ['NUDE', '#d9b8a0'], ['MIEL', '#c58a3e'], ['BEIGE', '#d8c3a5'], ['ORO', '#c9a227'],
]

export function swatchColor(nombre: string | null | undefined, hex?: string | null): string {
  if (hex && /^#[0-9a-f]{6}$/i.test(hex)) return hex
  const s = (nombre || '').toUpperCase()
  for (const [k, v] of SWATCH) if (s.includes(k)) return v
  return '#b0b0b0'
}

// Palabras que se traducen al inglés (el resto se deja tal cual)
const EN: Record<string, string> = {
  NEGRO: 'Black', NEGRA: 'Black', BLANCO: 'White', BLANCA: 'White', AZUL: 'Blue', ROJO: 'Red', ROJA: 'Red',
  ROSA: 'Pink', VERDE: 'Green', GRIS: 'Gray', CAFE: 'Brown', 'CAFÉ': 'Brown', CAREY: 'Tortoise',
  DORADO: 'Gold', DORADA: 'Gold', ORO: 'Gold', PLATEADO: 'Silver', PLATEADA: 'Silver', PLATA: 'Silver',
  MORADO: 'Purple', MORADA: 'Purple', LILA: 'Lilac', NARANJA: 'Orange', VINO: 'Wine', GUINDA: 'Burgundy',
  AMARILLO: 'Yellow', TRANSPARENTE: 'Clear', CRISTAL: 'Crystal', BRONCE: 'Bronze', MIEL: 'Honey',
  MATE: 'Matte', BRILLANTE: 'Glossy', OSCURO: 'Dark', CLARO: 'Light', CON: 'with', Y: '&',
  UNICO: 'One color', 'ÚNICO': 'One color', AZULES: 'Blue', NUDE: 'Nude', BEIGE: 'Beige',
}

const titulo = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()

export function nombreColor(nombre: string | null | undefined, lang: string): string {
  const s = (nombre || '').trim()
  if (!s) return ''
  const palabras = s.split(/\s+/)
  if (lang === 'es') return palabras.map(titulo).join(' ')
  // En inglés el adjetivo va antes: "NEGRO MATE" → "Matte Black"
  const tr = palabras.map(p => EN[p.toUpperCase()] ?? titulo(p))
  const adj = new Set(['Matte', 'Glossy', 'Dark', 'Light'])
  const adjs = tr.filter(w => adj.has(w)), resto = tr.filter(w => !adj.has(w))
  return [...adjs, ...resto].join(' ')
}
