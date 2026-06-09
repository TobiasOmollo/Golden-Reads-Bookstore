import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api/client";
import type { Article } from "@/types";
import { z } from "zod";

const magazinesSearchSchema = z.object({
  tab: z.enum(["eastafrica", "business"]).optional().catch("eastafrica"),
});

type MagazinesTab = z.infer<typeof magazinesSearchSchema>["tab"];

export const Route = createFileRoute("/magazines")({
  validateSearch: (search) => magazinesSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Magazines – Golden Reads" },
      { name: "description", content: "Stay updated with regional magazines and business publications in East Africa." },
    ],
  }),
  component: MagazinesPage,
});

const categories = [
  { id: "eastafrica", label: "East Africa", desc: "Regional stories and developments" },
  { id: "business", label: "Business", desc: "Finance, market trends and economy" },
] as const;

function MagazinesPage() {
  const { tab: activeTab = "eastafrica" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const handleTabChange = (tabId: MagazinesTab) => {
    navigate({
      search: () => ({ tab: tabId }),
    });
  };

  const { data: articles = [], isLoading, isError, refetch } = useQuery<Article[]>({
    queryKey: ["magazines", activeTab],
    queryFn: () => {
      if (activeTab === "eastafrica") return api.magazines.eastAfrica();
      if (activeTab === "business") return api.magazines.business();
      return [];
    },
  });

  const activeCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <AppShell>
      <div className="px-5 pt-4">
        <h1 className="font-display text-2xl font-semibold flex items-center gap-2.5">
          <Newspaper className="text-gold" size={26} />
          Magazines
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Curated publications and regional journals.
        </p>

        {/* Categories Tab Bar */}
        <div className="mt-6 overflow-x-auto no-scrollbar border-b border-divider">
          <div className="flex gap-2 min-w-max pb-px">
            {categories.map((c) => {
              const active = activeTab === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleTabChange(c.id)}
                  aria-pressed={active}
                  className={`relative px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    active ? "text-gold font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                  {active && (
                    <motion.span
                      layoutId="activeCategoryLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Description */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground">
              {activeCategory.label}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeCategory.desc}
            </p>
          </div>
        </div>

        {/* Articles List Grid */}
        <div className="mt-6 min-h-[300px]">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-red-500/30 rounded-2xl bg-red-500/5 dark:bg-red-950/10">
              <Newspaper className="text-red-500 mb-3 animate-pulse" size={40} />
              <p className="text-sm font-semibold text-foreground">
                Failed to load real-time publications.
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                There was a network error fetching live RSS feeds. Check your backend status or connection.
              </p>
              <button 
                onClick={() => refetch()} 
                className="mt-4 px-4 py-2 bg-gold text-background rounded-lg text-xs font-mono font-bold hover:bg-gold/80 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          ) : articles.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Newspaper size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No publications found for this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const formattedDate = () => {
    try {
      return new Date(article.publishedAt).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return article.publishedAt || "Recently";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col bg-surface/40 dark:bg-surface/10 border border-divider rounded-2xl overflow-hidden hover:shadow-card hover:scale-[1.01] active:scale-[0.99] transition-all group h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={article.heroImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80"}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800";
          }}
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 dark:bg-background/80 backdrop-blur-sm text-[9px] font-mono font-semibold tracking-wider text-gold uppercase shadow-sm">
          {article.publication}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          {formattedDate()}
        </span>
        <h3 className="mt-2 text-sm font-semibold leading-snug font-display group-hover:text-gold transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed flex-grow">
          {article.summary}
        </p>
        <div className="mt-4 pt-3 border-t border-divider flex items-center justify-between">
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold hover:underline"
          >
            Read Original &rarr;
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col border border-divider rounded-2xl overflow-hidden h-full">
      <div className="aspect-[16/10] skeleton" />
      <div className="p-5 flex-grow space-y-3">
        <div className="h-2 rounded skeleton w-1/4" />
        <div className="h-4 rounded skeleton w-3/4" />
        <div className="h-3 rounded skeleton w-full" />
        <div className="h-3 rounded skeleton w-5/6" />
      </div>
    </div>
  );
}
