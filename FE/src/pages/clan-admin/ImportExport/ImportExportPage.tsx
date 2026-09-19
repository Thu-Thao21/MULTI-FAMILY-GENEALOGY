import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';

export const ImportExportPage: React.FC = () => {
  const [importStep, setImportStep] = useState<0 | 1 | 2 | 3 | 4>(0); // 0 = default

  return (
    <div className="page-container h-full flex flex-col relative">
      <PageHeader 
        title="Nhập / Xuất dữ liệu" 
        subtitle="Quản lý việc đưa dữ liệu hàng loạt từ file Excel vào hệ thống hoặc xuất dữ liệu ra file."
      />
      
      {importStep === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Import Card */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Nhập dữ liệu (Import Excel)</h3>
            <p className="text-slate-500 mb-6">Tải lên file Excel theo mẫu chuẩn để tự động tạo cây gia phả và hồ sơ hàng loạt.</p>
            
            <button 
              className="w-full btn-primary bg-green-600 hover:bg-green-700 border-none justify-center py-3 text-base"
              onClick={() => setImportStep(1)}
            >
              Bắt đầu Nhập dữ liệu
            </button>
            <div className="mt-4 text-center">
              <button className="text-blue-600 text-sm font-medium hover:underline">Tải file mẫu (Template)</button>
            </div>
          </div>

          {/* Export Card */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Xuất dữ liệu (Export)</h3>
            <p className="text-slate-500 mb-6">Trích xuất dữ liệu thành viên, gia phả, quỹ ra định dạng Excel hoặc PDF để lưu trữ.</p>
            
            <div className="flex flex-col gap-3">
              <button className="btn-secondary w-full justify-center py-2.5">Xuất Danh sách Thành viên (Excel)</button>
              <button className="btn-secondary w-full justify-center py-2.5">Xuất Báo cáo Quỹ (Excel)</button>
              <button className="btn-primary w-full justify-center bg-slate-800 hover:bg-slate-900 border-none py-2.5">Xuất Phả đồ (PDF/Image)</button>
            </div>
          </div>
        </div>
      ) : (
        /* Import Wizard Mode */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
          {/* Stepper Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Trình hướng dẫn Nhập dữ liệu (Import Wizard)</h2>
            <button className="text-slate-400 hover:text-slate-600 font-medium text-sm" onClick={() => setImportStep(0)}>Hủy bỏ & Đóng ✕</button>
          </div>
          
          <div className="flex px-12 py-6 justify-between items-center border-b border-slate-100">
            <div className={`flex items-center gap-3 ${importStep >= 1 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${importStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>1</span>
              <span>Tải file lên</span>
            </div>
            <div className={`h-0.5 flex-1 mx-4 ${importStep >= 2 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
            <div className={`flex items-center gap-3 ${importStep >= 2 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${importStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>2</span>
              <span>Kiểm tra lỗi</span>
            </div>
            <div className={`h-0.5 flex-1 mx-4 ${importStep >= 3 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
            <div className={`flex items-center gap-3 ${importStep >= 3 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${importStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>3</span>
              <span>Xác nhận</span>
            </div>
            <div className={`h-0.5 flex-1 mx-4 ${importStep >= 4 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
            <div className={`flex items-center gap-3 ${importStep >= 4 ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${importStep >= 4 ? 'bg-green-600 text-white' : 'bg-slate-100'}`}>4</span>
              <span>Hoàn tất</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-12">
            {importStep === 1 && (
              <div className="max-w-2xl mx-auto text-center">
                <div 
                  className="border-2 border-dashed border-blue-300 rounded-2xl p-16 bg-blue-50/50 hover:bg-blue-50 transition cursor-pointer group"
                  onClick={() => setImportStep(2)}
                >
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Kéo thả file Excel vào đây</h3>
                  <p className="text-slate-500 mb-6">hoặc click để chọn file từ máy tính của bạn</p>
                  <button className="btn-secondary pointer-events-none">Chọn file Excel</button>
                </div>
                <p className="text-sm text-slate-400 mt-6 flex items-center justify-center gap-2">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Đảm bảo file được tải về từ "Tải file mẫu" để tránh lỗi format.
                </p>
              </div>
            )}

            {importStep === 2 && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xl">!</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Đã phát hiện một số lỗi trong file</h3>
                    <p className="text-slate-500">Tìm thấy <strong className="text-slate-800">45 dòng hợp lệ</strong> và <strong className="text-red-600">2 dòng bị lỗi</strong>. Vui lòng kiểm tra lại.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-4 font-bold text-slate-700 w-16">Dòng</th>
                        <th className="p-4 font-bold text-slate-700">Họ và tên</th>
                        <th className="p-4 font-bold text-slate-700">Lỗi phát hiện</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-4 font-mono text-slate-500">12</td>
                        <td className="p-4 font-medium text-slate-800">Nguyễn Văn Lỗi</td>
                        <td className="p-4 text-red-600 font-medium flex items-center gap-2">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                          Cột "Đời thứ" không được để trống
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-slate-500">34</td>
                        <td className="p-4 font-medium text-slate-800">Trần Thị Thiếu</td>
                        <td className="p-4 text-amber-600 font-medium flex items-center gap-2">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                          Cảnh báo: ID Cha mẹ không tồn tại trong hệ thống
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className="text-sm text-slate-500 mt-4 text-center">
                  Bạn có thể chọn tiếp tục để bỏ qua các dòng lỗi (chỉ import dòng hợp lệ), hoặc Hủy để sửa file.
                </p>
              </div>
            )}

            {importStep === 3 && (
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Sẵn sàng Nhập 45 Hồ sơ</h3>
                <p className="text-slate-500 mb-8">Dữ liệu sẽ được tự động đưa vào cây gia phả dựa trên các mối quan hệ được định nghĩa trong file Excel.</p>
                
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left space-y-3 mb-8">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tổng số dòng đọc được</span>
                    <strong className="text-slate-800">47</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số dòng hợp lệ</span>
                    <strong className="text-green-600">45</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số dòng bỏ qua</span>
                    <strong className="text-red-600">2</strong>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded text-blue-800 text-sm">
                  Quá trình import có thể mất vài phút. Vui lòng không đóng trình duyệt.
                </div>
              </div>
            )}

            {importStep === 4 && (
              <div className="max-w-xl mx-auto text-center animate-fade-in">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 scale-110">
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">Nhập Dữ Liệu Thành Công!</h3>
                <p className="text-slate-600 mb-8">Đã thêm 45 nhân khẩu vào cây gia phả. Mối quan hệ đã được liên kết tự động.</p>
                
                <div className="flex gap-4 justify-center">
                  <button className="btn-secondary" onClick={() => setImportStep(0)}>Về màn hình chính</button>
                  <button className="btn-primary bg-green-600 hover:bg-green-700 border-green-600" onClick={() => alert('Chuyển tới cây gia phả')}>Xem Cây Gia Phả</button>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Footer actions */}
          {importStep > 0 && importStep < 4 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <button 
                className="btn-secondary" 
                onClick={() => setImportStep(importStep - 1 as any)}
                disabled={importStep === 1}
              >
                Quay lại
              </button>
              
              <button 
                className="btn-primary" 
                onClick={() => setImportStep(importStep + 1 as any)}
              >
                {importStep === 3 ? 'Bắt đầu Import' : 'Tiếp tục'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportExportPage;
