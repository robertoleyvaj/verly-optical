// Precios por componente — FUENTE ÚNICA: la usan la página del armazón (lo que ve el cliente),
// el checkout y la validación de cupones (lo que se cobra). Para cambiar un precio, cámbialo aquí.
// (La tabla `precios` de la base ya no se usa en Verly; GON sí la usa con sus propios precios.)
import type { SupabaseClient } from '@supabase/supabase-js';
import { descuentoPaquete } from './paquete';

// Precio del armazón con el descuento Verly aplicado (igual en cliente y servidor)
export function precioArmazonFinal(precio: number | null | undefined, descuentoVerly?: number | null): number {
  const p = Number(precio) || PRECIO_ARMAZON_BASE;
  return Math.round(p * (1 - (Number(descuentoVerly) || 0) / 100));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const PRECIO_ARMAZON_BASE = 13;
export const VISION_PRICES: Record<string, number> = { mono: 15, bi: 49, prog: 89 };
export const MATERIAL_PRICES: Record<string, number> = { cr39: 0, poly: 29, hd: 39, hi: 59, shi: 89 };
export const FILTRO_PRICES: Record<string, number> = { ar: 11, blue: 18, foto: 49, anti: 15, arprem: 24, pol: 70, tinte: 28 };

export type Desglose = {
  armazon: number;
  vision: number;
  material: number;
  filtros: Record<string, number>;   // id → precio
  paquete?: number;                  // descuento del paquete recomendado (ya restado en total)
  total: number;
};

// Desglosa el precio verificado de un item leyendo el precio real del armazón de la BD.
export async function desgloseItem(supabase: SupabaseClient, item: any): Promise<Desglose> {
  let armazon = PRECIO_ARMAZON_BASE;
  if (item.armazon_id) {
    const { data } = await supabase.from('armazones').select('precio, descuento_verly').eq('id', item.armazon_id).eq('activo', true).single();
    if (data) armazon = precioArmazonFinal(data.precio, data.descuento_verly);
  }
  if (item.solo_armazon) return { armazon, vision: 0, material: 0, filtros: {}, total: armazon };

  const vision = VISION_PRICES[item.lentes?.vision] ?? 0;
  const material = MATERIAL_PRICES[item.lentes?.material] ?? 0;
  const filtros: Record<string, number> = {};
  for (const f of (item.lentes?.filtros || [])) filtros[f] = FILTRO_PRICES[f] ?? 0;
  const totalFiltros = Object.values(filtros).reduce((s, x) => s + x, 0);
  // Paquete recomendado (10%): se recalcula aquí con la receta; si no coincide, no hay descuento
  const paquete = descuentoPaquete(item, { armazon, vision: VISION_PRICES, material: MATERIAL_PRICES, filtro: FILTRO_PRICES });
  const total = armazon + vision + material + totalFiltros - paquete;
  return { armazon, vision, material, filtros, paquete, total };
}

// Total verificado de todo el carrito.
export async function totalCarrito(supabase: SupabaseClient, items: any[]): Promise<{ total: number; desgloses: Desglose[] }> {
  const desgloses = await Promise.all(items.map(i => desgloseItem(supabase, i)));
  const total = desgloses.reduce((s, d) => s + d.total, 0);
  return { total, desgloses };
}
