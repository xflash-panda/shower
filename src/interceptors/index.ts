import type { AxiosInstance } from 'axios';
import { requestInterceptor } from './request';
import { responseInterceptor } from './response';

/**
 * 为 axios 实例设置拦截器
 * @param axiosInstance - axios 实例
 */
export const setupInterceptors = (axiosInstance: AxiosInstance): void => {
  // 请求拦截器
  axiosInstance.interceptors.request.use(
    requestInterceptor.onFulfilled,
    requestInterceptor.onRejected,
  );

  // 响应拦截器
  axiosInstance.interceptors.response.use(
    responseInterceptor.onFulfilled,
    responseInterceptor.onRejected,
  );
};

// 导出拦截器以便单独使用
export { requestInterceptor } from './request';
export { responseInterceptor } from './response';
