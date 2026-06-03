import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Library as LibraryIcon, Heart, User } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/library", label: "Library", icon: LibraryIcon },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur border-t border-divider"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5 max-w-md mx-auto">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active =
            to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="relative">
              <Link
                to={to}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
              >
                <span
                  aria-hidden
                  className={`absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full transition-all ${
                    active ? "bg-gold" : "bg-transparent"
                  }`}
                />
                <Icon
                  size={20}
                  className={active ? "text-gold" : "text-muted-foreground"}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider ${
                    active ? "text-gold" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
