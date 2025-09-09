import type { Plugin } from 'vite';

/**
 * 版本注入插件
 * 读取 PHP 在 HTML 中定义的版本变量，自动为动态导入添加版本参数
 *
 * PHP 端使用方式：
 * <script>window.__APP_VERSION__ = "1.0.1";</script>
 *
 * 如果没有定义版本变量，则不添加版本参数
 */
export function versionInjectPlugin(): Plugin {
  return {
    name: 'vite-plugin-version-inject',
    apply: 'build',

    generateBundle(opts, bundle) {
      Object.keys(bundle).forEach(fileName => {
        const chunk = bundle[fileName];
        if (chunk.type !== 'chunk') return;

        // 修改动态导入，添加版本检查逻辑
        chunk.code = chunk.code.replace(
          /import\s*\(\s*["']([^"'?]+\.min\.js)["']\s*\)/g,
          (match, path) => {
            // 生成带版本检查的动态导入代码
            return `import(${JSON.stringify(path)} + (window.__APP_VERSION__ ? "?v=" + window.__APP_VERSION__ : ""))`;
          },
        );

        // 处理已经有查询参数的情况
        chunk.code = chunk.code.replace(
          /import\s*\(\s*["']([^"']+\.min\.js)\?([^"']*)["']\s*\)/g,
          (match, path, existingParams) => {
            // 对于已有查询参数的情况，需要更复杂的逻辑
            return `import(${JSON.stringify(path)} + "?" + ${JSON.stringify(existingParams)} + (window.__APP_VERSION__ ? "&v=" + window.__APP_VERSION__ : ""))`;
          },
        );

        // 处理其他可能的动态导入格式
        chunk.code = chunk.code.replace(/import\s*\(\s*["']([^"'?]+)["']\s*\)/g, (match, path) => {
          // 只处理 .js 文件，避免影响其他资源
          if (!path.endsWith('.js') && !path.endsWith('.min.js')) {
            return match; // 保持原样
          }

          return `import(${JSON.stringify(path)} + (window.__APP_VERSION__ ? "?v=" + window.__APP_VERSION__ : ""))`;
        });
      });
    },
  };
}
