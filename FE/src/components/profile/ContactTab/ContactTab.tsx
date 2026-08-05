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
    <div className="contact-tab-wrapper">
      <div className="profile-card">
        <h3 className="profile-card-title">Thông Tin Liên Hệ Thực (PostgreSQL)</h3>
        {contacts.length > 0 ? (
          <div className="contact-item-list">
            {contacts.map((c) => (
              <div key={c.id} className="contact-item-row">
                <div className="contact-icon-badge">
                  {c.contactType === 'email' ? '' : c.contactType === 'phone' ? '' : ''}
                </div>
                <div className="contact-item-content">
                  <div className="contact-type-label">
                    {c.contactType} {c.isPrimary && <span className="contact-primary-badge">(Chính)</span>}
                  </div>
                  <div className="contact-value-text">{c.contactValue}</div>
                </div>
              </div>
            ))}
          </div>
        ) : member.contact ? (
          <div className="contact-item-list">
            {member.contact.phone && (
              <div className="contact-item-row">
                <div className="contact-icon-badge"></div>
                <div>
                  <div className="contact-type-label">SỐ ĐIỆN THOẠI</div>
                  <div className="contact-value-text">{member.contact.phone}</div>
                </div>
              </div>
            )}
            {member.contact.email && (
              <div className="contact-item-row">
                <div className="contact-icon-badge"></div>
                <div>
                  <div className="contact-type-label">EMAIL</div>
                  <div className="contact-value-text">{member.contact.email}</div>
                </div>
              </div>
            )}
            {member.contact.address && (
              <div className="contact-item-row">
                <div className="contact-icon-badge"></div>
                <div>
                  <div className="contact-type-label">ĐỊA CHỈ THƯỜNG TRÚ</div>
                  <div className="contact-value-text">{member.contact.address}</div>
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
