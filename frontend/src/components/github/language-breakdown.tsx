import type { Repository } from "@/lib/types";

const SERIES_VARS = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
  "var(--series-7)",
  "var(--series-8)",
];
const MAX_SLOTS = SERIES_VARS.length;

function aggregateLanguages(repos: Repository[]): { name: string; bytes: number }[] {
  const totals = new Map<string, number>();
  for (const repo of repos) {
    for (const [language, bytes] of Object.entries(repo.languages)) {
      totals.set(language, (totals.get(language) ?? 0) + bytes);
    }
  }
  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  if (sorted.length <= MAX_SLOTS) {
    return sorted.map(([name, bytes]) => ({ name, bytes }));
  }
  const top = sorted.slice(0, MAX_SLOTS - 1);
  const otherBytes = sorted.slice(MAX_SLOTS - 1).reduce((sum, [, bytes]) => sum + bytes, 0);
  return [...top.map(([name, bytes]) => ({ name, bytes })), { name: "Other", bytes: otherBytes }];
}

export function LanguageBreakdown({ repos }: { repos: Repository[] }) {
  const languages = aggregateLanguages(repos.filter((r) => Object.keys(r.languages).length > 0));
  const total = languages.reduce((sum, l) => sum + l.bytes, 0);

  if (total === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">Code composition across selected repositories</p>
        <p className="text-xs text-muted-foreground">
          Proportional to bytes of code per language, as reported by GitHub — not a measure of
          skill or proficiency.
        </p>
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label="Language composition bar">
        {languages.map((lang, i) => {
          const pct = (lang.bytes / total) * 100;
          if (pct < 0.4) return null;
          return (
            <div
              key={lang.name}
              title={`${lang.name}: ${pct.toFixed(1)}%`}
              style={{ width: `${pct}%`, backgroundColor: SERIES_VARS[i % SERIES_VARS.length] }}
              className="h-full first:rounded-l-full last:rounded-r-full"
            />
          );
        })}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {languages.map((lang, i) => (
          <li key={lang.name} className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: SERIES_VARS[i % SERIES_VARS.length] }}
              aria-hidden
            />
            <span className="text-foreground">{lang.name}</span>
            {((lang.bytes / total) * 100).toFixed(1)}%
          </li>
        ))}
      </ul>
    </div>
  );
}
