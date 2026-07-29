import type { Metadata } from "next";
import Link from "next/link";

import { EvidenceCard } from "@/components/evidence/evidence-card";
import { LanguageBreakdown } from "@/components/github/language-breakdown";
import { ApiError, listRepositories, semanticSearch } from "@/lib/api";
import { siteConfig } from "@/lib/site-config";
import type { Repository, SearchResult } from "@/lib/types";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  let summaryEvidence: SearchResult[] = [];
  let repos: Repository[] = [];
  let error: string | null = null;

  try {
    const [summaryRes, repoRes] = await Promise.all([
      semanticSearch("professional summary background overview"),
      listRepositories(),
    ]);
    summaryEvidence = summaryRes.results.slice(0, 3);
    repos = repoRes;
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Could not load profile data right now.";
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">About</h1>
        <p className="text-muted-foreground">{siteConfig.tagline}</p>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!error && summaryEvidence.length > 0 && (
        <section className="mb-10 space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            From uploaded documents
          </h2>
          <div className="space-y-2">
            {summaryEvidence.map((r) => (
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
        </section>
      )}

      {!error && repos.length > 0 && (
        <section className="mb-10 rounded-xl border border-border/60 bg-card p-4">
          <LanguageBreakdown repos={repos} />
        </section>
      )}

      <section className="space-y-2 text-sm text-muted-foreground">
        <p>
          For specific claims about experience, projects, or technologies, ask directly via{" "}
          <Link href="/ask" className="underline underline-offset-2">
            Ask My Portfolio
          </Link>{" "}
          — every answer is grounded in the sources above and cites where it came from.
        </p>
      </section>
    </div>
  );
}
