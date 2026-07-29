import type { Metadata } from "next";

import { LanguageBreakdown } from "@/components/github/language-breakdown";
import { RepoCard } from "@/components/github/repo-card";
import { ApiError, listRepositories } from "@/lib/api";
import type { Repository } from "@/lib/types";

export const metadata: Metadata = { title: "GitHub Explorer" };

export default async function GithubPage() {
  let repos: Repository[] = [];
  let error: string | null = null;
  try {
    repos = await listRepositories();
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Could not load GitHub data right now.";
  }

  const featured = repos.filter((r) => r.featured);
  const rest = repos.filter((r) => !r.featured);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">GitHub Explorer</h1>
        <p className="text-muted-foreground">
          Live technical evidence, synced from GitHub on demand — implementation, repository
          structure, and activity. Case studies live on the Projects page; this is the code.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!error && repos.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No repositories have been synced and curated yet.
        </p>
      )}

      {!error && repos.length > 0 && (
        <div className="space-y-10">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <LanguageBreakdown repos={repos} />
          </div>

          {featured.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">Featured</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {featured.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">All repositories</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {rest.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
