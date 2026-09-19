import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';

export const ClanAccountMgmt: React.FC = () => {
  const [privacyMode, setPrivacyMode] = useState<'public' | 'private'>('private');
  const [msg, setMsg] = useState('');

  // Mocking delegated members
  const [delegates, setDelegates] = useState([
    { id: 'd1', name: 'Nguyễn Văn B', role: 'Trưởng Chi 1', permissions: ['Quản lý thành viên chi', 'Duyệt sửa đổi chi'] },
    { id: 'd2', name: 'Nguyễn Thị C', role: 'Thủ Quỹ', permissions: ['Quản lý quỹ dòng họ'] }
  ]);

  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);

  const handleSaveSettings = () => {
    setMsg('Đã lưu cấu hình dòng họ.');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleTransferOwnership = () => {
    if (window.confirm('CẢNH BÁO: Việc chuyển giao quyền Trưởng Tộc sẽ khiến bạn mất quyền quản trị cao nhất. Bạn có chắc chắn?')) {
      alert('Chức năng chuyển giao đang được phát triển.');
    }
  };

  const headerActions = (
    <button className="btn-primary" onClick={handleSaveSettings}>
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
      Lưu Cài Đặt
    </button>
  );

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Cài Đặt Dòng Họ & Phân Quyền" 
        subtitle="Thiết lập bảo mật hiển thị gia phả và ủy quyền quản lý cho các trưởng chi, thư ký."
        actions={headerActions}
      />

      {msg && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 animate-fade-in flex items-center gap-2">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
          {msg}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Col: Privacy & Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Quyền Riêng Tư Gia Phả</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <input 
                    type="radio" 
                    id="privacy_private" 
                    name="privacy" 
                    checked={privacyMode === 'private'} 
                    onChange={() => setPrivacyMode('private')}
                    className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="privacy_private" className="cursor-pointer">
                    <strong className="text-slate-800 block">Nội bộ dòng họ (Riêng tư)</strong>
                    <p className="text-sm text-slate-500 mt-1">Chỉ các thành viên được cấp tài khoản mới có thể xem chi tiết gia phả.</p>
                  </label>
                </div>
                
                <div className="flex items-start gap-3 mt-4">
                  <input 
                    type="radio" 
                    id="privacy_public" 
                    name="privacy" 
                    checked={privacyMode === 'public'} 
                    onChange={() => setPrivacyMode('public')}
                    className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="privacy_public" className="cursor-pointer">
                    <strong className="text-slate-800 block">Công khai một phần</strong>
                    <p className="text-sm text-slate-500 mt-1">Người ngoài (hoặc khách) có thể xem cây gia phả rút gọn (không hiện thông tin cá nhân nhạy cảm).</p>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-red-200 bg-red-100/50">
                <h3 className="font-bold text-red-700">Khu Vực Nguy Hiểm</h3>
              </div>
              <div className="p-6">
                <p className="text-slate-700 mb-4">Chuyển giao quyền "Trưởng Tộc / Business Owner" cho một người khác trong họ. Bạn sẽ mất quyền quản trị cao nhất sau khi thực hiện.</p>
                <button className="btn-primary bg-red-600 hover:bg-red-700 border-red-600 shadow-red-600/20" onClick={handleTransferOwnership}>
                  Chuyển Giao Quyền
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: Delegation */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Ủy Quyền Quản Trị</h3>
                <button className="btn-secondary text-sm py-1.5 px-3" onClick={() => setIsDelegateModalOpen(true)}>
                  + Thêm người
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500 mb-6">Cấp quyền cho Trưởng Chi hoặc Ban liên lạc để chia sẻ khối lượng công việc quản lý.</p>
                
                <div className="space-y-4">
                  {delegates.map(d => (
                    <div key={d.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <div className="flex items-center gap-3 mb-2">
                        <strong className="text-slate-800">{d.name}</strong>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{d.role}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {d.permissions.map((p, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded text-xs font-medium shadow-sm">{p}</span>
                        ))}
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Gỡ quyền
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delegate Modal */}
      {isDelegateModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsDelegateModalOpen(false)}></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-zoom-in">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-lg">Thêm Ủy Quyền Quản Trị</h3>
                <button className="text-slate-400 hover:text-slate-600 transition" onClick={() => setIsDelegateModalOpen(false)}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="form-group-admin">
                  <label className="form-label-admin">Chọn thành viên</label>
                  <input type="text" className="form-input-admin" placeholder="Nhập tên hoặc số điện thoại..." />
                </div>
                <div className="form-group-admin">
                  <label className="form-label-admin">Vai trò ủy quyền</label>
                  <select className="form-input-admin">
                    <option>Trưởng Chi</option>
                    <option>Thủ Quỹ</option>
                    <option>Thư Ký (Quản lý tư liệu)</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button className="btn-secondary" onClick={() => setIsDelegateModalOpen(false)}>Hủy</button>
                <button className="btn-primary" onClick={() => setIsDelegateModalOpen(false)}>Xác nhận ủy quyền</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClanAccountMgmt;
