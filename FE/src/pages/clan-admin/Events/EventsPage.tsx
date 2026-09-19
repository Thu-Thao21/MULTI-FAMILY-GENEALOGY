import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  status: 'planning' | 'ongoing' | 'completed';
}

export const EventsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  
  const data: Event[] = [
    { id: '1', title: 'Họp mặt dòng họ thường niên 2026', date: '01/01/2026', location: 'Nhà thờ họ', attendees: 250, status: 'completed' },
    { id: '2', title: 'Lễ khánh thành cổng làng', date: '20/11/2026', location: 'Cổng làng', attendees: 100, status: 'planning' },
  ];

  const columns: Column<Event>[] = [
    { key: 'title', header: 'Tên Sự kiện', render: (item) => <strong className="text-slate-800">{item.title}</strong> },
    { key: 'date', header: 'Thời gian', render: (item) => item.date },
    { key: 'location', header: 'Địa điểm', render: (item) => item.location },
    { key: 'attendees', header: 'Người tham gia', render: (item) => `${item.attendees} người` },
    { key: 'status', header: 'Trạng thái', render: (item) => (
      <span className={`px-2 py-1 text-xs rounded-full ${
        item.status === 'completed' ? 'bg-slate-100 text-slate-600' :
        item.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
      }`}>
        {item.status === 'completed' ? 'Đã kết thúc' : item.status === 'ongoing' ? 'Đang diễn ra' : 'Lên kế hoạch'}
      </span>
    )},
    { key: 'actions', header: 'Thao tác', render: () => (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Sửa</button>
      </div>
    )},
  ];

  const headerActions = (
    <button className="btn-primary">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      Tạo Sự kiện
    </button>
  );

  return (
    <div className="page-container">
      <PageHeader 
        title="Quản lý Sự kiện" 
        subtitle="Tạo và quản lý các sự kiện, cuộc họp họ, lễ hội và ghi nhận người tham gia."
        actions={headerActions}
      />
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tìm kiếm sự kiện..." 
          className="form-input-admin flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input-admin w-48">
          <option value="">Tất cả trạng thái</option>
          <option value="planning">Lên kế hoạch</option>
          <option value="completed">Đã kết thúc</option>
        </select>
      </div>

      <DataTable columns={columns} data={data} keyExtractor={(item) => item.id} emptyMessage="Chưa có sự kiện nào." />
    </div>
  );
};

export default EventsPage;
