-- SQL seed file generated from seed_sample_data.py
-- Use pgAdmin Query Tool: open database `multi_family_db`, paste and execute.

BEGIN;

-- Users
INSERT INTO users (id, email, username, full_name, password_hash, phone, role, status, created_at, updated_at)
VALUES (
  'user_001', 'admin@giapha.example', 'admin', 'Nguyễn Văn A', 'admin123', '0901234567', 'admin', 'active', NOW(), NOW()
);

-- Permissions & RolePermissions
INSERT INTO permissions (id, code, name, description, created_at, updated_at)
VALUES ('perm_001', 'manage_families', 'Quản lý dòng họ', 'Cho phép quản trị các dòng họ và thành viên mẫu.', NOW(), NOW());

INSERT INTO role_permissions (id, role_name, permission_id, granted_at)
VALUES ('roleperm_001', 'admin', 'perm_001', NOW());

-- Family / FamilyTree / Branch
INSERT INTO families (id, name, founder_name, origin_place, ancestral_house_address, history, description, branches, status, created_by, created_at, updated_at)
VALUES (
  'family_001', 'Dòng họ Nguyễn', 'Nguyễn Văn Tý', 'Làng An Bằng, Thừa Thiên Huế', 'Số 1 Đường Tổ Tiên, Huế',
  'Dòng họ Nguyễn có truyền thống hiếu học và yêu nước.', 'Dòng họ mẫu cho ứng dụng quản lý gia phả.',
  '["Chi Trưởng"]'::json, 'active', 'user_001', NOW(), NOW()
);

INSERT INTO family_trees (id, family_id, name, description, root_member_id, status, created_at, updated_at)
VALUES ('tree_001', 'family_001', 'Cây gia phả Nguyễn', 'Cây gia phả mẫu cho dòng họ Nguyễn.', 'member_001', 'active', NOW(), NOW());

INSERT INTO family_branches (id, family_id, tree_id, name, branch_order, description, status, created_at, updated_at)
VALUES ('branch_001', 'family_001', 'tree_001', 'Chi Trưởng', 1, 'Chi trưởng truyền thống của dòng họ.', 'active', NOW(), NOW());

-- Member
INSERT INTO members (id, family_id, user_id, full_name, other_name, gender, birth_date, is_alive, branch, sub_branch, display_order, status, occupation, education, bio, avatar_url, gallery_photos, career_history, contact, privacy_settings, contribution, generation, is_primary, created_at, updated_at)
VALUES (
  'member_001', 'family_001', 'user_001', 'Nguyễn Văn B', 'Ông B', 'male', '1975-05-10', true, 'Chi Trưởng', 'Nhánh chính', 1, 'alive',
  'Kỹ sư phần mềm', 'Đại học Bách khoa', 'Thành viên chính của dòng họ mẫu, đang phát triển hệ thống gia phả.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  '[{"url":"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800","caption":"Ảnh gia đình mẫu"}]'::json,
  '[{"period":"2000 - nay","role":"Kỹ sư phần mềm","organization":"Công ty CNTT"}]'::json,
  '{"phone":"0901234567","email":"admin@giapha.example","address":"Huế, Việt Nam"}'::json,
  '{"show_phone": true, "show_email": true, "show_address": true}'::json,
  '{"ability":"Công nghệ","specialty":"Phát triển phần mềm","field":"CNTT"}'::json,
  3, true, NOW(), NOW()
);

-- Family membership
INSERT INTO family_memberships (id, user_id, family_id, membership_role, status, joined_at)
VALUES ('membership_001', 'user_001', 'family_001', 'head', 'active', NOW());

-- User session
INSERT INTO user_sessions (id, user_id, session_token, expires_at, ip_address, user_agent, created_at)
VALUES ('session_001', 'user_001', 'token_mau_001', NOW() + INTERVAL '365 days', '127.0.0.1', 'SampleAgent/1.0', NOW());

-- Password reset
INSERT INTO password_reset_tokens (id, user_id, email_or_phone, otp_code, expires_at, is_used, created_at)
VALUES ('reset_001', 'user_001', 'admin@giapha.example', '123456', NOW() + INTERVAL '1 hour', false, NOW());

-- Parent-child relationship (sample uses same member for parent/child placeholder)
INSERT INTO parent_child_relationships (id, parent_member_id, child_member_id, relation_type, verified, notes, created_at, updated_at)
VALUES ('pcr_001', 'member_001', 'member_001', 'biological', true, 'Quan hệ mẫu cha con giả định.', NOW(), NOW());

-- Unions and union member
INSERT INTO unions (id, family_id, union_date, union_type, status, notes, created_at, updated_at)
VALUES ('union_001', 'family_001', '2000-01-01', 'marriage', 'active', 'Mối quan hệ hôn nhân mẫu.', NOW(), NOW());

INSERT INTO union_members (id, union_id, member_id, role, joined_at)
VALUES ('unionmember_001', 'union_001', 'member_001', 'spouse', NOW());

-- Family link request
INSERT INTO family_link_requests (id, source_family_id, target_family_id, requested_by_user_id, request_type, status, message, reviewed_by_user_id, reviewed_at, created_at, updated_at)
VALUES ('linkreq_001', 'family_001', 'family_001', 'user_001', 'marriage', 'approved', 'Yêu cầu liên kết gia phả mẫu.', 'user_001', NOW(), NOW(), NOW());

-- Relationship
INSERT INTO relationships (id, member_a_id, member_b_id, relation_type, is_primary, status, start_date, verified, notes, created_at, updated_at)
VALUES ('rel_001', 'member_001', 'member_001', 'spouse', true, 'active', '2000-01-01', true, 'Quan hệ vợ chồng mẫu.', NOW(), NOW());

-- Member contact
INSERT INTO member_contacts (id, member_id, contact_type, contact_value, is_primary, is_public, notes, created_at, updated_at)
VALUES ('contact_001', 'member_001', 'email', 'admin@giapha.example', true, true, 'Liên hệ chính của thành viên mẫu.', NOW(), NOW());

-- Member privacy rule
INSERT INTO member_privacy_rules (id, member_id, field_name, visibility_level, created_at, updated_at)
VALUES ('privacy_001', 'member_001', 'phone', 'family', NOW(), NOW());

-- Member media
INSERT INTO member_media (id, member_id, media_type, media_url, caption, sort_order, created_at, updated_at)
VALUES ('media_001', 'member_001', 'photo', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800', 'Ảnh thành viên mẫu', 1, NOW(), NOW());

-- Member life event
INSERT INTO member_life_events (id, member_id, event_type, title, event_date, description, location, created_at, updated_at)
VALUES ('lifeevent_001', 'member_001', 'birth', 'Ngày sinh của thành viên mẫu', '1975-05-10', 'Bố mẹ của thành viên mẫu tổ chức lễ đầy tháng.', 'Huế, Việt Nam', NOW(), NOW());

-- Skills and member skills
INSERT INTO skills (id, name, category, description, created_at, updated_at)
VALUES ('skill_001', 'Lập trình Python', 'Công nghệ', 'Kỹ năng mẫu cho thành viên.', NOW(), NOW());

INSERT INTO member_skills (id, member_id, skill_id, proficiency_level, created_at, updated_at)
VALUES ('memberskill_001', 'member_001', 'skill_001', 'advanced', NOW(), NOW());

-- Change request
INSERT INTO change_requests (id, requester_user_id, target_type, target_id, request_type, status, payload, reviewer_user_id, reviewed_at, created_at, updated_at)
VALUES ('change_001', 'user_001', 'member', 'member_001', 'update', 'approved', '{"field":"occupation","value":"Kỹ sư cao cấp"}'::json, 'user_001', NOW(), NOW(), NOW());

-- Notification
INSERT INTO notifications (id, user_id, title, body, notification_type, is_read, created_at)
VALUES ('notification_001', 'user_001', 'Thông báo mẫu', 'Đây là thông báo mẫu dành cho người dùng.', 'general', false, NOW());

-- Death anniversary reminder
INSERT INTO death_anniversary_reminders (id, member_id, reminder_date, status, notes, created_at, updated_at)
VALUES ('reminder_001', 'member_001', '2025-05-10', 'scheduled', 'Ngày giỗ mẫu của thành viên.', NOW(), NOW());

-- Import/Export/Backup/Audit
INSERT INTO import_jobs (id, user_id, job_type, source_file, status, result_summary, created_at, updated_at)
VALUES ('import_001', 'user_001', 'family_import', 'gia_pha_mau.csv', 'completed', '{"imported":1,"errors":0}'::json, NOW(), NOW());

INSERT INTO export_jobs (id, user_id, job_type, export_format, status, result_file, created_at, updated_at)
VALUES ('export_001', 'user_001', 'family_export', 'csv', 'completed', 'gia_pha_mau.csv', NOW(), NOW());

INSERT INTO backup_records (id, created_by_user_id, backup_type, file_path, status, backup_metadata, created_at, updated_at)
VALUES ('backup_001', 'user_001', 'daily', '/backups/gia_pha_mau.bak', 'created', '{"size":"1MB"}'::json, NOW(), NOW());

INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, ip_address, created_at)
VALUES ('audit_001', 'user_001', 'seed_sample_data', 'sample', 'member_001', '{"note":"Tạo dữ liệu mẫu cho từng bảng."}'::json, '127.0.0.1', NOW());

COMMIT;

-- End of seed
