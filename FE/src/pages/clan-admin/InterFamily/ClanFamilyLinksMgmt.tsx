import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface LinkReq {
  id: string;
  familyName: string;
  type: string;
  status: 'connected' | 'pending_sent' | 'pending_received';
  sharedLevel: string;
}

export const ClanFamilyLinksMgmt: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connected' | 'requests'>('connected');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const data: LinkReq[] = [
    { id: '1', familyName: 'Dòng họ Trần (Nam Định)', type: 'Họ Ngoại', status: 'connected', sharedLevel: 'Một phần' },
    { id: '2', familyName: 'Dòng họ Lê (Hà Nội)', type: 'Thông gia', status: 'pending_received', sharedLevel: 'Chưa cấu hình' },
    { id: '3', familyName: 'Dòng họ Phạm (Thái Bình)', type: 'Dâu / Rể', status: 'pending_sent', sharedLevel: 'Chưa cấu hình' },
  ];

  const connectedData = data.filter(d => d.status === 'connected');
  const requestsData = data.filter(d => d.status !== 'connected');

  const connectedCols: Column<LinkReq>[] = [
    { key: 'familyName', header: 'Tên Dòng họ', render: (item) => <strong className="text-slate-800">{item.familyName}</strong> },
    { key: 'type', header: 'Quan hệ', render: (item) => <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm font-medium">{item.type}</span> },
    { key: 'sharedLevel', header: 'Quyền chia sẻ', render: (item) => item.sharedLevel },
    { key: 'actions', header: 'Thao tác', render: () => (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={() => setShowConfigModal(true)}>Cấu hình</button>
        <button className="text-red-600 hover:text-red-800 text-sm font-medium">Hủy liên kết</button>
      </div>
    )},
  ];

  const requestCols: Column<LinkReq>[] = [
    { key: 'familyName', header: 'Tên Dòng họ', render: (item) => <strong className="text-slate-800">{item.familyName}</strong> },
    { key: 'type', header: 'Quan hệ', render: (item) => <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium">{item.type}</span> },
    { key: 'status', header: 'Trạng thái', render: (item) => (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${item.status === 'pending_sent' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
        {item.status === 'pending_sent' ? 'Đã gửi yêu cầu' : 'Yêu cầu đến'}
      </span>
    )},
    { key: 'actions', header: 'Thao tác', render: (item) => (
      <div className="flex gap-2">
        {item.status === 'pending_received' ? (
          <>
            <button className="text-green-600 hover:text-green-800 text-sm font-bold">Chấp nhận</button>
            <button className="text-red-600 hover:text-red-800 text-sm font-bold">Từ chối</button>
          </>
        ) : (
          <button className="text-slate-500 hover:text-slate-700 text-sm font-bold">Thu hồi</button>
        )}
      </div>
    )},
  ];

  const headerActions = (
    <button className="btn-primary flex items-center gap-2" onClick={() => setShowSearchModal(true)}>
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      Tìm & Kết nối Liên họ
    </button>
  );

  return (
    <div className="page-container h-full flex flex-col relative">
      <PageHeader 
        title="Quản lý Liên họ" 
        subtitle="Mạng lưới kết nối với các dòng họ thông gia, nội ngoại để tự động cập nhật gia phả chéo."
        actions={headerActions}
      />
      
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-2 w-fit">
        <button 
          className={`px-6 py-2 font-bold rounded-lg ${activeTab === 'connected' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
          onClick={() => setActiveTab('connected')}
        >
          Đang liên kết ({connectedData.length})
        </button>
        <button 
          className={`px-6 py-2 font-bold rounded-lg ${activeTab === 'requests' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
          onClick={() => setActiveTab('requests')}
        >
          Yêu cầu gửi/nhận ({requestsData.length})
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'connected' ? (
          <DataTable columns={connectedCols} data={connectedData} keyExtractor={(item) => item.id} emptyMessage="Chưa có dòng họ nào liên kết." />
        ) : (
          <DataTable columns={requestCols} data={requestsData} keyExtractor={(item) => item.id} emptyMessage="Không có yêu cầu liên kết nào." />
        )}
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSearchModal(false)}></div>
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Tìm kiếm Dòng họ</h2>
              <button className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300" onClick={() => setShowSearchModal(false)}>✕</button>
            </div>

            <div className="p-6">
              <input 
                type="text" 
                className="form-input-admin w-full mb-6" 
                placeholder="Nhập ID Dòng họ hoặc Số điện thoại Trưởng tộc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {searchQuery.length > 3 && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-800">Dòng họ Lê (Nghệ An)</h3>
                    <p className="text-sm text-slate-500">ID: LE-NA-2026</p>
                  </div>
                  <button className="btn-primary" onClick={() => {
                    alert('Đã gửi yêu cầu kết nối');
                    setShowSearchModal(false);
                  }}>Gửi yêu cầu</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sharing Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowConfigModal(false)}></div>
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-zoom-in overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Cấu hình Chia sẻ</h2>
              <button className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300" onClick={() => setShowConfigModal(false)}>✕</button>
            </div>

            <div className="p-6 flex-1 overflow-auto">
              <p className="text-slate-600 mb-6">Mức độ chia sẻ dữ liệu với: <strong>Dòng họ Trần (Nam Định)</strong></p>

              <div className="space-y-4">
                <label className="flex gap-3 p-4 border border-blue-500 bg-blue-50 rounded-xl cursor-pointer">
                  <input type="radio" name="shareLevel" className="mt-1" defaultChecked />
                  <div>
                    <h4 className="font-bold text-slate-800">Chia sẻ Toàn bộ</h4>
                    <p className="text-sm text-slate-600">Cho phép họ xem toàn bộ cây gia phả (trừ thông tin cá nhân bị ẩn).</p>
                  </div>
                </label>

                <label className="flex gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="shareLevel" className="mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-800">Chia sẻ Một phần</h4>
                    <p className="text-sm text-slate-600">Chỉ chia sẻ nhánh có quan hệ thông gia / dâu rể.</p>
                  </div>
                </label>

                <label className="flex gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="shareLevel" className="mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-800">Không chia sẻ</h4>
                    <p className="text-sm text-slate-600">Chỉ hiển thị tên dòng họ trong danh sách liên kết.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setShowConfigModal(false)}>Hủy</button>
              <button className="btn-primary" onClick={() => setShowConfigModal(false)}>Lưu cấu hình</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClanFamilyLinksMgmt;
