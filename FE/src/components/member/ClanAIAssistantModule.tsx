import React, { useState } from 'react';
import './ClanAIAssistantModule.css';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  citations?: Array<{ title: string; source: string }>;
}

export const ClanAIAssistantModule: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'ai',
      text: 'Kính chào ông/bà! Tôi là Trợ lý AI Gia Phả. Tôi có thể hỗ trợ giải đáp thắc mắc về lịch sử dòng họ, tra cứu thông tin thế hệ, thủy tổ hoặc phân tích số liệu tộc họ dựa trên phạm vi dữ liệu được cấp quyền. Ông/bà muốn tìm hiểu thông tin gì hôm nay?',
      timestamp: '12:00',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sampleSuggestions = [
    'Cho tôi biết nguồn gốc khởi tổ của dòng họ Nguyễn Chi 1?',
    'Số lượng thành viên nam/nữ thuộc thế hệ thứ 4 là bao nhiêu?',
    'Trong dòng họ có bao nhiêu người đỗ thạc sĩ/tiến sĩ?',
    'Những sự kiện giỗ tổ quan trọng diễn ra trong quý này?',
  ];

  const handleSend = (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSend) setInputQuery('');
    setIsThinking(true);

    // Simulate AI thinking and generating answer
    setTimeout(() => {
      let aiText = '';
      let citations: Array<{ title: string; source: string }> = [];

      if (text.includes('khởi tổ') || text.includes('nguồn gốc')) {
        aiText =
          'Dòng họ Nguyễn Chi 1 có nguồn gốc từ Cụ Khởi Tổ Nguyễn Văn A (1850-1920), xuất thân tại làng Đông, Xã Kim Liên. Cụ là người lập nên từ đường đầu tiên vào năm 1890.';
        citations = [{ title: 'Gia phả cổ chữ Nôm (1890)', source: 'Hồ sơ tài liệu #DOC-001' }];
      } else if (text.includes('thế hệ') || text.includes('nam/nữ')) {
        aiText =
          'Thống kê theo cơ sở dữ liệu hiện tại: Thế hệ thứ 4 bao gồm tổng cộng 18 thành viên (11 Nam, 7 Nữ). Đa số thành viên đời 4 hiện sinh sống tại Hà Nội và Hải Dương.';
        citations = [{ title: 'Báo cáo thống kê gia tộc 2026', source: 'Cơ sở dữ liệu Gia Phả Việt' }];
      } else {
        aiText =
          'Hệ thống AI đã phân tích câu hỏi của bạn trong phạm vi dữ liệu dòng họ được công khai. Câu trả lời chi tiết và tài liệu minh chứng đính kèm bên dưới.';
        citations = [{ title: 'Trích lục thông tin dòng họ', source: 'Hệ thống lưu trữ gia phả' }];
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        citations,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className="ai-container">
      <div className="ai-header">
        <div>
          <h2 className="ai-title">Trợ Lý AI Gia Phả & Thống Kê Gợi Ý</h2>
          <p className="ai-subtitle">
            Hỏi đáp thông minh về lịch sử dòng họ, tra cứu dữ liệu tộc họ và xem gợi ý tự động (FR-ME-31, ME-32).
          </p>
        </div>
      </div>

      <div className="ai-layout-grid">
        {/* Left Column: Chat Assistant */}
        <div className="chat-card">
          <div className="chat-messages-box">
            {messages.map((m) => (
              <div key={m.id} className={`chat-message-item ${m.sender}`}>
                <div className="chat-avatar">{m.sender === 'ai' ? '🤖' : '👤'}</div>
                <div className="chat-bubble">
                  <div className="chat-text">{m.text}</div>

                  {m.citations && m.citations.length > 0 && (
                    <div className="chat-citations">
                      <span className="citation-label">Trích dẫn nguồn liên quan:</span>
                      {m.citations.map((c, idx) => (
                        <div key={idx} className="citation-item">
                          📌 <strong>{c.title}</strong> — {c.source}
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="chat-time">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="chat-message-item ai">
                <div className="chat-avatar">🤖</div>
                <div className="chat-bubble thinking">
                  <span className="dot-pulse">AI đang suy ngẫm và truy xuất dữ liệu gia phả...</span>
                </div>
              </div>
            )}
          </div>

          <form
            className="chat-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="chat-input"
              placeholder="Đặt câu hỏi về dòng họ, thủy tổ, ngày giỗ, thống kê..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isThinking}
            />
            <button type="submit" className="chat-send-btn" disabled={isThinking}>
              Gửi ➔
            </button>
          </form>
        </div>

        {/* Right Column: AI Stats & Suggestions (FR-ME-32) */}
        <div className="ai-stats-card">
          <h3 className="ai-side-title">📊 Gợi Ý & Thống Kê AI (FR-ME-32)</h3>

          <div className="suggestions-box">
            <span className="suggestions-label">Câu hỏi gợi ý thường gặp:</span>
            <div className="suggestions-list">
              {sampleSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="suggestion-pill"
                  onClick={() => handleSend(sug)}
                >
                  💡 {sug}
                </button>
              ))}
            </div>
          </div>

          <div className="stats-highlight-box">
            <h4 className="stats-box-title">Đặc điểm nổi bật gia tộc</h4>
            <ul className="stats-list">
              <li>• <strong>Cơ cấu thế hệ:</strong> Đã ghi nhận 6 thế hệ nối tiếp.</li>
              <li>• <strong>Phân bố địa lý:</strong> 65% sinh sống tại Hà Nội, 20% tại Hải Dương, 15% nước ngoài.</li>
              <li>• <strong>Trình độ học vấn:</strong> 42 Cử nhân, 8 Thạc sĩ, 2 Tiến sĩ.</li>
            </ul>
          </div>

          <div className="ai-package-note">
            ℹ️ Tính năng AI Assistant sử dụng trong phạm vi dữ liệu Public & Family theo gói Business hiện hành.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClanAIAssistantModule;
