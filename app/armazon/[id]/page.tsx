// app/armazon/[id]/page.tsx — parte de SERVIDOR de la página del armazón.
// Le da a Google el título, la descripción, la foto y los datos del producto (precio, existencia)
// desde el primer momento. La parte interactiva (colores, micas, carrito) está en ArmazonCliente.tsx.
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ArmazonCliente from './ArmazonCliente';
import { supabaseServidor } from '../../lib/supabase-server';
import { precioArmazonFinal } from '../../lib/precios';
import { nombreMaterial } from '../../lib/textos';
import { FORMAS, normForma } from '../../lib/armazon-web';
import { ENVIO_GRATIS_DESDE, ENVIO_COSTO } from '../../lib/envio';
import { DEVOLUCION_DIAS, DIAS_FABRICACION, DIAS_ENVIO } from '../../lib/marca';

export const revalidate = 600; // se refresca cada 10 minutos

const BASE = 'https://verlyoptical.com';

async function cargar(id: string) {
  if (!/^\d+$/.test(id)) return null;
  const sb = supabaseServidor();
  const { data: a } = await sb.from('armazones').select('*').eq('id', id).maybeSingle();
  if (!a || !a.activo || !a.publicar_verly) return null;
  const { data: cols } = await sb.from('armazon_colores').select('*').eq('armazon_id', id).eq('publicar_verly', true).order('orden');
  return { a, cols: cols ?? [] };
}

function datos(a: any, cols: any[]) {
  const precio = precioArmazonFinal(a.precio, a.descuento_verly);
  const material = nombreMaterial(a.material, 'en');
  const fk = normForma(a.forma);
  const forma = fk ? FORMAS.find(f => f.v === fk)?.en ?? '' : '';
  const fotos = [
    ...cols.flatMap(c => [c.imagen_url, c.imagen2_url, c.imagen3_url, c.imagen4_url, c.portada_url]),
    a.imagen_url, a.imagen2_url, a.imagen3_url, a.imagen4_url,
  ].filter(Boolean) as string[];
  const unicas = [...new Set(fotos)];
  // Existencia: solo el inventario nuevo (VRL-1xxx) lleva stock confiable por color
  const inventarioNuevo = /^VRL-1\d{3}$/.test(String(a.sku ?? ''));
  const stock = (c: any) => ['stock_baja', 'stock_mayo', 'stock_plaza', 'stock_online', 'bodega'].reduce((s, k) => s + (Number(c[k]) || 0), 0);
  const hay = !inventarioNuevo || !cols.length || cols.some(c => stock(c) > 0);
  const desc = (a.descripcion_en || a.descripcion_es || '').trim() ||
    `${[forma, material].filter(Boolean).join(' ').trim() || 'Prescription'} eyeglasses with your prescription lenses, a case and a cleaning cloth. Frame $${precio}. Free US shipping over $${ENVIO_GRATIS_DESDE}.`;
  return { precio, material, forma, fotos: unicas, hay, desc };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const r = await cargar(id);
  if (!r) return { title: 'Frame not found', robots: { index: false } };
  const { a, cols } = r;
  const d = datos(a, cols);
  const titulo = `${a.nombre} — ${[d.forma, d.material].filter(Boolean).join(' ')} Prescription Glasses from $${d.precio}`.replace(/\s+/g, ' ');
  return {
    title: titulo,
    description: d.desc.slice(0, 160),
    alternates: { canonical: `${BASE}/armazon/${a.id}` },
    openGraph: {
      title: `${a.nombre} | Verly Optical`,
      description: d.desc.slice(0, 160),
      url: `${BASE}/armazon/${a.id}`,
      type: 'website',
      images: d.fotos.slice(0, 1).map(u => ({ url: u, alt: a.nombre })),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await cargar(id);
  if (!r) notFound();
  const { a, cols } = r;
  const d = datos(a, cols);
  const url = `${BASE}/armazon/${a.id}`;

  // Datos estructurados (schema.org) para que Google muestre precio, existencia y foto
  const oferta = {
    '@type': 'Offer',
    url,
    priceCurrency: 'USD',
    price: d.precio.toFixed(2),
    availability: d.hay ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: ENVIO_COSTO.toFixed(2), currency: 'USD' },
      shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: DIAS_FABRICACION.min, maxValue: DIAS_FABRICACION.max, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: DIAS_ENVIO.min, maxValue: DIAS_ENVIO.max, unitCode: 'DAY' },
      },
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'US',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: DEVOLUCION_DIAS,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
  };
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: a.nombre,
        description: d.desc,
        sku: a.sku || String(a.id),
        image: d.fotos,
        brand: { '@type': 'Brand', name: 'Verly Optical' },
        category: 'Eyeglasses',
        ...(d.material ? { material: d.material } : {}),
        ...(cols.length ? { color: cols.map((c: any) => c.color).join(', ') } : {}),
        offers: oferta,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Frames', item: `${BASE}/Tienda` },
          { '@type': 'ListItem', position: 3, name: a.nombre, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <Suspense fallback={null}>
        <ArmazonCliente />
      </Suspense>
    </>
  );
}
