import { Link } from "@tanstack/react-router";
import { Plus, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Book } from "@/types/api";
import { useCart } from "@/store/cart";
import { formatKES } from "@/lib/format";
import { resolveCover } from "@/lib/utils";

export function BookCard({ book }: { book: Book }) {
  const add = useCart((s) => s.add);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-[140px] shrink-0"
    >
      <Link
        to="/book/$id"
        params={{ id: book.id }}
        className="block group"
        aria-label={`${book.title} by ${book.author}`}
      >
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted shadow-card">
          <img
            src={resolveCover(book)}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover group-active:scale-[0.98] transition-transform"
            onError={(e) => {
              // If any URL fails, fall back to a reliable picsum image
              const seed = book.id ?? 'fallback';
              (e.target as HTMLImageElement).onerror = null; // prevent infinite loop
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${seed}/200/300`;
            }}
          />
          <button
            type="button"
            aria-label={`Add ${book.title} to cart`}
            onClick={(e) => {
              e.preventDefault();
              add(book);
            }}
            className="absolute bottom-2 right-2 w-8 h-8 grid place-items-center rounded-full bg-gold text-gold-foreground shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
        <h3 className="mt-2 text-[13px] font-semibold leading-snug line-clamp-2 font-body">
          {book.title}
        </h3>
        <p className="text-[11px] text-muted-foreground line-clamp-1">{book.author}</p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-0.5 text-gold">
            <Star size={11} fill="currentColor" strokeWidth={0} />
            <span className="font-mono text-[10px] text-foreground">{book.rating}</span>
          </div>
          <span className="font-mono text-[10px] font-bold text-foreground">
            {formatKES(book.price)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="w-[140px] shrink-0">
      <div className="aspect-[2/3] rounded-xl skeleton" />
      <div className="h-3 mt-2 rounded skeleton w-3/4" />
      <div className="h-2.5 mt-1.5 rounded skeleton w-1/2" />
    </div>
  );
}
