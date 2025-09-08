import type { Plugin } from 'vite';
import { PurgeCSS } from 'purgecss';

/**
 * 增强的 PurgeCSS 插件 - 构建完成后处理 dist 目录中的文件
 *
 * 特性：
 * - 清理未使用的 CSS 规则
 * - 保留项目必需的 CSS 类
 * - 自动生成 .min.css 文件
 * - 备用 CleanCSS 压缩处理
 * - 更新 HTML 中的 CSS 引用
 */
export function purgeCSSPlugin(): Plugin {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    name: 'vite-plugin-purgecss-enhanced',
    writeBundle: async (options, bundle) => {
      if (isProduction) {
        const fs = await import('fs');
        const path = await import('path');
        const purgeCSS = new PurgeCSS();

        // 内容扫描路径
        const contentPaths = ['./src/**/*.{ts,tsx,js,jsx}', './index.html', './src/**/*.html'];

        // 通用 PurgeCSS 配置
        const purgeConfig = {
          content: contentPaths,
          defaultExtractor: (content: string) => content.match(/[A-Za-z0-9-_:/[\]]+/g) || [],
          safelist: {
            standard: [
              // Bootstrap 相关
              'active',
              'show',
              'hide',
              'fade',
              'collapse',
              'dropdown-toggle',
              'modal',
              'modal-backdrop',
              'btn-close',
              'carousel-item',
              /^bs-/,
              /^modal-/,
              /^dropdown-/,
              /^nav-/,
              /^navbar-/,
              /^card-/,
              /^table-/,
              /^form-/,
              /^input-/,
              /^btn-/,

              // 响应式类
              /^col-/,
              /^row/,
              /^container/,
              /^offset-/,
              /^order-/,
              /^d-(xs|sm|md|lg|xl|xxl)-/,
              /^flex-(xs|sm|md|lg|xl|xxl)-/,

              // 工具类
              /^p[xtbserl]?-/,
              /^m[xtbserl]?-/,
              /^g[xy]?-/,
              /^text-/,
              /^bg-/,
              /^border/,
              /^rounded/,
              /^shadow/,

              // 项目特定类
              /^f-/,
              /^pa-/,
              /^mg-/,
              /^b-/,
              /^txt-/,
              /^link-/,
              /^w-/,
              /^h-/,
              /^d-/,
              /^justify-/,
              /^align-/,
              /^flex-/,
              /^gap-/,
              /^cursor-/,
              /^position-/,
              /^overflow-/,

              // === 精确的图标库配置 - 只保留实际使用的图标 ===

              // Phosphor Icons - 仅保留实际使用的图标
              'ph',
              'ph-duotone',
              'ph-bold',
              'ph-spin',
              'ph-graph',
              'ph-upload',
              'ph-download',
              'ph-chart-line',
              'ph-gauge',
              'ph-crown',
              'ph-devices',
              'ph-monitor',
              'ph-eye',
              'ph-eye-slash',
              'ph-globe-hemisphere-west',
              'ph-moon-stars',
              'ph-sun-dim',
              'ph-spinner',
              'ph-wallet',
              'ph-user-circle',

              // Tabler Icons - 仅保留实际使用的图标
              'ti',
              'ti-brand-apple',
              'ti-brand-google',
              'ti-home',

              // Iconoir Icons - 仅保留实际使用的图标
              'iconoir-glass-empty',

              // Flag Icons - 保留国旗图标基础类
              'flag-icon',
              'flag-icon-squared',
              'b-r-10',
              /^flag-icon-[a-z]{2,3}$/, // 国家代码，如 flag-icon-us, flag-icon-cn, flag-icon-chn, flag-icon-usa

              // Font Awesome - 如果没有使用则不保留任何
              // 注释掉以强制删除所有 FA 图标
              // /^fa/, /^fas/, /^far/, /^fab/,

              // 滑块和动画
              /^slick-/,
              /^swiper/,
              /^animate/,
              /^aos/,

              // Toastify 相关
              /^toastify/,
              /^toast/,

              // 状态和交互类
              /^hover/,
              /^focus/,
              /^disabled/,
              /^loading/,
              /^data-/,
              /^aria-/,

              // 主题相关类
              'dark',
              'light',
            ],
          },
          // 启用更激进的清理
          rejected: true,
        };

        // 1. 处理 Vite 生成的 CSS bundle
        for (const [fileName, file] of Object.entries(bundle)) {
          if (fileName.endsWith('.css') && 'source' in file) {
            try {
              const purgedResult = await purgeCSS.purge({
                ...purgeConfig,
                css: [{ raw: file.source as string }],
              });

              if (purgedResult.length > 0) {
                const originalSize = (file.source as string).length;
                const newSize = purgedResult[0].css.length;
                (file as any).source = purgedResult[0].css;
                console.log(
                  `✅ PurgeCSS processed ${fileName}: ${originalSize} → ${newSize} bytes (saved ${originalSize - newSize} bytes)`,
                );
              }
            } catch (error) {
              console.warn(`⚠️ PurgeCSS failed for ${fileName}:`, error);
            }
          }
        }

        // 2. 构建完成后，直接处理 dist 目录中所有的静态 CSS 文件
        const glob = (await import('glob')).glob;
        const distCSSPattern = 'dist/**/*.css';
        const distCSSFiles = await glob(distCSSPattern);

        // 排除主样式文件，避免破坏主题功能
        const excludePatterns = [
          'dist/assets/css/index.css',
          'dist/assets/css/style.css',
          'dist/assets/css/responsive.css',
        ];

        const filteredCSSFiles = distCSSFiles.filter(
          file => !excludePatterns.some(pattern => file.includes(pattern.replace('dist/', ''))),
        );

        let totalOriginalSize = 0;
        let totalNewSize = 0;
        const processedFiles: { original: string; minified: string }[] = [];

        for (const filePath of filteredCSSFiles) {
          try {
            const fullPath = path.resolve(filePath);
            if (fs.existsSync(fullPath)) {
              const originalCSS = fs.readFileSync(fullPath, 'utf8');

              // 检查 CSS 语法是否有问题
              if (!originalCSS.trim()) {
                console.log(`⏭️ Skipped empty CSS file: ${filePath}`);
                continue;
              }

              // 简单检查是否有明显的语法错误
              const openBraces = (originalCSS.match(/\{/g) || []).length;
              const closeBraces = (originalCSS.match(/\}/g) || []).length;

              if (openBraces !== closeBraces) {
                console.warn(
                  `⚠️ Skipped CSS file with syntax issues: ${filePath} (unbalanced braces: ${openBraces} open, ${closeBraces} close)`,
                );
                continue;
              }

              const purgedResult = await purgeCSS.purge({
                ...purgeConfig,
                css: [{ raw: originalCSS }],
              });

              if (purgedResult.length > 0) {
                const newCSS = purgedResult[0].css;
                const originalSize = originalCSS.length;
                const newSize = newCSS.length;

                totalOriginalSize += originalSize;
                totalNewSize += newSize;

                // 生成 .min.css 文件名（如果不是已经是 .min.css）
                const minFilePath = filePath.endsWith('.min.css')
                  ? filePath
                  : filePath.replace(/\.css$/, '.min.css');
                const minFullPath = path.resolve(minFilePath);

                // 保存为 .min.css 文件
                fs.writeFileSync(minFullPath, newCSS);

                // 删除原文件（如果不是已经是 .min.css）
                if (!filePath.endsWith('.min.css')) {
                  fs.unlinkSync(fullPath);
                }

                processedFiles.push({ original: filePath, minified: minFilePath });
                console.log(
                  `✅ PurgeCSS processed ${filePath} → ${minFilePath}: ${originalSize} → ${newSize} bytes (saved ${originalSize - newSize} bytes)`,
                );
              }
            }
          } catch (error) {
            // 对于语法错误的文件，尝试基本的 CleanCSS 压缩
            try {
              const CleanCSS = (await import('clean-css')).default;
              const cleanCSS = new CleanCSS({
                level: 1, // 保守级别的压缩
                rebase: false,
                compatibility: '*',
              });

              const originalCSS = fs.readFileSync(path.resolve(filePath), 'utf8');
              const result = await cleanCSS.minify(originalCSS);

              if (!result.errors || result.errors.length === 0) {
                const originalSize = originalCSS.length;
                const newSize = result.styles.length;

                totalOriginalSize += originalSize;
                totalNewSize += newSize;

                // 生成 .min.css 文件名（如果不是已经是 .min.css）
                const minFilePath = filePath.endsWith('.min.css')
                  ? filePath
                  : filePath.replace(/\.css$/, '.min.css');
                const minFullPath = path.resolve(minFilePath);

                // 保存为 .min.css 文件
                fs.writeFileSync(minFullPath, result.styles);

                // 删除原文件（如果不是已经是 .min.css）
                if (!filePath.endsWith('.min.css')) {
                  fs.unlinkSync(path.resolve(filePath));
                }

                processedFiles.push({ original: filePath, minified: minFilePath });
                console.log(
                  `✅ CleanCSS fallback ${filePath} → ${minFilePath}: ${originalSize} → ${newSize} bytes (PurgeCSS skipped due to syntax)`,
                );
              } else {
                console.warn(
                  `⚠️ Both PurgeCSS and CleanCSS failed for ${filePath}:`,
                  (error as Error).message,
                );
              }
            } catch (_fallbackError) {
              console.warn(
                `⚠️ All CSS processing failed for ${filePath}:`,
                (error as Error).message,
              );
            }
          }
        }

        // 3. 更新 dist/index.html 中的 CSS 引用
        const indexHtmlPath = path.resolve('dist/index.html');
        if (fs.existsSync(indexHtmlPath)) {
          try {
            let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

            // 更新所有 CSS 文件引用，确保使用绝对路径
            processedFiles.forEach(({ original, minified }) => {
              const originalFileName = path.basename(original);
              const minifiedAbsolutePath = `/${minified.replace('dist/', '')}`;

              // 更新HTML中的CSS链接引用，将原文件名替换为 .min.css 版本
              htmlContent = htmlContent.replace(
                new RegExp(`href="[^"]*${originalFileName.replace('.', '\\.')}"`, 'g'),
                `href="${minifiedAbsolutePath}"`,
              );
            });

            fs.writeFileSync(indexHtmlPath, htmlContent);
            console.log(`✅ Updated dist/index.html CSS references to .min.css versions`);
          } catch (error) {
            console.warn(`⚠️ Failed to update dist/index.html:`, error);
          }
        }

        console.log(
          `✅ PurgeCSS total: ${totalOriginalSize} → ${totalNewSize} bytes (saved ${totalOriginalSize - totalNewSize} bytes across ${processedFiles.length} files)`,
        );
      }
    },
  };
}
