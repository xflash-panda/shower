import { STORAGE_CONSTANTS } from '@/helpers/storage';
import type {
  ThemeMode,
  TextOption,
  SidebarOption,
  LayoutOption,
  ColorOption,
} from '@/types/theme';

// 主题相关常量和默认值
export const THEME_CONSTANTS = {
  // 主题存储键名
  keys: {
    mode: 'theme-mode',
  },

  // 默认值
  defaults: {
    mode: 'light' as ThemeMode,
    sidebarOption: 'vertical-sidebar' as SidebarOption,
    layoutOption: 'ltr' as LayoutOption,
    colorOption: 'warm' as ColorOption,
    textOption: 'medium-text' as TextOption,
  },
} as const;

/**
 * 保存主题模式到 localStorage（仅用于明暗模式切换）
 * @param value 主题模式值
 */
function setThemeModeToStorage(value: ThemeMode): void {
  try {
    const storageKey = STORAGE_CONSTANTS.getKey(THEME_CONSTANTS.keys.mode);
    localStorage.setItem(storageKey, value);
  } catch {
    // localStorage 不可用时静默失败
  }
}

/**
 * 从 localStorage 获取主题模式
 * @returns 主题模式
 */
function getThemeModeFromStorage(): ThemeMode {
  try {
    const storageKey = STORAGE_CONSTANTS.getKey(THEME_CONSTANTS.keys.mode);
    const value = localStorage.getItem(storageKey);

    if (value === 'light' || value === 'dark') {
      return value;
    }

    return THEME_CONSTANTS.defaults.mode;
  } catch {
    return THEME_CONSTANTS.defaults.mode;
  }
}

/**
 * 从 localStorage 获取主题配置
 * @param key 配置键名
 * @param defaultValue 默认值
 * @returns 配置值
 */
export function getThemeFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const storageKey = STORAGE_CONSTANTS.getKey(key);
    const value = localStorage.getItem(storageKey);
    return value ? (value as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * 保存主题配置到 localStorage
 * @param key 配置键名
 * @param value 配置值
 */
export function setThemeToStorage(key: string, value: string): void {
  try {
    const storageKey = STORAGE_CONSTANTS.getKey(key);
    localStorage.setItem(storageKey, value);
  } catch {
    // localStorage 不可用时静默失败
  }
}
/**
 * 获取当前主题模式（优先从 window.settings.theme，然后从 localStorage）
 * @returns 当前主题模式
 */
export function getCurrentTheme(): ThemeMode {
  return getThemeModeFromStorage();
}

/**
 * 应用主题到 body 元素
 * @param theme 主题模式
 */
export function applyThemeToBody(theme: ThemeMode): void {
  try {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  } catch (error: unknown) {
    console.error('Failed to apply theme to body:', error);
  }
}

/**
 * 设置主题模式
 * @param theme 主题模式
 */
export function setThemeMode(theme: ThemeMode): void {
  setThemeModeToStorage(theme);
  applyThemeToBody(theme);
}

/**
 * 切换主题模式
 * @returns 新的主题模式
 */
export function toggleTheme(): ThemeMode {
  const currentTheme = getCurrentTheme();
  const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
  setThemeMode(newTheme);
  return newTheme;
}

/**
 * 应用主题配置到页面元素
 * 将 window.settings.theme 的配置应用到相关元素，参考原先动态实现
 */
export function applyThemeConfiguration(): void {
  try {
    const appWrapper = document.querySelector('.app-wrapper');
    const nav = document.querySelector('nav');
    const body = document.body;
    const html = document.documentElement;

    if (!window.settings?.theme) {
      return;
    }

    const theme = window.settings.theme;

    // 1. 应用 sidebarOption 到 nav 元素（参考原先动态实现）
    if (nav && theme.sidebarOption) {
      nav.classList.remove(
        'vertical-sidebar',
        'horizontal-sidebar',
        'compact-sidebar',
        'dark-sidebar',
      );
      nav.classList.add(theme.sidebarOption);
    }

    // 2. 应用 layoutOption 到 body 和 html 元素
    if (body && theme.layoutOption) {
      // 保留主题类，只更新布局类（参考原先动态实现）
      const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
      body.setAttribute('class', `${theme.layoutOption} ${currentTheme}`);
    }

    if (html && theme.layoutOption) {
      html.setAttribute('dir', theme.layoutOption);
      if (theme.layoutOption === 'box-layout') {
        html.removeAttribute('dir');
      }
    }

    // 3. 应用 colorOption 到 app-wrapper 元素
    if (appWrapper && theme.colorOption) {
      // 移除所有可能的 colorOption 类
      appWrapper.classList.remove('default', 'gold', 'warm', 'happy', 'nature', 'hot');
      appWrapper.classList.add(theme.colorOption);
    }

    // 4. 应用 textOption 到 body 的 text 属性（参考原先动态实现）
    if (body && theme.textOption) {
      body.setAttribute('text', theme.textOption);
    }
  } catch (error: unknown) {
    console.error('Failed to apply theme configuration:', error);
  }
}

/**
 * 初始化主题设置和 window.settings.theme
 * 确保 window.settings.theme 存在并包含合理的默认值
 */
export function initializeThemeFromWindowSettings(): void {
  // 确保 window.settings 对象存在
  window.settings ??= {};

  // 确保 window.settings.theme 存在并包含默认值
  if (!window.settings.theme) {
    window.settings.theme = {
      sidebarOption: THEME_CONSTANTS.defaults.sidebarOption,
      layoutOption: THEME_CONSTANTS.defaults.layoutOption,
      colorOption: THEME_CONSTANTS.defaults.colorOption,
      textOption: THEME_CONSTANTS.defaults.textOption,
    };
  } else {
    // 如果存在但缺少某些属性，则补充默认值
    window.settings.theme.sidebarOption ??= THEME_CONSTANTS.defaults.sidebarOption;
    window.settings.theme.layoutOption ??= THEME_CONSTANTS.defaults.layoutOption;
    window.settings.theme.colorOption ??= THEME_CONSTANTS.defaults.colorOption;
    window.settings.theme.textOption ??= THEME_CONSTANTS.defaults.textOption;
  }
}

/**
 * 获取CSS变量的RGB值
 * @param variableName CSS变量名（不包含--前缀）
 * @returns RGB颜色值字符串，格式为 "r, g, b"
 */
export function getCSSVariableRGB(variableName: string): string {
  try {
    if (typeof window === 'undefined' || !document.documentElement) {
      return '140, 118, 240'; // SSR环境下的默认值
    }

    // 优先从 app-wrapper 获取颜色值（主题颜色类应用在这里）
    const appWrapper = document.querySelector('.app-wrapper');
    let value = '';

    if (appWrapper) {
      value = getComputedStyle(appWrapper).getPropertyValue(`--${variableName}`).trim();
    }

    // 如果 app-wrapper 没有该变量，则从 document.documentElement 获取
    if (!value) {
      value = getComputedStyle(document.documentElement)
        .getPropertyValue(`--${variableName}`)
        .trim();
    }

    if (!value) {
      console.warn(`CSS variable --${variableName} not found, using fallback`);
      return '140, 118, 240'; // 默认primary颜色
    }

    return value;
  } catch (error: unknown) {
    console.error(`Failed to get CSS variable --${variableName}:`, error);
    return '140, 118, 240'; // 默认primary颜色
  }
}

/**
 * 获取RGB格式的颜色值
 * @param variableName CSS变量名（不包含--前缀）
 * @returns RGB颜色值字符串，格式为 "rgb(r, g, b)"
 */
export function getCSSVariableColor(variableName: string): string {
  const rgbValue = getCSSVariableRGB(variableName);
  return `rgb(${rgbValue})`;
}

/**
 * 获取带透明度的RGB颜色值
 * @param variableName CSS变量名（不包含--前缀）
 * @param alpha 透明度值（0-1）
 * @returns RGBA颜色值字符串，格式为 "rgba(r, g, b, alpha)"
 */
export function getCSSVariableColorWithAlpha(variableName: string, alpha: number): string {
  const rgbValue = getCSSVariableRGB(variableName);
  return `rgba(${rgbValue}, ${alpha})`;
}

/**
 * 根据主题模式获取背景色
 * @returns 背景色字符串
 */
export function getThemeBackgroundColor(): string {
  return getCurrentTheme() === 'dark' ? '#202335' : '#ffffff';
}

/**
 * 将 TextOption 转换为组件尺寸选项
 * @param textOption 字体大小选项，默认使用 window.settings.theme 的设置
 * @returns 组件尺寸选项 ('sm' | 'md' | 'lg')
 */
export function textOptionToSize(textOption?: TextOption): 'sm' | 'md' | 'lg' {
  const currentTextOption =
    textOption ?? window.settings?.theme?.textOption ?? THEME_CONSTANTS.defaults.textOption;

  switch (currentTextOption) {
    case 'small-text':
      return 'sm';
    case 'large-text':
      return 'lg';
    case 'medium-text':
    default:
      return 'md';
  }
}

/**
 * 获取当前字体大小对应的组件尺寸
 * @returns 组件尺寸选项 ('sm' | 'md' | 'lg')
 */
export function getCurrentSize(): 'sm' | 'md' | 'lg' {
  return textOptionToSize();
}
