"use client";

import { useDesignerStore } from "@/store/useDesignerStore";

export default function GamesEditor() {
  const games = useDesignerStore((s) => s.games);
  const updateGame = useDesignerStore((s) => s.updateGame);
  const removeGame = useDesignerStore((s) => s.removeGame);
  const addEmptyGame = useDesignerStore((s) => s.addEmptyGame);
  const manifest = useDesignerStore((s) => s.manifest);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wide text-neutral-400">Jogos</label>
        <button
          onClick={addEmptyGame}
          className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
        >
          + Adicionar
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {games.map((g, idx) => {
          const homeMissing = g.homeTeam && !manifest?.logos[g.homeTeam];
          const awayMissing = g.awayTeam && !manifest?.logos[g.awayTeam];
          return (
            <div key={g.id} className="rounded-lg border border-panelBorder bg-neutral-900 p-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">Jogo {idx + 1}</span>
                <button
                  className="text-[11px] text-red-400 hover:text-red-300"
                  onClick={() => removeGame(g.id)}
                >
                  remover
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <input
                  className="text-xs px-2 py-1 rounded bg-neutral-950 border border-panelBorder"
                  placeholder="Liga"
                  value={g.league}
                  onChange={(e) => updateGame(g.id, { league: e.target.value })}
                />
                <input
                  className="text-xs px-2 py-1 rounded bg-neutral-950 border border-panelBorder"
                  placeholder="Horário"
                  value={g.time}
                  onChange={(e) => updateGame(g.id, { time: e.target.value })}
                />
                <input
                  className={`text-xs px-2 py-1 rounded bg-neutral-950 border ${
                    homeMissing ? "border-yellow-600" : "border-panelBorder"
                  }`}
                  placeholder="Time da casa"
                  value={g.homeTeam}
                  onChange={(e) => updateGame(g.id, { homeTeam: e.target.value })}
                />
                <input
                  className={`text-xs px-2 py-1 rounded bg-neutral-950 border ${
                    awayMissing ? "border-yellow-600" : "border-panelBorder"
                  }`}
                  placeholder="Time visitante"
                  value={g.awayTeam}
                  onChange={(e) => updateGame(g.id, { awayTeam: e.target.value })}
                />
                <input
                  className="text-xs px-2 py-1 rounded bg-neutral-950 border border-panelBorder"
                  placeholder="Odd casa"
                  value={g.homeOdd}
                  onChange={(e) => updateGame(g.id, { homeOdd: e.target.value })}
                />
                <input
                  className="text-xs px-2 py-1 rounded bg-neutral-950 border border-panelBorder"
                  placeholder="Odd fora"
                  value={g.awayOdd}
                  onChange={(e) => updateGame(g.id, { awayOdd: e.target.value })}
                />
              </div>
              {(homeMissing || awayMissing) && (
                <p className="text-[10px] text-yellow-400">
                  ⚠ Escudo ausente em <code>public/logos</code> para{" "}
                  {[homeMissing && g.homeTeam, awayMissing && g.awayTeam].filter(Boolean).join(" e ")}.
                </p>
              )}
            </div>
          );
        })}
        {games.length === 0 && (
          <p className="text-xs text-neutral-500">Nenhum jogo. Importe um CSV ou adicione manualmente.</p>
        )}
      </div>
    </div>
  );
}
