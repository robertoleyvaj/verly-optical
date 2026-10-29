import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { enviarEmailCompraPedido, type LineaCompra } from '../../lib/emails';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Descuenta 1 pieza del color vendido en el inventario de OptiOS (misma base de datos).
// Sale de la primera ubicación con piezas: bodega → Baja Visión → 5 de Mayo → Plaza Laureles.
// Usa inv_mover, que deja el movimiento en la bitácora con el número de pedido.
// Nunca tumba el pedido: si algo falla, regresa un aviso para dejarlo en las notas.
const UBIC_WEB: [string, string, string][] = [
  ['bodega', 'bodega', 'Bodega'],
  ['baja', 'stock_baja', 'Baja Visión'],
  ['mayo', 'stock_mayo', '5 de Mayo'],
  ['plaza', 'stock_plaza', 'Plaza Laureles'],
];
async function descontarInventario(colorId: number | null, sku: string | null, referencia: string): Promise<string> {
  try {
    if (!colorId && !sku) return '⚠ Inventario: el pedido no trae color, descuéntalo a mano.';
    const q = supabase.from('armazon_colores').select('id, sku, bodega, stock_baja, stock_mayo, stock_plaza');
    const { data: c } = colorId ? await q.eq('id', colorId).maybeSingle() : await q.eq('sku', String(sku).toUpperCase()).maybeSingle();
    if (!c) return `⚠ Inventario: no encontré el color ${sku ?? colorId}, descuéntalo a mano.`;
    const fila = c as Record<string, any>;
    const ub = UBIC_WEB.find(([, col]) => Number(fila[col] ?? 0) > 0);
    if (!ub) return `⚠ Inventario: ${fila.sku} no tiene piezas en ninguna ubicación, revísalo.`;
    const { error } = await supabase.rpc('inv_mover', {
      p_color_id: fila.id, p_ubicacion: ub[0], p_cantidad: -1, p_tipo: 'venta',
      p_referencia: referencia, p_usuario: 'Verly (web)', p_notas: 'Venta en verlyoptical.com',
    });
    if (error) return `⚠ Inventario: no se pudo descontar ${fila.sku} (${error.message}).`;
    return `Inventario: −1 ${fila.sku} de ${ub[2]}.`;
  } catch (e: any) {
    return `⚠ Inventario: error al descontar (${e?.message ?? 'desconocido'}).`;
  }
}

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
    // Los pagos de gonmx.com usan la misma cuenta de Stripe: esos los procesa gonmx, no Verly
    if (session.metadata?.tienda === 'gon') return NextResponse.json({ received: true });

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
    // Teléfono opcional (campo propio del checkout) o el que Stripe tenga del cliente
    const telCampo = (session.custom_fields || []).find(f => f.key === 'telefono')?.numeric?.value || '';
    const telefono = String(telCampo || session.customer_details?.phone || '').trim();
    // En las versiones nuevas de la API de Stripe la dirección vive en collected_information.shipping_details
    const ses = session as any;
    const envio = ses.collected_information?.shipping_details || ses.shipping_details || ses.shipping || null;
    const ship  = envio?.address || session.customer_details?.address || null;
    const nombreEnvio = envio?.name ? String(envio.name) : '';
    const direccion = ship
      ? `${nombreEnvio ? nombreEnvio + ' — ' : ''}${ship.line1}${ship.line2 ? ', ' + ship.line2 : ''}, ${ship.city}, ${ship.state} ${ship.postal_code}, ${ship.country}`
      : '';

    // Upsert cliente
    let clienteId: number | null = null;
    if (email) {
      const { data: existente } = await supabase.from('clientes').select('id').eq('email', email).maybeSingle();
      if (existente) {
        clienteId = existente.id;
        await supabase.from('clientes').update({ nombre: nombre || undefined, direccion: direccion || undefined, telefono: telefono || undefined }).eq('id', clienteId);
      } else {
        const { data: nuevo } = await supabase.from('clientes')
          .insert({ nombre, email, telefono, direccion })
          .select().single();
        if (nuevo) clienteId = nuevo.id;
      }
    }

    // Crear pedidos solo ahora que el pago se confirmó
    const lineasCorreo: LineaCompra[] = [];
    for (const item of items) {
      const color = item.armazon_color?.nombre ? String(item.armazon_color.nombre) : '';
      const nombreArmazon = color ? `${item.armazon_nombre} (${color})` : item.armazon_nombre;
      const descripcion = item.solo_armazon
        ? `${nombreArmazon} — Solo armazón`
        : [
            nombreArmazon,
            item.lentes?.vision_nombre   && `Visión: ${item.lentes.vision_nombre}`,
            item.lentes?.material_nombre && `Material: ${item.lentes.material_nombre}`,
            item.lentes?.filtros_nombres?.length > 0 && `Filtros: ${item.lentes.filtros_nombres.join(', ')}`,
            item.paciente && `Para: ${item.paciente}`,
            item.paquete && 'Paquete recomendado −10%',
          ].filter(Boolean).join(' · ');

      // Color del armazón: nombre y SKU exacto (para el laboratorio y para descontar inventario)
      const colorCfg = item.armazon_color ? {
        color_armazon:    item.armazon_color.nombre ?? null,
        color_sku:        item.armazon_color.sku ?? null,
        color_id:         item.armazon_color.id ?? null,
      } : {};
      const configuracion = item.solo_armazon
        ? (item.armazon_color ? { solo_armazon: true, tipo: item.tipo, ...colorCfg } : null)
        : {
        ...colorCfg,
        filtros_colores: item.lentes?.filtros_colores ?? null,
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

      // Descontar el armazón vendido del inventario y dejar el resultado en las notas internas
      const avisoInv = await descontarInventario(
        item.armazon_color?.id ? Number(item.armazon_color.id) : null,
        item.armazon_color?.sku ?? null,
        `VRL-${2846 + Number(pedido.id)}`,
      );
      await supabase.from('pedidos').update({ notas_admin: avisoInv }).eq('id', pedido.id);

      lineasCorreo.push({
        order_id: pedido.id,
        armazon:  item.armazon_nombre,
        color:    item.armazon_color?.nombre_en || item.armazon_color?.nombre || null,
        lentes:   item.solo_armazon ? 'Frame only' : [
          item.lentes?.vision_nombre, item.lentes?.material_nombre,
          ...(item.lentes?.filtros_nombres || []),
        ].filter(Boolean).join(' · '),
        paciente: item.paciente || null,
        precio:   item.precio_verificado,
      });

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

    // Registrar el canje del cupón (si se aplicó) y subir el contador de usos
    if (cs.cupon_id) {
      await supabase.from('cupones_canjes').insert({
        cupon_id: cs.cupon_id, codigo: cs.cupon_codigo,
        checkout_session_id: cs.id, monto_descuento: cs.cupon_descuento, cliente: email || '',
      });
      const { data: cup } = await supabase.from('cupones').select('usos').eq('id', cs.cupon_id).single();
      await supabase.from('cupones').update({ usos: (cup?.usos || 0) + 1 }).eq('id', cs.cupon_id);
    }

    // Marcar checkout_session como completada
    await supabase.from('checkout_sessions')
      .update({ status: 'completed' })
      .eq('id', parseInt(csId));

    // Correo de confirmación al cliente (+ aviso interno si está configurado).
    // Va al final y con try: un problema con el correo nunca debe tumbar el pedido.
    try {
      const total = session.amount_total != null ? session.amount_total / 100 : Number(cs.total) || 0;
      await enviarEmailCompraPedido(lineasCorreo, email, nombre, total, Number(cs.cupon_descuento) || 0);
    } catch (e) {
      console.error('Email compra error:', e);
    }
  }

  return NextResponse.json({ received: true });
}