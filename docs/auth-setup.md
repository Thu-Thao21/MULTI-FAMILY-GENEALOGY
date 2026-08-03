# HƯỚNG DẪN CẤU HÌNH HỆ THỐNG XÁC THỰC (FIREBASE AUTH & POSTGRESQL)

Tài liệu này hướng dẫn cách cấu hình dự án **Multi-Family Genealogy** để khởi chạy module xác thực tập trung an toàn với Firebase Auth + FastAPI + PostgreSQL.

---

## 1. Cấu Hình Firebase Console

1. Truy cập [Firebase Console](https://console.firebase.google.com/) và tạo project mới (Ví dụ: `multi-family-genealogy`).
2. Vào **Authentication** -> **Sign-in method**, bật các provider sau:
   - **Email/Password**: Bật Email/Password (Bắt buộc verify email).
   - **Google**: Bật Google Sign-In.
   - **Facebook**: Bật Facebook Login (Nhập App ID và App Secret từ Meta Developer Console).
   - **Phone**: Bật Phone Authentication (Nhập số điện thoại thử nghiệm nếu cần).
3. Thêm Web App trong Firebase Project Settings để lấy cấu hình `firebaseConfig`.
4. Tạo Service Account Key:
   - Vào **Project Settings** -> **Service accounts**.
   - Bấm **Generate new private key** để tải file `firebase-service-account.json`.

---

## 2. Cấu Hình Biến Môi Trường (.env)

### Frontend (`FE/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_FIREBASE_API_KEY=AIzaSy_your_real_api_key
VITE_FIREBASE_AUTH_DOMAIN=multi-family-genealogy.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=multi-family-genealogy
VITE_FIREBASE_STORAGE_BUCKET=multi-family-genealogy.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

### Backend (`BE/.env`)
```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@postgres:5432/multi_family_db
FIREBASE_PROJECT_ID=multi-family-genealogy
FIREBASE_CREDENTIALS_PATH=/path/to/firebase-service-account.json
```

---

## 3. Khởi Chạy Với Docker Compose

```bash
# Khởi chạy toàn bộ hệ thống
docker-compose up -d --build

# Kiểm tra trạng thái containers
docker-compose ps
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000/docs`
- **pgAdmin 4**: `http://localhost:5050`
