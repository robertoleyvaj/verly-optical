// Precios por componente — fuente única para checkout y validación de cupones (SOLO servidor).
import type { SupabaseClient } from '@supabase/supabase-js';

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
  total: number;
};

// Desglosa el precio verificado de un item leyendo el precio real del armazón de la BD.
export async function desgloseItem(supabase: SupabaseClient, item: any): Promise<Desglose> {
  let armazon = PRECIO_ARMAZON_BASE;
  if (item.armazon_id) {
    const { data } = await supabase.from('armazones').select('precio, descuento_verly').eq('id', item.armazon_id).eq('activo', true).single();
    if (data) armazon = Math.round(data.precio * (1 - (data.descuento_verly || 0) / 100));
  }
  if (item.solo_armazon) return { armazon, vision: 0, material: 0, filtros: {}, total: armazon };

  const vision = VISION_PRICES[item.lentes?.vision] ?? 0;
  const material = MATERIAL_PRICES[item.lentes?.material] ?? 0;
  const filtros: Record<string, number> = {};
  for (const f of (item.lentes?.filtros || [])) filtros[f] = FILTRO_PRICES[f] ?? 0;
  const totalFiltros = Object.values(filtros).reduce((s, x) => s + x, 0);
  const total = armazon + vision + material + totalFiltros;
  return { armazon, vision, material, filtros, total };
}

// Total verificado de todo el carrito.
export async function totalCarrito(supabase: SupabaseClient, items: any[]): Promise<{ total: number; desgloses: Desglose[] }> {
  const desgloses = await Promise.all(items.map(i => desgloseItem(supabase, i)));
  const total = desgloses.reduce((s, d) => s + d.total, 0);
  return { total, desgloses };
}
