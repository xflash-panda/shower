/**
 * SWR 全局配置
 * 简化配置，统一使用基础设置
 */

import type { SWRConfiguration } from 'swr';

/**
 * 全局错误处理器类型
 * 用于在 SwrProvider 中注入全局错误处理逻辑
 */
export type GlobalErrorHandler = (error: any, key: string) => void;

/**
 * SWR 全局配置选项
 * onError 处理逻辑移到 SwrProvider 中，支持更好的架构分离
 */
export const swrConfig: SWRConfiguration = {
  // 基础重新验证配置
  revalidateIfStale: true, // 数据过期时重新验证
  revalidateOnFocus: false, // 窗口聚焦时重新验证
  revalidateOnReconnect: true, // 网络重连时重新验证

  // 缓存配置
  dedupingInterval: 30000, // 30秒内相同请求去重, 数据更新频率
  focusThrottleInterval: 2000, // 窗口聚焦时重新验证

  // 错误重试配置
  errorRetryCount: 3, // 错误重试次数
  errorRetryInterval: 1000, // 重试间隔（毫秒）
  shouldRetryOnError: error => {
    // 如果有 HTTP 状态码，检查具体状态
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status;
      // 401、403、500 等服务器错误不重试
      if (status === 401 || status === 403 || status === 500) {
        return false;
      }
    }

    // 只有网络错误（没有状态码的错误）才重试
    // 比如：网络断开、超时、DNS 解析失败等
    return !error || !('status' in error);
  },

  // onError 将在 SwrProvider 中处理，便于使用 React 相关功能
};

/**
 * 创建带有全局错误处理的 SWR 配置
 * @param globalErrorHandler - 全局错误处理函数
 * @returns 完整的 SWR 配置
 */
export const createSwrConfigWithGlobalError = (
  globalErrorHandler: GlobalErrorHandler,
): SWRConfiguration => ({
  ...swrConfig,
  onError: globalErrorHandler,
});

// 导出默认配置
export default swrConfig;
