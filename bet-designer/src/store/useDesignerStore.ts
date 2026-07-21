import { create } from "zustand";
import type {
  Bank,
  CanvasElement,
  GameData,
  Manifest,
  TemplateId
} from "@/types";

let uid = 0;
const nextId = (prefix: string) => `${prefix}_${Date.now()}_${uid++}`;

interface DesignerState {
  manifest: Manifest | null;
  loadingManifest: boolean;

  selectedBankId: string | null;
  selectedTemplate: TemplateId;
  date: string;
  day: string;
  games: GameData[];
  elements: CanvasElement[];
  selectedElementId: string | null;

  // derived helpers
  getSelectedBank: () => Bank | null;

  // setup
  setManifest: (m: Manifest) => void;
  setLoadingManifest: (v: boolean) => void;

  // top-level controls
  selectBank: (id: string) => void;
  selectTemplate: (t: TemplateId) => void;
  setDate: (d: string) => void;
  setDay: (d: string) => void;

  // games
  setGames: (games: GameData[]) => void;
  updateGame: (id: string, patch: Partial<GameData>) => void;
  addEmptyGame: () => void;
  removeGame: (id: string) => void;

  // free elements (jogadores, escudos avulsos, textos)
  addElement: (el: Omit<CanvasElement, "id" | "zIndex">) => string;
  updateElement: (id: string, patch: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  selectElement: (id: string | null) => void;

  addPlayerToCanvas: (name: string, team: string, src: string) => void;

  resetDesign: () => void;
}

export const useDesignerStore = create<DesignerState>((set, get) => ({
  manifest: null,
  loadingManifest: false,

  selectedBankId: null,
  selectedTemplate: "combo",
  date: "",
  day: "",
  games: [],
  elements: [],
  selectedElementId: null,

  getSelectedBank: () => {
    const { manifest, selectedBankId } = get();
    if (!manifest || !selectedBankId) return null;
    return manifest.banks.find((b) => b.id === selectedBankId) ?? null;
  },

  setManifest: (m) => {
    set({ manifest: m });
    // seleciona a primeira banca automaticamente, se ainda nada selecionado
    const { selectedBankId } = get();
    if (!selectedBankId && m.banks.length > 0) {
      set({ selectedBankId: m.banks[0].id });
    }
  },
  setLoadingManifest: (v) => set({ loadingManifest: v }),

  selectBank: (id) => set({ selectedBankId: id }),
  selectTemplate: (t) => set({ selectedTemplate: t }),
  setDate: (d) => set({ date: d }),
  setDay: (d) => set({ day: d }),

  setGames: (games) => set({ games }),
  updateGame: (id, patch) =>
    set((s) => ({
      games: s.games.map((g) => (g.id === id ? { ...g, ...patch } : g))
    })),
  addEmptyGame: () =>
    set((s) => ({
      games: [
        ...s.games,
        {
          id: nextId("game"),
          league: "",
          time: "",
          homeTeam: "",
          awayTeam: "",
          homeOdd: "",
          awayOdd: ""
        }
      ]
    })),
  removeGame: (id) =>
    set((s) => ({ games: s.games.filter((g) => g.id !== id) })),

  addElement: (el) => {
    const id = nextId(el.type);
    set((s) => ({
      elements: [
        ...s.elements,
        { ...el, id, zIndex: s.elements.length }
      ],
      selectedElementId: id
    }));
    return id;
  },
  updateElement: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((e) => (e.id === id ? { ...e, ...patch } : e))
    })),
  removeElement: (id) =>
    set((s) => ({
      elements: s.elements.filter((e) => e.id !== id),
      selectedElementId: s.selectedElementId === id ? null : s.selectedElementId
    })),
  duplicateElement: (id) =>
    set((s) => {
      const el = s.elements.find((e) => e.id === id);
      if (!el) return s;
      const copy: CanvasElement = {
        ...el,
        id: nextId(el.type),
        x: el.x + 24,
        y: el.y + 24,
        zIndex: s.elements.length
      };
      return { elements: [...s.elements, copy], selectedElementId: copy.id };
    }),
  bringToFront: (id) =>
    set((s) => {
      const maxZ = Math.max(0, ...s.elements.map((e) => e.zIndex));
      return {
        elements: s.elements.map((e) =>
          e.id === id ? { ...e, zIndex: maxZ + 1 } : e
        )
      };
    }),
  sendToBack: (id) =>
    set((s) => {
      const minZ = Math.min(0, ...s.elements.map((e) => e.zIndex));
      return {
        elements: s.elements.map((e) =>
          e.id === id ? { ...e, zIndex: minZ - 1 } : e
        )
      };
    }),
  selectElement: (id) => set({ selectedElementId: id }),

  addPlayerToCanvas: (name, team, src) => {
    const { addElement } = get();
    addElement({
      type: "player",
      src,
      x: 440,
      y: 900,
      width: 220,
      height: 300,
      scaleX: 1,
      scaleY: 1,
      rotation: 0
    });
  },

  resetDesign: () =>
    set({
      games: [],
      elements: [],
      selectedElementId: null,
      date: "",
      day: ""
    })
}));
