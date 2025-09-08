import { useTranslation as useTranslationOriginal } from 'react-i18next';
import i18n from 'i18next';

/**
 * 自定义 useTranslation hook，提供类型安全的翻译功能
 * 默认使用 'common' 命名空间
 */
export const useTranslation = (namespace: string = 'common') => {
  return useTranslationOriginal(namespace);
};

/**
 * 获取当前语言代码
 */
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

/**
 * 切换语言
 */
export const changeLanguage = (language: string): Promise<void> => {
  return i18n.changeLanguage(language).then(() => {});
};

/**
 * 语言配置
 */
export const SUPPORTED_LANGUAGES = {
  zh: '中文',
  en: 'English',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

/**
 * 判断是否为支持的语言
 */
export const isSupportedLanguage = (lang: string): lang is SupportedLanguage => {
  return lang in SUPPORTED_LANGUAGES;
};

/**
 * 获取语言显示名称
 */
export const getLanguageDisplayName = (lang: string): string => {
  return isSupportedLanguage(lang) ? SUPPORTED_LANGUAGES[lang] : lang;
};
