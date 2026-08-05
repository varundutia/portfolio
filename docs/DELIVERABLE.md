# Deliverable — Phase 1 (MVP)

This is a phased build. Phase 1 ships a real, working, end-to-end slice of the platform
described in the full spec; the more exotic sections are deliberately deferred (see
"Out of scope" below) so nothing ships half-working. Plan file for this phase:
`.claude/plans/witty-plotting-chipmunk.md` (referenced from the session that built this).

## Architecture

```
frontend/   Next.js 16 (App Router) + TypeScript (strict) + Tailwind v4 + shadcn/ui (Base UI)
backend/    FastAPI + SQLAlchemy 2.0 + Alembic, Python 3.11+, typed
Postgres    pgvector for embeddings, native full-text search (tsvector/GIN) for keyword search
```

Every displayed fact traces back to a `Source` row (an uploaded document version, or a synced
GitHub README/doc file) through `Chunk` rows carrying page/section metadata — this is the
traceability backbone the whole retrieval and citation system is built on.

AI providers are swappable via env vars, not hardcoded:
- **Embeddings**: `fastembed` (local, ONNX, CPU, no API key) is the default so semantic search
  works with zero cost/config. `openai` and `voyage` adapters exist and activate via
  `EMBEDDING_PROVIDER`.
- **Generation**: `stub` (no live LLM calls, returns real retrieved evidence + an honest
  "not configured" message) is the default. `anthropic` and `openai` adapters exist and
  activate via `LLM_PROVIDER` + the matching API key — no code changes needed to turn on real
  generated answers.

## Product features implemented

- **Home** — hero/positioning, featured projects, recent engineering activity, code-composition
  overview, Ask/Search entry points. Degrades gracefully (empty states) if nothing is synced yet.
- **Projects** — curated project cards; falls back to categorized GitHub repositories if no
  `Project` entities have been created yet, so the page isn't empty on day one.
- **Experience** — evidence retrieved live from uploaded documents (resume, letters), not
  hardcoded prose.
- **Ask My Portfolio** — grounded RAG chat. Shows retrieved evidence + validated citations even
  when generation is unconfigured (stub), rather than hiding the feature.
- **Semantic Search** — structured result cards (hybrid vector + keyword), not a text blob.
- **GitHub Explorer** — repository list/detail pages reading from the Postgres cache (never live
  GitHub calls on page load), README rendering, code-composition bar.
- **About** — evidence-sourced summary snippet + code composition, no self-rated skills.
- **Resume** — serves the actual uploaded resume file (download endpoint), not a hardcoded page.
- **Contact** — link routing only (email/GitHub/LinkedIn), explicitly not a claims source.
- **Admin** (`/admin`, noindex) — document upload/list/delete, GitHub sync
  trigger, per-repository curation (category, featured, RAG-indexed toggle).

## Backend modules

- `app/core` — env-driven settings and centralized error handling (no stack
  traces leaked to clients)
- `app/models` — `Document`/`DocumentVersion`, `Repository`/`RepositoryFile`, `Source` (the
  unifying citation pointer), `Chunk` (pgvector + tsvector), `Project` + link tables, `QueryLog`
- `app/services/providers` — `EmbeddingProvider`/`LLMProvider` interfaces + fastembed/OpenAI/
  Voyage/Anthropic/stub implementations, selected by a factory
- `app/services/ingestion` — text extraction (PDF page-level via pypdf, DOCX via python-docx,
  MD/TXT with heading-aware section splitting; OCR hook that degrades gracefully if
  `pytesseract`/`pdf2image` aren't installed rather than crashing), paragraph-aware chunking
  with overlap, checksum-based dedup, versioning (old chunks deactivated, not deleted)
- `app/services/github` — GitHub REST client + on-demand sync (repos, languages, README, a
  bounded `docs/*.md` set, latest release, latest meaningful commit); only re-embeds
  README/doc content whose checksum actually changed
- `app/services/retrieval.py` — hybrid search: pgvector cosine + Postgres `ts_rank`, weighted
  merge (query-length heuristic shifts weight toward keyword matching for short/technology-name
  queries), relevance threshold, dedup
- `app/services/answer.py` — grounded prompt construction (evidence-as-data / prompt-injection
  defense baked into the system prompt), citation-marker parsing, **server-side citation
  validation that only trusts markers matching an actually-retrieved chunk**
- `app/api` — `/documents`, `/github`, `/search`, `/ask`, `/projects`, `/admin` (login/logout),
  `/health`

## Frontend sections

Shared: `lib/api.ts` (typed fetch client), `components/evidence/*` (citation pill + evidence
card reused by chat, search, and content pages), `components/chat/*`, `components/search/*`,
`components/github/*` (repo card, language-composition bar — explicitly labeled "code
composition," never "skill proficiency"), `components/admin/*`.

## Database model

`documents` → `document_versions` → `sources` ← `repositories`/`repository_files`, all feeding
`chunks` (pgvector + tsvector). `projects` links to `repositories`/`sources` via join tables —
deliberately no authored-prose columns, so project content is always assembled from real
sources at request time. `query_logs` records every Ask-My-Portfolio exchange with its
retrieved chunk IDs and validated citations, for future eval/admin tooling.

## GitHub functionality

On-demand sync (admin-triggered) pulling profile/repo metadata, languages, topics, README,
a bounded `docs/*.md` set, latest release, latest meaningful commit date. Repositories default
to `hidden` until curated (category + featured + RAG-indexed flags, all admin-controlled) —
nothing is auto-published. The public site reads only from Postgres, never GitHub live.

## RAG functionality

Hybrid retrieval (vector + keyword) → relevance threshold → grounded prompt with numbered
evidence blocks → LLM generation (stub by default) → citation-marker parsing → **server-side
validation against the real retrieved set** → response. Citations that don't match a real
retrieved chunk are dropped, never displayed. Empty retrieval short-circuits to the
"not enough evidence" message without even calling the LLM.

## Document formats supported

PDF (page-level extraction + OCR fallback hook), DOCX, Markdown, TXT.

## Tests

Backend (pytest), DB-independent tests all passing in this sandbox (`24 passed, 7 skipped`
— skips are the Postgres-dependent tests, see Known Limitations):
- Chunking correctness, page-number/section-heading preservation, oversized-paragraph
  splitting (two real bugs were caught and fixed here — see below)
- Citation validation: accepts in-range markers, **rejects out-of-range markers**, dedupes,
  preserves order, handles empty retrieval
- Prompt-injection resistance: malicious evidence content is embedded as inert data, never
  interpreted; injected citation markers pointing outside the retrieved set are dropped even
  if a model complied with them; the default stub provider cannot be prompt-injected at all
  since it never calls a model
- GitHub JSON → `Repository` field mapping (pure function, no network/DB)
- Provider factory selection + required-API-key validation for every provider
- Hybrid retrieval merge/threshold logic and version-supersession (Postgres-dependent, present
  but unexecuted here — see below)

Frontend (Vitest + Testing Library), `7 passed`: loading/empty/error states and retry behavior
for the chat and search components.

Backend: `ruff check` and `mypy` clean. Frontend: `eslint` and `tsc --noEmit` clean, production
`next build` succeeds (pages needing live data correctly render as dynamic routes rather than
being statically prerendered against no data).

## Files created / modified

~75 new backend files, ~45 new frontend files, plus root-level `docker-compose.yml`,
`render.yaml`, `README.md`, this file. No pre-existing code was modified — the previous CRA
site had already been deleted (confirmed intentional) before this session began.

## Known limitations

- **No Docker/Postgres/Homebrew available in the sandbox this was built in.** The 7
  Postgres-dependent backend tests (dedup/versioning, hybrid retrieval, active-chunk filtering)
  are written and correct by inspection but have **not been executed** — run them yourself via
  `docker compose up -d db && cd backend && TEST_DATABASE_URL=postgresql+psycopg://portfolio:portfolio@localhost:5432/portfolio_test pytest`.
- **No document ingestion or GitHub sync has actually been run.** The seed PDFs discussed in
  planning were never ingested — do this yourself via the admin UI after standing up the stack
  (`docker compose up`, `alembic upgrade head`, open `/admin`, upload documents, trigger a GitHub sync, then curate repository
  categories/featured flags — the Projects/GitHub Explorer/Home pages stay empty until you do).
- **Nothing has been deployed.** Vercel/Render/Neon configs are prepared but require your own
  accounts/credentials to actually provision.
- Real embedding/generation providers (Voyage/OpenAI/Anthropic) are implemented but unexercised
  — only the local `fastembed` + `stub` default path has run (via unit tests with a fake
  embedder).
- Reranking is a documented no-op passthrough — worth revisiting once real usage shows retrieval
  quality issues.

## Out of scope this phase (by design, agreed with you up front)

Engineering Journey, Engineering DNA, Project Relationship Graph, Architecture Explorer, Role
Match, full Admin CRUD (chunk preview/edit, failed-job review, suggested-question management),
and the AI Evaluation harness. The data model (`sources`, `chunks`, `query_logs`, project link
tables) was deliberately shaped so these can be added later without a rearchitecture.

## Sensible next steps

1. Stand up Postgres locally, run migrations, ingest real documents, sync GitHub, curate repos.
2. Run the full test suite against real Postgres to confirm the retrieval/dedup tests actually
   pass (not just read-correct).
3. Pick and wire a real LLM provider (Anthropic recommended, given the existing ecosystem) once
   ready to enable generated answers.
4. Deploy: Vercel (frontend) + Render (backend) + Neon (Postgres) — configs are ready, just need
   your accounts.
5. Then pick up the deferred sections one at a time, starting with whichever tells your story
   best — Engineering DNA and Role Match are probably the highest-leverage next builds.
