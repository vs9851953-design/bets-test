"use client";

import { useRef, useState } from "react";
import { parseCsvFile } from "@/lib/csvParser";
import { useDesignerStore } from "@/store/useDesignerStore";

export default function CsvImporter() {
  const manifest = useDesignerStore((s) => s.manifest);
  const setGames = useDesignerStore((s) => s.setGames);
  const setDate = useDesignerStore((s) => s.setDate);
  const setDay = useDesignerStore((s) => s.setDay);
  const inputRef = useRef<HTMLInputElement>(null);
  const [warning, setWarning] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File) {
    const availableLogos = new Set(Object.keys(manifest?.logos ?? {}));
    try {
      const result = await parseCsvFile(file, availableLogos);
      setGames(result.games);
      if (result.date) setDate(result.date);
      if (result.day) setDay(result.day);
      setWarning(result.missingLogos);
      setFileName(file.name);
    } catch (err) {
      console.error(err);
      setWarning(["Não foi possível ler o CSV. Verifique o formato do arquivo."]);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wide text-neutral-400">Importar CSV</label>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        className="w-full text-sm px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-panelBorder"
        onClick={() => inputRef.current?.click()}
      >
        {fileName ? `📄 ${fileName}` : "Selecionar arquivo .csv"}
      </button>

      {warning.length > 0 && (
        <div className="text-xs bg-yellow-950/60 border border-yellow-800 text-yellow-300 rounded-lg p-2">
          <strong>Escudo não encontrado para:</strong> {warning.join(", ")}. Adicione o PNG em{" "}
          <code>public/logos</code>.
        </div>
      )}
    </div>
  );
}
