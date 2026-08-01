from __future__ import annotations

import asyncio
from datetime import date, datetime, timezone
from pathlib import Path
import sys

from sqlalchemy import func, select

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.core.security import hash_password
from app.db.postgres import Base, async_session_maker, engine
from app.models.postgres import (
    AuditLog,
    BackupRecord,
    ChangeRequest,
    DeathAnniversaryReminder,
    ExportJob,
    Family,
    FamilyBranch,
    FamilyLink,
    FamilyLinkRequest,
    FamilyMembership,
    FamilyTree,
    ImportJob,
    Member,
    MemberContact,
    MemberFamilyAffiliation,
    MemberLifeEvent,
    MemberMedia,
    MemberPrivacyRule,
    MemberSkill,
    Notification,
    PasswordReset,
    Permission,
    ParentChildRelationship,
    Relationship,
    RolePermission,
    Skill,
    Union,
    UnionMember,
    User,
    UserSession,
)


def parse_date(value: str | None) -> date | None:
    if not value:
        return None
    return datetime.strptime(value, "%Y-%m-%d").date()


async def seed_sample_data() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        user_count = await session.scalar(select(func.count()).select_from(User))
        if user_count and user_count > 0:
            print("[INFO] Dữ liệu mẫu đã tồn tại, bỏ qua.")
            return

        now = datetime.now(timezone.utc)

        user = User(
            id="user_001",
            email="admin@giapha.example",
            username="admin",
            full_name="Nguyễn Văn A",
            password_hash=hash_password("admin123"),
            phone="0901234567",
            role="admin",
            status="active",
            created_at=now,
            updated_at=now,
        )

        permission = Permission(
            id="perm_001",
            code="manage_families",
            name="Quản lý dòng họ",
            description="Cho phép quản trị các dòng họ và thành viên mẫu.",
            created_at=now,
            updated_at=now,
        )

        role_permission = RolePermission(
            id="roleperm_001",
            role_name="admin",
            permission_id="perm_001",
            granted_at=now,
        )

        family = Family(
            id="family_001",
            name="Dòng họ Nguyễn",
            founder_name="Nguyễn Văn Tý",
            origin_place="Làng An Bằng, Thừa Thiên Huế",
            ancestral_house_address="Số 1 Đường Tổ Tiên, Huế",
            history="Dòng họ Nguyễn có truyền thống hiếu học và yêu nước.",
            description="Dòng họ mẫu cho ứng dụng quản lý gia phả.",
            branches=["Chi Trưởng"],
            status="active",
            created_by="user_001",
            created_at=now,
            updated_at=now,
        )

        family_tree = FamilyTree(
            id="tree_001",
            family_id="family_001",
            name="Cây gia phả Nguyễn",
            description="Cây gia phả mẫu cho dòng họ Nguyễn.",
            root_member_id="member_001",
            status="active",
            created_at=now,
            updated_at=now,
        )

        family_branch = FamilyBranch(
            id="branch_001",
            family_id="family_001",
            tree_id="tree_001",
            name="Chi Trưởng",
            description="Chi trưởng truyền thống của dòng họ.",
            branch_order=1,
            status="active",
            created_at=now,
            updated_at=now,
        )

        member = Member(
            id="member_001",
            family_id="family_001",
            user_id="user_001",
            full_name="Nguyễn Văn B",
            other_name="Ông B",
            gender="male",
            birth_date=parse_date("1975-05-10"),
            is_alive=True,
            branch="Chi Trưởng",
            sub_branch="Nhánh chính",
            display_order=1,
            status="alive",
            occupation="Kỹ sư phần mềm",
            education="Đại học Bách khoa",
            bio="Thành viên chính của dòng họ mẫu, đang phát triển hệ thống gia phả.",
            avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
            gallery_photos=[
                {"url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800", "caption": "Ảnh gia đình mẫu"}
            ],
            career_history=[
                {"period": "2000 - nay", "role": "Kỹ sư phần mềm", "organization": "Công ty CNTT"}
            ],
            contact={"phone": "0901234567", "email": "admin@giapha.example", "address": "Huế, Việt Nam"},
            privacy_settings={"show_phone": True, "show_email": True, "show_address": True},
            contribution={
                "ability": "Công nghệ",
                "specialty": "Phát triển phần mềm",
                "field": "CNTT",
            },
            generation=3,
            is_primary=True,
            created_at=now,
            updated_at=now,
        )

        family_membership = FamilyMembership(
            id="membership_001",
            user_id="user_001",
            family_id="family_001",
            membership_role="head",
            status="active",
            joined_at=now,
        )

        user_session = UserSession(
            id="session_001",
            user_id="user_001",
            session_token="token_mau_001",
            expires_at=now.replace(year=now.year + 1),
            ip_address="127.0.0.1",
            user_agent="SampleAgent/1.0",
            created_at=now,
        )

        password_reset = PasswordReset(
            id="reset_001",
            user_id="user_001",
            email_or_phone="admin@giapha.example",
            otp_code="123456",
            expires_at=now.replace(hour=now.hour + 1),
            is_used=False,
            created_at=now,
        )

        parent_child = ParentChildRelationship(
            id="pcr_001",
            parent_member_id="member_001",
            child_member_id="member_001",
            relation_type="biological",
            verified=True,
            notes="Quan hệ mẫu cha con giả định.",
            created_at=now,
            updated_at=now,
        )

        union = Union(
            id="union_001",
            family_id="family_001",
            union_date=parse_date("2000-01-01"),
            union_type="marriage",
            status="active",
            notes="Mối quan hệ hôn nhân mẫu.",
            created_at=now,
            updated_at=now,
        )

        union_member = UnionMember(
            id="unionmember_001",
            union_id="union_001",
            member_id="member_001",
            role="spouse",
            joined_at=now,
        )

        family_link_request = FamilyLinkRequest(
            id="linkreq_001",
            source_family_id="family_001",
            target_family_id="family_001",
            requested_by_user_id="user_001",
            request_type="marriage",
            status="approved",
            message="Yêu cầu liên kết gia phả mẫu.",
            reviewed_by_user_id="user_001",
            reviewed_at=now,
            created_at=now,
            updated_at=now,
        )

        relationship = Relationship(
            id="rel_001",
            member_a_id="member_001",
            member_b_id="member_001",
            relation_type="spouse",
            is_primary=True,
            status="active",
            start_date=parse_date("2000-01-01"),
            verified=True,
            notes="Quan hệ vợ chồng mẫu.",
            created_at=now,
            updated_at=now,
        )

        member_contact = MemberContact(
            id="contact_001",
            member_id="member_001",
            contact_type="email",
            contact_value="admin@giapha.example",
            is_primary=True,
            is_public=True,
            notes="Liên hệ chính của thành viên mẫu.",
            created_at=now,
            updated_at=now,
        )

        member_privacy = MemberPrivacyRule(
            id="privacy_001",
            member_id="member_001",
            field_name="phone",
            visibility_level="family",
            created_at=now,
            updated_at=now,
        )

        member_media = MemberMedia(
            id="media_001",
            member_id="member_001",
            media_type="photo",
            media_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
            caption="Ảnh thành viên mẫu",
            sort_order=1,
            created_at=now,
            updated_at=now,
        )

        member_life_event = MemberLifeEvent(
            id="lifeevent_001",
            member_id="member_001",
            event_type="birth",
            title="Ngày sinh của thành viên mẫu",
            event_date=parse_date("1975-05-10"),
            description="Bố mẹ của thành viên mẫu tổ chức lễ đầy tháng.",
            location="Huế, Việt Nam",
            created_at=now,
            updated_at=now,
        )

        skill = Skill(
            id="skill_001",
            name="Lập trình Python",
            category="Công nghệ",
            description="Kỹ năng mẫu cho thành viên.",
            created_at=now,
            updated_at=now,
        )

        member_skill = MemberSkill(
            id="memberskill_001",
            member_id="member_001",
            skill_id="skill_001",
            proficiency_level="advanced",
            created_at=now,
            updated_at=now,
        )

        change_request = ChangeRequest(
            id="change_001",
            requester_user_id="user_001",
            target_type="member",
            target_id="member_001",
            request_type="update",
            status="approved",
            payload={"field": "occupation", "value": "Kỹ sư cao cấp"},
            reviewer_user_id="user_001",
            reviewed_at=now,
            created_at=now,
            updated_at=now,
        )

        notification = Notification(
            id="notification_001",
            user_id="user_001",
            title="Thông báo mẫu",
            body="Đây là thông báo mẫu dành cho người dùng.",
            notification_type="general",
            is_read=False,
            created_at=now,
        )

        death_reminder = DeathAnniversaryReminder(
            id="reminder_001",
            member_id="member_001",
            reminder_date=parse_date("2025-05-10"),
            status="scheduled",
            notes="Ngày giỗ mẫu của thành viên.",
            created_at=now,
            updated_at=now,
        )

        import_job = ImportJob(
            id="import_001",
            user_id="user_001",
            job_type="family_import",
            source_file="gia_pha_mau.csv",
            status="completed",
            result_summary={"imported": 1, "errors": 0},
            created_at=now,
            updated_at=now,
        )

        export_job = ExportJob(
            id="export_001",
            user_id="user_001",
            job_type="family_export",
            export_format="csv",
            status="completed",
            result_file="gia_pha_mau.csv",
            created_at=now,
            updated_at=now,
        )

        backup_record = BackupRecord(
            id="backup_001",
            created_by_user_id="user_001",
            backup_type="daily",
            file_path="/backups/gia_pha_mau.bak",
            status="created",
            backup_metadata={"size": "1MB"},
            created_at=now,
            updated_at=now,
        )

        audit_log = AuditLog(
            id="audit_001",
            user_id="user_001",
            action="seed_sample_data",
            entity_type="sample",
            entity_id="member_001",
            details={"note": "Tạo dữ liệu mẫu cho từng bảng."},
            ip_address="127.0.0.1",
            created_at=now,
        )

        session.add_all(
            [
                user,
                permission,
                role_permission,
                family,
                family_tree,
                family_branch,
                member,
                family_membership,
                user_session,
                password_reset,
                parent_child,
                union,
                union_member,
                family_link_request,
                relationship,
                member_contact,
                member_privacy,
                member_media,
                member_life_event,
                skill,
                member_skill,
                change_request,
                notification,
                death_reminder,
                import_job,
                export_job,
                backup_record,
                audit_log,
            ]
        )

        await session.commit()

        print("[OK] Đã chèn dữ liệu mẫu cho mỗi bảng.")


if __name__ == "__main__":
    asyncio.run(seed_sample_data())
