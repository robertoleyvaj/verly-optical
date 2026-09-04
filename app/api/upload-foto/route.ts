import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get('verly_admin')?.value;
  return !!process.env.ADMIN_TOKEN_SECRET && token === process.env.ADMIN_TOKEN_SECRET;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const campo = formData.get('campo') as string;
  const id = formData.get('id') as string;

  if (!file || !campo || !id) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const nombre = `armazon-${id}-${campo}-${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabaseAdmin.storage
    .from('armazones')
    .upload(nombre, buffer, { contentType: file.type, upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from('armazones').getPublicUrl(nombre);
  return NextResponse.json({ url: data.publicUrl });
}