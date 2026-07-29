import Link from "next/link";
import { ExternalLink, GitFork, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Repository } from "@/lib/types";

const CATEGORY_LABEL: Record<string, string> = {
  flagship: "Flagship",
  supporting: "Supporting",
  experiment: "Experiment",
  academic: "Academic",
  archived: "Archived",
};

function relativeActivityLabel(repo: Repository): string | null {
  const date = repo.last_meaningful_commit_at ?? repo.repo_pushed_at;
  if (!date) return null;
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
  if (days < 1) return "Latest commit today";
  if (days < 30) return `Latest commit ${days}d ago`;
  if (days < 365) return `Latest commit ${Math.floor(days / 30)}mo ago`;
  return `Latest commit ${Math.floor(days / 365)}y ago`;
}

export function RepoCard({ repo }: { repo: Repository }) {
  const activity = relativeActivityLabel(repo);

  return (
    <Card>
      <CardHeader className="px-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/github/${repo.name}`} className="font-medium hover:underline">
            {repo.name}
          </Link>
          <Badge variant="secondary">{CATEGORY_LABEL[repo.category] ?? repo.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4">
        {repo.description && <p className="text-sm text-muted-foreground">{repo.description}</p>}

        <div className="flex flex-wrap gap-1.5">
          {repo.primary_language && <Badge variant="outline">{repo.primary_language}</Badge>}
          {repo.topics.slice(0, 4).map((topic) => (
            <Badge key={topic} variant="outline" className="text-muted-foreground">
              {topic}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {activity && <span>{activity}</span>}
          {repo.latest_release_tag && <span>Latest release {repo.latest_release_tag}</span>}
          <span className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Star className="size-3" /> {repo.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="size-3" /> {repo.forks}
            </span>
            <Link href={repo.url} target="_blank" rel="noreferrer" aria-label="Open on GitHub">
              <ExternalLink className="size-3.5 hover:text-foreground" />
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
