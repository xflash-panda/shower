import { useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NoNeedAuthPaths, RoutePaths, LoginRelatedPaths } from '@routes/AuthRoutes';
import { getToken, clearToken } from '@helpers/auth';
import { useCheckLogin } from '@hooks/useIdentity';
import { getErrorMessage } from '@/helpers/error';

// 认证验证管理器 - 封装全局状态和防抖逻辑
class AuthValidationManager {
  private static validationInProgress = false;
  private static validationPromise: Promise<boolean> | null = null;
  private static authCheckTimeout: NodeJS.Timeout | null = null;
  private static readonly AUTH_CHECK_DELAY = 100; // 100ms 防抖延迟
  private static checkLoginFn: (() => Promise<API_V1.Identity.CheckLoginResult>) | null = null;

  /**
   * 设置检查登录函数
   */
  static setCheckLoginFunction(fn: () => Promise<API_V1.Identity.CheckLoginResult>): void {
    this.checkLoginFn = fn;
  }

  /**
   * 验证Token有效性（全局单例模式）
   */
  static async validateToken(): Promise<boolean> {
    // 如果已经有正在进行的验证，等待其结果
    if (this.validationInProgress && this.validationPromise) {
      return await this.validationPromise;
    }

    try {
      this.validationInProgress = true;

      this.validationPromise = this.performValidation();
      return await this.validationPromise;
    } catch (error) {
      console.error('❌ Token validation failed:', getErrorMessage(error));
      clearToken();
      return false;
    } finally {
      this.resetValidationState();
    }
  }

  private static async performValidation(): Promise<boolean> {
    if (!this.checkLoginFn) {
      throw new Error('Check login function not set');
    }

    const response = await this.checkLoginFn();
    const isValid = response?.data?.is_login === true;

    if (!isValid) {
      clearToken();
      return false;
    }

    return true;
  }

  private static resetValidationState(): void {
    this.validationInProgress = false;
    this.validationPromise = null;
  }

  /**
   * 防抖认证检查
   */
  static scheduleAuthCheck(callback: () => void): void {
    this.clearAuthCheck();
    this.authCheckTimeout = setTimeout(callback, this.AUTH_CHECK_DELAY);
  }

  /**
   * 清理认证检查定时器
   */
  static clearAuthCheck(): void {
    if (this.authCheckTimeout) {
      clearTimeout(this.authCheckTimeout);
      this.authCheckTimeout = null;
    }
  }

  /**
   * 清理所有全局状态
   */
  static cleanup(): void {
    this.resetValidationState();
    this.clearAuthCheck();
  }
}

/**
 * 应用级别的路由监听组件
 * 负责处理全局路由变化事件，如认证检查、统计、标题更新等
 */
const AppRouteListener: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentMounted = useRef(true);
  const { checkLoginStatus } = useCheckLogin();

  /**
   * 安全导航函数 - 只在组件未卸载时执行导航
   */
  const safeNavigate = useCallback(
    (path: string, options?: { replace?: boolean }) => {
      if (componentMounted.current) {
        navigate(path, options);
      }
    },
    [navigate],
  );

  /**
   * 处理认证重定向逻辑
   */
  const handleAuthRedirect = useCallback(
    async (_token: string): Promise<void> => {
      try {
        const isTokenValid = await AuthValidationManager.validateToken();
        if (isTokenValid) {
          safeNavigate(RoutePaths.DASHBOARD, { replace: true });
        }
      } catch (error) {
        console.warn(
          '⚠️ Token validation error during redirect, staying on current page:',
          getErrorMessage(error),
        );
      }
    },
    [safeNavigate],
  );

  /**
   * 处理未认证用户的重定向
   */
  const handleUnauthenticatedUser = useCallback((): void => {
    safeNavigate(RoutePaths.LOGIN, { replace: true });
  }, [safeNavigate]);

  /**
   * 处理Token验证失败的情况
   */
  const handleTokenValidationFailure = useCallback(
    (error?: unknown): void => {
      console.error('❌ Token validation failed, clearing auth info:', getErrorMessage(error));
      clearToken();
      safeNavigate(RoutePaths.LOGIN, { replace: true });
    },
    [safeNavigate],
  );

  /**
   * 检查用户认证状态
   */
  const checkAuthStatus = useCallback(
    async (pathname: string): Promise<void> => {
      const token = getToken();

      // 处理无需认证的路径
      if (NoNeedAuthPaths.includes(pathname)) {
        // 如果用户已登录但访问登录相关页面，验证并重定向
        if (token && (LoginRelatedPaths as readonly string[]).includes(pathname)) {
          await handleAuthRedirect(token);
        }
        return;
      }

      // 处理需要认证的路径
      if (!token) {
        handleUnauthenticatedUser();
        return;
      }

      // 验证Token有效性
      try {
        const isTokenValid = await AuthValidationManager.validateToken();
        if (!isTokenValid) {
          safeNavigate(RoutePaths.LOGIN, { replace: true });
        }
      } catch (error) {
        handleTokenValidationFailure(error);
      }
    },
    [handleAuthRedirect, handleUnauthenticatedUser, handleTokenValidationFailure, safeNavigate],
  );

  // 设置检查登录函数
  useEffect(() => {
    AuthValidationManager.setCheckLoginFunction(checkLoginStatus);
  }, [checkLoginStatus]);

  // 路由变化监听和认证检查
  useEffect(() => {
    // 使用管理器的防抖机制
    AuthValidationManager.scheduleAuthCheck(() => {
      void checkAuthStatus(location.pathname);
    });

    // 清理函数
    return () => {
      AuthValidationManager.clearAuthCheck();
    };
  }, [location.pathname, checkAuthStatus]);

  // 组件挂载和卸载管理
  useEffect(() => {
    componentMounted.current = true;

    return () => {
      componentMounted.current = false;
      AuthValidationManager.cleanup();
    };
  }, []);

  return null; // 这个组件不渲染任何内容
};

export default AppRouteListener;
