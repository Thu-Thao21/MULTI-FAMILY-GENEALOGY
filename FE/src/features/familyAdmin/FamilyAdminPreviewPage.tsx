import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FamilyAdminModule, type FamilyAdminView } from './FamilyAdminModule';

const tabs: Array<[FamilyAdminView, string]> = [
  ['overview', 'Tổng quan'], ['members', 'Person'], ['relations', 'Quan hệ'],
  ['branches', 'Chi/Nhánh'], ['tree', 'Cây'], ['search', 'Tra cứu'],
  ['approvals', 'Phê duyệt'], ['accounts', 'Tài khoản'], ['links', 'Liên họ'],
  ['exchange', 'Nhập xuất'], ['audit', 'Nhật ký'],
];

export const FamilyAdminPreviewPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const requested = params.get('view');
  const active = tabs.some(([id]) => id === requested) ? requested as FamilyAdminView : 'overview';
  const navigate = (view: FamilyAdminView) => setParams(view === 'overview' ? {} : { view });

  return <div className="fa-preview-page">
    <nav className="fa-preview-nav" aria-label="Xem trước Family Admin">
      <Link to="/public">Gia Phả Việt</Link>
      <div>{tabs.map(([id, label]) => <button type="button" key={id} className={active === id ? 'active' : ''} onClick={() => navigate(id)}>{label}</button>)}</div>
    </nav>
    <FamilyAdminModule view={active} onNavigate={navigate} />
  </div>;
};

export default FamilyAdminPreviewPage;
