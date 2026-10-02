// Datos del armazón para la web — mismas claves que OptiOS (src/lib/armazon-web.ts).
// Normaliza también los armazones viejos (texto libre) para que los filtros funcionen con ambos.

export const GENEROS = [
  { v: 'hombre', es: 'Hombre', en: 'Men' },
  { v: 'mujer', es: 'Mujer', en: 'Women' },
  { v: 'unisex', es: 'Unisex', en: 'Unisex' },
  { v: 'nino', es: 'Niños', en: 'Kids' },
] as const

export const FORMAS = [
  { v: 'rectangle', es: 'Rectangular', en: 'Rectangle' },
  { v: 'square', es: 'Cuadrado', en: 'Square' },
  { v: 'round', es: 'Redondo', en: 'Round' },
  { v: 'oval', es: 'Ovalado', en: 'Oval' },
  { v: 'aviator', es: 'Aviador', en: 'Aviator' },
  { v: 'cat-eye', es: 'Cat-eye', en: 'Cat-eye' },
  { v: 'hexagonal', es: 'Hexagonal', en: 'Hexagonal' },
] as const

export const AROS = [
  { v: 'completo', es: 'Completo', en: 'Full-rim' },
  { v: 'ranurado', es: 'Ranurado', en: 'Semi-rimless' },
  { v: 'tres_piezas', es: 'Tres piezas', en: 'Rimless' },
] as const

export const TALLAS = [
  { v: 'S', es: 'Chica', en: 'Small' },
  { v: 'M', es: 'Mediana', en: 'Medium' },
  { v: 'L', es: 'Grande', en: 'Large' },
  { v: 'XL', es: 'Extra grande', en: 'Extra large' },
] as const

// Familias de color para filtrar (un armazón puede estar en varias)
export const FAMILIAS = [
  { v: 'negro', es: 'Negro', en: 'Black', hex: '#1d1d1d', claves: ['NEGR'] },
  { v: 'carey', es: 'Carey', en: 'Tortoise', hex: '#6b4423', claves: ['CAREY', 'TORT', 'JASPE'] },
  { v: 'cafe', es: 'Café', en: 'Brown', hex: '#5a3a1e', claves: ['CAFE', 'MIEL', 'BRONCE'] },
  { v: 'gris', es: 'Gris', en: 'Gray', hex: '#8a8a8a', claves: ['GRIS', 'PLOMO'] },
  { v: 'transparente', es: 'Transparente', en: 'Clear', hex: '#dfe7ea', claves: ['TRANSP', 'CRISTAL', 'TRASLUC'] },
  { v: 'dorado', es: 'Dorado', en: 'Gold', hex: '#c9a227', claves: ['DORAD', 'ORO'] },
  { v: 'plateado', es: 'Plateado', en: 'Silver', hex: '#b8b8b8', claves: ['PLATE', 'PLATA'] },
  { v: 'azul', es: 'Azul', en: 'Blue', hex: '#2f4a8c', claves: ['AZUL', 'MARINO'] },
  { v: 'rojo', es: 'Rojo y vino', en: 'Red', hex: '#8f2a35', claves: ['ROJO', 'VINO', 'GUINDA'] },
  { v: 'rosa', es: 'Rosa', en: 'Pink', hex: '#d98ea6', claves: ['ROSA', 'NUDE'] },
  { v: 'verde', es: 'Verde', en: 'Green', hex: '#4e6b4a', claves: ['VERDE'] },
  { v: 'morado', es: 'Morado', en: 'Purple', hex: '#6a3d9a', claves: ['MORAD', 'LILA'] },
  { v: 'blanco', es: 'Blanco', en: 'White', hex: '#f1f1f1', claves: ['BLANC'] },
] as const

const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()

export function familiasDeColor(nombre: string | null | undefined): string[] {
  const s = sinAcentos(nombre || '')
  // Solo cuenta lo que va antes de "VARILLA" (la varilla no define el color principal)
  const principal = s.split(' VARILLA')[0]
  return FAMILIAS.filter(f => f.claves.some(k => principal.includes(k))).map(f => f.v)
}

export function normForma(f: string | null | undefined): string | null {
  const s = sinAcentos(f || '')
  if (!s) return null
  if (s.includes('RECT')) return 'rectangle'
  if (s.includes('CUAD') || s.includes('SQUARE')) return 'square'
  if (s.includes('REDOND') || s.includes('ROUND') || s.includes('CIRC')) return 'round'
  if (s.includes('OVAL')) return 'oval'
  if (s.includes('AVIA')) return 'aviator'
  if (s.includes('CAT') || s.includes('GATO')) return 'cat-eye'
  if (s.includes('HEX')) return 'hexagonal'
  return null
}

// Talla por ancho total ≈ 2 × mica + puente + 10 mm (S < 130 · M 130–139 · L 140–145 · XL ≥ 146)
export function tallaDeMedidas(medidas: string | null | undefined): { mica: number; puente: number; total: number; talla: 'S' | 'M' | 'L' | 'XL' } | null {
  const nums = String(medidas ?? '').match(/\d{2,3}/g)?.map(Number) ?? []
  const mica = nums[0], puente = nums[1]
  if (!mica || !puente || mica < 35 || mica > 70 || puente < 10 || puente > 30) return null
  const total = 2 * mica + puente + 10
  const talla = total < 130 ? 'S' : total < 140 ? 'M' : total < 146 ? 'L' : 'XL'
  return { mica, puente, total, talla }
}

export const etiqueta = <T extends { v: string; es: string; en: string }>(lista: readonly T[], v: string | null | undefined, lang: string) => {
  const x = lista.find(i => i.v === v)
  return x ? (lang === 'es' ? x.es : x.en) : ''
}
