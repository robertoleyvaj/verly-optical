import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GuiaVista from '../../components/GuiaVista';
import { GUIAS, guiaPorSlug } from '../../lib/guias';

const BASE = 'https://verlyoptical.com';

export function generateStaticParams() {
  return GUIAS.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guiaPorSlug(slug);
  if (!g) return { title: 'Guide not found', robots: { index: false } };
  const en = `${BASE}/guides/${g.slug}`, es = `${BASE}/es/guias/${g.slugEs}`;
  return {
    title: g.en.t, description: g.en.d,
    alternates: { canonical: en, languages: { 'en-US': en, 'es-US': es } },
    openGraph: { title: g.en.t, description: g.en.d, url: en, type: 'article', locale: 'en_US' },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guiaPorSlug(slug);
  if (!g) notFound();
  return <GuiaVista g={g} es={false} />;
}
