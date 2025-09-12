import { getStorageItem, setStorageItem, removeStorageItem } from './storage';
import { getCookie, setCookie, removeCookie, getCookieDomain } from './cookie';

/**
 * 获取认证令牌
 * 优先从 localStorage 获取，如果没有则从 cookie 获取
 * @returns {string} 认证令牌
 */
export const getToken = (): string => {
  const localToken = getStorageItem('token');
  if (localToken) return localToken;

  const cookieToken = getCookie('token');

  return cookieToken ?? '';
};

/**
 * 设置认证令牌
 * 同时保存到 localStorage 和 cookie 中
 * @param {string} token 认证令牌
 * @param {number} expires cookie 过期时间（天数），默认 7 天
 */
export const setToken = (token: string, expires: number = 7): void => {
  // 保存到 localStorage
  setStorageItem('token', token);

  // 保存到 cookie，设置过期时间和域名以支持子域共享
  const domain = getCookieDomain();
  setCookie('token', token, {
    expires,
    path: '/',
    domain: domain || undefined, // 只有在有域名时才设置 domain 属性
    secure: window.location.protocol === 'https:',
    sameSite: 'Lax',
  });
};

/**
 * 清除认证令牌
 * 同时清除 localStorage 和 cookie 中的认证令牌
 */
export const clearToken = (): void => {
  removeStorageItem('token');

  // 清除 cookie 时也要指定域名，确保能正确删除
  const domain = getCookieDomain();
  removeCookie('token', {
    path: '/',
    domain: domain || undefined,
  });
};

/**
 * 获取重定向路径
 * 从 URL 参数中获取 redirect 参数，如果没有则返回默认路径
 * @param {string} defaultPath 默认路径
 * @returns {string} 重定向路径
 */
export const getRedirectPath = (defaultPath: string = '/'): string => {
  const url = window.location.pathname;
  if (url.includes('http://') || url.includes('https://')) {
    return decodeURIComponent(url);
  }
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  return redirect ? decodeURIComponent(redirect) : defaultPath;
};

/**
 * Remember Me 凭据相关常量
 */
const REMEMBER_ME_CREDENTIALS_KEY = 'remember-me-credentials';

/**
 * Remember Me 凭据相关接口
 */
export interface RememberMeCredentials {
  email: string;
  password?: string; // 可选的加密密码
  rememberMe: boolean;
}

/**
 * 获取记住我的凭据
 * @returns {RememberMeCredentials | null} 保存的凭据或null
 */
export const getRememberMeCredentials = (): RememberMeCredentials | null => {
  try {
    const savedCredentials = getStorageItem(REMEMBER_ME_CREDENTIALS_KEY);
    if (!savedCredentials) {
      return null;
    }

    const parsedCredentials = JSON.parse(savedCredentials) as RememberMeCredentials;

    // 验证必要字段
    if (!parsedCredentials.email || typeof parsedCredentials.rememberMe !== 'boolean') {
      return null;
    }

    return parsedCredentials;
  } catch (error) {
    console.error('Failed to parse remember me credentials:', error);
    // 清除损坏的数据
    removeRememberMeCredentials();
    return null;
  }
};

/**
 * 设置记住我的凭据
 * @param {RememberMeCredentials} credentials 要保存的凭据
 */
export const setRememberMeCredentials = (credentials: RememberMeCredentials): void => {
  try {
    if (credentials.rememberMe && credentials.email) {
      setStorageItem(REMEMBER_ME_CREDENTIALS_KEY, JSON.stringify(credentials));
    } else {
      removeRememberMeCredentials();
    }
  } catch (error) {
    console.error('Failed to save remember me credentials:', error);
  }
};

/**
 * 清除记住我的凭据
 */
export const removeRememberMeCredentials = (): void => {
  removeStorageItem(REMEMBER_ME_CREDENTIALS_KEY);
};
