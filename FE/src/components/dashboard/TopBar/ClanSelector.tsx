import React, { useState, useRef, useEffect } from 'react';
import { useClanContext } from '../../../context/ClanContext';
import './ClanSelector.css';

interface ClanSelectorProps {
  isAdmin?: boolean;
  onNavigateTab?: (tabId: string) => void;
}

function getRoleLabel(roles: string[] = []): string {
  if (roles.includes('BUSINESS_OWNER')) return 'Trưởng tộc';
  if (roles.includes('FAMILY_ADMIN')) return 'Family Admin';
  return 'Thành viên';
}

function getRoleBadgeClass(roleLabel: string): string {
  if (roleLabel === 'Trưởng tộc') return 'role-head';
  if (roleLabel === 'Family Admin') return 'role-admin';
  return 'role-member';
}

export const ClanSelector: React.FC<ClanSelectorProps> = ({ isAdmin = false, onNavigateTab }) => {
  const {
    activeClanId,
    activeClanName,
    activeMembership,
    activeClanRoleLabel,
    availableClans,
    isClanLoading,
    selectClan,
  } = useClanContext();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Đóng dropdown khi click outside hoặc ấn Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // System Admin quản lý toàn hệ thống, không hiển thị bộ chọn cây
  if (isAdmin) {
    return null;
  }

  // Loading state
  if (isClanLoading) {
    return (
      <div className="clan-selector-container">
        <div className="clan-selector-loading">
          <span className="clan-selector-spinner" />
          <span>Đang tải thông tin dòng họ...</span>
        </div>
      </div>
    );
  }

  // Không có cây hợp lệ
  if (availableClans.length === 0) {
    return (
      <div className="clan-selector-container">
        <button
          type="button"
          className="clan-selector-trigger empty"
          onClick={() => {
            if (onNavigateTab) onNavigateTab('my-clans');
          }}
          title="Nhấn để tham gia dòng họ"
        >
          <div className="clan-selector-icon-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="clan-name-text">Chưa tham gia dòng họ</span>
          <span className="clan-role-pill role-action">+ Gia nhập</span>
        </button>
      </div>
    );
  }

  // Luôn hiển thị trigger có thể ấn mở Dropdown để xem và đổi dòng họ
  return (
    <div className="clan-selector-container" ref={dropdownRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`clan-selector-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Chọn dòng họ đang thao tác"
        title={`${activeClanName || 'Chọn dòng họ'} — ${activeClanRoleLabel || 'Thành viên'} (Nhấn để chuyển dòng họ)`}
        data-testid="clan-selector-trigger"
      >
        <div className="clan-selector-trigger-inner">
          <div className="clan-selector-icon-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="clan-selector-trigger-labels">
            <span className="clan-name-text">{activeClanName || 'Chọn dòng họ'}</span>
            <span className={`clan-role-pill ${getRoleBadgeClass(activeClanRoleLabel || 'Thành viên')}`}>
              {activeClanRoleLabel || 'Thành viên'}
            </span>
          </div>
        </div>
        <span className={`clan-selector-arrow ${isOpen ? 'open' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="clan-selector-dropdown" role="listbox" data-testid="clan-selector-dropdown">
          <div className="clan-selector-dropdown-header">
            <span>DÒNG HỌ THAM GIA ({availableClans.length})</span>
          </div>
          <div className="clan-selector-list">
            {availableClans.map((clan) => {
              const isSelected = String(clan.clan_id).toLowerCase() === String(activeClanId || '').toLowerCase();
              const roleText = getRoleLabel(clan.roles);

              return (
                <button
                  key={clan.clan_id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`clan-selector-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    selectClan(clan.clan_id);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  data-testid={`clan-item-${clan.clan_id}`}
                >
                  <div className="clan-item-content">
                    <div className="clan-item-header">
                      <span className="clan-item-name">{clan.clan_name}</span>
                      <span className={`clan-role-pill ${getRoleBadgeClass(roleText)}`}>{roleText}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="clan-item-checkmark" title="Đang chọn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="clan-selector-dropdown-footer">
            <button
              type="button"
              className="clan-selector-action-btn"
              onClick={() => {
                setIsOpen(false);
                if (onNavigateTab) {
                  onNavigateTab('my-clans');
                }
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span>+ Gia nhập thêm dòng họ khác</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
