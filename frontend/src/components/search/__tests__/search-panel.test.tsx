import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SearchPanel } from "@/components/search/search-panel";
import { ApiError, semanticSearch } from "@/lib/api";
import type { SearchResponse } from "@/lib/types";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, semanticSearch: vi.fn() };
});

const mockSearch = vi.mocked(semanticSearch);

describe("SearchPanel", () => {
  beforeEach(() => {
    mockSearch.mockReset();
  });

  it("shows example queries in the empty state", () => {
    render(<SearchPanel />);
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
  });

  it("renders structured result cards, not a text blob, on success", async () => {
    const response: SearchResponse = {
      query: "PostgreSQL",
      results: [
        {
          chunk_id: "1",
          content: "Used PostgreSQL for the payments service.",
          score: 0.7,
          page_number: null,
          section_heading: "Experience",
          source_type: "document",
          source_title: "Resume",
          source_url: null,
        },
      ],
    };
    mockSearch.mockResolvedValueOnce(response);

    const user = userEvent.setup();
    render(<SearchPanel />);

    await user.type(screen.getByLabelText(/search projects/i), "PostgreSQL");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText(/1 matching result/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/payments service/i)).toBeInTheDocument();
    expect(screen.getByText("Resume")).toBeInTheDocument();
  });

  it("shows an empty-results message when nothing sufficiently relevant is found", async () => {
    mockSearch.mockResolvedValueOnce({ query: "quantum computing", results: [] });

    const user = userEvent.setup();
    render(<SearchPanel />);

    await user.type(screen.getByLabelText(/search projects/i), "quantum computing");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText(/no sufficiently relevant evidence/i)).toBeInTheDocument();
    });
  });

  it("shows an error state on API failure", async () => {
    mockSearch.mockRejectedValueOnce(new ApiError(502, "Could not reach the portfolio API."));

    const user = userEvent.setup();
    render(<SearchPanel />);

    await user.type(screen.getByLabelText(/search projects/i), "test");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Could not reach the portfolio API.")).toBeInTheDocument();
    });
  });
});
