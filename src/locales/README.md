# 🌍 Shower 项目国际化 (i18n) 使用指南

## 📋 概述

本项目使用 `i18next` + `react-i18next` + `vite-plugin-i18next-loader` 实现国际化功能，支持中文 (zh) 和英文 (en) 两种语言。

## 🚀 快速开始

### 1. 基本使用

```typescript
import { useTranslation } from '@/helpers/i18n';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('dashboard.title')}</p>
    </div>
  );
};
```

### 2. 语言切换

```typescript
import { changeLanguage, getCurrentLanguage } from '@/helpers/i18n';

const LanguageSwitcher = () => {
  const currentLang = getCurrentLanguage();

  const handleSwitch = async () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    await changeLanguage(newLang);
  };

  return (
    <button onClick={handleSwitch}>
      {currentLang === 'zh' ? 'Switch to English' : '切换到中文'}
    </button>
  );
};
```

## 📁 文件结构

```
src/
├── locales/           # 语言资源文件目录
│   ├── zh/           # 中文语言包
│   │   └── common.json
│   ├── en/           # 英文语言包
│   │   └── common.json
│   └── README.md     # 本文档
├── i18n.ts           # i18next 配置文件
├── helpers/
│   └── i18n.ts       # i18n 工具函数
└── Types/
    └── i18next.d.ts  # TypeScript 类型定义
```

## 🔧 配置说明

### i18n 配置 (`src/i18n.ts`)

- **默认语言**: 中文 (zh)
- **后备语言**: 中文 (zh)
- **语言检测顺序**: localStorage → navigator → htmlTag
- **缓存方式**: localStorage
- **调试模式**: 仅在开发环境启用

### Vite 插件配置

```typescript
// vite.config.ts
import i18nextLoader from 'vite-plugin-i18next-loader';

export default defineConfig({
  plugins: [
    i18nextLoader({
      paths: ['./src/locales'],
      namespaceResolution: 'basename',
    }),
  ],
});
```

## 📝 翻译键值结构

### common.json 结构

```json
{
  "language": {
    "chinese": "中文",
    "english": "English"
  },
  "menu": {
    "dashboard": "仪表盘",
    "traffic": "流量统计"
    // ...
  },
  "common": {
    "welcome": "欢迎",
    "logout": "退出登录"
    // ...
  },
  "dashboard": {
    "title": "仪表盘",
    "totalUsers": "总用户数"
    // ...
  }
}
```

## 🎯 最佳实践

### 1. 翻译键命名规范

- 使用小驼峰命名法: `camelCase`
- 按功能模块分组: `menu.*`, `common.*`, `dashboard.*`
- 保持键名简洁且语义明确

### 2. 组件中的使用

```typescript
// ✅ 推荐
const { t } = useTranslation();
return <h1>{t('dashboard.title')}</h1>;

// ❌ 不推荐
const { t } = useTranslation();
return <h1>{t('仪表盘')}</h1>;
```

### 3. 类型安全

项目配置了 TypeScript 类型定义，提供：

- 自动补全
- 类型检查
- 编译时错误检测

### 4. 新增翻译

1. 在 `zh/common.json` 中添加中文翻译
2. 在 `en/common.json` 中添加对应的英文翻译
3. 确保键名完全一致

### 5. 性能优化

- 使用 `react-i18next` 的 `useSuspense: false` 避免渲染阻塞
- 通过 `vite-plugin-i18next-loader` 实现按需加载
- 翻译资源会被 Vite 自动优化和缓存

## 🔄 语言切换流程

1. 用户点击语言切换按钮
2. `HeaderLanguage` 组件调用 `i18n.changeLanguage()`
3. i18next 更新当前语言设置
4. 自动保存到 localStorage
5. 所有使用 `useTranslation` 的组件自动重新渲染

## 🛠️ 开发工具

### Helper 函数 (`@/helpers/i18n`)

- `useTranslation()`: 获取翻译函数
- `getCurrentLanguage()`: 获取当前语言
- `changeLanguage(lang)`: 切换语言
- `isSupportedLanguage(lang)`: 检查语言支持
- `getLanguageDisplayName(lang)`: 获取语言显示名

### 示例组件

查看 `src/Components/Common/I18nExample.tsx` 了解完整的使用示例。

## 🚨 注意事项

1. **遵循项目规范**: 使用项目的样式类，禁止内联样式
2. **TypeScript 严格模式**: 避免使用 `any` 类型
3. **组件文件结构**: 通用组件放在 `Components/Common/` 目录
4. **导入路径**: 使用项目配置的别名 `@/helpers`, `@/components` 等

## 🔍 故障排除

### 常见问题

1. **翻译不生效**
   - 检查键名是否正确
   - 确认语言文件格式是否正确
   - 检查 i18n 是否正确初始化

2. **类型错误**
   - 确认已导入类型定义文件
   - 检查翻译键是否存在于 JSON 文件中

3. **语言切换不生效**
   - 检查 localStorage 权限
   - 确认语言代码映射是否正确

## 📚 相关链接

- [i18next 官方文档](https://www.i18next.com/)
- [react-i18next 文档](https://react.i18next.com/)
- [vite-plugin-i18next-loader](https://github.com/chnm/vite-plugin-i18next-loader)
