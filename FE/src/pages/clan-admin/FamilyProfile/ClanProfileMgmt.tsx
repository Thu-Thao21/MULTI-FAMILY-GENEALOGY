import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import './ClanProfileMgmt.css';

export interface ClanProfileData {
  id: string;
  name: string;
  founder: string;
  origin: string;
  history: string;
  branches: Array<{ id: string; name: string; head: string; total_members: number }>;
}

export const ClanProfileMgmt: React.FC = () => {
  const [profile, setProfile] = useState<ClanProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ClanProfileData>>({});
  const [msg, setMsg] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    // Mocking clan profile for Business Owner
    setTimeout(() => {
      setProfile({
        id: 'clan_001',
        name: 'Dòng họ Nguyễn (Quản lý)',
        founder: 'Nguyễn Bặc',
        origin: 'Gia Viễn, Ninh Bình',
        history: 'Dòng họ Nguyễn tại Gia Viễn có lịch sử lâu đời, truyền thống hiếu học...',
        branches: [
          { id: 'b1', name: 'Chi Trưởng', head: 'Nguyễn Văn A', total_members: 120 },
          { id: 'b2', name: 'Chi Thứ Nhất', head: 'Nguyễn Văn B', total_members: 85 },
        ]
      });
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    if (profile) {
      setEditForm(profile);
      setIsEditModalOpen(true);
    }
  };

  const handleSave = () => {
    if (profile && editForm) {
      setProfile({ ...profile, ...editForm } as ClanProfileData);
      setMsg('Đã cập nhật thông tin dòng họ thành công.');
      setIsEditModalOpen(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (loading) return <div style={{ padding: '24px', color: '#64748b' }}>Đang tải thông tin dòng họ...</div>;
  if (!profile) return <div style={{ padding: '24px', color: '#ef4444' }}>Lỗi khi tải thông tin.</div>;

  return (
    <div className="page-container h-full overflow-auto">
      <PageHeader 
        title="Hồ Sơ Dòng Họ" 
        subtitle="Quản lý thông tin chung, lịch sử, thủy tổ và các chi phái trong dòng họ của bạn."
        actions={<button className="btn-primary" onClick={handleEditClick}>Chỉnh sửa thông tin</button>}
      />

      {msg && <div className="p-4 mb-4 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium">{msg}</div>}

      <div className="family-cards-grid">
        {/* Info Card */}
        <div className="family-card-item">
          <div className="family-card-header">
            <h3>Thông Tin Chung</h3>
            <span className="badge-role-pill acc-role-member">Chính thức</span>
          </div>
          <div className="clan-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Tên dòng họ</div>
                <div style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginTop: '4px' }}>{profile.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Quê quán / Nhà thờ tổ</div>
                <div style={{ color: '#334155', marginTop: '4px' }}>{profile.origin}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Lịch sử hình thành</div>
                <div style={{ color: '#334155', marginTop: '4px', lineHeight: 1.5, background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>{profile.history}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Founder & Branches Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="family-card-item">
            <div className="family-card-header">
              <h3>Thủy Tổ (Đời 1)</h3>
            </div>
            <div className="clan-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', fontSize: '1.5rem', fontWeight: 700 }}>
                  {profile.founder.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{profile.founder}</div>
                  <div style={{ color: '#64748b', marginTop: '4px' }}>Cụ Tổ khai sáng dòng họ</div>
                </div>
              </div>
            </div>
          </div>

          <div className="family-card-item">
            <div className="family-card-header">
              <h3>Các Chi / Nhánh ({profile.branches.length})</h3>
              <button className="btn-icon-action" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>+ Thêm Chi</button>
            </div>
            <div className="clan-card-body" style={{ padding: '0' }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {profile.branches.map((b, idx) => (
                  <li key={b.id} style={{ padding: '16px 24px', borderBottom: idx !== profile.branches.length - 1 ? '1px solid #e2e8f0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{b.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Trưởng chi: {b.head}</div>
                    </div>
                    <div className="badge-role-pill status-badge-locked">{b.total_members} thành viên</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="clan-modal-overlay">
          <div className="clan-modal-box">
            <div className="clan-modal-header">
              <h3>Chỉnh Sửa Hồ Sơ Dòng Họ</h3>
              <button className="clan-modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div className="form-group-admin">
                <label className="form-label-admin">Tên dòng họ</label>
                <input 
                  type="text" 
                  className="form-input-admin" 
                  value={editForm.name || ''} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              <div className="form-group-admin">
                <label className="form-label-admin">Quê quán</label>
                <input 
                  type="text" 
                  className="form-input-admin" 
                  value={editForm.origin || ''} 
                  onChange={e => setEditForm({...editForm, origin: e.target.value})}
                />
              </div>
              <div className="form-group-admin">
                <label className="form-label-admin">Thủy tổ</label>
                <input 
                  type="text" 
                  className="form-input-admin" 
                  value={editForm.founder || ''} 
                  onChange={e => setEditForm({...editForm, founder: e.target.value})}
                />
              </div>
              <div className="form-group-admin">
                <label className="form-label-admin">Lịch sử</label>
                <textarea 
                  className="form-input-admin" 
                  rows={4}
                  value={editForm.history || ''} 
                  onChange={e => setEditForm({...editForm, history: e.target.value})}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <div className="clan-modal-footer">
              <button className="clan-btn-secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
              <button className="clan-btn-primary" onClick={handleSave}>Lưu thông tin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClanProfileMgmt;
