import type { Metadata } from 'next';

// El catálogo es interactivo (cliente); aquí van el título y la descripción para Google.
export const metadata: Metadata = {
  title: 'Prescription Eyeglasses — Shop Frames Online',
  description: 'Shop prescription eyeglasses online: round, rectangular, cat-eye and metal frames with your prescription lenses. No insurance needed. Free US shipping over $70.',
  alternates: { canonical: 'https://verlyoptical.com/Tienda' },
  openGraph: {
    title: 'Prescription Eyeglasses | Verly Optical',
    description: 'Frames with your prescription lenses, a case and a cleaning cloth. No insurance needed.',
    url: 'https://verlyoptical.com/Tienda',
    type: 'website',
  },
};

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
