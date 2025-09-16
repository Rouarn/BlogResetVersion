<script setup lang="ts" name="tooltipDirect">
import { ref } from 'vue'

const tooltipCount = ref(0)
const customTooltip = ref('这是自定义的提示内容')
const tooltipPosition = ref('top')
const tooltipDelay = ref(500)
const tooltipDisabled = ref(false)

const handleTooltipShow = () => {
  tooltipCount.value++
}

const resetCounter = () => {
  tooltipCount.value = 0
}

const positions = [
  { label: '上方', value: 'top' },
  { label: '下方', value: 'bottom' },
  { label: '左侧', value: 'left' },
  { label: '右侧', value: 'right' },
]

// 条件提示状态
const isEnabled = ref(true)
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">提示指令</h3>
            <p class="header-desc">为元素添加智能提示框，支持多种位置和自定义样式</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">💬 提示框演示</div>

        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-number">{{ tooltipCount }}</div>
            <div class="stat-label">显示次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ tooltipPosition }}</div>
            <div class="stat-label">当前位置</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ tooltipDelay }}ms</div>
            <div class="stat-label">延迟时间</div>
          </div>
        </div>

        <div class="tooltip-demo">
          <div class="demo-area">
            <h3>基础提示框</h3>
            <div class="tooltip-buttons">
              <NButton v-tooltip="'这是一个基础提示框'" type="primary" size="large" @mouseenter="handleTooltipShow"> 悬停查看提示 </NButton>

              <NButton v-tooltip="{ content: '这是带图标的提示', icon: '💡' }" type="info" size="large" @mouseenter="handleTooltipShow">
                带图标提示
              </NButton>

              <NButton
                v-tooltip="{ content: '这是彩色提示框', theme: 'success' }"
                type="success"
                size="large"
                @mouseenter="handleTooltipShow"
              >
                彩色提示
              </NButton>
            </div>
          </div>

          <div class="demo-area">
            <h3>位置控制</h3>
            <div class="position-controls">
              <NSpace align="center">
                <span>提示位置：</span>
                <NSelect v-model:value="tooltipPosition" :options="positions" style="width: 120px" />
              </NSpace>
            </div>

            <div class="position-demo">
              <div class="center-area">
                <NButton
                  v-tooltip="{
                    content: '位置：' + tooltipPosition,
                    placement: tooltipPosition,
                    delay: tooltipDelay,
                  }"
                  type="primary"
                  size="large"
                  class="center-btn"
                  @mouseenter="handleTooltipShow"
                >
                  {{ tooltipPosition }} 提示
                </NButton>
              </div>
            </div>
          </div>

          <div class="demo-area">
            <h3>自定义配置</h3>
            <div class="config-controls">
              <NSpace vertical>
                <NSpace align="center">
                  <span>自定义内容：</span>
                  <NInput v-model:value="customTooltip" placeholder="输入提示内容" style="width: 200px" />
                </NSpace>

                <NSpace align="center">
                  <span>延迟时间：</span>
                  <NSlider v-model:value="tooltipDelay" :min="0" :max="2000" :step="100" style="width: 200px" />
                  <span>{{ tooltipDelay }}ms</span>
                </NSpace>

                <NSpace align="center">
                  <NSwitch v-model:value="tooltipDisabled" />
                  <span>禁用提示</span>
                </NSpace>
              </NSpace>
            </div>

            <div class="custom-demo">
              <div class="tooltip-cards">
                <div
                  v-tooltip="{
                    content: customTooltip,
                    delay: tooltipDelay,
                    disabled: tooltipDisabled,
                    theme: 'dark',
                  }"
                  class="tooltip-card"
                  @mouseenter="handleTooltipShow"
                >
                  <div class="card-icon">🎨</div>
                  <div class="card-title">自定义提示</div>
                  <div class="card-desc">悬停查看自定义内容</div>
                </div>

                <div
                  v-tooltip="{
                    content: '这是一个多行提示，支持换行显示，非常实用',
                    delay: tooltipDelay,
                    disabled: tooltipDisabled,
                    maxWidth: 200,
                  }"
                  class="tooltip-card"
                  @mouseenter="handleTooltipShow"
                >
                  <div class="card-icon">📝</div>
                  <div class="card-title">多行提示</div>
                  <div class="card-desc">支持多行文本显示</div>
                </div>

                <div
                  v-tooltip="{
                    content: '富文本提示框',
                    delay: tooltipDelay,
                    disabled: tooltipDisabled,
                  }"
                  class="tooltip-card"
                  @mouseenter="handleTooltipShow"
                >
                  <div class="card-icon">✨</div>
                  <div class="card-title">富文本提示</div>
                  <div class="card-desc">支持HTML格式</div>
                </div>
              </div>
            </div>
          </div>

          <div class="demo-area">
            <h3>特殊场景</h3>
            <div class="special-demo">
              <div class="icons-grid">
                <div v-tooltip="'用户信息'" class="icons-item" @mouseenter="handleTooltipShow">👤</div>
                <div v-tooltip="'设置选项'" class="icons-item" @mouseenter="handleTooltipShow">⚙️</div>
                <div v-tooltip="'消息通知'" class="icons-item" @mouseenter="handleTooltipShow">📧</div>
                <div v-tooltip="'帮助文档'" class="icons-item" @mouseenter="handleTooltipShow">❓</div>
                <div v-tooltip="'收藏夹'" class="icons-item" @mouseenter="handleTooltipShow">⭐</div>
                <div v-tooltip="'搜索功能'" class="icons-item" @mouseenter="handleTooltipShow">🔍</div>
              </div>
            </div>
          </div>
        </div>

        <div class="usage-section">
          <div class="usage-title">📖 使用方法</div>
          <div class="code-examples">
            <div class="code-block">
              <h4>基础用法</h4>
              <pre><code><!-- 简单文本提示 -->
<button v-tooltip="'提示内容'">悬停按钮</button>

<!-- 条件提示 -->
<button v-tooltip="isEnabled ? '启用状态' : null">条件提示</button></code></pre>
            </div>

            <div class="code-block">
              <h4>高级配置</h4>
              <pre><code><!-- 完整配置 -->
<button v-tooltip="{
  content: '提示内容',
  placement: 'top',
  delay: 500,
  theme: 'dark',
  maxWidth: 200,
  disabled: false
}"
>高级提示</button></code></pre>
            </div>
          </div>
        </div>

        <div class="control-section">
          <NSpace>
            <NButton @click="resetCounter" type="tertiary"> 重置计数器 </NButton>
            <NButton @click="tooltipDisabled = !tooltipDisabled" type="primary"> {{ tooltipDisabled ? '启用' : '禁用' }}提示 </NButton>
          </NSpace>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.directive-container {
  padding: 24px;
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
}

.directive-card {
  max-width: 900px;
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
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(116, 185, 255, 0.3);
}

.header-content {
  flex: 1;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.header-desc {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

.demo-section {
  padding: 24px;
}

.demo-title {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 24px;
  text-align: center;
}

.stats-section {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.stat-card {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  text-align: center;
  min-width: 120px;
  box-shadow: 0 4px 12px rgba(116, 185, 255, 0.3);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.tooltip-demo {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.demo-area {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;

  h3 {
    margin: 0 0 16px 0;
    color: #2d3748;
    font-size: 18px;
    font-weight: 600;
  }
}

.tooltip-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.position-controls {
  margin-bottom: 24px;
  text-align: center;
}

.position-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 120px;
}

.center-area {
  display: flex;
  justify-content: center;
  align-items: center;
}

.center-btn {
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.config-controls {
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.custom-demo {
  margin-top: 16px;
}

.tooltip-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.tooltip-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #74b9ff;
  }
}

.card-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.card-desc {
  font-size: 12px;
  color: #718096;
}

.special-demo {
  display: flex;
  justify-content: center;
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  max-width: 400px;
}

.icons-item {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px) scale(1.1);
    border-color: #74b9ff;
    box-shadow: 0 4px 16px rgba(116, 185, 255, 0.3);
  }
}

.usage-section {
  margin-top: 32px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.usage-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 16px;
}

.code-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.code-block {
  background: #2d3748;
  border-radius: 8px;
  padding: 16px;
  color: white;

  h4 {
    margin: 0 0 12px 0;
    color: #e2e8f0;
    font-size: 14px;
  }

  pre {
    margin: 0;
    font-family: 'Fira Code', monospace;
    font-size: 12px;
    line-height: 1.5;
    overflow-x: auto;

    code {
      color: #a0aec0;
    }
  }
}

.control-section {
  margin-top: 24px;
  text-align: center;
}

@media (max-width: 768px) {
  .directive-container {
    padding: 16px;
  }

  .tooltip-buttons {
    flex-direction: column;
    align-items: center;
  }

  .icon-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .icon-item {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .stats-section {
    flex-direction: column;
    align-items: center;
  }
}
</style>
