import copy from 'copy-to-clipboard';

/**
 * 复制文本到剪贴板
 * @param text - 要复制的文本
 * @returns 复制是否成功
 */
export const copyText = (text: string): boolean => {
  const success = copy(text);
  return success;
};

export default copyText;
