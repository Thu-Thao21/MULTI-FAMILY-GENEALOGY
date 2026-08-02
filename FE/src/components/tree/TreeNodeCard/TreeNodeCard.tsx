import React from 'react';
import type { ErgoTreeNode } from '../../../types/tree';
import './TreeNodeCard.css';

export interface TreeNodeCardProps {
  node: ErgoTreeNode;
  onCardClick: (e: React.MouseEvent, node: ErgoTreeNode) => void;
  onContextMenu: (e: React.MouseEvent, node: ErgoTreeNode) => void;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (e: React.MouseEvent, node: ErgoTreeNode) => void;
}

export const TreeNodeCard: React.FC<TreeNodeCardProps> = ({
  node,
  onCardClick,
  onContextMenu,
  hasChildren = false,
  isExpanded = true,
  onToggleExpand,
}) => {
  const primarySpouse = node.spouses && node.spouses.length > 0 ? node.spouses[0] : null;

  return (
    <div
      className={`tree-couple-wrapper ${node.isFocusPerson ? 'is-focus' : ''}`}
      onClick={(e) => onCardClick(e, node)}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, node);
      }}
    >
      {/* Primary Person */}
      <div className="tree-person-card">
        <div className={`tree-person-avatar-wrap ${node.gender === 'male' ? 'male-border' : 'female-border'}`}>
          {node.avatarUrl ? (
            <img src={node.avatarUrl} alt={node.fullName} className="tree-person-avatar-img" />
          ) : (
            <div className="tree-person-avatar-placeholder">
              {node.gender === 'male' ? '👨' : '👩'}
            </div>
          )}
        </div>
        <div className="tree-person-year">{node.birthDate ? node.birthDate.substring(0, 4) : '19XX'}</div>
        <div className="tree-person-name">{node.fullName}</div>
        <div className={`tree-person-gender-bar ${node.gender}`} />
      </div>

      {/* Spouse if exists */}
      {primarySpouse && (
        <>
          <div className="tree-spouse-link-line">
            <span className="tree-spouse-ring-badge">💍</span>
          </div>
          <div className="tree-person-card">
            <div className={`tree-person-avatar-wrap ${primarySpouse.gender === 'male' ? 'male-border' : 'female-border'}`}>
              {primarySpouse.avatarUrl ? (
                <img src={primarySpouse.avatarUrl} alt={primarySpouse.fullName} className="tree-person-avatar-img" />
              ) : (
                <div className="tree-person-avatar-placeholder">
                  {primarySpouse.gender === 'male' ? '👨' : '👩'}
                </div>
              )}
            </div>
            <div className="tree-person-year">{primarySpouse.birthDate ? primarySpouse.birthDate.substring(0, 4) : '19XX'}</div>
            <div className="tree-person-name">{primarySpouse.fullName}</div>
            <div className={`tree-person-gender-bar ${primarySpouse.gender}`} />
          </div>
        </>
      )}

      {/* Toggle Expand/Collapse Badge Button */}
      {hasChildren && onToggleExpand && (
        <button
          className={`tree-node-toggle-btn ${!isExpanded ? 'collapsed' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(e, node);
          }}
          title={isExpanded ? 'Thu gọn nhánh con' : 'Mở rộng nhánh con'}
        >
          {isExpanded ? `▲ ${node.children.length}` : `▼ ${node.children.length}`}
        </button>
      )}
    </div>
  );
};

export default TreeNodeCard;
