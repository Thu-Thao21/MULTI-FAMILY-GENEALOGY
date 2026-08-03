from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import or_, select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import hash_password, verify_password
from app.db.postgres import get_db
from app.models.postgres import Account, Admin, FamilyHead, Member, PasswordReset
from app.schemas.auth_schemas import AccountOut
from app.services.auth_service import bootstrap_account, format_account_me, calculate_primary_role
from app.dependencies.auth import get_current_account

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/bootstrap", response_model=AccountOut)
async def bootstrap(
    account: Account = Depends(get_current_account),
):
    """
    Initializes or syncs current Firebase authenticated user in PostgreSQL.
    Returns Account details including roles and primary_role.
    """
    return format_account_me(account)


@router.get("/me", response_model=AccountOut)
async def get_me(
    account: Account = Depends(get_current_account),
):
    """
    Returns current authenticated user profile, roles, and status from PostgreSQL.
    """
    return format_account_me(account)


class RegisterSchema(BaseModel):
    username: str
    email_or_phone: str
    display_name: Optional[str] = None
    password: str
    role: Optional[str] = "member"


class LoginSchema(BaseModel):
    email_or_phone: str
    password: str
    role: Optional[str] = "member"


class RequestOTPSchema(BaseModel):
    email_or_phone: str


class ResetPasswordSchema(BaseModel):
    email_or_phone: str
    otp_code: str
    new_password: str


@router.post("/register", deprecated=True)
async def register(payload: RegisterSchema, db: AsyncSession = Depends(get_db)):
    """
    [LEGACY/DEPRECATED] Internal account creation endpoint.
    Frontend users should register using Firebase Auth + POST /auth/bootstrap.
    """
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Đăng ký tài khoản hiện tại được thực hiện trực tiếp qua Firebase Authentication trên Frontend.",
    )


@router.post("/login", deprecated=True)
async def login(payload: LoginSchema, db: AsyncSession = Depends(get_db)):
    """
    [LEGACY/DEPRECATED] Internal password verification endpoint.
    Frontend users should login using Firebase Auth + Bearer Token headers.
    """
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Đăng nhập tài khoản hiện tại được thực hiện trực tiếp qua Firebase Authentication trên Frontend.",
    )


@router.post("/request-otp")
async def request_otp(payload: RequestOTPSchema, db: AsyncSession = Depends(get_db)):
    if not settings.ENABLE_LEGACY_PASSWORD_RESET:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tính năng đặt lại mật khẩu legacy bằng OTP đã bị tắt. Vui lòng sử dụng liên kết khôi phục mật khẩu Firebase gửi qua Email.",
        )

    import random
    input_str = payload.email_or_phone.strip().lower()

    # Find account across Account, Admin, FamilyHead, Member
    account = None

    stmt = select(Account).where(
        or_(
            Account.username == input_str,
            Account.email == input_str,
            Account.phone_e164 == input_str,
        )
    )
    res = await db.execute(stmt)
    acc = res.scalars().first()
    if acc:
        account = acc

    if not account:
        for ModelClass in [Admin, FamilyHead, Member]:
            stmt = select(ModelClass).where(
                or_(
                    ModelClass.username == input_str,
                    ModelClass.email == input_str,
                    ModelClass.phone == input_str,
                )
            )
            res = await db.execute(stmt)
            acc = res.scalars().first()
            if acc:
                account = acc
                break

    if not account:
        raise HTTPException(
            status_code=400,
            detail="Tài khoản hoặc Email/Số điện thoại không tồn tại trong hệ thống."
        )

    # Generate 6-digit OTP
    otp_code = f"{random.randint(100000, 999999)}"
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=10)

    reset_record = PasswordReset(
        id=f"reset_{int(now.timestamp() * 1000)}",
        user_id=account.id,
        email_or_phone=input_str,
        otp_code=otp_code,
        expires_at=expires_at,
        is_used=False,
        created_at=now,
    )
    db.add(reset_record)
    await db.commit()

    if "@" in input_str:
        import asyncio
        from app.services.email_service import send_otp_email
        await asyncio.to_thread(send_otp_email, input_str, otp_code)

    target_type = "email" if "@" in input_str else "số điện thoại"
    return {
        "message": f"Mã OTP xác thực (6 chữ số) đã được gửi tới {target_type} {input_str}. Vui lòng kiểm tra tin nhắn/hộp thư của bạn.",
    }


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordSchema, db: AsyncSession = Depends(get_db)):
    if not settings.ENABLE_LEGACY_PASSWORD_RESET:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tính năng đặt lại mật khẩu legacy bằng OTP đã bị tắt. Vui lòng sử dụng liên kết khôi phục mật khẩu Firebase gửi qua Email.",
        )

    input_str = payload.email_or_phone.strip().lower()
    otp_code_str = payload.otp_code.strip()
    new_password_str = payload.new_password.strip()

    if len(new_password_str) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải có ít nhất 6 ký tự.")

    now = datetime.now(timezone.utc)

    stmt = (
        select(PasswordReset)
        .where(
            PasswordReset.email_or_phone == input_str,
            PasswordReset.otp_code == otp_code_str,
            PasswordReset.is_used == False,
        )
        .order_by(PasswordReset.created_at.desc())
    )
    res = await db.execute(stmt)
    reset_record = res.scalars().first()

    if not reset_record:
        raise HTTPException(
            status_code=400,
            detail="Mã OTP không chính xác hoặc đã được sử dụng."
        )

    exp_at = reset_record.expires_at
    if exp_at and exp_at.tzinfo is None:
        exp_at = exp_at.replace(tzinfo=timezone.utc)

    if exp_at < now:
        raise HTTPException(
            status_code=400,
            detail="Mã OTP đã hết hạn sử dụng. Vui lòng yêu cầu mã OTP mới."
        )

    reset_record.is_used = True

    account = None
    stmt = select(Account).where(
        or_(
            Account.username == input_str,
            Account.email == input_str,
            Account.phone_e164 == input_str,
            Account.id == reset_record.user_id,
        )
    )
    res = await db.execute(stmt)
    acc = res.scalars().first()
    if acc:
        account = acc
    else:
        for ModelClass in [Admin, FamilyHead, Member]:
            stmt = select(ModelClass).where(
                or_(
                    ModelClass.username == input_str,
                    ModelClass.email == input_str,
                    ModelClass.phone == input_str,
                    ModelClass.id == reset_record.user_id,
                )
            )
            res = await db.execute(stmt)
            acc = res.scalars().first()
            if acc:
                account = acc
                break

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy thông tin tài khoản cần cập nhật mật khẩu."
        )

    account.password_hash = hash_password(new_password_str)
    account.updated_at = now

    await db.commit()

    return {
        "message": "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới."
    }
