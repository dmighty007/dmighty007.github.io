import { newsItems } from "../data/news.js";
import { escapeHTML } from "../utils/escape-html.js";

export function renderNews() {
  const container = document.querySelector("#news-list");
  if (!container) return;
  container.innerHTML = [...newsItems]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((item) => `<li><time datetime="${item.date}">${item.label}</time><span>${item.journal ? escapeHTML(item.text).replace(/(Angewandte Chemie International Edition|The Journal of Chemical Physics|Journal of Chemical Theory and Computation)/, "<em>$1</em>") : escapeHTML(item.text)}</span></li>`)
    .join("");
}
