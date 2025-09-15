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
        <NButton type="primary" :disabled="isConnected" :loading="isConnecting" @click="connect"> 连接服务器 </NButton>
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
      <div ref="messageListRef" class="message-list">
        <div v-for="(message, index) in messages" :key="index" class="message-item">
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          <span class="message-content">{{ message.content }}</span>
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
              <span class="debug-value">{{ socketNamespace }}</span>
            </div>
            <div class="debug-item">
              <span class="debug-label">传输方式:</span>
              <span class="debug-value">websocket, polling</span>
            </div>
          </div>
        </NCollapseItem>
      </NCollapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { socketManager } from '@/service/socket'

definePage({
  meta: {
    title: 'WebSocket 测试',
    icon: 'mdi:loading',
  },
})

// 响应式数据
const isConnected = ref(false)
const isConnecting = ref(false)
const messages = ref<Array<{ content: string; timestamp: number }>>([])
const newMessage = ref('')
const connectionStatus = ref('未连接')
const currentRoom = ref('test-room')
const joinedRooms = ref<string[]>([])
const messageListRef = ref<HTMLElement>()

// 计算属性
const socketId = computed(() => socketManager.getSocketId())
const socketUrl = computed(() => import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000')
const socketNamespace = computed(() => import.meta.env.VITE_SOCKET_NAMESPACE || '/ws')

const statusClass = computed(() => {
  switch (connectionStatus.value) {
    case '已连接':
      return 'status-connected'
    case '连接中':
      return 'status-connecting'
    case '连接错误':
      return 'status-error'
    default:
      return 'status-disconnected'
  }
})

// 添加消息到列表
function addMessage(content: string) {
  messages.value.push({
    content,
    timestamp: Date.now(),
  })

  // 自动滚动到底部
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

// 格式化时间
function formatTime(timestamp?: number): string {
  if (!timestamp) return '--'
  return new Date(timestamp).toLocaleTimeString()
}

// 设置事件监听
function setupEventListeners() {
  const socket = socketManager.getSocket()
  if (!socket) return

  // 监听服务器消息
  socket.on('message', (data: unknown) => {
    addMessage(`[服务器消息] ${JSON.stringify(data)}`)
  })

  // 监听房间消息
  socket.on('room_message', (data: { room: string; content: string }) => {
    addMessage(`[房间消息] ${data.room}: ${data.content}`)
  })

  // 监听房间事件
  socket.on('room_joined', (data: { room: string }) => {
    addMessage(`[房间事件] 加入房间成功: ${data.room}`)
  })

  socket.on('room_left', (data: { room: string }) => {
    addMessage(`[房间事件] 离开房间: ${data.room}`)
  })

  // 监听通知
  socket.on('notification', (data: { title: string; content: string }) => {
    addMessage(`[通知] ${data.title}: ${data.content}`)
  })

  // 监听连接断开
  socket.on('disconnect', (reason: string) => {
    isConnected.value = false
    connectionStatus.value = '未连接'
    joinedRooms.value = []
    addMessage(`连接断开: ${reason}`)
  })

  // 监听连接错误
  socket.on('connect_error', (error: Error) => {
    connectionStatus.value = '连接错误'
    addMessage(`连接错误: ${error.message}`)
  })
}

// 连接到服务器
async function connect() {
  try {
    isConnecting.value = true
    connectionStatus.value = '连接中'
    addMessage('正在连接到服务器...')

    await socketManager.connect()

    isConnected.value = true
    connectionStatus.value = '已连接'
    addMessage(`连接成功！Socket ID: ${socketManager.getSocketId()}`)

    // 设置事件监听
    setupEventListeners()
  } catch (error) {
    connectionStatus.value = '连接错误'
    addMessage(`连接失败: ${error}`)
    console.error('连接失败:', error)
  } finally {
    isConnecting.value = false
  }
}

// 断开连接
function disconnect() {
  socketManager.disconnect()
  isConnected.value = false
  connectionStatus.value = '未连接'
  joinedRooms.value = []
  addMessage('已断开连接')
}

// 加入房间
function joinRoom() {
  if (!currentRoom.value.trim()) return

  const roomId = currentRoom.value.trim()
  if (joinedRooms.value.includes(roomId)) {
    addMessage(`已经在房间 ${roomId} 中`)
    return
  }

  socketManager.joinRoom(roomId)
  joinedRooms.value.push(roomId)
  addMessage(`加入房间: ${roomId}`)
  currentRoom.value = ''
}

// 离开房间
function leaveRoom(roomId: string) {
  socketManager.leaveRoom(roomId)
  joinedRooms.value = joinedRooms.value.filter((room) => room !== roomId)
  addMessage(`离开房间: ${roomId}`)
}

// 发送消息
function sendMessage() {
  if (!newMessage.value.trim() || joinedRooms.value.length === 0) return

  const message = newMessage.value.trim()
  const room = joinedRooms.value[0] // 发送到第一个房间

  socketManager.sendMessage(room, message)
  addMessage(`[${room}] 我: ${message}`)
  newMessage.value = ''
}

// 清空消息
function clearMessages() {
  messages.value = []
}

// 组件挂载时的初始化
onMounted(() => {
  addMessage('WebSocket 测试页面已加载')
})

// 组件卸载时清理
onUnmounted(() => {
  if (isConnected.value) {
    socketManager.disconnect()
  }
})
</script>

<style scoped>
.socket-test-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.header h2 {
  margin: 0 0 10px 0;
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
  font-size: 12px;
  font-weight: 500;
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

.status-error {
  background-color: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.status-disconnected {
  background-color: #f5f5f5;
  color: #999;
  border: 1px solid #d9d9d9;
}

.socket-id {
  font-family: monospace;
  font-size: 12px;
  color: #666;
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
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
}

.message-controls {
  display: flex;
  gap: 10px;
}

.message-panel {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 20px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #fafafa;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
}

.message-list {
  height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.message-item {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 14px;
}

.message-time {
  color: #999;
  font-size: 12px;
  white-space: nowrap;
  min-width: 80px;
}

.message-content {
  flex: 1;
  word-break: break-word;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 40px;
  font-style: italic;
}

.debug-panel {
  margin-top: 20px;
}

.debug-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.debug-item {
  display: flex;
  gap: 10px;
}

.debug-label {
  font-weight: 500;
  color: #666;
  min-width: 100px;
}

.debug-value {
  font-family: monospace;
  color: #333;
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
