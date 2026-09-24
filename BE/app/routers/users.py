from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.postgres import get_db
from app.dependencies.auth import get_current_account
from app.models.postgres import Account, AccountRole, Admin, FamilyMembership, Member
from app.schemas.auth_schemas import AccountOut
from app.services.auth_service import format_account_me

router = APIRouter(prefix="/users", tags=["users"])


class UserOut(BaseModel):
    id: str
    username: Optional[str] = None
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    status: str

    class Config:
        from_attributes = True


class FamilyManagerAccessUpdate(BaseModel):
    enabled: bool


def get_family_head_family_id(account: Account) -> str:
    family_ids = {
        role.family_id
        for role in account.roles
        if role.role.lower() == "family_head"
        and role.status == "active"
        and role.family_id
    }
    if len(family_ids) != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ Trưởng tộc đang quản lý một dòng họ mới được cấp quyền Family Admin.",
        )
    return next(iter(family_ids))


@router.get("/family/accounts", response_model=List[AccountOut])
async def list_family_accounts(
    db: AsyncSession = Depends(get_db),
    current_account: Account = Depends(get_current_account),
):
    """List active member accounts in the family managed by the current family head."""
    family_id = get_family_head_family_id(current_account)
    stmt = (
        select(Account)
        .join(AccountRole, AccountRole.account_id == Account.id)
        .options(selectinload(Account.roles))
        .where(
            AccountRole.family_id == family_id,
            AccountRole.role == "member",
            AccountRole.status == "active",
            Account.status == "active",
        )
        .order_by(Account.display_name, Account.username)
    )
    result = await db.execute(stmt)
    return [format_account_me(account) for account in result.unique().scalars().all()]


@router.patch("/family/accounts/{account_id}/manager", response_model=AccountOut)
async def update_family_manager_access(
    account_id: str,
    payload: FamilyManagerAccessUpdate,
    db: AsyncSession = Depends(get_db),
    current_account: Account = Depends(get_current_account),
):
    """Grant or revoke the manager role for a member of the family head's family."""
    family_id = get_family_head_family_id(current_account)
    if account_id == current_account.id:
        raise HTTPException(status_code=400, detail="Trưởng tộc không thể tự thay đổi quyền của mình.")

    stmt = select(Account).options(selectinload(Account.roles)).where(Account.id == account_id)
    result = await db.execute(stmt)
    target = result.scalar_one_or_none()
    if not target or target.status != "active":
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản thành viên đang hoạt động.")

    is_family_member = any(
        role.role.lower() == "member"
        and role.status == "active"
        and role.family_id == family_id
        for role in target.roles
    )
    if not is_family_member:
        raise HTTPException(status_code=403, detail="Tài khoản không thuộc dòng họ do bạn quản lý.")
    if any(
        role.role.lower() == "family_head"
        and role.status == "active"
        and role.family_id == family_id
        for role in target.roles
    ):
        raise HTTPException(status_code=400, detail="Không thể thay đổi quyền của một Trưởng tộc.")

    manager_role = next(
        (
            role for role in target.roles
            if role.role.lower() == "manager" and role.family_id == family_id
        ),
        None,
    )
    if manager_role:
        manager_role.status = "active" if payload.enabled else "revoked"
    elif payload.enabled:
        db.add(AccountRole(
            account_id=target.id,
            role="manager",
            family_id=family_id,
            status="active",
        ))

    membership_result = await db.execute(
        select(FamilyMembership).where(
            FamilyMembership.user_id == target.id,
            FamilyMembership.family_id == family_id,
        )
    )
    membership = membership_result.scalars().first()
    if membership:
        if membership.membership_role == "owner":
            raise HTTPException(status_code=400, detail="Không thể thay đổi quyền của chủ sở hữu dòng họ.")
        membership.membership_role = "manager" if payload.enabled else "member"
        membership.status = "active"
    else:
        db.add(FamilyMembership(
            user_id=target.id,
            family_id=family_id,
            membership_role="manager" if payload.enabled else "member",
            status="active",
        ))

    await db.commit()
    refreshed = await db.execute(
        select(Account)
        .options(selectinload(Account.roles))
        .where(Account.id == target.id)
        .execution_options(populate_existing=True)
    )
    return format_account_me(refreshed.scalar_one())


@router.get("/", response_model=List[UserOut])
async def list_users(role: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """Lấy danh sách tất cả tài khoản từ 2 bảng (admins, members)."""
    results: List[UserOut] = []

    if not role or role == "admin":
        res = await db.execute(select(Admin))
        for item in res.scalars().all():
            results.append(
                UserOut(
                    id=item.id,
                    username=item.username,
                    full_name=item.full_name,
                    email=item.email,
                    phone=item.phone,
                    role="admin",
                    status=item.status,
                )
            )

    if not role or role == "member":
        res = await db.execute(select(Member))
        for item in res.scalars().all():
            if item.username:
                results.append(
                    UserOut(
                        id=item.id,
                        username=item.username,
                        full_name=item.full_name,
                        email=item.email,
                        phone=item.phone,
                        role="member",
                        status=item.status,
                    )
                )

    return results


@router.get("/admins")
async def list_admins(db: AsyncSession = Depends(get_db)):
    """Lấy danh sách tài khoản từ bảng admins."""
    result = await db.execute(select(Admin))
    admins = result.scalars().all()
    return admins
