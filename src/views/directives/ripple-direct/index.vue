<script setup lang="ts" name="rippleDirect">
import { ref } from 'vue'

const rippleDisabled = ref(false)
const rippleCount = ref(0)

const handleRippleClick = () => {
  rippleCount.value++
}

const toggleRipple = () => {
  rippleDisabled.value = !rippleDisabled.value
}

const resetCounter = () => {
  rippleCount.value = 0
}
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
            <h3 class="header-title">波纹指令</h3>
            <p class="header-desc">为元素添加Material Design风格的波纹点击效果</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">🌊 波纹效果演示</div>

        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-number">{{ rippleCount }}</div>
            <div class="stat-label">点击次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ rippleDisabled ? '禁用' : '启用' }}</div>
            <div class="stat-label">波纹状态</div>
          </div>
        </div>

        <div class="ripple-demo">
          <div class="demo-area">
            <h3>基础波纹效果</h3>
            <div class="ripple-buttons">
              <NButton v-ripple type="primary" size="large" class="ripple-btn" @click="handleRippleClick"> 点击我看波纹 </NButton>

              <NButton v-ripple="{ color: '#ff6b6b' }" type="error" size="large" class="ripple-btn" @click="handleRippleClick">
                红色波纹
              </NButton>

              <NButton
                v-ripple="{ color: '#4ecdc4', duration: 1000 }"
                type="success"
                size="large"
                class="ripple-btn"
                @click="handleRippleClick"
              >
                慢速波纹
              </NButton>
            </div>
          </div>

          <div class="demo-area">
            <h3>条件波纹</h3>
            <div class="control-section">
              <NSpace align="center">
                <NSwitch v-model:value="rippleDisabled" />
                <span>禁用波纹效果</span>
                <NButton @click="toggleRipple">切换状态</NButton>
              </NSpace>
            </div>

            <div class="ripple-cards">
              <div v-ripple="!rippleDisabled" class="ripple-card" @click="handleRippleClick">
                <div class="card-icon">🎯</div>
                <div class="card-title">可控制波纹</div>
                <div class="card-desc">根据开关状态启用/禁用波纹</div>
              </div>

              <div v-ripple="{ disabled: rippleDisabled, color: '#9c88ff' }" class="ripple-card" @click="handleRippleClick">
                <div class="card-icon">✨</div>
                <div class="card-title">紫色波纹</div>
                <div class="card-desc">自定义颜色的波纹效果</div>
              </div>
            </div>
          </div>

          <div class="demo-area">
            <h3>不同形状元素</h3>
            <div class="shape-demo">
              <div v-ripple="{ color: '#ff9f43' }" class="circle-btn" @click="handleRippleClick">圆形</div>

              <div v-ripple="{ color: '#26de81' }" class="square-btn" @click="handleRippleClick">方形</div>

              <div v-ripple="{ color: '#fd79a8' }" class="rounded-btn" @click="handleRippleClick">圆角矩形</div>
            </div>
          </div>
        </div>

        <div class="usage-section">
          <div class="usage-title">📖 使用方法</div>
          <div class="code-examples">
            <div class="code-block">
              <h4>基础用法</h4>
              <pre><code>&lt;!-- 默认波纹效果 --&gt;
&lt;button v-ripple&gt;点击按钮&lt;/button&gt;

&lt;!-- 条件波纹 --&gt;
&lt;button v-ripple="isEnabled"&gt;条件波纹&lt;/button&gt;</code></pre>
            </div>

            <div class="code-block">
              <h4>自定义配置</h4>
              <pre><code>&lt;!-- 自定义颜色和持续时间 --&gt;
&lt;button v-ripple="{
  color: '#ff6b6b',
  duration: 800
}"&gt;红色波纹&lt;/button&gt;

&lt;!-- 禁用波纹 --&gt;
&lt;button v-ripple="{ disabled: true }"&gt;禁用波纹&lt;/button&gt;</code></pre>
            </div>
          </div>
        </div>

        <div class="control-section">
          <NSpace>
            <NButton @click="resetCounter" type="tertiary"> 重置计数器 </NButton>
            <NButton @click="toggleRipple" type="primary"> {{ rippleDisabled ? '启用' : '禁用' }}波纹 </NButton>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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
}

.stat-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  text-align: center;
  min-width: 120px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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

.ripple-demo {
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

.ripple-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.ripple-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.control-section {
  margin: 16px 0;
  text-align: center;
}

.ripple-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.ripple-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
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

.shape-demo {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.circle-btn,
.square-btn,
.rounded-btn {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-size: 14px;

  &:hover {
    transform: scale(1.05);
  }
}

.circle-btn {
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9f43, #ff6b35);
}

.square-btn {
  border-radius: 4px;
  background: linear-gradient(135deg, #26de81, #20bf6b);
}

.rounded-btn {
  border-radius: 20px;
  background: linear-gradient(135deg, #fd79a8, #e84393);
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

@media (max-width: 768px) {
  .directive-container {
    padding: 16px;
  }

  .ripple-buttons {
    flex-direction: column;
    align-items: center;
  }

  .shape-demo {
    gap: 16px;
  }

  .circle-btn,
  .square-btn,
  .rounded-btn {
    width: 60px;
    height: 60px;
    font-size: 12px;
  }
}
</style>
