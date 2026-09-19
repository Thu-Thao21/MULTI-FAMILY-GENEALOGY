import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface Account {
  id: string;
  username: string;
  personName: string;
  role: 'member' | 'family_admin';
  status: 'active' | 'locked' | 'pending';
  lastLogin: string;
}

export const ClanMembersMgmt: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const data: Account[] = [
    { id: '1', username: 'khoa.nguyen', personName: 'Nguyễn Văn Khoa', role: 'member', status: 'active', lastLogin: '11/09/2026 09:30' },
    { id: '2', username: 'hoa.nguyen', personName: 'Nguyễn Thị Hoa', role: 'family_admin', status: 'active', lastLogin: '10/09/2026 14:15' },
    { id: '3', username: 'nam.nguyen', personName: 'Nguyễn Văn Nam', role: 'member', status: 'locked', lastLogin: '01/01/2026 00:00' },
  ];

  const columns: Column<Account>[] = [
    { key: 'username', header: 'Tên đăng nhập', render: (item) => <strong className="text-slate-800">{item.username}</strong> },
    { key: 'personName', header: 'Nhân khẩu liên kết', render: (item) => <span className="text-blue-600 hover:underline cursor-pointer">{item.personName}</span> },
    { key: 'role', header: 'Vai trò', render: (item) => (
      <span className={`px-2 py-1 text-xs rounded font-bold ${item.role === 'family_admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
        {item.role === 'family_admin' ? 'Family Admin' : 'Member'}
      </span>
    )},
    { key: 'status', header: 'Trạng thái', render: (item) => (
      <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-700' : item.status === 'locked' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
        {item.status === 'active' ? 'Hoạt động' : item.status === 'locked' ? 'Đã khóa' : 'Chờ xác nhận'}
      </span>
    )},
    { key: 'lastLogin', header: 'Đăng nhập cuối', render: (item) => item.lastLogin },
    { key: 'actions', header: 'Thao tác', render: (item) => (
      <button 
        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded"
        onClick={() => setSelectedAccount(item)}
      >
        Quản lý
      </button>
    )},
  ];

  const handleAction = (action: string) => {
    const isConfirm = window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`);
    if (isConfirm) {
      alert(`Đã thực hiện: ${action}`);
      setSelectedAccount(null);
    }
  };

  return (
    <div className="page-container h-full flex flex-col relative">
      <PageHeader 
        title="Tài khoản thành viên (Account)" 
        subtitle="Quản lý tài khoản đăng nhập của các thành viên. Một tài khoản có thể liên kết với một nhân khẩu."
      />
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tìm kiếm username, tên..." 
          className="form-input-admin flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input-admin w-48">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="locked">Đã khóa</option>
        </select>
        <select className="form-input-admin w-48">
          <option value="">Tất cả vai trò</option>
          <option value="member">Member</option>
          <option value="family_admin">Family Admin</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={data} 
          keyExtractor={(item) => item.id} 
          emptyMessage="Chưa có tài khoản nào được cấp."
        />
      </div>

      {/* Centered Modal for Account Detail */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedAccount(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-zoom-in overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center text-blue-600">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">@{selectedAccount.username}</h2>
                  <p className="text-slate-500">Liên kết: <strong>{selectedAccount.personName}</strong></p>
                </div>
              </div>
              <button 
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition"
                onClick={() => setSelectedAccount(null)}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-slate-50">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
                <h3 className="font-bold text-slate-800 mb-4">Thông tin Tài khoản</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trạng thái</span>
                    <span className={`font-bold ${selectedAccount.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedAccount.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vai trò</span>
                    <span className="font-bold text-slate-800">{selectedAccount.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Đăng nhập lần cuối</span>
                    <span className="font-bold text-slate-800">{selectedAccount.lastLogin}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 mb-2">Thao tác Quản trị</h3>
                
                {selectedAccount.status === 'active' ? (
                  <button 
                    className="w-full py-3 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 transition"
                    onClick={() => handleAction('Khóa tài khoản')}
                  >
                    Khóa tài khoản (Lock)
                  </button>
                ) : (
                  <button 
                    className="w-full py-3 bg-white border border-green-200 text-green-600 font-bold rounded-lg hover:bg-green-50 transition"
                    onClick={() => handleAction('Mở khóa tài khoản')}
                  >
                    Mở khóa (Unlock)
                  </button>
                )}

                <button 
                  className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition"
                  onClick={() => handleAction('Cấp lại mật khẩu')}
                >
                  Cấp lại mật khẩu (Reset Password)
                </button>

                <button 
                  className="w-full py-3 bg-white border border-purple-200 text-purple-700 font-bold rounded-lg hover:bg-purple-50 transition"
                  onClick={() => handleAction('Nâng cấp thành Family Admin')}
                >
                  Nâng quyền Family Admin
                </button>

                <button 
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition mt-6"
                  onClick={() => handleAction('Thu hồi tài khoản')}
                >
                  Thu hồi (Revoke Access)
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClanMembersMgmt;
