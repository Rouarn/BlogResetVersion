# 🚀 Frontend Template

基于 **Vue 3 + Vite + TypeScript** 构建的现代化前端开发模板，内置路由分组与国际化约定、后端路由数据驱动与视图组件自动解析，并配套丰富的开箱即用功能，助力快速启动项目开发。

## ✨ 核心亮点

### 🎯 路由与菜单

- **后端路由数据驱动**，基于 `src/assets/json/authMenuList.json`
- **组件自动解析**，字符串组件路径自动映射到 `src/views` 真实组件
- **智能菜单生成**，自动分组与排序，支持任意层级嵌套

### 🏗️ 现代化技术栈

- **Vue 3.5+** - 最新 Composition API，性能卓越
- **Vite 7+** - 极速开发构建，HMR 体验丝滑
- **TypeScript 5+** - 完整类型安全，开发体验一流
- **Naive UI 2+** - 现代化组件库，设计精美
- **UnoCSS** - 原子化 CSS，按需生成样式

### 🎨 丰富功能特性

- **🎨 主题系统** - 亮色/暗色/跟随系统，动态主题色切换
- **⚡ 智能加载** - HTTP 请求 Loading + 应用启动动画，用户体验极佳

- **🌍 国际化支持** - Vue I18n 多语言，动态语言切换
- **🎯 自定义指令** - 复制、拖拽、水印、防抖等 15+ 实用指令
- **📡 HTTP 封装** - 智能重试、请求取消、完整类型安全
- **🛠️ 开发体验** - 自动导入、热重载、全局搜索

### 📦 工程化完备

- **代码规范** - ESLint + Prettier + Husky，保证代码质量
- **状态管理** - Pinia 官方推荐，轻量高效
- **响应式设计** - 完美适配桌面端和移动端
- **类型定义** - 完整的 TypeScript 类型声明

## 🛠️ 技术栈详情

| 分类         | 技术选型       | 版本 | 说明                           |
| ------------ | -------------- | ---- | ------------------------------ |
| **核心框架** | Vue            | 3.5+ | 最新 Composition API，性能卓越 |
|              | Vite           | 7+   | 极速构建工具，开发体验一流     |
|              | TypeScript     | 5+   | 完整类型安全，智能提示         |
| **UI 组件**  | Naive UI       | 2+   | 现代化 Vue 3 组件库            |
|              | UnoCSS         | -    | 原子化 CSS 引擎                |
|              | Iconify        | -    | 统一图标解决方案，100+ 图标集  |
| **路由状态** | Elegant Router | -    | 文件系统路由生成器             |
|              | Vue Router     | 4+   | 官方路由管理器                 |
|              | Pinia          | 3+   | 官方推荐状态管理               |
| **工具库**   | VueUse         | -    | Composition API 工具集         |
|              | Axios          | -    | HTTP 客户端库                  |
|              | Day.js         | -    | 轻量级日期处理                 |
|              | Vue I18n       | 11+  | 国际化解决方案                 |
| **开发工具** | ESLint         | 9+   | 代码质量检查                   |
|              | Prettier       | 3+   | 代码格式化                     |
|              | Husky          | 9+   | Git hooks 管理                 |

## 📺 在线预览

🌐 **预览地址**: [http://www.shixian.xyz](http://www.shixian.xyz) | 📱 支持移动端访问 | 🔍 完整功能演示

## 🚀 快速开始

### 📋 环境要求

- **Node.js** 18+
- **包管理器** pnpm (推荐) / npm / yarn

### ⚡ 一键启动

```bash
# 1️⃣ 克隆项目
git clone https://github.com/Rouarn/frontend-template.git

# 2️⃣ 进入目录
cd frontend-template

# 3️⃣ 安装依赖
pnpm install

# 4️⃣ 启动开发
pnpm dev
```

🎉 **启动成功后访问**: http://localhost:5173

### 📋 常用命令

| 命令类型 | 命令                 | 说明                |
| -------- | -------------------- | ------------------- |
| **开发** | `pnpm dev`           | 启动开发服务器      |
|          | `pnpm dev:prod`      | 生产模式开发        |
| **构建** | `pnpm build`         | 构建生产版本        |
|          | `pnpm preview`       | 预览构建结果        |
| **检查** | `pnpm typecheck`     | TypeScript 类型检查 |
|          | `pnpm lint:eslint`   | ESLint 检查并修复   |
|          | `pnpm lint:prettier` | Prettier 格式化     |
| **提交** | `pnpm commit`        | 规范化提交          |

## 📁 项目结构概览

```
src/
├── 📁 components/     # 🧩 公共组件库
├── 📁 directives/     # 🎯 自定义指令集 (15+ 实用指令)
├── 📁 hooks/          # 🪝 组合式函数
├── 📁 layouts/        # 🏗️ 布局组件
├── 📁 locales/        # 🌍 国际化配置
├── 📁 plugins/        # 🔌 插件配置
├── 📁 router/         # 🛣️ 路由与守卫
├── 📁 service/        # 📡 API 服务 (HTTP)
├── 📁 stores/         # 🗃️ 状态管理 (Pinia)
├── 📁 styles/         # 🎨 样式文件
├── 📁 theme/          # 🌈 主题配置
├── 📁 typings/        # 📝 类型定义
├── 📁 utils/          # 🛠️ 工具函数
└── 📁 views/          # 📄 页面组件
    ├── (builtin)/     # 🔒 内置页面 (登录、404、403、500、iframe等)
    ├── home/          # 🏠 首页
    ├── about/         # ℹ️ 关于页面
    ├── demos/         # 🎪 功能演示（分组）
    ├── directives/    # 🎯 指令演示（分组）
    └── user-center/   # 👤 用户中心
```

## 🎯 路由来源与解析

### 📦 路由数据

- 路由由后端（此处为本地 JSON 模拟）提供：`src/assets/json/authMenuList.json`
- 支持分组目录：`demos` 与 `directives`，其余为单层路由
- 国际化键采用层级+连字符格式：

```
    route.home
    route.demos.loading-demo
route.directives.copy-direct
route.directives.drag-direct
...
route.user-center
```

### 🔌 组件自动解析

- 对于 JSON 中的字符串组件路径（如 `"/home/index"`），运行时自动解析到真实组件：

```ts
// src/stores/modules/route/shared.ts
export function resolveRouteComponent(route, modules) {
  const comp = route.component as unknown as string | RouteComponent | undefined
  if (typeof comp === 'string') {
    const key = `/src/views${comp}.vue`
    const loader = modules[key]
    if (loader) route.component = loader
  }
  return route
}
```

### 🧭 菜单生成与排序

- 递归生成：`getGlobalMenuByBaseRoute(routes)` 将路由转为菜单，并递归处理 `children`
- 排序规则：`order` 字段对所有层级进行排序
- 文案规则：优先使用 `i18nKey`（若翻译存在），否则回退到 `title`

### 🛡️ 路由守卫与初始化

- 首次进入应用，若已登录但尚未初始化，执行路由初始化并重定向到原目标路径
- 无论分支如何，守卫均调用 `next()` 保证导航有效，避免 “The next callback was never called” 报错

### 🎯 多层级菜单支持

- 支持任意层级的菜单嵌套与排序
- 支持分组目录（`demos`、`directives`）及其子项的统一管理
- 搜索项为叶子菜单，使用 `transformMenuToSearchMenus()` 提取

### 📂 视图目录示例

```
src/views/
├── home/                    # → /home
│   └── index.vue
├── about/                   # → /about
│   └── index.vue
├── demos/                   # → /demos/*
│   ├── loading-demo/
│   │   └── index.vue        # → /demos/loading-demo

├── directives/              # → /directives/*
│   ├── copy-direct/
│   │   └── index.vue        # → /directives/copy-direct
│   ├── drag-direct/
│   │   └── index.vue        # → /directives/drag-direct
│   └── animate-direct/
│       └── index.vue        # → /directives/animate-direct
├── user-center/             # → /user-center
│   └── index.vue
└── (builtin)/               # 内置页面
    ├── 403/
    │   └── index.vue        # → /403
    ├── 404/
    │   └── index.vue        # → /404
    ├── 500/
    │   └── index.vue        # → /500
    ├── login/
    │   └── index.vue        # → /login
    └── iframe/
        └── [url].vue        # → /iframe/:url
```

### 🔄 开发工作流

1. **创建页面文件**：在 `src/views` 目录下按照约定创建 Vue 文件
2. **自动生成路由**：Elegant Router 自动扫描并生成路由配置
3. **自动更新菜单**：基于生成的路由自动创建菜单结构
4. **类型安全导航**：享受完整的 TypeScript 类型支持

```typescript
// 类型安全的路由导航
import { useRouter } from 'vue-router'

const router = useRouter()

// 自动补全和类型检查
router.push({ name: 'DemosLoadingDemo' })
router.push('/demos/loading-demo')
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
