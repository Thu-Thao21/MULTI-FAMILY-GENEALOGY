import logging
from typing import Dict, Any, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.postgres import Account, AccountRole
from app.schemas.auth_schemas import AccountOut, RoleOut

logger = logging.getLogger("mfg.auth_service")


async def get_account_by_firebase_uid(db: AsyncSession, firebase_uid: str) -> Optional[Account]:
    stmt = select(Account).options(selectinload(Account.roles)).where(Account.firebase_uid == firebase_uid)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def link_verified_firebase_identity_to_legacy_account(
    db: AsyncSession,
    firebase_uid: str,
    email: Optional[str],
    email_verified: bool,
) -> Optional[Account]:
    """
    Safely links a legacy account to a Firebase UID ONLY if:
    1. The token's email is verified (email_verified == True)
    2. The legacy account has matching email
    3. The legacy account DOES NOT already have a firebase_uid linked.
    """
    if not email or not email_verified:
        return None

    normalized_email = email.strip().lower()
    stmt = (
        select(Account)
        .options(selectinload(Account.roles))
        .where(
            Account.email == normalized_email,
            Account.firebase_uid.is_(None),
        )
    )
    res = await db.execute(stmt)
    legacy_account = res.scalars().first()

    if legacy_account:
        legacy_account.firebase_uid = firebase_uid
        legacy_account.email_verified = True
        logger.info(
            f"[AUDIT LOG] Successfully linked verified Firebase identity (UID: {firebase_uid}) "
            f"to legacy account ID: {legacy_account.id} (Email: {normalized_email})"
        )
        return legacy_account

    return None


async def bootstrap_account(
    db: AsyncSession,
    decoded_token: Dict[str, Any],
) -> Account:
    """
    Finds an existing account strictly by firebase_uid, or attempts a safe legacy link for verified emails.
    Otherwise creates a new Account with default 'member' role.
    REMOVED all hard-coded admin email logic. All new users receive 'member' role.
    """
    firebase_uid = decoded_token.get("uid")
    email = decoded_token.get("email")
    email_verified = decoded_token.get("email_verified", False)
    phone_e164 = decoded_token.get("phone_number")
    display_name = decoded_token.get("name") or decoded_token.get("email") or phone_e164 or "Thành viên gia phả"

    if not firebase_uid:
        raise ValueError("Firebase token không chứa UID hợp lệ.")

    # 1. Primary lookup by exact firebase_uid
    account = await get_account_by_firebase_uid(db, firebase_uid)

    # 2. If not found by firebase_uid, attempt safe migration link for legacy accounts with verified email
    if not account and email and email_verified:
        account = await link_verified_firebase_identity_to_legacy_account(db, firebase_uid, email, email_verified)

    if account:
        # Sync verified claims and display name if updated
        if email and email_verified and account.email != email:
            account.email = email
        if email_verified != account.email_verified:
            account.email_verified = email_verified
        if phone_e164:
            account.phone_e164 = phone_e164
            account.phone_verified = True
        if display_name and not account.display_name:
            account.display_name = display_name

        # Ensure account has at least 'member' role if roles list is empty
        if not account.roles:
            role_obj = AccountRole(
                account_id=account.id,
                role="member",
                status="active",
            )
            db.add(role_obj)
            logger.info(f"[AUDIT LOG] Assigned default 'member' role to account ID: {account.id}")

        await db.commit()
        await db.refresh(account)
        return account

    # 3. Create new Account with strictly default 'member' role
    account = Account(
        firebase_uid=firebase_uid,
        email=email,
        email_verified=email_verified,
        phone_e164=phone_e164,
        phone_verified=True if phone_e164 else False,
        display_name=display_name,
        status="active",
    )
    db.add(account)
    await db.flush()

    # Assign default 'member' role ONLY
    role_obj = AccountRole(
        account_id=account.id,
        role="member",
        status="active",
    )
    db.add(role_obj)
    logger.info(f"[AUDIT LOG] Created new Account ID: {account.id} with default 'member' role for UID: {firebase_uid}")

    await db.commit()
    return await get_account_by_firebase_uid(db, firebase_uid)


def calculate_primary_role(roles: List[AccountRole]) -> str:
    active_roles = [r.role.lower() for r in roles if r.status == "active"]
    if "admin" in active_roles:
        return "admin"
    if "family_head" in active_roles:
        return "family_head"
    return "member"


def format_account_me(account: Account) -> AccountOut:
    primary_role = calculate_primary_role(account.roles)
    role_outs = [
        RoleOut(
            id=r.id,
            account_id=r.account_id,
            role=r.role,
            family_id=r.family_id,
            status=r.status,
            created_at=r.created_at,
        )
        for r in (account.roles or [])
    ]

    return AccountOut(
        id=account.id,
        firebase_uid=account.firebase_uid,
        username=account.username,
        email=account.email,
        phone_e164=account.phone_e164,
        display_name=account.display_name,
        email_verified=account.email_verified,
        phone_verified=account.phone_verified,
        status=account.status,
        roles=role_outs,
        primary_role=primary_role,
    )
