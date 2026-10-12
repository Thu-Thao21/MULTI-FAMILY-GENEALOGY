import apiClient from './api';
import type { BranchDto, BranchWriteDto, FamilyDto, FamilyUpdateDto } from '../types/sprint2';

export async function getFamily(familyId: string): Promise<FamilyDto> {
  const response = await apiClient.get<FamilyDto>(`/api/v1/families/${familyId}`);
  return response.data;
}

export async function updateFamily(familyId: string, payload: FamilyUpdateDto): Promise<FamilyDto> {
  const response = await apiClient.patch<FamilyDto>(`/api/v1/families/${familyId}`, payload);
  return response.data;
}

export async function getBranches(familyId: string): Promise<BranchDto[]> {
  const response = await apiClient.get<BranchDto[]>(`/api/v1/families/${familyId}/branches`);
  return response.data;
}

export async function createBranch(familyId: string, payload: BranchWriteDto): Promise<BranchDto> {
  if (!payload.name) throw new Error('Tên chi/nhánh là bắt buộc.');
  const response = await apiClient.post<BranchDto>(`/api/v1/families/${familyId}/branches`, payload);
  return response.data;
}

export async function updateBranch(
  familyId: string,
  branchId: string,
  payload: BranchWriteDto,
): Promise<BranchDto> {
  const response = await apiClient.patch<BranchDto>(
    `/api/v1/families/${familyId}/branches/${branchId}`,
    payload,
  );
  return response.data;
}
