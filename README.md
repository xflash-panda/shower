# Shower

一个基于 React + TypeScript + Vite 的现代化主题项目原型。

## 技术栈

- **前端框架**: React 18
- **类型系统**: TypeScript
- **构建工具**: Vite
- **UI 组件**: Reactstrap (Bootstrap 5)
- **国际化**: react-i18next
- **包管理器**: Yarn

## 快速开始

### 环境要求

- Node.js >= 16
- Yarn >= 1.22

### 安装依赖

```bash
yarn install
```

### 开发模式

```bash
yarn dev
```

### 构建项目

```bash
yarn build
```

### 预览构建结果

```bash
yarn preview
```

### 代码检查

```bash
yarn lint
```

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── Common/         # 公共组件
│   └── [PageName]/     # 页面组件
├── layout/             # 布局组件
├── pages/              # 页面文件
├── hooks/              # 自定义 Hooks
├── api/                # API 接口
├── helpers/            # 工具函数
├── config/             # 配置文件
├── data/               # 静态数据
├── types/              # 类型定义
└── locales/            # 国际化文件
```

## 开发规范

项目严格遵循编码规范，详细规范请查看：

- [CLAUDE.md](./CLAUDE.md) - 项目开发指南
- [.cursorrules](./.cursorrules) - 编辑器规范

### 核心规范

- 使用 TypeScript 进行开发
- 必须使用 Yarn 管理依赖
- 强制使用 @ alias 绝对路径
- 所有用户界面文本需要国际化
- 遵循组件化开发模式

## 国际化

项目支持多语言，配置文件位于 `src/locales/` 目录：

- 公共组件翻译：`common.json`
- 页面专用翻译：按页面名称创建对应文件

## 许可证

本项目遵循 MIT 许可证。