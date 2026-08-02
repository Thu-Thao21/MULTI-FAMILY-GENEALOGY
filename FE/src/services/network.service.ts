import apiClient from '../api/axios';
import type { FamilyLinkRequest, FamilyNetwork, InLawMarriage } from '../types/network';

export const MOCK_NETWORKS: FamilyNetwork[] = [
  {
    id: 'net_001',
    name: 'Dòng họ Trần (Quảng Điền)',
    founderName: 'Trần Văn Hùng',
    originPlace: 'Quảng Điền, Thừa Thiên Huế',
    branches: ['Chi Trưởng'],
    status: 'connected',
    category: 'thong-gia',
    memberCount: 86,
    linkedSince: '2020-05-15',
    description: 'Cụ Nguyễn Văn An kết hôn cùng Cụ Bà Trần Thị Thảo (Dâu Rể Liên Họ).',
  },
  {
    id: 'net_002',
    name: 'Dòng họ Lê (Thanh Hóa)',
    founderName: 'Lê Văn Thái',
    originPlace: 'Thanh Hóa',
    branches: ['Chi 1', 'Chi 2'],
    status: 'connected',
    category: 'ngoai',
    memberCount: 64,
    linkedSince: '2018-08-20',
    description: 'Dòng họ thông gia lâu đời phía họ ngoại.',
  },
  {
    id: 'net_003',
    name: 'Dòng họ Phạm (Quảng Nam)',
    founderName: 'Phạm Văn Đức',
    originPlace: 'Quảng Nam',
    branches: ['Chi Trưởng'],
    status: 'connected',
    category: 'noi',
    memberCount: 42,
    linkedSince: '2021-03-10',
    description: 'Gia tộc họ nội liên kết Chi Trưởng.',
  },
];

export const MOCK_INLAWS: InLawMarriage[] = [
  {
    id: 'inlaw_001',
    husbandName: 'Nguyễn Văn Hùng',
    husbandFamily: 'Dòng họ Nguyễn',
    wifeName: 'Trần Thị Thảo',
    wifeFamily: 'Dòng họ Trần',
    marriageDate: '2005-11-20',
    status: 'verified',
    notes: 'Liên kết hôn nhân Dâu Rể hai dòng họ Nguyễn - Trần.',
  },
  {
    id: 'inlaw_002',
    husbandName: 'Lê Văn Thái',
    husbandFamily: 'Dòng họ Lê',
    wifeName: 'Nguyễn Thị Lan',
    wifeFamily: 'Dòng họ Nguyễn',
    marriageDate: '1970-04-12',
    status: 'verified',
    notes: 'Liên kết thông gia lâu đời.',
  },
];

export async function fetchFamilyNetwork(category: string = 'all'): Promise<FamilyNetwork[]> {
  try {
    const res = await apiClient.get('/networks/families', { params: { category } });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (err) {
    console.warn('API fetchFamilyNetwork fallback to MOCK_NETWORKS:', err);
  }

  if (category && category !== 'all') {
    return MOCK_NETWORKS.filter((n) => n.category === category);
  }
  return MOCK_NETWORKS;
}

export async function fetchInLawMarriages(): Promise<InLawMarriage[]> {
  try {
    const res = await apiClient.get('/networks/inlaw-marriages');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (err) {
    console.warn('API fetchInLawMarriages fallback to MOCK_INLAWS:', err);
  }

  return MOCK_INLAWS;
}

export async function fetchLinkRequests(): Promise<FamilyLinkRequest[]> {
  try {
    const res = await apiClient.get('/networks/link-requests');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (err) {
    console.warn('API fetchLinkRequests fallback:', err);
  }

  return [
    {
      id: 'req_001',
      sourceFamilyId: 'family_005',
      sourceFamilyName: 'Dòng họ Vũ',
      targetFamilyId: 'family_001',
      targetFamilyName: 'Dòng họ Nguyễn',
      requestType: 'marriage',
      status: 'pending',
      message: 'Kính gửi BQL Dòng họ Nguyễn, chúng tôi muốn xin kết nối giao lưu dòng họ.',
      createdAt: '2026-07-28',
    },
  ];
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
    console.warn('API Error sending link request, returning demo result:', err);
    return {
      id: `req_${Date.now()}`,
      sourceFamilyId: 'family_001',
      sourceFamilyName: 'Dòng họ Nguyễn',
      targetFamilyId,
      targetFamilyName: 'Dòng họ đã chọn',
      requestType,
      status: 'pending',
      message: message || 'Yêu cầu kết nối dòng họ',
      createdAt: new Date().toISOString().split('T')[0],
    };
  }
}
