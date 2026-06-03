import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SectionHeader } from "@/components/SectionHeader";
import { BookRail } from "@/components/BookRail";
import booksData from "@/data/books.json";
import type { Book } from "@/types/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home – Golden Reads" },
      {
        name: "description",
        content: "Trending books, best sellers, new releases and personalised picks on Golden Reads.",
      },
    ],
  }),
  component: HomePage,
});

const books = booksData as Book[];

function byGenre(g: string) {
  return books.filter((b) => b.genre.includes(g));
}

const sections: { title: string; href: string; books: Book[] }[] = [
  { title: "Trending Now", href: "/discover", books: books.slice(0, 10) },
  { title: "Best Sellers", href: "/discover", books: [...books].sort((a, b) => b.rating - a.rating).slice(0, 10) },
  { title: "New Releases", href: "/discover", books: [...books].reverse().slice(0, 10) },
  { title: "Recommended For You", href: "/discover", books: books.slice(4, 14) },
  { title: "Technology Books", href: "/discover", books: byGenre("Technology") },
  { title: "Business Books", href: "/discover", books: byGenre("Business") },
  { title: "Fiction Collection", href: "/discover", books: byGenre("Fiction") },
  { title: "Audiobooks", href: "/discover", books: books.filter((b) => b.formats.includes("audio")).slice(0, 10) },
];

function HomePage() {
  return (
    <AppShell>
      <div className="px-5 pt-4 pb-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Welcome back, Amara
        </p>
        <h1 className="font-display text-2xl font-semibold mt-1">
          What will you read today?
        </h1>
      </div>

      <div className="mt-4">
        <HeroCarousel books={books.slice(0, 5)} />
      </div>

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <SectionHeader title={s.title} href={s.href} />
            <BookRail books={s.books} />
          </section>
        ))}
      </div>
    </AppShell>
  );
}
