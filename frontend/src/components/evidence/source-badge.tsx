import { FileText, GitBranch, BookOpen, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { SourceType } from "@/lib/types";

const ICONS: Record<SourceType, LucideIcon> = {
  document: FileText,
  repo_readme: GitBranch,
  repo_file: BookOpen,
};

const LABELS: Record<SourceType, string> = {
  document: "Document",
  repo_readme: "GitHub README",
  repo_file: "GitHub file",
};

export function SourceBadge({ sourceType }: { sourceType: SourceType }) {
  const Icon = ICONS[sourceType];
  return (
    <Badge variant="outline" className="gap-1 font-normal text-muted-foreground">
      <Icon className="size-3" />
      {LABELS[sourceType]}
    </Badge>
  );
}
