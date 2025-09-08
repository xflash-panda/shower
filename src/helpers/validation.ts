/**
 * 通用验证规则工具函数
 * 只返回布尔值，不包含错误消息，让各页面自定义消息
 */

/**
 * 检查是否为空值
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value?.trim();
};

/**
 * 检查密码强度是否符合要求
 */
export const isValidPassword = (password: string | null | undefined): boolean => {
  try {
    if (isEmpty(password)) return false;
    if (!password) return false;
    return password.length >= 8;
  } catch {
    return false;
  }
};

/**
 * 检查两个密码是否匹配
 */
export const isPasswordMatch = (
  password: string | null | undefined,
  confirmPassword: string | null | undefined,
): boolean => {
  try {
    if (isEmpty(confirmPassword)) return false;
    if (!password || !confirmPassword) return false;
    return password === confirmPassword;
  } catch {
    return false;
  }
};

/**
 * 检查验证码格式是否正确
 */
export const isValidVerificationCode = (code: string | null | undefined): boolean => {
  try {
    if (isEmpty(code)) return false;
    if (!code) return false;
    return /^\d{6}$/.test(code.trim());
  } catch {
    return false;
  }
};

/**
 * 检查邮箱前缀是否包含有效字符
 */
export const hasValidEmailPrefixChars = (prefix: string): boolean => {
  try {
    if (!prefix) return false;
    return /^[a-zA-Z0-9._-]+$/.test(prefix.trim());
  } catch {
    return false;
  }
};

/**
 * 检查邮箱前缀长度是否合理
 */
export const isEmailPrefixLengthValid = (prefix: string): boolean => {
  try {
    if (!prefix) return false;
    return prefix.trim().length <= 64;
  } catch {
    return false;
  }
};

/**
 * 检查邮箱地址长度是否合理
 */
export const isEmailLengthValid = (email: string): boolean => {
  try {
    if (!email) return false;
    return email.trim().length <= 254;
  } catch {
    return false;
  }
};

/**
 * 检查邮箱格式的基础正则表达式
 */
export const matchesEmailRegex = (email: string): boolean => {
  try {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  } catch {
    return false;
  }
};
