"use client";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EventRecord } from "@/lib/types";

type Props = {
  events: EventRecord[];
};

export function AdminEventList({ events }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Удалить событие?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Не удалось удалить");
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-stone-300 bg-white/50 p-8 text-center text-stone-500">
        Пока нет событий.{" "}
        <Link href="/admin/events/new" className="text-[#1c3d3a] underline">
          Добавить первое
        </Link>
      </p>
    );
  }

  return (
    <ul className="divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 bg-white">
      {events.map((ev) => (
        <li
          key={ev.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium text-[#1c3d3a]">{ev.title}</p>
            <p className="text-xs text-stone-500">
              {format(parseISO(ev.startDate), "d MMM yyyy, HH:mm", {
                locale: ru,
              })}
              {" — "}
              {format(parseISO(ev.endDate), "d MMM yyyy, HH:mm", { locale: ru })}
              {ev.location ? ` · ${ev.location}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/admin/events/${ev.id}/edit`}
              className="rounded-full border border-stone-200 px-3 py-1.5 text-sm hover:bg-stone-50"
            >
              Изменить
            </Link>
            <button
              type="button"
              disabled={deletingId === ev.id}
              onClick={() => remove(ev.id)}
              className="rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Удалить
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
