import React, { useState } from "react";
import { Sparkles, X, BrainCircuit, MessageSquareText, Layers, ThumbsUp, ChevronRight, HelpCircle, RefreshCw } from "lucide-react";
import { Flashcard, Book } from "@/types";
import { api } from "@/lib/api/client";
import { resolveCover } from "@/lib/utils";

interface AiAssistantProps {
  onClose: () => void;
  activeBookId?: string;
  activeBookTitle?: string;
  textSelection?: { text: string; context: string };
  onImportRecommendedBook?: (book: Book) => void;
}

export default function AiAssistant({
  onClose,
  activeBookId,
  activeBookTitle,
  textSelection,
  onImportRecommendedBook
}: AiAssistantProps) {
  const [activeTab, setActiveTab] = useState<"summarize" | "flashcards" | "recommend" | "explain">(
    textSelection ? "explain" : "summarize"
  );

  // States
  const [loading, setLoading] = useState(false);
  const [errorObj, setErrorObj] = useState<string | null>(null);

  // Summarize tab states
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [selectedChapter, setSelectedChapter] = useState("Chapter 1: The Departure");

  // Flashcards tab states
  const [flashText, setFlashText] = useState(
    textSelection?.text || "Sherlock Holmes was a man who lived at 221B Baker Street in London. He was known for his mastery of observation and logical deduction."
  );
  const [deck, setDeck] = useState<Flashcard[]>([
    { front: "Where did Sherlock Holmes live?", back: "221B Baker Street, London" },
    { front: "What was Holmes primarily famous for?", back: "His incredible power of observation and logical deduction" }
  ]);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  // Recommend tab states
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Mystery", "Fiction"]);
  const [readingHistory, setReadingHistory] = useState("Agatha Christie, Conan Doyle");
  const [aiRecs, setAiRecs] = useState<Book[]>([]);
  const [aiReasoning, setAiReasoning] = useState<string>("");

  // Explain tab states
  const [explainPassage, setExplainPassage] = useState(textSelection?.text || "singular anomaly");
  const [explainContext, setExplainContext] = useState(textSelection?.context || "This was a singular anomaly in the course of his research.");
  const [explanation, setExplanation] = useState("");

  const handleSummarize = async () => {
    if (!activeBookId) return;
    setLoading(true);
    setErrorObj(null);
    try {
      const data = await api.ai.summarize(activeBookId, selectedChapter);
      if (data.summary.includes("[Offline Fallback]")) {
        setErrorObj("Gemini API rate limit exceeded or backend unreachable. Falling back to default summary outline.");
      }
      setSummaries(prev => ({ ...prev, [selectedChapter]: data.summary }));
    } catch (err: any) {
      setErrorObj(err.message || "Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlashcards = async () => {
    if (!flashText.trim()) return;
    setLoading(true);
    setErrorObj(null);
    try {
      const data = await api.ai.flashcards(flashText);
      if (data.length === 2 && data[0].front.includes("Sherlock Holmes")) {
        setErrorObj("Gemini API limit exceeded or backend unreachable. Falling back to mock card decks.");
      }
      setDeck(data);
      setFlippedIndex(null);
    } catch (err: any) {
      setErrorObj("Network error occurred during study generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecommend = async () => {
    setLoading(true);
    setErrorObj(null);
    try {
      const data = await api.ai.recommend(
        selectedGenres,
        readingHistory.split(",").map(s => s.trim()).filter(Boolean)
      );
      if (data.reasoning.includes("Showing classic book recommendations") || data.reasoning.includes("AI recommendations are temporarily unavailable")) {
        setErrorObj("Gemini API rate limit exceeded or backend unreachable. Falling back to cached recommendation items.");
      }
      setAiRecs(data.recommendations);
      setAiReasoning(data.reasoning);
    } catch (err: any) {
      setErrorObj("Server not responding.");
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!explainPassage.trim()) return;
    setLoading(true);
    setErrorObj(null);
    try {
      const data = await api.ai.explain(explainPassage, explainContext);
      if (data.explanation.includes("[Offline Fallback]")) {
        setErrorObj("Gemini API limit hit or backend unreachable. Falling back to semantic lookup.");
      }
      setExplanation(data.explanation);
    } catch (err: any) {
      setErrorObj("Failed to retrieve definitions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-assistant-overlay" className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#0a0c10]/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-50 flex flex-col transition-all text-slate-100 duration-300">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className="p-1 px-2.5 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold tracking-widest uppercase rounded flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini Flash 1.5
          </div>
          <span className="font-semibold text-white tracking-wide">Lit Companion</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs text-slate-400 select-none bg-slate-950">
        <button
          onClick={() => { setActiveTab("summarize"); setErrorObj(null); }}
          className={`flex-1 py-3 text-center border-b font-medium transition-all ${activeTab === "summarize" ? "text-indigo-400 border-indigo-500 bg-slate-900/30" : "hover:text-slate-200 border-transparent hover:bg-slate-900/10"}`}
        >
          Summarise
        </button>
        <button
          onClick={() => { setActiveTab("explain"); setErrorObj(null); }}
          className={`flex-1 py-3 text-center border-b font-medium transition-all ${activeTab === "explain" ? "text-indigo-400 border-indigo-500 bg-slate-900/30" : "hover:text-slate-200 border-transparent hover:bg-slate-900/10"}`}
        >
          Define / Chat
        </button>
        <button
          onClick={() => { setActiveTab("flashcards"); setErrorObj(null); }}
          className={`flex-1 py-3 text-center border-b font-medium transition-all ${activeTab === "flashcards" ? "text-indigo-400 border-indigo-500 bg-slate-900/30" : "hover:text-slate-200 border-transparent hover:bg-slate-900/10"}`}
        >
          Studying
        </button>
        <button
          onClick={() => { setActiveTab("recommend"); setErrorObj(null); }}
          className={`flex-1 py-3 text-center border-b font-medium transition-all ${activeTab === "recommend" ? "text-indigo-400 border-indigo-500 bg-slate-900/30" : "hover:text-slate-200 border-transparent hover:bg-slate-900/10"}`}
        >
          Recommend
        </button>
      </div>

      {/* Dynamic Tab Panel */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {errorObj && (
          <div className="p-3 bg-red-950/40 border border-red-800/50 text-red-300 text-xs rounded font-sans leading-relaxed">
            {errorObj}
          </div>
        )}

        {/* Tab 1: Summarize */}
        {activeTab === "summarize" && (
          <div className="space-y-4">
            <div className="p-3 bg-[#11131c] rounded border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] font-mono tracking-wider uppercase font-semibold block">Active Book Context</span>
              <p className="text-sm text-white font-medium">{activeBookTitle || "No Active Book Selected"}</p>
              <p className="text-xs text-slate-400 leading-normal">
                {activeBookId ? "Ready to compute chapter outlines dynamically." : "Go to the Books collection view, open a classic title and initiate summaries."}
              </p>
            </div>

            {activeBookId && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400">Target Chapter or Custom Text Segment</label>
                  <input
                    type="text"
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    placeholder="e.g., Chapter 5: The Chase, or enter custom text to summarize..."
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 mb-2"
                  />
                  <span className="text-[10px] text-slate-500 block">Or select from common chapters:</span>
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                  >
                    <option value="Chapter 1: The Departure">Chapter 1: The Departure</option>
                    <option value="Chapter 2: Dynamic Encounters">Chapter 2: Dynamic Encounters</option>
                    <option value="Chapter 3: Theoretical Deductions">Chapter 3: Theoretical Deductions</option>
                    <option value="Chapter 4: The Climax Outline">Chapter 4: The Climax Outline</option>
                  </select>
                </div>

                <button
                  onClick={handleSummarize}
                  disabled={loading}
                  className="w-full cursor-pointer py-3.5 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 text-white rounded font-medium text-xs tracking-wider font-mono uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-900/20"
                >
                  {loading ? (
                    <>
                      <LoaderIcon /> Computing outline...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="w-4 h-4" /> Outline Chapter
                    </>
                  )}
                </button>
              </>
            )}

            {summaries[selectedChapter] && (
              <div className="p-4 bg-slate-900/60 rounded border border-slate-800 space-y-2.5 animate-fadeIn">
                <span className="text-indigo-400 font-mono text-xs font-semibold uppercase">{selectedChapter} Summary</span>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">{summaries[selectedChapter]}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Explain / Define / Chat */}
        {activeTab === "explain" && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded text-xs text-slate-400 leading-relaxed font-sans">
              <span className="text-indigo-300 font-bold block mb-1">PRO-TIP:</span>
              Highlight any word or obscure expression in the book text reader, and it will fill this screen to explain the language style, or type a custom question below.
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">Ask a question or enter a passage to explain</label>
                <input
                  type="text"
                  value={explainPassage}
                  onChange={(e) => setExplainPassage(e.target.value)}
                  placeholder="e.g., What does 'singular anomaly' mean? Or ask any literary question..."
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">Surrounding Paragraph Context (Optional)</label>
                <textarea
                  value={explainContext}
                  onChange={(e) => setExplainContext(e.target.value)}
                  placeholder="Paste context or surrounding sentence..."
                  rows={3}
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                />
              </div>

              <button
                onClick={handleExplain}
                disabled={loading || !explainPassage.trim()}
                className="w-full cursor-pointer py-3.5 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 text-white rounded font-medium text-xs tracking-wider font-mono uppercase flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <LoaderIcon /> : "Explain or Answer Question"}
              </button>
            </div>

            {explanation && (
              <div className="p-4 bg-slate-900/60 rounded border border-slate-800 space-y-2 animate-fadeIn font-sans">
                <span className="text-slate-400 text-xs font-semibold font-mono block">GEMINI FEEDBACK:</span>
                <p className="text-sm text-slate-200 font-medium leading-relaxed italic">"{explanation}"</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Flashcards */}
        {activeTab === "flashcards" && (
          <div className="space-y-4">
            <span className="text-xs text-slate-400 leading-normal block">Paste paragraphs or book page text below to extract structural flashcards or ask study questions.</span>

            <textarea
              value={flashText}
              onChange={(e) => setFlashText(e.target.value)}
              rows={4}
              placeholder="Paste paragraphs or book page text below to extract structural flashcards or ask study questions..."
              className="w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            />

            <button
              onClick={handleFlashcards}
              disabled={loading || !flashText}
              className="w-full cursor-pointer py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 text-white rounded font-mono text-xs uppercase font-medium tracking-wide flex items-center justify-center gap-2 transition-all hover:shadow-indigo-500/20"
            >
              {loading ? <LoaderIcon /> : "Extract Flashcards"}
            </button>

            <span className="text-xs font-mono font-bold text-indigo-400 block pt-2 border-t border-slate-800 uppercase">Flashcards Deck ({deck.length})</span>
            
            <div className="grid grid-cols-1 gap-3.5">
              {deck.map((card, i) => (
                <div
                  key={i}
                  onClick={() => setFlippedIndex(flippedIndex === i ? null : i)}
                  className="bg-slate-900 border border-slate-800/80 rounded-lg p-5 cursor-pointer relative overflow-hidden min-h-[100px] flex flex-col justify-between hover:border-indigo-500/40 transition-all select-none group"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-indigo-400 font-medium">#{i + 1}</span>
                    <span className="text-[9px] font-mono p-1 rounded bg-slate-800/50 text-slate-400 uppercase tracking-widest leading-none group-hover:text-white transition-colors">
                      {flippedIndex === i ? "Flip to Front" : "Tap for Answer"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-sans pt-2">
                    {flippedIndex === i ? (
                      <span className="text-indigo-300 font-medium font-mono">{card.back}</span>
                    ) : (
                      <span className="text-white font-medium">{card.front}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Smart recommendations */}
        {activeTab === "recommend" && (
          <div className="space-y-4">
            <span className="text-xs text-slate-400 leading-normal block">We utilize Gemini learning matches to cross-examine genres against your reads.</span>

            {/* Favorite Genres */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">Desired Genres</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Fiction", "Romance", "Thriller", "Mystery", "Fantasy", "Business", "History"].map(g => {
                  const selected = selectedGenres.includes(g);
                  return (
                    <button
                      key={g}
                      onClick={() => {
                        setSelectedGenres(prev =>
                          selected ? prev.filter(item => item !== g) : [...prev, g]
                        );
                      }}
                      className={`text-xs px-2.5 py-1.5 rounded transition-all font-mono font-medium border ${selected ? "bg-indigo-500/20 text-indigo-300 border-indigo-500" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"}`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Historical Reads */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Authors / Works in Mind</label>
              <input
                type="text"
                value={readingHistory}
                onChange={(e) => setReadingHistory(e.target.value)}
                placeholder="e.g., Arthur Conan Doyle, Jane Austen, or books you enjoyed..."
                className="w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>

            <button
              onClick={handleRecommend}
              disabled={loading || selectedGenres.length === 0}
              className="w-full cursor-pointer py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 text-white rounded font-mono text-xs uppercase font-medium tracking-wide flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <LoaderIcon /> : "Generate Recommendations"}
            </button>

            {aiReasoning && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-1 font-sans animate-fadeIn">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">Profile Reasoning</span>
                <p className="text-xs text-indigo-300 leading-relaxed font-mono">{aiReasoning}</p>
              </div>
            )}

            {aiRecs.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Recommended Works</span>
                {aiRecs.map(book => (
                  <div key={book.id} className="p-3.5 bg-[#11131c] border border-slate-800/80 rounded flex gap-3.5 items-center hover:border-indigo-500/30 transition-all">
                    <img
                      src={resolveCover(book)}
                      alt={book.title}
                      className="w-10 h-14 rounded object-cover border border-slate-800 referrerPolicy='no-referrer'"
                      onError={(e) => {
                        const seed = book.id ?? 'fallback';
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${seed}/200/300`;
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-sm font-medium text-white truncate leading-relaxed">{book.title}</h5>
                      <p className="text-xs text-slate-400 truncate mb-1">{book.author}</p>
                      <button
                        onClick={() => onImportRecommendedBook && onImportRecommendedBook(book)}
                        className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider"
                      >
                        Add to Library &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline Spinner
function LoaderIcon() {
  return <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />;
}
