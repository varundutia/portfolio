import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, GitFork, Home, Star } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageBreakdown } from "@/components/github/language-breakdown";
import { ApiError, getRepository } from "@/lib/api";
import type { RepositoryDetail } from "@/lib/types";

interface PageProps {
  params: Promise<{ repo: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { repo } = await params;
  return { title: repo };
}

export default async function RepositoryDetailPage({ params }: PageProps) {
  const { repo: repoParam } = await params;

  let repo: RepositoryDetail | null = null;
  let error: string | null = null;
  try {
    repo = await getRepository(repoParam);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    error = err instanceof ApiError ? err.message : "Could not load repository data right now.";
  }

  if (!repo) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Button variant="ghost" render={<Link href="/github" />}>
          <ArrowLeft className="size-4" aria-hidden /> Back to GitHub
        </Button>
        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
          {error}
        </div>
      </main>
    );
  }

  const readme = repo.files.find((f) => f.kind === "readme");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Button variant="ghost" render={<Link href="/github" />}>
        <ArrowLeft className="size-4" aria-hidden /> Back to GitHub
      </Button>

      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{repo.name}</h1>
          <Badge variant="secondary" className="rounded-md">
            {repo.category}
          </Badge>
        </div>
        {repo.description && <p className="text-muted-foreground">{repo.description}</p>}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3.5" /> {repo.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="size-3.5" /> {repo.forks}
          </span>
          {repo.latest_release_tag && <span>Latest release {repo.latest_release_tag}</span>}
          <Link
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-foreground"
          >
            View on GitHub <ExternalLink className="size-3.5" />
          </Link>
          {repo.homepage && (
            <Link
              href={repo.homepage}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
            >
              Live link <Home className="size-3.5" />
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {repo.primary_language && <Badge variant="outline">{repo.primary_language}</Badge>}
          {repo.topics.map((topic) => (
            <Badge key={topic} variant="outline" className="text-muted-foreground">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      {Object.keys(repo.languages).length > 0 && (
        <div className="mb-10 rounded-lg border border-border/60 bg-card p-4">
          <LanguageBreakdown repos={[repo]} />
        </div>
      )}

      {readme ? (
        <article className="prose prose-sm dark:prose-invert max-w-none rounded-lg border border-border/60 bg-card p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme.content}</ReactMarkdown>
        </article>
      ) : (
        <div className="rounded-lg border border-border/60 bg-card p-5 text-sm text-muted-foreground">
          No README or indexed documentation has been synced for this repository yet.
        </div>
      )}

      {repo.files.length > 1 && (
        <div className="mt-8 space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Indexed documentation</h2>
          <ul className="space-y-1 text-sm">
            {repo.files.map((file) => (
              <li key={file.id}>
                <Link href={file.github_url} target="_blank" rel="noreferrer" className="hover:underline">
                  {file.path}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
