import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useCart, f as formatKES } from "./AppShell-CnT8i_7n.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { P as Plus, j as Star } from "../_libs/lucide-react.mjs";
function BookCard({ book }) {
  const add = useCart((s) => s.add);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, ease: "easeOut" },
      className: "w-[140px] shrink-0",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/book/$id",
          params: { id: book.id },
          className: "block group",
          "aria-label": `${book.title ?? "Untitled Book"} by ${book.author ?? "Unknown Author"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[2/3] rounded-xl overflow-hidden bg-muted shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: book.cover_url || "/placeholder-book.png",
                  alt: book.title ?? "Book cover",
                  loading: "lazy",
                  className: "w-full h-full object-cover group-active:scale-[0.98] transition-transform",
                  onError: (e) => {
                    e.currentTarget.style.display = "none";
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `Add ${book.title ?? "Untitled Book"} to cart`,
                  onClick: (e) => {
                    e.preventDefault();
                    add(book);
                  },
                  className: "absolute bottom-2 right-2 w-8 h-8 grid place-items-center rounded-full bg-gold text-gold-foreground shadow-md hover:scale-105 active:scale-95 transition-transform",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, strokeWidth: 2.5 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-[13px] font-semibold leading-snug line-clamp-2 font-body", children: book.title ?? "Untitled Book" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground line-clamp-1", children: book.author ?? "Unknown Author" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 text-gold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 11, fill: "currentColor", strokeWidth: 0 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-foreground", children: book.rating ?? 4.5 })
                ] }),
                book.download_count !== void 0 && book.download_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[9px] text-muted-foreground select-none", children: [
                  "(",
                  (book.download_count ?? 0).toLocaleString(),
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-bold text-foreground", children: formatKES(book.price ?? 0) })
            ] })
          ]
        }
      )
    }
  );
}
function BookCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[140px] shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[2/3] rounded-xl skeleton" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 mt-2 rounded skeleton w-3/4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 mt-1.5 rounded skeleton w-1/2" })
  ] });
}
export {
  BookCardSkeleton as B,
  BookCard as a
};
