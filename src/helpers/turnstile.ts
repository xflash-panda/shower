// Turnstile 类型定义

/**
 * Turnstile 验证码助手类
 */
export const turnstile = {
  /**
   * 获取 Turnstile 验证码 token
   * @param siteKey - Turnstile site key
   * @param options - 配置选项
   * @param options.silent - 是否静默处理错误（返回 null 而不是抛出异常）
   * @returns Promise<string | null> - 验证码 token，静默模式下错误时返回 null
   */
  async getToken(siteKey: string, options: { silent?: boolean } = {}): Promise<string | null> {
    const { silent = false } = options;

    return new Promise((resolve, reject) => {
      // 创建隐藏的 Turnstile 容器
      const hiddenDiv = document.createElement('div');
      hiddenDiv.style.position = 'fixed';
      hiddenDiv.style.top = '-9999px';
      hiddenDiv.style.left = '-9999px';
      hiddenDiv.style.width = '1px';
      hiddenDiv.style.height = '1px';
      hiddenDiv.style.opacity = '0';
      hiddenDiv.style.pointerEvents = 'none';
      document.body.appendChild(hiddenDiv);

      const handleError = (error?: Error) => {
        if (hiddenDiv.parentNode) {
          document.body.removeChild(hiddenDiv);
        }
        if (silent) {
          resolve(null);
        } else {
          reject(error ?? new Error('Turnstile verification failed'));
        }
      };

      // 动态加载 Turnstile
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

      script.onload = () => {
        if (window.turnstile) {
          window.turnstile.render(hiddenDiv, {
            sitekey: siteKey,
            callback: (token: string) => {
              if (hiddenDiv.parentNode) {
                document.body.removeChild(hiddenDiv);
              }
              resolve(token);
            },
            'error-callback': () => {
              handleError(new Error('Turnstile verification failed'));
            },
            theme: 'light',
            size: 'compact',
          });
        } else {
          handleError(new Error('Turnstile script loaded but window.turnstile is not available'));
        }
      };

      script.onerror = () => {
        handleError(new Error('Failed to load Turnstile script'));
      };

      document.head.appendChild(script);
    });
  },

  /**
   * 静默获取 Turnstile 验证码 token
   * 等同于 getToken(siteKey, { silent: true })
   * @param siteKey - Turnstile site key
   * @returns Promise<string | null> - 验证码 token，错误时返回 null
   */
  getSilentToken(siteKey: string): Promise<string | null> {
    return turnstile.getToken(siteKey, { silent: true });
  },
};
