import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useTheme, A as AppShell } from "./AppShell-D1r7d6o9.mjs";
import { a as Settings, B as Bell, A as Award, b as Shield, D as Download, L as LogOut, C as ChevronRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/zustand.mjs";
import "./utils-CI2FuZjX.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function ProfilePage() {
  const {
    theme,
    toggle
  } = useTheme();
  const [user, setUser] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const activeSession = localStorage.getItem("golden_reads_user");
    if (activeSession) {
      try {
        setUser(JSON.parse(activeSession));
      } catch (e) {
        console.error("Failed to parse user session, resetting", e);
        setUser({
          name: "Guest Reader",
          email: "guest@goldenreads.com"
        });
      }
    } else {
      setUser({
        name: "Guest Reader",
        email: "guest@goldenreads.com"
      });
    }
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Profile" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-5 mt-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5 shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80", alt: "", className: "w-16 h-16 rounded-full object-cover ring-2 ring-gold/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold", children: user?.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary-foreground/70", children: user?.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Goal", value: `${user?.readingGoal || 12}/yr` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Read", value: "14" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Streak", value: "12d" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2", children: "Appearance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-surface border border-divider divide-y divide-divider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16 }), label: "Theme", trailing: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "switch", "aria-checked": theme === "dark", onClick: toggle, className: `w-12 h-7 rounded-full p-0.5 transition-colors ${theme === "dark" ? "bg-gold" : "bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `block w-6 h-6 rounded-full bg-white shadow transition-transform ${theme === "dark" ? "translate-x-5" : ""}` }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 16 }), label: "Notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 16 }), label: "Achievements" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2", children: "Account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-surface border border-divider divide-y divide-divider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 16 }), label: "Security" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }), label: "Export my data" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 }), label: "Sign out", destructive: true, href: "/login", onClick: () => {
          localStorage.removeItem("golden_reads_user");
          localStorage.removeItem("golden_reads_token");
        } })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center font-mono text-[10px] text-muted-foreground mt-10 mb-4", children: "GOLDEN READS · v1.0" })
  ] });
}
function Mini({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-semibold", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-wider text-primary-foreground/70", children: label })
  ] });
}
function Row({
  icon,
  label,
  trailing,
  destructive,
  href,
  onClick
}) {
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: destructive ? "text-destructive" : "text-muted-foreground", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex-1 text-sm ${destructive ? "text-destructive" : ""}`, children: label }),
    trailing ?? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-muted-foreground" })
  ] });
  if (href) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: href, onClick, children: inner });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick, className: "w-full text-left", children: inner });
}
export {
  ProfilePage as component
};
