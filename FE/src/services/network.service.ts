import apiClient from '../api/axios';
import type { FamilyLinkRequest, FamilyNetwork, InLawMarriage } from '../types/network';
import { mockFamilyNetworks, mockInLawMarriages, mockLinkRequests } from '../data/networkMockData';

const familyFallback = (category: string) => mockFamilyNetworks.filter((item) => category === 'all' || item.category === category).map((item) => ({ ...item, branches: [...item.branches] }));

export async function fetchFamilyNetwork(category: string = 'all'): Promise<FamilyNetwork[]> {
  try {
    const res = await apiClient.get('/networks/families', { params: { category } });
    const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.items) ? res.data.items : [];
    return data.length ? data : familyFallback(category);
  } catch {
    return familyFallback(category);
  }
}

export async function fetchInLawMarriages(): Promise<InLawMarriage[]> {
  try {
    const res = await apiClient.get('/networks/inlaw-marriages');
    const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.items) ? res.data.items : [];
    return data.length ? data : mockInLawMarriages.map((item) => ({ ...item }));
  } catch {
    return mockInLawMarriages.map((item) => ({ ...item }));
  }
}

export async function fetchLinkRequests(): Promise<FamilyLinkRequest[]> {
  try {
    const res = await apiClient.get('/networks/link-requests');
    const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.items) ? res.data.items : [];
    return data.length ? data : mockLinkRequests.map((item) => ({ ...item }));
  } catch {
    return mockLinkRequests.map((item) => ({ ...item }));
  }
}

export async function sendLinkRequest(
  targetFamilyId: string,
  requestType: string = 'marriage',
  message?: string,
): Promise<FamilyLinkRequest | null> {
  try {
    const res = await apiClient.post('/networks/link-requests', {
      target_family_id: targetFamilyId,
      request_type: requestType,
      message,
    });
    return res.data;
  } catch {
    return {
      id: `REQ-${Date.now()}`,
      sourceFamilyId: 'NET-N01',
      sourceFamilyName: 'Dòng họ Nguyễn · Nam Định',
      targetFamilyId,
      targetFamilyName: 'Dòng họ được mời kết nối',
      requestType,
      status: 'pending',
      message,
      createdAt: new Date().toISOString().slice(0, 10),
    };
  }
}
