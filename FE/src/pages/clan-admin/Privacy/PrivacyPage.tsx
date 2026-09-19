import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';

export const PrivacyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'public' | 'members' | 'interfamily'>('public');

  return (
    <div className="page-container h-full flex flex-col">
      <PageHeader 
        title="Quyền riêng tư & Bảo mật" 
        subtitle="Cấu hình mức độ hiển thị dữ liệu dòng họ đối với người ngoài, thành viên và các dòng họ liên kết."
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <button 
            className={`px-6 py-4 font-semibold text-sm whitespace-nowrap ${activeTab === 'public' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('public')}
          >
            Mức công khai chung (Public)
          </button>
          <button 
            className={`px-6 py-4 font-semibold text-sm whitespace-nowrap ${activeTab === 'members' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('members')}
          >
            Phân quyền Thành viên (Members)
          </button>
          <button 
            className={`px-6 py-4 font-semibold text-sm whitespace-nowrap ${activeTab === 'interfamily' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('interfamily')}
          >
            Chia sẻ Liên họ (Inter-family)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8 overflow-y-auto">
          {activeTab === 'public' && (
            <div className="max-w-3xl">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Cấu hình Guest (Khách viếng thăm)</h3>
              <p className="text-slate-500 mb-6">Những dữ liệu này sẽ hiển thị công khai trên internet mà không cần đăng nhập.</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-bold text-slate-800">Tên và Nguồn gốc Dòng họ</h4>
                    <p className="text-sm text-slate-500">Văn bia, lịch sử hình thành</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">Public</button>
                    <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-sm font-medium">Ẩn</button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-bold text-slate-800">Thông tin Cụ Thủy Tổ</h4>
                    <p className="text-sm text-slate-500">Tiểu sử, hình ảnh Thủy Tổ</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">Public</button>
                    <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-sm font-medium">Ẩn</button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-bold text-slate-800">Cây Gia phả (Rút gọn)</h4>
                    <p className="text-sm text-slate-500">Chỉ hiện tên, ẩn ngày tháng năm sinh</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-sm font-medium">Public</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">Ẩn</button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button className="btn-primary px-8">Lưu thay đổi</button>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="max-w-4xl">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Ma trận Quyền Thành viên (Member Visibility)</h3>
              <p className="text-slate-500 mb-6">Cấu hình chi tiết những thông tin tài khoản Member có thể nhìn thấy bên trong nội bộ dòng họ.</p>

              <table className="w-full text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="p-4 border-b border-slate-200 font-bold text-slate-700">Loại Dữ liệu</th>
                    <th className="p-4 border-b border-slate-200 font-bold text-slate-700 text-center w-32">Cho phép xem</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-b border-slate-200">Full Tree (Toàn bộ Cây gia phả)</td>
                    <td className="p-4 border-b border-slate-200 text-center">
                      <input type="checkbox" className="w-5 h-5 text-blue-600" defaultChecked />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-slate-200">Contact Info (Số điện thoại, Email của người khác)</td>
                    <td className="p-4 border-b border-slate-200 text-center">
                      <input type="checkbox" className="w-5 h-5 text-blue-600" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-slate-200">Quỹ Dòng họ (Tổng quan)</td>
                    <td className="p-4 border-b border-slate-200 text-center">
                      <input type="checkbox" className="w-5 h-5 text-blue-600" defaultChecked />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-slate-200">Tài liệu riêng tư (Private Archives)</td>
                    <td className="p-4 border-b border-slate-200 text-center">
                      <input type="checkbox" className="w-5 h-5 text-blue-600" disabled title="Tài liệu riêng tư chỉ dành cho Admin" />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-8">
                <button className="btn-primary px-8">Lưu cấu hình</button>
              </div>
            </div>
          )}

          {activeTab === 'interfamily' && (
            <div className="max-w-3xl">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Chia sẻ Liên họ</h3>
              <p className="text-slate-500 mb-6">Chỉ cấu hình được khi có Yêu cầu liên họ (Inter-family Request) ở trạng thái APPROVED.</p>
              
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center text-slate-500">
                Vui lòng cấu hình chi tiết tại module Quản lý Liên họ sau khi kết nối thành công.
                <br/>
                Các trường dữ liệu PRIVATE sẽ không bao giờ được phép chia sẻ liên họ.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
