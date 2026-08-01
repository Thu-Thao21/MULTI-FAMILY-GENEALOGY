import apiClient from '../api/axios';
import type { Family, Member, MemberDetail, MemberListResponse } from '../types/member';

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
    return res.data;
  } catch (err) {
    console.warn('API Error fetching members, returning empty list:', err);
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 1,
    };
  }
}

export async function fetchMemberDetail(memberId: string): Promise<MemberDetail | null> {
  try {
    const res = await apiClient.get(`/members/${memberId}`);
    return res.data;
  } catch (err) {
    console.warn(`API Error fetching member detail for ${memberId}:`, err);
    return null;
  }
}

export async function fetchFamilies(): Promise<Family[]> {
  try {
    const res = await apiClient.get('/families');
    return res.data;
  } catch (err) {
    console.warn('API Error fetching families:', err);
    return [];
  }
}
