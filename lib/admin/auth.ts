import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "fv_admin";
const DAY = 24 * 60 * 60 * 1000;

function secret() {
  const pwd = process.env.ADMIN_PASSWORD ?? "";
  return createHmac("sha256", "fv-session-v1").update(pwd).digest();
}

function sign(exp: number) {
  const mac = createHmac("sha256", secret())
    .update(String(exp))
    .digest("base64url");
  return `${exp}.${mac}`;
}

export function checkPassword(pwd: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(pwd);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession() {
  const exp = Date.now() + 7 * DAY;
  (await cookies()).set(COOKIE, sign(exp), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function isAuthenticated() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const [expStr] = raw.split(".");
  const exp = Number(expStr);
  if (!exp || exp < Date.now()) return false;
  const expected = sign(exp);
  const a = Buffer.from(raw);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}
