# TÀI LIỆU CHỨC NĂNG - ACTOR FAMILY ADMIN (TRƯỞNG TỘC / QUẢN TRỊ DÒNG HỌ)

Tài liệu này mô tả chi tiết các chức năng, đường dẫn giao diện và quy tắc nghiệp vụ dành cho **Actor Family Admin (Trưởng tộc, Chủ dòng họ hoặc Quản trị viên chi nhánh)**.

---

## 🎯 1. Vai Trò & Phạm Vi

Family Admin có toàn quyền quản trị dữ liệu dòng họ của mình (`ADMIN_ONLY`). Ngoài tất cả các tính năng của Thành viên (`Member`), Family Admin nắm giữ khu vực **QUẢN LÝ DÒNG HỌ** với các chức năng phê duyệt, phân quyền, cấu hình chi nhánh, quản lý tài khoản và xuất nhập dữ liệu gia tộc.

---

## 📌 2. Danh Mục Chức Năng Dành Cho Family Admin

### 2.1 Bảng Điều Khiển Quản Lý Dòng Họ (Family Management Dashboard)
- **Route:** `/user/family-management` (hoặc `/user?demoRole=FAMILY_ADMIN`)
- **Component:** `FamilyAdminModule.tsx`
- **Mô tả:** Trung tâm điều hành dành cho Trưởng tộc; hiển thị số lượng thành viên, tiến độ hoàn thiện cây gia phả, số đề xuất cần duyệt và cảnh báo bảo mật.

### 2.2 Phê Duyệt Đề Xuất Chỉnh Sửa (Family Approvals)
- **Route:** `/user/family-approvals`
- **Component:** `FamilyAdminModule.tsx` (`view='approvals'`)
- **Mô tả:** Tiếp nhận các đề xuất sửa đổi thông tin hồ sơ/mối quan hệ từ thành viên; duyệt (chấp nhận và tự động cập nhật vào cây gia phả) hoặc từ chối kèm lý do phản hồi.

### 2.3 Quản Lý Danh Sách & Phân Quyền Thành Viên (Family Members & Accounts)
- **Route:** `/user/family-members`, `/user/family-accounts`
- **Component:** `FamilyAdminModule.tsx` (`view='members'`, `view='accounts'`)
- **Mô tả:** Thêm mới thành viên, cập nhật thông tin trực hệ, cấp tài khoản truy cập, phân quyền Quản trị viên phó/Ban quản lý chi và khóa/mở khóa tài khoản.

### 2.4 Cấu Hình Chi Nhánh & Quan Hệ Gia Phả (Family Branches & Relations)
- **Route:** `/user/family-branches`, `/user/family-relations`, `/user/family-tree`
- **Component:** `FamilyAdminModule.tsx` (`view='branches'`, `view='relations'`, `view='tree'`)
- **Mô tả:** Thiết lập các nhánh họ (Chi 1, Chi 2, Nhánh Hải Dương...), sửa liên kết Cha/Mẹ/Con/Vợ/Chồng và kiểm tra sơ đồ cây theo cấu trúc quản trị.

### 2.5 Quản Lý Liên Kết Liên Họ (Family Links)
- **Route:** `/user/family-links`
- **Component:** `FamilyAdminModule.tsx` (`view='links'`)
- **Mô tả:** Gửi và tiếp nhận yêu cầu liên kết thông gia, họ nội/họ ngoại với các dòng họ khác trên hệ thống.

### 2.6 Nhập Xuất Dữ Liệu Gia Tộc (Data Exchange)
- **Route:** `/user/family-import-export`
- **Component:** `DataExchangeModule.tsx` (`FamilyAdminModule view='exchange'`)
- **Mô tả:** Cho phép xuất file sao lưu dữ liệu dòng họ (Excel / GEDCOM / JSON) và nhập dữ liệu gia phả hàng loạt từ tệp cấu trúc.

### 2.7 Nhật Ký Bản Xem Trước & Kiểm Toán (Family Logs & Audit)
- **Route:** `/user/family-logs`
- **Component:** `FamilyAdminModule.tsx` (`view='audit'`)
- **Mô tả:** Ghi nhận toàn bộ nhật ký thao tác chỉnh sửa, đăng nhập, phê duyệt và lượt xem trước dữ liệu để bảo đảm an toàn thông tin dòng họ.
