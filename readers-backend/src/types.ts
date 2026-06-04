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
  readingTime: number; // in minutes
  formats: string[];
  gutendexId?: number;
  librivoxId?: number;
}

export interface Episode {
  id: string;
  title: string;
  show: string;
  artwork: string;
  duration: number; // in seconds
  enclosureUrl: string;
  publishedAt: string;
}

export interface Article {
  id: string;
  title: string;
  publication: string;
  heroImage: string;
  summary: string;
  sourceUrl: string;
  publishedAt: string;
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

export interface Flashcard {
  front: string;
  back: string;
}

export interface RecommendResponse {
  recommendations: Book[];
  reasoning: string;
}
