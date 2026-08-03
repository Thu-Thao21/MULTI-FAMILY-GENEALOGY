import React, { useState } from 'react';
import './RelationshipFinderWidget.css';

export interface RelationshipFinderWidgetProps {
  members?: Array<{ id: string; name: string; info: string }>;
}

export const RelationshipFinderWidget: React.FC<RelationshipFinderWidgetProps> = ({ members = [] }) => {
  const [person1, setPerson1] = useState(members[0]?.id || '');
  const [person2, setPerson2] = useState(members[1]?.id || '');
  const [result, setResult] = useState<{
    relationshipTitle: string;
    description: string;
    path: string[];
    familyConnection: string;
  } | null>(null);

  const handleCalculate = () => {
    if (!person1 || !person2) {
      setResult({
        relationshipTitle: 'Vui lòng chọn thành viên',
        description: 'Cần chọn đủ 2 thành viên từ danh sách hệ thống để tính toán mối quan hệ.',
        path: [],
        familyConnection: 'Chưa xác định',
      });
      return;
    }

    if (person1 === person2) {
      setResult({
        relationshipTitle: 'Cùng một người',
        description: 'Vui lòng chọn 2 thành viên khác nhau để tra cứu cách xưng hô.',
        path: [],
        familyConnection: 'Chính bản thân',
      });
      return;
    }

    const m1 = members.find((m) => m.id === person1);
    const m2 = members.find((m) => m.id === person2);

    setResult({
      relationshipTitle: 'Tra cứu mối quan hệ',
      description: `Xác định xưng hô giữa ${m1?.name || 'Thành viên 1'} và ${m2?.name || 'Thành viên 2'}.`,
      path: [m1?.name || '', m2?.name || ''],
      familyConnection: 'Quan hệ phả hệ',
    });
  };

  return (
    <div className="relationship-finder-card">
      <div className="relationship-finder-header">
        <div className="relationship-finder-icon-box">✨</div>
        <div>
          <h3 className="relationship-finder-title">Tra Cứu Cách Xưng Hô & Mối Quan Hệ</h3>
          <p className="relationship-finder-subtitle">
            Chọn 2 người bất kỳ trong gia tộc để tự động tìm câu xưng hô phù hợp và sơ đồ họ hàng.
          </p>
        </div>
      </div>

      <div className="relationship-finder-controls-box">
        <div>
          <label className="relationship-finder-label">NGƯỜI XƯNG (NGƯỜI GỌI)</label>
          <select
            value={person1}
            onChange={(e) => setPerson1(e.target.value)}
            className="relationship-finder-select"
          >
            {members.length === 0 ? (
              <option value="">-- Chưa có thành viên --</option>
            ) : (
              members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.info})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="relationship-finder-swap-icon">↔</div>

        <div>
          <label className="relationship-finder-label">NGƯỜI ĐƯỢC GỌI</label>
          <select
            value={person2}
            onChange={(e) => setPerson2(e.target.value)}
            className="relationship-finder-select"
          >
            {members.length === 0 ? (
              <option value="">-- Chưa có thành viên --</option>
            ) : (
              members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.info})
                </option>
              ))
            )}
          </select>
        </div>

        <button onClick={handleCalculate} className="relationship-finder-calc-btn">
          Tra Cứu 🔍
        </button>
      </div>

      {result && (
        <div className="relationship-finder-result-box">
          <span className="relationship-finder-result-badge">{result.familyConnection}</span>
          <h4 className="relationship-finder-result-title">{result.relationshipTitle}</h4>
          <p className="relationship-finder-result-desc">{result.description}</p>
        </div>
      )}
    </div>
  );
};

export default RelationshipFinderWidget;
