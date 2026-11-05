"""C05. Activity & Fund Controller.

Handles family activities, announcements, events, funds, donations, and member notifications.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.postgres import get_db
from app.models.activity_fund.entities import Notification, UserNotification
from app.models.family.entities import Clan, ClanMembership
from app.models.postgres import Account
from app.models.user_access.entities import AuditLog
from app.services.auth_access.access_service import AccessService
from app.dependencies.auth import get_current_account

router = APIRouter(tags=["C05. Activity & Fund Controller"])


def _family_uuid(val: str) -> uuid.UUID:
    try:
        return uuid.UUID(val)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid family_id format")


async def _require_branch_scope(
    db: AsyncSession,
    account: Account,
    clan_id: uuid.UUID,
    branch_id: Optional[uuid.UUID],
    action: str,
) -> None:
    role = getattr(account, "primary_role", "").lower()
    if role in ("admin", "system_admin"):
        return
    roles = await AccessService(db).repo.get_active_roles(account.id, str(clan_id))
    role_set = {r.lower() for r in roles}
    if role_set.intersection({"business_owner", "owner", "family_head", "clan_admin"}):
        return
    if "family_admin" in role_set:
        return
    raise HTTPException(status_code=403, detail="Không có quyền thực hiện hành động này")


class ClanAnnouncementCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = "event"
    targetAudience: Optional[str] = "all"
    priority: Optional[str] = "normal"
    channels: Optional[Dict[str, bool]] = None


@router.post("/families/{family_id}/announcements", status_code=status.HTTP_201_CREATED)
async def publish_clan_announcement(
    family_id: str,
    data: ClanAnnouncementCreate,
    db: AsyncSession = Depends(get_db),
    account: Account = Depends(get_current_account),
):
    """Phát thông báo hoạt động, sự kiện dòng họ tới toàn thể thành viên."""
    f_uuid = _family_uuid(family_id)
    await _require_branch_scope(db, account, f_uuid, None, "family.update")

    clan_res = await db.execute(select(Clan).where(Clan.clan_id == f_uuid))
    clan = clan_res.scalar_one_or_none()
    if not clan:
        raise HTTPException(status_code=404, detail="Không tìm thấy dòng họ")

    roles = await AccessService(db).repo.get_active_roles(account.id, str(f_uuid))
    role_set = {r.lower() for r in roles}
    is_leader = bool(role_set.intersection({"business_owner", "owner", "family_head", "clan_admin"}))
    sender_role = "Trưởng Tộc" if is_leader else "Quản trị viên gia tộc"
    sender_display = getattr(account, "display_name", None) or getattr(account, "full_name", None) or account.email.split("@")[0]

    notif = Notification(
        notification_id=uuid.uuid4(),
        clan_id=f_uuid,
        type=data.category.upper() if data.category else "EVENT",
        title=data.title.strip(),
        body=data.content.strip(),
        entity_type="ANNOUNCEMENT",
        sender_name=sender_display,
        sender_role=sender_role,
        target_audience=data.targetAudience or "all",
        priority=data.priority or "normal",
        channels=data.channels or {"inApp": True, "email": True, "push": False},
        created_at=datetime.now(timezone.utc),
    )
    db.add(notif)
    await db.flush()

    m_res = await db.execute(
        select(ClanMembership.user_id).where(
            ClanMembership.clan_id == f_uuid,
            ClanMembership.status == "ACTIVE",
            ClanMembership.revoked_at.is_(None),
        )
    )
    member_user_ids = set(m_res.scalars().all())
    member_user_ids.add(account.id)

    now_utc = datetime.now(timezone.utc)
    for uid in member_user_ids:
        un = UserNotification(
            notification_id=notif.notification_id,
            user_id=uid,
            delivered_at=now_utc,
            read_at=now_utc if uid == account.id else None,
        )
        db.add(un)

    db.add(AuditLog(
        log_id=uuid.uuid4(),
        clan_id=f_uuid,
        actor_id=account.id,
        action="Phát thông báo dòng họ",
        entity_type="ANNOUNCEMENT",
        entity_id=notif.notification_id,
        new_data={"title": notif.title, "recipient_count": len(member_user_ids)},
        reason="Thông báo dòng họ",
        occurred_at=now_utc,
    ))

    await db.commit()

    return {
        "success": True,
        "message": f"Đã phát thông báo thành công đến {len(member_user_ids)} thành viên dòng họ.",
        "announcement": {
            "id": str(notif.notification_id),
            "clanName": clan.name,
            "senderName": notif.sender_name,
            "senderRole": notif.sender_role,
            "title": notif.title,
            "content": notif.body,
            "category": notif.type.lower(),
            "targetAudience": notif.target_audience,
            "priority": notif.priority,
            "channels": notif.channels,
            "createdAt": notif.created_at.strftime("%d/%m/%Y %H:%M"),
            "recipientCount": len(member_user_ids),
            "readCount": 1,
        }
    }


@router.get("/families/{family_id}/announcements")
async def list_clan_announcements(
    family_id: str,
    db: AsyncSession = Depends(get_db),
    account: Account = Depends(get_current_account),
):
    """Danh sách các thông báo hoạt động & sự kiện của dòng họ."""
    f_uuid = _family_uuid(family_id)

    clan_res = await db.execute(select(Clan).where(Clan.clan_id == f_uuid))
    clan = clan_res.scalar_one_or_none()
    clan_name = clan.name if clan else "Dòng họ"

    stmt = select(Notification).where(
        Notification.clan_id == f_uuid
    ).order_by(Notification.created_at.desc())

    res = await db.execute(stmt)
    notifs = res.scalars().all()

    items = []
    for n in notifs:
        u_res = await db.execute(
            select(
                func.count(UserNotification.user_id),
                func.count(UserNotification.read_at),
            ).where(UserNotification.notification_id == n.notification_id)
        )
        rec_cnt, read_cnt = u_res.first() or (0, 0)

        items.append({
            "id": str(n.notification_id),
            "clanName": clan_name,
            "senderName": n.sender_name or "Hội đồng gia tộc",
            "senderRole": n.sender_role or "Ban quản trị",
            "title": n.title,
            "content": n.body,
            "category": (n.type or "system").lower(),
            "targetAudience": n.target_audience or "all",
            "priority": n.priority or "normal",
            "channels": n.channels or {"inApp": True, "email": True, "push": False},
            "createdAt": n.created_at.strftime("%d/%m/%Y %H:%M"),
            "recipientCount": rec_cnt,
            "readCount": read_cnt,
        })

    return items


@router.delete("/families/{family_id}/announcements/{announcement_id}")
async def delete_clan_announcement(
    family_id: str,
    announcement_id: str,
    db: AsyncSession = Depends(get_db),
    account: Account = Depends(get_current_account),
):
    """Xóa / thu hồi thông báo dòng họ."""
    f_uuid = _family_uuid(family_id)
    await _require_branch_scope(db, account, f_uuid, None, "family.update")

    try:
        a_uuid = uuid.UUID(announcement_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid announcement_id")

    n_res = await db.execute(select(Notification).where(Notification.notification_id == a_uuid, Notification.clan_id == f_uuid))
    notif = n_res.scalar_one_or_none()
    if not notif:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông báo")

    await db.delete(notif)
    await db.commit()
    return {"success": True, "message": "Đã xóa thông báo dòng họ thành công."}


@router.get("/notifications")
async def list_user_notifications(
    db: AsyncSession = Depends(get_db),
    account: Account = Depends(get_current_account),
):
    """Hòm thư thông báo cá nhân thành viên."""
    stmt = (
        select(Notification, UserNotification.read_at)
        .join(UserNotification, UserNotification.notification_id == Notification.notification_id)
        .where(UserNotification.user_id == account.id)
        .order_by(Notification.created_at.desc())
        .limit(100)
    )

    res = await db.execute(stmt)
    rows = res.all()

    items = []
    for notif, read_at in rows:
        items.append({
            "id": str(notif.notification_id),
            "notificationId": str(notif.notification_id),
            "category": (notif.type or "system").lower(),
            "title": notif.title,
            "content": notif.body,
            "createdAt": notif.created_at.strftime("%d/%m/%Y %H:%M"),
            "read": read_at is not None,
            "readAt": read_at.isoformat() if read_at else None,
            "senderName": notif.sender_name or "Hội đồng gia tộc",
            "targetAudience": notif.target_audience or "all",
            "priority": notif.priority or "normal",
        })

    return items


@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    account: Account = Depends(get_current_account),
):
    """Đánh dấu thông báo đã đọc."""
    try:
        n_uuid = uuid.UUID(notification_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid notification_id")

    res = await db.execute(
        select(UserNotification).where(
            UserNotification.notification_id == n_uuid,
            UserNotification.user_id == account.id,
        )
    )
    un = res.scalar_one_or_none()
    if un:
        un.read_at = datetime.now(timezone.utc)
        await db.commit()

    return {"success": True}


@router.put("/notifications/mark-all-read")
async def mark_all_notifications_read(
    db: AsyncSession = Depends(get_db),
    account: Account = Depends(get_current_account),
):
    """Đánh dấu tất cả thông báo trong hộp thư là đã đọc."""
    stmt = (
        update(UserNotification)
        .where(
            UserNotification.user_id == account.id,
            UserNotification.read_at.is_(None),
        )
        .values(read_at=datetime.now(timezone.utc))
    )
    await db.execute(stmt)
    await db.commit()
    return {"success": True}
