import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { SourceBadge } from "@/components/evidence/source-badge";
import type { SourceType } from "@/lib/types";

interface EvidenceCardProps {
  sourceType: SourceType;
  sourceTitle: string;
  sourceUrl: string | null;
  pageNumber: number | null;
  sectionHeading: string | null;
  index?: number;
  snippet?: string;
}

export function EvidenceCard({
  sourceType,
  sourceTitle,
  sourceUrl,
  pageNumber,
  sectionHeading,
  index,
  snippet,
}: EvidenceCardProps) {
  const location = pageNumber ? `page ${pageNumber}` : sectionHeading || null;

  return (
    <div className="rounded-lg border border-border/60 bg-card p-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        {index != null && <span className="font-mono text-xs text-muted-foreground">[{index}]</span>}
        <SourceBadge sourceType={sourceType} />
        <span className="min-w-0 break-words font-medium">{sourceTitle}</span>
        {location && <span className="text-xs text-muted-foreground">— {location}</span>}
        {sourceUrl && (
          <Link
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View source <ExternalLink className="size-3" />
          </Link>
        )}
      </div>
      {snippet && <p className="mt-2 line-clamp-4 text-muted-foreground">{snippet}</p>}
    </div>
  );
}
