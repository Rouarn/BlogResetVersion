/**
 * Socket.IO 客户端类型定义
 *
 * 基于后端 WebSocket 接口设计的前端类型定义
 */

/**
 * WebSocket 消息类型枚举
 */
export enum WebSocketMessageType {
  /** 连接成功 */
  CONNECTION = 'connection',
  /** 断开连接 */
  DISCONNECT = 'disconnect',
  /** 加入房间 */
  JOIN_ROOM = 'join_room',
  /** 离开房间 */
  LEAVE_ROOM = 'leave_room',
  /** 发送消息 */
  MESSAGE = 'message',
  /** 广播消息 */
  BROADCAST = 'broadcast',
  /** 系统通知 */
  NOTIFICATION = 'notification',
  /** 错误消息 */
  ERROR = 'error',
  /** 心跳检测 */
  PING = 'ping',
  /** 心跳响应 */
  PONG = 'pong',
}

/**
 * WebSocket 消息基础结构
 */
export interface WebSocketMessage<T = unknown> {
  /** 消息类型 */
  type: WebSocketMessageType
  /** 消息数据 */
  data: T
  /** 时间戳 */
  timestamp: number
  /** 消息ID */
  messageId?: string
  /** 发送者ID */
  senderId?: string
  /** 房间ID */
  roomId?: string
}

/**
 * 房间加入请求数据
 */
export interface JoinRoomData {
  /** 房间ID */
  roomId: string
  /** 用户ID */
  userId: string
  /** 用户信息 */
  userInfo?: {
    name: string
    avatar?: string
    role?: string
  }
}

/**
 * 房间离开请求数据
 */
export interface LeaveRoomData {
  /** 房间ID */
  roomId: string
  /** 用户ID */
  userId: string
}

/**
 * 消息发送数据
 */
export interface SendMessageData {
  /** 消息内容 */
  content: string
  /** 房间ID */
  room: string
  /** 消息类型 */
  messageType?: 'text' | 'image' | 'file' | 'system'
  /** 元数据 */
  metadata?: Record<string, unknown>
}

/**
 * 系统通知数据
 */
export interface NotificationData {
  /** 通知标题 */
  title: string
  /** 通知内容 */
  content: string
  /** 通知类型 */
  notificationType: 'info' | 'warning' | 'error' | 'success'
  /** 是否需要确认 */
  requireConfirm?: boolean
  /** 附加数据 */
  metadata?: Record<string, unknown>
}

/**
 * WebSocket 错误信息
 */
export interface WebSocketError {
  /** 错误代码 */
  code: string
  /** 错误消息 */
  message: string
  /** 错误详情 */
  details?: unknown
  /** 时间戳 */
  timestamp: number
}

/**
 * 连接状态
 */
export type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'

/**
 * Socket 配置选项
 */
export interface SocketConfig {
  /** 服务器URL */
  url: string
  /** 命名空间 */
  namespace?: string
  /** 连接选项 */
  options?: {
    /** 自动连接 */
    autoConnect?: boolean
    /** 重连尝试次数 */
    reconnectionAttempts?: number
    /** 重连延迟 */
    reconnectionDelay?: number
    /** 连接超时 */
    timeout?: number
    /** 传输方式 */
    transports?: string[]
    /** 认证信息 */
    auth?: Record<string, unknown>
  }
}

/**
 * 连接信息
 */
export interface ConnectionInfo {
  /** 连接状态 */
  status: SocketStatus
  /** Socket ID */
  socketId?: string
  /** 连接时间 */
  connectedAt?: Date
  /** 最后活跃时间 */
  lastActiveAt?: Date
  /** 重连次数 */
  reconnectCount: number
  /** 错误信息 */
  error?: WebSocketError
}

/**
 * 房间信息
 */
export interface RoomInfo {
  /** 房间ID */
  id: string
  /** 房间名称 */
  name: string
  /** 房间描述 */
  description?: string
  /** 房间类型 */
  type: 'public' | 'private' | 'system'
  /** 成员数量 */
  memberCount: number
  /** 加入时间 */
  joinedAt: Date
}

/**
 * 事件监听器类型
 */
export type EventListener<T = unknown> = (data: T) => void

/**
 * 事件映射
 */
export interface EventMap {
  // 连接事件
  connect: () => void
  disconnect: (reason: string) => void
  connect_error: (error: Error) => void

  // 服务器事件
  connected: (data: WebSocketMessage) => void
  error: (error: WebSocketError) => void
  status: (status: ConnectionInfo) => void

  // 房间事件
  'room-joined': (data: { room: string; members: number }) => void
  'room-left': (data: { room: string }) => void
  'room-message': (data: WebSocketMessage<SendMessageData>) => void

  // 通知事件
  notification: (data: NotificationData) => void

  // 心跳事件
  ping: () => void
  pong: () => void
}
