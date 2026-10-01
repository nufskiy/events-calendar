import type { EventInput } from "./types";

export type ValidationResult =
  | { ok: true; data: EventInput }
  | { ok: false; error: string };

export function parseEventBody(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Некорректное тело запроса" };
  }
  const raw = body as Record<string, unknown>;

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const description =
    typeof raw.description === "string" ? raw.description.trim() : "";
  const location =
    typeof raw.location === "string" ? raw.location.trim() : "";
  const startDate =
    typeof raw.startDate === "string" ? raw.startDate : "";
  const endDate = typeof raw.endDate === "string" ? raw.endDate : "";
  const imageUrl =
    raw.imageUrl === null || raw.imageUrl === undefined
      ? null
      : typeof raw.imageUrl === "string"
        ? raw.imageUrl.trim() || null
        : null;

  if (!title) return { ok: false, error: "Укажите название" };
  if (!startDate || !endDate) {
    return { ok: false, error: "Укажите даты начала и окончания" };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { ok: false, error: "Некорректный формат даты" };
  }
  if (end < start) {
    return { ok: false, error: "Дата окончания не может быть раньше начала" };
  }

  return {
    ok: true,
    data: {
      title,
      description,
      location,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      imageUrl,
    },
  };
}
