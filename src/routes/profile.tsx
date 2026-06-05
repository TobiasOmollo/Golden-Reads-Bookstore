import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Settings, Award, Bell, Shield, Download, LogOut } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useTheme } from "@/store/theme";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile – Golden Reads" },
      { name: "description", content: "Manage your Golden Reads account and preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { theme, toggle } = useTheme();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
    readingGoal?: number;
  } | null>(null);

  useEffect(() => {
    const activeSession = localStorage.getItem("golden_reads_user");
    if (activeSession) {
      try {
        setUser(JSON.parse(activeSession));
      } catch (e) {
        console.error("Failed to parse user session, resetting", e);
        setUser({ name: "Guest Reader", email: "guest@goldenreads.com" });
      }
    } else {
      setUser({ name: "Guest Reader", email: "guest@goldenreads.com" });
    }
  }, []);

  return (
    <AppShell>
      <div className="px-5 pt-4">
        <h1 className="font-display text-2xl font-semibold">Profile</h1>
      </div>

      <section className="mx-5 mt-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5 shadow-soft">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
            alt=""
            className="w-16 h-16 rounded-full object-cover ring-2 ring-gold/60"
          />
          <div className="flex-1">
            <p className="font-display text-xl font-semibold">{user?.name}</p>
            <p className="text-xs text-primary-foreground/70">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <Mini label="Goal" value={`${user?.readingGoal || 12}/yr`} />
          <Mini label="Read" value="14" />
          <Mini label="Streak" value="12d" />
        </div>
      </section>

      <section className="mt-6 px-5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Appearance
        </p>
        <div className="rounded-2xl bg-surface border border-divider divide-y divide-divider">
          <Row icon={<Settings size={16} />} label="Theme" trailing={
            <button
              role="switch"
              aria-checked={theme === "dark"}
              onClick={toggle}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors ${theme === "dark" ? "bg-gold" : "bg-muted"}`}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${theme === "dark" ? "translate-x-5" : ""}`}
              />
            </button>
          } />
          <Row icon={<Bell size={16} />} label="Notifications" />
          <Row icon={<Award size={16} />} label="Achievements" />
        </div>
      </section>

      <section className="mt-6 px-5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Account
        </p>
        <div className="rounded-2xl bg-surface border border-divider divide-y divide-divider">
          <Row icon={<Shield size={16} />} label="Security" />
          <Row icon={<Download size={16} />} label="Export my data" />
          <Row icon={<LogOut size={16} />} label="Sign out" destructive href="/login" />
        </div>
      </section>

      <p className="text-center font-mono text-[10px] text-muted-foreground mt-10 mb-4">
        GOLDEN READS · v1.0
      </p>
    </AppShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-lg font-semibold">{value}</p>
      <p className="font-mono text-[9px] uppercase tracking-wider text-primary-foreground/70">{label}</p>
    </div>
  );
}

function Row({
  icon,
  label,
  trailing,
  destructive,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  destructive?: boolean;
  href?: string;
}) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className={destructive ? "text-destructive" : "text-muted-foreground"}>{icon}</span>
      <span className={`flex-1 text-sm ${destructive ? "text-destructive" : ""}`}>{label}</span>
      {trailing ?? <ChevronRight size={16} className="text-muted-foreground" />}
    </div>
  );
  if (href) {
    return <Link to={href}>{inner}</Link>;
  }
  return <button type="button" className="w-full text-left">{inner}</button>;
}
