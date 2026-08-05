import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, GitBranch, Layers3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiError, listProjects } from "@/lib/api";
import type { Project, Repository } from "@/lib/types";

export const metadata: Metadata = { title: "Projects" };

function formatCategory(category: string): string {
  return category
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function technologies(repositories: Repository[]): string[] {
  const names = new Set<string>();
  for (const repo of repositories) {
    if (repo.primary_language) names.add(repo.primary_language);
    for (const topic of repo.topics.slice(0, 3)) names.add(topic);
  }
  return [...names].slice(0, 5);
}

function ProjectCard({ project }: { project: Project }) {
  const tech = technologies(project.repositories);
  const liveRepo = project.repositories.find((repo) => repo.homepage);
  const githubRepo = project.repositories[0];

  return (
    <article className="rounded-lg border border-border/70 bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
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
          <h2 className="mt-4 text-xl font-semibold tracking-tight">{project.title}</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers3 className="size-4" aria-hidden />
          {project.repositories.length} repo{project.repositories.length === 1 ? "" : "s"}
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Backend-curated project linked to synced GitHub repository data. Details, languages,
        topics, activity, README content, and external links stay server-side sourced.
      </p>

      {tech.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tech.map((item) => (
            <Badge key={item} variant="outline" className="rounded-md">
              {item}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Button size="sm" render={<Link href={`/projects/${project.slug}`} />}>
          Case study <ArrowRight className="size-3.5" aria-hidden />
        </Button>
        {githubRepo && (
          <Button
            size="sm"
            variant="outline"
            render={<Link href={githubRepo.url} target="_blank" rel="noreferrer" />}
          >
            <GitBranch className="size-3.5" aria-hidden /> GitHub
          </Button>
        )}
        {liveRepo?.homepage && (
          <Button
            size="sm"
            variant="outline"
            render={<Link href={liveRepo.homepage} target="_blank" rel="noreferrer" />}
          >
            <ExternalLink className="size-3.5" aria-hidden /> Live
          </Button>
        )}
      </div>
    </article>
  );
}

export default async function ProjectsPage() {
  let projects: Project[] = [];
  let error: string | null = null;

  try {
    projects = await listProjects();
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Could not load projects right now.";
  }

  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 max-w-3xl">
        <p className="font-mono text-xs uppercase text-muted-foreground">Backend Projects</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
        <p className="mt-3 text-muted-foreground">
          Curated project records from the Python backend, enriched by linked repository metadata
          synced server-side from GitHub.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
          {error}
        </div>
      )}

      {!error && projects.length === 0 && (
        <div className="rounded-lg border border-border/70 bg-card p-5 text-sm text-muted-foreground">
          No backend projects have been created yet. Once repositories are synced and curated,
          projects created in the admin-backed API will appear here.
        </div>
      )}

      {!error && projects.length > 0 && (
        <div className="space-y-10">
          {featured.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-medium text-muted-foreground">Featured</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {featured.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-medium text-muted-foreground">All Projects</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {rest.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
