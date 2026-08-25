import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../lib/stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Valida contra Stripe que la sesión realmente se pagó, antes de disparar Purchase.
// GET ?session_id=cs_...  (id de la Checkout Session de Stripe)
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    if (!sessionId) return NextResponse.json({ paid: false, error: 'Falta session_id' }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ paid: false });
    }

    // content_ids desde nuestra checkout_session (armazones del pedido)
    let content_ids: string[] = [];
    const csId = session.metadata?.checkout_session_id;
    if (csId) {
      const { data } = await sb.from('checkout_sessions').select('items_data').eq('id', csId).maybeSingle();
      const itemsData = (data?.items_data as Array<{ armazon_id?: string | number }> | null) || [];
      content_ids = itemsData.map(i => String(i.armazon_id)).filter(v => v && v !== 'undefined');
    }

    return NextResponse.json({
      paid: true,
      value: (session.amount_total ?? 0) / 100,
      currency: (session.currency || 'usd').toUpperCase(),
      content_ids,
      order_id: sessionId,
    });
  } catch (e) {
    return NextResponse.json({ paid: false, error: e instanceof Error ? e.message : 'error' }, { status: 500 });
  }
}
