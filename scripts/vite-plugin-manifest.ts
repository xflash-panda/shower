import type { Plugin } from 'vite';
import { writeFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

/**
 * 生成 PHP 可读的 manifest 文件
 * 解决 hash 文件名在 PHP 中的引用问题
 */
export function manifestPlugin(): Plugin {
  let outputDir: string;
  const entryFiles: Map<string, string> = new Map(); // 存储入口文件映射: originalName -> hashedName
  const chunkFiles: Map<string, string> = new Map(); // 存储代码块文件映射: originalName -> hashedName
  let mainEntryFile: string = '';

  return {
    name: 'vite-plugin-manifest',
    apply: 'build',

    // 在 generateBundle 阶段记录文件信息
    generateBundle(opts, bundle) {
      outputDir = opts.dir || 'dist';

      // 分类处理 entry 文件和 chunk 文件
      Object.keys(bundle).forEach(fileName => {
        const chunk = bundle[fileName];

        if (chunk.type === 'chunk' && fileName.endsWith('.chunk.min.js')) {
          // 提取原始名称（去掉 hash 和 chunk）
          const originalName = fileName.replace(/-[a-zA-Z0-9_]+\.chunk\.min\.js$/, '.min.js');

          if (chunk.isEntry) {
            // 入口文件
            entryFiles.set(originalName, fileName);

            // 检测主入口文件（通常是 main.tsx 或 index.tsx 生成的）
            if (
              chunk.facadeModuleId?.includes('main.tsx') ||
              chunk.facadeModuleId?.includes('index.tsx') ||
              originalName === 'index.min.js'
            ) {
              mainEntryFile = fileName;
            }
          } else {
            // 代码块文件（通过 manualChunks 或自动分割生成）
            chunkFiles.set(originalName, fileName);
          }
        }
      });

      console.log('📦 Entry files detected:', entryFiles.size);
      console.log('🧩 Chunk files detected:', chunkFiles.size);
      console.log('🎯 Main entry file:', mainEntryFile || 'not detected yet');

      // 输出调试信息
      if (entryFiles.size > 0) {
        console.log('📦 Entry files:', Array.from(entryFiles.keys()));
      }
      if (chunkFiles.size > 0) {
        console.log('🧩 Chunk files:', Array.from(chunkFiles.keys()).slice(0, 5), '...');
      }
    },

    // 在 writeBundle 阶段基于实际输出文件生成 manifest
    writeBundle() {
      const manifest: Record<string, string> = {};
      const reverseManifest: Record<string, string> = {}; // 反向映射
      const jsDir = join(outputDir, 'assets', 'js');

      try {
        // 读取实际输出的 JS 文件
        const actualFiles = readdirSync(jsDir).filter(
          file => file.endsWith('.chunk.min.js') && statSync(join(jsDir, file)).isFile(),
        );

        // 分析所有实际文件，建立映射关系
        actualFiles.forEach(fileName => {
          // 提取原始名称（去掉 hash 和 chunk）
          const originalName = fileName.replace(/-[a-zA-Z0-9_]+\.chunk\.min\.js$/, '.min.js');
          const fullPath = `assets/js/${fileName}`;
          // 正向映射：originalName -> hashedPath
          manifest[originalName] = fullPath;

          // 反向映射：hashedPath -> originalName
          reverseManifest[fullPath] = originalName;

          // 额外支持：assets/js/originalName -> originalName（处理错误查找路径）
          const directPath = `assets/js/${originalName}`;
          reverseManifest[directPath] = originalName;
        });

        // 合并正向和反向映射
        const combinedManifest = {
          ...manifest,
          _reverse: reverseManifest,
        };

        // 生成 JSON 格式的 manifest
        const jsonManifest = JSON.stringify(combinedManifest, null, 2);

        // 写入 manifest 文件到输出目录
        writeFileSync(resolve(outputDir, 'manifest.json'), jsonManifest);

        console.log('✓ Generated manifest with:');
        console.log(`  - ${Object.keys(manifest).length} files mapped`);
        console.log(`  - ${Object.keys(reverseManifest).length} reverse mappings`);
        console.log(`  - Main entry (index.min.js): ${manifest['index.min.js'] || 'not found'}`);
      } catch (error) {
        console.error('✗ Failed to generate manifest:', error);
      }
    },
  };
}
