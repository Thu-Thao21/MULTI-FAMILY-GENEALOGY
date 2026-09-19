import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface ApprovalRequest {
  id: string;
  requester: string;
  type: string;
  target: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const ClanApprovalsMgmt: React.FC = () => {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedReq, setSelectedReq] = useState<ApprovalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const data: ApprovalRequest[] = [
    { id: '1', requester: 'Nguyễn Văn A', type: 'Sửa hồ sơ', target: 'Nguyễn Văn B (Con)', date: '11/09/2026', status: 'pending' },
    { id: '2', requester: 'Trần Thị Hoa', type: 'Thêm quan hệ', target: 'Bản thân (Thêm chồng)', date: '10/09/2026', status: 'pending' },
    { id: '3', requester: 'Nguyễn Văn Nam', type: 'Sửa ngày mất', target: 'Nguyễn Văn Cụ (Ông nội)', date: '08/09/2026', status: 'approved' },
  ];

  const filteredData = data.filter(d => d.status === filter);

  const columns: Column<ApprovalRequest>[] = [
    { key: 'requester', header: 'Người gửi', render: (item) => <strong className="text-slate-800">{item.requester}</strong> },
    { key: 'type', header: 'Loại yêu cầu', render: (item) => <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium">{item.type}</span> },
    { key: 'target', header: 'Đối tượng thay đổi', render: (item) => item.target },
    { key: 'date', header: 'Thời gian', render: (item) => item.date },
    { key: 'actions', header: 'Thao tác', render: (item) => (
      <button 
        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded"
        onClick={() => { setSelectedReq(item); setShowRejectInput(false); }}
      >
        {item.status === 'pending' ? 'Xem & Duyệt' : 'Xem chi tiết'}
      </button>
    )},
  ];

  return (
    <div className="page-container h-full flex flex-col relative">
      <PageHeader 
        title="Phê duyệt Đề xuất" 
        subtitle="So sánh và phê duyệt các yêu cầu thay đổi dữ liệu gia phả từ thành viên."
      />
      
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-2">
        <button 
          className={`flex-1 py-2 font-bold rounded-lg ${filter === 'pending' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
          onClick={() => setFilter('pending')}
        >
          Chờ duyệt ({data.filter(d => d.status === 'pending').length})
        </button>
        <button 
          className={`flex-1 py-2 font-bold rounded-lg ${filter === 'approved' ? 'bg-green-50 text-green-700' : 'text-slate-500 hover:bg-slate-50'}`}
          onClick={() => setFilter('approved')}
        >
          Đã duyệt
        </button>
        <button 
          className={`flex-1 py-2 font-bold rounded-lg ${filter === 'rejected' ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:bg-slate-50'}`}
          onClick={() => setFilter('rejected')}
        >
          Đã từ chối
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={filteredData} 
          keyExtractor={(item) => item.id} 
          emptyMessage="Không có yêu cầu nào trong trạng thái này."
        />
      </div>

      {/* Comparison Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedReq(null)}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Chi tiết Đề xuất: {selectedReq.type}</h2>
                <p className="text-sm text-slate-500 mt-1">Từ: <strong>{selectedReq.requester}</strong> • {selectedReq.date}</p>
              </div>
              <button 
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition"
                onClick={() => setSelectedReq(null)}
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-auto bg-slate-100">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <div className="p-6 bg-red-50/30">
                    <h3 className="font-bold text-red-700 flex items-center gap-2 mb-4">
                      <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">-</span>
                      Dữ liệu hiện tại
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500">Học vấn</p>
                        <p className="font-semibold text-slate-700 line-through decoration-red-400">Cử nhân CNTT</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Nghề nghiệp</p>
                        <p className="font-semibold text-slate-700 line-through decoration-red-400">Lập trình viên</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-green-50/30">
                    <h3 className="font-bold text-green-700 flex items-center gap-2 mb-4">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">+</span>
                      Dữ liệu đề xuất
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500">Học vấn</p>
                        <p className="font-semibold text-green-700">Thạc sĩ Kỹ thuật Phần mềm</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Nghề nghiệp</p>
                        <p className="font-semibold text-green-700">Trưởng phòng Kỹ thuật (Technical Lead)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-white">
              {showRejectInput ? (
                <div className="animate-fade-in">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lý do từ chối (Bắt buộc)</label>
                  <textarea 
                    className="form-input-admin w-full mb-4" 
                    rows={3} 
                    placeholder="Nhập lý do để gửi lại cho người yêu cầu..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end gap-3">
                    <button className="btn-secondary" onClick={() => setShowRejectInput(false)}>Hủy bỏ</button>
                    <button 
                      className="btn-primary bg-red-600 border-red-600 hover:bg-red-700 disabled:opacity-50"
                      disabled={!rejectReason.trim()}
                      onClick={() => {
                        alert('Đã từ chối đề xuất');
                        setSelectedReq(null);
                      }}
                    >
                      Xác nhận Từ chối
                    </button>
                  </div>
                </div>
              ) : selectedReq.status === 'pending' ? (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500">Sau khi phê duyệt, dữ liệu sẽ được tự động cập nhật vào cây gia phả.</p>
                  <div className="flex gap-3">
                    <button className="btn-secondary border-red-200 text-red-600 hover:bg-red-50" onClick={() => setShowRejectInput(true)}>
                      Từ chối
                    </button>
                    <button className="btn-primary bg-green-600 border-green-600 hover:bg-green-700" onClick={() => {
                      alert('Đã phê duyệt thành công');
                      setSelectedReq(null);
                    }}>
                      Phê duyệt thay đổi
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button className="btn-secondary" onClick={() => setSelectedReq(null)}>Đóng</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClanApprovalsMgmt;
