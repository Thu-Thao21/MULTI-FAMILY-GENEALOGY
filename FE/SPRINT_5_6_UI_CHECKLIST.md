# MFGMS-AI — Sprint 5 & Sprint 6 Frontend Checklist

Phạm vi trong tài liệu này chỉ gồm Frontend/UI. Các thao tác tạo, sửa, xóa, duyệt, tải lên, xuất dữ liệu, sao lưu và khôi phục được mô phỏng bằng mock data/local state; không thêm backend, API server hay thay đổi schema cơ sở dữ liệu.

## Sprint 5

| Requirement | Route/Page | Components | Status |
| --- | --- | --- | --- |
| Privacy Settings UI | `/user/privacy-settings`, `/user/privacy-preview` | `PrivacySettingsTab` | Completed |
| AI Consent UI | `/user/ai-consent` | `AIConsentModule` | Completed |
| Profile/Relationship Proposal UI | `/user/proposals`, `/admin/approvals`, `/user/family-management/approvals` | `MyProposalsModule`, `AdminApprovalsMgmt` | Completed |
| Memorial Date Management UI | `/user/anniversaries` | `AnniversariesModule` | Completed |
| Memorial Reminder UI | `/user/anniversaries`, `/user/notifications` | `AnniversariesModule`, `NotificationCenterModule` | Completed |
| Family Event Management UI | `/user/events` | `ClanEventsModule` | Completed |
| Event Participant UI | `/user/events` | `ClanEventsModule` participant detail/modal | Completed |
| Family Fund Management UI | `/user/funds` | `ClanFundsModule` | Completed |
| Digital Archive UI | `/user/documents` | `ClanDocumentsModule` | Completed |
| Import/Export UI | `/user/family-management/import-export` | `DataExchangeModule` | Completed |
| Notification Settings UI | `/user/notifications` | `NotificationCenterModule` | Completed |
| Role/Data Authorization states | Family-management routes and `/admin/roles` | Route guard, disabled action states, `RolePermissionManagement` | Completed |

## Sprint 6

| Requirement | Route/Page | Components | Status |
| --- | --- | --- | --- |
| Digital Worship Space UI | `/user/ancestral-hall` | `DigitalAncestralHallModule` | Completed |
| 3D/360 Ancestral Library/Viewer UI | `/user/ancestral-library` | `AncestralLibraryModule` | Completed |
| Virtual Incense UI | `/user/ancestral-hall` | Incense modal and CSS animation in `DigitalAncestralHallModule` | Completed |
| Memorial Message UI | `/user/ancestral-hall` | Message list/editor in `DigitalAncestralHallModule` | Completed |
| System Admin Dashboard | `/admin`, `/admin/dashboard` | `AdminDashboard` | Completed |
| Service Package Management UI | `/admin/packages` | `ServicePackageManagement` | Completed |
| Payment Management UI | `/admin/payments` | `PaymentTransactionManagement` | Completed |
| System Logs UI | `/admin/security-logs` | `AdminAuditLogsMgmt` | Completed |
| Backup Management UI | `/admin/backup` | `AdminDataBackupMgmt` | Completed |
| Moderation UI | `/admin/moderation` | `ModerationManagement` | Completed |
| Role/Permission/Module UI | `/admin/roles` | `RolePermissionManagement` | Completed |
| Inter-family UI | `/admin/family-links`, `/user/network/*` | `AdminFamilyLinksMgmt`, family network tabs and mock network service | Completed |
| Privacy/AI Consent integration | Profile account tab, TopBar, sidebar, privacy and AI routes | `AccountTab`, `TopBar`, `Sidebar`, `PrivacySettingsTab`, `AIConsentModule` | Completed |
| Final UI Integration & Polish | Existing `/user/*` and `/admin/*` dashboard shell | `Dashboard`, `Sidebar`, `TopBar`, shared `FeatureUI`, shared `Sprint6Admin` UI | Completed |

## Verification

| Check | Result |
| --- | --- |
| TypeScript and production bundle | `npm run build` — Passed |
| Route-to-tab and tab-to-route integration | Completed |
| Sidebar access for member, family head and system admin | Completed |
| Client-side search/filter/pagination/status interactions | Completed |
| Modal, confirmation, toast, loading, empty, error and disabled states | Completed |
| Desktop/tablet/mobile responsive rules | Completed |
| Backend/database/schema changes introduced by this scope | None |

