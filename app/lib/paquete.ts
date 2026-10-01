// Paquete recomendado por Verly según la receta (con 10% de descuento).
// FUENTE ÚNICA: la usa la página (lo que ve el cliente) y el checkout (lo que se cobra).
// El servidor recalcula la recomendación con la misma receta: si lo que trae el carrito
// coincide, aplica el descuento; si no, cobra precio normal. Nadie lo activa a mano.

export const PAQUETE_DESCUENTO = 0.10;

type RecetaLike = { sph_od?: number | null; sph_os?: number | null; cyl_od?: number | null; cyl_os?: number | null; add?: number | null };

export type Recomendacion = {
  vision: 'mono' | 'prog';
  material: 'poly' | 'hi' | 'shi';
  filtro: 'arprem' | 'foto';
  tipo: 'presbicia' | 'astig_alto' | 'astig' | 'muy_alta' | 'alta' | 'moderada';
};

export function recomendarPaquete(r: RecetaLike | null | undefined): Recomendacion | null {
  if (!r) return null;
  const n = (v: unknown) => Number(v) || 0;
  const sph_od = n(r.sph_od), sph_os = n(r.sph_os), cyl_od = n(r.cyl_od), cyl_os = n(r.cyl_os), add = n(r.add);
  if (r.sph_od == null && r.sph_os == null) return null;
  const eq = Math.max(Math.abs(sph_od + cyl_od / 2), Math.abs(sph_os + cyl_os / 2));
  const cyl = Math.max(Math.abs(cyl_od), Math.abs(cyl_os));
  const astigmatismo = cyl >= 0.75;
  const vision = add > 0 ? 'prog' : 'mono';
  const material = eq > 4.0 ? 'shi' : eq > 2.0 ? 'hi' : 'poly';
  const filtro = astigmatismo || add > 0 ? 'arprem' : 'foto';
  const tipo = add > 0 ? 'presbicia' : cyl >= 1.5 ? 'astig_alto' : astigmatismo ? 'astig' : eq > 4.0 ? 'muy_alta' : eq > 2.0 ? 'alta' : 'moderada';
  return { vision, material, filtro, tipo };
}

// Descuento del paquete para un item del carrito (0 si no aplica).
// Aplica sobre armazón + visión + material + filtro recomendado; los extras van a precio normal.
export function descuentoPaquete(
  item: { paquete?: boolean; solo_armazon?: boolean; receta?: { metodo?: string; datos?: RecetaLike } | null; lentes?: { vision?: string; material?: string; filtros?: string[] } | null },
  precios: { armazon: number; vision: Record<string, number>; material: Record<string, number>; filtro: Record<string, number> },
): number {
  if (!item?.paquete || item.solo_armazon || item.receta?.metodo !== 'manual') return 0;
  const rec = recomendarPaquete(item.receta?.datos);
  const l = item.lentes;
  if (!rec || !l) return 0;
  if (l.vision !== rec.vision || l.material !== rec.material || !(l.filtros || []).includes(rec.filtro)) return 0;
  const base = precios.armazon + (precios.vision[rec.vision] ?? 0) + (precios.material[rec.material] ?? 0) + (precios.filtro[rec.filtro] ?? 0);
  return Math.round(base * PAQUETE_DESCUENTO);
}
