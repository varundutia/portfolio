export type SourceType = "document" | "repo_readme" | "repo_file";

export type RepositoryCategory =
  | "flagship"
  | "supporting"
  | "experiment"
  | "academic"
  | "archived"
  | "hidden";

export interface Citation {
  index: number;
  source_title: string;
  source_url: string | null;
  page_number: number | null;
  section_heading: string | null;
  source_type: SourceType;
}

export interface Evidence {
  content: string;
  source_title: string;
  source_url: string | null;
  page_number: number | null;
  section_heading: string | null;
  source_type: SourceType;
  score: number;
}

export interface AskResponse {
  answer: string;
  is_generated: boolean;
  was_refused: boolean;
  citations: Citation[];
  evidence: Evidence[];
}

export interface SearchResult {
  chunk_id: string;
  content: string;
  score: number;
  page_number: number | null;
  section_heading: string | null;
  source_type: SourceType;
  source_title: string;
  source_url: string | null;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export interface Repository {
  id: string;
  full_name: string;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  topics: string[];
  primary_language: string | null;
  languages: Record<string, number>;
  stars: number;
  forks: number;
  open_issues: number;
  is_fork: boolean;
  is_archived: boolean;
  category: RepositoryCategory;
  featured: boolean;
  is_selected_for_rag: boolean;
  latest_release_tag: string | null;
  latest_release_published_at: string | null;
  last_meaningful_commit_at: string | null;
  repo_created_at: string | null;
  repo_pushed_at: string | null;
  last_synced_at: string | null;
}

export interface RepositoryFile {
  id: string;
  path: string;
  kind: string;
  content: string;
  github_url: string;
  last_synced_at: string;
}

export interface RepositoryDetail extends Repository {
  files: RepositoryFile[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: RepositoryCategory;
  featured: boolean;
  repositories: Repository[];
}

export interface DocumentVersion {
  id: string;
  version_number: number;
  checksum: string;
  page_count: number | null;
  extraction_method: string | null;
  status: string;
  status_detail: string | null;
  created_at: string;
}

export interface PortfolioDocument {
  id: string;
  title: string;
  original_filename: string;
  file_type: string;
  status: string;
  status_detail: string | null;
  current_version_id: string | null;
  created_at: string;
  versions: DocumentVersion[];
}

export interface SyncResult {
  repositories_synced: number;
  documentation_files_indexed: number;
  documentation_files_unchanged: number;
  errors: string[];
}

export interface HealthStatus {
  status: "ok" | "degraded" | string;
  database: boolean;
  embedding_provider: string;
  llm_provider: string;
}
