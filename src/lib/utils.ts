import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveCover(book: { cover?: string; gutendexId?: number; id?: string }): string {
  // 1. If cover is a full valid URL already, use it directly
  if (book.cover && book.cover.startsWith('http')) {
    // Append default=false to Open Library covers to trigger onError fallback
    if (book.cover.includes('covers.openlibrary.org') && !book.cover.includes('default=false')) {
      return `${book.cover}${book.cover.includes('?') ? '&' : '?'}default=false`;
    }
    return book.cover;
  }
  // 2. Try Open Library with the Gutendex numeric ID as OLID
  if (book.gutendexId) {
    return `https://covers.openlibrary.org/b/olid/OL${book.gutendexId}W-L.jpg?default=false`;
  }
  // 3. Deterministic picsum fallback (always works, visually varied)
  const seed = book.id ?? book.gutendexId ?? 'book';
  return `https://picsum.photos/seed/${seed}/200/300`;
}
