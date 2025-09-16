<script setup lang="ts" name="longpressDirect">
import { ref } from 'vue'

const longpressCount = ref(0)
const isLongpressing = ref(false)
const progress = ref(0)
const progressTimer = ref<NodeJS.Timeout | null>(null)

const longpress = () => {
  longpressCount.value++
  isLongpressing.value = false
  progress.value = 0
  window.$message?.success(`长按成功！第 ${longpressCount.value} 次触发 🎉`)
}

const handleMouseDown = () => {
  isLongpressing.value = true
  progress.value = 0

  // 模拟进度条
  progressTimer.value = setInterval(() => {
    progress.value += 5
    if (progress.value >= 100) {
      clearInterval(progressTimer.value!)
    }
  }, 100)
}

const handleMouseUp = () => {
  if (progressTimer.value) {
    clearInterval(progressTimer.value)
  }

  setTimeout(() => {
    isLongpressing.value = false
    progress.value = 0
  }, 100)
}

const resetCounter = () => {
  longpressCount.value = 0
}
</script>

<template>
  <div class="directive-container">
    <NCard class="directive-card" :bordered="false">
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">长按指令</h3>
            <p class="header-desc">检测长按操作，提供丰富的交互反馈</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">👆 长按交互演示</div>

        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-number">{{ longpressCount }}</div>
            <div class="stat-label">成功次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ Math.round(progress) }}%</div>
            <div class="stat-label">当前进度</div>
          </div>
        </div>

        <div class="longpress-demo">
          <div class="demo-area">
            <NButton
              v-longpress="longpress"
              type="primary"
              size="large"
              class="longpress-btn"
              :class="{ pressing: isLongpressing }"
              @mousedown="handleMouseDown"
              @mouseup="handleMouseUp"
              @mouseleave="handleMouseUp"
            >
              <template #icon>
                <div class="btn-icon" :class="{ pulsing: isLongpressing }">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                    />
                  </svg>
                </div>
              </template>
              {{ isLongpressing ? '长按中...' : '长按我 (2秒)' }}
            </NButton>

            <div class="progress-container" :class="{ active: isLongpressing }">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
              </div>
              <div class="progress-text">{{ isLongpressing ? '继续长按...' : '按住按钮开始' }}</div>
            </div>
          </div>

          <div class="control-area">
            <NButton @click="resetCounter" type="default" size="medium">
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

        <div class="usage-tip">
          <div class="tip-icon">💡</div>
          <div class="tip-text">
            <strong>长按功能：</strong>检测用户长时间按住元素的操作，通常用于触发特殊功能或确认操作。
            <br />
            <strong>使用场景：</strong>删除确认、快捷菜单、录音功能、游戏操作等需要防误触的场景。
            <br />
            <strong>使用方法：</strong>在元素上添加 <code>v-longpress="handler"</code> 指令，默认长按时间为2秒
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
  background: linear-gradient(135deg, #fef7cd 0%, #fde047 100%);
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
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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

  .demo-title {
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
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
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.2);
  }
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: #78350f;
}

.longpress-demo {
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

.longpress-btn {
  border-radius: 16px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &.pressing {
    background: #f59e0b !important;
    border-color: #f59e0b !important;
    transform: scale(0.95);

    &:hover {
      background: #d97706 !important;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
      animation: ripple 0.6s linear infinite;
    }
  }
}

.btn-icon {
  transition: all 0.3s ease;

  &.pulsing {
    animation: pulse 1s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.progress-container {
  width: 300px;
  opacity: 0.5;
  transition: all 0.3s ease;

  &.active {
    opacity: 1;
    transform: scale(1.05);
  }
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
  border-radius: 4px;
  transition: width 0.1s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
    animation: shimmer 1.5s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.control-area {
  display: flex;
  gap: 12px;
}

.usage-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #fef7cd 0%, #fde047 100%);
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
}

.tip-icon {
  font-size: 20px;
  line-height: 1;
}

.tip-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: #d97706;

  strong {
    color: #92400e;
  }

  code {
    background: rgba(146, 64, 14, 0.1);
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

  .progress-container {
    width: 250px;
  }

  .longpress-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>
