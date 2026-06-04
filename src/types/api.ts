export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  price: number;
  genre: string[];
  description: string;
  pages: number;
  readingTime: string;
  formats: ("epub" | "audio")[];
  gutendexId?: number;
  librivoxId?: string;
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
