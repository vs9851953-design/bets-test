# Bet Designer

Sistema web que substitui o Photoshop na criação de artes para bancas de apostas esportivas.
Gera PNGs automaticamente a partir de templates, usando Next.js 15 + React + TypeScript +
Konva.js (canvas) + Zustand (estado) + React Hook Form. Sem banco de dados — tudo roda no
navegador, hospedável 100% no Vercel.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

`npm run dev` e `npm run build` disparam automaticamente `npm run generate-manifest`, que
escaneia `public/banks`, `public/logos` e `public/players` e gera `public/manifest.json`.
É esse manifesto (estático, sem banco de dados) que o front-end lê para montar a sidebar,
o seletor de banca/template e a busca de jogadores/escudos.

## Deploy no Vercel

Basta importar o repositório no Vercel — o `prebuild` já cuida de gerar o manifesto antes
de cada build. Nenhuma configuração adicional é necessária.

## Como adicionar coisas sem tocar em código

### Nova banca
Crie uma pasta em `public/banks/<id-da-banca>/` contendo:
- `config.json` — `{ "name", "primary", "secondary", "website" }`
- `combo.png` e/ou `solo.png` — os templates (fundo da arte)
- `combo.layout.json` e/ou `solo.layout.json` — posições de cada elemento (ver abaixo)
- `logo.png` (opcional) — logo da banca

Faça um novo deploy (ou rode `npm run dev` de novo) e a banca aparece automaticamente no
seletor da sidebar.

### Novo escudo de time
Copie um PNG para `public/logos/<Nome do Time>.png`. O nome do arquivo (sem extensão) é o
nome que deve bater com a coluna de time no CSV.

### Novo jogador
Copie um PNG para `public/players/<Nome do Time>/<Nome do Jogador>.png`. Ele passa a
aparecer automaticamente na busca de jogadores da sidebar.

Nada disso exige alterar uma linha de código — só copiar arquivos e gerar um novo build.

## Arquivo de layout (`*.layout.json`)

Cada template tem seu próprio arquivo de posições. Nenhuma coordenada fica fixa no código —
tudo é lido daqui:

```jsonc
{
  "canvas": { "width": 1080, "height": 1350 },
  "logo": { "x": 30, "y": 1250, "width": 160, "height": 80 },
  "title": { "x": 50, "y": 60, "fontSize": 64, "fontFamily": "Bebas Neue", "fill": "#FFFFFF" },
  "date": { "x": 800, "y": 70, "fontSize": 32 },
  "day": { "x": 800, "y": 110, "fontSize": 28 },
  "games": [
    {
      "x": 60, "y": 260, "width": 960, "height": 220,
      "league": { "x": 20, "y": 10, "fontSize": 22 },
      "time": { "x": 880, "y": 10, "fontSize": 22 },
      "homeLogo": { "x": 60, "y": 50, "width": 100, "height": 100 },
      "awayLogo": { "x": 800, "y": 50, "width": 100, "height": 100 },
      "homeName": { "x": 60, "y": 160, "fontSize": 24 },
      "awayName": { "x": 700, "y": 160, "fontSize": 24 },
      "odd": { "x": 460, "y": 90, "fontSize": 48 },
      "playerSlot": { "x": 400, "y": 20, "width": 160, "height": 220 }
    }
  ]
}
```

O template `combo` normalmente tem vários itens em `games`; o `solo` tem apenas um.

## Estrutura do projeto

```
public/
  banks/<id>/config.json, combo.png, solo.png, logo.png, *.layout.json
  logos/<Time>.png
  players/<Time>/<Jogador>.png
  manifest.json        (gerado automaticamente, não editar à mão)

src/
  app/                 App Router (page.tsx, layout.tsx com Bebas Neue + Montserrat via next/font)
  components/          Sidebar, Canvas, Toolbar, GameCard, Player, Logo, CsvImporter,
                        PlayerSearch, GamesEditor, TemplateLoader, DraggableAsset
  lib/                 csvParser.ts, exportPng.ts
  store/               useDesignerStore.ts (Zustand)
  types/               index.ts
scripts/
  generate-manifest.mjs
```

## Fluxo de uso

1. Escolha a banca e o template (combo/solo) na sidebar.
2. Preencha data/dia manualmente ou importe um CSV — ele preenche liga, horário, times,
   odds, data e dia automaticamente. Se um escudo não for encontrado em `public/logos`,
   um aviso amarelo aparece indicando qual time falta.
3. Pesquise jogadores e clique para adicioná-los ao canvas.
4. Arraste, redimensione e gire os jogadores (Transformer do Konva) usando a barra de
   ferramentas flutuante (frente/trás/duplicar/excluir/escala/rotação).
5. Clique em **Gerar PNG** para exportar a arte na resolução original do template, com
   transparência preservada.

## CSV esperado

Cabeçalhos aceitos (PT ou EN, case-sensitive no valor, header helper é tolerante):
`liga/league`, `horario/time`, `timeCasa/homeTeam`, `timeFora/awayTeam`,
`oddCasa/homeOdd`, `oddFora/awayOdd`, `oddEmpate/drawOdd`, `data/date`, `dia/day`.

## Assets de demonstração

Este repositório inclui 3 bancas (`celeste`, `verde`, `vermelho`), 4 escudos e alguns
jogadores **gerados como placeholders** só para você ver o fluxo funcionando de ponta a
ponta. Troque os PNGs em `public/banks/*/combo.png` e `solo.png` pelos templates reais
exportados do Photoshop (mantendo o mesmo tamanho/canvas) e ajuste os `*.layout.json`
com as coordenadas reais de cada elemento.
