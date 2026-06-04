import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Heart, BookOpen, Headphones, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { BookRail } from "@/components/BookRail";
import { SectionHeader } from "@/components/SectionHeader";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useLibrary } from "@/store/library";
import { formatKES } from "@/lib/format";
import { api } from "@/lib/api/client";
import booksData from "@/data/books.json";
import type { Book } from "@/types";

const books = booksData as Book[];

export const Route = createFileRoute("/book/$id")({
  head: ({ params }) => {
    const book = books.find((b) => b.id === params.id);
    return {
      meta: [
        { title: book ? `${book.title} – Golden Reads` : "Book – Golden Reads" },
        {
          name: "description",
          content: book ? book.description.slice(0, 155) : "Book details on Golden Reads.",
        },
        { property: "og:title", content: book?.title ?? "Golden Reads" },
        { property: "og:description", content: book?.description.slice(0, 155) ?? "" },
        ...(book ? [{ property: "og:image", content: book.cover }] : []),
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: BookDetail,
});

function BookDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const fallback = books.find((b) => b.id === id) ?? books[0];
  const { data: book = fallback } = useQuery<Book>({
    queryKey: ["book", id],
    queryFn: () => api.books.detail(id),
    initialData: fallback,
  });
  const add = useCart((s) => s.add);
  const wish = useWishlist();
  const upsert = useLibrary((s) => s.upsert);
  const [expanded, setExpanded] = useState(false);

  if (!book) {
    return (
      <AppShell>
        <div className="p-10 text-center">
          <p className="font-display text-xl">Book not found</p>
        </div>
      </AppShell>
    );
  }

  const coverSrc = book.cover?.startsWith("http") ? book.cover : api.books.coverUrl(book.id);
  const similar = books.filter((b) => b.id !== book.id && b.genre.some((g) => book.genre.includes(g))).slice(0, 8);

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full h-[60vw] max-h-[420px] bg-muted overflow-hidden"
        >
          <img src={coverSrc} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
          <button
            aria-label="Go back"
            onClick={() => router.history.back()}
            className="absolute top-4 left-4 w-10 h-10 grid place-items-center rounded-full bg-black/40 backdrop-blur text-white"
            style={{ marginTop: "env(safe-area-inset-top)" }}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            aria-label="Toggle wishlist"
            onClick={() => wish.toggle(book)}
            className="absolute top-4 right-4 w-10 h-10 grid place-items-center rounded-full bg-black/40 backdrop-blur text-white"
            style={{ marginTop: "env(safe-area-inset-top)" }}
          >
            <Heart size={18} fill={wish.has(book.id) ? "#C9A84C" : "transparent"} className={wish.has(book.id) ? "text-gold" : ""} />
          </button>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-5 -mt-6 relative"
        >
          <div className="flex flex-wrap gap-1.5 mb-3">
            {book.genre.map((g) => (
              <span key={g} className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold/15 text-gold">
                {g}
              </span>
            ))}
          </div>
          <h1 className="font-display text-[26px] font-semibold leading-tight">{book.title}</h1>
          <p className="font-serif italic text-[18px] text-muted-foreground mt-1">{book.author}</p>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.round(book.rating) ? "currentColor" : "none"}
                  className="text-gold"
                  strokeWidth={1.5}
                />
              ))}
              <span className="font-mono text-xs ml-1">{book.rating}</span>
            </div>
            <span className="text-muted-foreground text-xs">· 2,431 reviews</span>
          </div>

          <p className={`mt-4 text-[15px] leading-relaxed text-foreground/85 ${expanded ? "" : "line-clamp-3"}`}>
            {book.description}
          </p>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="font-mono text-[11px] uppercase tracking-wider text-gold mt-1"
          >
            {expanded ? "Read less" : "Read more"}
          </button>

          <div className="grid grid-cols-3 gap-2 mt-5">
            <Stat icon={<Clock size={14} />} label="Reading" value={book.readingTime} />
            <Stat icon={<BookOpen size={14} />} label="Pages" value={`${book.pages}`} />
            <Stat
              icon={<Headphones size={14} />}
              label="Format"
              value={book.formats.includes("audio") ? "Audio + Ebook" : "Ebook"}
            />
          </div>
        </motion.section>

        <section className="mt-10">
          <SectionHeader title="Similar Books" />
          <BookRail books={similar} />
        </section>

        <section className="mt-10 px-5">
          <h2 className="font-display text-xl font-semibold mb-4">Reviews</h2>
          <ul className="space-y-4">
            {sampleReviews.map((r) => (
              <li key={r.name} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 grid place-items-center font-display font-semibold text-gold shrink-0">
                  {r.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-[15px]">{r.name}</p>
                    <div className="flex gap-0.5 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={10} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full py-2.5 rounded-full border border-divider font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Load more
          </button>
        </section>
      </div>

      <div
        className="fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-divider"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="max-w-md mx-auto px-5 py-3 flex items-center gap-2">
          <div className="flex-1">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Price</p>
            <p className="font-display text-xl font-semibold text-gold">{formatKES(book.price)}</p>
          </div>
          <button
            onClick={() => wish.toggle(book)}
            aria-label="Add to wishlist"
            className="w-11 h-11 grid place-items-center rounded-full border border-divider"
          >
            <Heart size={18} fill={wish.has(book.id) ? "#C9A84C" : "transparent"} className={wish.has(book.id) ? "text-gold" : ""} />
          </button>
          <button
            onClick={() => {
              upsert(book.id, 1);
            }}
            className="px-4 h-11 rounded-full bg-muted text-foreground text-sm font-medium"
          >
            Start Reading
          </button>
          <button
            onClick={() => add(book)}
            className="px-5 h-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
          >
            Buy Now
          </button>
        </div>
      </div>

      <Link to="/" className="hidden" />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-divider px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-mono text-[12px] font-bold mt-1 text-foreground line-clamp-1">{value}</p>
    </div>
  );
}

const sampleReviews = [
  { name: "Wanjiru K.", rating: 5, text: "Couldn't put it down. The pacing is excellent and the characters feel real." },
  { name: "David O.", rating: 4, text: "A solid, well-crafted story. The middle drags slightly but the ending makes up for it." },
  { name: "Priya M.", rating: 5, text: "One of the most thoughtful books I've read this year. Highly recommend." },
];
