import type { Book, Article, Episode, Flashcard } from "@/types";

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return (await res.json()) as T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return (await res.json()) as T;
}

export const api = {
  books: {
    trending: () => get<Book[]>("/books/trending"),
    search: (q: string, genre = "") =>
      get<Book[]>(`/books/search?q=${encodeURIComponent(q)}&genre=${encodeURIComponent(genre)}`),
    detail: (id: string) => get<Book>(`/books/${id}`),
    coverUrl: (id: string) => `${BASE}/books/${id}/cover`,
  },
  audio: {
    search: (q: string) => get<Book[]>(`/audiobooks/search?q=${encodeURIComponent(q)}`),
    detail: (id: string) => get<Book>(`/audiobooks/${id}`),
  },
  podcasts: {
    search: (q: string) => get<Episode[]>(`/podcasts/search?q=${encodeURIComponent(q)}`),
    episodes: (feedId: string) => get<Episode[]>(`/podcasts/${feedId}/episodes`),
  },
  magazines: {
    bulletin: (limit = 30) => get<Article[]>(`/magazines/bulletin?limit=${limit}`),
    eastAfrica: (limit = 60) => get<Article[]>(`/magazines/eastafrica?limit=${limit}`),
    business: (limit = 30) => get<Article[]>(`/magazines/business?limit=${limit}`),
    lifestyle: (limit = 20) => get<Article[]>(`/magazines/lifestyle?limit=${limit}`),
    technology: (limit = 20) => get<Article[]>(`/magazines/technology?limit=${limit}`),
    feeds: (countries = "", categories = "", limit = 60) =>
      get<Article[]>(
        `/magazines/feeds?countries=${encodeURIComponent(countries)}&categories=${encodeURIComponent(categories)}&limit=${limit}`,
      ),
  },
  ai: {
    summarize: (bookId: string, chapter: string) =>
      post<{ summary: string }>(`/ai/summarize`, { bookId, chapter }),
    flashcards: (text: string) => post<Flashcard[]>(`/ai/flashcards`, { text }),
    recommend: (genres: string[], history: string[]) =>
      post<Book[]>(`/ai/recommend`, { genres, history }),
    explain: (passage: string, context: string) =>
      post<{ explanation: string }>(`/ai/explain`, { passage, context }),
  },
};
