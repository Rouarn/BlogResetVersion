import { computed, nextTick, onUnmounted, readonly, ref, watch } from 'vue'
import { type ConnectionInfo, SocketError, SocketErrorType, socketManager } from '@/service/socket/socketManager'

export interface UseSocketOptions {
  autoConnect?: boolean
  autoReconnect?: boolean
  syncState?: boolean
}

export interface SocketState {
  isConnected: boolean
  isConnecting: boolean
  isDisconnected: boolean
  hasError: boolean
  canReconnect: boolean
}

export function useSocket(options: UseSocketOptions = {}) {
  const { autoConnect = false, autoReconnect = true, syncState = true } = options

  // 响应式状态
  const info = ref<ConnectionInfo>(socketManager.getConnectionInfo())
  const joinedRooms = ref<string[]>(socketManager.getJoinedRooms())
  const isLoading = ref(false)
  const lastError = ref<SocketError | null>(null)

  // 计算属性
  const state = computed<SocketState>(() => ({
    isConnected: info.value.status === 'connected',
    isConnecting: info.value.status === 'connecting',
    isDisconnected: info.value.status === 'disconnected',
    hasError: info.value.status === 'error',
    canReconnect: autoReconnect && info.value.status !== 'connecting',
  }))

  // 状态同步定时器
  let syncTimer: NodeJS.Timeout | null = null

  // 启动状态同步
  function startStateSync() {
    if (!syncState || syncTimer) return

    syncTimer = setInterval(() => {
      const currentInfo = socketManager.getConnectionInfo()
      const currentRooms = socketManager.getJoinedRooms()

      // 只在状态真正变化时更新
      if (JSON.stringify(info.value) !== JSON.stringify(currentInfo)) {
        info.value = currentInfo
      }

      if (JSON.stringify(joinedRooms.value) !== JSON.stringify(currentRooms)) {
        joinedRooms.value = currentRooms
      }
    }, 1000)
  }

  // 停止状态同步
  function stopStateSync() {
    if (syncTimer) {
      clearInterval(syncTimer)
      syncTimer = null
    }
  }

  // 错误处理包装器
  function withErrorHandling<T extends unknown[], R>(fn: (...args: T) => Promise<R>) {
    return async (...args: T): Promise<R> => {
      try {
        isLoading.value = true
        lastError.value = null
        const result = await fn(...args)
        await nextTick() // 确保状态更新
        return result
      } catch (error) {
        lastError.value =
          error instanceof SocketError ? error : new SocketError(SocketErrorType.CONNECTION_FAILED, (error as Error)?.message || '未知错误')
        throw error
      } finally {
        isLoading.value = false
        // 更新状态
        info.value = socketManager.getConnectionInfo()
        joinedRooms.value = socketManager.getJoinedRooms()
      }
    }
  }

  // 连接方法
  const connect = withErrorHandling(async () => {
    await socketManager.connect()
  })

  // 断开连接方法
  const disconnect = withErrorHandling(async () => {
    socketManager.disconnect()
  })

  // 加入房间方法
  const joinRoom = withErrorHandling(async (room: string) => {
    if (!room?.trim()) {
      throw new SocketError(SocketErrorType.ROOM_JOIN_FAILED, '房间名不能为空')
    }
    await socketManager.joinRoom(room)
  })

  // 离开房间方法
  const leaveRoom = withErrorHandling(async (room: string) => {
    if (!room?.trim()) {
      throw new SocketError(SocketErrorType.ROOM_LEAVE_FAILED, '房间名不能为空')
    }
    await socketManager.leaveRoom(room)
  })

  // 发送消息方法
  const sendMessage = withErrorHandling(async (roomId: string, content: unknown) => {
    await socketManager.sendMessage(roomId, JSON.stringify(content))
  })

  // 发送自定义事件
  const emit = (event: string, data?: unknown) => {
    socketManager.emit(event, data)
  }

  // 事件监听方法（带清理功能）
  const eventCleanups = new Set<() => void>()

  function on(event: string, callback: (...args: unknown[]) => void) {
    socketManager.on(event, callback)

    // 记录清理函数
    const cleanup = () => socketManager.off(event, callback)
    eventCleanups.add(cleanup)

    return cleanup
  }

  function off(event: string, callback?: (...args: unknown[]) => void) {
    socketManager.off(event, callback)

    // 如果没有指定回调，清理所有相关的清理函数
    if (!callback) {
      eventCleanups.forEach((cleanup) => {
        try {
          cleanup()
        } catch (error) {
          console.warn('清理事件监听器时出错:', error)
        }
      })
      eventCleanups.clear()
    }
  }

  // 清理所有事件监听器
  function clearAllListeners() {
    eventCleanups.forEach((cleanup) => {
      try {
        cleanup()
      } catch (error) {
        console.warn('清理事件监听器时出错:', error)
      }
    })
    eventCleanups.clear()
    socketManager.clearAllListeners()
  }

  // 重连方法
  async function reconnect() {
    if (!state.value.canReconnect) {
      throw new SocketError(SocketErrorType.CONNECTION_FAILED, '当前状态不允许重连')
    }

    try {
      socketManager.disconnect()
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 等待1秒
      await connect()
    } catch (error) {
      throw new SocketError(SocketErrorType.CONNECTION_FAILED, '重连失败', error as Error)
    }
  }

  // 监听连接状态变化
  if (syncState) {
    watch(
      () => info.value.status,
      (newStatus, oldStatus) => {
        if (newStatus !== oldStatus) {
          console.log(`Socket状态变化: ${oldStatus} -> ${newStatus}`)
        }
      },
      { immediate: false },
    )
  }

  // 组件挂载时的初始化
  if (autoConnect) {
    nextTick(() => {
      if (!state.value.isConnected && !state.value.isConnecting) {
        connect().catch((error) => {
          console.warn('自动连接失败:', error)
        })
      }
    })
  }

  // 启动状态同步
  if (syncState) {
    startStateSync()
  }

  // 组件卸载时的清理
  onUnmounted(() => {
    stopStateSync()
    clearAllListeners()
  })

  return {
    // 状态
    info: readonly(info),
    joinedRooms: readonly(joinedRooms),
    state: readonly(state),
    isLoading: readonly(isLoading),
    lastError: readonly(lastError),

    // 方法
    connect,
    disconnect,
    reconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    emit,
    on,
    off,
    clearAllListeners,

    // 工具方法
    startStateSync,
    stopStateSync,
  }
}
