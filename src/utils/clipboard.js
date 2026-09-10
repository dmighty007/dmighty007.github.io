/**
 * Utility for copying text to clipboard with live status updates.
 */
import { setLiveStatus } from "../accessibility.js";

export function copyText(text, label = "Text") {
  const finish = () => setLiveStatus(`${label} copied to clipboard.`);
  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(finish)
      .catch(() => fallbackCopy(text, finish));
    return;
  }
  fallbackCopy(text, finish);
}

function fallbackCopy(text, cb) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;opacity:0";
  document.body.append(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
  if (cb) cb();
}
