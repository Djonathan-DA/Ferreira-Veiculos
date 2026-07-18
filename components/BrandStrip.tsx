import { store } from "@/lib/config";

export function BrandStrip() {
  return (
    <section className="border-y border-white/8 bg-night-800/70 py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-[10px] font-bold tracking-[0.35em] text-white/40 uppercase">
          Trabalhamos com as principais marcas
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5">
          {store.brands.map((b) => (
            <span
              key={b}
              className="font-display text-xs font-semibold tracking-[0.18em] text-white/55 uppercase transition-colors hover:text-gold-400 sm:text-sm"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
