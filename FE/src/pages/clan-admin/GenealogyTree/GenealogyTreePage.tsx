import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import './GenealogyTreePage.css';

interface Person {
  id: string;
  name: string;
  gen: number;
  avatarStr: string;
  avatarBg: string;
  isMain?: boolean;
  isDead?: boolean;
  deathText?: string;
  stars?: number;
  hasOtherBranch?: boolean;
  spousesCount?: number;
  borderClass: string;
}

interface FamilyBranch {
  id: string;
  mainPerson: Person;
  spouses: Person[];
  children?: FamilyBranch[];
}

const mockTreeData: FamilyBranch = {
  id: 'f1',
  mainPerson: {
    id: 'p1', name: 'Nguyễn Văn A0', gen: 1, avatarStr: 'A0', avatarBg: 'cbd5e1',
    isMain: true, deathText: '✝ giỗ AL: 09/07', borderClass: 'border-gray'
  },
  spouses: [
    {
      id: 'p2', name: 'Nguyễn Thị A0', gen: 1, avatarStr: 'NA', avatarBg: 'cbd5e1',
      stars: 1, deathText: '✝ giỗ AL: 05/11', borderClass: 'border-gray'
    }
  ],
  children: [
    {
      id: 'f2',
      mainPerson: {
        id: 'p3', name: 'Nguyễn Văn A', gen: 2, avatarStr: 'A', avatarBg: 'fef08a',
        stars: 1, borderClass: 'border-blue'
      },
      spouses: [
        {
          id: 'p4', name: 'Trần Thị A', gen: 2, avatarStr: 'TA', avatarBg: 'a7f3d0',
          hasOtherBranch: true, borderClass: 'border-green'
        }
      ],
      children: [
        {
          id: 'f3',
          mainPerson: {
            id: 'p5', name: 'Nguyễn Văn A1', gen: 3, avatarStr: 'A1', avatarBg: 'fef08a',
            stars: 1, spousesCount: 1, borderClass: 'border-blue'
          },
          spouses: [
            {
              id: 'p6', name: 'Phạm Thị C', gen: 3, avatarStr: 'PC', avatarBg: 'a7f3d0',
              hasOtherBranch: true, stars: 1, borderClass: 'border-green'
            }
          ],
          children: [
            {
              id: 'f4',
              mainPerson: {
                id: 'p7', name: 'Nguyễn Thị A3', gen: 4, avatarStr: 'A3', avatarBg: 'fca5a5',
                stars: 1, borderClass: 'border-blue'
              },
              spouses: [
                {
                  id: 'p8', name: 'Đặng Văn X', gen: 4, avatarStr: 'DX', avatarBg: 'bfdbfe',
                  stars: 1, borderClass: 'border-blue'
                }
              ]
            }
          ]
        },
        {
          id: 'f5',
          mainPerson: {
            id: 'p9', name: 'Nguyễn Văn A2', gen: 3, avatarStr: 'A2', avatarBg: 'cbd5e1',
            stars: 1, isDead: true, borderClass: 'border-orange'
          },
          spouses: [
            {
              id: 'p10', name: 'Lương Thị Y', gen: 3, avatarStr: 'LY', avatarBg: 'fed7aa',
              stars: 1, borderClass: 'border-blue'
            },
            {
              id: 'p11', name: 'Lâm Thị Z', gen: 3, avatarStr: 'LZ', avatarBg: 'e9d5ff',
              stars: 2, borderClass: 'border-blue'
            }
          ]
        }
      ]
    }
  ]
};

export const GenealogyTreePage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<Person | null>(null);

  const headerActions = (
    <button className="btn-primary flex items-center gap-2">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
      Xuất sơ đồ (Export PDF)
    </button>
  );

  const PersonCard = ({ person }: { person: Person }) => {
    return (
      <div className={`tree-node ${person.borderClass}`} onClick={() => setSelectedNode(person)}>
        {person.hasOtherBranch && <div className="badge-top-left">Có nhánh khác</div>}
        {person.stars && (
          <div className={`badge-top-right ${person.stars > 1 ? 'double' : ''}`}>
            {'★'.repeat(person.stars)}
          </div>
        )}
        <div className="node-content">
          <img 
            src={`https://ui-avatars.com/api/?name=${person.avatarStr}&background=${person.avatarBg}`} 
            alt="" 
            className="node-avatar" 
            style={{ borderRadius: person.isMain ? '8px' : '50%' }}
          />
          <div className="node-info">
            <div className="node-name">{person.name}</div>
            <div className="node-meta">
              <span>Đời thứ: {person.gen} {person.stars ? '★' : ''}</span>
              {person.deathText && <span>{person.deathText}</span>}
              {person.isDead && <span className="text-red-500 font-medium">✝ Đã mất</span>}
              {person.spousesCount && <span className="bg-purple-100 text-purple-700 px-1 rounded text-[0.65rem] inline-block mt-1 w-fit">💜 {person.spousesCount} Bạn đời</span>}
            </div>
          </div>
        </div>
        <div className="node-footer">
          <span className="btn-view-cv">Xem CV</span>
          <span className="btn-more">⋮</span>
        </div>
      </div>
    );
  };

  const TreeNode = ({ branch }: { branch: FamilyBranch }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = branch.children && branch.children.length > 0;

    return (
      <li className="tree-li">
        <div className="flex flex-col items-center relative">
          <div className="tree-parent-group">
            <PersonCard person={branch.mainPerson} />
            {branch.spouses.map(spouse => (
              <PersonCard key={spouse.id} person={spouse} />
            ))}
          </div>
          
          {hasChildren && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition-colors z-10 border-2 border-white shadow-sm"
              title={isExpanded ? "Thu gọn nhánh" : "Mở rộng nhánh"}
            >
              {isExpanded ? '−' : '＋'}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="tree-ul animate-fade-in" style={{ marginTop: '-12px' }}>
            <div className="gen-label">v.{branch.mainPerson.gen}</div>
            <ul>
              {branch.children!.map(child => (
                <TreeNode key={child.id} branch={child} />
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Cây Gia phả (Genealogy Tree Canvas)" 
        subtitle="Sơ đồ gia phả với khả năng mở rộng/thu gọn các nhánh, focus vào từng cá nhân."
        actions={headerActions}
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden relative">
        {/* Floating Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
          <div className="flex gap-2 pointer-events-auto bg-white/90 backdrop-blur shadow-sm p-1.5 rounded-lg border border-slate-200">
            <button className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 rounded-md">
              Cây ngang (Horizontal)
            </button>
            <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md transition">
              Cây dọc (Vertical)
            </button>
          </div>
          
          <div className="flex gap-2 pointer-events-auto bg-white/90 backdrop-blur shadow-sm p-1.5 rounded-lg border border-slate-200 flex-col">
            <button className="w-10 h-10 bg-slate-50 text-slate-700 rounded hover:bg-slate-100 flex items-center justify-center font-bold text-lg" title="Zoom in">+</button>
            <button className="w-10 h-10 bg-slate-50 text-slate-700 rounded hover:bg-slate-100 flex items-center justify-center font-bold text-lg" title="Zoom out">-</button>
            <div className="h-px bg-slate-200 w-full my-1"></div>
            <button className="w-10 h-10 bg-slate-50 text-slate-700 rounded hover:bg-slate-100 flex items-center justify-center font-bold text-lg" title="Reset/Center">⌂</button>
          </div>
        </div>

        {/* Dynamic Interactive Tree */}
        <div className="genealogy-tree-wrapper">
          <div className="tree-container">
            <div className="tree-ul">
              <ul>
                <TreeNode branch={mockTreeData} />
              </ul>
            </div>
          </div>
        </div>

        {/* Focus Node Sidebar (Right Drawer) */}
        {selectedNode && (
          <>
            <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-10" onClick={() => setSelectedNode(null)} />
            <div className="absolute top-0 right-0 bottom-0 w-[340px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-20 flex flex-col animate-slide-in-right border-l border-slate-200">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-lg">Thông tin Node</h3>
                <button className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors" onClick={() => setSelectedNode(null)}>
                  ✕
                </button>
              </div>
              
              <div className="p-6 flex-1 overflow-auto">
                <div className="text-center mb-8">
                  <div className="w-28 h-28 bg-slate-100 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                    <img src={`https://ui-avatars.com/api/?name=${selectedNode.avatarStr}&size=112&background=${selectedNode.avatarBg}&color=333`} alt="Avatar" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedNode.name}</h2>
                  <span className="text-sm text-blue-700 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full font-medium inline-block">Đời {selectedNode.gen}</span>
                </div>

                <div className="space-y-4 mb-10 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                    <span className="text-slate-500 font-medium">Tình trạng</span>
                    <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${selectedNode.isDead ? 'bg-slate-200 text-slate-700' : 'bg-green-100 text-green-700'}`}>
                      {selectedNode.isDead ? 'Đã mất' : 'Còn sống'}
                    </span>
                  </div>
                  {selectedNode.deathText && (
                    <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                      <span className="text-slate-500 font-medium">Ngày giỗ</span>
                      <strong className="text-slate-800 bg-slate-200 px-2.5 py-1 rounded-md text-xs">{selectedNode.deathText.replace('✝ giỗ AL: ', '')}</strong>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Vợ / Chồng</span>
                    <strong className="text-slate-800">{selectedNode.spousesCount || 1}</strong>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    className="w-full btn-primary justify-center py-3 shadow-md shadow-blue-500/20" 
                    onClick={() => {
                      alert(`Đã di chuyển camera đến node: ${selectedNode.name}`);
                      setSelectedNode(null);
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    Focus (Lấy làm trung tâm)
                  </button>
                  <button 
                    className="w-full btn-secondary justify-center py-3" 
                    onClick={() => {
                      // Navigate to persons page with a focus param
                      window.location.href = '/clan-admin/persons';
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                    Xem Chi tiết Hồ sơ
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GenealogyTreePage;
