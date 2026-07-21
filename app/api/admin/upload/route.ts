import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { readFile, writeFile } from "@/lib/admin/github";

/**
 * Recebe uma foto em base64 e commita em public/cars/.
 * Cada veículo pode ter várias fotos: <id>-1.jpg, <id>-2.jpg, ...
 * (o campo "index" define qual posição da galeria está sendo enviada/substituída).
 */
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as {
    id?: string;
    index?: number;
    base64?: string;
  } | null;
  const id = (body?.id ?? "").replace(/[^a-z0-9-]/gi, "").toLowerCase();
  const index = Math.max(1, Math.floor(body?.index ?? 1));
  if (!id || !body?.base64 || body.base64.length > 6_000_000) {
    return NextResponse.json(
      { error: "Envie id e imagem (máx. ~4MB)" },
      { status: 400 },
    );
  }

  const path = `public/cars/${id}-${index}.jpg`;
  const message = `Foto ${index} do veículo ${id} via painel admin`;

  try {
    await writeFile(path, body.base64, message);
    return NextResponse.json({ ok: true, image: `/cars/${id}-${index}.jpg` });
  } catch (e) {
    // arquivo já existe → precisa do sha; lê e regrava
    if (String(e).includes("422")) {
      try {
        const { sha } = await readFile(path);
        await writeFile(path, body.base64, message, sha);
        return NextResponse.json({
          ok: true,
          image: `/cars/${id}-${index}.jpg`,
        });
      } catch (e2) {
        return NextResponse.json({ error: String(e2) }, { status: 500 });
      }
    }
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
