from __future__ import annotations

import asyncio
import sys
from datetime import datetime, timedelta, timezone
from typing import AsyncGenerator

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings
from app.core.security import hash_password


class Base(DeclarativeBase):
    pass


engine = create_async_engine(settings.DATABASE_URL, echo=False)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


async def init_db() -> None:
    from app.models.postgres import PasswordReset, User

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        existing_users = await session.scalar(select(func.count()).select_from(User))
        if existing_users and existing_users > 0:
            return

        now = datetime.now(timezone.utc)
        demo_users = [
            User(
                id="user_admin_001",
                email="nguyenvanan.admin@gmail.com",
                username="admin",
                full_name="Nguyễn Văn An",
                password_hash=hash_password("admin"),
                phone="0912345678",
                member_id="member_001",
                role="admin",
                status="active",
                created_at=now,
                updated_at=now,
            ),
            User(
                id="user_002",
                email="tranthithao.head@gmail.com",
                username="thao_truongho",
                full_name="Trần Thị Thảo",
                password_hash=hash_password("123456"),
                phone="0987654321",
                member_id="member_005",
                role="family_head",
                status="active",
                created_at=now,
                updated_at=now,
            ),
            User(
                id="user_003",
                email="nguyenvanhung.dev@gmail.com",
                username="hung_nguyen",
                full_name="Nguyễn Văn Hùng",
                password_hash=hash_password("123456"),
                phone="0935123456",
                member_id="member_005",
                role="member",
                status="active",
                created_at=now,
                updated_at=now,
            ),
        ]
        demo_resets = [
            PasswordReset(
                id="reset_001",
                user_id="user_002",
                email_or_phone="tranthithao.head@gmail.com",
                otp_code="888999",
                expires_at=now + timedelta(hours=1),
                is_used=False,
                created_at=now,
            )
        ]

        session.add_all(demo_users + demo_resets)
        await session.commit()


async def close_db() -> None:
    await engine.dispose()