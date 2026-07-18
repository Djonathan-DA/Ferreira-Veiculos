import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ferreira Veículos | Seminovos em Águas Lindas de Goiás",
  description:
    "Ferreira Veículos: compra, venda e troca de carros seminovos em Águas Lindas de Goiás. Honda, Toyota, Volkswagen, Fiat, Jeep e muito mais. Nota 4,5 no Google. Fale com a gente no WhatsApp!",
  keywords: [
    "carros seminovos",
    "Águas Lindas de Goiás",
    "comprar carro",
    "Ferreira Veículos",
    "carros usados GO",
    "loja de carros",
  ],
  openGraph: {
    title: "Ferreira Veículos | Seminovos em Águas Lindas de Goiás",
    description:
      "Seminovos selecionados com procedência garantida. Nota 4,5 no Google. Fale com a gente no WhatsApp!",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/media/hero-poster.jpg", width: 1280, height: 720 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#06060a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${orbitron.variable}`}>
      <body>{children}</body>
    </html>
  );
}
