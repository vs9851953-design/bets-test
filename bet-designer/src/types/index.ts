// Tipos centrais do Bet Designer.
// Nada de posições fixas no código: tudo que é geometria vem do layout.json da banca.

export type TemplateId = "combo" | "solo";

export interface BankConfig {
  name: string;
  primary: string;
  secondary: string;
  website: string;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextSpec {
  x: number;
  y: number;
  fontSize: number;
  fontFamily?: string;
  fill?: string;
}

export interface GameSlotLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  league: { x: number; y: number; fontSize: number };
  time: { x: number; y: number; fontSize: number };
  homeLogo: Box;
  awayLogo: Box;
  homeName: { x: number; y: number; fontSize: number };
  awayName: { x: number; y: number; fontSize: number };
  odd: { x: number; y: number; fontSize: number; fontFamily?: string };
  playerSlot: Box;
}

export interface TemplateLayout {
  canvas: { width: number; height: number };
  logo: Box;
  title: TextSpec;
  date: TextSpec;
  day: TextSpec;
  games: GameSlotLayout[];
}

export interface TemplateEntry {
  image: string; // caminho público do PNG de fundo
  layout: TemplateLayout | null;
}

export interface Bank {
  id: string;
  config: BankConfig;
  logo: string | null;
  templates: Partial<Record<TemplateId, TemplateEntry>>;
}

export interface PlayerAsset {
  name: string;
  team: string;
  src: string;
}

export interface Manifest {
  generatedAt: string;
  banks: Bank[];
  logos: Record<string, string>; // nome do time -> caminho do escudo
  players: Record<string, PlayerAsset[]>; // nome do time -> jogadores
}

// Um jogo importado do CSV / preenchido manualmente
export interface GameData {
  id: string;
  league: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeOdd: string;
  awayOdd: string;
  drawOdd?: string;
}

// Linha crua do CSV gerado por IA
export interface CsvRow {
  liga?: string;
  league?: string;
  horario?: string;
  time?: string;
  timeCasa?: string;
  homeTeam?: string;
  timeFora?: string;
  awayTeam?: string;
  oddCasa?: string;
  homeOdd?: string;
  oddFora?: string;
  awayOdd?: string;
  oddEmpate?: string;
  drawOdd?: string;
  data?: string;
  date?: string;
  dia?: string;
  day?: string;
  [key: string]: string | undefined;
}

export type CanvasElementType = "player" | "logo" | "text" | "image";

// Elemento livre e manipulável no canvas (jogadores, escudos soltos, textos extras)
export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  src?: string; // para player/logo/image
  text?: string; // para text
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  zIndex: number;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  locked?: boolean;
}
