import type { Metadata } from 'next';
import PaginaInfo from '../components/PaginaInfo';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function Page() {
  return <PaginaInfo slug="terms" />;
}
