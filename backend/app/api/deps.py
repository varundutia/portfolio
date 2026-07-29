from fastapi import Cookie, HTTPException, status

from app.core.security import ADMIN_COOKIE_NAME, verify_admin_token
from app.db.session import get_db  # noqa: F401  -- re-exported for router imports


def require_admin(session_token: str | None = Cookie(default=None, alias=ADMIN_COOKIE_NAME)) -> None:
    if not session_token or not verify_admin_token(session_token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin authentication required.")
