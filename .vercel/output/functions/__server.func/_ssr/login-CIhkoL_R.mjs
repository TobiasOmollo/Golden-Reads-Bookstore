import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { W as Wordmark } from "./Logo-BC9wrmwd.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { E as EyeOff, d as Eye } from "../_libs/lucide-react.mjs";
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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const logoAsset = "/assets/golden-reads-logo-Bb7WIJxk.png";
function LoginPage() {
  const nav = useNavigate();
  const [show, setShow] = reactExports.useState(false);
  const [shake, setShake] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [pw, setPw] = reactExports.useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@") || pw.length < 4) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    nav({
      to: "/"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-foreground flex flex-col", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full mx-auto px-6 pt-16 pb-10 flex-1 flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.4
    }, className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAsset, alt: "", className: "w-16 h-16 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wordmark, { className: "text-[22px] block mt-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif italic text-muted-foreground mt-3", children: "Welcome back to your library." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.form, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0,
      x: shake ? [0, -8, 8, -6, 6, 0] : 0
    }, transition: {
      duration: 0.4,
      delay: 0.1
    }, onSubmit, className: "mt-10 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", type: "email", value: email, onChange: setEmail, autoComplete: "email", invalid: shake && !email.includes("@") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", type: show ? "text" : "password", value: pw, onChange: setPw, autoComplete: "current-password", invalid: shake && pw.length < 4, trailing: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": show ? "Hide password" : "Show password", onClick: () => setShow((v) => !v), className: "text-muted-foreground", children: show ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded accent-[color:var(--color-gold)]" }),
          "Remember me"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-gold font-mono uppercase tracking-wider text-[10px]", children: "Forgot password?" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity", children: "Sign In" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 my-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-divider" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: "or continue with" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-divider" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "py-3 rounded-full bg-white text-black text-sm font-medium border border-divider", children: "Google" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "py-3 rounded-full bg-black text-white text-sm font-medium", children: "Apple" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground mt-6", children: [
        "New here?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-gold font-medium", children: "Register" })
      ] })
    ] })
  ] }) });
}
function Field({
  label,
  type,
  value,
  onChange,
  trailing,
  invalid,
  autoComplete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-1.5 flex items-center gap-2 px-4 py-3 rounded-2xl bg-surface border transition-colors ${invalid ? "border-destructive" : "border-divider focus-within:border-gold"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), autoComplete, className: "flex-1 bg-transparent outline-none text-sm" }),
      trailing
    ] })
  ] });
}
export {
  LoginPage as component
};
