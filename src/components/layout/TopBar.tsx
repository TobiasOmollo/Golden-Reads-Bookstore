import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, Moon, Sun, ShoppingBag, Menu, X, Search } from "lucide-react";
import { Wordmark } from "@/components/Logo";
import { useTheme } from "@/store/theme";
import { useCart } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/magazines", label: "Magazines" },
  { to: "/bulletin", label: "News Bulletin" },
  { to: "/library", label: "Library" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/profile", label: "Profile" },
] as const;

export function TopBar() {
  const { theme, toggle } = useTheme();
  const cart = useCart();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => setMounted(true), []);
  const count = mounted ? cart.count() : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        to: "/discover",
        search: { q: searchQuery.trim(), genre: "All" },
      });
      setShowSearch(false);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-divider w-full"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between h-16">
        {/* Left section: Logo & Desktop Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center animate-fade-in" aria-label="Go home">
            <Wordmark className="text-[19px]" />
          </Link>
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex overflow-x-auto whitespace-nowrap scrollbar-hide gap-4 px-4 items-center">
            {navLinks.map((link) => {
              const active =
                link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-mono text-xs uppercase tracking-wider relative py-1 transition-colors shrink-0 ${
                    active ? "text-gold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right section: Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Global Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center max-w-[200px] lg:max-w-xs w-full">
            <Search size={14} className="absolute left-3.5 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-muted text-xs placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-gold transition-shadow focus:shadow-soft"
            />
          </form>

          {/* Mobile Search Toggle */}
          <button
            type="button"
            aria-label="Toggle search"
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition-colors"
          >
            <Search size={18} className="text-foreground" />
          </button>

          {/* Cart */}
          <button
            type="button"
            aria-label="Open cart"
            onClick={cart.open}
            className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition-colors"
          >
            <ShoppingBag size={18} className="text-foreground" />
            {count > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-gold text-gold-foreground font-mono text-[10px] font-bold">
                {count}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggle}
            className="w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition-colors"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-gold" />
            ) : (
              <Moon size={18} className="text-foreground" />
            )}
          </button>

          {/* Notification bell */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition-colors"
          >
            <Bell size={18} className="text-foreground" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-gold animate-pulse" />
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            type="button"
            aria-label="Toggle mobile menu"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Search input */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-divider bg-background overflow-hidden"
          >
            <form onSubmit={handleSearchSubmit} className="p-4 relative">
              <Search size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles or authors..."
                className="w-full pl-11 pr-4 py-2.5 rounded-md bg-muted text-sm placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-gold"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile navigation panel dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-divider bg-background overflow-hidden"
          >
            <nav className="px-5 py-6 flex flex-col gap-4">
              {navLinks.map((link) => {
                const active =
                  link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`font-mono text-sm uppercase tracking-wider transition-colors ${
                      active ? "text-gold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
