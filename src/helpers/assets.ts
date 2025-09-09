/**
 * 静态资源路径辅助函数
 * 使用 window.assetsPath 来正确处理资源路径前缀
 */

/**
 * 获取静态资源的完整路径
 * @param assetPath 资源相对路径（相对于 public 目录）
 * @returns 带有正确前缀的资源路径
 */
export const getAssetPath = (assetPath: string): string => {
  const baseUrl = (window as Window & { assetsPath?: string }).assetsPath ?? '/';
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBaseUrl}${cleanPath}`;
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
 * @param format 图片格式，默认为 'webp'
 * @returns Logo 路径
 */
export const getLogoPath = (logoName: string, format: 'png' | 'webp' = 'webp'): string => {
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
