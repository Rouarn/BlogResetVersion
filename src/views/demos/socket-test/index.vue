<template>
  <div class="socket-test-container">
    <div class="header">
      <h2>WebSocket 连接测试</h2>
      <div class="status-info">
        <span class="status-label">连接状态:</span>
        <span :class="['status-value', statusClass]">{{ connectionStatus }}</span>
        <span v-if="socketId" class="socket-id">ID: {{ socketId }}</span>
      </div>
    </div>

    <div class="control-panel">
      <div class="connection-controls">
        <NButton type="primary" :disabled="isConnected" :loading="connectionStatus === '连接中'" @click="connect"> 连接服务器 </NButton>
        <NButton type="error" :disabled="!isConnected" @click="disconnect"> 断开连接 </NButton>
      </div>

      <div class="room-controls">
        <NInputGroup>
          <NInput v-model:value="currentRoom" placeholder="输入房间名称" :disabled="!isConnected" @keyup.enter="joinRoom" />
          <NButton type="info" :disabled="!isConnected || !currentRoom.trim()" @click="joinRoom"> 加入房间 </NButton>
        </NInputGroup>

        <div v-if="joinedRooms.length > 0" class="joined-rooms">
          <span class="rooms-label">已加入房间:</span>
          <NTag v-for="room in joinedRooms" :key="room" closable @close="leaveRoom(room)">
            {{ room }}
          </NTag>
        </div>
      </div>

      <div class="message-controls">
        <NInputGroup>
          <NInput
            v-model:value="newMessage"
            placeholder="输入消息内容"
            :disabled="!isConnected || joinedRooms.length === 0"
            @keyup.enter="sendMessage"
          />
          <NButton type="success" :disabled="!isConnected || !newMessage.trim() || joinedRooms.length === 0" @click="sendMessage">
            发送消息
          </NButton>
        </NInputGroup>
      </div>
    </div>

    <div class="message-panel">
      <div class="message-header">
        <span>消息日志</span>
        <NButton size="small" @click="clearMessages">清空</NButton>
      </div>
      <div class="message-list" ref="messageListRef">
        <div v-for="(message, index) in messages" :key="index" class="message-item">
          {{ message }}
        </div>
        <div v-if="messages.length === 0" class="empty-message">暂无消息</div>
      </div>
    </div>

    <div class="debug-panel">
      <NCollapse>
        <NCollapseItem title="调试信息" name="debug">
          <div class="debug-info">
            <div class="debug-item">
              <span class="debug-label">Socket URL:</span>
              <span class="debug-value">{{ socketUrl }}</span>
            </div>
            <div class="debug-item">
              <span class="debug-label">命名空间:</span>
              <span class="debug-value">/ws</span>
            </div>
            <div class="debug-item">
              <span class="debug-label">传输方式:</span>
              <span class="debug-value">websocket, polling</span>
            </div>
            <div class="debug-item">
              <span class="debug-label">重连次数:</span>
              <span class="debug-value">{{ connectionInfo.reconnectCount }}</span>
            </div>
            <div class="debug-item">
              <span class="debug-label">连接时间:</span>
              <span class="debug-value">{{ formatTime(connectionInfo.connectedAt) }}</span>
            </div>
            <div class="debug-item">
              <span class="debug-label">最后活跃:</span>
              <span class="debug-value">{{ formatTime(connectionInfo.lastActiveAt) }}</span>
            </div>
          </div>
        </NCollapseItem>
      </NCollapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { ConnectionInfo, SendMessageData, WebSocketError, WebSocketMessage } from '@/service/socket'
import { socketManager } from '@/service/socket'

definePage({
  meta: {
    title: 'WebSocket 测试',
    icon: 'mdi:loading',
  },
})

const isConnected = ref(false)
const messages = ref<string[]>([])
const newMessage = ref('')
const connectionStatus = ref('未连接')
const currentRoom = ref('test-room')
const joinedRooms = ref<string[]>([])
const connectionInfo = ref<ConnectionInfo>({
  status: 'disconnected',
  reconnectCount: 0,
})
const messageListRef = ref<HTMLElement>()

// 添加消息到列表
const addMessage = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  messages.value.push(`[${timestamp}] ${message}`)

  // 限制消息数量
  if (messages.value.length > 100) {
    messages.value = messages.value.slice(-100)
  }

  // 自动滚动到底部
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

// 计算属性
const socketId = computed(() => socketManager.getSocketId())
const socketUrl = computed(() => import.meta.env.VITE_SOCKET_URL || 'http://localhost:8898')

const statusClass = computed(() => {
  switch (connectionStatus.value) {
    case '已连接':
      return 'status-connected'
    case '连接中':
      return 'status-connecting'
    case '重连中':
      return 'status-reconnecting'
    case '连接错误':
      return 'status-error'
    default:
      return 'status-disconnected'
  }
})

// 连接状态监听
const updateConnectionStatus = () => {
  isConnected.value = socketManager.isConnected()
  const status = socketManager.getStatus()

  switch (status) {
    case 'connected':
      connectionStatus.value = '已连接'
      break
    case 'connecting':
      connectionStatus.value = '连接中'
      break
    case 'reconnecting':
      connectionStatus.value = '重连中'
      break
    case 'error':
      connectionStatus.value = '连接错误'
      break
    default:
      connectionStatus.value = '未连接'
  }

  joinedRooms.value = socketManager.getJoinedRooms().map((room) => room.id)
  connectionInfo.value = socketManager.getConnectionInfo()
}

// 连接到服务器
const connect = async () => {
  try {
    console.log('尝试连接到 WebSocket 服务器...')
    console.log('连接路径: /ws')
    console.log('Socket URL:', socketUrl.value)
    console.log('当前连接状态:', socketManager.getStatus())
    console.log('Socket已连接:', socketManager.isConnected())

    await socketManager.connect()
    updateConnectionStatus()
    addMessage('✅ 连接成功!')
  } catch (error: unknown) {
    console.error('连接失败:', error)
    addMessage(`❌ 连接失败: ${error instanceof Error ? error.message : String(error)}`)
    updateConnectionStatus()
  }
}

// 断开连接
const disconnect = () => {
  socketManager.disconnect()
  updateConnectionStatus()
  addMessage('🔌 已断开连接')
}

// 加入房间
const joinRoom = async () => {
  if (!socketManager.isConnected()) {
    addMessage('❌ 请先连接到服务器')
    return
  }

  if (!currentRoom.value.trim()) {
    addMessage('❌ 请输入房间名称')
    return
  }

  try {
    await socketManager.joinRoom({
      roomId: currentRoom.value,
      userId: 'test-user-' + Date.now(),
      userInfo: {
        name: '测试用户',
        role: 'user',
      },
    })
    addMessage(`🏠 成功加入房间: ${currentRoom.value}`)
    updateConnectionStatus()
  } catch (error: unknown) {
    addMessage(`❌ 加入房间失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 离开房间
const leaveRoom = async (roomId: string) => {
  try {
    await socketManager.leaveRoom({
      roomId,
      userId: 'test-user',
    })
    addMessage(`🚪 离开房间: ${roomId}`)
    updateConnectionStatus()
  } catch (error: unknown) {
    addMessage(`❌ 离开房间失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 发送消息
const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  if (!socketManager.isConnected()) {
    addMessage('❌ 请先连接到服务器')
    return
  }

  if (joinedRooms.value.length === 0) {
    addMessage('❌ 请先加入一个房间')
    return
  }

  try {
    const messageData: SendMessageData = {
      content: newMessage.value,
      room: joinedRooms.value[0], // 发送到第一个房间
      messageType: 'text',
      metadata: {
        timestamp: Date.now(),
      },
    }

    await socketManager.sendMessage(messageData)
    addMessage(`📤 发送到 ${joinedRooms.value[0]}: ${newMessage.value}`)
    newMessage.value = ''
  } catch (error: unknown) {
    addMessage(`❌ 发送失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 清空消息
const clearMessages = () => {
  messages.value = []
}

// 格式化时间
const formatTime = (date?: Date) => {
  if (!date) return '-'
  return date.toLocaleString('zh-CN')
}

// 组件挂载时设置事件监听
onMounted(() => {
  // 监听连接事件
  socketManager.on('connect', () => {
    addMessage('🔗 Socket 连接成功')
    updateConnectionStatus()
  })

  socketManager.on('disconnect', (reason: string) => {
    addMessage(`🔌 Socket 连接断开: ${reason}`)
    updateConnectionStatus()
  })

  socketManager.on('connect_error', (error: Error) => {
    addMessage(`❌ 连接错误: ${error.message}`)
    updateConnectionStatus()
  })

  // 监听服务器消息
  socketManager.on('connected', (data: WebSocketMessage) => {
    addMessage(`📥 服务器连接确认: ${JSON.stringify(data.data)}`)
  })

  socketManager.on('error', (error: WebSocketError) => {
    addMessage(`❌ 服务器错误: ${error.message}`)
  })

  // 监听房间事件
  socketManager.on('room-joined', (data: { room: string; members: number }) => {
    addMessage(`🏠 房间加入成功: ${data.room} (成员数: ${data.members})`)
    updateConnectionStatus()
  })

  socketManager.on('room-left', (data: { room: string }) => {
    addMessage(`🚪 房间离开成功: ${data.room}`)
    updateConnectionStatus()
  })

  socketManager.on('room-message', (data: WebSocketMessage<SendMessageData>) => {
    addMessage(`📥 房间消息: ${data.data.content} (来自: ${data.senderId})`)
  })

  // 监听通知
  socketManager.on('notification', (data: unknown) => {
    const notificationData = data as { title?: string; content?: string }
    addMessage(`🔔 系统通知: ${notificationData.title || '未知'} - ${notificationData.content || '无内容'}`)
  })

  // 初始状态更新
  updateConnectionStatus()
})

// 组件卸载时清理
onUnmounted(() => {
  socketManager.disconnect()
})
</script>

<style scoped>
.socket-test-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.header h2 {
  margin: 0;
  color: #333;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label {
  font-weight: 500;
  color: #666;
}

.status-value {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
}

.status-connected {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-connecting {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.status-reconnecting {
  background-color: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.status-error {
  background-color: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.status-disconnected {
  background-color: #f5f5f5;
  color: #8c8c8c;
  border: 1px solid #d9d9d9;
}

.socket-id {
  font-size: 12px;
  color: #999;
  font-family: monospace;
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
}

.connection-controls {
  display: flex;
  gap: 10px;
}

.room-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.joined-rooms {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.rooms-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.message-controls {
  display: flex;
  gap: 10px;
}

.message-panel {
  margin-bottom: 20px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 500;
  color: #333;
}

.message-list {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 10px;
  background-color: #fff;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.4;
}

.message-item {
  margin-bottom: 5px;
  word-break: break-all;
}

.empty-message {
  text-align: center;
  color: #999;
  font-style: italic;
  margin-top: 50px;
}

.debug-panel {
  margin-top: 20px;
}

.debug-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.debug-label {
  font-weight: 500;
  color: #666;
}

.debug-value {
  font-family: monospace;
  color: #333;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .socket-test-container {
    padding: 10px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .control-panel {
    padding: 15px;
  }

  .connection-controls {
    flex-direction: column;
  }

  .debug-info {
    grid-template-columns: 1fr;
  }
}
</style>
