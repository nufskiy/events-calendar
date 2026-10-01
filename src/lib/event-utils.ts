import {
  eachDayOfInterval,
  endOfDay,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";
import type { EventRecord } from "./types";

export function eventCoversDay(event: EventRecord, day: Date): boolean {
  const start = startOfDay(parseISO(event.startDate));
  const end = endOfDay(parseISO(event.endDate));
  return isWithinInterval(startOfDay(day), { start, end });
}

export function eventsForDay(
  events: EventRecord[],
  day: Date,
): EventRecord[] {
  return events.filter((e) => eventCoversDay(e, day));
}

export function daysSpannedByEvent(event: EventRecord): Date[] {
  const start = startOfDay(parseISO(event.startDate));
  const end = startOfDay(parseISO(event.endDate));
  if (end < start) return [start];
  return eachDayOfInterval({ start, end });
}
