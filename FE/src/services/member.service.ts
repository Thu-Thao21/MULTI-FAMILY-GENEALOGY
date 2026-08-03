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
        limit: params?.limit || 20,
      },
    });
    return {
      items: Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [],
      total: res.data?.total || 0,
      page: res.data?.page || 1,
      limit: res.data?.limit || 20,
      totalPages: res.data?.totalPages || 0,
    };
  } catch (err) {
    console.warn('API fetchMembers error (DB empty or endpoint offline):', err);
    return { items: [], total: 0, page: 1, limit: 20, totalPages: 0 };
  }
}

export async function fetchMemberDetail(memberId: string): Promise<MemberDetail | null> {
  try {
    const res = await apiClient.get(`/members/${memberId}`);
    return res.data ?? null;
  } catch (err) {
    console.warn(`API fetchMemberDetail error for ${memberId}:`, err);
    return null;
  }
}

export async function fetchFamilies(): Promise<Family[]> {
  try {
    const res = await apiClient.get('/families');
    return Array.isArray(res.data) ? res.data : Array.isArray(res.data?.items) ? res.data.items : [];
  } catch (err) {
    console.warn('API fetchFamilies error (DB empty or endpoint offline):', err);
    return [];
  }
}
