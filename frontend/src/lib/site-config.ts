/** Contact/link routing only — not professional claims, so it's fine to configure here
 * rather than sourcing from ingested documents. What Varun has done still comes only from
 * documents and GitHub. */
export const siteConfig = {
  name: "Varun Dutia",
  tagline: "Software Engineer — backend, web, mobile, and AI-powered systems",
  email: "varundutia.hameer@gmail.com",
  github: "https://github.com/varundutia",
  linkedin: "https://linkedin.com/in/varun-dutia",
  githubUsername: "varundutia",
};

/** Anchors on the single-page portfolio (`/`). Using `/#id` rather than `#id` so the links
 * still work correctly from other routes (e.g. /github/[repo], /admin). */
export const primaryNav = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#github", label: "GitHub" },
  { href: "/#ask", label: "Ask AI" },
  { href: "/#contact", label: "Contact" },
] as const;
