/**
 * API 请求辅助工具
 * 提供统一的API请求接口和错误处理
 */

import axios, { type AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/project';
import { getCurrentLanguage } from './i18n';
import type { AxiosError } from 'axios';

// 错误处理器类型定义
export type ErrorHandler = (error: AxiosError) => { data?: any; error?: string } | void;

// 创建 axios 实例
export const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Interceptors 设置函数类型定义
export type InterceptorsSetup = (axiosInstance: AxiosInstance) => void;

/**
 * 获取默认请求头
 * 包含通用的 Content-Type 和 Content-Language
 */
export const getDefaultHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Content-Language': getCurrentLanguage(),
});

/**
 * 设置 axios 拦截器
 * @param setupFunction - 拦截器设置函数
 */
export const setupInterceptors = (setupFunction: InterceptorsSetup): void => {
  setupFunction(apiClient);
};

/**
 * 获取当前的 axios 实例（用于高级配置）
 */
export const getAxiosInstance = (): AxiosInstance => {
  return apiClient;
};
