# 🚀 Blog Reset Version (Vue 3 + Vite 7)

<p align="center">
  <img src="./public/intro-image.svg" width="300" height="155" alt="Frontend Template Intro">
</p>

基于 **Vue 3.5 + Vite 7 + TypeScript** 构建的现代化博客前端模板。旨在提供一个清新、优雅且功能完备的博客系统，支持响应式布局、动态主题和国际化。

## ✨ 核心亮点

### 🎨 清新优雅的设计

- **现代化 UI**：基于 **Naive UI**，设计精美且高度可定制。
- **原子化 CSS**：使用 **UnoCSS** 极速构建样式，代码体积更小。
- **响应式布局**：完美适配桌面端、平板和移动端，提供一致的阅读体验。

### 🏗️ 现代化技术栈

- **Vue 3.5+**：采用最新 Composition API，性能卓越，逻辑清晰。
- **Vite 7+**：秒级启动，极速 HMR 体验，现代构建流程。
- **TypeScript 5+**：全链路类型安全，开发体验一流。
- **Pinia 3+**：轻量级、类型安全的官方状态管理方案。

### ✍️ 博客功能

- **文章展示**：支持 Markdown 渲染（使用 `md-editor-v3`）。
- **内容分类**：完整的归档、标签和分类系统。
- **用户中心**：支持个人信息修改、头像裁剪（使用 `vue-cropper`）和安全设置。
- **搜索系统**：内置全局搜索功能。

### 🛠️ 工程化特性

- **国际化**：集成 `vue-i18n`，支持中英文动态切换。
- **HTTP 封装**：基于 `axios` 和 `@vakao/axios` 的高度封装，支持自动 Loading、Token 刷新和类型提示。
- **路由守卫**：完善的权限校验和加载进度条。
- **代码规范**：ESLint + Prettier + Husky + Commitlint，保证代码质量和提交规范。

## 🛠️ 技术栈详情

| 分类         | 技术选型     | 版本 | 说明                   |
| ------------ | ------------ | ---- | ---------------------- |
| **核心框架** | Vue          | 3.5+ | 最新 Composition API   |
| **构建工具** | Vite         | 7+   | 极速构建与开发体验     |
| **编程语言** | TypeScript   | 5+   | 类型安全               |
| **UI 组件**  | Naive UI     | 2+   | 现代化组件库           |
| **CSS 引擎** | UnoCSS       | -    | 原子化 CSS             |
| **状态管理** | Pinia        | 3+   | 官方推荐状态管理       |
| **Markdown** | md-editor-v3 | 6+   | 强大的 MD 编辑与渲染   |
| **工具库**   | VueUse       | -    | Composition API 工具集 |
| **日期处理** | Day.js       | -    | 轻量级日期处理         |

## 🚀 快速开始

### 📋 环境要求

- **Node.js** 18+
- **包管理器** pnpm (推荐)

### ⚡ 一键启动

```bash
# 1. 克隆项目
git clone https://github.com/Rouarn/blog-reset-version.git

# 2. 安装依赖
pnpm install

# 3. 启动项目
pnpm dev
```

访问：`http://localhost:5173`

## 📁 项目结构

```text
src/
├── assets/         # 静态资源 (SVG, Images, JSON)
├── components/     # 公共组件 (AppProvider, SystemLogo等)
├── directives/     # 自定义指令 (copy, loading, mask等)
├── hooks/          # 组合式函数 (useRole, useBoolean等)
├── layouts/        # 布局组件 (BlogLayout, BaseLayout等)
├── locales/        # 国际化语言包
├── plugins/        # 插件配置 (app, iconify, loading等)
├── router/         # 路由配置与守卫
├── service/        # API 请求服务 (Axios 封装)
├── stores/         # Pinia 状态管理
├── styles/         # 全局样式
├── theme/          # 主题与变量配置
├── typings/        # TypeScript 类型定义
└── views/          # 页面组件 (home, article, tags等)
```

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源 © 2024 Rouarn

---

<div align="center">
**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**
_Built with ❤️ by Rouarn_
</div>
