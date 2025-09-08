# Claude Code 项目配置

## 语言设置

- **默认语言**: 中文 (zh-CN)
- **回复语言**: 请始终使用中文回复

## 项目信息

这是一个基于 React + TypeScript + Vite 的主题项目原型。

## 常用命令

- `yarn dev` - 启动开发服务器
- `yarn build` - 构建生产版本
- `yarn lint` - 代码检查
- `yarn preview` - 预览构建结果

---

# Shower 项目编码规范

## CRITICAL RULES (必须严格遵循)

### 包管理器

- 必须使用 yarn，禁止 npm
- 所有依赖管理使用 yarn 命令

### TypeScript 规范

- 必须使用 TypeScript (.ts/.tsx)
- 严格类型检查，避免 any 类型
- 异常和日志消息必须使用英文

### 模块引入规范

- 强制使用 @ alias 绝对路径，禁止相对路径
- API 函数必须导入具体名称，禁止 import \* as
- POST 接口直接调用，禁止使用 SWR 包装

### 组件和文件结构

- 子组件放在 components/ 目录，按页面功能分组
- Layout 组件独立在 layout/ 目录
- Hooks 文件名必须与对应 API 文件保持一致

### 样式规范

- 禁止内联 style 属性
- 优先使用 className 和项目样式类
- 禁止固定字体大小类，支持 customizer 响应式
- 主要操作用实心按钮，次要操作用 outline 按钮

### 命名规范

- 变量/函数: camelCase
- 常量: SCREAMING_SNAKE_CASE
- 类型/接口/组件: PascalCase
- 布尔值: is/has/can 前缀

### 国际化 (i18n) 规范

- 必须使用 react-i18next 进行国际化
- 公共组件 (@components/Common/\*) 的翻译放在 common.json 中
- 每个页面的翻译单独创建文件，文件名与页面名一致 (小写)
- 翻译文件结构: src/locales/{语言}/{namespace}.json
- 日志消息和错误信息不需要国际化，统一使用英文
- 所有用户界面文本必须使用 t() 函数包装

## IMPORTANT RULES (重要规范)

### 文档策略

- 默认不生成文档文件，除非用户明确要求
- 专注核心功能实现

### 可用 Alias 路径

```
@/*           → src/*
@components/* → src/components/*
@pages/*      → src/pages/*
@layout/*     → src/layout/*
@hooks/*      → src/hooks/*
@api/*        → src/api/*
@helpers/*    → src/helpers/*
@config/*     → src/config/*
@data/*       → src/data/*
@types/*      → src/types/*
```

### Button 使用规范

- 页面只能有一个实心 primary 按钮
- 危险操作使用 danger 颜色
- 列表操作统一使用 outline 样式

### 导入顺序

1. React 相关
2. 第三方 UI 库 (包括 react-i18next)
3. 项目组件
4. 数据和配置
5. 工具函数和 Hooks
6. API 和类型

## GOOD EXAMPLES

### 正确的导入方式

```typescript
import React, { useState } from 'react';
import { Button, Card, CardBody } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import ServerNodeCard from '@components/Dashboard/ServerNodeCard';
import { userInfo, logout } from '@/api/v1/user';
import { useUserInfo } from '@/hooks/useUser';
```

### 正确的组件样式

```typescript
// 使用 className
<div className="text-danger pa-20">
  <h6 className="mg-b-0">标题</h6>  // 响应式字体
  <Button color="primary">保存</Button>  // 主要操作
  <Button color="secondary" outline>取消</Button>  // 次要操作
</div>
```

### 正确的 API 调用

```typescript
// GET 接口使用 SWR
const { data, error } = useUserInfo();

// POST 接口直接调用
const handleSave = async () => {
  try {
    await updateProfile(data);
    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error('Failed to update profile');
  }
};
```

### 正确的 i18n 使用

```typescript
import { useTranslation } from 'react-i18next';

// 公共组件使用 common namespace
const CommonButton = () => {
  const { t } = useTranslation('common');
  return <Button>{t('common.save')}</Button>;
};

// 页面组件使用专用 namespace
const ProfilePage = () => {
  const { t } = useTranslation('profile');
  return (
    <div>
      <h1>{t('profile.title')}</h1>
      <span>{t('profile.username')}</span>
    </div>
  );
};

// 日志消息使用英文
console.log('User profile updated successfully');
console.error('Failed to update user profile:', error);
```

## FORBIDDEN PATTERNS

- 使用 npm 命令
- 相对路径导入 (../../)
- 内联 style 属性
- HTML 语法 style="..."
- 中文异常消息
- 固定字体大小类 (f-s-12, f-s-14)
- import \* as 导入 API
- POST 接口使用 SWR
- 多个实心主要按钮
- 子组件放在 pages/ 目录
- 硬编码文本内容 (必须使用 t() 函数)
- 日志消息使用中文
- 跨页面共享翻译 namespace (除 common 外)
- 在 console.log/error 中使用 t() 函数

## 样式类参考

### 常用颜色类

text-primary, text-secondary, text-success, text-danger, text-muted

### 常用间距类

mg-b-0, mg-b-5, mg-b-10, pa-10, pa-15, pa-20

### 常用字体类

f-fw-600 (粗体), small (小字体), h6 (标题)

### 常用布局类

d-flex, justify-content-center, align-items-center, gap-2

遵循以上规范确保代码质量和一致性。重点关注 CRITICAL RULES，这些是不可违反的核心规范。
