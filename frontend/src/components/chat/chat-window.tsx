"use client";

import { useState } from "react";
import { RotateCcw, Send } from "lucide-react";

import { AnswerMessage } from "@/components/chat/answer-message";
import { SuggestedQuestions } from "@/components/chat/suggested-questions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, askPortfolio } from "@/lib/api";
import type { AskResponse } from "@/lib/types";

interface Exchange {
  id: string;
  question: string;
  response?: AskResponse;
  error?: string;
  loading: boolean;
}

export function ChatWindow() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [input, setInput] = useState("");

  async function runQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    const id = crypto.randomUUID();
    setExchanges((prev) => [...prev, { id, question: trimmed, loading: true }]);
    setInput("");

    try {
      const response = await askPortfolio(trimmed);
      setExchanges((prev) => prev.map((e) => (e.id === id ? { ...e, response, loading: false } : e)));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setExchanges((prev) => prev.map((e) => (e.id === id ? { ...e, error: message, loading: false } : e)));
    }
  }

  function retry(question: string, id: string) {
    setExchanges((prev) => prev.filter((e) => e.id !== id));
    void runQuestion(question);
  }

  return (
    <div className="space-y-6">
      {exchanges.length === 0 && (
        <div className="space-y-3 rounded-xl border border-dashed border-border/70 p-4">
          <p className="text-sm text-muted-foreground">
            Ask about experience, projects, skills, or specific technologies. Answers are grounded
            only in uploaded documents and selected GitHub repositories, with citations you can
            verify.
          </p>
          <SuggestedQuestions onSelect={(q) => void runQuestion(q)} />
        </div>
      )}

      <div className="space-y-4">
        {exchanges.map((exchange) => (
          <div key={exchange.id} className="space-y-2">
            <div className="ml-auto w-fit max-w-[85%] rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">
              {exchange.question}
            </div>

            {exchange.loading && (
              <div className="space-y-2 rounded-xl border border-border/60 bg-card p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}

            {exchange.error && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <span>{exchange.error}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => retry(exchange.question, exchange.id)}
                >
                  <RotateCcw className="size-3.5" /> Retry
                </Button>
              </div>
            )}

            {exchange.response && <AnswerMessage response={exchange.response} />}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void runQuestion(input);
        }}
        className="flex items-center gap-2 rounded-xl border border-border/70 bg-card p-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about experience, projects, or a specific technology…"
          className="flex-1 bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Ask a question about Varun's portfolio"
        />
        <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send question">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
