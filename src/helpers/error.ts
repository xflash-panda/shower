/**
 * 错误处理相关工具函数
 * 提供统一的错误格式化和处理方法
 */

/**
 * 格式化错误消息
 * 统一处理 Error 对象和其他类型的错误
 * @param error - 错误对象（可能是 Error 实例或其他类型）
 * @param prefix - 错误消息前缀（可选）
 * @param fallback - 当错误不是 Error 实例时的默认消息
 * @returns 格式化后的错误消息
 */
export const formatError = (
  error: unknown,
  prefix?: string,
  fallback: string = 'Unknown error',
): string => {
  const errorMessage = error instanceof Error ? error.message : fallback;
  return prefix ? `${prefix}: ${errorMessage}` : errorMessage;
};

/**
 * 格式化错误消息（带前缀的便捷方法）
 * @param error - 错误对象
 * @param prefix - 错误消息前缀
 * @returns 格式化后的错误消息，格式为 "prefix: error.message" 或 "prefix: Unknown error"
 */
export const formatErrorWithPrefix = (error: unknown, prefix: string): string => {
  return formatError(error, prefix, 'Unknown error');
};

/**
 * 获取错误消息（不带前缀）
 * @param error - 错误对象
 * @param fallback - 当错误不是 Error 实例时的默认消息
 * @returns 错误消息字符串
 */
export const getErrorMessage = (error: unknown, fallback: string = 'Unknown error'): string => {
  return error instanceof Error ? error.message : fallback;
};

/**
 * 检查是否为特定类型的错误
 * @param error - 错误对象
 * @param expectedMessage - 期望的错误消息（部分匹配）
 * @returns 是否匹配指定的错误类型
 */
export const isErrorType = (error: unknown, expectedMessage: string): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }
  return error.message.includes(expectedMessage);
};

/**
 * 网络错误检查
 * @param error - 错误对象
 * @returns 是否为网络相关错误
 */
export const isNetworkError = (error: unknown): boolean => {
  return isErrorType(error, 'network') || isErrorType(error, 'timeout');
};

/**
 * 认证错误检查
 * @param error - 错误对象
 * @returns 是否为认证相关错误
 */
export const isAuthError = (error: unknown): boolean => {
  return isErrorType(error, 'unauthorized') || isErrorType(error, 'invalid');
};
