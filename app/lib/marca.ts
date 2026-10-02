// Datos de la marca en un solo lugar (contacto, garantías, tiempos).
// Si algo cambia (correo, WhatsApp, días de garantía), se cambia aquí y se actualiza toda la página.

export const SOPORTE_EMAIL = 'support@verlyoptical.com'
// WhatsApp de atención: con lada internacional, solo números (ej. '16195551234'). Vacío = no se muestra.
export const WHATSAPP = ''
export const HORARIO = { es: 'Lunes a sábado, 9 a.m. a 6 p.m. (hora del Pacífico)', en: 'Monday to Saturday, 9 a.m. to 6 p.m. (Pacific Time)' }

export const GARANTIA_DIAS = 30        // rehacer micas gratis si la graduación no queda
export const DEVOLUCION_DIAS = 30      // reembolso completo

// Tiempos: hacemos las micas y luego se envían (días hábiles)
export const DIAS_FABRICACION = { min: 3, max: 5 }
export const DIAS_ENVIO = { min: 5, max: 10 }

// Fecha estimada de entrega (suma días hábiles a hoy)
export function entregaEstimada(lang: string, hoy = new Date()): string {
  const suma = (d: Date, n: number) => { const x = new Date(d); let k = 0; while (k < n) { x.setDate(x.getDate() + 1); const w = x.getDay(); if (w !== 0 && w !== 6) k++ } return x }
  const a = suma(hoy, DIAS_FABRICACION.min + DIAS_ENVIO.min), b = suma(hoy, DIAS_FABRICACION.max + DIAS_ENVIO.max)
  const f = (d: Date) => d.toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { month: 'short', day: 'numeric' })
  return `${f(a)} – ${f(b)}`
}

export const whatsappLink = (texto = '') =>
  WHATSAPP ? `https://wa.me/${WHATSAPP}${texto ? `?text=${encodeURIComponent(texto)}` : ''}` : ''
