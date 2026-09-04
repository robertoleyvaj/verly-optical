// app/context/CartContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartLentes = {
  vision: string; vision_nombre: string; vision_precio: number;
  material: string; material_nombre: string; material_precio: number;
  filtros: string[]; filtros_nombres: string[]; filtros_precio: number;
};

export type CartReceta = {
  metodo: 'manual' | 'foto' | 'despues' | 'sin_graduacion';
  datos?: any;
  foto_url?: string;
};

export type CartItem = {
  id: string;
  tipo: 'optico' | 'solar';
  armazon_id: number;
  armazon_nombre: string;
  armazon_imagen?: string;
  armazon_precio: number;
  lentes?: CartLentes;
  receta?: CartReceta;
  paciente?: string;
  precio_total: number;
  es_regalo?: boolean;
  solo_armazon?: boolean;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemReceta: (id: string, receta: CartReceta) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrecio: number;
  promoSolarDisponible: boolean;
  promoSolarReclamada: boolean;
  reclamarPromoSolar: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  recetasSesion: { paciente: string; receta: CartReceta }[];
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoSolarReclamada, setPromoSolarReclamada] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem('verly_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed.items || []);
        setPromoSolarReclamada(parsed.promoSolarReclamada || false);
      }
    } catch {}
  }, []);

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    try {
      localStorage.setItem('verly_cart', JSON.stringify({ items, promoSolarReclamada }));
    } catch {}
  }, [items, promoSolarReclamada]);

  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item]);
    setCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems(prev => {
      const filtered = prev.filter(i => i.id !== id);
      // Si se elimina el item de regalo, resetear promo
      const itemEliminado = prev.find(i => i.id === id);
      if (itemEliminado?.es_regalo) setPromoSolarReclamada(false);
      // Si ya no hay opticos, resetear promo
      const hayOpticos = filtered.some(i => i.tipo === 'optico' && !i.es_regalo);
      if (!hayOpticos) setPromoSolarReclamada(false);
      return filtered;
    });
  };

  const updateItemReceta = (id: string, receta: CartReceta) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, receta } : i));
  };

  const clearCart = () => {
    setItems([]);
    setPromoSolarReclamada(false);
  };

  const totalItems = items.length;
  const totalPrecio = items.reduce((sum, i) => sum + i.precio_total, 0);

  // Promo: disponible si hay al menos 1 optico no regalo
  const promoSolarDisponible = items.some(i => i.tipo === 'optico' && !i.es_regalo);

  const reclamarPromoSolar = () => setPromoSolarReclamada(true);

  // Recetas guardadas en sesión para reutilizar
  const recetasSesion = items
    .filter(i => i.receta && i.paciente && i.receta.metodo !== 'despues' && i.receta.metodo !== 'sin_graduacion')
    .map(i => ({ paciente: i.paciente!, receta: i.receta! }));

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateItemReceta, clearCart,
      totalItems, totalPrecio,
      promoSolarDisponible, promoSolarReclamada, reclamarPromoSolar,
      cartOpen, setCartOpen,
      recetasSesion,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function generateCartId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}