import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GuiaVista from '../../../components/GuiaVista';
import { GUIAS, guiaPorSlugEs } from '../../../lib/guias';

const BASE = 'https://verlyoptical.com';

export function generateStaticParams() {
  return GUIAS.map(g => ({ slug: g.slugEs }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guiaPorSlugEs(slug);
  if (!g) return { title: 'Guía no encontrada', robots: { index: false } };
  const en = `${BASE}/guides/${g.slug}`, es = `${BASE}/es/guias/${g.slugEs}`;
  return {
    title: g.es.t, description: g.es.d,
    alternates: { canonical: es, languages: { 'en-US': en, 'es-US': es } },
    openGraph: { title: g.es.t, description: g.es.d, url: es, type: 'article', locale: 'es_US' },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guiaPorSlugEs(slug);
  if (!g) notFound();
  return <GuiaVista g={g} es />;
}
