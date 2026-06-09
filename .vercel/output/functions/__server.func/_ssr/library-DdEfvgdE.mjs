import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-D1r7d6o9.mjs";
import { u as useLibrary } from "./library-Czyiyke9.mjs";
import { u as useQueries } from "../_libs/tanstack__react-query.mjs";
import { a as api } from "./router-CA9YDzUm.mjs";
import { r as resolveCover } from "./utils-CI2FuZjX.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/zod.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function useCountUp(target, duration = 900) {
  const [n, setN] = reactExports.useState(0);
  reactExports.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}
function LibraryPage() {
  const entries = useLibrary((s) => s.entries);
  const [tab, setTab] = reactExports.useState("all");
  const results = useQueries({
    queries: entries.map((e) => ({
      queryKey: ["book", e.bookId],
      queryFn: () => api.books.detail(e.bookId)
    }))
  });
  const rows = results.map((res, i) => {
    const entry = entries[i];
    const book = res.data;
    return {
      entry,
      book
    };
  }).filter((r) => !!r.book).filter((r) => tab === "all" ? true : r.entry.status === tab);
  const pagesToday = useCountUp(47);
  const streak = useCountUp(12);
  const monthCount = useCountUp(3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "My Library" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your reading, in one place." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 px-5 mt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Pages Today", value: pagesToday, accent: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Streak 🔥", value: streak, suffix: " days" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "This Month", value: monthCount, suffix: " books" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 px-5 mt-6", children: ["all", "reading", "completed"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t), "aria-pressed": tab === t, className: `px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-colors ${tab === t ? "bg-gold text-gold-foreground" : "bg-muted text-muted-foreground"}`, children: t }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 divide-y divide-divider", children: [
      rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "px-5 py-12 text-center text-muted-foreground text-sm", children: "Nothing here yet." }),
      rows.map(({
        entry,
        book
      }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.li, { initial: {
        opacity: 0,
        y: 8
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.3,
        delay: idx * 0.04
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/book/$id", params: {
        id: book.id
      }, className: "flex items-center gap-3 px-5 py-3.5 active:bg-muted/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: resolveCover(book), alt: book.title, className: "w-14 h-20 rounded-lg object-cover bg-muted shrink-0", onError: (e) => {
          e.currentTarget.style.display = "none";
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm line-clamp-1", children: book.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: book.author }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gold transition-all", style: {
              width: `${entry.progress}%`
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground w-9 text-right", children: [
              entry.progress,
              "%"
            ] })
          ] })
        ] })
      ] }) }, book.id))
    ] })
  ] });
}
function StatCard({
  label,
  value,
  suffix = "",
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl p-3 border border-divider ${accent ? "bg-gold/10" : "bg-surface"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xl font-semibold mt-1", children: [
      value,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: suffix })
    ] })
  ] });
}
export {
  LibraryPage as component
};
