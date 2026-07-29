import Link from "next/link";
import { ArrowRight, MessageSquareText, Search as SearchIcon } from "lucide-react";

import { RepoCard } from "@/components/github/repo-card";
import { LanguageBreakdown } from "@/components/github/language-breakdown";
import { Button } from "@/components/ui/button";
import { listRepositories } from "@/lib/api";
import { siteConfig } from "@/lib/site-config";
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

export default async function Home() {
  let repos: Repository[] = [];
  try {
    repos = await listRepositories();
  } catch {
    // The homepage should still render even if the backend/GitHub data is unavailable.
  }

  const featured = repos.filter((r) => r.featured).slice(0, 4);
  const recent = mostRecentActivity(repos);

  return (
    <div>
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <p className="mb-4 font-mono text-xs tracking-wide text-muted-foreground uppercase">
          Engineering portfolio
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground sm:text-lg">
          {siteConfig.tagline}. Uploaded documents explain the experience, GitHub provides live
          technical evidence, and every AI-generated answer traces back to a real source.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="/ask" />}>
            <MessageSquareText className="size-4" /> Ask My Portfolio
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/search" />}>
            <SearchIcon className="size-4" /> Search projects
          </Button>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">Featured projects</h2>
            <Link href="/projects" className="flex items-center gap-1 text-sm hover:underline">
              All projects <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Recent engineering activity
            </h2>
            <Link href="/github" className="flex items-center gap-1 text-sm hover:underline">
              GitHub Explorer <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {recent.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </section>
      )}

      {repos.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <LanguageBreakdown repos={repos} />
            <p className="mt-3 text-xs text-muted-foreground">
              Every technology here is evidence, not a self-rating —{" "}
              <Link href="/search" className="underline underline-offset-2">
                search
              </Link>{" "}
              or{" "}
              <Link href="/ask" className="underline underline-offset-2">
                ask
              </Link>{" "}
              to see exactly which projects and documents back it.
            </p>
          </div>
        </section>
      )}

      {repos.length === 0 && (
        <section className="mx-auto max-w-2xl px-4 py-10 text-center text-sm text-muted-foreground sm:px-6">
          No repositories have been synced and curated yet — visit the admin dashboard to run a
          GitHub sync and feature some projects.
        </section>
      )}
    </div>
  );
}
