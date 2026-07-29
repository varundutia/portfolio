import Link from "next/link";
import { Contact2, Download, GitBranch, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { documentFileUrl } from "@/lib/api";
import { siteConfig } from "@/lib/site-config";
import type { PortfolioDocument } from "@/lib/types";

const links = [
  { label: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail },
  { label: "GitHub", href: siteConfig.github, icon: GitBranch },
  { label: "LinkedIn", href: siteConfig.linkedin, icon: Contact2 },
];

export function ContactSection({ resume }: { resume: PortfolioDocument | undefined }) {
  return (
    <section id="contact" className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description="LinkedIn is a profile and sharing channel, not a data source — everything else here is grounded in uploaded documents and GitHub."
      />

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

        {resume && (
          <Button
            variant="outline"
            className="w-full justify-start gap-3 px-4 py-4 h-auto"
            render={<a href={documentFileUrl(resume.id)} download />}
          >
            <Download className="size-4 text-muted-foreground" />
            Download resume
          </Button>
        )}
      </div>
    </section>
  );
}
