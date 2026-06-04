import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Volume2,
  Tv,
  Newspaper,
  Compass,
  Search,
  Sparkles,
  Play,
  RotateCcw,
  BookMarked,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileText,
  Bookmark,
  Heart,
  User,
  AudioLines,
  X
} from "lucide-react";
import { Book, AudiobookDetail, PodcastChannel, Episode, Article } from "./types";
import AudioPlayer from "./components/AudioPlayer";
import AiAssistant from "./components/AiAssistant";
import BookReader from "./components/BookReader";

export default function App() {
  const [activeTab, setActiveTab] = useState<"books" | "audiobooks" | "podcasts" | "magazines">("books");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Loaded/State Lists
  const [books, setBooks] = useState<Book[]>([]);
  const [audiobooks, setAudiobooks] = useState<AudiobookDetail[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastChannel[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  
  // Detail/Action overlays
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<AudiobookDetail | null>(null);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastChannel | null>(null);
  const [podcastEpisodes, setPodcastEpisodes] = useState<Episode[]>([]);

  // Loading States
  const [loading, setLoading] = useState(false);
  
  // Audio Player track
  const [activeTrack, setActiveTrack] = useState<{
    title: string;
    artist: string;
    artwork: string;
    url: string;
    duration?: number;
  } | null>(null);

  // AI Assistant triggers
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [textSelection, setTextSelection] = useState<{ text: string; context: string } | undefined>(undefined);

  // User Shelf list
  const [myShelf, setMyShelf] = useState<Book[]>([
    {
      id: "1342",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      cover: "https://picsum.photos/seed/book_1342/200/300",
      rating: 4.8,
      price: 0,
      genre: ["Fiction", "Romance"],
      description: "Elizabeth Bennet navigate romantic tensions and social prejudices.",
      pages: 352,
      readingTime: 480,
      formats: ["epub", "html"]
    },
    {
      id: "1661",
      title: "The Adventures of Sherlock Holmes",
      author: "Arthur Conan Doyle",
      cover: "https://picsum.photos/seed/book_1661/200/300",
      rating: 4.7,
      price: 0,
      genre: ["Fiction", "Mystery"],
      description: "A collection of twelve detective stories featuring classic mastermind deductions.",
      pages: 280,
      readingTime: 420,
      formats: ["epub", "html"]
    }
  ]);

  // Handle Initial Fetch
  useEffect(() => {
    fetchTrendingBooks();
    fetchMagazines("ke");
  }, []);

  const fetchTrendingBooks = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/books/trending");
      if (resp.ok) {
        const data = await resp.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Failed to load trending books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      let url = `/books/search?q=${encodeURIComponent(searchQuery)}`;
      if (selectedGenre) {
        url += `&genre=${encodeURIComponent(selectedGenre)}`;
      }
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Book query failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch(`/audiobooks/search?q=${encodeURIComponent(searchQuery)}`);
      if (resp.ok) {
        const data = await resp.json();
        setAudiobooks(data);
      }
    } catch (err) {
      console.error("Audiobook query failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePodcastSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch(`/podcasts/search?q=${encodeURIComponent(searchQuery)}`);
      if (resp.ok) {
        const data = await resp.json();
        setPodcasts(data);
      }
    } catch (err) {
      console.error("Podcast query failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPodcastEpisodes = async (feedId: string) => {
    setLoading(true);
    try {
      const resp = await fetch(`/podcasts/${feedId}/episodes`);
      if (resp.ok) {
        const data = await resp.json();
        setPodcastEpisodes(data);
      }
    } catch (err) {
      console.error("Failed to get episodes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMagazines = async (sources: string) => {
    setLoading(true);
    try {
      const resp = await fetch(`/magazines/feeds?sources=${sources}`);
      if (resp.ok) {
        const data = await resp.json();
        setArticles(data);
      }
    } catch (err) {
      console.error("RSS load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArchiveMagazines = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch(`/magazines/archive?q=${encodeURIComponent(searchQuery)}`);
      if (resp.ok) {
        const data = await resp.json();
        setArticles(data);
      }
    } catch (err) {
      console.error("Internet Archive search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImportRecommendedBook = (book: Book) => {
    setMyShelf(prev => {
      if (prev.some(b => b.id === book.id)) return prev;
      return [book, ...prev];
    });
    // Visual alert or switch
    setSelectedBook(book);
    setActiveTab("books");
  };

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-800 font-sans flex flex-col pb-28">
      {/* Top Header Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-900 leading-none mb-1">Readers PWA</h1>
              <p className="text-[10px] font-mono text-slate-500 font-medium">LITERATURE & MEDIA COMPANION</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAiOpen(!isAiOpen)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center gap-1.5 border border-indigo-200/50 transition-all font-mono active:scale-95 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              Gemini Companion
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-50 p-1 px-2.5 rounded border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>SYNCED</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left side column: Primary category selection and active profile stats */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
            <h3 className="text-[11px] font-mono text-slate-400 font-bold tracking-widest uppercase">Content Libraries</h3>
            <nav className="flex flex-col gap-1 text-sm font-medium">
              <button
                onClick={() => { setActiveTab("books"); setSearchQuery(""); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${activeTab === "books" ? "bg-indigo-600 text-white" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4" />
                  <span>eBooks Collection</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveTab("audiobooks"); setSearchQuery(""); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${activeTab === "audiobooks" ? "bg-indigo-600 text-white" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4" />
                  <span>Audiobooks</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveTab("podcasts"); setSearchQuery(""); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${activeTab === "podcasts" ? "bg-indigo-600 text-white" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <div className="flex items-center gap-2.5">
                  <AudioLines className="w-4 h-4" />
                  <span>Podcast Channels</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveTab("magazines"); setSearchQuery(""); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${activeTab === "magazines" ? "bg-indigo-600 text-white" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <div className="flex items-center gap-2.5">
                  <Newspaper className="w-4 h-4" />
                  <span>Publications & News</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </nav>
          </div>

          {/* My Shelf Section */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-mono text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5 text-slate-400" />
                My Shelf
              </h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-700">{myShelf.length} books</span>
            </div>
            
            <div className="space-y-3 max-h-[290px] overflow-y-auto">
              {myShelf.map(b => (
                <div
                  key={b.id}
                  onClick={() => { setSelectedBook(b); setActiveTab("books"); }}
                  className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50 cursor-pointer group"
                >
                  <img
                    src={b.cover}
                    alt={b.title}
                    className="w-10 h-14 rounded object-cover shadow border border-slate-200 referrerPolicy='no-referrer'"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate">{b.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{b.author}</p>
                    <span className="text-[10px] font-mono text-indigo-500 uppercase font-bold tracking-wider">{b.genre[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center column: Active display list and searching filters */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Universal Search and Filter Panel */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (activeTab === "books") handleBookSearch();
                else if (activeTab === "audiobooks") handleAudioSearch(e);
                else if (activeTab === "podcasts") handlePodcastSearch(e);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder={`Search details across ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 focus:bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-medium text-slate-800"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors active:scale-95"
              >
                Search
              </button>
            </form>

            {/* Additional contextual filters inside Books view */}
            {activeTab === "books" && (
              <div className="flex flex-wrap gap-1.5 items-center pt-1.5">
                <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider mr-2">Genres:</span>
                {["Fiction", "Mystery", "Romance", "Thriller", "Fantasy", "History"].map(g => {
                  const active = selectedGenre === g;
                  return (
                    <button
                      key={g}
                      onClick={() => {
                        const nextG = active ? null : g;
                        setSelectedGenre(nextG);
                        // Trigger lookup instantly
                        setLoading(true);
                        fetch(`/books/search?genre=${nextG || ""}`)
                          .then(r => r.json())
                          .then(setBooks)
                          .finally(() => setLoading(false));
                      }}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer font-medium font-mono ${active ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-white"}`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Additional filters for news publications */}
            {activeTab === "magazines" && (
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 flex-wrap gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchMagazines("ke")}
                    className="text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200/50"
                  >
                    Kenyan Bulletins
                  </button>
                  <button
                    onClick={() => fetchMagazines("tech")}
                    className="text-xs px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-lg border border-amber-200/50"
                  >
                    International Tech
                  </button>
                  <button
                    onClick={() => fetchMagazines("science")}
                    className="text-xs px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg border border-emerald-200/50"
                  >
                    Science & Heritage
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={fetchArchiveMagazines}
                    disabled={!searchQuery.trim()}
                    className="text-xs px-3 py-1.5 cursor-pointer bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 disabled:opacity-50 font-mono font-bold uppercase rounded-lg"
                    title="Queries advanced database in Internet Archive texts"
                  >
                    Search Internet Archive
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active List Rendering Grid */}
          <div className="space-y-4">
            
            {loading && (
              <div className="py-12 flex justify-center items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-indigo-600 animate-spin" />
                <span className="text-sm text-slate-500 font-medium">Scanning open-source databases...</span>
              </div>
            )}

            {/* Tab eBooks list */}
            {!loading && activeTab === "books" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {books.map(book => (
                  <div
                    key={book.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col group justify-between"
                  >
                    <div className="p-4 flex gap-4">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded shadow border border-slate-200 group-hover:scale-102 transition-transform referrerPolicy='no-referrer'"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-indigo-500 uppercase font-bold tracking-wider">{book.genre[0] || "Fiction"}</span>
                        <h4 className="text-sm font-semibold text-slate-900 truncate leading-relaxed pt-1">{book.title}</h4>
                        <p className="text-xs text-slate-500 truncate mb-1.5">{book.author}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-amber-500">&#9733; {book.rating || "4.5"}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({book.pages} pp)</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-500">{book.price === 0 ? "FREE READ" : `$${book.price}`}</span>
                      <button
                        onClick={() => setSelectedBook(book)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
                      >
                        Details <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {books.length === 0 && (
                  <div className="col-span-full py-10 bg-white border border-slate-200 rounded-xl text-center space-y-1">
                    <p className="text-sm text-slate-600 font-medium">No results found.</p>
                    <p className="text-xs text-slate-400">Search "Adventures" or selection categories to discover literature classics.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab Audiobooks list */}
            {!loading && activeTab === "audiobooks" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {audiobooks.map(audio => (
                  <div
                    key={audio.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between h-[180px] hover:shadow-md group"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">LIBRIVOX AUDIO</span>
                      <h4 className="text-sm font-semibold text-slate-900 truncate leading-relaxed group-hover:text-indigo-600 pt-1">{audio.title}</h4>
                      <p className="text-xs text-slate-500 mb-2 truncate">{audio.author || "Narrator Readings"}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 font-bold">{audio.chapters.length} chapters</span>
                      <button
                        onClick={() => setSelectedAudio(audio)}
                        className="p-1 px-3 bg-slate-900 group-hover:bg-indigo-600 cursor-pointer text-white text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Listen
                      </button>
                    </div>
                  </div>
                ))}

                {audiobooks.length === 0 && (
                  <div className="col-span-full py-12 bg-white rounded-xl border text-center space-y-1">
                    <p className="text-sm text-slate-600 font-medium">Type search queries to start exploring audiobooks.</p>
                    <p className="text-xs text-slate-400">e.g., search "Sherlock" or "Pride" to stream LibriVox chapter MP3s.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab Podcasts list */}
            {!loading && activeTab === "podcasts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {podcasts.map(pod => (
                  <div
                    key={pod.id}
                    onClick={() => { setSelectedPodcast(pod); fetchPodcastEpisodes(pod.id); }}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex gap-5 items-center cursor-pointer group"
                  >
                    <img
                      src={pod.artwork}
                      alt={pod.title}
                      className="w-16 h-16 rounded-lg object-cover shadow border border-slate-200 referrerPolicy='no-referrer'"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono text-indigo-500 uppercase font-bold tracking-widest block mb-1">PODCAST SHOW</span>
                      <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600">{pod.title}</h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">By {pod.author}</p>
                    </div>
                  </div>
                ))}

                {podcasts.length === 0 && (
                  <div className="col-span-full py-12 bg-white rounded-xl border text-center space-y-1">
                    <p className="text-sm text-slate-600 font-medium">Explore live podcast feeds from Podcast Index.</p>
                    <p className="text-xs text-slate-400">Search "Tech" or "Kenyan" to grab matching live episodes.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab Magazines/Feeds list */}
            {!loading && activeTab === "magazines" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {articles.map((art, idx) => (
                  <div
                    key={art.sourceUrl || idx}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group"
                  >
                    {art.heroImage && (
                      <div className="h-40 overflow-hidden relative">
                        <img
                          src={art.heroImage}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform referrerPolicy='no-referrer'"
                        />
                        <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white font-semibold font-mono text-[9px] uppercase px-2 py-0.5 rounded tracking-widest leading-normal backdrop-blur">
                          {art.publication}
                        </span>
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 leading-snug line-clamp-2">
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-serif leading-relaxed line-clamp-3 pt-1.5 opacity-90">
                          {art.summary}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 font-medium">{art.publishedAt}</span>
                        <a
                          href={art.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1.5"
                        >
                          Read Original <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Book Detailed Information Dialog/View */}
      {selectedBook && (
        <div className="fixed inset-0 bg-[#0a0c10]/60 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 bg-slate-50 rounded-full border"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                className="w-32 h-44 object-cover rounded-xl shadow-lg border border-slate-300 mx-auto sm:mx-0 referrerPolicy='no-referrer'"
              />
              <div className="space-y-2 min-w-0 flex-1 text-center sm:text-left pt-2">
                <span className="text-xs font-mono font-bold text-indigo-500 uppercase tracking-widest">{selectedBook.genre.join(", ")}</span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{selectedBook.title}</h3>
                <p className="text-sm text-slate-500">By {selectedBook.author}</p>
                <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                  <span className="text-amber-500 text-sm font-bold">&#9733; {selectedBook.rating} Rating</span>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">{selectedBook.pages} Pages</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 text-xs font-medium text-slate-600 leading-normal border">
                {selectedBook.description}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setReadingBook(selectedBook);
                    setSelectedBook(null);
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 animate-bounce" /> Open Book Reader
                </button>

                <button
                  onClick={() => {
                    // Force start summary with active AI overlay
                    setIsAiOpen(true);
                  }}
                  className="px-5 py-3 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg border flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" /> AI Outlines
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LibriVox Audiobook Chapter Dialog */}
      {selectedAudio && (
        <div className="fixed inset-0 bg-[#0a0c10]/60 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-slate-950 text-slate-100 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-800">
            <button
              onClick={() => setSelectedAudio(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4">
              <img
                src={selectedAudio.cover}
                alt={selectedAudio.title}
                className="w-16 h-20 rounded object-cover shadow border border-slate-800 referrerPolicy='no-referrer'"
              />
              <div className="min-w-0 flex-1 justify-center pt-1">
                <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest uppercase">AUDIOBOOK DETAIL</span>
                <h4 className="text-md font-semibold truncate text-white">{selectedAudio.title}</h4>
                <p className="text-xs text-slate-400 truncate">By {selectedAudio.author}</p>
              </div>
            </div>

            <div className="space-y-3 pt-5">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Chapter List ({selectedAudio.chapters.length})</span>
              <div className="space-y-1 max-h-[300px] overflow-y-auto border border-slate-800 rounded divide-y divide-slate-900">
                {selectedAudio.chapters.map((chap, idx) => (
                  <div
                    key={chap.id}
                    onClick={() => {
                      setActiveTrack({
                        title: chap.title,
                        artist: selectedAudio.author,
                        artwork: selectedAudio.cover,
                        url: chap.listen_url,
                        duration: chap.duration
                      });
                      setSelectedAudio(null);
                    }}
                    className="p-3 hover:bg-slate-900 flex items-center justify-between text-xs cursor-pointer select-none"
                  >
                    <span className="truncate pr-4 text-slate-200 group-hover:text-white">{chap.title}</span>
                    <span className="font-mono text-slate-400 font-bold">
                      {Math.floor(chap.duration / 60)}:{(chap.duration % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Podcast Details View */}
      {selectedPodcast && (
        <div className="fixed inset-0 bg-[#0a0c10]/60 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-slate-950 text-slate-100 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-800 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPodcast(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4">
              <img
                src={selectedPodcast.artwork}
                alt={selectedPodcast.title}
                className="w-16 h-16 rounded-lg object-cover shadow border border-slate-800 referrerPolicy='no-referrer'"
              />
              <div className="min-w-0 flex-1 justify-center pt-1.5">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">PODCAST DECK</span>
                <h4 className="text-md font-semibold truncate text-white leading-relaxed">{selectedPodcast.title}</h4>
                <p className="text-xs text-slate-400 truncate">Hosted by {selectedPodcast.author || "Unknown Host"}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-normal p-3 bg-slate-900 rounded border border-slate-800 my-4 text-serif">
              {selectedPodcast.description || "A wonderful audio series available for streaming."}
            </p>

            <div className="space-y-2.5">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Episodes List ({podcastEpisodes.length})</span>
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto flex flex-col">
                {podcastEpisodes.map(ep => (
                  <div
                    key={ep.id}
                    className="p-3.5 bg-slate-900/50 hover:bg-slate-900/80 rounded border border-slate-900 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <h5 className="font-semibold text-white leading-relaxed truncate">{ep.title}</h5>
                      <p className="text-[10px] text-slate-500 pt-0.5">{ep.publishedAt}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTrack({
                          title: ep.title,
                          artist: ep.show,
                          artwork: ep.artwork,
                          url: ep.enclosureUrl,
                          duration: ep.duration
                        });
                        setSelectedPodcast(null);
                      }}
                      className="p-2 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white rounded-full ml-4"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive Active eBook reader */}
      {readingBook && (
        <BookReader
          book={readingBook}
          onClose={() => setReadingBook(null)}
          onTextHighlight={(text, context) => {
            setTextSelection({ text, context });
            setIsAiOpen(true);
          }}
        />
      )}

      {/* AI Assistant Float-out overlay drawer */}
      {isAiOpen && (
        <AiAssistant
          onClose={() => setIsAiOpen(false)}
          activeBookId={readingBook?.id || selectedBook?.id}
          activeBookTitle={readingBook?.title || selectedBook?.title}
          textSelection={textSelection}
          onImportRecommendedBook={handleImportRecommendedBook}
        />
      )}

      {/* Universal Floating Music/Podcast Audio player */}
      {activeTrack && (
        <AudioPlayer
          activeTrack={activeTrack}
          onClose={() => setActiveTrack(null)}
        />
      )}
    </div>
  );
}
