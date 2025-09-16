<script setup lang="ts" name="loadingDirect">
import { ref } from 'vue'

const isLoading = ref(false)
const isCustomLoading = ref(false)
const isTableLoading = ref(false)
const isCardLoading = ref(false)

const toggleLoading = () => {
  isLoading.value = !isLoading.value
  if (isLoading.value) {
    setTimeout(() => {
      isLoading.value = false
    }, 3000)
  }
}

const toggleCustomLoading = () => {
  isCustomLoading.value = !isCustomLoading.value
  if (isCustomLoading.value) {
    setTimeout(() => {
      isCustomLoading.value = false
    }, 5000)
  }
}

const toggleTableLoading = () => {
  isTableLoading.value = !isTableLoading.value
  if (isTableLoading.value) {
    setTimeout(() => {
      isTableLoading.value = false
    }, 2000)
  }
}

const toggleCardLoading = () => {
  isCardLoading.value = !isCardLoading.value
  if (isCardLoading.value) {
    setTimeout(() => {
      isCardLoading.value = false
    }, 4000)
  }
}

const tableData = [
  { id: 1, name: '张三', age: 25, city: '北京' },
  { id: 2, name: '李四', age: 30, city: '上海' },
  { id: 3, name: '王五', age: 28, city: '广州' },
  { id: 4, name: '赵六', age: 32, city: '深圳' },
]

const tableColumns = [
  { title: 'ID', key: 'id' },
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '城市', key: 'city' },
]
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">加载指令</h3>
            <p class="header-desc">为元素添加加载状态和遮罩层</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">🔄 基础加载</div>
        <div class="demo-content">
          <p class="demo-desc">点击按钮显示默认加载状态</p>
          <div class="loading-demo" v-loading="isLoading">
            <div class="demo-box">
              <h3>内容区域</h3>
              <p>这里是一些内容，加载时会被遮罩覆盖。</p>
              <p>加载状态会持续 3 秒钟。</p>
            </div>
          </div>
          <NButton @click="toggleLoading" type="primary" size="large" class="demo-btn">
            {{ isLoading ? '加载中...' : '开始加载' }}
          </NButton>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🎨 自定义加载</div>
        <div class="demo-content">
          <p class="demo-desc">自定义加载文本和样式</p>
          <div
            class="loading-demo custom-loading"
            v-loading="{
              loading: isCustomLoading,
              text: '数据加载中...',
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
            }"
          >
            <div class="demo-box">
              <h3>自定义加载样式</h3>
              <p>这个加载遮罩使用了自定义的背景色和文本。</p>
              <p>加载状态会持续 5 秒钟。</p>
            </div>
          </div>
          <NButton @click="toggleCustomLoading" type="info" size="large" class="demo-btn">
            {{ isCustomLoading ? '自定义加载中...' : '开始自定义加载' }}
          </NButton>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">📊 表格加载</div>
        <div class="demo-content">
          <p class="demo-desc">在表格组件上应用加载状态</p>
          <div v-loading="isTableLoading" class="table-container">
            <NDataTable :columns="tableColumns" :data="tableData" :bordered="false" size="medium" />
          </div>
          <NButton @click="toggleTableLoading" type="success" size="large" class="demo-btn">
            {{ isTableLoading ? '表格加载中...' : '刷新表格' }}
          </NButton>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🃏 卡片加载</div>
        <div class="demo-content">
          <p class="demo-desc">在卡片组件上应用加载状态</p>
          <div class="card-grid">
            <NCard v-loading="isCardLoading" class="demo-card" title="用户信息" :bordered="true">
              <div class="card-content">
                <div class="user-info">
                  <div class="avatar">👤</div>
                  <div class="info">
                    <h4>张三</h4>
                    <p>前端开发工程师</p>
                    <p>北京市朝阳区</p>
                  </div>
                </div>
              </div>
            </NCard>
            <NCard v-loading="isCardLoading" class="demo-card" title="统计数据" :bordered="true">
              <div class="card-content">
                <div class="stats">
                  <div class="stat-item">
                    <div class="stat-value">1,234</div>
                    <div class="stat-label">访问量</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">567</div>
                    <div class="stat-label">用户数</div>
                  </div>
                </div>
              </div>
            </NCard>
          </div>
          <NButton @click="toggleCardLoading" type="warning" size="large" class="demo-btn">
            {{ isCardLoading ? '卡片加载中...' : '刷新卡片' }}
          </NButton>
        </div>
      </div>

      <div class="code-section">
        <div class="code-title">💻 使用示例</div>
        <div class="code-content">
          <pre><code>&lt;!-- 基础用法 --&gt;
&lt;div v-loading="isLoading"&gt;
  内容区域
&lt;/div&gt;

&lt;!-- 自定义配置 --&gt;
&lt;div v-loading="{
  loading: isLoading,
  text: '加载中...',
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#fff'
}"&gt;
  内容区域
&lt;/div&gt;

&lt;!-- 在组件上使用 --&gt;
&lt;NDataTable v-loading="tableLoading" :data="data" /&gt;
&lt;NCard v-loading="cardLoading" title="标题"&gt;
  卡片内容
&lt;/NCard&gt;</code></pre>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-title">✨ 功能特点</div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <div class="feature-content">
              <h4>智能遮罩</h4>
              <p>自动创建遮罩层覆盖目标元素</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <div class="feature-content">
              <h4>自定义样式</h4>
              <p>支持自定义加载文本、颜色和背景</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <div class="feature-content">
              <h4>性能优化</h4>
              <p>自动管理 DOM 元素的创建和销毁</p>
            </div>
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.directive-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.directive-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;

  .header-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .header-content {
    flex: 1;

    .header-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #1a1a1a;
    }

    .header-desc {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
}

.demo-section {
  margin-bottom: 32px;

  .demo-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }

  .demo-content {
    background: #f8fafc;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;

    .demo-desc {
      margin: 0 0 16px 0;
      color: #64748b;
      font-size: 14px;
    }

    .loading-demo {
      position: relative;
      margin-bottom: 16px;
      min-height: 120px;

      .demo-box {
        background: white;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;

        h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        p {
          margin: 0 0 8px 0;
          color: #666;
          line-height: 1.5;
        }
      }
    }

    .demo-btn {
      margin-top: 8px;
    }
  }
}

.table-container {
  position: relative;
  margin-bottom: 16px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.demo-card {
  position: relative;
}

.card-content {
  padding: 8px 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.info p {
  margin: 0 0 2px 0;
  font-size: 14px;
  color: #666;
}

.stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.code-section {
  margin-bottom: 32px;
}

.code-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.code-content {
  background: #1e293b;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
}

.code-content pre {
  margin: 0;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.feature-section {
  margin-bottom: 32px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.feature-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.feature-content h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.feature-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}
</style>
