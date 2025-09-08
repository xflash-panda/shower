import type { Plugin } from 'vite';

interface CriticalCSSOptions {
  // 关键 CSS 内联阈值 (字节)
  inlineThreshold: number;
  // 首屏关键组件的选择器
  criticalSelectors: string[];
}

export function criticalCSS(options: CriticalCSSOptions): Plugin {
  return {
    name: 'vite-plugin-critical-css',
    apply: 'build',
    generateBundle(opts, bundle) {
      const htmlFiles = Object.keys(bundle).filter(name => name.endsWith('.html'));
      const cssFiles = Object.keys(bundle).filter(name => name.endsWith('.css'));

      htmlFiles.forEach(htmlFile => {
        const htmlChunk = bundle[htmlFile];
        if (htmlChunk.type !== 'asset') return;

        let htmlContent = htmlChunk.source as string;
        let criticalCSS = '';

        // 提取关键 CSS 规则
        cssFiles.forEach(cssFile => {
          const cssChunk = bundle[cssFile];
          if (cssChunk.type !== 'asset') return;

          const cssContent = cssChunk.source as string;
          const critical = extractCriticalCSS(cssContent, options.criticalSelectors);

          // 无论大小都先内联关键样式，然后根据阈值决定是否保留在原文件
          if (critical.length > 0) {
            criticalCSS += critical;

            // 如果关键样式小于阈值，从原文件移除避免重复
            if (critical.length < options.inlineThreshold) {
              cssChunk.source = cssContent.replace(critical, '');
            }
          }
        });

        // 将关键 CSS 内联到 HTML
        if (criticalCSS) {
          htmlContent = htmlContent.replace(
            '<title>',
            `<style>${criticalCSS}</style>\n    <title>`,
          );
        }

        // 为非关键 CSS 添加异步加载
        htmlContent = htmlContent.replace(
          /<link\s+rel="stylesheet"[^>]*href="([^"]*\.css)"[^>]*>/g,
          (match, href) => {
            // 对所有CSS文件都使用异步加载策略，包括 Vite 生成的 index.css
            return `${match.replace(
              'rel="stylesheet"',
              'rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"',
            )}\n    <noscript><link rel="stylesheet" href="${href}"></noscript>`;
          },
        );

        htmlChunk.source = htmlContent;
      });
    },
  };
}

function extractCriticalCSS(cssContent: string, criticalSelectors: string[]): string {
  let criticalCSS = '';
  const processedRules = new Set<string>();

  // 提取变量定义 (:root)
  const rootMatches = cssContent.match(/:root[^{]*\{[^}]+\}/g);
  if (rootMatches) {
    rootMatches.forEach(match => {
      if (!processedRules.has(match)) {
        criticalCSS += `${match}\n`;
        processedRules.add(match);
      }
    });
  }

  // 提取基础样式（优先级最高）
  const basicSelectors = [
    'body',
    'html',
    '\\*\\s*{[^}]+}',
    '\\*::before',
    '\\*::after',
    '\\.ltr',
    '\\.rtl',
    '#root',
    '\\.app-wrapper',
    '\\.container',
    '\\.d-flex',
    '\\.justify-content-center',
    '\\.align-items-center',
    '\\.text-center',
    '\\.w-100',
    '\\.h-100',
    // 添加更多首屏必需的样式
    '\\.main-wrapper',
    '\\.vertical-sidebar',
    '\\.app-logo',
    '\\.sidebar',
    '\\.navbar',
    '\\.header',
    '\\.nav',
    '\\.btn',
    '\\.btn-primary',
    '\\.card',
    '\\.card-body',
    '\\.form-control',
    '\\.input-group',
    // 字体和文本相关
    '\\.f-fw-\\d+',
    '\\.text-primary',
    '\\.text-secondary',
    '\\.mg-b-\\d+',
    '\\.pa-\\d+',
    // 布局工具类
    '\\.row',
    '\\.col-',
    '\\.position-',
    '\\.overflow-',
  ];

  basicSelectors.forEach(selector => {
    const regex = new RegExp(`${selector}[^{]*\\{[^}]+\\}`, 'g');
    const matches = cssContent.match(regex);
    if (matches) {
      matches.forEach(match => {
        if (!processedRules.has(match)) {
          criticalCSS += `${match}\n`;
          processedRules.add(match);
        }
      });
    }
  });

  // 提取关键选择器的规则
  criticalSelectors.forEach(selector => {
    // 处理类选择器
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\-/g, '-');
    const regex = new RegExp(`${escapedSelector}[^{]*\\{[^}]+\\}`, 'g');
    const matches = cssContent.match(regex);
    if (matches) {
      matches.forEach(match => {
        if (!processedRules.has(match)) {
          criticalCSS += `${match}\n`;
          processedRules.add(match);
        }
      });
    }
  });

  // 压缩生成的关键CSS
  criticalCSS = criticalCSS
    .replace(/\/\*.*?\*\//g, '') // 移除注释
    .replace(/\s+/g, ' ') // 压缩空白
    .replace(/;\s*}/g, '}') // 移除最后的分号
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*,\s*/g, ',');

  return criticalCSS;
}
