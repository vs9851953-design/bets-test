"use client";

import { useEffect } from "react";
import { useDesignerStore } from "@/store/useDesignerStore";
import type { Manifest } from "@/types";

export default function TemplateLoader() {
  const setManifest = useDesignerStore((s) => s.setManifest);
  const setLoadingManifest = useDesignerStore((s) => s.setLoadingManifest);

  useEffect(() => {
    setLoadingManifest(true);
    fetch("/manifest.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((m: Manifest) => setManifest(m))
      .catch((err) => console.error("Falha ao carregar manifest.json", err))
      .finally(() => setLoadingManifest(false));
  }, [setManifest, setLoadingManifest]);

  return null;
}
