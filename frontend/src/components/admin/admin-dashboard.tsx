"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ApiError,
  deleteDocument,
  listDocuments,
  listRepositoriesAdmin,
  triggerGithubSync,
  updateRepositoryCuration,
  uploadDocument,
} from "@/lib/api";
import type { PortfolioDocument, Repository, RepositoryCategory, SyncResult } from "@/lib/types";

const CATEGORIES: RepositoryCategory[] = [
  "flagship",
  "supporting",
  "experiment",
  "academic",
  "archived",
  "hidden",
];

type CurationPatch = Parameters<typeof updateRepositoryCuration>[1];

export function AdminDashboard() {
  const [documents, setDocuments] = useState<PortfolioDocument[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const [docs, repoList] = await Promise.all([listDocuments(), listRepositoriesAdmin()]);
      setDocuments(docs);
      setRepos(repoList);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial admin data load on mount (also re-invoked manually after mutations below).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAll();
  }, [loadAll]);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;
    setUploading(true);
    setActionError(null);
    try {
      await uploadDocument(file);
      form.reset();
      await loadAll();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteDocument(id);
      await loadAll();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Delete failed.");
    }
  }

  async function handleSync() {
    setSyncing(true);
    setActionError(null);
    try {
      const result = await triggerGithubSync();
      setSyncResult(result);
      await loadAll();
    } catch (err) {
      setSyncResult(null);
      setActionError(err instanceof ApiError ? err.message : "Sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleCuration(id: string, patch: CurationPatch) {
    try {
      const updated = await updateRepositoryCuration(id, patch);
      setRepos((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Update failed.");
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin</h1>
      </div>

      {actionError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {actionError}
        </p>
      )}

      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <form
            onSubmit={handleUpload}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card p-3"
          >
            <input type="file" name="file" accept=".pdf,.docx,.md,.txt" className="text-sm" />
            <Button type="submit" size="sm" disabled={uploading}>
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </form>

          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.status} · v{doc.versions.length} · {doc.original_filename}
                    {doc.status_detail ? ` — ${doc.status_detail}` : ""}
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => void handleDelete(doc.id)}>
                  Delete
                </Button>
              </div>
            ))}
            {documents.length === 0 && (
              <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="github" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
            <Button size="sm" onClick={() => void handleSync()} disabled={syncing}>
              {syncing ? "Syncing…" : "Sync GitHub"}
            </Button>
            {syncResult && (
              <p className="text-xs text-muted-foreground">
                {syncResult.repositories_synced} repos synced, {syncResult.documentation_files_indexed}{" "}
                docs (re)indexed
                {syncResult.errors.length > 0 ? ` — ${syncResult.errors.length} error(s)` : ""}
              </p>
            )}
          </div>

          <div className="space-y-2">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-card p-3 text-sm"
              >
                <span className="min-w-40 font-medium">{repo.full_name}</span>
                <select
                  value={repo.category}
                  onChange={(e) =>
                    void handleCuration(repo.id, { category: e.target.value as RepositoryCategory })
                  }
                  className="rounded-md border border-border/70 bg-background px-2 py-1 text-xs"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={repo.featured}
                    onChange={(e) => void handleCuration(repo.id, { featured: e.target.checked })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={repo.is_selected_for_rag}
                    onChange={(e) =>
                      void handleCuration(repo.id, { is_selected_for_rag: e.target.checked })
                    }
                  />
                  Index for RAG
                </label>
              </div>
            ))}
            {repos.length === 0 && (
              <p className="text-sm text-muted-foreground">No repositories synced yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
