import type { Book, Article, Episode, Flashcard, AudiobookDetail } from "@/types";

// Import your local JSON fallbacks as requested to preserve offline functionality
import mockBooks from "@/data/books.json";
import mockMagazines from "@/data/magazines.json";
import mockPodcasts from "@/data/podcasts.json";

const rawUrl =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.PROD ? "https://readers-backend.onrender.com" : "http://localhost:8000");
const BASE = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

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
    coverUrl: (id: string, openLibraryId?: string | number) =>
      openLibraryId
        ? `https://covers.openlibrary.org/b/id/${openLibraryId}-L.jpg`
        : `${BASE}/books/${id}/cover`,
  },
  audio: {
    search: (q: string) => 
      handleFetchWithFallback<AudiobookDetail[]>(() => get<AudiobookDetail[]>(`/audio/search?q=${encodeURIComponent(q)}`), []),
    detail: (id: string) => 
      handleFetchWithFallback<AudiobookDetail>(
        () => get<AudiobookDetail>(`/audio/${id}`),
        null as any
      ),
  },
  podcasts: {
    search: (q: string) => 
      handleFetchWithFallback<Episode[]>(() => get<Episode[]>(`/podcasts/search?q=${encodeURIComponent(q)}`), mockPodcasts as unknown as Episode[]),
    episodes: (feedId: string) => 
      handleFetchWithFallback<Episode[]>(() => get<Episode[]>(`/podcasts/${feedId}/episodes`), mockPodcasts as unknown as Episode[]),
  },
  magazines: {
    bulletin: (limit = 30) => get<Article[]>(`/magazines/bulletin?limit=${limit}`),
    eastAfrica: (limit = 60) => get<Article[]>(`/magazines/eastafrica?limit=${limit}`),
    business: (limit = 30) => get<Article[]>(`/magazines/business?limit=${limit}`),
    lifestyle: (limit = 20) => get<Article[]>(`/magazines/lifestyle?limit=${limit}`),
    technology: (limit = 20) => get<Article[]>(`/magazines/technology?limit=${limit}`),
    feeds: (countries = "", categories = "", limit = 60) =>
      get<Article[]>(`/magazines/feeds?countries=${encodeURIComponent(countries)}&categories=${encodeURIComponent(categories)}&limit=${limit}`),
    archive: (q: string) =>
      get<Article[]>(`/magazines/archive?q=${encodeURIComponent(q)}`),
  },
  ai: {
    summarize: (bookId: string, chapter: string) =>
      handleFetchWithFallback<{ summary: string }>(
        () => post<{ summary: string }>(`/ai/summarize`, { bookId, chapter }),
        { summary: "[Offline Fallback] A detailed chapter summary covering the key narrative points of this section of the book." }
      ),
    flashcards: (text: string) =>
      handleFetchWithFallback<Flashcard[]>(
        () => post<Flashcard[]>(`/ai/flashcards`, { text }),
        [
          { front: "Where did Sherlock Holmes live?", back: "221B Baker Street, London" },
          { front: "What was Holmes primarily famous for?", back: "His incredible power of observation and logical deduction" }
        ]
      ),
    recommend: (genres: string[], history: string[]) =>
      handleFetchWithFallback<{ recommendations: Book[]; reasoning: string }>(
        () => post<{ recommendations: Book[]; reasoning: string }>(`/ai/recommend`, { genres, history }),
        {
          recommendations: (mockBooks as unknown as Book[]).slice(0, 3),
          reasoning: "Showing classic book recommendations because the AI recommendation service encountered a limit or error."
        }
      ),
    explain: (passage: string, context: string) =>
      handleFetchWithFallback<{ explanation: string }>(
        () => post<{ explanation: string }>(`/ai/explain`, { passage, context }),
        { explanation: "[Offline Fallback] This text is archaic English representing a unique behavior or rare incident." }
      ),
  },
  auth: {
    login: (email: string, password: string) =>
      post<{ access_token: string; token_type: string; user: any }>("/auth/login", { email, password }),
    signup: (email: string, password: string, profileDetails: any) =>
      post<{ access_token: string; token_type: string; user: any }>("/auth/signup", { email, password, profileDetails }),
    google: (token: string) =>
      post<{ access_token: string; token_type: string; user: any }>("/auth/google", { token }),
  },
};