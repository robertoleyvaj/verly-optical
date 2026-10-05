// app/sitemap.ts — mapa del sitio para Google: páginas fijas + cada armazón publicado
import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600; // se actualiza cada hora

const baseUrl = "https://verlyoptical.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ahora = new Date();
  const fija = (ruta: string, prioridad: number, freq: "daily" | "weekly" | "monthly" | "yearly") =>
    ({ url: `${baseUrl}${ruta}`, lastModified: ahora, changeFrequency: freq, priority: prioridad });

  const paginas: MetadataRoute.Sitemap = [
    fija("", 1, "weekly"),
    fija("/Tienda", 0.9, "daily"),
    fija("/lenses", 0.7, "monthly"),
    fija("/blue-light-glasses", 0.7, "monthly"),
    fija("/progressive-glasses", 0.7, "monthly"),
    fija("/bifocal-glasses", 0.6, "monthly"),
    fija("/photochromic-glasses", 0.7, "monthly"),
    fija("/mens-glasses", 0.7, "monthly"),
    fija("/womens-glasses", 0.7, "monthly"),
    fija("/collections/glasses-from-28", 0.6, "monthly"),
    fija("/about", 0.4, "yearly"),
    fija("/shipping", 0.4, "yearly"),
    fija("/returns", 0.4, "yearly"),
    fija("/warranty", 0.4, "yearly"),
    fija("/privacy", 0.2, "yearly"),
    fija("/terms", 0.2, "yearly"),
  ];

  // Armazones publicados en Verly
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await sb.from("armazones").select("id").eq("activo", true).eq("publicar_verly", true).eq("tipo", "optico");
    for (const a of data ?? []) {
      paginas.push({ url: `${baseUrl}/armazon/${a.id}`, lastModified: ahora, changeFrequency: "weekly", priority: 0.8 });
    }
  } catch {
    // si la base no responde, al menos se publican las páginas fijas
  }
  return paginas;
}
