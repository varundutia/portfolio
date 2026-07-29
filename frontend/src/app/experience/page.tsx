import type { Metadata } from "next";

import { EvidenceCard } from "@/components/evidence/evidence-card";
import { ApiError, semanticSearch } from "@/lib/api";
import type { SearchResult } from "@/lib/types";

export const metadata: Metadata = { title: "Experience" };

export default async function ExperiencePage() {
  let results: SearchResult[] = [];
  let error: string | null = null;
  try {
    const response = await semanticSearch(
      "professional experience roles responsibilities internship academic work",
    );
    results = response.results;
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Could not load experience evidence right now.";
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Experience</h1>
        <p className="text-muted-foreground">
          Evidence retrieved directly from uploaded documents — resume, reference letters, and
          case studies. For questions about a specific role or technology, try{" "}
          <a href="/ask" className="underline underline-offset-2">
            Ask My Portfolio
          </a>
          .
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!error && results.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No experience-related documents have been ingested yet.
        </p>
      )}

      {!error && results.length > 0 && (
        <div className="space-y-3">
          {results.map((result) => (
            <EvidenceCard
              key={result.chunk_id}
              sourceType={result.source_type}
              sourceTitle={result.source_title}
              sourceUrl={result.source_url}
              pageNumber={result.page_number}
              sectionHeading={result.section_heading}
              snippet={result.content}
            />
          ))}
        </div>
      )}
    </div>
  );
}
