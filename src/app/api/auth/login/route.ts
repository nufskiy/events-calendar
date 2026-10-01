import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const password = body.password ?? "";
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieOptions.name, token, {
    httpOnly: sessionCookieOptions.httpOnly,
    sameSite: sessionCookieOptions.sameSite,
    secure: sessionCookieOptions.secure,
    path: sessionCookieOptions.path,
    maxAge: sessionCookieOptions.maxAge,
  });
  return response;
}
