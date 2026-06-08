/**
 * Formats a client's name by trimming whitespace and de-duplicating
 * accidentally duplicated names (e.g. "goutham goutham" -> "goutham").
 */
export function formatClientName(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length > 1) {
    const firstPart = parts[0].toLowerCase();
    const allIdentical = parts.every((part) => part.toLowerCase() === firstPart);
    if (allIdentical) {
      return parts[0];
    }
  }
  return trimmed;
}
