import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';

export const BusinessPage: React.FC = () => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferStep, setTransferStep] = useState(1);

  return (
    <div className="page-container h-full flex flex-col">
      <PageHeader 
        title="Quản lý Business & Gói Dịch vụ" 
        subtitle="Quản lý dung lượng, giới hạn thành viên, gia hạn gói và chuyển giao quyền Trưởng tộc."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Package Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500">★</span>
              <span className="font-bold text-yellow-600 uppercase tracking-wider text-sm">Gói Premium</span>
              <span className="ml-4 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Đang hoạt động</span>
            </div>
            
            <p className="text-slate-500 mb-6">Trải nghiệm toàn bộ tính năng cao cấp cho dòng họ lớn.</p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-slate-500 mb-1">Nhân khẩu tối đa</p>
                <p className="text-xl font-bold text-slate-800">1,245 / 5,000</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Dung lượng lưu trữ</p>
                <p className="text-xl font-bold text-slate-800">15 GB / 50 GB</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Tài khoản truy cập</p>
                <p className="text-xl font-bold text-slate-800">450 / 1,000</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Ngày hết hạn</p>
                <p className="text-xl font-bold text-red-600">31/12/2026</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="btn-primary px-8">Gia hạn ngay</button>
              <button className="btn-secondary px-8">Nâng / Hạ gói</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Lịch sử giao dịch</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">Gia hạn 1 năm - Gói Premium</p>
                  <p className="text-sm text-slate-500">Thanh toán qua VNPay • 01/01/2026</p>
                </div>
                <p className="font-bold text-slate-800">5,000,000 đ</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">Đăng ký mới - Gói Premium</p>
                  <p className="text-sm text-slate-500">Thanh toán qua Chuyển khoản • 01/01/2025</p>
                </div>
                <p className="font-bold text-slate-800">5,000,000 đ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm">
            <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Khu vực Nguy hiểm
            </h3>
            <p className="text-sm text-red-600 mb-6">Các hành động dưới đây sẽ thay đổi vĩnh viễn quyền sở hữu tài khoản doanh nghiệp của dòng họ.</p>
            
            <button 
              className="w-full py-3 px-4 bg-white border-2 border-red-600 text-red-700 font-bold rounded-lg hover:bg-red-600 hover:text-white transition"
              onClick={() => setShowTransferModal(true)}
            >
              Chuyển giao quyền Trưởng tộc
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Owner Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">Chuyển giao quyền Trưởng tộc</h3>
            </div>
            
            <div className="p-6">
              {transferStep === 1 ? (
                <>
                  <p className="text-slate-600 mb-6">Bạn chuẩn bị chuyển giao TOÀN BỘ QUYỀN LỰC của hệ thống cho một người khác. Người này phải có tài khoản Family Admin hiện tại.</p>
                  
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Chọn người kế nhiệm</label>
                  <select className="form-input-admin w-full mb-6">
                    <option value="">-- Chọn Family Admin --</option>
                    <option value="user1">Nguyễn Văn Kế Nhiệm (Chi 1)</option>
                    <option value="user2">Trần Thị Quản Lý (Chi 2)</option>
                  </select>

                  <div className="flex gap-4 justify-end">
                    <button className="btn-secondary" onClick={() => setShowTransferModal(false)}>Hủy bỏ</button>
                    <button className="btn-primary bg-red-600 border-red-600 hover:bg-red-700" onClick={() => setTransferStep(2)}>Tiếp tục</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-red-50 p-4 rounded text-red-700 mb-6 border border-red-200">
                    <strong>CẢNH BÁO MẤT QUYỀN:</strong> Ngay sau khi bấm Xác nhận, tài khoản của bạn sẽ bị giáng cấp xuống Family Admin. Bạn sẽ không thể hoàn tác hành động này!
                  </div>
                  
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nhập mật khẩu của bạn để xác nhận</label>
                  <input type="password" placeholder="Mật khẩu đăng nhập..." className="form-input-admin w-full mb-6" />

                  <div className="flex gap-4 justify-end">
                    <button className="btn-secondary" onClick={() => setTransferStep(1)}>Quay lại</button>
                    <button className="btn-primary bg-red-600 border-red-600 hover:bg-red-700" onClick={() => setShowTransferModal(false)}>Xác nhận Chuyển giao</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPage;
