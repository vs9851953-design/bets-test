import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-montserrat"
});

export const metadata: Metadata = {
  title: "Bet Designer",
  description: "Gerador automático de artes para bancas de apostas esportivas"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${bebas.variable} ${montserrat.variable} font-montserrat`}>
        {children}
      </body>
    </html>
  );
}
