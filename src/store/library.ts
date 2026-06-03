import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LibraryEntry {
  bookId: string;
  progress: number; // 0–100
  status: "reading" | "completed";
  startedAt: string;
}

interface LibraryState {
  entries: LibraryEntry[];
  upsert: (bookId: string, progress: number) => void;
  remove: (bookId: string) => void;
}

const seed: LibraryEntry[] = [
  { bookId: "001", progress: 64, status: "reading", startedAt: "2026-05-12" },
  { bookId: "002", progress: 100, status: "completed", startedAt: "2026-04-01" },
  { bookId: "005", progress: 22, status: "reading", startedAt: "2026-05-28" },
  { bookId: "011", progress: 100, status: "completed", startedAt: "2026-03-15" },
  { bookId: "014", progress: 8, status: "reading", startedAt: "2026-06-01" },
];

export const useLibrary = create<LibraryState>()(
  persist(
    (set) => ({
      entries: seed,
      upsert: (bookId, progress) =>
        set((s) => {
          const existing = s.entries.find((e) => e.bookId === bookId);
          const status = progress >= 100 ? "completed" : "reading";
          if (existing) {
            return {
              entries: s.entries.map((e) =>
                e.bookId === bookId ? { ...e, progress, status } : e,
              ),
            };
          }
          return {
            entries: [
              ...s.entries,
              { bookId, progress, status, startedAt: new Date().toISOString() },
            ],
          };
        }),
      remove: (bookId) => set((s) => ({ entries: s.entries.filter((e) => e.bookId !== bookId) })),
    }),
    { name: "gr-library" },
  ),
);
