# Deployment Guide

Use Vercel for the Next.js frontend and Render for the FastAPI backend.

## 1. Deploy Backend On Render

Create or sync the Render service from `render.yaml`.

Render service settings:

- Runtime: Docker
- Dockerfile path: `./backend/Dockerfile`
- Docker context: `./backend`
- Health check path: `/health`
- Persistent disk mount path: `/app/storage`

Required environment variables:

```bash
DATABASE_URL=<production postgres url>
GITHUB_USERNAME=varundutia
GITHUB_TOKEN=<github token>
EMBEDDING_PROVIDER=fastembed
EMBEDDING_DIMENSIONS=384
LLM_PROVIDER=gemini
GEMINI_API_KEY=<gemini api key>
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_MAX_OUTPUT_TOKENS=512
FRONTEND_ORIGIN=https://varundutia.live
FRONTEND_ORIGINS=https://varundutia.live,https://www.varundutia.live
STORAGE_DIR=/app/storage
```

After the backend deploys, verify:

```bash
curl https://<render-service>.onrender.com/health
```

Expected result: `database` is `true` and `llm_provider` is `gemini`.

## 2. Deploy Frontend On Vercel

Import the same GitHub repo into Vercel and set:

- Root Directory: `frontend`
- Framework Preset: Next.js
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `.next`

Required Vercel environment variable:

```bash
NEXT_PUBLIC_API_URL=https://<render-service>.onrender.com
```

Set it for Production and Preview, then redeploy. Next.js bakes `NEXT_PUBLIC_*` values into the build, so changing this value requires a new deployment.

## 3. Custom Domain

Point `varundutia.live` at the Vercel project. Then make sure Render has:

```bash
FRONTEND_ORIGIN=https://varundutia.live
FRONTEND_ORIGINS=https://varundutia.live,https://www.varundutia.live
```

## 4. Common Issues

- Frontend says API unavailable: check `NEXT_PUBLIC_API_URL` in Vercel and redeploy.
- Browser CORS error: add the exact Vercel/custom domain to `FRONTEND_ORIGIN` or `FRONTEND_ORIGINS` on Render.
- Render deploy cannot bind port: make sure the Docker command uses `${PORT:-8000}`.
- Generated answers are disabled: check `LLM_PROVIDER=gemini` and `GEMINI_API_KEY`.
- Uploaded PDFs disappear after redeploy: attach the Render disk and keep `STORAGE_DIR=/app/storage`.
- Database errors on first deploy: confirm Postgres supports `pgvector` and the `DATABASE_URL` is the external connection string.
