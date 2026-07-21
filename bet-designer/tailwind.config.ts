import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        panel: "#111319",
        panelBorder: "#23262f",
        accent: "#5865f2"
      },
      fontFamily: {
        bebas: ["var(--font-bebas)"],
        montserrat: ["var(--font-montserrat)"]
      }
    }
  },
  plugins: []
};

export default config;
