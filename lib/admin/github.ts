/**
 * Persistência via GitHub Contents API.
 * Cada gravação vira um commit no repositório — a Vercel
 * republica o site público automaticamente a cada push.
 */

const REPO = process.env.GITHUB_REPO ?? "Djonathan-DA/Ferreira-Veiculos";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const API = `https://api.github.com/repos/${REPO}/contents`;

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

export async function readFile(path: string) {
  const res = await fetch(`${API}/${path}?ref=${BRANCH}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub read ${path}: ${res.status}`);
  const json = (await res.json()) as { content: string; sha: string };
  return {
    text: Buffer.from(json.content, "base64").toString("utf-8"),
    sha: json.sha,
  };
}

export async function writeFile(
  path: string,
  contentBase64: string,
  message: string,
  sha?: string,
) {
  const res = await fetch(`${API}/${path}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub write ${path}: ${res.status} ${body.slice(0, 200)}`);
  }
  return res.json();
}

export async function writeJson(path: string, data: unknown, message: string) {
  let sha: string | undefined;
  try {
    sha = (await readFile(path)).sha;
  } catch {
    sha = undefined;
  }
  const b64 = Buffer.from(JSON.stringify(data, null, 2) + "\n").toString(
    "base64",
  );
  return writeFile(path, b64, message, sha);
}
