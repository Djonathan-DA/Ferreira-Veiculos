import { reviews, store } from "@/lib/config";
import { StarHalfIcon, StarIcon } from "./Icons";

export function Reviews() {
  return (
    <section id="avaliacoes" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-bold tracking-[0.35em] text-gold-500 uppercase">
            Avaliações
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
            Quem comprou, <span className="text-gold-metal">recomenda</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
          {/* Nota do Google */}
          <div className="card-lift flex flex-col items-center justify-center rounded-2xl border border-gold-500/25 bg-gradient-to-b from-night-600 to-night-700 p-8 text-center">
            <span className="font-display text-6xl font-black text-gold-400">
              {store.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
            </span>
            <span className="mt-3 flex gap-1 text-gold-400">
              {[0, 1, 2, 3].map((i) => (
                <StarIcon key={i} className="h-5 w-5" />
              ))}
              <StarHalfIcon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm text-white/65">
              Nota média com base em{" "}
              <span className="font-semibold text-white">
                {store.reviewCount} avaliações
              </span>{" "}
              no Google
            </p>
            <a
              href={store.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 rounded-full border border-gold-500/50 px-5 py-2.5 text-xs font-bold tracking-wide text-gold-400 uppercase transition-colors hover:bg-gold-500 hover:text-night"
            >
              Ver no Google
            </a>
          </div>

          {/* Depoimentos reais do Google */}
          {reviews.map((r) => (
            <figure
              key={r.text}
              className="card-lift flex flex-col justify-between rounded-2xl border border-white/10 bg-night-700 p-8"
            >
              <div>
                <span className="flex gap-1 text-gold-400">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </span>
                <blockquote className="mt-5 text-lg leading-relaxed text-white/85">
                  “{r.text}”
                </blockquote>
              </div>
              <figcaption className="mt-6 text-xs tracking-wide text-white/45 uppercase">
                Avaliação no Google
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
