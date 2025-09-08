import { type Plugin } from 'vite';

/**
 * HTML 中 CSS 链接异步化插件
 * 将阻塞渲染的 CSS 链接转换为异步加载，提高页面加载性能
 */
export function asyncifyCSSPlugin(): Plugin {
  return {
    name: 'vite-plugin-asyncify-css',
    apply: 'build',
    enforce: 'post', // 确保在其他插件之后执行
    generateBundle(opts, bundle) {
      const htmlFiles = Object.keys(bundle).filter(name => name.endsWith('.html'));

      htmlFiles.forEach(htmlFile => {
        const htmlChunk = bundle[htmlFile];
        if (htmlChunk.type !== 'asset') return;

        let htmlContent = htmlChunk.source as string;

        // 先移除已存在的 noscript 标签，避免嵌套
        htmlContent = htmlContent.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');

        // 收集所有需要转换的 CSS 链接
        const cssLinks: { href: string; crossorigin: string }[] = [];
        const processedHrefs = new Set<string>();

        // 将所有阻塞的 CSS 链接转换为异步加载
        htmlContent = htmlContent.replace(/<link\s+[^>]*rel="stylesheet"[^>]*>/g, match => {
          const hrefMatch = match.match(/href="([^"]+)"/);
          const crossoriginMatch = match.match(/crossorigin/);

          if (hrefMatch) {
            const href = hrefMatch[1];
            const crossorigin = crossoriginMatch ? ' crossorigin' : '';

            // 检查是否已经处理过这个链接
            if (processedHrefs.has(href)) {
              return ''; // 移除重复的链接
            }

            processedHrefs.add(href);
            cssLinks.push({ href, crossorigin });

            return `<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'"${crossorigin} href="${href}">`;
          }
          return match;
        });

        // 在 </head> 前添加统一的 noscript 标签
        if (cssLinks.length > 0) {
          const noscriptContent = cssLinks
            .map(
              ({ href, crossorigin }) =>
                `      <link rel="stylesheet"${crossorigin} href="${href}">`,
            )
            .join('\n');

          htmlContent = htmlContent.replace(
            '</head>',
            `
    <!-- Fallback for browsers without JS -->
    <noscript>
${noscriptContent}
    </noscript>
  </head>`,
          );
        }

        htmlChunk.source = htmlContent;
      });
    },
  };
}
