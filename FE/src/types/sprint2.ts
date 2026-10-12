export interface FamilyDto {
  id: string;
  clanCode: string;
  name: string;
  status: string;
  createdBy?: string | null;
  activatedAt?: string | null;
  suspendedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyUpdateDto {
  clanCode?: string;
  name?: string;
  status?: string;
}

export interface BranchDto {
  id: string;
  familyId: string;
  name: string;
  code?: string | null;
  parentBranchId?: string | null;
  branchOrder: number;
  description?: string | null;
  status: string;
}

export interface BranchWriteDto {
  name?: string;
  code?: string | null;
  parentBranchId?: string | null;
  branchOrder?: number;
  description?: string | null;
  status?: string;
}

export interface PersonDto {
  id: string;
  familyId: string;
  branchId?: string | null;
  fullName: string;
  gender: string;
  birthDate?: string | null;
  deathDate?: string | null;
  generation: number;
  avatarUrl?: string | null;
  isLiving: boolean;
  status: string;
}

export interface PersonWriteDto {
  fullName?: string;
  branchId?: string | null;
  gender?: string;
  birthDate?: string | null;
  deathDate?: string | null;
  avatarUrl?: string | null;
  isLiving?: boolean;
  status?: string;
}

export interface PersonFilters {
  search?: string;
  gender?: string;
  branchId?: string;
  isLiving?: boolean;
  limit?: number;
  offset?: number;
}

export interface RelationshipDto {
  id: string;
  fromMemberId: string;
  toMemberId: string;
  relationshipType: string;
  notes?: string | null;
}

export interface RelationshipCreateDto {
  fromMemberId: string;
  toMemberId: string;
  relationshipType: 'PARENT' | 'SPOUSE';
}

export interface TreeNodeDto {
  id: string;
  fullName: string;
  gender: string;
  generation: number;
  branchId?: string | null;
  avatarUrl?: string | null;
  status: string;
}

export interface TreeDataDto {
  nodes: TreeNodeDto[];
  edges: RelationshipDto[];
}

export interface LineageDto {
  person: PersonDto;
  depth: number;
}
