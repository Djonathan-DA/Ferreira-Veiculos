"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Vehicle } from "@/data/vehicles";

/* ------------------------------------------------------------------ */
/*  Contexto de dados do painel                                        */
/* ------------------------------------------------------------------ */

type AdminCtx = {
  vehicles: Vehicle[];
  busy: boolean;
  persist: (next: Vehicle[], message: string) => Promise<boolean>;
  reload: () => Promise<void>;
};

const Ctx = createContext<AdminCtx | null>(null);

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin fora do AdminShell");
  return ctx;
}

export const BRL = (v?: number) =>
  v == null
    ? "—"
    : v.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      });

/* ------------------------------------------------------------------ */
/*  Shell: autenticação + navegação + toast                            */
/* ------------------------------------------------------------------ */

const NAV = [
  { href: "/admin", label: "Início", icon: "◫" },
  { href: "/admin/estoque", label: "Estoque", icon: "🚗" },
  { href: "/admin/financeiro", label: "Financeiro", icon: "📈" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const reload = useCallback(async () => {
    const r = await fetch("/api/admin/stock");
    if (r.status === 401) {
      setAuthed(false);
      return;
    }
    const j = await r.json();
    setVehicles(j.vehicles ?? []);
    setAuthed(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const notify = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 4000);
  };

  const persist = useCallback(
    async (next: Vehicle[], message: string) => {
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
    },
    [],
  );

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.ok) reload();
    else setLoginError("Senha incorreta.");
  }

  if (authed === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0c]">
        <div className="flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/logo.png" alt="" className="w-48 animate-pulse" />
          <p className="text-sm text-white/40">Carregando painel…</p>
        </div>
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
    <Ctx.Provider value={{ vehicles, busy, persist, reload }}>
      <div className="min-h-screen bg-[#0a0a0c] text-white">
        {/* topo */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0c]/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logo.png" alt="" className="h-9 w-auto" />
            <nav className="ml-auto flex items-center gap-1">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      active
                        ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
              <button
                onClick={async () => {
                  await fetch("/api/admin/login", { method: "DELETE" });
                  setAuthed(false);
                }}
                className="ml-2 rounded-full px-3 py-2 text-sm text-white/40 transition hover:bg-white/5 hover:text-white"
              >
                Sair
              </button>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 pt-8 pb-24">{children}</div>

        {toast && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-[#16161a] px-5 py-3 text-sm shadow-2xl">
            {toast}
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}
