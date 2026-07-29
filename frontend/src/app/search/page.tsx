import type { Metadata } from "next";

import { SearchPanel } from "@/components/search/search-panel";

export const metadata: Metadata = { title: "Semantic Search" };

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Semantic Search</h1>
        <p className="text-muted-foreground">
          Search projects, experience, and documentation by meaning — not just keyword matching.
          Results are structured evidence snippets, not a generated wall of text.
        </p>
      </div>
      <SearchPanel />
    </div>
  );
}
