import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
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
const appCss = "/assets/styles-D8OiipLm.css";
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
const Route$8 = createRootRouteWithContext()({
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
  const { queryClient } = Route$8.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$7 = () => import("./wishlist-CYHcH_bY.mjs");
const Route$7 = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{
      title: "Wishlist – Golden Reads"
    }, {
      name: "description",
      content: "Books you've saved for later."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./profile-CjP2uvm9.mjs");
const Route$6 = createFileRoute("/profile")({
  head: () => ({
    meta: [{
      title: "Profile – Golden Reads"
    }, {
      name: "description",
      content: "Manage your Golden Reads account and preferences."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./magazines-CZikPmQf.mjs");
const magazinesSearchSchema = objectType({
  tab: enumType(["bulletin", "eastafrica", "business", "lifestyle", "technology", "archive"]).optional().catch("bulletin"),
  q: stringType().optional().catch("")
});
const Route$5 = createFileRoute("/magazines")({
  validateSearch: (search) => magazinesSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Magazines & News – Golden Reads"
    }, {
      name: "description",
      content: "Stay updated with local news bulletins and regional magazines in East Africa."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./login-CIhkoL_R.mjs");
const Route$4 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign In – Golden Reads"
    }, {
      name: "description",
      content: "Sign in to your Golden Reads account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./library-wMyOH_1K.mjs");
const Route$3 = createFileRoute("/library")({
  head: () => ({
    meta: [{
      title: "My Library – Golden Reads"
    }, {
      name: "description",
      content: "Track your reading progress and revisit completed books."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./discover-DPK_lw26.mjs");
const discoverSearchSchema = objectType({
  q: stringType().optional().catch(""),
  genre: stringType().optional().catch("All")
});
const Route$2 = createFileRoute("/discover")({
  validateSearch: (search) => discoverSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Discover – Golden Reads"
    }, {
      name: "description",
      content: "Browse the full Golden Reads catalogue by genre."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-CMRYoydt.mjs");
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
const booksData = /* @__PURE__ */ JSON.parse('[{"id":"001","title":"The Midnight Library","author":"Matt Haig","cover":"https://picsum.photos/seed/gr001/400/600","rating":4.2,"price":550,"genre":["Fiction","Self-Help"],"description":"The Midnight Library by Matt Haig is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about fiction titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":234,"readingTime":"5h 5m","formats":["epub","audio"]},{"id":"002","title":"Atomic Habits","author":"James Clear","cover":"https://picsum.photos/seed/gr002/400/600","rating":4.2,"price":1200,"genre":["Self-Help","Business"],"description":"Atomic Habits by James Clear is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about self-help titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":529,"readingTime":"11h 18m","formats":["epub"]},{"id":"003","title":"Project Hail Mary","author":"Andy Weir","cover":"https://picsum.photos/seed/gr003/400/600","rating":4.5,"price":1650,"genre":["Science","Fiction"],"description":"Project Hail Mary by Andy Weir is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about science titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":425,"readingTime":"6h 0m","formats":["epub","audio"]},{"id":"004","title":"The Silent Patient","author":"Alex Michaelides","cover":"https://picsum.photos/seed/gr004/400/600","rating":3.9,"price":1400,"genre":["Thriller","Mystery"],"description":"The Silent Patient by Alex Michaelides is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about thriller titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":370,"readingTime":"10h 18m","formats":["epub","audio"]},{"id":"005","title":"Dune","author":"Frank Herbert","cover":"https://picsum.photos/seed/gr005/400/600","rating":4.6,"price":700,"genre":["Fantasy","Fiction"],"description":"Dune by Frank Herbert is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about fantasy titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":547,"readingTime":"10h 5m","formats":["epub","audio"]},{"id":"006","title":"Sapiens","author":"Yuval Noah Harari","cover":"https://picsum.photos/seed/gr006/400/600","rating":4.6,"price":1000,"genre":["Science","Biography"],"description":"Sapiens by Yuval Noah Harari is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about science titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":333,"readingTime":"9h 28m","formats":["epub"]},{"id":"007","title":"The Pragmatic Programmer","author":"Andy Hunt","cover":"https://picsum.photos/seed/gr007/400/600","rating":4.5,"price":1500,"genre":["Technology","Business"],"description":"The Pragmatic Programmer by Andy Hunt is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about technology titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":202,"readingTime":"5h 5m","formats":["epub","audio"]},{"id":"008","title":"Educated","author":"Tara Westover","cover":"https://picsum.photos/seed/gr008/400/600","rating":4.3,"price":1500,"genre":["Biography","Self-Help"],"description":"Educated by Tara Westover is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about biography titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":523,"readingTime":"9h 29m","formats":["epub"]},{"id":"009","title":"Where the Crawdads Sing","author":"Delia Owens","cover":"https://picsum.photos/seed/gr009/400/600","rating":4.4,"price":1700,"genre":["Fiction","Mystery"],"description":"Where the Crawdads Sing by Delia Owens is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about fiction titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":471,"readingTime":"4h 47m","formats":["epub","audio"]},{"id":"010","title":"Becoming","author":"Michelle Obama","cover":"https://picsum.photos/seed/gr010/400/600","rating":4.8,"price":1350,"genre":["Biography"],"description":"Becoming by Michelle Obama is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about biography titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":467,"readingTime":"7h 59m","formats":["epub"]},{"id":"011","title":"The Psychology of Money","author":"Morgan Housel","cover":"https://picsum.photos/seed/gr011/400/600","rating":4.3,"price":650,"genre":["Business","Self-Help"],"description":"The Psychology of Money by Morgan Housel is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about business titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":301,"readingTime":"5h 12m","formats":["epub"]},{"id":"012","title":"Klara and the Sun","author":"Kazuo Ishiguro","cover":"https://picsum.photos/seed/gr012/400/600","rating":3.8,"price":750,"genre":["Fiction","Science"],"description":"Klara and the Sun by Kazuo Ishiguro is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about fiction titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":463,"readingTime":"11h 43m","formats":["epub"]},{"id":"013","title":"The Seven Husbands of Evelyn Hugo","author":"Taylor Jenkins Reid","cover":"https://picsum.photos/seed/gr013/400/600","rating":4.4,"price":450,"genre":["Romance","Fiction"],"description":"The Seven Husbands of Evelyn Hugo by Taylor Jenkins Reid is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about romance titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":505,"readingTime":"6h 57m","formats":["epub"]},{"id":"014","title":"Clean Code","author":"Robert C. Martin","cover":"https://picsum.photos/seed/gr014/400/600","rating":4.1,"price":750,"genre":["Technology"],"description":"Clean Code by Robert C. Martin is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about technology titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":370,"readingTime":"10h 52m","formats":["epub"]},{"id":"015","title":"The Thursday Murder Club","author":"Richard Osman","cover":"https://picsum.photos/seed/gr015/400/600","rating":4.1,"price":1750,"genre":["Mystery","Fiction"],"description":"The Thursday Murder Club by Richard Osman is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about mystery titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":513,"readingTime":"8h 55m","formats":["epub"]},{"id":"016","title":"Thinking, Fast and Slow","author":"Daniel Kahneman","cover":"https://picsum.photos/seed/gr016/400/600","rating":3.9,"price":950,"genre":["Science","Business"],"description":"Thinking, Fast and Slow by Daniel Kahneman is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about science titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":548,"readingTime":"5h 38m","formats":["epub","audio"]},{"id":"017","title":"The Song of Achilles","author":"Madeline Miller","cover":"https://picsum.photos/seed/gr017/400/600","rating":4.4,"price":1500,"genre":["Romance","Fantasy"],"description":"The Song of Achilles by Madeline Miller is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about romance titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":359,"readingTime":"10h 1m","formats":["epub"]},{"id":"018","title":"Designing Data-Intensive Applications","author":"Martin Kleppmann","cover":"https://picsum.photos/seed/gr018/400/600","rating":4.8,"price":1450,"genre":["Technology"],"description":"Designing Data-Intensive Applications by Martin Kleppmann is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about technology titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":232,"readingTime":"5h 30m","formats":["epub"]},{"id":"019","title":"The Da Vinci Code","author":"Dan Brown","cover":"https://picsum.photos/seed/gr019/400/600","rating":3.9,"price":1350,"genre":["Thriller","Mystery"],"description":"The Da Vinci Code by Dan Brown is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about thriller titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":271,"readingTime":"8h 11m","formats":["epub"]},{"id":"020","title":"Verity","author":"Colleen Hoover","cover":"https://picsum.photos/seed/gr020/400/600","rating":4.9,"price":400,"genre":["Thriller","Romance"],"description":"Verity by Colleen Hoover is a captivating work that explores profound themes through unforgettable characters. Praised by critics and readers alike, it has earned a place among the most talked-about thriller titles of the decade. Immerse yourself in a story that lingers long after the final page.","pages":220,"readingTime":"4h 25m","formats":["epub","audio"]}]');
const books = booksData;
const $$splitComponentImporter = () => import("./book._id--hVHYosa.mjs");
const Route = createFileRoute("/book/$id")({
  head: ({
    params
  }) => {
    const book = books.find((b) => b.id === params.id);
    return {
      meta: [{
        title: book ? `${book.title} – Golden Reads` : "Book – Golden Reads"
      }, {
        name: "description",
        content: book ? book.description.slice(0, 155) : "Book details on Golden Reads."
      }, {
        property: "og:title",
        content: book?.title ?? "Golden Reads"
      }, {
        property: "og:description",
        content: book?.description.slice(0, 155) ?? ""
      }, ...book ? [{
        property: "og:image",
        content: book.cover
      }] : [], {
        property: "og:type",
        content: "product"
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const WishlistRoute = Route$7.update({
  id: "/wishlist",
  path: "/wishlist",
  getParentRoute: () => Route$8
});
const ProfileRoute = Route$6.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$8
});
const MagazinesRoute = Route$5.update({
  id: "/magazines",
  path: "/magazines",
  getParentRoute: () => Route$8
});
const LoginRoute = Route$4.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$8
});
const LibraryRoute = Route$3.update({
  id: "/library",
  path: "/library",
  getParentRoute: () => Route$8
});
const DiscoverRoute = Route$2.update({
  id: "/discover",
  path: "/discover",
  getParentRoute: () => Route$8
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$8
});
const BookIdRoute = Route.update({
  id: "/book/$id",
  path: "/book/$id",
  getParentRoute: () => Route$8
});
const rootRouteChildren = {
  IndexRoute,
  DiscoverRoute,
  LibraryRoute,
  LoginRoute,
  MagazinesRoute,
  ProfileRoute,
  WishlistRoute,
  BookIdRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
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
  Route$5 as R,
  Route$2 as a,
  booksData as b,
  Route as c,
  books as d,
  router as r
};
