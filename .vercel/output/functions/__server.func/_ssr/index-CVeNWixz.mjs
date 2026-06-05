import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell, r as resolveCover } from "./AppShell-CZ_gdhob.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SectionHeader, B as BookRail } from "./BookRail-CxFV1nYo.mjs";
import { B as BookCardSkeleton } from "./BookCard-C2hwdxet.mjs";
import { a as api } from "./client-Ctwdzmrv.mjs";
import { b as booksData } from "./router-CEtJ93rS.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import { e as Star } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/zustand.mjs";
import "./Logo-BC9wrmwd.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function HeroCarousel({ books }) {
  const [index, setIndex] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % books.length), 4e3);
    return () => clearInterval(id);
  }, [books.length]);
  const book = books[index];
  if (!book) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[16/10] max-h-[340px] rounded-2xl overflow-hidden bg-muted shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 1 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.6, ease: "easeOut" },
          className: "absolute inset-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: resolveCover(book),
                alt: book.title,
                className: "w-full h-full object-cover",
                onError: (e) => {
                  const seed = book.id ?? "fallback";
                  e.target.onerror = null;
                  e.target.src = `https://picsum.photos/seed/${seed}/400/600`;
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 scrim-bottom" })
          ]
        },
        book.id
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/book/$id",
          params: { id: book.id },
          className: "absolute inset-0 flex flex-col justify-end p-5 text-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-2", children: "Featured" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold leading-tight", children: book.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-white/85 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif italic", children: book.author }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-gold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 12, fill: "currentColor", strokeWidth: 0 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px]", children: book.rating })
              ] })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-1.5 mt-3", children: books.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        "aria-label": `Show slide ${i + 1}`,
        onClick: () => setIndex(i),
        className: `h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-gold" : "w-1.5 bg-muted"}`
      },
      b.id
    )) })
  ] });
}
const fallbackBooks = booksData;
function byGenre(books, g) {
  return books.filter((b) => b.genre.includes(g));
}
function HomePage() {
  const {
    data: trending = fallbackBooks,
    isLoading
  } = useQuery({
    queryKey: ["books", "trending"],
    queryFn: api.books.trending,
    initialData: fallbackBooks
  });
  const books = trending.length ? trending : fallbackBooks;
  const sections = [{
    title: "Trending Now",
    href: "/discover",
    books: books.slice(0, 10)
  }, {
    title: "Best Sellers",
    href: "/discover",
    books: [...books].sort((a, b) => b.rating - a.rating).slice(0, 10)
  }, {
    title: "New Releases",
    href: "/discover",
    books: [...books].reverse().slice(0, 10)
  }, {
    title: "Recommended For You",
    href: "/discover",
    books: books.slice(4, 14)
  }, {
    title: "Technology Books",
    href: "/discover",
    books: byGenre(books, "Technology")
  }, {
    title: "Business Books",
    href: "/discover",
    books: byGenre(books, "Business")
  }, {
    title: "Fiction Collection",
    href: "/discover",
    books: byGenre(books, "Fiction")
  }, {
    title: "Audiobooks",
    href: "/discover",
    books: books.filter((b) => b.formats.includes("audio")).slice(0, 10)
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-4 pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground", children: "Welcome back, Amara" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold mt-1", children: "What will you read today?" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeroCarousel, { books: books.slice(0, 5) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-8", children: isLoading && books === fallbackBooks ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 px-5", children: Array.from({
      length: 4
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(BookCardSkeleton, {}, i)) }) : sections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: s.title, href: s.href }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookRail, { books: s.books })
    ] }, s.title)) })
  ] });
}
export {
  HomePage as component
};
