"use client";

import { useMemo, useState } from "react";
import { vehicles } from "@/data/vehicles";
import { VehicleCard } from "./VehicleCard";
import { SearchIcon, SlidersIcon, WhatsAppIcon } from "./Icons";
import { store } from "@/lib/config";

type SortKey = "destaque" | "menor-preco" | "maior-preco" | "menor-km" | "mais-novo";

const sortLabels: Record<SortKey, string> = {
  destaque: "Destaques primeiro",
  "menor-preco": "Menor preço",
  "maior-preco": "Maior preço",
  "menor-km": "Menor km",
  "mais-novo": "Mais novo",
};

const bodyLabels: Record<string, string> = {
  hatch: "Hatch",
  sedan: "Sedã",
  suv: "SUV",
  picape: "Picape",
};

const ALL = "Todas";

export function Catalog() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string>(ALL);
  const [sort, setSort] = useState<SortKey>("destaque");
  const [showFilters, setShowFilters] = useState(false);

  // filtros avançados — "conte sua necessidade"
  const [body, setBody] = useState<string>(ALL);
  const [fuel, setFuel] = useState<string>(ALL);
  const [transmission, setTransmission] = useState<string>(ALL);
  const [priceMax, setPriceMax] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [kmMax, setKmMax] = useState("");

  const brands = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.brand));
    return [ALL, ...Array.from(set).sort()];
  }, []);

  const bodies = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.body));
    return [ALL, ...Array.from(set)];
  }, []);

  const fuels = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.fuel).filter(Boolean) as string[]);
    return [ALL, ...Array.from(set).sort()];
  }, []);

  const transmissions = useMemo(() => {
    const set = new Set(
      vehicles.map((v) => v.transmission).filter(Boolean) as string[],
    );
    return [ALL, ...Array.from(set).sort()];
  }, []);

  const activeFilterCount = [
    body !== ALL,
    fuel !== ALL,
    transmission !== ALL,
    priceMax !== "",
    yearMin !== "",
    kmMax !== "",
  ].filter(Boolean).length;

  function clearFilters() {
    setBody(ALL);
    setFuel(ALL);
    setTransmission(ALL);
    setPriceMax("");
    setYearMin("");
    setKmMax("");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const priceMaxN = priceMax ? Number(priceMax) : null;
    const yearMinN = yearMin ? Number(yearMin) : null;
    const kmMaxN = kmMax ? Number(kmMax) : null;

    let list = vehicles.filter((v) => {
      const matchBrand = brand === ALL || v.brand === brand;
      const matchQuery =
        q === "" ||
        `${v.brand} ${v.model} ${v.year ?? ""} ${v.color ?? ""}`
          .toLowerCase()
          .includes(q);
      const matchBody = body === ALL || v.body === body;
      const matchFuel = fuel === ALL || v.fuel === fuel;
      const matchTransmission =
        transmission === ALL || v.transmission === transmission;
      const matchPrice =
        priceMaxN == null || v.price == null || v.price <= priceMaxN;
      const matchYear =
        yearMinN == null || !v.year || parseInt(v.year) >= yearMinN;
      const matchKm = kmMaxN == null || v.km == null || v.km <= kmMaxN;

      return (
        matchBrand &&
        matchQuery &&
        matchBody &&
        matchFuel &&
        matchTransmission &&
        matchPrice &&
        matchYear &&
        matchKm
      );
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
  }, [query, brand, sort, body, fuel, transmission, priceMax, yearMin, kmMax]);

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
            Conte o que você precisa — faixa de preço, ano, câmbio — e a gente
            filtra o estoque pra você.
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

          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors sm:w-auto ${
              showFilters || activeFilterCount > 0
                ? "border-gold-500 bg-gold-500/10 text-gold-300"
                : "border-white/10 bg-night-700 text-white/70 hover:border-gold-500/40"
            }`}
          >
            <SlidersIcon className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-night">
                {activeFilterCount}
              </span>
            )}
          </button>

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

        {/* Painel de filtros avançados — "diga sua necessidade" */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-night-700/70 p-4 sm:grid-cols-3 lg:grid-cols-6">
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-white/45 uppercase">
                Carroceria
              </span>
              <select
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold-500/60"
              >
                {bodies.map((b) => (
                  <option key={b} value={b}>
                    {b === ALL ? ALL : bodyLabels[b] ?? b}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-white/45 uppercase">
                Combustível
              </span>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold-500/60"
              >
                {fuels.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-white/45 uppercase">
                Câmbio
              </span>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold-500/60"
              >
                {transmissions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-white/45 uppercase">
                Preço até (R$)
              </span>
              <input
                inputMode="numeric"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value.replace(/\D/g, ""))}
                placeholder="Ex.: 60000"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-gold-500/60"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-white/45 uppercase">
                Ano a partir de
              </span>
              <input
                inputMode="numeric"
                value={yearMin}
                onChange={(e) => setYearMin(e.target.value.replace(/\D/g, ""))}
                placeholder="Ex.: 2018"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-gold-500/60"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-white/45 uppercase">
                Km até
              </span>
              <input
                inputMode="numeric"
                value={kmMax}
                onChange={(e) => setKmMax(e.target.value.replace(/\D/g, ""))}
                placeholder="Ex.: 80000"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-gold-500/60"
              />
            </label>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="col-span-2 mt-1 text-left text-xs font-semibold text-gold-400 hover:text-gold-300 sm:col-span-3 lg:col-span-6"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}

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
