import { Link } from "@tanstack/react-router";
import { Plus, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Book } from "@/types/api";
import { useCart } from "@/store/cart";
import { formatKES } from "@/lib/format";
import { safeCoverUrl } from "@/lib/utils";


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
        aria-label={`${book.title ?? "Untitled Book"} by ${book.author ?? "Unknown Author"}`}
      >
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted shadow-card">
          <img
            src={book.cover_url || '/placeholder-book.png'}
            alt={book.title ?? 'Book cover'}
            loading="lazy"
            className="w-full h-full object-cover group-active:scale-[0.98] transition-transform"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <button
            type="button"
            aria-label={`Add ${book.title ?? "Untitled Book"} to cart`}
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
          {book.title ?? "Untitled Book"}
        </h3>
        <p className="text-[11px] text-muted-foreground line-clamp-1">{book.author ?? "Unknown Author"}</p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 text-gold">
              <Star size={11} fill="currentColor" strokeWidth={0} />
              <span className="font-mono text-[10px] text-foreground">{book.rating ?? 4.5}</span>
            </div>
            {book.download_count !== undefined && book.download_count > 0 && (
              <span className="font-mono text-[9px] text-muted-foreground select-none">
                ({(book.download_count ?? 0).toLocaleString()})
              </span>
            )}
          </div>
          <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-gold border border-gold rounded-full bg-transparent">
            {(Array.isArray(book.genre) ? book.genre[0] : Array.isArray(book.genres) ? book.genres[0] : typeof book.genre === 'string' ? book.genre : 'Fiction') || 'Fiction'}
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
