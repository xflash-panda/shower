import type { PartialThemeSettings } from '@/types/theme';

declare global {
  interface Window {
    settings?: {
      title?: string;
      description?: string;
      theme?: Omit<PartialThemeSettings, 'mode'>;
    };
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback': () => void;
          theme: string;
          size: string;
        },
      ) => void;
    };
  }
}

// 确保这个文件被视为模块
export {};
