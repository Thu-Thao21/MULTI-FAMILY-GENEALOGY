# HƯỚNG DẪN CẤU HÌNH & CHẠY HỆ THỐNG FIREBASE AUTHENTICATION (FOR DEV TEAM)

Tài liệu này hướng dẫn chi tiết cho các thành viên trong nhóm phát triển cách khởi chạy ứng dụng **MULTI-FAMILY GENEALOGY**, thiết lập biến môi trường Firebase Web Config, cấu hình Authorized Domains và Facebook Developer Console.

---

## 1. QUY TRÌNH THIẾT LẬP DÀNH CHO THÀNH VIÊN NHÓM

### Bước 1: Clone Repository & Checkout Branch
```bash
git clone https://github.com/Thu-Thao21/MULTI-FAMILY-GENEALOGY.git
cd MULTI-FAMILY-GENEALOGY
git checkout feature/da-hoan-thanh-phan-quyen-dang-nhap-dang-ky-quen-mat-khau-fb-gmail
```

### Bước 2: Cấu hình Môi trường Frontend (`FE/.env`)
1. Tạo file `FE/.env` bằng cách copy từ file mẫu `FE/.env.example`:
   ```bash
   cp FE/.env.example FE/.env   # On macOS / Linux / Git Bash
   copy FE\.env.example FE\.env # On Windows Command Prompt
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
   > ⚠️ **Lưu ý:** Bộ biến môi trường trên là Web Configuration công khai dành cho client side. **Tuyệt đối KHÔNG commit file `FE/.env` lên Git.**

### Bước 3: Cấu hình Backend (`BE/.env` & Credentials)
1. Tạo file `BE/.env` từ `BE/.env.example`:
   ```bash
   cp BE/.env.example BE/.env
   ```
2. Xin file `firebase-service-account.json` từ quản trị viên nhóm (hoặc tải từ Firebase Console -> Project Settings -> Service accounts) và lưu tại:
   `BE/secrets/firebase-service-account.json`
3. Cập nhật `BE/.env`:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5433/multi_family_db
   FIREBASE_PROJECT_ID=<DEV_PROJECT_ID>
   FIREBASE_CREDENTIALS_PATH=BE/secrets/firebase-service-account.json
   ```

---

## 2. CẤU HÌNH THỜI GIAN THỰC TRÊN CONSOLE (NGOÀI CODE)

### A. Firebase Console Checklist
1. **Bật Provider:** Truy cập Firebase Console -> **Authentication** -> **Sign-in method**:
   - Bật **Email/Password**.
   - Bật **Google** provider.
   - Bật **Facebook** provider (Điền App ID và App Secret lấy từ Meta for Developers).
2. **Authorized Domains:** Truy cập **Authentication** -> **Settings** -> **Authorized domains**:
   - Thêm `localhost`.
   - Thêm IP hoặc domain của môi trường DEV (VD: `127.0.0.1`).

### B. Meta (Facebook) for Developers Checklist
1. **OAuth Redirect URI:**
   - Trong Meta App Dashboard -> **Facebook Login** -> **Settings**:
   - Thêm OAuth Redirect URI: `https://<DEV_PROJECT_ID>.firebaseapp.com/__/auth/handler`
2. **Phân quyền Tester (Khi App ở chế độ Development):**
   - Truy cập **App Roles** -> **Roles** -> **Testers**.
   - Thêm tài khoản Facebook của các thành viên nhóm làm Tester.
   - Thành viên cần đăng nhập tài khoản Facebook cá nhân và chấp nhận lời mời tại [Facebook Developer Requests](https://developers.facebook.com/requests/).

---

## 3. HƯỚNG DẪN KHỞI CHẠY (LOCAL & DOCKER)

### Cách A: Khởi chạy Local (Nhanh nhất cho Dev)
```bash
# 1. Chạy Frontend
cd FE
npm install
npm run dev

# 2. Chạy Backend (Terminal khác)
cd BE
python -m venv venv
# On Windows: venv\Scripts\activate | On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Cách B: Khởi chạy bằng Docker Compose
Tạo file `.env` ở thư mục gốc chứa các biến `VITE_FIREBASE_*`, sau đó chạy:
```bash
docker compose config   # Kiểm tra cú pháp cấu hình
docker compose build    # Build các container images
docker compose up -d    # Khởi chạy toàn bộ ứng dụng
```
Mở trình duyệt tại: `http://localhost:3000`

---

## 4. BẢNG MÃ LỖI THƯỜNG GẶP (TROUBLESHOOTING)

| Mã lỗi / Thông báo | Nguyên nhân chính | Cách xử lý |
| :--- | :--- | :--- |
| `Thiếu cấu hình Firebase: VITE_FIREBASE_API_KEY...` | Chưa tạo file `FE/.env` hoặc chưa khởi động lại Vite server. | Copy `FE/.env.example` thành `FE/.env`, điền giá trị và chạy lại `npm run dev`. |
| `auth/unauthorized-domain` | Domain hiện tại chưa được cấp phép trong Firebase Authorized domains. | Vào Firebase Console -> Authentication -> Settings -> Authorized domains và thêm `localhost`. |
| `auth/operation-not-allowed` | Phương thức đăng nhập (Google/Facebook) chưa được bật trong Firebase. | Vào Firebase Console -> Authentication -> Sign-in method và Bật provider tương ứng. |
| `auth/popup-blocked` | Trình duyệt chặn Popup mở cửa sổ OAuth. | Cho phép Pop-up cho trang web hoặc ứng dụng sẽ tự động fallback sang `signInWithRedirect`. |
| `Facebook chỉ chủ app đăng nhập được` | App Facebook đang ở Development Mode và người dùng chưa được cấp quyền Tester. | Vào Meta for Developers -> App Roles -> Testers -> Thêm email Facebook của thành viên và chấp nhận lời mời. |
| `HTTP 401 Unauthorized (Backend)` | Token gửi lên sai chữ ký, hết hạn hoặc sử dụng token giả `token_...`. | Đảm bảo Frontend gửi Firebase ID Token thật từ `auth.currentUser.getIdToken()`. |
| `RuntimeError: Firebase Admin SDK chưa được cấu hình...` | Backend không tìm thấy file credential hoặc không có Auth Emulator. | Tải `firebase-service-account.json` lưu vào `BE/secrets/` và kiểm tra `FIREBASE_CREDENTIALS_PATH` trong `BE/.env`. |

---

## 5. CHECKLIST KIỂM THỬ TRÊN HAI MÁY SẠCH (ACCEPTANCE CHECKLIST)

- [ ] **Máy A & Máy B:** Clone branch mới trên 2 máy độc lập.
- [ ] **Tạo `.env`:** Tạo `FE/.env` từ `FE/.env.example` với bộ Web Config DEV project.
- [ ] **Đăng nhập Google:** Đăng nhập thành công, tài khoản xuất hiện trên Firebase Console Users và được bootstrap thành công vào PostgreSQL với role mặc định `member`.
- [ ] **Đăng nhập Facebook:** Cả hai máy (với tài khoản Tester) đăng nhập Facebook thành công qua Popup/Redirect.
- [ ] **Bảo mật Token:** Backend từ chối request đính kèm token chuỗi giả dạng `token_admin_001` với HTTP 401.
- [ ] **Lưu phiên:** Refresh trang không làm mất session (khôi phục qua `onAuthStateChanged`).
- [ ] **Đăng xuất:** Đăng xuất xóa sạch Firebase session và reset state `account` thành `null`.
