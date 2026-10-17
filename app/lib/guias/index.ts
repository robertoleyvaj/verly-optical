import type { Guia } from './tipos';
import { G_COMPRAR } from './g1-comprar';
import { G_RECETA } from './g2-receta';
import { G_VISION } from './g3-vision';
import { G_MICAS } from './g4-micas';
import { G_ARMAZONES } from './g5-armazones';
import { G_CUIDADO } from './g6-cuidado';

export * from './tipos';

export const GUIAS: Guia[] = [...G_COMPRAR, ...G_RECETA, ...G_VISION, ...G_MICAS, ...G_ARMAZONES, ...G_CUIDADO];

export const guiaPorSlug = (slug: string) => GUIAS.find(g => g.slug === slug);
export const guiaPorSlugEs = (slug: string) => GUIAS.find(g => g.slugEs === slug);

// Guías relacionadas: misma categoría, sin repetir la actual
export const relacionadas = (g: Guia, n = 3) => GUIAS.filter(x => x.cat === g.cat && x.slug !== g.slug).slice(0, n);
