export interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  description: string;
  genre: string | string[];
  cover?: string;
  rating?: number;
  price?: number;
  pages?: number;
  readingTime?: string | number;
  formats?: ("epub" | "audio" | "html" | "text" | string)[];
  gutendexId?: number;
  librivoxId?: string;
  read_url?: string;
  epub_url?: string;
  download_url?: string;
}

export interface Episode {
  id: string;
  title: string;
  show: string;
  artwork: string;
  duration: number;
  enclosureUrl: string;
  publishedAt: string;
}

export interface Article {
  id: string;
  title: string;
  publication: string;
  country?: string;
  category?: string;
  heroImage: string;
  summary: string;
  sourceUrl: string;
  publishedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  genres: string[];
  readingGoal: number;
  preferredFormats: string[];
}

export interface AudiobookChapter {
  id: string;
  title: string;
  duration: number;
  listen_url: string;
}

export interface AudiobookDetail {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  chapters: AudiobookChapter[];
}

export interface PodcastChannel {
  id: string;
  title: string;
  author: string;
  description: string;
  artwork: string;
  feedUrl: string;
}

export interface RecommendResponse {
  recommendations: Book[];
  reasoning: string;
}