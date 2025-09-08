import { useState, useEffect } from 'react';

/**
 * 自定义 Hook 用于解析 HashRouter 中的 URL 参数
 * 兼容 HashRouter 的参数格式：/#/path?param1=value1&param2=value2
 */
export const useHashParams = () => {
  const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());

  useEffect(() => {
    const parseHashParams = () => {
      const hash = window.location.hash.slice(1); // 移除 # 号
      if (!hash) {
        setParams(new URLSearchParams());
        return;
      }

      try {
        // 使用 URL API 优雅地解析参数
        const tempUrl = new URL(`http://temp.com/${hash}`);
        setParams(tempUrl.searchParams);
      } catch (_error) {
        // 如果解析失败，回退到手动解析
        const queryStart = hash.indexOf('?');
        if (queryStart !== -1) {
          const queryString = hash.substring(queryStart + 1);
          setParams(new URLSearchParams(queryString));
        } else {
          setParams(new URLSearchParams());
        }
      }
    };

    // 初始解析
    parseHashParams();

    // 监听 hash 变化
    const handleHashChange = () => {
      parseHashParams();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  /**
   * 获取指定参数的值
   * @param key 参数名
   * @returns 参数值或 null
   */
  const getParam = (key: string): string | null => {
    return params.get(key);
  };

  /**
   * 获取所有参数
   * @returns URLSearchParams 对象
   */
  const getAllParams = (): URLSearchParams => {
    return params;
  };

  /**
   * 检查是否存在指定参数
   * @param key 参数名
   * @returns 是否存在
   */
  const hasParam = (key: string): boolean => {
    return params.has(key);
  };

  return {
    getParam,
    getAllParams,
    hasParam,
    params, // 直接暴露 URLSearchParams 对象供高级用法
  };
};

export default useHashParams;
