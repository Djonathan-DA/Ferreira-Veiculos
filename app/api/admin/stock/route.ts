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

export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as {
    vehicles?: Vehicle[];
    message?: string;
  } | null;
  if (!body || !Array.isArray(body.vehicles)) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }
  for (const v of body.vehicles) {
    if (!v.id || !v.brand || !v.model || !v.body) {
      return NextResponse.json(
        { error: "Veículo sem id/marca/modelo/carroceria" },
        { status: 400 },
      );
    }
  }
  try {
    await writeJson(
      PATH,
      { vehicles: body.vehicles },
      body.message ?? "Atualização de estoque via painel admin",
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
