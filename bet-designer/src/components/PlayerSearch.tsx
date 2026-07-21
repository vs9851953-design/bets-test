"use client";

import { useMemo, useState } from "react";
import { useDesignerStore } from "@/store/useDesignerStore";

export default function PlayerSearch() {
  const manifest = useDesignerStore((s) => s.manifest);
  const addPlayerToCanvas = useDesignerStore((s) => s.addPlayerToCanvas);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!manifest) return [];
    const q = query.trim().toLowerCase();
    const all = Object.values(manifest.players).flat();
    if (!q) return all.slice(0, 12);
    return all.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 20);
  }, [manifest, query]);

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wide text-neutral-400">Pesquisar jogador</label>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ex: Ney..."
        className="w-full text-sm px-3 py-2 rounded-lg bg-neutral-900 border border-panelBorder outline-none focus:border-accent"
      />
      <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
        {results.map((p) => (
          <button
            key={p.src}
            onClick={() => addPlayerToCanvas(p.name, p.team, p.src)}
            className="group flex flex-col items-center gap-1 rounded-lg border border-panelBorder bg-neutral-900 hover:border-accent p-1.5"
            title={`${p.name} — ${p.team}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.name} className="w-full h-16 object-contain" />
            <span className="text-[10px] text-neutral-400 truncate w-full text-center">
              {p.name}
            </span>
          </button>
        ))}
        {results.length === 0 && (
          <p className="col-span-3 text-xs text-neutral-500">Nenhum jogador encontrado.</p>
        )}
      </div>
    </div>
  );
}
