'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'es' | 'en';

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (es: string, en: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (_, en) => en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  // Cargar idioma guardado al montar
  useEffect(() => {
    const guardado = localStorage.getItem('verly_lang') as Lang | null;
    if (guardado === 'es' || guardado === 'en') setLang(guardado);
  }, []);

  // Guardar cuando cambia
  const cambiarLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('verly_lang', l);
  };

  const t = (es: string, en: string) => lang === 'es' ? es : en;

  return (
    <LangContext.Provider value={{ lang, setLang: cambiarLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}