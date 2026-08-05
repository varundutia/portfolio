import Link from "next/link";
import { Contact2, GitBranch, Mail } from "lucide-react";

import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Software engineering portfolio focused on backend systems, product delivery, and
          production ownership.
        </p>
        <div className="flex items-center gap-4">
          <Link href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitBranch className="size-4 transition-colors hover:text-foreground" />
          </Link>
          <Link href={siteConfig.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Contact2 className="size-4 transition-colors hover:text-foreground" />
          </Link>
          <Link href={`mailto:${siteConfig.email}`} aria-label="Email">
            <Mail className="size-4 transition-colors hover:text-foreground" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
