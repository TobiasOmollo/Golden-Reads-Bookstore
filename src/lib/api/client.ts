import type { Book, Article, Episode, Flashcard } from "@/types";

// Import your local JSON fallbacks as requested to preserve offline functionality
import mockBooks from "@/data/books.json";
import mockMagazines from "@/data/magazines.json";
import mockPodcasts from "@/data/podcasts.json";

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

// Robust fallback wrapper execution
async function handleFetchWithFallback<T>(networkRequest: () => Promise<T>, fallbackData: T): Promise<T> {
  try {
    return await networkRequest();
  } catch (error) {
    console.warn("Backend unavailable or returned an error. Using offline JSON fallback data.", error);
    return fallbackData;
  }
}

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
    trending: () => 
      handleFetchWithFallback<Book[]>(() => get<Book[]>("/books/trending"), mockBooks as unknown as Book[]),
    search: (q: string, genre = "") =>
      handleFetchWithFallback<Book[]>(
        () => get<Book[]>(`/books/search?q=${encodeURIComponent(q)}&genre=${encodeURIComponent(genre)}`),
        mockBooks as unknown as Book[]
      ),
    detail: (id: string) => 
      handleFetchWithFallback<Book>(
        () => get<Book>(`/books/${id}`), 
        (mockBooks as unknown as Book[]).find(b => b.id === id) || (mockBooks[0] as unknown as Book)
      ),
    coverUrl: (id: string) => `${BASE}/books/${id}/cover`,
  },
  audio: {
    search: (q: string) => 
      handleFetchWithFallback<Book[]>(() => get<Book[]>(`/audiobooks/search?q=${encodeURIComponent(q)}`), mockBooks as unknown as Book[]),
    detail: (id: string) => 
      handleFetchWithFallback<Book>(
        () => get<Book>(`/audiobooks/${id}`),
        (mockBooks as unknown as Book[]).find(b => b.id === id) || (mockBooks[0] as unknown as Book)
      ),
  },
  podcasts: {
    search: (q: string) => 
      handleFetchWithFallback<Episode[]>(() => get<Episode[]>(`/podcasts/search?q=${encodeURIComponent(q)}`), mockPodcasts as unknown as Episode[]),
    episodes: (feedId: string) => 
      handleFetchWithFallback<Episode[]>(() => get<Episode[]>(`/podcasts/${feedId}/episodes`), mockPodcasts as unknown as Episode[]),
  },
  magazines: {
    bulletin: (limit = 30) => 
      handleFetchWithFallback<Article[]>(() => get<Article[]>(`/magazines/bulletin?limit=${limit}`), mockMagazines as unknown as Article[]),
    eastAfrica: (limit = 60) => 
      handleFetchWithFallback<Article[]>(() => get<Article[]>(`/magazines/eastafrica?limit=${limit}`), mockMagazines as unknown as Article[]),
    business: (limit = 30) => 
      handleFetchWithFallback<Article[]>(() => get<Article[]>(`/magazines/business?limit=${limit}`), mockMagazines as unknown as Article[]),
    lifestyle: (limit = 20) => 
      handleFetchWithFallback<Article[]>(() => get<Article[]>(`/magazines/lifestyle?limit=${limit}`), mockMagazines as unknown as Article[]),
    technology: (limit = 20) => 
      handleFetchWithFallback<Article[]>(() => get<Article[]>(`/magazines/technology?limit=${limit}`), mockMagazines as unknown as Article[]),
    feeds: (countries = "", categories = "", limit = 60) =>
      handleFetchWithFallback<Article[]>(
        () => get<Article[]>(`/magazines/feeds?countries=${encodeURIComponent(countries)}&categories=${encodeURIComponent(categories)}&limit=${limit}`),
        mockMagazines as unknown as Article[]
      ),
    archive: (q: string) =>
      handleFetchWithFallback<Article[]>(
        () => get<Article[]>(`/magazines/archive?q=${encodeURIComponent(q)}`),
        mockMagazines as unknown as Article[]
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