import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { validarCupon } from '../../lib/cupones';
import { costoEnvio } from '../../lib/envio';
import { desgloseItem } from '../../lib/precios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Precios: una sola fuente (app/lib/precios.ts), la misma que usa la página del armazón
async function calcularPrecioItem(item: any): Promise<number> {
  return (await desgloseItem(supabase, item)).total;
}

const attempts = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const r = attempts.get(ip);
  if (!r || now > r.resetAt) { attempts.set(ip, { count: 1, resetAt: now + 60000 }); return false; }
  if (r.count >= 5) return true;
  r.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (isRateLimited(ip)) return NextResponse.json({ error: 'Demasiados intentos.' }, { status: 429 });

    const { items, embedded, codigo } = await req.json();
    if (!Array.isArray(items) || items.length === 0 || items.length > 10)
      return NextResponse.json({ error: 'Carrito inválido' }, { status: 400 });

    const totales = await Promise.all(items.map(calcularPrecioItem));
    const totalBruto = totales.reduce((s, t) => s + t, 0);
    if (totalBruto <= 0) return NextResponse.json({ error: 'Total inválido' }, { status: 400 });

    // Cupón: se revalida SIEMPRE en el servidor (no se confía en el carrito)
    let total = totalBruto;
    let cuponId: string | null = null;
    let cuponCodigo: string | null = null;
    let cuponDescuento = 0;
    if (codigo) {
      const res = await validarCupon(supabase, codigo, items);
      if (!res.ok) return NextResponse.json({ error: res.motivo || 'Código no válido' }, { status: 400 });
      total = res.totalFinal;
      cuponId = res.cuponId ?? null;
      cuponCodigo = res.codigo ?? null;
      cuponDescuento = res.descuento;
      // Fase 1: no soportamos cobro de $0 por Stripe (cortesías 100% se hacen internas)
      if (total <= 0) return NextResponse.json({ error: 'Este código deja el total en $0. Contáctanos para completar tu pedido de cortesía.' }, { status: 400 });
    }

    // Guardar items temporalmente — NO se crea pedido todavía
    const { data: cs, error: csError } = await supabase
      .from('checkout_sessions')
      .insert({
        items_data: items.map((item, i) => ({ ...item, precio_verificado: totales[i] })),
        total,
        cupon_id: cuponId,
        cupon_codigo: cuponCodigo,
        cupon_descuento: cuponDescuento,
        status: 'pending',
      })
      .select()
      .single();

    if (csError || !cs) {
      console.error('Error saving checkout session:', csError);
      return NextResponse.json({ error: 'Error al procesar.' }, { status: 500 });
    }

    const descripcion = items.map((item: any) =>
      item.solo_armazon
        ? `${item.armazon_nombre} (solo armazón)`
        : `${item.armazon_nombre}${item.paciente ? ` — ${item.paciente}` : ''}`
    ).join(', ');

    // URL base según el ORIGEN real de la petición: en localhost = http://localhost:3000,
    // en producción = https://verlyoptical.com. No depende de variables de entorno.
    const envBase = process.env.NEXT_PUBLIC_BASE_URL;
    const envBaseOk = envBase ? (/^https?:\/\//.test(envBase) ? envBase : `https://${envBase}`) : '';
    const BASE = req.headers.get('origin') || req.nextUrl.origin || envBaseOk || 'https://verlyoptical.com';

    // Parámetros compartidos entre el checkout embebido y el hospedado.
    // Envío: solo EE.UU.; gratis desde $70 (sobre el total ya con descuento), si no $9.95
    const envio = costoEnvio(total);
    const baseParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      shipping_address_collection: { allowed_countries: ['US'] },
      // Teléfono opcional (phone_number_collection de Stripe siempre es obligatorio, por eso campo propio)
      custom_fields: [{
        key: 'telefono',
        label: { type: 'custom', custom: 'Phone (optional)' },
        type: 'numeric',
        optional: true,
        numeric: { minimum_length: 10, maximum_length: 15 },
      }],
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: Math.round(envio * 100), currency: 'usd' },
          display_name: envio === 0 ? 'Free Standard Shipping' : 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 10 },
          },
        },
      }],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Verly Optical — Lentes personalizados', description: descripcion },
          unit_amount: Math.round(total * 100),
        },
        quantity: 1,
      }],
      metadata: { checkout_session_id: cs.id.toString() },
    };

    // Modo EMBEBIDO: el pago se muestra dentro de Verly. Devuelve client_secret.
    if (embedded) {
      const session = await stripe.checkout.sessions.create({
        ...baseParams,
        ui_mode: 'embedded_page',
        return_url: `${BASE}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      } as unknown as Stripe.Checkout.SessionCreateParams);
      await supabase.from('checkout_sessions').update({ stripe_session_id: session.id }).eq('id', cs.id);
      const clientSecret = (session as unknown as { client_secret: string | null }).client_secret;
      return NextResponse.json({ clientSecret });
    }

    // Modo hospedado (fallback): redirige a Stripe.
    const session = await stripe.checkout.sessions.create({
      ...baseParams,
      success_url: `${BASE}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${BASE}/Tienda`,
    });
    await supabase.from('checkout_sessions')
      .update({ stripe_session_id: session.id })
      .eq('id', cs.id);
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Error procesando el pedido.' }, { status: 500 });
  }
}