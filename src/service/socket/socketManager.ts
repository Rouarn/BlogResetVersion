import { useAuthStore } from '@/stores/modules/auth'
import { io, type Socket } from 'socket.io-client'

type ChatSocketStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

interface SocketConfig {
  url: string
  namespace?: string
  autoConnect?: boolean
  reconnection?: boolean
  reconnectionAttempts?: number
  reconnectionDelay?: number
  timeout?: number
  transports?: string[]
  auth?: {
    token?: string
  }
}

interface ConnectionInfo {
  status: ChatSocketStatus
  socketId?: string
  reconnectCount: number
  lastConnectedAt?: number
  lastError?: string
}

interface RoomResponse {
  success: boolean
  error?: string
  data?: unknown
}

interface MessageData {
  room: string
  content: string
  ts: number
  sender?: string
}

type EventCallback = (...args: unknown[]) => void

// 错误类型枚举
enum SocketErrorType {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  NOT_CONNECTED = 'NOT_CONNECTED',
  ROOM_JOIN_FAILED = 'ROOM_JOIN_FAILED',
  ROOM_LEAVE_FAILED = 'ROOM_LEAVE_FAILED',
  MESSAGE_SEND_FAILED = 'MESSAGE_SEND_FAILED',
  TIMEOUT = 'TIMEOUT',
}

class SocketError extends Error {
  constructor(
    public type: SocketErrorType,
    message: string,
    public originalError?: Error,
  ) {
    super(message)
    this.name = 'SocketError'
  }
}

class SocketManager {
  private socket: Socket | null = null
  private config: SocketConfig
  private info: ConnectionInfo = { status: 'disconnected', reconnectCount: 0 }
  private listeners = new Map<string, Set<EventCallback>>()
  private joinedRooms = new Set<string>()
  private connectionPromise: Promise<void> | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private currentUserId: string | null = null

  constructor(config?: Partial<SocketConfig>) {
    this.config = {
      url: import.meta.env.VITE_SOCKET_URL || '',
      namespace: import.meta.env.VITE_SOCKET_NAMESPACE || '',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ['websocket'],
      ...config,
    }
  }

  connect(): Promise<void> {
    // 如果已经在连接中，返回现有的Promise
    if (this.connectionPromise) {
      return this.connectionPromise
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        this.info.status = 'connected'
        this.connectionPromise = null
        resolve()
        return
      }

      try {
        const socketUrl = `${this.config.url}${this.config.namespace || ''}`

        // 获取当前用户token
        const authStore = useAuthStore()
        const token = authStore.token

        // 检查用户是否已登录
        if (!token) {
          this.connectionPromise = null
          reject(new SocketError(SocketErrorType.CONNECTION_FAILED, '用户未登录，无法建立WebSocket连接'))
          return
        }

        if (this.isTokenExpired(token)) {
          this.connectionPromise = null
          authStore.resetStore()
          reject(new SocketError(SocketErrorType.CONNECTION_FAILED, '登录已过期，请重新登录'))
          return
        }

        // 配置认证信息
        const socketConfig = {
          ...this.config,
          auth: {
            token: token,
          },
          query: {
            token: token,
          },
        }

        this.socket = io(socketUrl, socketConfig)

        this.info.status = 'connecting'
        this.setupSocketListeners()

        // 连接超时处理
        const timeoutId = setTimeout(() => {
          this.connectionPromise = null
          reject(new SocketError(SocketErrorType.TIMEOUT, '连接超时'))
        }, this.config.timeout)

        this.socket.on('connect', () => {
          clearTimeout(timeoutId)
          this.info = {
            ...this.info,
            status: 'connected',
            socketId: this.socket?.id,
            reconnectCount: 0,
            lastConnectedAt: Date.now(),
            lastError: undefined,
          }
          this.connectionPromise = null
          resolve()
        })

        this.socket.on('connect_error', (err) => {
          clearTimeout(timeoutId)
          this.info = { ...this.info, status: 'error', lastError: err.message }
          this.connectionPromise = null
          const msg = String(err?.message || '')
          if (msg.includes('jwt expired') || msg.includes('认证令牌无效')) {
            try {
              this.socket?.disconnect()
            } catch {}
            try {
              authStore.resetStore()
            } catch {}
          }
          reject(new SocketError(SocketErrorType.CONNECTION_FAILED, err.message, err))
        })
      } catch (error) {
        this.connectionPromise = null
        reject(new SocketError(SocketErrorType.CONNECTION_FAILED, '创建连接失败', error as Error))
      }
    })

    return this.connectionPromise
  }

  private setupSocketListeners(): void {
    if (!this.socket) return

    this.socket.on('disconnect', (reason) => {
      this.info = {
        ...this.info,
        status: 'disconnected',
        socketId: undefined,
        lastError: reason,
      }
      this.joinedRooms.clear()
    })

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      this.info.reconnectCount = attemptNumber
    })

    this.socket.on('reconnect', () => {
      this.info = {
        ...this.info,
        status: 'connected',
        lastConnectedAt: Date.now(),
        lastError: undefined,
      }
      this.clearReconnectTimer()
      // 重新加入之前的房间
      this.rejoinRooms()
    })

    this.socket.on('reconnect_failed', () => {
      this.info = {
        ...this.info,
        status: 'error',
        lastError: '重连失败',
      }
    })
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private async rejoinRooms(): Promise<void> {
    const rooms = [...this.joinedRooms]
    this.joinedRooms.clear()

    for (const room of rooms) {
      try {
        await this.joinRoom(room)
      } catch (error) {
        console.warn(`重新加入房间 ${room} 失败:`, error)
      }
    }
  }

  disconnect(): void {
    this.connectionPromise = null

    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }

    this.joinedRooms.clear()
    this.info = { status: 'disconnected', reconnectCount: 0 }
  }

  getConnectionInfo(): ConnectionInfo {
    return { ...this.info }
  }

  isConnected(): boolean {
    return this.info.status === 'connected' && this.socket?.connected === true
  }

  async joinRoom(roomId: string, userId?: string): Promise<void> {
    if (!roomId?.trim()) {
      throw new SocketError(SocketErrorType.ROOM_JOIN_FAILED, '房间ID不能为空')
    }

    if (!this.isConnected()) {
      throw new SocketError(SocketErrorType.NOT_CONNECTED, '未连接到服务器')
    }

    // 生成默认的userId如果没有提供
    const finalUserId = userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new SocketError(SocketErrorType.TIMEOUT, '加入房间超时'))
      }, this.config.timeout)

      const joinData = {
        roomId,
        userId: finalUserId,
        userInfo: {
          name: `用户${finalUserId.slice(-4)}`,
          avatar: '',
          role: 'user',
        },
      }

      this.socket!.emit('join-room', joinData, (res: RoomResponse) => {
        console.log(res, '加入房间')
        clearTimeout(timeoutId)
        if (res?.success) {
          this.joinedRooms.add(roomId)
          this.currentUserId = finalUserId
          resolve()
        } else {
          reject(new SocketError(SocketErrorType.ROOM_JOIN_FAILED, res?.error || '加入房间失败'))
        }
      })
    })
  }

  async leaveRoom(roomId: string): Promise<void> {
    if (!roomId?.trim()) {
      throw new SocketError(SocketErrorType.ROOM_LEAVE_FAILED, '房间ID不能为空')
    }

    if (!this.isConnected()) {
      throw new SocketError(SocketErrorType.NOT_CONNECTED, '未连接到服务器')
    }

    if (!this.currentUserId) {
      throw new SocketError(SocketErrorType.ROOM_LEAVE_FAILED, '用户ID不存在，请先加入房间')
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new SocketError(SocketErrorType.TIMEOUT, '离开房间超时'))
      }, this.config.timeout)

      const leaveData = {
        roomId,
        userId: this.currentUserId!,
      }

      this.socket!.emit('leave-room', leaveData, (res: RoomResponse) => {
        clearTimeout(timeoutId)
        if (res?.success) {
          this.joinedRooms.delete(roomId)
          resolve()
        } else {
          reject(new SocketError(SocketErrorType.ROOM_LEAVE_FAILED, res?.error || '离开房间失败'))
        }
      })
    })
  }

  getJoinedRooms(): string[] {
    return [...this.joinedRooms]
  }

  async sendMessage(roomId: string, content: string): Promise<void> {
    if (!roomId?.trim()) {
      throw new SocketError(SocketErrorType.MESSAGE_SEND_FAILED, '房间ID不能为空')
    }

    if (!content?.trim()) {
      throw new SocketError(SocketErrorType.MESSAGE_SEND_FAILED, '消息内容不能为空')
    }

    if (!this.isConnected()) {
      throw new SocketError(SocketErrorType.NOT_CONNECTED, '未连接到服务器')
    }

    const messageData: MessageData = {
      room: roomId,
      content: content.trim(),
      ts: Date.now(),
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new SocketError(SocketErrorType.TIMEOUT, '发送消息超时'))
      }, this.config.timeout)

      this.socket!.emit('send-message', messageData, (res: RoomResponse) => {
        clearTimeout(timeoutId)
        if (res?.success) {
          resolve()
        } else {
          reject(new SocketError(SocketErrorType.MESSAGE_SEND_FAILED, res?.error || '发送消息失败'))
        }
      })
    })
  }

  emit(event: string, data?: unknown): void {
    if (!event) return

    if (!this.isConnected()) {
      console.warn('Socket未连接，无法发送事件:', event)
      return
    }

    this.socket!.emit(event, data)
  }

  on(event: string, cb: EventCallback): void {
    if (!event || typeof cb !== 'function') return

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(cb)

    // 如果socket已连接，立即绑定事件
    if (this.socket) {
      this.socket.on(event, cb)
    }
  }

  off(event: string, cb?: EventCallback): void {
    if (!event) return

    if (cb) {
      this.socket?.off(event, cb)
      this.listeners.get(event)?.delete(cb)

      // 如果该事件没有监听器了，删除整个事件
      if (this.listeners.get(event)?.size === 0) {
        this.listeners.delete(event)
      }
    } else {
      this.socket?.off(event)
      this.listeners.delete(event)
    }
  }

  clearAllListeners(): void {
    this.listeners.forEach((cbs, evt) => {
      cbs.forEach((cb) => this.socket?.off(evt, cb))
    })
    this.listeners.clear()
  }

  // 获取当前监听的事件列表
  getListenedEvents(): string[] {
    return Array.from(this.listeners.keys())
  }

  // 重新绑定所有事件监听器（用于重连后）
  private rebindListeners(): void {
    if (!this.socket) return

    this.listeners.forEach((cbs, event) => {
      cbs.forEach((cb) => {
        this.socket!.on(event, cb)
      })
    })
  }

  private isTokenExpired(token?: string): boolean {
    if (!token) return true
    const parts = token.split('.')
    if (parts.length !== 3) return true
    try {
      const payloadBase64 = parts[1]
      if (!payloadBase64) return true
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      const json = atob(base64)
      const payload = JSON.parse(json) as { exp?: number }
      const exp = Number(payload.exp || 0)
      if (!exp) return false
      return exp * 1000 <= Date.now()
    } catch {
      return true
    }
  }
}

export const socketManager = new SocketManager()

// 导出类型和错误类以便外部使用
export { SocketError, SocketErrorType, SocketManager }
export type { ConnectionInfo, EventCallback, MessageData, RoomResponse, SocketConfig }
