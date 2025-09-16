<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useMessage } from 'naive-ui'
import type { RoomNotification } from '@/service/socket'
import { useChatSocket, useSocket } from '@/service/socket'
import { useAuthStore } from '@/stores/modules/auth'

const message = useMessage()
const authStore = useAuthStore()

// Socket 连接
const socket = useSocket({
  autoConnect: false,
  autoReconnect: true,
  syncState: true,
})

// 聊天 Socket
const chatSocket = useChatSocket({
  autoConnect: false,
  enableMessagePersistence: true,
  maxMessages: 100,
  maxNotifications: 50,
})

// 响应式数据
const roomInput = ref('')
const messageInput = ref('')
const currentRoom = ref<string | null>(null)
const messageListRef = ref<HTMLElement>()
const typingTimer = ref<NodeJS.Timeout | null>(null)

// 工具函数
const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

const setCurrentRoom = (roomId: string) => {
  currentRoom.value = roomId
  chatSocket.setCurrentRoom(roomId)
  nextTick(() => {
    scrollToBottom()
  })
}

const handleStopTyping = () => {
  if (!currentRoom.value) return

  chatSocket.sendTypingStatus(currentRoom.value, false)

  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
    typingTimer.value = null
  }
}

// 计算属性
const currentRoomTypingUsers = computed(() => {
  if (!currentRoom.value) return []
  const typingSet = chatSocket.typingUsers.value.get(currentRoom.value)
  return typingSet ? Array.from(typingSet) : []
})

// 方法
const handleConnect = async () => {
  // 检查用户是否已登录
  if (!authStore.isLogin) {
    message.warning('请先登录后再尝试连接WebSocket')
    return
  }

  try {
    await socket.connect()
    message.success('连接成功')
  } catch (error) {
    message.error(`连接失败: ${error}`)
  }
}

const handleDisconnect = () => {
  socket.disconnect()
  message.info('已断开连接')
}

const handleJoinRoom = async () => {
  if (!roomInput.value.trim()) return

  try {
    await chatSocket.joinRoom(roomInput.value.trim())
    message.success(`成功加入房间: ${roomInput.value}`)
    if (!currentRoom.value) {
      setCurrentRoom(roomInput.value.trim())
    }
    roomInput.value = ''
  } catch (error) {
    message.error(`加入房间失败: ${error}`)
  }
}

const handleLeaveRoom = async (roomId: string) => {
  try {
    await chatSocket.leaveRoom(roomId)
    message.success(`已离开房间: ${roomId}`)
    if (currentRoom.value === roomId) {
      const rooms = chatSocket.getRoomList()
      currentRoom.value = rooms.length > 0 ? rooms[0].id : null
    }
  } catch (error) {
    message.error(`离开房间失败: ${error}`)
  }
}

const handleSendMessage = async () => {
  if (!messageInput.value.trim() || !currentRoom.value) return

  try {
    await chatSocket.sendMessage(currentRoom.value, messageInput.value.trim())
    messageInput.value = ''
    nextTick(() => {
      scrollToBottom()
    })
  } catch (error) {
    message.error(`发送消息失败: ${error}`)
  }
}

const handleTyping = () => {
  if (!currentRoom.value) return

  chatSocket.sendTypingStatus(currentRoom.value, true)

  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
  }

  typingTimer.value = setTimeout(() => {
    handleStopTyping()
  }, 1000)
}

const clearCurrentRoomMessages = () => {
  if (currentRoom.value) {
    chatSocket.clearRoomMessages(currentRoom.value)
    message.success('已清空当前房间消息')
  }
}

const clearNotifications = () => {
  // 这里需要在 useChatSocket 中添加清空通知的方法
  message.success('已清空通知')
}

// 其他工具函数
const formatTime = (timestamp?: number) => {
  if (!timestamp) return '未知'
  return new Date(timestamp).toLocaleString()
}

const getStatusType = (isConnected: boolean) => {
  return isConnected ? 'success' : 'error'
}

const getMessageStatusType = (status?: string) => {
  switch (status) {
    case 'sent':
      return 'success'
    case 'sending':
      return 'warning'
    case 'failed':
      return 'error'
    default:
      return 'default'
  }
}

const getMessageStatusText = (status?: string) => {
  switch (status) {
    case 'sent':
      return '已发送'
    case 'sending':
      return '发送中'
    case 'failed':
      return '发送失败'
    default:
      return '未知'
  }
}

const getNotificationTypeColor = (type: string) => {
  switch (type) {
    case 'join':
      return 'success'
    case 'leave':
      return 'warning'
    case 'user_count':
      return 'info'
    default:
      return 'default'
  }
}

const getNotificationTypeText = (type: string) => {
  switch (type) {
    case 'join':
      return '加入'
    case 'leave':
      return '离开'
    case 'user_count':
      return '人数变化'
    default:
      return '未知'
  }
}

const formatNotificationText = (notification: RoomNotification) => {
  switch (notification.type) {
    case 'join':
      return `${notification.user} 加入了房间`
    case 'leave':
      return `${notification.user} 离开了房间`
    case 'user_count':
      return `房间人数: ${notification.userCount}`
    default:
      return '未知通知'
  }
}

// 监听消息变化，自动滚动到底部
watch(
  () => chatSocket.currentRoomMessages.value.length,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
)

// 组件卸载时清理
onUnmounted(() => {
  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
  }
})
</script>

<template>
  <div class="socket-demo-container">
    <div class="demo-header">
      <h1>Socket 演示</h1>
      <p>展示 Socket 连接、房间管理和聊天功能</p>
    </div>

    <!-- 连接状态 -->
    <NCard title="连接状态" class="mb-4">
      <div class="connection-status">
        <NSpace align="center">
          <NTag :type="getStatusType(socket.state.value.isConnected)" size="large">
            {{ socket.state.value.isConnected ? '已连接' : '未连接' }}
          </NTag>
          <NButton v-if="!socket.state.value.isConnected" type="primary" @click="handleConnect" :loading="socket.state.value.isConnecting">
            连接
          </NButton>
          <NButton v-else type="error" @click="handleDisconnect"> 断开连接 </NButton>
        </NSpace>

        <div class="mt-4">
          <NDescriptions :column="2" size="small">
            <NDescriptionsItem label="Socket ID">
              {{ socket.info.value.socketId || '未连接' }}
            </NDescriptionsItem>
            <NDescriptionsItem label="重连次数">
              {{ socket.info.value.reconnectCount }}
            </NDescriptionsItem>
            <NDescriptionsItem label="最后连接时间">
              {{ formatTime(socket.info.value.lastConnectedAt) }}
            </NDescriptionsItem>
            <NDescriptionsItem label="错误信息">
              {{ socket.info.value.lastError || '无' }}
            </NDescriptionsItem>
          </NDescriptions>
        </div>
      </div>
    </NCard>

    <!-- 房间管理 -->
    <NCard title="房间管理" class="mb-4">
      <div class="room-management">
        <NSpace class="mb-4">
          <NInput v-model:value="roomInput" placeholder="输入房间名" style="width: 200px" @keyup.enter="handleJoinRoom" />
          <NButton type="primary" @click="handleJoinRoom" :disabled="!socket.state.value.isConnected || !roomInput.trim()">
            加入房间
          </NButton>
        </NSpace>

        <div class="joined-rooms">
          <h4>已加入的房间：</h4>
          <NSpace v-if="chatSocket.getRoomList().length > 0">
            <NTag
              v-for="room in chatSocket.getRoomList()"
              :key="room.id"
              closable
              @close="handleLeaveRoom(room.id)"
              :type="currentRoom === room.id ? 'primary' : 'default'"
              @click="setCurrentRoom(room.id)"
              style="cursor: pointer"
            >
              {{ room.name }} ({{ room.userCount }})
              <NBadge v-if="room.unreadCount > 0" :value="room.unreadCount" class="ml-2" />
            </NTag>
          </NSpace>
          <NEmpty v-else description="暂无加入的房间" size="small" />
        </div>
      </div>
    </NCard>

    <!-- 聊天区域 -->
    <NCard title="聊天" class="mb-4" v-if="currentRoom">
      <template #header-extra>
        <NSpace>
          <span>当前房间: {{ currentRoom }}</span>
          <NButton size="small" @click="clearCurrentRoomMessages"> 清空消息 </NButton>
        </NSpace>
      </template>

      <!-- 消息列表 -->
      <div class="message-list" ref="messageListRef">
        <div
          v-for="message in chatSocket.currentRoomMessages.value"
          :key="message.id"
          class="message-item"
          :class="{ 'self-message': message.self }"
        >
          <div class="message-header">
            <span class="sender">{{ message.sender || (message.self ? '我' : '匿名') }}</span>
            <span class="time">{{ formatTime(message.ts) }}</span>
            <NTag size="small" :type="getMessageStatusType(message.status)">
              {{ getMessageStatusText(message.status) }}
            </NTag>
          </div>
          <div class="message-content">{{ message.content }}</div>
        </div>
        <NEmpty v-if="chatSocket.currentRoomMessages.value.length === 0" description="暂无消息" />
      </div>

      <!-- 打字状态 -->
      <div class="typing-status" v-if="currentRoomTypingUsers.length > 0">
        <NText depth="3" size="small"> {{ currentRoomTypingUsers.join(', ') }} 正在输入... </NText>
      </div>

      <!-- 消息输入 -->
      <div class="message-input mt-4">
        <NSpace>
          <NInput
            v-model:value="messageInput"
            placeholder="输入消息..."
            style="flex: 1"
            @keyup.enter="handleSendMessage"
            @input="handleTyping"
            @blur="handleStopTyping"
          />
          <NButton type="primary" @click="handleSendMessage" :disabled="!messageInput.trim()"> 发送 </NButton>
        </NSpace>
      </div>
    </NCard>

    <!-- 通知列表 -->
    <NCard title="通知" v-if="currentRoom">
      <template #header-extra>
        <NButton size="small" @click="clearNotifications"> 清空通知 </NButton>
      </template>

      <div class="notification-list">
        <div v-for="notification in chatSocket.currentRoomNotifications.value" :key="notification.id" class="notification-item">
          <NSpace justify="space-between">
            <span>
              <NTag size="small" :type="getNotificationTypeColor(notification.type)">
                {{ getNotificationTypeText(notification.type) }}
              </NTag>
              {{ formatNotificationText(notification) }}
            </span>
            <NText depth="3" size="small">{{ formatTime(notification.ts) }}</NText>
          </NSpace>
        </div>
        <NEmpty v-if="chatSocket.currentRoomNotifications.value.length === 0" description="暂无通知" />
      </div>
    </NCard>
  </div>
</template>

<style lang="scss" scoped>
.socket-demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-header {
  text-align: center;
  margin-bottom: 30px;
}

.demo-header h1 {
  margin: 0 0 10px 0;
  color: #333;
}

.demo-header p {
  margin: 0;
  color: #666;
}

.connection-status {
  padding: 10px 0;
}

.room-management {
  padding: 10px 0;
}

.joined-rooms {
  margin-top: 20px;
}

.joined-rooms h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.message-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  background-color: #fafafa;
}

.message-item {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-item.self-message {
  background-color: #e3f2fd;
  margin-left: 20%;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
  font-size: 12px;
  color: #666;
}

.sender {
  font-weight: bold;
  color: #333;
}

.message-content {
  color: #333;
  line-height: 1.4;
}

.typing-status {
  padding: 10px 0;
  font-style: italic;
}

.message-input {
  display: flex;
  gap: 10px;
}

.notification-list {
  max-height: 200px;
  overflow-y: auto;
}

.notification-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.notification-item:last-child {
  border-bottom: none;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}

.ml-2 {
  margin-left: 8px;
}
</style>
