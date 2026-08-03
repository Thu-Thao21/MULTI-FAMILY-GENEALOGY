"""
CLI Tool: Manage Admin Roles
Usage:
    python scripts/manage_admin.py grant --uid=Kt23xmxKJ6Stne3GEOerJ5ParHE3
    python scripts/manage_admin.py grant --email=admin@example.com
    python scripts/manage_admin.py revoke --uid=Kt23xmxKJ6Stne3GEOerJ5ParHE3
"""

import sys
import os
import argparse
import asyncio
import logging

# Ensure BE directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.db.postgres import AsyncSessionLocal
from app.models.postgres import Account, AccountRole

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("manage_admin")


async def grant_admin_role(email: str = None, uid: str = None) -> bool:
    async with AsyncSessionLocal() as db:
        stmt = select(Account).options(selectinload(Account.roles))
        if uid:
            stmt = stmt.where(Account.firebase_uid == uid.strip())
        elif email:
            stmt = stmt.where(Account.email == email.strip().lower())
        else:
            logger.error("Vui lòng cung cấp --uid (khuyến nghị) hoặc --email.")
            return False

        res = await db.execute(stmt)
        account = res.scalars().first()

        if not account:
            logger.error(f"Không tìm thấy tài khoản tương ứng (email={email}, uid={uid}).")
            return False

        if email and not uid and not account.email_verified:
            logger.error(f"Tài khoản email {account.email} CHƯA XÁC MINH (email_verified=false). Không thể cấp quyền Admin!")
            return False

        active_roles = [r.role.lower() for r in account.roles if r.status == "active"]
        if "admin" in active_roles:
            logger.info(f"Tài khoản ID {account.id} ({account.email or account.firebase_uid}) ĐÃ CÓ quyền admin.")
            return True

        new_role = AccountRole(
            account_id=account.id,
            role="admin",
            status="active",
        )
        db.add(new_role)
        await db.commit()
        logger.info(f"[AUDIT LOG] ĐÃ CẤP QUYỀN ADMIN THÀNH CÔNG cho tài khoản ID: {account.id} (UID: {account.firebase_uid})")
        return True


async def revoke_admin_role(email: str = None, uid: str = None) -> bool:
    async with AsyncSessionLocal() as db:
        stmt = select(Account).options(selectinload(Account.roles))
        if uid:
            stmt = stmt.where(Account.firebase_uid == uid.strip())
        elif email:
            stmt = stmt.where(Account.email == email.strip().lower())
        else:
            logger.error("Vui lòng cung cấp --uid hoặc --email.")
            return False

        res = await db.execute(stmt)
        account = res.scalars().first()

        if not account:
            logger.error(f"Không tìm thấy tài khoản tương ứng.")
            return False

        admin_roles = [r for r in account.roles if r.role.lower() == "admin" and r.status == "active"]
        if not admin_roles:
            logger.info(f"Tài khoản ID {account.id} KHÔNG CÓ quyền admin để thu hồi.")
            return True

        for r in admin_roles:
            r.status = "revoked"

        await db.commit()
        logger.info(f"[AUDIT LOG] ĐÃ THU HỒI QUYỀN ADMIN THÀNH CÔNG từ tài khoản ID: {account.id} (UID: {account.firebase_uid})")
        return True


def main():
    parser = argparse.ArgumentParser(description="Quản lý quyền Admin cho tài khoản gia phả")
    parser.add_argument("action", choices=["grant", "revoke"], help="Hành động: grant (cấp) hoặc revoke (thu hồi)")
    parser.add_argument("--email", type=str, help="Email tài khoản")
    parser.add_argument("--uid", type=str, help="Firebase UID tài khoản")

    args = parser.parse_args()

    success = False
    if args.action == "grant":
        success = asyncio.run(grant_admin_role(email=args.email, uid=args.uid))
    elif args.action == "revoke":
        success = asyncio.run(revoke_admin_role(email=args.email, uid=args.uid))

    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()
