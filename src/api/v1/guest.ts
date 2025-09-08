import { apiClient, getDefaultHeaders } from '@/helpers/api';
import type { AxiosRequestConfig } from 'axios';

export async function commonConfig(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.Guest.CommonConfigResult>(
    '/api/v1/guest/comm/config',
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );

  return response.data;
}
