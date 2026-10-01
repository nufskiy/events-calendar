"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { EventRecord } from "@/lib/types";

type Props = {
  initial?: EventRecord;
};

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [startDate, setStartDate] = useState(
    initial ? toLocalInput(initial.startDate) : "",
  );
  const [endDate, setEndDate] = useState(
    initial ? toLocalInput(initial.endDate) : "",
  );
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onFileChange(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка загрузки");
      setImageUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title,
      description,
      location,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      imageUrl: imageUrl || null,
    };

    const url = initial ? `/api/events/${initial.id}` : "/api/events";
    const method = initial ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка сохранения");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <label className="block space-y-1">
        <span className="text-sm font-medium text-stone-700">Название *</span>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#1c3d3a]"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-stone-700">Начало *</span>
          <input
            type="datetime-local"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#1c3d3a]"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-stone-700">Окончание *</span>
          <input
            type="datetime-local"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#1c3d3a]"
          />
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-stone-700">Место</span>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#1c3d3a]"
          placeholder="Адрес или площадка"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-stone-700">Описание</span>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#1c3d3a]"
        />
      </label>

      <div className="space-y-2">
        <span className="text-sm font-medium text-stone-700">Картинка</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading}
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-stone-600"
        />
        {uploading && (
          <p className="text-xs text-stone-500">Загрузка…</p>
        )}
        {imageUrl && (
          <p className="text-xs text-stone-500 break-all">Файл: {imageUrl}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-[#1c3d3a] px-5 py-2 text-sm font-medium text-white hover:bg-[#16302e] disabled:opacity-50"
        >
          {saving ? "Сохранение…" : initial ? "Сохранить" : "Создать"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-stone-200 px-5 py-2 text-sm hover:bg-stone-50"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
