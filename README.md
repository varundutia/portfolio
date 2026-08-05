# Varun Dutia — AI-Powered Engineering Portfolio

An intelligent engineering platform, not a portfolio with a chatbot bolted on. Uploaded documents
explain the experience, GitHub provides live technical evidence, and every AI-generated claim can
be traced back to a real source.

## Stack

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS — [`frontend/`](frontend/)
- **Backend**: FastAPI + SQLAlchemy + Alembic (Python, typed) — [`backend/`](backend/)
- **Database**: PostgreSQL + `pgvector` for embeddings, full-text search for keyword retrieval
- **AI**: swappable embedding/LLM providers (local `fastembed` embeddings by default; generation
  is a stub until `LLM_PROVIDER` + an API key are configured — see `backend/.env.example`)
- **GitHub**: synced into Postgres on demand; the public site never calls the GitHub API live

## Repository layout

```
backend/    FastAPI service — ingestion, retrieval, GitHub sync, RAG, admin API
frontend/   Next.js site — public pages + minimal admin UI
docker-compose.yml   Postgres (pgvector) + backend, for local dev
```

## Local development

```bash
cp backend/.env.example backend/.env      # fill in values
cp frontend/.env.example frontend/.env.local

docker compose up -d db                   # Postgres with pgvector
cd backend && pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload             # http://localhost:8000

cd ../frontend && npm install
npm run dev                               # http://localhost:3000
```

## Frontend/backend integration

The frontend reads dynamic portfolio data from the existing FastAPI routes:

- `GET /projects` and `GET /projects/{slug}` for curated project lists and detail pages.
- `GET /github/repositories` and `GET /github/repositories/{full_name}` for public repository data.
- `GET /documents` and `GET /documents/{id}/file` for resume/document-backed content.
- `GET /search`, `POST /ask`, and `GET /health` for evidence search, chat, and API status.

`NEXT_PUBLIC_API_URL` should point at the FastAPI deployment. GitHub credentials stay only in
backend environment variables (`GITHUB_USERNAME`, `GITHUB_TOKEN`) and are used by the admin-triggered
sync job, never by browser-side code.

## Deployment

Use Render for the FastAPI backend and Vercel for the Next.js frontend. The exact production
settings and required environment variables are documented in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

To use Gemini for generated answers while keeping model spend low, install backend requirements
and set:

```bash
LLM_PROVIDER=gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_MAX_OUTPUT_TOKENS=512
```

## Scope

This build is a deliberately phased MVP. See `docs/DELIVERABLE.md` for what's implemented, what's
out of scope, and known limitations.
