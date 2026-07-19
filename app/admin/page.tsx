"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Vehicle, VehicleStatus } from "@/data/vehicles";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const BRL = (v?: number) =>
  v == null
    ? "—"
    : v.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      });

const STATUS_LABEL: Record<VehicleStatus, string> = {
  disponivel: "Disponível",
  negociacao: "Em negociação",
  vendido: "Vendido",
};

const STATUS_COLOR: Record<VehicleStatus, string> = {
  disponivel: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  negociacao: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  vendido: "bg-sky-500/15 text-sky-400 border-sky-500/30",
};

const EMPTY: Vehicle = {
  id: "",
  brand: "",
  model: "",
  body: "hatch",
  status: "disponivel",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ------------------------------------------------------------------ */
/*  Página                                                             */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [tab, setTab] = useState<"estoque" | "vendas">("estoque");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/stock");
    if (r.status === 401) return setAuthed(false);
    const j = await r.json();
    setVehicles(j.vehicles ?? []);
    setAuthed(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const notify = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 4000);
  };

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.ok) load();
    else setLoginError("Senha incorreta.");
  }

  async function persist(next: Vehicle[], message: string) {
    setBusy(true);
    const r = await fetch("/api/admin/stock", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicles: next, message }),
    });
    setBusy(false);
    if (r.ok) {
      setVehicles(next);
      notify("✓ Salvo! O site público atualiza em ~1 minuto.");
      return true;
    }
    const j = await r.json().catch(() => ({}));
    notify(`Erro ao salvar: ${j.error ?? r.status}`);
    return false;
  }

  /* ---------------- estatísticas ---------------- */
  const stats = useMemo(() => {
    const sold = vehicles.filter((v) => v.status === "vendido");
    const revenue = sold.reduce((s, v) => s + (v.soldPrice ?? v.price ?? 0), 0);
    const costSold = sold.reduce((s, v) => s + (v.cost ?? 0), 0);
    const costStock = vehicles
      .filter((v) => v.status !== "vendido")
      .reduce((s, v) => s + (v.cost ?? 0), 0);
    const byBrand = new Map<string, number>();
    const byModel = new Map<string, number>();
    for (const v of sold) {
      byBrand.set(v.brand, (byBrand.get(v.brand) ?? 0) + 1);
      const key = `${v.brand} ${v.model}`;
      byModel.set(key, (byModel.get(key) ?? 0) + 1);
    }
    const rank = (m: Map<string, number>) =>
      [...m.entries()].sort((a, b) => b[1] - a[1]);
    return {
      sold,
      revenue,
      costSold,
      profit: revenue - costSold,
      costStock,
      negotiating: vehicles.filter((v) => v.status === "negociacao").length,
      available: vehicles.filter(
        (v) => (v.status ?? "disponivel") === "disponivel",
      ).length,
      byBrand: rank(byBrand),
      byModel: rank(byModel),
    };
  }, [vehicles]);

  /* ---------------- telas ---------------- */

  if (authed === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0c] text-white/60">
        Carregando…
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0c] px-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/logo.png"
            alt="Ferreira Veículos"
            className="mx-auto mb-6 w-56"
          />
          <h1 className="mb-1 text-center text-lg font-bold text-white">
            Painel Administrativo
          </h1>
          <p className="mb-6 text-center text-sm text-white/50">
            Acesso restrito à equipe da loja
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            autoFocus
            className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
          {loginError && (
            <p className="mt-2 text-sm text-red-400">{loginError}</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-amber-400 py-3 font-bold text-black transition hover:bg-amber-300"
          >
            Entrar
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0c] pb-24 text-white">
      {/* topo */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0c]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/logo.png" alt="" className="h-9 w-auto" />
          <span className="hidden text-sm font-semibold tracking-widest text-white/40 uppercase sm:block">
            Painel
          </span>
          <nav className="ml-auto flex items-center gap-2">
            {(["estoque", "vendas"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === t
                    ? "bg-amber-400 text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {t === "estoque" ? "Estoque" : "Vendas & Relatórios"}
              </button>
            ))}
            <button
              onClick={async () => {
                await fetch("/api/admin/login", { method: "DELETE" });
                setAuthed(false);
              }}
              className="ml-2 text-sm text-white/40 hover:text-white"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-8">
        {tab === "estoque" ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-xl font-bold">
                Estoque{" "}
                <span className="text-sm font-normal text-white/40">
                  ({vehicles.length} veículos cadastrados)
                </span>
              </h1>
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

            <div className="grid gap-3">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.image ?? "/media/hero-poster.jpg"}
                    alt=""
                    className="h-16 w-24 rounded-lg object-cover"
                  />
                  <div className="min-w-40 flex-1">
                    <p className="font-bold">
                      {v.brand} {v.model}
                    </p>
                    <p className="text-sm text-white/50">
                      {[v.year, v.color, v.km != null ? `${v.km} km` : null]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40">Preço / Custo</p>
                    <p className="text-sm font-semibold text-amber-300">
                      {BRL(v.price)}{" "}
                      <span className="text-white/40">/ {BRL(v.cost)}</span>
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLOR[v.status ?? "disponivel"]}`}
                  >
                    {STATUS_LABEL[v.status ?? "disponivel"]}
                    {v.status === "vendido" && v.soldPrice
                      ? ` · ${BRL(v.soldPrice)}`
                      : ""}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditing({ ...v });
                      }}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10"
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          confirm(
                            `Excluir ${v.brand} ${v.model} definitivamente? (se foi vendido, prefira marcar como "Vendido" para manter o histórico)`,
                          )
                        ) {
                          await persist(
                            vehicles.filter((x) => x.id !== v.id),
                            `Remove veículo ${v.brand} ${v.model}`,
                          );
                        }
                      }}
                      className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-6 text-xl font-bold">Vendas & Relatórios</h1>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {[
                ["Total faturado", BRL(stats.revenue), "text-emerald-400"],
                ["Custo (vendidos)", BRL(stats.costSold), "text-red-300"],
                ["Lucro", BRL(stats.profit), "text-amber-300"],
                ["Vendidos", String(stats.sold.length), "text-sky-300"],
                ["Em negociação", String(stats.negotiating), "text-orange-300"],
                ["Disponíveis", String(stats.available), "text-white"],
              ].map(([label, value, color]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-xs text-white/40">{label}</p>
                  <p className={`mt-1 text-lg font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {(
                [
                  ["Marcas que mais vendem", stats.byBrand],
                  ["Modelos que mais vendem", stats.byModel],
                ] as const
              ).map(([title, list]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <h2 className="mb-3 font-bold">{title}</h2>
                  {list.length === 0 ? (
                    <p className="text-sm text-white/40">
                      Nenhuma venda registrada ainda. Marque um carro como
                      &quot;Vendido&quot; na aba Estoque.
                    </p>
                  ) : (
                    <ol className="space-y-2">
                      {list.map(([name, count], i) => (
                        <li
                          key={name}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="w-5 text-white/40">{i + 1}º</span>
                          <span className="flex-1">{name}</span>
                          <span className="font-bold text-amber-300">
                            {count} {count === 1 ? "venda" : "vendas"}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-3 font-bold">Histórico de vendas</h2>
              {stats.sold.length === 0 ? (
                <p className="text-sm text-white/40">Nenhuma venda ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="text-xs text-white/40 uppercase">
                      <tr>
                        <th className="pb-2">Veículo</th>
                        <th className="pb-2">Data</th>
                        <th className="pb-2 text-right">Custo</th>
                        <th className="pb-2 text-right">Venda</th>
                        <th className="pb-2 text-right">Lucro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.sold.map((v) => {
                        const sale = v.soldPrice ?? v.price ?? 0;
                        return (
                          <tr key={v.id} className="border-t border-white/5">
                            <td className="py-2.5">
                              {v.brand} {v.model} {v.year ?? ""}
                            </td>
                            <td className="py-2.5 text-white/60">
                              {v.soldDate ?? "—"}
                            </td>
                            <td className="py-2.5 text-right text-white/60">
                              {BRL(v.cost)}
                            </td>
                            <td className="py-2.5 text-right">{BRL(sale)}</td>
                            <td className="py-2.5 text-right font-semibold text-emerald-400">
                              {BRL(sale - (v.cost ?? 0))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* modal de edição */}
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

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-[#16161a] px-5 py-3 text-sm shadow-2xl">
          {toast}
        </div>
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal de edição / cadastro                                         */
/* ------------------------------------------------------------------ */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-white/50">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-amber-400";

function EditModal({
  vehicle,
  isNew,
  busy,
  onClose,
  onSave,
}: {
  vehicle: Vehicle;
  isNew: boolean;
  busy: boolean;
  onClose: () => void;
  onSave: (v: Vehicle) => void;
}) {
  const [v, setV] = useState<Vehicle>(vehicle);
  const [uploading, setUploading] = useState(false);
  const set = (patch: Partial<Vehicle>) => setV((p) => ({ ...p, ...patch }));

  const num = (s: string) =>
    s.trim() === "" ? undefined : Number(s.replace(/\./g, "").replace(",", "."));

  async function handlePhoto(file: File) {
    const id = v.id || slugify(`${v.brand} ${v.model}`);
    if (!id) return alert("Preencha marca e modelo antes da foto.");
    setUploading(true);
    const b64 = await new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res((r.result as string).split(",")[1]);
      r.readAsDataURL(file);
    });
    const resp = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, base64: b64 }),
    });
    setUploading(false);
    const j = await resp.json().catch(() => ({}));
    if (resp.ok) set({ id: v.id || id, image: j.image });
    else alert(`Erro no upload: ${j.error ?? resp.status}`);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#101014] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {isNew ? "Adicionar veículo" : `Editar ${vehicle.model}`}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            ✕ Fechar
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Field label="Marca *">
            <input
              className={inputCls}
              value={v.brand}
              onChange={(e) => set({ brand: e.target.value })}
            />
          </Field>
          <Field label="Modelo *">
            <input
              className={inputCls}
              value={v.model}
              onChange={(e) => set({ model: e.target.value })}
            />
          </Field>
          <Field label="Ano">
            <input
              className={inputCls}
              value={v.year ?? ""}
              placeholder="2019"
              onChange={(e) => set({ year: e.target.value || undefined })}
            />
          </Field>
          <Field label="Preço de venda (R$)">
            <input
              className={inputCls}
              inputMode="numeric"
              value={v.price ?? ""}
              placeholder="45000"
              onChange={(e) => set({ price: num(e.target.value) })}
            />
          </Field>
          <Field label="Custo de aquisição (R$)">
            <input
              className={inputCls}
              inputMode="numeric"
              value={v.cost ?? ""}
              placeholder="38000"
              onChange={(e) => set({ cost: num(e.target.value) })}
            />
          </Field>
          <Field label="Quilometragem">
            <input
              className={inputCls}
              inputMode="numeric"
              value={v.km ?? ""}
              placeholder="60000"
              onChange={(e) => set({ km: num(e.target.value) })}
            />
          </Field>
          <Field label="Combustível">
            <select
              className={inputCls}
              value={v.fuel ?? ""}
              onChange={(e) => set({ fuel: e.target.value || undefined })}
            >
              <option value="">—</option>
              {["Flex", "Gasolina", "Diesel", "Híbrido", "Elétrico"].map(
                (f) => (
                  <option key={f}>{f}</option>
                ),
              )}
            </select>
          </Field>
          <Field label="Câmbio">
            <select
              className={inputCls}
              value={v.transmission ?? ""}
              onChange={(e) =>
                set({ transmission: e.target.value || undefined })
              }
            >
              <option value="">—</option>
              {["Manual", "Automático", "CVT"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Cor">
            <input
              className={inputCls}
              value={v.color ?? ""}
              onChange={(e) => set({ color: e.target.value || undefined })}
            />
          </Field>
          <Field label="Carroceria *">
            <select
              className={inputCls}
              value={v.body}
              onChange={(e) =>
                set({ body: e.target.value as Vehicle["body"] })
              }
            >
              {["hatch", "sedan", "suv", "picape"].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select
              className={inputCls}
              value={v.status ?? "disponivel"}
              onChange={(e) =>
                set({ status: e.target.value as VehicleStatus })
              }
            >
              <option value="disponivel">Disponível</option>
              <option value="negociacao">Em negociação</option>
              <option value="vendido">Vendido</option>
            </select>
          </Field>
          <Field label="Destaque na vitrine">
            <select
              className={inputCls}
              value={v.featured ? "sim" : "nao"}
              onChange={(e) => set({ featured: e.target.value === "sim" })}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </Field>

          {v.status === "vendido" && (
            <>
              <Field label="Valor da venda (R$)">
                <input
                  className={inputCls}
                  inputMode="numeric"
                  value={v.soldPrice ?? ""}
                  placeholder="47000"
                  onChange={(e) => set({ soldPrice: num(e.target.value) })}
                />
              </Field>
              <Field label="Data da venda">
                <input
                  type="date"
                  className={inputCls}
                  value={v.soldDate ?? ""}
                  onChange={(e) =>
                    set({ soldDate: e.target.value || undefined })
                  }
                />
              </Field>
            </>
          )}

          <Field label="Selos (separados por vírgula)">
            <input
              className={inputCls}
              value={(v.badges ?? []).join(", ")}
              placeholder="Único dono, Revisado"
              onChange={(e) =>
                set({
                  badges: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </Field>
          <Field label="Foto">
            <div className="flex items-center gap-3">
              {v.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={v.image}
                  alt=""
                  className="h-10 w-14 rounded object-cover"
                />
              )}
              <label className="cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/10">
                {uploading ? "Enviando…" : "Enviar foto"}
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handlePhoto(f);
                  }}
                />
              </label>
            </div>
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            disabled={busy || uploading}
            onClick={() => {
              if (!v.brand || !v.model)
                return alert("Marca e modelo são obrigatórios.");
              onSave({ ...v, id: v.id || slugify(`${v.brand} ${v.model}`) });
            }}
            className="rounded-xl bg-amber-400 px-6 py-2.5 text-sm font-bold text-black hover:bg-amber-300 disabled:opacity-50"
          >
            {busy ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
