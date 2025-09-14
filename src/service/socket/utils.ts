/**
 * Socket.IO 工具函数
 *
 * 提供 Socket 相关的辅助功能
 */

import type { SocketStatus, WebSocketMessage, WebSocketMessageType } from './types'

/**
 * 生成消息ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 创建 WebSocket 消息
 * @param type 消息类型
 * @param data 消息数据
 * @param options 可选参数
 */
export function createMessage<T = unknown>(
  type: WebSocketMessageType,
  data: T,
  options: {
    messageId?: string
    senderId?: string
    roomId?: string
  } = {},
): WebSocketMessage<T> {
  return {
    type,
    data,
    timestamp: Date.now(),
    messageId: options.messageId || generateMessageId(),
    senderId: options.senderId,
    roomId: options.roomId,
  }
}

/**
 * 生成房间ID
 */
export function generateRoomId(): string {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 验证房间名称
 * @param roomName 房间名称
 */
export function isValidRoomName(roomName: string): boolean {
  if (!roomName || typeof roomName !== 'string') {
    return false
  }

  // 房间名称长度限制
  if (roomName.length < 1 || roomName.length > 50) {
    return false
  }

  // 房间名称格式验证（允许字母、数字、下划线、连字符）
  const roomNameRegex = /^[a-zA-Z0-9_-]+$/
  return roomNameRegex.test(roomName)
}

/**
 * 格式化连接状态
 * @param status 连接状态
 */
export function formatSocketStatus(status: SocketStatus): string {
  const statusMap: Record<SocketStatus, string> = {
    disconnected: '已断开',
    connecting: '连接中',
    connected: '已连接',
    reconnecting: '重连中',
    error: '连接错误',
  }

  return statusMap[status] || '未知状态'
}

/**
 * 格式化时间戳
 * @param timestamp 时间戳
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * 延迟函数
 * @param ms 延迟毫秒数
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 重试函数
 * @param fn 要重试的函数
 * @param maxAttempts 最大重试次数
 * @param delayMs 重试间隔
 */
export async function retry<T>(fn: () => Promise<T>, maxAttempts: number = 3, delayMs: number = 1000): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt === maxAttempts) {
        throw lastError
      }

      await delay(delayMs * attempt)
    }
  }

  throw lastError!
}

/**
 * 防抖函数
 * @param fn 要防抖的函数
 * @param delay 防抖延迟
 */
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流函数
 * @param fn 要节流的函数
 * @param delay 节流延迟
 */
export function throttle<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}

/**
 * 获取错误消息
 * @param error 错误对象
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return '未知错误'
}

/**
 * 日志工具
 */
export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.debug(`[Socket] ${message}`, ...args)
    }
  },
  info: (message: string, ...args: unknown[]) => {
    console.info(`[Socket] ${message}`, ...args)
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[Socket] ${message}`, ...args)
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[Socket] ${message}`, ...args)
  },
}
