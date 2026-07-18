"use client";

import { useMemo, useState } from "react";
import { vehicles } from "@/data/vehicles";
import { VehicleCard } from "./VehicleCard";
import { SearchIcon, WhatsAppIcon } from "./Icons";
import { store } from "@/lib/config";

type SortKey = "destaque" | "menor-preco" | "maior-preco" | "menor-km" | "mais-novo";

const sortLabels: Record<SortKey, string> = {
  destaque: "Destaques primeiro",
  "menor-preco": "Menor preço",
  "maior-preco": "Maior preço",
  "menor-km": "Menor km",
  "mais-novo": "Mais novo",
};

export function Catalog() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string>("Todas");
  const [sort, setSort] = useState<SortKey>("destaque");

  const brands = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.brand));
    return ["Todas", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = vehicles.filter((v) => {
      const matchBrand = brand === "Todas" || v.brand === brand;
      const matchQuery =
        q === "" ||
        `${v.brand} ${v.model} ${v.year ?? ""} ${v.color ?? ""}`
          .toLowerCase()
          .includes(q);
      return matchBrand && matchQuery;
    });

    switch (sort) {
      case "menor-preco":
        list = [...list].sort(
          (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
        );
        break;
      case "maior-preco":
        list = [...list].sort(
          (a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity),
        );
        break;
      case "menor-km":
        list = [...list].sort(
          (a, b) => (a.km ?? Infinity) - (b.km ?? Infinity),
        );
        break;
      case "mais-novo":
        list = [...list].sort((a, b) =>
          (b.year ?? "").localeCompare(a.year ?? ""),
        );
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
        );
    }

    return list;
  }, [query, brand, sort]);

  return (
    <section id="estoque" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-bold tracking-[0.35em] text-gold-500 uppercase">
            Estoque
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
            Encontre o seu <span className="text-gold-metal">próximo carro</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/60 sm:text-base">
            Filtre por marca, busque pelo modelo e fale direto com a nossa equipe
            no WhatsApp para fechar negócio.
          </p>
        </div>

        {/* Busca + ordenação */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-white/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por modelo, marca, ano ou cor…"
              className="w-full rounded-xl border border-white/10 bg-night-700 py-3 pr-4 pl-11 text-sm text-white placeholder-white/35 outline-none transition-colors focus:border-gold-500/60"
            />
          </label>

          <label className="sm:w-52">
            <span className="sr-only">Ordenar por</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-night-700 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-gold-500/60"
            >
              {(Object.keys(sortLabels) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {sortLabels[k]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Filtro de marcas */}
        <div className="scroll-thin mt-4 flex gap-2 overflow-x-auto pb-2">
          {brands.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrand(b)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors ${
                brand === b
                  ? "border-gold-500 bg-gold-500 text-night"
                  : "border-white/15 bg-white/[0.03] text-white/65 hover:border-gold-500/50 hover:text-gold-300"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs text-white/45">
          {filtered.length}{" "}
          {filtered.length === 1 ? "veículo encontrado" : "veículos encontrados"}
        </p>

        {/* Grade de veículos */}
        {filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-white/15 bg-night-700/50 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-white">
              Nenhum veículo encontrado com esses filtros.
            </p>
            <p className="mt-2 max-w-md text-sm text-white/55">
              Nosso estoque muda toda semana — chame no WhatsApp e conte o que
              você procura. A gente encontra pra você.
            </p>
            <a
              href={store.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-b from-[#2ee06f] to-[#1faa52] px-6 py-3 text-sm font-bold text-night"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Quero encomendar meu carro
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
