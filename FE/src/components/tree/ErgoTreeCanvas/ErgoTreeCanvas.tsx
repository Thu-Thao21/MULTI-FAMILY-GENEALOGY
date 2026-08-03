import React, { useEffect, useState } from 'react';
import type { ErgoTreeNode } from '../../../types/tree';
import { TreeNodeCard } from '../TreeNodeCard';
import './ErgoTreeCanvas.css';

export interface ErgoTreeCanvasProps {
  nodes: ErgoTreeNode[];
  onCardClick: (e: React.MouseEvent, node: ErgoTreeNode) => void;
  onContextMenu: (e: React.MouseEvent, node: ErgoTreeNode) => void;
  zoomScale: number;
}

export const ErgoTreeCanvas: React.FC<ErgoTreeCanvasProps> = ({
  nodes,
  onCardClick,
  onContextMenu,
  zoomScale,
}) => {
  // Set of explicitly expanded node IDs (root nodes expanded by default)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Automatically expand root nodes by default
    const initialExpanded = new Set<string>();
    nodes.forEach((r) => initialExpanded.add(r.id));
    setExpandedIds(initialExpanded);
  }, [nodes]);

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleNodeClick = (e: React.MouseEvent, node: ErgoTreeNode) => {
    if (node.children && node.children.length > 0) {
      toggleNodeExpansion(node.id);
    }
    onCardClick(e, node);
  };

  const renderTreeRecursive = (node: ErgoTreeNode, index: number = 0, isRoot: boolean = false) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);

    return (
      <div
        key={node.id}
        className={`ergo-tree-node-wrapper ${isRoot ? 'is-root' : 'staggered-appear'}`}
        style={!isRoot ? { animationDelay: `${index * 0.08}s` } : undefined}
      >
        <TreeNodeCard
          node={node}
          onCardClick={handleNodeClick}
          onContextMenu={onContextMenu}
          hasChildren={hasChildren}
          isExpanded={isExpanded}
          onToggleExpand={(_e, targetNode) => toggleNodeExpansion(targetNode.id)}
        />

        {hasChildren && (
          <div className={`ergo-tree-children-row ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}>
            {node.children.map((child, idx) => renderTreeRecursive(child, idx, false))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tree-canvas-viewport">
      <div
        className="tree-canvas-inner"
        style={{ transform: `scale(${zoomScale})` }}
      >
        {nodes.map((rootNode, rIdx) => renderTreeRecursive(rootNode, rIdx, true))}
      </div>
    </div>
  );
};

export default ErgoTreeCanvas;
