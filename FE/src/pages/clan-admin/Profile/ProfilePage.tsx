import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Hồ sơ cá nhân" 
        subtitle="Quản lý thông tin cá nhân và bảo mật tài khoản của bạn."
      />

      <div className="flex-1 overflow-auto flex justify-center py-6">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
            <div className="flex flex-col items-center mb-8 mt-4">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3 border-4 border-white shadow">
                T
              </div>
              <h3 className="font-bold text-slate-800">Trưởng tộc Admin</h3>
              <p className="text-xs text-slate-500">Quản trị viên cấp cao</p>
            </div>

            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'info' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Thông tin chung
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Bảo mật & Mật khẩu
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {activeTab === 'info' ? (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Thông tin cá nhân</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="form-group-admin">
                    <label className="form-label-admin">Họ và tên</label>
                    <input type="text" className="form-input-admin" defaultValue="Trưởng tộc Admin" />
                  </div>
                  <div className="form-group-admin">
                    <label className="form-label-admin">Email</label>
                    <input type="email" className="form-input-admin" defaultValue="admin@giaphaviet.vn" />
                  </div>
                  <div className="form-group-admin">
                    <label className="form-label-admin">Số điện thoại</label>
                    <input type="text" className="form-input-admin" defaultValue="0987654321" />
                  </div>
                  <div className="form-group-admin">
                    <label className="form-label-admin">Ngày sinh</label>
                    <input type="date" className="form-input-admin" defaultValue="1970-01-01" />
                  </div>
                  <div className="form-group-admin col-span-2">
                    <label className="form-label-admin">Địa chỉ</label>
                    <input type="text" className="form-input-admin" defaultValue="Hà Nội, Việt Nam" />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button className="btn-primary px-8">Lưu thay đổi</button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Đổi mật khẩu</h3>
                <div className="space-y-4 max-w-md">
                  <div className="form-group-admin">
                    <label className="form-label-admin">Mật khẩu hiện tại</label>
                    <input type="password" className="form-input-admin" placeholder="Nhập mật khẩu hiện tại" />
                  </div>
                  <div className="form-group-admin">
                    <label className="form-label-admin">Mật khẩu mới</label>
                    <input type="password" className="form-input-admin" placeholder="Nhập mật khẩu mới" />
                  </div>
                  <div className="form-group-admin">
                    <label className="form-label-admin">Xác nhận mật khẩu mới</label>
                    <input type="password" className="form-input-admin" placeholder="Nhập lại mật khẩu mới" />
                  </div>
                  <div className="mt-6">
                    <button className="btn-primary">Cập nhật mật khẩu</button>
                  </div>
                </div>

                <div className="mt-12 border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Xác thực 2 yếu tố (2FA)</h3>
                  <p className="text-sm text-slate-500 mb-4">Bảo vệ tài khoản của bạn bằng cách yêu cầu mã xác thực khi đăng nhập.</p>
                  <button className="btn-secondary">Bật xác thực 2 yếu tố</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
