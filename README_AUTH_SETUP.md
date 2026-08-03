# 🔐 HƯỚNG DẪN THIẾT LẬP VÀ VẬN HÀNH XÁC THỰC FIREBASE (AUTH SETUP GUIDE)

Tài liệu này hướng dẫn chi tiết cho các thành viên trong nhóm cách thiết lập, cấu hình biến môi trường và vận hành hệ thống xác thực an toàn trong dự án **Multi-Family Genealogy**.

---

## 📌 1. QUY TRÌNH THIẾT LẬP BAN ĐẦU (CHO THÀNH VIÊN MỚI)

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
   VITE_API_BASE_URL=http://localhost:8001/api

   VITE_FIREBASE_API_KEY=<DEV_PROJECT_API_KEY>
   VITE_FIREBASE_AUTH_DOMAIN=<DEV_PROJECT_ID>.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=<DEV_PROJECT_ID>
   VITE_FIREBASE_STORAGE_BUCKET=<DEV_PROJECT_ID>.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=<DEV_SENDER_ID>
   VITE_FIREBASE_APP_ID=<DEV_APP_ID>
   ```
   > ⚠️ **Lưu ý:** `FE/.env` là public configuration dùng cho client-side. **Tuyệt đối KHÔNG commit file `FE/.env` lên Git.**

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

   FIREBASE_PROJECT_ID=<DEV_PROJECT_ID>
   FIREBASE_CREDENTIALS_PATH=secrets/firebase-service-account.json

   CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
   ```
   > ⚠️ **CẢNH BÁO BẢO MẬT:** File `firebase-service-account.json` là **Private Key cấp cao nhất của Backend**. Tuyệt đối **KHÔNG ĐƯỢC COMMIT LÊN GIT/GITHUB**. File này đã được chặn trong `.gitignore`.

---

## 🚀 2. HƯỚNG DẪN KHỞI CHẠY VÀ CHẠY TEST

### 🔹 Cách 1: Chạy Local trực tiếp (Frontend & Backend)
1. **Khởi chạy Backend (FastAPI):**
   ```bash
   cd BE
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8001
   ```
   *Nếu thiếu `secrets/firebase-service-account.json`, Backend sẽ Fail-Fast và dừng ngay lập tức để bảo vệ hệ thống.*

2. **Khởi chạy Frontend (Vite + React):**
   ```bash
   cd FE
   npm install
   npm run dev
   ```
   *Ứng dụng sẽ chạy tại `http://localhost:5173`.*

---

### 🔹 Cách 2: Chạy bằng Docker Compose
```bash
docker-compose up --build
```
> **Lưu ý:** Docker compose đã được cấu hình Volume Mount chế độ Read-Only cho file `firebase-service-account.json` tại `/run/secrets/firebase-service-account.json`.

---

## 🔐 3. BẢNG PHÂN QUYỀN & ROUTING THEO VAI TRÒ (ROLES)

| Đường Dẫn Route | Quyền Hạn Truy Cập | Mô Tả Chức Năng |
| :--- | :--- | :--- |
| `/login` | Public | Đăng nhập bằng Email, SĐT OTP hoặc Google |
| `/register` | Public | Đăng ký tài khoản Email hoặc SĐT mới (Mặc định: `member`) |
| `/forgot-password` | Public | Khôi phục mật khẩu Email (qua Firebase Reset Link) / SĐT OTP |
| `/member/*` | `member`, `family_head`, `admin` | Khu vực dành cho Thành viên gia phả |
| `/family-head/*` | `family_head`, `admin` | Khu vực Quản lý Họ tộc (Dành cho Trưởng Họ) |
| `/admin/*` | `admin` | Khu vực Quản trị Hệ thống |
| `/403` | Public | Trang báo lỗi Truy Cập Bị Từ Chối (Forbidden) |

> 🛠 **Gán quyền Admin:** Mọi tài khoản mới đăng ký đều là `member`. Để cấp quyền `admin` cho một tài khoản, chạy lệnh CLI sau tại thư mục `BE`:
> ```bash
> python scripts/manage_admin.py grant --email=admin@example.com
> ```

---

## 🛠 4. BẢNG XỬ LÝ LỖI THƯỜNG GẶP (TROUBLESHOOTING)

| Mã / Nội Dung Lỗi | Nguyên Nhân | Cách Khắc Phục |
| :--- | :--- | :--- |
| `Firebase Admin SDK chưa được cấu hình credential hợp lệ` | Backend không tìm thấy file `secrets/firebase-service-account.json` tại startup. | Kiểm tra file JSON đã được đặt đúng tại `BE/secrets/firebase-service-account.json` và kiểm tra lại `FIREBASE_CREDENTIALS_PATH` trong `BE/.env`. |
| `auth/unauthorized-domain` | Tên miền `localhost` chưa được cấp phép trong Firebase Console. | Truy cập Firebase Console -> Auth -> Settings -> Authorized Domains -> Thêm `localhost` và `127.0.0.1`. |
| `CORS Error / Access-Control-Allow-Origin` | Origin của Frontend không khớp với danh sách `CORS_ORIGINS`. | Kiểm tra file `BE/.env`, đảm bảo `CORS_ORIGINS` chứa `http://localhost:5173`. |
| `auth/invalid-api-key` | `VITE_FIREBASE_API_KEY` trong `FE/.env` bị trống hoặc sai. | Copy lại đúng API Key từ Firebase Console Web App Config. |
| `auth/quota-exceeded` (Phone OTP) | Vượt quá hạn ngạch SMS OTP của Firebase Free Plan. | Đăng ký SĐT thử nghiệm (Test Phone Numbers) trong Firebase Console -> Auth -> Sign-in method -> Phone. |
