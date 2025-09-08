/**
 * localStorage 相关工具函数
 */

import { PROJECT_CONFIG } from '../config/project';

// localStorage 相关常量
export const STORAGE_CONSTANTS = {
  prefix: PROJECT_CONFIG.name,

  // 生成完整的 localStorage key
  getKey: (key: string): string => `${STORAGE_CONSTANTS.prefix}-${key}`,
} as const;

/**
 * 检查 localStorage 是否可用
 * @returns 是否可用
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取通用的 localStorage 项
 * @param key 键名
 * @param defaultValue 默认值
 * @returns 存储值
 */
export function getStorageItem(key: string, defaultValue: string | null = null): string | null {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return defaultValue;
  }

  try {
    const storageKey = STORAGE_CONSTANTS.getKey(key);
    return localStorage.getItem(storageKey) ?? defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * 设置通用的 localStorage 项
 * @param key 键名
 * @param value 值
 */
export function setStorageItem(key: string, value: string): void {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }

  try {
    const storageKey = STORAGE_CONSTANTS.getKey(key);
    localStorage.setItem(storageKey, value);
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

/**
 * 删除 localStorage 项
 * @param key 键名
 */
export function removeStorageItem(key: string): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    const storageKey = STORAGE_CONSTANTS.getKey(key);
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

/**
 * 清除所有项目相关的 localStorage 数据
 */
export function clearAllStorage(): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_CONSTANTS.prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
