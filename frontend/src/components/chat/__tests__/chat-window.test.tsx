import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ChatWindow } from "@/components/chat/chat-window";
import { ApiError, askPortfolio } from "@/lib/api";
import type { AskResponse } from "@/lib/types";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, askPortfolio: vi.fn() };
});

const mockAsk = vi.mocked(askPortfolio);

const SAMPLE_RESPONSE: AskResponse = {
  answer: "Varun built a payment microservice [1].",
  is_generated: true,
  was_refused: false,
  citations: [
    {
      index: 1,
      source_title: "Resume",
      source_url: null,
      page_number: 1,
      section_heading: null,
      source_type: "document",
    },
  ],
  evidence: [
    {
      content: "Built a payment microservice processing transactions.",
      source_title: "Resume",
      source_url: null,
      page_number: 1,
      section_heading: null,
      source_type: "document",
      score: 0.8,
    },
  ],
};

describe("ChatWindow", () => {
  beforeEach(() => {
    mockAsk.mockReset();
  });

  it("shows suggested questions before any exchange", () => {
    render(<ChatWindow />);
    expect(screen.getByText(/ask about experience, projects/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBeGreaterThan(1);
  });

  it("shows a loading state, then the answer and citations on success", async () => {
    let resolvePromise: (value: AskResponse) => void = () => {};
    mockAsk.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    const user = userEvent.setup();
    render(<ChatWindow />);

    const input = screen.getByLabelText(/ask a question/i);
    await user.type(input, "What backend work has Varun done?");
    await user.click(screen.getByLabelText(/send question/i));

    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);

    resolvePromise(SAMPLE_RESPONSE);

    await waitFor(() => {
      expect(screen.getByText(/payment microservice/i)).toBeInTheDocument();
    });
    expect(screen.getByText("Resume")).toBeInTheDocument();
  });

  it("shows an error state with a working retry button", async () => {
    mockAsk.mockRejectedValueOnce(new ApiError(500, "Something went wrong."));
    mockAsk.mockResolvedValueOnce(SAMPLE_RESPONSE);

    const user = userEvent.setup();
    render(<ChatWindow />);

    await user.type(screen.getByLabelText(/ask a question/i), "test question");
    await user.click(screen.getByLabelText(/send question/i));

    await waitFor(() => expect(screen.getByText("Something went wrong.")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /retry/i }));

    await waitFor(() => {
      expect(screen.getByText(/payment microservice/i)).toBeInTheDocument();
    });
    expect(mockAsk).toHaveBeenCalledTimes(2);
  });
});
