import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RepoCard } from "@/components/github/repo-card";
import { ApiError, getProject } from "@/lib/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let project;
  try {
    project = await getProject(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">{project.title}</h1>
      <div className="space-y-4">
        {project.repositories.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}
