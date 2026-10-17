import type { Metadata } from 'next';
import { IndiceGuias } from '../components/GuiaVista';
import { GUIAS } from '../lib/guias';

export const metadata: Metadata = {
  title: 'Eyeglasses Guides: Prescriptions, Lenses and Frames',
  description: 'Simple guides about prescription glasses: how to read your prescription, measure your PD, choose lenses and frames, and buy glasses without insurance.',
  alternates: { canonical: 'https://verlyoptical.com/guides', languages: { 'en-US': 'https://verlyoptical.com/guides', 'es-US': 'https://verlyoptical.com/es/guias' } },
};

export default function Page() {
  return <IndiceGuias es={false} guias={GUIAS} />;
}
