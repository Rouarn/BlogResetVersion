<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'LoadingDemo',
})

const requestLoading = ref(false)

// 模拟基础加载
function handleBasicLoading() {
  if (window.$loading) {
    window.$loading.open()
    setTimeout(() => {
      window.$loading?.close()
    }, 2000)
  }
}

// 模拟自定义文本加载
function handleCustomTextLoading() {
  if (window.$loading) {
    window.$loading.setText('正在处理数据...')
    window.$loading.open()
    setTimeout(() => {
      window.$loading?.setText('加载中...')
      window.$loading?.close()
    }, 3000)
  }
}

// 模拟HTTP请求加载
function handleRequestLoading() {
  requestLoading.value = true

  // 模拟HTTP请求
  setTimeout(() => {
    requestLoading.value = false
    window.$message?.success('请求完成！')
  }, 2500)
}

// 模拟多次调用
function handleMultipleLoading() {
  if (window.$loading) {
    // 模拟多个并发请求
    window.$loading.open() // 第一个请求
    window.$loading.open() // 第二个请求
    window.$loading.open() // 第三个请求

    setTimeout(() => window.$loading?.close(), 1000) // 第一个完成
    setTimeout(() => window.$loading?.close(), 1500) // 第二个完成
    setTimeout(() => window.$loading?.close(), 2000) // 第三个完成
  }
}

// 检查加载状态
function checkLoadingStatus() {
  if (window.$loading) {
    const status = window.$loading.isLoading()
    window.$message?.info(`当前加载状态: ${status ? '加载中' : '空闲'}`)
  }
}
</script>

<template>
  <div class="loading-demo-container">
    <NCard class="demo-card" :bordered="false">
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">现代化 Loading 组件</h3>
            <p class="header-desc">适用于 HTTP 请求的全局加载动画</p>
          </div>
        </div>
      </template>

      <!-- 基础用法 -->
      <div class="demo-section">
        <div class="demo-title">🚀 基础用法</div>
        <div class="demo-content">
          <p class="demo-desc">点击按钮显示全局加载动画，2秒后自动关闭</p>
          <NButton @click="handleBasicLoading" type="primary" size="large" class="demo-btn"> 显示基础加载 </NButton>
        </div>
      </div>

      <!-- 自定义文本 -->
      <div class="demo-section">
        <div class="demo-title">📝 自定义文本</div>
        <div class="demo-content">
          <p class="demo-desc">动态设置加载文本内容</p>
          <NButton @click="handleCustomTextLoading" type="info" size="large" class="demo-btn"> 自定义文本加载 </NButton>
        </div>
      </div>

      <!-- HTTP请求模拟 -->
      <div class="demo-section">
        <div class="demo-title">🌐 HTTP 请求模拟</div>
        <div class="demo-content">
          <p class="demo-desc">模拟真实的HTTP请求场景，展示在请求期间的加载效果</p>
          <NButton
            @click="handleRequestLoading"
            type="success"
            size="large"
            class="demo-btn"
            :loading="requestLoading"
            :disabled="requestLoading"
          >
            {{ requestLoading ? '请求中...' : '发送HTTP请求' }}
          </NButton>
        </div>
      </div>

      <!-- 多次调用 -->
      <div class="demo-section">
        <div class="demo-title">🔄 多次调用</div>
        <div class="demo-content">
          <p class="demo-desc">模拟多个并发请求，loading会智能计数管理</p>
          <NButton @click="handleMultipleLoading" type="warning" size="large" class="demo-btn"> 多个并发请求 </NButton>
        </div>
      </div>

      <!-- 状态检查 -->
      <div class="demo-section">
        <div class="demo-title">📊 状态检查</div>
        <div class="demo-content">
          <p class="demo-desc">检查当前加载状态</p>
          <NButton @click="checkLoadingStatus" type="tertiary" size="large" class="demo-btn"> 检查加载状态 </NButton>
        </div>
      </div>

      <!-- 代码示例 -->
      <div class="code-section">
        <div class="code-title">💻 使用示例</div>
        <div class="code-content">
          <pre><code>// 在 HTTP 请求中使用
function openLoading() {
  if (loadingCount === 0) window.$loading?.open()
  loadingCount++
}

function closeLoading() {
  loadingCount = Math.max(0, loadingCount - 1)
  if (loadingCount === 0) window.$loading?.close()
}

// 基础用法
window.$loading?.open()   // 显示加载
window.$loading?.close()  // 关闭加载

// 自定义文本
window.$loading?.setText('正在处理数据...')

// 检查状态
const isLoading = window.$loading?.isLoading()

// 销毁实例
window.$loading?.destroy()</code></pre>
        </div>
      </div>

      <!-- 特性说明 -->
      <div class="feature-section">
        <div class="feature-title">✨ 核心特性</div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <div class="feature-content">
              <h4>智能计数</h4>
              <p>支持多次调用，自动管理显示/隐藏状态</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <div class="feature-content">
              <h4>高性能</h4>
              <p>最小显示时间控制，避免闪烁效果</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <div class="feature-content">
              <h4>现代设计</h4>
              <p>双层旋转动画，毛玻璃背景效果</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <div class="feature-content">
              <h4>响应式</h4>
              <p>完美适配桌面端和移动端显示</p>
            </div>
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.loading-demo-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-icon svg {
  width: 24px;
  height: 24px;
}

.header-content {
  flex: 1;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.demo-section {
  margin: 32px 0;
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #18a058;
}

.demo-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.demo-btn {
  align-self: flex-start;
  min-width: 160px;
  height: 40px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.demo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.code-section {
  margin: 32px 0;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.code-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.code-content pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}

.code-content code {
  font-family: inherit;
}

.feature-section {
  margin: 32px 0;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
  text-align: center;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  flex-shrink: 0;
}

.feature-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.feature-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .loading-demo-container {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .demo-section {
    margin: 24px 0;
    padding: 20px;
  }

  .feature-list {
    grid-template-columns: 1fr;
  }

  .code-content pre {
    font-size: 12px;
    padding: 16px;
  }
}
</style>
