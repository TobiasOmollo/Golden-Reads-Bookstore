import { r as reactExports, j as jsxRuntimeExports, R as React__default } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { W as Wordmark, c as cn } from "./utils-CI2FuZjX.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { a as api } from "./router-DmvNeyCF.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { c as CircleAlert, d as CircleCheck, E as EyeOff, e as Eye, f as LoaderCircle, C as ChevronRight, g as Bookmark, h as Sparkles } from "../_libs/lucide-react.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const logoAsset = "/assets/golden-reads-logo-Bb7WIJxk.png";
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = reactExports.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, role: "alert", className: cn(alertVariants({ variant }), className), ...props }));
Alert.displayName = "Alert";
const AlertTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "h5",
    {
      ref,
      className: cn("mb-1 font-medium leading-none tracking-tight", className),
      ...props
    }
  )
);
AlertTitle.displayName = "AlertTitle";
const AlertDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm [&_p]:leading-relaxed", className), ...props }));
AlertDescription.displayName = "AlertDescription";
const QUOTES = [{
  text: "A room without books is like a body without a soul.",
  author: "Marcus Tullius Cicero"
}, {
  text: "Books are a uniquely portable magic.",
  author: "Stephen King"
}, {
  text: "I have always imagined that Paradise will be a kind of library.",
  author: "Jorge Luis Borges"
}, {
  text: "Reading is escape, and the opposite of escape; it's a way to make contact with reality.",
  author: "Nora Ephron"
}, {
  text: "The reading of all good books is like a conversation with the finest minds of past centuries.",
  author: "René Descartes"
}];
const GENRES = ["Fiction", "Thriller", "Biography", "Technology", "Romance", "Mystery", "Fantasy", "Business", "Self-Help", "History"];
const FloatingLabelInput = React__default.forwardRef(({
  label,
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  trailing,
  invalid,
  ...props
}, ref) => {
  const [focused, setFocused] = reactExports.useState(false);
  const hasValue = value !== void 0 && value !== null && String(value).length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 px-4 pt-5 pb-1.5 rounded-2xl bg-surface border transition-all duration-200 ${invalid ? "border-destructive focus-within:ring-1 focus-within:ring-destructive" : focused ? "border-gold ring-1 ring-gold shadow-soft" : "border-divider hover:border-muted-foreground/30"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange, ref, onFocus: (e) => {
        setFocused(true);
        onFocus?.(e);
      }, onBlur: (e) => {
        setFocused(false);
        onBlur?.(e);
      }, className: `peer w-full bg-transparent outline-none text-sm pt-1 pb-0.5 text-foreground placeholder-transparent focus:outline-none focus:ring-0 ${className}`, placeholder: label, ...props }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: `absolute left-0 top-0.5 font-mono text-muted-foreground transition-all duration-200 pointer-events-none origin-[0_0] select-none
                ${focused || hasValue ? "text-[9px] uppercase tracking-wider -translate-y-2.5 text-gold font-semibold" : "text-xs translate-y-0.5"}`, children: label })
    ] }),
    trailing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center pl-1", children: trailing })
  ] }) });
});
FloatingLabelInput.displayName = "FloatingLabelInput";
function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = reactExports.useState("signin");
  const [direction, setDirection] = reactExports.useState(1);
  const [loading, setLoading] = reactExports.useState(false);
  const [errorMsg, setErrorMsg] = reactExports.useState("");
  const [successMsg, setSuccessMsg] = reactExports.useState("");
  const [shake, setShake] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [fullName, setFullName] = reactExports.useState("");
  const [readingGoal, setReadingGoal] = reactExports.useState(12);
  const [selectedGenres, setSelectedGenres] = reactExports.useState([]);
  const [selectedFormats, setSelectedFormats] = reactExports.useState(["epub"]);
  const [quoteIdx, setQuoteIdx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const session = localStorage.getItem("golden_reads_user");
    if (session) {
      navigate({
        to: "/"
      });
    }
  }, [navigate]);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
    }, 6e3);
    return () => clearInterval(interval);
  }, []);
  const handleToggleMode = () => {
    setDirection(mode === "signin" ? 1 : -1);
    setMode(mode === "signin" ? "signup" : "signin");
    setErrorMsg("");
    setSuccessMsg("");
  };
  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]);
  };
  const handleFormatToggle = (format) => {
    setSelectedFormats((prev) => prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]);
  };
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      triggerShake();
      return;
    }
    if (password.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      triggerShake();
      return;
    }
    setLoading(true);
    try {
      const response = await api.auth.login(email, password);
      setSuccessMsg("Welcome back! Loading your bookshelf...");
      localStorage.setItem("golden_reads_token", response.access_token);
      localStorage.setItem("golden_reads_user", JSON.stringify(response.user));
      setTimeout(() => {
        navigate({
          to: "/"
        });
      }, 1200);
    } catch (err) {
      console.error("Login failed", err);
      setErrorMsg("Invalid email or password.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!fullName.trim()) {
      setErrorMsg("Your name is required.");
      triggerShake();
      return;
    }
    if (!email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      triggerShake();
      return;
    }
    if (password.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      triggerShake();
      return;
    }
    setLoading(true);
    const profileDetails = {
      name: fullName.trim(),
      readingGoal,
      genres: selectedGenres,
      preferredFormats: selectedFormats
    };
    try {
      const response = await api.auth.signup(email, password, profileDetails);
      setSuccessMsg("Account created successfully! Preparing your library...");
      localStorage.setItem("golden_reads_token", response.access_token);
      localStorage.setItem("golden_reads_user", JSON.stringify(response.user));
      setTimeout(() => {
        navigate({
          to: "/"
        });
      }, 1500);
    } catch (err) {
      console.error("Signup failed", err);
      if (err.message?.includes("400")) {
        setErrorMsg("A user with this email address already exists.");
      } else {
        setErrorMsg("Failed to connect to the backend server. Please try again.");
      }
      triggerShake();
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleAuth = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const mockOAuthToken = email.includes("@") ? email : "google_reader@gmail.com";
      const response = await api.auth.google(mockOAuthToken);
      setSuccessMsg("Google sign-in verified! Redirecting...");
      localStorage.setItem("golden_reads_token", response.access_token);
      localStorage.setItem("golden_reads_user", JSON.stringify(response.user));
      setTimeout(() => {
        navigate({
          to: "/"
        });
      }, 1200);
    } catch (err) {
      console.error("Google authentication failed", err);
      setErrorMsg("Google OAuth verify stub returned an error.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen w-full flex bg-background text-foreground select-none font-body overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex md:w-1/2 lg:w-3/5 bg-primary relative flex-col justify-between p-12 overflow-hidden border-r border-border/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, -10, 0]
        }, transition: {
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }, className: "absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gold/10 blur-[80px]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
          scale: [1, 1.15, 1],
          x: [0, -30, 0],
          y: [0, 20, 0]
        }, transition: {
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }, className: "absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-accent/10 blur-[100px]" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col justify-between h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAsset, alt: "Golden Reads", className: "w-10 h-10 object-contain ring-2 ring-gold/40 rounded-lg p-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wordmark, { className: "text-xl text-primary-foreground font-display" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-md my-auto pl-6 border-l-2 border-gold/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 15
        }, animate: {
          opacity: 1,
          y: 0
        }, exit: {
          opacity: 0,
          y: -15
        }, transition: {
          duration: 0.6
        }, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display italic text-2xl lg:text-3xl text-primary-foreground/90 leading-relaxed", children: [
            '"',
            QUOTES[quoteIdx].text,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-px bg-gold/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-wider text-gold", children: QUOTES[quoteIdx].author })
          ] })
        ] }, quoteIdx) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] font-mono tracking-wider text-primary-foreground/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GOLDEN READS BOOKSTORE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "EST. 2026" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center px-6 sm:px-12 py-10 relative bg-surface border-l border-divider overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden flex items-center justify-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAsset, alt: "", className: "w-8 h-8 object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wordmark, { className: "text-lg" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold font-display tracking-tight text-foreground", children: mode === "signin" ? "Sign in to account" : "Create a Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: mode === "signin" ? "Enter your credentials to manage your digital bookshelf." : "Fill in your details to set up your customized library." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
        errorMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0,
          height: 0
        }, animate: {
          opacity: 1,
          height: "auto"
        }, exit: {
          opacity: 0,
          height: 0
        }, className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "flex items-start gap-2 py-3 rounded-2xl bg-destructive/10 border-destructive/20 text-destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 16, className: "mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { className: "font-mono text-[10px] uppercase tracking-wider font-semibold", children: "Validation Error" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-xs", children: errorMsg })
          ] })
        ] }) }),
        successMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0,
          height: 0
        }, animate: {
          opacity: 1,
          height: "auto"
        }, exit: {
          opacity: 0,
          height: 0
        }, className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "flex items-start gap-2 py-3 rounded-2xl border-emerald-500/20 bg-emerald-500/5 text-emerald-500 dark:text-emerald-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16, className: "mt-0.5 shrink-0 text-emerald-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { className: "font-mono text-[10px] uppercase tracking-wider font-semibold", children: "Success" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-xs", children: successMsg })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden min-h-[360px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", initial: false, custom: direction, children: mode === "signin" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.form, { custom: direction, variants: {
        enter: (dir) => ({
          x: dir > 0 ? 120 : -120,
          opacity: 0
        }),
        center: {
          x: 0,
          opacity: 1
        },
        exit: (dir) => ({
          x: dir < 0 ? 120 : -120,
          opacity: 0
        })
      }, initial: "enter", animate: "center", exit: "exit", transition: {
        type: "spring",
        stiffness: 280,
        damping: 28
      }, onSubmit: handleLoginSubmit, className: `space-y-4 ${shake ? "animate-shake" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingLabelInput, { label: "Email Address", type: "email", value: email, onChange: (e) => setEmail(e.target.value), autoComplete: "email", invalid: !!errorMsg && !email.includes("@") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingLabelInput, { label: "Password", type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), autoComplete: "current-password", invalid: !!errorMsg && password.length < 4, trailing: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "text-muted-foreground hover:text-foreground transition-colors p-1", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-muted-foreground cursor-pointer select-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded border-divider bg-surface text-gold focus:ring-gold accent-gold w-4 h-4 cursor-pointer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Remember me" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-gold font-mono uppercase tracking-wider text-[10px] hover:underline", children: "Forgot Password?" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full mt-2 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-soft border border-primary-foreground/5", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sign In" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
        ] }) })
      ] }, "signin-form") : /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.form, { custom: direction, variants: {
        enter: (dir) => ({
          x: dir > 0 ? 120 : -120,
          opacity: 0
        }),
        center: {
          x: 0,
          opacity: 1
        },
        exit: (dir) => ({
          x: dir < 0 ? 120 : -120,
          opacity: 0
        })
      }, initial: "enter", animate: "center", exit: "exit", transition: {
        type: "spring",
        stiffness: 280,
        damping: 28
      }, onSubmit: handleSignupSubmit, className: `space-y-4 pb-2 ${shake ? "animate-shake" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingLabelInput, { label: "Full Name", type: "text", value: fullName, onChange: (e) => setFullName(e.target.value), invalid: !!errorMsg && !fullName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingLabelInput, { label: "Email Address", type: "email", value: email, onChange: (e) => setEmail(e.target.value), autoComplete: "email", invalid: !!errorMsg && !email.includes("@") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingLabelInput, { label: "Password", type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), autoComplete: "new-password", invalid: !!errorMsg && password.length < 4, trailing: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "text-muted-foreground hover:text-foreground transition-colors p-1", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 10, className: "text-gold" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Annual Reading Goal" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-gold font-bold bg-gold/5 px-2 py-0.5 rounded-md border border-gold/10", children: [
              readingGoal,
              " books"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "1", max: "100", value: readingGoal, onChange: (e) => setReadingGoal(Number(e.target.value)), className: "w-full accent-gold h-1.5 bg-divider rounded-lg cursor-pointer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block", children: [
            "Preferred Genres (",
            selectedGenres.length,
            " selected)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: GENRES.map((genre) => {
            const selected = selectedGenres.includes(genre);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleGenreToggle(genre), className: `px-3 py-1 rounded-full text-xs transition-all duration-200 border cursor-pointer ${selected ? "bg-gold/15 text-gold border-gold/40 shadow-soft font-medium" : "bg-muted/30 text-muted-foreground border-divider hover:border-muted-foreground/30"}`, children: genre }, genre);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block", children: "Preferred Formats" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [{
            id: "epub",
            label: "EPUB eBooks"
          }, {
            id: "audio",
            label: "Audiobooks"
          }].map((format) => {
            const selected = selectedFormats.includes(format.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleFormatToggle(format.id), className: `p-3 rounded-2xl border text-center text-xs font-semibold transition-all duration-200 cursor-pointer ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-muted/20 text-muted-foreground border-divider hover:border-muted-foreground/20"}`, children: format.label }, format.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full mt-4 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-primary-foreground/5 shadow-soft", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Complete Profile & Sign Up" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14, className: "text-gold" })
        ] }) })
      ] }, "signup-form") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-divider" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-semibold", children: "or connect with" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-divider" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleGoogleAuth, disabled: loading, className: "w-full py-3.5 rounded-full bg-surface text-foreground text-sm font-semibold border border-divider hover:bg-muted/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", width: "18", height: "18", xmlns: "http://www.w3.org/2000/svg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18c-.75 1.49-1.18 3.16-1.18 4.94s.43 3.45 1.18 4.94l3.66-2.84c-.22-.66-.35-1.36-.35-2.09z", fill: "#FBBC05" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sign up with Google" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground pt-4", children: [
        mode === "signin" ? "New to Golden Reads?" : "Already have a profile?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleToggleMode, className: "text-gold font-bold hover:underline cursor-pointer focus:outline-none", children: mode === "signin" ? "Register & Setup Profile" : "Sign In Here" })
      ] })
    ] }) })
  ] });
}
export {
  LoginPage as component
};
