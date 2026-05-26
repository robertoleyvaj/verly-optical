"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

let cache: any = null;
let cacheTime = 0;

export function invalidarCachePrecios() {
  cache = null;
  cacheTime = 0;
}

export function usePreciosVerly() {
  const [precios, setPrecios] = useState({
    armazon_base: 0,
    vision: [],
    material: [],
    filtro: [],
  });

  useEffect(() => {
    async function cargarPrecios() {
      const ahora = Date.now();

      if (cache && ahora - cacheTime < 5 * 60 * 1000) {
        setPrecios(cache);
        return;
      }

      const { data, error } = await supabase
        .from("precios")
        .select("*")
        .eq("activo", true)
        .order("orden");

      if (error || !data) {
        console.error("Error cargando precios:", error);
        return;
      }

      const resultado: any = {
        armazon_base: 0,
        vision: [],
        material: [],
        filtro: [],
      };

      data.forEach((p: any) => {
        if (p.categoria === "armazon") {
          resultado.armazon_base = Number(p.precio || 0);
        }

        if (p.categoria === "vision") {
          resultado.vision.push({ ...p, precio: Number(p.precio || 0) });
        }

        if (p.categoria === "material") {
          resultado.material.push({ ...p, precio: Number(p.precio || 0) });
        }

        if (p.categoria === "filtro") {
          resultado.filtro.push({ ...p, precio: Number(p.precio || 0) });
        }
      });

      cache = resultado;
      cacheTime = ahora;
      setPrecios(resultado);
    }

    cargarPrecios();
  }, []);

  return precios;
}