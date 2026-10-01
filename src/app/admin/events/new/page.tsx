import Link from "next/link";
import { EventForm } from "@/components/EventForm";
import { SiteHeader } from "@/components/SiteHeader";

export default function NewEventPage() {
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
          Новое событие
        </h1>
        <EventForm />
      </main>
    </>
  );
}
