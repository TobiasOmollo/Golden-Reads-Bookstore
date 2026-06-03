import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { BookCard, BookCardSkeleton } from "@/components/book/BookCard";
import { GENRES } from "@/data/genres";
import booksData from "@/data/books.json";
import type { Book } from "@/types/api";

const books = booksData as Book[];

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover – Golden Reads" },
      { name: "description", content: "Browse the full Golden Reads catalogue by genre." },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState<string>("All");
  const [loading] = useState(false);

  const filtered = useMemo(
    () =>
      books.filter(
        (b) =>
          (genre === "All" || b.genre.includes(genre)) &&
          (q.trim() === "" ||
            b.title.toLowerCase().includes(q.toLowerCase()) ||
            b.author.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, genre],
  );

  return (
    <AppShell>
      <div className="px-5 pt-4">
        <h1 className="font-display text-2xl font-semibold">Discover</h1>
        <p className="text-sm text-muted-foreground">Find your next favourite read.</p>

        <div className="mt-4 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles or authors"
            aria-label="Search books"
            className="w-full pl-11 pr-4 py-3 rounded-full bg-muted text-sm font-body placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 px-5">
          {["All", ...GENRES].map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              aria-pressed={genre === g}
              className={`shrink-0 px-3.5 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-colors ${
                genre === g
                  ? "bg-primary text-primary-foreground"
                  : "border border-divider text-muted-foreground"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 gap-x-3 gap-y-6 px-5 mt-6"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
          : filtered.map((b) => (
              <div key={b.id} className="mx-auto">
                <BookCard book={b} />
              </div>
            ))}
      </motion.div>

      {!loading && filtered.length === 0 && (
        <p className="px-5 mt-10 text-center text-sm text-muted-foreground">
          No books match your search.
        </p>
      )}
    </AppShell>
  );
}
