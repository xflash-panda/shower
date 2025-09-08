/**
 * 资源路径辅助函数
 * 用于处理在二级目录部署时的资源路径问题
 */

import { ASSET_PREFIX } from '@config/project';

/**
 * 获取资源的完整路径
 * 开发环境下返回原始路径，生产环境下添加配置的前缀
 * @param assetPath 资源相对路径（不包含前导斜杠）
 * @returns 完整的资源路径
 */
export const getAssetPath = (assetPath: string): string => {
  // 确保路径不以斜杠开头
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;

  // 如果有前缀配置，则添加前缀（仅生产环境）
  if (ASSET_PREFIX) {
    const prefix = ASSET_PREFIX.endsWith('/') ? ASSET_PREFIX.slice(0, -1) : ASSET_PREFIX;
    return `${prefix}/${cleanPath}`;
  }

  // 开发环境使用绝对路径，生产环境无前缀时使用相对路径
  if (import.meta.env.PROD) {
    return `./${cleanPath}`;
  }

  return `/${cleanPath}`;
};

/**
 * 获取图片资源路径
 * @param imagePath 图片相对路径（相对于 assets/images/）
 * @returns 完整的图片路径
 */
export const getImagePath = (imagePath: string): string => {
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return getAssetPath(`assets/images/${cleanPath}`);
};

/**
 * 获取 Logo 路径
 * @param logoName logo 文件名（不包含扩展名）
 * @param format 图片格式，默认为 'png'
 * @returns Logo 路径
 */
export const getLogoPath = (logoName: string, format: 'png' | 'webp' = 'png'): string => {
  return getImagePath(`logo/${logoName}.${format}`);
};

/**
 * 获取错误页面背景图片路径
 * @param errorCode 错误代码（如 '404', '500', '503'）
 * @returns 错误页面背景图片路径
 */
export const getErrorImagePath = (errorCode: string): string => {
  return getImagePath(`background/error-${errorCode}.png`);
};
