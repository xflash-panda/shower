import { PROJECT_CONFIG } from '@/config/project';

/**
 * 货币格式化器
 * 根据项目配置格式化货币显示
 */
export const currencyFormatter = new Intl.NumberFormat(PROJECT_CONFIG.currencyLocale, {
  style: 'currency',
  currency: PROJECT_CONFIG.currencyUnit,
  maximumFractionDigits: Number(PROJECT_CONFIG.currencyMaxDigits),
});

/**
 * 格式化货币金额
 * @param amount 金额（分为单位）
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (amount: number): string => {
  return currencyFormatter.format(amount / 100); // 假设后端返回的是分
};

/**
 * 格式化金额为2位小数
 * 确保金额计算的精确性，避免浮点数精度问题
 * @param value 输入的金额字符串
 * @returns 格式化后的数字（最多2位小数）
 */
export const formatAmount = (value: string): number => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 0;
  }
  return Math.round(num * 100) / 100; // 确保只保留2位小数
};

/**
 * 验证输入的金额小数位数
 * @param value 输入的金额字符串
 * @param maxDecimalPlaces 最大允许的小数位数，默认为2
 * @returns 如果小数位数符合要求返回true，否则返回false
 */
export const validateDecimalPlaces = (value: string, maxDecimalPlaces: number = 2): boolean => {
  try {
    if (!value?.includes('.')) {
      return true; // 没有小数点，验证通过
    }

    const parts = value.split('.');
    if (parts.length === 2 && parts[1].length > maxDecimalPlaces) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};
