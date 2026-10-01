import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200/80 bg-[#faf8f5]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex flex-col gap-0.5">
          <span className="font-serif text-xl tracking-tight text-[#1c3d3a] sm:text-2xl">
            Афиша
          </span>
          <span className="text-xs text-stone-500 group-hover:text-stone-600">
            календарь событий
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-stone-600 transition hover:bg-stone-100 hover:text-[#1c3d3a]"
          >
            Календарь
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-[#1c3d3a] px-3 py-1.5 text-white transition hover:bg-[#16302e]"
          >
            Админка
          </Link>
        </nav>
      </div>
    </header>
  );
}
