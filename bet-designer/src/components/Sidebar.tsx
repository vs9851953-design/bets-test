"use client";

import { useDesignerStore } from "@/store/useDesignerStore";
import CsvImporter from "./CsvImporter";
import GamesEditor from "./GamesEditor";
import PlayerSearch from "./PlayerSearch";
import type { TemplateId } from "@/types";

export default function Sidebar({ onGenerate }: { onGenerate: () => void }) {
  const manifest = useDesignerStore((s) => s.manifest);
  const selectedBankId = useDesignerStore((s) => s.selectedBankId);
  const selectBank = useDesignerStore((s) => s.selectBank);
  const selectedTemplate = useDesignerStore((s) => s.selectedTemplate);
  const selectTemplate = useDesignerStore((s) => s.selectTemplate);
  const date = useDesignerStore((s) => s.date);
  const setDate = useDesignerStore((s) => s.setDate);
  const day = useDesignerStore((s) => s.day);
  const setDay = useDesignerStore((s) => s.setDay);
  const resetDesign = useDesignerStore((s) => s.resetDesign);

  const bank = manifest?.banks.find((b) => b.id === selectedBankId);
  const availableTemplates = bank ? (Object.keys(bank.templates) as TemplateId[]) : [];

  return (
    <aside className="w-[340px] shrink-0 h-full overflow-y-auto border-r border-panelBorder bg-panel p-4 space-y-5">
      <div>
        <h1 className="text-xl font-bebas tracking-wide text-white">Bet Designer</h1>
        <p className="text-xs text-neutral-500">Gerador automático de artes para apostas</p>
      </div>

      {/* Banca */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wide text-neutral-400">Banca</label>
        <select
          value={selectedBankId ?? ""}
          onChange={(e) => selectBank(e.target.value)}
          className="w-full text-sm px-3 py-2 rounded-lg bg-neutral-900 border border-panelBorder"
        >
          {manifest?.banks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.config.name}
            </option>
          ))}
        </select>
      </div>

      {/* Template */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wide text-neutral-400">Template</label>
        <div className="flex gap-2">
          {(["combo", "solo"] as TemplateId[]).map((t) => (
            <button
              key={t}
              disabled={!availableTemplates.includes(t)}
              onClick={() => selectTemplate(t)}
              className={`flex-1 text-sm py-2 rounded-lg border capitalize disabled:opacity-30 disabled:cursor-not-allowed ${
                selectedTemplate === t
                  ? "bg-accent border-accent text-white"
                  : "bg-neutral-900 border-panelBorder hover:border-neutral-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Data / Dia */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-neutral-400">Data</label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="21/07/2026"
            className="w-full text-sm px-3 py-2 rounded-lg bg-neutral-900 border border-panelBorder"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-neutral-400">Dia</label>
          <input
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="Terça-feira"
            className="w-full text-sm px-3 py-2 rounded-lg bg-neutral-900 border border-panelBorder"
          />
        </div>
      </div>

      <CsvImporter />
      <GamesEditor />
      <PlayerSearch />

      <div className="pt-2 space-y-2 border-t border-panelBorder">
        <button
          onClick={onGenerate}
          className="w-full text-sm font-semibold py-2.5 rounded-lg bg-accent hover:brightness-110 text-white"
        >
          Gerar PNG
        </button>
        <button
          onClick={resetDesign}
          className="w-full text-xs py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-panelBorder text-neutral-400"
        >
          Limpar arte
        </button>
      </div>
    </aside>
  );
}
