"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

import { EvidenceCard } from "@/components/evidence/evidence-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, semanticSearch } from "@/lib/api";
import type { SearchResult } from "@/lib/types";

const EXAMPLE_QUERIES = [
  "authentication and authorization",
  "PostgreSQL",
  "event-driven architecture",
  "Flutter",
  "payment reliability",
  "distributed systems",
];

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedFor, setSearchedFor] = useState<string | null>(null);

  async function runSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const response = await semanticSearch(trimmed);
      setResults(response.results);
      setSearchedFor(trimmed);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Search failed. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void runSearch(query);
        }}
        className="flex items-center gap-2 rounded-xl border border-border/70 bg-card p-2"
      >
        <SearchIcon className="ml-1 size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. authentication, PostgreSQL, distributed systems…"
          className="flex-1 bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Search projects, experience, and documentation"
        />
        <Button type="submit" size="sm" disabled={!query.trim()}>
          Search
        </Button>
      </form>

      {results === null && !loading && (
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setQuery(example);
                void runSearch(example);
              }}
              className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {example}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {results !== null && !loading && !error && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {results.length > 0
              ? `${results.length} matching result${results.length === 1 ? "" : "s"} for "${searchedFor}"`
              : `No sufficiently relevant evidence found for "${searchedFor}".`}
          </p>
          {results.map((result) => (
            <EvidenceCard
              key={result.chunk_id}
              sourceType={result.source_type}
              sourceTitle={result.source_title}
              sourceUrl={result.source_url}
              pageNumber={result.page_number}
              sectionHeading={result.section_heading}
              snippet={result.content}
            />
          ))}
        </div>
      )}
    </div>
  );
}
