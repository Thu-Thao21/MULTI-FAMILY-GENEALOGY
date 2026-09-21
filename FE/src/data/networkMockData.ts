import type { FamilyLinkRequest, FamilyNetwork, InLawMarriage } from '../types/network';

export const mockFamilyNetworks: FamilyNetwork[] = [
  { id: 'NET-N01', name: 'Dòng họ Nguyễn · Nam Định', founderName: 'Cụ Nguyễn Văn An', originPlace: 'Xuân Trường, Nam Định', history: 'Dòng họ gốc hình thành từ đầu thế kỷ XIX.', description: 'Trực hệ chính', branches: ['Chi Trưởng', 'Chi Hai', 'Chi Ba'], status: 'connected', category: 'noi', memberCount: 428, linkedSince: '2024-03-12' },
  { id: 'NET-N02', name: 'Chi họ Nguyễn · Hải Dương', founderName: 'Cụ Nguyễn Văn Phúc', originPlace: 'Gia Lộc, Hải Dương', history: 'Chi nhánh được xác nhận từ gia phả giấy năm 1928.', description: 'Chi trực hệ', branches: ['Chi Gia Tân'], status: 'connected', category: 'noi', memberCount: 86, linkedSince: '2025-06-08' },
  { id: 'NET-G01', name: 'Dòng họ Phạm · Hải Dương', founderName: 'Cụ Phạm Công Thành', originPlace: 'Gia Lộc, Hải Dương', history: 'Dòng họ bên ngoại của bà Nguyễn Thị Lan.', description: 'Quan hệ bên mẹ', branches: ['Chi Gia Tân', 'Chi Hà Nội'], status: 'connected', category: 'ngoai', memberCount: 214, linkedSince: '2026-01-18' },
  { id: 'NET-G02', name: 'Dòng họ Vũ · Thái Bình', founderName: 'Cụ Vũ Văn Khải', originPlace: 'Vũ Thư, Thái Bình', history: 'Liên kết ngoại tộc đã đối chiếu từ hồ sơ hôn nhân.', description: 'Quan hệ bên mẹ', branches: ['Chi Đông Hưng'], status: 'pending', category: 'ngoai', memberCount: 163 },
  { id: 'NET-T01', name: 'Dòng họ Trần · Hải Hậu', founderName: 'Cụ Trần Đức Phúc', originPlace: 'Hải Hậu, Nam Định', history: 'Quan hệ thông gia được ghi nhận từ năm 1998.', description: 'Thông gia', branches: ['Chi Đông', 'Chi Tây'], status: 'connected', category: 'thong-gia', memberCount: 301, linkedSince: '2025-11-02' },
  { id: 'NET-T02', name: 'Dòng họ Lê · Quảng Trị', founderName: 'Cụ Lê Văn Hiển', originPlace: 'Triệu Phong, Quảng Trị', history: 'Liên kết qua hôn nhân của thành viên đời thứ năm.', description: 'Thông gia', branches: ['Chi Triệu Phong'], status: 'pending', category: 'thong-gia', memberCount: 122 },
];

export const mockInLawMarriages: InLawMarriage[] = [
  { id: 'HN-001', husbandName: 'Nguyễn Văn Minh', husbandFamily: 'Họ Nguyễn · Chi Trưởng', wifeName: 'Phạm Thị Lan', wifeFamily: 'Họ Phạm · Hải Dương', marriageDate: '18/10/1998', status: 'verified', notes: 'Liên kết đã được hai dòng họ xác nhận.' },
  { id: 'HN-002', husbandName: 'Trần Quốc Anh', husbandFamily: 'Họ Trần · Hải Hậu', wifeName: 'Nguyễn Thị Hồng', wifeFamily: 'Họ Nguyễn · Chi Hai', marriageDate: '12/03/2008', status: 'verified', notes: 'Quan hệ thông gia đời thứ năm.' },
  { id: 'HN-003', husbandName: 'Nguyễn Hoàng Long', husbandFamily: 'Họ Nguyễn · Chi Ba', wifeName: 'Lê Thu Hà', wifeFamily: 'Họ Lê · Quảng Trị', marriageDate: '05/05/2025', status: 'pending', notes: 'Đang chờ dòng họ Lê xác nhận.' },
];

export const mockLinkRequests: FamilyLinkRequest[] = [
  { id: 'REQ-001', sourceFamilyId: 'NET-N01', sourceFamilyName: 'Dòng họ Nguyễn · Nam Định', targetFamilyId: 'NET-T01', targetFamilyName: 'Dòng họ Trần · Hải Hậu', requestType: 'affiliated', status: 'approved', message: 'Xác nhận quan hệ thông gia.', createdAt: '2026-09-01' },
  { id: 'REQ-002', sourceFamilyId: 'NET-N01', sourceFamilyName: 'Dòng họ Nguyễn · Nam Định', targetFamilyId: 'NET-T02', targetFamilyName: 'Dòng họ Lê · Quảng Trị', requestType: 'marriage', status: 'pending', message: 'Đề nghị xác minh hôn nhân đời thứ năm.', createdAt: '2026-09-12' },
];
