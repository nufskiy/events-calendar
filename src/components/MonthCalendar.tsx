"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ru } from "date-fns/locale";
import { useMemo, useState } from "react";
import { eventsForDay } from "@/lib/event-utils";
import type { EventRecord } from "@/lib/types";
import { EventDetailModal } from "./EventDetailModal";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

type Props = {
  initialEvents: EventRecord[];
};

export function MonthCalendar({ initialEvents }: Props) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [events] = useState(initialEvents);
  const [selected, setSelected] = useState<EventRecord | null>(null);

  const days = useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(cursor);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [cursor]);

  const monthLabel = format(cursor, "LLLL yyyy", { locale: ru });

  return (
    <>
      <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl capitalize text-[#1c3d3a]">
            {monthLabel}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCursor((m) => subMonths(m, 1))}
              className="rounded-full border border-stone-200 px-3 py-1.5 text-sm hover:bg-stone-50"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setCursor(startOfMonth(new Date()))}
              className="rounded-full border border-stone-200 px-3 py-1.5 text-sm hover:bg-stone-50"
            >
              Сегодня
            </button>
            <button
              type="button"
              onClick={() => setCursor((m) => addMonths(m, 1))}
              className="rounded-full border border-stone-200 px-3 py-1.5 text-sm hover:bg-stone-50"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-stone-100 bg-stone-100">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="bg-stone-50 px-1 py-2 text-center text-xs font-medium uppercase tracking-wide text-stone-500"
            >
              {d}
            </div>
          ))}
          {days.map((day) => {
            const inMonth = isSameMonth(day, cursor);
            const today = isSameDay(day, new Date());
            const dayEvents = eventsForDay(events, day);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[88px] bg-white p-1.5 sm:min-h-[100px] sm:p-2 ${
                  inMonth ? "" : "bg-stone-50/80"
                }`}
              >
                <div
                  className={`mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                    today
                      ? "bg-[#c45c26] font-semibold text-white"
                      : inMonth
                        ? "text-stone-800"
                        : "text-stone-400"
                  }`}
                >
                  {format(day, "d")}
                </div>
                <ul className="space-y-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <li key={ev.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(ev)}
                        className="w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium leading-tight text-[#1c3d3a] hover:bg-[#e8f0ef] sm:text-xs"
                        title={ev.title}
                      >
                        <span
                          className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#c45c26]"
                          aria-hidden
                        />
                        {ev.title}
                      </button>
                    </li>
                  ))}
                  {dayEvents.length > 3 && (
                    <li className="px-1 text-[10px] text-stone-400">
                      +{dayEvents.length - 3}
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <section className="mt-8">
        <h3 className="mb-4 font-serif text-xl text-[#1c3d3a]">
          Ближайшие события
        </h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {events
            .filter((e) => parseISO(e.endDate) >= new Date())
            .slice(0, 6)
            .map((ev) => (
              <li key={ev.id}>
                <button
                  type="button"
                  onClick={() => setSelected(ev)}
                  className="flex w-full flex-col rounded-xl border border-stone-200/80 bg-white p-4 text-left transition hover:border-[#1c3d3a]/30 hover:shadow-md"
                >
                  <span className="font-medium text-[#1c3d3a]">{ev.title}</span>
                  <span className="mt-1 text-xs text-[#c45c26]">
                    {format(parseISO(ev.startDate), "d MMM yyyy", {
                      locale: ru,
                    })}
                    {ev.location ? ` · ${ev.location}` : ""}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      </section>

      <EventDetailModal event={selected} onClose={() => setSelected(null)} />
    </>
  );
}
