// app/api/cron/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enviarEmailSeguimiento } from '../../lib/emails';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  // Verificar que viene de Vercel Cron
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Buscar emails programados pendientes
  const ahora = new Date().toISOString();
  const { data: pendientes } = await supabase
    .from('scheduled_emails')
    .select('*, pedidos(*, clientes(*))')
    .eq('sent', false)
    .lte('scheduled_for', ahora);

  if (!pendientes || pendientes.length === 0) {
    return NextResponse.json({ ok: true, enviados: 0 });
  }

  let enviados = 0;
  for (const scheduled of pendientes) {
    const pedido = scheduled.pedidos as any;
    const cliente_email = pedido?.clientes?.email || pedido?.cliente_email;
    const cliente_nombre = pedido?.clientes?.nombre || 'Cliente';

    if (!cliente_email) continue;

    if (scheduled.email_type === 'seguimiento_30') {
      await enviarEmailSeguimiento(scheduled.order_id, cliente_email, cliente_nombre);
      enviados++;
    }
  }

  return NextResponse.json({ ok: true, enviados });
}