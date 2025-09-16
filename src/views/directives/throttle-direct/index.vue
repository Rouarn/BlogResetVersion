<script setup lang="ts" name="throttleDirect">
import { ref } from 'vue'

const clickCount = ref(0)
const throttleCount = ref(0)
const isThrottling = ref(false)
const lastExecuteTime = ref<Date | null>(null)

const throttle = () => {
  throttleCount.value++
  lastExecuteTime.value = new Date()
  isThrottling.value = true

  window.$message?.success(`节流执行！第 ${throttleCount.value} 次触发 🎉`)

  // 模拟节流状态
  setTimeout(() => {
    isThrottling.value = false
  }, 1000)
}

const handleClick = () => {
  clickCount.value++
}

const resetCounters = () => {
  clickCount.value = 0
  throttleCount.value = 0
  lastExecuteTime.value = null
  isThrottling.value = false
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
}
</script>

<template>
  <div class="directive-container">
    <NCard class="directive-card" :bordered="false">
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">节流指令</h3>
            <p class="header-desc">限制函数执行频率，提升应用性能</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">⏱️ 节流控制演示</div>

        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-number">{{ clickCount }}</div>
            <div class="stat-label">点击次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ throttleCount }}</div>
            <div class="stat-label">执行次数</div>
          </div>
          <div class="stat-card full-width">
            <div class="stat-number">{{ lastExecuteTime ? formatTime(lastExecuteTime) : '--:--:--' }}</div>
            <div class="stat-label">最后执行时间</div>
          </div>
        </div>

        <div class="throttle-demo">
          <div class="demo-area">
            <NButton
              v-throttle="throttle"
              type="primary"
              size="large"
              class="throttle-btn"
              :class="{ throttling: isThrottling }"
              @click="handleClick"
            >
              <template #icon>
                <div class="btn-icon" :class="{ spinning: isThrottling }">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </template>
              {{ isThrottling ? '节流中...' : '快速点击我' }}
            </NButton>

            <div class="status-indicator" :class="{ active: isThrottling }">
              <div class="indicator-dot"></div>
              <div class="indicator-text">
                {{ isThrottling ? '节流生效中 (1秒内不可重复执行)' : '可以执行' }}
              </div>
            </div>
          </div>

          <div class="control-area">
            <NButton @click="resetCounters" type="default" size="medium">
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </template>
              重置计数
            </NButton>
          </div>
        </div>

        <div class="efficiency-display">
          <div class="efficiency-title">📊 节流效率分析</div>
          <div class="efficiency-content">
            <div class="efficiency-item">
              <span class="label">节流比率:</span>
              <span class="value">{{ clickCount > 0 ? Math.round((throttleCount / clickCount) * 100) : 0 }}%</span>
            </div>
            <div class="efficiency-item">
              <span class="label">节省执行:</span>
              <span class="value">{{ Math.max(0, clickCount - throttleCount) }} 次</span>
            </div>
          </div>
        </div>

        <div class="usage-tip">
          <div class="tip-icon">💡</div>
          <div class="tip-text">
            <strong>节流功能：</strong>在指定时间间隔内，无论触发多少次事件，函数只执行一次，有效控制执行频率。
            <br />
            <strong>使用场景：</strong>按钮防重复点击、滚动事件优化、搜索输入优化、窗口resize事件等高频操作。
            <br />
            <strong>使用方法：</strong>在元素上添加 <code>v-throttle="handler"</code> 指令，默认节流时间为1秒
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.directive-container {
  padding: 24px;
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 100%);
}

.directive-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 24px;
    height: 24px;
  }
}

.header-content {
  flex: 1;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.header-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.demo-section {
  padding: 24px 0;
}

.demo-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border: 2px solid #8b5cf6;
  transition: all 0.3s ease;

  &.full-width {
    grid-column: 1 / -1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
  }
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #6d28d9;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: #5b21b6;
}

.throttle-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.demo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.throttle-btn {
  border-radius: 16px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;

  &.throttling {
    background: #8b5cf6 !important;
    border-color: #8b5cf6 !important;
    opacity: 0.8;

    &:hover {
      background: #7c3aed !important;
    }
  }
}

.btn-icon {
  transition: all 0.3s ease;

  &.spinning {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 12px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;

  &.active {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-color: #f59e0b;

    .indicator-dot {
      background: #f59e0b;
      animation: pulse-dot 1s ease-in-out infinite;
    }
  }
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #9ca3af;
  transition: all 0.3s ease;
}

@keyframes pulse-dot {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

.indicator-text {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.control-area {
  display: flex;
  gap: 12px;
}

.efficiency-display {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-radius: 12px;
  border: 2px solid #8b5cf6;
}

.efficiency-title {
  font-size: 16px;
  font-weight: 600;
  color: #6d28d9;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.efficiency-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.efficiency-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;

  .label {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
  }

  .value {
    font-size: 16px;
    font-weight: 700;
    color: #6d28d9;
  }
}

.usage-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-radius: 12px;
  border-left: 4px solid #8b5cf6;
}

.tip-icon {
  font-size: 20px;
  line-height: 1;
}

.tip-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: #7c3aed;

  strong {
    color: #6d28d9;
  }

  code {
    background: rgba(109, 40, 217, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .directive-container {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .efficiency-content {
    grid-template-columns: 1fr;
  }

  .throttle-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>
