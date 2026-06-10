import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveCover(book: { cover?: string; cover_url?: string; gutendexId?: number; id?: string }): string {
  // 0. If cover_url is present, use it directly
  if (book.cover_url && book.cover_url.startsWith('http')) {
    return book.cover_url.replace('http://', 'https://');
  }
  // 1. If cover is a full valid URL already, use it directly
  if (book.cover && book.cover.startsWith('http')) {
    let cover = book.cover;
    // Append default=false to Open Library covers to trigger onError fallback
    if (cover.includes('covers.openlibrary.org') && !cover.includes('default=false')) {
      cover = `${cover}${cover.includes('?') ? '&' : '?'}default=false`;
    }
    return cover.replace('http://', 'https://');
  }
  // 2. Try Open Library with the Gutendex numeric ID as OLID
  if (book.gutendexId) {
    return `https://covers.openlibrary.org/b/olid/OL${book.gutendexId}W-L.jpg?default=false`;
  }
  // 3. Deterministic picsum fallback (always works, visually varied)
  const seed = book.id ?? book.gutendexId ?? 'book';
  return `https://picsum.photos/seed/${seed}/200/300`;
}
