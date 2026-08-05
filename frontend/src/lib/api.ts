import type {
  AskResponse,
  HealthStatus,
  PortfolioDocument,
  Project,
  Repository,
  RepositoryCategory,
  RepositoryDetail,
  SearchResponse,
  SyncResult,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const DEFAULT_TIMEOUT_MS = 20_000;
const RAG_TIMEOUT_MS = 60_000;
const MUTATION_TIMEOUT_MS = 120_000;

type ApiRequestInit = RequestInit & {
  timeoutMs?: number;
};

export function documentFileUrl(documentId: string): string {
  return `${API_URL}/documents/${documentId}/file`;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...requestInit } = init ?? {};
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...requestInit,
      credentials: "include",
      headers: {
        ...(requestInit.body && !(requestInit.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...requestInit.headers,
      },
      cache: "no-store",
      signal: requestInit.signal ?? timeoutSignal,
    });
  } catch (err) {
    const isTimeout =
      err instanceof DOMException && (err.name === "TimeoutError" || err.name === "AbortError");
    const message =
      isTimeout
        ? "The portfolio API is still working on that request. Please try again in a moment."
        : "Could not reach the portfolio API. It may be temporarily unavailable.";
    throw new ApiError(0, message);
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") message = body.detail;
    } catch {
      // response had no JSON body; keep the generic message
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getHealth(): Promise<HealthStatus> {
  return apiFetch<HealthStatus>("/health");
}

export function askPortfolio(question: string): Promise<AskResponse> {
  return apiFetch<AskResponse>("/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
    timeoutMs: RAG_TIMEOUT_MS,
  });
}

export function semanticSearch(query: string): Promise<SearchResponse> {
  return apiFetch<SearchResponse>(`/search?q=${encodeURIComponent(query)}`, {
    timeoutMs: RAG_TIMEOUT_MS,
  });
}

export function listProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/projects");
}

export function getProject(slug: string): Promise<Project> {
  return apiFetch<Project>(`/projects/${encodeURIComponent(slug)}`);
}

export function listRepositories(): Promise<Repository[]> {
  return apiFetch<Repository[]>("/github/repositories");
}

export function getRepository(fullNameOrName: string): Promise<RepositoryDetail> {
  return apiFetch<RepositoryDetail>(`/github/repositories/${fullNameOrName}`);
}

export function listDocuments(): Promise<PortfolioDocument[]> {
  return apiFetch<PortfolioDocument[]>("/documents");
}

export function uploadDocument(file: File, title?: string): Promise<PortfolioDocument> {
  const form = new FormData();
  form.append("file", file);
  if (title) form.append("title", title);
  const params = title ? `?title=${encodeURIComponent(title)}` : "";
  return apiFetch<PortfolioDocument>(`/documents${params}`, {
    method: "POST",
    body: form,
    timeoutMs: MUTATION_TIMEOUT_MS,
  });
}

export function deleteDocument(id: string): Promise<void> {
  return apiFetch<void>(`/documents/${id}`, { method: "DELETE" });
}

export function triggerGithubSync(): Promise<SyncResult> {
  return apiFetch<SyncResult>("/github/sync", { method: "POST", timeoutMs: MUTATION_TIMEOUT_MS });
}

export function listRepositoriesAdmin(): Promise<Repository[]> {
  return apiFetch<Repository[]>("/github/repositories-admin");
}

export function updateRepositoryCuration(
  id: string,
  payload: Partial<{
    category: RepositoryCategory;
    featured: boolean;
    is_selected_for_rag: boolean;
    curation_note: string;
  }>,
): Promise<Repository> {
  return apiFetch<Repository>(`/github/repositories/${id}/curation`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
