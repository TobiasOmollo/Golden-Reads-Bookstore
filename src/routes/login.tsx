import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Wordmark } from "@/components/Logo";
import logoAsset from "@/assets/golden-reads-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In – Golden Reads" },
      { name: "description", content: "Sign in to your Golden Reads account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [shake, setShake] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || pw.length < 4) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="max-w-md w-full mx-auto px-6 pt-16 pb-10 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <img src={logoAsset} alt="" className="w-16 h-16 mx-auto" />
          <Wordmark className="text-[22px] block mt-2" />
          <p className="font-serif italic text-muted-foreground mt-3">
            Welcome back to your library.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, x: shake ? [0, -8, 8, -6, 6, 0] : 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={onSubmit}
          className="mt-10 space-y-4"
        >
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            invalid={shake && !email.includes("@")}
          />
          <Field
            label="Password"
            type={show ? "text" : "password"}
            value={pw}
            onChange={setPw}
            autoComplete="current-password"
            invalid={shake && pw.length < 4}
            trailing={
              <button
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow((v) => !v)}
                className="text-muted-foreground"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="rounded accent-[color:var(--color-gold)]" />
              Remember me
            </label>
            <a href="#" className="text-gold font-mono uppercase tracking-wider text-[10px]">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-divider" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              or continue with
            </span>
            <div className="flex-1 h-px bg-divider" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="py-3 rounded-full bg-white text-black text-sm font-medium border border-divider">
              Google
            </button>
            <button type="button" className="py-3 rounded-full bg-black text-white text-sm font-medium">
               Apple
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New here?{" "}
            <Link to="/" className="text-gold font-medium">
              Register
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  trailing,
  invalid,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  trailing?: React.ReactNode;
  invalid?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div
        className={`mt-1.5 flex items-center gap-2 px-4 py-3 rounded-2xl bg-surface border transition-colors ${
          invalid ? "border-destructive" : "border-divider focus-within:border-gold"
        }`}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {trailing}
      </div>
    </label>
  );
}
