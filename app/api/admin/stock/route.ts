import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { readFile, writeJson } from "@/lib/admin/github";
import type { Vehicle } from "@/data/vehicles";

const PATH = "data/vehicles.json";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  try {
    const { text } = await readFile(PATH);
    return NextResponse.json(JSON.parse(text));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * Gravação por PATCH: o servidor lê o estado ATUAL do GitHub e mescla
 * apenas o veículo alterado (upsert) ou removido (delete).
 *
 * Isso impede que uma aba desatualizada regrave o arquivo inteiro e
 * desfaça alterações recentes feitas em outra aba/dispositivo — que era
 * o comportamento do formato antigo ({ vehicles: [...] }), agora rejeitado.
 */
export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as {
    action?: "upsert" | "delete";
    vehicle?: Vehicle;
    id?: string;
    vehicles?: unknown;
    message?: string;
  } | null;

  if (!body || Array.isArray(body.vehicles)) {
    return NextResponse.json(
      {
        error:
          "O painel foi atualizado — recarregue a página (Ctrl+Shift+R) e tente de novo.",
      },
      { status: 409 },
    );
  }

  if (body.action === "upsert") {
    const v = body.vehicle;
    if (!v?.id || !v.brand || !v.model || !v.body) {
      return NextResponse.json(
        { error: "Veículo sem id/marca/modelo/carroceria" },
        { status: 400 },
      );
    }
  } else if (body.action === "delete") {
    if (!body.id) {
      return NextResponse.json({ error: "Informe o id" }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }

  // lê → mescla → grava com o sha da mesma leitura; em conflito, tenta de novo
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { text, sha } = await readFile(PATH);
      const current = (JSON.parse(text) as { vehicles: Vehicle[] }).vehicles;

      let next: Vehicle[];
      if (body.action === "upsert") {
        const v = body.vehicle as Vehicle;
        next = current.some((x) => x.id === v.id)
          ? current.map((x) => (x.id === v.id ? v : x))
          : [...current, v];
      } else {
        next = current.filter((x) => x.id !== body.id);
      }

      await writeJson(
        PATH,
        { vehicles: next },
        body.message ?? "Atualização de estoque via painel admin",
        sha,
      );
      return NextResponse.json({ ok: true, vehicles: next });
    } catch (e) {
      const msg = String(e);
      // 409: outra gravação chegou entre a leitura e a escrita — remescla
      if (msg.includes("409") && attempt < 3) continue;
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }
  return NextResponse.json(
    { error: "Conflito de gravação — tente novamente." },
    { status: 409 },
  );
}
