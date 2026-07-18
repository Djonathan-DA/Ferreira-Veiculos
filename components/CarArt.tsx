import type { Vehicle } from "@/data/vehicles";

/**
 * Arte exibida quando o veículo ainda não tem foto cadastrada:
 * silhueta dourada do tipo de carroceria sobre fundo escuro da marca.
 * Para usar a foto real, preencha o campo `image` em data/vehicles.ts.
 */

const silhouettes: Record<Vehicle["body"], React.ReactNode> = {
  sedan: (
    <>
      <path d="M14 86 C20 74 34 70 48 68 L66 50 C86 34 116 30 144 36 C160 39 172 44 182 50 C202 54 222 62 234 72 C242 76 246 80 246 86" />
      <path d="M72 52 C90 38 118 34 142 39 L170 50" opacity="0.6" />
      <path d="M14 86 H52 M94 86 H174 M216 86 H246" />
      <circle cx="73" cy="86" r="13" />
      <circle cx="73" cy="86" r="5" />
      <circle cx="195" cy="86" r="13" />
      <circle cx="195" cy="86" r="5" />
    </>
  ),
  hatch: (
    <>
      <path d="M18 86 C24 74 36 70 50 68 L66 48 C84 34 112 30 136 34 C154 37 168 45 178 53 C198 59 214 66 224 74 C230 78 232 82 232 86" />
      <path d="M70 50 C86 38 112 34 134 38 L166 51" opacity="0.6" />
      <path d="M18 86 H54 M96 86 H168 M210 86 H236" />
      <circle cx="75" cy="86" r="13" />
      <circle cx="75" cy="86" r="5" />
      <circle cx="189" cy="86" r="13" />
      <circle cx="189" cy="86" r="5" />
    </>
  ),
  suv: (
    <>
      <path d="M14 84 C18 72 30 68 42 66 L54 44 C66 30 98 26 130 28 C158 30 176 37 188 46 C206 50 224 58 236 68 C244 72 248 78 248 84" />
      <path d="M60 46 C74 34 104 30 130 32 L182 47" opacity="0.6" />
      <path d="M14 84 H50 M92 84 H178 M220 84 H250" />
      <circle cx="71" cy="84" r="14" />
      <circle cx="71" cy="84" r="5.5" />
      <circle cx="199" cy="84" r="14" />
      <circle cx="199" cy="84" r="5.5" />
    </>
  ),
  picape: (
    <>
      <path d="M12 84 C16 74 26 70 38 68 L52 46 C62 34 84 30 106 32 C122 34 134 41 142 50 L148 55 L216 55 C230 55 238 62 242 70 L246 84" />
      <path d="M148 55 V72" opacity="0.6" />
      <path d="M58 48 C68 38 88 34 104 36 L136 51" opacity="0.6" />
      <path d="M12 84 H46 M88 84 H176 M218 84 H248" />
      <circle cx="67" cy="84" r="13" />
      <circle cx="67" cy="84" r="5" />
      <circle cx="197" cy="84" r="13" />
      <circle cx="197" cy="84" r="5" />
    </>
  ),
};

export function CarArt({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="bg-grid relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-night-600 via-night-700 to-night-800">
      {/* brilho dourado suave atrás da silhueta */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,179,1,0.14)_0%,transparent_65%)]" />

      <svg
        viewBox="0 0 260 120"
        className="relative h-[68%] w-auto text-gold-500/80"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {silhouettes[vehicle.body]}
      </svg>

      <span className="font-display absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[8px] font-semibold tracking-[0.35em] whitespace-nowrap text-white/25 uppercase">
        Ferreira Veículos
      </span>
    </div>
  );
}
