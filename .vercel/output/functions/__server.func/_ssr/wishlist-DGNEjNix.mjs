import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useCart, A as AppShell, f as formatKES } from "./AppShell-D1r7d6o9.mjs";
import { u as useWishlist } from "./wishlist-BmF41ml4.mjs";
import { u as useQueries } from "../_libs/tanstack__react-query.mjs";
import { a as api } from "./router-CZcnAnjP.mjs";
import { r as resolveCover } from "./utils-CI2FuZjX.mjs";
import { H as Heart, S as ShoppingCart } from "../_libs/lucide-react.mjs";
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
import "../_libs/zustand.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/zod.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function WishlistPage() {
  const wish = useWishlist();
  const add = useCart((s) => s.add);
  const results = useQueries({
    queries: wish.ids.map((id) => ({
      queryKey: ["book", id],
      queryFn: () => api.books.detail(id)
    }))
  });
  const items = results.map((res) => res.data).filter((book) => !!book);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Wishlist" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          items.length,
          " saved"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 py-1.5 rounded-full border border-divider font-mono text-[10px] uppercase tracking-wider", children: "Sort: Recent" })
    ] }),
    items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-24 px-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-gold/10 grid place-items-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 28, className: "text-gold" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: "No saved books yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 mb-6", children: "Tap the heart on any book to save it for later." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium", children: "Browse books" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 divide-y divide-divider", children: items.map((book, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.li, { initial: {
      opacity: 0,
      y: 8
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.3,
      delay: idx * 0.04
    }, className: "flex items-center gap-3 px-5 py-3.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/book/$id", params: {
        id: book.id
      }, className: "flex items-center gap-3 flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: resolveCover(book), alt: book.title, className: "w-14 h-20 rounded-lg object-cover bg-muted shrink-0", onError: (e) => {
          e.currentTarget.style.display = "none";
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm line-clamp-1", children: book.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: book.author }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] mt-1 text-gold font-bold", children: formatKES(book.price) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": "Add to cart", onClick: () => {
          add(book);
          wish.remove(book.id);
        }, className: "w-9 h-9 grid place-items-center rounded-full bg-accent text-accent-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 15 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": "Remove", onClick: () => wish.remove(book.id), className: "w-9 h-9 grid place-items-center rounded-full border border-divider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 15, fill: "currentColor" }) })
      ] })
    ] }, book.id)) })
  ] });
}
export {
  WishlistPage as component
};
