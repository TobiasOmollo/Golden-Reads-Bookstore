import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, BookOpen, Newspaper, Library, Heart, User } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/magazines", label: "Magazines", icon: BookOpen },
  { to: "/bulletin", label: "Bulletin", icon: Newspaper },
  { to: "/library", label: "Library", icon: Library },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-background/90 backdrop-blur-md border-t border-border md:hidden flex justify-around items-center h-16 px-2 pb-safe shadow-lg">
      {navLinks.map((link) => {
        const Icon = link.icon;
        const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              active ? "text-gold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={18} className="transition-transform group-active:scale-95" />
            <span className="text-[9px] font-mono tracking-wider mt-1 uppercase truncate max-w-[64px]">
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
