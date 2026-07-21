// Escaneia public/banks, public/logos e public/players e gera public/manifest.json
// Rodado automaticamente antes de `dev` e `build` (ver package.json).
// Isso é o que permite adicionar bancas/escudos/jogadores apenas copiando arquivos,
// sem precisar alterar nenhuma linha de código.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const BANKS_DIR = path.join(PUBLIC_DIR, "banks");
const LOGOS_DIR = path.join(PUBLIC_DIR, "logos");
const PLAYERS_DIR = path.join(PUBLIC_DIR, "players");

const IMAGE_EXT = new Set([".png", ".webp", ".jpg", ".jpeg"]);

function safeReaddir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true });
}

function isImage(name) {
  return IMAGE_EXT.has(path.extname(name).toLowerCase());
}

function buildBanks() {
  const banks = [];
  for (const entry of safeReaddir(BANKS_DIR)) {
    if (!entry.isDirectory()) continue;
    const id = entry.name;
    const dir = path.join(BANKS_DIR, id);
    const configPath = path.join(dir, "config.json");
    if (!fs.existsSync(configPath)) {
      console.warn(`[manifest] Banca "${id}" ignorada: config.json ausente.`);
      continue;
    }
    let config;
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (e) {
      console.warn(`[manifest] Banca "${id}" ignorada: config.json inválido.`);
      continue;
    }

    const files = fs.readdirSync(dir);
    const hasLogo = files.includes("logo.png");
    const templates = {};

    for (const tpl of ["combo", "solo"]) {
      const pngName = `${tpl}.png`;
      const layoutName = `${tpl}.layout.json`;
      if (files.includes(pngName)) {
        let layout = null;
        const layoutPath = path.join(dir, layoutName);
        if (fs.existsSync(layoutPath)) {
          try {
            layout = JSON.parse(fs.readFileSync(layoutPath, "utf-8"));
          } catch (e) {
            console.warn(`[manifest] Layout inválido em ${id}/${layoutName}`);
          }
        }
        templates[tpl] = {
          image: `/banks/${id}/${pngName}`,
          layout
        };
      }
    }

    banks.push({
      id,
      config,
      logo: hasLogo ? `/banks/${id}/logo.png` : null,
      templates
    });
  }
  return banks.sort((a, b) => a.id.localeCompare(b.id));
}

function buildLogos() {
  const logos = {};
  for (const entry of safeReaddir(LOGOS_DIR)) {
    if (entry.isFile() && isImage(entry.name)) {
      const teamName = path.basename(entry.name, path.extname(entry.name));
      logos[teamName] = `/logos/${entry.name}`;
    }
  }
  return logos;
}

function buildPlayers() {
  const players = {};
  for (const teamEntry of safeReaddir(PLAYERS_DIR)) {
    if (!teamEntry.isDirectory()) continue;
    const team = teamEntry.name;
    const teamDir = path.join(PLAYERS_DIR, team);
    const list = [];
    for (const fileEntry of safeReaddir(teamDir)) {
      if (fileEntry.isFile() && isImage(fileEntry.name)) {
        const playerName = path.basename(fileEntry.name, path.extname(fileEntry.name));
        list.push({
          name: playerName,
          team,
          src: `/players/${team}/${fileEntry.name}`
        });
      }
    }
    if (list.length) {
      players[team] = list.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  return players;
}

const manifest = {
  generatedAt: new Date().toISOString(),
  banks: buildBanks(),
  logos: buildLogos(),
  players: buildPlayers()
};

fs.writeFileSync(
  path.join(PUBLIC_DIR, "manifest.json"),
  JSON.stringify(manifest, null, 2)
);

console.log(
  `[manifest] OK — ${manifest.banks.length} banca(s), ${
    Object.keys(manifest.logos).length
  } escudo(s), ${Object.keys(manifest.players).length} time(s) com jogadores.`
);
