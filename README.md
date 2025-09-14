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
- **现代化 Loading 组件**：专为 HTTP 请求设计，智能计数管理，流畅视觉效果
- **现代化加载动画 v5.0**：Vue生命周期集成，事件驱动架构，零依赖检测，高性能渲染
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

## 🎨 现代化 Loading 组件

一个专为 HTTP 请求设计的现代化全局加载动画组件，具有智能计数管理和流畅的视觉效果。

### ✨ 核心特性

- 🎯 **智能计数管理** - 支持多次调用，自动管理显示/隐藏状态
- ⚡ **高性能优化** - 最小显示时间控制，避免闪烁效果
- 🎨 **现代化设计** - 双层旋转动画，毛玻璃背景效果
- 📱 **响应式适配** - 完美支持桌面端和移动端显示
- 🔧 **灵活配置** - 支持自定义文本、颜色、背景等
- 🚀 **零依赖** - 纯原生实现，无需额外依赖

### 🚀 快速开始

#### 基础用法

```typescript
// 显示加载动画
window.$loading?.open()

// 关闭加载动画
window.$loading?.close()

// 检查加载状态
const isLoading = window.$loading?.isLoading()

// 设置加载文本
window.$loading?.setText('正在处理数据...')

// 销毁实例
window.$loading?.destroy()
```

#### 在 HTTP 请求中使用

```typescript
// 请求拦截器中
let loadingCount = 0

function openLoading() {
  if (loadingCount === 0) window.$loading?.open()
  loadingCount++
}

function closeLoading() {
  loadingCount = Math.max(0, loadingCount - 1)
  if (loadingCount === 0) window.$loading?.close()
}

// 在请求开始时
openLoading()

// 在请求结束时
closeLoading()
```

### 🔧 配置选项

```typescript
interface LoadingOptions {
  /** 加载文本 */
  text?: string
  /** 背景色 */
  background?: string
  /** 主题色 */
  color?: string
  /** z-index */
  zIndex?: number
  /** 最小显示时间(ms) */
  minTime?: number
}
```

#### 默认配置

```typescript
const DEFAULT_OPTIONS = {
  text: '加载中...',
  background: 'rgba(255, 255, 255, 0.9)',
  color: '#18a058',
  zIndex: 9999,
  minTime: 300,
}
```

### 📦 API 接口

```typescript
interface LoadingAPI {
  /** 打开加载动画 */
  open(): void
  /** 关闭加载动画 */
  close(): void
  /** 是否正在加载 */
  isLoading(): boolean
  /** 设置加载文本 */
  setText(text: string): void
  /** 销毁实例 */
  destroy(): void
}
```

### 🎨 视觉效果

- **双层旋转动画** - 外圈顺时针，内圈逆时针旋转
- **毛玻璃背景** - 使用 `backdrop-filter: blur(2px)` 实现
- **渐变过渡** - 0.3s 的透明度过渡动画
- **阴影效果** - 文字和图标都有细微阴影
- **响应式设计** - 支持 `prefers-reduced-motion` 媒体查询

### 🔄 智能计数机制

组件内置智能计数机制，可以处理多个并发请求：

```typescript
// 多个请求同时发起
window.$loading?.open() // 计数: 1, 显示loading
window.$loading?.open() // 计数: 2, 保持显示
window.$loading?.open() // 计数: 3, 保持显示

// 请求逐个完成
window.$loading?.close() // 计数: 2, 保持显示
window.$loading?.close() // 计数: 1, 保持显示
window.$loading?.close() // 计数: 0, 隐藏loading
```

### 🎯 最佳实践

#### 1. HTTP 请求集成

在 axios 拦截器中使用：

```typescript
// 请求拦截器
axios.interceptors.request.use((config) => {
  if (config.loading !== false) {
    openLoading()
  }
  return config
})

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.config.loading !== false) {
      closeLoading()
    }
    return response
  },
  (error) => {
    if (error.config?.loading !== false) {
      closeLoading()
    }
    return Promise.reject(error)
  },
)
```

#### 2. 自定义配置

```typescript
// 创建自定义实例
const customLoading = createLoading({
  text: '数据同步中...',
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#409eff',
  minTime: 500,
})
```

#### 3. 条件加载

```typescript
// 只在特定条件下显示loading
if (shouldShowLoading) {
  window.$loading?.open()
}
```

### 🔍 演示页面

访问 `/directives/loading-demo` 查看完整的演示和使用示例。

### 📝 注意事项

1. **最小显示时间** - 默认300ms，避免快速请求造成的闪烁
2. **智能计数** - 支持多次调用，确保所有请求完成后才关闭
3. **内存管理** - 组件会自动清理DOM和事件监听器
4. **无障碍支持** - 支持减少动画偏好设置
5. **性能优化** - 使用 `requestAnimationFrame` 优化动画性能

### 🛠️ 技术实现

- **纯原生实现** - 不依赖任何第三方库
- **TypeScript 支持** - 完整的类型定义
- **现代 CSS** - 使用最新的 CSS 特性
- **事件驱动** - 基于 DOM 事件的状态管理
- **内存安全** - 自动清理和垃圾回收

## 🎨 现代化加载动画系统 v5.0

### 🚀 全新重构版本

本模板集成了**现代化加载动画插件 v5.0**，全新重构版本 - 简洁、高效、美观，具有以下核心特性：

#### ✨ 核心特性

- 🎨 **现代化设计语言** - 采用最新设计趋势和视觉效果
- ⚡ **零配置开箱即用** - 无需复杂配置，开箱即用
- 🚀 **智能加载检测** - 自动检测应用加载状态
- 🎯 **流畅动画体验** - 丝滑的动画过渡效果
- 📱 **完美响应式适配** - 支持各种设备尺寸

#### 🎨 视觉设计

- **四层旋转环形** - 多层次旋转动画，视觉层次丰富
- **渐变背景** - 深色渐变背景，现代化视觉体验
- **智能进度条** - 实时进度显示，用户体验友好
- **推拉门退场** - 独特的推拉门退场动画效果
- **毛玻璃效果** - 现代化的视觉模糊效果

### 🔧 配置选项

在 `vite.config.ts` 中可以自定义加载动画：

```typescript
import { setupLoadingPlugin } from './build/plugins/loading'

export default defineConfig({
  plugins: [
    // 其他插件...
    setupLoadingPlugin({
      enabled: true, // 是否启用插件
      minTime: 600, // 最小显示时间(ms)
      primaryColor: '#3b82f6', // 主题色
      backgroundColor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', // 背景色
      texts: {
        loading: '正在加载应用...', // 加载文本
        complete: '加载完成', // 完成文本
      },
    }),
  ],
})
```

### 📊 配置项详解

| 配置项            | 类型    | 默认值            | 说明                 |
| ----------------- | ------- | ----------------- | -------------------- |
| `enabled`         | boolean | `true`            | 是否启用加载动画     |
| `minTime`         | number  | `600`             | 最小显示时间（毫秒） |
| `primaryColor`    | string  | `#3b82f6`         | 主题颜色             |
| `backgroundColor` | string  | 渐变背景          | 背景颜色或渐变       |
| `texts.loading`   | string  | `正在加载应用...` | 加载中显示的文本     |
| `texts.complete`  | string  | `加载完成`        | 加载完成显示的文本   |

### 🔧 API 接口

插件提供了完整的 JavaScript API，支持手动控制：

```javascript
// 全局 API 访问
window.$loading.complete() // 标记加载完成
window.$loading.setProgress(75) // 设置进度百分比
window.$loading.setText('自定义文本') // 设置加载文本
```

### 🎯 智能加载检测

插件内置多种智能检测机制：

1. **DOM 加载检测** - 监听 `DOMContentLoaded` 事件
2. **资源加载检测** - 监听 `window.load` 事件
3. **Vue 应用检测** - 自动检测 Vue 应用挂载状态
4. **自定义事件** - 支持手动触发完成事件
5. **超时保护** - 5秒超时自动完成，避免卡死

### 🎨 动画效果

- **四层旋转环** - 不同速度和方向的旋转动画
- **浮动效果** - 整体加载器的浮动动画
- **呼吸效果** - 背景光晕的呼吸动画
- **进度条动画** - 渐变流动的进度条效果
- **推拉门退场** - 独特的左右推拉门退场动画

### 📱 响应式设计

- **桌面端优化** - 100px 加载器尺寸，240px 进度条
- **移动端适配** - 60px 加载器尺寸，160px 进度条
- **动画性能优化** - 使用 `transform` 和 `will-change` 优化性能
- **减少动画支持** - 支持 `prefers-reduced-motion` 媒体查询

### 🔗 事件监听

插件支持多种事件监听方式：

```javascript
// 监听应用就绪事件
document.addEventListener('vue-app-ready', () => {
  // 应用准备就绪
})

// 监听全局应用就绪
window.addEventListener('app-ready', () => {
  // 全局应用就绪
})

// 手动触发完成
window.$loading?.complete()
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
