import { useState } from 'react';
import { checkLogin, checkEmail } from '@/api/v1/identity';

/**
 * 登录状态检查 Hook
 * 用于检查用户当前的登录状态
 */
export function useCheckLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const checkLoginStatus = async () => {
    setIsLoading(true);
    try {
      const result = await checkLogin();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkLoginStatus,
    isLoading,
  };
}

/**
 * 邮箱检查 Hook
 * 用于检查邮箱是否已存在
 */
export function useCheckEmail() {
  const [isLoading, setIsLoading] = useState(false);

  const checkEmailExists = async (email: string): Promise<API_V1.Identity.CheckEmailResult> => {
    setIsLoading(true);
    try {
      const result = await checkEmail({
        email,
      });
      return result;
    } catch (error) {
      console.error('Check email failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkEmailExists,
    isLoading,
  };
}
