# BÁO CÁO TỔNG HỢP CÁC NỘI DUNG ĐÃ SỬA Ở FRONTEND (FE)

**Ngày thực hiện:** 20/09/2026  
**Nhánh Git:** `feature/completed-member-guest-ui-48fr`  
**Tổng số tệp đã cập nhật:** 19 tệp  
**Mục tiêu chính:** Làm sạch mã nhãn nội bộ, tối ưu typography, tinh chỉnh giao diện Hero & Feature Cards trang chủ, đồng bộ hóa phong cách thiết kế hiện đại, chuyên nghiệp không dùng emoji.

---

## MỤC LỤC
1. [Loại bỏ hoàn toàn các mã chức năng (FR-GU-xx / FR-ME-xx)](#1-loại-bỏ-hoàn-toàn-các-mã-chức-năng-fr-gu-xx--fr-me-xx)
2. [Tái cấu trúc và tối ưu Hero Section trang chủ](#2-tái-cấu-trúc-và-tối-ưu-hero-section-trang-chủ)
3. [Nâng cấp Feature Cards (Thẻ tính năng nổi bật)](#3-nâng-cấp-feature-cards-thẻ-tính-năng-nổi-bật)
4. [Làm sạch các biểu tượng Emoji trên nút và bảng gói cước](#4-làm-sạch-các-biểu-tượng-emoji-trên-nút-và-bảng-gói-cước)
5. [Danh mục chi tiết 19 tệp tin đã chỉnh sửa](#5-danh-mục-chi-tiết-19-tệp-tin-đã-chỉnh-sửa)

---

## 1. Loại Bỏ Hoàn Toàn Các Mã Chức Năng (FR-GU-xx / FR-ME-xx)
Trước đó, trên tiêu đề, nút bấm, và phần mô tả có xuất hiện các mã ký hiệu kỹ thuật dạng `(FR-GU-03)`, `(FR-ME-17)` gây mất thẩm mỹ cho người dùng cuối. Đã rà soát và loại bỏ 100%:

- **Giao diện Khách vãng lai & Công khai (Guest / Public):**
  - `PublicFamilySearchPage.tsx`: Xóa `(FR-GU-03)`, `(FR-GU-04)`, `(FR-GU-04/GU-10)`, `(FR-GU-09/GU-10)` trong tiêu đề tra cứu, nút xem hồ sơ, badge bảo mật và lưu ý quyền riêng tư.
  - `BusinessTrackStatusPage.tsx`: Xóa `(FR-GU-07)` khỏi tiêu đề trang theo dõi.
  - `BusinessRegisterWizard.tsx`: Xóa `(FR-GU-05, GU-06)`, `(FR-GU-05)`, `(FR-GU-06)`, `(FR-GU-07)` tại tiêu đề wizard và tên các bước đăng ký.
  - `BusinessPlansView.tsx`: Xóa `(FR-GU-02)` khỏi tiêu đề bảng gói dịch vụ.
  - `InviteActivationPage.tsx`: Xóa `(FR-GU-08)` khỏi tiêu đề kích hoạt mã lời mời.
  - `AppRoutes.tsx`: Làm sạch chú thích routes công khai.

- **Giao diện Thành viên & Quản trị dòng họ (Member / Family Head):**
  - `RelationshipFinder.tsx`: Xóa `(FR-ME-13 đến ME-16)` ở phần tra cứu quan hệ & xưng hô.
  - `MyProposalsModule.tsx`: Xóa `(FR-ME-17 đến ME-19)`, `(FR-ME-17)`, `(FR-ME-18)` trong danh mục loại đề xuất.
  - `DigitalAncestralHallModule.tsx`: Xóa `(FR-ME-33 đến ME-35)` và các nhãn tại nút thắp hương, viết lời tưởng niệm.
  - `ClanFundsModule.tsx`: Xóa `(FR-ME-27, ME-28)` và `(FR-ME-28)` ở phần quản lý quỹ.
  - `ClanEventsModule.tsx`: Xóa `(FR-ME-24 đến ME-26)` ở phần sự kiện dòng họ.
  - `ClanDocumentsModule.tsx`: Xóa `(FR-ME-29, ME-30)` và `(FR-ME-30)` ở kho tư liệu gia tộc.
  - `ClanAIAssistantModule.tsx`: Xóa `(FR-ME-31, ME-32)` và `(FR-ME-32)` ở trợ lý AI gia phả.
  - `AnniversariesModule.tsx`: Xóa `(FR-ME-22, ME-23)` và `(FR-ME-23)` ở lịch ngày giỗ.
  - `PrivacySettingsTab.tsx`: Xóa `(FR-ME-07, ME-37)` và `(FR-ME-38)` ở cài đặt riêng tư & mô phỏng góc nhìn.
  - `Dashboard.tsx`: Làm sạch chú thích đổi mật khẩu lần đầu.

---

## 2. Tái Cấu Trúc Và Tối Ưu Hero Section Trang Chủ
- **Tách tiêu đề thành 2 cấp rõ ràng:**
  - **Tiêu đề `<h1>` chính:** Đổi thành **`Số Hóa Gia Phả Dòng Họ Việt`** (ngắn gọn 7 chữ, dứt khoát, không bị vỡ chữ "Lưu" lẻ loi xuống hàng).
  - **Phụ đề mới bên dưới:** Gồm 3 vế **`Gắn Kết Dòng Họ – Lưu Truyền Thế Hệ – Kết Nối Liên Họ`**.
- **Quy chuẩn Typography cho Phụ đề:**
  - Cỡ chữ `15px`, font-weight `500`, màu xám trung tính `#475569` / `#64748b`.
  - Dấu phân cách dùng gạch ngang mảnh thanh lịch (`–`, màu `#94a3b8`, độ đậm 300) thay vì dấu chấm đen tròn to nặng nề cũ.
- **Tối ưu Layout & Responsive cho Hero:**
  - Giới hạn bề ngang `max-width: 560px` cho khối thông tin bên trái để tránh chữ chạy sát hình minh họa cây gia phả.
  - Thêm `line-height: 1.18`, `letter-spacing: -0.02em` và `text-wrap: balance` cho `h1`.
  - Cỡ chữ `h1` dùng `clamp(23px, 2.5vw, 30px)` co giãn tự động giữa mobile, tablet và desktop.
  - **Mobile (< 640px):** Phụ đề tự động xếp thành **3 dòng riêng biệt**, ẩn dấu gạch ngang phân cách và nút bấm mở rộng 100% chiều ngang.

---

## 3. Nâng Cấp Feature Cards (Thẻ Tính Năng Nổi Bật)
- **Xóa bỏ icon/emoji:**
  - Xóa bỏ hoàn toàn 6 khung nền màu bo góc và emoji (cây xanh, mắt xích, kính lúp, ngôi đình, robot, khiên bảo vệ).
- **Thêm thanh Accent Bar:**
  - Bổ sung thanh màu xanh dương `#2563eb` cao `3.5px` chạy ngang cạnh trên của mỗi card.
  - Áp dụng `overflow: hidden` và `border-radius: 20px` giúp thanh accent ôm sát đường cong bo tròn góc trên.
- **Tăng kích thước tiêu đề card:**
  - Tăng cỡ chữ `.feature-title` từ `18px` lên **`20px`** (+2px), giữ nguyên `font-weight: 700` và màu đen `#0f172a`.
- **Cân đối lại Padding:**
  - Điều chỉnh padding thành `20px 24px 24px` (mobile: `18px 20px 20px`), giúp tiêu đề cách mép trên vừa vặn, không bị trống trải sau khi bỏ icon.
- **Bố cục chuẩn:**
  - Desktop: 3 cột x 2 hàng (`repeat(3, 1fr)`).
  - Tablet (768px): 2 cột x 3 hàng.
  - Mobile (375px): 1 cột x 6 hàng.

---

## 4. Làm Sạch Các Biểu Tượng Emoji Trên Nút Và Bảng Gói Cước
- **Trang Gói dịch vụ Business (`BusinessPlansView.tsx`):**
  - Xóa icon đĩa mềm `💾`: `💾 10 GB Lưu trữ...` ➔ `10 GB Lưu trữ...`
  - Xóa icon thông tin `ℹ️` trong khung lưu ý thẩm định dưới chân trang.
- **Trang Theo dõi trạng thái (`BusinessTrackStatusPage.tsx`):**
  - Xóa icon kính lúp `🔍`: `🔍 Tra Cứu Ngay` ➔ `Tra Cứu Ngay`.
- **Trang Chủ (`PublicHomePage.tsx`):**
  - Xóa icon kính lúp `🔍`: `🔍 Tra Cứu Dòng Họ (Public)` ➔ `Tra Cứu Dòng Họ (Public)`.
  - Xóa icon tên lửa `🚀`: `🚀 Đăng Ký Dòng Họ Business` ➔ `Đăng Ký Dòng Họ Business`.

---

## 5. Danh Mục Chi Tiết 19 Tệp Tin Đã Chỉnh Sửa

| STT | Đường dẫn tệp tin | Nội dung chỉnh sửa chính |
|:---:|:---|:---|
| 1 | `FE/src/pages/public/PublicHomePage.tsx` | Tách tiêu đề 2 cấp, xóa icon feature cards, xóa emoji trên 2 nút CTA |
| 2 | `FE/src/pages/public/PublicHomePage.css` | Tối ưu clamp h1, style phụ đề 3 vế, thêm accent bar 3.5px, tinh chỉnh padding |
| 3 | `FE/src/pages/public/BusinessPlansView.tsx` | Xóa mã `(FR-GU-02)`, xóa icon đĩa mềm `💾` và icon ghi chú `ℹ️` |
| 4 | `FE/src/pages/public/BusinessTrackStatusPage.tsx` | Xóa mã `(FR-GU-07)`, xóa icon kính lúp `🔍` ở nút "Tra Cứu Ngay" |
| 5 | `FE/src/pages/public/PublicFamilySearchPage.tsx` | Xóa mã `(FR-GU-03)`, `(FR-GU-04)`, các nhãn bảo mật public |
| 6 | `FE/src/pages/public/BusinessRegisterWizard.tsx` | Xóa các mã `(FR-GU-05)`, `(FR-GU-06)`, `(FR-GU-07)` ở các bước |
| 7 | `FE/src/pages/public/InviteActivationPage.tsx` | Xóa mã `(FR-GU-08)` ở tiêu đề kích hoạt lời mời |
| 8 | `FE/src/routes/AppRoutes.tsx` | Làm sạch chú thích routes công khai |
| 9 | `FE/src/pages/dashboard/Dashboard.tsx` | Làm sạch chú thích đổi mật khẩu lần đầu |
| 10 | `FE/src/components/profile/PrivacySettingsTab.tsx` | Xóa mã `(FR-ME-07)`, `(FR-ME-37)`, `(FR-ME-38)` ở cài đặt riêng tư |
| 11 | `FE/src/components/member/RelationshipFinder.tsx` | Xóa mã `(FR-ME-13 đến ME-16)` ở tra cứu xưng hô |
| 12 | `FE/src/components/member/NotificationCenterModule.tsx` | Xóa mã `(FR-ME-36)` ở trung tâm thông báo |
| 13 | `FE/src/components/member/MyProposalsModule.tsx` | Xóa mã `(FR-ME-17)`, `(FR-ME-18)`, `(FR-ME-19)` ở danh sách đề xuất |
| 14 | `FE/src/components/member/DigitalAncestralHallModule.tsx` | Xóa mã `(FR-ME-33 đến ME-35)` ở phòng thờ số gia tộc |
| 15 | `FE/src/components/member/ClanFundsModule.tsx` | Xóa mã `(FR-ME-27)`, `(FR-ME-28)` ở quản lý quỹ gia tộc |
| 16 | `FE/src/components/member/ClanEventsModule.tsx` | Xóa mã `(FR-ME-24 đến ME-26)` ở sự kiện dòng họ |
| 17 | `FE/src/components/member/ClanDocumentsModule.tsx` | Xóa mã `(FR-ME-29)`, `(FR-ME-30)` ở kho tư liệu dòng họ |
| 18 | `FE/src/components/member/ClanAIAssistantModule.tsx` | Xóa mã `(FR-ME-31)`, `(FR-ME-32)` ở gợi ý AI gia phả |
| 19 | `FE/src/components/member/AnniversariesModule.tsx` | Xóa mã `(FR-ME-22)`, `(FR-ME-23)` ở lịch ngày giỗ |
