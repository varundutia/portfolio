from datetime import UTC, datetime, timedelta

import bcrypt
import jwt

from app.core.config import get_settings

ADMIN_COOKIE_NAME = "portfolio_admin_session"

# bcrypt's own C implementation truncates at 72 bytes silently in older versions but raises
# in 4.x+; encode explicitly and truncate ourselves so behavior is consistent either way.
_MAX_PASSWORD_BYTES = 72


def hash_password(plain_password: str) -> str:
    encoded = plain_password.encode("utf-8")[:_MAX_PASSWORD_BYTES]
    return bcrypt.hashpw(encoded, bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
    if not password_hash:
        return False
    encoded = plain_password.encode("utf-8")[:_MAX_PASSWORD_BYTES]
    try:
        return bcrypt.checkpw(encoded, password_hash.encode("utf-8"))
    except ValueError:
        return False


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
