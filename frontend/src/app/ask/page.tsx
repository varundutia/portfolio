import type { Metadata } from "next";

import { ChatWindow } from "@/components/chat/chat-window";

export const metadata: Metadata = { title: "Ask My Portfolio" };

export default function AskPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ask My Portfolio</h1>
        <p className="text-muted-foreground">
          A retrieval-grounded assistant that only answers from uploaded documents and selected
          GitHub repositories — every claim is traceable to a real source, and the assistant will
          say so plainly when the evidence isn&apos;t there.
        </p>
      </div>
      <ChatWindow />
    </div>
  );
}
