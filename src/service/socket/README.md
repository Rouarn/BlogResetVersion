# Socket.IO 客户端服务

本项目集成了 Socket.IO 客户端服务，提供了完整的实时通信解决方案。

## 功能特性

- ✅ 自动连接管理
- ✅ 断线重连机制
- ✅ 事件监听和发送
- ✅ 连接状态管理
- ✅ TypeScript 类型支持
- ✅ Vue 3 Composition API 集成
- ✅ 工具函数和 Hook

## 文件结构

```
src/service/socket/
├── index.ts          # Socket管理器主文件
├── types.ts          # TypeScript类型定义
├── utils.ts          # 工具函数和Vue Hook
└── README.md         # 说明文档
```

## 快速开始

### 1. 环境配置

在环境变量文件中配置Socket服务器地址：

```bash
# .env.development
VITE_SOCKET_URL=ws://localhost:3001

# .env.production
VITE_SOCKET_URL=wss://your.socket.com
```

### 2. 基础使用

```typescript
import { SocketUtils } from '@/service/socket/utils'

// 初始化连接
await SocketUtils.initSocket()

// 发送消息
SocketUtils.sendMessage('Hello World!')

// 监听消息
SocketUtils.onMessage((message) => {
  console.log('收到消息:', message)
})

// 断开连接
SocketUtils.destroySocket()
```

### 3. 在Vue组件中使用

```vue
<template>
  <div>
    <div>连接状态: {{ connected ? '已连接' : '未连接' }}</div>
    <button @click="sendMessage">发送消息</button>
  </div>
</template>

<script setup>
import { useSocketStatus, useSocketMessage } from '@/service/socket/utils'

// 使用连接状态Hook
const { status, connected, reconnect } = useSocketStatus()

// 使用消息Hook
const { messages, sendMessage } = useSocketMessage()
</script>
```

## API 文档

### SocketManager 类

主要的Socket连接管理类。

#### 方法

- `connect(): Promise<void>` - 连接到Socket服务器
- `disconnect(): void` - 断开连接
- `emit<K>(event: K, data?: SocketEventMap[K]): void` - 发送事件
- `on<K>(event: K, callback: Function): void` - 监听事件
- `off<K>(event: K, callback?: Function): void` - 取消监听事件
- `getStatus(): SocketStatus` - 获取连接状态
- `isConnected(): boolean` - 检查是否已连接

### SocketUtils 工具类

提供便捷的静态方法。

#### 方法

- `initSocket(): Promise<void>` - 初始化Socket连接
- `destroySocket(): void` - 销毁Socket连接
- `sendMessage(content: string): void` - 发送消息
- `onMessage(callback: Function): void` - 监听消息
- `joinRoom(roomId: string): void` - 加入房间
- `leaveRoom(roomId: string): void` - 离开房间
- `getConnectionStatus()` - 获取连接状态

### Vue Hooks

#### useSocketStatus()

监听Socket连接状态变化。

```typescript
const { status, connected, reconnect } = useSocketStatus()
```

返回值：

- `status` - 连接状态 (disconnected | connecting | connected | reconnecting | error)
- `connected` - 是否已连接
- `reconnect` - 重连方法

#### useSocketMessage()

处理Socket消息。

```typescript
const { messages, sendMessage, clearMessages } = useSocketMessage()
```

返回值：

- `messages` - 消息列表
- `sendMessage` - 发送消息方法
- `clearMessages` - 清空消息方法

## 事件类型

### 系统事件

- `connect` - 连接成功
- `disconnect` - 连接断开
- `connect_error` - 连接错误
- `reconnect` - 重连成功
- `reconnect_error` - 重连错误
- `reconnect_failed` - 重连失败

### 业务事件

可以根据实际需求在 `types.ts` 中扩展事件类型：

```typescript
export interface SocketEventMap {
  // 消息事件
  message: {
    id: string
    content: string
    sender: string
    timestamp: number
  }

  // 通知事件
  notification: {
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    timestamp: number
  }

  // 用户在线状态
  userOnline: { userId: string; username: string }
  userOffline: { userId: string }

  // 房间事件
  roomJoin: { roomId: string; userId: string }
  roomLeave: { roomId: string; userId: string }

  // 自定义事件
  [key: string]: any
}
```

## 配置选项

### SocketConfig

```typescript
interface SocketConfig {
  url?: string // Socket服务器URL
  autoConnect?: boolean // 是否自动连接
  reconnection?: boolean // 是否启用重连
  reconnectionAttempts?: number // 最大重连次数
  reconnectionDelay?: number // 重连延迟时间
  timeout?: number // 连接超时时间
  auth?: Record<string, any> // 认证信息
}
```

## 最佳实践

### 1. 应用启动时初始化

```typescript
// main.ts 或 App.vue
import { SocketUtils } from '@/service/socket/utils'

// 在用户登录后初始化Socket
const initApp = async () => {
  // ... 其他初始化逻辑

  if (userStore.isLoggedIn) {
    await SocketUtils.initSocket()
  }
}
```

### 2. 错误处理

```typescript
try {
  await SocketUtils.initSocket()
} catch (error) {
  console.error('Socket连接失败:', error)
  // 显示错误提示给用户
}
```

### 3. 组件卸载时清理

```typescript
// 在组件的 onUnmounted 中清理事件监听器
onUnmounted(() => {
  SocketUtils.offMessage(handleMessage)
  SocketUtils.offNotification(handleNotification)
})
```

### 4. 房间管理

```typescript
// 进入聊天室
SocketUtils.joinRoom('room-123')

// 离开聊天室
SocketUtils.leaveRoom('room-123')
```

## 故障排除

### 常见问题

1. **连接失败**
   - 检查 `VITE_SOCKET_URL` 环境变量是否正确配置
   - 确认Socket服务器是否正常运行
   - 检查网络连接和防火墙设置

2. **认证失败**
   - 确认用户token是否有效
   - 检查服务器端的认证逻辑

3. **事件监听不生效**
   - 确认事件名称是否正确
   - 检查是否在连接建立后注册监听器
   - 确认服务器端是否正确发送事件

### 调试技巧

```typescript
// 启用Socket.IO调试日志
// 在浏览器控制台中执行
localStorage.debug = 'socket.io-client:socket'

// 监听所有Socket事件
socketManager.socket?.onAny((event, ...args) => {
  console.log('Socket事件:', event, args)
})
```

## 示例项目

访问 `/socket-demo` 页面查看完整的使用示例，包括：

- 连接状态显示
- 消息发送和接收
- 通知处理
- 错误处理
- 房间管理

## 更新日志

### v1.0.0

- 初始版本发布
- 基础Socket.IO客户端功能
- TypeScript类型支持
- Vue 3 Composition API集成
