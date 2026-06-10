import { c as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports, R as React__default } from "../_libs/react.mjs";
import { o as objectType, e as enumType, s as stringType } from "../_libs/zod.mjs";
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
const appCss = "/assets/styles-DdJIr9Et.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$9 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0F0F1A" },
      { title: "Golden Reads – Discover, Buy and Read Books Anywhere" },
      {
        name: "description",
        content: "Golden Reads is a modern book marketplace and digital reading platform where you can discover bestsellers, build a personal library, and enjoy immersive reading on any device."
      },
      {
        name: "keywords",
        content: "books, ebooks, audiobooks, online bookstore, digital library, reading app, book recommendations, reading tracker"
      },
      { property: "og:title", content: "Golden Reads – Discover, Buy and Read Books Anywhere" },
      {
        property: "og:description",
        content: "Discover bestsellers, build a personal library and enjoy immersive reading anywhere with Golden Reads."
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Golden Reads" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com"
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&family=Cormorant+Garamond:wght@500;600;700&display=swap"
      },
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$9.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$8 = () => import("./wishlist-C9KBBz95.mjs");
const Route$8 = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{
      title: "Wishlist – Golden Reads"
    }, {
      name: "description",
      content: "Books you've saved for later."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./profile-D4lRMHAy.mjs");
const Route$7 = createFileRoute("/profile")({
  head: () => ({
    meta: [{
      title: "Profile – Golden Reads"
    }, {
      name: "description",
      content: "Manage your Golden Reads account and preferences."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./magazines-DRsMYRpX.mjs");
const magazinesSearchSchema = objectType({
  tab: enumType(["eastafrica", "business"]).optional().catch("eastafrica")
});
const Route$6 = createFileRoute("/magazines")({
  validateSearch: (search) => magazinesSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Magazines – Golden Reads"
    }, {
      name: "description",
      content: "Stay updated with regional magazines and business publications in East Africa."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./login-C6jzSMz0.mjs");
const Route$5 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign In – Golden Reads"
    }, {
      name: "description",
      content: "Access your Golden Reads account and sync your library."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const FloatingLabelInput = React__default.forwardRef(({
  label,
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  trailing,
  invalid,
  ...props
}, ref) => {
  const [focused, setFocused] = reactExports.useState(false);
  const hasValue = value !== void 0 && value !== null && String(value).length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 px-4 pt-5 pb-1.5 rounded-2xl bg-surface border transition-all duration-200 ${invalid ? "border-destructive focus-within:ring-1 focus-within:ring-destructive" : focused ? "border-gold ring-1 ring-gold shadow-soft" : "border-divider hover:border-muted-foreground/30"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange, ref, onFocus: (e) => {
        setFocused(true);
        onFocus?.(e);
      }, onBlur: (e) => {
        setFocused(false);
        onBlur?.(e);
      }, className: `peer w-full bg-transparent outline-none text-sm pt-1 pb-0.5 text-foreground placeholder-transparent focus:outline-none focus:ring-0 ${className}`, placeholder: label, ...props }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: `absolute left-0 top-0.5 font-mono text-muted-foreground transition-all duration-200 pointer-events-none origin-[0_0] select-none
                ${focused || hasValue ? "text-[9px] uppercase tracking-wider -translate-y-2.5 text-gold font-semibold" : "text-xs translate-y-0.5"}`, children: label })
    ] }),
    trailing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center pl-1", children: trailing })
  ] }) });
});
FloatingLabelInput.displayName = "FloatingLabelInput";
const $$splitComponentImporter$4 = () => import("./library-O3LQl3nq.mjs");
const Route$4 = createFileRoute("/library")({
  head: () => ({
    meta: [{
      title: "My Library – Golden Reads"
    }, {
      name: "description",
      content: "Track your reading progress and revisit completed books."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./discover-BFQrMGwE.mjs");
const discoverSearchSchema = objectType({
  q: stringType().optional().catch(""),
  genre: stringType().optional().catch("All")
});
const Route$3 = createFileRoute("/discover")({
  validateSearch: (search) => discoverSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Discover – Golden Reads"
    }, {
      name: "description",
      content: "Browse the full Golden Reads catalogue by genre."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./bulletin-DUwBhWSB.mjs");
const Route$2 = createFileRoute("/bulletin")({
  head: () => ({
    meta: [{
      title: "News Bulletin – Golden Reads"
    }, {
      name: "description",
      content: "Stay updated with live recurrent news updates and breaking stories from East Africa."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-CE0_Jdux.mjs");
const Route$1 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Home – Golden Reads"
    }, {
      name: "description",
      content: "Trending books, best sellers, new releases and personalised picks on Golden Reads."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const BASE = "https://readers-backend.onrender.com";
async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return await res.json();
}
async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return await res.json();
}
function normalizeBook(raw) {
  if (!raw) return raw;
  return {
    ...raw,
    title: raw.title ?? "Unknown Title",
    author: raw.author ?? "Unknown Author",
    cover_url: raw.cover_url ?? raw.cover ?? "",
    cover: raw.cover ?? raw.cover_url ?? "",
    description: raw.description ?? "",
    genre: raw.genre ?? "Fiction",
    authors: raw.authors ?? [],
    genres: raw.genres ?? [],
    formats: raw.formats ?? {},
    subjects: raw.subjects ?? [],
    bookshelves: raw.bookshelves ?? [],
    languages: raw.languages ?? [],
    download_count: raw.download_count ?? 0
  };
}
function normalizeAudiobook(raw) {
  if (!raw) return raw;
  return {
    ...raw,
    title: raw.title ?? "Unknown Title",
    author: raw.author ?? "Unknown Author",
    description: raw.description ?? "",
    cover: raw.cover ?? "",
    chapters: raw.chapters ?? [],
    authors: raw.authors ?? [],
    genres: raw.genres ?? [],
    url_zip_file: raw.url_zip_file ?? null,
    num_sections: raw.num_sections ?? 0,
    language: raw.language ?? "",
    url_rss: raw.url_rss ?? ""
  };
}
const api = {
  books: {
    discover: async (q) => {
      const res = await get(`/books/search?q=${encodeURIComponent(q)}`);
      return (res || []).map(normalizeBook);
    },
    trending: async () => {
      const res = await get("/books/trending");
      return (res || []).map(normalizeBook);
    },
    search: async (q, genre = "") => {
      const res = await get(`/books/search?q=${encodeURIComponent(q)}&genre=${encodeURIComponent(genre)}`);
      return (res || []).map(normalizeBook);
    },
    detail: async (id) => {
      const cleanId = id.startsWith("g") ? id.slice(1) : id;
      const res = await get(`/books/${cleanId}`);
      return normalizeBook(res);
    },
    coverUrl: (id, openLibraryId) => openLibraryId ? `https://covers.openlibrary.org/b/id/${openLibraryId}-L.jpg` : `${BASE}/books/${id}/cover`
  },
  audio: {
    search: async (q) => {
      const res = await get(`/audio/search?q=${encodeURIComponent(q)}`);
      return (res || []).map(normalizeAudiobook);
    },
    detail: async (id) => {
      const res = await get(`/audio/${id}`);
      return normalizeAudiobook(res);
    }
  },
  podcasts: {
    search: async (q) => {
      return get(`/podcasts/search?q=${encodeURIComponent(q)}`);
    },
    episodes: async (feedId) => {
      return get(`/podcasts/${feedId}/episodes`);
    }
  },
  magazines: {
    bulletin: async (limit) => {
      return get(`/magazines/bulletin?limit=${limit || 30}`);
    },
    eastAfrica: async (limit = 60) => {
      return get(`/magazines/eastafrica?limit=${limit}`);
    },
    business: async (limit = 30) => {
      return get(`/magazines/business?limit=${limit}`);
    },
    lifestyle: async (limit = 20) => {
      return get(`/magazines/lifestyle?limit=${limit}`);
    },
    technology: async (limit = 20) => {
      return get(`/magazines/technology?limit=${limit}`);
    },
    feeds: async (countries = "", categories = "", limit = 60) => {
      return get(`/magazines/feeds?countries=${encodeURIComponent(countries)}&categories=${encodeURIComponent(categories)}&limit=${limit}`);
    },
    archive: async (q) => {
      return get(`/magazines/archive?q=${encodeURIComponent(q)}`);
    }
  },
  ai: {
    summarize: async (bookId, chapter) => {
      return post(`/ai/summarize`, { bookId, chapter });
    },
    flashcards: async (text) => {
      return post(`/ai/flashcards`, { text });
    },
    recommend: async (genres, history) => {
      const res = await post(`/ai/recommend`, { genres, history });
      return {
        recommendations: (res.recommendations || []).map(normalizeBook),
        reasoning: res.reasoning ?? ""
      };
    },
    explain: async (passage, context) => {
      return post(`/ai/explain`, { passage, context });
    }
  },
  auth: {
    login: async (email, password) => {
      return post("/auth/login", { email, password });
    },
    signup: async (email, password, profileDetails) => {
      return post("/auth/signup", { email, password, profileDetails });
    },
    google: async (token) => {
      return post("/auth/google", { token });
    }
  }
};
const $$splitComponentImporter = () => import("./book._id-NRGTHw-O.mjs");
const Route = createFileRoute("/book/$id")({
  loader: ({
    params
  }) => api.books.detail(params.id),
  head: ({
    loaderData
  }) => {
    const book = loaderData;
    return {
      meta: [{
        title: book ? `${book.title ?? "Untitled Book"} – Golden Reads` : "Book – Golden Reads"
      }, {
        name: "description",
        content: book ? (book.description || "").slice(0, 155) : "Book details on Golden Reads."
      }, {
        property: "og:title",
        content: book?.title || "Golden Reads"
      }, {
        property: "og:description",
        content: (book?.description || "").slice(0, 155)
      }, ...book ? [{
        property: "og:image",
        content: book.cover || ""
      }] : [], {
        property: "og:type",
        content: "product"
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const WishlistRoute = Route$8.update({
  id: "/wishlist",
  path: "/wishlist",
  getParentRoute: () => Route$9
});
const ProfileRoute = Route$7.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$9
});
const MagazinesRoute = Route$6.update({
  id: "/magazines",
  path: "/magazines",
  getParentRoute: () => Route$9
});
const LoginRoute = Route$5.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$9
});
const LibraryRoute = Route$4.update({
  id: "/library",
  path: "/library",
  getParentRoute: () => Route$9
});
const DiscoverRoute = Route$3.update({
  id: "/discover",
  path: "/discover",
  getParentRoute: () => Route$9
});
const BulletinRoute = Route$2.update({
  id: "/bulletin",
  path: "/bulletin",
  getParentRoute: () => Route$9
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$9
});
const BookIdRoute = Route.update({
  id: "/book/$id",
  path: "/book/$id",
  getParentRoute: () => Route$9
});
const rootRouteChildren = {
  IndexRoute,
  BulletinRoute,
  DiscoverRoute,
  LibraryRoute,
  LoginRoute,
  MagazinesRoute,
  ProfileRoute,
  WishlistRoute,
  BookIdRoute
};
const routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$6 as R,
  api as a,
  Route$3 as b,
  Route as c,
  router as r
};
