import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PRECIO_ARMAZON_BASE = 13;
const VISION_PRICES: Record<string, number> = { mono: 15, bi: 49, prog: 89 };
const MATERIAL_PRICES: Record<string, number> = { cr39: 0, poly: 29, hd: 39, hi: 59, shi: 89 };
const FILTRO_PRICES: Record<string, number> = { ar: 11, blue: 18, foto: 49, anti: 15, arprem: 24, pol: 70, tinte: 28 };

async function calcularPrecioItem(item: any): Promise<number> {
  let precioArmazon = PRECIO_ARMAZON_BASE;
  if (item.armazon_id) {
    const { data } = await supabase.from('armazones').select('precio').eq('id', item.armazon_id).eq('activo', true).single();
    if (data) precioArmazon = data.precio;
  }
  if (item.es_regalo) precioArmazon = 0;
  if (item.solo_armazon) return precioArmazon;
  const precioVision   = VISION_PRICES[item.lentes?.vision]    ?? 0;
  const precioMaterial = MATERIAL_PRICES[item.lentes?.material] ?? 0;
  const precioFiltros  = (item.lentes?.filtros || []).reduce((s: number, f: string) => s + (FILTRO_PRICES[f] ?? 0), 0);
  return precioArmazon + precioVision + precioMaterial + precioFiltros;
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

    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0 || items.length > 10)
      return NextResponse.json({ error: 'Carrito inválido' }, { status: 400 });

    const totales = await Promise.all(items.map(calcularPrecioItem));
    const total = totales.reduce((s, t) => s + t, 0);
    if (total <= 0) return NextResponse.json({ error: 'Total inválido' }, { status: 400 });

    // Guardar items temporalmente — NO se crea pedido todavía
    const { data: cs, error: csError } = await supabase
      .from('checkout_sessions')
      .insert({
        items_data: items.map((item, i) => ({ ...item, precio_verificado: totales[i] })),
        total,
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      shipping_address_collection: { allowed_countries: ['US', 'MX', 'CA'] },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'Standard Shipping',
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_BASE_URL}/Tienda`,
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