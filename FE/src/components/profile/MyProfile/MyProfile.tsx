import React, { useState } from 'react';
import { useToast } from '../../common/Toast';
import './MyProfile.css';

export interface MyProfileProps {
  userName?: string;
  userRole?: string;
  onBack?: () => void;
}

export const MyProfile: React.FC<MyProfileProps> = ({
  userName = 'Quản Trị Viên (Demo)',
  userRole = 'Admin',
  onBack,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  const isAdmin = userRole.toLowerCase().includes('admin');

  const [profile, setProfile] = useState({
    fullName: userName,
    email: isAdmin ? 'admin.mfgms@genealogy.vn' : 'nguoidung.giapha@gmail.com',
    phone: isAdmin ? '0988 000 111' : '0912 345 678',
    dob: '1988-10-15',
    address: 'Hà Nội, Việt Nam',
    bio: isAdmin
      ? 'Quản trị viên nền tảng gia phả đa dòng họ toàn quốc. Giám sát an toàn thông tin và hỗ trợ không gian dòng họ.'
      : 'Thành viên gia tộc, gắn kết và lưu giữ cội nguồn tổ tiên.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Lưu thành công!', 'Hồ sơ cá nhân của bạn đã được cập nhật.');
  };

  const handleAvatarClick = () => {
    toast.info('Tải ảnh đại diện', 'Chức năng tải ảnh đại diện mới đã sẵn sàng.');
  };

  return (
    <div className="my-profile-container fade-in">
      <div className="my-profile-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="my-profile-title">Hồ Sơ Cá Nhân</h1>
            <p className="my-profile-subtitle">Xem và quản lý thông tin tài khoản của bạn trên hệ thống</p>
          </div>
          {onBack && (
            <button className="btn-cancel" onClick={onBack}>
              ← Quay lại
            </button>
          )}
        </div>
      </div>

      <div className="my-profile-card">
        <div className="my-profile-avatar-section">
          <div className="my-profile-avatar">
            {profile.fullName.charAt(0).toUpperCase()}
            <button
              className="my-profile-avatar-edit"
              title="Thay đổi ảnh đại diện"
              onClick={handleAvatarClick}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          </div>
          <div className="my-profile-name-role">
            <h2>{profile.fullName}</h2>
            <span className={`badge-role ${isAdmin ? 'admin-role' : ''}`}>{userRole}</span>
          </div>
        </div>

        <div className="my-profile-form">
          <div className="form-group">
            <label>Họ và tên hiển thị</label>
            <input 
              type="text" 
              name="fullName" 
              value={profile.fullName} 
              onChange={handleChange} 
              disabled={!isEditing}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Số điện thoại</label>
              <input 
                type="text" 
                name="phone" 
                value={profile.phone} 
                onChange={handleChange} 
                disabled={!isEditing}
              />
            </div>
            <div className="form-group half">
              <label>Ngày sinh</label>
              <input 
                type="date" 
                name="dob" 
                value={profile.dob} 
                onChange={handleChange} 
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email liên hệ</label>
            <input 
              type="email" 
              name="email" 
              value={profile.email} 
              onChange={handleChange} 
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <input 
              type="text" 
              name="address" 
              value={profile.address} 
              onChange={handleChange} 
              disabled={!isEditing}
            />
          </div>
          
          <div className="form-group">
            <label>Tiểu sử / Ghi chú</label>
            <textarea 
              name="bio" 
              value={profile.bio} 
              onChange={handleChange} 
              disabled={!isEditing}
              rows={3}
            />
          </div>

          <div className="my-profile-actions">
            {!isEditing ? (
              <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                Chỉnh sửa hồ sơ
              </button>
            ) : (
              <>
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                  Hủy
                </button>
                <button className="btn-save-profile" onClick={handleSave}>
                  Lưu thay đổi
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
