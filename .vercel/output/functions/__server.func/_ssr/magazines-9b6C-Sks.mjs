import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-D1r7d6o9.mjs";
import { R as Route$6, a as api } from "./router-CZcnAnjP.mjs";
import { N as Newspaper } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { o as objectType, e as enumType } from "../_libs/zod.mjs";
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
import "./utils-CI2FuZjX.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
objectType({
  tab: enumType(["eastafrica", "business"]).optional().catch("eastafrica")
});
const categories = [{
  id: "eastafrica",
  label: "East Africa",
  desc: "Regional stories and developments"
}, {
  id: "business",
  label: "Business",
  desc: "Finance, market trends and economy"
}];
function MagazinesPage() {
  const {
    tab: activeTab = "eastafrica"
  } = Route$6.useSearch();
  const navigate = useNavigate({
    from: Route$6.fullPath
  });
  const handleTabChange = (tabId) => {
    navigate({
      search: () => ({
        tab: tabId
      })
    });
  };
  const {
    data: articles = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["magazines", activeTab],
    queryFn: () => {
      if (activeTab === "eastafrica") return api.magazines.eastAfrica();
      if (activeTab === "business") return api.magazines.business();
      return [];
    }
  });
  const activeCategory = categories.find((c) => c.id === activeTab) || categories[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-semibold flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "text-gold", size: 26 }),
      "Magazines"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Curated publications and regional journals." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 overflow-x-auto no-scrollbar border-b border-divider", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 min-w-max pb-px", children: categories.map((c) => {
      const active = activeTab === c.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleTabChange(c.id), "aria-pressed": active, className: `relative px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${active ? "text-gold font-bold" : "text-muted-foreground hover:text-foreground"}`, children: [
        c.label,
        active && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { layoutId: "activeCategoryLine", className: "absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full", transition: {
          type: "spring",
          stiffness: 380,
          damping: 30
        } })
      ] }, c.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold tracking-wide uppercase text-foreground", children: activeCategory.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: activeCategory.desc })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 min-h-[300px]", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: Array.from({
      length: 6
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCardSkeleton, {}, i)) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center border border-dashed border-red-500/30 rounded-2xl bg-red-500/5 dark:bg-red-950/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "text-red-500 mb-3 animate-pulse", size: 40 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Failed to load real-time publications." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-xs mx-auto", children: "There was a network error fetching live RSS feeds. Check your backend status or connection." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => refetch(), className: "mt-4 px-4 py-2 bg-gold text-background rounded-lg text-xs font-mono font-bold hover:bg-gold/80 transition-colors", children: "Retry Connection" })
    ] }) : articles.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layout: true, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: articles.map((article) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCard, { article }, article.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { size: 40, className: "text-muted-foreground/30 mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No publications found for this category." })
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 dark:bg-background/80 backdrop-blur-sm text-[9px] font-mono font-semibold tracking-wider text-gold uppercase shadow-sm", children: article.publication })
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
  MagazinesPage as component
};
