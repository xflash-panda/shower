import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentTheme,
  applyThemeToBody,
  toggleTheme as toggleThemeHelper,
} from '@/helpers/theme';
import type { ThemeMode } from '@/types/theme';

/**
 * React Hook: 使用主题
 * 提供主题状态管理和切换功能
 *
 * @returns 主题相关的状态和方法
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => getCurrentTheme());

  useEffect(() => {
    applyThemeToBody(theme);
  }, [theme]);

  const toggleThemeMode = useCallback((): void => {
    const newTheme = toggleThemeHelper();
    setTheme(newTheme);
  }, []);

  return {
    theme,
    toggleTheme: toggleThemeMode,
    setTheme,
  };
};
