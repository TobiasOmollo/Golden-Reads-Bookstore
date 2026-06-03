import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "@/types/api";

interface WishlistState {
  ids: string[];
  toggle: (book: Book) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (book) =>
        set((s) => ({
          ids: s.ids.includes(book.id)
            ? s.ids.filter((i) => i !== book.id)
            : [...s.ids, book.id],
        })),
      has: (id) => get().ids.includes(id),
      remove: (id) => set((s) => ({ ids: s.ids.filter((i) => i !== id) })),
    }),
    { name: "gr-wishlist" },
  ),
);
