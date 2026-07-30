import os
from datetime import datetime, timedelta, timezone
from pymongo import MongoClient
from pymongo.errors import PyMongoError, OperationFailure

# Thử URI mặc định với authSource=admin, hoặc fallback không auth
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://root:example@localhost:27017/multi_family_db?authSource=admin")
DB_NAME = os.getenv("MONGODB_DB", "multi_family_db")

def create_mongo_client(uri: str):
    return MongoClient(uri, serverSelectionTimeoutMS=5000)

client = None
try:
    client = create_mongo_client(MONGO_URI)
    client.admin.command("ping")
    print(f"[OK] Da ket noi thanh cong toi MongoDB tai {MONGO_URI}")
except Exception as exc:
    print(f"[INFO] Ket noi authSource khong thanh cong. Dang thu ket noi local khong auth...")
    try:
        FALLBACK_URI = "mongodb://localhost:27017"
        client = create_mongo_client(FALLBACK_URI)
        client.admin.command("ping")
        print(f"[OK] Da ket noi thanh cong toi MongoDB tai {FALLBACK_URI}")
    except Exception as exc2:
        print(f"[ERROR] Khong the ket noi MongoDB: {exc2}")
        print("Hay chac chan MongoDB container hoac service dang chay truoc khi import du lieu.")
        raise SystemExit(1) from exc2

db = client[DB_NAME]

# Drop existing seed data for a clean import
for collection_name in ["families", "members", "relationships", "family_links", "users", "password_resets"]:
    db[collection_name].delete_many({})

now = datetime.now(timezone.utc)

# ==========================================
# 1. USERS COLLECTION (Tài khoản & Auth / Quên mật khẩu - US-01 đến US-05)
# ==========================================
users = [
    {
        "_id": "user_admin_001",
        "email": "nguyenvanan.admin@gmail.com",
        "username": "admin",
        "full_name": "Nguyễn Văn An",
        "password_hash": "$2b$12$e8N8Zg1f1R.mXyK8H.yUueYxL8g9Jk5fW1uL0gH3bM6c7d8e9f0g1",
        "phone": "0912345678",
        "member_id": "member_001",
        "role": "admin",
        "status": "active",
        "reset_token": None,
        "reset_token_expires_at": None,
        "otp_code": None,
        "otp_expires_at": None,
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "user_002",
        "email": "tranthithao.head@gmail.com",
        "username": "thao_truongho",
        "full_name": "Trần Thị Thảo",
        "password_hash": "$2b$12$e8N8Zg1f1R.mXyK8H.yUueYxL8g9Jk5fW1uL0gH3bM6c7d8e9f0g1",
        "phone": "0987654321",
        "member_id": "member_005",
        "role": "family_head",
        "status": "active",
        "reset_token": "token_reset_demo_123456",
        "reset_token_expires_at": now + timedelta(hours=1),
        "otp_code": "888999",
        "otp_expires_at": now + timedelta(minutes=15),
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "user_003",
        "email": "nguyenvanhung.dev@gmail.com",
        "username": "hung_nguyen",
        "full_name": "Nguyễn Văn Hùng",
        "password_hash": "$2b$12$e8N8Zg1f1R.mXyK8H.yUueYxL8g9Jk5fW1uL0gH3bM6c7d8e9f0g1",
        "phone": "0935123456",
        "member_id": "member_005",
        "role": "member",
        "status": "active",
        "reset_token": None,
        "reset_token_expires_at": None,
        "otp_code": None,
        "otp_expires_at": None,
        "created_at": now,
        "updated_at": now,
    }
]

# ==========================================
# 2. PASSWORD_RESETS COLLECTION (US-04: Quên / Đặt lại mật khẩu)
# ==========================================
password_resets = [
    {
        "_id": "reset_001",
        "user_id": "user_002",
        "email_or_phone": "tranthithao.head@gmail.com",
        "reset_token": "token_reset_demo_123456",
        "otp_code": "888999",
        "expires_at": now + timedelta(hours=1),
        "is_used": False,
        "created_at": now,
    }
]

# ==========================================
# 3. FAMILIES COLLECTION (US-12 & US-15)
# ==========================================
families = [
    {
        "_id": "family_001",
        "name": "Dòng họ Nguyễn",
        "founder_name": "Nguyễn Văn Tý",
        "founder_member_id": "member_001",
        "family_head_id": "member_005",
        "origin_place": "Làng An Bằng, xã Phú Lộc, huyện Hương Thủy, Thừa Thiên Huế",
        "ancestral_house_address": "Số 12 Đường Tổ Tiên, xã Phú Lộc, Huế",
        "history": "Dòng họ Nguyễn lập nghiệp từ đầu thế kỷ 20, nổi tiếng với truyền thống hiếu học, canh tác nông nghiệp và đóng góp cho quê hương.",
        "description": "Gia phả trực hệ dòng họ Nguyễn (Chi Trưởng & Chi 2 tại Huế và TP.HCM).",
        "branches": ["Chi Trưởng", "Chi 2", "Nhánh Đông"],
        "status": "active",
        "created_by": "user_admin_001",
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "family_002",
        "name": "Dòng họ Trần",
        "founder_name": "Trần Văn Hùng",
        "founder_member_id": "member_006",
        "family_head_id": "member_006",
        "origin_place": "Huyện Quảng Điền, Thừa Thiên Huế",
        "ancestral_house_address": "Số 45 Đường Hương Trà, Huế",
        "history": "Dòng họ Trần có bề dày truyền thống y học và thương mại cổ truyền.",
        "description": "Gia phả dòng họ Trần - Dòng họ ngoại liên kết hôn nhân với Họ Nguyễn.",
        "branches": ["Chi Trưởng"],
        "status": "active",
        "created_by": "user_002",
        "created_at": now,
        "updated_at": now,
    }
]

# ==========================================
# 4. MEMBERS COLLECTION (US-06 đến US-11, US-14)
# ==========================================
members = [
    {
        "_id": "member_001",
        "family_id": "family_001",
        "user_id": "user_admin_001",
        "full_name": "Nguyễn Văn Tý",
        "other_name": "Cụ Tổ Tý (Cụ Thủy Tổ)",
        "gender": "male",
        "birth_date": "1901-01-15",
        "death_date": "1982-08-20",
        "lunar_death_date": "02/07 (Mùng 2 tháng 7 Âm lịch)",
        "is_alive": False,
        "burial_place": "Nghĩa trang Gia tộc Họ Nguyễn, Đồi Vọng Cảnh, TP. Huế",
        "burial_coordinates": {"lat": 16.4521, "lng": 107.5789},
        "father_id": None,
        "mother_id": None,
        "branch": "Chi Trưởng",
        "sub_branch": "Nhánh 1",
        "display_order": 1,
        "status": "deceased",
        "occupation": "Thầy đồ & Nông dân",
        "education": "Chữ Nho & Tiểu học Pháp - Việt",
        "bio": "Cụ Thủy tổ sáng lập ra dòng họ Nguyễn tại Phú Lộc. Cụ có công khai hoang lập làng và khai mở phong trào hiếu học trong vùng.",
        "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
        "gallery_photos": [
            {"url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800", "caption": "Ảnh tư liệu cụ Tý năm 1970"},
            {"url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800", "caption": "Nhà thờ tổ thời sơ khai"}
        ],
        "career_history": [
            {"period": "1920 - 1945", "role": "Dạy chữ Nho cho con em trong làng", "organization": "Lớp học làng An Bằng"},
            {"period": "1945 - 1975", "role": "Hội đồng Tộc biểu dòng họ", "organization": "Hội đồng Gia tộc Họ Nguyễn"}
        ],
        "contact": {
            "phone": "0912345678",
            "email": "nguyenvanan.admin@gmail.com",
            "address": "Xã Phú Lộc, huyện Hương Thủy, Thừa Thiên Huế"
        },
        "privacy_settings": {
            "show_phone": True,
            "show_email": True,
            "show_address": True
        },
        "contribution": {
            "ability": "Lãnh đạo & Nông nghiệp",
            "specialty": "Khai hoang, Lập phả hệ",
            "field": "Quản trị gia tộc",
            "fund_donated_vnd": 50000000,
            "support_community": True
        },
        "generation": 1,
        "is_primary": True,
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "member_002",
        "family_id": "family_001",
        "user_id": None,
        "full_name": "Nguyễn Thị Lan",
        "other_name": "Cụ Bà Lan",
        "gender": "female",
        "birth_date": "1905-03-20",
        "death_date": "1988-11-12",
        "lunar_death_date": "04/10 (Mùng 4 tháng 10 Âm lịch)",
        "is_alive": False,
        "burial_place": "Nghĩa trang Gia tộc Họ Nguyễn, Đồi Vọng Cảnh, TP. Huế",
        "burial_coordinates": {"lat": 16.4523, "lng": 107.5791},
        "father_id": None,
        "mother_id": None,
        "branch": "Chi Trưởng",
        "sub_branch": "Nhánh 1",
        "display_order": 2,
        "status": "deceased",
        "occupation": "Thương gia nhỏ & Nội trợ",
        "education": "Tự học",
        "bio": "Phụ nữ đức hạnh, có công nuôi dạy các con thành tài và gìn giữ nếp nhà ấm êm qua hai cuộc chiến tranh.",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
        "gallery_photos": [],
        "career_history": [
            {"period": "1930 - 1970", "role": "Kinh doanh nông sản tại chợ quê", "organization": "Chợ Phú Lộc"}
        ],
        "contact": {
            "phone": "0912345679",
            "email": "culan@giadinh.vn",
            "address": "Phú Lộc, Huế"
        },
        "privacy_settings": {"show_phone": False, "show_email": False, "show_address": True},
        "contribution": {
            "ability": "Quản lý tài chính gia đình",
            "specialty": "Buôn bán nhỏ",
            "field": "Kinh doanh",
            "fund_donated_vnd": 20000000,
            "support_community": True
        },
        "generation": 1,
        "is_primary": True,
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "member_003",
        "family_id": "family_001",
        "user_id": None,
        "full_name": "Nguyễn Văn Bình",
        "other_name": "Ông Bình (Bác Trưởng)",
        "gender": "male",
        "birth_date": "1932-05-10",
        "death_date": None,
        "lunar_death_date": None,
        "is_alive": True,
        "burial_place": None,
        "father_id": "member_001",
        "mother_id": "member_002",
        "branch": "Chi Trưởng",
        "sub_branch": "Nhánh 1",
        "display_order": 3,
        "status": "alive",
        "occupation": "Kỹ sư Cơ khí (Đã nghỉ hưu)",
        "education": "Đại học Bách Khoa",
        "bio": "Bác trưởng tộc đời thứ 2, hiện đang lưu giữ gia phả gốc và đứng ra tổ chức ngày giỗ tổ hàng năm.",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        "gallery_photos": [],
        "career_history": [
            {"period": "1958 - 1995", "role": "Chủ nhiệm xưởng cơ khí", "organization": "Nhà máy Cơ khí Đà Nẵng"}
        ],
        "contact": {
            "phone": "0918273645",
            "email": "nguyenvanbinh1932@gmail.com",
            "address": "Số 88 Đường Hải Phòng, Q. Thanh Khê, Đà Nẵng"
        },
        "privacy_settings": {"show_phone": True, "show_email": True, "show_address": True},
        "contribution": {
            "ability": "Cơ khí & Quản lý",
            "specialty": "Biên soạn gia phả",
            "field": "Kỹ thuật",
            "fund_donated_vnd": 100000000,
            "support_community": True
        },
        "generation": 2,
        "is_primary": False,
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "member_004",
        "family_id": "family_001",
        "user_id": None,
        "full_name": "Nguyễn Thị Mai",
        "other_name": "Cô Mai",
        "gender": "female",
        "birth_date": "1938-08-15",
        "death_date": None,
        "lunar_death_date": None,
        "is_alive": True,
        "burial_place": None,
        "father_id": "member_001",
        "mother_id": "member_002",
        "branch": "Chi Trưởng",
        "sub_branch": "Nhánh 2",
        "display_order": 4,
        "status": "alive",
        "occupation": "Nhà giáo Ưu tú",
        "education": "Đại học Sư phạm Huế",
        "bio": "Cựu giáo viên chuyên Văn nổi tiếng tại Huế, hỗ trợ thành lập Quỹ Khuyến học dòng họ Nguyễn.",
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        "gallery_photos": [],
        "career_history": [
            {"period": "1960 - 1998", "role": "Giáo viên Ngữ văn", "organization": "Trường THPT Quốc Học Huế"}
        ],
        "contact": {
            "phone": "0905112233",
            "email": "nguyenthimai.hue@gmail.com",
            "address": "Số 15 Đường Lê Lợi, TP. Huế"
        },
        "privacy_settings": {"show_phone": True, "show_email": False, "show_address": True},
        "contribution": {
            "ability": "Giáo dục & Sáng tác",
            "specialty": "Khuyến học gia tộc",
            "field": "Giáo dục",
            "fund_donated_vnd": 30000000,
            "support_community": True
        },
        "generation": 2,
        "is_primary": False,
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "member_005",
        "family_id": "family_001",
        "user_id": "user_003",
        "full_name": "Nguyễn Văn Hùng",
        "other_name": "Hùng Nguyễn",
        "gender": "male",
        "birth_date": "1975-10-25",
        "death_date": None,
        "lunar_death_date": None,
        "is_alive": True,
        "burial_place": None,
        "father_id": "member_003",
        "mother_id": None,
        "branch": "Chi Trưởng",
        "sub_branch": "Nhánh 1",
        "display_order": 5,
        "status": "alive",
        "occupation": "Chuyên gia CNTT & Lập trình viên",
        "education": "Thạc sĩ Khoa học Máy tính",
        "bio": "Cháu đích tôn đời thứ 3 dòng họ Nguyễn, người khởi xướng hệ thống Số hóa Gia phả Liên họ.",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        "gallery_photos": [
            {"url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800", "caption": "Hội thảo chuyển đổi số gia tộc 2025"}
        ],
        "career_history": [
            {"period": "2000 - Nay", "role": "Giám đốc Công nghệ", "organization": "Tập đoàn Công nghệ Software Co."}
        ],
        "contact": {
            "phone": "0935123456",
            "email": "nguyenvanhung.dev@gmail.com",
            "address": "Căn hộ 12B, Chung cư Vinhomes, Q. Bình Thạnh, TP.HCM"
        },
        "privacy_settings": {"show_phone": True, "show_email": True, "show_address": True},
        "contribution": {
            "ability": "Công nghệ & Số hóa",
            "specialty": "Phát triển phần mềm Gia phả",
            "field": "Công nghệ thông tin",
            "fund_donated_vnd": 150000000,
            "support_community": True
        },
        "generation": 3,
        "is_primary": False,
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "member_006",
        "family_id": "family_002",
        "user_id": "user_002",
        "full_name": "Trần Thị Thảo",
        "other_name": "Thảo Trần",
        "gender": "female",
        "birth_date": "1978-04-12",
        "death_date": None,
        "lunar_death_date": None,
        "is_alive": True,
        "burial_place": None,
        "father_id": None,
        "mother_id": None,
        "branch": "Chi Trưởng",
        "sub_branch": "Nhánh 1",
        "display_order": 1,
        "status": "alive",
        "occupation": "Bác sĩ Chuyên khoa II",
        "education": "Đại học Y Dược TP.HCM",
        "bio": "Trưởng dòng họ Trần (Bên Ngoại), vợ ruột của anh Nguyễn Văn Hùng.",
        "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        "gallery_photos": [],
        "career_history": [
            {"period": "2002 - Nay", "role": "Bác sĩ Trưởng khoa", "organization": "Bệnh viện Chợ Rẫy TP.HCM"}
        ],
        "contact": {
            "phone": "0987654321",
            "email": "tranthithao.head@gmail.com",
            "address": "Chung cư Vinhomes, Q. Bình Thạnh, TP.HCM"
        },
        "privacy_settings": {"show_phone": True, "show_email": True, "show_address": True},
        "contribution": {
            "ability": "Y tế & Chăm sóc sức khỏe",
            "specialty": "Tư vấn y tế cho người cao tuổi dòng họ",
            "field": "Y tế",
            "fund_donated_vnd": 50000000,
            "support_community": True
        },
        "generation": 3,
        "is_primary": True,
        "created_at": now,
        "updated_at": now,
    }
]

# ==========================================
# 5. RELATIONSHIPS COLLECTION (Quan hệ huyết thống & Hôn nhân)
# ==========================================
relationships = [
    {
        "_id": "rel_001",
        "member_a_id": "member_001",
        "member_b_id": "member_002",
        "relation_type": "spouse",
        "is_primary": True,
        "status": "active",
        "start_date": "1928-02-15",
        "end_date": None,
        "verified": True,
        "notes": "Cụ Tổ Nguyễn Văn Tý và Cụ Bà Nguyễn Thị Lan là vợ chồng trực hệ chính thất.",
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "rel_002",
        "member_a_id": "member_001",
        "member_b_id": "member_003",
        "relation_type": "parent_child",
        "is_primary": True,
        "status": "active",
        "start_date": "1932-05-10",
        "end_date": None,
        "verified": True,
        "notes": "Cụ Tý là cha ruột của ông Nguyễn Văn Bình.",
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "rel_003",
        "member_a_id": "member_002",
        "member_b_id": "member_003",
        "relation_type": "parent_child",
        "is_primary": True,
        "status": "active",
        "start_date": "1932-05-10",
        "end_date": None,
        "verified": True,
        "notes": "Cụ Lan là mẹ ruột của ông Nguyễn Văn Bình.",
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "rel_004",
        "member_a_id": "member_003",
        "member_b_id": "member_005",
        "relation_type": "parent_child",
        "is_primary": True,
        "status": "active",
        "start_date": "1975-10-25",
        "end_date": None,
        "verified": True,
        "notes": "Ông Bình là cha ruột của Nguyễn Văn Hùng.",
        "created_at": now,
        "updated_at": now,
    },
    {
        "_id": "rel_005",
        "member_a_id": "member_005",
        "member_b_id": "member_006",
        "relation_type": "spouse",
        "is_primary": True,
        "status": "active",
        "start_date": "2005-09-18",
        "end_date": None,
        "verified": True,
        "notes": "Hôn nhân liên dòng họ: Anh Nguyễn Văn Hùng (Họ Nguyễn) kết hôn cùng Chị Trần Thị Thảo (Họ Trần).",
        "created_at": now,
        "updated_at": now,
    }
]

# ==========================================
# 6. FAMILY_LINKS COLLECTION (Liên kết Liên dòng họ)
# ==========================================
family_links = [
    {
        "_id": "link_001",
        "source_family_id": "family_001",
        "target_family_id": "family_002",
        "linked_member_a": "member_005",
        "linked_member_b": "member_006",
        "link_type": "marriage",
        "request_status": "approved",
        "description": "Mối quan hệ hôn nhân liên kết giữa Dòng họ Nguyễn (Chi Trưởng) và Dòng họ Trần.",
        "status": "active",
        "created_at": now,
        "updated_at": now,
    }
]

# Insert data into MongoDB
if users:
    db.users.insert_many(users)
if password_resets:
    db.password_resets.insert_many(password_resets)
if families:
    db.families.insert_many(families)
if members:
    db.members.insert_many(members)
if relationships:
    db.relationships.insert_many(relationships)
if family_links:
    db.family_links.insert_many(family_links)

print("[OK] Nap du lieu seed chuan thanh cong!")
print("[SUMMARY] So luong ban ghi trong database:")
print({
    "users": db.users.count_documents({}),
    "password_resets": db.password_resets.count_documents({}),
    "families": db.families.count_documents({}),
    "members": db.members.count_documents({}),
    "relationships": db.relationships.count_documents({}),
    "family_links": db.family_links.count_documents({}),
})
