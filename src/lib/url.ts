/**
 * Safely sanitizes and returns an absolute http/https URL.
 * Prevents relative URL routing issues such as "http://localhost:3000/Not%20publicly%20disclosed".
 */
export function sanitizeEventUrl(
  url?: string | null,
  fallbackUrl?: string | null
): string | null {
  const testCandidate = (cand?: string | null): string | null => {
    if (!cand) return null;
    const trimmed = String(cand).trim();
    if (
      !trimmed ||
      trimmed.toLowerCase().includes("not publicly") ||
      trimmed.toLowerCase().includes("tba") ||
      trimmed.toLowerCase().includes("unknown") ||
      trimmed.toLowerCase().includes("n/a") ||
      trimmed === "https://" ||
      trimmed === "http://" ||
      trimmed === "/"
    ) {
      return null;
    }

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    // If candidate has a domain-like structure (e.g. domain.com or domain.com/path)
    if (trimmed.includes(".") && !trimmed.includes(" ")) {
      return `https://${trimmed.replace(/^\/+/, "")}`;
    }

    return null;
  };

  return testCandidate(url) || testCandidate(fallbackUrl);
}
