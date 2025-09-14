import type { ManagerOptions, SocketOptions } from 'socket.io-client'

/**
 * Socket连接状态
 */
export type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'

/**
 * Socket配置接口
 */
export interface SocketConfig extends Partial<ManagerOptions & SocketOptions> {
  /** Socket服务器URL */
  url?: string
  /** 是否自动连接 */
  autoConnect?: boolean
  /** 认证信息 */
  auth?: Record<string, unknown>
}

/**
 * Socket事件映射接口
 * 可根据实际业务需求扩展事件类型
 */
export interface SocketEventMap {
  // 系统事件
  connect: void
  disconnect: string
  connect_error: Error
  reconnect: number
  reconnect_error: Error
  reconnect_failed: void

  // 业务事件示例 - 可根据实际需求修改
  message: {
    id: string
    content: string
    sender: string
    timestamp: number
  }

  notification: {
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    timestamp: number
  }

  userOnline: {
    userId: string
    username: string
  }

  userOffline: {
    userId: string
  }

  roomJoin: {
    roomId: string
    userId: string
  }

  roomLeave: {
    roomId: string
    userId: string
  }

  // 自定义事件 - 可根据业务需求添加更多事件类型
  [key: string]: unknown
}

/**
 * Socket事件回调函数类型
 */
export type SocketEventCallback<T = unknown> = (data: T) => void

/**
 * Socket连接选项
 */
export interface SocketConnectionOptions {
  /** 连接超时时间(ms) */
  timeout?: number
  /** 最大重连次数 */
  maxReconnectAttempts?: number
  /** 重连间隔时间(ms) */
  reconnectInterval?: number
  /** 是否启用心跳检测 */
  enableHeartbeat?: boolean
  /** 心跳间隔时间(ms) */
  heartbeatInterval?: number
}

/**
 * Socket错误类型
 */
export interface SocketError {
  code: string
  message: string
  details?: unknown
}

/**
 * Socket连接信息
 */
export interface SocketConnectionInfo {
  id: string
  connected: boolean
  status: SocketStatus
  url: string
  reconnectAttempts: number
  lastConnectedAt?: Date
  lastDisconnectedAt?: Date
}
