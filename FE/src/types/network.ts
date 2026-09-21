export interface FamilyNetwork {
  id: string;
  name: string;
  founderName?: string;
  originPlace?: string;
  ancestralHouseAddress?: string;
  history?: string;
  description?: string;
  branches: string[];
  status: string;
  category: string; // noi, ngoai, thong-gia
  memberCount: number;
  linkedSince?: string;
}

export interface InLawMarriage {
  id: string;
  husbandName: string;
  husbandFamily: string;
  wifeName: string;
  wifeFamily: string;
  marriageDate?: string;
  status: string;
  notes?: string;
}

export interface FamilyLinkRequest {
  id: string;
  sourceFamilyId: string;
  sourceFamilyName: string;
  targetFamilyId: string;
  targetFamilyName: string;
  requestType: string;
  status: string;
  message?: string;
  createdAt?: string;
}
