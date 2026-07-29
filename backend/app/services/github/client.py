import base64

import httpx

from app.core.errors import DomainError

_API_BASE = "https://api.github.com"


class GitHubClient:
    """Thin wrapper over the GitHub REST API. Used only by the on-demand sync job — the
    public site never calls this at request time, so a GitHub outage never breaks the site."""

    def __init__(self, token: str) -> None:
        headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        self._client = httpx.Client(base_url=_API_BASE, headers=headers, timeout=20.0)

    def close(self) -> None:
        self._client.close()

    def _get(self, path: str, params: dict | None = None) -> httpx.Response:
        try:
            response = self._client.get(path, params=params)
        except httpx.HTTPError as exc:
            raise DomainError(f"GitHub API request failed: {exc}", status_code=502) from exc
        if response.status_code == 403 and "rate limit" in response.text.lower():
            raise DomainError("GitHub API rate limit exceeded. Try again later.", status_code=429)
        return response

    def list_repos(self, username: str) -> list[dict]:
        repos: list[dict] = []
        page = 1
        while True:
            response = self._get(
                f"/users/{username}/repos",
                params={"per_page": 100, "page": page, "type": "owner", "sort": "updated"},
            )
            if response.status_code == 404:
                raise DomainError(f"GitHub user '{username}' not found.", status_code=404)
            response.raise_for_status()
            batch = response.json()
            if not batch:
                break
            repos.extend(batch)
            page += 1
        return repos

    def get_languages(self, full_name: str) -> dict[str, int]:
        response = self._get(f"/repos/{full_name}/languages")
        if response.status_code != 200:
            return {}
        return response.json()

    def get_readme(self, full_name: str) -> dict | None:
        response = self._get(f"/repos/{full_name}/readme")
        if response.status_code != 200:
            return None
        data = response.json()
        content = base64.b64decode(data["content"]).decode("utf-8", errors="replace")
        return {"path": data["path"], "html_url": data["html_url"], "content": content}

    def get_repo_file(self, full_name: str, path: str) -> dict | None:
        response = self._get(f"/repos/{full_name}/contents/{path}")
        if response.status_code != 200:
            return None
        data = response.json()
        if isinstance(data, list) or data.get("type") != "file":
            return None
        content = base64.b64decode(data["content"]).decode("utf-8", errors="replace")
        return {"path": data["path"], "html_url": data["html_url"], "content": content}

    def list_directory(self, full_name: str, path: str) -> list[dict] | None:
        response = self._get(f"/repos/{full_name}/contents/{path}")
        if response.status_code != 200:
            return None
        data = response.json()
        return data if isinstance(data, list) else None

    def get_latest_release(self, full_name: str) -> dict | None:
        response = self._get(f"/repos/{full_name}/releases/latest")
        if response.status_code != 200:
            return None
        return response.json()

    def get_latest_commit_date(self, full_name: str, default_branch: str) -> str | None:
        response = self._get(f"/repos/{full_name}/commits", params={"sha": default_branch, "per_page": 1})
        if response.status_code != 200:
            return None
        commits = response.json()
        if not commits:
            return None
        return commits[0]["commit"]["committer"]["date"]
