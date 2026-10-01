import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SEC,
  createSessionToken,
  validateSessionToken,
} from "./session";

export {
  SESSION_COOKIE as sessionCookieName,
  SESSION_MAX_AGE_SEC,
  createSessionToken,
  validateSessionToken,
};

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin";
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  return validateSessionToken(token);
}

export const sessionCookieOptions = {
  name: SESSION_COOKIE,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SEC,
};
