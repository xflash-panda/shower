import { formatBytes } from 'bytes-formatter';

/**
 * 字节数据处理工具函数
 */

/**
 * 将字节转换为可读的格式
 * @param bytes - 字节数
 * @param decimals - 小数位数，默认2位
 * @returns 格式化后的字符串，如 "1.25 GB"
 */
export const formatBytesToReadable = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  // 使用 bytes-formatter 库进行基础格式化
  const formatted = formatBytes(bytes);
  return formatted;
};

/**
 * 将字节转换为GB（数值）
 * @param bytes - 字节数
 * @param decimals - 小数位数，默认2位
 * @returns GB数值
 */
export const bytesToGB = (bytes: number, decimals: number = 2): number => {
  const gb = bytes / (1024 * 1024 * 1024);
  return Number(gb.toFixed(decimals));
};

/**
 * 将字节转换为MB（数值）
 * @param bytes - 字节数
 * @param decimals - 小数位数，默认2位
 * @returns MB数值
 */
export const bytesToMB = (bytes: number, decimals: number = 2): number => {
  const mb = bytes / (1024 * 1024);
  return Number(mb.toFixed(decimals));
};

/**
 * 将字节转换为KB（数值）
 * @param bytes - 字节数
 * @param decimals - 小数位数，默认2位
 * @returns KB数值
 */
export const bytesToKB = (bytes: number, decimals: number = 2): number => {
  const kb = bytes / 1024;
  return Number(kb.toFixed(decimals));
};

/**
 * 计算流量使用百分比
 * @param used - 已使用字节数
 * @param total - 总字节数
 * @param decimals - 小数位数，默认1位
 * @returns 百分比数值 (0-100)
 */
export const calculateTrafficPercentage = (
  used: number,
  total: number,
  decimals: number = 1,
): number => {
  if (total === 0) return 0;
  const percentage = (used / total) * 100;
  return Number(Math.min(100, percentage).toFixed(decimals));
};

/**
 * 计算剩余流量（字节）
 * @param total - 总字节数
 * @param used - 已使用字节数
 * @returns 剩余字节数
 */
export const calculateRemainingTraffic = (total: number, used: number): number => {
  return Math.max(0, total - used);
};
