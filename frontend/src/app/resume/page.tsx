import type { Metadata } from "next";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ApiError, documentFileUrl, listDocuments } from "@/lib/api";
import type { PortfolioDocument } from "@/lib/types";

export const metadata: Metadata = { title: "Resume" };

function findResume(documents: PortfolioDocument[]): PortfolioDocument | undefined {
  return documents.find(
    (d) => d.status === "ready" && /resume|cv/i.test(`${d.title} ${d.original_filename}`),
  );
}

export default async function ResumePage() {
  let documents: PortfolioDocument[] = [];
  let error: string | null = null;
  try {
    documents = await listDocuments();
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Could not load the resume right now.";
  }

  const resume = findResume(documents);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Resume</h1>
        <p className="text-muted-foreground">
          Sourced directly from the uploaded resume document — download it, or use{" "}
          <a href="/ask" className="underline underline-offset-2">
            Ask My Portfolio
          </a>{" "}
          to ask about anything in it.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!error && !resume && (
        <p className="text-sm text-muted-foreground">No resume document has been uploaded yet.</p>
      )}

      {resume && (
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-4">
          <div>
            <p className="font-medium">{resume.original_filename}</p>
            <p className="text-xs text-muted-foreground">
              {resume.file_type.toUpperCase()}
              {resume.versions[0]?.page_count ? ` · ${resume.versions[0].page_count} pages` : ""}
            </p>
          </div>
          <Button size="sm" render={<a href={documentFileUrl(resume.id)} download />}>
            <Download className="size-3.5" /> Download
          </Button>
        </div>
      )}
    </div>
  );
}
