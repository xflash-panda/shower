import type { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import swrConfig from '@/config/swr';
import { clearToken, getToken } from '@/helpers/auth';
import { RoutePaths } from '@/routes/AuthRoutes';
import toast from '@/helpers/toast';

interface SwrProviderProps {
  children: ReactNode;
}

// 全局状态管理 - 防止并发 403 处理
let isHandling403 = false;
let handling403Timeout: NodeJS.Timeout | null = null;

// 错误降噪处理 - 防止频繁显示相同错误
const errorCache = new Set<string>();
let errorCacheCleanupTimeout: NodeJS.Timeout | null = null;

/**
 * SWR Provider 组件
 * 提供全局 SWR 配置和错误处理
 * 在 Router 上下文内，可以使用 useNavigate 进行框架级导航
 */
const SwrProvider: React.FC<SwrProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('swrProvider');

  /**
   * 处理 403 认证错误
   * 使用防抖机制避免并发处理
   */
  const handle403Error = () => {
    // 如果已经在处理中，直接返回
    if (isHandling403) {
      return;
    }

    // 设置处理状态
    isHandling403 = true;

    // 清除认证令牌（只执行一次）
    clearToken();

    // 显示提示信息
    toast.error(t('toast.auth.expired'));

    // 使用 React Router 框架函数跳转到登录页面
    navigate(RoutePaths.LOGIN, { replace: true });

    // 设置超时重置，防止永久锁定
    if (handling403Timeout) {
      clearTimeout(handling403Timeout);
    }

    handling403Timeout = setTimeout(() => {
      isHandling403 = false;
      handling403Timeout = null;
    }, 1000); // 1秒后重置状态
  };

  /**
   * 错误降噪处理
   * @param errorMessage 错误消息
   * @returns 是否应该显示错误
   */
  const shouldShowError = (errorMessage: string): boolean => {
    // 如果错误已经在缓存中，不显示
    if (errorCache.has(errorMessage)) {
      return false;
    }

    // 添加到缓存
    errorCache.add(errorMessage);

    // 清理定时器
    if (errorCacheCleanupTimeout) {
      clearTimeout(errorCacheCleanupTimeout);
    }

    // 设置清理定时器，5秒后清空缓存
    errorCacheCleanupTimeout = setTimeout(() => {
      errorCache.clear();
      errorCacheCleanupTimeout = null;
    }, 5000);

    return true;
  };

  /**
   * SWR 全局错误处理函数
   * 使用 useNavigate 进行 React Router 框架级跳转
   */
  const handleSwrError = (error: unknown, _key: string) => {
    // 检查是否为 403 认证错误
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status;

      if (status === 403) {
        handle403Error();
        return;
      }
    }

    // 处理其他类型错误
    if (error instanceof Error && error.message) {
      // 其他错误也进行降噪处理
      if (shouldShowError(error.message)) {
        console.error('SWR error:', error);
        toast.error(t('toast.error.networkError'));
      }
    }
  };

  // 合并基础配置和错误处理函数
  const finalSwrConfig = {
    ...swrConfig,
    onError: handleSwrError,
    // 全局认证检查 - 没有 token 时暂停所有需要认证的请求
    // 公共接口（如 guest 接口）将在各自的 hook 中单独处理
    isPaused: () => {
      const token = getToken();
      return !token;
    },
  };

  return <SWRConfig value={finalSwrConfig}>{children}</SWRConfig>;
};

export default SwrProvider;
