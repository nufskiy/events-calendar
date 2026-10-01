import Link from "next/link";
import { AdminEventList } from "@/components/AdminEventList";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { SiteHeader } from "@/components/SiteHeader";
import { listEvents } from "@/lib/events-store";

export default async function AdminPage() {
  const events = await listEvents();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl text-[#1c3d3a]">Админка</h1>
            <p className="text-sm text-stone-500">
              Создание и редактирование анонсов
            </p>
          </div>
          <div className="flex items-center gap-4">
            <AdminLogoutButton />
            <Link
              href="/admin/events/new"
              className="rounded-full bg-[#c45c26] px-4 py-2 text-sm font-medium text-white hover:bg-[#a84d1f]"
            >
              + Новое событие
            </Link>
          </div>
        </div>
        <AdminEventList events={events} />
        <p className="mt-8 text-xs text-stone-400">
          REST API для ботов: GET/POST{" "}
          <code className="rounded bg-stone-100 px-1">/api/events</code>, PUT/DELETE{" "}
          <code className="rounded bg-stone-100 px-1">/api/events/[id]</code>{" "}
          (запись требует cookie сессии или позже — API-ключ).
        </p>
      </main>
    </>
  );
}
