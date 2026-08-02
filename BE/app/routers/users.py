from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.postgres import get_db
from app.models.postgres import User

router = APIRouter(prefix="/users", tags=["users"])


class UserOut(BaseModel):
    id: str
    username: str
    full_name: str
    email: str | None = None
    phone: str | None = None
    role: str
    status: str

    class Config:
        from_attributes = True


@router.get("/", response_model=List[UserOut])
async def list_users(db: AsyncSession = Depends(get_db)):
    """Lấy danh sách tất cả tài khoản từ PostgreSQL."""
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users


@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    """Lấy thông tin 1 tài khoản theo ID từ PostgreSQL."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản trong PostgreSQL.")
    return user
