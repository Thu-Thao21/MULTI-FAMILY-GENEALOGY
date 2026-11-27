import apiClient from '../api/axios';
import type { Family, MemberDetail, MemberListResponse } from '../types/member';
import { getCached, setCached, invalidateCache } from '../utils/memoryCache';

const inFlight = new Map<string, Promise<unknown>>();

function dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const promise = fn().finally(() => {
    inFlight.delete(key);
  });
  inFlight.set(key, promise);
  return promise;
}

export async function fetchMembers(params?: {
  familyId?: string;
  search?: string;
  page?: number;
  limit?: number;
  forceRefresh?: boolean;
}): Promise<MemberListResponse> {
  const familyId = params?.familyId || '';
  const search = params?.search || '';
  const page = params?.page || 1;
  const limit = params?.limit || 100;
  const cacheKey = `members:${familyId}:${search}:${page}:${limit}`;

  if (!params?.forceRefresh && !search) {
    const cached = getCached<MemberListResponse>(cacheKey);
    if (cached && !cached.isStale) {
      return cached.data;
    }
  }

  return dedupe(cacheKey, async () => {
    try {
      const res = await apiClient.get('/members', {
        params: {
          family_id: params?.familyId,
          search: params?.search,
          page,
          limit,
        },
      });
      const items = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
      const result: MemberListResponse = {
        items,
        total: res.data?.total || items.length,
        page: res.data?.page || 1,
        limit: res.data?.limit || limit,
        totalPages: res.data?.totalPages || 1,
      };
      if (!search) {
        setCached(cacheKey, result, 120_000);
      }
      return result;
    } catch (err) {
      console.error('API fetchMembers error:', err);
      const stale = getCached<MemberListResponse>(cacheKey);
      if (stale) return stale.data;
      return { items: [], total: 0, page: 1, limit, totalPages: 0 };
    }
  });
}

export async function fetchMemberDetail(memberId: string): Promise<MemberDetail | null> {
  const cacheKey = `member-detail:${memberId}`;
  const cached = getCached<MemberDetail>(cacheKey);
  if (cached && !cached.isStale) {
    return cached.data;
  }
  return dedupe(cacheKey, async () => {
    try {
      const res = await apiClient.get(`/members/${memberId}`);
      if (res.data) setCached(cacheKey, res.data, 120_000);
      return res.data ?? null;
    } catch (err) {
      console.error(`API fetchMemberDetail error for ${memberId}:`, err);
      return cached?.data ?? null;
    }
  });
}

export async function fetchFamilies(): Promise<Family[]> {
  const cacheKey = 'families:list';
  const cached = getCached<Family[]>(cacheKey);
  if (cached && !cached.isStale) {
    return cached.data;
  }
  return dedupe(cacheKey, async () => {
    try {
      const res = await apiClient.get('/families');
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.items) ? res.data.items : [];
      setCached(cacheKey, list, 120_000);
      return list;
    } catch {
      return cached?.data ?? [];
    }
  });
}

export async function fetchClanProfile(familyId: string): Promise<any> {
  const cacheKey = `clan-profile:${familyId}`;
  const cached = getCached<any>(cacheKey);
  if (cached && !cached.isStale) {
    return cached.data;
  }
  return dedupe(cacheKey, async () => {
    try {
      const res = await apiClient.get(`/families/${familyId}/profile`);
      if (res.data) setCached(cacheKey, res.data, 120_000);
      return res.data;
    } catch (err) {
      console.error(`API fetchClanProfile error for ${familyId}:`, err);
      return cached?.data ?? null;
    }
  });
}

export async function updateClanProfile(familyId: string, data: any): Promise<any> {
  const res = await apiClient.put(`/families/${familyId}/profile`, data);
  invalidateCache(`clan-profile:${familyId}`);
  invalidateCache('families:list');
  return res.data;
}

export async function updateMemberProfile(
  memberId: string,
  payload: {
    fullName?: string;
    gender?: string;
    birthDate?: string;
    deathDate?: string;
    isAlive?: boolean;
    bio?: string;
  }
): Promise<any> {
  const res = await apiClient.patch(`/members/${memberId}`, payload);
  invalidateMemberAndTreeCaches();
  return res.data;
}

export function invalidateMemberAndTreeCaches(): void {
  invalidateCache('members:');
  invalidateCache('member-detail:');
  invalidateCache('tree-nodes:');
}
