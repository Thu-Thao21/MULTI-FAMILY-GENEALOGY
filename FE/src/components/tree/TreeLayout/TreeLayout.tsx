import React, { useEffect, useState } from 'react';
import { fetchFamilies } from '../../../services/member.service';
import { buildErgoTreeFromDB } from '../../../services/tree.service';
import type { Family, Member } from '../../../types/member';
import type { ErgoTreeNode, TreeContextMenuState, TreeViewMode } from '../../../types/tree';
import { ErgoTreeCanvas } from '../ErgoTreeCanvas';
import { TreeContextMenu } from '../TreeContextMenu';
import { NotificationModal } from '../../common/NotificationModal';
import '../Tree.css';
import './TreeLayout.css';

export interface TreeLayoutProps {
  initialMode?: TreeViewMode;
  onSelectMemberProfile?: (memberId: string) => void;
}

export const TreeLayout: React.FC<TreeLayoutProps> = ({
  initialMode = 'vertical',
  onSelectMemberProfile,
}) => {
  const [viewMode, setViewMode] = useState<TreeViewMode>(initialMode);
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [treeNodes, setTreeNodes] = useState<ErgoTreeNode[]>([]);
  const [focusMemberId, setFocusMemberId] = useState<string | undefined>(undefined);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<TreeContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    member: null,
  });

  // Toast state for action feedback
  const [isToastOpen, setIsToastOpen] = useState(false);

  useEffect(() => {
    fetchFamilies().then((fams) => {
      setFamilies(fams);
      if (fams.length > 0) {
        setSelectedFamilyId(fams[0].id);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    buildErgoTreeFromDB(selectedFamilyId, focusMemberId).then(({ rootNodes, allMembers: mems }) => {
      setTreeNodes(rootNodes);
      setAllMembers(mems);
      setLoading(false);
    });
  }, [selectedFamilyId, focusMemberId]);

  const handleCardClick = (e: React.MouseEvent, node: ErgoTreeNode) => {
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      member: node,
    });
  };

  const handleContextMenu = (e: React.MouseEvent, node: ErgoTreeNode) => {
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      member: node,
    });
  };

  const handleSelectFocus = (node: ErgoTreeNode) => {
    setFocusMemberId(node.id);
    setViewMode('focus');
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  };

  const handleViewBio = (node: ErgoTreeNode) => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
    if (onSelectMemberProfile) {
      onSelectMemberProfile(node.id);
    }
  };

  const handleActionToast = () => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
    setIsToastOpen(true);
  };

  return (
    <div className="tree-page-layout">
      {/* Top Controls Toolbar */}
      <div className="tree-toolbar-card">
        <div>
          <h2 className="tree-toolbar-title">
            🌳 Cây Gia Phả Trực Hệ (Mô hình ERGO-Centric)
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            {viewMode === 'focus'
              ? '🎯 Đang hiển thị chế độ Tập trung (Focus View) theo người làm trung tâm.'
              : 'Hiển thị sơ đồ trực hệ đa thế hệ từ dữ liệu PostgreSQL.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Mode Selector */}
          <div className="tree-mode-group">
            <button
              className={`tree-mode-btn ${viewMode === 'vertical' ? 'active' : ''}`}
              onClick={() => setViewMode('vertical')}
            >
              📊 Sơ đồ đứng
            </button>
            <button
              className={`tree-mode-btn ${viewMode === 'horizontal' ? 'active' : ''}`}
              onClick={() => setViewMode('horizontal')}
            >
              ↔ Sơ đồ ngang
            </button>
            <button
              className={`tree-mode-btn ${viewMode === 'focus' ? 'active' : ''}`}
              onClick={() => setViewMode('focus')}
            >
              🎯 Tập trung (Focus)
            </button>
          </div>

          {/* Family Dropdown */}
          <select
            className="tree-control-select"
            value={selectedFamilyId}
            onChange={(e) => setSelectedFamilyId(e.target.value)}
          >
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.memberCount} thành viên)
              </option>
            ))}
          </select>

          {/* Focus Member Dropdown */}
          <select
            className="tree-control-select"
            value={focusMemberId || ''}
            onChange={(e) => {
              setFocusMemberId(e.target.value || undefined);
              if (e.target.value) setViewMode('focus');
            }}
          >
            <option value="">-- Chọn người làm trung tâm --</option>
            {allMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName} (Đời {m.generation})
              </option>
            ))}
          </select>

          {/* Zoom Buttons */}
          <button className="tree-control-btn" onClick={() => setZoomScale((z) => Math.min(1.6, z + 0.15))}>
            🔍 +
          </button>
          <button className="tree-control-btn" onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.15))}>
            🔍 -
          </button>
          <button className="tree-control-btn" onClick={() => setZoomScale(1)}>
            ↺ 100%
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
          🔄 Đang tính toán sơ đồ trực hệ ERGO từ cơ sở dữ liệu...
        </div>
      ) : treeNodes.length === 0 ? (
        <div style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}>
          📂 Chưa có dữ liệu cây gia phả phù hợp.
        </div>
      ) : (
        <ErgoTreeCanvas
          nodes={treeNodes}
          onCardClick={handleCardClick}
          onContextMenu={handleContextMenu}
          zoomScale={zoomScale}
        />
      )}

      {/* Popup Context Menu */}
      <TreeContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        node={contextMenu.member as ErgoTreeNode}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        onSelectFocus={handleSelectFocus}
        onViewBio={handleViewBio}
        onActionToast={handleActionToast}
      />

      {/* Toast */}
      <NotificationModal
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        icon="🌳"
      />
    </div>
  );
};

export default TreeLayout;
