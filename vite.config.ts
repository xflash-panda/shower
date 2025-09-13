import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import htmlMinifier from 'vite-plugin-html-minifier';
import i18nextLoader from 'vite-plugin-i18next-loader';
import { asyncifyCSSPlugin } from './scripts/vite-plugin-asyncify-css';
import { purgeCSSPlugin } from './scripts/vite-plugin-purgecss';
import { criticalCSSPlugin } from './scripts/vite-plugin-critical-css';
import { manifestPlugin } from './scripts/vite-plugin-manifest';
// import analyze from 'rollup-plugin-analyzer';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';


// 生产环境插件配置
const getProductionPlugins = (isProduction: boolean) => {
  if (!isProduction) return [];
  
  return [
    // 生成文件映射表
    manifestPlugin(),
    // 关键CSS内联 - 必须在最前面执行，避免白屏
    criticalCSSPlugin(),
    htmlMinifier({
      minify: {
        collapseWhitespace: false, // 不压缩空白字符
        keepClosingSlash: true,
        removeComments: true, // 保留：删除HTML注释
        removeRedundantAttributes: true, // 保留：删除冗余属性
        removeScriptTypeAttributes: true, // 保留：删除script type属性
        removeStyleLinkTypeAttributes: true, // 保留：删除style/link type属性
        removeEmptyAttributes: true, // 保留：删除空属性
        useShortDoctype: true, // 保留：使用短doctype
        minifyCSS: true, // 保留：压缩CSS
        minifyJS: true, // 保留：压缩JS
        minifyURLs: true, // 保留：压缩URL
      },
    }),
    // PurgeCSS删除无效CSS (已包含压缩功能)
    purgeCSSPlugin(),
    // CSS链接异步化 - 必须在最后执行
    asyncifyCSSPlugin(),
    // 分析包大小和重复模块 - 开发时启用
    // analyze({
    //   summaryOnly: true,
    //   limit: 20,
    // }),
  ];
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  return {
  base: '/',
  plugins: [
    react(),
    i18nextLoader({
      paths: ['./src/locales'],
      namespaceResolution: 'basename',
    }),
    ...getProductionPlugins(isProduction),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'mixed-decls',
          'color-functions',
          'global-builtin',
          'import',
          'legacy-js-api',
        ],
      },
    },
    // 在生产环境中压缩所有 CSS
    ...(isProduction && {
      postcss: {
        plugins: [
          autoprefixer,
          cssnano({
            preset: ['default', {
              discardComments: {
                removeAll: true,
              },
              normalizeWhitespace: true,
              colormin: true,
              minifySelectors: true,
              minifyFontValues: true,
              mergeLonghand: true,
              mergeRules: true,
              discardDuplicates: true,
              discardEmpty: true,
              discardUnused: true,
            }],
          }),
        ],
      }
    }),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@api': resolve(__dirname, './src/api'),
      '@assets': resolve(__dirname, './src/assets'),
      '@components': resolve(__dirname, './src/components'),
      '@config': resolve(__dirname, './src/config'),
      '@data': resolve(__dirname, './src/data'),
      '@helpers': resolve(__dirname, './src/helpers'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@interceptors': resolve(__dirname, './src/interceptors'),
      '@layout': resolve(__dirname, './src/layout'),
      '@locales': resolve(__dirname, './src/locales'),
      '@pages': resolve(__dirname, './src/pages'),
      '@providers': resolve(__dirname, './src/providers'),
      '@routes': resolve(__dirname, './src/routes'),
      '@scss': resolve(__dirname, './src/scss'),
      '@types': resolve(__dirname, './src/types'),
    },
    dedupe: ['react', 'react-dom'],
  },
  esbuild: {
    target: 'es2022',
    loader: 'tsx',
    include: /.*\.(tsx?)$/,
    exclude: [],
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    minify: 'terser', // 使用 terser 进行更彻底的代码压缩和清理
    // 强制重新构建，避免缓存问题
    emptyOutDir: true,
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console.log
        drop_debugger: true, // 移除 debugger
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // 移除指定的纯函数调用
        dead_code: true, // 移除死代码
        unused: true, // 移除未使用的变量和函数
      },
      mangle: {
        toplevel: false, // 不混淆顶级作用域，避免循环依赖问题
        reserved: ['SWR', 'React', 'ReactDOM'], // 保留重要的导出名称
      },
    },
    rollupOptions: {
      // 避免重复模块和循环依赖的配置
      external: () => {
        // 确保所有依赖都被正确内联，不标记为外部
        return false;
      },
      // 确保正确的模块解析顺序
      preserveEntrySignatures: 'strict',
      output: {
        manualChunks: {
          // 基础框架层 - 最先加载
          'react-core': ['react', 'react-dom', 'react/jsx-runtime'],
          
          // 路由层 - 依赖 React
          'react-router': ['react-router-dom', 'react-router-hash-link'],
          
          // 状态管理和数据获取
          'data-libs': ['swr', 'axios'],
          
          // UI 基础库 - 需要在组件前加载
          'ui-foundation': ['reactstrap', 'bootstrap'],
          
          // 图表库 - 独立模块
          'charts': ['apexcharts', 'react-apexcharts'],
          
          // 地图库 - 独立模块
          'maps': ['@react-jvectormap/core', '@react-jvectormap/world'],
          
          // 国际化
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          
          // 工具库
          'utils': ['dayjs', 'crypto-js', 'bytes-formatter', 'copy-to-clipboard', 'qrcode', 'ua-parser-js'],
          
          // Markdown 相关
          'markdown': ['react-markdown', 'remark-gfm', 'rehype-highlight', 'rehype-raw'],
          
          // 其他 UI 组件
          'ui-components': ['react-slick', 'simplebar-react', 'react-apple-login', '@react-oauth/google'],
        },

        chunkFileNames: 'assets/js/[name]-[hash:8].chunk.min.js',
        entryFileNames: 'assets/js/[name]-[hash:8].entry.min.js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0] || 'unknown';
          const info = fileName.split('.');
          const extType = info[info.length - 1];
          
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(fileName)) {
            return `assets/media/[name].${extType}`;
          }
          if (/\.(png|jpe?g|gif|svg)(\?.*)?$/i.test(fileName)) {
            return `assets/images/[name].${extType}`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(fileName)) {
            return `assets/fonts/[name].${extType}`;
          }
          return `assets/${extType}/[name].${extType}`;
        },
      },
      // 抑制特定文件的 eval 警告
      onwarn(warning, warn) {
        // 忽略来自 @react-jvectormap/core 的 eval 警告
        if (
          warning.code === 'EVAL' && 
          warning.id && 
          warning.id.includes('@react-jvectormap/core')
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react-router-dom',
      'react-i18next',
      'i18next',
      'reactstrap',
      'bootstrap',
      'apexcharts',
      'react-apexcharts',
      'axios',
      'swr',
      'dayjs',
      'i18next',
      'react-i18next',
      'crypto-js',
    ],
    esbuildOptions: {
      target: 'es2022',
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
      },
    },
  },
  server: {
    port: 3080,
    host: true,
    open: true,
    hmr: {
      overlay: true,
    },
    cors: true,
  },
  preview: {
    port: 4173,
    host: true,
    open: true,
  },
  logLevel: isProduction ? 'error' : 'info',
  envPrefix: ['VITE_', 'SHOWER']
  };
});
