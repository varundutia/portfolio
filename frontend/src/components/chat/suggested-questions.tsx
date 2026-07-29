const FALLBACK_QUESTIONS = [
  "What is Varun's strongest backend experience?",
  "Which projects use PostgreSQL?",
  "Has Varun worked with authentication and authorization?",
  "Which project best demonstrates system design?",
  "What experience does Varun have with event-driven systems?",
  "Has Varun worked on payment systems?",
];

export function SuggestedQuestions({ onSelect }: { onSelect: (question: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FALLBACK_QUESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
