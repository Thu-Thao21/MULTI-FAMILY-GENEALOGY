# HỆ THỐNG GIA PHẢ LIÊN HỌ - TÀI LIỆU HỆ THỐNG THEO ACTOR (VAI TRÒ)

Tài liệu này cung cấp mục lục tổng quan và hướng dẫn tra cứu thông tin hệ thống Gia Phả Việt theo từng **Actor (Vai trò tương tác)**.

---

## 🎭 1. Cấu Trúc Phân Loại Theo Actor

Hệ thống hỗ trợ 3 Actor chính cùng với các luồng tương tác liên kết và tài liệu kiến trúc dùng chung:

```
docs/
├── README.md                               # Mục lục & Hướng dẫn tra cứu tài liệu
├── architecture/
│   └── SYSTEM_OVERVIEW.md                  # Tổng quan kiến trúc, ma trận phân quyền & quy tắc dữ liệu
├── actors/
│   ├── guest/
│   │   └── GUEST_MODULES.md                # Tài liệu dành cho Khách vãng lai (Public, Tra cứu, Đăng ký Business)
│   ├── member/
│   │   └── MEMBER_MODULES.md               # Tài liệu dành cho Thành viên dòng họ (Cây gia phả, Ngày giỗ, Quỹ, AI...)
│   └── family_admin/
│       └── FAMILY_ADMIN_MODULES.md         # Tài liệu dành cho Trưởng tộc / Quản trị viên (Phê duyệt, Quản lý thành viên...)
├── workflows/
│   └── INTER_ACTOR_FLOWS.md                # Tài liệu mô tả các quy trình tương tác liên Actor (Submit-Approve, Registration...)
└── reports/
    ├── TONG_HOP_CHINH_SUA_FE.md           # [Báo cáo] Tổng hợp tinh chỉnh UI/UX Frontend
    └── SPRINT_5_6_UI_CHECKLIST.md         # [Báo cáo] Danh mục tính năng Sprint 5 & 6
```

---

## 📖 2. Danh Mục Tài Liệu Chi Tiết

### 👥 2.1 Tài Liệu Theo Actor (Actors)
- **Actor Guest (Khách vãng lai):** [GUEST_MODULES.md](file:///e:/MULTI-FAMILY-GENEALOGY%202/docs/actors/guest/GUEST_MODULES.md)
  - Trang chủ công khai (`/public`)
  - Tra cứu dòng họ & thành viên công khai (`/public/families`)
  - Bảng giá & Đăng ký Dòng họ Business (`/public/business-plans`, `/public/business-register`)
  - Theo dõi hồ sơ đăng ký (`/public/business-register/track`)
  - Kích hoạt mã lời mời gia nhập (`/activate`)

- **Actor Member (Thành viên dòng họ):** [MEMBER_MODULES.md](file:///e:/MULTI-FAMILY-GENEALOGY%202/docs/actors/member/MEMBER_MODULES.md)
  - Trang chủ thành viên & Cây gia phả tương tác (`/user`, `/user/tree`)
  - Tra cứu thứ bậc & Xưng hô tự động (`/user/relationship-finder`)
  - Quản lý đề xuất chỉnh sửa cá nhân (`/user/proposals`)
  - Lịch ngày giỗ & Nhắc nhở tự động (`/user/anniversaries`)
  - Sự kiện dòng họ & Album hoạt động (`/user/events`)
  - Quỹ dòng họ & Lịch sử đóng góp (`/user/funds`)
  - Kho tư liệu lịch sử & Sắc phong cổ (`/user/documents`)
  - Trợ lý AI gia phả (`/user/ai-assistant`)
  - Phòng thờ số & Thắp hương tưởng niệm (`/user/ancestral-hall`)
  - Hồ sơ cá nhân & Cài đặt quyền riêng tư (`/user/my-profile`, `/user/privacy-settings`)

- **Actor Family Admin (Trưởng tộc / Quản trị dòng họ):** [FAMILY_ADMIN_MODULES.md](file:///e:/MULTI-FAMILY-GENEALOGY%202/docs/actors/family_admin/FAMILY_ADMIN_MODULES.md)
  - Bảng điều khiển quản lý dòng họ (`/user/family-management`)
  - Phê duyệt đề xuất chỉnh sửa từ thành viên (`/user/family-approvals`)
  - Quản lý danh sách & Tài khoản thành viên (`/user/family-members`, `/user/family-accounts`)
  - Quản lý Chi nhánh & Quan hệ gia phả (`/user/family-branches`, `/user/family-relations`)
  - Kết nối liên họ & Nhập xuất dữ liệu (`/user/family-links`, `/user/family-import-export`)
  - Nhật ký bản xem trước & Kiểm toán bảo mật (`/user/family-logs`)

---

### 🔀 2.2 Quy Trình Liên Actor (Workflows)
- [INTER_ACTOR_FLOWS.md](file:///e:/MULTI-FAMILY-GENEALOGY%202/docs/workflows/INTER_ACTOR_FLOWS.md):
  - Quy trình Member tạo đề xuất ➔ Family Admin phê duyệt & đồng bộ cây gia phả.
  - Quy trình Guest đăng ký Dòng họ Business ➔ Hệ thống thẩm định ➔ Cấp tài khoản Trưởng tộc.
  - Quy trình Trưởng tộc tạo mã kích hoạt ➔ Guest kích hoạt ➔ Thành viên nhập họ thành công.

---

### 🏛️ 2.3 Kiến Trúc & Báo Cáo Bảo Trì
- [SYSTEM_OVERVIEW.md](file:///e:/MULTI-FAMILY-GENEALOGY%202/docs/architecture/SYSTEM_OVERVIEW.md): Tổng quan kiến trúc hệ thống, mô hình phân quyền 3 lớp & ma trận hiển thị dữ liệu.
- [TONG_HOP_CHINH_SUA_FE.md](file:///e:/MULTI-FAMILY-GENEALOGY%202/TONG_HOP_CHINH_SUA_FE.md): Báo cáo chi tiết nâng cấp UI/UX Frontend.
- [SPRINT_5_6_UI_CHECKLIST.md](file:///e:/MULTI-FAMILY-GENEALOGY%202/FE/SPRINT_5_6_UI_CHECKLIST.md): Danh mục hoàn thành Sprint 5 & 6.
