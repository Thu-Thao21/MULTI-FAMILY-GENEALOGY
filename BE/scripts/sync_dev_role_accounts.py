"""
Script: Sync Firebase DEV Role Accounts into PostgreSQL
Usage:
    python scripts/sync_dev_role_accounts.py --dry-run
    python scripts/sync_dev_role_accounts.py --apply
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
from app.core.config import settings
from app.db.postgres import AsyncSessionLocal
from app.models.postgres import Account, AccountRole

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("sync_dev_roles")

DEFAULT_ADMIN_UID = os.getenv("DEV_ADMIN_FIREBASE_UID", "Kt23xmxKJ6Stne3GEOerJ5ParHE3")
DEFAULT_FAMILY_HEAD_UID = os.getenv("DEV_FAMILY_HEAD_FIREBASE_UID", "X3Mx5ugiraf0rwqNWxaJVaHdZ632")


async def sync_dev_accounts(apply: bool = False):
    if settings.APP_ENV != "development":
        logger.warning(f"APP_ENV is currently '{settings.APP_ENV}'. Script is intended for 'development'.")

    mode_str = "[APPLY MODE]" if apply else "[DRY-RUN MODE]"
    logger.info(f"{mode_str} Starting sync for Firebase DEV role accounts...")
    logger.info(f"Target Admin UID: {DEFAULT_ADMIN_UID}")
    logger.info(f"Target Family Head UID: {DEFAULT_FAMILY_HEAD_UID}")

    async with AsyncSessionLocal() as db:
        # 1. Sync Admin Account
        # Check if legacy seed 'admin_default_001' or account with target UID exists
        stmt_admin = select(Account).options(selectinload(Account.roles)).where(
            (Account.id == "admin_default_001") | (Account.firebase_uid == DEFAULT_ADMIN_UID)
        )
        res_admin = await db.execute(stmt_admin)
        admin_acc = res_admin.scalars().first()

        if admin_acc:
            logger.info(f"Found existing Admin Account ID: {admin_acc.id}")
            if admin_acc.firebase_uid != DEFAULT_ADMIN_UID:
                logger.info(f"Will update Admin firebase_uid: '{admin_acc.firebase_uid}' -> '{DEFAULT_ADMIN_UID}'")
                if apply:
                    admin_acc.firebase_uid = DEFAULT_ADMIN_UID
        else:
            logger.info(f"Admin Account not found. Will create new Account with ID 'admin_default_001' and UID '{DEFAULT_ADMIN_UID}'")
            if apply:
                admin_acc = Account(
                    id="admin_default_001",
                    firebase_uid=DEFAULT_ADMIN_UID,
                    username="admin_dev",
                    email="admin_dev@genealogy.local",
                    display_name="Quản Trị Viên (DEV)",
                    status="active",
                )
                db.add(admin_acc)
                await db.flush()

        if apply and admin_acc:
            # Ensure 'admin' role active
            active_roles = [r.role.lower() for r in admin_acc.roles if r.status == "active"]
            if "admin" not in active_roles:
                new_admin_role = AccountRole(
                    account_id=admin_acc.id,
                    role="admin",
                    status="active",
                )
                db.add(new_admin_role)
                logger.info(f"Added 'admin' role to Account ID: {admin_acc.id}")

        # 2. Sync Family Head Account
        stmt_fh = select(Account).options(selectinload(Account.roles)).where(
            (Account.id == "family_head_default_001") | (Account.firebase_uid == DEFAULT_FAMILY_HEAD_UID)
        )
        res_fh = await db.execute(stmt_fh)
        fh_acc = res_fh.scalars().first()

        if fh_acc:
            logger.info(f"Found existing Family Head Account ID: {fh_acc.id}")
            if fh_acc.firebase_uid != DEFAULT_FAMILY_HEAD_UID:
                logger.info(f"Will update Family Head firebase_uid: '{fh_acc.firebase_uid}' -> '{DEFAULT_FAMILY_HEAD_UID}'")
                if apply:
                    fh_acc.firebase_uid = DEFAULT_FAMILY_HEAD_UID
        else:
            logger.info(f"Family Head Account not found. Will create new Account with ID 'family_head_default_001' and UID '{DEFAULT_FAMILY_HEAD_UID}'")
            if apply:
                fh_acc = Account(
                    id="family_head_default_001",
                    firebase_uid=DEFAULT_FAMILY_HEAD_UID,
                    username="truongtoc_dev",
                    email="truongtoc_dev@genealogy.local",
                    display_name="Trưởng Tộc (DEV)",
                    status="active",
                )
                db.add(fh_acc)
                await db.flush()

        if apply and fh_acc:
            # Ensure 'family_head' role active
            active_roles = [r.role.lower() for r in fh_acc.roles if r.status == "active"]
            if "family_head" not in active_roles:
                new_fh_role = AccountRole(
                    account_id=fh_acc.id,
                    role="family_head",
                    status="active",
                )
                db.add(new_fh_role)
                logger.info(f"Added 'family_head' role to Account ID: {fh_acc.id}")

        if apply:
            await db.commit()
            logger.info("✅ Sync completed successfully in [APPLY MODE]. PostgreSQL updated.")
        else:
            logger.info("ℹ️ Dry-run completed. No changes committed. Run with --apply to commit changes.")


def main():
    parser = argparse.ArgumentParser(description="Sync Firebase DEV Role Accounts to PostgreSQL")
    parser.add_argument("--dry-run", action="store_true", help="Run without applying changes")
    parser.add_argument("--apply", action="store_true", help="Apply changes to PostgreSQL database")

    args = parser.parse_args()

    if not args.dry_run and not args.apply:
        logger.info("Chưa chọn tham số. Mặc định chạy --dry-run. Dùng --apply để áp dụng thay đổi.")

    asyncio.run(sync_dev_accounts(apply=args.apply))


if __name__ == "__main__":
    main()
