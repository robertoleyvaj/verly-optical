// Cliente de Supabase SOLO para el servidor (páginas, feeds, sitemap).
// Usa la service key si existe para no depender de RLS; nunca se manda al navegador.
import { createClient } from '@supabase/supabase-js'

export function supabaseServidor() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}
