# HƯỚNG DẪN CẤU TRÚC VÀ CHỨC NĂNG CÁC THƯ MỤC
### Dự án: Multi-Family Genealogy — Gia Phả Việt

Tài liệu này tổng hợp chi tiết tất cả các thư mục trong dự án, giúp bạn dễ dàng tra cứu, đọc hiểu và phát triển tiếp các tính năng.

---

## 🎨 1. FRONTEND (`FE/src/`)

| Đường dẫn Thư mục | Chức năng chính |
| :--- | :--- |
| **`src/components/roles/`** | **Phân loại giao diện theo vai trò (Member, Trưởng Tộc, Admin)** |
| ├── `roles/member/` | Chứa `MemberDashboard.tsx` — Giao diện tổng quan dành riêng cho Thành viên. |
| ├── `roles/family_head/` | Chứa `FamilyHeadDashboard.tsx` — Giao diện quản lý dòng họ dành cho Trưởng Tộc. |
| └── `roles/admin/` | Chứa `AdminDashboard.tsx` — Giao diện quản trị hệ thống, duyệt quyền dành cho Admin. |
| | |
| **`src/components/dashboard/`** | **Các thành phần khung Dashboard chính** |
| ├── `TopBar/` | Thanh tiêu đề trên cùng (Logo, Tìm kiếm nhanh, Thông báo, Hồ sơ cá nhân & Đăng xuất). |
| ├── `Sidebar/` | Thanh menu điều hướng bên trái (Tự động đổi menu theo vai trò người dùng). |
| ├── `PersonalizedOverview/` | Banner chào mừng cá nhân hóa kèm nút *Yêu cầu quyền Trưởng Họ*. |
| ├── `UpcomingEventsWidget/` | Khối hiển thị các sự kiện gia tộc & ngày giỗ sắp tới. |
| └── `RecentActivitiesWidget/` | Khối nhật ký hoạt động mới nhất trong gia phả. |
| | |
| **`src/components/tree/`** | **Bộ công cụ & Cây Gia Phả trực quan** |
| └── `TreeLayout.tsx` | Hiển thị sơ đồ cây trực hệ (Hỗ trợ dạng Đứng Vertical, Ngang Horizontal, Tập trung Focus). |
| | |
| **`src/components/network/`** | **Mạng lưới Liên họ** |
| ├── `FamilyPaternalTab/` | Mạng lưới dòng họ Nội. |
| ├── `FamilyMaternalTab/` | Mạng lưới dòng họ Ngoại. |
| ├── `InLawMarriagesTab/` | Mạng lưới Dâu & Rể liên họ. |
| └── `AffiliatedFamiliesTab/` | Mạng lưới các dòng họ Thông gia. |
| | |
| **`src/components/profile/`** | **Quản lý Hồ sơ & Danh sách Gia tộc** |
| ├── `MemberList.tsx` | Danh sách thành viên trong gia tộc (Hỗ trợ tìm kiếm, lọc). |
| └── `ProfileLayout.tsx` | Xem chi tiết thông tin hồ sơ của một thành viên. |
| | |
| **`src/components/roleRequest/`** | **Trung tâm Yêu cầu Nâng quyền** |
| └── `RoleRequestModal.tsx` | Modal gửi đơn xin làm Trưởng Họ kèm lý do & chứng minh cho Admin duyệt. |
| | |
| **`src/components/auth/`** | **Giao diện Xác thực Tài khoản** |
| ├── `LoginForm/` | Form đăng nhập (Hỗ trợ Email, SĐT, Mật khẩu & Google Auth). |
| ├── `RegisterForm/` | Form đăng ký tài khoản thành viên mới. |
| └── `ForgotPasswordForm/` | Form gửi mã OTP & khôi phục mật khẩu. |
| | |
| **`src/config/`** | **Cấu hình Hệ thống Frontend** |
| ├── `navigation.ts` | Khai báo cấu trúc danh sách Menu theo từng role (`member`, `family_head`, `admin`). |
| └── `firebase.ts` | Khởi tạo cấu hình kết nối Firebase Authentication. |
| | |
| **`src/context/`** | **Quản lý Trạng thái Toàn cục** |
| └── `AuthContext.tsx` | Lưu trữ phiên đăng nhập, thông tin Profile & Quyền hạn chính (`primary_role`). |
| | |
| **`src/services/`** | **Lớp Gọi API Backend** |
| ├── `auth.service.ts` | Gọi API Đăng nhập, Đăng ký, Lấy thông tin cá nhân (`/auth/me`). |
| ├── `roleRequest.service.ts` | Gọi API Gửi đơn & Duyệt đơn quyền Trưởng Họ (`/role-requests`). |
| └── `network.service.ts` | Gọi API lấy dữ liệu các dòng họ liên kết. |

---

## ⚙️ 2. BACKEND (`BE/app/`)

| Đường dẫn Thư mục | Chức năng chính |
| :--- | :--- |
| **`app/main.py`** | **File khởi chạy chính của Backend FastAPI Server (Cổng 8000)** |
| | |
| **`app/routers/`** | **Danh sách các Endpoint API (Routes)** |
| ├── `auth.py` | API Xử lý Đăng nhập, Đăng ký, Khôi phục mật khẩu & Đồng bộ tài khoản (`/api/auth/*`). |
| ├── `role_requests.py` | API Tạo đơn, Lấy danh sách đơn & Phê duyệt quyền Trưởng Họ (`/api/role-requests/*`). |
| ├── `members.py` | API Quản lý danh sách & Hồ sơ thành viên (`/api/members/*`). |
| └── `networks.py` | API Quản lý mạng lưới liên họ (`/api/networks/*`). |
| | |
| **`app/models/`** | **Cấu trúc Dữ liệu Cơ sở dữ liệu (ORM SQLAlchemy)** |
| └── `postgres.py` | Khai báo các bảng PostgreSQL (`Account`, `Admin`, `FamilyHead`, `Member`, `RoleRequest`, `AccountRole`). |
| | |
| **`app/db/`** | **Kết nối Cơ sở dữ liệu** |
| └── `postgres.py` | Kết nối PostgreSQL Engine & **Tự động Seed tài khoản Admin mặc định** khi khởi chạy. |
| | |
| **`app/core/`** | **Bảo mật & Cấu hình cốt lõi** |
| ├── `security.py` | Mã hóa & Kiểm tra Mật khẩu (`hash_password`, `verify_password`). |
| ├── `firebase.py` | Xác thực ID Token từ Firebase Admin SDK. |
| └── `config.py` | Đọc các biến môi trường cấu hình từ file `.env`. |

---

## 🔑 3. THÔNG TIN TÀI KHOẢN MẶC ĐỊNH

### 👑 1. Tài khoản Trưởng Tộc (Family Head):
* **Email / SĐT**: `truongtoc@gmail.com` *(hoặc tên đăng nhập: `truongtoc`)*
* **Mật khẩu**: `12060805`
* **Vai trò**: `family_head` (**Trưởng Tộc** — Quản lý dòng họ, duyệt đơn gia nhập & thành viên)

### ⚙️ 2. Tài khoản Admin (Super Admin):
* **Email / SĐT**: `thuthaor120608@gmail.com` *(hoặc tên đăng nhập: `admin`)*
* **Mật khẩu**: `12060805`
* **Vai trò**: `admin` (**Super Admin** — Toàn quyền quản trị hệ thống, phê duyệt quyền Trưởng Họ)
