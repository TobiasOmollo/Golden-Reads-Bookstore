import { c as create, p as persist } from "../_libs/zustand.mjs";
const seed = [
  { bookId: "001", progress: 64, status: "reading", startedAt: "2026-05-12" },
  { bookId: "002", progress: 100, status: "completed", startedAt: "2026-04-01" },
  { bookId: "005", progress: 22, status: "reading", startedAt: "2026-05-28" },
  { bookId: "011", progress: 100, status: "completed", startedAt: "2026-03-15" },
  { bookId: "014", progress: 8, status: "reading", startedAt: "2026-06-01" }
];
const useLibrary = create()(
  persist(
    (set) => ({
      entries: seed,
      upsert: (bookId, progress) => set((s) => {
        const existing = s.entries.find((e) => e.bookId === bookId);
        const status = progress >= 100 ? "completed" : "reading";
        if (existing) {
          return {
            entries: s.entries.map(
              (e) => e.bookId === bookId ? { ...e, progress, status } : e
            )
          };
        }
        return {
          entries: [
            ...s.entries,
            { bookId, progress, status, startedAt: (/* @__PURE__ */ new Date()).toISOString() }
          ]
        };
      }),
      remove: (bookId) => set((s) => ({ entries: s.entries.filter((e) => e.bookId !== bookId) }))
    }),
    { name: "gr-library" }
  )
);
export {
  useLibrary as u
};
