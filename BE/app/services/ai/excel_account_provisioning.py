"""Dịch vụ cấp tài khoản hàng loạt khi Trưởng tộc import thành viên từ file Excel.

Chức năng:
- Chỉ cấp tài khoản cho thành viên còn sống (isLiving=True và chưa có ngày mất) chưa có liên kết tài khoản.
- Sinh username chuẩn hóa không dấu (và email nội bộ @giapha.com nếu file Excel chưa có email).
- Sinh mật khẩu tạm ngẫu nhiên 8 ký tự, băm bcrypt lưu vào credential_metadata (bắt buộc đổi MK lần đầu).
- Gắn ClanMembership, UserRole ('member') và PersonAccountLink trực tiếp vào Person vừa lên cây.
- Xuất file Excel (.xlsx) chứa danh sách tài khoản & mật khẩu tạm để Trưởng tộc phát cho thành viên.
"""

from __future__ import annotations

import base64
import io
import re
import secrets
import string
import unicodedata
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Set, Tuple

import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.password_hash import hash_password
from app.models.family.entities import Clan, ClanMembership, PersonAccountLink
from app.models.user_access.entities import CredentialMetadata, Role, User, UserRole


def _to_ascii_slug(text_val: str) -> str:
    """Chuyển họ tên tiếng Việt có dấu thành chuỗi chữ thường không dấu chỉ gồm a-z0-9."""
    s = (text_val or "").strip().lower().replace("đ", "d")
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = re.sub(r"[^a-z0-9]+", "", s)
    return s or "thanhvien"


def _gen_temp_password(length: int = 8) -> str:
    """Sinh mật khẩu tạm ngẫu nhiên gồm chữ hoa, chữ thường và chữ số (tránh ký tự dễ nhầm)."""
    upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    lower = "abcdefghjkmnpqrstuvwxyz"
    digits = "23456789"
    pool = upper + lower + digits
    chars = [
        secrets.choice(upper),
        secrets.choice(lower),
        secrets.choice(digits),
        *[secrets.choice(pool) for _ in range(max(length - 3, 5))],
    ]
    secrets.SystemRandom().shuffle(chars)
    return "".join(chars)


def _build_accounts_workbook(clan_name: str, rows: List[Dict[str, Any]]) -> bytes:
    """Tạo file Excel (.xlsx) danh sách tài khoản & mật khẩu tạm cho Trưởng tộc tải về."""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "TAI_KHOAN_MAT_KHAU"

    headers = [
        "STT",
        "Họ và tên",
        "Đời",
        "Chi nhánh",
        "Tên đăng nhập (Username)",
        "Email đăng nhập",
        "Mật khẩu tạm",
        "Trạng thái",
        "Ghi chú",
    ]
    ws.append([f"DANH SÁCH TÀI KHOẢN THÀNH VIÊN - {clan_name.upper()}"])
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(headers))
    ws.cell(1, 1).font = Font(name="Calibri", size=13, bold=True, color="1E3A8A")
    ws.cell(1, 1).alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 28

    ws.append(headers)
    header_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
    for col_idx in range(1, len(headers) + 1):
        c = ws.cell(2, col_idx)
        c.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        c.fill = header_fill
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[2].height = 26

    thin = Border(
        left=Side(style="thin", color="CBD5E1"),
        right=Side(style="thin", color="CBD5E1"),
        top=Side(style="thin", color="CBD5E1"),
        bottom=Side(style="thin", color="CBD5E1"),
    )

    for idx, item in enumerate(rows, start=1):
        ws.append([
            idx,
            item["full_name"],
            item["generation"],
            item["branch_name"],
            item["username"],
            item["email"],
            item["password"],
            item["status"],
            item["note"],
        ])
        r_num = idx + 2
        for col_idx in range(1, len(headers) + 1):
            ws.cell(r_num, col_idx).border = thin
            ws.cell(r_num, col_idx).alignment = Alignment(
                horizontal="center" if col_idx in (1, 3, 7, 8) else "left",
                vertical="center",
            )

    for col_idx in range(1, len(headers) + 1):
        col_letter = get_column_letter(col_idx)
        max_len = max((len(str(ws.cell(r, col_idx).value or "")) for r in range(2, len(rows) + 3)), default=12)
        ws.column_dimensions[col_letter].width = min(max(max_len + 4, 12), 42)

    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


async def provision_accounts_for_imported_persons(
    *,
    db: AsyncSession,
    clan_id: uuid.UUID,
    actor_user_id: uuid.UUID,
    persons_data: List[Dict[str, Any]],
    person_id_map: Dict[str, uuid.UUID],
) -> Dict[str, Any]:
    """Tạo tài khoản hàng loạt cho thành viên còn sống vừa import và xuất Excel TK/MK dạng base64."""
    clan_row = (
        await db.execute(select(Clan.clan_code, Clan.name).where(Clan.clan_id == clan_id))
    ).first()
    clan_code = (clan_row[0] if clan_row and clan_row[0] else "dongho").lower()
    clan_name = clan_row[1] if clan_row and clan_row[1] else "Dòng họ"
    clan_slug = _to_ascii_slug(clan_code)[:16]

    member_role_id = (
        await db.execute(select(Role.role_id).where(Role.code == "member"))
    ).scalar_one_or_none()
    if member_role_id is None:
        raise ValueError("Không tìm thấy vai trò 'member' trong hệ thống phân quyền.")

    existing_usernames: Set[str] = {
        str(u).lower()
        for (u,) in (await db.execute(select(User.username).where(User.username.is_not(None)))).all()
        if u
    }
    existing_emails: Set[str] = {
        str(e).lower()
        for (e,) in (await db.execute(select(User.email))).all()
        if e
    }
    linked_person_ids: Set[uuid.UUID] = {
        pid
        for (pid,) in (
            await db.execute(
                select(PersonAccountLink.person_id).where(
                    PersonAccountLink.clan_id == clan_id,
                    PersonAccountLink.status == "ACTIVE",
                )
            )
        ).all()
        if pid
    }

    now = datetime.now(timezone.utc)
    temp_expires = now + timedelta(days=30)

    users_rows: List[Dict[str, Any]] = []
    cred_rows: List[Dict[str, Any]] = []
    membership_rows: List[Dict[str, Any]] = []
    role_rows: List[Dict[str, Any]] = []
    link_rows: List[Dict[str, Any]] = []
    export_rows: List[Dict[str, Any]] = []

    created_count = 0
    skipped_count = 0

    for p in persons_data:
        p_code = p.get("code")
        p_id = person_id_map.get(p_code) if p_code else None
        full_name = str(p.get("fullName") or "").strip() or "Thành viên"
        generation = p.get("generation") or 1
        branch_name = str(p.get("branchName") or "Chi Trưởng").strip()
        is_living = bool(p.get("isLiving", True)) and not bool(p.get("deathDate"))

        if not p_id:
            continue

        if not is_living:
            skipped_count += 1
            export_rows.append({
                "full_name": full_name,
                "generation": generation,
                "branch_name": branch_name,
                "username": "",
                "email": "",
                "password": "",
                "status": "Bỏ qua",
                "note": "Thành viên đã mất",
            })
            continue

        if p_id in linked_person_ids:
            skipped_count += 1
            export_rows.append({
                "full_name": full_name,
                "generation": generation,
                "branch_name": branch_name,
                "username": "",
                "email": "",
                "password": "",
                "status": "Bỏ qua",
                "note": "Đã có tài khoản liên kết",
            })
            continue

        # Sinh username duy nhất
        base_slug = _to_ascii_slug(full_name)[:24]
        candidate_user = f"{base_slug}.{clan_slug}"
        suffix = 1
        while candidate_user in existing_usernames:
            suffix += 1
            candidate_user = f"{base_slug}{suffix}.{clan_slug}"
        existing_usernames.add(candidate_user)

        # Ưu tiên email từ file Excel nếu hợp lệ và chưa trùng; ngược lại tạo email nội bộ @giapha.com
        raw_email = str(p.get("email") or "").strip().lower()
        if raw_email and "@" in raw_email and raw_email not in existing_emails:
            assigned_email = raw_email
        else:
            assigned_email = f"{candidate_user}@giapha.com"
            e_suffix = 1
            while assigned_email in existing_emails:
                e_suffix += 1
                assigned_email = f"{candidate_user}{e_suffix}@giapha.com"
        existing_emails.add(assigned_email)

        raw_pw = _gen_temp_password(8)
        pw_hash = hash_password(raw_pw)
        new_user_id = uuid.uuid4()

        users_rows.append({
            "user_id": new_user_id,
            "username": candidate_user,
            "email": assigned_email,
            "display_name": full_name,
            "status": "ACTIVE",
            "email_verified": True,
            "phone_verified": False,
            "first_login_required": True,
            "created_at": now,
            "updated_at": now,
        })
        cred_rows.append({
            "user_id": new_user_id,
            "auth_provider": "local",
            "password_hash": pw_hash,
            "temporary_password_issued_at": now,
            "temporary_password_expires_at": temp_expires,
            "must_change_password": True,
            "failed_login_count": 0,
            "updated_at": now,
        })
        membership_rows.append({
            "membership_id": uuid.uuid4(),
            "clan_id": clan_id,
            "user_id": new_user_id,
            "status": "ACTIVE",
            "joined_at": now,
            "lineage_type": "NOI_TOC",
        })
        role_rows.append({
            "user_role_id": uuid.uuid4(),
            "user_id": new_user_id,
            "role_id": member_role_id,
            "clan_id": clan_id,
            "granted_by": actor_user_id,
            "granted_at": now,
        })
        link_rows.append({
            "link_id": uuid.uuid4(),
            "person_id": p_id,
            "user_id": new_user_id,
            "clan_id": clan_id,
            "status": "ACTIVE",
            "linked_by": actor_user_id,
            "linked_at": now,
        })
        export_rows.append({
            "full_name": full_name,
            "generation": generation,
            "branch_name": branch_name,
            "username": candidate_user,
            "email": assigned_email,
            "password": raw_pw,
            "status": "Đã tạo mới",
            "note": "Đăng nhập bằng Username hoặc Email, đổi MK lần đầu",
        })
        created_count += 1

    # Bulk insert theo từng lô 500 bản ghi để tối ưu tốc độ
    for tbl, batch in (
        (User.__table__, users_rows),
        (CredentialMetadata.__table__, cred_rows),
        (ClanMembership.__table__, membership_rows),
        (UserRole.__table__, role_rows),
        (PersonAccountLink.__table__, link_rows),
    ):
        for i in range(0, len(batch), 500):
            await db.execute(insert(tbl), batch[i : i + 500])

    xlsx_bytes = _build_accounts_workbook(clan_name=clan_name, rows=export_rows)
    b64 = base64.b64encode(xlsx_bytes).decode("ascii")

    return {
        "created_accounts": created_count,
        "skipped_accounts": skipped_count,
        "accounts_excel_base64": b64,
        "accounts_excel_filename": f"TaiKhoan_MatKhau_{clan_slug}.xlsx",
    }
