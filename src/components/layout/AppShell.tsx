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
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-md mx-auto relative">
        {showTopBar && <TopBar />}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pb-24"
        >
          {children}
        </motion.main>
        {showBottomNav && <BottomNav />}
        <CartDrawer />
      </div>
    </div>
  );
}
