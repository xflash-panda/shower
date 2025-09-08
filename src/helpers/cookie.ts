/**
 * Cookie 操作工具类
 * 支持前缀功能，便于统一管理项目 Cookie
 */

interface CookieOptions {
  /** 过期时间（天数） */
  expires?: number;
  /** 路径 */
  path?: string;
  /** 域名 */
  domain?: string;
  /** 是否安全连接 */
  secure?: boolean;
  /** SameSite 属性 */
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Cookie 工具类
 */
class CookieHelper {
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  /**
   * 获取完整的 Cookie 名称（带前缀）
   * @param name Cookie 名称
   * @returns 带前缀的 Cookie 名称
   */
  private getFullName(name: string): string {
    return this.prefix ? `${this.prefix}${name}` : name;
  }

  /**
   * 设置 Cookie
   * @param name Cookie 名称
   * @param value Cookie 值
   * @param options Cookie 选项
   */
  set(name: string, value: string, options: CookieOptions = {}): void {
    const fullName = this.getFullName(name);
    let cookieString = `${fullName}=${encodeURIComponent(value)}`;

    // 设置过期时间
    if (options.expires) {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    }

    // 设置路径
    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    // 设置域名
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    // 设置安全连接
    if (options.secure) {
      cookieString += '; secure';
    }

    // 设置 SameSite
    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  }

  /**
   * 获取 Cookie
   * @param name Cookie 名称
   * @returns Cookie 值，如果不存在则返回 null
   */
  get(name: string): string | null {
    const fullName = this.getFullName(name);
    const value = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${fullName}=`))
      ?.split('=')[1];

    return value ? decodeURIComponent(value) : null;
  }

  /**
   * 删除 Cookie
   * @param name Cookie 名称
   * @param options Cookie 选项（主要是 path 和 domain）
   */
  remove(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
    this.set(name, '', {
      expires: -1,
      path: options.path,
      domain: options.domain,
    });
  }

  /**
   * 检查 Cookie 是否存在
   * @param name Cookie 名称
   * @returns 是否存在
   */
  exists(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * 获取所有 Cookie（仅限当前前缀）
   * @returns Cookie 对象
   */
  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const prefixLength = this.prefix.length;

    document.cookie.split('; ').forEach(cookie => {
      const [name, value] = cookie.split('=');
      if (name?.startsWith(this.prefix)) {
        const realName = name.substring(prefixLength);
        cookies[realName] = value ? decodeURIComponent(value) : '';
      }
    });

    return cookies;
  }

  /**
   * 清除所有带前缀的 Cookie
   * @param options Cookie 选项（主要是 path 和 domain）
   */
  clearAll(options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
    const cookies = this.getAll();
    Object.keys(cookies).forEach(name => {
      this.remove(name, options);
    });
  }
}

// 创建默认实例（带项目前缀）
const defaultCookieHelper = new CookieHelper('shower_');

// 导出默认实例的方法
export const setCookie = (name: string, value: string, options?: CookieOptions): void => {
  return defaultCookieHelper.set(name, value, options);
};

export const getCookie = (name: string): string | null => {
  return defaultCookieHelper.get(name);
};

export const removeCookie = (
  name: string,
  options?: Pick<CookieOptions, 'path' | 'domain'>,
): void => {
  return defaultCookieHelper.remove(name, options);
};

export const cookieExists = (name: string): boolean => {
  return defaultCookieHelper.exists(name);
};

export const getAllCookies = (): Record<string, string> => {
  return defaultCookieHelper.getAll();
};

export const clearAllCookies = (options?: Pick<CookieOptions, 'path' | 'domain'>): void => {
  return defaultCookieHelper.clearAll(options);
};

// 导出 CookieHelper 类，允许创建自定义前缀的实例
export { CookieHelper };
export type { CookieOptions };
