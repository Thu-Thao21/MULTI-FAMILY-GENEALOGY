import { LoadingState } from '../../../shared/Feedback/LoadingState';
import { EmptyState } from '../../../shared/Feedback/EmptyState';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { fetchMemberDetail, updateMemberProfile } from '../../../services/member.service';
import { getCached } from '../../../utils/memoryCache';
import type { MemberDetail } from '../../../types/member';
import { AccountTab } from '../AccountTab';
import { BiographyTab } from '../BiographyTab';
import { ContactTab } from '../ContactTab';
import { ContributionsTab } from '../ContributionsTab';
import { PersonalInfoTab } from '../PersonalInfoTab';
import { PhotosTab } from '../PhotosTab';
import { StatusTab } from '../StatusTab';
import '../Profile.css';
import './ProfileLayout.css';

export interface ProfileLayoutProps {
  memberId: string;
  onBack?: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export type ProfileTabKey = 'personal' | 'biography' | 'contact' | 'photos' | 'contributions' | 'status' | 'account';

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ memberId, onBack, onNavigateTab }) => {
  const { account } = useAuth();
  const cachedMember = getCached<MemberDetail>(`member-detail:${memberId}`)?.data ?? null;
  const [member, setMember] = useState<MemberDetail | null>(cachedMember);
  const [loading, setLoading] = useState<boolean>(!cachedMember);
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('personal');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    otherName: '',
    gender: 'male',
    birthDate: '',
    occupation: '',
    education: '',
    phone: '',
    email: '',
    address: '',
    bio: '',
  });

  const applyExtraProfileFields = (data: MemberDetail | null): MemberDetail | null => {
    if (!data) return null;
    try {
      const raw = localStorage.getItem(`profile_extra_${data.id}`);
      if (!raw) return data;
      const extra = JSON.parse(raw);
      return {
        ...data,
        otherName: extra.otherName ?? data.otherName,
        occupation: extra.occupation || data.occupation,
        education: extra.education || data.education,
        bio: extra.bio !== undefined ? extra.bio : (data as any).bio,
        contact: {
          phone: extra.phone ?? data.contact?.phone,
          email: extra.email ?? data.contact?.email,
          address: extra.address ?? data.contact?.address,
        },
      };
    } catch {
      return data;
    }
  };

  const [isPrivate, setIsPrivate] = useState<boolean>(() => {
    const saved = localStorage.getItem(`privacy_setting_${memberId}`);
    return saved ? saved === 'private' : false;
  });

  useEffect(() => {
    const cached = applyExtraProfileFields(getCached<MemberDetail>(`member-detail:${memberId}`)?.data ?? null);
    if (cached) {
      setMember(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    fetchMemberDetail(memberId).then((data) => {
      setMember(applyExtraProfileFields(data));
      if (data) {
        const saved = localStorage.getItem(`privacy_setting_${memberId}`);
        const priv = saved ? saved === 'private' : Boolean((data as any).isPrivate || (data as any).is_private);
        setIsPrivate(priv);
      }
      setLoading(false);
    });
  }, [memberId]);

  const roleLower = (account?.primary_role || '').toLowerCase();
  const canManage = ['trưởng tộc', 'chủ dòng họ', 'clan admin', 'clan_admin', 'family_head', 'family admin', 'family_admin', 'manager'].includes(roleLower);

  const openEditModal = () => {
    if (!member) return;
    setEditForm({
      fullName: member.fullName || '',
      otherName: member.otherName || '',
      gender: (member.gender || 'male').toLowerCase(),
      birthDate: member.birthDate ? String(member.birthDate).slice(0, 10) : '',
      occupation: member.occupation || '',
      education: member.education || '',
      phone: member.contact?.phone || '',
      email: member.contact?.email || (isSelf ? account?.email || '' : ''),
      address: member.contact?.address || '',
      bio: (member as any).bio || '',
    });
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    if (!editForm.fullName.trim()) {
      setErrorToast('Họ và tên không được để trống.');
      setTimeout(() => setErrorToast(null), 3500);
      return;
    }
    setEditSaving(true);
    try {
      await updateMemberProfile(member.id, {
        fullName: editForm.fullName.trim(),
        gender: editForm.gender,
        birthDate: editForm.birthDate || '',
        bio: editForm.bio,
      });

      try {
        localStorage.setItem(
          `profile_extra_${member.id}`,
          JSON.stringify({
            otherName: editForm.otherName.trim() || undefined,
            occupation: editForm.occupation.trim() || undefined,
            education: editForm.education.trim() || undefined,
            phone: editForm.phone.trim() || undefined,
            email: editForm.email.trim() || undefined,
            address: editForm.address.trim() || undefined,
            bio: editForm.bio,
          })
        );
      } catch {
        // Ignore storage errors
      }

      const fresh = await fetchMemberDetail(member.id);
      setMember(
        applyExtraProfileFields(
          fresh || {
            ...member,
            fullName: editForm.fullName.trim(),
            gender: editForm.gender as any,
            birthDate: editForm.birthDate || undefined,
            bio: editForm.bio,
          }
        )
      );
      setIsEditOpen(false);
      setSuccessToast('Đã cập nhật thông tin cá nhân & liên hệ thành công!');
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Không thể cập nhật thông tin hồ sơ.';
      setErrorToast(msg);
      setTimeout(() => setErrorToast(null), 4000);
    } finally {
      setEditSaving(false);
    }
  };

  const isSelf = Boolean(
    account && member && (
      ((member as any).userId && (member as any).userId === account.id) ||
      ((account as any)?.person_id && member.id === (account as any).person_id) ||
      (account.display_name && member.fullName && account.display_name.trim().toLowerCase() === member.fullName.trim().toLowerCase())
    )
  );

  const handleTogglePrivacy = () => {
    const nextVal = !isPrivate;
    setIsPrivate(nextVal);
    localStorage.setItem(`privacy_setting_${memberId}`, nextVal ? 'private' : 'public');
    const msg = nextVal
      ? `Đã chuyển hồ sơ của bạn sang chế độ Riêng tư (Ẩn SĐT và Email với thành viên khác).`
      : `Đã chuyển hồ sơ của bạn sang chế độ Công khai trong dòng họ.`;
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  if (loading) {
    return (
      <LoadingState
        message="Đang tải thông tin chi tiết hồ sơ thành viên..."
        subMessage="Hệ thống đang truy xuất dữ liệu phả ký, thế hệ và lý lịch từ máy chủ gia tộc."
      />
    );
  }

  if (!member) {
    return (
      <div className="profile-empty-page-container">
        <div className="profile-empty-card">
          <div className="profile-empty-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Hồ sơ nhân khẩu
          </div>

          <EmptyState
            variant="members"
            title="Hồ sơ thành viên chưa có dữ liệu"
            subMessage="Thông tin chi tiết về thành viên này chưa được ghi nhận trong sổ gia phả hoặc tài khoản chưa được liên kết với hồ sơ nhân khẩu cụ thể."
            action={
              <div className="profile-empty-actions">
                {onBack && (
                  <button type="button" className="profile-empty-btn-primary" onClick={onBack}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Quay lại danh sách
                  </button>
                )}
                {onNavigateTab && (
                  <button
                    type="button"
                    className="profile-empty-btn-secondary"
                    onClick={() => onNavigateTab('dashboard')}
                  >
                    Về trang chủ
                  </button>
                )}
              </div>
            }
          />

          <div className="profile-empty-guide-box">
            <div className="profile-empty-guide-item">
              <span className="profile-empty-guide-dot" />
              <span>
                <strong>Dành cho Ban quản trị / Trưởng tộc:</strong> Bạn có thể bổ sung thông tin nhân khẩu mới hoặc liên kết tài khoản tại mục Danh sách thành viên.
              </span>
            </div>
            <div className="profile-empty-guide-item">
              <span className="profile-empty-guide-dot" />
              <span>
                <strong>Dành cho Thành viên:</strong> Vui lòng liên hệ Trưởng tộc hoặc Quản trị viên để được cập nhật và liên kết thông tin vào cây gia phả dòng họ.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs: Array<{ key: ProfileTabKey; label: string; icon?: string }> = [
    { key: 'personal', label: 'Thông tin cá nhân & Liên hệ' },
    { key: 'biography', label: 'Tiểu sử & Dòng thời gian' },
    { key: 'photos', label: 'Thư viện hình ảnh' },
    { key: 'contributions', label: 'Đóng góp & Năng lực' },
    { key: 'status', label: 'Trạng thái & An táng' },
    { key: 'account', label: 'Tài khoản hệ thống' },
  ];

  return (
    <div className="profile-layout">
      {/* Header Banner */}
      <div className="profile-header-card">
        <div className="profile-header-top">
          <div className="profile-avatar-wrapper">
            {member.avatarUrl ? (
              <img src={member.avatarUrl} alt={member.fullName} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-placeholder">{member.fullName.charAt(0)}</div>
            )}
          </div>

          <div className="profile-header-info">
            <h1 className="profile-name">
              {member.fullName}
              <span className="profile-generation-badge">Đời {member.generation}</span>
              {isSelf && (
                <span
                  className="profile-self-badge">
                  Hồ sơ của bạn
                </span>
              )}
            </h1>

            <div className="profile-subtext">
              <span>{member.familyName || account?.clan_name || 'Dòng họ'}</span>
              {member.branch && <span>• {member.branch}</span>}
              {member.subBranch && <span>• {member.subBranch}</span>}
            </div>

            <div className="profile-header-meta">
              <div className="profile-meta-item">
                <strong>{member.occupation || 'Chưa cập nhật nghề nghiệp'}</strong>
              </div>
              <div className="profile-meta-item">
                <strong>{member.education || 'Chưa cập nhật học vấn'}</strong>
              </div>
              <div className="profile-meta-item">
                {member.isAlive ? 'Còn sống' : 'Đã mất'}
              </div>
            </div>

            {/* Privacy Control Bar */}
            <div className="profile-privacy-control-box">
              <div className="profile-privacy-status-group">
                <span className="profile-privacy-label">
                  Quyền riêng tư hồ sơ:
                </span>
                <span className={`profile-privacy-badge ${isPrivate ? 'private' : 'public'}`}>
                  {isPrivate ? 'Riêng tư (Ẩn SĐT & Email)' : 'Công khai dòng họ'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {(isSelf || canManage) && (
                  <button
                    type="button"
                    className="profile-privacy-toggle-btn"
                    style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe', fontWeight: 700 }}
                    onClick={openEditModal}
                  >
                    Chỉnh sửa thông tin
                  </button>
                )}
                {isSelf && (
                  <button
                    type="button"
                    className="profile-privacy-toggle-btn"
                    onClick={handleTogglePrivacy}
                  >
                    {isPrivate ? 'Chuyển sang Công khai' : 'Thiết lập Riêng tư (Ẩn liên hệ)'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs-bar">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`profile-tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon && <span>{t.icon}</span>}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'personal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <PersonalInfoTab member={member} />
            <ContactTab member={member} isPrivate={isPrivate} isSelf={isSelf} />
          </div>
        )}
        {activeTab === 'biography' && <BiographyTab member={member} />}
        {activeTab === 'photos' && <PhotosTab member={member} />}
        {activeTab === 'contributions' && <ContributionsTab member={member} />}
        {activeTab === 'status' && <StatusTab member={member} />}
        {activeTab === 'account' && <AccountTab member={member} />}
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
          onClick={() => !editSaving && setIsEditOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                Cập nhật thông tin hồ sơ
              </h3>
              <button
                type="button"
                disabled={editSaving}
                onClick={() => setIsEditOpen(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '20px', color: '#64748b', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Tên gọi khác / Tự
                  </label>
                  <input
                    type="text"
                    value={editForm.otherName}
                    onChange={(e) => setEditForm((f) => ({ ...f, otherName: e.target.value }))}
                    placeholder="Ví dụ: Tự Minh Quân"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Giới tính
                  </label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={editForm.birthDate}
                    onChange={(e) => setEditForm((f) => ({ ...f, birthDate: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Nghề nghiệp
                  </label>
                  <input
                    type="text"
                    value={editForm.occupation}
                    onChange={(e) => setEditForm((f) => ({ ...f, occupation: e.target.value }))}
                    placeholder="Ví dụ: Kỹ sư phần mềm"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Học vấn / Bằng cấp
                  </label>
                  <input
                    type="text"
                    value={editForm.education}
                    onChange={(e) => setEditForm((f) => ({ ...f, education: e.target.value }))}
                    placeholder="Ví dụ: Đại học"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="Nhập số điện thoại liên hệ"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Nhập địa chỉ email"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Địa chỉ hiện tại
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Nhập nơi ở hiện tại"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Tiểu sử / Giới thiệu
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Nhập thông tin tiểu sử, quá trình học tập hoặc ghi chú cá nhân..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  disabled={editSaving}
                  onClick={() => setIsEditOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 600, cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}
                >
                  {editSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorToast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: '#dc2626',
            color: '#ffffff',
            padding: '14px 22px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(220, 38, 38, 0.25)',
            zIndex: 10000,
          }}
        >
          {errorToast}
        </div>
      )}

      {/* Success Notification */}
      {successToast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, #15803d, #16a34a)',
            color: '#ffffff',
            padding: '14px 22px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.4)',
            fontSize: '14px',
            fontWeight: 600,
            zIndex: 10000,
          }}
        >
          {successToast}
        </div>
      )}
    </div>
  );
};

export default ProfileLayout;
