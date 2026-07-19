import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { writeFile } from "@/lib/admin/github";

/** Recebe a foto em base64 e commita em public/cars/<id>.jpg */
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as {
    id?: string;
    base64?: string;
  } | null;
  const id = (body?.id ?? "").replace(/[^a-z0-9-]/gi, "").toLowerCase();
  if (!id || !body?.base64 || body.base64.length > 6_000_000) {
    return NextResponse.json(
      { error: "Envie id e imagem (máx. ~4MB)" },
      { status: 400 },
    );
  }
  try {
    const path = `public/cars/${id}.jpg`;
    await writeFile(path, body.base64, `Foto do veículo ${id} via painel admin`);
    return NextResponse.json({ ok: true, image: `/cars/${id}.jpg` });
  } catch (e) {
    const msg = String(e);
    // arquivo já existe → precisa do sha; lê e regrava
    if (msg.includes("422")) {
      try {
        const { readFile } = await import("@/lib/admin/github");
        const { sha } = await readFile(`public/cars/${id}.jpg`);
        await writeFile(
          `public/cars/${id}.jpg`,
          body.base64,
          `Foto do veículo ${id} via painel admin`,
          sha,
        );
        return NextResponse.json({ ok: true, image: `/cars/${id}.jpg` });
      } catch (e2) {
        return NextResponse.json({ error: String(e2) }, { status: 500 });
      }
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
