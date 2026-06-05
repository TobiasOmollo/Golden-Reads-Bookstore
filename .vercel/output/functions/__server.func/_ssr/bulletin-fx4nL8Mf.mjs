import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-BXPGCkjp.mjs";
import { a as api } from "./client-DmW5idh4.mjs";
import { R as Radio } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/zustand.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./Logo-BC9wrmwd.mjs";
import "./router-Cw_4uW6G.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function BulletinPage() {
  const {
    data: articles = [],
    isLoading
  } = useQuery({
    queryKey: ["magazines", "bulletin"],
    queryFn: () => api.magazines.bulletin()
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-semibold flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-4 w-4 mr-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-4 w-4 bg-red-500" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "text-gold", size: 26 }),
      "News Bulletin"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Latest headlines and live recurrent news updates." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 min-h-[300px]", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: Array.from({
      length: 6
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCardSkeleton, {}, i)) }) : articles.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layout: true, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: articles.map((article) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCard, { article }, article.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 40, className: "text-muted-foreground/30 mb-3 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No recent bulletin feeds found. Please check back later." })
    ] }) })
  ] }) });
}
function ArticleCard({
  article
}) {
  const formattedDate = () => {
    try {
      return new Date(article.publishedAt).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return article.publishedAt || "Recently";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 12
  }, animate: {
    opacity: 1,
    y: 0
  }, transition: {
    duration: 0.3
  }, className: "flex flex-col bg-surface/40 dark:bg-surface/10 border border-divider rounded-2xl overflow-hidden hover:shadow-card hover:scale-[1.01] active:scale-[0.99] transition-all group h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[16/10] overflow-hidden bg-muted", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: article.heroImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80", alt: article.title, loading: "lazy", className: "w-full h-full object-cover group-hover:scale-102 transition-transform duration-500", onError: (e) => {
        e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800";
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-[9px] font-mono font-semibold tracking-wider uppercase shadow-sm", children: article.publication })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col flex-grow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest", children: formattedDate() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-sm font-semibold leading-snug font-display group-hover:text-gold transition-colors line-clamp-2", children: article.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed flex-grow", children: article.summary }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-3 border-t border-divider flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: article.sourceUrl, target: "_blank", rel: "noopener noreferrer", className: "text-[10px] font-mono uppercase tracking-wider text-gold font-bold hover:underline", children: "Read Original →" }) })
    ] })
  ] });
}
function ArticleCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col border border-divider rounded-2xl overflow-hidden h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/10] skeleton" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex-grow space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded skeleton w-1/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 rounded skeleton w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 rounded skeleton w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 rounded skeleton w-5/6" })
    ] })
  ] });
}
export {
  BulletinPage as component
};
