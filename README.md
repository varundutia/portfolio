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

## Scope

This build is a deliberately phased MVP. See `docs/DELIVERABLE.md` for what's implemented, what's
out of scope, and known limitations.
