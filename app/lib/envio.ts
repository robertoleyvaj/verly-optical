// Regla de envío de Verly (una sola fuente para carrito, checkout y textos).
// Solo Estados Unidos. Gratis desde $70 (total después de descuento); abajo, tarifa fija.
export const ENVIO_GRATIS_DESDE = 70;
export const ENVIO_COSTO = 9.95;

export function costoEnvio(total: number): number {
  return total >= ENVIO_GRATIS_DESDE ? 0 : ENVIO_COSTO;
}

// Cuánto le falta al cliente para el envío gratis (0 si ya lo tiene)
export function faltaParaGratis(total: number): number {
  return Math.max(0, Math.round((ENVIO_GRATIS_DESDE - total) * 100) / 100);
}
