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

export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/ask", label: "Ask My Portfolio" },
  { href: "/search", label: "Search" },
  { href: "/github", label: "GitHub Explorer" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
] as const;
