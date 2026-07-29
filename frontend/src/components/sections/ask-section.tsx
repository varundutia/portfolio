import Link from "next/link";

import { ChatWindow } from "@/components/chat/chat-window";
import { SectionHeading } from "@/components/sections/section-heading";

export function AskSection() {
  return (
    <section id="ask" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Ask AI"
        title="Ask My Portfolio"
        description="Grounded only in uploaded documents and selected GitHub repositories — every claim is traceable, and it says so plainly when the evidence isn't there."
      />
      <ChatWindow />
      <p className="mt-4 text-xs text-muted-foreground">
        Prefer structured results?{" "}
        <Link href="/search" className="underline underline-offset-2">
          Try semantic search
        </Link>
        .
      </p>
    </section>
  );
}
