"use client";

import { useMemo, useState } from "react";
import { coverOf, type Vehicle, type VehicleStatus } from "@/data/vehicles";
import { BRL, useAdmin } from "@/components/admin/shell";
import { EditModal } from "@/components/admin/EditModal";

const EMPTY: Vehicle = {
  id: "",
  brand: "",
  model: "",
  body: "hatch",
  status: "disponivel",
};

const STATUS_LABEL: Record<VehicleStatus, string> = {
  disponivel: "Disponível",
  negociacao: "Em negociação",
  vendido: "Vendido",
};

const STATUS_CHIP: Record<VehicleStatus, string> = {
  disponivel: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  negociacao: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  vendido: "bg-sky-500/15 text-sky-400 border-sky-500/30",
};

type Filter = "todos" | VehicleStatus;

export default function EstoquePage() {
  const { vehicles, busy, persist } = useAdmin();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [isNew, setIsNew] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      const okStatus =
        filter === "todos" || (v.status ?? "disponivel") === filter;
      const okQuery =
        !q ||
        `${v.brand} ${v.model} ${v.year ?? ""} ${v.color ?? ""}`
          .toLowerCase()
          .includes(q);
      return okStatus && okQuery;
    });
  }, [vehicles, query, filter]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      todos: vehicles.length,
      disponivel: 0,
      negociacao: 0,
      vendido: 0,
    };
    for (const v of vehicles) c[(v.status ?? "disponivel") as VehicleStatus]++;
    return c;
  }, [vehicles]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Estoque</h1>
          <p className="text-sm text-white/40">
            Adicione, edite, venda ou remova veículos do site
          </p>
        </div>
        <button
          onClick={() => {
            setIsNew(true);
            setEditing({ ...EMPTY });
          }}
          className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-black hover:bg-amber-300"
        >
          + Adicionar veículo
        </button>
      </div>

      {/* busca + filtros */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por modelo, marca, ano ou cor…"
          className="w-full max-w-xs rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-amber-400"
        />
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["todos", "Todos"],
              ["disponivel", "Disponíveis"],
              ["negociacao", "Em negociação"],
              ["vendido", "Vendidos"],
            ] as [Filter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                filter === key
                  ? "bg-white text-black"
                  : "border border-white/15 text-white/60 hover:bg-white/5"
              }`}
            >
              {label} ({counts[key]})
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="py-16 text-center text-white/40">
          Nenhum veículo encontrado com esses filtros.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => (
            <article
              key={v.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl hover:shadow-black/40"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverOf(v) ?? "/media/hero-poster.jpg"}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                />
                <span
                  className={`absolute top-3 left-3 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur ${STATUS_CHIP[v.status ?? "disponivel"]}`}
                >
                  {STATUS_LABEL[v.status ?? "disponivel"]}
                </span>
                {v.featured && (
                  <span className="absolute top-3 right-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-black">
                    ★ Destaque
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold">
                  {v.brand} {v.model}
                </h3>
                <p className="mt-0.5 text-xs text-white/45">
                  {[v.year, v.color, v.km != null ? `${v.km} km` : null]
                    .filter(Boolean)
                    .join(" · ") || "sem detalhes"}
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] tracking-wide text-white/35 uppercase">
                      {v.status === "vendido" ? "Vendido por" : "Preço"}
                    </p>
                    <p className="font-bold text-amber-300">
                      {v.status === "vendido"
                        ? BRL(v.soldPrice ?? v.price)
                        : BRL(v.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-right text-[10px] tracking-wide text-white/35 uppercase">
                      Custo
                    </p>
                    <p className="text-sm text-white/60">{BRL(v.cost)}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setEditing({ ...v });
                    }}
                    className="flex-1 rounded-lg border border-white/15 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    Editar
                  </button>
                  {v.status !== "vendido" && (
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditing({
                          ...v,
                          status: "vendido",
                          soldPrice: v.soldPrice ?? v.price,
                          soldDate:
                            v.soldDate ??
                            new Date().toISOString().slice(0, 10),
                        });
                      }}
                      className="flex-1 rounded-lg bg-emerald-600/90 py-2 text-sm font-semibold hover:bg-emerald-500"
                    >
                      Vender ✓
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      if (
                        confirm(
                          `Excluir ${v.brand} ${v.model} definitivamente? (se foi vendido, prefira o status "Vendido" para manter o histórico)`,
                        )
                      ) {
                        await persist(
                          vehicles.filter((x) => x.id !== v.id),
                          `Remove veículo ${v.brand} ${v.model}`,
                        );
                      }
                    }}
                    className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <EditModal
          vehicle={editing}
          isNew={isNew}
          busy={busy}
          onClose={() => setEditing(null)}
          onSave={async (v) => {
            const next = isNew
              ? [...vehicles, v]
              : vehicles.map((x) => (x.id === v.id ? v : x));
            const ok = await persist(
              next,
              `${isNew ? "Adiciona" : "Atualiza"} ${v.brand} ${v.model} via painel admin`,
            );
            if (ok) setEditing(null);
          }}
        />
      )}
    </>
  );
}
