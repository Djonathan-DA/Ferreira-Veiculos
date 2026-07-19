"use client";

import { useState } from "react";
import type { Vehicle, VehicleStatus } from "@/data/vehicles";

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

export function EditModal({
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
    s.trim() === ""
      ? undefined
      : Number(s.replace(/\./g, "").replace(",", "."));

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
              onChange={(e) => set({ body: e.target.value as Vehicle["body"] })}
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
              onChange={(e) => set({ status: e.target.value as VehicleStatus })}
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
