// Validación y cálculo de cupones (SOLO servidor). Nunca confiar en el cliente para el descuento.
import type { SupabaseClient } from '@supabase/supabase-js';
import { totalCarrito } from './precios';

/* eslint-disable @typescript-eslint/no-explicit-any */
const r2 = (n: number) => Math.round(n * 100) / 100;
const hoyTij = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Tijuana' });

const OBJ_LABEL: Record<string, string> = {
  armazon: 'armazón', ar: 'AR', arprem: 'AR premium', blue: 'filtro azul',
  foto: 'fotocromático', pol: 'polarizado', tinte: 'tinte', anti: 'antiempañante',
};

export type ResultadoCupon = {
  ok: boolean;
  motivo?: string;
  cuponId?: string;
  codigo?: string;
  tipo?: string;
  descuento: number;
  totalOriginal: number;
  totalFinal: number;
  etiqueta?: string;   // texto para mostrar en el carrito
};

export async function validarCupon(supabase: SupabaseClient, codigoRaw: string, items: any[]): Promise<ResultadoCupon> {
  const vacio = { ok: false, descuento: 0, totalOriginal: 0, totalFinal: 0 };
  const codigo = String(codigoRaw || '').trim().toUpperCase();
  if (!codigo) return { ...vacio, motivo: 'Escribe un código' };
  if (!Array.isArray(items) || items.length === 0) return { ...vacio, motivo: 'Carrito vacío' };

  const { data: cupon } = await supabase.from('cupones').select('*').eq('codigo', codigo).maybeSingle();
  if (!cupon || !cupon.activo) return { ...vacio, motivo: 'Código no válido' };

  const hoy = hoyTij();
  if (cupon.vigencia_desde && hoy < cupon.vigencia_desde) return { ...vacio, motivo: 'Este código aún no está vigente' };
  if (cupon.vigencia_hasta && hoy > cupon.vigencia_hasta) return { ...vacio, motivo: 'Este código ya expiró' };
  if (cupon.usos_max != null && cupon.usos >= cupon.usos_max) return { ...vacio, motivo: 'Este código ya no está disponible' };

  const { total, desgloses } = await totalCarrito(supabase, items);
  if (total <= 0) return { ...vacio, totalOriginal: total, totalFinal: total, motivo: 'Carrito sin importe' };
  if (cupon.compra_minima && total < Number(cupon.compra_minima))
    return { ...vacio, totalOriginal: total, totalFinal: total, motivo: `Compra mínima de $${cupon.compra_minima} USD` };

  let descuento = 0;
  if (cupon.tipo === 'porcentaje') {
    descuento = r2(total * (Number(cupon.valor) || 0) / 100);
  } else if (cupon.tipo === 'monto') {
    descuento = Math.min(Number(cupon.valor) || 0, total);
  } else if (cupon.tipo === 'componente') {
    const obj = cupon.objetivo;
    descuento = r2(desgloses.reduce((s, d) => s + (obj === 'armazon' ? d.armazon : (d.filtros[obj] || 0)), 0));
    if (descuento <= 0) return { ...vacio, totalOriginal: total, totalFinal: total, motivo: `El código aplica a lentes con ${OBJ_LABEL[obj] || obj}` };
  } else {
    return { ...vacio, totalOriginal: total, totalFinal: total, motivo: 'Código no válido' };
  }

  descuento = r2(Math.min(descuento, total));
  const totalFinal = r2(total - descuento);
  const etiqueta = cupon.tipo === 'componente'
    ? `${OBJ_LABEL[cupon.objetivo] || cupon.objetivo} gratis`
    : cupon.tipo === 'porcentaje' ? `${cupon.valor}% de descuento` : `$${cupon.valor} de descuento`;

  return { ok: true, cuponId: cupon.id, codigo, tipo: cupon.tipo, descuento, totalOriginal: total, totalFinal, etiqueta };
}
