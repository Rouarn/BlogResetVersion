# 🚀 Frontend Template

基于 **Vue 3 + Vite + TypeScript** 构建的现代化前端开发模板，集成 **Elegant Router** 文件系统路由和丰富的开箱即用功能，助力快速启动项目开发。

## ✨ 核心亮点

### 🎯 文件系统路由

- **Elegant Router** 驱动，基于文件结构自动生成路由
- **零配置使用**，创建文件即可生成对应路由和菜单
- **类型安全导航**，完整的 TypeScript 类型推断
- **智能菜单生成**，自动分组和排序，支持多层级嵌套

### 🏗️ 现代化技术栈

- **Vue 3.5+** - 最新 Composition API，性能卓越
- **Vite 7+** - 极速开发构建，HMR 体验丝滑
- **TypeScript 5+** - 完整类型安全，开发体验一流
- **Naive UI 2+** - 现代化组件库，设计精美
- **UnoCSS** - 原子化 CSS，按需生成样式

### 🎨 丰富功能特性

- **🎨 主题系统** - 亮色/暗色/跟随系统，动态主题色切换
- **⚡ 智能加载** - HTTP 请求 Loading + 应用启动动画，用户体验极佳
- **🔌 实时通信** - Socket.IO 集成，自动连接管理和断线重连
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
|              | Socket.IO      | -    | 实时通信客户端                 |
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
├── 📁 router/         # 🛣️ 路由配置 (Elegant Router)
├── 📁 service/        # 📡 API 服务 (HTTP + Socket.IO)
├── 📁 stores/         # 🗃️ 状态管理 (Pinia)
├── 📁 styles/         # 🎨 样式文件
├── 📁 theme/          # 🌈 主题配置
├── 📁 typings/        # 📝 类型定义
├── 📁 utils/          # 🛠️ 工具函数
└── 📁 views/          # 📄 页面组件 (文件系统路由核心)
    ├── _builtin/      # 🔒 内置页面 (登录、404等)
    ├── home/          # 🏠 首页
    ├── about/         # ℹ️ 关于页面
    ├── demos/         # 🎪 功能演示
    ├── directives/    # 🎯 指令演示
    └── user-center/   # 👤 用户中心
```

## 🎯 基于 Elegant Router 的文件系统路由

### 🚀 Elegant Router 简介

Elegant Router 是一款为 Vue.js 应用设计的创新路由管理工具，基于文件系统结构自动生成路由，消除了手动配置路由的繁琐过程。<mcreference link="https://github.com/soybeanjs/elegant-router" index="3"></mcreference>

### ✨ 核心特性

- **🗂️ 文件系统驱动** - 无需手动配置，路由结构直接从文件系统派生
- **🔍 透明数据结构** - 路由数据完全透明，便于调试和自定义扩展
- **🛡️ 类型安全导航** - 自动生成类型定义文件，提供完整的类型推断和智能提示
- **⚙️ 灵活配置能力** - 提供丰富的配置选项，满足各种复杂场景需求
- **🎨 智能布局管理** - 自动处理布局与页面组件的关系，简化嵌套路由的创建
- **⚡ 性能优化设计** - 内置代码分割和懒加载支持，优化应用性能

### 🛠️ 工作原理

Elegant Router 通过扫描 `src/views` 目录，根据文件路径自动生成路由配置：

```typescript
// er.config.ts 配置文件
export default defineConfig({
  pageDir: 'src/views', // 页面目录
  pageInclude: ['**/*.vue'], // 页面文件匹配模式
  pageExclude: ['**/components/**'], // 排除的页面文件
  routerGeneratedDir: 'src/router/_generated', // 路由生成目录
  layouts: {
    base: 'src/layouts/components/base-layout.vue',
    blank: 'src/layouts/components/blank-layout.vue',
  },
  getRouteMeta: (node) => ({
    title: node.name.replace(/([A-Z])/g, ' $1').trim(),
    i18nKey: `route.${node.name.toLowerCase()}`,
    icon: '',
    order: 2,
    hideInMenu: false,
    isKeepAlive: true,
    isAuth: false,
  }),
})
```

### 📁 自动路由生成规则

基于文件路径自动生成对应的路由：

```
src/views/
├── home/index.vue           → /home (路由名: Home)
├── about/index.vue          → /about (路由名: About)
├── demos/
│   ├── loading-demo/index.vue → /demos/loading-demo (路由名: DemosLoadingDemo)
│   └── socket-demo/index.vue  → /demos/socket-demo (路由名: DemosSocketDemo)
├── directives/
│   ├── copy-direct/index.vue  → /directives/copy-direct (路由名: DirectivesCopyDirect)
│   └── drag-direct/index.vue  → /directives/drag-direct (路由名: DirectivesDragDirect)
└── _builtin/                # 以 _ 开头的文件夹会被自动排除
    ├── 403/index.vue
    └── 404/index.vue
```

### 🎯 智能菜单生成

基于生成的路由自动创建菜单结构，支持：

- **自动分组**: 多个页面自动创建分组菜单
- **智能排除**: `_` 开头文件夹和 `hideInMenu: true` 路由自动排除
- **类型安全**: 完整的 TypeScript 类型支持

### 🔧 自动生成的文件

Elegant Router 会在 `src/router/_generated` 目录下自动生成以下文件：

```
src/router/_generated/
├── imports.ts      # 组件导入文件
├── routes.ts       # 路由配置文件
├── shared.ts       # 共享工具函数
└── transformer.ts  # 路由转换器
```

#### 生成的路由配置示例

```typescript
// src/router/_generated/routes.ts (自动生成)
export const routes: AutoRouterRoute[] = [
  {
    name: 'Home',
    path: '/home',
    layout: 'base',
    component: 'Home',
    meta: {
      title: 'Home',
      i18nKey: 'route.home',
      icon: '',
      hideInMenu: false,
      isKeepAlive: true,
      isAuth: false,
      order: 2,
    },
  },
  {
    name: 'DemosLoadingDemo',
    path: '/demos/loading-demo',
    layout: 'base',
    component: 'DemosLoadingDemo',
    meta: {
      title: 'Demos Loading Demo',
      i18nKey: 'route.demosloadingdemo',
      // ... 其他元信息
    },
  },
  // ... 更多路由
]
```

### 🎯 多层级菜单支持

**🚀 增强特性**：支持任意层级的菜单嵌套，完美处理复杂的菜单结构。

#### 核心能力

- **递归处理**：支持任意深度的菜单嵌套
- **动态创建**：自动创建中间层级的父菜单
- **智能排序**：递归排序所有层级的菜单项
- **完整搜索**：正确提取所有可搜索的叶子节点
- **类型安全**：完整的 TypeScript 类型支持

#### 支持的菜单结构

```
首页 (/home)
功能演示
├── Loading 演示 (/demos/loading-demo)
└── Socket 演示 (/demos/socket-demo)
自定义指令
├── 复制指令 (/directives/copy-direct)
├── 拖拽指令 (/directives/drag-direct)
└── 更多指令...
```

#### 技术实现

**核心函数**：

- `getAuthElegantRoutes()` - 基于 Elegant Router 生成的路由创建菜单
- `sortMenus()` - 递归排序所有层级的菜单
- `transformMenuToSearchMenus()` - 递归提取叶子节点用于搜索

### 📂 项目文件结构示例

```
src/views/
├── home/                    # 首页 → /home
│   └── index.vue
├── about/                   # 关于页面 → /about
│   └── index.vue
├── demos/                   # 功能演示分组
│   ├── loading-demo/        # → /demos/loading-demo
│   │   └── index.vue
│   └── socket-demo/         # → /demos/socket-demo
│       └── index.vue
├── directives/              # 自定义指令分组
│   ├── copy-direct/         # → /directives/copy-direct
│   │   └── index.vue
│   ├── drag-direct/         # → /directives/drag-direct
│   │   └── index.vue
│   ├── animate-direct/      # → /directives/animate-direct
│   │   └── index.vue
│   └── demos/               # 嵌套演示页面
│       ├── loading-demo/    # → /directives/demos/loading-demo
│       │   └── index.vue
│       └── socket-demo/     # → /directives/demos/socket-demo
│           └── index.vue
├── user-center/             # 用户中心 → /user-center
│   └── index.vue
└── _builtin/                # 内置页面（自动排除）
    ├── 403/
    │   └── index.vue
    ├── 404/
    │   └── index.vue
    ├── 500/
    │   └── index.vue
    ├── login/
    │   └── index.vue
    └── iframe-page/
        └── [url].vue        # 动态路由参数
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

## 🔌 Socket.IO 实时通信系统

本模板集成了完整的 Socket.IO 客户端服务，提供开箱即用的实时通信解决方案。

### ✨ 核心特性

- 🔄 **智能连接管理** - 自动处理连接生命周期，支持连接状态监控
- 🔁 **断线重连机制** - 网络异常时自动重连，可配置重连次数和延迟
- 🏠 **房间管理系统** - 支持加入/离开房间，自动重连时恢复房间状态
- 💬 **聊天功能支持** - 专门的聊天 Hook，支持消息持久化和去重
- 🔧 **完整类型支持** - 全面的 TypeScript 类型定义
- 🎯 **Vue 3 集成** - 专为 Composition API 设计的响应式 Hook
- ⚡ **错误处理机制** - 完善的错误分类和处理策略

### 📁 文件结构

```
src/service/socket/
├── index.ts           # 导出入口文件
├── socketManager.ts   # Socket 连接管理器
├── useSocket.ts       # 基础 Socket Hook
└── useChatSocket.ts   # 聊天功能 Hook
```

### 🚀 快速开始

#### 环境配置

在环境变量文件中配置 Socket 服务器地址：

```bash
# .env.development
VITE_SOCKET_URL=ws://localhost:3001
VITE_SOCKET_NAMESPACE=/chat

# .env.production
VITE_SOCKET_URL=wss://your.socket.com
VITE_SOCKET_NAMESPACE=/chat
```

#### 基础使用

```typescript
import { socketManager } from '@/service/socket'

// 连接到服务器
await socketManager.connect()

// 加入房间
await socketManager.joinRoom('room-001')

// 发送消息
await socketManager.sendMessage('room-001', 'Hello World!')

// 监听事件
socketManager.on('message', (data) => {
  console.log('收到消息:', data)
})

// 断开连接
socketManager.disconnect()
```

#### 在 Vue 组件中使用

```vue
<template>
  <div>
    <div>连接状态: {{ state.isConnected ? '已连接' : '未连接' }}</div>
    <div>已加入房间: {{ joinedRooms.join(', ') }}</div>
    <button @click="handleConnect" :disabled="state.isConnecting">
      {{ state.isConnected ? '断开连接' : '连接' }}
    </button>
  </div>
</template>

<script setup>
import { useSocket } from '@/service/socket'

// 使用基础 Socket Hook
const { state, joinedRooms, connect, disconnect } = useSocket({
  autoConnect: true,
  syncState: true,
})

const handleConnect = () => {
  if (state.value.isConnected) {
    disconnect()
  } else {
    connect()
  }
}
</script>
```

### 🔧 主要 API

#### SocketManager 类

**连接管理**

- `connect(): Promise<void>` - 连接到 Socket 服务器
- `disconnect(): void` - 断开连接
- `getConnectionInfo(): ConnectionInfo` - 获取连接信息
- `isConnected(): boolean` - 检查是否已连接

**房间管理**

- `joinRoom(roomId: string, userId?: string): Promise<void>` - 加入房间
- `leaveRoom(roomId: string): Promise<void>` - 离开房间
- `getJoinedRooms(): string[]` - 获取已加入的房间列表

**消息通信**

- `sendMessage(roomId: string, content: string): Promise<void>` - 发送消息
- `emit(event: string, data?: unknown): void` - 发送自定义事件
- `on(event: string, callback: EventCallback): void` - 监听事件
- `off(event: string, callback?: EventCallback): void` - 取消监听

#### useSocket Hook

基础 Socket 功能 Hook，提供连接管理和状态监控：

```typescript
const {
  // 状态信息
  info, // 连接详细信息
  state, // 连接状态（isConnected, isConnecting 等）
  joinedRooms, // 已加入的房间
  isLoading, // 操作加载状态
  lastError, // 最后的错误信息

  // 连接方法
  connect, // 连接服务器
  disconnect, // 断开连接
  reconnect, // 手动重连

  // 房间方法
  joinRoom, // 加入房间
  leaveRoom, // 离开房间

  // 通信方法
  sendMessage, // 发送消息
  emit, // 发送事件
  on, // 监听事件
  off, // 取消监听
} = useSocket(options)
```

#### useChatSocket Hook

专门用于聊天功能的高级 Hook：

```typescript
const {
  // 聊天数据
  messages, // 消息列表
  notifications, // 通知列表
  rooms, // 房间信息
  currentRoom, // 当前房间

  // 计算属性
  currentRoomMessages, // 当前房间消息
  unreadMessagesCount, // 未读消息数

  // 聊天方法
  sendChatMessage, // 发送聊天消息
  joinChatRoom, // 加入聊天房间
  leaveChatRoom, // 离开聊天房间
  markAsRead, // 标记已读
  clearMessages, // 清空消息
} = useChatSocket(options)
```

### 🎯 事件类型

#### 系统事件

- `connect` - 连接成功
- `disconnect` - 连接断开
- `connect_error` - 连接错误
- `reconnect` - 重连成功
- `reconnect_error` - 重连错误
- `reconnect_failed` - 重连失败

#### 房间事件

- `room:joined` - 成功加入房间
- `room:left` - 成功离开房间
- `room:error` - 房间操作错误
- `room:user_joined` - 有用户加入房间
- `room:user_left` - 有用户离开房间

#### 消息事件

- `message` - 接收到消息
- `message:sent` - 消息发送成功
- `message:error` - 消息发送失败
- `notification` - 接收到通知

### ⚙️ 配置选项

#### SocketConfig 配置

```typescript
interface SocketConfig {
  url: string // Socket 服务器 URL
  namespace?: string // 命名空间
  autoConnect?: boolean // 是否自动连接（默认 true）
  reconnection?: boolean // 是否启用重连（默认 true）
  reconnectionAttempts?: number // 最大重连次数（默认 5）
  reconnectionDelay?: number // 重连延迟时间（默认 1000ms）
  timeout?: number // 连接超时时间（默认 20000ms）
  transports?: string[] // 传输方式（默认 ['websocket']）
  auth?: { token?: string } // 认证信息
}
```

#### UseSocket 选项

```typescript
interface UseSocketOptions {
  autoConnect?: boolean // 是否自动连接（默认 false）
  autoReconnect?: boolean // 是否自动重连（默认 true）
  syncState?: boolean // 是否同步状态（默认 true）
}
```

#### UseChatSocket 选项

```typescript
interface UseChatSocketOptions extends UseSocketOptions {
  maxMessages?: number // 最大消息数（默认 1000）
  maxNotifications?: number // 最大通知数（默认 100）
  enableMessagePersistence?: boolean // 是否启用消息持久化（默认 false）
  messageRetryAttempts?: number // 消息重试次数（默认 3）
}
```

### 🎯 最佳实践

#### 应用启动时初始化

```typescript
// main.ts 或 App.vue
import { socketManager } from '@/service/socket'
import { useAuthStore } from '@/stores/modules/auth'

const initApp = async () => {
  const authStore = useAuthStore()
  if (authStore.isLoggedIn) {
    try {
      await socketManager.connect()
    } catch (error) {
      console.error('Socket 连接失败:', error)
    }
  }
}
```

#### 错误处理

```typescript
import { SocketError, SocketErrorType } from '@/service/socket'

try {
  await socketManager.connect()
} catch (error) {
  if (error instanceof SocketError) {
    switch (error.type) {
      case SocketErrorType.CONNECTION_FAILED:
        console.error('连接失败:', error.message)
        break
      case SocketErrorType.TIMEOUT:
        console.error('连接超时:', error.message)
        break
      default:
        console.error('Socket 错误:', error.message)
    }
  }
}
```

#### 组件中的正确使用

```typescript
// 推荐：使用 Hook 方式
const { state, connect, disconnect, on, off } = useSocket({
  autoConnect: true,
  syncState: true,
})

// 监听消息
const handleMessage = (data: MessageData) => {
  console.log('收到消息:', data)
}

onMounted(() => {
  on('message', handleMessage)
})

// 组件卸载时自动清理
onUnmounted(() => {
  off('message', handleMessage)
})
```

### 🔍 示例演示

访问 `/demos/socket-demo` 查看完整的 Socket.IO 使用示例，包括：

- 连接状态实时显示
- 房间加入和离开
- 消息发送和接收
- 错误处理和重连机制
- 聊天功能演示

### 💡 技术实现

- **连接管理器** - 单例模式的 SocketManager 类，统一管理连接状态
- **响应式 Hook** - 基于 Vue 3 Composition API 的响应式状态管理
- **错误分类** - 完善的错误类型定义和处理机制
- **房间恢复** - 断线重连时自动恢复已加入的房间
- **消息去重** - 防止重复消息和通知的智能去重机制
- **类型安全** - 完整的 TypeScript 类型定义，开发体验更佳

## 📚 学习资源

### 官方文档

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Naive UI 组件库](https://www.naiveui.com/)
- [UnoCSS 文档](https://unocss.dev/)
- [Pinia 状态管理](https://pinia.vuejs.org/)
- [Socket.IO 官方文档](https://socket.io/docs/v4/)

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
