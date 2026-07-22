"use client";

import { useState } from "react";
import type { Vehicle, VehicleStatus } from "@/data/vehicles";
import { photosOf } from "@/data/vehicles";

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
  const [v, setV] = useState<Vehicle>({
    ...vehicle,
    images: photosOf(vehicle),
  });
  const [uploading, setUploading] = useState(false);
  const set = (patch: Partial<Vehicle>) => setV((p) => ({ ...p, ...patch }));

  const num = (s: string) =>
    s.trim() === ""
      ? undefined
      : Number(s.replace(/\./g, "").replace(",", "."));

  async function uploadOne(id: string, index: number, file: File) {
    const b64 = await new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res((r.result as string).split(",")[1]);
      r.readAsDataURL(file);
    });
    const resp = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, index, base64: b64 }),
    });
    const j = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(j.error ?? String(resp.status));
    return j.image as string;
  }

  async function handlePhotos(files: FileList) {
    const id = v.id || slugify(`${v.brand} ${v.model}`);
    if (!id) return alert("Preencha marca e modelo antes da foto.");
    setUploading(true);
    try {
      const current = v.images ?? [];
      const uploaded: string[] = [];
      for (let i = 0; i < files.length; i++) {
        // sufixo por carimbo de tempo: nunca colide com fotos existentes
        const image = await uploadOne(id, Date.now() + i, files[i]);
        uploaded.push(image);
      }
      set({ id: v.id || id, images: [...current, ...uploaded] });
    } catch (e) {
      alert(`Erro no upload: ${e}`);
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(index: number) {
    const next = (v.images ?? []).filter((_, i) => i !== index);
    set({ images: next });
  }

  function movePhoto(index: number, dir: -1 | 1) {
    const imgs = [...(v.images ?? [])];
    const target = index + dir;
    if (target < 0 || target >= imgs.length) return;
    [imgs[index], imgs[target]] = [imgs[target], imgs[index]];
    set({ images: imgs });
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
          <Field label="Versão / motor">
            <input
              className={inputCls}
              value={v.version ?? ""}
              placeholder="1.0 Turbo Flex"
              onChange={(e) => set({ version: e.target.value || undefined })}
            />
          </Field>
          <Field label="Portas">
            <select
              className={inputCls}
              value={v.doors ?? ""}
              onChange={(e) =>
                set({ doors: e.target.value ? Number(e.target.value) : undefined })
              }
            >
              <option value="">—</option>
              <option value="2">2</option>
              <option value="4">4</option>
            </select>
          </Field>
          <Field label="Direção">
            <select
              className={inputCls}
              value={v.steering ?? ""}
              onChange={(e) => set({ steering: e.target.value || undefined })}
            >
              <option value="">—</option>
              {["Mecânica", "Hidráulica", "Elétrica"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Aceita troca">
            <select
              className={inputCls}
              value={
                v.acceptsTrade == null ? "" : v.acceptsTrade ? "sim" : "nao"
              }
              onChange={(e) =>
                set({
                  acceptsTrade:
                    e.target.value === "" ? undefined : e.target.value === "sim",
                })
              }
            >
              <option value="">—</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
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
        </div>

        <div className="mt-4">
          <Field label="Descrição (aparece na página de detalhes do carro)">
            <textarea
              className={`${inputCls} min-h-24 resize-y`}
              value={v.description ?? ""}
              placeholder="Conte a história do carro: revisões feitas, itens de série, motivo da venda, condições de pagamento..."
              onChange={(e) =>
                set({ description: e.target.value || undefined })
              }
            />
          </Field>
        </div>

        {/* Galeria de fotos */}
        <div className="mt-4">
          <span className="mb-2 block text-xs font-semibold text-white/50">
            Fotos ({(v.images ?? []).length})
          </span>
          <div className="flex flex-wrap gap-3">
            {(v.images ?? []).map((src, i) => (
              <div
                key={src + i}
                className="group relative h-20 w-28 overflow-hidden rounded-lg border border-white/15"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 rounded bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold text-black">
                    Capa
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/60 py-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    title="Mover para a esquerda"
                    onClick={() => movePhoto(i, -1)}
                    className="px-1.5 text-xs text-white hover:text-amber-300"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    title="Remover"
                    onClick={() => removePhoto(i)}
                    className="px-1.5 text-xs text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    title="Mover para a direita"
                    onClick={() => movePhoto(i, 1)}
                    className="px-1.5 text-xs text-white hover:text-amber-300"
                  >
                    →
                  </button>
                </div>
              </div>
            ))}

            <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/20 text-center text-xs text-white/50 hover:border-amber-400 hover:text-amber-300">
              {uploading ? (
                "Enviando…"
              ) : (
                <>
                  <span className="text-lg leading-none">+</span>
                  Adicionar
                  <br />
                  foto(s)
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  if (e.target.files?.length) handlePhotos(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <p className="mt-2 text-[11px] text-white/35">
            A primeira foto é usada como capa nos cards do site. Use as setas
            para reordenar.
          </p>
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
              const id = v.id || slugify(`${v.brand} ${v.model}`);
              const images = v.images ?? [];
              onSave({
                ...v,
                id,
                images,
                image: images[0] ?? v.image,
              });
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
