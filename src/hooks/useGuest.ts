import useSWR from 'swr';
import { commonConfig } from '@/api/v1/guest';
import type { AxiosRequestConfig } from 'axios';

// 常量定义
const GUEST_COMMON_CONFIG_KEY = 'guest-common-config';

/**
 * Guest 模块通用配置 Hook
 * 用于获取 Guest 模块的通用配置信息
 *
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含配置数据和状态
 */
export function useCommonConfig(options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.Guest.CommonConfigResult>(
    [GUEST_COMMON_CONFIG_KEY, options],
    () => commonConfig(options),
    {
      dedupingInterval: 30000, // 30秒内去重
      // Guest 接口不需要认证，即使没有 token 也允许请求
      isPaused: () => false,
      // 成功回调
      onSuccess: (_data: API_V1.Guest.CommonConfigResult) => {
        // Success callback for guest common config
      },

      // 移除局部 onError，让全局 onError 处理错误
      // 这样确保全局错误处理(如403认证过期)能够正常工作
    },
  );

  return {
    config: result.data?.data,
    isLoading: result.isLoading,
    isError: !!result.error,
    error: result.error as Error | undefined,
    mutate: result.mutate,
  };
}
