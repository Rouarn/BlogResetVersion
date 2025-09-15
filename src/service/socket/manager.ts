/**
 * Socket.IO 客户端管理器
 *
 * 提供完整的 WebSocket 连接管理功能
 */

import { EventHandler } from './events'
import type {
  ConnectionInfo,
  EventMap,
  JoinRoomData,
  LeaveRoomData,
  RoomInfo,
  SendMessageData,
  SocketConfig,
  SocketStatus,
  WebSocketError,
  WebSocketMessage,
} from './types'
import { delay, getErrorMessage, logger } from './utils'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

/**
 * Socket 管理器类
 */
export class SocketManager {
  private socket: Socket | null = null
  private eventHandler = new EventHandler()
  private config: SocketConfig
  private status: SocketStatus = 'disconnected'
  private connectionInfo: ConnectionInfo
  private joinedRooms = new Map<string, RoomInfo>()
  private reconnectCount = 0
  private maxReconnectAttempts = 5
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null

  constructor(config: SocketConfig) {
    this.config = {
      ...config,
      options: {
        autoConnect: false,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
        ...config.options,
      },
    }

    this.connectionInfo = {
      status: 'disconnected',
      reconnectCount: 0,
    }

    this.maxReconnectAttempts = this.config.options?.reconnectionAttempts || 5
  }

  /**
   * 连接到服务器
   */
  async connect(): Promise<void> {
    if (this.socket?.connected) {
      logger.warn('Socket 已经连接')
      return
    }

    try {
      this.updateStatus('connecting')
      logger.info('正在连接到服务器...', {
        url: this.config.url,
        namespace: this.config.namespace,
      })

      // 创建 Socket 实例
      const socketUrl = this.config.url
      const options = {
        ...this.config.options,
        ...(this.config.namespace && { forceNew: true }),
      }

      this.socket = this.config.namespace ? io(socketUrl + this.config.namespace, options) : io(socketUrl, options)

      // 设置事件监听器
      this.setupEventListeners()

      // 等待连接完成
      await this.waitForConnection()

      logger.info('Socket 连接成功', {
        socketId: this.socket.id,
        url: socketUrl,
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      logger.error('Socket 连接失败:', errorMessage)
      this.updateStatus('error', {
        code: 'CONNECTION_FAILED',
        message: errorMessage,
        timestamp: Date.now(),
      })
      throw error
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.socket) {
      logger.info('断开 Socket 连接')
      this.socket.disconnect()
      this.socket = null
    }

    this.clearTimers()
    this.updateStatus('disconnected')
    this.joinedRooms.clear()
    this.reconnectCount = 0
  }

  /**
   * 重新连接
   */
  async reconnect(): Promise<void> {
    if (this.reconnectCount >= this.maxReconnectAttempts) {
      logger.error('已达到最大重连次数，停止重连')
      this.updateStatus('error', {
        code: 'MAX_RECONNECT_ATTEMPTS',
        message: '已达到最大重连次数',
        timestamp: Date.now(),
      })
      return
    }

    this.reconnectCount++
    this.updateStatus('reconnecting')

    logger.info(`尝试重连 (${this.reconnectCount}/${this.maxReconnectAttempts})`)

    try {
      this.disconnect()
      await delay(this.config.options?.reconnectionDelay || 1000)
      await this.connect()

      // 重连成功后重新加入之前的房间
      await this.rejoinRooms()

      this.reconnectCount = 0
    } catch (error) {
      logger.error('重连失败:', getErrorMessage(error))

      // 继续尝试重连
      this.scheduleReconnect()
    }
  }

  /**
   * 加入房间
   */
  async joinRoom(data: JoinRoomData): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Socket 未连接')
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('加入房间超时'))
      }, 10000)

      this.socket!.emit('join-room', data, (response: unknown) => {
        clearTimeout(timeout)
        const typedResponse = response as { success: boolean; data?: { members?: number }; message?: string }

        if (typedResponse.success) {
          const roomInfo: RoomInfo = {
            id: data.roomId,
            name: data.roomId,
            type: 'public',
            memberCount: typedResponse.data?.members || 0,
            joinedAt: new Date(),
          }

          this.joinedRooms.set(data.roomId, roomInfo)
          logger.info(`成功加入房间: ${data.roomId}`)
          resolve()
        } else {
          const error = new Error(typedResponse.message || '加入房间失败')
          logger.error('加入房间失败:', error.message)
          reject(error)
        }
      })
    })
  }

  /**
   * 离开房间
   */
  async leaveRoom(data: LeaveRoomData): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Socket 未连接')
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('离开房间超时'))
      }, 10000)

      this.socket!.emit('leave-room', data, (response: unknown) => {
        clearTimeout(timeout)
        const typedResponse = response as { success: boolean; message?: string }

        if (typedResponse.success) {
          this.joinedRooms.delete(data.roomId)
          logger.info(`成功离开房间: ${data.roomId}`)
          resolve()
        } else {
          const error = new Error(typedResponse.message || '离开房间失败')
          logger.error('离开房间失败:', error.message)
          reject(error)
        }
      })
    })
  }

  /**
   * 发送消息
   */
  async sendMessage(data: SendMessageData): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Socket 未连接')
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('发送消息超时'))
      }, 10000)

      this.socket!.emit('send-message', data, (response: unknown) => {
        clearTimeout(timeout)
        const typedResponse = response as { success: boolean; message?: string }

        if (typedResponse.success) {
          logger.debug(`消息发送成功: ${data.content}`)
          resolve()
        } else {
          const error = new Error(typedResponse.message || '发送消息失败')
          logger.error('发送消息失败:', error.message)
          reject(error)
        }
      })
    })
  }

  /**
   * 添加事件监听器
   */
  on<K extends keyof EventMap>(event: K, listener: EventMap[K]): void {
    this.eventHandler.on(event, listener)
  }

  /**
   * 移除事件监听器
   */
  off<K extends keyof EventMap>(event: K, listener?: EventMap[K]): void {
    this.eventHandler.off(event, listener)
  }

  /**
   * 添加一次性事件监听器
   */
  once<K extends keyof EventMap>(event: K, listener: EventMap[K]): void {
    this.eventHandler.once(event, listener)
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  /**
   * 获取连接状态
   */
  getStatus(): SocketStatus {
    return this.status
  }

  /**
   * 获取连接信息
   */
  getConnectionInfo(): ConnectionInfo {
    return { ...this.connectionInfo }
  }

  /**
   * 获取已加入的房间
   */
  getJoinedRooms(): RoomInfo[] {
    return Array.from(this.joinedRooms.values())
  }

  /**
   * 获取 Socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    if (!this.socket) return

    // 连接事件
    this.socket.on('connect', () => {
      logger.info('Socket 连接成功', { socketId: this.socket!.id })
      this.updateStatus('connected')
      this.reconnectCount = 0
      this.startHeartbeat()
      this.eventHandler.emit('connect')
    })

    this.socket.on('disconnect', (reason: string) => {
      logger.warn('Socket 连接断开:', reason)
      this.updateStatus('disconnected')
      this.stopHeartbeat()
      this.eventHandler.emit('disconnect', reason)

      // 自动重连
      if (reason !== 'io client disconnect') {
        this.scheduleReconnect()
      }
    })

    this.socket.on('connect_error', (error: Error) => {
      logger.error('Socket 连接错误:', error.message)
      this.updateStatus('error', {
        code: 'CONNECTION_ERROR',
        message: error.message,
        timestamp: Date.now(),
      })
      this.eventHandler.emit('connect_error', error)
    })

    // 服务器事件
    this.socket.on('connected', (data: WebSocketMessage) => {
      logger.info('收到服务器连接确认:', data)
      this.eventHandler.emit('connected', data)
    })

    this.socket.on('error', (error: WebSocketError) => {
      logger.error('收到服务器错误:', error)
      this.eventHandler.emit('error', error)
    })

    this.socket.on('status', (status: ConnectionInfo) => {
      logger.debug('收到连接状态更新:', status)
      this.eventHandler.emit('status', status)
    })

    // 房间事件
    this.socket.on('room-joined', (data: { room: string; members: number }) => {
      logger.info('房间加入成功:', data)
      this.eventHandler.emit('room-joined', data)
    })

    this.socket.on('room-left', (data: { room: string }) => {
      logger.info('房间离开成功:', data)
      this.eventHandler.emit('room-left', data)
    })

    this.socket.on('room-message', (data: WebSocketMessage<SendMessageData>) => {
      logger.debug('收到房间消息:', data)
      this.eventHandler.emit('room-message', data)
    })

    // 通知事件
    this.socket.on('notification', (data: unknown) => {
      logger.info('收到系统通知:', data)
      const notificationData = data as {
        title: string
        content: string
        notificationType: 'info' | 'warning' | 'error' | 'success'
        requireConfirm?: boolean
        metadata?: Record<string, unknown>
      }
      this.eventHandler.emit('notification', notificationData)
    })

    // 心跳事件
    this.socket.on('ping', () => {
      this.eventHandler.emit('ping')
    })

    this.socket.on('pong', () => {
      this.eventHandler.emit('pong')
    })
  }

  /**
   * 等待连接完成
   */
  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket 实例不存在'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error('连接超时'))
      }, this.config.options?.timeout || 20000)

      this.socket.once('connect', () => {
        clearTimeout(timeout)
        resolve()
      })

      this.socket.once('connect_error', (error: Error) => {
        clearTimeout(timeout)
        reject(error)
      })
    })
  }

  /**
   * 更新连接状态
   */
  private updateStatus(status: SocketStatus, error?: WebSocketError): void {
    this.status = status
    this.connectionInfo = {
      ...this.connectionInfo,
      status,
      socketId: this.socket?.id,
      lastActiveAt: new Date(),
      reconnectCount: this.reconnectCount,
      error,
    }

    if (status === 'connected') {
      this.connectionInfo.connectedAt = new Date()
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    const delay = (this.config.options?.reconnectionDelay || 1000) * Math.pow(2, this.reconnectCount)

    this.reconnectTimer = setTimeout(
      () => {
        this.reconnect()
      },
      Math.min(delay, 30000),
    ) // 最大延迟 30 秒
  }

  /**
   * 重新加入房间
   */
  private async rejoinRooms(): Promise<void> {
    const rooms = Array.from(this.joinedRooms.values())

    for (const room of rooms) {
      try {
        await this.joinRoom({
          roomId: room.id,
          userId: 'current-user', // 这里应该从用户状态获取
        })
      } catch (error) {
        logger.error(`重新加入房间失败: ${room.id}`, error)
      }
    }
  }

  /**
   * 开始心跳检测
   */
  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('ping')
      }
    }, 30000) // 每 30 秒发送一次心跳
  }

  /**
   * 停止心跳检测
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 清理定时器
   */
  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.stopHeartbeat()
  }
}

// 创建全局 Socket 管理实例
const defaultConfig: SocketConfig = {
  url: import.meta.env.VITE_SOCKET_URL || 'http://localhost:8898',
  namespace: '/ws',
  options: {
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    transports: ['websocket', 'polling'],
  },
}

export const socketManager = new SocketManager(defaultConfig)
