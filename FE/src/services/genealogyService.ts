import apiClient from './api';
import type {
  LineageDto,
  PersonDto,
  PersonFilters,
  PersonWriteDto,
  RelationshipCreateDto,
  RelationshipDto,
  TreeDataDto,
} from '../types/sprint2';

export async function getPersons(familyId: string, filters: PersonFilters = {}): Promise<PersonDto[]> {
  const response = await apiClient.get<PersonDto[]>(`/api/v1/families/${familyId}/persons`, {
    params: filters,
  });
  return response.data;
}

export async function getPerson(familyId: string, personId: string): Promise<PersonDto> {
  const response = await apiClient.get<PersonDto>(
    `/api/v1/families/${familyId}/persons/${personId}`,
  );
  return response.data;
}

export async function createPerson(familyId: string, payload: PersonWriteDto): Promise<PersonDto> {
  if (!payload.fullName) throw new Error('Họ tên là bắt buộc.');
  const response = await apiClient.post<PersonDto>(`/api/v1/families/${familyId}/persons`, payload);
  return response.data;
}

export async function updatePerson(
  familyId: string,
  personId: string,
  payload: PersonWriteDto,
): Promise<PersonDto> {
  const response = await apiClient.patch<PersonDto>(
    `/api/v1/families/${familyId}/persons/${personId}`,
    payload,
  );
  return response.data;
}

export async function createRelationship(
  familyId: string,
  payload: RelationshipCreateDto,
): Promise<RelationshipDto> {
  const response = await apiClient.post<RelationshipDto>(
    `/api/v1/families/${familyId}/relationships`,
    payload,
  );
  return response.data;
}

export async function deleteRelationship(familyId: string, relationshipId: string): Promise<void> {
  await apiClient.delete(`/api/v1/families/${familyId}/relationships/${relationshipId}`);
}

export async function getAncestors(familyId: string, personId: string): Promise<LineageDto[]> {
  const response = await apiClient.get<LineageDto[]>(
    `/api/v1/families/${familyId}/persons/${personId}/ancestors`,
  );
  return response.data;
}

export async function getDescendants(familyId: string, personId: string): Promise<LineageDto[]> {
  const response = await apiClient.get<LineageDto[]>(
    `/api/v1/families/${familyId}/persons/${personId}/descendants`,
  );
  return response.data;
}

export async function getTreeData(familyId: string): Promise<TreeDataDto> {
  const response = await apiClient.get<TreeDataDto>(`/api/v1/families/${familyId}/tree-data`);
  return response.data;
}
