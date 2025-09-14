# Frontend Template

基于 Vue 3、Vite、TypeScript 和 Naive UI 构建的现代化前端开发模板，集成**智能菜单自动生成器**，快速启动项目并简化开发流程。

## ✨ 核心特性

### 🎯 智能菜单自动生成

- 基于文件夹结构自动生成菜单，零配置使用
- 智能判断是否分组（≥2个页面自动分组）
- 自动排除 `_` 开头文件夹和隐藏路由
- 预设常用文件夹图标、标题和排序

### 🏗️ 现代化技术栈

- **Vue 3.5+** + Composition API
- **Vite 7+** 极速开发构建
- **TypeScript 5+** 完整类型安全
- **Naive UI 2+** 现代化组件库
- **UnoCSS** 原子化 CSS 引擎

### 🎨 完整功能支持

- **主题系统**：亮色/暗色/跟随系统，动态主题色
- **现代化加载动画 v4.0**：Vue生命周期集成，事件驱动架构，零依赖检测，高性能渲染
- **国际化**：Vue I18n 支持，动态语言切换
- **自定义指令**：复制、拖拽、水印、防抖等实用指令
- **HTTP 请求**：智能重试、请求取消、类型安全封装
- **开发体验**：自动导入、文件路由、全局搜索

### 📦 工程化配置

- ESLint + Prettier + Husky 代码规范
- Pinia 状态管理
- 响应式设计，移动端适配
- 完整的 TypeScript 类型定义

## 🛠️ 技术栈

### 核心框架

- **Vue 3.5+** - 最新的 Vue 3 版本，性能更优
- **Vite 7+** - 下一代前端构建工具，开发体验极佳
- **TypeScript 5+** - 最新 TypeScript，类型系统更强大

### UI 与样式

- **Naive UI 2+** - 现代化 Vue 3 组件库，组件丰富
- **UnoCSS** - 原子化 CSS 引擎，按需生成样式
- **Iconify** - 统一的图标解决方案，支持 100+ 图标集

### 状态与路由

- **Pinia 3+** - Vue 官方推荐的状态管理库
- **Vue Router 4+** - 官方路由管理器
- **Vue I18n 11+** - 国际化解决方案

### 工具库

- **VueUse** - Vue Composition API 工具集
- **Day.js** - 轻量级日期处理库
- **Axios** - HTTP 客户端库
- **Localforage** - 离线存储库，支持 IndexedDB

### 开发工具

- **ESLint 9+** - 代码质量检查工具
- **Prettier 3+** - 代码格式化工具
- **Husky 9+** - Git hooks 管理工具

## 📺 在线预览

- 🌐 **预览地址**: [http://www.shixian.xyz](http://www.shixian.xyz)
- 📱 **移动端**: 支持手机和平板访问
- 🔍 **功能演示**: 完整的功能展示和交互体验

## 📦 安装与运行

### 环境要求

- Node.js 18+
- pnpm

### 快速开始

```
# 克隆项目
git clone https://github.com/Rouarn/frontend-template.git

# 进入项目目录
cd frontend-template

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 常用命令

```
# 开发
pnpm dev              # 启动开发服务器
pnpm dev:prod         # 生产模式开发

# 构建
pnpm build            # 构建生产版本
pnpm build:dev        # 构建开发版本
pnpm preview          # 预览构建结果

# 代码检查
pnpm typecheck        # TypeScript 类型检查
pnpm lint:eslint      # ESLint 检查并修复
pnpm lint:prettier    # Prettier 格式化
pnpm commit           # 规范化提交
```

## 📁 项目结构

```
src/
├── components/               # 公共组件
├── directives/              # 自定义指令
├── hooks/                   # 组合式函数
├── layouts/                 # 布局组件
├── locales/                # 国际化配置
├── plugins/                # 插件配置
├── router/                 # 路由配置
├── service/               # API 服务
├── stores/                # 状态管理
├── styles/               # 样式文件
├── theme/               # 主题配置
├── typings/             # 类型定义
├── utils/               # 工具函数
└── views/               # 页面组件（菜单自动生成的核心目录）
    ├── _builtin/        # 内置页面（自动排除）
    ├── about/           # 关于页面（单独菜单）
    ├── directives/      # 指令演示页面（自动分组）
    ├── home/            # 首页（单独菜单，优先排序）
    └── user-center/     # 用户中心（可设置隐藏）
```

## 🎯 智能菜单系统

### 零配置使用

基于 `src/views` 文件夹结构自动生成菜单，无需手动配置：

```vue
<!-- src/views/directives/copy-direct/index.vue -->
<route lang="json5">
{
  meta: {
    title: '复制指令',
    // 🎉 无需配置 group，自动根据 directives 文件夹生成分组
  },
}
</route>
```

### 智能分组规则

- **单页面**: 直接显示为独立菜单项
- **多页面**: ≥2个页面自动创建分组
- **自动排除**: `_` 开头文件夹和 `hideInMenu: true` 路由
- **预设配置**: 常用文件夹已预设图标和排序

### 文件夹结构示例

```
src/views/
├── home/           # 单独菜单：首页
├── about/          # 单独菜单：关于
├── directives/     # 自动分组：自定义指令
│   ├── copy-direct/
│   └── drag-direct/
└── _builtin/       # 自动排除：内置页面
```

## 🎨 现代化加载动画系统 v4.0

### 🚀 全新架构设计

本模板集成了**现代化加载动画插件 v4.0**，采用全新架构设计，具有以下核心特性：

#### 🎯 Vue生命周期集成

- **精确控制**：基于Vue应用生命周期的精确状态管理
- **事件驱动**：通过自定义事件与Vue应用无缝通信
- **零依赖检测**：不依赖DOM结构检测，避免时机问题

#### ⚡ 高性能优化

- **智能状态管理**：基于Promise的异步状态控制
- **最小化DOM操作**：优化渲染性能，减少重绘重排
- **现代CSS特性**：使用最新动画技术和视觉效果

#### 🎨 现代化设计

- **多层环形动画**：三层旋转环形，渐变色彩效果
- **智能进度显示**：6个预设加载阶段，实时进度反馈
- **响应式适配**：完美支持桌面端和移动端显示
- **无障碍支持**：支持减少动画偏好设置

### 配置选项

在 `vite.config.ts` 中可以自定义加载动画：

```typescript
import { setupLoadingPlugin } from './build/plugins/loading'

export default defineConfig({
  plugins: [
    // 其他插件...
    setupLoadingPlugin({
      enabled: true, // 是否启用插件
      theme: {
        primary: 'hsl(200, 100%, 60%)', // 主环颜色
        secondary: 'hsl(280, 100%, 70%)', // 次环颜色
        accent: 'hsl(45, 100%, 65%)', // 内环颜色
        background: 'hsl(220, 30%, 8%)', // 背景色
        surface: 'hsl(220, 25%, 12%)', // 表面色
        text: 'hsl(0, 0%, 95%)', // 文字颜色
      },
      animation: {
        duration: 800, // 动画持续时间
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // 缓动函数
        exitDuration: 800, // 退出动画时长
      },
      display: {
        minShowTime: 1500, // 最小显示时间
        showProgress: true, // 显示进度条
        showStages: true, // 显示阶段文本
        autoHide: true, // 自动隐藏
      },
    }),
  ],
})
```

### 🔧 API接口

插件提供了完整的JavaScript API，支持手动控制：

```javascript
// 全局API访问
window.ModernLoading.ready() // 标记应用准备就绪
window.ModernLoading.hide() // 隐藏加载动画
window.ModernLoading.setProgress(75) // 设置进度百分比
window.ModernLoading.setStage('加载完成', '即将进入应用') // 设置阶段信息
window.ModernLoading.whenReady() // 返回Promise，等待准备就绪
window.ModernLoading.isActive() // 检查是否激活
window.ModernLoading.getState() // 获取当前状态
```

### 📊 配置项详解

| 配置分类 | 配置项                   | 类型    | 默认值                         | 说明                 |
| -------- | ------------------------ | ------- | ------------------------------ | -------------------- |
| **基础** | `enabled`                | boolean | `true`                         | 是否启用加载动画     |
| **主题** | `theme.primary`          | string  | `hsl(200, 100%, 60%)`          | 主环颜色（HSL格式）  |
|          | `theme.secondary`        | string  | `hsl(280, 100%, 70%)`          | 次环颜色             |
|          | `theme.accent`           | string  | `hsl(45, 100%, 65%)`           | 内环颜色             |
|          | `theme.background`       | string  | `hsl(220, 30%, 8%)`            | 背景颜色             |
| **动画** | `animation.duration`     | number  | `800`                          | 动画持续时间（毫秒） |
|          | `animation.easing`       | string  | `cubic-bezier(0.4, 0, 0.2, 1)` | 缓动函数             |
|          | `animation.exitDuration` | number  | `800`                          | 退出动画时长         |
| **显示** | `display.minShowTime`    | number  | `1500`                         | 最小显示时间（毫秒） |
|          | `display.showProgress`   | boolean | `true`                         | 是否显示进度条       |
|          | `display.showStages`     | boolean | `true`                         | 是否显示阶段文本     |
|          | `display.autoHide`       | boolean | `true`                         | 是否自动隐藏         |

### 🎭 预设加载阶段

插件内置6个智能加载阶段，自动模拟真实的应用启动过程：

1. **初始化应用环境** (15%) - 准备运行环境
2. **加载核心模块** (20%) - 导入必要依赖库
3. **启动Vue应用** (25%) - 创建应用实例
4. **配置路由系统** (15%) - 初始化页面路由
5. **初始化状态管理** (10%) - 准备数据存储
6. **渲染用户界面** (15%) - 构建页面内容

### 🔗 Vue集成

插件提供Vue插件用于无缝集成：

```typescript
// main.ts
import { createLoadingIntegration } from './build/plugins/loading'

const app = createApp(App)
app.use(createLoadingIntegration()) // 自动集成加载系统
app.mount('#app')
```

## 📚 学习资源

### 官方文档

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Naive UI 组件库](https://www.naiveui.com/)
- [UnoCSS 文档](https://unocss.dev/)
- [Pinia 状态管理](https://pinia.vuejs.org/)

## 🤝 参与贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加新功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源 © 2024 Rouarn

## 👨‍💻 作者信息

**Rouarn** - 全栈开发工程师

- 📧 **邮箱**: [woyuxiaji@foxmail.com](mailto:woyuxiaji@foxmail.com)
- 🐙 **GitHub**: [@Rouarn](https://github.com/Rouarn)
- 🌐 **个人网站**: [http://www.shixian.xyz](http://www.shixian.xyz)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

_Built with ❤️ by Rouarn_

</div>
