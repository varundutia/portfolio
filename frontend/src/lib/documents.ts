import type { PortfolioDocument } from "@/lib/types";

export function findResumeDocument(documents: PortfolioDocument[]): PortfolioDocument | undefined {
  return documents.find(
    (d) => d.status === "ready" && /resume|cv/i.test(`${d.title} ${d.original_filename}`),
  );
}
