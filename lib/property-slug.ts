export function slugify(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createPropertySlug(
  title: string,
  city: string,
  id: number | string
): string {
  const base = [title, city].filter(Boolean).join(" ").trim();
  const slugBase = slugify(base || "property");

  return `${slugBase}-${id}`;
}

export function getPropertyIdFromSlug(
  value?: string | null
): number | null {
  // Prevent crashes when value is undefined or null
  if (!value || typeof value !== "string") {
    return null;
  }

  const match = value.match(/-(\d+)$/);

  if (match) {
    return Number(match[1]);
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}