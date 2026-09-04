import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validarCupon } from '../../../lib/cupones';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Rate limit sencillo por IP
const intentos = new Map<string, { count: number; resetAt: number }>();
function limitado(ip: string): boolean {
  const now = Date.now();
  const r = intentos.get(ip);
  if (!r || now > r.resetAt) { intentos.set(ip, { count: 1, resetAt: now + 60_000 }); return false; }
  if (r.count >= 20) return true;
  r.count++;
  return false;
}

// POST { codigo, items } → previsualiza el descuento (no confía en el navegador)
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (limitado(ip)) return NextResponse.json({ ok: false, motivo: 'Demasiados intentos. Espera un momento.' }, { status: 429 });

    const { codigo, items } = await req.json();
    const res = await validarCupon(supabase, codigo, items);
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ ok: false, motivo: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
