# TÀI LIỆU QUY TRÌNH TƯƠNG TÁC LIÊN ACTOR (INTER-ACTOR WORKFLOWS)

Tài liệu này mô tả các quy trình phối hợp công việc kéo dài giữa các Actor khác nhau trong hệ thống Gia Phả Việt.

---

## 🔀 1. Quy Trình 1: Member Tạo Đề Xuất ➔ Family Admin Phê Duyệt

```
[MEMBER]                        [HỆ THỐNG]                        [FAMILY ADMIN]
   │                                 │                                  │
   ├─► 1. Gửi Đề xuất chỉnh sửa ────►│                                  │
   │   (Hồ sơ / Mối quan hệ)         ├─► 2. Tạo bản ghi Status PENDING ─►│
   │                                 │   và thông báo tới Admin         │
   │                                 │                                  ├─► 3. Xem danh sách phê duyệt
   │                                 │                                  │   (trang /user/family-approvals)
   │                                 │                                  │
   │                                 │◄── 4. Thực hiện thao tác Duyệt ──┤
   │                                 │    hoặc Từ chối                   │
   │                                 ├─► 5. Nếu Duyệt:                  │
   │                                 │   - Tự động cập nhật Cây Gia Phả │
   │                                 │   - Chuyển Status = APPROVED     │
   │                                 │   - Thông báo cho Member         │
   │◄── 6. Nhận thông báo kết quả ───┤                                  │
```

---

## 🔀 2. Quy Trình 2: Guest Đăng Ký Dòng Họ Business ➔ Phê Duyệt & Khởi Tạo

```
[GUEST / ĐẠI DIỆN]               [HỆ THỐNG BAN QUẢN TRỊ]            [TRƯỞNG TỘC MỚI]
   │                                 │                                  │
   ├─► 1. Điền Wizard 4 bước ───────►│                                  │
   │   đăng ký Dòng họ Business      │                                  │
   │   (trang /business-register)    ├─► 2. Lưu hồ sơ đăng ký           │
   │                                 │   cấp Mã Tra Cứu (REC-xxxx)      │
   │◄── 3. Theo dõi trạng thái ──────┤                                  │
   │    (trang /business-track)      │                                  │
   │                                 ├─► 4. Thẩm định hồ sơ ───────────►│
   │                                 │   và Phê duyệt                    │
   │                                 │                                  ├─► 5. Nhận tài khoản Trưởng tộc
   │                                 │                                  │   truy cập /user/family-management
```

---

## 🔀 3. Quy Trình 3: Trưởng Tộc Cấp Mã Lời Mời ➔ Guest Kích Hoạt Thành Viên

```
[FAMILY ADMIN / TRƯỞNG TỘC]       [GUEST / NGUỜI NHẬN]              [MEMBER MỚI]
   │                                 │                                  │
   ├─► 1. Tạo Mã Lời Mời gia nhập ──►│                                  │
   │   (trang /family-accounts)      ├─► 2. Truy cập /activate          │
   │                                 │   nhập Mã Lời Mời                │
   │                                 ├─► 3. Đăng ký / Đăng nhập ───────►│
   │                                 │                                  ├─► 4. Hệ thống tự động liên kết
   │                                 │                                  │   vào đúng dòng họ & chi nhánh
```
