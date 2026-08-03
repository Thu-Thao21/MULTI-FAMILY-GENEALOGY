from typing import Callable, List
from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.firebase import verify_firebase_token
from app.db.postgres import get_db
from app.models.postgres import Account
from app.services.auth_service import bootstrap_account, get_account_by_firebase_uid


async def get_current_account(
    authorization: str = Header(None, description="Bearer <Token>"),
    db: AsyncSession = Depends(get_db),
) -> Account:
    """
    Extracts Bearer token (Firebase ID Token), verifies token signature via Firebase Admin SDK,
    loads or bootstraps Account from PostgreSQL DB and verifies active status.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Thiếu Authorization header dạng Bearer <token>.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    id_token = authorization.split("Bearer ")[1].strip()
    if not id_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Strictly verify Firebase Auth ID Token using Firebase Admin SDK
    try:
        decoded_token = verify_firebase_token(id_token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token không hợp lệ hoặc đã hết hạn: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    firebase_uid = decoded_token.get("uid")
    if not firebase_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không chứa Firebase UID hợp lệ.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    account = await get_account_by_firebase_uid(db, firebase_uid)

    if not account:
        account = await bootstrap_account(db, decoded_token)

    if account.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản của bạn đã bị khóa hoặc tạm ngưng hoạt động.",
        )

    return account


def require_roles(allowed_roles: List[str]) -> Callable:
    """
    FastAPI Role Guard Dependency Factory.
    Ensures current authenticated account has at least one of allowed_roles in PostgreSQL.
    """
    async def role_checker(account: Account = Depends(get_current_account)) -> Account:
        user_roles = [r.role.lower() for r in account.roles if r.status == "active"]
        
        # Admin role always bypasses specific role checks
        if "admin" in user_roles:
            return account

        has_permission = any(role.lower() in user_roles for role in allowed_roles)
        if not has_permission:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Bạn không có quyền truy cập tính năng này. Yêu cầu một trong các quyền: {', '.join(allowed_roles)}.",
            )
        return account

    return role_checker
