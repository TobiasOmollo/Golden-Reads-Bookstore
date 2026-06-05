import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
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
const appCss = "/assets/styles-DPB2cs6h.css";
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
const $$splitComponentImporter$8 = () => import("./wishlist-DmJO2zLT.mjs");
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
const $$splitComponentImporter$7 = () => import("./profile-RRPp6yCS.mjs");
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
const $$splitComponentImporter$6 = () => import("./magazines-DEjODZev.mjs");
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
const $$splitComponentImporter$5 = () => import("./login-3Z2q6ggM.mjs");
const Route$5 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign In – Golden Reads"
    }, {
      name: "description",
      content: "Sign in to your Golden Reads account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./library-B4Punuov.mjs");
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
const $$splitComponentImporter$3 = () => import("./discover-CY7BqK1t.mjs");
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
const $$splitComponentImporter$2 = () => import("./bulletin-Bil8qvVL.mjs");
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
const $$splitComponentImporter$1 = () => import("./index-CVeNWixz.mjs");
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
const booksData = [
  {
    id: "g1342",
    gutendexId: 1342,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://covers.openlibrary.org/b/olid/OL1342W-L.jpg",
    rating: 4.8,
    price: 550,
    genre: [
      "Fiction",
      "Romance"
    ],
    description: "Austen's classic romantic novel focusing on Elizabeth Bennet.",
    pages: 352,
    readingTime: "5h 5m",
    formats: [
      "epub",
      "audio"
    ]
  },
  {
    id: "g11",
    gutendexId: 11,
    title: "Alice in Wonderland",
    author: "Lewis Carroll",
    cover: "https://covers.openlibrary.org/b/olid/OL11W-L.jpg",
    rating: 4.5,
    price: 1200,
    genre: [
      "Fantasy",
      "Fiction"
    ],
    description: "Carroll's famous fantasy story of Alice following the White Rabbit.",
    pages: 192,
    readingTime: "11h 18m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g84",
    gutendexId: 84,
    title: "Frankenstein",
    author: "Mary Shelley",
    cover: "https://covers.openlibrary.org/b/olid/OL84W-L.jpg",
    rating: 4.3,
    price: 1650,
    genre: [
      "Fiction",
      "Science"
    ],
    description: "Mary Shelley's classic tale of creation and horror.",
    pages: 280,
    readingTime: "6h 0m",
    formats: [
      "epub",
      "audio"
    ]
  },
  {
    id: "g1080",
    gutendexId: 1080,
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
    cover: "https://covers.openlibrary.org/b/olid/OL1080W-L.jpg",
    rating: 4.2,
    price: 1400,
    genre: [
      "Thriller",
      "Mystery"
    ],
    description: "A story set in London and Paris before and during the French Revolution.",
    pages: 370,
    readingTime: "10h 18m",
    formats: [
      "epub",
      "audio"
    ]
  },
  {
    id: "g98",
    gutendexId: 98,
    title: "A Christmas Carol",
    author: "Charles Dickens",
    cover: "https://covers.openlibrary.org/b/olid/OL98W-L.jpg",
    rating: 4.6,
    price: 700,
    genre: [
      "Fantasy",
      "Fiction"
    ],
    description: "The timeless story of Ebenezer Scrooge's redemption on Christmas Eve.",
    pages: 156,
    readingTime: "10h 5m",
    formats: [
      "epub",
      "audio"
    ]
  },
  {
    id: "g174",
    gutendexId: 174,
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    cover: "https://covers.openlibrary.org/b/olid/OL174W-L.jpg",
    rating: 4.4,
    price: 1e3,
    genre: [
      "Science",
      "Biography"
    ],
    description: "The philosophical tale of a man whose portrait ages instead of him.",
    pages: 254,
    readingTime: "9h 28m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g2701",
    gutendexId: 2701,
    title: "Moby Dick",
    author: "Herman Melville",
    cover: "https://covers.openlibrary.org/b/olid/OL2701W-L.jpg",
    rating: 4.1,
    price: 1500,
    genre: [
      "Technology",
      "Business"
    ],
    description: "Melville's epic hunt for the legendary white whale.",
    pages: 585,
    readingTime: "5h 5m",
    formats: [
      "epub",
      "audio"
    ]
  },
  {
    id: "g76",
    gutendexId: 76,
    title: "The Adventures of Tom Sawyer",
    author: "Mark Twain",
    cover: "https://covers.openlibrary.org/b/olid/OL76W-L.jpg",
    rating: 4.5,
    price: 1500,
    genre: [
      "Biography",
      "Self-Help"
    ],
    description: "Twain's beloved novel of childhood adventure along the Mississippi.",
    pages: 240,
    readingTime: "9h 29m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g1661",
    gutendexId: 1661,
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    cover: "https://covers.openlibrary.org/b/olid/OL1661W-L.jpg",
    rating: 4.7,
    price: 1700,
    genre: [
      "Fiction",
      "Mystery"
    ],
    description: "Doyle's classic collection of mystery investigations.",
    pages: 312,
    readingTime: "4h 47m",
    formats: [
      "epub",
      "audio"
    ]
  },
  {
    id: "g844",
    gutendexId: 844,
    title: "The Importance of Being Earnest",
    author: "Oscar Wilde",
    cover: "https://covers.openlibrary.org/b/olid/OL844W-L.jpg",
    rating: 4.6,
    price: 1350,
    genre: [
      "Biography"
    ],
    description: "Wilde's famous comedy of manners and identity mix-ups.",
    pages: 120,
    readingTime: "7h 59m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g2542",
    gutendexId: 2542,
    title: "A Doll's House",
    author: "Henrik Ibsen",
    cover: "https://covers.openlibrary.org/b/olid/OL2542W-L.jpg",
    rating: 4.2,
    price: 650,
    genre: [
      "Business",
      "Self-Help"
    ],
    description: "Ibsen's landmark drama about marriage and self-discovery.",
    pages: 140,
    readingTime: "5h 12m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g5200",
    gutendexId: 5200,
    title: "Metamorphosis",
    author: "Franz Kafka",
    cover: "https://covers.openlibrary.org/b/olid/OL5200W-L.jpg",
    rating: 4.3,
    price: 750,
    genre: [
      "Fiction",
      "Science"
    ],
    description: "Kafka's masterpiece of surrealism and existential dread.",
    pages: 100,
    readingTime: "11h 43m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g4300",
    gutendexId: 4300,
    title: "Ulysses",
    author: "James Joyce",
    cover: "https://covers.openlibrary.org/b/olid/OL4300W-L.jpg",
    rating: 3.9,
    price: 450,
    genre: [
      "Romance",
      "Fiction"
    ],
    description: "Joyce's complex exploration of Leopold Bloom's day in Dublin.",
    pages: 732,
    readingTime: "6h 57m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g16",
    gutendexId: 16,
    title: "Peter Pan",
    author: "J.M. Barrie",
    cover: "https://covers.openlibrary.org/b/olid/OL16W-L.jpg",
    rating: 4.5,
    price: 750,
    genre: [
      "Technology"
    ],
    description: "Barrie's classic adventure of the boy who wouldn't grow up.",
    pages: 180,
    readingTime: "10h 52m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g1952",
    gutendexId: 1952,
    title: "The Yellow Wallpaper",
    author: "Charlotte Perkins Gilman",
    cover: "https://covers.openlibrary.org/b/olid/OL1952W-L.jpg",
    rating: 4.4,
    price: 1750,
    genre: [
      "Mystery",
      "Fiction"
    ],
    description: "Gilman's haunting story of mental health and isolation.",
    pages: 80,
    readingTime: "8h 55m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g514",
    gutendexId: 514,
    title: "Little Women",
    author: "Louisa May Alcott",
    cover: "https://covers.openlibrary.org/b/olid/OL514W-L.jpg",
    rating: 4.7,
    price: 950,
    genre: [
      "Science",
      "Business"
    ],
    description: "Alcott's beloved story of the March sisters growing up.",
    pages: 480,
    readingTime: "5h 38m",
    formats: [
      "epub",
      "audio"
    ]
  },
  {
    id: "g1400",
    gutendexId: 1400,
    title: "Great Expectations",
    author: "Charles Dickens",
    cover: "https://covers.openlibrary.org/b/olid/OL1400W-L.jpg",
    rating: 4.5,
    price: 1500,
    genre: [
      "Romance",
      "Fantasy"
    ],
    description: "The growth and personal development of Pip, an orphan.",
    pages: 505,
    readingTime: "10h 1m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g2591",
    gutendexId: 2591,
    title: "Grimms' Fairy Tales",
    author: "Jacob Grimm and Wilhelm Grimm",
    cover: "https://covers.openlibrary.org/b/olid/OL2591W-L.jpg",
    rating: 4.6,
    price: 1450,
    genre: [
      "Technology"
    ],
    description: "The classic collection of German folk stories.",
    pages: 320,
    readingTime: "5h 30m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g345",
    gutendexId: 345,
    title: "Dracula",
    author: "Bram Stoker",
    cover: "https://covers.openlibrary.org/b/olid/OL345W-L.jpg",
    rating: 4.6,
    price: 1350,
    genre: [
      "Thriller",
      "Mystery"
    ],
    description: "Stoker's gothic horror masterpiece introducing Count Dracula.",
    pages: 416,
    readingTime: "8h 11m",
    formats: [
      "epub"
    ]
  },
  {
    id: "g43",
    gutendexId: 43,
    title: "The Strange Case of Dr. Jekyll and Mr. Hyde",
    author: "Robert Louis Stevenson",
    cover: "https://covers.openlibrary.org/b/olid/OL43W-L.jpg",
    rating: 4.4,
    price: 400,
    genre: [
      "Thriller",
      "Romance"
    ],
    description: "Stevenson's classic psychological tale of dual personalities.",
    pages: 120,
    readingTime: "4h 25m",
    formats: [
      "epub",
      "audio"
    ]
  }
];
const books = booksData;
const $$splitComponentImporter = () => import("./book._id-DcwHPVXz.mjs");
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
  Route$3 as a,
  booksData as b,
  Route as c,
  books as d,
  router as r
};
