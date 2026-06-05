import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useCart, f as formatKES } from "./AppShell-BXPGCkjp.mjs";
import { a as api } from "./client-DmW5idh4.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { P as Plus, e as Star } from "../_libs/lucide-react.mjs";
function BookCard({ book }) {
  const add = useCart((s) => s.add);
  const resolvedCover = api.books.coverUrl(book.id, book.gutendexId || book.librivoxId);
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
          "aria-label": `${book.title} by ${book.author}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[2/3] rounded-xl overflow-hidden bg-muted shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: resolvedCover,
                  alt: "",
                  loading: "lazy",
                  className: "w-full h-full object-cover group-active:scale-[0.98] transition-transform",
                  onError: (e) => {
                    e.currentTarget.src = "/placeholder-cover.jpg";
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `Add ${book.title} to cart`,
                  onClick: (e) => {
                    e.preventDefault();
                    add(book);
                  },
                  className: "absolute bottom-2 right-2 w-8 h-8 grid place-items-center rounded-full bg-gold text-gold-foreground shadow-md hover:scale-105 active:scale-95 transition-transform",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, strokeWidth: 2.5 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-[13px] font-semibold leading-snug line-clamp-2 font-body", children: book.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground line-clamp-1", children: book.author }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 text-gold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 11, fill: "currentColor", strokeWidth: 0 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-foreground", children: book.rating })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-bold text-foreground", children: formatKES(book.price) })
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
