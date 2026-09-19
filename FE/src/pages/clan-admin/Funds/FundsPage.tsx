import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface FundTransaction {
  id: string;
  type: 'in' | 'out';
  amount: number;
  description: string;
  date: string;
  personName: string;
}

export const FundsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const data: FundTransaction[] = [
    { id: '1', type: 'in', amount: 500000, description: 'Đóng góp Quỹ khuyến học', date: '10/09/2026', personName: 'Nguyễn Văn A' },
    { id: '2', type: 'out', amount: 2000000, description: 'Sửa chữa Từ đường', date: '05/09/2026', personName: 'Ban Trị sự' },
    { id: '3', type: 'in', amount: 1000000, description: 'Cúng dường lễ thanh minh', date: '01/09/2026', personName: 'Nguyễn Văn C' },
    { id: '4', type: 'out', amount: 500000, description: 'Hỗ trợ gia đình khó khăn', date: '28/08/2026', personName: 'Ban Trị sự' },
  ];

  const columns: Column<FundTransaction>[] = [
    { key: 'date', header: 'Ngày', render: (item) => item.date },
    { key: 'description', header: 'Nội dung', render: (item) => <span className="text-slate-800 font-medium">{item.description}</span> },
    { key: 'personName', header: 'Người thực hiện / Đóng góp', render: (item) => item.personName },
    { key: 'amount', header: 'Số tiền', render: (item) => (
      <span className={`font-bold ${item.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
        {item.type === 'in' ? '+' : '-'}{item.amount.toLocaleString()} đ
      </span>
    )},
  ];

  const headerActions = (
    <div className="flex gap-2">
      <button className="btn-secondary">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Xuất Báo cáo
      </button>
      <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Thêm Giao dịch
      </button>
    </div>
  );

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Quản lý Quỹ dòng họ" 
        subtitle="Kiểm soát thu chi, đóng góp tự nguyện và lập báo cáo tài chính minh bạch."
        actions={headerActions}
      />

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm text-slate-500 font-medium mb-1">Tổng Quỹ Khuyến học</p>
              <h3 className="text-3xl font-bold text-blue-700">12,500,000 đ</h3>
              <p className="text-xs text-green-600 mt-2 font-medium">↑ Tăng 5% so với tháng trước</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-blue-600">
              <svg width="120" height="120" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.1-.96-2.17-1.92H8c.11 1.71 1.31 2.86 2.9 3.22V19h2.33v-1.64c1.72-.3 2.87-1.35 2.87-2.92-.01-1.79-1.5-2.7-3.79-3.3z"></path></svg>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm text-slate-500 font-medium mb-1">Tổng Quỹ Xây dựng</p>
              <h3 className="text-3xl font-bold text-green-700">85,000,000 đ</h3>
              <p className="text-xs text-green-600 mt-2 font-medium">↑ Tăng 12% so với tháng trước</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-green-600">
              <svg width="120" height="120" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.84L18.4 19H5.6L12 5.84zM11 10h2v5h-2zm0 6h2v2h-2z"></path></svg>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm text-slate-500 font-medium mb-1">Tổng Chi (Tháng này)</p>
              <h3 className="text-3xl font-bold text-red-600">2,500,000 đ</h3>
              <p className="text-xs text-red-600 mt-2 font-medium">↓ Giảm 2% so với tháng trước</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-red-600">
              <svg width="120" height="120" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>
            </div>
          </div>
        </div>

        {/* Mock Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-6">
          <div className="flex-1">
            <h4 className="font-bold text-slate-800 mb-4">Biểu đồ Thu/Chi 6 tháng gần nhất</h4>
            <div className="h-48 flex items-end gap-4 px-2 border-b border-l border-slate-200 relative">
              <div className="absolute left-[-30px] bottom-[20%] text-xs text-slate-400">10M</div>
              <div className="absolute left-[-30px] bottom-[50%] text-xs text-slate-400">20M</div>
              <div className="absolute left-[-30px] bottom-[80%] text-xs text-slate-400">30M</div>

              {/* T4 */}
              <div className="flex-1 flex justify-center gap-1 group relative">
                <div className="w-1/3 bg-green-400 h-[60%] rounded-t-sm"></div>
                <div className="w-1/3 bg-red-400 h-[20%] rounded-t-sm"></div>
                <div className="absolute -bottom-6 text-xs text-slate-500">T4</div>
              </div>
              {/* T5 */}
              <div className="flex-1 flex justify-center gap-1 group relative">
                <div className="w-1/3 bg-green-400 h-[40%] rounded-t-sm"></div>
                <div className="w-1/3 bg-red-400 h-[30%] rounded-t-sm"></div>
                <div className="absolute -bottom-6 text-xs text-slate-500">T5</div>
              </div>
              {/* T6 */}
              <div className="flex-1 flex justify-center gap-1 group relative">
                <div className="w-1/3 bg-green-400 h-[80%] rounded-t-sm"></div>
                <div className="w-1/3 bg-red-400 h-[40%] rounded-t-sm"></div>
                <div className="absolute -bottom-6 text-xs text-slate-500">T6</div>
              </div>
              {/* T7 */}
              <div className="flex-1 flex justify-center gap-1 group relative">
                <div className="w-1/3 bg-green-400 h-[30%] rounded-t-sm"></div>
                <div className="w-1/3 bg-red-400 h-[10%] rounded-t-sm"></div>
                <div className="absolute -bottom-6 text-xs text-slate-500">T7</div>
              </div>
              {/* T8 */}
              <div className="flex-1 flex justify-center gap-1 group relative">
                <div className="w-1/3 bg-green-400 h-[50%] rounded-t-sm"></div>
                <div className="w-1/3 bg-red-400 h-[20%] rounded-t-sm"></div>
                <div className="absolute -bottom-6 text-xs text-slate-500">T8</div>
              </div>
              {/* T9 */}
              <div className="flex-1 flex justify-center gap-1 group relative">
                <div className="w-1/3 bg-green-400 h-[70%] rounded-t-sm"></div>
                <div className="w-1/3 bg-red-400 h-[50%] rounded-t-sm"></div>
                <div className="absolute -bottom-6 text-xs text-slate-500 font-bold">T9</div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-10">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-400 rounded-sm"></div><span className="text-xs text-slate-600">Thu</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400 rounded-sm"></div><span className="text-xs text-slate-600">Chi</span></div>
            </div>
          </div>
          
          <div className="w-72 bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4">Giao dịch chờ duyệt</h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
                <div className="text-sm font-medium text-slate-800">Cúng dường xây cổng</div>
                <div className="text-xs text-slate-500 mb-2">Bởi: Phạm Thị Y</div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold text-sm">+5,000,000 đ</span>
                  <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Duyệt</button>
                </div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
                <div className="text-sm font-medium text-slate-800">Mua sắm vật tư cúng</div>
                <div className="text-xs text-slate-500 mb-2">Bởi: Ban Trị sự</div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-bold text-sm">-1,200,000 đ</span>
                  <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Duyệt</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
          <input 
            type="text" 
            placeholder="Tìm kiếm giao dịch..." 
            className="form-input-admin flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="form-input-admin w-48">
            <option value="">Tất cả quỹ</option>
            <option value="1">Quỹ Khuyến học</option>
            <option value="2">Quỹ Xây dựng</option>
          </select>
          <select className="form-input-admin w-48">
            <option value="">Tất cả loại giao dịch</option>
            <option value="in">Thu / Đóng góp</option>
            <option value="out">Chi</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <DataTable columns={columns} data={data} keyExtractor={(item) => item.id} emptyMessage="Chưa có giao dịch quỹ nào." />
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Ghi nhận Giao dịch Quỹ</h3>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại giao dịch <span className="text-red-500">*</span></label>
                  <select className="form-input-admin w-full">
                    <option value="in">Thu / Đóng góp (+)</option>
                    <option value="out">Chi / Tiêu dùng (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số tiền (VNĐ) <span className="text-red-500">*</span></label>
                  <input type="number" className="form-input-admin w-full" placeholder="VD: 500000" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Thuộc quỹ <span className="text-red-500">*</span></label>
                <select className="form-input-admin w-full">
                  <option value="1">Quỹ Khuyến học</option>
                  <option value="2">Quỹ Xây dựng</option>
                  <option value="3">Quỹ Chung</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung chi tiết <span className="text-red-500">*</span></label>
                <input type="text" className="form-input-admin w-full" placeholder="Ví dụ: Đóng góp quỹ khuyến học năm 2026..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Người thực hiện / Người đóng góp</label>
                <div className="flex gap-2">
                  <input type="text" className="form-input-admin flex-1" placeholder="Tên hoặc ID thành viên..." />
                  <button className="btn-secondary">Tìm kiếm</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Minh chứng (Hình ảnh/Hoá đơn)</label>
                <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Huỷ</button>
              <button className="btn-primary" onClick={() => { alert('Ghi nhận giao dịch thành công!'); setIsAddModalOpen(false); }}>Lưu giao dịch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundsPage;
