import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Radio } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api/client";
import type { Article } from "@/types";

export const Route = createFileRoute("/bulletin")({
  head: () => ({
    meta: [
      { title: "News Bulletin – Golden Reads" },
      { name: "description", content: "Stay updated with live recurrent news updates and breaking stories from East Africa." },
    ],
  }),
  component: BulletinPage,
});

function BulletinPage() {
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["magazines", "bulletin"],
    queryFn: () => api.magazines.bulletin(),
  });

  return (
    <AppShell>
      <div className="px-5 pt-4">
        <h1 className="font-display text-2xl font-semibold flex items-center gap-2.5">
          <span className="relative flex h-4 w-4 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
          <Radio className="text-gold" size={26} />
          News Bulletin
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Latest headlines and live recurrent news updates.
        </p>

        {/* Articles List Grid */}
        <div className="mt-8 min-h-[300px]">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
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
              <Radio size={40} className="text-muted-foreground/30 mb-3 animate-pulse" />
              <p className="text-sm text-muted-foreground">
                No recent bulletin feeds found. Please check back later.
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
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-[9px] font-mono font-semibold tracking-wider uppercase shadow-sm">
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
