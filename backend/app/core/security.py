from datetime import UTC, datetime, timedelta

import jwt
from passlib.context import CryptContext

from app.core.config import get_settings

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ADMIN_COOKIE_NAME = "portfolio_admin_session"


def hash_password(plain_password: str) -> str:
    return _pwd_context.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    if not password_hash:
        return False
    return _pwd_context.verify(plain_password, password_hash)


def create_admin_token() -> str:
    settings = get_settings()
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": "admin", "exp": expires_at}
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def verify_admin_token(token: str) -> bool:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        return False
    return payload.get("sub") == "admin"
