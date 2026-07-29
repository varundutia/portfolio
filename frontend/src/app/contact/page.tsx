import type { Metadata } from "next";
import Link from "next/link";
import { Contact2, GitBranch, Mail } from "lucide-react";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Contact" };

const links = [
  { label: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail },
  { label: "GitHub", href: siteConfig.github, icon: GitBranch },
  { label: "LinkedIn", href: siteConfig.linkedin, icon: Contact2 },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Contact</h1>
        <p className="text-muted-foreground">
          LinkedIn is a profile and sharing channel, not a data source — everything else on this
          site is grounded in uploaded documents and GitHub.
        </p>
      </div>

      <div className="space-y-2">
        {links.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 text-sm transition-colors hover:border-foreground/20"
          >
            <Icon className="size-4 text-muted-foreground" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
