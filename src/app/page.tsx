import { SiteHeader } from "@/components/SiteHeader";
import { MonthCalendar } from "@/components/MonthCalendar";
import { listEvents } from "@/lib/events-store";

export default async function HomePage() {
  const events = await listEvents();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 max-w-2xl">
          <h1 className="font-serif text-3xl text-[#1c3d3a] sm:text-4xl">
            События и мероприятия
          </h1>
          <p className="mt-2 text-stone-600">
            Выберите день в календаре или событие из списка, чтобы увидеть
            подробности.
          </p>
        </div>
        <MonthCalendar initialEvents={events} />
      </main>
    </>
  );
}
