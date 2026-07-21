"use client";

import { useDesignerStore } from "@/store/useDesignerStore";

export default function Toolbar() {
  const selectedElementId = useDesignerStore((s) => s.selectedElementId);
  const elements = useDesignerStore((s) => s.elements);
  const updateElement = useDesignerStore((s) => s.updateElement);
  const removeElement = useDesignerStore((s) => s.removeElement);
  const duplicateElement = useDesignerStore((s) => s.duplicateElement);
  const bringToFront = useDesignerStore((s) => s.bringToFront);
  const sendToBack = useDesignerStore((s) => s.sendToBack);

  const el = elements.find((e) => e.id === selectedElementId);
  if (!el) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-panel/95 border border-panelBorder rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg z-20">
      <span className="text-xs text-neutral-400 pr-2 border-r border-panelBorder capitalize">
        {el.type}
      </span>

      <label className="flex items-center gap-1 text-xs text-neutral-300">
        Escala
        <input
          type="range"
          min={0.2}
          max={3}
          step={0.05}
          value={el.scaleX}
          onChange={(e) => {
            const v = Number(e.target.value);
            updateElement(el.id, { scaleX: v, scaleY: v });
          }}
        />
      </label>

      <label className="flex items-center gap-1 text-xs text-neutral-300">
        Rotação
        <input
          type="range"
          min={-180}
          max={180}
          step={1}
          value={el.rotation}
          onChange={(e) => updateElement(el.id, { rotation: Number(e.target.value) })}
        />
      </label>

      <button
        className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
        onClick={() => bringToFront(el.id)}
        title="Trazer para frente"
      >
        ⬆ Frente
      </button>
      <button
        className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
        onClick={() => sendToBack(el.id)}
        title="Enviar para trás"
      >
        ⬇ Trás
      </button>
      <button
        className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
        onClick={() => duplicateElement(el.id)}
        title="Duplicar"
      >
        ⧉ Duplicar
      </button>
      <button
        className="text-xs px-2 py-1 rounded bg-red-900 hover:bg-red-800"
        onClick={() => removeElement(el.id)}
        title="Excluir"
      >
        🗑 Excluir
      </button>
    </div>
  );
}
