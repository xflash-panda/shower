import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

// 公共配置
const commonConfig = {
  languageOptions: {
    ecmaVersion: 2020,
    globals: {
      ...globals.browser,
      Toastify: 'readonly',
      $: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 'latest',
      ecmaFeatures: { jsx: true },
      sourceType: 'module',
    },
  },
  settings: { 
    react: { version: '18.3' },
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  plugins: {
    react,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    prettier,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
    ...reactHooks.configs.recommended.rules,
    ...prettierConfig.rules,
    
    // React 规则
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off', // TypeScript 已提供类型检查
    'react/display-name': 'warn',
    'react/no-array-index-key': 'warn',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-react': 'off', // React 17+ 不需要
    'react/jsx-uses-vars': 'error',
    'react/no-deprecated': 'warn',
    'react/no-direct-mutation-state': 'error',
    'react/no-unknown-property': 'error',
    'react/require-render-return': 'error',
    
    // Prettier
    'prettier/prettier': 'error',
  },
};

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'public/assets/**',
      // 配置文件
      'vite.config.ts',
      'tsconfig.json',
      'tsconfig.node.json',
      'eslint.config.ts',

    ],
  },
  
  // TypeScript/TSX 文件配置 (主要配置)
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ...commonConfig.languageOptions,
      parser: tsparser,
      parserOptions: {
        ...commonConfig.languageOptions.parserOptions,
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: commonConfig.settings,
    plugins: {
      ...commonConfig.plugins,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...commonConfig.rules,
      
      // 使用 TypeScript ESLint 推荐配置
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['recommended-requiring-type-checking'].rules,
      
      // TypeScript 特定规则
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // 根据编码规范，严格禁止 any, 但是有些地方需要使用 any
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' }
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // 禁用与 TypeScript 冲突的原生 ESLint 规则
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      
      // 代码质量规则
      'prefer-const': 'error', // 原生规则已经足够
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
  },

  // Scripts 目录配置 (使用 tsconfig.node.json)
  {
    files: ['scripts/**/*.ts'],
    languageOptions: {
      ...commonConfig.languageOptions,
      parser: tsparser,
      parserOptions: {
        ...commonConfig.languageOptions.parserOptions,
        project: './tsconfig.node.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      // 基础规则
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,
      ...tseslint.configs.recommended.rules,
      
      // TypeScript 特定规则
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',
      
      // 禁用与 TypeScript 冲突的原生 ESLint 规则
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      
      // 代码质量规则
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      
      // Prettier
      'prettier/prettier': 'error',
    },
  },
];
