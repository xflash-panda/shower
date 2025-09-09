// 第三方库的类型声明

declare module 'react-slick' {
  import { Component } from 'react';

  interface SliderSettings {
    [key: string]: any;
  }

  export default class Slider extends Component<SliderSettings> {}
}

declare module 'react-router-hash-link' {
  import type { FC, AnchorHTMLAttributes } from 'react';

  export interface HashLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
    smooth?: boolean;
    scroll?: (el: Element) => void;
  }

  export const HashLink: FC<HashLinkProps>;
}

declare module 'react-apexcharts' {
  import { Component } from 'react';

  export interface Props {
    type?: string;
    width?: string | number;
    height?: string | number;
    series?: any[];
    options?: any;
    [key: string]: any;
  }

  export default class ReactApexChart extends Component<Props> {}
}

// Toastify 类型声明
interface ToastifyOptions {
  text?: string;
  duration?: number;
  position?: string;
  gravity?: string;
  style?: {
    background?: string;
    fontSize?: string;
  };
  [key: string]: any;
}

interface ToastifyInstance {
  showToast(): void;
}

declare function Toastify(options: ToastifyOptions): ToastifyInstance;

// 全局类型增强
declare global {
  interface Window {
    [key: string]: any;
    // 静态资源路径前缀
    assetsPath?: string;
    // Turnstile 验证码类型定义
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

// 样式对象类型
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// 图片文件类型
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

// 其他资源文件
declare module '*.json' {
  const value: any;
  export default value;
}

// dayjs 类型声明
declare module 'dayjs' {
  interface Dayjs {
    tz: {
      setDefault: (timezone?: string) => void;
    };
  }

  namespace dayjs {
    interface Dayjs {
      tz: {
        setDefault: (timezone?: string) => void;
      };
    }

    function extend(plugin: any): void;

    const tz: {
      setDefault: (timezone?: string) => void;
    };
  }

  function extend(plugin: any): void;

  const tz: {
    setDefault: (timezone?: string) => void;
  };
}

declare module 'dayjs/plugin/timezone' {
  const timezone: any;
  export default timezone;
}

declare module 'dayjs/plugin/utc' {
  const utc: any;
  export default utc;
}

declare module 'dayjs/plugin/relativeTime' {
  const relativeTime: any;
  export default relativeTime;
}
