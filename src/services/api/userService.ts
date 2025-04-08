
import apiClient from './apiClient';

export interface SubUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  // Add other fields based on actual API response
}

export interface SubUsersResponse {
  data: SubUser[];
  message: string;
  status: boolean;
}

export const fetchSubUsers = async (): Promise<SubUsersResponse> => {
  try {
    const response = await apiClient.get<SubUsersResponse>('/user/sub-users');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching sub-users:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};
