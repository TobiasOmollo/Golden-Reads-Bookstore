import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/store/theme";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { CartDrawer } from "@/components/CartDrawer";

export function AppShell({
  children,
  showTopBar = true,
  showBottomNav = true,
}: {
  children: ReactNode;
  showTopBar?: boolean;
  showBottomNav?: boolean;
}) {
  const theme = useTheme((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {showTopBar && <TopBar />}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6"
      >
        {children}
      </motion.main>
      <footer className="text-muted-foreground text-xs tracking-wide border-t border-border py-4 mt-auto text-center w-full">
        © 2026 TitanWeb Production. All rights reserved.
      </footer>
      {showBottomNav && <BottomNav />}
      <CartDrawer />
    </div>
  );
}

