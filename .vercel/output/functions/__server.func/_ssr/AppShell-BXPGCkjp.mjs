import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as create, p as persist } from "../_libs/zustand.mjs";
import { e as useLocation, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { W as Wordmark } from "./Logo-BC9wrmwd.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { d as Search, j as ShoppingBag, k as Sun, M as Moon, B as Bell, X, l as Menu, m as House, n as Compass, h as BookOpen, N as Newspaper, o as Library, H as Heart, U as User, p as Minus, P as Plus, T as Trash2 } from "../_libs/lucide-react.mjs";
const useTheme = create()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },
      toggle: () => set((s) => {
        const next = s.theme === "dark" ? "light" : "dark";
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next === "dark");
        }
        return { theme: next };
      })
    }),
    {
      name: "gr-theme",
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", state.theme === "dark");
        }
      }
    }
  )
);
const useCart = create()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (book) => set((s) => {
        const existing = s.items.find((i) => i.book.id === book.id);
        if (existing) {
          return {
            items: s.items.map(
              (i) => i.book.id === book.id ? { ...i, qty: i.qty + 1 } : i
            )
          };
        }
        return { items: [...s.items, { book, qty: 1 }] };
      }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.book.id !== id) })),
      setQty: (id, qty) => set((s) => ({
        items: qty <= 0 ? s.items.filter((i) => i.book.id !== id) : s.items.map((i) => i.book.id === id ? { ...i, qty } : i)
      })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.qty * i.book.price, 0)
    }),
    { name: "gr-cart" }
  )
);
const navLinks$1 = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/magazines", label: "Magazines" },
  { to: "/bulletin", label: "News Bulletin" },
  { to: "/library", label: "Library" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/profile", label: "Profile" }
];
function TopBar() {
  const { theme, toggle } = useTheme();
  const cart = useCart();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = reactExports.useState(false);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [showSearch, setShowSearch] = reactExports.useState(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  reactExports.useEffect(() => setMounted(true), []);
  const count = mounted ? cart.count() : 0;
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        to: "/discover",
        search: { q: searchQuery.trim(), genre: "All" }
      });
      setShowSearch(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "header",
    {
      className: "sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-divider w-full",
      style: { paddingTop: "env(safe-area-inset-top)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between h-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center animate-fade-in", "aria-label": "Go home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wordmark, { className: "text-[19px]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden md:flex items-center gap-6", children: navLinks$1.map((link) => {
              const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: link.to,
                  className: `font-mono text-xs uppercase tracking-wider relative py-1 transition-colors ${active ? "text-gold" : "text-muted-foreground hover:text-foreground"}`,
                  children: [
                    link.label,
                    active && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.span,
                      {
                        layoutId: "activeNavLine",
                        className: "absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full",
                        transition: { type: "spring", stiffness: 380, damping: 30 }
                      }
                    )
                  ]
                },
                link.to
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearchSubmit, className: "hidden md:flex relative items-center max-w-[200px] lg:max-w-xs w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, className: "absolute left-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "search",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  placeholder: "Search library...",
                  className: "w-full pl-9 pr-4 py-1.5 rounded-full bg-muted text-xs placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-gold transition-shadow focus:shadow-soft"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Toggle search",
                onClick: () => setShowSearch(!showSearch),
                className: "md:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18, className: "text-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "aria-label": "Open cart",
                onClick: cart.open,
                className: "relative w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 18, className: "text-foreground" }),
                  count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-gold text-gold-foreground font-mono text-[10px] font-bold", children: count })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Toggle theme",
                onClick: toggle,
                className: "w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition-colors",
                children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 18, className: "text-gold" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 18, className: "text-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "aria-label": "Notifications",
                className: "relative w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 18, className: "text-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-gold animate-pulse" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Toggle mobile menu",
                onClick: () => setIsOpen(!isOpen),
                className: "md:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition-colors",
                children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 20 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showSearch && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            className: "md:hidden border-t border-divider bg-background overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearchSubmit, className: "p-4 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "search",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  placeholder: "Search titles or authors...",
                  className: "w-full pl-11 pr-4 py-2.5 rounded-md bg-muted text-sm placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-gold"
                }
              )
            ] })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            className: "md:hidden border-t border-divider bg-background overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "px-5 py-6 flex flex-col gap-4", children: navLinks$1.map((link) => {
              const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: link.to,
                  onClick: () => setIsOpen(false),
                  className: `font-mono text-sm uppercase tracking-wider transition-colors ${active ? "text-gold" : "text-muted-foreground hover:text-foreground"}`,
                  children: link.label
                },
                link.to
              );
            }) })
          }
        ) })
      ]
    }
  );
}
const navLinks = [
  { to: "/", label: "Home", icon: House },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/magazines", label: "Magazines", icon: BookOpen },
  { to: "/bulletin", label: "Bulletin", icon: Newspaper },
  { to: "/library", label: "Library", icon: Library },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/profile", label: "Profile", icon: User }
];
function BottomNav() {
  const { pathname } = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 inset-x-0 z-40 bg-background/90 backdrop-blur-md border-t border-border md:hidden flex justify-around items-center h-16 px-2 pb-safe shadow-lg", children: navLinks.map((link) => {
    const Icon = link.icon;
    const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: link.to,
        className: `flex flex-col items-center justify-center flex-1 py-1 transition-colors ${active ? "text-gold" : "text-muted-foreground hover:text-foreground"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18, className: "transition-transform group-active:scale-95" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono tracking-wider mt-1 uppercase truncate max-w-[64px]", children: link.label })
        ]
      },
      link.to
    );
  }) });
}
function formatKES(n) {
  return `KES ${n.toLocaleString("en-KE")}`;
}
function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal } = useCart();
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => setMounted(true), []);
  reactExports.useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  if (!mounted) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
        onClick: close,
        className: "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
        "aria-hidden": true
      },
      "backdrop"
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.aside,
      {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.35 },
        className: "fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-surface shadow-2xl flex flex-col",
        role: "dialog",
        "aria-label": "Shopping cart",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-5 h-14 border-b border-divider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-semibold", children: "Your Cart" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                "aria-label": "Close cart",
                onClick: close,
                className: "w-9 h-9 grid place-items-center rounded-full hover:bg-muted",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-5 py-4", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center py-20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted grid place-items-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 24, className: "text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg", children: "Your cart is empty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Add a book to get started." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4", children: items.map(({ book, qty }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: book.cover,
                alt: "",
                className: "w-14 h-20 object-cover rounded-lg bg-muted shrink-0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm line-clamp-1", children: book.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: book.author }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs mt-1 text-gold font-bold", children: formatKES(book.price) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    "aria-label": "Decrease quantity",
                    onClick: () => setQty(book.id, qty - 1),
                    className: "w-7 h-7 grid place-items-center rounded-full border border-divider",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 12 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs w-5 text-center", children: qty }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    "aria-label": "Increase quantity",
                    onClick: () => setQty(book.id, qty + 1),
                    className: "w-7 h-7 grid place-items-center rounded-full border border-divider",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    "aria-label": `Remove ${book.title}`,
                    onClick: () => remove(book.id),
                    className: "ml-auto w-7 h-7 grid place-items-center rounded-full text-muted-foreground hover:text-destructive",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                  }
                )
              ] })
            ] })
          ] }, book.id)) }) }),
          items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "footer",
            {
              className: "border-t border-divider px-5 py-4 space-y-3",
              style: { paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs uppercase tracking-wider text-muted-foreground", children: "Subtotal" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-semibold text-gold", children: formatKES(subtotal()) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/",
                    onClick: close,
                    className: "block w-full text-center py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity",
                    children: "Proceed to Checkout"
                  }
                )
              ]
            }
          )
        ]
      },
      "drawer"
    )
  ] }) });
}
function AppShell({
  children,
  showTopBar = true,
  showBottomNav = true
}) {
  const theme = useTheme((s) => s.theme);
  reactExports.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col", children: [
    showTopBar && /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.main,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: "easeOut" },
        className: "flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6",
        children
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "text-muted-foreground text-xs tracking-wide border-t border-border py-4 mt-auto text-center w-full", children: "© 2026 TitanWeb Production. All rights reserved." }),
    showBottomNav && /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartDrawer, {})
  ] });
}
export {
  AppShell as A,
  useTheme as a,
  formatKES as f,
  useCart as u
};
