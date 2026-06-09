import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, Sparkles, BookOpen, AlertCircle, CheckCircle2, ChevronRight, Bookmark } from "lucide-react";
import { Wordmark } from "@/components/Logo";
import logoAsset from "@/assets/golden-reads-logo.png";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/api/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In – Golden Reads" },
      { name: "description", content: "Access your Golden Reads account and sync your library." },
    ],
  }),
  component: LoginPage,
});

const QUOTES = [
  { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" },
  { text: "Reading is escape, and the opposite of escape; it's a way to make contact with reality.", author: "Nora Ephron" },
  { text: "The reading of all good books is like a conversation with the finest minds of past centuries.", author: "René Descartes" }
];

const GENRES = ["Fiction", "Thriller", "Biography", "Technology", "Romance", "Mystery", "Fantasy", "Business", "Self-Help", "History"];

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  trailing?: React.ReactNode;
  invalid?: boolean;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, type, value, onChange, onFocus, onBlur, className, trailing, invalid, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = value !== undefined && value !== null && String(value).length > 0;

    return (
      <div className="relative w-full">
        <div
          className={`flex items-center gap-2 px-4 pt-5 pb-1.5 rounded-2xl bg-surface border transition-all duration-200 ${
            invalid
              ? "border-destructive focus-within:ring-1 focus-within:ring-destructive"
              : focused
                ? "border-gold ring-1 ring-gold shadow-soft"
                : "border-divider hover:border-muted-foreground/30"
          }`}
        >
          <div className="flex-1 relative">
            <input
              type={type}
              value={value}
              onChange={onChange}
              ref={ref}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              className={`peer w-full bg-transparent outline-none text-sm pt-1 pb-0.5 text-foreground placeholder-transparent focus:outline-none focus:ring-0 ${className}`}
              placeholder={label}
              {...props}
            />
            <label
              className={`absolute left-0 top-0.5 font-mono text-muted-foreground transition-all duration-200 pointer-events-none origin-[0_0] select-none
                ${focused || hasValue 
                  ? "text-[9px] uppercase tracking-wider -translate-y-2.5 text-gold font-semibold" 
                  : "text-xs translate-y-0.5"
                }`}
            >
              {label}
            </label>
          </div>
          {trailing && <div className="flex items-center justify-center pl-1">{trailing}</div>}
        </div>
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Validation / Error States
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [shake, setShake] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Profile Specific Fields (SignUp)
  const [fullName, setFullName] = useState("");
  const [readingGoal, setReadingGoal] = useState(12);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["epub"]);

  // Visual States
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Check if session exists on mount
  useEffect(() => {
    const session = localStorage.getItem("golden_reads_user");
    if (session) {
      navigate({ to: "/" });
    }
  }, [navigate]);

  // Quote Cycler
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMode = () => {
    setDirection(mode === "signin" ? 1 : -1);
    setMode(mode === "signin" ? "signup" : "signin");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleFormatToggle = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
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
      // Save authentic live session values upon server validation approval
      localStorage.setItem("golden_reads_token", response.access_token);
      localStorage.setItem("golden_reads_user", JSON.stringify(response.user));
      setTimeout(() => {
        navigate({ to: "/" });
      }, 1200);
    } catch (err: any) {
      console.error("Login failed", err);
      setErrorMsg("Invalid email or password.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
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
      preferredFormats: selectedFormats,
    };

    try {
      const response = await api.auth.signup(email, password, profileDetails);
      setSuccessMsg("Account created successfully! Preparing your library...");
      // Save authentic live session values upon server validation approval
      localStorage.setItem("golden_reads_token", response.access_token);
      localStorage.setItem("golden_reads_user", JSON.stringify(response.user));
      setTimeout(() => {
        navigate({ to: "/" });
      }, 1500);
    } catch (err: any) {
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
      // Send a mock verification token to the backend verify stub
      const mockOAuthToken = email.includes("@") ? email : "google_reader@gmail.com";
      const response = await api.auth.google(mockOAuthToken);
      
      setSuccessMsg("Google sign-in verified! Redirecting...");
      // Save authentic live session values upon server validation approval
      localStorage.setItem("golden_reads_token", response.access_token);
      localStorage.setItem("golden_reads_user", JSON.stringify(response.user));
      setTimeout(() => {
        navigate({ to: "/" });
      }, 1200);
    } catch (err: any) {
      console.error("Google authentication failed", err);
      setErrorMsg("Google OAuth verify stub returned an error.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground select-none font-body overflow-x-hidden">
      {/* LEFT PANE - Visual Branding & Interactive Slideshow (Desktop only) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-primary relative flex-col justify-between p-12 overflow-hidden border-r border-border/10">
        {/* Animated background blobs for high-performance visual aesthetics */}
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 20, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gold/10 blur-[80px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              x: [0, -30, 0],
              y: [0, 20, 0]
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-accent/10 blur-[100px]"
          />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top Row: Brand Header */}
          <div className="flex items-center gap-3">
            <img src={logoAsset} alt="Golden Reads" className="w-10 h-10 object-contain ring-2 ring-gold/40 rounded-lg p-0.5" />
            <Wordmark className="text-xl text-primary-foreground font-display" />
          </div>

          {/* Middle Row: Animated Bookshelf Quote Box */}
          <div className="max-w-md my-auto pl-6 border-l-2 border-gold/40">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <p className="font-display italic text-2xl lg:text-3xl text-primary-foreground/90 leading-relaxed">
                  "{QUOTES[quoteIdx].text}"
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-px bg-gold/60" />
                  <p className="font-mono text-xs uppercase tracking-wider text-gold">
                    {QUOTES[quoteIdx].author}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Row: Footer Details */}
          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-primary-foreground/50">
            <span>GOLDEN READS BOOKSTORE</span>
            <span>EST. 2026</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANE - Interactive Form Pane (Sign In / Sign Up) */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center px-6 sm:px-12 py-10 relative bg-surface border-l border-divider overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-6">
          
          {/* Mobile header (hidden on desktop) */}
          <div className="md:hidden flex items-center justify-center gap-3 mb-6">
            <img src={logoAsset} alt="" className="w-8 h-8 object-contain" />
            <Wordmark className="text-lg" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold font-display tracking-tight text-foreground">
              {mode === "signin" ? "Sign in to account" : "Create a Profile"}
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              {mode === "signin"
                ? "Enter your credentials to manage your digital bookshelf."
                : "Fill in your details to set up your customized library."}
            </p>
          </div>

          {/* Validation Alert Messages */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Alert variant="destructive" className="flex items-start gap-2 py-3 rounded-2xl bg-destructive/10 border-destructive/20 text-destructive">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <div className="w-full">
                    <AlertTitle className="font-mono text-[10px] uppercase tracking-wider font-semibold">Validation Error</AlertTitle>
                    <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
                  </div>
                </Alert>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Alert className="flex items-start gap-2 py-3 rounded-2xl border-emerald-500/20 bg-emerald-500/5 text-emerald-500 dark:text-emerald-400">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                  <div className="w-full">
                    <AlertTitle className="font-mono text-[10px] uppercase tracking-wider font-semibold">Success</AlertTitle>
                    <AlertDescription className="text-xs">{successMsg}</AlertDescription>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated split-pane form cards */}
          <div className="relative overflow-hidden min-h-[360px]">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              {mode === "signin" ? (
                <motion.form
                  key="signin-form"
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (dir: number) => ({ x: dir < 0 ? 120 : -120, opacity: 0 })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  onSubmit={handleLoginSubmit}
                  className={`space-y-4 ${shake ? "animate-shake" : ""}`}
                >
                  <FloatingLabelInput
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    invalid={!!errorMsg && !email.includes("@")}
                  />

                  <FloatingLabelInput
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    invalid={!!errorMsg && password.length < 4}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="rounded border-divider bg-surface text-gold focus:ring-gold accent-gold w-4 h-4 cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="text-gold font-mono uppercase tracking-wider text-[10px] hover:underline">
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-soft border border-primary-foreground/5"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup-form"
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (dir: number) => ({ x: dir < 0 ? 120 : -120, opacity: 0 })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  onSubmit={handleSignupSubmit}
                  className={`space-y-4 pb-2 ${shake ? "animate-shake" : ""}`}
                >
                  <FloatingLabelInput
                    label="Full Name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    invalid={!!errorMsg && !fullName}
                  />

                  <FloatingLabelInput
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    invalid={!!errorMsg && !email.includes("@")}
                  />

                  <FloatingLabelInput
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    invalid={!!errorMsg && password.length < 4}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />

                  {/* Profile setup: Reading Goal Slider */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Bookmark size={10} className="text-gold" />
                        <span>Annual Reading Goal</span>
                      </label>
                      <span className="font-mono text-xs text-gold font-bold bg-gold/5 px-2 py-0.5 rounded-md border border-gold/10">
                        {readingGoal} books
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={readingGoal}
                      onChange={(e) => setReadingGoal(Number(e.target.value))}
                      className="w-full accent-gold h-1.5 bg-divider rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Profile setup: Preferred Genres Grid */}
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                      Preferred Genres ({selectedGenres.length} selected)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {GENRES.map((genre) => {
                        const selected = selectedGenres.includes(genre);
                        return (
                          <button
                            type="button"
                            key={genre}
                            onClick={() => handleGenreToggle(genre)}
                            className={`px-3 py-1 rounded-full text-xs transition-all duration-200 border cursor-pointer ${
                              selected
                                ? "bg-gold/15 text-gold border-gold/40 shadow-soft font-medium"
                                : "bg-muted/30 text-muted-foreground border-divider hover:border-muted-foreground/30"
                            }`}
                          >
                            {genre}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Profile setup: Formats checkboxes */}
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                      Preferred Formats
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "epub", label: "EPUB eBooks" },
                        { id: "audio", label: "Audiobooks" }
                      ].map((format) => {
                        const selected = selectedFormats.includes(format.id);
                        return (
                          <button
                            type="button"
                            key={format.id}
                            onClick={() => handleFormatToggle(format.id)}
                            className={`p-3 rounded-2xl border text-center text-xs font-semibold transition-all duration-200 cursor-pointer ${
                              selected
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/20 text-muted-foreground border-divider hover:border-muted-foreground/20"
                            }`}
                          >
                            {format.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-primary-foreground/5 shadow-soft"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <span>Complete Profile & Sign Up</span>
                        <Sparkles size={14} className="text-gold" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Social Logins Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-divider" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
              or connect with
            </span>
            <div className="flex-1 h-px bg-divider" />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-surface text-foreground text-sm font-semibold border border-divider hover:bg-muted/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-soft"
          >
            {/* Standard G SVG logo */}
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18c-.75 1.49-1.18 3.16-1.18 4.94s.43 3.45 1.18 4.94l3.66-2.84c-.22-.66-.35-1.36-.35-2.09z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Toggle Register / Login */}
          <p className="text-center text-xs text-muted-foreground pt-4">
            {mode === "signin" ? "New to Golden Reads?" : "Already have a profile?"}{" "}
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-gold font-bold hover:underline cursor-pointer focus:outline-none"
            >
              {mode === "signin" ? "Register & Setup Profile" : "Sign In Here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
