# HTTP 请求模块重构说明

## 🚀 重构概述

本次重构对项目的 HTTP 请求模块进行了全面优化，提升了代码质量、类型安全性和开发体验。

## 📁 文件结构

```
src/service/request/
├── index.ts           # 主要的 HTTP 请求类
├── axiosCancel.ts     # 请求取消管理器
├── checkStatus.ts     # HTTP 状态码处理
├── servicePort.ts     # API 端点配置
└── examples/
    └── request-examples.ts  # 使用示例
```

## ✨ 主要改进

### 1. 增强的类型安全 (`index.ts`)

- **更强的 TypeScript 支持**：完善的类型定义和泛型支持
- **自定义请求配置接口**：扩展了 Axios 配置，添加了更多选项
- **响应类型推断**：更好的响应数据类型推断

```typescript
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean // 是否显示 loading
  cancel?: boolean // 是否启用请求取消
  retry?: RetryConfig // 重试配置
  isUpload?: boolean // 文件上传标识
  isDownload?: boolean // 文件下载标识
  customErrorMessage?: string // 自定义错误信息
  skipErrorHandler?: boolean // 跳过全局错误处理
}
```

### 2. 智能重试机制

- **自动重试**：网络错误和服务器错误时自动重试
- **可配置重试策略**：支持自定义重试次数、间隔和条件
- **智能重试条件**：只在合适的错误类型下重试

```typescript
// 使用默认重试配置
const data = await retryRequest.get('/api/data')

// 自定义重试配置
const data = await http.get('/api/data', undefined, {
  retry: {
    count: 3,
    delay: 1000,
    retryCondition: (error) => !error.response || error.response.status >= 500,
  },
})
```

### 3. 优化的请求取消机制 (`axiosCancel.ts`)

- **更高效的取消逻辑**：使用 AbortController 替代旧的取消方式
- **更好的键生成**：改进了请求唯一标识生成算法
- **增强的调试支持**：添加了详细的日志记录
- **新增管理方法**：提供了更多管理接口

```typescript
// 新增的管理方法
axiosCanceler.getPendingCount() // 获取待处理请求数量
axiosCanceler.isPending(config) // 检查请求是否在队列中
axiosCanceler.getPendingKeys() // 获取所有待处理请求的键
```

### 4. 完善的错误处理 (`checkStatus.ts`)

- **映射表驱动**：使用映射表管理状态码和错误信息
- **更丰富的状态码支持**：覆盖更多 HTTP 状态码
- **功能函数**：提供状态码检查和分类函数
- **更好的错误信息**：更准确和用户友好的错误提示

```typescript
// 新增的功能函数
checkStatus(status, customMessage) // 检查状态码并显示错误
getStatusMessage(status) // 获取状态码对应的错误信息
isClientError(status) // 检查是否为客户端错误 (4xx)
isServerError(status) // 检查是否为服务器错误 (5xx)
```

### 5. 标准化的 API 端点管理 (`servicePort.ts`)

- **模块化前缀**：为不同微服务定义独立的 API 前缀
- **类型安全**：提供类型安全的前缀映射
- **向后兼容**：保持与现有代码的兼容性

```typescript
// 新的前缀定义
export const AUTH_API_PREFIX = '/api/v1/auth'
export const USER_API_PREFIX = '/api/v1/user'
export const FILE_API_PREFIX = '/api/v1/file'
export const COMMON_API_PREFIX = '/api/v1'

// 类型安全的映射
export const API_PREFIX_MAP = {
  auth: AUTH_API_PREFIX,
  user: USER_API_PREFIX,
  file: FILE_API_PREFIX,
  common: COMMON_API_PREFIX,
} as const
```

## 🔧 新增功能

### 1. 多种请求模式

```typescript
// 基础请求
const data = await http.get('/api/data')

// 静默请求（不显示 loading 和错误）
const data = await silentRequest.get('/api/data')

// 重试请求
const data = await retryRequest.get('/api/data')
```

### 2. 文件操作支持

```typescript
// 文件上传
const result = await http.upload('/api/upload', formData)

// 文件下载
const blob = await http.download('/api/download/123')
```

### 3. 请求管理工具

```typescript
// 获取待处理请求数量
const count = http.getPendingRequestCount()

// 取消所有请求
http.cancelAllRequests('页面切换')

// 检查请求状态
const isPending = http.isPending(config)
```

### 4. 灵活的配置选项

```typescript
// 自定义错误处理
await http.get('/api/data', undefined, {
  customErrorMessage: '数据加载失败',
  skipErrorHandler: false,
  loading: true,
  cancel: true,
})
```

## 📖 使用示例

详细的使用示例请参考 `src/service/examples/request-examples.ts` 文件，其中包含：

- 基础请求示例
- 高级配置示例
- 重试机制示例
- 文件操作示例
- 请求管理示例
- 静默请求示例
- 错误处理示例

## 🔄 迁移指南

### 从旧版本迁移

1. **基础用法无需改动**：现有的基础请求代码无需修改
2. **导入方式更新**：可以选择使用新的导入方式
3. **配置参数调整**：第三个参数现在是配置对象而不是 Axios 原生配置

```typescript
// 旧版本
http.get('/api/data', params, { loading: false })

// 新版本（推荐）
http.get('/api/data', params, { loading: false })

// 或使用静默请求
silentRequest.get('/api/data', params)
```

### API 前缀更新

```typescript
// 旧版本
import { PORT1 } from '@/service/request/servicePort'
const url = PORT1 + '/auth/login'

// 新版本（推荐）
import { AUTH_API_PREFIX } from '@/service/request/servicePort'
const url = `${AUTH_API_PREFIX}/login`
```

## 🛡️ 向后兼容性

- 保持所有现有 API 的兼容性
- `PORT1` 仍然可用，但推荐使用新的前缀常量
- 现有的请求代码无需修改即可正常工作

## 🚨 注意事项

1. **开发环境日志**：新版本在开发环境下会输出更详细的日志，有助于调试
2. **重试机制**：默认只对网络错误和 5xx 错误进行重试，4xx 错误不会重试
3. **文件上传**：使用 `upload` 方法时会自动设置正确的 Content-Type
4. **错误处理**：可以通过 `skipErrorHandler` 选项禁用全局错误处理

## 🔮 未来计划

- [ ] 添加请求/响应拦截器的插件机制
- [ ] 支持请求缓存功能
- [ ] 添加请求性能监控
- [ ] 支持请求优先级队列
- [ ] 添加离线请求队列支持
