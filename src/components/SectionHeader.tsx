import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function SectionHeader({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between px-5 mb-3">
      <h2 className="text-[20px] font-display font-semibold tracking-tight">{title}</h2>
      {href ? (
        <Link
          to={href}
          className="font-mono text-[11px] uppercase tracking-wider text-gold"
        >
          See all →
        </Link>
      ) : (
        children
      )}
    </div>
  );
}
