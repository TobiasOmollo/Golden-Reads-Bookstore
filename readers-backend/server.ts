import express from "express";
import path from "path";
// We use node-native global fetch() for fast, async content deliveries

import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const api_key = process.env.GEMINI_API_KEY;
if (api_key && api_key !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({ apiKey: api_key });
    console.log("Gemini API configured successfully in Node server.");
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
}

// GENRE_MAP
const GENRE_MAP: Record<string, string[]> = {
  "Fiction":    ["Fiction", "Stories", "Tales", "Short stories"],
  "Romance":    ["Love stories", "Romance", "Courtship", "Domestic fiction"],
  "Thriller":   ["Detective stories", "Mystery fiction", "Suspense", "Crime", "Murder"],
  "Mystery":    ["Mystery", "Detective", "Investigation", "Whodunit"],
  "Fantasy":    ["Fairy tales", "Fantasy fiction", "Magic", "Mythology"],
  "Business":   ["Economics", "Finance", "Commerce", "Business"],
  "Biography":  ["Biography", "Autobiography", "Correspondence", "Memoir"],
  "Technology": ["Science", "Technology", "Engineering", "Mathematics", "Evolution"],
  "Self-Help":  ["Conduct of life", "Success", "Philosophy, Practical", "Ethics"],
  "History":    ["History", "Antiquities", "Historical fiction"],
};

// Map subjects to genres
function mapGenres(subjects: string[]): string[] {
  const mapped = new Set<string>();
  for (const subject of subjects) {
    for (const [genre, keywords] of Object.entries(GENRE_MAP)) {
      for (const kw of keywords) {
        if (subject.toLowerCase().includes(kw.toLowerCase())) {
          mapped.add(genre);
        }
      }
    }
  }
  if (mapped.size === 0) {
    mapped.add("Fiction");
  }
  return Array.from(mapped);
}

// Convert Gutendex book back to Shared Contract
function convertToBook(item: any): any {
  const authorList = item.authors || [];
  let authorName = "Unknown Author";
  if (authorList.length > 0) {
    authorName = authorList[0].name || "Unknown Author";
    if (authorName.includes(",")) {
      const parts = authorName.split(",");
      authorName = `${parts[1].trim()} ${parts[0].trim()}`;
    }
  }

  const formatsDict = item.formats || {};
  const formats: string[] = [];
  if (formatsDict["application/epub+zip"]) formats.push("epub");
  if (formatsDict["text/html"]) formats.push("html");
  if (formatsDict["text/plain; charset=us-ascii"] || formatsDict["text/plain"]) formats.push("text");

  const gid = item.id;
  const subjects = item.subjects || [];
  const genres = mapGenres(subjects);

  const pages = Math.max(100, Math.floor((gid % 400) + 120));
  const readingTime = Math.max(90, Math.floor(pages * 1.5));
  const ratingSeed = (gid % 15) / 10.0;
  const rating = ratingSeed <= 1.5 ? +(3.5 + ratingSeed).toFixed(1) : 4.5;
  const priceSeed = (gid % 30);
  const price = priceSeed < 10 ? 0.0 : +(2.99 + priceSeed * 0.4).toFixed(2);

  const description = subjects.length > 0 ? subjects.join(", ") : `A classic book of the genre ${genres.join(", ")}.`;

  return {
    id: String(gid),
    title: item.title || "Untitled Book",
    author: authorName,
    cover: `https://picsum.photos/seed/book_${gid}/200/300`, // Default, but can be proxied
    rating,
    price,
    genre: genres,
    description,
    pages,
    readingTime,
    formats,
    gutendexId: gid
  };
}

// 1. BOOKS ENDPOINTS
app.get("/books/search", async (req, res) => {
  const q = req.query.q as string;
  const genre = req.query.genre as string;
  const page = req.query.page || "1";

  try {
    let url = `https://gutendex.com/books/?page=${page}`;
    if (q) url += `&search=${encodeURIComponent(q)}`;
    if (genre) {
      const keywords = GENRE_MAP[genre] || [genre];
      url += `&topic=${encodeURIComponent(keywords[0])}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: "Gutendex API returned an error" });
    }
    const data = await response.json();
    const books = (data.results || []).map((b: any) => convertToBook(b));
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/books/trending", async (req, res) => {
  try {
    const url = "https://gutendex.com/books/?sort=-popular";
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: "Gutendex API offline" });
    }
    const data = await response.json();
    const books = (data.results || []).slice(0, 20).map((b: any) => convertToBook(b));
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const url = `https://gutendex.com/books/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(404).json({ error: "Book not found" });
    }
    const data = await response.json();
    res.json(convertToBook(data));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/books/:id/cover", (req, res) => {
  const { id } = req.params;
  // Redirect to avoid CORS in direct load
  res.redirect(`https://picsum.photos/seed/book_${id}/300/450`);
});

// Helper for parsing duration strings like 12:34:56 to seconds
function parseDurationSecs(str: string): number {
  if (!str) return 300;
  try {
    const parts = str.split(":").map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      return parts[0];
    }
  } catch (e) {}
  return 300;
}

// 2. AUDIOBOOKS ENDPOINTS
app.get("/audiobooks/search", async (req, res) => {
  const q = req.query.q as string;
  try {
    const url = `https://librivox.org/api/feed/audiobooks/?title=${encodeURIComponent(q)}&format=json&extended=1`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.json([]);
    }
    const data = await response.json();
    const booksList = data.books || [];
    
    const results = booksList.map((item: any) => {
      const sections = item.sections || [];
      const chapters = sections.map((s: any) => ({
        id: String(s.id || s.section_number),
        title: s.title || `Chapter ${s.section_number}`,
        duration: parseDurationSecs(s.playtime),
        listen_url: s.listen_url || item.url_zip_file || ""
      }));

      // Fallback chapter
      if (chapters.length === 0) {
        chapters.push({
          id: "all",
          title: "Full Audiobook Stream",
          duration: 3600,
          listen_url: item.url_zip_file || ""
        });
      }

      let author = "Unknown Author";
      if (item.authors && item.authors.length > 0) {
        const a = item.authors[0];
        author = `${a.first_name || ""} ${a.last_name || ""}`.trim() || "Unknown Author";
      }

      return {
        id: String(item.id),
        title: item.title || "Untitled Audiobook",
        author,
        description: item.description || "Classic narrative audiobook.",
        cover: `https://picsum.photos/seed/audio_${item.id}/200/300`,
        chapters
      };
    });

    res.json(results);
  } catch (error: any) {
    res.json([]);
  }
});

app.get("/audiobooks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const url = `https://librivox.org/api/feed/audiobooks/?id=${id}&format=json&extended=1`;
    const response = await fetch(url);
    if (!response.ok) return res.status(404).json({ error: "Audiobook not found" });
    const data = await response.json();
    const booksList = data.books || [];
    if (booksList.length === 0) return res.status(404).json({ error: "Audiobook not found" });
    
    const item = booksList[0];
    const sections = item.sections || [];
    const chapters = sections.map((s: any) => ({
      id: String(s.id || s.section_number),
      title: s.title || `Chapter ${s.section_number}`,
      duration: parseDurationSecs(s.playtime),
      listen_url: s.listen_url || item.url_zip_file || ""
    }));

    if (chapters.length === 0) {
      chapters.push({
        id: "all",
        title: "Full Audiobook Stream",
        duration: 3600,
        listen_url: item.url_zip_file || ""
      });
    }

    let author = "Unknown Author";
    if (item.authors && item.authors.length > 0) {
      const a = item.authors[0];
      author = `${a.first_name || ""} ${a.last_name || ""}`.trim() || "Unknown Author";
    }

    res.json({
      id: String(item.id),
      title: item.title || "Untitled Audiobook",
      author,
      description: item.description || "Classic narrative audiobook.",
      cover: `https://picsum.photos/seed/audio_${item.id}/200/300`,
      chapters
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Helper: Custom HMAC implementation for Podcast Index
function getPodcastIndexHeaders() {
  const key = process.env.PODCAST_INDEX_KEY || "";
  const secret = process.env.PODCAST_INDEX_SECRET || "";

  if (!key || !secret) return null;

  const epoch = Math.floor(Date.now() / 1000).toString();
  const hash_msg = key + secret + epoch;
  const sha1 = crypto
    .createHmac("sha1", secret)
    .update(hash_msg)
    .digest("hex");

  return {
    "X-Auth-Key": key,
    "X-Auth-Date": epoch,
    "Authorization": sha1,
    "User-Agent": "ReadersPWA/1.0"
  };
}

// 3. PODCASTS ENDPOINTS
app.get("/podcasts/search", async (req, res) => {
  const q = req.query.q as string;
  const headers = getPodcastIndexHeaders();
  
  if (!headers) {
    // Return standard tech, culture mocks
    return res.json([
      {
        id: "mock_1",
        title: "The Daily Tech Talk",
        author: "Sarah Jenkins",
        description: "Your daily briefing on technology trends, developer tools, and product design.",
        artwork: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=300&q=80",
        feedUrl: "https://techcrunch.com/feed/"
      },
      {
        id: "mock_2",
        title: "Kenyan Chronicles",
        author: "Kariuki Mwangi",
        description: "Deep-dives into Kenyan history, culture, business growth, and inspiring stories from Nairobi.",
        artwork: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&w=300&q=80",
        feedUrl: "https://nation.africa/rss.xml"
      }
    ]);
  }

  try {
    const url = `https://api.podcastindex.org/api/1.0/search/byterm?q=${encodeURIComponent(q)}`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    const feeds = data.feeds || [];
    const results = feeds.map((f: any) => ({
      id: String(f.id),
      title: f.title || "Untitled Podcast",
      author: f.author || "Unknown Host",
      description: f.description || "",
      artwork: f.artwork || f.image || `https://picsum.photos/seed/pod_${f.id}/300/300`,
      feedUrl: f.url || ""
    }));
    res.json(results);
  } catch (error) {
    res.json([]);
  }
});

app.get("/podcasts/:feedId/episodes", async (req, res) => {
  const { feedId } = req.params;
  const headers = getPodcastIndexHeaders();

  if (!headers || feedId.startsWith("mock_")) {
    return res.json([
      {
        id: `${feedId}_ep1`,
        title: "The Future of AI and Next-Gen PWA Backends",
        show: "The Daily Tech Talk",
        artwork: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=300&q=80",
        duration: 2110,
        enclosureUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        publishedAt: "2026-06-03 12:00:00"
      },
      {
        id: `${feedId}_ep2`,
        title: "Kenya tech innovation hubs and the silicon savannah",
        show: "Kenyan Chronicles",
        artwork: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&w=300&q=80",
        duration: 1840,
        enclosureUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        publishedAt: "2026-06-02 10:30:00"
      }
    ]);
  }

  try {
    const url = `https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${feedId}`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    const items = data.items || [];
    const episodes = items.map((i: any) => {
      let pubStr = "Recently";
      if (i.datePublished) {
        pubStr = new Date(i.datePublished * 1000).toISOString().replace("T", " ").substring(0, 19);
      }
      return {
        id: String(i.id),
        title: i.title || "Untitled Episode",
        show: i.feedTitle || "Podcast Show",
        artwork: i.feedImage || i.image || "https://picsum.photos/seed/epi/300/300",
        duration: Number(i.duration || 1800),
        enclosureUrl: i.enclosureUrl || "",
        publishedAt: pubStr
      };
    });
    res.json(episodes);
  } catch (error) {
    res.json([]);
  }
});

// Helper: Fast RegExp XML parsing since feedparser package is synchronous
// Extracts <item> block content safely for a few feeds
async function parseXMLFeed(feedUrl: string, pubName: string, country: string, category: string): Promise<any[]> {
  try {
    const response = await fetch(feedUrl);
    if (!response.ok) return [];
    const text = await response.text();
    
    // Parse items using regex for maximum speed and simplicity
    const items: any[] = [];
    const itemMatches = text.matchAll(/<item>([\s\S]*?)<\/item>/g);
    
    for (const match of itemMatches) {
      if (items.length >= 10) break;
      const content = match[1];
      
      const titleMatch = content.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || content.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = content.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/) || content.match(/<link>([\s\S]*?)<\/link>/);
      const descMatch = content.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || content.match(/<description>([\s\S]*?)<\/description>/);
      const dateMatch = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      
      // Image Extraction Order: media:content -> media:thumbnail -> enclosure -> og:image
      let image = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";
      
      const mediaContentMatch = content.match(/<media:content[^>]+url=["']([^"']+)["']/);
      const mediaThumbMatch = content.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/);
      const encMatch = content.match(/<enclosure[^>]+url=["']([^"']+)["']/);
      
      if (mediaContentMatch) {
         image = mediaContentMatch[1];
      } else if (mediaThumbMatch) {
         image = mediaThumbMatch[1];
      } else if (encMatch) {
         image = encMatch[1];
      }
      
      let title = titleMatch ? titleMatch[1].trim() : "Untitled";
      let link = linkMatch ? linkMatch[1].trim() : "";
      let desc = descMatch ? descMatch[1].trim() : "Click 'Read Original' to view the full details.";
      let pubDate = dateMatch ? dateMatch[1] : new Date().toUTCString();

      // Clean HTML tags from summary
      desc = desc.replace(/<[^>]*>/g, "").trim();
      if (desc.length > 250) {
        desc = desc.substring(0, 247) + "...";
      }

      if (link) {
        const articleId = crypto.createHash("md5").update(link).digest("hex");
        items.push({
          id: articleId.substring(0, 12),
          title,
          publication: pubName,
          country,
          category,
          heroImage: image,
          summary: desc || "Read the complete summary inside the publication panel.",
          sourceUrl: link,
          publishedAt: pubDate
        });
      }
    }
    
    return items;
  } catch (e) {
    return [];
  }
}

const RSS_SOURCES = [
  // --- KENYA (country: "KE") ---
  { name: "Daily Nation — Kenya", url: "https://nation.africa/service/rss/feed/kenya/-/1174/1174/-/index.xml", country: "KE", category: "general" },
  { name: "Daily Nation — Business", url: "https://nation.africa/service/rss/feed/business/-/1186/1186/-/index.xml", country: "KE", category: "business" },
  { name: "Daily Nation — Life & Style", url: "https://nation.africa/service/rss/feed/lifestyle/-/1188/1188/-/index.xml", country: "KE", category: "lifestyle" },
  { name: "The Standard — Kenya", url: "https://www.standardmedia.co.ke/rss/kenya.php", country: "KE", category: "general" },
  { name: "The Standard — Business", url: "https://www.standardmedia.co.ke/rss/business.php", country: "KE", category: "business" },
  { name: "The Standard — Sports", url: "https://www.standardmedia.co.ke/rss/sports.php", country: "KE", category: "sports" },
  { name: "Business Daily Africa", url: "https://businessdailyafrica.com/rss.xml", country: "KE", category: "business" },
  { name: "Tuko.co.ke", url: "https://www.tuko.co.ke/rss.xml", country: "KE", category: "general" },
  { name: "Citizen Digital — Kenya", url: "https://www.citizentv.co.ke/feed/", country: "KE", category: "general" },
  { name: "KBC Kenya", url: "https://www.kbc.co.ke/feed/", country: "KE", category: "general" },
  { name: "The Star Kenya", url: "https://the-star.co.ke/rss.xml", country: "KE", category: "general" },
  { name: "Capital FM Lifestyle / Magazines", url: "https://www.capitalfm.co.ke/lifestyle/feed/", country: "KE", category: "lifestyle" },
  { name: "Capital FM News", url: "https://www.capitalfm.co.ke/news/feed/", country: "KE", category: "general" },
  { name: "People Daily Kenya", url: "https://www.pd.co.ke/feed/", country: "KE", category: "general" },
  { name: "Nairobi News", url: "https://nairobinews.nation.africa/feed/", country: "KE", category: "general" },

  // --- REGIONAL — EAST AFRICA (country: "EA") ---
  { name: "The EastAfrican", url: "https://www.theeastafrican.co.ke/tea/rss.xml", country: "EA", category: "general" },
  { name: "The EastAfrican — Business", url: "https://www.theeastafrican.co.ke/tea/business/rss.xml", country: "EA", category: "business" },
  { name: "Africanews — East Africa", url: "https://www.africanews.com/feed/rss", country: "EA", category: "general" },
  { name: "AllAfrica — East Africa", url: "https://allafrica.com/tools/headlines/rdf/eastafrica/headlines.rdf", country: "EA", category: "general" },
  { name: "The Africa Report", url: "https://www.theafricareport.com/feed/", country: "EA", category: "general" },
  { name: "Africa.com", url: "https://africa.com/feed/", country: "EA", category: "general" },

  // --- UGANDA (country: "UG") ---
  { name: "Daily Monitor — Uganda", url: "https://www.monitor.co.ug/Uganda/rss.xml", country: "UG", category: "general" },
  { name: "Daily Monitor — Business", url: "https://www.monitor.co.ug/Uganda/Business/rss.xml", country: "UG", category: "business" },
  { name: "New Vision Uganda", url: "https://www.newvision.co.ug/rss.xml", country: "UG", category: "general" },
  { name: "New Vision — Business", url: "https://www.newvision.co.ug/business/rss.xml", country: "UG", category: "business" },
  { name: "Nile Post Uganda", url: "https://nilepost.co.ug/feed/", country: "UG", category: "general" },
  { name: "The Independent Uganda", url: "https://www.independent.co.ug/feed/", country: "UG", category: "general" },
  { name: "Chimp Reports", url: "https://chimpreports.com/feed/", country: "UG", category: "general" },

  // --- TANZANIA (country: "TZ") ---
  { name: "The Citizen Tanzania", url: "https://www.thecitizen.co.tz/tanzania/rss.xml", country: "TZ", category: "general" },
  { name: "The Citizen — Business", url: "https://www.thecitizen.co.tz/tanzania/business/rss.xml", country: "TZ", category: "business" },
  { name: "Daily News Tanzania", url: "https://www.dailynews.co.tz/rss.xml", country: "TZ", category: "general" },
  { name: "IPP Media Tanzania", url: "https://www.ippmedia.com/rss.xml", country: "TZ", category: "general" },
  { name: "Tanzania Invest", url: "https://tanzaniainvest.com/feed/", country: "TZ", category: "business" },

  // --- RWANDA (country: "RW") ---
  { name: "The New Times Rwanda", url: "https://www.newtimes.co.rw/rss.xml", country: "RW", category: "general" },
  { name: "The New Times — Business", url: "https://www.newtimes.co.rw/business/rss.xml", country: "RW", category: "business" },
  { name: "KT Press Rwanda", url: "https://www.ktpress.rw/feed/", country: "RW", category: "general" },
  { name: "Rwanda Today", url: "https://rwandatoday.africa/feed/", country: "RW", category: "general" },

  // --- ETHIOPIA (country: "ET") ---
  { name: "Ethiopian Reporter (English)", url: "https://www.thereporter.com.et/feed/", country: "ET", category: "general" },
  { name: "Addis Standard", url: "https://addisstandard.com/feed/", country: "ET", category: "general" },
  { name: "Addis Fortune", url: "https://addisfortune.news/feed/", country: "ET", category: "business" },
  { name: "Borkena Ethiopian News", url: "https://borkena.com/feed/", country: "ET", category: "general" },

  // --- PAN-AFRICAN / MAGAZINES (country: "PAN") ---
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", country: "PAN", category: "technology" },
  { name: "Wired", url: "https://www.wired.com/feed/rss", country: "PAN", category: "technology" },
  { name: "Harvard Business Review", url: "https://feeds.hbr.org/harvardbusiness", country: "PAN", category: "business" },
  { name: "National Geographic", url: "https://www.nationalgeographic.com/feed/rss", country: "PAN", category: "science" },
  { name: "Scientific American", url: "https://www.scientificamerican.com/feed/rss", country: "PAN", category: "science" },
  { name: "BBC Africa", url: "https://feeds.bbci.co.uk/news/world/africa/rss.xml", country: "PAN", category: "general" },
  { name: "Reuters — Africa", url: "https://feeds.reuters.com/Reuters/AfricaNews", country: "PAN", category: "general" }
];

// 4. MAGAZINES ENDPOINTS
app.get("/magazines/feeds", async (req, res) => {
  const sources = (req.query.sources as string) || "ke,tech";
  const sourceKeys = sources.split(",").map(s => s.trim().toLowerCase());

  const filtered = RSS_SOURCES.filter(src => {
    return sourceKeys.some(key => {
      if (key === "ke") {
        return src.country === "KE" || src.country === "EA" || src.country === "UG" || src.country === "TZ" || src.country === "RW" || src.country === "ET";
      }
      if (key === "tech") {
        return src.category === "technology" || src.category === "science";
      }
      if (key === "science") {
        return src.category === "science" || src.category === "lifestyle";
      }
      return false;
    });
  });

  const tasks = filtered.map(f => parseXMLFeed(f.url, f.name, f.country, f.category));

  try {
    const results = await Promise.all(tasks);
    const merged: any[] = [];
    const seen = new Set();

    for (const items of results) {
      for (const item of items) {
        if (!seen.has(item.sourceUrl)) {
          seen.add(item.sourceUrl);
          merged.push(item);
        }
      }
    }

    // Sort by pubDate descending (simple timestamp parser)
    merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    res.json(merged);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/magazines/archive", async (req, res) => {
  const q = req.query.q as string;
  try {
    const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}%20AND%20mediatype:texts&fl[]=identifier&fl[]=title&fl[]=description&fl[]=date&rows=10&output=json`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    const docs = data.response?.docs || [];

    const articles = docs.map((doc: any) => {
      const identifier = doc.identifier;
      const desc = doc.description || "Archived classical text or digital magazine document.";
      const title = doc.title || "Archive Text";
      const date = doc.date ? doc.date.substring(0, 10) : "Archived";
      
      return {
        id: identifier,
        title,
        publication: "Internet Archive",
        heroImage: `https://archive.org/services/img/${identifier}`,
        summary: desc.length > 250 ? desc.substring(0, 247) + "..." : desc,
        sourceUrl: `https://archive.org/embed/${identifier}`,
        publishedAt: date
      };
    });

    res.json(articles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. AI ENDPOINTS
app.post("/ai/summarize", async (req, res) => {
  const { bookId, chapter } = req.body;
  if (!ai) {
    return res.json({ summary: `[OFFLINE MOCK] This is a concise chapter summary for Book ID ${bookId}, section ${chapter}. To acquire real live summaries, please enter a valid standard GEMINI_API_KEY in your cloud settings.` });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Provide a concise, extremely high-quality summary of the section '${chapter}' of classic book Gutenberg ID ${bookId}. Synthesize main plot points and themes. Keep written contents under 120 words.`,
      config: { maxOutputTokens: 500 }
    });
    res.json({ summary: response.text });
  } catch (e: any) {
    if (e.status === 429) {
      return res.status(429).json({ detail: "quota_exceeded" });
    }
    res.status(500).json({ error: e.message });
  }
});

app.post("/ai/flashcards", async (req, res) => {
  const { text } = req.body;
  if (!ai || !text) {
    return res.json([
      { front: "Who wrote 'The Adventures of Sherlock Holmes'?", back: "Sir Arthur Conan Doyle" },
      { front: "Where does Sherlock Holmes reside?", back: "221B Baker Street, London" },
      { front: "What is Holmes' companion's name?", back: "Dr. John Watson" }
    ]);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Formulate exactly 3 educational flashcards from this passage: "${text}". Output MUST be a strict raw JSON array of objects, containing exclusively two parameters: "front" and "back". Do not add markdown formatting or wrapper texts. Example: [{"front": "Q", "back": "A"}]`,
      config: { maxOutputTokens: 500, responseMimeType: "application/json" }
    });
    
    let parsed = JSON.parse(response.text.trim());
    if (!Array.isArray(parsed) && parsed.flashcards) {
       parsed = parsed.flashcards;
    }
    res.json(parsed);
  } catch (e: any) {
    if (e.status === 429) {
      return res.status(429).json({ detail: "quota_exceeded" });
    }
    res.json([
      { front: "Study Question", back: "An explanation corresponding to the reading." }
    ]);
  }
});

app.post("/ai/recommend", async (req, res) => {
  const { genres, history } = req.body;
  if (!ai) {
    return res.json({
      recommendations: [
        {
          id: "1342",
          title: "Pride and Prejudice",
          author: "Jane Austen",
          cover: "https://picsum.photos/seed/book_1342/200/300",
          rating: 4.8,
          price: 0.0,
          genre: ["Fiction", "Romance"],
          description: "Austen's classic romantic novel focusing on Elizabeth Bennet.",
          pages: 352,
          readingTime: 520,
          formats: ["epub", "html"]
        }
      ],
      reasoning: "Standard classic recommended because the AI search is in offline demonstration mode."
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Recommend 3 public domain classics for a reader who loves genres: [${genres.join(", ")}] and has history: [${history.join(", ")}]. Output a single JSON object with 'reasoning' (text justification) and 'books' (array containing keys: 'id' as typical Gutenberg ID, 'title', 'author', 'reason').`,
      config: { maxOutputTokens: 500, responseMimeType: "application/json" }
    });
    
    const parsed = JSON.parse(response.text.trim());
    const reasoning = parsed.reasoning || "Tailored recommendation based on historical works.";
    const books = (parsed.books || []).map((b: any) => ({
      id: String(b.id || Math.floor(Math.random() * 5000) + 1),
      title: b.title,
      author: b.author || "Classic Author",
      cover: `https://picsum.photos/seed/book_${b.id}/200/300`,
      rating: 4.6,
      price: 0.0,
      genre: genres,
      description: b.reason || "Recommended literature.",
      pages: 300,
      readingTime: 450,
      formats: ["epub"]
    }));

    res.json({ recommendations: books, reasoning });
  } catch (e: any) {
    if (e.status === 429) {
       return res.status(429).json({ detail: "quota_exceeded" });
    }
    // Fallback
    res.json({
      recommendations: [],
      reasoning: "Could not generate custom recommendations."
    });
  }
});

app.post("/ai/explain", async (req, res) => {
  const { passage, context } = req.body;
  if (!ai) {
    return res.json({ explanation: `[OFFLINE MODE] This explains: "${passage}". To enable full historical meaning breakdowns and vocabulary contextual definitions, configure a Gemini API Key on your workspace settings.` });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Explain this expression/passage: "${passage}" in the context of this reading section: "${context}". Keep explanation clear and confined within 80 words.`,
      config: { maxOutputTokens: 500 }
    });
    res.json({ explanation: response.text });
  } catch (e: any) {
    if (e.status === 429) {
      return res.status(429).json({ detail: "quota_exceeded" });
    }
    res.status(500).json({ error: e.message });
  }
});


// Hook Vite dev server in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Node Full-Stack Companion Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
