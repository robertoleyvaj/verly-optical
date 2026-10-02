import type { Metadata } from 'next';
import PaginaInfo from '../components/PaginaInfo';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function Page() {
  return <PaginaInfo slug="privacy" />;
}
