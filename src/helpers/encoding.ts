/**
 * Base64 编码/解码工具函数
 * 提供浏览器兼容的 Base64 编码和解码功能
 */

/**
 * Base64 解码
 * 将 Base64 编码的字符串解码为 UTF-8 字符串
 * @param encoded - Base64 编码的字符串
 * @returns 解码后的 UTF-8 字符串，解码失败时返回空字符串
 * @example
 * ```typescript
 * const decoded = base64Decode('SGVsbG8gV29ybGQ='); // "Hello World"
 * ```
 */
export const base64Decode = (encoded: string): string => {
  if (!encoded || typeof encoded !== 'string') {
    console.warn('Base64 decode: Invalid input, expected non-empty string');
    return '';
  }

  try {
    // 直接使用 TextDecoder 处理 atob 结果，避免手动循环
    const binaryString = atob(encoded);
    const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  } catch (error) {
    console.error('Base64 decode error:', error);
    return '';
  }
};

/**
 * Base64 编码
 * 将 UTF-8 字符串编码为 Base64 字符串
 * @param text - 要编码的 UTF-8 字符串
 * @returns Base64 编码的字符串，编码失败时返回空字符串
 * @example
 * ```typescript
 * const encoded = base64Encode('Hello World'); // "SGVsbG8gV29ybGQ="
 * ```
 */
export const base64Encode = (text: string): string => {
  if (!text || typeof text !== 'string') {
    console.warn('Base64 encode: Invalid input, expected non-empty string');
    return '';
  }

  try {
    // 使用 TextEncoder 和 Array.from 优化性能
    const bytes = new TextEncoder().encode(text);
    const binaryString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
  } catch (error) {
    console.error('Base64 encode error:', error);
    return '';
  }
};

/**
 * 检查字符串是否为有效的 Base64 格式
 * @param str - 要检查的字符串
 * @returns 是否为有效的 Base64 格式
 * @example
 * ```typescript
 * const isValid = isValidBase64('SGVsbG8gV29ybGQ='); // true
 * const isInvalid = isValidBase64('invalid!@#'); // false
 * ```
 */
export const isValidBase64 = (str: string): boolean => {
  if (!str || typeof str !== 'string') {
    return false;
  }

  try {
    // Base64 正则表达式验证
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

    // 长度必须是 4 的倍数
    if (str.length % 4 !== 0) {
      return false;
    }

    // 格式验证
    if (!base64Regex.test(str)) {
      return false;
    }

    // 尝试解码验证
    atob(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * URL 安全的 Base64 编码
 * 将标准 Base64 中的 +/ 替换为 -_，并移除末尾的 = 填充
 * @param text - 要编码的字符串
 * @returns URL 安全的 Base64 字符串
 */
export const base64UrlEncode = (text: string): string => {
  const encoded = base64Encode(text);
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * URL 安全的 Base64 解码
 * 将 URL 安全的 Base64 字符串解码
 * @param encoded - URL 安全的 Base64 字符串
 * @returns 解码后的字符串
 */
export const base64UrlDecode = (encoded: string): string => {
  // 还原标准 Base64 格式
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

  // 补充填充字符
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }

  return base64Decode(base64);
};
