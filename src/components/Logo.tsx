import logoAsset from "@/assets/golden-reads-logo.png.asset.json";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <img
      src={logoAsset.url}
      alt="Golden Reads"
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display font-semibold tracking-wide text-gold ${className}`}
      style={{ letterSpacing: "0.08em" }}
    >
      GOLDEN READS
    </span>
  );
}
