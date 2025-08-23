import { apiRequest } from './queryClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface FixedExtensionItem {
  ext: string;
  blocked: boolean;
  category: string;
}

export interface FixedExtensionsResponse {
  items: FixedExtensionItem[];
  updatedAt: string;
}

export interface CustomExtensionsResponse {
  items: string[];
  count: number;
  limit: number;
}

export interface UpdateFixedExtensionRequest {
  updates: Array<{
    ext: string;
    blocked: boolean;
  }>;
}

export interface AddCustomExtensionRequest {
  ext: string;
}

export interface AddCustomExtensionResponse {
  ext: string;
}

export const blocklistApi = {
  // Fixed extensions
  getFixed: (): Promise<FixedExtensionsResponse> =>
    apiRequest('GET', `${API_BASE_URL}/blocklist/fixed`).then(res => res.json()),

  updateFixed: (data: UpdateFixedExtensionRequest): Promise<{ ok: boolean }> =>
    apiRequest('PATCH', `${API_BASE_URL}/blocklist/fixed`, data).then(res => res.json()),

  // Custom extensions
  getCustom: (): Promise<CustomExtensionsResponse> =>
    apiRequest('GET', `${API_BASE_URL}/blocklist/custom`).then(res => res.json()),

  addCustom: (data: AddCustomExtensionRequest): Promise<AddCustomExtensionResponse> =>
    apiRequest('POST', `${API_BASE_URL}/blocklist/custom`, data).then(res => res.json()),

  deleteCustom: (ext: string): Promise<void> =>
    apiRequest('DELETE', `${API_BASE_URL}/blocklist/custom/${ext}`).then(() => {}),
};
