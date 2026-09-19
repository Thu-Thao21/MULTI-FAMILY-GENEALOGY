import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface AISuggestion {
  id: string;
  type: 'relationship' | 'correction' | 'duplicate';
  description: string;
  confidence: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const AIPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedAIReq, setSelectedAIReq] = useState<AISuggestion | null>(null);
  
  const data: AISuggestion[] = [
    { id: '1', type: 'duplicate', description: 'Có thể Nguyễn Văn A và Nguyễn Văn Â là cùng 1 người', confidence: 95, date: '11/09/2026', status: 'pending' },
    { id: '2', type: 'relationship', description: 'Dữ liệu cho thấy Trần Thị B có khả năng là vợ của Nguyễn Văn C', confidence: 82, date: '10/09/2026', status: 'pending' },
  ];

  const columns: Column<AISuggestion>[] = [
    { key: 'type', header: 'Loại phân tích', render: (item) => (
      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-semibold uppercase">{item.type}</span>
    )},
    { key: 'description', header: 'Gợi ý từ AI', render: (item) => item.description },
    { key: 'confidence', header: 'Độ tin cậy', render: (item) => (
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${item.confidence}%` }}></div>
        </div>
        <span className="text-xs text-slate-500">{item.confidence}%</span>
      </div>
    )},
    { key: 'date', header: 'Ngày tạo', render: (item) => item.date },
    { key: 'actions', header: 'Thao tác', render: (item) => (
      <div className="flex gap-2">
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-600 px-3 py-1 rounded bg-blue-50"
          onClick={() => setSelectedAIReq(item)}
        >
          Review & Quyết định
        </button>
      </div>
    )},
  ];

  const headerActions = (
    <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none' }}>
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      Chạy AI Quét dữ liệu
    </button>
  );

  return (
    <div className="page-container h-full flex flex-col relative">
      <PageHeader 
        title="AI Phân tích & Gợi ý" 
        subtitle="Hệ thống AI thông minh giúp tự động phát hiện mâu thuẫn, gợi ý ghép nối người trùng lặp."
        actions={headerActions}
      />
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tìm kiếm nội dung gợi ý..." 
          className="form-input-admin flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input-admin w-48">
          <option value="">Tất cả loại phân tích</option>
          <option value="duplicate">Trùng lặp</option>
          <option value="relationship">Quan hệ</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <DataTable columns={columns} data={data} keyExtractor={(item) => item.id} emptyMessage="Tuyệt vời! Dữ liệu của bạn rất chuẩn xác, AI chưa tìm thấy lỗi nào." />
      </div>

      {/* AI Review Modal */}
      {selectedAIReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedAIReq(null)}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center text-purple-600">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Review Gợi ý AI</h2>
                  <p className="text-sm text-slate-500">Độ tin cậy: <strong className="text-purple-600">{selectedAIReq.confidence}%</strong></p>
                </div>
              </div>
              <button 
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition"
                onClick={() => setSelectedAIReq(null)}
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-auto bg-slate-100">
              <p className="text-lg font-bold text-slate-800 mb-6 text-center">{selectedAIReq.description}</p>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <div className="p-6">
                    <h3 className="font-bold text-slate-700 mb-4 text-center">Hồ sơ 1</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500">Họ và tên</p>
                        <p className="font-semibold text-slate-800">Nguyễn Văn A</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Ngày sinh</p>
                        <p className="font-semibold text-slate-800">01/01/1980</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Nhánh/Đời</p>
                        <p className="font-semibold text-slate-800">Chi Trưởng • Đời 15</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-slate-700 mb-4 text-center">Hồ sơ 2</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500">Họ và tên</p>
                        <p className="font-semibold text-red-600 bg-red-50 inline-block px-1 rounded">Nguyễn Văn Â</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Ngày sinh</p>
                        <p className="font-semibold text-slate-800">01/01/1980</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Nhánh/Đời</p>
                        <p className="font-semibold text-red-600 bg-red-50 inline-block px-1 rounded">Không xác định</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-sm text-center">
                <strong>Giải thích AI:</strong> Tên gọi có phát âm tương tự (Â và A), ngày sinh trùng khớp hoàn toàn, cả hai đều có chung cha là Nguyễn Văn Cha. Khả năng cao đây là lỗi nhập liệu đánh máy 2 lần.
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
              <button className="btn-secondary border-red-200 text-red-600 hover:bg-red-50" onClick={() => {
                alert('Đã bỏ qua gợi ý');
                setSelectedAIReq(null);
              }}>Bỏ qua (AI Sai)</button>
              <button className="btn-primary bg-purple-600 border-purple-600 hover:bg-purple-700" onClick={() => {
                alert('Đã áp dụng và gộp dữ liệu');
                setSelectedAIReq(null);
              }}>Áp dụng Gợi ý (Merge)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPage;
