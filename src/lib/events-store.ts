import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { EventInput, EventRecord } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "events.json");

async function ensureStore(): Promise<EventRecord[]> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as EventRecord[];
  } catch {
    const empty: EventRecord[] = [];
    await fs.writeFile(DATA_FILE, JSON.stringify(empty, null, 2), "utf-8");
    return empty;
  }
}

async function save(events: EventRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), "utf-8");
}

export async function listEvents(options?: {
  from?: string;
  to?: string;
}): Promise<EventRecord[]> {
  const events = await ensureStore();
  let filtered = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  if (options?.from) {
    const from = new Date(options.from).getTime();
    filtered = filtered.filter(
      (e) => new Date(e.endDate).getTime() >= from,
    );
  }
  if (options?.to) {
    const to = new Date(options.to).getTime();
    filtered = filtered.filter(
      (e) => new Date(e.startDate).getTime() <= to,
    );
  }

  return filtered;
}

export async function getEvent(id: string): Promise<EventRecord | null> {
  const events = await ensureStore();
  return events.find((e) => e.id === id) ?? null;
}

export async function createEvent(input: EventInput): Promise<EventRecord> {
  const events = await ensureStore();
  const now = new Date().toISOString();
  const record: EventRecord = {
    id: uuidv4(),
    title: input.title.trim(),
    description: input.description.trim(),
    location: input.location.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    imageUrl: input.imageUrl ?? null,
    createdAt: now,
    updatedAt: now,
  };
  events.push(record);
  await save(events);
  return record;
}

export async function updateEvent(
  id: string,
  input: EventInput,
): Promise<EventRecord | null> {
  const events = await ensureStore();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return null;

  const updated: EventRecord = {
    ...events[index],
    title: input.title.trim(),
    description: input.description.trim(),
    location: input.location.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    imageUrl: input.imageUrl ?? null,
    updatedAt: new Date().toISOString(),
  };
  events[index] = updated;
  await save(events);
  return updated;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const events = await ensureStore();
  const next = events.filter((e) => e.id !== id);
  if (next.length === events.length) return false;
  await save(next);
  return true;
}
