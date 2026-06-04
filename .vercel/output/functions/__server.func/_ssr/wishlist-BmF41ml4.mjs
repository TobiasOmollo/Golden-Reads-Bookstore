import { c as create, p as persist } from "../_libs/zustand.mjs";
const useWishlist = create()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (book) => set((s) => ({
        ids: s.ids.includes(book.id) ? s.ids.filter((i) => i !== book.id) : [...s.ids, book.id]
      })),
      has: (id) => get().ids.includes(id),
      remove: (id) => set((s) => ({ ids: s.ids.filter((i) => i !== id) }))
    }),
    { name: "gr-wishlist" }
  )
);
export {
  useWishlist as u
};
