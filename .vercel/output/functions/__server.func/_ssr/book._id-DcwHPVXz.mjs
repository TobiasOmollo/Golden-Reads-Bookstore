import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as Route, d as books } from "./router-CEtJ93rS.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useCart, A as AppShell, r as resolveCover, f as formatKES } from "./AppShell-CZ_gdhob.mjs";
import { S as SectionHeader, B as BookRail } from "./BookRail-CxFV1nYo.mjs";
import { u as useWishlist } from "./wishlist-BmF41ml4.mjs";
import { u as useLibrary } from "./library-Czyiyke9.mjs";
import { a as api } from "./client-Ctwdzmrv.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { f as ArrowLeft, H as Heart, e as Star, g as Clock, h as BookOpen, i as Headphones } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/zod.mjs";
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
import "../_libs/zustand.mjs";
import "./Logo-BC9wrmwd.mjs";
import "./BookCard-C2hwdxet.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function BookDetail() {
  const {
    id
  } = Route.useParams();
  const router = useRouter();
  const fallback = books.find((b) => b.id === id) ?? books[0];
  const {
    data: book = fallback
  } = useQuery({
    queryKey: ["book", id],
    queryFn: () => api.books.detail(id),
    initialData: fallback
  });
  const add = useCart((s) => s.add);
  const wish = useWishlist();
  const upsert = useLibrary((s) => s.upsert);
  const [expanded, setExpanded] = reactExports.useState(false);
  if (!book) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl", children: "Book not found" }) }) });
  }
  const similar = books.filter((b) => b.id !== book.id && b.genre.some((g) => book.genre.includes(g))).slice(0, 8);
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
          const seed = book.id ?? "fallback";
          e.target.onerror = null;
          e.target.src = `https://picsum.photos/seed/${seed}/400/600`;
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
      }, className: "px-4 h-11 rounded-full bg-muted text-foreground text-sm font-medium", children: "Start Reading" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => add(book), className: "px-5 h-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold", children: "Buy Now" })
    ] }) }),
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
