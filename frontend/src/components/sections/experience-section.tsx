import { EvidenceCard } from "@/components/evidence/evidence-card";
import { SectionHeading } from "@/components/sections/section-heading";
import type { SearchResult } from "@/lib/types";

export function ExperienceSection({ evidence }: { evidence: SearchResult[] }) {
  return (
    <section id="experience" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Experience"
        title="Roles, responsibilities, and context"
        description="Evidence retrieved directly from uploaded documents — resume, reference letters, and case studies."
      />

      {evidence.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No experience-related documents have been ingested yet.
        </p>
      ) : (
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
      )}
    </section>
  );
}
