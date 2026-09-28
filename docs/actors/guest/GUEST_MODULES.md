# TÀI LIỆU CHỨC NĂNG - ACTOR GUEST (KHÁCH VÃNG LAI)

Tài liệu này mô tả chi tiết các chức năng, đường dẫn giao diện và quy tắc nghiệp vụ dành cho **Actor Guest (Khách công khai/người dùng chưa đăng nhập)**.

---

## 🎯 1. Vai Trò & Phạm Vi

Guest đại diện cho người truy cập công khai vào hệ thống Gia Phả Việt. Guest không cần đăng nhập nhưng chỉ được xem các thông tin thuộc phạm vi công khai (`PUBLIC`) theo quy định của từng dòng họ.

---

## 📌 2. Danh Mục Chức Năng Dành Cho Guest

### 2.1 Trang Chủ Công Khai (Public Home Page)
- **Route:** `/public`
- **Component:** `PublicHomePage.tsx`
- **Mô tả:** Giới thiệu nền tảng số hóa gia phả, hiển thị 6 thẻ tính năng cốt lõi (Cây gia phả, Mạng lưới liên họ, Tra cứu thứ bậc, Phòng thờ số, Trợ lý AI, Bảo mật).

### 2.2 Tra Cứu Dòng Họ & Thành Viên (Public Family Search)
- **Route:** `/public/families`
- **Component:** `PublicFamilySearchPage.tsx`
- **Mô tả:** Cho phép khách tìm kiếm tên dòng họ, thủy tổ, chi nhánh. Chỉ hiển thị họ tên, thế hệ và thủy tổ; các thông tin liên lạc cá nhân bị ẩn theo chính sách riêng tư.

### 2.3 Xem Gói Dịch Vụ Business (Business Plans)
- **Route:** `/public/business-plans`
- **Component:** `BusinessPlansView.tsx`
- **Mô tả:** Hiển thị các gói dịch vụ lưu trữ gia phả dành cho dòng họ (Standard, Business, Enterprise) kèm bảng so sánh tính năng.

### 2.4 Đăng Ký Dòng Họ Business (Business Register Wizard)
- **Route:** `/public/business-register`
- **Component:** `BusinessRegisterWizard.tsx`
- **Mô tả:** Quy trình wizard 4 bước đăng ký gia tộc mới: Nhập thông tin đại diện ➔ Thông tin dòng họ ➔ Chọn gói dịch vụ ➔ Đăng tải giấy tờ xác minh.

### 2.5 Theo Dõi Trạng Thái Đăng Ký (Business Track Status)
- **Route:** `/public/business-register/track`
- **Component:** `BusinessTrackStatusPage.tsx`
- **Mô tả:** Tra cứu trạng thái xét duyệt hồ sơ đăng ký dòng họ bằng Mã hồ sơ hoặc Email đại diện.

### 2.6 Kích Hoạt Mã Lời Mời Gia Nhập (Invite Activation)
- **Route:** `/activate`
- **Component:** `InviteActivationPage.tsx`
- **Mô tả:** Nhập mã lời mời được Trưởng tộc cấp để liên kết tài khoản cá nhân vào đúng cây gia phả dòng họ.
