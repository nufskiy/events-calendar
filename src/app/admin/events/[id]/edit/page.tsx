import Link from "next/link";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/EventForm";
import { SiteHeader } from "@/components/SiteHeader";
import { getEvent } from "@/lib/events-store";

type Props = { params: Promise<{ id: string }> };

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/admin"
          className="mb-4 inline-block text-sm text-stone-500 hover:text-[#1c3d3a]"
        >
          ← К списку
        </Link>
        <h1 className="mb-6 font-serif text-2xl text-[#1c3d3a]">
          Редактирование
        </h1>
        <EventForm initial={event} />
      </main>
    </>
  );
}
