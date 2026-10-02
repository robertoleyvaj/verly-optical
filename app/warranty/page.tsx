import type { Metadata } from 'next';
import PaginaInfo from '../components/PaginaInfo';

export const metadata: Metadata = { title: 'Warranty' };

export default function Page() {
  return <PaginaInfo slug="warranty" />;
}
