import React, { useState } from 'react';
import './DigitalAncestralHallModule.css';

export interface TributeNote {
  id: string;
  authorName: string;
  targetAncestor: string;
  content: string;
  createdAt: string;
}

export const DigitalAncestralHallModule: React.FC = () => {
  const [incenseCount, setIncenseCount] = useState(128);
  const [isBurning, setIsBurning] = useState(false);
  const [incenseSuccess, setIncenseSuccess] = useState(false);

  const [tributes, setTributes] = useState<TributeNote[]>([
    {
      id: 'trib-001',
      authorName: 'Nguyễn Văn A (Đời 4)',
      targetAncestor: 'Cụ Khởi Tổ Nguyễn Văn A (Đời 1)',
      content: 'Kính bái Cụ tổ, con cháu đời thứ 4 kính mong Cụ phù hộ độ trì cho dòng họ luôn đoàn kết, bình an và phát triển.',
      createdAt: '12/09/2026 08:30',
    },
    {
      id: 'trib-002',
      authorName: 'Nguyễn Thị C (Đời 4)',
      targetAncestor: 'Bà Tổ Nguyễn Thị B (Đời 2)',
      content: 'Tưởng nhớ công ơn dưỡng dục của Bà tổ, nguyện đem tâm sức phụng sự dòng họ.',
      createdAt: '10/09/2026 19:15',
    },
  ]);

  // Modal write tribute (FR-ME-35)
  const [showTributeModal, setShowTributeModal] = useState(false);
  const [targetAncestor, setTargetAncestor] = useState('Cụ Khởi Tổ Nguyễn Văn A (Đời 1)');
  const [tributeContent, setTributeContent] = useState('');

  const handleBurnIncense = () => {
    if (isBurning) return;
    setIsBurning(true);

    setTimeout(() => {
      setIncenseCount((prev) => prev + 1);
      setIsBurning(false);
      setIncenseSuccess(true);
      setTimeout(() => setIncenseSuccess(false), 3000);
    }, 1500);
  };

  const handleAddTribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tributeContent.trim()) return;

    const newNote: TributeNote = {
      id: `trib-${Date.now()}`,
      authorName: 'Nguyễn Văn A (Đời 4)',
      targetAncestor,
      content: tributeContent.trim(),
      createdAt: new Date().toLocaleString('vi-VN', { hour12: false }).substring(0, 16),
    };

    setTributes([newNote, ...tributes]);
    setShowTributeModal(false);
    setTributeContent('');
  };

  return (
    <div className="hall-container">
      <div className="hall-header">
        <div>
          <h2 className="hall-title">Không Gian Phòng Thờ Số Gia Tộc</h2>
          <p className="hall-subtitle">
            Trang trọng kính bái tổ tiên, thắp hương tưởng niệm trực tuyến và ghi nhận lời tri ân (FR-ME-33 đến ME-35).
          </p>
        </div>
      </div>

      {/* Main Altar Banner View (FR-ME-33, ME-34) */}
      <div className="altar-main-card">
        <div className="altar-banner-overlay" />
        <div className="altar-content">
          <div className="altar-title-tag">TỪ ĐƯỜNG TỘC HỌ NGUYỄN</div>
          <h3 className="altar-heading">BÀI VỊ THỦY TỔ & CÁC VỊ TIÊN HIỀN</h3>

          <div className="altar-visual-box">
            <div className="altar-tablet">
              <div className="tablet-text">NONG NGUYEN PHUC TONG</div>
              <div className="tablet-sub">CỤ KHỞI TỔ THỦY TỔ GIA TỘC</div>
            </div>

            {/* Incense Burner View */}
            <div className={`incense-burner ${isBurning ? 'burning' : ''}`}>
              <div className="smoke-animation" />
              <div className="burner-pot">🏺</div>
              <span className="incense-count-label">🔥 Đã thắp: {incenseCount} nén hương</span>
            </div>
          </div>

          <div className="altar-actions-row">
            <button
              className="burn-incense-btn"
              onClick={handleBurnIncense}
              disabled={isBurning}
            >
              {isBurning ? '🕯️ Đang dâng hương...' : '🕯️ Thắp Hương Tưởng Niệm (FR-ME-34)'}
            </button>

            <button className="write-tribute-btn" onClick={() => setShowTributeModal(true)}>
              ✍️ Viết Lời Tưởng Niệm (FR-ME-35)
            </button>
          </div>

          {incenseSuccess && (
            <div className="incense-toast">
              ✨ Bạn đã dâng nén hương tưởng niệm thành công lên Bài vị Tổ tiên!
            </div>
          )}

          <div className="altar-2d-fallback-note">
            📷 Hệ thống hỗ trợ chế độ không gian 2D/3D solemn linh hoạt tùy cấu hình thiết bị.
          </div>
        </div>
      </div>

      {/* Tributes List (FR-ME-35) */}
      <div className="tributes-section">
        <h3 className="tributes-title">📜 Lời Tưởng Niệm Từ Thành Viên Gia Tộc ({tributes.length})</h3>

        <div className="tributes-list">
          {tributes.map((t) => (
            <div key={t.id} className="tribute-card">
              <div className="tribute-head">
                <span className="tribute-author">✍️ {t.authorName}</span>
                <span className="tribute-date">{t.createdAt}</span>
              </div>
              <div className="tribute-target">Kính bái: <strong>{t.targetAncestor}</strong></div>
              <p className="tribute-body">"{t.content}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Write Tribute Modal (FR-ME-35) */}
      {showTributeModal && (
        <div className="tribute-modal-overlay">
          <div className="tribute-modal-card">
            <div className="tribute-modal-header">
              <h3>Viết Lời Tưởng Niệm Tri Ân Tổ Tiên</h3>
              <button className="modal-close-btn" onClick={() => setShowTributeModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddTribute} className="tribute-form">
              <div className="modal-field">
                <label className="modal-label">Kính bái Vị Tiên Hiền / Tổ tiên *</label>
                <select
                  className="modal-select"
                  value={targetAncestor}
                  onChange={(e) => setTargetAncestor(e.target.value)}
                >
                  <option value="Cụ Khởi Tổ Nguyễn Văn A (Đời 1)">Cụ Khởi Tổ Nguyễn Văn A (Đời 1)</option>
                  <option value="Bà Tổ Nguyễn Thị B (Đời 2)">Bà Tổ Nguyễn Thị B (Đời 2)</option>
                  <option value="Toàn thể Tiên tổ Tộc họ Nguyễn">Toàn thể Tiên tổ Tộc họ Nguyễn</option>
                </select>
              </div>

              <div className="modal-field">
                <label className="modal-label">Nội dung Lời Tưởng Niệm *</label>
                <textarea
                  className="modal-textarea"
                  rows={4}
                  placeholder="Viết những lời tri ân, cầu nguyện bình an cho gia tộc..."
                  value={tributeContent}
                  onChange={(e) => setTributeContent(e.target.value)}
                  required
                />
              </div>

              <div className="tribute-policy-note">
                ℹ️ Lời tưởng niệm được kiểm duyệt văn phong chuẩn mực trước khi xuất hiện công khai theo quy định của dòng họ.
              </div>

              <div className="modal-actions" style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setShowTributeModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="modal-submit-btn">
                  Gửi lời tưởng niệm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalAncestralHallModule;
