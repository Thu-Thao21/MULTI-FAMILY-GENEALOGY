import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ANCESTOR_RECORDS,
  ANCESTRAL_MEDIA,
  INITIAL_MEMORIAL_MESSAGES,
  type AncestorRecord,
  type MemorialMessageRecord,
} from './ancestralExperience.data';
import './DigitalAncestralHallModule.css';
import { useLocalPreviewState } from '../../features/familyAdmin/useLocalPreviewState';

type IncenseType = 'Hương trầm' | 'Hương sen' | 'Hương quế';

interface LastOffering {
  ancestorId: string;
  incenseType: IncenseType;
  note: string;
}

export interface DigitalAncestralHallModuleProps {
  onOpenLibrary?: (ancestorId: string) => void;
}

const INCENSE_OPTIONS: Array<{ id: IncenseType; description: string }> = [
  { id: 'Hương trầm', description: 'Hương thơm trầm ấm, trang nghiêm' },
  { id: 'Hương sen', description: 'Thanh khiết, nhẹ nhàng và an tịnh' },
  { id: 'Hương quế', description: 'Ấm áp, thể hiện lòng thành kính' },
];

const mediaIcon = (type: string) => {
  if (type === 'Ảnh 360°') return '360°';
  if (type === 'Video') return '▶';
  if (type === 'Âm thanh') return '♪';
  if (type === 'Tài liệu') return '▤';
  return '▧';
};

const PortraitPlaceholder: React.FC<{ ancestor: AncestorRecord; compact?: boolean }> = ({ ancestor, compact = false }) => (
  <div
    className={`ancestor-portrait ancestor-portrait-${ancestor.portraitTone} ${compact ? 'ancestor-portrait-compact' : ''}`}
    role="img"
    aria-label={`Ảnh chân dung lưu trữ của ${ancestor.name}`}
  >
    <div className="ancestor-portrait-halo" aria-hidden="true" />
    <div className="ancestor-portrait-silhouette" aria-hidden="true">
      <span className="ancestor-portrait-head" />
      <span className="ancestor-portrait-shoulders" />
    </div>
    <span className="ancestor-portrait-initials">{ancestor.initials}</span>
    {!compact && <small>Ảnh chân dung lưu trữ</small>}
  </div>
);

export const DigitalAncestralHallModule: React.FC<DigitalAncestralHallModuleProps> = ({ onOpenLibrary }) => {
  const [selectedAncestorIndex, setSelectedAncestorIndex] = useState(0);
  const [incenseCounts, setIncenseCounts] = useLocalPreviewState<Record<string, number>>('incense-counts',
    ANCESTOR_RECORDS.reduce<Record<string, number>>((counts, ancestor) => {
      counts[ancestor.id] = ancestor.incenseCount;
      return counts;
    }, {})
  );
  const [burningAncestorId, setBurningAncestorId] = useState<string | null>(null);
  const [lastOffering, setLastOffering] = useState<LastOffering | null>(null);
  const [toast, setToast] = useState('');

  const [isIncenseModalOpen, setIsIncenseModalOpen] = useState(false);
  const [incenseType, setIncenseType] = useState<IncenseType>('Hương trầm');
  const [incenseNote, setIncenseNote] = useState('');

  const [messages, setMessages] = useLocalPreviewState<MemorialMessageRecord[]>('worship-messages', INITIAL_MEMORIAL_MESSAGES);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTargetId, setMessageTargetId] = useState(ANCESTOR_RECORDS[0].id);
  const [messageContent, setMessageContent] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [pendingDeleteMessage, setPendingDeleteMessage] = useState<MemorialMessageRecord | null>(null);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const burnTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const selectedAncestor = ANCESTOR_RECORDS[selectedAncestorIndex];
  const selectedMessages = useMemo(
    () => messages.filter((message) => message.ancestorId === selectedAncestor.id),
    [messages, selectedAncestor.id]
  );
  const selectedMedia = useMemo(
    () => ANCESTRAL_MEDIA.filter((item) => item.ancestorId === selectedAncestor.id),
    [selectedAncestor.id]
  );
  const isSelectedAncestorBurning = burningAncestorId === selectedAncestor.id;

  useEffect(() => {
    return () => {
      if (burnTimerRef.current !== null) window.clearTimeout(burnTimerRef.current);
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(''), 3200);
  };

  const selectAncestor = (index: number) => {
    const normalizedIndex = (index + ANCESTOR_RECORDS.length) % ANCESTOR_RECORDS.length;
    setSelectedAncestorIndex(normalizedIndex);
  };

  const openIncenseModal = () => {
    setIncenseType('Hương trầm');
    setIncenseNote('');
    setIsIncenseModalOpen(true);
  };

  const confirmIncenseOffering = () => {
    const ancestor = selectedAncestor;
    const offering: LastOffering = {
      ancestorId: ancestor.id,
      incenseType,
      note: incenseNote.trim(),
    };

    setIsIncenseModalOpen(false);
    setBurningAncestorId(ancestor.id);
    setLastOffering(offering);

    if (burnTimerRef.current !== null) window.clearTimeout(burnTimerRef.current);
    burnTimerRef.current = window.setTimeout(() => {
      setIncenseCounts((current) => ({
        ...current,
        [ancestor.id]: (current[ancestor.id] || 0) + 1,
      }));
      setBurningAncestorId(null);
      showToast(`Đã dâng ${incenseType.toLocaleLowerCase('vi-VN')} tưởng niệm ${ancestor.name}.`);
    }, 1600);
  };

  const openCreateMessage = () => {
    setEditingMessageId(null);
    setMessageTargetId(selectedAncestor.id);
    setMessageContent('');
    setIsMessageModalOpen(true);
  };

  const openEditMessage = (message: MemorialMessageRecord) => {
    setEditingMessageId(message.id);
    setMessageTargetId(message.ancestorId);
    setMessageContent(message.message);
    setIsMessageModalOpen(true);
  };

  const saveMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanMessage = messageContent.trim();
    if (!cleanMessage) return;

    if (editingMessageId) {
      setMessages((current) =>
        current.map((message) =>
          message.id === editingMessageId
            ? { ...message, ancestorId: messageTargetId, message: cleanMessage, createdAt: 'Vừa chỉnh sửa' }
            : message
        )
      );
      showToast('Đã cập nhật lời tưởng niệm của bạn.');
    } else {
      const newMessage: MemorialMessageRecord = {
        id: `message-${Date.now()}`,
        ancestorId: messageTargetId,
        sender: 'Võ Văn Thắng',
        initials: 'VT',
        relationship: 'Hậu duệ thông gia · Đời thứ 5',
        message: cleanMessage,
        createdAt: 'Vừa xong',
        isOwn: true,
      };
      setMessages((current) => [newMessage, ...current]);
      showToast('Lời tưởng niệm đã được lưu trong không gian gia tộc.');
    }

    setIsMessageModalOpen(false);
    setEditingMessageId(null);
    setMessageContent('');

    const targetIndex = ANCESTOR_RECORDS.findIndex((ancestor) => ancestor.id === messageTargetId);
    if (targetIndex >= 0) setSelectedAncestorIndex(targetIndex);
  };

  const confirmDeleteMessage = () => {
    if (!pendingDeleteMessage) return;
    setMessages((current) => current.filter((message) => message.id !== pendingDeleteMessage.id));
    setPendingDeleteMessage(null);
    showToast('Đã xóa lời tưởng niệm của bạn.');
  };

  const openAncestralMedia = () => {
    if (onOpenLibrary) {
      onOpenLibrary(selectedAncestor.id);
      return;
    }
    setIsMediaModalOpen(true);
  };

  return (
    <section className="ancestral-hall-page" aria-labelledby="ancestral-hall-title">
      <header className="ancestral-hall-header">
        <div>
          <span className="ancestral-hall-eyebrow">KHÔNG GIAN TƯỞNG NIỆM GIA TỘC</span>
          <h1 id="ancestral-hall-title">Phòng Thờ Số</h1>
          <p>Thành kính tưởng nhớ tiền nhân, gìn giữ ký ức và kết nối lòng tri ân của con cháu.</p>
        </div>
        <div className="ancestral-hall-position" aria-label="Vị trí trong danh sách tổ tiên">
          <strong>{String(selectedAncestorIndex + 1).padStart(2, '0')}</strong>
          <span>/ {String(ANCESTOR_RECORDS.length).padStart(2, '0')}</span>
        </div>
      </header>

      <article className="ancestor-focus-card">
        <button
          type="button"
          className="ancestor-nav-button ancestor-nav-previous"
          onClick={() => selectAncestor(selectedAncestorIndex - 1)}
          aria-label="Xem vị tiền nhân trước"
        >
          ‹
        </button>

        <div className="ancestor-focus-portrait">
          <PortraitPlaceholder ancestor={selectedAncestor} />
        </div>

        <div className="ancestor-focus-copy">
          <span className="ancestor-honorific">{selectedAncestor.title} · Đời thứ {selectedAncestor.generation}</span>
          <h2>{selectedAncestor.name}</h2>
          <p className="ancestor-branch">{selectedAncestor.branch}</p>

          <dl className="ancestor-vitals-grid">
            <div>
              <dt>Sinh – Mất</dt>
              <dd>{selectedAncestor.birthYear} – {selectedAncestor.deathYear}</dd>
            </div>
            <div>
              <dt>Hưởng thọ</dt>
              <dd>{selectedAncestor.lifespan.replace('Hưởng thọ ', '')}</dd>
            </div>
            <div>
              <dt>Ngày tưởng niệm</dt>
              <dd>{selectedAncestor.memorialDate}</dd>
            </div>
            <div>
              <dt>Địa điểm</dt>
              <dd>{selectedAncestor.memorialPlace}</dd>
            </div>
          </dl>

          <div className="ancestor-focus-actions">
            <button type="button" className="ancestral-secondary-button" onClick={() => setIsInfoModalOpen(true)}>
              Xem thông tin
            </button>
            <button type="button" className="ancestral-secondary-button" onClick={openAncestralMedia}>
              Mở tư liệu tổ tiên <span>{selectedMedia.length}</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          className="ancestor-nav-button ancestor-nav-next"
          onClick={() => selectAncestor(selectedAncestorIndex + 1)}
          aria-label="Xem vị tiền nhân tiếp theo"
        >
          ›
        </button>
      </article>

      <div className="ancestor-selector" role="tablist" aria-label="Chọn vị tiền nhân">
        {ANCESTOR_RECORDS.map((ancestor, index) => (
          <button
            key={ancestor.id}
            type="button"
            role="tab"
            aria-selected={index === selectedAncestorIndex}
            className={index === selectedAncestorIndex ? 'active' : ''}
            onClick={() => selectAncestor(index)}
          >
            <PortraitPlaceholder ancestor={ancestor} compact />
            <span>
              <strong>{ancestor.name}</strong>
              <small>{ancestor.title} · Đời {ancestor.generation}</small>
            </span>
          </button>
        ))}
      </div>

      <article className="digital-altar-card" aria-labelledby="digital-altar-title">
        <div className="digital-altar-glow" aria-hidden="true" />
        <div className="altar-lantern altar-lantern-left" aria-hidden="true"><span /></div>
        <div className="altar-lantern altar-lantern-right" aria-hidden="true"><span /></div>

        <div className="digital-altar-content">
          <span className="digital-altar-kicker">TỪ ĐƯỜNG TỘC HỌ NGUYỄN</span>
          <h2 id="digital-altar-title">Bài Vị Tiền Nhân</h2>

          <div className="digital-altar-tablet" aria-label={`Bài vị của ${selectedAncestor.name}`}>
            <span className="digital-altar-crest">福</span>
            <strong>{selectedAncestor.name.toLocaleUpperCase('vi-VN')}</strong>
            <small>{selectedAncestor.title} · {selectedAncestor.birthYear}—{selectedAncestor.deathYear}</small>
          </div>

          <div className="altar-offerings" aria-label="Lễ vật tưởng niệm số">
            <div className="altar-offering altar-offering-flower"><span aria-hidden="true">❀</span><small>Hoa sen</small></div>
            <div className="altar-offering altar-offering-fruit"><span aria-hidden="true">● ● ●</span><small>Mâm ngũ quả</small></div>
            <div className="altar-offering altar-offering-light"><span aria-hidden="true">✦</span><small>Nến tâm đăng</small></div>
          </div>

          <div className={`digital-incense-burner ${isSelectedAncestorBurning ? 'is-burning' : ''}`} aria-live="polite">
            <div className="incense-smoke" aria-hidden="true">
              <span /><span /><span />
            </div>
            <div className="incense-sticks" aria-hidden="true"><i /><i /><i /></div>
            <div className="incense-pot" aria-hidden="true"><span>THỌ</span></div>
            <strong>{incenseCounts[selectedAncestor.id] || 0} nén tâm hương</strong>
            <small>{isSelectedAncestorBurning ? 'Tâm hương đang được dâng lên…' : 'Được con cháu thành kính dâng tưởng niệm'}</small>
          </div>

          {lastOffering?.ancestorId === selectedAncestor.id && (
            <div className="latest-offering-note">
              <span>Lời nguyện gần nhất · {lastOffering.incenseType}</span>
              {lastOffering.note && <p>“{lastOffering.note}”</p>}
            </div>
          )}

          <div className="digital-altar-actions">
            <button
              type="button"
              className="light-incense-button"
              onClick={openIncenseModal}
              disabled={isSelectedAncestorBurning}
            >
              <span aria-hidden="true">✦</span>
              {isSelectedAncestorBurning ? 'Đang dâng tâm hương…' : 'Thắp hương tưởng niệm'}
            </button>
            <button type="button" className="write-memorial-button" onClick={openCreateMessage}>
              Viết lời tưởng niệm
            </button>
          </div>
        </div>
      </article>

      <section className="memorial-messages-section" aria-labelledby="memorial-messages-title">
        <div className="memorial-section-header">
          <div>
            <span>LƯU BÚT GIA TỘC</span>
            <h2 id="memorial-messages-title">Lời Tưởng Niệm</h2>
            <p>Dành cho {selectedAncestor.name} · {selectedAncestor.title}</p>
          </div>
          <button type="button" className="ancestral-primary-button" onClick={openCreateMessage}>
            + Viết lời tưởng niệm
          </button>
        </div>

        {selectedMessages.length === 0 ? (
          <div className="memorial-empty-state">
            <div aria-hidden="true">✦</div>
            <h3>Chưa có lời tưởng niệm</h3>
            <p>Hãy là người đầu tiên lưu lại một lời tri ân dành cho {selectedAncestor.name}.</p>
            <button type="button" onClick={openCreateMessage}>Viết lời đầu tiên</button>
          </div>
        ) : (
          <div className="memorial-message-list">
            {selectedMessages.map((message) => (
              <article key={message.id} className="memorial-message-card">
                <div className="memorial-message-avatar" aria-hidden="true">{message.initials}</div>
                <div className="memorial-message-content">
                  <header>
                    <div>
                      <strong>{message.sender}</strong>
                      {message.isOwn && <span className="own-message-badge">Lời của bạn</span>}
                      <small>{message.relationship}</small>
                    </div>
                    <time>{message.createdAt}</time>
                  </header>
                  <p>“{message.message}”</p>
                  {message.isOwn && (
                    <div className="memorial-message-actions">
                      <button type="button" onClick={() => openEditMessage(message)}>Chỉnh sửa</button>
                      <button type="button" className="danger" onClick={() => setPendingDeleteMessage(message)}>Xóa</button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {toast && <div className="ancestral-toast" role="status" aria-live="polite"><span>✓</span>{toast}</div>}

      {isIncenseModalOpen && (
        <div className="ancestral-modal-backdrop" role="presentation" onMouseDown={() => setIsIncenseModalOpen(false)}>
          <div
            className="ancestral-modal ancestral-incense-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="incense-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ancestral-modal-header">
              <div>
                <span>DÂNG TÂM HƯƠNG</span>
                <h2 id="incense-modal-title">Thắp hương tưởng niệm</h2>
                <p>Kính dâng {selectedAncestor.title} {selectedAncestor.name}</p>
              </div>
              <button type="button" onClick={() => setIsIncenseModalOpen(false)} aria-label="Đóng hộp thoại">×</button>
            </div>

            <fieldset className="incense-type-options">
              <legend>Chọn loại hương</legend>
              {INCENSE_OPTIONS.map((option) => (
                <label key={option.id} className={incenseType === option.id ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="incense-type"
                    value={option.id}
                    checked={incenseType === option.id}
                    onChange={() => setIncenseType(option.id)}
                  />
                  <span className="incense-choice-mark" aria-hidden="true" />
                  <span><strong>{option.id}</strong><small>{option.description}</small></span>
                </label>
              ))}
            </fieldset>

            <label className="ancestral-form-field">
              <span>Lời nguyện hoặc ghi chú <small>(không bắt buộc)</small></span>
              <textarea
                rows={4}
                maxLength={240}
                value={incenseNote}
                onChange={(event) => setIncenseNote(event.target.value)}
                placeholder="Gửi lời cầu nguyện bình an, tưởng nhớ công đức tiền nhân…"
              />
              <small>{incenseNote.length}/240 ký tự</small>
            </label>

            <div className="ancestral-modal-note">Tâm hương chỉ được lưu trong phiên trình diễn này và không phát sinh giao dịch.</div>
            <div className="ancestral-modal-actions">
              <button type="button" className="ancestral-cancel-button" onClick={() => setIsIncenseModalOpen(false)}>Hủy</button>
              <button type="button" className="ancestral-confirm-button" onClick={confirmIncenseOffering}>Xác nhận dâng hương</button>
            </div>
          </div>
        </div>
      )}

      {isMessageModalOpen && (
        <div className="ancestral-modal-backdrop" role="presentation" onMouseDown={() => setIsMessageModalOpen(false)}>
          <div
            className="ancestral-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ancestral-modal-header">
              <div>
                <span>LƯU BÚT TƯỞNG NIỆM</span>
                <h2 id="message-modal-title">{editingMessageId ? 'Chỉnh sửa lời tưởng niệm' : 'Viết lời tưởng niệm'}</h2>
                <p>Những lời trang trọng sẽ được lưu cùng ký ức gia tộc.</p>
              </div>
              <button type="button" onClick={() => setIsMessageModalOpen(false)} aria-label="Đóng hộp thoại">×</button>
            </div>

            <form onSubmit={saveMessage}>
              <label className="ancestral-form-field">
                <span>Kính gửi vị tiền nhân <b>*</b></span>
                <select value={messageTargetId} onChange={(event) => setMessageTargetId(event.target.value)}>
                  {ANCESTOR_RECORDS.map((ancestor) => (
                    <option key={ancestor.id} value={ancestor.id}>{ancestor.title} {ancestor.name} · Đời {ancestor.generation}</option>
                  ))}
                </select>
              </label>
              <label className="ancestral-form-field">
                <span>Nội dung lời tưởng niệm <b>*</b></span>
                <textarea
                  autoFocus
                  required
                  rows={6}
                  minLength={5}
                  maxLength={500}
                  value={messageContent}
                  onChange={(event) => setMessageContent(event.target.value)}
                  placeholder="Viết lời tri ân và những điều bạn muốn lưu lại…"
                />
                <small>{messageContent.length}/500 ký tự</small>
              </label>
              <div className="ancestral-modal-note">Vui lòng sử dụng ngôn từ trang trọng, phù hợp với không gian tưởng niệm chung.</div>
              <div className="ancestral-modal-actions">
                <button type="button" className="ancestral-cancel-button" onClick={() => setIsMessageModalOpen(false)}>Hủy</button>
                <button type="submit" className="ancestral-confirm-button" disabled={messageContent.trim().length < 5}>
                  {editingMessageId ? 'Lưu thay đổi' : 'Gửi lời tưởng niệm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingDeleteMessage && (
        <div className="ancestral-modal-backdrop" role="presentation" onMouseDown={() => setPendingDeleteMessage(null)}>
          <div
            className="ancestral-modal ancestral-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-message-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ancestral-confirm-icon" aria-hidden="true">!</div>
            <h2 id="delete-message-title">Xóa lời tưởng niệm?</h2>
            <p>Lời tưởng niệm này sẽ bị gỡ khỏi không gian gia tộc trong phiên trình diễn.</p>
            <blockquote>“{pendingDeleteMessage.message}”</blockquote>
            <div className="ancestral-modal-actions">
              <button type="button" className="ancestral-cancel-button" onClick={() => setPendingDeleteMessage(null)}>Giữ lại</button>
              <button type="button" className="ancestral-delete-button" onClick={confirmDeleteMessage}>Xác nhận xóa</button>
            </div>
          </div>
        </div>
      )}

      {isInfoModalOpen && (
        <div className="ancestral-modal-backdrop" role="presentation" onMouseDown={() => setIsInfoModalOpen(false)}>
          <div
            className="ancestral-modal ancestor-info-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ancestor-info-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ancestral-modal-header">
              <div>
                <span>HỒ SƠ TIỀN NHÂN</span>
                <h2 id="ancestor-info-title">{selectedAncestor.name}</h2>
                <p>{selectedAncestor.title} · {selectedAncestor.relationship}</p>
              </div>
              <button type="button" onClick={() => setIsInfoModalOpen(false)} aria-label="Đóng hộp thoại">×</button>
            </div>
            <div className="ancestor-info-profile">
              <PortraitPlaceholder ancestor={selectedAncestor} compact />
              <dl>
                <div><dt>Niên đại</dt><dd>{selectedAncestor.birthYear} – {selectedAncestor.deathYear}</dd></div>
                <div><dt>Chi / Nhánh</dt><dd>{selectedAncestor.branch}</dd></div>
                <div><dt>Ngày tưởng niệm</dt><dd>{selectedAncestor.memorialDate}</dd></div>
                <div><dt>An nghỉ</dt><dd>{selectedAncestor.restingPlace}</dd></div>
              </dl>
            </div>
            <div className="ancestor-biography-copy">
              <h3>Tiểu sử lưu truyền</h3>
              <p>{selectedAncestor.biography}</p>
              <blockquote>{selectedAncestor.legacy}</blockquote>
            </div>
            <div className="ancestral-modal-actions">
              <button type="button" className="ancestral-cancel-button" onClick={() => setIsInfoModalOpen(false)}>Đóng</button>
              <button type="button" className="ancestral-confirm-button" onClick={() => { setIsInfoModalOpen(false); openAncestralMedia(); }}>Xem tư liệu liên quan</button>
            </div>
          </div>
        </div>
      )}

      {isMediaModalOpen && (
        <div className="ancestral-modal-backdrop" role="presentation" onMouseDown={() => setIsMediaModalOpen(false)}>
          <div
            className="ancestral-modal ancestor-media-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ancestor-media-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ancestral-modal-header">
              <div>
                <span>THƯ VIỆN TỔ TIÊN</span>
                <h2 id="ancestor-media-title">Tư liệu về {selectedAncestor.name}</h2>
                <p>{selectedMedia.length} tư liệu đã được số hóa trong thư viện.</p>
              </div>
              <button type="button" onClick={() => setIsMediaModalOpen(false)} aria-label="Đóng hộp thoại">×</button>
            </div>
            {selectedMedia.length === 0 ? (
              <div className="memorial-empty-state compact"><h3>Chưa có tư liệu</h3><p>Tư liệu về vị tiền nhân này đang được sưu tầm.</p></div>
            ) : (
              <div className="ancestor-media-preview-list">
                {selectedMedia.map((item) => (
                  <article key={item.id}>
                    <div className={`ancestor-media-icon media-accent-${item.accent}`} aria-hidden="true">{mediaIcon(item.type)}</div>
                    <div><span>{item.type}</span><h3>{item.title}</h3><p>{item.description}</p><small>{item.capturedAt} · {item.source}</small></div>
                  </article>
                ))}
              </div>
            )}
            <div className="ancestral-modal-actions">
              <button type="button" className="ancestral-cancel-button" onClick={() => setIsMediaModalOpen(false)}>Đóng</button>
              {onOpenLibrary && <button type="button" className="ancestral-confirm-button" onClick={() => onOpenLibrary(selectedAncestor.id)}>Mở trình xem 3D/360</button>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DigitalAncestralHallModule;
