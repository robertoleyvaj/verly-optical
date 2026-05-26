'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Favorito = {
  id: number;
  nombre: string;
  imagen_url?: string;
  precio: number;
  forma?: string;
  material?: string;
};

type FavoritosContextType = {
  favoritos: Favorito[];
  toggleFavorito: (item: Favorito) => void;
  esFavorito: (id: number) => boolean;
  favoritosOpen: boolean;
  setFavoritosOpen: (v: boolean) => void;
  totalFavoritos: number;
};

const FavoritosContext = createContext<FavoritosContextType>({} as FavoritosContextType);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [favoritosOpen, setFavoritosOpen] = useState(false);

  // Cargar desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('verly_favoritos');
      if (saved) setFavoritos(JSON.parse(saved));
    } catch {}
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('verly_favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (item: Favorito) => {
    setFavoritos(prev =>
      prev.some(f => f.id === item.id)
        ? prev.filter(f => f.id !== item.id)
        : [...prev, item]
    );
  };

  const esFavorito = (id: number) => favoritos.some(f => f.id === id);

  return (
    <FavoritosContext.Provider value={{
      favoritos, toggleFavorito, esFavorito,
      favoritosOpen, setFavoritosOpen,
      totalFavoritos: favoritos.length,
    }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export const useFavoritos = () => useContext(FavoritosContext);