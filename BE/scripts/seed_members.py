from __future__ import annotations

import asyncio
from datetime import date, datetime, timezone
from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from sqlalchemy import delete, func, select
from app.db.postgres import Base, async_session_maker, engine
from app.models.postgres import (
    Family,
    Member,
    MemberContact,
    MemberLifeEvent,
    MemberMedia,
    MemberSkill,
    Skill,
)


def parse_date(val: str | None) -> date | None:
    if not val:
        return None
    return datetime.strptime(val, "%Y-%m-%d").date()


async def seed_members():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        # Seed 5 families
        families_seed = [
            ("family_001", "Dòng họ Nguyễn", "Nguyễn Văn Tổ", "Làng An Bằng, Thừa Thiên Huế", "Số 1 Đường Tổ Tiên, Huế", "Dòng họ Nguyễn có truyền thống hiếu học và yêu nước.", ["Chi Trưởng", "Chi Thứ", "Chi III"]),
            ("family_002", "Dòng họ Trần", "Trần Văn Khởi", "Nam Định", "Số 12 Đường Hùng Vương, Nam Định", "Dòng họ Trần nổi tiếng với danh nhân khoa bảng.", ["Chi Trưởng"]),
            ("family_003", "Dòng họ Lê", "Lê Văn Thái", "Thanh Hóa", "Số 5 Đường Le Lợi, Thanh Hóa", "Dòng họ Lê có bề dày truyền thống văn hóa võ học.", ["Chi 1", "Chi 2"]),
            ("family_004", "Dòng họ Phạm", "Phạm Văn Đức", "Quảng Nam", "Số 88 Đường Điện Biên Phủ, Đà Nẵng", "Dòng họ Phạm năng động trong kinh thương và giáo dục.", ["Chi Trưởng"]),
            ("family_005", "Dòng họ Vũ", "Vũ Văn Minh", "Hải Dương", "Số 15 Đường Tổ Gia, Hải Dương", "Dòng họ Vũ nổi danh với nhiều tri thức công nghệ.", ["Chi Nhánh A"]),
        ]
        now = datetime.now(timezone.utc)
        for f_id, f_name, f_founder, f_origin, f_addr, f_hist, f_branches in families_seed:
            res_f = await session.execute(select(Family).where(Family.id == f_id))
            if not res_f.scalar_one_or_none():
                session.add(
                    Family(
                        id=f_id,
                        name=f_name,
                        founder_name=f_founder,
                        origin_place=f_origin,
                        ancestral_house_address=f_addr,
                        history=f_hist,
                        branches=f_branches,
                        status="active",
                        created_at=now,
                        updated_at=now,
                    )
                )
        await session.commit()

        # Seed Skills
        skills_data = [
            ("skill_001", "CNTT & Phần mềm", "Công nghệ"),
            ("skill_002", "Y học & Chăm sóc sức khỏe", "Y tế"),
            ("skill_003", "Giáo dục & NCKH", "Giáo dục"),
            ("skill_004", "Quản trị & Kinh doanh", "Kinh tế"),
            ("skill_005", "Nghệ thuật & Hội họa", "Văn hóa"),
        ]
        for s_id, s_name, s_cat in skills_data:
            existing_skill = await session.scalar(select(Skill).where(Skill.id == s_id))
            if not existing_skill:
                session.add(Skill(id=s_id, name=s_name, category=s_cat))
        await session.commit()

        # Check existing members count
        existing_mem_count = await session.scalar(select(func.count()).select_from(Member).where(Member.family_id == "family_001"))
        if existing_mem_count and existing_mem_count > 5:
            print("[INFO] Dữ liệu thành viên mẫu đã phong phú, không cần re-seed.")
            return

        now = datetime.now(timezone.utc)

        members_list = [
            # Thủy tổ & Thế hệ 1
            Member(
                id="member_001",
                family_id="family_001",
                full_name="Nguyễn Văn Tổ",
                other_name="Cụ Khởi Tổ",
                gender="male",
                birth_date=parse_date("1920-01-15"),
                death_date=parse_date("1998-11-20"),
                lunar_death_date="22 tháng 10 năm Mậu Dần",
                is_alive=False,
                burial_place="Nghĩa trang gia tộc An Bằng, Huế",
                branch="Chi Trưởng",
                generation=1,
                display_order=1,
                status="deceased",
                occupation="Nhà giáo ưu tú",
                education="Tú tài Hán học",
                bio="Cụ Nguyễn Văn Tổ là người khai sáng chi họ Nguyễn tại An Bằng, Huế. Cụ là nhà giáo dạy chữ Hán và Quốc ngữ nổi tiếng trong vùng.",
                avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
                gallery_photos=[
                    {"url": "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800", "caption": "Nhà thờ tổ dòng họ Nguyễn tại Huế"},
                    {"url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800", "caption": "Sắc phong gia tộc"}
                ],
                career_history=[
                    {"period": "1940 - 1975", "role": "Hiệu trưởng", "organization": "Trường Tiểu học An Bằng"},
                    {"period": "1975 - 1990", "role": "Trưởng ban Tộc biểu", "organization": "Hội đồng Gia tộc Nguyễn"}
                ],
                contact={"phone": "0901234567", "email": "nguyen.to@giapha.vn", "address": "Số 1 Đường Tổ Tiên, Huế"},
                privacy_settings={"show_phone": True, "show_email": True},
                contribution={"ability": "Hán học & Phong thủy", "specialty": "Viết tộc phả, văn cúng", "field": "Văn hóa gia tộc"},
                is_primary=True,
                created_at=now,
                updated_at=now,
            ),
            Member(
                id="member_002",
                family_id="family_001",
                full_name="Lê Thị Huệ",
                other_name="Bà Cụ Tổ",
                gender="female",
                birth_date=parse_date("1925-03-20"),
                death_date=parse_date("2005-08-10"),
                lunar_death_date="06 tháng 07 năm Ất Dậu",
                is_alive=False,
                burial_place="Nghĩa trang gia tộc An Bằng, Huế",
                branch="Chi Trưởng",
                generation=1,
                display_order=2,
                status="deceased",
                occupation="Nội trợ & Đông y",
                education="Tiểu học",
                bio="Bà Lê Thị Huệ là phu nhân Cụ Nguyễn Văn Tổ, người hiền thục, chu đáo nuôi dạy 4 người con thành tài.",
                avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
                created_at=now,
                updated_at=now,
            ),

            # Thế hệ 2 (Con cái)
            Member(
                id="member_003",
                family_id="family_001",
                father_id="member_001",
                mother_id="member_002",
                full_name="Nguyễn Văn Bình",
                other_name="Ông Bình (Trưởng nam)",
                gender="male",
                birth_date=parse_date("1948-06-12"),
                is_alive=True,
                branch="Chi Trưởng",
                sub_branch="Nhánh A",
                generation=2,
                display_order=1,
                status="alive",
                occupation="Kỹ sư Thủy lợi (Đã nghỉ hưu)",
                education="Đại học Thủy lợi Hà Nội",
                bio="Ông Nguyễn Văn Bình là Trưởng tộc hiện tại của dòng họ Nguyễn. Nguyên Trưởng phòng Thủy lợi tỉnh Thừa Thiên Huế.",
                avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                gallery_photos=[
                    {"url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800", "caption": "Họp mặt dòng họ năm 2025"}
                ],
                career_history=[
                    {"period": "1972 - 2008", "role": "Kỹ sư trưởng", "organization": "Sở Thủy lợi Thừa Thiên Huế"}
                ],
                contact={"phone": "0913456789", "email": "nguyenvanbinh@gmail.com", "address": "TP. Huế"},
                contribution={"ability": "Quản trị dòng họ", "specialty": "Họp tộc, lập quỹ khuyến học", "field": "Gia tộc & Xã hội"},
                is_primary=False,
                created_at=now,
                updated_at=now,
            ),
            Member(
                id="member_004",
                family_id="family_001",
                father_id="member_001",
                mother_id="member_002",
                full_name="Nguyễn Văn Đức",
                other_name="Chú Đức",
                gender="male",
                birth_date=parse_date("1952-09-05"),
                is_alive=True,
                branch="Chi Thứ",
                generation=2,
                display_order=2,
                status="alive",
                occupation="Bác sĩ Đông y",
                education="Đại học Y Dược TP.HCM",
                bio="Bác sĩ giỏi ngành y học cổ truyền, hiện mở phòng chẩn trị YHCT tại TP. Hồ Chí Minh.",
                avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
                contact={"phone": "0908123456", "email": "bs.nguyenvanduc@gmail.com", "address": "Quận 3, TP.HCM"},
                created_at=now,
                updated_at=now,
            ),
            Member(
                id="member_005",
                family_id="family_001",
                father_id="member_001",
                mother_id="member_002",
                full_name="Nguyễn Thị Mai",
                other_name="Cô Mai",
                gender="female",
                birth_date=parse_date("1956-11-30"),
                is_alive=True,
                branch="Chi Trưởng",
                generation=2,
                display_order=3,
                status="alive",
                occupation="Giáo viên Văn học",
                education="Đại học Sư phạm Huế",
                bio="Cô giáo ưu tú dạy môn Ngữ văn tại Trường THPT Quốc Học Huế.",
                avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
                created_at=now,
                updated_at=now,
            ),

            # Thế hệ 3 (Cháu)
            Member(
                id="member_006",
                family_id="family_001",
                father_id="member_003",
                full_name="Nguyễn Văn Hùng",
                other_name="Hùng Nguyễn",
                gender="male",
                birth_date=parse_date("1980-04-18"),
                is_alive=True,
                branch="Chi Trưởng",
                sub_branch="Nhánh A",
                generation=3,
                display_order=1,
                status="alive",
                occupation="Chuyên gia CNTT & AI",
                education="Đại học Bách Khoa Hà Nội",
                bio="Nguyễn Văn Hùng là kiến trúc sư phần mềm, tác giả chính xây dựng Hệ thống Quản lý Gia phả Đa Dòng họ.",
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
                career_history=[
                    {"period": "2004 - 2015", "role": "Senior Developer", "organization": "FPT Software"},
                    {"period": "2015 - nay", "role": "CTO & Co-founder", "organization": "TechGenealogy Corp"}
                ],
                contact={"phone": "0935123456", "email": "hung.nguyen@techgenealogy.com", "address": "Cầu Giấy, Hà Nội"},
                contribution={"ability": "Phần mềm & AI", "specialty": "Chuyển đổi số số hóa cây gia phả", "field": "Công nghệ thông tin"},
                created_at=now,
                updated_at=now,
            ),
            Member(
                id="member_007",
                family_id="family_001",
                father_id="member_003",
                full_name="Nguyễn Thị Thu Thảo",
                other_name="Thảo Trần",
                gender="female",
                birth_date=parse_date("1985-08-25"),
                is_alive=True,
                branch="Chi Trưởng",
                sub_branch="Nhánh A",
                generation=3,
                display_order=2,
                status="alive",
                occupation="Thạc sĩ Quản trị Kinh doanh",
                education="Đại học Kinh tế TP.HCM",
                bio="Chuyên gia quản trị nhân sự & sự kiện gia tộc, tích cực tham gia kết nối dòng họ.",
                avatar_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
                contact={"phone": "0987654321", "email": "thao.nguyen@gmail.com", "address": "Quận 1, TP.HCM"},
                created_at=now,
                updated_at=now,
            ),
            Member(
                id="member_008",
                family_id="family_001",
                father_id="member_004",
                full_name="Nguyễn Văn Minh",
                other_name="Minh Nguyễn",
                gender="male",
                birth_date=parse_date("1988-02-14"),
                is_alive=True,
                branch="Chi Thứ",
                generation=3,
                display_order=1,
                status="alive",
                occupation="Bác sĩ Đa khoa",
                education="Đại học Y Dược Phạm Ngọc Thạch",
                bio="Bác sĩ khoa Cấp cứu Bệnh viện Chợ Rẫy.",
                avatar_url="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
                created_at=now,
                updated_at=now,
            ),

            # Thế hệ 4 (Chắt)
            Member(
                id="member_009",
                family_id="family_001",
                father_id="member_006",
                full_name="Nguyễn Văn Nam",
                other_name="Bé Nam",
                gender="male",
                birth_date=parse_date("2012-05-10"),
                is_alive=True,
                branch="Chi Trưởng",
                sub_branch="Nhánh A",
                generation=4,
                display_order=1,
                status="alive",
                occupation="Học sinh",
                education="Trường THCS Giảng Võ",
                bio="Chắt nội đời thứ 4 dòng họ Nguyễn, học sinh giỏi cấp thành phố môn Tin học.",
                avatar_url="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
                created_at=now,
                updated_at=now,
            ),

            # Dòng họ Trần (Dữ liệu liên kết)
            Member(
                id="member_010",
                family_id="family_002",
                full_name="Trần Văn Khởi",
                other_name="Cụ Trần Khởi",
                gender="male",
                birth_date=parse_date("1922-04-05"),
                death_date=parse_date("2000-12-15"),
                is_alive=False,
                branch="Chi Trưởng",
                generation=1,
                status="deceased",
                occupation="Nhà sư phạm",
                education="Đại học Đông Dương",
                bio="Cụ Khởi là ngọn cờ đầu của dòng họ Trần Nam Định.",
                avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
                created_at=now,
                updated_at=now,
            ),
        ]

        for m in members_list:
            existing = await session.scalar(select(Member).where(Member.id == m.id))
            if not existing:
                session.add(m)
        await session.commit()

        # Seed Member Contacts
        contacts = [
            MemberContact(id="cnt_001", member_id="member_006", contact_type="phone", contact_value="0935123456", is_primary=True, is_public=True),
            MemberContact(id="cnt_002", member_id="member_006", contact_type="email", contact_value="hung.nguyen@techgenealogy.com", is_primary=True, is_public=True),
            MemberContact(id="cnt_003", member_id="member_006", contact_type="zalo", contact_value="0935123456", is_primary=False, is_public=True),
            MemberContact(id="cnt_004", member_id="member_003", contact_type="phone", contact_value="0913456789", is_primary=True, is_public=True),
        ]
        for c in contacts:
            if not await session.scalar(select(MemberContact).where(MemberContact.id == c.id)):
                session.add(c)

        # Seed Life Events
        events = [
            MemberLifeEvent(id="evt_001", member_id="member_001", event_type="birth", title="Ngày sinh Cụ Nguyễn Văn Tổ", event_date=parse_date("1920-01-15"), location="An Bằng, Huế", description="Sinh ra trong gia đình Hán học truyền thống."),
            MemberLifeEvent(id="evt_002", member_id="member_001", event_type="marriage", title="Lễ thành hôn với Bà Lê Thị Huệ", event_date=parse_date("1942-05-10"), location="Huế", description="Độc lập tự do thành gia lập nghiệp."),
            MemberLifeEvent(id="evt_003", member_id="member_006", event_type="graduation", title="Tốt nghiệp Đại học Bách Khoa", event_date=parse_date("2004-06-20"), location="Hà Nội", description="Tốt nghiệp Kỹ sư phần mềm xuất sắc."),
            MemberLifeEvent(id="evt_004", member_id="member_006", event_type="award", title="Giải thưởng Sáng tạo Công nghệ Gia Phả", event_date=parse_date("2024-11-15"), location="Hà Nội", description="Được vinh danh giải Nhất cuộc thi Khởi nghiệp Số hóa Di sản."),
        ]
        for e in events:
            if not await session.scalar(select(MemberLifeEvent).where(MemberLifeEvent.id == e.id)):
                session.add(e)

        # Seed Member Media
        media_items = [
            MemberMedia(id="med_001", member_id="member_006", media_type="photo", media_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800", caption="Ảnh chân dung Nguyễn Văn Hùng", sort_order=1),
            MemberMedia(id="med_002", member_id="member_006", media_type="photo", media_url="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800", caption="Hội thảo Số hóa Gia Phả Việt Nam 2025", sort_order=2),
            MemberMedia(id="med_003", member_id="member_001", media_type="photo", media_url="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800", caption="Nhà thờ Tổ dòng họ Nguyễn tại Huế", sort_order=1),
        ]
        for md in media_items:
            if not await session.scalar(select(MemberMedia).where(MemberMedia.id == md.id)):
                session.add(md)

        # Seed Member Skills
        member_skills = [
            MemberSkill(id="msk_001", member_id="member_006", skill_id="skill_001", proficiency_level="expert"),
            MemberSkill(id="msk_002", member_id="member_006", skill_id="skill_004", proficiency_level="advanced"),
            MemberSkill(id="msk_003", member_id="member_004", skill_id="skill_002", proficiency_level="expert"),
            MemberSkill(id="msk_004", member_id="member_005", skill_id="skill_003", proficiency_level="advanced"),
        ]
        for ms in member_skills:
            if not await session.scalar(select(MemberSkill).where(MemberSkill.id == ms.id)):
                session.add(ms)

        await session.commit()
        print("[SUCCESS] Đã chèn 10 thành viên mẫu với đầy đủ contacts, life events, media & skills vào PostgreSQL!")


if __name__ == "__main__":
    asyncio.run(seed_members())
