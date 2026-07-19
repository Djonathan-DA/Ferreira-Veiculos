import { NextResponse } from "next/server";
import { checkPassword, createSession, destroySession } from "@/lib/admin/auth";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as {
    password?: string;
  };
  if (!password || !checkPassword(password)) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
