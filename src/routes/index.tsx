import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SectionHeader } from "@/components/SectionHeader";
import { BookRail } from "@/components/BookRail";
import { BookCardSkeleton } from "@/components/book/BookCard";
import { api } from "@/lib/api/client";
import booksData from "@/data/books.json";
import type { Book } from "@/types";

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

const fallbackBooks = booksData as Book[];

function byGenre(books: Book[], g: string) {
  return books.filter((b) => b.genre.includes(g));
}

function HomePage() {
  const { data: trending = fallbackBooks, isLoading } = useQuery({
    queryKey: ["books", "trending"],
    queryFn: api.books.trending,
    initialData: fallbackBooks,
  });

  const books = trending.length ? trending : fallbackBooks;

  const sections: { title: string; href: string; books: Book[] }[] = [
    { title: "Trending Now", href: "/discover", books: books.slice(0, 10) },
    { title: "Best Sellers", href: "/discover", books: [...books].sort((a, b) => b.rating - a.rating).slice(0, 10) },
    { title: "New Releases", href: "/discover", books: [...books].reverse().slice(0, 10) },
    { title: "Recommended For You", href: "/discover", books: books.slice(4, 14) },
    { title: "Technology Books", href: "/discover", books: byGenre(books, "Technology") },
    { title: "Business Books", href: "/discover", books: byGenre(books, "Business") },
    { title: "Fiction Collection", href: "/discover", books: byGenre(books, "Fiction") },
    { title: "Audiobooks", href: "/discover", books: books.filter((b) => b.formats.includes("audio")).slice(0, 10) },
  ];

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
        {isLoading && books === fallbackBooks ? (
          <div className="grid grid-cols-2 gap-3 px-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          sections.map((s) => (
            <section key={s.title}>
              <SectionHeader title={s.title} href={s.href} />
              <BookRail books={s.books} />
            </section>
          ))
        )}
      </div>
    </AppShell>
  );
}
