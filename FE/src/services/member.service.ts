import apiClient from '../api/axios';
import type { Family, MemberDetail, MemberListResponse } from '../types/member';

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
        limit: params?.limit || 100,
      },
    });
    const items = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
    return {
      items,
      total: res.data?.total || items.length,
      page: res.data?.page || 1,
      limit: res.data?.limit || 100,
      totalPages: res.data?.totalPages || 1,
    };
  } catch (err) {
    console.error('API fetchMembers error:', err);
    return { items: [], total: 0, page: 1, limit: 100, totalPages: 0 };
  }
}

export const MOCK_MEMBER_DETAIL: MemberDetail = {
  id: 'mem_001',
  fullName: 'Nguyễn Văn Minh',
  otherName: 'Minh Đức',
  gender: 'male',
  birthDate: '1978-05-15',
  isAlive: true,
  generation: 4,
  branch: 'Chi Trưởng',
  subBranch: 'Nhánh 1',
  familyName: 'Dòng họ Nguyễn · Nam Định',
  occupation: 'Kỹ sư Xây dựng',
  education: 'Đại học Bách Khoa',
  bio: 'Trưởng tộc đời thứ 4, tích cực tham gia các hoạt động dòng họ.',
  avatarUrl: '',
  phone: '0912345678',
  email: 'minh.nguyen@example.vn',
  address: 'Hà Nội, Việt Nam',
  careerHistory: [
    { period: '2015 - Nay', role: 'Giám đốc Kỹ thuật', organization: 'Công ty Cổ phần Xây dựng Hà Nội' },
  ],
  awards: ['Bằng khen Dòng họ cống hiến 2024'],
  contacts: [{ type: 'phone', value: '0912345678' }],
  lifeEvents: [{ year: 1978, title: 'Sinh ra tại Nam Định' }],
  mediaList: [],
  skills: ['Quản lý', 'Giao tiếp'],
};

export async function fetchMemberDetail(memberId: string): Promise<MemberDetail | null> {
  try {
    const res = await apiClient.get(`/members/${memberId}`);
    if (res.data) return res.data;
    return { ...MOCK_MEMBER_DETAIL, id: memberId };
  } catch (err) {
    console.warn(`API fetchMemberDetail fallback for ${memberId}`);
    return { ...MOCK_MEMBER_DETAIL, id: memberId || 'mem_001' };
  }
}

export async function fetchFamilies(): Promise<Family[]> {
  try {
    const res = await apiClient.get('/families');
    const fams = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.items) ? res.data.items : [];
    return fams;
  } catch (err) {
    console.error('API fetchFamilies error:', err);
    return [];
  }
}
