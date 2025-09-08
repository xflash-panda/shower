import type { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getToken } from '@/helpers/auth';
import { getCurrentLanguage } from '@/helpers/i18n';

/**
 * 请求拦截器
 * 处理请求前的逻辑，如添加认证令牌、请求日志等
 */
export const requestInterceptor = {
  onFulfilled: (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // 添加认证令牌
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 添加语言
    config.headers['Accept-Language'] = getCurrentLanguage();
    return config;
  },

  onRejected: (error: AxiosError): Promise<AxiosError> => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  },
};
