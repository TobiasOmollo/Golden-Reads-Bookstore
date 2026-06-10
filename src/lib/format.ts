export function formatKES(n?: number | string | null): string {
  if (n === undefined || n === null) {
    return "KES 0.00";
  }
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(num)) {
    return "KES 0.00";
  }
  return `KES ${num.toLocaleString("en-KE")}`;
}
