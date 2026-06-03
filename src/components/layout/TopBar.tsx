import { useEffect, useState } from "react";
import { Bell, Moon, Sun, ShoppingBag } from "lucide-react";
import { Wordmark } from "@/components/Logo";
import { useTheme } from "@/store/theme";
import { useCart } from "@/store/cart";

export function TopBar() {
  const { theme, toggle } = useTheme();
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cart.count() : 0;

  return (
    <header
      className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-divider"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center justify-between px-5 h-14 max-w-md mx-auto">
        <Wordmark className="text-[17px]" />
        <div className="flex items-center gap-1">
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
          <button
            type="button"
            aria-label="Notifications"
            className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition-colors"
          >
            <Bell size={18} className="text-foreground" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-gold" />
          </button>
        </div>
      </div>
    </header>
  );
}
