import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Check } from "lucide-react";
import { api } from "@/lib/api/client";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UpgradeModal({ isOpen, onClose, onSuccess }: UpgradeModalProps) {
  const [loading, setLoading] = React.useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await api.auth.upgrade();
      if (res.user) {
        sessionStorage.setItem("user", JSON.stringify(res.user));
      }
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to upgrade. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-surface p-6 shadow-2xl border border-divider text-center"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>

            {/* Glowing Icon */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Sparkles size={24} />
            </div>

            {/* Typography */}
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Upgrade to Premium
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Premium coming soon! Unlock the ultimate reading experience.
            </p>

            {/* Features check list */}
            <div className="my-6 space-y-3 text-left text-xs text-foreground/80 px-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 text-gold shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Unlimited Ebooks (6/mo limit removed)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 text-gold shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Unlimited High-Fidelity Audiobooks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 text-gold shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Advanced AI-Powered Summaries & Notes</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-gold-foreground shadow-lg hover:bg-gold/90 transition-colors disabled:opacity-50 font-mono tracking-wider uppercase"
              >
                {loading ? "Upgrading..." : "Quick Upgrade (Free Test)"}
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-xl border border-divider py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
