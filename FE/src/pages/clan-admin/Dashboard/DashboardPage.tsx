import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/shared/Layout/PageHeader';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="page-container h-full flex flex-col">
      <PageHeader 
        title="Tổng quan Dòng họ Nguyễn Đại Tôn" 
        subtitle="Chào mừng Trưởng tộc quay trở lại. Dưới đây là tình hình hoạt động của dòng họ hôm nay."
      />

      <div className="flex-1 overflow-auto pb-8">
        {/* Section 1: Thông tin lõi (Nhân khẩu, Tài khoản, Family Admin, Chi Nhánh) */}
        <h3 className="text-lg font-bold text-slate-800 mb-4 px-1">Quy mô & Cấu trúc</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div 
            onClick={() => handleNavigate('/clan-admin/persons')}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-500 hover:shadow-md transition group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
              </div>
              <span className="text-sm font-medium text-slate-400">Tất cả</span>
            </div>
            <h4 className="text-3xl font-bold text-slate-800">1,245</h4>
            <p className="text-sm text-slate-500 mt-1 font-medium">Nhân khẩu (Person)</p>
          </div>

          <div 
            onClick={() => handleNavigate('/clan-admin/members')}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-green-500 hover:shadow-md transition group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-100 transition">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+12 tuần này</span>
            </div>
            <h4 className="text-3xl font-bold text-slate-800">450</h4>
            <p className="text-sm text-slate-500 mt-1 font-medium">Tài khoản truy cập</p>
          </div>

          <div 
            onClick={() => handleNavigate('/clan-admin/branches')}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-amber-500 hover:shadow-md transition group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
            </div>
            <h4 className="text-3xl font-bold text-slate-800">12 / 45</h4>
            <p className="text-sm text-slate-500 mt-1 font-medium">Chi / Nhánh</p>
          </div>

          <div 
            onClick={() => handleNavigate('/clan-admin/family-admins')}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-purple-500 hover:shadow-md transition group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
            </div>
            <h4 className="text-3xl font-bold text-slate-800">8</h4>
            <p className="text-sm text-slate-500 mt-1 font-medium">Family Admin</p>
          </div>
        </div>

        {/* Section 2: Công việc cần xử lý (Approvals, Inter-family, AI) */}
        <h3 className="text-lg font-bold text-slate-800 mb-4 px-1">Cần Xử Lý</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div 
            onClick={() => handleNavigate('/clan-admin/approvals')}
            className="bg-red-50 p-5 rounded-xl border border-red-100 shadow-sm cursor-pointer hover:bg-red-100 transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xl">
              15
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Yêu cầu chờ duyệt</h4>
              <p className="text-sm text-slate-600">Sửa hồ sơ, thêm quan hệ</p>
            </div>
          </div>

          <div 
            onClick={() => handleNavigate('/clan-admin/inter-family')}
            className="bg-amber-50 p-5 rounded-xl border border-amber-100 shadow-sm cursor-pointer hover:bg-amber-100 transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Lời mời Liên họ</h4>
              <p className="text-sm text-slate-600">Từ họ Trần, họ Lê</p>
            </div>
          </div>

          <div 
            onClick={() => handleNavigate('/clan-admin/ai')}
            className="bg-purple-50 p-5 rounded-xl border border-purple-100 shadow-sm cursor-pointer hover:bg-purple-100 transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xl">
              5
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Gợi ý AI</h4>
              <p className="text-sm text-slate-600">Gộp trùng lặp, logic lỗi</p>
            </div>
          </div>
        </div>

        {/* Section 3: Hoạt động & Quỹ (Events, Memorials, Funds, Business) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 px-1">Lịch trình & Hoạt động</h3>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div 
                className="p-4 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                onClick={() => handleNavigate('/clan-admin/memorial-days')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded flex items-center justify-center">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Giỗ Cụ Thủy Tổ Nguyễn Bặc</h4>
                    <p className="text-xs text-red-600 font-semibold mt-0.5">15/08 Âm lịch (Còn 3 ngày)</p>
                  </div>
                </div>
                <span className="text-slate-400">❯</span>
              </div>
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                onClick={() => handleNavigate('/clan-admin/events')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Họp mặt dòng họ thường niên</h4>
                    <p className="text-xs text-slate-500 mt-0.5">20/11/2026 • Đã có 120 người tham gia</p>
                  </div>
                </div>
                <span className="text-slate-400">❯</span>
              </div>
            </div>

            <div 
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-green-500 transition flex items-center justify-between"
              onClick={() => handleNavigate('/clan-admin/funds')}
            >
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tổng Quỹ Khuyến Học & Xây Dựng</p>
                <h3 className="text-3xl font-bold text-green-700">97,500,000 ₫</h3>
              </div>
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 px-1">Trạng thái Gói Dịch vụ</h3>
            <div 
              className="bg-slate-800 p-6 rounded-xl text-white shadow-lg cursor-pointer hover:bg-slate-900 transition relative overflow-hidden"
              onClick={() => handleNavigate('/clan-admin/business')}
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-500 opacity-20 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400">★</span>
                <span className="font-bold text-yellow-400 uppercase tracking-wider text-sm">Premium Plan</span>
              </div>
              <p className="text-slate-300 text-sm mb-1">Ngày hết hạn:</p>
              <h4 className="text-xl font-bold mb-6">31/12/2026</h4>
              
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Nhân khẩu</span>
                    <span>1,245 / 5,000</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Lưu trữ (Tư liệu/3D)</span>
                    <span>15GB / 50GB</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
