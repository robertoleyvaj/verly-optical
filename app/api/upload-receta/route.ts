import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = 'recetas';
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const TIPOS_OK = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];

// Rate limit simple por IP (evita abuso del endpoint público)
const intentos = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const r = intentos.get(ip);
  if (!r || now > r.resetAt) { intentos.set(ip, { count: 1, resetAt: now + 60_000 }); return false; }
  if (r.count >= 10) return true;
  r.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (rateLimited(ip)) {
      return NextResponse.json({ error: 'Demasiados intentos. Espera un momento.' }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'El archivo supera 10 MB.' }, { status: 413 });
    }
    if (file.type && !TIPOS_OK.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no válido. Sube una imagen o PDF.' }, { status: 415 });
    }

    // Asegurar el bucket privado (se autocrea la primera vez; si ya existe, se ignora el error)
    await supabaseAdmin.storage.createBucket(BUCKET, {
      public: false,
      fileSizeLimit: MAX_BYTES,
    }).catch(() => { /* ya existe */ });

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const now = new Date();
    const carpeta = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const path = `${carpeta}/${crypto.randomUUID()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type || 'image/jpeg', upsert: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Devolvemos la RUTA en Storage (no una URL pública). El bucket es privado;
    // para verla, OptiOS genera una URL firmada con la service key cuando la necesita.
    return NextResponse.json({ path });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error al subir la foto.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
