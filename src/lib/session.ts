function getSecret(): string {
  return process.env.SESSION_SECRET ?? "dev-insecure-secret-change-me";
}

const MAX_AGE_MS = 60 * 60 * 24 * 7 * 1000;

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSign(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toHex(sig);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + MAX_AGE_MS;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const signature = await hmacSign(payload);
  return `${payload}.${signature}`;
}

export async function validateSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = await hmacSign(payload);
  if (!timingSafeEqualHex(signature, expected)) return false;
  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    ) as { exp: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;
