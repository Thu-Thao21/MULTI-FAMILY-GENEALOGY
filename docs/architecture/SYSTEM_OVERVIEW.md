# KIẾN TRÚC HỆ THỐNG & MA TRẬN PHÂN QUYỀN THEO ACTOR

Tài liệu này mô tả tổng quan kiến trúc hệ thống Gia Phả Việt, ma trận phân quyền dữ liệu và phạm vi bảo mật giữa các Actor.

---

## 🏗️ 1. Mô Hình 3 Actor Cốt Lõi

Hệ thống được thiết kế vận hành chính xác trên 3 Actor tương tác:

```
+-----------------------------------------------------------------------+
|                            HỆ THỐNG GIA PHẢ LIÊN HỌ                   |
+-----------------------------------------------------------------------+
        │                                 │                             │
        ▼                                 ▼                             ▼
+---------------+                +------------------+          +-----------------------+
|  ACTOR 1:     |                |  ACTOR 2:        |          |  ACTOR 3:             |
|  GUEST        |                |  MEMBER          |          |  FAMILY ADMIN         |
| (Khách vãng   |                | (Thành viên      |          | (Trưởng tộc / Quản    |
|  lai/Public)  |                |  dòng họ)        |          |  trị viên dòng họ)    |
+---------------+                +------------------+          +-----------------------+
  - Tra cứu công khai              - Cây gia phả chi tiết       - Quản lý dòng họ & chi
  - Xem gói Business               - Ngày giỗ & Tưởng niệm      - Duyệt đề xuất sửa đổi
  - Kích hoạt lời mời              - Quỹ dòng họ & Tư liệu      - Quản lý tài khoản TV
  - Đăng ký gia tộc                - AI Assistant & Đề xuất     - Nhập/Xuất & Kiểm toán
```

---

## 🔒 2. Ma Trận Quyền Truy Cập & Hiển Thị Dữ Liệu (Privacy Matrix)

Dữ liệu hệ thống được kiểm soát nghiêm ngặt theo 4 mức bảo mật (`PUBLIC`, `FAMILY`, `ADMIN_ONLY`, `PRIVATE`):

| Trường thông tin / Chức năng | Guest (Khách) | Member (Thành viên) | Family Admin (Trưởng tộc) | Mức bảo mật mặc định |
|:---|:---:|:---: |:---:|:---:|
| Họ tên, Thế hệ, Thủy tổ | ✅ Hiển thị | ✅ Hiển thị | ✅ Hiển thị | `PUBLIC` |
| Sơ đồ Cây gia phả tổng thể | 🔒 Rút gọn | ✅ Đầy đủ | ✅ Đầy đủ | `FAMILY` |
| Số điện thoại, Địa chỉ, Email | ❌ Ẩn | ✅ Hiển thị | ✅ Hiển thị | `FAMILY` |
| Gửi Đề xuất chỉnh sửa thông tin | ❌ Không | ✅ Có thể gửi | ✅ Phê duyệt | `FAMILY` |
| Thắp hương & Viết lời tưởng niệm | ❌ Không | ✅ Thao tác | ✅ Thao tác | `FAMILY` |
| Quản lý Chi nhánh & Phân quyền TV | ❌ Không | ❌ Không | ✅ Toàn quyền | `ADMIN_ONLY` |
| Nhập / Xuất dữ liệu Excel / GEDCOM | ❌ Không | ❌ Không | ✅ Toàn quyền | `ADMIN_ONLY` |
| Xem Nhật ký bản xem trước (Audit) | ❌ Không | ❌ Không | ✅ Toàn quyền | `ADMIN_ONLY` |

---

## 🛠️ 3. Công Nghệ Vận Hành

- **Frontend (FE):** React 18, TypeScript, Vite, Vanilla CSS Design System.
- **Backend (BE):** Python FastAPI, SQLAlchemy Async, SQLite (`dev.db`).
- **Xác thực (Auth):** Firebase Auth / JWT Bearer Token, RBAC (Role-Based Access Control).
