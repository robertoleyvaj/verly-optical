// Helper seguro para el Meta Pixel (1001616152414051).
// No dispara si fbq aún no cargó (bloqueadores, SSR).
export type FbParams = Record<string, unknown>;

export function fbTrack(event: string, params?: FbParams) {
  if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq) {
    (window as unknown as { fbq: (...a: unknown[]) => void }).fbq('track', event, params || {});
  }
}
