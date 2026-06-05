import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import type { Book } from "@/types/api";
import { resolveCover } from "@/lib/utils";

export function HeroCarousel({ books }: { books: Book[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % books.length), 4000);
    return () => clearInterval(id);
  }, [books.length]);

  const book = books[index];
  if (!book) return null;

  return (
    <div className="px-5 mt-2">
      <div className="relative aspect-[16/10] max-h-[340px] rounded-2xl overflow-hidden bg-muted shadow-soft">
        <AnimatePresence mode="wait">
          <motion.div
            key={book.id}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={resolveCover(book)}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const seed = book.id ?? 'fallback';
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${seed}/400/600`;
              }}
            />
            <div className="absolute inset-0 scrim-bottom" />
          </motion.div>
        </AnimatePresence>

        <Link
          to="/book/$id"
          params={{ id: book.id }}
          className="absolute inset-0 flex flex-col justify-end p-5 text-white"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-2">
            Featured
          </span>
          <h2 className="font-display text-2xl font-semibold leading-tight">
            {book.title}
          </h2>
          <div className="flex items-center gap-3 mt-1 text-white/85 text-sm">
            <span className="font-serif italic">{book.author}</span>
            <span className="flex items-center gap-1 text-gold">
              <Star size={12} fill="currentColor" strokeWidth={0} />
              <span className="font-mono text-[11px]">{book.rating}</span>
            </span>
          </div>
        </Link>
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {books.map((b, i) => (
          <button
            key={b.id}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-gold" : "w-1.5 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
