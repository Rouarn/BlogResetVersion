<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { SocketEventMap } from '@/service/socket/types'
import { SocketUtils, useSocketMessage, useSocketStatus } from '@/service/socket/utils'

definePage({
  meta: {
    title: 'Socket.IO 演示',
    icon: 'mdi:lan-connect',
  },
})

// 响应式数据
const newMessage = ref('')
const notifications = ref<SocketEventMap['notification'][]>([])

// 使用Socket状态Hook
const { status, connected, reconnect } = useSocketStatus()

// 使用Socket消息Hook
const { messages, sendMessage: sendSocketMessage } = useSocketMessage()

// 计算属性
const statusText = computed(() => {
  const statusMap = {
    disconnected: '未连接',
    connecting: '连接中',
    connected: '已连接',
    reconnecting: '重连中',
    error: '连接错误',
  }
  return statusMap[status.value] || '未知状态'
})

// 方法
const handleConnect = async () => {
  try {
    await SocketUtils.initSocket()
  } catch (error) {
    console.error('连接失败:', error)
  }
}

const handleDisconnect = () => {
  SocketUtils.destroySocket()
}

const handleReconnect = async () => {
  try {
    await reconnect()
  } catch (error) {
    console.error('重连失败:', error)
  }
}

const sendMessage = () => {
  if (newMessage.value.trim() && connected.value) {
    sendSocketMessage(newMessage.value.trim())
    newMessage.value = ''
  }
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString()
}

// 通知处理
const handleNotification = (notification: SocketEventMap['notification']) => {
  notifications.value.unshift(notification)
  // 限制通知数量
  if (notifications.value.length > 10) {
    notifications.value = notifications.value.slice(0, 10)
  }
}

// 生命周期
onMounted(() => {
  // 监听通知
  SocketUtils.onNotification(handleNotification)
})

onUnmounted(() => {
  // 清理监听器
  SocketUtils.offNotification(handleNotification)
})
</script>

<template>
  <div class="socket-example">
    <div class="status-panel">
      <h3>Socket连接状态</h3>
      <div class="status-info">
        <span :class="['status-indicator', status]" />
        <span>状态: {{ statusText }}</span>
        <span>连接: {{ connected ? '已连接' : '未连接' }}</span>
      </div>
      <div class="actions">
        <button @click="handleConnect" :disabled="connected">连接</button>
        <button @click="handleDisconnect" :disabled="!connected">断开</button>
        <button @click="handleReconnect">重连</button>
      </div>
    </div>

    <div class="message-panel">
      <h3>消息面板</h3>
      <div class="message-list">
        <div v-for="message in messages" :key="message.id" class="message-item">
          <div class="message-header">
            <span class="sender">{{ message.sender }}</span>
            <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
          </div>
          <div class="message-content">{{ message.content }}</div>
        </div>
      </div>

      <div class="message-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="输入消息..." :disabled="!connected" />
        <button @click="sendMessage" :disabled="!connected || !newMessage.trim()">发送</button>
      </div>
    </div>

    <div class="notification-panel">
      <h3>通知面板</h3>
      <div class="notification-list">
        <div v-for="notification in notifications" :key="notification.timestamp" :class="['notification-item', notification.type]">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
          <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.socket-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.status-panel,
.message-panel,
.notification-panel {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.connected {
  background-color: #52c41a;
}

.status-indicator.connecting,
.status-indicator.reconnecting {
  background-color: #faad14;
}

.status-indicator.disconnected {
  background-color: #d9d9d9;
}

.status-indicator.error {
  background-color: #ff4d4f;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.actions button:hover:not(:disabled) {
  border-color: #40a9ff;
  color: #40a9ff;
}

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 10px;
}

.message-item {
  margin-bottom: 10px;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.message-content {
  font-size: 14px;
}

.message-input {
  display: flex;
  gap: 10px;
}

.message-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.message-input button {
  padding: 8px 16px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  background: #1890ff;
  color: #fff;
  cursor: pointer;
}

.message-input button:hover:not(:disabled) {
  background: #40a9ff;
}

.message-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.notification-list {
  max-height: 200px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  border-left: 4px solid;
}

.notification-item.info {
  background: #e6f7ff;
  border-left-color: #1890ff;
}

.notification-item.success {
  background: #f6ffed;
  border-left-color: #52c41a;
}

.notification-item.warning {
  background: #fffbe6;
  border-left-color: #faad14;
}

.notification-item.error {
  background: #fff2f0;
  border-left-color: #ff4d4f;
}

.notification-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 14px;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 12px;
  color: #666;
}
</style>
