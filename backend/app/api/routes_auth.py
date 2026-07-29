from fastapi import APIRouter, Response, status

from app.core.config import get_settings
from app.core.errors import DomainError
from app.core.security import ADMIN_COOKIE_NAME, create_admin_token, verify_password
from app.schemas.auth import LoginRequest

router = APIRouter(prefix="/admin", tags=["admin-auth"])


@router.post("/login", status_code=status.HTTP_204_NO_CONTENT)
def login(payload: LoginRequest, response: Response) -> None:
    settings = get_settings()
    if not settings.admin_password_hash:
        raise DomainError("Admin login is not configured on this deployment.", status_code=503)
    if not verify_password(payload.password, settings.admin_password_hash):
        raise DomainError("Incorrect password.", status_code=401)

    token = create_admin_token()
    # `secure=True` requires HTTPS in production; Chrome treats `localhost` as a secure
    # context so this still works for local dev as long as the frontend runs on
    # http://localhost (not 127.0.0.1 or a LAN IP).
    response.set_cookie(
        key=ADMIN_COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=True,
        max_age=settings.jwt_expire_minutes * 60,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> None:
    response.delete_cookie(ADMIN_COOKIE_NAME)
