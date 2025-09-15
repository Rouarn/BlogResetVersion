/**
 * 简单的 Socket.IO 客户端服务
 * 直接使用 socket.io-client，避免过度封装
 */

import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

// Socket 实例
let socket: Socket | null = null

// 连接状态
let isConnected = false

// 获取 Socket URL 和命名空间
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || ''
const SOCKET_NAMESPACE = import.meta.env.VITE_SOCKET_NAMESPACE || ''

/**
 * 连接到 Socket 服务器
 */
export function connectSocket(): Promise<Socket> {
  return new Promise((resolve, reject) => {
    if (socket && socket.connected) {
      resolve(socket)
      return
    }

    // 创建 Socket 连接
    socket = io(`${SOCKET_URL}${SOCKET_NAMESPACE}`, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
    })

    // 连接成功
    socket.on('connect', () => {
      console.log('Socket 连接成功:', socket?.id)
      isConnected = true
      resolve(socket!)
    })

    // 连接错误
    socket.on('connect_error', (error) => {
      console.error('Socket 连接错误:', error)
      isConnected = false
      reject(error)
    })

    // 断开连接
    socket.on('disconnect', (reason) => {
      console.log('Socket 断开连接:', reason)
      isConnected = false
    })
  })
}

/**
 * 断开 Socket 连接
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
    isConnected = false
    console.log('Socket 已断开')
  }
}

/**
 * 获取 Socket 实例
 */
export function getSocket(): Socket | null {
  return socket
}

/**
 * 检查连接状态
 */
export function isSocketConnected(): boolean {
  return isConnected && socket?.connected === true
}

/**
 * 加入房间
 */
export function joinRoom(roomId: string): void {
  if (socket && isConnected) {
    socket.emit('join_room', { roomId })
    console.log('加入房间:', roomId)
  } else {
    console.warn('Socket 未连接，无法加入房间')
  }
}

/**
 * 离开房间
 */
export function leaveRoom(roomId: string): void {
  if (socket && isConnected) {
    socket.emit('leave_room', { roomId })
    console.log('离开房间:', roomId)
  } else {
    console.warn('Socket 未连接，无法离开房间')
  }
}

/**
 * 发送消息
 */
export function sendMessage(roomId: string, message: string): void {
  if (socket && isConnected) {
    socket.emit('message', {
      room: roomId,
      content: message,
      timestamp: Date.now(),
    })
    console.log('发送消息:', { roomId, message })
  } else {
    console.warn('Socket 未连接，无法发送消息')
  }
}

/**
 * 监听事件
 */
export function onSocketEvent(event: string, callback: (...args: unknown[]) => void): void {
  if (socket) {
    socket.on(event, callback)
  }
}

/**
 * 移除事件监听
 */
export function offSocketEvent(event: string, callback?: (...args: unknown[]) => void): void {
  if (socket) {
    if (callback) {
      socket.off(event, callback)
    } else {
      socket.off(event)
    }
  }
}

// 导出默认的 socket 管理对象
export const socketManager = {
  connect: connectSocket,
  disconnect: disconnectSocket,
  getSocket,
  isConnected: isSocketConnected,
  joinRoom,
  leaveRoom,
  sendMessage,
  on: onSocketEvent,
  off: offSocketEvent,
  getSocketId: () => socket?.id,
  getStatus: () => (isConnected ? 'connected' : 'disconnected'),
  getConnectionInfo: () => ({
    status: isConnected ? 'connected' : 'disconnected',
    socketId: socket?.id,
    reconnectCount: 0,
  }),
  getJoinedRooms: () => [],
}
