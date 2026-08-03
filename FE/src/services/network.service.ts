import apiClient from '../api/axios';
import type { FamilyLinkRequest, FamilyNetwork, InLawMarriage } from '../types/network';

export async function fetchFamilyNetwork(category: string = 'all'): Promise<FamilyNetwork[]> {
  try {
    const res = await apiClient.get('/networks/families', { params: { category } });
    return Array.isArray(res.data) ? res.data : Array.isArray(res.data?.items) ? res.data.items : [];
  } catch (err) {
    console.warn('API fetchFamilyNetwork error (DB empty or endpoint offline):', err);
    return [];
  }
}

export async function fetchInLawMarriages(): Promise<InLawMarriage[]> {
  try {
    const res = await apiClient.get('/networks/inlaw-marriages');
    return Array.isArray(res.data) ? res.data : Array.isArray(res.data?.items) ? res.data.items : [];
  } catch (err) {
    console.warn('API fetchInLawMarriages error (DB empty or endpoint offline):', err);
    return [];
  }
}

export async function fetchLinkRequests(): Promise<FamilyLinkRequest[]> {
  try {
    const res = await apiClient.get('/networks/link-requests');
    return Array.isArray(res.data) ? res.data : Array.isArray(res.data?.items) ? res.data.items : [];
  } catch (err) {
    console.warn('API fetchLinkRequests error (DB empty or endpoint offline):', err);
    return [];
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
  } catch (err) {
    console.warn('API sendLinkRequest error:', err);
    return null;
  }
}
