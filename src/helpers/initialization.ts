import { setupInterceptors } from './api';
import { setupInterceptors as defaultInterceptorsSetup } from '../interceptors';
import { initializeDayjs } from './time';
import { initializeThemeFromWindowSettings, getCurrentTheme, applyThemeToBody } from './theme';

/**
 * Initialize all application dependencies and configurations
 * This function should be called once at the application startup
 */
export const initializeApplication = (): void => {
  // Initialize dayjs with plugins and timezone
  initializeDayjs();

  // Setup API interceptors
  setupInterceptors(defaultInterceptorsSetup);

  // Initialize theme from window settings
  initializeThemeFromWindowSettings();

  // 获取并应用主题模式
  const currentTheme = getCurrentTheme();
  applyThemeToBody(currentTheme);
};
