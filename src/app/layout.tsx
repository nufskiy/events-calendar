import type { Metadata } from "next";
import { Literata, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const literata = Literata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Афиша — календарь событий",
  description: "Календарь анонсов мероприятий",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${literata.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f3efe8] font-sans text-stone-800">
        {children}
      </body>
    </html>
  );
}
