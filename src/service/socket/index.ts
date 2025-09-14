import { useAuthStore } from '@/stores/modules/auth'
import type { SocketConfig, SocketEventMap, SocketStatus } from './types'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

/**
 * Socket.IO 客户端管理类
 */
class SocketManager {
  private socket: Socket | null = null
  private config: SocketConfig
  private status: SocketStatus = 'disconnected'
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 3000
  private eventListeners: Map<string, ((...args: unknown[]) => void)[]> = new Map()

  constructor(config: SocketConfig) {
    this.config = {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      ...config,
    }
  }

  /**
   * 连接到Socket服务器
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve()
        return
      }

      const authStore = useAuthStore()
      const socketUrl = this.config.url || import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3001'

      // 创建socket连接
      this.socket = io(socketUrl, {
        ...this.config,
        auth: {
          token: authStore.token,
          ...this.config.auth,
        },
      })

      // 连接成功
      this.socket.on('connect', () => {
        this.status = 'connected'
        this.reconnectAttempts = 0
        console.log('Socket连接成功')
        resolve()
      })

      // 连接失败
      this.socket.on('connect_error', (error) => {
        this.status = 'error'
        console.error('Socket连接失败:', error)
        reject(error)
      })

      // 断开连接
      this.socket.on('disconnect', (reason) => {
        this.status = 'disconnected'
        console.log('Socket连接断开:', reason)

        // 自动重连
        if (this.config.reconnection && reason !== 'io client disconnect') {
          this.handleReconnect()
        }
      })

      // 重连
      this.socket.on('reconnect', (attemptNumber) => {
        this.status = 'connected'
        this.reconnectAttempts = 0
        console.log(`Socket重连成功，尝试次数: ${attemptNumber}`)
      })

      // 重连失败
      this.socket.on('reconnect_failed', () => {
        this.status = 'error'
        console.error('Socket重连失败')
      })
    })
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.status = 'disconnected'
    }
  }

  /**
   * 发送消息
   */
  emit<K extends keyof SocketEventMap>(event: K, data?: SocketEventMap[K]): void {
    if (this.socket?.connected) {
      this.socket.emit(event as string, data)
    } else {
      console.warn('Socket未连接，无法发送消息')
    }
  }

  /**
   * 监听事件
   */
  on<K extends keyof SocketEventMap>(event: K, callback: (data: SocketEventMap[K]) => void): void {
    if (!this.eventListeners.has(event as string)) {
      this.eventListeners.set(event as string, [])
    }
    this.eventListeners.get(event as string)?.push(callback as (...args: unknown[]) => void)

    if (this.socket) {
      this.socket.on(event as string, callback as (data: unknown) => void)
    }
  }

  /**
   * 取消监听事件
   */
  off<K extends keyof SocketEventMap>(event: K, callback?: (data: SocketEventMap[K]) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off(event as string, callback as (data: unknown) => void)
        // 从本地监听器列表中移除
        const listeners = this.eventListeners.get(event as string)
        if (listeners) {
          const index = listeners.indexOf(callback as (...args: unknown[]) => void)
          if (index > -1) {
            listeners.splice(index, 1)
          }
        }
      } else {
        this.socket.off(event as string)
        this.eventListeners.delete(event as string)
      }
    }
  }

  /**
   * 获取连接状态
   */
  getStatus(): SocketStatus {
    return this.status
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  /**
   * 处理重连逻辑
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      this.status = 'reconnecting'

      setTimeout(() => {
        console.log(`尝试重连Socket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect().catch(() => {
          // 重连失败，继续尝试
        })
      }, this.reconnectInterval)
    } else {
      this.status = 'error'
      console.error('Socket重连次数已达上限')
    }
  }
}

// 默认配置
const defaultConfig: SocketConfig = {
  autoConnect: false, // 手动控制连接时机
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
}

// 创建全局Socket管理实例
export const socketManager = new SocketManager(defaultConfig)

// 导出类型和实例
export { SocketManager }
export type { SocketConfig, SocketEventMap, SocketStatus }
