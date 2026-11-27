import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../config/routes';
import circularEmblemLogo from '../../../assets/logo/logo_circular_emblem.png';
import { ClanSelector } from './ClanSelector';
import { useClanContext } from '../../../context/ClanContext';
import { fetchMembers } from '../../../services/member.service';
import type { Member } from '../../../types/member';
import {
  fetchUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../../services/notification.service';
import './TopBar.css';

export interface TopBarProps {
  userName: string;
  userRole?: string;
  onLogout: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onNavigateTab?: (tabId: string) => void;
  onSelectMember?: (memberId: string) => void;
}

export interface NotificationItem {
  id: number | string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type?: string;
  fullContent?: string;
  targetTab?: string;
}

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  join_request: 'Yêu cầu gia nhập',
  clan_join_request: 'Yêu cầu gia nhập',
  join_request_result: 'Kết quả gia nhập',
  join_approved: 'Đã duyệt gia nhập',
  join_rejected: 'Từ chối gia nhập',
  proposal: 'Đề xuất chỉnh sửa',
  edit_proposal: 'Đề xuất chỉnh sửa',
  change_proposal: 'Đề xuất chỉnh sửa',
  approval: 'Phê duyệt hồ sơ',
  link_request: 'Liên kết dòng họ',
  inter_clan_link: 'Liên kết dòng họ',
  memorial: 'Lễ giỗ & Tưởng niệm',
  event: 'Sự kiện dòng họ',
  fund: 'Quỹ & Đóng góp',
  security: 'Bảo mật tài khoản',
  ai: 'Trợ lý AI & Gợi ý',
  system: 'Thông báo hệ thống',
};

export const getNotificationTypeConfig = (type?: string) => {
  const raw = (type || '').trim();
  const t = raw.toLowerCase();
  const mappedLabel = NOTIFICATION_TYPE_LABELS[t] || raw;

  if (t.includes('giỗ') || t.includes('tưởng niệm') || t === 'memorial') {
    return {
      label: mappedLabel || 'Lễ giỗ & Tưởng niệm',
      color: '#d97706',
      badgeBg: '#fef3c7',
      badgeBorder: '#fde68a',
      iconBg: '#fffbeb',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    };
  }
  if (
    t.includes('duyệt') ||
    t.includes('thay đổi') ||
    t.includes('hồ sơ') ||
    t.includes('join_request') ||
    t.includes('proposal') ||
    t === 'approval'
  ) {
    return {
      label: mappedLabel || 'Phê duyệt hồ sơ',
      color: '#2563eb',
      badgeBg: '#eff6ff',
      badgeBorder: '#bfdbfe',
      iconBg: '#eff6ff',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    };
  }
  return {
    label: mappedLabel || 'Sự kiện & Hoạt động',
    color: '#7c3aed',
    badgeBg: '#f5f3ff',
    badgeBorder: '#ddd6fe',
    iconBg: '#faf5ff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  };
};

export const renderNotificationContent = (content?: string) => {
  if (!content) return null;
  const paragraphs = content.split('\n\n');
  return (
    <div className="topbar-notif-content-flow">
      {paragraphs.map((para, idx) => {
        const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);

        // Khối nổi bật thông tin thời gian & địa điểm
        const isHighlightBlock = lines.some((l) => l.startsWith('Thời gian:') || l.startsWith('Địa điểm:'));
        if (isHighlightBlock) {
          return (
            <div key={idx} className="topbar-notif-highlight-card">
              {lines.map((line, lIdx) => (
                <div key={lIdx} className="topbar-notif-highlight-row">
                  <span className="topbar-notif-highlight-text">{line}</span>
                </div>
              ))}
            </div>
          );
        }

        // Khối danh sách các mục có dấu gạch đầu dòng / bullet
        const isListBlock = lines.some((l) => l.startsWith('•'));
        if (isListBlock) {
          return (
            <div key={idx} className="topbar-notif-list-card">
              {lines.map((line, lIdx) => {
                if (line.endsWith(':')) {
                  return (
                    <div key={lIdx} className="topbar-notif-list-header">
                      {line}
                    </div>
                  );
                }
                if (line.startsWith('•')) {
                  return (
                    <div key={lIdx} className="topbar-notif-list-item">
                      <span className="topbar-notif-list-bullet" />
                      <span className="topbar-notif-list-text">{line.replace(/^•\s*/, '')}</span>
                    </div>
                  );
                }
                return (
                  <div key={lIdx} className="topbar-notif-list-text-regular">
                    {line}
                  </div>
                );
              })}
            </div>
          );
        }

        return (
          <p key={idx} className="topbar-notif-paragraph">
            {para}
          </p>
        );
      })}
    </div>
  );
};

export const formatNotifText = (text?: string): string => {
  if (!text) return '';
  return text.replace(/PATERNAL/gi, 'Bên nội').replace(/MATERNAL/gi, 'Bên ngoại');
};

export const resolveNotificationTargetTab = (it: any, role?: string): string => {
  const cat = (it.category || it.type || '').toLowerCase();
  const title = (it.title || '').toLowerCase();
  const content = (it.content || '').toLowerCase();
  const isAdmin = (role || '').toLowerCase() === 'admin';

  // 1. Phê duyệt kết quả gia nhập trả về cho thành viên
  const isJoinResult =
    cat === 'join_request_result' ||
    title.includes('kết quả gia nhập') ||
    title.includes('chấp thuận') ||
    title.includes('được phê duyệt') ||
    content.includes('đã được ban quản trị phê duyệt') ||
    content.includes('bị từ chối') ||
    content.includes('yêu cầu bạn bổ sung thông tin');

  if (isJoinResult) {
    return 'my-clans';
  }

  // 2. Yêu cầu xin gia nhập dòng họ mới -> Đi thẳng đến trang duyệt thành viên
  const isJoinRequest =
    cat === 'join_request' ||
    cat === 'clan_join_request' ||
    cat.includes('join') ||
    title.includes('gia nhập') ||
    content.includes('yêu cầu gia nhập') ||
    content.includes('hồ sơ gia nhập');

  if (isJoinRequest) {
    return isAdmin ? 'admin-approval' : 'family-approvals';
  }

  // 3. Đề xuất quan hệ hoặc thông tin gia tộc
  const isProposal =
    cat === 'proposal' ||
    cat === 'location_proposal' ||
    cat.includes('proposal') ||
    title.includes('đề xuất') ||
    content.includes('đề xuất');

  if (isProposal) {
    const isRegularMember = !isAdmin && (role === 'Thành viên' || role === 'Member');
    return isRegularMember ? 'my-proposals' : (isAdmin ? 'admin-approval' : 'family-approvals');
  }

  // 4. Sự kiện & hoạt động
  if (cat === 'event' || title.includes('sự kiện')) {
    return 'events';
  }

  // 5. Ngày giỗ & tưởng niệm
  if (cat === 'memorial' || title.includes('giỗ') || title.includes('tưởng niệm')) {
    return 'anniversaries';
  }

  // 6. Quỹ & tài chính
  if (cat === 'fund' || title.includes('quỹ') || title.includes('đóng góp')) {
    return 'funds';
  }

  // 7. Cây gia phả
  if (cat === 'tree' || title.includes('cây gia phả') || title.includes('phả hệ')) {
    return 'tree';
  }

  // 8. Thành viên
  if (cat === 'member' || title.includes('thành viên mới')) {
    return 'member-list';
  }

  // 9. Bất kỳ thông báo nào liên quan đến xét duyệt
  if (title.includes('xét duyệt') || content.includes('xét duyệt') || title.includes('phê duyệt')) {
    return isAdmin ? 'admin-approval' : 'family-approvals';
  }

  return 'notifications';
};

export const TopBar: React.FC<TopBarProps> = ({
  userName,
  userRole = 'Thành viên',
  onLogout,
  isSidebarCollapsed,
  onToggleSidebar,
  onNavigateTab,
  onSelectMember,
}) => {
  const navigate = useNavigate();
  const { activeClanId } = useClanContext();
  const isAdmin = (userRole || '').toLowerCase() === 'admin';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLFormElement>(null);

  // Lắng nghe sự kiện Escape và Click Outside để tự động đóng dropdown menu & modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowProfileMenu(false);
        setShowNotifications(false);
        setSelectedNotification(null);
        setShowSearchDropdown(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    if (showProfileMenu || showNotifications || selectedNotification || showSearchDropdown) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, showNotifications, selectedNotification, showSearchDropdown]);

  // Tìm kiếm thành viên trực tiếp khi gõ trên TopBar
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const normalizeText = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsSearchingMembers(true);
      try {
        const res = await fetchMembers({ familyId: activeClanId || undefined, limit: 1000 });
        if (cancelled) return;
        const normQ = normalizeText(q);
        const matches = (res.items || [])
          .filter((m) => {
            const hay = normalizeText(`${m.fullName || ''} ${m.otherName || ''} ${m.branch || ''} đời ${m.generation || ''}`);
            return hay.includes(normQ);
          })
          .slice(0, 8);
        setSearchResults(matches);
        setShowSearchDropdown(true);
      } catch {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setIsSearchingMembers(false);
      }
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, activeClanId]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Tải thông báo thực tế từ máy chủ
  const loadNotifications = useCallback(() => {
    fetchUserNotifications().then((items) => {
      if (items && items.length > 0) {
        setNotifications(
          items.map((it: any, index: number) => ({
            id: it.id || index + 1,
            title: formatNotifText(it.title),
            desc: formatNotifText(it.content),
            time: it.createdAt,
            unread: !it.read,
            type: it.category || 'Thông báo dòng họ',
            fullContent: formatNotifText(it.content),
            targetTab: resolveNotificationTargetTab(it, userRole),
          }))
        );
      } else {
        setNotifications([]);
      }
    }).catch((err) => console.error('Lỗi nạp thông báo TopBar:', err));
  }, [userRole]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    if (showNotifications) {
      loadNotifications();
    }
  }, [showNotifications, loadNotifications]);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const roleClass = userRole === 'Admin' ? 'admin' : 'member';

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    void markAllNotificationsRead();
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // 1. Tự động đánh dấu đã đọc thông báo được bấm
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    if (item.id) {
      void markNotificationRead(String(item.id));
    }
    // 2. Mở modal hiển thị chi tiết thông báo
    setSelectedNotification({ ...item, unread: false });
    // 3. Đóng dropdown thông báo
    setShowNotifications(false);
  };

  const handleSelectSearchMember = (member: Member) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    if (onSelectMember) {
      onSelectMember(member.id);
    } else {
      navigate(ROUTES.USER.MEMBER_PROFILE);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    if (searchResults.length === 1 && onSelectMember) {
      handleSelectSearchMember(searchResults[0]);
      return;
    }
    setShowSearchDropdown(false);
    if (onNavigateTab) {
      onNavigateTab('member-list');
      navigate(`${ROUTES.USER.MEMBERS}?search=${encodeURIComponent(q)}`, { replace: false });
    } else {
      navigate(`${ROUTES.USER.MEMBERS}?search=${encodeURIComponent(q)}`);
    }
  };

  const handleNavToProfile = () => {
    setShowProfileMenu(false);
    if (isAdmin) {
      if (onNavigateTab) onNavigateTab('admin-profile');
      else navigate(ROUTES.ADMIN.PROFILE);
    } else if (onNavigateTab) onNavigateTab('my-profile');
    else navigate(ROUTES.USER.MY_PROFILE);
  };

  const handleNavToMyClans = () => {
    setShowProfileMenu(false);
    if (onNavigateTab) onNavigateTab('my-clans');
    else navigate(ROUTES.USER.MY_PROFILE);
  };

  const handleNavToClanProfile = () => {
    setShowProfileMenu(false);
    if (onNavigateTab) onNavigateTab('clan-profile');
    else navigate(ROUTES.USER.CLAN_PROFILE);
  };

  const handleNavToSettings = () => {
    setShowProfileMenu(false);
    if (isAdmin) {
      if (onNavigateTab) onNavigateTab('admin-roles');
      else navigate(ROUTES.ADMIN.ROLES);
    } else if (onNavigateTab) onNavigateTab('privacy-settings');
    else navigate(ROUTES.USER.PRIVACY_SETTINGS);
  };

  const handleNavToAIConsent = () => {
    setShowProfileMenu(false);
    if (onNavigateTab) onNavigateTab('ai-consent');
    else navigate(ROUTES.USER.AI_CONSENT);
  };

  return (
    <header className="topbar-header">
      <div className="topbar-left-group">
        <button
          onClick={onToggleSidebar}
          className="topbar-toggle-btn"
          title={isSidebarCollapsed ? 'Mở rộng Menu' : 'Thu gọn Menu'}
        >
          {isSidebarCollapsed ? '☰' : '✕'}
        </button>

        <div className="topbar-brand-box" onClick={() => navigate(userRole === 'Admin' ? ROUTES.ADMIN.ROOT : ROUTES.USER.ROOT)} style={{ cursor: 'pointer' }}>
          <img src={circularEmblemLogo} alt="Gia Phả Việt Logo" className="topbar-logo-icon" />
          <div>
            <div className="topbar-system-tag">HỆ THỐNG GIA PHẢ LIÊN HỌ</div>
            <div className="topbar-brand-title">Gia Phả Việt</div>
          </div>
        </div>
      </div>

      <ClanSelector isAdmin={userRole === 'Admin'} />

      <form className="topbar-search-container" ref={searchBoxRef} onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchQuery.trim()) setShowSearchDropdown(true);
          }}
          placeholder="Tìm kiếm nhanh tên thành viên, biệt hiệu, dòng họ hoặc ngày giỗ..."
          className="topbar-search-input"
        />
        <button type="submit" className="topbar-search-icon-wrapper" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {showSearchDropdown && searchQuery.trim() && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 14px 32px rgba(15, 23, 42, 0.14)',
              maxHeight: '340px',
              overflowY: 'auto',
              zIndex: 1000,
              padding: '6px',
            }}
          >
            {isSearchingMembers && searchResults.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
                Đang tìm thành viên...
              </div>
            ) : searchResults.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
                Không tìm thấy thành viên khớp với &quot;{searchQuery}&quot;
              </div>
            ) : (
              searchResults.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectSearchMember(m)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '9px 12px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                      {m.fullName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Đời {m.generation || 1} • {m.gender === 'female' ? 'Nữ' : 'Nam'}
                      {m.branch ? ` • ${m.branch}` : ''}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>
                    Xem hồ sơ →
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </form>

      <div className="topbar-right-group">
        <div className="topbar-notif-wrapper" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="topbar-notif-btn"
            title="Trung tâm thông báo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="topbar-notif-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="topbar-notif-dropdown">
              <div className="topbar-notif-dropdown-header">
                <div className="topbar-notif-dropdown-title-row">
                  <span className="topbar-notif-dropdown-title">
                    Trung Tâm Thông Báo
                  </span>
                </div>
                <button
                  type="button"
                  className="topbar-notif-mark-read"
                  onClick={handleMarkAllRead}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Đánh dấu đã đọc
                </button>
              </div>

              <div className="topbar-notif-list">
                {notifications.length === 0 ? (
                  <div className="topbar-notif-empty">
                    Không có thông báo mới nào.
                  </div>
                ) : (
                  notifications.map((item) => {
                    const typeConfig = getNotificationTypeConfig(item.type);
                    return (
                      <div
                        key={item.id}
                        className={`topbar-notif-item ${item.unread ? 'unread' : 'read'}`}
                        onClick={() => handleNotificationClick(item)}
                        role="button"
                        tabIndex={0}
                        title="Bấm để xem chi tiết và tự động đánh dấu đã đọc"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleNotificationClick(item);
                          }
                        }}
                      >
                        
                        <div className="topbar-notif-item-content-col">
                          <div className="topbar-notif-item-header">
                            <span className="topbar-notif-item-title">{item.title}</span>
                            {item.unread && <span className="topbar-notif-item-dot" title="Chưa đọc" />}
                          </div>
                          <div className="topbar-notif-item-desc">{item.desc}</div>
                          <div className="topbar-notif-item-meta">
                            <span className="topbar-notif-item-time">{item.time}</span>
                            <span className="topbar-notif-item-click-hint">Xem chi tiết →</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="topbar-profile-wrapper" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="topbar-user-btn"
            data-testid="btn-topbar-profile"
          >
            <div className="topbar-user-avatar">{userName.charAt(0).toUpperCase()}</div>

            <div className="topbar-user-info">
              <div className="topbar-user-name">{userName}</div>
              <div className="topbar-user-role-row">
                <span className={`topbar-user-role-badge ${roleClass}`}>{userRole}</span>
              </div>
            </div>

            <span className="topbar-user-arrow">▼</span>
          </button>

          {showProfileMenu && (
            <div className="topbar-profile-dropdown" data-testid="dropdown-profile-menu">
              <div className="topbar-profile-header">
                <div className="topbar-profile-name">{userName}</div>
                <div className="topbar-profile-role">{userRole}</div>
              </div>

              {isAdmin ? (
                <>
                  <button className="topbar-menu-item" onClick={handleNavToProfile}>
                    Hồ sơ của tôi
                  </button>

                  <button
                    className="topbar-menu-item"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onNavigateTab) onNavigateTab('admin-permissions');
                      else navigate(ROUTES.ADMIN.ACCOUNTS);
                    }}
                  >
                    Quản lý tài khoản toàn hệ thống
                  </button>

                  <button className="topbar-menu-item" onClick={handleNavToSettings}>
                    Phân quyền & Vai trò
                  </button>
                </>
              ) : (
                <>
                  <button className="topbar-menu-item" onClick={handleNavToProfile}>
                    Hồ sơ của tôi
                  </button>

                  <button className="topbar-menu-item" onClick={handleNavToMyClans}>
                    Dòng tộc của tôi
                  </button>

                  <button className="topbar-menu-item" onClick={handleNavToClanProfile}>
                    Hồ sơ gia tộc
                  </button>

                  <button className="topbar-menu-item" onClick={handleNavToSettings}>
                    Cài đặt & Quyền riêng tư
                  </button>

                  <button className="topbar-menu-item" onClick={handleNavToAIConsent}>
                    Quyền sử dụng AI
                  </button>
                </>
              )}

              <div className="topbar-profile-divider" />

              <button
                onClick={onLogout}
                className="topbar-menu-item-logout"
                data-testid="btn-topbar-logout"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal chi tiết thông báo hiển thị trên toàn màn hình khi người dùng bấm vào 1 thông báo */}
      {selectedNotification && typeof document !== 'undefined' && createPortal(
        (() => {
          const typeConfig = getNotificationTypeConfig(selectedNotification.type);
          return (
            <div
              className="topbar-notif-modal-backdrop"
              onClick={() => setSelectedNotification(null)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="topbar-notif-modal-card"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="topbar-notif-modal-header">
                  <div className="topbar-notif-modal-header-left">
                    
                    <div className="topbar-notif-modal-header-text">
                      <div className="topbar-notif-modal-top-meta">
                        <span
                          className="topbar-notif-modal-badge"
                          style={{
                            backgroundColor: typeConfig.badgeBg,
                            color: typeConfig.color,
                            borderColor: typeConfig.badgeBorder,
                          }}
                        >
                          <span className="topbar-notif-modal-badge-dot" style={{ backgroundColor: typeConfig.color }} />
                          <span>{typeConfig.label}</span>
                        </span>
                        <span className="topbar-notif-modal-status">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Đã đánh dấu đã đọc
                        </span>
                      </div>

                      <h2 className="topbar-notif-modal-title">{selectedNotification.title}</h2>

                      <div className="topbar-notif-modal-time-row">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{selectedNotification.time}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="topbar-notif-modal-close"
                    onClick={() => setSelectedNotification(null)}
                    title="Đóng cửa sổ (Esc)"
                    aria-label="Đóng"
                  >
                    ✕
                  </button>
                </div>

                <div className="topbar-notif-modal-body">
                  {renderNotificationContent(selectedNotification.fullContent || selectedNotification.desc)}
                </div>

                <div className="topbar-notif-modal-footer">
                  <button
                    type="button"
                    className="topbar-notif-modal-btn-secondary"
                    onClick={() => setSelectedNotification(null)}
                  >
                    Đóng
                  </button>
                  {selectedNotification.targetTab && onNavigateTab && (
                    <button
                      type="button"
                      className="topbar-notif-modal-btn-primary"
                      onClick={() => {
                        const tab = selectedNotification.targetTab!;
                        setSelectedNotification(null);
                        setShowNotifications(false);
                        onNavigateTab(tab);
                      }}
                    >
                      <span>Đến trang liên quan</span>
                      <span className="topbar-notif-modal-btn-arrow">→</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })(),
        document.body
      )}
    </header>
  );
};

export default TopBar;
