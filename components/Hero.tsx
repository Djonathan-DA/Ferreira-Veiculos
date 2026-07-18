import { Logo } from "./Logo";
import { vehicles } from "@/data/vehicles";
import { StarHalfIcon, StarIcon, WhatsAppIcon, ArrowRightIcon } from "./Icons";
import { store } from "@/lib/config";

export function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-svh items-center justify-center overflow-hidden">
      {/* Backdrop cinematográfico (visível enquanto o vídeo carrega ou se ele não existir) */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#10141f_0%,#080a10_45%,#050507_100%)]" />
        {/* brilho dourado no “chão do showroom” */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_70%_45%_at_50%_100%,rgba(245,179,1,0.13)_0%,transparent_70%)]" />
        {/* silhueta gigante da marca ao fundo */}
        <svg
          viewBox="0 0 320 110"
          className="absolute top-1/2 left-1/2 w-[140%] max-w-none -translate-x-1/2 -translate-y-[60%] opacity-[0.05] sm:w-[100%]"
          fill="none"
          stroke="#f5b301"
          strokeWidth="1"
        >
          <path d="M4 66 C26 42 58 28 92 24 C62 38 36 54 20 72 Z" />
          <path d="M38 52 C112 8 216 2 302 44 C288 30 262 20 230 15 C160 4 86 22 38 52 Z" />
          <path d="M56 82 C128 56 190 50 224 54 C231 43 245 36 256 38 C250 42 244 49 242 56 C276 60 302 70 318 84 C272 70 224 64 176 67 C132 70 92 76 56 82 Z" />
        </svg>
      </div>

      {/* Vídeo de fundo com baixa opacidade */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        src="/media/hero.mp4"
        poster="/media/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Camadas de escurecimento para leitura confortável */}
      <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/45 to-night" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,6,10,0.55)_75%)]" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-28 pb-20 text-center sm:pt-32">
        <Logo variant="stacked" prefix="hero" className="animate-fade-up" />

        <p className="animate-fade-up-1 mt-7 max-w-2xl text-base text-white/75 sm:text-lg">
          Seminovos selecionados, procedência garantida e negociação transparente
          em <span className="font-semibold text-white">Águas Lindas de Goiás</span>.
          Seu próximo carro está aqui.
        </p>

        <div className="animate-fade-up-2 mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#estoque"
            className="glow-gold flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-7 py-3.5 text-sm font-bold tracking-wide text-night uppercase transition-transform hover:scale-[1.03]"
          >
            Ver estoque
            <ArrowRightIcon className="h-4 w-4" />
          </a>
          <a
            href={store.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold tracking-wide text-white uppercase backdrop-blur-sm transition-colors hover:border-gold-500/60 hover:text-gold-300"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            Falar no WhatsApp
          </a>
        </div>

        {/* Prova social do Google */}
        <div className="animate-fade-up-3 mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-2xl font-bold text-gold-400">
              {store.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="flex gap-0.5 text-gold-400">
                {[0, 1, 2, 3].map((i) => (
                  <StarIcon key={i} className="h-3.5 w-3.5" />
                ))}
                <StarHalfIcon className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs text-white/60">
                {store.reviewCount} avaliações no Google
              </span>
            </span>
          </div>
          <div className="hidden h-8 w-px bg-white/15 sm:block" />
          <div className="flex flex-col items-start leading-tight">
            <span className="font-display text-2xl font-bold text-gold-400">
              {vehicles.length}
            </span>
            <span className="text-xs text-white/60">veículos no estoque</span>
          </div>
          <div className="hidden h-8 w-px bg-white/15 sm:block" />
          <div className="flex flex-col items-start leading-tight">
            <span className="font-display text-2xl font-bold text-gold-400">
              100%
            </span>
            <span className="text-xs text-white/60">negociação no WhatsApp</span>
          </div>
        </div>
      </div>

      {/* indicador de rolagem */}
      <a
        href="#estoque"
        aria-label="Rolar para o estoque"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/50 transition-colors hover:text-gold-400"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
