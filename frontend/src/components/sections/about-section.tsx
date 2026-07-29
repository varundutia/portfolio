import Link from "next/link";

import { EvidenceCard } from "@/components/evidence/evidence-card";
import { SectionHeading } from "@/components/sections/section-heading";
import { siteConfig } from "@/lib/site-config";
import type { SearchResult } from "@/lib/types";

export function AboutSection({ evidence }: { evidence: SearchResult[] }) {
  return (
    <section id="about" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <SectionHeading eyebrow="About" title="A bit about the work" description={siteConfig.tagline} />

      {evidence.length > 0 ? (
        <div className="space-y-2">
          {evidence.map((r) => (
            <EvidenceCard
              key={r.chunk_id}
              sourceType={r.source_type}
              sourceTitle={r.source_title}
              sourceUrl={r.source_url}
              pageNumber={r.page_number}
              sectionHeading={r.section_heading}
              snippet={r.content}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No summary documents have been ingested yet.
        </p>
      )}

      <p className="mt-4 text-sm text-muted-foreground">
        Everything here is retrieved from uploaded documents, not written by hand — ask{" "}
        <Link href="#ask" className="underline underline-offset-2">
          Ask AI
        </Link>{" "}
        below for specifics.
      </p>
    </section>
  );
}
