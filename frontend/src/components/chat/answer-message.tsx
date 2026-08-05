"use client";

import { useState } from "react";
import { ChevronDown, ShieldAlert } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { EvidenceCard } from "@/components/evidence/evidence-card";
import type { AskResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AnswerMessage({ response }: { response: AskResponse }) {
  const [showEvidence, setShowEvidence] = useState(false);

  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4">
      {!response.is_generated && (
        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400">
          <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
          <span>
            No LLM provider is configured on this deployment, so this is not a generated answer —
            it&apos;s the honest evidence retrieved for your question, shown below with citations.
          </span>
        </div>
      )}

      <div className="prose prose-sm max-w-none break-words dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-strong:font-semibold">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            ),
            img: () => null,
          }}
        >
          {response.answer}
        </ReactMarkdown>
      </div>

      {response.citations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Citations</p>
          <div className="space-y-2">
            {response.citations.map((citation) => (
              <EvidenceCard
                key={citation.index}
                index={citation.index}
                sourceType={citation.source_type}
                sourceTitle={citation.source_title}
                sourceUrl={citation.source_url}
                pageNumber={citation.page_number}
                sectionHeading={citation.section_heading}
              />
            ))}
          </div>
        </div>
      )}

      {response.evidence.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowEvidence((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronDown className={cn("size-3.5 transition-transform", showEvidence && "rotate-180")} />
            {showEvidence ? "Hide" : "Inspect"} all retrieved evidence ({response.evidence.length})
          </button>
          {showEvidence && (
            <div className="mt-2 space-y-2">
              {response.evidence.map((e, i) => (
                <EvidenceCard
                  key={`${e.source_title}-${i}`}
                  sourceType={e.source_type}
                  sourceTitle={e.source_title}
                  sourceUrl={e.source_url}
                  pageNumber={e.page_number}
                  sectionHeading={e.section_heading}
                  snippet={e.content}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
