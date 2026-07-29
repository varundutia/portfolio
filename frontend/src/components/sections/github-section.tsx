import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LanguageBreakdown } from "@/components/github/language-breakdown";
import { RepoCard } from "@/components/github/repo-card";
import { SectionHeading } from "@/components/sections/section-heading";
import type { Repository } from "@/lib/types";

function mostRecentActivity(repos: Repository[]): Repository[] {
  return [...repos]
    .filter((r) => r.last_meaningful_commit_at || r.repo_pushed_at)
    .sort((a, b) => {
      const aDate = new Date(a.last_meaningful_commit_at ?? a.repo_pushed_at ?? 0).getTime();
      const bDate = new Date(b.last_meaningful_commit_at ?? b.repo_pushed_at ?? 0).getTime();
      return bDate - aDate;
    })
    .slice(0, 3);
}

export function GithubSection({ repos }: { repos: Repository[] }) {
  const recent = mostRecentActivity(repos);

  return (
    <section id="github" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="GitHub"
        title="Live technical evidence"
        description="Synced from GitHub on demand, cached — not re-fetched on every page load. Code composition, not a self-rating."
      />

      {repos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No repositories have been synced yet.</p>
      ) : (
        <div className="space-y-8">
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <LanguageBreakdown repos={repos} />
          </div>

          {recent.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-medium text-muted-foreground">Recent activity</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {recent.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </div>
          )}

          <Link
            href="/github"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Full GitHub Explorer <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
