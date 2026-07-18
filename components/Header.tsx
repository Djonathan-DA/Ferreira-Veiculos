"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./Icons";
import { store } from "@/lib/config";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#estoque", label: "Estoque" },
  { href: "#a-loja", label: "A Loja" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-white/10 bg-night/90 backdrop-blur-md"
          : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#inicio" aria-label="Ferreira Veículos — início">
          <Logo variant="inline" prefix="hd" />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-gold-400"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={store.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-gold hidden items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-4 py-2 text-sm font-semibold text-night transition-transform hover:scale-[1.03] sm:flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg border border-white/10 md:hidden"
          >
            <span
              className={`h-0.5 w-5 bg-gold-400 transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-5 bg-gold-400 transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 bg-gold-400 transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-night/95 px-4 pb-4 backdrop-blur-md md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/5 py-3 text-sm font-medium text-white/80 hover:text-gold-400"
            >
              {l.label}
            </a>
          ))}
          <a
            href={store.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-4 py-2.5 text-sm font-semibold text-night"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Falar no WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
