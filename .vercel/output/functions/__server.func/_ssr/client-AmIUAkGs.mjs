import { b as booksData } from "./router-BsJx4Bf6.mjs";
const mockMagazines = [
  {
    id: "001",
    title: "Kenya's Tech Scene Booms in 2026",
    publication: "The Standard",
    heroImage: "https://picsum.photos/seed/mag001/600/400",
    summary: "A deep look into the changing media landscape and what it means for readers across the region. Local voices weigh in on culture, technology, and the future of storytelling.",
    publishedAt: "2026-06-03T22:16:44.189Z",
    sourceUrl: "https://example.com/article/001"
  },
  {
    id: "002",
    title: "New Reading Initiative Launched in Nairobi",
    publication: "Daily Nation",
    heroImage: "https://picsum.photos/seed/mag002/600/500",
    summary: "A deep look into the changing media landscape and what it means for readers across the region. Local voices weigh in on culture, technology, and the future of storytelling.",
    publishedAt: "2026-06-02T22:16:44.189Z",
    sourceUrl: "https://example.com/article/002"
  },
  {
    id: "003",
    title: "Local Author Wins International Award",
    publication: "Business Daily",
    heroImage: "https://picsum.photos/seed/mag003/600/600",
    summary: "A deep look into the changing media landscape and what it means for readers across the region. Local voices weigh in on culture, technology, and the future of storytelling.",
    publishedAt: "2026-06-01T22:16:44.189Z",
    sourceUrl: "https://example.com/article/003"
  },
  {
    id: "004",
    title: "Digital Libraries Expand Across East Africa",
    publication: "The Star",
    heroImage: "https://picsum.photos/seed/mag004/600/400",
    summary: "A deep look into the changing media landscape and what it means for readers across the region. Local voices weigh in on culture, technology, and the future of storytelling.",
    publishedAt: "2026-05-31T22:16:44.189Z",
    sourceUrl: "https://example.com/article/004"
  },
  {
    id: "005",
    title: "The Future of Print Media",
    publication: "Capital FM",
    heroImage: "https://picsum.photos/seed/mag005/600/500",
    summary: "A deep look into the changing media landscape and what it means for readers across the region. Local voices weigh in on culture, technology, and the future of storytelling.",
    publishedAt: "2026-05-30T22:16:44.189Z",
    sourceUrl: "https://example.com/article/005"
  },
  {
    id: "006",
    title: "Coffee, Books, and Community",
    publication: "Tuko News",
    heroImage: "https://picsum.photos/seed/mag006/600/600",
    summary: "A deep look into the changing media landscape and what it means for readers across the region. Local voices weigh in on culture, technology, and the future of storytelling.",
    publishedAt: "2026-05-29T22:16:44.189Z",
    sourceUrl: "https://example.com/article/006"
  },
  {
    id: "007",
    title: "Nairobi International Book Fair Returns",
    publication: "Citizen Digital",
    heroImage: "https://picsum.photos/seed/mag007/600/400",
    summary: "A deep look into the changing media landscape and what it means for readers across the region. Local voices weigh in on culture, technology, and the future of storytelling.",
    publishedAt: "2026-05-28T22:16:44.189Z",
    sourceUrl: "https://example.com/article/007"
  },
  {
    id: "008",
    title: "Why Audiobooks Are Surging in Kenya",
    publication: "NTV Kenya",
    heroImage: "https://picsum.photos/seed/mag008/600/500",
    summary: "A deep look into the changing media landscape and what it means for readers across the region. Local voices weigh in on culture, technology, and the future of storytelling.",
    publishedAt: "2026-05-27T22:16:44.189Z",
    sourceUrl: "https://example.com/article/008"
  },
  {
    id: "009",
    title: "Independent Bookstores Find New Audiences",
    publication: "KTN News",
    heroImage: "https://picsum.photos/seed/mag009/600/600",
    summary: "A deep look into the changing media landscape and what it means for readers across the region. Local voices weigh in on culture, technology, and the future of storytelling.",
    publishedAt: "2026-05-26T22:16:44.189Z",
    sourceUrl: "https://example.com/article/009"
  },
  {
    id: "010",
    title: "The Rise of Mobile Reading",
    publication: "People Daily",
    heroImage: "https://picsum.photos/seed/mag010/600/400",
    summary: "A deep look into the changing media landscape and what it means for readers across the region. Local voices weigh in on culture, technology, and the future of storytelling.",
    publishedAt: "2026-05-25T22:16:44.189Z",
    sourceUrl: "https://example.com/article/010"
  }
];
const BASE = "http://localhost:8000";
async function handleFetchWithFallback(networkRequest, fallbackData) {
  try {
    return await networkRequest();
  } catch (error) {
    console.warn("Backend unavailable or returned an error. Using offline JSON fallback data.", error);
    return fallbackData;
  }
}
async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return await res.json();
}
const api = {
  books: {
    trending: () => handleFetchWithFallback(() => get("/books/trending"), booksData),
    search: (q, genre = "") => handleFetchWithFallback(
      () => get(`/books/search?q=${encodeURIComponent(q)}&genre=${encodeURIComponent(genre)}`),
      booksData
    ),
    detail: (id) => handleFetchWithFallback(
      () => get(`/books/${id}`),
      booksData.find((b) => b.id === id) || booksData[0]
    ),
    coverUrl: (id) => `${BASE}/books/${id}/cover`
  },
  magazines: {
    bulletin: (limit = 30) => handleFetchWithFallback(() => get(`/magazines/bulletin?limit=${limit}`), mockMagazines),
    eastAfrica: (limit = 60) => handleFetchWithFallback(() => get(`/magazines/eastafrica?limit=${limit}`), mockMagazines),
    business: (limit = 30) => handleFetchWithFallback(() => get(`/magazines/business?limit=${limit}`), mockMagazines),
    lifestyle: (limit = 20) => handleFetchWithFallback(() => get(`/magazines/lifestyle?limit=${limit}`), mockMagazines),
    technology: (limit = 20) => handleFetchWithFallback(() => get(`/magazines/technology?limit=${limit}`), mockMagazines),
    feeds: (countries = "", categories = "", limit = 60) => handleFetchWithFallback(
      () => get(`/magazines/feeds?countries=${encodeURIComponent(countries)}&categories=${encodeURIComponent(categories)}&limit=${limit}`),
      mockMagazines
    ),
    archive: (q) => handleFetchWithFallback(
      () => get(`/magazines/archive?q=${encodeURIComponent(q)}`),
      mockMagazines
    )
  }
};
export {
  api as a
};
