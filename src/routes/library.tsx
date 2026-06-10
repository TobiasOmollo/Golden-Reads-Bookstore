import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { useLibrary } from "@/store/library";
import { useQueries } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { Book } from "@/types";
import { safeCoverUrl } from "@/lib/utils";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "My Library – Golden Reads" },
      { name: "description", content: "Track your reading progress and revisit completed books." },
    ],
  }),
  component: LibraryPage,
});

function useCountUp(target: number, duration = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function LibraryPage() {
  const entries = useLibrary((s) => s.entries);
  const [tab, setTab] = useState<"all" | "reading" | "completed">("all");

  const results = useQueries({
    queries: entries.map((e) => ({
      queryKey: ["book", e.bookId],
      queryFn: () => api.books.detail(e.bookId),
    })),
  });

  const rows = results
    .map((res, i) => {
      const entry = entries[i];
      const book = res.data;
      return { entry, book };
    })
    .filter((r): r is { entry: typeof entries[number]; book: Book } => !!r.book)
    .filter((r) => (tab === "all" ? true : r.entry.status === tab));

  const pagesToday = useCountUp(47);
  const streak = useCountUp(12);
  const monthCount = useCountUp(3);

  return (
    <AppShell>
      <div className="px-5 pt-4">
        <h1 className="font-display text-2xl font-semibold">My Library</h1>
        <p className="text-sm text-muted-foreground">Your reading, in one place.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 px-5 mt-5">
        <StatCard label="Pages Today" value={pagesToday} accent />
        <StatCard label="Streak 🔥" value={streak} suffix=" days" />
        <StatCard label="This Month" value={monthCount} suffix=" books" />
      </div>

      <div className="flex gap-2 px-5 mt-6">
        {(["all", "reading", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-colors ${
              tab === t ? "bg-gold text-gold-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="mt-4 divide-y divide-divider">
        {rows.length === 0 && (
          <li className="px-5 py-12 text-center text-muted-foreground text-sm">
            Nothing here yet.
          </li>
        )}
        {rows.map(({ entry, book }, idx) => (
          <motion.li
            key={book.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
          >
            <Link
              to="/book/$id"
              params={{ id: book.id }}
              className="flex items-center gap-3 px-5 py-3.5 active:bg-muted/50"
            >
              <img
                src={safeCoverUrl(book.cover_url || book.cover) || '/placeholder-book.png'}
                alt={book.title}
                className="w-14 h-20 rounded-lg object-cover bg-muted shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm line-clamp-1">{book.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gold transition-all"
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground w-9 text-right">
                    {entry.progress}%
                  </span>
                </div>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  suffix = "",
  accent,
}: {
  label: string;
  value: number;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3 border border-divider ${accent ? "bg-gold/10" : "bg-surface"}`}
    >
      <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-semibold mt-1">
        {value}
        <span className="text-xs text-muted-foreground font-body">{suffix}</span>
      </p>
    </div>
  );
}
