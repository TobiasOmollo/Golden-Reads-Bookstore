import type { Book, Article, Episode, Flashcard, AudiobookDetail } from "@/types";

const BASE = import.meta.env.VITE_API_URL;

function getHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
  const headers: Record<string, string> = { ...customHeaders };
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function get<T>(path: string): Promise<T> {
  const headers = getHeaders();
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return (await res.json()) as T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const headers = getHeaders({ "Content-Type": "application/json" });
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return (await res.json()) as T;
}

export function normalizeBook(raw: any): Book {
  if (!raw) return raw;
  return {
    ...raw,
    title: raw.title ?? 'Unknown Title',
    author: raw.author ?? 'Unknown Author',
    cover_url: raw.cover_url ?? raw.cover ?? '',
    cover: raw.cover ?? raw.cover_url ?? '',
    description: raw.description ?? '',
    genre: raw.genre ?? 'Fiction',
    authors: raw.authors ?? [],
    genres: raw.genres ?? [],
    formats: raw.formats ?? {},
    subjects: raw.subjects ?? [],
    bookshelves: raw.bookshelves ?? [],
    languages: raw.languages ?? [],
    download_count: raw.download_count ?? 0,
  };
}

export function normalizeAudiobook(raw: any): AudiobookDetail {
  if (!raw) return raw;
  return {
    ...raw,
    title: raw.title ?? 'Unknown Title',
    author: raw.author ?? 'Unknown Author',
    description: raw.description ?? '',
    cover: raw.cover ?? '',
    chapters: raw.chapters ?? [],
    authors: raw.authors ?? [],
    genres: raw.genres ?? [],
    url_zip_file: raw.url_zip_file ?? null,
    num_sections: raw.num_sections ?? 0,
    language: raw.language ?? '',
    url_rss: raw.url_rss ?? '',
  };
}

export function mapAudiobookToBook(audiobook: any): Book {
  const coverUrl = audiobook.cover_url || audiobook.cover || "";
  return {
    id: audiobook.id.startsWith("a") ? audiobook.id : `a${audiobook.id}`,
    title: audiobook.title || "Unknown Title",
    author: audiobook.author || "Unknown Author",
    cover_url: coverUrl,
    cover: coverUrl,
    description: audiobook.description || "",
    genre: ["Audiobook"],
    genres: ["Audiobook"],
    rating: 4.5,
    price: 0,
    pages: 150,
    readingTime: 120,
    formats: ["audio"],
    librivoxId: audiobook.id,
    read_url: "",
    epub_url: "",
    download_url: "",
  };
}

export const api = {
  books: {
    discover: async (q: string): Promise<Book[]> => {
      const res = await get<Book[]>(`/books/search?q=${encodeURIComponent(q)}`);
      return (res || []).map(normalizeBook);
    },
    trending: async (): Promise<Book[]> => {
      const res = await get<Book[]>('/books/trending');
      return (res || []).map(normalizeBook);
    },
    search: async (paramsOrQ: string | { q?: string; genre?: string }, genre = ""): Promise<Book[]> => {
      let qStr = "";
      let genreStr = "";
      if (typeof paramsOrQ === "object" && paramsOrQ !== null) {
        qStr = paramsOrQ.q ?? "";
        genreStr = paramsOrQ.genre ?? "";
      } else {
        qStr = paramsOrQ ?? "";
        genreStr = genre ?? "";
      }

      if (genreStr === "Audiobook") {
        const res = await get<any[]>(`/audio/search?q=${encodeURIComponent(qStr)}`);
        return (res || []).map(mapAudiobookToBook);
      }

      const res = await get<Book[]>(`/books/search?q=${encodeURIComponent(qStr)}&genre=${encodeURIComponent(genreStr)}`);
      return (res || []).map(normalizeBook);
    },
    detail: async (id: string): Promise<Book> => {
      const cleanId = id.startsWith('g') ? id.slice(1) : id;
      const res = await get<Book>(`/books/${cleanId}`);
      return normalizeBook(res);
    },
    coverUrl: (id: string, openLibraryId?: string | number) =>
      openLibraryId
        ? `https://covers.openlibrary.org/b/id/${openLibraryId}-L.jpg`
        : `${BASE}/books/${id}/cover`,
    access: async (id: string): Promise<{ status: string; tier: string; count: number; limit: number }> => {
      const cleanId = id.startsWith('g') ? id.slice(1) : id;
      return post<{ status: string; tier: string; count: number; limit: number }>(`/books/${cleanId}/access`, {});
    },
  },
  audio: {
    search: async (q: string): Promise<AudiobookDetail[]> => {
      const res = await get<AudiobookDetail[]>(`/audio/search?q=${encodeURIComponent(q)}`);
      return (res || []).map(normalizeAudiobook);
    },
    detail: async (id: string): Promise<AudiobookDetail> => {
      const res = await get<AudiobookDetail>(`/audio/${id}`);
      return normalizeAudiobook(res);
    },
    access: async (id: string): Promise<{ status: string; tier: string; count: number; limit: number }> => {
      const cleanId = id.startsWith('a') ? id.slice(1) : id;
      return post<{ status: string; tier: string; count: number; limit: number }>(`/audio/${cleanId}/access`, {});
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
    localBriefing: (limit = 30) => get<Article[]>(`/magazines/local-briefing?limit=${limit}`),
    flossyGossip: (limit = 30) => get<Article[]>(`/magazines/flossy-gossip?limit=${limit}`),
    africaToday: (limit = 30) => get<Article[]>(`/magazines/africa-today?limit=${limit}`),
    globalFeed: (limit = 30) => get<Article[]>(`/magazines/global-feed?limit=${limit}`),
    trends: (limit = 30) => get<Article[]>(`/magazines/trends?limit=${limit}`),
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
      const res = await post<{ recommendations: Book[]; reasoning: string }>(`/ai/recommend`, { genres, history });
      return {
        recommendations: (res.recommendations || []).map(normalizeBook),
        reasoning: res.reasoning ?? "",
      };
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
    me: async () => {
      return get<any>("/auth/me");
    },
    upgrade: async () => {
      return post<{ status: string; user: any }>("/auth/upgrade", {});
    },
  },
};