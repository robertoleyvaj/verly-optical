// Feed de productos para Google Merchant Center y el Catálogo de Meta (mismo formato RSS con g:).
// URL: https://verlyoptical.com/feed/productos
// Una entrada por COLOR publicado (variantes agrupadas por modelo con item_group_id).
import { supabaseServidor } from '../../lib/supabase-server';
import { precioArmazonFinal } from '../../lib/precios';
import { nombreMaterial, } from '../../lib/textos';
import { nombreColor } from '../../lib/colores';
import { FORMAS, normForma, tallaDeMedidas } from '../../lib/armazon-web';
import { ENVIO_GRATIS_DESDE, ENVIO_COSTO } from '../../lib/envio';

export const revalidate = 3600; // se regenera cada hora

const BASE = 'https://verlyoptical.com';
const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const STOCK = ['stock_baja', 'stock_mayo', 'stock_plaza', 'stock_online', 'bodega'];

export async function GET() {
  const sb = supabaseServidor();
  const { data: arms } = await sb.from('armazones').select('*').eq('activo', true).eq('publicar_verly', true).eq('tipo', 'optico');
  const lista = arms ?? [];
  const ids = lista.map(a => a.id);
  const { data: cols } = ids.length
    ? await sb.from('armazon_colores').select('*').in('armazon_id', ids).eq('publicar_verly', true).order('orden')
    : { data: [] as any[] };
  const porModelo: Record<number, any[]> = {};
  for (const c of cols ?? []) (porModelo[c.armazon_id] ||= []).push(c);

  const items: string[] = [];
  for (const a of lista) {
    const precio = precioArmazonFinal(a.precio, a.descuento_verly);
    const precioLista = Number(a.precio) || precio;
    const fk = normForma(a.forma);
    const forma = fk ? FORMAS.find(f => f.v === fk)?.en ?? '' : '';
    const material = nombreMaterial(a.material, 'en');
    const talla = tallaDeMedidas(a.medidas)?.talla;
    const inventarioNuevo = /^VRL-1\d{3}$/.test(String(a.sku ?? ''));
    const genero = a.genero === 'hombre' ? 'male' : a.genero === 'mujer' ? 'female' : 'unisex';
    const edad = a.genero === 'nino' ? 'kids' : 'adult';
    const descBase = (a.descripcion_en || '').trim() ||
      `${[forma, material].filter(Boolean).join(' ') || 'Prescription'} eyeglasses. Includes your prescription lenses, a hard case and a microfiber cloth. No insurance needed. Free US shipping over $${ENVIO_GRATIS_DESDE}.`;

    // Variantes: cada color publicado; si no hay colores, el modelo solo
    const variantes = (porModelo[a.id] ?? []).length ? porModelo[a.id] : [null];
    for (const c of variantes) {
      const fotos = [c?.imagen_url, c?.imagen2_url, c?.imagen3_url, a.imagen_url, a.imagen2_url, a.imagen3_url].filter(Boolean) as string[];
      if (!fotos.length) continue; // Google y Meta exigen foto
      const color = c ? nombreColor(c.color, 'en') : '';
      const hay = !inventarioNuevo || !c || STOCK.reduce((s, k) => s + (Number(c[k]) || 0), 0) > 0;
      const id = c?.sku || a.sku || `VRL-${a.id}`;
      const link = `${BASE}/armazon/${a.id}${c?.sku ? `?color=${encodeURIComponent(c.sku)}` : ''}`;
      const titulo = `${a.nombre} ${[forma, material].filter(Boolean).join(' ')} Prescription Eyeglasses${color ? ` - ${color}` : ''}`.replace(/\s+/g, ' ');
      items.push(`    <item>
      <g:id>${esc(id)}</g:id>
      <g:item_group_id>${esc(a.sku || `VRL-${a.id}`)}</g:item_group_id>
      <g:title>${esc(titulo.slice(0, 150))}</g:title>
      <g:description>${esc(descBase.slice(0, 5000))}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${esc(fotos[0])}</g:image_link>
${[...new Set(fotos.slice(1))].slice(0, 9).map(f => `      <g:additional_image_link>${esc(f)}</g:additional_image_link>`).join('\n')}
      <g:availability>${hay ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${precioLista.toFixed(2)} USD</g:price>
${precio < precioLista ? `      <g:sale_price>${precio.toFixed(2)} USD</g:sale_price>\n` : ''}      <g:condition>new</g:condition>
      <g:brand>Verly Optical</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>Health &amp; Beauty &gt; Personal Care &gt; Vision Care &gt; Eyeglasses</g:google_product_category>
      <g:product_type>Eyeglasses &gt; ${esc(forma || 'Frames')}</g:product_type>
      <g:gender>${genero}</g:gender>
      <g:age_group>${edad}</g:age_group>
${color ? `      <g:color>${esc(color)}</g:color>\n` : ''}${material ? `      <g:material>${esc(material)}</g:material>\n` : ''}${talla ? `      <g:size>${talla}</g:size>\n` : ''}      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>${(precio >= ENVIO_GRATIS_DESDE ? 0 : ENVIO_COSTO).toFixed(2)} USD</g:price>
      </g:shipping>
    </item>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Verly Optical</title>
    <link>${BASE}</link>
    <description>Prescription eyeglasses from Verly Optical</description>
${items.join('\n')}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
