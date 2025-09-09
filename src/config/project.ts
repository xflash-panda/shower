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
  currency_locale: import.meta.env.SHOWER_CURRENCY_LOCALE ?? 'zh-CN',
  currency_unit: import.meta.env.SHOWER_CURRENCY_UNIT ?? 'CNY',
  currency_max_digits: import.meta.env.SHOWER_CURRENCY_MAX_DIGITS ?? 2,
  timezone: import.meta.env.SHOWER_TIMEZONE ?? 'Asia/Shanghai',
  copyright_mark: import.meta.env.SHOWER_COPYRIGHT_MARK ?? 'Shower Panel',
  crypto_secret_key: import.meta.env.SHOWER_CRYPTO_SECRET_KEY ?? '',
  isDevelopment: import.meta.env.DEV ?? true,
  isProduction: !import.meta.env.DEV,
};

// API 基础配置
export const API_CONFIG = {
  baseURL: import.meta.env.SHOWER_API_BASE_URL ?? '',
  timeout: 10000,
};
