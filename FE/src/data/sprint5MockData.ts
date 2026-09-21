export type ProposalStatus = 'pending' | 'approved' | 'rejected';

export interface ProposalRecord {
  id: string;
  proposerName: string;
  proposerInitial: string;
  targetName: string;
  type: 'profile' | 'relationship';
  relationship: string;
  currentValue: string;
  proposedValue: string;
  reason: string;
  status: ProposalStatus;
  createdAt: string;
  adminNote?: string;
}

export const proposalMockData: ProposalRecord[] = [
  { id: 'DX-260912', proposerName: 'Nguyễn Văn Minh', proposerInitial: 'M', targetName: 'Nguyễn Văn An', type: 'profile', relationship: 'Thông tin học vấn', currentValue: 'Cử nhân', proposedValue: 'Thạc sĩ Công nghệ thông tin', reason: 'Bổ sung văn bằng tốt nghiệp năm 2025.', status: 'pending', createdAt: '12/09/2026 14:30' },
  { id: 'DX-260908', proposerName: 'Nguyễn Thị Lan', proposerInitial: 'L', targetName: 'Nguyễn Đức Anh', type: 'relationship', relationship: 'Quan hệ cha – con', currentValue: 'Chưa liên kết', proposedValue: 'Con trai của Nguyễn Văn Minh', reason: 'Đối chiếu theo giấy khai sinh và sổ gia đình.', status: 'pending', createdAt: '08/09/2026 09:15' },
  { id: 'DX-260901', proposerName: 'Trần Thu Hà', proposerInitial: 'H', targetName: 'Nguyễn Thị Hồng', type: 'profile', relationship: 'Ngày sinh', currentValue: '12/05/1988', proposedValue: '10/05/1988', reason: 'Điều chỉnh theo căn cước công dân.', status: 'approved', createdAt: '01/09/2026 16:45', adminNote: 'Đã kiểm tra minh chứng và cập nhật.' },
  { id: 'DX-260827', proposerName: 'Nguyễn Văn Nam', proposerInitial: 'N', targetName: 'Nguyễn Văn Bình', type: 'relationship', relationship: 'Quan hệ anh – em', currentValue: 'Anh họ', proposedValue: 'Anh ruột', reason: 'Quan hệ trực hệ theo gia phả giấy đời thứ tư.', status: 'rejected', createdAt: '27/08/2026 10:20', adminNote: 'Minh chứng chưa đủ để xác nhận.' },
  { id: 'DX-260821', proposerName: 'Phạm Mai Anh', proposerInitial: 'A', targetName: 'Nguyễn Hoàng Long', type: 'profile', relationship: 'Nơi cư trú', currentValue: 'Hà Nội', proposedValue: 'Đà Nẵng', reason: 'Gia đình đã chuyển nơi cư trú từ tháng 06/2026.', status: 'approved', createdAt: '21/08/2026 08:05' },
  { id: 'DX-260815', proposerName: 'Nguyễn Thị Mai', proposerInitial: 'M', targetName: 'Nguyễn Gia Bảo', type: 'relationship', relationship: 'Quan hệ mẹ – con', currentValue: 'Chưa liên kết', proposedValue: 'Con trai của Nguyễn Thị Mai', reason: 'Bổ sung thành viên mới vào chi trưởng.', status: 'pending', createdAt: '15/08/2026 19:10' },
];

export interface MemorialRecord {
  id: string;
  name: string;
  initial: string;
  generation: number;
  deathDate: string;
  memorialDate: string;
  lunarDate: string;
  relationship: string;
  reminder: boolean;
  notes: string;
}

export const memorialMockData: MemorialRecord[] = [
  { id: 'GT-001', name: 'Cụ Nguyễn Văn Tông', initial: 'T', generation: 1, deathDate: '18/10/1952', memorialDate: '15/08/2026', lunarDate: '15 tháng 8 Âm lịch', relationship: 'Thủy tổ', reminder: true, notes: 'Lễ giỗ tổ tổ chức tại từ đường, bắt đầu lúc 08:00.' },
  { id: 'GT-002', name: 'Cụ bà Trần Thị Hạnh', initial: 'H', generation: 2, deathDate: '04/04/1971', memorialDate: '22/09/2026', lunarDate: '12 tháng 8 Âm lịch', relationship: 'Cụ bà đời thứ 2', reminder: true, notes: 'Chuẩn bị hoa sen và mâm cơm chay.' },
  { id: 'GT-003', name: 'Ông Nguyễn Văn Phúc', initial: 'P', generation: 3, deathDate: '21/11/1998', memorialDate: '21/11/2026', lunarDate: '13 tháng 10 Âm lịch', relationship: 'Ông nội', reminder: false, notes: 'Tưởng niệm tại nhà trưởng chi Hải Dương.' },
  { id: 'GT-004', name: 'Bà Nguyễn Thị Lệ', initial: 'L', generation: 3, deathDate: '06/02/2003', memorialDate: '06/02/2027', lunarDate: '20 tháng Chạp Âm lịch', relationship: 'Bà cô', reminder: true, notes: 'Nhắc trước 7 ngày để các gia đình sắp xếp.' },
  { id: 'GT-005', name: 'Ông Nguyễn Đức Thành', initial: 'T', generation: 4, deathDate: '14/07/2017', memorialDate: '14/07/2027', lunarDate: '01 tháng 6 Âm lịch', relationship: 'Bác trưởng', reminder: false, notes: 'Lễ tưởng niệm nội bộ chi trưởng.' },
  { id: 'GT-006', name: 'Bà Phạm Thị Xuân', initial: 'X', generation: 4, deathDate: '02/01/2020', memorialDate: '02/01/2027', lunarDate: '24 tháng 11 Âm lịch', relationship: 'Bác dâu', reminder: true, notes: 'Thắp hương tại phần mộ trước buổi lễ.' },
];

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type RsvpStatus = 'confirmed' | 'pending' | 'declined';

export interface EventParticipant {
  id: string;
  name: string;
  initial: string;
  relationship: string;
  rsvp: RsvpStatus;
}

export interface FamilyEventRecord {
  id: string;
  name: string;
  type: 'meeting' | 'ceremony' | 'scholarship' | 'trip';
  description: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  organizer: string;
  status: EventStatus;
  notes: string;
  participants: EventParticipant[];
}

export const eventMockData: FamilyEventRecord[] = [
  { id: 'SK-2601', name: 'Đại hội Dòng họ Nguyễn lần thứ V', type: 'meeting', description: 'Tổng kết hoạt động và kiện toàn Hội đồng gia tộc nhiệm kỳ mới.', startDate: '15/10/2026', endDate: '15/10/2026', time: '08:00 – 12:00', location: 'Nhà thờ tổ, Hà Nội', organizer: 'Hội đồng gia tộc', status: 'upcoming', notes: 'Trang phục lịch sự, có mặt trước 30 phút.', participants: [
    { id: 'TV-01', name: 'Nguyễn Văn Minh', initial: 'M', relationship: 'Đời thứ 4 · Chi trưởng', rsvp: 'confirmed' },
    { id: 'TV-02', name: 'Nguyễn Thị Lan', initial: 'L', relationship: 'Đời thứ 4 · Chi hai', rsvp: 'confirmed' },
    { id: 'TV-03', name: 'Nguyễn Đức Anh', initial: 'A', relationship: 'Đời thứ 5 · Chi trưởng', rsvp: 'pending' },
  ] },
  { id: 'SK-2602', name: 'Lễ trao Quỹ Khuyến học 2026', type: 'scholarship', description: 'Tuyên dương con cháu có thành tích học tập xuất sắc.', startDate: '02/09/2026', endDate: '02/09/2026', time: '09:00 – 11:30', location: 'Từ đường chi họ Hải Dương', organizer: 'Ban Khuyến học', status: 'completed', notes: 'Danh sách nhận thưởng được niêm yết trước sự kiện.', participants: [
    { id: 'TV-04', name: 'Nguyễn Gia Bảo', initial: 'B', relationship: 'Đời thứ 5 · Chi hai', rsvp: 'confirmed' },
    { id: 'TV-05', name: 'Nguyễn Hoàng Long', initial: 'L', relationship: 'Đời thứ 5 · Chi trưởng', rsvp: 'confirmed' },
  ] },
  { id: 'SK-2603', name: 'Lễ tảo mộ đầu xuân', type: 'ceremony', description: 'Dọn dẹp, thắp hương các phần mộ tổ tiên và gặp mặt đầu năm.', startDate: '10/02/2027', endDate: '10/02/2027', time: '07:30 – 11:00', location: 'Nghĩa trang gia tộc, Nam Định', organizer: 'Ban Nghi lễ', status: 'upcoming', notes: 'Có xe chung xuất phát từ từ đường lúc 06:30.', participants: [
    { id: 'TV-06', name: 'Nguyễn Văn Nam', initial: 'N', relationship: 'Đời thứ 4 · Chi ba', rsvp: 'pending' },
  ] },
  { id: 'SK-2604', name: 'Hành trình về nguồn', type: 'trip', description: 'Thăm quê tổ và tìm hiểu các tư liệu gia phả cổ.', startDate: '18/12/2026', endDate: '20/12/2026', time: '06:00 – 18:00', location: 'Ninh Bình – Thanh Hóa', organizer: 'Ban Thanh niên', status: 'upcoming', notes: 'Đăng ký trước 01/12; số lượng tối đa 45 người.', participants: [] },
  { id: 'SK-2605', name: 'Họp Ban đại diện quý III', type: 'meeting', description: 'Rà soát công việc gia tộc và kế hoạch cuối năm.', startDate: '28/09/2026', endDate: '28/09/2026', time: '19:30 – 21:00', location: 'Trực tuyến', organizer: 'Trưởng tộc', status: 'ongoing', notes: 'Liên kết phòng họp được gửi trước 1 ngày.', participants: [] },
];

export type FundTransactionType = 'income' | 'expense';
export type FundTransactionStatus = 'confirmed' | 'pending' | 'cancelled';

export interface FundTransactionRecord {
  id: string;
  type: FundTransactionType;
  amount: number;
  description: string;
  party: string;
  date: string;
  createdBy: string;
  status: FundTransactionStatus;
}

export const fundTransactionMockData: FundTransactionRecord[] = [
  { id: 'GD-260901', type: 'income', amount: 5000000, description: 'Đóng góp tu bổ từ đường', party: 'Gia đình ông Nguyễn Văn Minh', date: '01/09/2026', createdBy: 'Nguyễn Thị Lan', status: 'confirmed' },
  { id: 'GD-260902', type: 'expense', amount: 2400000, description: 'Mua vật tư sửa mái ngói', party: 'Cửa hàng An Phát', date: '03/09/2026', createdBy: 'Nguyễn Văn Nam', status: 'confirmed' },
  { id: 'GD-260903', type: 'income', amount: 3000000, description: 'Ủng hộ Quỹ Khuyến học', party: 'Nguyễn Hoàng Long', date: '05/09/2026', createdBy: 'Nguyễn Thị Lan', status: 'pending' },
  { id: 'GD-260904', type: 'expense', amount: 1500000, description: 'Chi phần thưởng học sinh giỏi', party: 'Ban Khuyến học', date: '07/09/2026', createdBy: 'Nguyễn Văn Minh', status: 'confirmed' },
  { id: 'GD-260905', type: 'income', amount: 10000000, description: 'Đóng góp thường niên Chi trưởng', party: 'Chi trưởng Hà Nội', date: '09/09/2026', createdBy: 'Nguyễn Thị Lan', status: 'confirmed' },
  { id: 'GD-260906', type: 'expense', amount: 850000, description: 'Hoa và lễ vật ngày giỗ', party: 'Ban Nghi lễ', date: '11/09/2026', createdBy: 'Nguyễn Đức Anh', status: 'pending' },
  { id: 'GD-260907', type: 'income', amount: 2000000, description: 'Ủng hộ quỹ tương trợ', party: 'Nguyễn Thị Mai', date: '12/09/2026', createdBy: 'Nguyễn Thị Lan', status: 'confirmed' },
  { id: 'GD-260908', type: 'expense', amount: 4200000, description: 'Hỗ trợ gia đình thành viên khó khăn', party: 'Gia đình bà Nguyễn Thị Hồng', date: '13/09/2026', createdBy: 'Nguyễn Văn Minh', status: 'confirmed' },
];

export type ArchiveFileType = 'photo' | 'document' | 'video' | 'audio' | 'record';

export interface ArchiveRecord {
  id: string;
  name: string;
  type: ArchiveFileType;
  owner: string;
  uploadDate: string;
  size: string;
  tags: string[];
  description: string;
}

export const archiveMockData: ArchiveRecord[] = [
  { id: 'TL-001', name: 'Gia phả chữ Hán năm 1928.pdf', type: 'document', owner: 'Nguyễn Văn Minh', uploadDate: '12/09/2026', size: '8.4 MB', tags: ['Gia phả cổ', 'Chi trưởng'], description: 'Bản scan gia phả giấy được lưu giữ tại từ đường.' },
  { id: 'TL-002', name: 'Ảnh đại hội dòng họ 1986.jpg', type: 'photo', owner: 'Nguyễn Thị Lan', uploadDate: '10/09/2026', size: '3.2 MB', tags: ['Đại hội', 'Ảnh lịch sử'], description: 'Ảnh tập thể đại hội dòng họ lần thứ nhất.' },
  { id: 'TL-003', name: 'Phỏng vấn cụ Nguyễn Văn Tâm.mp4', type: 'video', owner: 'Nguyễn Đức Anh', uploadDate: '08/09/2026', size: '126 MB', tags: ['Ký ức', 'Nhân chứng'], description: 'Chia sẻ về lịch sử di cư của chi họ Hải Dương.' },
  { id: 'TL-004', name: 'Lời kể về từ đường.m4a', type: 'audio', owner: 'Nguyễn Hoàng Long', uploadDate: '04/09/2026', size: '18.7 MB', tags: ['Từ đường', 'Ghi âm'], description: 'Bản ghi âm câu chuyện xây dựng từ đường năm 1932.' },
  { id: 'TL-005', name: 'Sắc phong triều Nguyễn.scan', type: 'record', owner: 'Ban Tư liệu', uploadDate: '29/08/2026', size: '42 MB', tags: ['Sắc phong', 'Di sản'], description: 'Bộ ảnh độ phân giải cao của sắc phong gia tộc.' },
  { id: 'TL-006', name: 'Danh sách thành viên năm 1975.xlsx', type: 'document', owner: 'Ban Thư ký', uploadDate: '25/08/2026', size: '1.1 MB', tags: ['Thành viên', 'Lưu trữ'], description: 'Danh sách số hóa từ sổ ghi chép của trưởng tộc.' },
  { id: 'TL-007', name: 'Lễ giỗ tổ 2025.mp4', type: 'video', owner: 'Nguyễn Thị Mai', uploadDate: '20/08/2026', size: '214 MB', tags: ['Ngày giỗ', 'Nghi lễ'], description: 'Video tổng hợp lễ giỗ tổ năm 2025.' },
  { id: 'TL-008', name: 'Chân dung cụ bà Trần Thị Hạnh.png', type: 'photo', owner: 'Nguyễn Văn Nam', uploadDate: '18/08/2026', size: '5.6 MB', tags: ['Chân dung', 'Đời thứ 2'], description: 'Ảnh chân dung đã được phục dựng màu.' },
];
