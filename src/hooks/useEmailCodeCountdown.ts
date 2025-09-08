import { useState, useRef, useCallback, useEffect } from 'react';

// 固定的全局邮箱验证码倒计时key前缀
const EMAIL_CODE_COUNTDOWN_KEY_PREFIX = 'emailCodeCountdownEnd';
// 固定的全局邮箱地址存储key前缀
const EMAIL_ADDRESS_KEY_PREFIX = 'emailCodeSentAddress';

/**
 * 生成指定scope的存储键
 */
const getStorageKey = (prefix: string, scope: string) => `${prefix}_${scope}`;

/**
 * 清理过期的邮箱验证码倒计时记录
 */
export const cleanupExpiredEmailCodeCountdowns = () => {
  const now = Date.now();

  // 获取所有相关的localStorage键
  const keys = Object.keys(localStorage);
  const countdownKeys = keys.filter(key => key.startsWith(EMAIL_CODE_COUNTDOWN_KEY_PREFIX));

  countdownKeys.forEach(key => {
    const endTimeStr = localStorage.getItem(key);
    if (endTimeStr) {
      const endTime = parseInt(endTimeStr, 10);
      // 如果时间戳无效或已过期，删除记录
      if (isNaN(endTime) || endTime <= now) {
        localStorage.removeItem(key);
        // 同时清理对应的邮箱地址
        const scope = key.replace(`${EMAIL_CODE_COUNTDOWN_KEY_PREFIX}_`, '');
        const emailKey = getStorageKey(EMAIL_ADDRESS_KEY_PREFIX, scope);
        localStorage.removeItem(emailKey);
      }
    }
  });
};

/**
 * 保存发送验证码的邮箱地址
 */
export const saveEmailCodeSentAddress = (email: string, scope: string = 'default') => {
  const key = getStorageKey(EMAIL_ADDRESS_KEY_PREFIX, scope);
  localStorage.setItem(key, email);
};

/**
 * 获取发送验证码的邮箱地址
 */
export const getEmailCodeSentAddress = (scope: string = 'default'): string | null => {
  const key = getStorageKey(EMAIL_ADDRESS_KEY_PREFIX, scope);
  return localStorage.getItem(key);
};

/**
 * 清除保存的邮箱地址
 */
export const clearEmailCodeSentAddress = (scope: string = 'default') => {
  const key = getStorageKey(EMAIL_ADDRESS_KEY_PREFIX, scope);
  localStorage.removeItem(key);
};

interface UseEmailCodeCountdownOptions {
  /**
   * 倒计时时长（秒），默认60秒
   */
  duration?: number;
  /**
   * 作用域，用于区分不同页面的倒计时状态，默认为 'default'
   * 建议使用页面名称，如 'register', 'forgot-password', 'change-email' 等
   */
  scope?: string;
}

interface UseEmailCodeCountdownReturn {
  /** 当前倒计时剩余秒数 */
  countdown: number;
  /** 是否正在倒计时中 */
  isCountingDown: boolean;
  /** 开始倒计时 */
  startCountdown: () => void;
  /** 清除倒计时 */
  clearCountdown: () => void;
  /** 保存发送验证码的邮箱地址 */
  saveEmailAddress: (email: string) => void;
  /** 获取保存的邮箱地址 */
  getSavedEmailAddress: () => string | null;
  /** 清除保存的邮箱地址 */
  clearEmailAddress: () => void;
}

/**
 * 邮箱验证码倒计时 Hook
 * 支持页面刷新后恢复倒计时状态，支持不同页面独立的倒计时状态
 */
export const useEmailCodeCountdown = (
  options: UseEmailCodeCountdownOptions = {},
): UseEmailCodeCountdownReturn => {
  const { duration = 60, scope = 'default' } = options;
  const storageKey = getStorageKey(EMAIL_CODE_COUNTDOWN_KEY_PREFIX, scope);
  const emailStorageKey = getStorageKey(EMAIL_ADDRESS_KEY_PREFIX, scope);
  const [countdown, setCountdown] = useState(0);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 清除倒计时
  const clearCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(0);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  // 开始倒计时
  const startCountdown = useCallback(() => {
    const endTime = Date.now() + duration * 1000;
    localStorage.setItem(storageKey, endTime.toString());

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setCountdown(remaining);

      if (remaining <= 0) {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(emailStorageKey); // 同时清理邮箱地址
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
      }
    };

    updateCountdown();
    countdownTimerRef.current = setInterval(updateCountdown, 1000);
  }, [duration, storageKey, emailStorageKey]);

  // 恢复倒计时（页面刷新后）
  const restoreCountdown = useCallback(() => {
    const endTimeStr = localStorage.getItem(storageKey);
    if (endTimeStr) {
      const endTime = parseInt(endTimeStr, 10);

      // 检查时间戳是否有效
      if (isNaN(endTime)) {
        localStorage.removeItem(storageKey);
        return;
      }

      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

      if (remaining > 0) {
        setCountdown(remaining);

        const updateCountdown = () => {
          const currentRemaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
          setCountdown(currentRemaining);

          if (currentRemaining <= 0) {
            localStorage.removeItem(storageKey);
            localStorage.removeItem(emailStorageKey); // 同时清理邮箱地址
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
          }
        };

        countdownTimerRef.current = setInterval(updateCountdown, 1000);
      } else {
        // 倒计时已过期，清理记录
        localStorage.removeItem(storageKey);
        localStorage.removeItem(emailStorageKey); // 同时清理邮箱地址
      }
    }
  }, [storageKey, emailStorageKey]);

  // 页面初始化时恢复倒计时
  useEffect(() => {
    restoreCountdown();

    // 组件卸载时清理定时器
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [restoreCountdown]);

  return {
    countdown,
    isCountingDown: countdown > 0,
    startCountdown,
    clearCountdown,
    saveEmailAddress: (email: string) => saveEmailCodeSentAddress(email, scope),
    getSavedEmailAddress: () => getEmailCodeSentAddress(scope),
    clearEmailAddress: () => clearEmailCodeSentAddress(scope),
  };
};
