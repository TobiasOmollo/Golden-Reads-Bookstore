import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/store/cart";
import { formatKES } from "@/lib/format";
import { resolveCover } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            aria-hidden
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-surface shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
          >
            <header className="flex items-center justify-between px-5 h-14 border-b border-divider">
              <h2 className="text-lg font-display font-semibold">Your Cart</h2>
              <button
                aria-label="Close cart"
                onClick={close}
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-muted"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted grid place-items-center mb-4">
                    <ShoppingBag size={24} className="text-muted-foreground" />
                  </div>
                  <p className="font-display text-lg">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add a book to get started.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map(({ book, qty }) => (
                    <li key={book.id} className="flex gap-3">
                      <img
                        src={resolveCover(book)}
                        alt={book.title}
                        className="w-14 h-20 object-cover rounded-lg bg-muted shrink-0"
                        onError={(e) => {
                          const seed = book.id ?? 'fallback';
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${seed}/200/300`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-1">{book.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
                        <p className="font-mono text-xs mt-1 text-gold font-bold">
                          {formatKES(book.price ?? 0.0)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => setQty(book.id, qty - 1)}
                            className="w-7 h-7 grid place-items-center rounded-full border border-divider"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-mono text-xs w-5 text-center">{qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => setQty(book.id, qty + 1)}
                            className="w-7 h-7 grid place-items-center rounded-full border border-divider"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            aria-label={`Remove ${book.title}`}
                            onClick={() => remove(book.id)}
                            className="ml-auto w-7 h-7 grid place-items-center rounded-full text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer
                className="border-t border-divider px-5 py-4 space-y-3"
                style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-display text-xl font-semibold text-gold">
                    {formatKES(subtotal())}
                  </span>
                </div>
                <Link
                  to="/"
                  onClick={close}
                  className="block w-full text-center py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
