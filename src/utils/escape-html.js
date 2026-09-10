/**
 * Safely escapes HTML special characters in strings to prevent XSS.
 * @param {any} val - Value to escape
 * @returns {string} Escaped HTML string
 */
export function escapeHTML(val) {
  return String(val ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
