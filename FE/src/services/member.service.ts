import apiClient from '../api/axios';
import type { Family, Member, MemberDetail, MemberListResponse } from '../types/member';

export const MOCK_FAMILIES: Family[] = [
  {
    id: 'family_001',
    name: 'Dòng họ Nguyễn',
    founderName: 'Nguyễn Văn Tý (Cụ Thủy Tổ)',
    originPlace: 'Làng An Bằng, Thừa Thiên Huế',
    status: 'active',
    memberCount: 128,
  },
  {
    id: 'family_002',
    name: 'Dòng họ Trần',
    founderName: 'Trần Văn Hùng',
    originPlace: 'Nam Định',
    status: 'active',
    memberCount: 86,
  },
  {
    id: 'family_003',
    name: 'Dòng họ Lê',
    founderName: 'Lê Văn Thái',
    originPlace: 'Thanh Hóa',
    status: 'active',
    memberCount: 64,
  },
  {
    id: 'family_004',
    name: 'Dòng họ Phạm',
    founderName: 'Phạm Văn Đức',
    originPlace: 'Quảng Nam',
    status: 'active',
    memberCount: 42,
  },
];

export const MOCK_MEMBERS: MemberDetail[] = [
  {
    id: 'member_001',
    familyId: 'family_001',
    familyName: 'Dòng họ Nguyễn',
    fullName: 'Nguyễn Văn Tý',
    otherName: 'Cụ Thủy Tổ Tý',
    gender: 'male',
    birthDate: '1901-01-15',
    deathDate: '1982-08-20',
    lunarDeathDate: '02/07 Âm lịch',
    isAlive: false,
    branch: 'Chi Trưởng',
    subBranch: 'Nhánh 1',
    generation: 1,
    occupation: 'Thầy đồ & Nông dân',
    education: 'Chữ Nho',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    status: 'deceased',
    displayOrder: 1,
    isPrimary: true,
    bio: 'Cụ Thủy tổ sáng lập ra dòng họ Nguyễn tại Phú Lộc. Cụ có công khai hoang lập làng và khai mở phong trào hiếu học trong vùng.',
    galleryPhotos: [
      { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800', caption: 'Ảnh tư liệu cụ Tý năm 1970' },
      { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800', caption: 'Nhà thờ tổ thời sơ khai' },
    ],
    careerHistory: [
      { period: '1920 - 1945', role: 'Dạy chữ Nho cho con em trong làng', organization: 'Lớp học làng An Bằng' },
      { period: '1945 - 1975', role: 'Hội đồng Tộc biểu dòng họ', organization: 'Hội đồng Gia tộc Họ Nguyễn' },
    ],
    contact: {
      phone: '0912345678',
      email: 'nguyenvanan.admin@gmail.com',
      address: 'Xã Phú Lộc, Hương Thủy, Thừa Thiên Huế',
    },
    privacySettings: { show_phone: true, show_email: true, show_address: true },
    contribution: { ability: 'Lãnh đạo', specialty: 'Lập phả hệ', field: 'Quản trị gia tộc' },
    contacts: [
      { id: 'c1', contactType: 'phone', contactValue: '0912345678', isPrimary: true, isPublic: true },
      { id: 'c2', contactType: 'email', contactValue: 'nguyenvanan.admin@gmail.com', isPrimary: true, isPublic: true },
    ],
    lifeEvents: [
      { id: 'e1', eventType: 'BIRTH', title: 'Sinh ra tại Làng An Bằng', eventDate: '1901-01-15' },
      { id: 'e2', eventType: 'DEATH', title: 'Tạ thế thọ 81 tuổi', eventDate: '1982-08-20' },
    ],
    media: [
      { id: 'm1', mediaType: 'PHOTO', mediaUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', caption: 'Chân dung cụ Tý', sortOrder: 1 },
    ],
    skills: [
      { id: 's1', skillName: 'Chữ Nho', category: 'Văn hóa', proficiencyLevel: 'EXPERT' },
      { id: 's2', skillName: 'Quản trị Gia tộc', category: 'Lãnh đạo', proficiencyLevel: 'ADVANCED' },
    ],
  },
  {
    id: 'member_002',
    familyId: 'family_001',
    familyName: 'Dòng họ Nguyễn',
    fullName: 'Nguyễn Thị Lan',
    otherName: 'Cụ Bà Lan',
    gender: 'female',
    birthDate: '1905-03-20',
    deathDate: '1988-11-12',
    lunarDeathDate: '04/10 Âm lịch',
    isAlive: false,
    branch: 'Chi Trưởng',
    generation: 1,
    occupation: 'Nội trợ',
    status: 'deceased',
    displayOrder: 2,
    isPrimary: false,
    bio: 'Cụ bà đức hạnh, hết lòng chăm lo gia đình và nuôi dạy con cháu thành tài.',
    galleryPhotos: [],
    careerHistory: [],
    contacts: [],
    lifeEvents: [],
    media: [],
    skills: [],
  },
  {
    id: 'member_003',
    familyId: 'family_001',
    familyName: 'Dòng họ Nguyễn',
    fullName: 'Nguyễn Văn An',
    gender: 'male',
    birthDate: '1945-05-10',
    isAlive: true,
    branch: 'Chi Trưởng',
    generation: 2,
    fatherId: 'member_001',
    motherId: 'member_002',
    occupation: 'Kỹ sư Nông nghiệp',
    education: 'Đại học Nông Lâm',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    status: 'active',
    displayOrder: 3,
    isPrimary: true,
    bio: 'Trưởng chi thế hệ 2, nguyên Trưởng ban liên lạc dòng họ Nguyễn tại Huế.',
    galleryPhotos: [],
    careerHistory: [],
    contacts: [],
    lifeEvents: [],
    media: [],
    skills: [],
  },
  {
    id: 'member_004',
    familyId: 'family_001',
    familyName: 'Dòng họ Nguyễn',
    fullName: 'Nguyễn Văn Hùng',
    gender: 'male',
    birthDate: '1975-09-18',
    isAlive: true,
    branch: 'Chi Trưởng',
    generation: 3,
    fatherId: 'member_003',
    occupation: 'Kỹ sư Phần mềm',
    education: 'Đại học Bách Khoa',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    status: 'active',
    displayOrder: 4,
    isPrimary: true,
    bio: 'Chủ trì dự án Số hóa Hệ thống Gia Phả Liên Họ.',
    galleryPhotos: [],
    careerHistory: [],
    contacts: [],
    lifeEvents: [],
    media: [],
    skills: [],
  },
  {
    id: 'member_005',
    familyId: 'family_002',
    familyName: 'Dòng họ Trần',
    fullName: 'Trần Thị Thảo',
    gender: 'female',
    birthDate: '1978-12-05',
    isAlive: true,
    branch: 'Chi Trưởng',
    generation: 3,
    occupation: 'Bác sĩ Y học Cổ truyền',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    status: 'active',
    displayOrder: 5,
    isPrimary: true,
    bio: 'Trưởng ban Liên lạc Họ Trần, phụ trách kết nối thông gia liên họ.',
    galleryPhotos: [],
    careerHistory: [],
    contacts: [],
    lifeEvents: [],
    media: [],
    skills: [],
  },
];

export async function fetchMembers(params?: {
  familyId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<MemberListResponse> {
  try {
    const res = await apiClient.get('/members', {
      params: {
        family_id: params?.familyId,
        search: params?.search,
        page: params?.page || 1,
        limit: params?.limit || 20,
      },
    });

    if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
      return res.data;
    }
  } catch (err) {
    console.warn('API fetchMembers fallback to mock data:', err);
  }

  // Fallback to MOCK_MEMBERS
  let filtered = [...MOCK_MEMBERS];
  if (params?.familyId) {
    filtered = filtered.filter((m) => m.familyId === params.familyId);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (m) => m.fullName.toLowerCase().includes(q) || (m.otherName && m.otherName.toLowerCase().includes(q))
    );
  }

  return {
    items: filtered,
    total: filtered.length,
    page: params?.page || 1,
    limit: params?.limit || 20,
    totalPages: 1,
  };
}

export async function fetchMemberDetail(memberId: string): Promise<MemberDetail | null> {
  try {
    const res = await apiClient.get(`/members/${memberId}`);
    if (res.data && res.data.id) {
      return res.data;
    }
  } catch (err) {
    console.warn(`API fetchMemberDetail fallback for ${memberId}:`, err);
  }

  const found = MOCK_MEMBERS.find((m) => m.id === memberId);
  return found || MOCK_MEMBERS[0];
}

export async function fetchFamilies(): Promise<Family[]> {
  try {
    const res = await apiClient.get('/families');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (err) {
    console.warn('API fetchFamilies fallback to MOCK_FAMILIES:', err);
  }

  return MOCK_FAMILIES;
}
