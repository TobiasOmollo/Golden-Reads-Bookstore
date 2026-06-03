import type { Book } from "@/types/api";
import { BookCard, BookCardSkeleton } from "./book/BookCard";

export function BookRail({ books, loading }: { books: Book[]; loading?: boolean }) {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex gap-3 px-5 pb-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
          : books.map((b) => <BookCard key={b.id} book={b} />)}
      </div>
    </div>
  );
}
