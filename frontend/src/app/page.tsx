import Link from "next/link";
import { MessageSquareText, Search as SearchIcon } from "lucide-react";

import { AboutSection } from "@/components/sections/about-section";
import { AskSection } from "@/components/sections/ask-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { GithubSection } from "@/components/sections/github-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { Button } from "@/components/ui/button";
import { listDocuments, listProjects, listRepositories, semanticSearch } from "@/lib/api";
import { findResumeDocument } from "@/lib/documents";
import { siteConfig } from "@/lib/site-config";
import type { PortfolioDocument, Project, Repository, SearchResult } from "@/lib/types";

async function safely<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export default async function Home() {
  const [repos, projects, documents, aboutEvidence, experienceEvidence] = await Promise.all([
    safely<Repository[]>(listRepositories(), []),
    safely<Project[]>(listProjects(), []),
    safely<PortfolioDocument[]>(listDocuments(), []),
    safely<{ results: SearchResult[] }>(
      semanticSearch("professional summary background overview"),
      { results: [] },
    ),
    safely<{ results: SearchResult[] }>(
      semanticSearch("professional experience roles responsibilities internship academic work"),
      { results: [] },
    ),
  ]);

  const resume = findResumeDocument(documents);

  return (
    <div>
      <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <p className="mb-4 font-mono text-xs tracking-wide text-muted-foreground uppercase">
          Engineering portfolio
        </p>
        <h1 className="font-heading text-balance text-4xl font-medium tracking-tight sm:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground sm:text-lg">
          {siteConfig.tagline}. Uploaded documents explain the experience, GitHub provides live
          technical evidence, and every AI-generated answer traces back to a real source.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="#ask" />}>
            <MessageSquareText className="size-4" /> Ask My Portfolio
          </Button>
          <Button size="lg" variant="outline" render={<Link href="#projects" />}>
            <SearchIcon className="size-4" /> View projects
          </Button>
        </div>
      </section>

      <div className="divide-y divide-border/60">
        <AboutSection evidence={aboutEvidence.results.slice(0, 3)} />
        <ProjectsSection projects={projects} repos={repos} />
        <ExperienceSection evidence={experienceEvidence.results} />
        <GithubSection repos={repos} />
        <AskSection />
        <ContactSection resume={resume} />
      </div>
    </div>
  );
}
