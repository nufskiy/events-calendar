import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createEvent, listEvents } from "@/lib/events-store";
import { parseEventBody } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  const events = await listEvents({ from, to });
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const parsed = parseEventBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const event = await createEvent(parsed.data);
  return NextResponse.json({ event }, { status: 201 });
}
