import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RepoCard } from "@/components/github/repo-card";
import { SectionHeading } from "@/components/sections/section-heading";
import type { Project, Repository } from "@/lib/types";

export function ProjectsSection({ projects, repos }: { projects: Project[]; repos: Repository[] }) {
  const featuredRepos = repos
    .filter((r) => r.category === "flagship" || r.category === "supporting")
    .slice(0, 6);

  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        description="Curated from GitHub repositories and the documents that explain the context behind them."
      />

      {projects.length === 0 && featuredRepos.length === 0 && (
        <p className="text-sm text-muted-foreground">No projects have been curated yet.</p>
      )}

      {projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-border/60 bg-card p-4">
              <h3 className="font-heading font-medium">{project.title}</h3>
              <div className="mt-3 space-y-3">
                {project.repositories.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {projects.length === 0 && featuredRepos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}

      {repos.length > featuredRepos.length && (
        <Link
          href="/github"
          className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          View all repositories <ArrowRight className="size-3.5" />
        </Link>
      )}
    </section>
  );
}
