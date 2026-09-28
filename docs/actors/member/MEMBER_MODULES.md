# TÀI LIỆU CHỨC NĂNG - ACTOR MEMBER (THÀNH VIÊN DÒNG HỌ)

Tài liệu này mô tả chi tiết các chức năng, đường dẫn giao diện và quy tắc nghiệp vụ dành cho **Actor Member (Thành viên chính thức của dòng họ)**.

---

## 🎯 1. Vai Trò & Phạm Vi

Member là người dùng đã xác thực, thuộc về một dòng họ cụ thể trong hệ thống. Member có quyền truy cập đầy đủ các dữ liệu ở cấp độ `FAMILY` bao gồm sơ đồ cây gia phả, ngày giỗ, quỹ gia tộc, kho tư liệu, phòng thờ số và gửi các đề xuất chỉnh sửa thông tin.

---

## 📌 2. Danh Mục Chức Năng Dành Cho Member

### 2.1 Bảng Điều Khiển Cá Nhân (Member Dashboard)
- **Route:** `/user` (hoặc `/user?demoRole=MEMBER`)
- **Component:** `MemberDashboard.tsx`
- **Mô tả:** Hiển thị tổng quan lời chào cá nhân, lối tắt truy cập nhanh, lịch giỗ sắp tới và bảng tin hoạt động dòng họ.

### 2.2 Cây Gia Phả Tương Tác & Chi Tiết Thành Viên (Interactive Tree Layout)
- **Route:** `/user/tree`, `/user/members`, `/user/member-profile`
- **Component:** `TreeLayout.tsx`, `MemberList.tsx`, `ProfileLayout.tsx`
- **Mô tả:** Xem cây gia phả nhiều thế hệ dạng đứng/ngang/focus, thu phóng, tra cứu danh sách thành viên và xem trang sơ yếu lý lịch chi tiết.

### 2.3 Tra Cứu Thứ Bậc & Xưng Hô Tự Động (Relationship Finder)
- **Route:** `/user/relationship-finder`
- **Component:** `RelationshipFinder.tsx`
- **Mô tả:** Chọn 2 thành viên bất kỳ trong dòng họ để thuật toán tự động tính toán mối quan hệ trực hệ và gợi ý danh xưng xưng hô chuẩn phong tục Việt Nam.

### 2.4 Quản Lý Đề Xuất Chỉnh Sửa Cá Nhân (My Proposals Module)
- **Route:** `/user/proposals`
- **Component:** `MyProposalsModule.tsx`
- **Mô tả:** Gửi yêu cầu điều chỉnh thông tin cá nhân hoặc quan hệ gia đình tới Quản trị viên dòng họ; theo dõi trạng thái phê duyệt (Chờ duyệt, Đã duyệt, Từ chối).

### 2.5 Lịch Ngày Giỗ & Nhắc Nhở Tự Động (Anniversaries Module)
- **Route:** `/user/anniversaries`
- **Component:** `AnniversariesModule.tsx`
- **Mô tả:** Xem danh sách ngày giỗ Âm/Dương lịch, đồng hồ đếm ngược số ngày còn lại, cài đặt nhận thông báo nhắc nhở tự động (trước 3 ngày, 1 ngày, đúng ngày).

### 2.6 Sự Kiện Dòng Họ & Album Hoạt Động (Clan Events Module)
- **Route:** `/user/events`
- **Component:** `ClanEventsModule.tsx`
- **Mô tả:** Theo dõi giỗ tổ, họp họ, tuyên dương khuyến học; đăng ký tham gia sự kiện và xem album hình ảnh/video tư liệu.

### 2.7 Quỹ Dòng Họ & Lịch Sử Đóng Góp (Clan Funds Module)
- **Route:** `/user/funds`
- **Component:** `ClanFundsModule.tsx`
- **Mô tả:** Minh bạch thu chi các quỹ gia tộc (Khuyến học, Tu bổ từ đường, Tương trợ) và theo dõi bảng lịch sử đóng góp cá nhân kèm mã chứng từ.

### 2.8 Kho Tư Liệu Lịch Sử & Sắc Phong Cổ (Clan Documents Module)
- **Route:** `/user/documents`
- **Component:** `ClanDocumentsModule.tsx`
- **Mô tả:** Lưu trữ, tìm kiếm gia phả chữ Nôm, văn bản sắc phong, video thước phim truyền thống; đề xuất tải lên tư liệu mới.

### 2.9 Trợ Lý AI Gia Phả (Clan AI Assistant Module)
- **Route:** `/user/ai-assistant`
- **Component:** `ClanAIAssistantModule.tsx`
- **Mô tả:** Trò chuyện thông minh với AI tra cứu nguồn gốc thủy tổ, thống kê số lượng con cháu và trình độ học vấn trong dòng họ.

### 2.10 Phòng Thờ Số & Tưởng Niệm (Digital Ancestral Hall Module)
- **Route:** `/user/ancestral-hall`
- **Component:** `DigitalAncestralHallModule.tsx`
- **Mô tả:** Không gian tưởng niệm tâm linh trực tuyến; thắp hương trầm, dâng hoa, viết lời tri ân tổ tiên và xem bài vị 3D.

### 2.11 Hồ Sơ Cá Nhân & Quyền Riêng Tư (Privacy Settings Tab)
- **Route:** `/user/my-profile`, `/user/privacy-settings`
- **Component:** `ProfileLayout.tsx`, `PrivacySettingsTab.tsx`
- **Mô tả:** Quản lý mức độ chia sẻ thông tin cá nhân (SĐT, Email, Địa chỉ) với các vai trò khác và mô phỏng góc nhìn người xem.
