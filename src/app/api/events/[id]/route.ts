import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteEvent, getEvent, updateEvent } from "@/lib/events-store";
import { parseEventBody } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const event = await getEvent(id);
  if (!event) {
    return NextResponse.json({ error: "Событие не найдено" }, { status: 404 });
  }
  return NextResponse.json({ event });
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { id } = await context.params;
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

  const event = await updateEvent(id, parsed.data);
  if (!event) {
    return NextResponse.json({ error: "Событие не найдено" }, { status: 404 });
  }
  return NextResponse.json({ event });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { id } = await context.params;
  const ok = await deleteEvent(id);
  if (!ok) {
    return NextResponse.json({ error: "Событие не найдено" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
