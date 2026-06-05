import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-BXPGCkjp.mjs";
import { B as BookCardSkeleton, a as BookCard } from "./BookCard-CQx9IvEs.mjs";
import { a as api } from "./client-DmW5idh4.mjs";
import { a as Route$3, b as booksData } from "./router-Cw_4uW6G.mjs";
import { d as Search } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "./Logo-BC9wrmwd.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const GENRES = [
  "Fiction",
  "Romance",
  "Thriller",
  "Mystery",
  "Fantasy",
  "Business",
  "Biography",
  "Technology",
  "Science",
  "Self-Help"
];
const fallbackBooks = booksData;
function DiscoverPage() {
  const {
    q: searchQ = "",
    genre: searchGenre = "All"
  } = Route$3.useSearch();
  const navigate = useNavigate({
    from: Route$3.fullPath
  });
  const [q, setQ] = reactExports.useState(searchQ);
  const [genre, setGenre] = reactExports.useState(searchGenre);
  reactExports.useEffect(() => {
    setQ(searchQ);
  }, [searchQ]);
  reactExports.useEffect(() => {
    setGenre(searchGenre);
  }, [searchGenre]);
  const [debounced, setDebounced] = reactExports.useState(searchQ);
  reactExports.useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(q.trim());
      navigate({
        search: (prev) => ({
          ...prev,
          q: q.trim()
        }),
        replace: true
      });
    }, 300);
    return () => clearTimeout(t);
  }, [q, navigate]);
  const handleGenreChange = (g) => {
    setGenre(g);
    navigate({
      search: (prev) => ({
        ...prev,
        genre: g
      })
    });
  };
  const {
    data: searchResults,
    isLoading
  } = useQuery({
    queryKey: ["books", "search", debounced, genre],
    queryFn: () => api.books.search(debounced, genre === "All" ? "" : genre),
    enabled: debounced.length > 1
  });
  const filtered = reactExports.useMemo(() => {
    if (debounced.length > 1 && searchResults) return searchResults;
    return fallbackBooks.filter((b) => (genre === "All" || b.genre.includes(genre)) && (debounced === "" || b.title.toLowerCase().includes(debounced.toLowerCase()) || b.author.toLowerCase().includes(debounced.toLowerCase())));
  }, [debounced, genre, searchResults]);
  const showSkeletons = isLoading && debounced.length > 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Discover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Find your next favourite read." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "search", value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search titles or authors", "aria-label": "Search books", className: "w-full pl-11 pr-4 py-3 rounded-md bg-muted text-sm font-body placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-gold/50" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 overflow-x-auto no-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 px-5", children: ["All", ...GENRES].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleGenreChange(g), "aria-pressed": genre === g, className: `shrink-0 px-3.5 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider transition-colors ${genre === g ? "bg-primary text-primary-foreground" : "border border-divider text-muted-foreground"}`, children: g }, g)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layout: true, className: "grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-4 gap-y-8 px-5 mt-6 justify-center", children: showSkeletons ? Array.from({
      length: 6
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(BookCardSkeleton, {}, i)) : filtered.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookCard, { book: b }) }, b.id)) }),
    !showSkeletons && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 mt-10 text-center text-sm text-muted-foreground", children: "No books match your search." })
  ] });
}
export {
  DiscoverPage as component
};
