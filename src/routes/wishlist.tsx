import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { useQueries } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { Book } from "@/types";
import { formatKES } from "@/lib/format";
import { safeCoverUrl } from "@/lib/utils";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist – Golden Reads" },
      { name: "description", content: "Books you've saved for later." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const wish = useWishlist();
  const add = useCart((s) => s.add);

  const results = useQueries({
    queries: wish.ids.map((id) => ({
      queryKey: ["book", id],
      queryFn: () => api.books.detail(id),
    })),
  });

  const items = results
    .map((res) => res.data)
    .filter((book): book is Book => !!book);

  return (
    <AppShell>
      <div className="flex items-center justify-between px-5 pt-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Wishlist</h1>
          <p className="text-sm text-muted-foreground">{items.length} saved</p>
        </div>
        <button className="px-3 py-1.5 rounded-full border border-divider font-mono text-[10px] uppercase tracking-wider">
          Sort: Recent
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gold/10 grid place-items-center mb-4">
            <Heart size={28} className="text-gold" />
          </div>
          <h2 className="font-display text-xl">No saved books yet</h2>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Tap the heart on any book to save it for later.
          </p>
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium"
          >
            Browse books
          </Link>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-divider">
          {items.map((book, idx) => (
            <motion.li
              key={book.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="flex items-center gap-3 px-5 py-3.5"
            >
              <Link
                to="/book/$id"
                params={{ id: book.id }}
                className="flex items-center gap-3 flex-1 min-w-0"
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
                  <p className="font-mono text-[11px] mt-1 text-gold font-bold">{formatKES(book.price ?? 0.0)}</p>
                </div>
              </Link>
              <div className="flex flex-col gap-1.5">
                <button
                  aria-label="Add to cart"
                  onClick={() => {
                    add(book);
                    wish.remove(book.id);
                  }}
                  className="w-9 h-9 grid place-items-center rounded-full bg-accent text-accent-foreground"
                >
                  <ShoppingCart size={15} />
                </button>
                <button
                  aria-label="Remove"
                  onClick={() => wish.remove(book.id)}
                  className="w-9 h-9 grid place-items-center rounded-full border border-divider text-muted-foreground"
                >
                  <Heart size={15} fill="currentColor" />
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
