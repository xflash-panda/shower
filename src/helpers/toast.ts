import { getCurrentSize } from '@helpers/theme';

/**
 * 根据主题大小设置获取对应的字体大小
 * @param size 主题大小 ('sm' | 'md' | 'lg')
 * @returns 字体大小字符串
 */
function getFontSizeByThemeSize(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return '13px'; // small-text 对应的字体大小
    case 'lg':
      return '16px'; // large-text 对应的字体大小
    case 'md':
    default:
      return '14px'; // medium-text 对应的字体大小
  }
}

/**
 * 获取当前主题对应的字体大小
 * @returns 当前字体大小字符串
 */
function getCurrentFontSize(): string {
  const currentSize = getCurrentSize();
  return getFontSizeByThemeSize(currentSize);
}

const toast = {
  success: (text = '', duration = 3000) => {
    Toastify({
      text,
      duration,
      position: 'right',
      gravity: 'top',
      style: {
        background: 'rgb(var(--success),1)',
        fontSize: getCurrentFontSize(),
      },
    }).showToast();
  },
  error: (text = '', duration = 3000) => {
    Toastify({
      text,
      duration,
      position: 'right',
      gravity: 'top',
      style: {
        background: 'rgb(var(--danger),1)',
        fontSize: getCurrentFontSize(),
      },
    }).showToast();
  },
  info: (text = '', duration = 3000) => {
    Toastify({
      text,
      duration,
      position: 'right',
      gravity: 'top',
      style: {
        background: 'rgb(var(--info),1)',
        fontSize: getCurrentFontSize(),
      },
    }).showToast();
  },
  warning: (text = '', duration = 3000) => {
    Toastify({
      text,
      duration,
      position: 'right',
      gravity: 'top',
      style: {
        background: 'rgb(var(--warning),1)',
        fontSize: getCurrentFontSize(),
      },
    }).showToast();
  },
};

export default toast;
