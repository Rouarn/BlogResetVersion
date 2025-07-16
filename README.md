# frontend-template

## 项目概述
`frontend-template` 是一个基于 Vue 3 和 Vite 的前端开发模板，旨在帮助开发者快速启动现代化的前端项目。该模板提供了完整的开发环境配置、类型检查支持以及代码质量工具，简化了项目初始化流程。

## 技术栈
- **Vue 3**: 使用 Vue 3 作为核心框架，支持组合式 API 和响应式系统。
- **Vite**: 提供极速的冷启动体验和高效的模块热更新（HMR）。
- **TypeScript**: 提供静态类型检查，提升代码可维护性。
- **Pinia**: 用于状态管理，替代传统的 Vuex。
- **Vue Router**: 实现页面路由管理。
- **ESLint & Prettier**: 保证代码风格一致性和代码质量。

## 主要功能
- 标准化的项目结构，便于团队协作和代码管理。
- 支持 TypeScript 类型检查和自动类型推导。
- 集成 Pinia 状态管理库。
- 支持 Vue Router 进行页面导航。
- 提供基础样式文件和组件示例。

## 快速开始
### 开发环境搭建
1. 安装 Node.js 和 pnpm。
2. 克隆项目到本地：
   ```sh
   git clone <repository-url>
   ```
3. 安装依赖：
   ```sh
   pnpm install
   ```
4. 启动开发服务器：
   ```sh
   pnpm dev
   ```
5. 构建生产版本：
   ```sh
   pnpm build
   ```

## 目录结构
- **src/assets**: 存放静态资源文件。
- **src/components**: 可复用的 Vue 组件。
- **src/router**: Vue Router 配置。
- **src/stores**: 使用 Pinia 进行状态管理。
- **src/views**: 页面级组件。
- **vite.config.ts**: Vite 配置文件。
- **tsconfig.json**: TypeScript 配置文件。

## 贡献与扩展
欢迎提交 Issue 和 Pull Request，帮助改进模板的功能和文档。同时可以根据具体业务需求进行定制化扩展。