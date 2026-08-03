from __future__ import annotations

import os
import asyncio
import logging
import sys
from typing import AsyncGenerator

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

logger = logging.getLogger("mfg.postgres")


class Base(DeclarativeBase):
    pass


engine = create_async_engine(settings.DATABASE_URL, echo=False)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
AsyncSessionLocal = async_session_maker  # Alias for backward compatibility with scripts


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


async def init_db() -> None:
    """Khởi tạo schema database và thực hiện dev seed nếu được bật bằng SEED_DEV_ACCOUNTS=true."""
    import app.models.postgres  # noqa: F401
    from sqlalchemy import text

    seed_dev = os.getenv("SEED_DEV_ACCOUNTS", "false").lower() in ("true", "1")

    if seed_dev and settings.APP_ENV == "production":
        raise RuntimeError("CẢNH BÁO BẢO MẬT: SEED_DEV_ACCOUNTS=true không được phép hoạt động trên môi trường production!")

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        try:
            await conn.execute(text("ALTER TABLE accounts ADD COLUMN password_hash TEXT;"))
        except Exception:
            pass  # Cột đã tồn tại

    if seed_dev and settings.APP_ENV == "development":
        logger.info("SEED_DEV_ACCOUNTS=true: Khởi chạy đồng bộ 2 Firebase DEV UIDs...")
        from scripts.sync_dev_role_accounts import sync_dev_accounts
        await sync_dev_accounts(apply=True)


async def close_db() -> None:
    await engine.dispose()