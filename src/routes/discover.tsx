import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { BookCard, BookCardSkeleton } from "@/components/book/BookCard";
import { api } from "@/lib/api/client";
import type { Book } from "@/types";
import { z } from "zod";

const GENRES = ["Fiction", "Thriller", "Biography", "Technology", "Romance", "Mystery", "Fantasy", "Business", "Self-Help", "History"];


const discoverSearchSchema = z.object({
  q: z.string().optional().catch(""),
  genre: z.string().optional().catch("All"),
});

export const Route = createFileRoute("/discover")({
  validateSearch: (search) => discoverSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Discover – Golden Reads" },
      { name: "description", content: "Browse the full Golden Reads catalogue by genre." },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const { q: searchQ = "", genre: searchGenre = "All" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [q, setQ] = useState(searchQ);
  const [genre, setGenre] = useState<string>(searchGenre);

  // Sync state with URL search params when they change
  useEffect(() => {
    setQ(searchQ);
  }, [searchQ]);

  useEffect(() => {
    setGenre(searchGenre);
  }, [searchGenre]);

  const [debounced, setDebounced] = useState(searchQ);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(q.trim());
      navigate({
        search: (prev) => ({ ...prev, q: q.trim() }),
        replace: true,
      });
    }, 300);
    return () => clearTimeout(t);
  }, [q, navigate]);

  const handleGenreChange = (g: string) => {
    setGenre(g);
    navigate({
      search: (prev) => ({ ...prev, genre: g }),
    });
  };

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["books", "search", debounced, genre],
    queryFn: () => api.books.search(debounced, genre === "All" ? "" : genre),
  });

  const showSkeletons = isLoading;

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
            className="w-full pl-11 pr-4 py-3 rounded-md bg-muted text-sm font-body placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 px-5">
          {["All", ...GENRES].map((g) => (
            <button
              key={g}
              onClick={() => handleGenreChange(g)}
              aria-pressed={genre === g}
              className={`shrink-0 px-3.5 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider transition-colors ${
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

      <motion.div layout className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-4 gap-y-8 px-5 mt-6 justify-center">
        {showSkeletons
          ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
          : books.map((b) => (
              <div key={b.id} className="mx-auto">
                <BookCard book={b} />
              </div>
            ))}
      </motion.div>

      {!showSkeletons && books.length === 0 && (
        <p className="px-5 mt-10 text-center text-sm text-muted-foreground">
          No books match your search.
        </p>
      )}
    </AppShell>
  );
}
