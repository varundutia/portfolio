from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    routes_ask,
    routes_auth,
    routes_documents,
    routes_github,
    routes_health,
    routes_projects,
    routes_search,
)
from app.core.config import get_settings
from app.core.errors import register_error_handlers

settings = get_settings()

app = FastAPI(
    title="Portfolio API",
    description="Document ingestion, hybrid RAG retrieval, GitHub sync, and citation-validated "
    "answer generation for an AI-powered engineering portfolio.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_error_handlers(app)

app.include_router(routes_health.router)
app.include_router(routes_auth.router)
app.include_router(routes_documents.router)
app.include_router(routes_github.router)
app.include_router(routes_search.router)
app.include_router(routes_ask.router)
app.include_router(routes_projects.router)
