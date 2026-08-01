import React from 'react';
import type { MemberDetail } from '../../../types/member';
import '../Profile.css';
import './ContactTab.css';

export interface ContactTabProps {
  member: MemberDetail;
}

export const ContactTab: React.FC<ContactTabProps> = ({ member }) => {
  const contacts = member.contacts || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="profile-card">
        <h3 className="profile-card-title">Thông Tin Liên Hệ Thực (PostgreSQL)</h3>
        {contacts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {contacts.map((c) => (
              <div key={c.id} className="contact-item-row">
                <div className="contact-icon-badge">
                  {c.contactType === 'email' ? '✉️' : c.contactType === 'phone' ? '📱' : '💬'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    {c.contactType} {c.isPrimary && <span style={{ color: '#2563eb' }}>(Chính)</span>}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{c.contactValue}</div>
                </div>
              </div>
            ))}
          </div>
        ) : member.contact ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {member.contact.phone && (
              <div className="contact-item-row">
                <div className="contact-icon-badge">📱</div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>SỐ ĐIỆN THOẠI</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{member.contact.phone}</div>
                </div>
              </div>
            )}
            {member.contact.email && (
              <div className="contact-item-row">
                <div className="contact-icon-badge">✉️</div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>EMAIL</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{member.contact.email}</div>
                </div>
              </div>
            )}
            {member.contact.address && (
              <div className="contact-item-row">
                <div className="contact-icon-badge">🏠</div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>ĐỊA CHỈ THƯỜNG TRÚ</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{member.contact.address}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="profile-empty">Chưa có thông tin liên hệ nào.</div>
        )}
      </div>
    </div>
  );
};

export default ContactTab;
