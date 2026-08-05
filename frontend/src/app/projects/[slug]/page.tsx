import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  ExternalLink,
  GitBranch,
  Layers3,
  RadioTower,
} from "lucide-react";

import { LanguageBreakdown } from "@/components/github/language-breakdown";
import { RepoCard } from "@/components/github/repo-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiError, getProject } from "@/lib/api";
import type { Project, Repository } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatCategory(category: string): string {
  return category
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function latestActivity(repositories: Repository[]): string | null {
  const timestamps = repositories
    .map((repo) => repo.last_meaningful_commit_at ?? repo.repo_pushed_at)
    .filter((date): date is string => Boolean(date))
    .map((date) => new Date(date).getTime())
    .filter((time) => Number.isFinite(time));

  if (timestamps.length === 0) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(Math.max(...timestamps)));
}

function technologyList(repositories: Repository[]): string[] {
  const names = new Set<string>();
  for (const repo of repositories) {
    if (repo.primary_language) names.add(repo.primary_language);
    for (const topic of repo.topics.slice(0, 4)) names.add(topic);
  }
  return [...names].slice(0, 10);
}

function projectSummary(project: Project): string {
  if (project.repositories.length === 0) {
    return "This backend-curated project does not have public repositories linked yet.";
  }

  const repoNames = project.repositories.map((repo) => repo.name).join(", ");
  return `${project.title} is a backend-curated project linked to ${repoNames}. The detail shown here comes from the portfolio API and synced GitHub repository metadata.`;
}

async function loadProject(slug: string): Promise<{ project: Project | null; error: string | null }> {
  try {
    return { project: await getProject(slug), error: null };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    return {
      project: null,
      error: err instanceof ApiError ? err.message : "Could not load this project.",
    };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: formatCategory(slug.replaceAll("-", " ")) };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { project, error } = await loadProject(slug);

  if (!project) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Button variant="ghost" render={<Link href="/#work" />}>
          <ArrowLeft className="size-4" aria-hidden /> Back to work
        </Button>
        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
          {error ?? "This project could not be loaded from the portfolio API."}
        </div>
      </main>
    );
  }

  const technologies = technologyList(project.repositories);
  const activity = latestActivity(project.repositories);
  const repositoriesWithDocs = project.repositories.filter((repo) => repo.is_selected_for_rag);
  const demoLinks = project.repositories.filter((repo) => repo.homepage);

  return (
    <main>
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Button variant="ghost" render={<Link href="/#work" />}>
            <ArrowLeft className="size-4" aria-hidden /> Back to work
          </Button>

          <div className="mt-8 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-md">
                {formatCategory(project.category)}
              </Badge>
              {project.featured && (
                <Badge variant="outline" className="rounded-md">
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{projectSummary(project)}</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-card p-4">
              <GitBranch className="size-4 text-muted-foreground" aria-hidden />
              <p className="mt-3 text-2xl font-semibold">{project.repositories.length}</p>
              <p className="text-sm text-muted-foreground">Linked repositories</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card p-4">
              <Layers3 className="size-4 text-muted-foreground" aria-hidden />
              <p className="mt-3 text-2xl font-semibold">{technologies.length || "0"}</p>
              <p className="text-sm text-muted-foreground">Technologies surfaced</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card p-4">
              <CalendarClock className="size-4 text-muted-foreground" aria-hidden />
              <p className="mt-3 text-2xl font-semibold">{activity ?? "N/A"}</p>
              <p className="text-sm text-muted-foreground">Latest synced activity</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.65fr]">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Repository Evidence</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              These repositories are linked to the project by the backend. Their descriptions,
              languages, topics, releases, and activity are synced server-side from GitHub.
            </p>
          </div>

          {project.repositories.length > 0 ? (
            <div className="grid gap-4">
              {project.repositories.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border/70 bg-card p-5 text-sm text-muted-foreground">
              No repositories have been linked to this project yet.
            </div>
          )}
        </div>

        <aside className="space-y-4">
          {technologies.length > 0 && (
            <div className="rounded-lg border border-border/70 bg-card p-5">
              <h2 className="font-semibold tracking-tight">Technologies</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="rounded-md">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {project.repositories.length > 0 && (
            <div className="rounded-lg border border-border/70 bg-card p-5">
              <LanguageBreakdown repos={project.repositories} />
            </div>
          )}

          <div className="rounded-lg border border-border/70 bg-card p-5">
            <h2 className="font-semibold tracking-tight">Backend Mapping</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Source route</dt>
                <dd className="font-mono text-xs">GET /projects/{project.slug}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Project type</dt>
                <dd>{formatCategory(project.category)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">RAG-indexed repositories</dt>
                <dd>{repositoriesWithDocs.length}</dd>
              </div>
            </dl>
          </div>

          {(demoLinks.length > 0 || project.repositories.length > 0) && (
            <div className="rounded-lg border border-border/70 bg-card p-5">
              <h2 className="font-semibold tracking-tight">Links</h2>
              <div className="mt-4 grid gap-2">
                {project.repositories.map((repo) => (
                  <Link
                    key={repo.id}
                    href={`/github/${repo.name}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-border/70 p-3 text-sm hover:border-foreground/20"
                  >
                    <span className="flex items-center gap-2">
                      <GitBranch className="size-4 text-muted-foreground" aria-hidden />
                      {repo.name}
                    </span>
                    <ExternalLink className="size-3.5 text-muted-foreground" aria-hidden />
                  </Link>
                ))}
                {demoLinks.map((repo) => (
                  <Link
                    key={`${repo.id}-demo`}
                    href={repo.homepage ?? repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-md border border-border/70 p-3 text-sm hover:border-foreground/20"
                  >
                    <span className="flex items-center gap-2">
                      <RadioTower className="size-4 text-muted-foreground" aria-hidden />
                      {repo.name} live link
                    </span>
                    <ExternalLink className="size-3.5 text-muted-foreground" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
