import Papa from "papaparse";
import type { CsvRow, GameData } from "@/types";

const pick = (row: CsvRow, ...keys: string[]) => {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
};

export interface ParsedCsvResult {
  games: GameData[];
  date: string;
  day: string;
  missingLogos: string[];
}

const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
];

function inferDay(dateStr: string): string {
  if (!dateStr) return "";
  // aceita dd/mm/yyyy ou yyyy-mm-dd
  let d: Date | null = null;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [dd, mm, yyyy] = dateStr.split("/").map(Number);
    d = new Date(yyyy, mm - 1, dd);
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    d = new Date(dateStr);
  }
  if (!d || Number.isNaN(d.getTime())) return "";
  return DIAS_SEMANA[d.getDay()];
}

export function parseCsvFile(
  file: File,
  availableLogos: Set<string>
): Promise<ParsedCsvResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (result) => {
        const missingLogos = new Set<string>();
        let date = "";
        let day = "";

        const games: GameData[] = result.data.map((row, idx) => {
          const homeTeam = pick(row, "timeCasa", "homeTeam", "Time Casa", "Casa", "mandante");
          const awayTeam = pick(row, "timeFora", "awayTeam", "Time Fora", "Fora", "visitante");

          if (homeTeam && !availableLogos.has(homeTeam)) missingLogos.add(homeTeam);
          if (awayTeam && !availableLogos.has(awayTeam)) missingLogos.add(awayTeam);

          if (!date) date = pick(row, "data", "date", "Data");
          if (!day) day = pick(row, "dia", "day", "Dia");

          return {
            id: `csv_${idx}_${Date.now()}`,
            league: pick(row, "liga", "league", "Liga", "campeonato"),
            time: pick(row, "horario", "time", "Horário", "hora"),
            homeTeam,
            awayTeam,
            homeOdd: pick(row, "oddCasa", "homeOdd", "Odd Casa"),
            awayOdd: pick(row, "oddFora", "awayOdd", "Odd Fora"),
            drawOdd: pick(row, "oddEmpate", "drawOdd", "Odd Empate")
          };
        });

        if (!day && date) day = inferDay(date);

        resolve({
          games,
          date,
          day,
          missingLogos: Array.from(missingLogos)
        });
      },
      error: (err) => reject(err)
    });
  });
}
