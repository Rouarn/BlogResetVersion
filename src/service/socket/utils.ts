import { socketManager } from './index'
import type { SocketEventCallback, SocketEventMap } from './types'

/**
 * Socket工具函数集合
 */
export class SocketUtils {
  /**
   * 初始化Socket连接
   * 通常在应用启动时调用
   */
  static async initSocket(): Promise<void> {
    try {
      await socketManager.connect()
      console.log('Socket初始化成功')
    } catch (error) {
      console.error('Socket初始化失败:', error)
      throw error
    }
  }

  /**
   * 销毁Socket连接
   * 通常在应用关闭时调用
   */
  static destroySocket(): void {
    socketManager.disconnect()
    console.log('Socket连接已销毁')
  }

  /**
   * 发送消息的便捷方法
   */
  static sendMessage(content: string, receiver?: string): void {
    socketManager.emit('message', {
      id: Date.now().toString(),
      content,
      sender: 'current_user', // 可以从用户store中获取
      timestamp: Date.now(),
      ...(receiver && { receiver }),
    })
  }

  /**
   * 监听消息的便捷方法
   */
  static onMessage(callback: SocketEventCallback<SocketEventMap['message']>): void {
    socketManager.on('message', callback)
  }

  /**
   * 取消监听消息
   */
  static offMessage(callback?: SocketEventCallback<SocketEventMap['message']>): void {
    socketManager.off('message', callback)
  }

  /**
   * 监听通知的便捷方法
   */
  static onNotification(callback: SocketEventCallback<SocketEventMap['notification']>): void {
    socketManager.on('notification', callback)
  }

  /**
   * 取消监听通知
   */
  static offNotification(callback?: SocketEventCallback<SocketEventMap['notification']>): void {
    socketManager.off('notification', callback)
  }

  /**
   * 加入房间
   */
  static joinRoom(roomId: string): void {
    socketManager.emit('roomJoin', {
      roomId,
      userId: 'current_user_id', // 可以从用户store中获取
    })
  }

  /**
   * 离开房间
   */
  static leaveRoom(roomId: string): void {
    socketManager.emit('roomLeave', {
      roomId,
      userId: 'current_user_id', // 可以从用户store中获取
    })
  }

  /**
   * 获取连接状态
   */
  static getConnectionStatus() {
    return {
      status: socketManager.getStatus(),
      connected: socketManager.isConnected(),
    }
  }

  /**
   * 重新连接
   */
  static async reconnect(): Promise<void> {
    socketManager.disconnect()
    await socketManager.connect()
  }

  /**
   * 批量注册事件监听器
   */
  static registerEventListeners(
    listeners: Partial<{
      [K in keyof SocketEventMap]: SocketEventCallback<SocketEventMap[K]>
    }>,
  ): void {
    Object.entries(listeners).forEach(([event, callback]) => {
      if (callback) {
        socketManager.on(event as keyof SocketEventMap, callback)
      }
    })
  }

  /**
   * 批量取消事件监听器
   */
  static unregisterEventListeners(events: (keyof SocketEventMap)[]): void {
    events.forEach((event) => {
      socketManager.off(event)
    })
  }
}

/**
 * Socket连接状态监听Hook
 * 可在Vue组件中使用
 */
export function useSocketStatus() {
  const status = ref(socketManager.getStatus())
  const connected = ref(socketManager.isConnected())

  const updateStatus = () => {
    status.value = socketManager.getStatus()
    connected.value = socketManager.isConnected()
  }

  // 监听连接状态变化
  socketManager.on('connect', updateStatus)
  socketManager.on('disconnect', updateStatus)
  socketManager.on('reconnect', updateStatus)
  socketManager.on('connect_error', updateStatus)

  onUnmounted(() => {
    socketManager.off('connect', updateStatus)
    socketManager.off('disconnect', updateStatus)
    socketManager.off('reconnect', updateStatus)
    socketManager.off('connect_error', updateStatus)
  })

  return {
    status: readonly(status),
    connected: readonly(connected),
    reconnect: SocketUtils.reconnect,
  }
}

/**
 * Socket消息监听Hook
 */
export function useSocketMessage() {
  const messages = ref<SocketEventMap['message'][]>([])

  const handleMessage = (message: SocketEventMap['message']) => {
    messages.value.push(message)
  }

  onMounted(() => {
    SocketUtils.onMessage(handleMessage)
  })

  onUnmounted(() => {
    SocketUtils.offMessage(handleMessage)
  })

  return {
    messages: readonly(messages),
    sendMessage: SocketUtils.sendMessage,
    clearMessages: () => {
      messages.value = []
    },
  }
}
