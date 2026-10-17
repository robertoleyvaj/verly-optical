import type { Metadata } from 'next';
import { IndiceGuias } from '../../components/GuiaVista';
import { GUIAS } from '../../lib/guias';

export const metadata: Metadata = {
  title: 'Guías de lentes: receta, micas y armazones',
  description: 'Guías sencillas sobre lentes graduados: cómo leer tu receta, medir tu distancia pupilar, elegir micas y armazones, y comprar lentes sin aseguranza.',
  alternates: { canonical: 'https://verlyoptical.com/es/guias', languages: { 'en-US': 'https://verlyoptical.com/guides', 'es-US': 'https://verlyoptical.com/es/guias' } },
};

export default function Page() {
  return <IndiceGuias es guias={GUIAS} />;
}
