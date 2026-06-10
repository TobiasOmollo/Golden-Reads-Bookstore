import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "@/types/api";

interface CartItem {
  book: Book;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (book: Book) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (book) =>
        set((s) => {
          const existing = s.items.find((i) => i.book.id === book.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.book.id === book.id ? { ...i, qty: i.qty + 1 } : i,
              ),
            };
          }
          return { items: [...s.items, { book, qty: 1 }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.book.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.book.id !== id)
            : s.items.map((i) => (i.book.id === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.qty * (i.book.price ?? 0), 0),
    }),
    { name: "gr-cart" },
  ),
);
