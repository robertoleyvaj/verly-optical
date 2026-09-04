// app/lib/emails.ts
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FROM = 'Verly Optical <orders@send.verlyoptical.com>';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://verlyoptical.com';

// Convierte el ID interno al ID visible del pedido
function orderCode(id: number): string {
  return `VRL-${2846 + id}`;
}

async function logEmail(order_id: number, email_type: string, resend_email_id: string | null, status: string, error?: string) {
  await supabase.from('email_logs').insert({
    order_id, email_type, resend_email_id, status, error_message: error || null,
  });
}

async function yaEnviado(order_id: number, email_type: string): Promise<boolean> {
  const { data } = await supabase
    .from('email_logs')
    .select('id')
    .eq('order_id', order_id)
    .eq('email_type', email_type)
    .eq('status', 'sent')
    .limit(1);
  return (data?.length || 0) > 0;
}

const estilos = `
  body { margin: 0; padding: 0; background: #F7F4EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  .wrapper { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
  .card { background: white; border-radius: 8px; border: 1px solid #E2DDD6; overflow: hidden; }
  .header { background: #1C1C1A; padding: 32px 40px; text-align: center; }
  .header img { height: 32px; }
  .body { padding: 40px; }
  .title { font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 300; color: #1C1C1A; margin: 0 0 12px; line-height: 1.3; }
  .text { font-size: 14px; color: #8C8680; line-height: 1.8; margin: 0 0 20px; }
  .divider { border: none; border-top: 1px solid #E2DDD6; margin: 28px 0; }
  .label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8C8680; margin: 0 0 4px; }
  .value { font-size: 14px; color: #1C1C1A; font-weight: 500; margin: 0 0 16px; }
  .code { font-family: 'Courier New', monospace; font-size: 18px; font-weight: 600; color: #1C1C1A; letter-spacing: 0.08em; }
  .btn { display: inline-block; background: #1C1C1A; color: white !important; padding: 12px 28px; border-radius: 3px; text-decoration: none; font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
  .btn-sage { background: #4A5940 !important; }
  .footer { padding: 24px 40px; text-align: center; }
  .footer-text { font-size: 11px; color: #8C8680; line-height: 1.7; margin: 0; }
`;

const logo = `${BASE_URL}/logo-trasparente.png`;

function footer() {
  return `
    <div class="footer">
      <p class="footer-text">
        Verly Optical<br/>
        <a href="mailto:support@verlyoptical.com" style="color:#8C8680;">support@verlyoptical.com</a>
      </p>
    </div>
  `;
}

// ── 1. PURCHASE CONFIRMATION ──────────────────────────────────────────────
export async function enviarEmailCompra(order_id: number, cliente_email: string, cliente_nombre: string, detalle: string, total: number) {
  if (await yaEnviado(order_id, 'compra')) return;

  const code = orderCode(order_id);

  const html = `
    <!DOCTYPE html><html><head><style>${estilos}</style></head><body>
    <div class="wrapper">
      <div class="card">
        <div class="header"><img src="${logo}" alt="Verly Optical"/></div>
        <div class="body">
          <p class="title">Thank you for<br/>your order, ${cliente_nombre.split(' ')[0]}!</p>
          <p class="text">We've received your order and our team will review it shortly. We'll notify you as soon as we start crafting your lenses.</p>
          <hr class="divider"/>
          <p class="label">Order number</p>
          <p class="value"><span class="code">${code}</span></p>
          <p class="label">Details</p>
          <p class="value">${detalle}</p>
          <p class="label">Total</p>
          <p class="value">$${total} USD</p>
          <hr class="divider"/>
          <p class="text" style="margin:0;">Questions? Reach us at <a href="mailto:support@verlyoptical.com" style="color:#4A5940;">support@verlyoptical.com</a></p>
        </div>
        ${footer()}
      </div>
    </div>
    </body></html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: cliente_email,
      subject: `Order confirmed — ${code}`,
      html,
    });
    await logEmail(order_id, 'compra', data?.id || null, error ? 'error' : 'sent', error?.message);
  } catch (e: any) {
    await logEmail(order_id, 'compra', null, 'error', e.message);
  }
}

// ── 2. IN PRODUCTION ──────────────────────────────────────────────────────
export async function enviarEmailFabricacion(order_id: number, cliente_email: string, cliente_nombre: string) {
  if (await yaEnviado(order_id, 'fabricacion')) return;

  const code = orderCode(order_id);

  const html = `
    <!DOCTYPE html><html><head><style>${estilos}</style></head><body>
    <div class="wrapper">
      <div class="card">
        <div class="header"><img src="${logo}" alt="Verly Optical"/></div>
        <div class="body">
          <p class="title">Your lenses are<br/>being crafted</p>
          <p class="text">Hi ${cliente_nombre.split(' ')[0]}, we've reviewed your prescription and started crafting your lenses. This process typically takes 2 to 4 business days.</p>
          <hr class="divider"/>
          <p class="label">Order number</p>
          <p class="value"><span class="code">${code}</span></p>
          <p class="text" style="margin:0;">We'll notify you as soon as your order ships.</p>
        </div>
        ${footer()}
      </div>
    </div>
    </body></html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: cliente_email,
      subject: `Your lenses are being crafted — ${code}`,
      html,
    });
    await logEmail(order_id, 'fabricacion', data?.id || null, error ? 'error' : 'sent', error?.message);
  } catch (e: any) {
    await logEmail(order_id, 'fabricacion', null, 'error', e.message);
  }
}

// ── 3. SHIPPED ────────────────────────────────────────────────────────────
export async function enviarEmailEnviado(order_id: number, cliente_email: string, cliente_nombre: string, tracking: string, paqueteria: string) {
  if (await yaEnviado(order_id, 'enviado')) return;

  const code = orderCode(order_id);

  const html = `
    <!DOCTYPE html><html><head><style>${estilos}</style></head><body>
    <div class="wrapper">
      <div class="card">
        <div class="header"><img src="${logo}" alt="Verly Optical"/></div>
        <div class="body">
          <p class="title">Your order<br/>is on its way!</p>
          <p class="text">Hi ${cliente_nombre.split(' ')[0]}, your order has been shipped and is on its way to you. Estimated delivery: 3 to 7 business days.</p>
          <hr class="divider"/>
          <p class="label">Order number</p>
          <p class="value"><span class="code">${code}</span></p>
          <p class="label">Carrier</p>
          <p class="value">${paqueteria}</p>
          <p class="label">Tracking number</p>
          <p class="value"><span class="code">${tracking}</span></p>
          <hr class="divider"/>
          <p class="text" style="margin:0;">Need help? <a href="mailto:support@verlyoptical.com" style="color:#4A5940;">Contact us</a></p>
        </div>
        ${footer()}
      </div>
    </div>
    </body></html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: cliente_email,
      subject: `Your order ${code} has shipped!`,
      html,
    });
    await logEmail(order_id, 'enviado', data?.id || null, error ? 'error' : 'sent', error?.message);
  } catch (e: any) {
    await logEmail(order_id, 'enviado', null, 'error', e.message);
  }
}

// ── 4. DELIVERED ──────────────────────────────────────────────────────────
export async function enviarEmailEntregado(order_id: number, cliente_email: string, cliente_nombre: string) {
  if (await yaEnviado(order_id, 'entregado')) return;

  const code = orderCode(order_id);

  const html = `
    <!DOCTYPE html><html><head><style>${estilos}</style></head><body>
    <div class="wrapper">
      <div class="card">
        <div class="header"><img src="${logo}" alt="Verly Optical"/></div>
        <div class="body">
          <p class="title">Your order<br/>has been delivered!</p>
          <p class="text">Hi ${cliente_nombre.split(' ')[0]}, we hope you love your new glasses! Remember you have a 90-day warranty and 30-day hassle-free returns.</p>
          <hr class="divider"/>
          <p class="label">Order number</p>
          <p class="value"><span class="code">${code}</span></p>
          <p class="text" style="margin-bottom:24px;">If anything isn't right with your order, don't hesitate to reach out.</p>
          <a href="mailto:support@verlyoptical.com" class="btn btn-sage">Contact support</a>
        </div>
        ${footer()}
      </div>
    </div>
    </body></html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: cliente_email,
      subject: `Your order ${code} has been delivered!`,
      html,
    });
    await logEmail(order_id, 'entregado', data?.id || null, error ? 'error' : 'sent', error?.message);

    const scheduled_for = new Date();
    scheduled_for.setDate(scheduled_for.getDate() + 30);
    await supabase.from('scheduled_emails').insert({
      order_id, email_type: 'seguimiento_30',
      scheduled_for: scheduled_for.toISOString(), sent: false,
    });
  } catch (e: any) {
    await logEmail(order_id, 'entregado', null, 'error', e.message);
  }
}

// ── 5. 30-DAY FOLLOW UP ───────────────────────────────────────────────────
export async function enviarEmailSeguimiento(order_id: number, cliente_email: string, cliente_nombre: string) {
  if (await yaEnviado(order_id, 'seguimiento_30')) return;

  const code = orderCode(order_id);
  const encuesta_url = `${BASE_URL}/review?order=${code}`;

  const html = `
    <!DOCTYPE html><html><head><style>${estilos}</style></head><body>
    <div class="wrapper">
      <div class="card">
        <div class="header"><img src="${logo}" alt="Verly Optical"/></div>
        <div class="body">
          <p class="title">How are your<br/>new glasses?</p>
          <p class="text">Hi ${cliente_nombre.split(' ')[0]}, it's been 30 days since you received your order <span class="code" style="font-size:13px;">${code}</span>. We'd love to hear how everything's going.</p>
          <hr class="divider"/>
          <p class="text" style="margin-bottom:24px;">Your feedback means a lot to us and helps us improve. It only takes 2 minutes.</p>
          <a href="${encuesta_url}" class="btn">Leave a review</a>
          <hr class="divider"/>
          <p class="text" style="margin:0; font-size:13px;">Something wrong with your lenses? <a href="mailto:support@verlyoptical.com" style="color:#4A5940;">Contact us</a> — we offer a 90-day warranty.</p>
        </div>
        ${footer()}
      </div>
    </div>
    </body></html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: cliente_email,
      subject: `How are your glasses from ${code}?`,
      html,
    });
    await logEmail(order_id, 'seguimiento_30', data?.id || null, error ? 'error' : 'sent', error?.message);

    await supabase
      .from('scheduled_emails')
      .update({ sent: true, sent_at: new Date().toISOString() })
      .eq('order_id', order_id)
      .eq('email_type', 'seguimiento_30');
  } catch (e: any) {
    await logEmail(order_id, 'seguimiento_30', null, 'error', e.message);
  }
}