/**
 * Utility for formatting BibTeX entries from publication objects.
 */
export function generateBibTeX(pub) {
  const citeKey = pub.id || `maity${pub.year}`;
  const authors = Array.isArray(pub.authors) ? pub.authors.join(" and ") : pub.authors;
  
  if (pub.status === "preprint" || pub.journal === "ChemRxiv" || pub.journal === "Research Square") {
    return `@article{${citeKey},
  author  = {${authors}},
  title   = {${pub.title}},
  journal = {${pub.journal || "Preprint"}},
  year    = {${pub.year}},
  doi     = {${pub.doi || ""}},
  url     = {${pub.url || pub.doi ? `https://doi.org/${pub.doi}` : ""}}
}`;
  }

  if (pub.status === "submitted") {
    return `@article{${citeKey},
  author  = {${authors}},
  title   = {${pub.title}},
  note    = {Submitted for publication},
  year    = {${pub.year}}
}`;
  }

  return `@article{${citeKey},
  author  = {${authors}},
  title   = {${pub.title}},
  journal = {${pub.journal}},
  volume  = {${pub.volume || ""}},
  number  = {${pub.issue || ""}},
  pages   = {${pub.pages || ""}},
  year    = {${pub.year}},
  doi     = {${pub.doi || ""}},
  url     = {${pub.url || `https://doi.org/${pub.doi}`}}
}`;
}
