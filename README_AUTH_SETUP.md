# 🔐 HƯỚNG DẪN THIẾT LẬP VÀ VẬN HÀNH XÁC THỰC FIREBASE (AUTH SETUP GUIDE)

Tài liệu này hướng dẫn chi tiết cho các thành viên trong nhóm cách thiết lập, cấu hình biến môi trường, đồng bộ tài khoản DEV và vận hành hệ thống xác thực an toàn trong dự án **Multi-Family Genealogy**.

---

## 📌 1. BỘ TÀI KHOẢN FIREBASE DEV CHUẨN DÙNG CHO PHÁT TRIỂN

Dự án DEV đã được khởi tạo 2 tài khoản định danh Firebase thật với UID tương ứng:

| Loại Tài Khoản | Firebase DEV UID | Vai Trò Mặc Định |
| :--- | :--- | :--- |
| **Quản Trị Viên (Admin)** | `Kt23xmxKJ6Stne3GEOerJ5ParHE3` | `admin` |
| **Trưởng Tộc (Family Head)** | `X3Mx5ugiraf0rwqNWxaJVaHdZ632` | `family_head` |
| **Thành Viên Khác (Member)** | *(Tự động cấp khi đăng ký mới)* | `member` |

---

## 📌 2. QUY TRÌNH THIẾT LẬP BAN ĐẦU (CHO THÀNH VIÊN MỚI)

### Bước 1: Clone và Checkout đúng nhánh Feature
```bash
git clone https://github.com/Thu-Thao21/MULTI-FAMILY-GENEALOGY.git
cd MULTI-FAMILY-GENEALOGY
git checkout feature/da-hoan-thanh-phan-quyen-dang-nhap-dang-ky-quen-mat-khau-fb-gmail
```

### Bước 2: Cấu hình Môi trường Frontend (`FE/.env`)
1. Tạo file `FE/.env` từ file mẫu `FE/.env.example`:
   ```bash
   cp FE/.env.example FE/.env   # MacOS / Linux / Git Bash
   copy FE\.env.example FE\.env # Windows CMD
   ```
2. Điền thông tin Firebase Web Config chung của dự án DEV vào `FE/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api

   VITE_FIREBASE_API_KEY=<DEV_PROJECT_API_KEY>
   VITE_FIREBASE_AUTH_DOMAIN=<DEV_PROJECT_ID>.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=<DEV_PROJECT_ID>
   VITE_FIREBASE_STORAGE_BUCKET=<DEV_PROJECT_ID>.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=<DEV_SENDER_ID>
   VITE_FIREBASE_APP_ID=<DEV_APP_ID>
   ```

### Bước 3: Cấu hình Backend (`BE/.env` & Credentials)
1. Tạo file `BE/.env` từ `BE/.env.example`:
   ```bash
   cp BE/.env.example BE/.env
   ```
2. Xin file **Service Account Key File** (`firebase-service-account.json`) từ Admin dự án và lưu tại đường dẫn:
   `BE/secrets/firebase-service-account.json`

3. Cập nhật file `BE/.env`:
   ```env
   APP_ENV=development
   DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5433/multi_family_db

   DEV_ADMIN_FIREBASE_UID=Kt23xmxKJ6Stne3GEOerJ5ParHE3
   DEV_FAMILY_HEAD_FIREBASE_UID=X3Mx5ugiraf0rwqNWxaJVaHdZ632

   FIREBASE_PROJECT_ID=<DEV_PROJECT_ID>
   FIREBASE_CREDENTIALS_PATH=secrets/firebase-service-account.json

   CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost:8000
   ```

---

## 🔄 3. ĐỒNG BỘ FIREBASE DEV UIDS VÀO POSTGRESQL (SYNC DEV ROLES)

Sau khi khởi chạy PostgreSQL DB lần đầu, chạy script đồng bộ idempotent để nạp 2 UID Admin & Trưởng tộc vào bảng `accounts` và `account_roles`:

```bash
cd BE

# 1. Chạy thử nghiệm kiểm tra (Dry-Run)
python scripts/sync_dev_role_accounts.py --dry-run

# 2. Áp dụng đồng bộ vào PostgreSQL
python scripts/sync_dev_role_accounts.py --apply
```

### Câu lệnh SQL kiểm tra kết quả trong pgAdmin / psql:
```sql
SELECT firebase_uid, email, status FROM accounts
WHERE firebase_uid IN ('Kt23xmxKJ6Stne3GEOerJ5ParHE3', 'X3Mx5ugiraf0rwqNWxaJVaHdZ632');

SELECT a.firebase_uid, ar.role, ar.status
FROM accounts a
JOIN account_roles ar ON ar.account_id = a.id
WHERE a.firebase_uid IN ('Kt23xmxKJ6Stne3GEOerJ5ParHE3', 'X3Mx5ugiraf0rwqNWxaJVaHdZ632');
```

**Kết quả mong đợi:**
- `Kt23xmxKJ6Stne3GEOerJ5ParHE3` -> role `admin` / status `active`
- `X3Mx5ugiraf0rwqNWxaJVaHdZ632` -> role `family_head` / status `active`

---

## 🚀 4. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG (PORT 8000)

### 🔹 Cách 1: Chạy Local trực tiếp
1. **Khởi chạy Backend (FastAPI - Port 8000):**
   ```bash
   cd BE
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```
2. **Khởi chạy Frontend (Vite + React - Port 5173):**
   ```bash
   cd FE
   npm install
   npm run dev
   ```

### 🔹 Cách 2: Chạy bằng Docker Compose
Tạo file `.env` ở thư mục root từ `.env.docker.example`, sau đó chạy:
```bash
docker-compose up --build
```

---

## 🔐 5. ROUTING THEO VAI TRÒ (ROLES)

| Đường Dẫn Route | Vai Trò Được Phép | Điều Hướng UI |
| :--- | :--- | :--- |
| `/login` | Public | Đăng nhập Email / SĐT OTP / Google |
| `/register` | Public | Đăng ký tài khoản Email / SĐT OTP |
| `/member/*` | `member`, `family_head`, `admin` | Khu vực Thành viên |
| `/family-head/*` | `family_head`, `admin` | Khu vực Trưởng Tộc (UID `X3Mx5ugiraf0rwqNWxaJVaHdZ632`) |
| `/admin/*` | `admin` | Khu vực Quản Trị Viên (UID `Kt23xmxKJ6Stne3GEOerJ5ParHE3`) |
| `/403` | Public | Trang Báo Lỗi Truy Cập Bị Từ Chối |
