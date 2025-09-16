<script setup lang="ts" name="animateDirect">
import { ref } from 'vue'

const animationCount = ref(0)
const selectedAnimation = ref('fadeIn')
const animationDuration = ref(1000)
const animationDelay = ref(0)
const isPlaying = ref(false)

const handleAnimationStart = () => {
  animationCount.value++
  isPlaying.value = true
}

const handleAnimationEnd = () => {
  isPlaying.value = false
}

const triggerAnimation = () => {
  // 触发动画的方法
  const elements = document.querySelectorAll('.animate-trigger')
  elements.forEach((el) => {
    el.classList.remove('animated')
    setTimeout(() => {
      el.classList.add('animated')
    }, 10)
  })
}

const resetAnimations = () => {
  const elements = document.querySelectorAll('.animate-trigger')
  elements.forEach((el) => {
    el.classList.remove('animated')
  })
  animationCount.value = 0
}

const animations = [
  { label: '淡入', value: 'fadeIn' },
  { label: '淡出', value: 'fadeOut' },
  { label: '放大', value: 'zoomIn' },
  { label: '缩小', value: 'zoomOut' },
  { label: '左滑入', value: 'slideInLeft' },
  { label: '右滑入', value: 'slideInRight' },
  { label: '上滑入', value: 'slideInUp' },
  { label: '下滑入', value: 'slideInDown' },
  { label: '弹跳', value: 'bounce' },
  { label: '摇摆', value: 'swing' },
  { label: '脉冲', value: 'pulse' },
  { label: '旋转', value: 'rotateIn' },
]
</script>

<template>
  <div class="directive-container">
    <NCard class="directive-card" :bordered="false">
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">动画指令</h3>
            <p class="header-desc">为元素添加丰富的CSS动画效果</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">🎬 动画效果演示</div>

        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-number">{{ animationCount }}</div>
            <div class="stat-label">动画次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ selectedAnimation }}</div>
            <div class="stat-label">当前动画</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ animationDuration }}ms</div>
            <div class="stat-label">持续时间</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ isPlaying ? '播放中' : '已停止' }}</div>
            <div class="stat-label">播放状态</div>
          </div>
        </div>

        <div class="animation-demo">
          <div class="demo-area">
            <h3>基础动画效果</h3>
            <div class="animation-grid">
              <div
                v-animate="'fadeIn'"
                class="animation-card animate-trigger"
                @animationstart="handleAnimationStart"
                @animationend="handleAnimationEnd"
              >
                <div class="card-icon">✨</div>
                <div class="card-title">淡入动画</div>
              </div>

              <div
                v-animate="'zoomIn'"
                class="animation-card animate-trigger"
                @animationstart="handleAnimationStart"
                @animationend="handleAnimationEnd"
              >
                <div class="card-icon">🔍</div>
                <div class="card-title">缩放动画</div>
              </div>

              <div
                v-animate="'slideInLeft'"
                class="animation-card animate-trigger"
                @animationstart="handleAnimationStart"
                @animationend="handleAnimationEnd"
              >
                <div class="card-icon">⬅️</div>
                <div class="card-title">左滑动画</div>
              </div>

              <div
                v-animate="'bounce'"
                class="animation-card animate-trigger"
                @animationstart="handleAnimationStart"
                @animationend="handleAnimationEnd"
              >
                <div class="card-icon">🏀</div>
                <div class="card-title">弹跳动画</div>
              </div>
            </div>
          </div>

          <div class="demo-area">
            <h3>自定义动画配置</h3>
            <div class="config-controls">
              <NSpace vertical>
                <NSpace align="center">
                  <span>动画类型：</span>
                  <NSelect v-model:value="selectedAnimation" :options="animations" style="width: 150px" />
                </NSpace>

                <NSpace align="center">
                  <span>持续时间：</span>
                  <NSlider v-model:value="animationDuration" :min="200" :max="3000" :step="100" style="width: 200px" />
                  <span>{{ animationDuration }}ms</span>
                </NSpace>

                <NSpace align="center">
                  <span>延迟时间：</span>
                  <NSlider v-model:value="animationDelay" :min="0" :max="2000" :step="100" style="width: 200px" />
                  <span>{{ animationDelay }}ms</span>
                </NSpace>
              </NSpace>
            </div>

            <div class="custom-animation">
              <div
                v-animate="{
                  name: selectedAnimation,
                  duration: animationDuration,
                  delay: animationDelay,
                }"
                class="custom-card animate-trigger"
                @animationstart="handleAnimationStart"
                @animationend="handleAnimationEnd"
              >
                <div class="card-icon">🎯</div>
                <div class="card-title">自定义动画</div>
                <div class="card-desc">{{ selectedAnimation }} - {{ animationDuration }}ms</div>
              </div>
            </div>
          </div>

          <div class="demo-area">
            <h3>触发方式演示</h3>
            <div class="trigger-demo">
              <div class="trigger-section">
                <h4>悬停触发</h4>
                <div class="hover-cards">
                  <div v-animate="{ name: 'pulse', trigger: 'hover' }" class="trigger-card" @animationstart="handleAnimationStart">
                    <div class="card-icon">💓</div>
                    <div class="card-title">悬停脉冲</div>
                  </div>

                  <div v-animate="{ name: 'swing', trigger: 'hover' }" class="trigger-card" @animationstart="handleAnimationStart">
                    <div class="card-icon">🎪</div>
                    <div class="card-title">悬停摇摆</div>
                  </div>
                </div>
              </div>

              <div class="trigger-section">
                <h4>点击触发</h4>
                <div class="click-cards">
                  <div
                    v-animate="{ name: 'rotateIn', trigger: 'click' }"
                    class="trigger-card clickable"
                    @animationstart="handleAnimationStart"
                  >
                    <div class="card-icon">🔄</div>
                    <div class="card-title">点击旋转</div>
                  </div>

                  <div
                    v-animate="{ name: 'zoomIn', trigger: 'click' }"
                    class="trigger-card clickable"
                    @animationstart="handleAnimationStart"
                  >
                    <div class="card-icon">🎯</div>
                    <div class="card-title">点击缩放</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="demo-area">
            <h3>连续动画序列</h3>
            <div class="sequence-demo">
              <div class="sequence-container">
                <div v-animate="{ name: 'fadeIn', delay: 0 }" class="sequence-item animate-trigger" @animationstart="handleAnimationStart">
                  第一步
                </div>
                <div class="arrow">→</div>
                <div
                  v-animate="{ name: 'slideInUp', delay: 500 }"
                  class="sequence-item animate-trigger"
                  @animationstart="handleAnimationStart"
                >
                  第二步
                </div>
                <div class="arrow">→</div>
                <div
                  v-animate="{ name: 'zoomIn', delay: 1000 }"
                  class="sequence-item animate-trigger"
                  @animationstart="handleAnimationStart"
                >
                  第三步
                </div>
                <div class="arrow">→</div>
                <div
                  v-animate="{ name: 'bounce', delay: 1500 }"
                  class="sequence-item animate-trigger"
                  @animationstart="handleAnimationStart"
                >
                  完成
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="usage-section">
          <div class="usage-title">📖 使用方法</div>
          <div class="code-examples">
            <div class="code-block">
              <h4>基础用法</h4>
              <pre><code>&lt;!-- 简单动画 --&gt;
&lt;div v-animate="'fadeIn'"&gt;淡入元素&lt;/div&gt;

&lt;!-- 悬停触发 --&gt;
&lt;div v-animate="{ name: 'pulse', trigger: 'hover' }"&gt;
  悬停脉冲
&lt;/div&gt;</code></pre>
            </div>

            <div class="code-block">
              <h4>高级配置</h4>
              <pre><code>&lt;!-- 完整配置 --&gt;
&lt;div v-animate="{
  name: 'slideInLeft',
  duration: 1000,
  delay: 500,
  trigger: 'click',
  infinite: false
}"&gt;高级动画&lt;/div&gt;

&lt;!-- 动画序列 --&gt;
&lt;div v-animate="{ name: 'fadeIn', delay: 0 }"&gt;步骤1&lt;/div&gt;
&lt;div v-animate="{ name: 'slideIn', delay: 500 }"&gt;步骤2&lt;/div&gt;</code></pre>
            </div>
          </div>
        </div>

        <div class="control-section">
          <NSpace>
            <NButton @click="triggerAnimation" type="primary" size="large"> 🎬 触发所有动画 </NButton>
            <NButton @click="resetAnimations" type="tertiary"> 🔄 重置动画 </NButton>
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
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.directive-card {
  max-width: 1000px;
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
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  box-shadow: 0 4px 12px rgba(168, 237, 234, 0.3);
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.stat-card {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #333;
  padding: 16px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(168, 237, 234, 0.3);
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.animation-demo {
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
    margin: 0 0 20px 0;
    color: #2d3748;
    font-size: 18px;
    font-weight: 600;
  }

  h4 {
    margin: 0 0 12px 0;
    color: #4a5568;
    font-size: 16px;
    font-weight: 600;
  }
}

.animation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.animation-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #a8edea;
    transform: translateY(-2px);
  }

  &.animated {
    animation-fill-mode: both;
  }
}

.card-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.card-desc {
  font-size: 12px;
  color: #718096;
  margin-top: 4px;
}

.config-controls {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.custom-animation {
  display: flex;
  justify-content: center;
}

.custom-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  border: none;
  min-width: 200px;

  .card-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .card-title {
    color: white;
    font-size: 16px;
    margin-bottom: 8px;
  }

  .card-desc {
    color: rgba(255, 255, 255, 0.8);
  }
}

.trigger-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.trigger-section {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.hover-cards,
.click-cards {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.trigger-card {
  background: #f7fafc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  min-width: 100px;

  &.clickable {
    cursor: pointer;
  }

  &:hover {
    border-color: #a8edea;
  }

  .card-icon {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .card-title {
    font-size: 12px;
    font-weight: 600;
    color: #2d3748;
  }
}

.sequence-demo {
  display: flex;
  justify-content: center;
}

.sequence-container {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.sequence-item {
  background: linear-gradient(135deg, #84fab0, #8fd3f4);
  color: #333;
  padding: 16px 20px;
  border-radius: 8px;
  font-weight: 600;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.arrow {
  font-size: 20px;
  color: #718096;
  font-weight: bold;
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
  margin-top: 32px;
  text-align: center;
}

// 动画关键帧
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.3);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translateY(0);
  }
  40%,
  43% {
    transform: translateY(-20px);
  }
  70% {
    transform: translateY(-10px);
  }
  90% {
    transform: translateY(-4px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes swing {
  20% {
    transform: rotate(15deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  60% {
    transform: rotate(5deg);
  }
  80% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes rotateIn {
  from {
    transform: rotate(-200deg);
    opacity: 0;
  }
  to {
    transform: rotate(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .directive-container {
    padding: 16px;
  }

  .animation-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }

  .trigger-demo {
    grid-template-columns: 1fr;
  }

  .sequence-container {
    flex-direction: column;
    gap: 12px;
  }

  .arrow {
    transform: rotate(90deg);
  }
}
</style>
