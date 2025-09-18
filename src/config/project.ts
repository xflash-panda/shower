/**
 * 项目全局配置
 * 仅包含基础的项目信息配置，工具类和辅助方法请放在 Helper 目录下
 */

// 从 package.json 读取项目信息
import packageJson from '../../package.json' assert { type: 'json' };

// 项目基础信息
export const PROJECT_CONFIG = {
  name: window.settings?.title ?? String(packageJson.name),
  version: String(packageJson.version),
  description: window.settings?.description ?? String(packageJson.description),
  currencyLocale: import.meta.env.SHOWER_CURRENCY_LOCALE ?? 'zh-CN',
  currencyUnit: import.meta.env.SHOWER_CURRENCY_UNIT ?? 'CNY',
  currencyMaxDigits: import.meta.env.SHOWER_CURRENCY_MAX_DIGITS ?? 2,
  timezone: import.meta.env.SHOWER_TIMEZONE ?? 'Asia/Shanghai',
  copyrightMark: import.meta.env.SHOWER_COPYRIGHT_MARK ?? 'Shower Panel',
  cryptoSecretKey: import.meta.env.SHOWER_CRYPTO_SECRET_KEY ?? '',
  isDevelopment: import.meta.env.DEV ?? true,
  isProduction: !import.meta.env.DEV,
  iosDownloadUrl: import.meta.env.SHOWER_IOS_DOWNLOAD_URL ?? '',
  androidDownloadUrl: import.meta.env.SHOWER_ANDROID_DOWNLOAD_URL ?? '',
};

// API 基础配置
export const API_CONFIG = {
  baseURL: PROJECT_CONFIG.isProduction ? '' : (import.meta.env.SHOWER_API_BASE_URL ?? ''),
  timeout: 10000,
};
