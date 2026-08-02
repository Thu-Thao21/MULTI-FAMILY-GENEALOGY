import React, { useState } from 'react';
import './RelationshipFinderWidget.css';

export const RelationshipFinderWidget: React.FC = () => {
  const [person1, setPerson1] = useState('1');
  const [person2, setPerson2] = useState('2');
  const [result, setResult] = useState<{
    relationshipTitle: string;
    description: string;
    path: string[];
    familyConnection: string;
  } | null>({
    relationshipTitle: 'Bà Ngoại Họ (Bà Ngoại Trực Hệ)',
    description: 'Trần Thị Huệ là mẹ ruột của Nguyễn Thị Dung (Mẹ của người xưng). Đây là quan hệ huyết thống - hôn nhân giữa Họ Nguyễn và Họ Trần.',
    path: ['Nguyễn Văn Cường (Cháu)', 'Nguyễn Văn Bình (Bố ruột - Họ Nguyễn)', 'Nguyễn Văn An 💖 Trần Thị Huệ (Bà Ngoại - Họ Trần)'],
    familyConnection: 'Hôn nhân liên họ: Họ Nguyễn 💖 Họ Trần',
  });

  const memberOptions = [
    { id: '1', name: 'Nguyễn Văn Cường', info: 'Thế hệ 3 - Họ Nguyễn' },
    { id: '2', name: 'Trần Thị Huệ', info: 'Thế hệ 1 - Họ Trần (Bà Ngoại)' },
    { id: '3', name: 'Lê Văn Phúc', info: 'Thế hệ 1 - Họ Lê (Thông Gia)' },
    { id: '4', name: 'Trần Văn Hùng', info: 'Thế hệ 2 - Họ Trần (Chú/Cậu)' },
    { id: '5', name: 'Lê Thị Nga', info: 'Thế hệ 2 - Họ Lê (Mẹ/Mợ)' },
  ];

  const handleCalculate = () => {
    if (person1 === person2) {
      setResult({
        relationshipTitle: 'Cùng một người',
        description: 'Vui lòng chọn 2 thành viên khác nhau để tra cứu cách xưng hô.',
        path: [],
        familyConnection: 'Chính bản thân',
      });
      return;
    }

    if ((person1 === '1' && person2 === '2') || (person1 === '2' && person2 === '1')) {
      setResult({
        relationshipTitle: 'Bà Ngoại / Cụ Bà (Họ Trần)',
        description: 'Trần Thị Huệ là vợ của Cụ Tổ Nguyễn Văn An. Mối quan hệ liên họ giữa Họ Nguyễn và Họ Trần qua hôn nhân.',
        path: ['Nguyễn Văn Cường (Cháu)', 'Nguyễn Văn Bình (Con)', 'Trần Thị Huệ (Bà Ngoại)'],
        familyConnection: 'Liên kết Nội - Ngoại (Họ Nguyễn 💖 Họ Trần)',
      });
    } else if ((person1 === '1' && person2 === '3') || (person1 === '3' && person2 === '1')) {
      setResult({
        relationshipTitle: 'Ông Thông Gia / Ông Ngoại Họ (Họ Lê)',
        description: 'Lê Văn Phúc là cha ruột của Lê Thị Nga (Mẹ ruột). Mối quan hệ thông gia gắn kết giữa Họ Nguyễn và Họ Lê.',
        path: ['Nguyễn Văn Cường (Cháu)', 'Lê Thị Nga (Mẹ ruột - Họ Lê)', 'Lê Văn Phúc (Ông Ngoại - Họ Lê)'],
        familyConnection: 'Liên kết Thông Gia (Họ Nguyễn 💖 Họ Lê)',
      });
    } else {
      setResult({
        relationshipTitle: 'Chú / Cậu Họ (Bên Ngoại)',
        description: 'Mối quan hệ họ hàng qua dòng họ liên kết.',
        path: ['Thành viên A', 'Bố/Mẹ', 'Bác/Chú/Cậu B'],
        familyConnection: 'Quan hệ Họ Hàng Liên Dòng Họ',
      });
    }
  };

  return (
    <div className="relationship-finder-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '22px',
            boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)',
          }}
        >
          ✨
        </div>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Tra Cứu Cách Xưng Hô & Mối Quan Hệ
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748b' }}>
            Chọn 2 người bất kỳ trong gia tộc để tự động tìm câu xưng hô phù hợp và sơ đồ họ hàng.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto',
          gap: '16px',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          padding: '24px',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>
            NGƯỜI XƯNG (NGƯỜI GỌI)
          </label>
          <select
            value={person1}
            onChange={(e) => setPerson1(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              color: '#0f172a',
              outline: 'none',
            }}
          >
            {memberOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.info})
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '18px',
          }}
        >
          ↔
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>
            NGƯỜI ĐƯỢC GỌI
          </label>
          <select
            value={person2}
            onChange={(e) => setPerson2(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              color: '#0f172a',
              outline: 'none',
            }}
          >
            {memberOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.info})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCalculate}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            padding: '14px 24px',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 10px 24px rgba(37, 99, 235, 0.22)',
            transition: 'transform 0.2s',
          }}
        >
          Tìm Xưng Hô
        </button>
      </div>

      {result && (
        <div
          style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '24px',
            border: '1px solid #bae6fd',
            padding: '24px',
            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0369a1', letterSpacing: '0.06em' }}>
              💡 DANH XƯNG GỢI Ý
            </div>
            <span style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '999px', backgroundColor: '#ffffff', color: '#0284c7', fontWeight: 800 }}>
              {result.familyConnection}
            </span>
          </div>

          <h4 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {result.relationshipTitle}
          </h4>

          <p style={{ margin: '0 0 18px', fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
            {result.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1' }}>Đường đi huyết thống:</span>
            {result.path.map((step, idx) => (
              <React.Fragment key={idx}>
                <span
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    fontSize: '13px',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  {step}
                </span>
                {idx < result.path.length - 1 && <span style={{ color: '#0284c7', fontWeight: 800 }}>➔</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipFinderWidget;
