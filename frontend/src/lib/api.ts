import type {
  AskResponse,
  PortfolioDocument,
  Project,
  Repository,
  RepositoryCategory,
  RepositoryDetail,
  SearchResponse,
  SyncResult,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        ...(init?.body && !(init.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...init?.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Could not reach the portfolio API. It may be temporarily unavailable.");
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

export function askPortfolio(question: string): Promise<AskResponse> {
  return apiFetch<AskResponse>("/ask", { method: "POST", body: JSON.stringify({ question }) });
}

export function semanticSearch(query: string): Promise<SearchResponse> {
  return apiFetch<SearchResponse>(`/search?q=${encodeURIComponent(query)}`);
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

export function adminLogin(password: string): Promise<void> {
  return apiFetch<void>("/admin/login", { method: "POST", body: JSON.stringify({ password }) });
}

export function adminLogout(): Promise<void> {
  return apiFetch<void>("/admin/logout", { method: "POST" });
}

export function listDocuments(): Promise<PortfolioDocument[]> {
  return apiFetch<PortfolioDocument[]>("/documents");
}

export function uploadDocument(file: File, title?: string): Promise<PortfolioDocument> {
  const form = new FormData();
  form.append("file", file);
  if (title) form.append("title", title);
  const params = title ? `?title=${encodeURIComponent(title)}` : "";
  return apiFetch<PortfolioDocument>(`/documents${params}`, { method: "POST", body: form });
}

export function deleteDocument(id: string): Promise<void> {
  return apiFetch<void>(`/documents/${id}`, { method: "DELETE" });
}

export function triggerGithubSync(): Promise<SyncResult> {
  return apiFetch<SyncResult>("/github/sync", { method: "POST" });
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
