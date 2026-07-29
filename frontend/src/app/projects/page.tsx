import type { Metadata } from "next";

import { RepoCard } from "@/components/github/repo-card";
import { ApiError, listProjects, listRepositories } from "@/lib/api";
import type { Project, Repository } from "@/lib/types";

export const metadata: Metadata = { title: "Projects" };

const CATEGORY_ORDER = ["flagship", "supporting", "experiment", "academic", "archived"] as const;
const CATEGORY_LABEL: Record<string, string> = {
  flagship: "Flagship",
  supporting: "Supporting",
  experiment: "Experiments",
  academic: "Academic",
  archived: "Archived",
};

export default async function ProjectsPage() {
  let projects: Project[] = [];
  let repos: Repository[] = [];
  let error: string | null = null;

  try {
    [projects, repos] = await Promise.all([listProjects(), listRepositories()]);
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Could not load projects right now.";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Projects</h1>
        <p className="text-muted-foreground">
          Curated from GitHub repositories and the documents that explain the context behind them.
          Category reflects editorial curation, not popularity.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!error && projects.length === 0 && repos.length === 0 && (
        <p className="text-sm text-muted-foreground">No projects have been curated yet.</p>
      )}

      {!error && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-border/60 bg-card p-4">
              <h2 className="font-medium">{project.title}</h2>
              <div className="mt-3 space-y-3">
                {project.repositories.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!error && projects.length === 0 && repos.length > 0 && (
        <div className="space-y-10">
          {CATEGORY_ORDER.map((category) => {
            const inCategory = repos.filter((r) => r.category === category);
            if (inCategory.length === 0) return null;
            return (
              <section key={category} className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {CATEGORY_LABEL[category]}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {inCategory.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
