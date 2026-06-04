import React, { useState, useEffect } from "react";
import { X, Type, ZoomIn, ZoomOut, Sparkles } from "lucide-react";
import { Book } from "@/types";

interface BookReaderProps {
  book: Book;
  onClose: () => void;
  onTextHighlight: (text: string, context: string) => void;
}

export default function BookReader({ book, onClose, onTextHighlight }: BookReaderProps) {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState<"cream" | "sepia" | "night">("cream");
  const [textSelections, setTextSelections] = useState("");

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

  useEffect(() => {
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

  return (
    <div className={`fixed inset-0 z-40 flex flex-col font-sans transition-all duration-300 ${fontThemes[theme]}`}>
      {/* Top Reading Navigation Bar */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-black/10 backdrop-blur bg-opacity-90">
        <div className="min-w-0">
          <span className="text-[10px] font-mono opacity-60 tracking-wider">READING MODE</span>
          <h3 className="text-xs font-semibold truncate max-w-xs">{book.title}</h3>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-3">
          {/* Zoom controls */}
          <div className="flex items-center gap-1.5 border-r pr-3 border-slate-300/30">
            <button
              onClick={() => setFontSize(f => Math.max(12, f - 2))}
              className="p-1 hover:bg-black/5 rounded transition-transform"
              title="Font Decrease"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-semibold">{fontSize}px</span>
            <button
              onClick={() => setFontSize(f => Math.min(24, f + 2))}
              className="p-1 hover:bg-black/5 rounded transition-transform"
              title="Font Increase"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Theme buttons */}
          <div className="flex items-center gap-1.5 pr-2">
            <button
              onClick={() => setTheme("cream")}
              className={`w-5 h-5 rounded-full border bg-[#fdfbf7] ${theme === "cream" ? "ring-2 ring-indigo-500" : ""}`}
              title="Cream Tone"
            />
            <button
              onClick={() => setTheme("sepia")}
              className={`w-5 h-5 rounded-full border bg-[#f4ebd0] ${theme === "sepia" ? "ring-2 ring-indigo-500" : ""}`}
              title="Sepia Vintage"
            />
            <button
              onClick={() => setTheme("night")}
              className={`w-5 h-5 rounded-full border bg-[#0f111a] ${theme === "night" ? "ring-2 ring-indigo-500" : ""}`}
              title="Night Mode"
            />
          </div>

          <button
            onClick={onClose}
            className="p-2 cursor-pointer rounded hover:bg-black/5 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reader Text Page Engine */}
      <div className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="max-w-2xl mx-auto py-12 md:py-20 space-y-8 font-serif leading-relaxed select-text" style={{ fontSize: `${fontSize}px` }}>
          <div className="text-center space-y-3 pb-8 border-b border-black/5">
            <span className="font-mono text-xs opacity-60 tracking-widest uppercase">GUTENBERG FREE EPUB</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{book.title}</h1>
            <p className="text-md italic opacity-85">By {book.author}</p>
          </div>

          <div className="space-y-6 md:space-y-8 hyphens-auto">
            {/* Embedded classic chapters */}
            <h2 className="text-2xl font-bold pt-6 font-sans">Chapter 1: The Departure</h2>
            <p>
              The morning was cold and crisp, a light mist hugging the cobblestones of Baker Street. 
              Sherlock Holmes walked silently up and down our cozy quarters, his hands locked behind his back, 
              lost in the depths of some profound mathematical problem. The fire flickered gently, casting 
              long, dancing shadows across the rows of chemical vials and heavy leather treatises that lined our walls.
            </p>
            <p>
              Indeed, my dear Watson, there is nothing like a singular anomaly to stir the blood. 
              When everything in the world seems mundane, the human mind grows dull and lethargic. 
              We require challenge; we require the obscure, the bizarre, the impossible. Only on 
              high intellectual elevations does the soul truly locate its authentic nourishment.
            </p>
            <p>
              A sharp knock at the door broke our meditations. Landlady Mrs. Hudson entered, 
              bearing a silver tray upon which lay a single note, written in an elegant but hurried hand. 
              I watched Holmes snatch it up, his gray eyes flashing with instant, predatory enthusiasm.
            </p>

            <h2 className="text-2xl font-bold pt-6 font-sans">Chapter 2: The Intriguing Client</h2>
            <p>
              It was a letter without signature, yet the paper was of a peculiar thick texture—an expensive 
              Belgian brand, as Holmes quickly deduced with a single sniff and a glance into the watermarks. 
              "This, Watson, was not penned by a common clerk. Observe the heavy styling, the distinct 
              imprint of confidence that only supreme wealth can purchase."
            </p>
          </div>
        </div>
      </div>

      {/* Pop-up Explainer Tooltip */}
      {textSelections && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold py-3 px-5 rounded-full shadow-2xl flex items-center gap-2 px-6 hover:scale-105 active:scale-95 transition-transform cursor-pointer select-none border border-indigo-400">
          <Sparkles className="w-4 h-4 animate-spin text-indigo-200" />
          <button onClick={handleAskAi}>
            Explain selection: "{textSelections.length > 20 ? textSelections.substring(0, 18) + "..." : textSelections}"
          </button>
        </div>
      )}
    </div>
  );
}
