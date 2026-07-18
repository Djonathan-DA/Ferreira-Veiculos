/**
 * Recriação vetorial da identidade visual Ferreira Veículos:
 * silhueta de carro em ouro/prata + "FERREIRA" cromado + "VEÍCULOS" dourado.
 */

function SwooshDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      <linearGradient id={`${prefix}-gold`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffdf8a" />
        <stop offset="45%" stopColor="#f5a800" />
        <stop offset="100%" stopColor="#c07f00" />
      </linearGradient>
      <linearGradient id={`${prefix}-silver`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="55%" stopColor="#c9ccd6" />
        <stop offset="100%" stopColor="#7e8290" />
      </linearGradient>
    </defs>
  );
}

export function LogoMark({
  className,
  prefix = "lm",
}: {
  className?: string;
  prefix?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 110"
      className={className}
      role="img"
      aria-label="Ferreira Veículos"
    >
      <SwooshDefs prefix={prefix} />

      {/* bico dianteiro dourado */}
      <path
        d="M4 66 C26 42 58 28 92 24 C62 38 36 54 20 72 Z"
        fill={`url(#${prefix}-gold)`}
      />

      {/* curva do capô / teto em dourado */}
      <path
        d="M38 52 C112 8 216 2 302 44 C288 30 262 20 230 15 C160 4 86 22 38 52 Z"
        fill={`url(#${prefix}-gold)`}
      />

      {/* linha inferior prateada com retrovisor */}
      <path
        d="M56 82 C128 56 190 50 224 54 C231 43 245 36 256 38 C250 42 244 49 242 56 C276 60 302 70 318 84 C272 70 224 64 176 67 C132 70 92 76 56 82 Z"
        fill={`url(#${prefix}-silver)`}
      />

      {/* filete dourado inferior */}
      <path
        d="M10 88 C48 72 84 64 118 61 C82 72 48 82 26 94 Z"
        fill={`url(#${prefix}-gold)`}
        opacity="0.9"
      />
    </svg>
  );
}

export function Logo({
  variant = "stacked",
  className = "",
  prefix = "lg",
}: {
  variant?: "stacked" | "inline";
  className?: string;
  prefix?: string;
}) {
  if (variant === "inline") {
    return (
      <span className={`flex items-center gap-2.5 ${className}`}>
        <LogoMark prefix={`${prefix}-i`} className="h-8 w-auto shrink-0" />
        <span className="flex flex-col leading-none">
          <span className="text-chrome font-display text-[15px] font-extrabold tracking-[0.14em]">
            FERREIRA
          </span>
          <span className="text-gold-metal font-display mt-1 text-[9px] font-bold tracking-[0.42em]">
            VEÍCULOS
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={`flex flex-col items-center ${className}`}>
      <LogoMark prefix={`${prefix}-s`} className="h-16 w-auto sm:h-20" />
      <span className="text-chrome font-display mt-2 text-4xl font-extrabold tracking-[0.12em] sm:text-5xl md:text-6xl">
        FERREIRA
      </span>
      <span className="text-gold-metal font-display mt-2 text-base font-bold tracking-[0.5em] sm:text-lg md:text-xl">
        VEÍCULOS
      </span>
      <span className="gold-flare mt-3 w-56 sm:w-72 md:w-80" />
    </span>
  );
}
