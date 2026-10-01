"use client";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import Image from "next/image";
import type { EventRecord } from "@/lib/types";

type Props = {
  event: EventRecord | null;
  onClose: () => void;
};

export function EventDetailModal({ event, onClose }: Props) {
  if (!event) return null;

  const start = parseISO(event.startDate);
  const end = parseISO(event.endDate);
  const sameDay =
    format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd");
  const dateLabel = sameDay
    ? format(start, "d MMMM yyyy", { locale: ru })
    : `${format(start, "d MMM", { locale: ru })} — ${format(end, "d MMM yyyy", { locale: ru })}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#faf8f5] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {event.imageUrl && (
          <div className="relative aspect-[16/9] w-full bg-stone-200">
            <Image
              src={event.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 512px) 100vw, 512px"
            />
          </div>
        )}
        <div className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-2xl text-[#1c3d3a]">{event.title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full p-2 text-stone-500 hover:bg-stone-200/60"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>
          <p className="text-sm font-medium text-[#c45c26]">{dateLabel}</p>
          {event.location && (
            <p className="text-sm text-stone-600">
              <span className="text-stone-400">Место: </span>
              {event.location}
            </p>
          )}
          {event.description && (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
