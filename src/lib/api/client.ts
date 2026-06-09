import type { Book, Article, Episode, Flashcard, AudiobookDetail } from "@/types";

const rawUrl =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.PROD ? "https://readers-backend.onrender.com" : "http://localhost:8000");
const BASE = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

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
    trending: async (): Promise<Book[]> => {
      return get<Book[]>("/books/trending");
    },
    search: async (q: string, genre = ""): Promise<Book[]> => {
      return get<Book[]>(`/books/search?q=${encodeURIComponent(q)}&genre=${encodeURIComponent(genre)}`);
    },
    detail: async (id: string): Promise<Book> => {
      return get<Book>(`/books/${id}`);
    },
    discover: async (q: string): Promise<Book[]> => {
      return get<Book[]>(`/books/search?q=${encodeURIComponent(q)}`);
    },
    coverUrl: (id: string, openLibraryId?: string | number) =>
      openLibraryId
        ? `https://covers.openlibrary.org/b/id/${openLibraryId}-L.jpg`
        : `${BASE}/books/${id}/cover`,
  },
  audio: {
    search: async (q: string): Promise<AudiobookDetail[]> => {
      return get<AudiobookDetail[]>(`/audio/search?q=${encodeURIComponent(q)}`);
    },
    detail: async (id: string): Promise<AudiobookDetail> => {
      return get<AudiobookDetail>(`/audio/${id}`);
    },
  },
  podcasts: {
    search: async (q: string): Promise<Episode[]> => {
      return get<Episode[]>(`/podcasts/search?q=${encodeURIComponent(q)}`);
    },
    episodes: async (feedId: string): Promise<Episode[]> => {
      return get<Episode[]>(`/podcasts/${feedId}/episodes`);
    },
  },
  magazines: {
    bulletin: async (limit?: number): Promise<Article[]> => {
      return get<Article[]>(`/magazines/bulletin?limit=${limit || 30}`);
    },
    eastAfrica: async (limit = 60): Promise<Article[]> => {
      return get<Article[]>(`/magazines/eastafrica?limit=${limit}`);
    },
    business: async (limit = 30): Promise<Article[]> => {
      return get<Article[]>(`/magazines/business?limit=${limit}`);
    },
    lifestyle: async (limit = 20): Promise<Article[]> => {
      return get<Article[]>(`/magazines/lifestyle?limit=${limit}`);
    },
    technology: async (limit = 20): Promise<Article[]> => {
      return get<Article[]>(`/magazines/technology?limit=${limit}`);
    },
    feeds: async (countries = "", categories = "", limit = 60): Promise<Article[]> => {
      return get<Article[]>(`/magazines/feeds?countries=${encodeURIComponent(countries)}&categories=${encodeURIComponent(categories)}&limit=${limit}`);
    },
    archive: async (q: string): Promise<Article[]> => {
      return get<Article[]>(`/magazines/archive?q=${encodeURIComponent(q)}`);
    },
  },
  ai: {
    summarize: async (bookId: string, chapter: string): Promise<{ summary: string }> => {
      return post<{ summary: string }>(`/ai/summarize`, { bookId, chapter });
    },
    flashcards: async (text: string): Promise<Flashcard[]> => {
      return post<Flashcard[]>(`/ai/flashcards`, { text });
    },
    recommend: async (genres: string[], history: string[]): Promise<{ recommendations: Book[]; reasoning: string }> => {
      return post<{ recommendations: Book[]; reasoning: string }>(`/ai/recommend`, { genres, history });
    },
    explain: async (passage: string, context: string): Promise<{ explanation: string }> => {
      return post<{ explanation: string }>(`/ai/explain`, { passage, context });
    },
  },
  auth: {
    login: async (email: string, password: string) => {
      return post<{ access_token: string; token_type: string; user: any }>("/auth/login", { email, password });
    },
    signup: async (email: string, password: string, profileDetails: any) => {
      return post<{ access_token: string; token_type: string; user: any }>("/auth/signup", { email, password, profileDetails });
    },
    google: async (token: string) => {
      return post<{ access_token: string; token_type: string; user: any }>("/auth/google", { token });
    },
  },
};