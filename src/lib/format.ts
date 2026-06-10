export function formatKES(n?: number | null): string {
  if (n === undefined || n === null) {
    return "KES 0.00";
  }
  return `KES ${n.toLocaleString("en-KE")}`;
}
