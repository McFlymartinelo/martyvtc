export function jourUtc(value: Date | string) {
  if (typeof value === "string") {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }
  return new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
}
