import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useCart, A as AppShell, f as formatKES } from "./AppShell-D1r7d6o9.mjs";
import { S as SectionHeader, B as BookRail } from "./BookRail-BJS_0UnT.mjs";
import { u as useWishlist } from "./wishlist-BmF41ml4.mjs";
import { u as useLibrary } from "./library-Czyiyke9.mjs";
import { c as Route, a as api } from "./router-CZcnAnjP.mjs";
import { r as resolveCover } from "./utils-CI2FuZjX.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { k as ArrowLeft, H as Heart, j as Star, l as Clock, m as BookOpen, n as Headphones, Z as ZoomOut, o as ZoomIn, X, h as Sparkles, p as BrainCircuit, q as RefreshCw } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/zustand.mjs";
import "./BookCard-DOgDnoOZ.mjs";
import "../_libs/zod.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function BookReader({ book, onClose, onTextHighlight }) {
  const [fontSize, setFontSize] = reactExports.useState(16);
  const [theme, setTheme] = reactExports.useState("cream");
  const [textSelections, setTextSelections] = reactExports.useState("");
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      const selected = selection.toString().trim();
      if (selected.length > 2 && selected.length < 150) {
        setTextSelections(selected);
      } else {
        setTextSelections("");
      }
    }
  };
  const handleAskAi = () => {
    if (textSelections) {
      onTextHighlight(
        textSelections,
        `Page context inside '${book.title}' by ${book.author}. Selected block represents dynamic vocabulary lookup.`
      );
    }
  };
  reactExports.useEffect(() => {
    document.addEventListener("selectionchange", handleTextSelection);
    return () => {
      document.removeEventListener("selectionchange", handleTextSelection);
    };
  }, [book]);
  const fontThemes = {
    cream: "bg-[#fdfbf7] text-[#2c2621]",
    sepia: "bg-[#f4ebd0] text-[#433422]",
    night: "bg-[#0f111a] text-[#c5c9db]"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fixed inset-0 z-40 flex flex-col font-sans transition-all duration-300 ${fontThemes[theme]}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-4 py-3 border-b border-black/10 backdrop-blur bg-opacity-90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono opacity-60 tracking-wider", children: "READING MODE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold truncate max-w-xs", children: book.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 border-r pr-3 border-slate-300/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFontSize((f) => Math.max(12, f - 2)),
              className: "p-1 hover:bg-black/5 rounded transition-transform",
              title: "Font Decrease",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono font-semibold", children: [
            fontSize,
            "px"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFontSize((f) => Math.min(24, f + 2)),
              className: "p-1 hover:bg-black/5 rounded transition-transform",
              title: "Font Increase",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 pr-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setTheme("cream"),
              className: `w-5 h-5 rounded-full border bg-[#fdfbf7] ${theme === "cream" ? "ring-2 ring-indigo-500" : ""}`,
              title: "Cream Tone"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setTheme("sepia"),
              className: `w-5 h-5 rounded-full border bg-[#f4ebd0] ${theme === "sepia" ? "ring-2 ring-indigo-500" : ""}`,
              title: "Sepia Vintage"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setTheme("night"),
              className: `w-5 h-5 rounded-full border bg-[#0f111a] ${theme === "night" ? "ring-2 ring-indigo-500" : ""}`,
              title: "Night Mode"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onClose,
            className: "p-2 cursor-pointer rounded hover:bg-black/5 transition-transform",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 md:px-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto py-12 md:py-20 space-y-8 font-serif leading-relaxed select-text", style: { fontSize: `${fontSize}px` }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3 pb-8 border-b border-black/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs opacity-60 tracking-widest uppercase", children: "GUTENBERG FREE EPUB" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-5xl font-bold tracking-tight", children: book.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-md italic opacity-85", children: [
          "By ",
          book.author
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 md:space-y-8 hyphens-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold pt-6 font-sans", children: "Chapter 1: The Departure" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The morning was cold and crisp, a light mist hugging the cobblestones of Baker Street. Sherlock Holmes walked silently up and down our cozy quarters, his hands locked behind his back, lost in the depths of some profound mathematical problem. The fire flickered gently, casting long, dancing shadows across the rows of chemical vials and heavy leather treatises that lined our walls." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Indeed, my dear Watson, there is nothing like a singular anomaly to stir the blood. When everything in the world seems mundane, the human mind grows dull and lethargic. We require challenge; we require the obscure, the bizarre, the impossible. Only on high intellectual elevations does the soul truly locate its authentic nourishment." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A sharp knock at the door broke our meditations. Landlady Mrs. Hudson entered, bearing a silver tray upon which lay a single note, written in an elegant but hurried hand. I watched Holmes snatch it up, his gray eyes flashing with instant, predatory enthusiasm." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold pt-6 font-sans", children: "Chapter 2: The Intriguing Client" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: 'It was a letter without signature, yet the paper was of a peculiar thick texture—an expensive Belgian brand, as Holmes quickly deduced with a single sniff and a glance into the watermarks. "This, Watson, was not penned by a common clerk. Observe the heavy styling, the distinct imprint of confidence that only supreme wealth can purchase."' })
      ] })
    ] }) }),
    textSelections && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-24 left-1/2 -translate-x-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold py-3 px-5 rounded-full shadow-2xl flex items-center gap-2 px-6 hover:scale-105 active:scale-95 transition-transform cursor-pointer select-none border border-indigo-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 animate-spin text-indigo-200" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAskAi, children: [
        'Explain selection: "',
        textSelections.length > 20 ? textSelections.substring(0, 18) + "..." : textSelections,
        '"'
      ] })
    ] })
  ] });
}
function AiAssistant({
  onClose,
  activeBookId,
  activeBookTitle,
  textSelection,
  onImportRecommendedBook
}) {
  const [activeTab, setActiveTab] = reactExports.useState(
    textSelection ? "explain" : "summarize"
  );
  const [loading, setLoading] = reactExports.useState(false);
  const [errorObj, setErrorObj] = reactExports.useState(null);
  const [summaries, setSummaries] = reactExports.useState({});
  const [selectedChapter, setSelectedChapter] = reactExports.useState("Chapter 1: The Departure");
  const [flashText, setFlashText] = reactExports.useState(
    textSelection?.text || "Sherlock Holmes was a man who lived at 221B Baker Street in London. He was known for his mastery of observation and logical deduction."
  );
  const [deck, setDeck] = reactExports.useState([
    { front: "Where did Sherlock Holmes live?", back: "221B Baker Street, London" },
    { front: "What was Holmes primarily famous for?", back: "His incredible power of observation and logical deduction" }
  ]);
  const [flippedIndex, setFlippedIndex] = reactExports.useState(null);
  const [selectedGenres, setSelectedGenres] = reactExports.useState(["Mystery", "Fiction"]);
  const [readingHistory, setReadingHistory] = reactExports.useState("Agatha Christie, Conan Doyle");
  const [aiRecs, setAiRecs] = reactExports.useState([]);
  const [aiReasoning, setAiReasoning] = reactExports.useState("");
  const [explainPassage, setExplainPassage] = reactExports.useState(textSelection?.text || "singular anomaly");
  const [explainContext, setExplainContext] = reactExports.useState(textSelection?.context || "This was a singular anomaly in the course of his research.");
  const [explanation, setExplanation] = reactExports.useState("");
  const handleSummarize = async () => {
    if (!activeBookId) return;
    setLoading(true);
    setErrorObj(null);
    try {
      const data = await api.ai.summarize(activeBookId, selectedChapter);
      if (data.summary.includes("[Offline Fallback]")) {
        setErrorObj("Gemini API rate limit exceeded or backend unreachable. Falling back to default summary outline.");
      }
      setSummaries((prev) => ({ ...prev, [selectedChapter]: data.summary }));
    } catch (err) {
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
    } catch (err) {
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
        readingHistory.split(",").map((s) => s.trim()).filter(Boolean)
      );
      if (data.reasoning.includes("Showing classic book recommendations") || data.reasoning.includes("AI recommendations are temporarily unavailable")) {
        setErrorObj("Gemini API rate limit exceeded or backend unreachable. Falling back to cached recommendation items.");
      }
      setAiRecs(data.recommendations);
      setAiReasoning(data.reasoning);
    } catch (err) {
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
    } catch (err) {
      setErrorObj("Failed to retrieve definitions.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "ai-assistant-overlay", className: "fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#0a0c10]/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-50 flex flex-col transition-all text-slate-100 duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-1 px-2.5 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold tracking-widest uppercase rounded flex items-center gap-1.5 animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
          "Gemini Flash 1.5"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white tracking-wide", children: "Lit Companion" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-slate-800 text-xs text-slate-400 select-none bg-slate-950", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            setActiveTab("summarize");
            setErrorObj(null);
          },
          className: `flex-1 py-3 text-center border-b font-medium transition-all ${activeTab === "summarize" ? "text-indigo-400 border-indigo-500 bg-slate-900/30" : "hover:text-slate-200 border-transparent hover:bg-slate-900/10"}`,
          children: "Summarise"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            setActiveTab("explain");
            setErrorObj(null);
          },
          className: `flex-1 py-3 text-center border-b font-medium transition-all ${activeTab === "explain" ? "text-indigo-400 border-indigo-500 bg-slate-900/30" : "hover:text-slate-200 border-transparent hover:bg-slate-900/10"}`,
          children: "Define / Chat"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            setActiveTab("flashcards");
            setErrorObj(null);
          },
          className: `flex-1 py-3 text-center border-b font-medium transition-all ${activeTab === "flashcards" ? "text-indigo-400 border-indigo-500 bg-slate-900/30" : "hover:text-slate-200 border-transparent hover:bg-slate-900/10"}`,
          children: "Studying"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            setActiveTab("recommend");
            setErrorObj(null);
          },
          className: `flex-1 py-3 text-center border-b font-medium transition-all ${activeTab === "recommend" ? "text-indigo-400 border-indigo-500 bg-slate-900/30" : "hover:text-slate-200 border-transparent hover:bg-slate-900/10"}`,
          children: "Recommend"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-5", children: [
      errorObj && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-red-950/40 border border-red-800/50 text-red-300 text-xs rounded font-sans leading-relaxed", children: errorObj }),
      activeTab === "summarize" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-[#11131c] rounded border border-slate-800 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[10px] font-mono tracking-wider uppercase font-semibold block", children: "Active Book Context" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white font-medium", children: activeBookTitle || "No Active Book Selected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 leading-normal", children: activeBookId ? "Ready to compute chapter outlines dynamically." : "Go to the Books collection view, open a classic title and initiate summaries." })
        ] }),
        activeBookId && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-mono text-slate-400", children: "Target Chapter or Custom Text Segment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: selectedChapter,
                onChange: (e) => setSelectedChapter(e.target.value),
                placeholder: "e.g., Chapter 5: The Chase, or enter custom text to summarize...",
                className: "w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 mb-2"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 block", children: "Or select from common chapters:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: selectedChapter,
                onChange: (e) => setSelectedChapter(e.target.value),
                className: "w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Chapter 1: The Departure", children: "Chapter 1: The Departure" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Chapter 2: Dynamic Encounters", children: "Chapter 2: Dynamic Encounters" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Chapter 3: Theoretical Deductions", children: "Chapter 3: Theoretical Deductions" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Chapter 4: The Climax Outline", children: "Chapter 4: The Climax Outline" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleSummarize,
              disabled: loading,
              className: "w-full cursor-pointer py-3.5 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 text-white rounded font-medium text-xs tracking-wider font-mono uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-900/20",
              children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderIcon, {}),
                " Computing outline..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BrainCircuit, { className: "w-4 h-4" }),
                " Outline Chapter"
              ] })
            }
          )
        ] }),
        summaries[selectedChapter] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-900/60 rounded border border-slate-800 space-y-2.5 animate-fadeIn", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-indigo-400 font-mono text-xs font-semibold uppercase", children: [
            selectedChapter,
            " Summary"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 leading-relaxed font-sans", children: summaries[selectedChapter] })
        ] })
      ] }),
      activeTab === "explain" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-950/60 border border-slate-800 rounded text-xs text-slate-400 leading-relaxed font-sans", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-300 font-bold block mb-1", children: "PRO-TIP:" }),
          "Highlight any word or obscure expression in the book text reader, and it will fill this screen to explain the language style, or type a custom question below."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-mono text-slate-400 block mb-1.5", children: "Ask a question or enter a passage to explain" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: explainPassage,
                onChange: (e) => setExplainPassage(e.target.value),
                placeholder: "e.g., What does 'singular anomaly' mean? Or ask any literary question...",
                className: "w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-mono text-slate-400 block mb-1.5", children: "Surrounding Paragraph Context (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: explainContext,
                onChange: (e) => setExplainContext(e.target.value),
                placeholder: "Paste context or surrounding sentence...",
                rows: 3,
                className: "w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleExplain,
              disabled: loading || !explainPassage.trim(),
              className: "w-full cursor-pointer py-3.5 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 text-white rounded font-medium text-xs tracking-wider font-mono uppercase flex items-center justify-center gap-2 transition-all",
              children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderIcon, {}) : "Explain or Answer Question"
            }
          )
        ] }),
        explanation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-900/60 rounded border border-slate-800 space-y-2 animate-fadeIn font-sans", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-xs font-semibold font-mono block", children: "GEMINI FEEDBACK:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-200 font-medium leading-relaxed italic", children: [
            '"',
            explanation,
            '"'
          ] })
        ] })
      ] }),
      activeTab === "flashcards" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 leading-normal block", children: "Paste paragraphs or book page text below to extract structural flashcards or ask study questions." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: flashText,
            onChange: (e) => setFlashText(e.target.value),
            rows: 4,
            placeholder: "Paste paragraphs or book page text below to extract structural flashcards or ask study questions...",
            className: "w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleFlashcards,
            disabled: loading || !flashText,
            className: "w-full cursor-pointer py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 text-white rounded font-mono text-xs uppercase font-medium tracking-wide flex items-center justify-center gap-2 transition-all hover:shadow-indigo-500/20",
            children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderIcon, {}) : "Extract Flashcards"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono font-bold text-indigo-400 block pt-2 border-t border-slate-800 uppercase", children: [
          "Flashcards Deck (",
          deck.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3.5", children: deck.map((card, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => setFlippedIndex(flippedIndex === i ? null : i),
            className: "bg-slate-900 border border-slate-800/80 rounded-lg p-5 cursor-pointer relative overflow-hidden min-h-[100px] flex flex-col justify-between hover:border-indigo-500/40 transition-all select-none group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-indigo-400 font-medium", children: [
                  "#",
                  i + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono p-1 rounded bg-slate-800/50 text-slate-400 uppercase tracking-widest leading-none group-hover:text-white transition-colors", children: flippedIndex === i ? "Flip to Front" : "Tap for Answer" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-200 leading-relaxed font-sans pt-2", children: flippedIndex === i ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-300 font-medium font-mono", children: card.back }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: card.front }) })
            ]
          },
          i
        )) })
      ] }),
      activeTab === "recommend" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 leading-normal block", children: "We utilize Gemini learning matches to cross-examine genres against your reads." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-mono text-slate-400", children: "Desired Genres" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pt-1", children: ["Fiction", "Romance", "Thriller", "Mystery", "Fantasy", "Business", "History"].map((g) => {
            const selected = selectedGenres.includes(g);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setSelectedGenres(
                    (prev) => selected ? prev.filter((item) => item !== g) : [...prev, g]
                  );
                },
                className: `text-xs px-2.5 py-1.5 rounded transition-all font-mono font-medium border ${selected ? "bg-indigo-500/20 text-indigo-300 border-indigo-500" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"}`,
                children: g
              },
              g
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-mono text-slate-400", children: "Authors / Works in Mind" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: readingHistory,
              onChange: (e) => setReadingHistory(e.target.value),
              placeholder: "e.g., Arthur Conan Doyle, Jane Austen, or books you enjoyed...",
              className: "w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleRecommend,
            disabled: loading || selectedGenres.length === 0,
            className: "w-full cursor-pointer py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 text-white rounded font-mono text-xs uppercase font-medium tracking-wide flex items-center justify-center gap-2 transition-all",
            children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderIcon, {}) : "Generate Recommendations"
          }
        ),
        aiReasoning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-950 border border-slate-800 rounded space-y-1 font-sans animate-fadeIn", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-bold text-slate-400 uppercase", children: "Profile Reasoning" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-300 leading-relaxed font-mono", children: aiReasoning })
        ] }),
        aiRecs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-slate-400 uppercase tracking-wider block", children: "Recommended Works" }),
          aiRecs.map((book) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 bg-[#11131c] border border-slate-800/80 rounded flex gap-3.5 items-center hover:border-indigo-500/30 transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: resolveCover(book),
                alt: book.title,
                className: "w-10 h-14 rounded object-cover border border-slate-800 referrerPolicy='no-referrer'",
                onError: (e) => {
                  const seed = book.id ?? "fallback";
                  e.target.onerror = null;
                  e.target.src = `https://picsum.photos/seed/${seed}/200/300`;
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-sm font-medium text-white truncate leading-relaxed", children: book.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 truncate mb-1", children: book.author }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => onImportRecommendedBook && onImportRecommendedBook(book),
                  className: "text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider",
                  children: "Add to Library →"
                }
              )
            ] })
          ] }, book.id))
        ] })
      ] })
    ] })
  ] });
}
function LoaderIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin text-indigo-300" });
}
function BookDetail() {
  const {
    id
  } = Route.useParams();
  const router = useRouter();
  const loaderData = Route.useLoaderData();
  const {
    data: book = loaderData
  } = useQuery({
    queryKey: ["book", id],
    queryFn: () => api.books.detail(id),
    initialData: loaderData
  });
  const add = useCart((s) => s.add);
  const wish = useWishlist();
  const upsert = useLibrary((s) => s.upsert);
  const [expanded, setExpanded] = reactExports.useState(false);
  const [reading, setReading] = reactExports.useState(false);
  const [aiOpen, setAiOpen] = reactExports.useState(false);
  const [highlightedText, setHighlightedText] = reactExports.useState(null);
  const {
    data: rawSimilar = []
  } = useQuery({
    queryKey: ["books", "similar", book?.genre?.[0] || ""],
    queryFn: () => api.books.search("", book?.genre?.[0] || ""),
    enabled: !!book?.genre?.[0]
  });
  if (!book) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl", children: "Book not found" }) }) });
  }
  const similar = rawSimilar.filter((b) => b.id !== book.id).slice(0, 8);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, transition: {
        duration: 0.4
      }, className: "relative w-full h-[60vw] max-h-[420px] bg-muted overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: resolveCover(book), alt: book.title, className: "w-full h-full object-cover", onError: (e) => {
          e.currentTarget.style.display = "none";
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": "Go back", onClick: () => router.history.back(), className: "absolute top-4 left-4 w-10 h-10 grid place-items-center rounded-full bg-black/40 backdrop-blur text-white", style: {
          marginTop: "env(safe-area-inset-top)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": "Toggle wishlist", onClick: () => wish.toggle(book), className: "absolute top-4 right-4 w-10 h-10 grid place-items-center rounded-full bg-black/40 backdrop-blur text-white", style: {
          marginTop: "env(safe-area-inset-top)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 18, fill: wish.has(book.id) ? "#C9A84C" : "transparent", className: wish.has(book.id) ? "text-gold" : "" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.3
      }, className: "px-5 -mt-6 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mb-3", children: book.genre.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold/15 text-gold", children: g }, g)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-[26px] font-semibold leading-tight", children: book.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif italic text-[18px] text-muted-foreground mt-1", children: book.author }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            Array.from({
              length: 5
            }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14, fill: i < Math.round(book.rating) ? "currentColor" : "none", className: "text-gold", strokeWidth: 1.5 }, i)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs ml-1", children: book.rating })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "· 2,431 reviews" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-4 text-[15px] leading-relaxed text-foreground/85 ${expanded ? "" : "line-clamp-3"}`, children: book.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setExpanded((v) => !v), className: "font-mono text-[11px] uppercase tracking-wider text-gold mt-1", children: expanded ? "Read less" : "Read more" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14 }), label: "Reading", value: book.readingTime }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 14 }), label: "Pages", value: `${book.pages}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Headphones, { size: 14 }), label: "Format", value: book.formats.includes("audio") ? "Audio + Ebook" : "Ebook" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-2.5", children: [
          book.read_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: book.read_url, target: "_blank", rel: "noopener noreferrer", className: "w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold/10 text-gold font-mono text-[11px] uppercase tracking-wider font-bold border border-gold/20 hover:bg-gold/25 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 14 }),
            "Read Online"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            book.epub_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: book.epub_url, className: "flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-divider text-muted-foreground font-mono text-[10px] uppercase tracking-wider hover:text-foreground hover:border-muted-foreground transition-colors", children: "Download EPUB" }),
            book.download_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: book.download_url, className: "flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-divider text-muted-foreground font-mono text-[10px] uppercase tracking-wider hover:text-foreground hover:border-muted-foreground transition-colors", children: "Download Text" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "Similar Books" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookRail, { books: similar })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10 px-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold mb-4", children: "Reviews" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4", children: sampleReviews.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gold/20 grid place-items-center font-display font-semibold text-gold shrink-0", children: r.name[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-[15px]", children: r.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5 text-gold", children: Array.from({
                length: 5
              }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 10, fill: i < r.rating ? "currentColor" : "none", strokeWidth: 1.5 }, i)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 leading-relaxed", children: r.text })
          ] })
        ] }, r.name)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-4 w-full py-2.5 rounded-full border border-divider font-mono text-[11px] uppercase tracking-wider text-muted-foreground", children: "Load more" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-divider", style: {
      paddingBottom: "env(safe-area-inset-bottom)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto px-5 py-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: "Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold text-gold", children: formatKES(book.price) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => wish.toggle(book), "aria-label": "Add to wishlist", className: "w-11 h-11 grid place-items-center rounded-full border border-divider", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 18, fill: wish.has(book.id) ? "#C9A84C" : "transparent", className: wish.has(book.id) ? "text-gold" : "" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        upsert(book.id, 1);
        setReading(true);
      }, className: "px-4 h-11 rounded-full bg-muted text-foreground text-sm font-medium cursor-pointer", children: "Start Reading" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => add(book), className: "px-5 h-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold", children: "Buy Now" })
    ] }) }),
    reading && /* @__PURE__ */ jsxRuntimeExports.jsx(BookReader, { book, onClose: () => setReading(false), onTextHighlight: (text, context) => {
      setHighlightedText({
        text,
        context
      });
      setAiOpen(true);
    } }),
    aiOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(AiAssistant, { onClose: () => {
      setAiOpen(false);
      setHighlightedText(null);
    }, activeBookId: book.id, activeBookTitle: book.title, textSelection: highlightedText || void 0 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hidden" })
  ] });
}
function Stat({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-divider px-3 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-wider", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[12px] font-bold mt-1 text-foreground line-clamp-1", children: value })
  ] });
}
const sampleReviews = [{
  name: "Wanjiru K.",
  rating: 5,
  text: "Couldn't put it down. The pacing is excellent and the characters feel real."
}, {
  name: "David O.",
  rating: 4,
  text: "A solid, well-crafted story. The middle drags slightly but the ending makes up for it."
}, {
  name: "Priya M.",
  rating: 5,
  text: "One of the most thoughtful books I've read this year. Highly recommend."
}];
export {
  BookDetail as component
};
