'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { fbTrack } from '../lib/fpixel';

// Dispara PageView en la carga inicial y en cada navegación del App Router.
export default function PixelPageView() {
  const pathname = usePathname();
  useEffect(() => {
    fbTrack('PageView');
  }, [pathname]);
  return null;
}
