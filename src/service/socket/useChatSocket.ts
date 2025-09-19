import { computed, onUnmounted, readonly, ref, watch } from 'vue'
import { useSocket, type UseSocketOptions } from '@/service/socket/useSocket'

type RoomNotificationType = 'join' | 'leave' | 'user_count'
type ChatMessageStatus = 'sending' | 'sent' | 'failed'

export interface ChatMessage {
  id: string
  room: string
  sender?: string
  content: string
  ts: number
  self?: boolean
  status?: ChatMessageStatus
  retryCount?: number
}

export interface RoomNotification {
  id: string
  room: string
  type: RoomNotificationType
  user?: string
  userCount?: number
  ts: number
}

export interface ChatRoom {
  id: string
  name: string
  userCount: number
  lastMessage?: ChatMessage
  unreadCount: number
}

export interface UseChatSocketOptions extends UseSocketOptions {
  maxMessages?: number
  maxNotifications?: number
  enableMessagePersistence?: boolean
  messageRetryAttempts?: number
}

// 消息更新操作类型
export type MessageUpdateOperation =
  | { type: 'update'; messageId: string; updates: Partial<ChatMessage> }
  | { type: 'add'; message: ChatMessage }
  | { type: 'remove'; messageId: string }
  | { type: 'clear'; roomId?: string }
  | { type: 'replace'; messages: ChatMessage[] }

export function useChatSocket(options: UseChatSocketOptions = {}) {
  const {
    maxMessages = 1000,
    maxNotifications = 100,
    enableMessagePersistence = false,
    messageRetryAttempts = 3,
    ...socketOptions
  } = options

  const socket = useSocket(socketOptions)

  // 状态管理
  const messages = ref<ChatMessage[]>([])
  const notifications = ref<RoomNotification[]>([])
  const rooms = ref<Map<string, ChatRoom>>(new Map())
  const currentRoom = ref<string | null>(null)
  const typingUsers = ref<Map<string, Set<string>>>(new Map())

  // 消息去重集合
  const messageIds = new Set<string>()
  const notificationIds = new Set<string>()

  // 计算属性
  const currentRoomMessages = computed(() => (currentRoom.value ? messages.value.filter((msg) => msg.room === currentRoom.value) : []))

  const currentRoomNotifications = computed(() =>
    currentRoom.value ? notifications.value.filter((notif) => notif.room === currentRoom.value) : [],
  )

  const unreadMessagesCount = computed(() => {
    if (!currentRoom.value) return 0
    const room = rooms.value.get(currentRoom.value)
    return room?.unreadCount || 0
  })

  // 消息持久化
  function saveMessages() {
    if (enableMessagePersistence) {
      try {
        localStorage.setItem('chat_messages', JSON.stringify(messages.value))
      } catch (error) {
        console.warn('保存消息失败:', error)
      }
    }
  }

  // 更新房间最后消息
  function updateRoomLastMessage(roomId: string, message: ChatMessage) {
    const room = rooms.value.get(roomId)
    if (room) {
      room.lastMessage = message
      if (roomId !== currentRoom.value && !message.self) {
        room.unreadCount++
      }
    }
  }

  // 更新消息的辅助函数
  function updateMessage(operation: MessageUpdateOperation) {
    switch (operation.type) {
      case 'update': {
        const messageIndex = messages.value.findIndex((msg) => msg.id === operation.messageId)
        if (messageIndex !== -1) {
          // 使用响应式更新方式
          messages.value[messageIndex] = {
            ...messages.value[messageIndex],
            ...operation.updates,
          } as ChatMessage
        }
        break
      }
      case 'add': {
        if (messageIds.has(operation.message.id)) {
          return // 消息已存在，跳过
        }
        messageIds.add(operation.message.id)
        messages.value.push(operation.message)

        // 限制消息数量
        if (messages.value.length > maxMessages) {
          const removed = messages.value.shift()
          if (removed) {
            messageIds.delete(removed.id)
          }
        }

        // 更新房间信息
        updateRoomLastMessage(operation.message.room, operation.message)
        saveMessages()
        break
      }
      case 'remove': {
        const messageIndex = messages.value.findIndex((msg) => msg.id === operation.messageId)
        if (messageIndex !== -1) {
          const removed = messages.value.splice(messageIndex, 1)[0]
          if (removed) {
            messageIds.delete(removed.id)
          }
          saveMessages()
        }
        break
      }
      case 'clear': {
        if (operation.roomId) {
          // 清理指定房间的消息
          const roomMessages = messages.value.filter((msg) => msg.room === operation.roomId)
          roomMessages.forEach((msg) => messageIds.delete(msg.id))
          messages.value = messages.value.filter((msg) => msg.room !== operation.roomId)
        } else {
          // 清理所有消息
          messages.value = []
          messageIds.clear()
        }
        saveMessages()
        break
      }
      case 'replace': {
        // 清理旧的消息ID
        messageIds.clear()
        // 设置新的消息列表
        messages.value = operation.messages
        // 重新构建消息ID集合
        operation.messages.forEach((msg) => messageIds.add(msg.id))
        saveMessages()
        break
      }
    }
  }

  // 为了向后兼容，保留updateMessageStatus函数
  function updateMessageStatus(messageId: string, status: ChatMessageStatus) {
    updateMessage({ type: 'update', messageId, updates: { status } })
  }

  function loadMessages() {
    if (enableMessagePersistence) {
      try {
        const saved = localStorage.getItem('chat_messages')
        if (saved) {
          const parsedMessages = JSON.parse(saved)
          updateMessage({ type: 'replace', messages: parsedMessages })
        }
      } catch (error) {
        console.warn('加载消息失败:', error)
      }
    }
  }

  // 添加消息（带去重）- 使用updateMessage函数
  function addMessage(message: ChatMessage) {
    updateMessage({ type: 'add', message })
  }

  // 添加通知（带去重）
  function addNotification(notification: RoomNotification) {
    if (notificationIds.has(notification.id)) {
      return // 通知已存在，跳过
    }

    notificationIds.add(notification.id)
    notifications.value.push(notification)

    // 限制通知数量
    if (notifications.value.length > maxNotifications) {
      const removed = notifications.value.shift()
      if (removed) {
        notificationIds.delete(removed.id)
      }
    }
  }

  // 标记房间为已读
  function markRoomAsRead(roomId: string) {
    const room = rooms.value.get(roomId)
    if (room) {
      room.unreadCount = 0
    }
  }

  // 设置当前房间
  function setCurrentRoom(roomId: string | null) {
    if (currentRoom.value) {
      markRoomAsRead(currentRoom.value)
    }
    currentRoom.value = roomId
    if (roomId) {
      markRoomAsRead(roomId)
    }
  }

  // 重试发送消息
  async function retryMessage(messageId: string) {
    const message = messages.value.find((msg) => msg.id === messageId)
    if (!message || message.status !== 'failed') return

    const newRetryCount = (message.retryCount || 0) + 1

    // 使用updateMessage函数更新状态和重试次数
    updateMessage({
      type: 'update',
      messageId,
      updates: {
        status: 'sending',
        retryCount: newRetryCount,
      },
    })

    try {
      await socket.sendMessage(message.room, message.content)
      updateMessageStatus(messageId, 'sent')
    } catch (error) {
      updateMessageStatus(messageId, 'failed')
      if (newRetryCount >= messageRetryAttempts) {
        console.error('消息重试次数已达上限:', error)
      }
    }
  }

  // 发送聊天消息
  async function sendChatMessage(room: string, content: string) {
    if (!room?.trim() || !content?.trim()) {
      throw new Error('房间ID和消息内容不能为空')
    }

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      room,
      content: content.trim(),
      ts: Date.now(),
      self: true,
      status: 'sending',
      retryCount: 0,
    }

    // 立即添加到本地消息列表
    addMessage(message)

    try {
      await socket.sendMessage(room, content)
      console.log('消息发送成功:', message)
      // 使用响应式更新状态
      updateMessageStatus(message.id, 'sent')
    } catch (error) {
      // 使用响应式更新状态
      updateMessageStatus(message.id, 'failed')
      throw error
    }
  }

  // 发送打字状态
  function sendTypingStatus(room: string, isTyping: boolean) {
    if (!socket.state.value.isConnected) return

    socket.emit('typing', { room, isTyping })
  }

  // 获取房间列表
  function getRoomList(): ChatRoom[] {
    return Array.from(rooms.value.values())
  }

  // 清理指定房间的消息
  function clearRoomMessages(roomId: string) {
    updateMessage({ type: 'clear', roomId })
  }

  // 清理所有消息
  function clearAllMessages() {
    updateMessage({ type: 'clear' })
  }

  // 事件监听器
  const cleanupFunctions: (() => void)[] = []

  // 监听消息事件
  cleanupFunctions.push(
    socket.on('message', (...args: unknown[]) => {
      const data = args[0] as Record<string, unknown>
      if (!data?.room || !data?.content) return

      const message: ChatMessage = {
        id: (data.id as string) || crypto.randomUUID(),
        room: data.room as string,
        sender: data.sender as string,
        content: data.content as string,
        ts: (data.ts as number) || Date.now(),
        self: false,
        status: 'sent',
      }

      addMessage(message)
    }),
  )

  // 监听房间通知
  cleanupFunctions.push(
    socket.on('room_notification', (...args: unknown[]) => {
      const data = args[0] as Record<string, unknown>
      if (!data?.room || !data?.type) return

      const notification: RoomNotification = {
        id: (data.id as string) || crypto.randomUUID(),
        room: data.room as string,
        type: data.type as RoomNotificationType,
        user: data.user as string,
        userCount: data.userCount as number,
        ts: (data.ts as number) || Date.now(),
      }

      addNotification(notification)

      // 更新房间用户数
      if (data.userCount !== undefined) {
        const room = rooms.value.get(data.room as string)
        if (room) {
          room.userCount = data.userCount as number
        }
      }
    }),
  )

  // 监听打字状态
  cleanupFunctions.push(
    socket.on('typing', (...args: unknown[]) => {
      const data = args[0] as Record<string, unknown>
      if (!data?.room || !data?.user) return

      const roomTyping = typingUsers.value.get(data.room as string) || new Set()

      if (data.isTyping) {
        roomTyping.add(data.user as string)
      } else {
        roomTyping.delete(data.user as string)
      }

      typingUsers.value.set(data.room as string, roomTyping)

      // 3秒后自动清除打字状态
      setTimeout(() => {
        const currentTyping = typingUsers.value.get(data.room as string)
        if (currentTyping) {
          currentTyping.delete(data.user as string)
        }
      }, 3000)
    }),
  )

  // 监听房间加入成功
  cleanupFunctions.push(
    socket.on('room_joined', (...args: unknown[]) => {
      const data = args[0] as Record<string, unknown>
      if (!data?.room) return

      const room: ChatRoom = {
        id: data.room as string,
        name: (data.roomName as string) || (data.room as string),
        userCount: (data.userCount as number) || 0,
        unreadCount: 0,
      }

      rooms.value.set(data.room as string, room)
    }),
  )

  // 监听房间离开
  cleanupFunctions.push(
    socket.on('room_left', (...args: unknown[]) => {
      const data = args[0] as Record<string, unknown>
      if (!data?.room) return
      rooms.value.delete(data.room as string)
    }),
  )

  // 监听连接状态变化
  watch(
    () => socket.state.value.isConnected,
    (isConnected) => {
      if (isConnected) {
        // 重连后重新加入房间
        console.log('Socket重连成功，准备重新加入房间')
      } else {
        // 断开连接时清理打字状态
        typingUsers.value.clear()
      }
    },
  )

  // 初始化
  loadMessages()

  // 清理函数
  onUnmounted(() => {
    cleanupFunctions.forEach((cleanup) => cleanup())
    saveMessages()
  })

  return {
    // 状态
    ...socket,
    messages: readonly(messages),
    notifications: readonly(notifications),
    rooms: readonly(rooms),
    currentRoom: readonly(currentRoom),
    currentRoomMessages,
    currentRoomNotifications,
    unreadMessagesCount,
    typingUsers: readonly(typingUsers),

    // 方法
    sendMessage: sendChatMessage,
    retryMessage,
    sendTypingStatus,
    setCurrentRoom,
    markRoomAsRead,
    getRoomList,
    clearRoomMessages,
    clearAllMessages,

    // 工具方法
    saveMessages,
    loadMessages,
  }
}
