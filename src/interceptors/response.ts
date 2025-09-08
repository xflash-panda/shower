import type { AxiosResponse, AxiosError } from 'axios';
import i18n from '@/config/i18n';

// 在文件顶部添加类型定义
interface FieldErrorResponse {
  errors: Record<string, string[]>;
}

interface MessageErrorResponse {
  message: string;
}

/**
 * 响应拦截器
 * 处理响应后的逻辑，如错误处理、性能监控等
 */
export const responseInterceptor = {
  onFulfilled: (response: AxiosResponse): AxiosResponse => {
    // 开发环境下的响应日志
    return response;
  },

  onRejected: (error: AxiosError): Promise<AxiosError> => {
    const errorMessages: string[] = [];
    if (error.response) {
      if (error.response?.status === 422) {
        const errorData = error.response.data as FieldErrorResponse;
        Object.keys(errorData.errors).forEach(field => {
          errorMessages.push(...errorData.errors[field]);
        });
        error.message = errorMessages.join(', ');
      } else {
        const errorData = error.response.data as MessageErrorResponse;
        error.message = errorData.message;
      }
    } else if (error.request) {
      error.message = i18n.t('errors.networkError');
    } else {
      error.message = i18n.t('errors.unknownError');
    }

    return Promise.reject(error);
  },
};
