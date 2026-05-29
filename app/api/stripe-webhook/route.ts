import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'Sin firma' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const csId = session.metadata?.checkout_session_id;
    if (!csId) return NextResponse.json({ received: true });

    // Obtener los items guardados
    const { data: cs } = await supabase
      .from('checkout_sessions')
      .select('*')
      .eq('id', parseInt(csId))
      .single();

    if (!cs || cs.status === 'completed') return NextResponse.json({ received: true });

    const items = cs.items_data;
    const email   = session.customer_details?.email || '';
    const nombre  = session.customer_details?.name  || '';
    const ship    = session.shipping_details?.address;
    const direccion = ship
      ? `${ship.line1}${ship.line2 ? ', ' + ship.line2 : ''}, ${ship.city}, ${ship.state} ${ship.postal_code}, ${ship.country}`
      : '';

    // Upsert cliente
    let clienteId: number | null = null;
    if (email) {
      const { data: existente } = await supabase.from('clientes').select('id').eq('email', email).maybeSingle();
      if (existente) {
        clienteId = existente.id;
        await supabase.from('clientes').update({ nombre: nombre || undefined, direccion: direccion || undefined }).eq('id', clienteId);
      } else {
        const { data: nuevo } = await supabase.from('clientes')
          .insert({ nombre, email, telefono: '', direccion })
          .select().single();
        if (nuevo) clienteId = nuevo.id;
      }
    }

    // Crear pedidos solo ahora que el pago se confirmó
    for (const item of items) {
      const descripcion = item.solo_armazon
        ? `${item.armazon_nombre} — Solo armazón`
        : [
            item.armazon_nombre,
            item.lentes?.vision_nombre   && `Visión: ${item.lentes.vision_nombre}`,
            item.lentes?.material_nombre && `Material: ${item.lentes.material_nombre}`,
            item.lentes?.filtros_nombres?.length > 0 && `Filtros: ${item.lentes.filtros_nombres.join(', ')}`,
            item.paciente && `Para: ${item.paciente}`,
          ].filter(Boolean).join(' · ');

      const configuracion = item.solo_armazon ? null : {
        vision:          item.lentes?.vision,
        vision_nombre:   item.lentes?.vision_nombre,
        vision_precio:   item.lentes?.vision_precio,
        material:        item.lentes?.material,
        material_nombre: item.lentes?.material_nombre,
        material_precio: item.lentes?.material_precio,
        filtros:         item.lentes?.filtros,
        filtros_nombres: item.lentes?.filtros_nombres,
        filtros_precio:  item.lentes?.filtros_precio,
        solo_armazon: false,
        tipo: item.tipo,
      };

      const { data: pedido } = await supabase.from('pedidos').insert({
        cliente_id:        clienteId,
        cliente_email:     email,
        armazon_id:        item.armazon_id,
        estado:            'pendiente',
        precio_venta:      item.precio_verificado,
        notas_cliente:     descripcion,
        notas_admin:       '',
        paciente:          item.paciente || null,
        configuracion,
        stripe_session_id: session.id,
      }).select().single();

      if (!pedido) continue;

      // Receta
      if (!item.solo_armazon && item.receta) {
        const recetaData: any = {
          pedido_id:  pedido.id,
          metodo:     item.receta.metodo,
          imagen_url: item.receta.foto_url || null,
          notas:      item.paciente || null,
        };
        if (item.receta.metodo === 'manual' && item.receta.datos) {
          const d = item.receta.datos;
          Object.assign(recetaData, {
            sph_od: d.sph_od, cyl_od: d.cyl_od, axis_od: d.axis_od,
            sph_os: d.sph_os, cyl_os: d.cyl_os, axis_os: d.axis_os,
            add_val: d.add, dp: d.dp, prisma: d.prisma || null,
          });
        }
        await supabase.from('recetas').insert(recetaData);
      }

      // Finanzas
      await supabase.from('finanzas').insert({
        pedido_id:         pedido.id,
        precio_venta:      item.precio_verificado,
        costo_armazon:     0,
        costo_laboratorio: 0,
        otros_costos:      0,
      });
    }

    // Marcar checkout_session como completada
    await supabase.from('checkout_sessions')
      .update({ status: 'completed' })
      .eq('id', parseInt(csId));
  }

  return NextResponse.json({ received: true });
}