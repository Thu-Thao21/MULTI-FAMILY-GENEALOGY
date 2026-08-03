import apiClient from '../api/axios';

export interface RoleRequestPayload {
  requested_role: 'family_head';
  family_id?: string;
  reason?: string;
}

export interface RoleRequestItem {
  id: string;
  account_id: string;
  requested_role: string;
  family_id?: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewer_id?: string;
  reviewer_notes?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewRoleRequestPayload {
  status: 'approved' | 'rejected';
  reviewer_notes?: string;
}

/**
 * Member submits a request to become a Family Head.
 */
export async function submitRoleRequest(payload: RoleRequestPayload): Promise<RoleRequestItem> {
  const res = await apiClient.post<RoleRequestItem>('/auth/role-requests', payload);
  return res.data;
}

/**
 * Admin lists all role requests filtered by status.
 */
export async function getAdminRoleRequests(statusFilter?: string): Promise<RoleRequestItem[]> {
  const params = statusFilter ? { status_filter: statusFilter } : {};
  const res = await apiClient.get<RoleRequestItem[]>('/auth/role-requests/admin', { params });
  return res.data;
}

/**
 * Admin approves or rejects a role request.
 */
export async function reviewRoleRequest(
  requestId: string,
  payload: ReviewRoleRequestPayload
): Promise<RoleRequestItem> {
  const res = await apiClient.patch<RoleRequestItem>(`/auth/role-requests/admin/${requestId}`, payload);
  return res.data;
}
