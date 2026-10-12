import type { Metadata } from 'next';
import Ayuda from '../components/Ayuda';

export const metadata: Metadata = {
  title: 'Help — How to Buy Prescription Glasses Online',
  description: 'Step-by-step guides: how to buy, add lens coatings, enter your prescription, choose bifocal or progressive lenses, and our guarantee and returns.',
  alternates: { canonical: 'https://verlyoptical.com/help' },
};

export default function Page() {
  return <Ayuda />;
}
