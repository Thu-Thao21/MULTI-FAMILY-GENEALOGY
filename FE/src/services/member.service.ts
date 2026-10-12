import { getFamily } from './familyService';
import { getPerson, getPersons } from './genealogyService';
import type { Family, Member, MemberDetail, MemberListResponse } from '../types/member';
import type { PersonDto } from '../types/sprint2';

function toMember(person: PersonDto): Member {
  return {
    id: person.id,
    familyId: person.familyId,
    fullName: person.fullName,
    gender: person.gender,
    birthDate: person.birthDate || undefined,
    deathDate: person.deathDate || undefined,
    isAlive: person.isLiving,
    branch: person.branchId || undefined,
    generation: person.generation,
    avatarUrl: person.avatarUrl || undefined,
    status: person.status,
  };
}

export async function fetchMembers(params?: {
  familyId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<MemberListResponse> {
  const familyId = params?.familyId || import.meta.env.VITE_DEV_FAMILY_ID?.trim();
  if (!familyId) return { items: [], total: 0, page: 1, limit: params?.limit || 100, totalPages: 0 };

  const limit = params?.limit || 100;
  const page = params?.page || 1;
  const persons = await getPersons(familyId, {
    search: params?.search,
    limit,
    offset: (page - 1) * limit,
  });
  return {
    items: persons.map(toMember),
    total: persons.length,
    page,
    limit,
    totalPages: persons.length < limit ? page : page + 1,
  };
}

export async function fetchMemberDetail(memberId: string, familyId?: string): Promise<MemberDetail | null> {
  const resolvedFamilyId = familyId || import.meta.env.VITE_DEV_FAMILY_ID?.trim();
  if (!resolvedFamilyId) return null;
  const person = await getPerson(resolvedFamilyId, memberId);
  return {
    ...toMember(person),
    displayOrder: 0,
    galleryPhotos: [],
    careerHistory: [],
    isPrimary: false,
    contacts: [],
    lifeEvents: [],
    media: [],
    skills: [],
  };
}

export async function fetchFamilies(): Promise<Family[]> {
  const familyId = import.meta.env.VITE_DEV_FAMILY_ID?.trim();
  if (!familyId) return [];
  const family = await getFamily(familyId);
  return [{
    id: family.id,
    name: family.name,
    code: family.clanCode,
    status: family.status,
    memberCount: 0,
  }];
}
